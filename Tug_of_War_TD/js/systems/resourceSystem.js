(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function ResourceSystem(level) {
    this.max = level.energyMax;
    this.player = Math.round(this.max * .62);
    this.enemy = Math.round(this.max * .48);
    this.playerRate = level.energyRate;
    this.enemyRate = level.energyRate * .88;
  }
  ResourceSystem.prototype.update = function (delta) {
    this.player = Math.min(this.max, this.player + this.playerRate * delta);
    this.enemy = Math.min(this.max, this.enemy + this.enemyRate * delta);
  };
  ResourceSystem.prototype.canSpend = function (side, amount) {
    return (side === "player" ? this.player : this.enemy) >= amount;
  };
  ResourceSystem.prototype.spend = function (side, amount) {
    if (!this.canSpend(side, amount)) {
      return false;
    }
    if (side === "player") {
      this.player -= amount;
    } else {
      this.enemy -= amount;
    }
    return true;
  };
  ResourceSystem.prototype.snapshot = function () { return { max: this.max, player: this.player, enemy: this.enemy, playerRate: this.playerRate, enemyRate: this.enemyRate }; };
  ResourceSystem.prototype.restore = function (snapshot) {
    if (!snapshot) {
      return;
    }
    this.player = app.utils.clamp(Number(snapshot.player), 0, this.max);
    this.enemy = app.utils.clamp(Number(snapshot.enemy), 0, this.max);
  };
  app.ResourceSystem = ResourceSystem;
})(window);
