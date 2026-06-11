(function () {
  "use strict";

  function makePoints(radius) {
    var count = Game.Utils.randInt(8, 12);
    var points = [];
    for (var i = 0; i < count; i += 1) {
      points.push({
        angle: i / count * Math.PI * 2,
        dist: radius * Game.Utils.rand(0.72, 1.16)
      });
    }
    return points;
  }

  Game.Asteroid = {
    create: function (size, x, y, speedScale) {
      var data = Game.Constants.ASTEROIDS.SHAPES[size];
      var angle = Game.Utils.rand(0, Math.PI * 2);
      var speed = Game.Utils.rand(data.speedMin, data.speedMax) * (speedScale || 1);
      return {
        type: size,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: data.radius,
        rotation: Game.Utils.rand(0, Math.PI * 2),
        spin: Game.Utils.rand(-1.2, 1.2),
        points: makePoints(data.radius),
        alive: true
      };
    },

    split: function (asteroid, app) {
      var data = Game.Constants.ASTEROIDS.SHAPES[asteroid.type];
      if (!data.splitsTo) return [];
      var levelData = Game.Levels.get(app.level);
      return [
        Game.Asteroid.create(data.splitsTo, asteroid.x, asteroid.y, levelData.asteroidSpeedScale),
        Game.Asteroid.create(data.splitsTo, asteroid.x, asteroid.y, levelData.asteroidSpeedScale)
      ];
    },

    update: function (asteroid, dt, app) {
      Game.Physics.integrate(asteroid, dt);
      asteroid.rotation += asteroid.spin * dt;
      Game.Physics.wrap(asteroid, app.width, app.height, asteroid.radius + 4);
    },

    draw: function (ctx, asteroid) {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.rotation);
      ctx.strokeStyle = Game.Utils.cssColor("--c-asteroid");
      ctx.lineWidth = 2;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      asteroid.points.forEach(function (point, index) {
        var x = Math.cos(point.angle) * point.dist;
        var y = Math.sin(point.angle) * point.dist;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };
}());
