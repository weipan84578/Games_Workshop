(function (Game) {
  "use strict";
  function isFormTarget(target) {
    return (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    );
  }
  function Keyboard(getSettings, callbacks) {
    this.getSettings = getSettings;
    this.callbacks = callbacks || {};
    this.state = { left: false, right: false };
    this.downKeys = Object.create(null);
    this.boundDown = this.onDown.bind(this);
    this.boundUp = this.onUp.bind(this);
    this.boundBlur = this.reset.bind(this);
    window.addEventListener("keydown", this.boundDown);
    window.addEventListener("keyup", this.boundUp);
    window.addEventListener("blur", this.boundBlur);
  }
  Keyboard.prototype.matches = function (event, configured, alternatives) {
    var value = String(configured || "").toLowerCase();
    var key = String(event.key || "").toLowerCase();
    var code = String(event.code || "").toLowerCase();
    return (
      key === value ||
      code === value ||
      alternatives.some(function (item) {
        return key === item.toLowerCase() || code === item.toLowerCase();
      })
    );
  };
  Keyboard.prototype.onDown = function (event) {
    if (isFormTarget(event.target)) return;
    var controls = (this.getSettings() || {}).controls || {};
    if (this.matches(event, controls.pauseKey || "Escape", ["p"])) {
      if (!event.repeat && this.callbacks.pause) this.callbacks.pause();
      event.preventDefault();
      return;
    }
    var left = this.matches(event, controls.leftKey || "ArrowLeft", ["a"]);
    var right = this.matches(event, controls.rightKey || "ArrowRight", ["d"]);
    if (!left && !right) return;
    if (!event.repeat) this.callbacks.interact && this.callbacks.interact();
    this.downKeys[event.code || event.key] = true;
    if (left) this.state.left = true;
    if (right) this.state.right = true;
    if (this.callbacks.mode) this.callbacks.mode("keyboard");
    event.preventDefault();
  };
  Keyboard.prototype.onUp = function (event) {
    var controls = (this.getSettings() || {}).controls || {};
    var left = this.matches(event, controls.leftKey || "ArrowLeft", ["a"]);
    var right = this.matches(event, controls.rightKey || "ArrowRight", ["d"]);
    if (left) this.state.left = false;
    if (right) this.state.right = false;
    delete this.downKeys[event.code || event.key];
  };
  Keyboard.prototype.reset = function () {
    this.state.left = false;
    this.state.right = false;
    this.downKeys = Object.create(null);
  };
  Keyboard.prototype.destroy = function () {
    window.removeEventListener("keydown", this.boundDown);
    window.removeEventListener("keyup", this.boundUp);
    window.removeEventListener("blur", this.boundBlur);
  };
  Game.KeyboardInput = Keyboard;
})(window.DJGame);
