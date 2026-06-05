(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function Plunger() {
    this.charge = 0;
    this.charging = false;
    this.cooldown = 0;
  }

  Plunger.prototype.start = function () {
    if (this.cooldown > 0) return;
    this.charging = true;
  };

  Plunger.prototype.release = function () {
    if (!this.charging) return 0;
    this.charging = false;
    this.cooldown = 0.22;
    var power = Math.max(0.18, this.charge);
    this.charge = 0;
    return power;
  };

  Plunger.prototype.update = function (dt) {
    if (this.charging) {
      this.charge = Math.min(1, this.charge + dt * 0.75);
    } else {
      this.charge = Math.max(0, this.charge - dt * 1.5);
    }
    this.cooldown = Math.max(0, this.cooldown - dt);
  };

  Pinball.Plunger = Plunger;
})(window);
