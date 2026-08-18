(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function AISystem(level) {
    this.level = level;
    this.timer = 2.2;
    this.waveAnnounced = false;
  }
  AISystem.prototype.update = function (session, delta) {
    this.timer -= delta;
    if (this.timer > 0 || session.result) {
      return;
    }
    var affordable = this.level.enemyPool.filter(function (unitId) {
      return session.resource.canSpend("enemy", app.utils.getUnitCost(global.UNITS_DATA[unitId]));
    });
    if (!affordable.length) {
      this.timer = .55;
      return;
    }
    var selected = app.utils.randomItem(affordable);
    if (session.enemyBase.getPercent() < 42 && affordable.indexOf("tank") >= 0 && Math.random() > .3) {
      selected = "tank";
    }
    if (session.playerUnits.units.length > session.enemyUnits.units.length + 3 && affordable.indexOf("striker") >= 0) {
      selected = "striker";
    }
    session.spawnSystem.spawnEnemy(session, selected);
    this.timer = this.level.enemyRate * (.8 + Math.random() * .9);
    if (session.elapsed > 6 && !this.waveAnnounced) {
      this.waveAnnounced = true;
      app.events.emit("battle:announce", { key: "battle_wave" });
    }
  };
  app.AISystem = AISystem;
})(window);
