(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  class Player {
    constructor(save) {
      const size = root.CONFIG.playerSize;
      const pos = H.tileToPixel(1, 1, size);
      this.x = pos.x;
      this.y = pos.y;
      this.w = size;
      this.h = size;
      this.lives = save && save.lives ? save.lives : root.CONFIG.startLives;
      this.bombsMax = save && save.powerups ? save.powerups.bombCount : root.CONFIG.startBombs;
      this.fireRange = save && save.powerups ? save.powerups.fireRange : root.CONFIG.startFireRange;
      this.speedLevel = save && save.powerups ? save.powerups.speed : root.CONFIG.startSpeed;
      this.shield = !!(save && save.powerups && save.powerups.shield);
      this.remoteCtrl = !!(save && save.powerups && save.powerups.remoteCtrl);
      this.pierce = !!(save && save.powerups && save.powerups.pierce);
      this.invincible = 1200;
      this.ignoreBombKey = null;
      this.walkSoundTimer = 0;
    }

    update(dt, input, game) {
      this.invincible = Math.max(0, this.invincible - dt);
      this.walkSoundTimer -= dt;
      const dir = input.direction;
      const speed = (112 + this.speedLevel * 18) * dt / 1000;
      if (dir.x || dir.y) {
        const nextX = { x: this.x + dir.x * speed, y: this.y, w: this.w, h: this.h };
        const nextY = { x: this.x, y: this.y + dir.y * speed, w: this.w, h: this.h };
        if (game.canMoveRect(nextX, { ignoreBombKey: this.ignoreBombKey })) this.x = nextX.x;
        if (game.canMoveRect(nextY, { ignoreBombKey: this.ignoreBombKey })) this.y = nextY.y;
        if (this.walkSoundTimer <= 0) {
          game.audio.play("sfx_player_walk");
          this.walkSoundTimer = 220;
        }
      }
      if (this.ignoreBombKey) {
        const tiles = root.CollisionDetector.tilesForRect(this);
        const stillOverBomb = tiles.some((tile) => H.tileKey(tile.x, tile.y) === this.ignoreBombKey);
        if (!stillOverBomb) this.ignoreBombKey = null;
      }
      this.collectPowerups(game);
    }

    collectPowerups(game) {
      const tile = H.centerTile(this);
      const index = game.powerups.findIndex((powerup) => powerup.x === tile.x && powerup.y === tile.y);
      if (index >= 0) {
        const powerup = game.powerups.splice(index, 1)[0];
        powerup.apply(game);
      }
    }

    hurt(game) {
      if (this.invincible > 0) return;
      if (this.shield) {
        this.shield = false;
        this.invincible = 1400;
        game.notify("護盾吸收傷害");
        game.audio.play("sfx_player_die");
        return;
      }
      this.lives -= 1;
      this.invincible = 1800;
      game.audio.play("sfx_player_die");
      game.onPlayerDeath();
    }

    snapshotPowerups() {
      return {
        bombCount: this.bombsMax,
        fireRange: this.fireRange,
        speed: this.speedLevel,
        shield: this.shield,
        remoteCtrl: this.remoteCtrl,
        pierce: this.pierce
      };
    }
  }

  root.Player = Player;
}());
