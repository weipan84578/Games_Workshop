(function () {
  "use strict";

  Game.Ufo = {
    create: function (x, y, direction, small) {
      return {
        x: x,
        y: y,
        baseY: y,
        vx: direction * (small ? 110 : 76),
        vy: 0,
        direction: direction,
        radius: small ? Game.Constants.UFO.SMALL_RADIUS : Game.Constants.UFO.LARGE_RADIUS,
        small: !!small,
        age: 0,
        fireTimer: Game.Utils.rand(0.6, 1.4),
        alive: true
      };
    },

    update: function (ufo, dt, app) {
      ufo.age += dt;
      ufo.x += ufo.vx * dt;
      ufo.y = ufo.baseY + Math.sin(ufo.age * 3.1) * (ufo.small ? 18 : 28);
      ufo.fireTimer -= dt;
      if (ufo.fireTimer <= 0) {
        Game.Ufo.fire(ufo, app);
        ufo.fireTimer = Game.Constants.UFO.FIRE_INTERVAL * (ufo.small ? 0.82 : 1.15);
      }
      if (ufo.x < -90 || ufo.x > app.width + 90) {
        ufo.alive = false;
      }
    },

    fire: function (ufo, app) {
      if (app.enemyBullets.length >= Game.Constants.LIMITS.MAX_ENEMY_BULLETS || !app.ship.alive) return;
      var targetAngle = Math.atan2(app.ship.y - ufo.y, app.ship.x - ufo.x);
      var error = ufo.small ? Game.Utils.rand(-0.14, 0.14) : Game.Utils.rand(-0.62, 0.62);
      var vector = Game.Utils.angleVector(targetAngle + error, Game.Constants.UFO.BULLET_SPEED);
      app.enemyBullets.push(Game.Bullet.create(ufo.x, ufo.y, vector.x, vector.y, true));
      Game.Sfx.play("ufoShoot");
    },

    draw: function (ctx, ufo) {
      var accent = Game.Utils.cssColor("--c-accent-2");
      ctx.save();
      ctx.translate(ufo.x, ufo.y);
      ctx.strokeStyle = accent;
      ctx.fillStyle = "transparent";
      ctx.lineWidth = 2;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, ufo.radius * 1.45, ufo.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -ufo.radius * 0.25, ufo.radius * 0.65, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-ufo.radius, ufo.radius * 0.2);
      ctx.lineTo(ufo.radius, ufo.radius * 0.2);
      ctx.stroke();
      ctx.restore();
    }
  };
}());
