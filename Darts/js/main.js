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
    } else if (name === "result") {
      window.Darts.Audio.startBgm("result");
    } else {
      updateMenuState();
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

  function startNewGame() {
    var mode = qs(".segmented-option.is-active").getAttribute("data-mode-choice");
    var playerCount = Number(qs("#menuPlayerCount").value);
    var startScore = Number(qs("#menuStartScore").value);
    if (mode === "301") {
      startScore = 301;
    } else if (mode === "501") {
      startScore = 501;
    }
    persistSettings({ mode: mode, playerCount: playerCount, startScore: startScore }, true);
    game = window.Darts.Scoring.newGame(settings);
    saveCurrentGame();
    renderGame();
    showScreen("game");
  }

  function continueGame() {
    var save = window.Darts.Storage.getSave();
    if (!save || save.winnerIndex !== null) {
      showToast(t("menu.noSave"));
      return;
    }
    game = save;
    game.history = game.history || [];
    game.markers = game.markers || [];
    game.turnThrows = game.turnThrows || [];
    game.log = game.log || [];
    renderGame();
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

    qsa("[data-mode-choice]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-mode-choice") === settings.mode);
    });
    qs("#menuPlayerCount").value = String(settings.playerCount);
    qs("#menuStartScore").value = String(settings.mode === "301" ? 301 : settings.startScore);
    qs("#menuStartScore").disabled = settings.mode === "cricket" || settings.mode === "around";
  }

  function syncSettingsControls() {
    qs("#bgmEnabled").checked = settings.bgmEnabled;
    qs("#sfxEnabled").checked = settings.sfxEnabled;
    qs("#animationEnabled").checked = settings.animation;
    qs("#aimAssist").checked = settings.aimAssist;
    qs("#bgmVolume").value = settings.bgmVolume;
    qs("#sfxVolume").value = settings.sfxVolume;
    qs("#settingsMode").value = settings.mode;
    qs("#settingsPlayerCount").value = String(settings.playerCount);
    qs("#settingsStartScore").value = String(settings.startScore);
    qs("#languageSelect").value = settings.language;
    qs("#themeSelect").value = settings.theme;
    qs("#settingsStartScore").disabled = settings.mode === "cricket" || settings.mode === "around";
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

    qsa("[data-mode-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var mode = button.getAttribute("data-mode-choice");
        persistSettings({
          mode: mode,
          startScore: mode === "301" ? 301 : mode === "501" ? 501 : settings.startScore
        }, true);
      });
    });

    qs("#menuPlayerCount").addEventListener("change", function (event) {
      persistSettings({ playerCount: Number(event.target.value) }, true);
    });
    qs("#menuStartScore").addEventListener("change", function (event) {
      persistSettings({ startScore: Number(event.target.value), mode: Number(event.target.value) === 301 ? "301" : "501" }, true);
    });
    qs("#startGameBtn").addEventListener("click", startNewGame);
    qs("#continueGameBtn").addEventListener("click", continueGame);
    qs("#muteToggleBtn").addEventListener("click", function () {
      persistSettings({ bgmEnabled: !settings.bgmEnabled, sfxEnabled: !settings.sfxEnabled });
    });
    qs("#resultNewGameBtn").addEventListener("click", startNewGame);
  }

  function bindSettings() {
    var mapping = [
      ["#bgmEnabled", "bgmEnabled", "checked"],
      ["#sfxEnabled", "sfxEnabled", "checked"],
      ["#animationEnabled", "animation", "checked"],
      ["#aimAssist", "aimAssist", "checked"],
      ["#bgmVolume", "bgmVolume", "number"],
      ["#sfxVolume", "sfxVolume", "number"],
      ["#settingsMode", "mode", "value"],
      ["#settingsPlayerCount", "playerCount", "number"],
      ["#settingsStartScore", "startScore", "number"],
      ["#languageSelect", "language", "value"],
      ["#themeSelect", "theme", "value"]
    ];
    mapping.forEach(function (entry) {
      var node = qs(entry[0]);
      node.addEventListener("change", function () {
        var value = entry[2] === "checked" ? node.checked : entry[2] === "number" ? Number(node.value) : node.value;
        var patch = {};
        patch[entry[1]] = value;
        if (entry[1] === "mode" && value === "301") {
          patch.startScore = 301;
        }
        if (entry[1] === "startScore") {
          patch.mode = value === 301 ? "301" : "501";
        }
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

  function renderInstructions(tab) {
    activeTab = tab || activeTab;
    qsa("[data-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tab") === activeTab);
    });
    var keys = {
      throw: ["instructions.throwTitle", "instructions.throwBody"],
      board: ["instructions.boardTitle", "instructions.boardBody"],
      rules: ["instructions.rulesTitle", "instructions.rulesBody"],
      modes: ["instructions.modesTitle", "instructions.modesBody"],
      access: ["instructions.accessTitle", "instructions.accessBody"]
    }[activeTab] || ["instructions.throwTitle", "instructions.throwBody"];
    qs("#instructionsContent").innerHTML =
      "<h2>" + escapeHtml(t(keys[0])) + "</h2>" +
      "<ul><li>" + escapeHtml(t(keys[1])) + "</li></ul>";
  }

  function bindGameplay() {
    boardHost.addEventListener("pointerdown", startAim);
    boardHost.addEventListener("pointermove", moveAim);
    boardHost.addEventListener("pointerup", releaseAim);
    boardHost.addEventListener("pointercancel", cancelAim);
    boardHost.addEventListener("keydown", handleBoardKeydown);

    qsa("[data-aim-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        moveKeyboardAim(button.getAttribute("data-aim-step"));
      });
    });

    qs("#keyboardThrowBtn").addEventListener("click", function () {
      throwAt(aimPoint, 0.75);
    });

    qs("#endTurnBtn").addEventListener("click", function () {
      if (!game || game.winnerIndex !== null) {
        return;
      }
      game = window.Darts.Scoring.endTurn(game);
      saveCurrentGame();
      renderGame();
    });

    qs("#undoBtn").addEventListener("click", function () {
      if (!game) {
        return;
      }
      game = window.Darts.Scoring.undo(game);
      saveCurrentGame();
      renderGame();
    });
  }

  function startAim(event) {
    if (!game || game.winnerIndex !== null) {
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
    throwAt(aimPoint, chargeValue);
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

  function driftPoint(pointValue, power) {
    var ideal = 0.72;
    var distance = Math.abs(power - ideal);
    var drift = settings.aimAssist ? distance * 0.045 : distance * 0.16 + 0.018;
    if (drift <= 0.002) {
      return pointValue;
    }
    var angle = Math.random() * Math.PI * 2;
    return window.Darts.Dartboard.clampPoint({
      x: pointValue.x + Math.cos(angle) * drift,
      y: pointValue.y + Math.sin(angle) * drift
    });
  }

  function throwAt(pointValue, power) {
    if (!game || game.winnerIndex !== null) {
      showToast(t("toast.noGame"));
      return;
    }
    window.Darts.Audio.play("throw");
    var finalPoint = driftPoint(pointValue, power);
    var hit = window.Darts.Dartboard.hitFromNormalized(finalPoint);
    var result = window.Darts.Scoring.registerThrow(game, hit, finalPoint);
    window.Darts.Dartboard.setReticle(boardHost, finalPoint);
    renderGame();
    saveCurrentGame();

    if (result.result === "win") {
      window.Darts.Audio.play("win");
      window.Darts.Storage.clearSave();
      window.setTimeout(showResult, settings.animation ? 480 : 0);
      return;
    }
    if (result.result === "bust") {
      window.Darts.Audio.play("bust");
    } else if (hit.segment === "bull" || hit.segment === "outerBull") {
      window.Darts.Audio.play("bull");
    } else {
      window.Darts.Audio.play(hit.segment === "miss" ? "hover" : "hit");
    }
  }

  function handleBoardKeydown(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveKeyboardAim(event.key.replace("Arrow", "").toLowerCase());
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      throwAt(aimPoint, 0.75);
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

  function renderGame() {
    if (!game) {
      return;
    }
    var player = game.players[game.currentPlayer] || game.players[0];
    qs("#gameModeLabel").textContent = formatMode(game.mode);
    qs("#currentPlayerName").textContent = player.name;
    qs("#dartsRemaining").textContent = String(game.dartsRemaining);
    qs("#undoBtn").disabled = !game.history || !game.history.length;
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
    qs("#gameLog").innerHTML = (game.log || []).slice(0, 12).map(function (entry) {
      return "<li>" + escapeHtml(entry) + "</li>";
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
    bindNavigation();
    bindSettings();
    bindInstructions();
    bindGameplay();
    updateMenuState();
    renderInstructions("throw");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
