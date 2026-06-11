(function () {
  "use strict";

  Game.Levels = {
    get: function (level) {
      var n = Math.max(1, level);
      return {
        level: n,
        asteroidCount: Math.min(3 + n, 11),
        asteroidSpeedScale: 1 + (n - 1) * 0.06,
        ufoDelay: Math.max(8, Game.Constants.UFO.SPAWN_MAX - n * 1.2)
      };
    }
  };
}());
