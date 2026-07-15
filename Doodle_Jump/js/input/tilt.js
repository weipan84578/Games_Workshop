(function (Game) {
  "use strict";
  function TiltInput(callbacks) {
    this.callbacks = callbacks || {};
    this.getSensitivity =
      this.callbacks.getSensitivity ||
      function () {
        return 3;
      };
    this.enabled = false;
    this.value = 0;
    this.filtered = 0;
    this.bound = this.onOrientation.bind(this);
  }
  TiltInput.prototype.request = function () {
    var self = this;
    var permission =
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
        ? window.DeviceOrientationEvent.requestPermission()
        : Promise.resolve("granted");
    return Promise.resolve(permission)
      .then(function (result) {
        if (result !== "granted") throw new Error("permission");
        self.enabled = true;
        window.addEventListener("deviceorientation", self.bound, {
          passive: true,
        });
        if (self.callbacks.mode) self.callbacks.mode("tilt");
        return true;
      })
      .catch(function () {
        self.enabled = false;
        if (self.callbacks.denied) self.callbacks.denied();
        return false;
      });
  };
  TiltInput.prototype.onOrientation = function (event) {
    var gamma = Number(event.gamma) || 0;
    this.filtered += (gamma - this.filtered) * 0.12;
    this.value = scale(this.filtered, this.getSensitivity());
  };
  TiltInput.prototype.disable = function () {
    this.enabled = false;
    this.value = 0;
    window.removeEventListener("deviceorientation", this.bound);
  };
  TiltInput.prototype.destroy = function () {
    this.disable();
  };
  function scale(value, sensitivity) {
    var level = Game.Math.clamp(Math.round(Number(sensitivity) || 3), 1, 5);
    var deadZone = 7 - level;
    var divisor = 40 - level * 5;
    return Math.abs(value) < deadZone
      ? 0
      : Game.Math.clamp(value / divisor, -1, 1);
  }
  TiltInput.scale = scale;
  Game.TiltInput = TiltInput;
})(window.DJGame);
