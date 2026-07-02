(function (ns) {
  "use strict";

  function Mallet(x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = ns.Constants.TABLE.MALLET_RADIUS;
    this.isPlayer = isPlayer;
  }

  Mallet.prototype.setPosition = function (x, y, dt) {
    var clamped = ns.Table.clampMallet({ x: x, y: y }, this.isPlayer);
    this.previousX = this.x;
    this.previousY = this.y;
    this.x = clamped.x;
    this.y = clamped.y;
    this.vx = dt > 0 ? (this.x - this.previousX) / dt : 0;
    this.vy = dt > 0 ? (this.y - this.previousY) / dt : 0;
  };

  Mallet.prototype.moveToward = function (target, speed, dt) {
    var dx = target.x - this.x;
    var dy = target.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 0.001) {
      this.setPosition(this.x, this.y, dt);
      return;
    }
    var maxStep = speed * dt;
    var amount = Math.min(1, maxStep / distance);
    this.setPosition(this.x + dx * amount, this.y + dy * amount, dt);
  };

  Mallet.prototype.reset = function (x, y) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.vx = 0;
    this.vy = 0;
  };

  ns.Mallet = Mallet;
})(window.AirHockey = window.AirHockey || {});
