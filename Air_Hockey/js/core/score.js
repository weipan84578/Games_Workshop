(function (ns) {
  "use strict";

  function ScoreController(targetScore) {
    this.targetScore = targetScore || ns.Constants.DEFAULT_SETTINGS.targetScore;
    this.player = 0;
    this.ai = 0;
    this.lastScorer = null;
    this.combo = 0;
  }

  ScoreController.prototype.reset = function (targetScore) {
    this.targetScore = targetScore || this.targetScore;
    this.player = 0;
    this.ai = 0;
    this.lastScorer = null;
    this.combo = 0;
  };

  ScoreController.prototype.restore = function (progress) {
    this.targetScore = progress.targetScore;
    this.player = progress.playerScore;
    this.ai = progress.aiScore;
    this.lastScorer = null;
    this.combo = 0;
  };

  ScoreController.prototype.add = function (scorer) {
    if (scorer === "player") {
      this.player += 1;
    } else {
      this.ai += 1;
    }
    this.combo = this.lastScorer === scorer ? this.combo + 1 : 1;
    this.lastScorer = scorer;
    if (this.player >= this.targetScore) {
      return "player";
    }
    if (this.ai >= this.targetScore) {
      return "ai";
    }
    return null;
  };

  ns.ScoreController = ScoreController;
})(window.AirHockey = window.AirHockey || {});
