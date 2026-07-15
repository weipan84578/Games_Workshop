(function (Game) {
  "use strict";
  function InputManager(options) {
    options = options || {};
    this.getSettings =
      options.getSettings ||
      function () {
        return {};
      };
    this.onPause = options.onPause || function () {};
    this.onInteract = options.onInteract || function () {};
    this.onMode = options.onMode || function () {};
    var self = this;
    this.mode = "keyboard";
    this.keyboard = new Game.KeyboardInput(this.getSettings, {
      pause: function () {
        self.onPause();
      },
      interact: function () {
        self.onInteract();
      },
      mode: function (mode) {
        self.mode = mode;
        self.onMode(mode);
      },
    });
    this.pointer = new Game.PointerInput(
      options.leftButton,
      options.rightButton,
      {
        interact: function () {
          self.onInteract();
        },
        mode: function (mode) {
          self.mode = mode;
          self.onMode(mode);
        },
      },
    );
    this.tilt = new Game.TiltInput({
      getSensitivity: function () {
        var settings = self.getSettings() || {};
        return (settings.controls || {}).tiltSensitivity || 3;
      },
      mode: function (mode) {
        self.mode = mode;
        self.onMode(mode);
      },
      denied: options.onTiltDenied || function () {},
    });
  }
  InputManager.prototype.getState = function () {
    var left = this.keyboard.state.left || this.pointer.state.left;
    var right = this.keyboard.state.right || this.pointer.state.right;
    var tilt = this.tilt.enabled ? this.tilt.value : 0;
    if (tilt < -0.15) left = true;
    if (tilt > 0.15) right = true;
    return { left: left && !right, right: right && !left };
  };
  InputManager.prototype.setTouchSwap = function (swap) {
    this.pointer.setSwap(swap);
  };
  InputManager.prototype.enableTilt = function () {
    return this.tilt.request();
  };
  InputManager.prototype.disableTilt = function () {
    this.tilt.disable();
  };
  InputManager.prototype.reset = function () {
    this.keyboard.reset();
    this.pointer.reset();
  };
  InputManager.prototype.destroy = function () {
    this.keyboard.destroy();
    this.tilt.destroy();
    this.pointer.reset();
  };
  Game.InputManager = InputManager;
})(window.DJGame);
