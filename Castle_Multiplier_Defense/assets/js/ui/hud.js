(function (root) {
  "use strict";
  var cg = (root.CastleGame = root.CastleGame || {});
  var Hud = (cg.Hud = {});
  var nodes = {};
  Hud.init = function () {
    [
      "enemy-level-label",
      "enemy-hp-bar",
      "enemy-hp-value",
      "enemy-max-hp-value",
      "player-hp-bar",
      "player-hp-value",
      "player-max-hp-value",
      "hud-level",
      "hud-turn",
      "hud-weather",
      "hud-combo",
      "shots-fired",
      "max-multiplier",
      "skill-status",
      "skill-button",
      "fire-button",
      "combo-pop",
    ].forEach(function (id) {
      nodes[id] = document.getElementById(id);
    });
  };
  function setBar(node, value, max) {
    if (node)
      node.style.transform =
        "scaleX(" + cg.Utils.clamp(max ? value / max : 0, 0, 1) + ")";
  }
  Hud.refresh = function () {
    var battle = cg.Battle;
    if (!battle || !battle.active || !battle.player || !battle.enemy) return;
    var player = battle.player;
    var enemy = battle.enemy;
    nodes["enemy-hp-value"].textContent = cg.Utils.formatNumber(enemy.hp);
    nodes["enemy-max-hp-value"].textContent = cg.Utils.formatNumber(
      enemy.maxHp,
    );
    nodes["player-hp-value"].textContent = cg.Utils.formatNumber(player.hp);
    nodes["player-max-hp-value"].textContent = cg.Utils.formatNumber(
      player.maxHp,
    );
    setBar(nodes["enemy-hp-bar"], enemy.hp, enemy.maxHp);
    setBar(nodes["player-hp-bar"], player.hp, player.maxHp);
    nodes["hud-level"].textContent = cg.I18n.t("game.level", {
      level: battle.levelNumber,
    });
    nodes["hud-turn"].textContent = cg.I18n.t(
      battle.turn === "player" ? "game.playerTurn" : "game.enemyTurn",
      { turn: battle.turnNumber },
    );
    nodes["enemy-level-label"].textContent = "LV " + battle.levelNumber;
    nodes["hud-combo"].textContent = cg.I18n.t("game.combo", {
      count: battle.stats.combo,
    });
    nodes["shots-fired"].textContent = cg.Utils.formatNumber(
      battle.stats.shots,
    );
    nodes["max-multiplier"].textContent =
      "x" + cg.Utils.formatNumber(battle.stats.maxMultiplier);
    var weatherKey =
      "weather." + ((battle.levelData && battle.levelData.weather) || "clear");
    nodes["hud-weather"].innerHTML =
      "☀ <span>" + cg.I18n.t(weatherKey) + "</span>";
    var playerTurnReady = battle.turn === "player" && !battle.volleyActive;
    var skillReady = playerTurnReady && battle.skillCooldown <= 0;
    nodes["fire-button"].disabled = !playerTurnReady;
    nodes["skill-button"].disabled = !skillReady;
    nodes["skill-button"].classList.toggle("is-cooling", !skillReady);
    nodes["skill-status"].textContent = skillReady
      ? cg.I18n.t("game.ready")
      : cg.I18n.t("game.cooling", { seconds: Math.ceil(battle.skillCooldown) });
  };
  Hud.refreshStatic = function () {
    if (!nodes["hud-level"]) Hud.init();
  };
  Hud.setAim = function () {
    /* aim feedback is painted directly on Canvas */
  };
  Hud.showCombo = function (count, multiplier) {
    if (!nodes["combo-pop"]) return;
    nodes["combo-pop"].textContent =
      cg.I18n.t("game.combo", { count: count }) +
      "  ·  x" +
      cg.Utils.formatNumber(multiplier);
    nodes["combo-pop"].classList.remove("is-visible");
    void nodes["combo-pop"].offsetWidth;
    nodes["combo-pop"].classList.add("is-visible");
  };
})(window);
