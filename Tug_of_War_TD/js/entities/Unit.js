(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function Unit(definition, side, x, y) {
    this.uid = app.utils.uid("unit");
    this.def = definition;
    this.side = side;
    this.x = x;
    this.y = y;
    this.maxHp = app.utils.getUnitMaxHp(definition, side);
    this.hp = this.maxHp;
    this.attackCooldown = 0;
    this.abilityCooldown = definition.abilityCooldown || 0;
    this.age = 0;
    this.hitFlash = 0;
    this.spawnPulse = 1;
    this.slowTimer = 0;
    this.slowFactor = 1;
    this.barrier = 0;
    this.facing = side === "player" ? 1 : -1;
  }

  Unit.prototype.updateTimers = function (delta) {
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.abilityCooldown = Math.max(0, this.abilityCooldown - delta);
    this.hitFlash = Math.max(0, this.hitFlash - delta);
    this.spawnPulse = Math.max(0, this.spawnPulse - delta * 2.5);
    this.slowTimer = Math.max(0, this.slowTimer - delta);
    if (this.slowTimer <= 0) {
      this.slowFactor = 1;
    }
    this.age += delta;
  };

  Unit.prototype.isAlive = function () {
    return this.hp > 0;
  };

  Unit.prototype.takeDamage = function (amount) {
    var defense = app.utils.getUnitDefense(this.def, this.side);
    var damage = Math.max(0, amount) * (1 - defense);
    if (this.barrier > 0) {
      var absorbed = Math.min(this.barrier, damage);
      this.barrier -= absorbed;
      damage -= absorbed;
    }
    this.hp = Math.max(0, this.hp - damage);
    this.hitFlash = .16;
    return this.hp <= 0;
  };

  Unit.prototype.applySlow = function (duration, factor) {
    this.slowTimer = Math.max(this.slowTimer, duration || 1.5);
    this.slowFactor = Math.min(this.slowFactor, factor || .55);
  };

  Unit.prototype.heal = function (amount) {
    this.hp = Math.min(this.maxHp, this.hp + Math.max(0, amount));
  };

  Unit.prototype.snapshot = function () {
    return {
      uid: this.uid, unitId: this.def.id, side: this.side, x: this.x, y: this.y,
      hp: this.hp, maxHp: this.maxHp, attackCooldown: this.attackCooldown, abilityCooldown: this.abilityCooldown,
      age: this.age, slowTimer: this.slowTimer, slowFactor: this.slowFactor, barrier: this.barrier
    };
  };

  Unit.fromSnapshot = function (snapshot) {
    var definition = global.UNITS_DATA[snapshot.unitId] || global.UNITS_DATA.basic;
    var unit = new Unit(definition, snapshot.side, snapshot.x, snapshot.y);
    unit.uid = snapshot.uid || unit.uid;
    unit.hp = snapshot.hp;
    unit.maxHp = snapshot.maxHp || unit.maxHp;
    unit.attackCooldown = snapshot.attackCooldown || 0;
    unit.abilityCooldown = snapshot.abilityCooldown !== undefined ? snapshot.abilityCooldown : (definition.abilityCooldown || 0);
    unit.age = snapshot.age || 0;
    unit.slowTimer = snapshot.slowTimer || 0;
    unit.slowFactor = snapshot.slowFactor || 1;
    unit.barrier = snapshot.barrier || 0;
    return unit;
  };

  app.Unit = Unit;
})(window);
