(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function PlayerUnits() {
    this.side = "player";
    this.units = [];
  }

  PlayerUnits.prototype.add = function (unit) {
    this.units.push(unit);
    return unit;
  };
  PlayerUnits.prototype.removeDead = function () {
    var dead = this.units.filter(function (unit) { return !unit.isAlive(); });
    this.units = this.units.filter(function (unit) { return unit.isAlive(); });
    return dead;
  };
  PlayerUnits.prototype.getAlive = function () {
    return this.units.filter(function (unit) { return unit.isAlive(); });
  };
  PlayerUnits.prototype.snapshot = function () {
    return this.units.map(function (unit) { return unit.snapshot(); });
  };
  PlayerUnits.fromSnapshot = function (snapshots) {
    var army = new PlayerUnits();
    (snapshots || []).forEach(function (snapshot) {
      if (snapshot.hp > 0) {
        army.add(app.Unit.fromSnapshot(snapshot));
      }
    });
    return army;
  };
  app.PlayerUnits = PlayerUnits;
})(window);
