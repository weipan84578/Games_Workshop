(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Bullet {
    constructor() {
      this.active = false;
      this.x = 0;
      this.y = 0;
      this.r = 3;
    }

    fire(x, y) {
      this.active = true;
      this.x = x;
      this.y = y;
    }

    update(dt) {
      if (!this.active) {
        return;
      }
      this.y -= Game.Config.BULLET_SPEED * dt;
      if (this.y < -12) {
        this.active = false;
      }
    }

    draw(ctx, palette) {
      if (!this.active) {
        return;
      }
      ctx.save();
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + 7);
      ctx.lineTo(this.x, this.y - 8);
      ctx.stroke();
      ctx.fillStyle = palette.text;
      ctx.fillRect(this.x - 2, this.y - 9, 4, 4);
      ctx.restore();
    }
  }

  Game.Entities.Bullet = Bullet;
})(window);
