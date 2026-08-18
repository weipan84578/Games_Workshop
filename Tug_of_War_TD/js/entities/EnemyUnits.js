(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function EnemyUnits() {
    this.side = "enemy";
    this.units = [];
  }

  EnemyUnits.prototype.add = function (unit) { this.units.push(unit); return unit; };
  EnemyUnits.prototype.removeDead = function () {
    var dead = this.units.filter(function (unit) { return !unit.isAlive(); });
    this.units = this.units.filter(function (unit) { return unit.isAlive(); });
    return dead;
  };
  EnemyUnits.prototype.getAlive = function () { return this.units.filter(function (unit) { return unit.isAlive(); }); };
  EnemyUnits.prototype.snapshot = function () { return this.units.map(function (unit) { return unit.snapshot(); }); };
  EnemyUnits.fromSnapshot = function (snapshots) {
    var army = new EnemyUnits();
    (snapshots || []).forEach(function (snapshot) {
      if (snapshot.hp > 0) {
        army.add(app.Unit.fromSnapshot(snapshot));
      }
    });
    return army;
  };
  app.EnemyUnits = EnemyUnits;
})(window);
