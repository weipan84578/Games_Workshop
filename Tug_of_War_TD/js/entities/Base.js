(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function Base(side, x, maxHp) {
    this.side = side;
    this.x = x;
    this.y = app.Config.world.laneY;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.hitFlash = 0;
    this.shake = 0;
  }

  Base.prototype.update = function (delta) {
    this.hitFlash = Math.max(0, this.hitFlash - delta);
    this.shake = Math.max(0, this.shake - delta);
  };
  Base.prototype.takeDamage = function (amount) {
    this.hp = Math.max(0, this.hp - Math.max(0, amount));
    this.hitFlash = .18;
    this.shake = .2;
    return this.hp <= 0;
  };
  Base.prototype.getPercent = function () {
    return app.utils.percent(this.hp, this.maxHp);
  };
  Base.prototype.snapshot = function () {
    return { side: this.side, x: this.x, maxHp: this.maxHp, hp: this.hp };
  };
  Base.fromSnapshot = function (snapshot) {
    var base = new Base(snapshot.side, snapshot.x, snapshot.maxHp);
    base.hp = snapshot.hp;
    return base;
  };
  app.Base = Base;
})(window);
