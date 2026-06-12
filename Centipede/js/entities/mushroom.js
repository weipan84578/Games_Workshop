(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class Mushroom {
    constructor(col, row, poisoned, hp) {
      this.col = col;
      this.row = row;
      this.poisoned = Boolean(poisoned);
      this.hp = hp || Game.Config.MUSHROOM_HP;
    }

    get x() {
      return this.col * Game.Config.CELL;
    }

    get y() {
      return this.row * Game.Config.CELL;
    }

    get rect() {
      const pad = 3;
      return {
        x: this.x + pad,
        y: this.y + pad,
        w: Game.Config.CELL - pad * 2,
        h: Game.Config.CELL - pad * 2
      };
    }

    damage(app) {
      this.hp -= 1;
      if (this.hp <= 0) {
        app.removeMushroom(this.col, this.row);
        app.playSfx("mushroom_destroy");
        Game.Score.add(app, 1);
        app.particles.burst(this.x + 10, this.y + 10, app.palette.mushroom, 10, 120);
        return true;
      }
      app.playSfx("hit_mushroom");
      return false;
    }

    repair(app) {
      const missing = Game.Config.MUSHROOM_HP - this.hp;
      if (missing > 0) {
        Game.Score.add(app, missing * 5);
      }
      this.hp = Game.Config.MUSHROOM_HP;
      this.poisoned = false;
    }

    serialize() {
      return {
        col: this.col,
        row: this.row,
        hp: this.hp,
        poisoned: this.poisoned
      };
    }

    draw(ctx, palette) {
      const cell = Game.Config.CELL;
      const x = this.x + cell / 2;
      const y = this.y + cell / 2;
      const hpRatio = this.hp / Game.Config.MUSHROOM_HP;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = this.poisoned ? palette.poison : palette.mushroom;
      ctx.globalAlpha = 0.45 + hpRatio * 0.55;
      ctx.beginPath();
      ctx.arc(0, -2, 8, Math.PI, Math.PI * 2);
      ctx.lineTo(8, 4);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.surface;
      ctx.fillRect(-4, 4, 8, 8);
      ctx.fillStyle = palette.text;
      for (let i = 0; i < this.hp; i += 1) {
        ctx.fillRect(-7 + i * 5, -3, 2, 2);
      }
      ctx.restore();
    }
  }

  Game.Entities.Mushroom = Mushroom;
})(window);
