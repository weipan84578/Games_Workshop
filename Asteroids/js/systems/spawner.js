(function () {
  "use strict";

  Game.Spawner = {
    asteroids: function (app, count) {
      var levelData = Game.Levels.get(app.level);
      for (var i = 0; i < count; i += 1) {
        var pos = Game.Utils.randomAwayFrom(app.width, app.height, app.ship, Game.Constants.ASTEROIDS.SAFE_RADIUS);
        app.asteroids.push(Game.Asteroid.create("large", pos.x, pos.y, levelData.asteroidSpeedScale));
      }
    },

    ufo: function (app) {
      var small = app.level >= 4 && Math.random() < Math.min(0.65, app.level * 0.06);
      var fromLeft = Math.random() < 0.5;
      var y = Game.Utils.rand(app.height * 0.18, app.height * 0.7);
      app.ufos.push(Game.Ufo.create(fromLeft ? -50 : app.width + 50, y, fromLeft ? 1 : -1, small));
      Game.Sfx.play("ufoHum");
    },

    powerup: function (app, x, y) {
      if (Math.random() > Game.Constants.POWERUPS.CHANCE) return;
      var types = Object.keys(Game.Constants.POWERUPS.TYPES);
      app.powerups.push(Game.Powerup.create(Game.Utils.choice(types), x, y));
    }
  };
}());
