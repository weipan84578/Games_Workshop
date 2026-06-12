(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Entities = Game.Entities || {};

  class CentipedeSegment {
    constructor(col, row) {
      this.col = col;
      this.row = row;
      this.isHead = false;
    }

    get x() {
      return this.col * Game.Config.CELL + Game.Config.CELL / 2;
    }

    get y() {
      return this.row * Game.Config.CELL + Game.Config.CELL / 2;
    }
  }

  class Centipede {
    constructor(options) {
      const opts = options || {};
      this.speed = opts.speed || Game.Config.CENTIPEDE_BASE_SPEED;
      this.dir = opts.dir || 1;
      this.verticalDir = opts.verticalDir || 1;
      this.stepProgress = 0;
      this.poisonDive = false;
      this.segments = [];

      if (opts.segments) {
        this.segments = opts.segments.map((s) => new CentipedeSegment(s.col, s.row));
      } else {
        const row = opts.row || 0;
        const startCol = opts.startCol || 0;
        const length = opts.length || 12;
        for (let i = 0; i < length; i += 1) {
          this.segments.push(new CentipedeSegment(Game.Helpers.clamp(startCol - i, 0, Game.Config.GRID_COLS - 1), row));
        }
      }

      this.markHead();
    }

    markHead() {
      this.segments.forEach((segment, index) => {
        segment.isHead = index === 0;
      });
    }

    update(app, dt) {
      if (!this.segments.length) {
        return;
      }
      this.stepProgress += this.speed * dt;
      while (this.stepProgress >= 1) {
        this.stepProgress -= 1;
        this.step(app);
      }
    }

    step(app) {
      const old = this.segments.map((segment) => ({ col: segment.col, row: segment.row }));
      const head = this.segments[0];
      let targetCol = head.col;
      let targetRow = head.row;

      if (this.poisonDive && head.row < Game.Config.PLAYER_ZONE_START) {
        targetRow += 1;
      } else {
        this.poisonDive = false;
        targetCol = head.col + this.dir;
        const mushroom = app.getMushroom(targetCol, targetRow);
        const blocked = targetCol < 0 || targetCol >= Game.Config.GRID_COLS || Boolean(mushroom);

        if (blocked) {
          if (mushroom && mushroom.poisoned) {
            this.poisonDive = true;
            app.playSfx("poison_dive");
          }
          this.dir *= -1;
          targetCol = head.col;
          if (head.row >= Game.Config.PLAYER_ZONE_START) {
            if (head.row >= Game.Config.GRID_ROWS - 1) {
              this.verticalDir = -1;
            } else if (head.row <= Game.Config.PLAYER_ZONE_START) {
              this.verticalDir = 1;
            }
          } else {
            this.verticalDir = 1;
          }
          targetRow = head.row + (this.poisonDive ? 1 : this.verticalDir);
        }
      }

      targetRow = Game.Helpers.clamp(targetRow, 0, Game.Config.GRID_ROWS - 1);
      head.col = Game.Helpers.clamp(targetCol, 0, Game.Config.GRID_COLS - 1);
      head.row = targetRow;

      for (let i = 1; i < this.segments.length; i += 1) {
        this.segments[i].col = old[i - 1].col;
        this.segments[i].row = old[i - 1].row;
      }
    }

    hitAt(index, app) {
      const segment = this.segments[index];
      if (!segment) {
        return 0;
      }

      const wasHead = index === 0;
      const score = wasHead ? 100 : 10;
      app.addMushroom(segment.col, segment.row, false, 4);
      app.particles.burst(segment.x, segment.y, wasHead ? app.palette.secondary : app.palette.primary, wasHead ? 18 : 10, 160);
      app.playSfx(wasHead ? "hit_head" : "hit_segment");

      const leading = this.segments.slice(0, index).map((s) => ({ col: s.col, row: s.row }));
      const trailing = this.segments.slice(index + 1).map((s) => ({ col: s.col, row: s.row }));

      this.segments = leading.map((s) => new CentipedeSegment(s.col, s.row));
      this.markHead();

      if (trailing.length) {
        const child = new Centipede({
          segments: trailing,
          speed: this.speed + 0.15,
          dir: -this.dir,
          verticalDir: this.verticalDir
        });
        app.centipedes.push(child);
      }

      return score;
    }

    hitTest(circle) {
      const radius = Game.Config.CELL * 0.42 + circle.r;
      for (let i = 0; i < this.segments.length; i += 1) {
        const segment = this.segments[i];
        const dx = circle.x - segment.x;
        const dy = circle.y - segment.y;
        if (dx * dx + dy * dy <= radius * radius) {
          return i;
        }
      }
      return -1;
    }

    collidesPlayer(player) {
      return this.hitTest(player.circle) !== -1;
    }

    draw(ctx, palette) {
      const cell = Game.Config.CELL;
      for (let i = this.segments.length - 1; i >= 0; i -= 1) {
        const segment = this.segments[i];
        ctx.save();
        ctx.translate(segment.x, segment.y);
        ctx.fillStyle = segment.isHead ? palette.secondary : palette.primary;
        ctx.strokeStyle = palette.bg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, cell * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = segment.isHead ? palette.text : palette.bg;
        if (segment.isHead) {
          ctx.fillRect(-5, -4, 3, 3);
          ctx.fillRect(3, -4, 3, 3);
        } else {
          ctx.fillRect(-3, -2, 6, 4);
        }
        ctx.restore();
      }
    }
  }

  Game.Entities.Centipede = Centipede;
})(window);
