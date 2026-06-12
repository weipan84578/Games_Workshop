(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Spider {
    constructor(app) {
      const fromLeft = Math.random() > 0.5;
      this.x = fromLeft ? -24 : Game.Config.WIDTH + 24;
      this.y = Game.Helpers.rand(
        Game.Config.PLAYER_ZONE_START * Game.Config.CELL + 20,
        Game.Config.HEIGHT - 42
      );
      this.dir = fromLeft ? 1 : -1;
      this.speed = Game.Helpers.rand(95, 145) + app.level * 4;
      this.r = 13;
      this.phase = Math.random() * Math.PI * 2;
      this.dead = false;
    }

    update(app, dt) {
      this.phase += dt * 7;
      this.x += this.dir * this.speed * dt;
      this.y += Math.sin(this.phase) * 82 * dt;
      this.y = Game.Helpers.clamp(this.y, Game.Config.PLAYER_ZONE_START * Game.Config.CELL + 12, Game.Config.HEIGHT - 16);

      const col = Math.floor(this.x / Game.Config.CELL);
      const row = Math.floor(this.y / Game.Config.CELL);
      const mushroom = app.getMushroom(col, row);
      if (mushroom && Math.random() < 0.14) {
        app.removeMushroom(col, row);
        app.particles.burst(mushroom.x + 10, mushroom.y + 10, app.palette.mushroom, 6, 80);
      }

      if ((this.dir > 0 && this.x > Game.Config.WIDTH + 32) || (this.dir < 0 && this.x < -32)) {
        this.dead = true;
      }
    }

    scoreFor(player) {
      const distance = Math.abs(player.y - this.y);
      if (distance < 36) {
        return 900;
      }
      if (distance < 96) {
        return 600;
      }
      return 300;
    }

    get circle() {
      return { x: this.x, y: this.y, r: this.r };
    }

    draw(ctx, palette) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-16, i * 8);
        ctx.moveTo(5, 0);
        ctx.lineTo(16, i * 8);
        ctx.stroke();
      }
      ctx.fillStyle = palette.secondary;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palette.text;
      ctx.fillRect(-4, -3, 2, 2);
      ctx.fillRect(4, -3, 2, 2);
      ctx.restore();
    }
  }

  Game.Entities.Spider = Spider;
})(window);
