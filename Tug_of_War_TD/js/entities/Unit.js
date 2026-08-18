(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function Unit(definition, side, x, y) {
    this.uid = app.utils.uid("unit");
    this.def = definition;
    this.side = side;
    this.x = x;
    this.y = y;
    this.hp = definition.hp;
    this.maxHp = definition.hp;
    this.attackCooldown = 0;
    this.age = 0;
    this.hitFlash = 0;
    this.spawnPulse = 1;
    this.facing = side === "player" ? 1 : -1;
  }

  Unit.prototype.updateTimers = function (delta) {
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.hitFlash = Math.max(0, this.hitFlash - delta);
    this.spawnPulse = Math.max(0, this.spawnPulse - delta * 2.5);
    this.age += delta;
  };

  Unit.prototype.isAlive = function () {
    return this.hp > 0;
  };

  Unit.prototype.takeDamage = function (amount) {
    this.hp = Math.max(0, this.hp - Math.max(0, amount));
    this.hitFlash = .16;
    return this.hp <= 0;
  };

  Unit.prototype.heal = function (amount) {
    this.hp = Math.min(this.maxHp, this.hp + Math.max(0, amount));
  };

  Unit.prototype.snapshot = function () {
    return {
      uid: this.uid, unitId: this.def.id, side: this.side, x: this.x, y: this.y,
      hp: this.hp, maxHp: this.maxHp, attackCooldown: this.attackCooldown, age: this.age
    };
  };

  Unit.fromSnapshot = function (snapshot) {
    var definition = global.UNITS_DATA[snapshot.unitId] || global.UNITS_DATA.basic;
    var unit = new Unit(definition, snapshot.side, snapshot.x, snapshot.y);
    unit.uid = snapshot.uid || unit.uid;
    unit.hp = snapshot.hp;
    unit.maxHp = snapshot.maxHp || definition.hp;
    unit.attackCooldown = snapshot.attackCooldown || 0;
    unit.age = snapshot.age || 0;
    return unit;
  };

  app.Unit = Unit;
})(window);
