(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;
  const TILE = root.TILE;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  class TileRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = 1;
      this.resize();
      window.addEventListener("resize", H.debounce(() => this.resize(), 120));
    }

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = root.CONFIG.baseWidth * this.dpr;
      this.canvas.height = root.CONFIG.baseHeight * this.dpr;
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
    }

    colors() {
      return {
        floor: H.cssVar("--color-floor", "#2c2c3e"),
        wall: H.cssVar("--color-wall-hard", "#5c5c5c"),
        brick: H.cssVar("--color-wall-soft", "#8b4513"),
        accent: H.cssVar("--color-accent", "#ffd700"),
        bomb: H.cssVar("--color-bomb", "#222"),
        flame: H.cssVar("--color-explosion", "#ff6b35"),
        player: H.cssVar("--color-player", "#00bcd4"),
        text: H.cssVar("--color-text", "#fff"),
        bg: H.cssVar("--color-bg", "#111")
      };
    }

    draw(game) {
      const ctx = this.ctx;
      const c = this.colors();
      const ts = root.CONFIG.tileSize;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, root.CONFIG.baseWidth, root.CONFIG.baseHeight);
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, root.CONFIG.baseWidth, root.CONFIG.baseHeight);

      if (!game.map) {
        this.drawCenterText("READY");
        return;
      }

      for (let y = 0; y < game.map.height; y += 1) {
        for (let x = 0; x < game.map.width; x += 1) {
          this.drawTile(ctx, x, y, game.map.get(x, y), c);
        }
      }

      game.powerups.forEach((powerup) => this.drawPowerup(ctx, powerup, c));
      game.bombs.forEach((bomb) => this.drawBomb(ctx, bomb, c, game.elapsed));
      game.explosions.forEach((explosion) => this.drawExplosion(ctx, explosion, c));
      game.enemies.forEach((enemy) => this.drawEnemy(ctx, enemy));
      if (game.player) this.drawPlayer(ctx, game.player, c, game.elapsed);

      if (game.mode === "PAUSED") this.drawOverlay("PAUSED");
      if (game.mode === "LEVEL_UP") this.drawOverlay("CLEAR");
    }

    drawTile(ctx, x, y, tile, c) {
      const ts = root.CONFIG.tileSize;
      const px = x * ts;
      const py = y * ts;
      ctx.fillStyle = c.floor;
      ctx.fillRect(px, py, ts, ts);
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.strokeRect(px + 0.5, py + 0.5, ts - 1, ts - 1);

      if (tile === TILE.WALL) {
        ctx.fillStyle = c.wall;
        roundRect(ctx, px + 4, py + 4, ts - 8, ts - 8, 6);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(px + 10, py + 10, ts - 20, 4);
      } else if (tile === TILE.BRICK) {
        ctx.fillStyle = c.brick;
        roundRect(ctx, px + 5, py + 5, ts - 10, ts - 10, 5);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.26)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + 8, py + ts / 2);
        ctx.lineTo(px + ts - 8, py + ts / 2);
        ctx.moveTo(px + ts / 2, py + 8);
        ctx.lineTo(px + ts / 2, py + ts - 8);
        ctx.stroke();
      } else if (tile === TILE.EXIT) {
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        roundRect(ctx, px + 8, py + 8, ts - 16, ts - 16, 8);
        ctx.fill();
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = c.accent;
        ctx.font = "700 18px Nunito, Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("EXIT", px + ts / 2, py + ts / 2);
      }
    }

    drawPowerup(ctx, powerup) {
      const def = root.POWERUPS[powerup.type];
      const ts = root.CONFIG.tileSize;
      const px = powerup.x * ts;
      const py = powerup.y * ts;
      ctx.fillStyle = def.color;
      roundRect(ctx, px + 10, py + 10, ts - 20, ts - 20, 8);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.font = "900 22px Nunito, Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(def.icon, px + ts / 2, py + ts / 2 + 1);
    }

    drawBomb(ctx, bomb, c, elapsed) {
      const ts = root.CONFIG.tileSize;
      const cx = bomb.x * ts + ts / 2;
      const cy = bomb.y * ts + ts / 2;
      const pulse = root.Animator.pulse(elapsed, 0.015, 13, 18);
      ctx.fillStyle = c.bomb;
      ctx.beginPath();
      ctx.arc(cx, cy + 2, pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(cx + 10, cy - 11, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    drawExplosion(ctx, explosion, c) {
      const ts = root.CONFIG.tileSize;
      const alpha = Math.max(0.15, explosion.life / root.BOMB_CONFIG.flameLife);
      explosion.cells.forEach((cell) => {
        const cx = cell.x * ts + ts / 2;
        const cy = cell.y * ts + ts / 2;
        const radius = ts * (0.22 + alpha * 0.35);
        ctx.fillStyle = c.flame;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff7a8";
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    drawEnemy(ctx, enemy) {
      const def = root.ENEMY_TYPES[enemy.type];
      ctx.fillStyle = def.color;
      roundRect(ctx, enemy.x, enemy.y, enemy.w, enemy.h, enemy.boss ? 10 : 16);
      ctx.fill();
      ctx.fillStyle = def.accent;
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.w * 0.35, enemy.y + enemy.h * 0.38, 4, 0, Math.PI * 2);
      ctx.arc(enemy.x + enemy.w * 0.66, enemy.y + enemy.h * 0.38, 4, 0, Math.PI * 2);
      ctx.fill();
      if (enemy.boss) {
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(enemy.x + 6, enemy.y - 8, enemy.w - 12, 5);
        ctx.fillStyle = "#111";
        ctx.fillRect(enemy.x + 8, enemy.y - 7, (enemy.w - 16) * (enemy.hp / enemy.maxHp), 3);
      }
    }

    drawPlayer(ctx, player, c, elapsed) {
      const flashing = player.invincible > 0 && root.Animator.flash(elapsed, 90);
      if (flashing) return;
      ctx.fillStyle = c.player;
      roundRect(ctx, player.x, player.y, player.w, player.h, 9);
      ctx.fill();
      ctx.fillStyle = "#f7f7ff";
      roundRect(ctx, player.x + 8, player.y + 6, player.w - 16, 11, 5);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.fillRect(player.x + 11, player.y + 10, 4, 4);
      ctx.fillRect(player.x + player.w - 15, player.y + 10, 4, 4);
      if (player.shield) {
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawOverlay(text) {
      const ctx = this.ctx;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, root.CONFIG.baseWidth, root.CONFIG.baseHeight);
      this.drawCenterText(text);
    }

    drawCenterText(text) {
      const ctx = this.ctx;
      ctx.fillStyle = "#fff";
      ctx.font = "32px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, root.CONFIG.baseWidth / 2, root.CONFIG.baseHeight / 2);
    }
  }

  root.TileRenderer = TileRenderer;
}());
