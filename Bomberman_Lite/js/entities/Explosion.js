(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  class Explosion {
    constructor(cells) {
      this.cells = cells;
      this.life = root.BOMB_CONFIG.flameLife;
      this.hitKeys = new Set();
    }

    update(dt) {
      this.life -= dt;
    }

    isAlive() {
      return this.life > 0;
    }

    containsTile(x, y) {
      return this.cells.some((cell) => cell.x === x && cell.y === y);
    }

    key() {
      return this.cells.map((cell) => H.tileKey(cell.x, cell.y)).join("|");
    }
  }

  root.Explosion = Explosion;
}());
