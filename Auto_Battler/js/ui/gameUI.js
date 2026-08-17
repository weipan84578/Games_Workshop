(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var battleTimer = null;

  function replaceTokens(text, values) {
    return String(text).replace(/\{(\w+)\}/g, function (match, key) { return values[key] === undefined ? match : values[key]; });
  }

  function unitCard(instance, small, selected) {
    var display = app.UnitData.getDisplay(instance);
    var race = app.I18n.t("races." + display.race);
    var className = app.I18n.t("classes." + display.classId);
    var stars = "★".repeat(display.star);
    var experienceLabel = display.star >= app.UnitData.maxStar ? "MAX" : display.experience + "/" + display.experienceToNext;
    var experienceWidth = display.star >= app.UnitData.maxStar ? 100 : display.experienceRatio;
    return '<button type="button" draggable="true" class="' + (small ? "unit-card-mini" : "unit-card") + (selected ? " is-selected" : "") + '" style="--unit-color:' + display.color + '" data-action="select-unit" data-unit-id="' + instance.instanceId + '" title="' + display.ability + " ・ " + race + " / " + className + ' ・ EXP ' + experienceLabel + '"><span class="unit-portrait" aria-hidden="true">' + display.icon + '</span><span class="unit-name">' + display.name + '</span><span class="unit-stars">' + stars + '</span><span class="unit-xp-label">EXP ' + experienceLabel + '</span><span class="unit-xp-track" aria-hidden="true"><span class="unit-xp-fill" style="width:' + experienceWidth + '%"></span></span>' + (small ? "" : '<span class="unit-tags"><span class="tag">' + race + '</span><span class="tag">' + className + '</span></span>') + '</button>';
  }

  function eventText(event) {
    if (event.type === "attack") return replaceTokens(app.I18n.t("game.attackLog"), event);
    if (event.type === "skill") return replaceTokens(app.I18n.t("game.skillLog"), event);
    if (event.type === "defeat") return replaceTokens(app.I18n.t("game.defeatedLog"), event);
    if (event.type === "heal") return replaceTokens(app.I18n.t("game.healLog"), event);
    if (event.type === "shield") return replaceTokens(app.I18n.t("game.shieldLog"), event);
    return "✦";
  }

  function showToast(message, kind) {
    var rootElement = document.getElementById("toast-root");
    if (!rootElement || !message) return;
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.style.setProperty("--toast-color", kind === "danger" ? "var(--color-danger)" : kind === "success" ? "var(--color-success)" : "var(--color-primary)");
    toast.innerHTML = '<span aria-hidden="true">' + (kind === "danger" ? "⚠️" : kind === "success" ? "✅" : "✨") + '</span><span>' + message + "</span>";
    rootElement.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () { toast.remove(); }, 190);
    }, 2600);
  }

  function renderBoard(state) {
    var board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = state.board.map(function (unit, index) {
      return '<div class="board-cell ' + (unit ? "is-occupied" : "") + '" role="button" tabindex="0" data-action="board-slot" data-slot="' + index + '" aria-label="' + app.I18n.t("game.boardTile").replace("{number}", index + 1) + '"><span class="cell-number">' + (index + 1) + '</span>' + (unit ? unitCard(unit, true, state.selectedId === unit.instanceId) : '<span aria-hidden="true">＋</span>') + '</div>';
    }).join("");
  }

  function renderBench(state) {
    var list = document.getElementById("bench-list");
    if (!list) return;
    list.innerHTML = state.bench.length ? state.bench.map(function (unit) { return unitCard(unit, true, state.selectedId === unit.instanceId); }).join("") : '<span class="muted">—</span>';
    var count = document.getElementById("bench-count");
    if (count) count.textContent = state.bench.length + "/8";
  }

  function renderSynergies(state) {
    var list = document.getElementById("synergy-list");
    if (!list) return;
    var entries = app.SynergySystem.getActive(state);
    list.innerHTML = entries.map(function (entry) {
      var title = app.I18n.t("synergies." + entry.key + ".name");
      var next = entry.next ? entry.next.count : entry.active ? entry.active.count : 2;
      var bonus = entry.active ? app.I18n.t("synergies." + entry.key + ".bonus") : app.I18n.t("common.inactive");
      return '<div class="synergy-item ' + (entry.active ? "is-active" : "") + '"><div class="synergy-name-line"><span>' + title + '</span><span>' + entry.count + "/" + next + '</span></div><div class="synergy-progress-line"><span>' + bonus + '</span><span class="synergy-bonus">' + (entry.active ? "✓" : "·") + '</span></div></div>';
    }).join("");
    var activeCount = entries.filter(function (entry) { return entry.active; }).length;
    var countElement = document.getElementById("synergy-count");
    if (countElement) countElement.textContent = activeCount;
  }

  function renderStats(state) {
    ["gold", "health", "round", "level"].forEach(function (key) {
      var element = document.getElementById(key + "-value");
      if (element) element.textContent = key === "gold" ? app.Helpers.formatNumber(state[key], app.I18n.getLanguage()) : state[key];
    });
    var xp = document.getElementById("xp-value");
    var bar = document.getElementById("xp-bar");
    if (xp) xp.textContent = state.xp + " / " + state.xpToNext;
    if (bar) bar.style.width = Math.min(100, state.xp / state.xpToNext * 100) + "%";
  }

  function renderPhase(state) {
    var phase = state.mode === "battle" ? "battle" : state.mode === "gameover" ? "settle" : "prepare";
    var label = document.getElementById("phase-label");
    var timer = document.getElementById("phase-timer");
    var capacity = document.getElementById("board-capacity");
    if (capacity && app.BoardSystem) {
      capacity.textContent = replaceTokens(app.I18n.t("game.boardCapacity"), { current: app.BoardSystem.boardCount(state), max: app.BoardSystem.maxUnits(state) });
    }
    if (label) label.textContent = app.I18n.t("game.phase." + phase);
    if (timer) timer.textContent = phase === "prepare" ? Math.max(0, Number(state.phaseTime) || 0) + "s" : phase === "battle" ? "✦" : "—";
    var startButtons = document.querySelectorAll('[data-action="start-battle"]');
    startButtons.forEach(function (button) { button.disabled = state.mode !== "prepare"; });
    document.querySelectorAll('[data-action="buy-xp"]').forEach(function (button) {
      button.disabled = state.mode !== "prepare" || state.gold < 4;
    });
    document.querySelectorAll('[data-action="refresh-shop"], [data-action="toggle-lock"]').forEach(function (button) {
      button.disabled = state.mode !== "prepare";
    });
  }

  app.GameUI = {
    showToast: showToast,
    render: function () {
      var state = app.GameState.get();
      if (!state) return;
      renderStats(state);
      renderPhase(state);
      renderBoard(state);
      renderBench(state);
      renderSynergies(state);
      app.ShopUI.render(state);
      var tip = document.getElementById("game-tip");
      if (tip) {
        var tips = app.I18n.t("game.tips", []);
        tip.textContent = tips[(state.round - 1) % tips.length] || "✦";
      }
      var log = document.getElementById("battle-log-text");
      if (log && state.mode !== "battle") {
        log.textContent = state.lastResult ? (state.lastResult.winner === "player" ? app.I18n.t("game.battleVictory") : state.lastResult.winner === "enemy" ? app.I18n.t("game.battleDefeat") : app.I18n.t("game.battleDraw")) : app.I18n.t("game.readyHint");
      }
      var boardPanel = document.querySelector(".board-panel");
      if (boardPanel) boardPanel.classList.toggle("battle-active", state.mode === "battle");
      var hint = document.getElementById("board-selection-hint");
      if (hint) {
        if (state.selectedId) {
          var location = app.BoardSystem.findLocation(state, state.selectedId);
          var selectedDisplay = location ? app.UnitData.getDisplay(location.unit) : null;
          hint.hidden = !selectedDisplay;
          if (selectedDisplay) hint.textContent = replaceTokens(app.I18n.t("game.selectHint"), { name: selectedDisplay.name });
        } else hint.hidden = true;
      }
      app.I18n.apply(document.getElementById("game-screen"));
    },
    playBattle: function (result, done) {
      var state = app.GameState.get();
      var log = document.getElementById("battle-log-text");
      var effects = document.getElementById("battle-effects");
      var events = result.events.filter(function (event) { return event.type === "attack" || event.type === "skill" || event.type === "defeat"; }).slice(0, 34);
      var speed = (app.GameEngine.getSettings() || {}).battleSpeed || 1;
      var delay = app.Device.prefersReducedMotion() ? 22 : Math.max(42, 105 / speed);
      if (battleTimer) window.clearTimeout(battleTimer);
      var index = 0;
      if (log) log.textContent = app.I18n.t("game.battleStarting");
      function step() {
        if (index < events.length) {
          var event = events[index];
          if (log) log.textContent = eventText(event);
          if (effects && event.type === "attack") {
            var number = document.createElement("span");
            number.className = "damage-number";
            number.textContent = "-" + event.damage;
            number.style.left = (32 + (index * 17) % 48) + "%";
            number.style.top = (25 + (index * 13) % 38) + "%";
            effects.appendChild(number);
            window.setTimeout(function () { number.remove(); }, 930);
          } else if (effects && event.type === "skill") {
            var spark = document.createElement("span");
            spark.className = "battle-spark";
            spark.textContent = "✦";
            spark.style.left = (40 + (index * 23) % 35) + "%";
            spark.style.top = (22 + (index * 19) % 45) + "%";
            effects.appendChild(spark);
            window.setTimeout(function () { spark.remove(); }, 730);
          }
          index += 1;
          battleTimer = window.setTimeout(step, event.type === "defeat" ? Math.min(38, delay) : delay);
        } else {
          battleTimer = window.setTimeout(function () { if (typeof done === "function") done(); }, app.Device.prefersReducedMotion() ? 120 : 300);
        }
      }
      step();
    },
    showResult: function (result) {
      var isGameOver = result.gameOver;
      var won = result.winner === "player";
      var draw = result.winner === "draw";
      var title = app.I18n.t(isGameOver ? "game.gameOverTitle" : won ? "game.resultTitleWin" : draw ? "game.resultTitleDraw" : "game.resultTitleLose");
      var copy = app.I18n.t(isGameOver ? "game.gameOverCopy" : won ? "game.resultCopyWin" : draw ? "game.resultCopyDraw" : "game.resultCopyLose");
      copy = replaceTokens(copy, { round: Math.max(1, result.round || (app.GameState.get() || {}).round - 1) });
      var income = result.income ? replaceTokens(app.I18n.t("game.rewardLog"), { income: result.income.total, base: result.income.base, interest: result.income.interest }) : "";
      var damage = result.damage ? replaceTokens(app.I18n.t("game.resultDamage"), { damage: "-" + result.damage }) : app.I18n.t("game.resultDamage").replace("{damage}", "0");
      var eventSummary = (result.events || []).filter(function (event) { return event.type === "attack" || event.type === "skill" || event.type === "defeat"; }).slice(-7).map(eventText).map(function (line) { return "<div>✦ " + line + "</div>"; }).join("");
      var actionText = isGameOver ? app.I18n.t("game.backToMenu") : app.I18n.t("game.resultContinue");
      var action = isGameOver ? "go-menu" : "continue-round";
      var rootElement = document.getElementById("modal-root");
      rootElement.innerHTML = '<div class="modal-backdrop"><div class="modal-card result-modal" role="dialog" aria-modal="true"><div class="modal-icon">' + (isGameOver ? "🌙" : won ? "🏆" : draw ? "🤝" : "🌱") + '</div><h2>' + title + '</h2><p class="modal-copy">' + copy + '</p><p class="result-score">' + replaceTokens(app.I18n.t("game.survivors"), { player: result.playerSurvivors, enemy: result.enemySurvivors }) + '</p><p class="modal-copy">' + damage + "<br>" + income + '</p><div class="battle-event-list">' + eventSummary + '</div><div class="modal-actions"><button class="primary-button" type="button" data-action="' + action + '">' + actionText + '</button></div></div></div>';
    }
  };

  var toastItems = [];
  var nextToastId = 1;

  function getToastRoot() {
    var preferredId = document.body.classList.contains("in-game") ? "game-toast-root" : "toast-root";
    return document.getElementById(preferredId) || document.getElementById("toast-root");
  }

  function renderToastTray() {
    var rootElement = getToastRoot();
    if (!rootElement) return;
    var expanded = rootElement.classList.contains("is-expanded");
    rootElement.innerHTML = "";
    if (!toastItems.length) {
      rootElement.classList.remove("has-items", "is-expanded");
      return;
    }
    rootElement.classList.add("has-items");
    if (expanded) rootElement.classList.add("is-expanded");

    var summary = document.createElement("button");
    summary.type = "button";
    summary.className = "toast-summary";
    summary.setAttribute("data-action", "toggle-toasts");
    summary.setAttribute("aria-expanded", String(expanded));
    summary.innerHTML = '<span class="toast-summary-icon" aria-hidden="true">✦</span><span class="toast-summary-text"></span><span class="toast-count"></span>';
    summary.querySelector(".toast-summary-text").textContent = toastItems[0].message;
    summary.querySelector(".toast-count").textContent = toastItems.length > 1 ? "+" + (toastItems.length - 1) : "";

    var list = document.createElement("div");
    list.className = "toast-list";
    list.setAttribute("role", "status");
    toastItems.forEach(function (item) {
      var entry = document.createElement("div");
      entry.className = "toast-item";
      entry.setAttribute("data-kind", item.kind);
      entry.textContent = item.message;
      list.appendChild(entry);
    });
    rootElement.appendChild(summary);
    rootElement.appendChild(list);
  }

  app.GameUI.showToast = function (message, kind) {
    var rootElement = getToastRoot();
    if (!rootElement || !message) return;
    var item = { id: nextToastId++, message: String(message), kind: kind || "info" };
    toastItems.unshift(item);
    toastItems = toastItems.slice(0, 5);
    renderToastTray();
    window.setTimeout(function () {
      toastItems = toastItems.filter(function (entry) { return entry.id !== item.id; });
      renderToastTray();
    }, 3200);
  };

  app.GameUI.toggleToasts = function () {
    var rootElement = getToastRoot();
    if (!rootElement || !toastItems.length) return;
    var expanded = rootElement.classList.toggle("is-expanded");
    var summary = rootElement.querySelector(".toast-summary");
    if (summary) summary.setAttribute("aria-expanded", String(expanded));
  };
}(window));
