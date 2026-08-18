(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function SpawnSystem() {}

  function createUnit(session, unitId, side, x) {
    var definition = global.UNITS_DATA[unitId];
    var spawnX = x !== undefined ? x : app.PathManager.getSpawnX(side) + app.utils.randomInt(-8, 8);
    var unit = new app.Unit(definition, side, spawnX, app.PathManager.getY(spawnX, session.elapsed));
    if (side === "player") {
      session.playerUnits.add(unit);
    } else {
      session.enemyUnits.add(unit);
    }
    return unit;
  }

  function getCost(definition) {
    return app.utils.getUnitCost(definition);
  }

  SpawnSystem.prototype.update = function (session, delta) {
    Object.keys(session.cooldowns).forEach(function (unitId) {
      session.cooldowns[unitId] = Math.max(0, session.cooldowns[unitId] - delta);
    });
  };
  SpawnSystem.prototype.canSpawn = function (session, unitId, side) {
    var definition = global.UNITS_DATA[unitId];
    if (!definition) {
      return false;
    }
    return session.resource.canSpend(side, getCost(definition)) && Number(session.cooldowns[unitId] || 0) <= 0;
  };
  SpawnSystem.prototype.spawnPlayer = function (session, unitId) {
    var definition = global.UNITS_DATA[unitId];
    if (!definition || !this.canSpawn(session, unitId, "player")) {
      return { ok: false, reason: "not-ready" };
    }
    session.resource.spend("player", getCost(definition));
    session.cooldowns[unitId] = definition.cooldown;
    var unit = createUnit(session, unitId, "player");
    app.AudioManager.playSfx("summon");
    app.events.emit("battle:summon", { side: "player", unit: unit });
    return { ok: true, unit: unit };
  };
  SpawnSystem.prototype.spawnEnemy = function (session, unitId) {
    var definition = global.UNITS_DATA[unitId];
    if (!definition || !session.resource.canSpend("enemy", getCost(definition))) {
      return { ok: false, reason: "not-ready" };
    }
    session.resource.spend("enemy", getCost(definition));
    var unit = createUnit(session, unitId, "enemy");
    app.events.emit("battle:summon", { side: "enemy", unit: unit });
    return { ok: true, unit: unit };
  };
  SpawnSystem.prototype.spawnFree = function (session, unitId, side, x) {
    var definition = global.UNITS_DATA[unitId];
    var count = session.playerUnits.units.length + session.enemyUnits.units.length;
    if (!definition || (count >= app.Config.lowPerformanceUnitLimit * 2 && !definition.isBoss)) {
      return { ok: false, reason: "unit-limit" };
    }
    var unit = createUnit(session, unitId, side, x);
    app.events.emit("battle:summon", { side: side, unit: unit, free: true });
    return { ok: true, unit: unit };
  };
  app.SpawnSystem = SpawnSystem;
})(window);
