(function () {
  "use strict";

  Game.Powerup = {
    create: function (type, x, y) {
      var angle = Game.Utils.rand(0, Math.PI * 2);
      return {
        type: type,
        x: x,
        y: y,
        vx: Math.cos(angle) * 32,
        vy: Math.sin(angle) * 32,
        radius: 13,
        age: 0,
        life: Game.Constants.POWERUPS.LIFE,
        alive: true
      };
    },

    update: function (powerup, dt, app) {
      powerup.age += dt;
      powerup.life -= dt;
      if (powerup.life <= 0) {
        powerup.alive = false;
        return;
      }
      Game.Physics.integrate(powerup, dt);
      Game.Physics.wrap(powerup, app.width, app.height, 20);
    },

    apply: function (powerup, ship, app) {
      var data = Game.Constants.POWERUPS.TYPES[powerup.type];
      var until = app.time + data.duration;
      if (powerup.type === "shield") {
        ship.shieldUntil = until;
        ship.shieldCharges = 1;
      } else {
        ship.powerups[powerup.type] = until;
      }
      Game.Sfx.play(powerup.type === "shield" ? "shield" : "powerup");
      powerup.alive = false;
    },

    draw: function (ctx, powerup) {
      var color = powerup.type === "shield" ? Game.Utils.cssColor("--c-accent") : Game.Utils.cssColor("--c-accent-2");
      var label = powerup.type.slice(0, 1).toUpperCase();
      ctx.save();
      ctx.translate(powerup.x, powerup.y);
      ctx.rotate(powerup.age * 2);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.rect(-powerup.radius, -powerup.radius, powerup.radius * 2, powerup.radius * 2);
      ctx.stroke();
      ctx.rotate(-powerup.age * 2);
      ctx.font = "700 13px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 1);
      ctx.restore();
    }
  };
}());
