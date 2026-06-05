(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;
  var Physics = Pinball.Physics;

  function Ball(x, y, options) {
    options = options || {};
    this.x = x;
    this.y = y;
    this.r = options.r || CONFIG.BOARD.ballRadius;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.id = options.id || Math.random().toString(36).slice(2);
    this.inShooter = Boolean(options.inShooter);
    this.fromShooter = false;
    this.trail = [];
    this.lastHit = "";
  }

  Ball.prototype.update = function (dt, physics) {
    if (!this.inShooter) {
      this.vy += physics.gravity * dt;
    }

    this.vx *= physics.friction;
    this.vy *= physics.friction;
    Physics.limitSpeed(this, CONFIG.BOARD.maxSpeed);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) {
      this.trail.shift();
    }
  };

  Ball.prototype.setShooterRest = function () {
    this.x = CONFIG.BOARD.shooterX;
    this.y = CONFIG.BOARD.shooterRestY;
    this.vx = 0;
    this.vy = 0;
    this.inShooter = true;
    this.fromShooter = false;
    this.trail.length = 0;
  };

  Ball.prototype.launch = function (power) {
    this.inShooter = false;
    this.fromShooter = true;
    this.vx = -8 - power * 12;
    this.vy = -880 - power * 620;
  };

  Pinball.Ball = Ball;
})(window);
