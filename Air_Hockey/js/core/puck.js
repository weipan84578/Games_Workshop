(function (ns) {
  "use strict";

  function Puck(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = ns.Constants.TABLE.PUCK_RADIUS;
    this.trail = [];
  }

  Puck.prototype.reset = function (direction) {
    var table = ns.Constants.TABLE;
    this.x = table.WIDTH / 2;
    this.y = table.HEIGHT / 2;
    var angle = ns.Helpers.randomBetween(-0.45, 0.45) + (direction < 0 ? -Math.PI / 2 : Math.PI / 2);
    this.vx = Math.cos(angle) * table.SERVE_SPEED;
    this.vy = Math.sin(angle) * table.SERVE_SPEED;
    this.trail = [];
  };

  Puck.prototype.stop = function () {
    var table = ns.Constants.TABLE;
    this.x = table.WIDTH / 2;
    this.y = table.HEIGHT / 2;
    this.vx = 0;
    this.vy = 0;
    this.trail = [];
  };

  ns.Puck = Puck;
})(window.AirHockey = window.AirHockey || {});
