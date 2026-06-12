(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.UI = Game.UI || {};

  class Hud {
    constructor(app) {
      this.app = app;
      this.score = document.getElementById("hudScore");
      this.high = document.getElementById("hudHigh");
      this.lives = document.getElementById("hudLives");
      this.level = document.getElementById("hudLevel");
    }

    update() {
      this.score.textContent = Game.Helpers.formatScore(this.app.score || 0);
      this.high.textContent = Game.Helpers.formatScore(this.app.highScore || 0);
      this.lives.textContent = this.app.lives || 0;
      this.level.textContent = this.app.level || 1;
    }
  }

  Game.UI.Hud = Hud;
})(window);
