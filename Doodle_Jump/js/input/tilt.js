(function (Game) {
  "use strict";
  function TiltInput(callbacks) {
    this.callbacks = callbacks || {};
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
    this.value =
      Math.abs(this.filtered) < 4
        ? 0
        : Game.Math.clamp(this.filtered / 25, -1, 1);
  };
  TiltInput.prototype.disable = function () {
    this.enabled = false;
    this.value = 0;
    window.removeEventListener("deviceorientation", this.bound);
  };
  TiltInput.prototype.destroy = function () {
    this.disable();
  };
  Game.TiltInput = TiltInput;
})(window.DJGame);
