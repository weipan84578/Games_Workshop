(function () {
  "use strict";

  var settings;
  var game = null;
  var boardHost = null;
  var aimPoint = { x: 0, y: 0 };
  var isAiming = false;
  var chargeStart = 0;
  var chargeValue = 0.75;
  var chargeFrame = null;
  var activeTab = "throw";
  var toastTimer = null;
  var throwLocked = false;
  var aiTimer = null;

  var AI_AIM_SPREAD = {
    easy: 0.2,
    normal: 0.1,
    hard: 0.045
  };

  var AI_POWER_ERROR = {
    easy: 0.28,
    normal: 0.14,
    hard: 0.055
  };

  var AI_LANDING_SPREAD = {
    easy: 0.09,
    normal: 0.045,
    hard: 0.018
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function t(key, vars) {
    return window.Darts.I18n.t(key, vars);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatMode(mode) {
    if (mode === "cricket") {
      return "Cricket";
    }
    if (mode === "around") {
      return "Around the Clock";
    }
    return String(mode || "501");
  }

  function difficultyLabel(value) {
    return t("difficulty." + (value || "normal"));
  }

  function currentScreen() {
    return qs("#app").getAttribute("data-scene");
  }

  function isGameActive() {
    return currentScreen() === "game";
  }

  function currentPlayer() {
    if (!game || !game.players) {
      return null;
    }
    return game.players[game.currentPlayer] || null;
  }

  function isHumanTurn() {
    var player = currentPlayer();
    return Boolean(player && !player.isAi);
  }

  function clearAiTimer() {
    if (aiTimer) {
      window.clearTimeout(aiTimer);
      aiTimer = null;
    }
  }

  function showToast(message) {
    var toast = qs("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function applyTheme() {
    document.body.classList.remove("theme-classic", "theme-neon", "theme-sakura", "theme-dark");
    document.body.classList.add("theme-" + settings.theme);
  }

  function persistSettings(patch, silent) {
    settings = window.Darts.Storage.saveSettings(patch || {});
    applyTheme();
    window.Darts.I18n.setLanguage(settings.language);
    window.Darts.Audio.applySettings(settings);
    syncSettingsControls();
    syncSetupControls();
    updateMenuState();
    renderInstructions(activeTab);
    if (!silent) {
      showToast(t("settings.saved"));
    }
  }

  function showScreen(name) {
    if (name === "game" && !game) {
      showToast(t("toast.noGame"));
      name = "menu";
    }
    if (name !== "game") {
      clearAiTimer();
    }
    qsa(".screen").forEach(function (screen) {
      screen.classList.remove("is-active");
    });
    var screen = qs("#" + name + "Screen");
    if (screen) {
      screen.classList.add("is-active");
    }
    qs("#app").setAttribute("data-scene", name);
    if (name === "game") {
      renderGame();
      window.Darts.Audio.startBgm("game");
      window.setTimeout(function () {
        boardHost.focus();
      }, 0);
      scheduleAiIfNeeded();
    } else if (name === "result") {
      window.Darts.Audio.startBgm("result");
    } else {
      updateMenuState();
      syncSetupControls();
      window.Darts.Audio.startBgm("menu");
    }
  }

  function saveCurrentGame() {
    if (!game) {
      return;
    }
    window.Darts.Storage.saveGame(game);
    qs("#saveStatePill").textContent = t("game.saved");
  }

  function startConfiguredGame() {
    var activeModeButton = qs(".setup-mode-grid .segmented-option.is-active");
    var mode = activeModeButton ? activeModeButton.getAttribute("data-mode-choice") : settings.mode;
    var aiCount = Number(qs("#setupAiCount").value);
    var aiDifficulty = qs("#setupAiDifficulty").value;
    var startScore = mode === "301" ? 301 : 501;
    persistSettings({
      mode: mode,
      aiCount: aiCount,
      aiDifficulty: aiDifficulty,
      startScore: startScore
    }, true);
    game = window.Darts.Scoring.newGame(settings);
    saveCurrentGame();
    showScreen("game");
  }

  function hydrateLoadedGame(save) {
    save.history = save.history || [];
    save.markers = save.markers || [];
    save.turnThrows = save.turnThrows || [];
    save.log = save.log || [];
    save.aiCount = Math.max(0, (save.players || []).length - 1);
    save.aiDifficulty = save.aiDifficulty || settings.aiDifficulty || "normal";
    (save.players || []).forEach(function (player, index) {
      if (typeof player.isAi === "undefined") {
        player.isAi = index > 0;
      }
      if (!player.difficulty) {
        player.difficulty = player.isAi ? save.aiDifficulty : "human";
      }
      if (!player.name) {
        player.name = index === 0 ? t("player.human") : t("ai.name", { number: index });
      }
    });
    return save;
  }

  function continueGame() {
    var save = window.Darts.Storage.getSave();
    if (!save || save.winnerIndex !== null) {
      showToast(t("menu.noSave"));
      return;
    }
    game = hydrateLoadedGame(save);
    showScreen("game");
  }

  function updateMenuState() {
    var save = window.Darts.Storage.getSave();
    var hasActiveSave = Boolean(save && save.winnerIndex === null);
    qs("#continueGameBtn").disabled = !hasActiveSave;
    if (hasActiveSave) {
      var player = save.players[save.currentPlayer] || save.players[0];
      qs("#saveSummary").textContent = t("menu.saveSummary", {
        mode: formatMode(save.mode),
        players: save.players.length,
        player: player.name
      });
    } else {
      qs("#saveSummary").textContent = t("menu.noSave");
    }
  }

  function syncSetupControls() {
    qsa(".setup-mode-grid [data-mode-choice]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-mode-choice") === settings.mode);
    });
    var aiCount = qs("#setupAiCount");
    var aiDifficulty = qs("#setupAiDifficulty");
    if (aiCount) {
      aiCount.value = String(settings.aiCount);
    }
    if (aiDifficulty) {
      aiDifficulty.value = settings.aiDifficulty;
    }
    var summary = qs("#setupSummary");
    if (summary) {
      summary.textContent = t("setup.summary", {
        aiCount: settings.aiCount,
        difficulty: difficultyLabel(settings.aiDifficulty)
      });
    }
  }

  function syncSettingsControls() {
    qs("#bgmEnabled").checked = settings.bgmEnabled;
    qs("#sfxEnabled").checked = settings.sfxEnabled;
    qs("#bgmVolume").value = settings.bgmVolume;
    qs("#sfxVolume").value = settings.sfxVolume;
    qs("#languageSelect").value = settings.language;
    qs("#themeSelect").value = settings.theme;
  }

  function bindNavigation() {
    qsa("[data-open-screen]").forEach(function (button) {
      button.addEventListener("click", function () {
        showScreen(button.getAttribute("data-open-screen"));
      });
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest("button")) {
        window.Darts.Audio.init(settings);
        window.Darts.Audio.play("click");
      }
    });

    qsa(".setup-mode-grid [data-mode-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var mode = button.getAttribute("data-mode-choice");
        persistSettings({
          mode: mode,
          startScore: mode === "301" ? 301 : 501
        }, true);
      });
    });

    qs("#setupAiCount").addEventListener("change", function (event) {
      persistSettings({ aiCount: Number(event.target.value) }, true);
    });
    qs("#setupAiDifficulty").addEventListener("change", function (event) {
      persistSettings({ aiDifficulty: event.target.value }, true);
    });
    qs("#startGameBtn").addEventListener("click", function () {
      showScreen("setup");
    });
    qs("#confirmStartGameBtn").addEventListener("click", startConfiguredGame);
    qs("#continueGameBtn").addEventListener("click", continueGame);
    qs("#muteToggleBtn").addEventListener("click", function () {
      persistSettings({ bgmEnabled: !settings.bgmEnabled, sfxEnabled: !settings.sfxEnabled });
    });
    qs("#resultNewGameBtn").addEventListener("click", function () {
      game = null;
      showScreen("setup");
    });
  }

  function bindSettings() {
    var mapping = [
      ["#bgmEnabled", "bgmEnabled", "checked"],
      ["#sfxEnabled", "sfxEnabled", "checked"],
      ["#bgmVolume", "bgmVolume", "number"],
      ["#sfxVolume", "sfxVolume", "number"],
      ["#languageSelect", "language", "value"],
      ["#themeSelect", "theme", "value"]
    ];
    mapping.forEach(function (entry) {
      var node = qs(entry[0]);
      node.addEventListener("change", function () {
        var value = entry[2] === "checked" ? node.checked : entry[2] === "number" ? Number(node.value) : node.value;
        var patch = {};
        patch[entry[1]] = value;
        persistSettings(patch);
      });
    });

    qs("#clearSaveBtn").addEventListener("click", function () {
      window.Darts.Storage.clearSave();
      if (game && game.winnerIndex === null) {
        game = null;
      }
      updateMenuState();
      showToast(t("toast.saveCleared"));
    });
  }

  function bindInstructions() {
    qsa("[data-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        renderInstructions(button.getAttribute("data-tab"));
      });
    });
  }

  function instructionVisual(tab) {
    var common = "viewBox=\"0 0 220 150\" role=\"img\" aria-hidden=\"true\"";
    if (tab === "board") {
      return "<svg class=\"instruction-visual\" " + common + "><circle cx=\"110\" cy=\"75\" r=\"60\" fill=\"#222\"/><circle cx=\"110\" cy=\"75\" r=\"52\" fill=\"none\" stroke=\"#d63645\" stroke-width=\"10\"/><circle cx=\"110\" cy=\"75\" r=\"34\" fill=\"none\" stroke=\"#2aa567\" stroke-width=\"8\"/><circle cx=\"110\" cy=\"75\" r=\"10\" fill=\"#2aa567\"/><circle cx=\"110\" cy=\"75\" r=\"5\" fill=\"#d63645\"/><text x=\"110\" y=\"22\" text-anchor=\"middle\">20</text><text x=\"169\" y=\"80\" text-anchor=\"middle\">6</text><text x=\"110\" y=\"137\" text-anchor=\"middle\">3</text></svg>";
    }
    if (tab === "rules") {
      return "<svg class=\"instruction-visual\" " + common + "><rect x=\"28\" y=\"24\" width=\"164\" height=\"102\" rx=\"8\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/><text x=\"58\" y=\"62\">501</text><path d=\"M92 57 H162\" stroke=\"var(--accent)\" stroke-width=\"8\" stroke-linecap=\"round\"/><text x=\"58\" y=\"98\">Bust</text><path d=\"M102 93 H150\" stroke=\"var(--accent-2)\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M151 84 l16 9 -16 9\" fill=\"none\" stroke=\"var(--accent-2)\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>";
    }
    if (tab === "modes") {
      return "<svg class=\"instruction-visual\" " + common + "><rect x=\"28\" y=\"28\" width=\"72\" height=\"38\" rx=\"8\" fill=\"var(--accent)\"/><rect x=\"120\" y=\"28\" width=\"72\" height=\"38\" rx=\"8\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/><rect x=\"28\" y=\"86\" width=\"72\" height=\"38\" rx=\"8\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/><rect x=\"120\" y=\"86\" width=\"72\" height=\"38\" rx=\"8\" fill=\"var(--accent-2)\"/><text x=\"64\" y=\"53\" text-anchor=\"middle\" fill=\"var(--on-accent)\">501</text><text x=\"156\" y=\"53\" text-anchor=\"middle\">301</text><text x=\"64\" y=\"111\" text-anchor=\"middle\">CRI</text><text x=\"156\" y=\"111\" text-anchor=\"middle\" fill=\"var(--on-accent)\">CLK</text></svg>";
    }
    if (tab === "access") {
      return "<svg class=\"instruction-visual\" " + common + "><rect x=\"38\" y=\"24\" width=\"62\" height=\"102\" rx=\"12\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/><circle cx=\"69\" cy=\"102\" r=\"7\" fill=\"var(--accent)\"/><path d=\"M128 36 h44 a8 8 0 0 1 8 8 v62 a8 8 0 0 1 -8 8 h-44 a8 8 0 0 1 -8 -8 V44 a8 8 0 0 1 8 -8 Z\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/><path d=\"M133 62 h34 M133 82 h44 M133 102 h24\" stroke=\"var(--accent)\" stroke-width=\"6\" stroke-linecap=\"round\"/></svg>";
    }
    return "<svg class=\"instruction-visual\" " + common + "><path d=\"M34 116 C70 30 136 18 184 54\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M178 46 l24 16 -27 10\" fill=\"var(--accent)\"/><circle cx=\"162\" cy=\"58\" r=\"34\" fill=\"none\" stroke=\"var(--accent-2)\" stroke-width=\"8\"/><circle cx=\"162\" cy=\"58\" r=\"8\" fill=\"var(--accent)\"/><rect x=\"32\" y=\"118\" width=\"98\" height=\"10\" rx=\"5\" fill=\"var(--control-bg)\" stroke=\"var(--control-border)\"/></svg>";
  }

  function renderInstructions(tab) {
    activeTab = tab || activeTab;
    qsa("[data-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tab") === activeTab);
    });
    var titleKeys = {
      throw: "instructions.throwTitle",
      board: "instructions.boardTitle",
      rules: "instructions.rulesTitle",
      modes: "instructions.modesTitle",
      access: "instructions.accessTitle"
    };
    var leadKeys = {
      throw: "instructions.throwLead",
      board: "instructions.boardLead",
      rules: "instructions.rulesLead",
      modes: "instructions.modesLead",
      access: "instructions.accessLead"
    };
    var pointPrefix = {
      throw: "instructions.throwPoint",
      board: "instructions.boardPoint",
      rules: "instructions.rulesPoint",
      modes: "instructions.modesPoint",
      access: "instructions.accessPoint"
    }[activeTab] || "instructions.throwPoint";
    var points = [1, 2, 3, 4].map(function (index) {
      return "<li>" + escapeHtml(t(pointPrefix + index)) + "</li>";
    }).join("");
    qs("#instructionsContent").innerHTML =
      "<div class=\"instruction-detail\">" +
      instructionVisual(activeTab) +
      "<div><h2>" + escapeHtml(t(titleKeys[activeTab] || "instructions.throwTitle")) + "</h2>" +
      "<p>" + escapeHtml(t(leadKeys[activeTab] || "instructions.throwLead")) + "</p>" +
      "<ul>" + points + "</ul></div></div>";
  }

  function bindGameplay() {
    boardHost.addEventListener("pointerdown", startAim);
    boardHost.addEventListener("pointermove", moveAim);
    boardHost.addEventListener("pointerup", releaseAim);
    boardHost.addEventListener("pointercancel", cancelAim);
    boardHost.addEventListener("keydown", handleBoardKeydown);

    qs("#endTurnBtn").addEventListener("click", function () {
      if (!game || game.winnerIndex !== null || throwLocked || !isHumanTurn()) {
        return;
      }
      game = window.Darts.Scoring.endTurn(game);
      saveCurrentGame();
      renderGame();
      scheduleAiIfNeeded();
    });

    qs("#undoBtn").addEventListener("click", function () {
      if (!game || throwLocked) {
        return;
      }
      game = window.Darts.Scoring.undo(game);
      saveCurrentGame();
      renderGame();
      scheduleAiIfNeeded();
    });
  }

  function startAim(event) {
    if (!game || game.winnerIndex !== null || throwLocked || !isHumanTurn()) {
      return;
    }
    event.preventDefault();
    window.Darts.Audio.init(settings);
    boardHost.setPointerCapture(event.pointerId);
    isAiming = true;
    aimPoint = window.Darts.Dartboard.normalizedFromClient(boardHost, event.clientX, event.clientY);
    aimPoint = window.Darts.Dartboard.clampPoint(aimPoint);
    window.Darts.Dartboard.setReticle(boardHost, aimPoint);
    chargeStart = performance.now();
    updateCharge();
  }

  function moveAim(event) {
    if (!isAiming) {
      return;
    }
    aimPoint = window.Darts.Dartboard.normalizedFromClient(boardHost, event.clientX, event.clientY);
    aimPoint = window.Darts.Dartboard.clampPoint(aimPoint);
    window.Darts.Dartboard.setReticle(boardHost, aimPoint);
  }

  function releaseAim(event) {
    if (!isAiming) {
      return;
    }
    event.preventDefault();
    cancelAim();
    throwAt(aimPoint, chargeValue, { source: "human" });
  }

  function cancelAim() {
    isAiming = false;
    if (chargeFrame) {
      window.cancelAnimationFrame(chargeFrame);
      chargeFrame = null;
    }
  }

  function updateCharge() {
    var elapsed = performance.now() - chargeStart;
    chargeValue = 0.5 - Math.cos((elapsed % 1000) / 1000 * Math.PI * 2) * 0.5;
    qs("#throwPowerBar").style.width = Math.round(chargeValue * 100) + "%";
    if (isAiming) {
      chargeFrame = window.requestAnimationFrame(updateCharge);
    }
  }

  function randomOffset(radius) {
    var angle = Math.random() * Math.PI * 2;
    var distance = radius * (0.35 + Math.random() * 0.65);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  }

  function computeLandingPoint(targetPoint, power, actor) {
    var idealPower = 0.72;
    var releaseError = Math.abs((Number(power) || idealPower) - idealPower);
    var baseSpread = actor && actor.isAi ? AI_LANDING_SPREAD[actor.difficulty] || AI_LANDING_SPREAD.normal : 0.022;
    var powerSpread = actor && actor.isAi ? releaseError * 0.08 : releaseError * 0.22;
    var wobble = baseSpread + powerSpread + Math.random() * baseSpread;
    var offset = randomOffset(wobble);
    return window.Darts.Dartboard.clampPoint({
      x: targetPoint.x + offset.x,
      y: targetPoint.y + offset.y
    });
  }

  function animateDart(targetPoint, landingPoint, color, done) {
    var from = {
      x: targetPoint.x * 0.22,
      y: 1.14
    };
    var control = {
      x: (from.x + landingPoint.x) / 2 + (Math.random() - 0.5) * 0.14,
      y: Math.min(from.y, landingPoint.y) - 0.48 - Math.random() * 0.12
    };
    var start = performance.now();
    var duration = 430;

    function tick(now) {
      var progress = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      window.Darts.Dartboard.renderFlight(boardHost, from, control, landingPoint, eased, color);
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(function () {
          window.Darts.Dartboard.clearFlight(boardHost);
          done();
        }, 40);
      }
    }

    window.requestAnimationFrame(tick);
  }

  function throwAt(targetPoint, power, options) {
    if (!game || game.winnerIndex !== null || throwLocked) {
      if (!game) {
        showToast(t("toast.noGame"));
      }
      return;
    }
    var actor = currentPlayer();
    if (!actor) {
      return;
    }
    throwLocked = true;
    clearAiTimer();
    renderGame();
    window.Darts.Audio.play("throw");
    var landingPoint = computeLandingPoint(targetPoint, power, actor);
    var hit = window.Darts.Dartboard.hitFromNormalized(landingPoint);
    window.Darts.Dartboard.setReticle(boardHost, targetPoint);
    animateDart(targetPoint, landingPoint, actor.color, function () {
      var result = window.Darts.Scoring.registerThrow(game, hit, landingPoint);
      throwLocked = false;
      renderGame();
      saveCurrentGame();
      handleThrowResult(result.result, hit);
      scheduleAiIfNeeded();
    });
  }

  function handleThrowResult(result, hit) {
    if (result === "win") {
      window.Darts.Audio.play("win");
      window.Darts.Storage.clearSave();
      window.setTimeout(showResult, 360);
      return;
    }
    if (result === "bust") {
      window.Darts.Audio.play("bust");
    } else if (hit.segment === "bull" || hit.segment === "outerBull") {
      window.Darts.Audio.play("bull");
    } else {
      window.Darts.Audio.play(hit.segment === "miss" ? "hover" : "hit");
    }
  }

  function handleBoardKeydown(event) {
    if (!isHumanTurn() || throwLocked) {
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveKeyboardAim(event.key.replace("Arrow", "").toLowerCase());
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      throwAt(aimPoint, 0.75, { source: "keyboard" });
    }
  }

  function moveKeyboardAim(direction) {
    var step = 0.045;
    var next = { x: aimPoint.x, y: aimPoint.y };
    if (direction === "up") {
      next.y -= step;
    } else if (direction === "down") {
      next.y += step;
    } else if (direction === "left") {
      next.x -= step;
    } else if (direction === "right") {
      next.x += step;
    }
    aimPoint = window.Darts.Dartboard.clampPoint(next);
    window.Darts.Dartboard.setReticle(boardHost, aimPoint);
  }

  function targetForX01(player) {
    var score = player.score;
    if (score === 50) {
      return { segment: "bull", value: 25 };
    }
    if (score > 1 && score <= 40 && score % 2 === 0) {
      return { segment: "double", value: score / 2 };
    }
    if (score <= 60 && score % 2 === 1) {
      return { segment: "single", value: 1 };
    }
    if (score <= 80 && score % 2 === 0) {
      return { segment: "single", value: Math.min(20, score - 40) || 20 };
    }
    return { segment: "triple", value: 20 };
  }

  function targetForCricket(player) {
    var targets = window.Darts.Scoring.CRICKET_TARGETS;
    for (var index = 0; index < targets.length; index += 1) {
      var target = targets[index];
      if ((player.marks[target] || 0) < 3) {
        return target === 25 ? { segment: "bull", value: 25 } : { segment: "triple", value: target };
      }
    }
    return { segment: "triple", value: 20 };
  }

  function targetForAround(player) {
    var target = window.Darts.Scoring.AROUND_TARGETS[player.aroundIndex] || 25;
    return target === 25 ? { segment: "bull", value: 25 } : { segment: "single", value: target };
  }

  function chooseAiThrow() {
    var player = currentPlayer();
    var target;
    if (game.mode === "cricket") {
      target = targetForCricket(player);
    } else if (game.mode === "around") {
      target = targetForAround(player);
    } else {
      target = targetForX01(player);
    }
    var basePoint = window.Darts.Dartboard.pointForTarget(target.segment, target.value);
    var spread = AI_AIM_SPREAD[player.difficulty] || AI_AIM_SPREAD.normal;
    var offset = randomOffset(spread);
    var aim = window.Darts.Dartboard.clampPoint({
      x: basePoint.x + offset.x,
      y: basePoint.y + offset.y
    });
    var powerError = AI_POWER_ERROR[player.difficulty] || AI_POWER_ERROR.normal;
    return {
      point: aim,
      power: Math.max(0, Math.min(1, 0.72 + (Math.random() - 0.5) * powerError))
    };
  }

  function scheduleAiIfNeeded() {
    clearAiTimer();
    var player = currentPlayer();
    if (!game || !isGameActive() || !player || !player.isAi || game.winnerIndex !== null || throwLocked) {
      return;
    }
    qs("#currentPlayerName").textContent = t("game.aiThinking", { player: player.name });
    aiTimer = window.setTimeout(function () {
      if (!game || !isGameActive() || !currentPlayer() || !currentPlayer().isAi || throwLocked) {
        return;
      }
      var aiThrow = chooseAiThrow();
      throwAt(aiThrow.point, aiThrow.power, { source: "ai" });
    }, 620);
  }

  function renderGame() {
    if (!game) {
      return;
    }
    var player = currentPlayer() || game.players[0];
    qs("#gameModeLabel").textContent = formatMode(game.mode);
    qs("#currentPlayerName").textContent = player.name;
    qs("#dartsRemaining").textContent = String(game.dartsRemaining);
    qs("#undoBtn").disabled = throwLocked || !game.history || !game.history.length;
    qs("#endTurnBtn").disabled = throwLocked || !isHumanTurn();
    boardHost.classList.toggle("is-ai-turn", Boolean(player && player.isAi));
    renderThrows();
    renderScoreboard();
    renderLog();
    window.Darts.Dartboard.renderMarkers(boardHost, game.markers);
  }

  function renderThrows() {
    var html = "";
    (game.turnThrows || []).forEach(function (throwInfo) {
      html += "<div class=\"throw-chip\"><span>" + escapeHtml(throwInfo.label) + "</span><strong>" + escapeHtml(throwInfo.score) + "</strong></div>";
    });
    for (var i = (game.turnThrows || []).length; i < 3; i += 1) {
      html += "<div class=\"throw-chip\"><span>•</span><strong>-</strong></div>";
    }
    qs("#turnThrows").innerHTML = html;
  }

  function renderScoreboard() {
    if (game.mode === "cricket") {
      renderCricketScoreboard();
      return;
    }
    var html = game.players.map(function (player, index) {
      var sub = "";
      if (game.mode === "around") {
        sub = t("game.nextTarget") + ": " + window.Darts.Scoring.nextAroundLabel(player);
      } else {
        sub = player.score === 0 ? t("game.win", { player: player.name }) : t("game.needDouble");
      }
      return "<div class=\"player-score-row " + (index === game.currentPlayer ? "is-current" : "") + "\">" +
        "<div><strong>" + escapeHtml(player.name) + "</strong><p class=\"eyebrow\">" + escapeHtml(sub) + "</p></div>" +
        "<div class=\"player-score\">" + escapeHtml(game.mode === "around" ? player.aroundIndex + "/" + window.Darts.Scoring.AROUND_TARGETS.length : player.score) + "</div>" +
        "</div>";
    }).join("");
    qs("#scoreboard").innerHTML = html;
  }

  function cricketMarks(value) {
    if (value <= 0) {
      return "";
    }
    if (value === 1) {
      return "/";
    }
    if (value === 2) {
      return "X";
    }
    return "●";
  }

  function renderCricketScoreboard() {
    var targets = window.Darts.Scoring.CRICKET_TARGETS;
    var header = "<tr><th></th>" + targets.map(function (target) {
      return "<th>" + (target === 25 ? "B" : target) + "</th>";
    }).join("") + "<th>" + t("game.points") + "</th></tr>";
    var rows = game.players.map(function (player, index) {
      var cells = targets.map(function (target) {
        return "<td class=\"cricket-mark\">" + cricketMarks(Math.min(3, player.marks[target])) + "</td>";
      }).join("");
      return "<tr class=\"" + (index === game.currentPlayer ? "is-current" : "") + "\"><th>" + escapeHtml(player.name) + "</th>" + cells + "<td>" + player.score + "</td></tr>";
    }).join("");
    qs("#scoreboard").innerHTML = "<table class=\"cricket-table\">" + header + rows + "</table>";
  }

  function renderLog() {
    qs("#gameLog").innerHTML = (game.log || []).slice(0, 24).map(function (entry) {
      return "<li><span>" + escapeHtml(entry) + "</span></li>";
    }).join("");
  }

  function showResult() {
    if (!game || game.winnerIndex === null) {
      return;
    }
    var winner = game.players[game.winnerIndex];
    qs("#winnerText").textContent = winner.name;
    qs("#resultSummary").innerHTML = game.players.map(function (player) {
      var score = game.mode === "around" ? player.aroundIndex + "/" + window.Darts.Scoring.AROUND_TARGETS.length : player.score;
      return "<div class=\"throw-chip\"><span>" + escapeHtml(player.name) + "</span><strong>" + escapeHtml(score) + "</strong></div>";
    }).join("");
    showScreen("result");
  }

  function init() {
    settings = window.Darts.Storage.getSettings();
    window.Darts.I18n.setLanguage(settings.language);
    applyTheme();
    boardHost = qs("#boardHost");
    window.Darts.Dartboard.render(boardHost);
    syncSettingsControls();
    syncSetupControls();
    bindNavigation();
    bindSettings();
    bindInstructions();
    bindGameplay();
    updateMenuState();
    renderInstructions("throw");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
