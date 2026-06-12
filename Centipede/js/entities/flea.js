(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Flea {
    constructor(app) {
      this.col = Game.Helpers.randInt(1, Game.Config.GRID_COLS - 2);
      this.x = this.col * Game.Config.CELL + Game.Config.CELL / 2;
      this.y = -18;
      this.r = 8;
      this.speed = 150 + app.level * 7;
      this.dead = false;
      this.nextDropRow = 2;
    }

    update(app, dt) {
      this.y += this.speed * dt;
      const row = Math.floor(this.y / Game.Config.CELL);
      if (row >= this.nextDropRow && row < Game.Config.PLAYER_ZONE_START - 1) {
        this.nextDropRow += 2;
        if (!app.getMushroom(this.col, row) && Math.random() < 0.76) {
          app.addMushroom(this.col, row, false, Game.Config.MUSHROOM_HP);
        }
      }
      if (this.y > Game.Config.HEIGHT + 24) {
        this.dead = true;
      }
    }

    get circle() {
      return { x: this.x, y: this.y, r: this.r };
    }

    draw(ctx, palette) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(-6, -8, 12, 16);
      ctx.fillStyle = palette.bg;
      ctx.fillRect(-3, -4, 2, 2);
      ctx.fillRect(3, -4, 2, 2);
      ctx.restore();
    }
  }

  Game.Entities.Flea = Flea;
})(window);
