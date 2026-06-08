(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  class Enemy {
    constructor(type, tileX, tileY, seed) {
      const def = root.ENEMY_TYPES[type] || root.ENEMY_TYPES.balloom;
      const size = def.boss ? 42 : root.CONFIG.enemySize;
      const pos = H.tileToPixel(tileX, tileY, size);
      this.type = type;
      this.x = pos.x;
      this.y = pos.y;
      this.w = size;
      this.h = size;
      this.baseSpeed = def.speed;
      this.dir = { x: 0, y: 0 };
      this.decisionTimer = 0;
      this.hp = def.hp;
      this.maxHp = def.hp;
      this.phase = def.phase;
      this.boss = !!def.boss;
      this.rng = H.mulberry32(seed || 1);
      this.spawnCooldown = 0;
    }

    update(dt, game) {
      this.decisionTimer -= dt;
      const tile = H.centerTile(this);
      const center = H.tileToPixel(tile.x, tile.y, this.w);
      const nearCenter = Math.abs(this.x - center.x) < 4 && Math.abs(this.y - center.y) < 4;
      if (nearCenter && this.decisionTimer <= 0) {
        this.x = center.x;
        this.y = center.y;
        this.dir = root.EnemyAI.choose(this, game);
        this.decisionTimer = this.boss ? 280 : 420 + this.rng() * 340;
      }

      const bossBoost = this.boss ? (1 + (this.maxHp - this.hp) * 0.16) : 1;
      const speed = this.baseSpeed * bossBoost;
      const amount = speed * dt / 1000;
      const nextX = { x: this.x + this.dir.x * amount, y: this.y, w: this.w, h: this.h };
      const nextY = { x: this.x, y: this.y + this.dir.y * amount, w: this.w, h: this.h };
      let blocked = false;
      if (game.canMoveRect(nextX, { allowPhase: this.phase })) this.x = nextX.x;
      else blocked = true;
      if (game.canMoveRect(nextY, { allowPhase: this.phase })) this.y = nextY.y;
      else blocked = true;
      if (blocked) this.decisionTimer = 0;

      if (this.boss) this.updateBoss(dt, game);
    }

    updateBoss(dt, game) {
      this.spawnCooldown -= dt;
      if (this.hp <= 3 && this.spawnCooldown <= 0 && game.enemies.length < 8) {
        this.spawnCooldown = this.hp === 1 ? 7000 : 12000;
        game.spawnEnemyNear("minvo", H.centerTile(this));
      }
    }

    hurt(game) {
      this.hp -= 1;
      if (this.hp <= 0) {
        game.defeatEnemy(this);
      } else {
        game.audio.play("sfx_enemy_die");
      }
    }
  }

  root.Enemy = Enemy;
}());
