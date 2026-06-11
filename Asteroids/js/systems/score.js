(function () {
  "use strict";

  function create() {
    return {
      score: 0,
      highscore: Game.Storage.getHighscore(),
      nextExtraLifeAt: Game.Constants.SCORE.EXTRA_LIFE_EVERY
    };
  }

  Game.Score = {
    create: create,

    add: function (manager, points, app) {
      manager.score += points;
      if (manager.score > manager.highscore) {
        manager.highscore = manager.score;
        Game.Storage.setHighscore(manager.highscore);
      }
      while (manager.score >= manager.nextExtraLifeAt) {
        manager.nextExtraLifeAt += Game.Constants.SCORE.EXTRA_LIFE_EVERY;
        if (app && app.lives < 9) {
          app.lives += 1;
          Game.Sfx.play("extraLife");
        }
      }
    }
  };
}());
