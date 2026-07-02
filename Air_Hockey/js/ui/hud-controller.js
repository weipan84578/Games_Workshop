(function (ns) {
  "use strict";

  function HudController(i18n) {
    this.i18n = i18n;
    this.playerScore = ns.Helpers.$("#player-score");
    this.aiScore = ns.Helpers.$("#ai-score");
    this.status = ns.Helpers.$("#game-status");
    this.countdown = ns.Helpers.$("#countdown-display");
  }

  HudController.prototype.updateScores = function (player, ai) {
    this.playerScore.textContent = String(player);
    this.aiScore.textContent = String(ai);
  };

  HudController.prototype.setStatus = function (key) {
    this.status.textContent = this.i18n.t(key);
  };

  HudController.prototype.setCountdown = function (value) {
    this.countdown.textContent = value ? String(value) : "";
  };

  ns.HudController = HudController;
})(window.AirHockey = window.AirHockey || {});
