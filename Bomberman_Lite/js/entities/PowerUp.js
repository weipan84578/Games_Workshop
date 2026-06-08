(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class PowerUp {
    constructor(type, x, y) {
      this.type = type;
      this.x = x;
      this.y = y;
    }

    apply(game) {
      const player = game.player;
      const def = root.POWERUPS[this.type];
      if (!player || !def) return;
      if (this.type === "bomb") player.bombsMax = Math.min(8, player.bombsMax + 1);
      if (this.type === "fire") player.fireRange = Math.min(root.BOMB_CONFIG.maxRange, player.fireRange + 1);
      if (this.type === "speed") player.speedLevel = Math.min(5, player.speedLevel + 1);
      if (this.type === "shield") player.shield = true;
      if (this.type === "time") game.addTime(30);
      if (this.type === "pierce") player.pierce = true;
      if (this.type === "life") player.lives = Math.min(root.CONFIG.maxLives, player.lives + 1);
      if (this.type === "remote") player.remoteCtrl = true;
      game.score += root.SCORE.powerup_collect;
      game.audio.play("sfx_powerup_pickup");
      game.notify(def.label + "!");
    }
  }

  root.PowerUp = PowerUp;
}());
