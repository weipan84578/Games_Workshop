(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function getThresholds(level) {
    if (level.enhancedBoss) {
      var thresholds = [];
      for (var percent = 90; percent >= 10; percent -= level.bossEveryPercent || 10) {
        thresholds.push(percent);
      }
      return thresholds;
    }
    return [30];
  }

  function getLiving(session) {
    return session.enemyUnits.units.filter(function (unit) {
      return unit.def.isBoss && unit.isAlive();
    });
  }

  function trigger(session) {
    var percent = session.enemyBase.getPercent();
    getThresholds(session.level).forEach(function (threshold) {
      if (session.bossTriggered[threshold] || percent > threshold) {
        return;
      }
      var spawned = session.spawnSystem.spawnFree(session, "boss", "enemy", 870);
      if (!spawned.ok) {
        return;
      }
      session.bossTriggered[threshold] = true;
      session.bosses.push(spawned.unit);
      if (session.enemyBase.hp <= 0) {
        session.enemyBase.hp = 1;
      }
      app.AudioManager.playSfx("boss");
      app.events.emit("battle:boss", {
        threshold: threshold,
        enhanced: Boolean(session.level.enhancedBoss),
        count: getLiving(session).length
      });
    });
    session.bosses = getLiving(session);
  }

  app.BossSystem = {
    getThresholds: getThresholds,
    getLiving: getLiving,
    trigger: trigger,
    blocksEnemyBase: function (session) {
      return getLiving(session).length > 0;
    }
  };
})(window);
