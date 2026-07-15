(function (Game) {
  "use strict";
  function PointerInput(leftButton, rightButton, callbacks) {
    this.buttons = { left: leftButton, right: rightButton };
    this.callbacks = callbacks || {};
    this.state = { left: false, right: false };
    this.pointerMap = Object.create(null);
    this.swap = false;
    this.bind();
  }

  PointerInput.prototype.actualDirection = function (direction) {
    if (!this.swap) return direction;
    return direction === "left" ? "right" : "left";
  };

  PointerInput.prototype.bindButton = function (button, direction) {
    if (!button) return;
    var self = this;
    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        /* Pointer capture is optional on older browsers. */
      }
      var actual = self.actualDirection(direction);
      self.pointerMap[event.pointerId] = actual;
      self.state[actual] = true;
      button.classList.add("is-pressed");
      if (self.callbacks.interact) self.callbacks.interact();
      if (self.callbacks.mode) self.callbacks.mode("touch");
    });

    var release = function (event) {
      var mapped = self.pointerMap[event.pointerId];
      if (!mapped) return;
      delete self.pointerMap[event.pointerId];
      self.state[mapped] = Object.keys(self.pointerMap).some(function (id) {
        return self.pointerMap[id] === mapped;
      });
      button.classList.remove("is-pressed");
    };

    [
      "pointerup",
      "pointercancel",
      "lostpointercapture",
    ].forEach(function (name) {
      button.addEventListener(name, release);
    });
  };

  PointerInput.prototype.bind = function () {
    this.bindButton(this.buttons.left, "left");
    this.bindButton(this.buttons.right, "right");
  };

  PointerInput.prototype.reset = function () {
    this.state.left = false;
    this.state.right = false;
    this.pointerMap = Object.create(null);
    Object.keys(this.buttons).forEach(function (key) {
      if (this.buttons[key]) this.buttons[key].classList.remove("is-pressed");
    }, this);
  };

  PointerInput.prototype.setSwap = function (swap) {
    this.reset();
    this.swap = Boolean(swap);
    var controls = this.buttons.left && this.buttons.left.parentElement;
    if (controls) controls.classList.toggle("is-swapped", this.swap);
  };
  Game.PointerInput = PointerInput;
})(window.DJGame);
