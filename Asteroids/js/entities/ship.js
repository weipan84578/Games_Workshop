(function () {
  "use strict";

  function powerActive(ship, app, type) {
    return ship.powerups[type] && ship.powerups[type] > app.time;
  }

  Game.Ship = {
    create: function (x, y) {
      return {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        radius: Game.Constants.SHIP.RADIUS,
        angle: -Math.PI / 2,
        cooldown: 0,
        warpCooldown: 0,
        invulnerable: Game.Constants.SHIP.RESPAWN_GRACE,
        shieldUntil: 0,
        shieldCharges: 0,
        powerups: {},
        alive: true,
        thrusting: false
      };
    },

    reset: function (ship, app) {
      ship.x = app.width / 2;
      ship.y = app.height / 2;
      ship.vx = 0;
      ship.vy = 0;
      ship.angle = -Math.PI / 2;
      ship.cooldown = 0;
      ship.warpCooldown = 0;
      ship.invulnerable = Game.Constants.SHIP.RESPAWN_GRACE;
      ship.alive = true;
      ship.thrusting = false;
    },

    hasPower: powerActive,

    update: function (ship, dt, app) {
      var input = Game.Input.state;
      ship.cooldown = Math.max(0, ship.cooldown - dt);
      ship.warpCooldown = Math.max(0, ship.warpCooldown - dt);
      ship.invulnerable = Math.max(0, ship.invulnerable - dt);
      ship.thrusting = false;

      if (input.left) ship.angle -= Game.Constants.SHIP.TURN_SPEED * dt;
      if (input.right) ship.angle += Game.Constants.SHIP.TURN_SPEED * dt;

      if (input.thrust) {
        var thrust = Game.Constants.SHIP.THRUST * (powerActive(ship, app, "boost") ? 1.6 : 1);
        ship.vx += Math.cos(ship.angle) * thrust * dt;
        ship.vy += Math.sin(ship.angle) * thrust * dt;
        ship.thrusting = true;
        app.thrustFxTimer -= dt;
        if (app.thrustFxTimer <= 0) {
          app.thrustFxTimer = 0.045;
          Game.Particle.burst(app, ship.x - Math.cos(ship.angle) * 13, ship.y - Math.sin(ship.angle) * 13, Game.Utils.cssColor("--c-accent"), 2, 70);
          Game.Sfx.play("thrust");
        }
      }

      var friction = Math.pow(Game.Constants.SHIP.FRICTION, dt * 60);
      ship.vx *= friction;
      ship.vy *= friction;
      Game.Physics.limitSpeed(ship, Game.Constants.SHIP.MAX_SPEED * (powerActive(ship, app, "boost") ? 1.25 : 1));
      Game.Physics.integrate(ship, dt);
      Game.Physics.wrap(ship, app.width, app.height, ship.radius);

      if (input.fire && ship.cooldown <= 0) {
        Game.Ship.fire(ship, app);
      }

      if (Game.Input.consume("warp")) {
        Game.Ship.warp(ship, app);
      }
    },

    fire: function (ship, app) {
      var maxBullets = Game.Constants.SHIP.MAX_BULLETS;
      var activeBullets = app.bullets.filter(function (bullet) { return bullet.alive; }).length;
      if (activeBullets >= maxBullets) return;
      var angles = [ship.angle];
      if (powerActive(ship, app, "triple")) {
        angles = [ship.angle - 0.18, ship.angle, ship.angle + 0.18];
      }
      angles.forEach(function (angle) {
        if (activeBullets >= maxBullets) return;
        var base = Game.Utils.angleVector(angle, Game.Constants.SHIP.BULLET_SPEED);
        app.bullets.push(Game.Bullet.create(
          ship.x + Math.cos(angle) * 18,
          ship.y + Math.sin(angle) * 18,
          base.x + ship.vx * 0.35,
          base.y + ship.vy * 0.35,
          false
        ));
        activeBullets += 1;
      });
      ship.cooldown = powerActive(ship, app, "rapid") ? Game.Constants.SHIP.RAPID_FIRE_COOLDOWN : Game.Constants.SHIP.FIRE_COOLDOWN;
      Game.Sfx.play(powerActive(ship, app, "rapid") ? "rapid" : "shoot");
    },

    warp: function (ship, app) {
      if (ship.warpCooldown > 0) return;
      ship.x = Game.Utils.rand(app.width * 0.12, app.width * 0.88);
      ship.y = Game.Utils.rand(app.height * 0.16, app.height * 0.84);
      ship.vx *= 0.25;
      ship.vy *= 0.25;
      ship.invulnerable = Math.max(ship.invulnerable, 0.7);
      ship.warpCooldown = Game.Constants.SHIP.WARP_COOLDOWN;
      Game.Particle.burst(app, ship.x, ship.y, Game.Utils.cssColor("--c-accent-2"), 24, 180);
      Game.Sfx.play("warp");
      if (Math.random() < Game.Constants.SHIP.WARP_RISK) {
        app.damageShip();
      }
    },

    damage: function (ship, app) {
      if (ship.invulnerable > 0) return false;
      if (ship.shieldCharges > 0 && ship.shieldUntil > app.time) {
        ship.shieldCharges = 0;
        ship.shieldUntil = 0;
        ship.invulnerable = 0.6;
        Game.Particle.burst(app, ship.x, ship.y, Game.Utils.cssColor("--c-accent"), 18, 130);
        Game.Sfx.play("shieldHit");
        return false;
      }
      return true;
    },

    draw: function (ctx, ship, app) {
      if (ship.invulnerable > 0 && Math.floor(app.time * 12) % 2 === 0) return;

      var shipColor = Game.Utils.cssColor("--c-ship");
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = shipColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = shipColor;
      ctx.shadowBlur = 13;
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-13, -10);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-13, 10);
      ctx.closePath();
      ctx.stroke();

      if (ship.thrusting) {
        ctx.strokeStyle = Game.Utils.cssColor("--c-accent-2");
        ctx.beginPath();
        ctx.moveTo(-11, -5);
        ctx.lineTo(-24 - Math.random() * 9, 0);
        ctx.lineTo(-11, 5);
        ctx.stroke();
      }
      ctx.restore();

      if (ship.shieldCharges > 0 && ship.shieldUntil > app.time) {
        ctx.save();
        ctx.strokeStyle = Game.Utils.cssColor("--c-accent");
        ctx.globalAlpha = 0.58 + Math.sin(app.time * 9) * 0.2;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  };
}());
