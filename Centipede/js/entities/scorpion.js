(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Scorpion {
    constructor(app) {
      const fromLeft = Math.random() > 0.5;
      this.x = fromLeft ? -30 : Game.Config.WIDTH + 30;
      this.row = Game.Helpers.randInt(4, Game.Config.PLAYER_ZONE_START - 5);
      this.y = this.row * Game.Config.CELL + Game.Config.CELL / 2;
      this.dir = fromLeft ? 1 : -1;
      this.speed = 130 + app.level * 4;
      this.r = 12;
      this.dead = false;
    }

    update(app, dt) {
      this.x += this.dir * this.speed * dt;
      const col = Math.floor(this.x / Game.Config.CELL);
      const mushroom = app.getMushroom(col, this.row);
      if (mushroom && !mushroom.poisoned) {
        mushroom.poisoned = true;
        app.particles.burst(mushroom.x + 10, mushroom.y + 10, app.palette.poison, 8, 90);
      }
      if ((this.dir > 0 && this.x > Game.Config.WIDTH + 36) || (this.dir < 0 && this.x < -36)) {
        this.dead = true;
      }
    }

    get circle() {
      return { x: this.x, y: this.y, r: this.r };
    }

    draw(ctx, palette) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.dir, 1);
      ctx.fillStyle = palette.poison;
      ctx.fillRect(-12, -6, 20, 12);
      ctx.fillRect(6, -3, 10, 6);
      ctx.strokeStyle = palette.poison;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, -2);
      ctx.quadraticCurveTo(-22, -18, -5, -16);
      ctx.stroke();
      ctx.fillStyle = palette.text;
      ctx.fillRect(9, -2, 2, 2);
      ctx.restore();
    }
  }

  Game.Entities.Scorpion = Scorpion;
})(window);
