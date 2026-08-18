(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var api = null;
  var unitContainer = null;

  function init(controller) {
    api = controller;
    unitContainer = document.getElementById("unit-cards");
    document.getElementById("battle-pause-button").addEventListener("click", api.pauseBattle);
    document.getElementById("summon-handle").addEventListener("click", togglePanel);
    app.events.on("i18n:change", function () {
      if (api.getSession()) {
        renderCards();
      }
    });
    renderCards();
  }

  function togglePanel() {
    var panel = document.getElementById("summon-panel");
    var collapsed = panel.classList.toggle("is-collapsed");
    document.getElementById("summon-handle").setAttribute("aria-expanded", String(!collapsed));
  }

  function openPanel() {
    var panel = document.getElementById("summon-panel");
    panel.classList.remove("is-collapsed");
    document.getElementById("summon-handle").setAttribute("aria-expanded", "true");
  }

  function renderCards() {
    if (!unitContainer) {
      return;
    }
    unitContainer.innerHTML = "";
    global.UNIT_ORDER.forEach(function (id) {
      var unit = global.UNITS_DATA[id];
      var button = document.createElement("button");
      button.type = "button";
      button.className = "unit-card";
      button.setAttribute("data-unit-id", id);
      button.style.setProperty("--unit-color", unit.color);
      button.innerHTML = '<span class="unit-card-icon">' + unit.icon + '</span><strong class="unit-card-name">' + app.t(unit.nameKey) + '</strong><span class="unit-card-meta"><span class="unit-card-cost">⚡ ' + unit.cost + '</span> · ' + app.t(unit.roleKey) + '</span><span class="unit-card-cooldown"></span>';
      button.addEventListener("click", function () {
        var result = api.summon(id);
        if (result && result.ok) {
          announce("battle_spawned");
        }
      });
      unitContainer.appendChild(button);
    });
  }

  function update(session) {
    if (!session) {
      return;
    }
    var playerBase = session.playerBase;
    var enemyBase = session.enemyBase;
    document.getElementById("player-hp-bar").style.width = app.utils.percent(playerBase.hp, playerBase.maxHp) + "%";
    document.getElementById("enemy-hp-bar").style.width = app.utils.percent(enemyBase.hp, enemyBase.maxHp) + "%";
    document.getElementById("player-hp-text").textContent = app.utils.formatNumber(playerBase.hp) + " / " + app.utils.formatNumber(playerBase.maxHp);
    document.getElementById("enemy-hp-text").textContent = app.utils.formatNumber(enemyBase.hp) + " / " + app.utils.formatNumber(enemyBase.maxHp);
    document.getElementById("player-energy").textContent = Math.floor(session.resource.player);
    document.getElementById("player-energy-max").textContent = session.resource.max;
    document.getElementById("player-energy-bar").style.height = app.utils.percent(session.resource.player, session.resource.max) + "%";
    document.getElementById("battle-time").textContent = app.utils.formatTime(session.timeRemaining);
    document.getElementById("battle-level-name").textContent = app.t(session.level.nameKey);
    unitContainer.querySelectorAll("[data-unit-id]").forEach(function (button) {
      var id = button.getAttribute("data-unit-id");
      var definition = global.UNITS_DATA[id];
      var cooldown = Number(session.cooldowns[id] || 0);
      var affordable = session.resource.player >= definition.cost;
      var ready = cooldown <= 0 && affordable && !session.result;
      button.disabled = !ready;
      button.classList.toggle("is-cooling", cooldown > 0);
      var cooldownLabel = button.querySelector(".unit-card-cooldown");
      cooldownLabel.textContent = cooldown > 0 ? cooldown.toFixed(1) + "s" : affordable ? "" : "⚡";
      button.title = cooldown > 0 ? app.t("battle_cooldown") : affordable ? app.t("battle_ready") : app.t("battle_insufficient");
    });
  }

  function announce(key) {
    var element = document.getElementById("battle-announcer");
    element.textContent = app.t(key);
    element.classList.remove("show");
    void element.offsetWidth;
    element.classList.add("show");
  }

  app.BattleHUD = { init: init, update: update, renderCards: renderCards, announce: announce, togglePanel: togglePanel, openPanel: openPanel };
})(window);
