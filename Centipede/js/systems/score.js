(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Score = {
    add(app, amount) {
      if (!amount) {
        return;
      }
      const before = app.score;
      app.score += amount;
      if (app.score > app.highScore) {
        app.highScore = app.score;
        Game.Storage.saveHighScore(app.highScore);
      }
      while (app.score >= app.nextLifeAt) {
        app.nextLifeAt += Game.Config.EXTRA_LIFE_EVERY;
        if (app.lives < Game.Config.MAX_LIVES) {
          app.lives += 1;
          app.playSfx("extra_life");
          app.showRibbon("EXTRA LIFE", 900);
        }
      }
      if (Math.floor(before / 1000) !== Math.floor(app.score / 1000)) {
        app.saveGame();
      }
      app.hud.update();
    }
  };
})(window);
