(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function AISystem(level) {
    this.level = level;
    this.timer = 2.2;
    this.waveAnnounced = false;
  }

  function getNewestTierIndex(level, elapsed) {
    var ramp = level.enemyRamp;
    if (!ramp || elapsed < ramp.highTierStart) {
      return -1;
    }
    return Math.min(
      ramp.tierPools.length - 1,
      Math.floor((elapsed - ramp.highTierStart) / ramp.highTierEvery)
    );
  }

  function getAvailablePool(level, elapsed) {
    var ramp = level.enemyRamp;
    if (!ramp) {
      return level.enemyPool.slice();
    }
    var pool = (ramp.starterPool || level.enemyPool).slice();
    var newestTier = getNewestTierIndex(level, elapsed);
    for (var index = 0; index <= newestTier; index += 1) {
      ramp.tierPools[index].forEach(function (unitId) {
        if (pool.indexOf(unitId) < 0) {
          pool.push(unitId);
        }
      });
    }
    return pool;
  }

  function getIntervalMultiplier(level, elapsed) {
    var ramp = level.enemyRamp;
    if (!ramp || elapsed <= ramp.startAfter) {
      return 1;
    }
    return Math.max(ramp.intervalFloor, 1 - (elapsed - ramp.startAfter) * ramp.intervalDecay);
  }

  function selectUnit(level, elapsed, affordable) {
    var newestTier = getNewestTierIndex(level, elapsed);
    var ramp = level.enemyRamp;
    if (newestTier >= 0 && Math.random() < Math.min(ramp.highTierChanceMax, ramp.highTierChanceBase + newestTier * ramp.highTierChanceStep)) {
      var highTierAffordable = ramp.tierPools[newestTier].filter(function (unitId) {
        return affordable.indexOf(unitId) >= 0;
      });
      if (highTierAffordable.length) {
        return app.utils.randomItem(highTierAffordable);
      }
    }
    return app.utils.randomItem(affordable);
  }

  AISystem.prototype.update = function (session, delta) {
    this.timer -= delta;
    if (this.timer > 0 || session.result) {
      return;
    }
    var pool = getAvailablePool(this.level, session.elapsed);
    var affordable = pool.filter(function (unitId) {
      return session.resource.canSpend("enemy", app.utils.getUnitCost(global.UNITS_DATA[unitId]));
    });
    if (!affordable.length) {
      this.timer = .55 * getIntervalMultiplier(this.level, session.elapsed);
      return;
    }
    var selected = selectUnit(this.level, session.elapsed, affordable);
    if (session.enemyBase.getPercent() < 42 && affordable.indexOf("tank") >= 0 && Math.random() > .3) {
      selected = "tank";
    }
    if (session.playerUnits.units.length > session.enemyUnits.units.length + 3 && affordable.indexOf("striker") >= 0) {
      selected = "striker";
    }
    session.spawnSystem.spawnEnemy(session, selected);
    this.timer = this.level.enemyRate * (.8 + Math.random() * .9) * getIntervalMultiplier(this.level, session.elapsed);
    if (session.elapsed > 6 && !this.waveAnnounced) {
      this.waveAnnounced = true;
      app.events.emit("battle:announce", { key: "battle_wave" });
    }
  };
  AISystem.getAvailablePool = getAvailablePool;
  AISystem.getIntervalMultiplier = getIntervalMultiplier;
  AISystem.getNewestTierIndex = getNewestTierIndex;
  app.AISystem = AISystem;
})(window);
