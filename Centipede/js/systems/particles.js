(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class ParticleSystem {
    constructor() {
      this.items = [];
    }

    burst(x, y, color, count, speed) {
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Game.Helpers.rand(speed * 0.35, speed);
        this.items.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: Game.Helpers.rand(0.28, 0.7),
          maxLife: 0.7,
          size: Game.Helpers.rand(2, 5),
          color
        });
      }
    }

    update(dt) {
      for (const p of this.items) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;
      }
      this.items = this.items.filter((p) => p.life > 0);
    }

    draw(ctx) {
      for (const p of this.items) {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    }
  }

  Game.ParticleSystem = ParticleSystem;
})(window);
