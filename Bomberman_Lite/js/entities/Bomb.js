(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class Bomb {
    constructor(owner, x, y) {
      this.owner = owner;
      this.x = x;
      this.y = y;
      this.range = owner.fireRange;
      this.pierce = owner.pierce;
      this.remote = owner.remoteCtrl;
      this.timer = root.BOMB_CONFIG.fuseTime;
      this.tickTimer = 0;
      this.exploded = false;
    }

    update(dt, game) {
      if (this.exploded) return;
      this.timer -= dt;
      this.tickTimer -= dt;
      if (this.timer < 900 && this.tickTimer <= 0) {
        this.tickTimer = 180;
        game.audio.play("sfx_bomb_tick");
      }
      if (!this.remote && this.timer <= 0) {
        game.explodeBomb(this, false);
      }
    }
  }

  root.Bomb = Bomb;
}());
