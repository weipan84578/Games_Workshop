(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function SpawnSystem() {}

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
    return session.resource.canSpend(side, definition.cost) && Number(session.cooldowns[unitId] || 0) <= 0;
  };
  SpawnSystem.prototype.spawnPlayer = function (session, unitId) {
    var definition = global.UNITS_DATA[unitId];
    if (!definition || !this.canSpawn(session, unitId, "player")) {
      return { ok: false, reason: "not-ready" };
    }
    session.resource.spend("player", definition.cost);
    session.cooldowns[unitId] = definition.cooldown;
    var x = app.PathManager.getSpawnX("player") + app.utils.randomInt(-8, 8);
    var unit = new app.Unit(definition, "player", x, app.PathManager.getY(x, session.elapsed));
    session.playerUnits.add(unit);
    app.AudioManager.playSfx("summon");
    app.events.emit("battle:summon", { side: "player", unit: unit });
    return { ok: true, unit: unit };
  };
  SpawnSystem.prototype.spawnEnemy = function (session, unitId) {
    var definition = global.UNITS_DATA[unitId];
    if (!definition || !session.resource.canSpend("enemy", definition.cost)) {
      return { ok: false, reason: "not-ready" };
    }
    session.resource.spend("enemy", definition.cost);
    var x = app.PathManager.getSpawnX("enemy") + app.utils.randomInt(-8, 8);
    var unit = new app.Unit(definition, "enemy", x, app.PathManager.getY(x, session.elapsed));
    session.enemyUnits.add(unit);
    app.events.emit("battle:summon", { side: "enemy", unit: unit });
    return { ok: true, unit: unit };
  };
  app.SpawnSystem = SpawnSystem;
})(window);
