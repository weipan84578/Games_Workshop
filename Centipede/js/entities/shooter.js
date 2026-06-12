(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Shooter {
    constructor() {
      this.r = 9;
      this.cooldown = 0;
      this.invulnerable = 0;
      this.reset();
    }

    reset() {
      this.x = Game.Config.WIDTH / 2;
      this.y = Game.Config.HEIGHT - Game.Config.CELL * 1.3;
      this.cooldown = 0;
      this.invulnerable = 1.2;
    }

    update(dt, app) {
      this.cooldown = Math.max(0, this.cooldown - dt);
      this.invulnerable = Math.max(0, this.invulnerable - dt);

      const vector = app.getMoveVector();
      let vx = vector.x;
      let vy = vector.y;

      if (app.mouse.target && Math.abs(vx) + Math.abs(vy) < 0.05) {
        const dx = app.mouse.target.x - this.x;
        const dy = app.mouse.target.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 2) {
          vx = dx / distance;
          vy = dy / distance;
        }
      }

      this.x += vx * Game.Config.PLAYER_SPEED * dt;
      this.y += vy * Game.Config.PLAYER_SPEED * dt;
      this.x = Game.Helpers.clamp(this.x, this.r, Game.Config.WIDTH - this.r);
      this.y = Game.Helpers.clamp(
        this.y,
        Game.Config.PLAYER_ZONE_START * Game.Config.CELL + this.r,
        Game.Config.HEIGHT - this.r
      );

      if (app.consumeShoot()) {
        this.shoot(app);
      }
    }

    shoot(app) {
      if (this.cooldown > 0 || app.bullet.active) {
        return;
      }
      app.bullet.fire(this.x, this.y - this.r - 2);
      this.cooldown = Game.Config.BULLET_COOLDOWN;
      app.playSfx("shoot");
    }

    get circle() {
      return { x: this.x, y: this.y, r: this.r };
    }

    draw(ctx, palette) {
      ctx.save();
      if (this.invulnerable > 0 && Math.floor(this.invulnerable * 12) % 2 === 0) {
        ctx.globalAlpha = 0.45;
      }
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 14);
      ctx.lineTo(this.x + 11, this.y + 10);
      ctx.lineTo(this.x, this.y + 5);
      ctx.lineTo(this.x - 11, this.y + 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = palette.text;
      ctx.fillRect(this.x - 2, this.y - 7, 4, 13);
      ctx.restore();
    }
  }

  Game.Entities.Shooter = Shooter;
})(window);
