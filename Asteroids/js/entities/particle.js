(function () {
  "use strict";

  Game.Particle = {
    create: function (x, y, color, speed, life, size) {
      var angle = Game.Utils.rand(0, Math.PI * 2);
      return {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: size || Game.Utils.rand(1, 3),
        life: life || Game.Utils.rand(0.25, 0.75),
        maxLife: life || 0.75,
        color: color,
        alive: true
      };
    },

    burst: function (app, x, y, color, count, speed) {
      if (!app.settings.particles) return;
      for (var i = 0; i < count && app.particles.length < Game.Constants.LIMITS.MAX_PARTICLES; i += 1) {
        app.particles.push(Game.Particle.create(x, y, color, Game.Utils.rand(speed * 0.25, speed), Game.Utils.rand(0.25, 0.8)));
      }
    },

    update: function (particle, dt) {
      particle.life -= dt;
      if (particle.life <= 0) {
        particle.alive = false;
        return;
      }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
    },

    draw: function (ctx, particle) {
      var alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
}());
