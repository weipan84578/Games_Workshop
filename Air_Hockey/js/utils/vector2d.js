(function (ns) {
  "use strict";

  function Vector2D(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector2D.prototype.clone = function () {
    return new Vector2D(this.x, this.y);
  };

  Vector2D.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  Vector2D.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  Vector2D.prototype.subtract = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  Vector2D.prototype.multiply = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector2D.prototype.normalize = function () {
    var length = this.length();
    if (length > 0.0001) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  };

  Vector2D.from = function (point) {
    return new Vector2D(point.x, point.y);
  };

  ns.Vector2D = Vector2D;
})(window.AirHockey = window.AirHockey || {});
