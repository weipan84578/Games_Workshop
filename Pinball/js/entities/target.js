(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Collision = Pinball.Collision;

  function Target(x, y, w, h, options) {
    options = options || {};
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = options.angle || 0;
    this.value = options.value || 250;
    this.kind = options.kind || "target";
    this.bank = options.bank || "";
    this.lit = Boolean(options.lit);
    this.down = false;
    this.pulse = 0;
    this.cooldown = 0;
  }

  Target.prototype.update = function (dt) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.pulse = Math.max(0, this.pulse - dt * 3.6);
  };

  Target.prototype.reset = function () {
    this.down = false;
    this.lit = false;
    this.pulse = 0.7;
  };

  Target.prototype.collide = function (ball, physics) {
    if (this.down || this.cooldown > 0) return false;
    var hit = Collision.collideCircleRect(ball, this, physics.restitution, 80);
    if (!hit) return false;
    this.cooldown = 0.1;
    this.down = this.kind !== "rollover";
    this.lit = true;
    this.pulse = 1;
    return true;
  };

  Pinball.Target = Target;
})(window);
