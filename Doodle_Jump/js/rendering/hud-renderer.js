(function (Game) {
  "use strict";
  var powerupKeys = {
    springUses: "game.powerSpring",
    rocket: "game.powerRocket",
    shield: "game.powerShield",
    magnet: "game.powerMagnet",
    slow: "game.powerSlow",
    lucky: "game.powerLucky",
  };
  function HudRenderer(root) {
    this.root = root;
    this.score = root.querySelector("#hud-score");
    this.height = root.querySelector("#hud-height");
    this.combo = root.querySelector("#hud-combo");
    this.powerups = root.querySelector("#hud-powerups");
    this.bestCombo = root.querySelector("#side-best-combo");
    this.collected = root.querySelector("#side-collected");
  }
  HudRenderer.prototype.update = function (state) {
    if (!state) return;
    var score = state.score;
    this.score.textContent = Game.I18n.number(score.total);
    this.height.textContent = Game.I18n.number(score.maxHeight);
    this.combo.textContent = "x" + Math.max(1, Math.min(3, score.currentCombo));
    this.bestCombo.textContent = Game.I18n.number(score.bestCombo);
    this.collected.textContent = Game.I18n.number(score.collected);
    while (this.powerups.firstChild)
      this.powerups.removeChild(this.powerups.firstChild);
    var buffs = state.player.buffs;
    Object.keys(powerupKeys).forEach(function (key) {
      var value = buffs[key];
      if (value > 0) {
        var chip = document.createElement("span");
        chip.className = "powerup-chip";
        var icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent =
          key === "shield"
            ? "◇"
            : key === "rocket"
              ? "♢"
              : key === "springUses"
                ? "↟"
                : "✦";
        var label = document.createElement("span");
        label.textContent = Game.I18n.t(powerupKeys[key]);
        var remaining = document.createElement("b");
        remaining.textContent =
          key === "springUses" ? String(value) : Math.ceil(value) + "s";
        chip.appendChild(icon);
        chip.appendChild(label);
        chip.appendChild(remaining);
        this.powerups.appendChild(chip);
      }
    }, this);
  };
  Game.HudRenderer = HudRenderer;
})(window.DJGame);
