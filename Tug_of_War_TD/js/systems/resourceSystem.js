(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function ResourceSystem(level) {
    this.baseMax = level.energyMax;
    this.max = this.baseMax;
    this.enemyMax = this.baseMax;
    this.player = Math.round(this.max * .82);
    this.enemy = Math.round(this.enemyMax * .58);
    this.basePlayerRate = level.energyRate;
    this.playerRate = this.basePlayerRate;
    this.enemyRate = level.energyRate * .9;
    this.incomeLevel = 1;
  }
  ResourceSystem.prototype.update = function (delta) {
    this.player = Math.min(this.max, this.player + this.playerRate * delta);
    this.enemy = Math.min(this.enemyMax, this.enemy + this.enemyRate * delta);
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
  ResourceSystem.prototype.getUpgradeCost = function () {
    return this.incomeLevel >= 5 ? 0 : 30 + (this.incomeLevel - 1) * 25;
  };
  ResourceSystem.prototype.getMaxEnergy = function () {
    return Math.round(this.baseMax * (1 + (this.incomeLevel - 1) * .18));
  };
  ResourceSystem.prototype.canUpgrade = function () {
    var cost = this.getUpgradeCost();
    return this.incomeLevel < 5 && this.player >= cost;
  };
  ResourceSystem.prototype.upgradePlayer = function () {
    var cost = this.getUpgradeCost();
    if (this.incomeLevel >= 5) {
      return { ok: false, reason: "max" };
    }
    if (!this.spend("player", cost)) {
      return { ok: false, reason: "insufficient", cost: cost };
    }
    this.incomeLevel += 1;
    this.max = this.getMaxEnergy();
    this.playerRate = this.basePlayerRate * (1 + (this.incomeLevel - 1) * .28);
    return { ok: true, level: this.incomeLevel, cost: cost, rate: this.playerRate, max: this.max };
  };
  ResourceSystem.prototype.snapshot = function () {
    return {
      baseMax: this.baseMax,
      max: this.max,
      enemyMax: this.enemyMax,
      player: this.player,
      enemy: this.enemy,
      basePlayerRate: this.basePlayerRate,
      playerRate: this.playerRate,
      enemyRate: this.enemyRate,
      incomeLevel: this.incomeLevel
    };
  };
  ResourceSystem.prototype.restore = function (snapshot) {
    if (!snapshot) {
      return;
    }
    this.baseMax = Number(snapshot.baseMax || this.baseMax);
    this.basePlayerRate = Number(snapshot.basePlayerRate || this.basePlayerRate);
    this.enemyRate = Number(snapshot.enemyRate || this.enemyRate);
    this.incomeLevel = app.utils.clamp(Number(snapshot.incomeLevel || 1), 1, 5);
    this.enemyMax = Number(snapshot.enemyMax || snapshot.max || this.baseMax);
    this.max = snapshot.baseMax !== undefined ? Number(snapshot.max || this.getMaxEnergy()) : this.getMaxEnergy();
    this.player = app.utils.clamp(Number(snapshot.player), 0, this.max);
    this.enemy = app.utils.clamp(Number(snapshot.enemy), 0, this.enemyMax);
    this.playerRate = Number(snapshot.playerRate || this.basePlayerRate * (1 + (this.incomeLevel - 1) * .28));
  };
  app.ResourceSystem = ResourceSystem;
})(window);
