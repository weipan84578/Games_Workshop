(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Utils = Pinball.Utils;

  function HUD() {
    this.score = document.getElementById("hud-score");
    this.balls = document.getElementById("hud-balls");
    this.multiplier = document.getElementById("hud-multiplier");
    this.combo = document.getElementById("hud-combo");
    this.message = document.getElementById("hud-message");
  }

  HUD.prototype.update = function (game) {
    this.score.textContent = Utils.formatScore(game.score);
    this.balls.textContent = String(game.ballsRemaining);
    this.multiplier.textContent = "x" + game.multiplier;
    this.combo.textContent = String(game.combo);
    this.message.textContent = game.message || "READY";
  };

  Pinball.HUD = HUD;
})(window);
