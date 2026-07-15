(function (Game) {
  "use strict";
  function GameScreen(root) {
    this.root = root;
    this.canvas = root.querySelector("#game-canvas");
    this.overlay = root.querySelector("#game-overlay");
    this.pausePanel = root.querySelector("#pause-panel");
    this.overPanel = root.querySelector("#game-over-panel");
  }
  GameScreen.prototype.showPause = function (visible) {
    this.overlay.hidden = !visible;
    this.pausePanel.hidden = !visible;
    this.overPanel.hidden = true;
  };
  GameScreen.prototype.showGameOver = function (result) {
    this.overlay.hidden = false;
    this.pausePanel.hidden = true;
    this.overPanel.hidden = false;
    this.root.querySelector("#result-score").textContent = Game.I18n.number(
      result.score.total,
    );
    this.root.querySelector("#result-height").textContent =
      Game.I18n.number(result.score.maxHeight) + " m";
    this.root.querySelector("#result-combo").textContent = Game.I18n.number(
      result.score.bestCombo,
    );
    this.root.querySelector("#result-collected").textContent = Game.I18n.number(
      result.score.collected,
    );
    this.root.querySelector("#new-record-badge").hidden = !result.newRecord;
    this.root.querySelector("#score-form-message").textContent = "";
    var form = this.root.querySelector("#score-form");
    form.hidden = Boolean(result.submitted);
  };
  Game.GameScreen = GameScreen;
})(window.DJGame);
