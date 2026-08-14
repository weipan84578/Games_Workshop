(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});

  function Projectile() {
    this.reset();
  }

  Projectile.prototype.reset = function () {
    this.active = false;
    this.inPool = false;
    this.source = "player";
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.gravity = cg.Constants.PROJECTILE_GRAVITY;
    this.logicalCount = 1;
    this.damageTotal = 1;
    this.multiplier = 1;
    this.visualCount = 1;
    this.passedGates = Object.create(null);
    this.life = 0;
    this.trail = [];
    this.critical = false;
    this.seed = 0;
  };

  Projectile.prototype.launch = function (
    source,
    x,
    y,
    velocity,
    damage,
    critical,
  ) {
    this.active = true;
    this.source = source;
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = velocity.x;
    this.vy = velocity.y;
    this.speed = Math.hypot(velocity.x, velocity.y);
    this.gravity = velocity.gravity || cg.Constants.PROJECTILE_GRAVITY;
    this.logicalCount = 1;
    this.damageTotal = Math.max(1, damage || 1);
    this.multiplier = 1;
    this.visualCount = 1;
    this.passedGates = Object.create(null);
    this.life = 0;
    this.trail.length = 0;
    this.critical = Boolean(critical);
    this.seed = Math.random() * 100;
    return this;
  };

  Projectile.prototype.copyFrom = function (source, velocity) {
    this.active = true;
    this.source = source.source;
    this.x = source.x;
    this.y = source.y;
    this.prevX = source.x;
    this.prevY = source.y;
    this.vx = velocity.x;
    this.vy = velocity.y;
    this.speed = Math.hypot(velocity.x, velocity.y);
    this.gravity = source.gravity || cg.Constants.PROJECTILE_GRAVITY;
    this.logicalCount = 1;
    this.damageTotal = source.damageTotal;
    this.multiplier = source.multiplier;
    this.visualCount = 1;
    this.passedGates = Object.assign(Object.create(null), source.passedGates);
    this.life = 0;
    this.trail.length = 0;
    this.critical = source.critical;
    this.seed = Math.random() * 100;
    return this;
  };

  Projectile.prototype.refreshVisualCount = function (limit) {
    this.visualCount = Math.min(
      Math.max(1, this.logicalCount),
      Math.max(1, limit || 1),
    );
  };

  function Pool() {
    this.items = [];
    this.free = [];
  }

  Pool.prototype.acquire = function () {
    var item = this.free.pop();

    if (!item) {
      item = new Projectile();
      this.items.push(item);
    }

    item.inPool = false;
    return item;
  };

  Pool.prototype.release = function (item) {
    if (!item || item.inPool) return;
    item.reset();
    item.inPool = true;
    this.free.push(item);
  };

  Pool.prototype.clear = function () {
    this.items.forEach(function (item) {
      item.reset();
      item.inPool = true;
    });
    this.free.length = this.items.length;

    for (var index = 0; index < this.items.length; index += 1) {
      this.free[index] = this.items[this.items.length - 1 - index];
    }
  };

  Pool.prototype.activeCount = function () {
    return this.items.length - this.free.length;
  };

  cg.Projectile = {
    Pool: Pool,
    create: function () {
      return new Projectile();
    },
  };
})(window);
