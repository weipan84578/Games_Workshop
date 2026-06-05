(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Collision = Pinball.Collision;

  function Bumper(x, y, r, options) {
    options = options || {};
    this.x = x;
    this.y = y;
    this.r = r;
    this.label = options.label || "";
    this.value = options.value || 100;
    this.impulse = options.impulse || 420;
    this.cooldown = 0;
    this.pulse = 0;
  }

  Bumper.prototype.update = function (dt) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.pulse = Math.max(0, this.pulse - dt * 4.8);
  };

  Bumper.prototype.collide = function (ball, physics) {
    if (this.cooldown > 0) return false;
    var hit = Collision.collideCircleCircle(ball, this, physics.restitution, this.impulse);
    if (!hit) return false;
    this.cooldown = 0.07;
    this.pulse = 1;
    return true;
  };

  Pinball.Bumper = Bumper;
})(window);
