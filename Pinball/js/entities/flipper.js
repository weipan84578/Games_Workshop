(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Physics = Pinball.Physics;
  var Collision = Pinball.Collision;

  function Flipper(options) {
    this.side = options.side;
    this.pivotX = options.pivotX;
    this.pivotY = options.pivotY;
    this.length = options.length || 132;
    this.width = options.width || 28;
    this.restAngle = options.restAngle;
    this.activeAngle = options.activeAngle;
    this.angle = this.restAngle;
    this.angularVelocity = 0;
    this.active = false;
    this.lastAngle = this.angle;
  }

  Flipper.prototype.setActive = function (active) {
    this.active = active;
  };

  Flipper.prototype.update = function (dt) {
    this.lastAngle = this.angle;
    var target = this.active ? this.activeAngle : this.restAngle;
    var speed = this.active ? 24 : 16;
    var next = this.angle + (target - this.angle) * Math.min(1, dt * speed);
    this.angularVelocity = (next - this.angle) / Math.max(dt, 0.0001);
    this.angle = next;
  };

  Flipper.prototype.tip = function () {
    return Physics.anglePoint(this.pivotX, this.pivotY, this.length, this.angle);
  };

  Flipper.prototype.collide = function (ball, physics) {
    var tip = this.tip();
    var hit = Collision.collideCircleCapsule(ball, this.pivotX, this.pivotY, tip.x, tip.y, this.width * 0.5, physics.restitution + 0.08);
    if (!hit) return false;

    var lift = this.active ? physics.flipperForce : 120;
    var sidePush = this.side === "left" ? 150 : -150;
    ball.vy -= lift * (this.active ? 1 : 0.26);
    ball.vx += sidePush * (this.active ? 1 : 0.35);
    ball.vx += -hit.ny * this.angularVelocity * 35;
    ball.vy += hit.nx * this.angularVelocity * 22;
    return true;
  };

  Pinball.Flipper = Flipper;
})(window);
