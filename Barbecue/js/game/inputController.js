(function exposeInputController(root, factory) {
  var InputController = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.InputController = InputController;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = InputController;
  }
})(typeof window !== "undefined" ? window : globalThis, function inputControllerFactory(root) {
  "use strict";

  function InputController(options) {
    this.canvas = options.canvas;
    this.renderer = options.renderer;
    this.game = options.game;
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onKeyDown = this.handleKeyDown.bind(this);
  }

  InputController.prototype.bind = function bind() {
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    root.addEventListener("keydown", this.onKeyDown);
  };

  InputController.prototype.unbind = function unbind() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    root.removeEventListener("keydown", this.onKeyDown);
  };

  InputController.prototype.handlePointerDown = function handlePointerDown(event) {
    var slotId = this.renderer.hitTest(event.clientX, event.clientY);
    if (slotId !== null) {
      this.game.handleSlot(slotId);
    }
  };

  InputController.prototype.handleKeyDown = function handleKeyDown(event) {
    if (!this.game || this.game.state === "menu") {
      return;
    }
    var key = event.key.toLowerCase();
    var foodKeys = ["1", "2", "3", "4", "5"];
    var foodTypes = ["pork", "corn", "mushroom", "shrimp", "sausage"];
    var foodIndex = foodKeys.indexOf(key);
    if (foodIndex !== -1) {
      this.game.selectFood(foodTypes[foodIndex]);
      return;
    }

    if (key === "f") {
      this.game.flipSelected();
    } else if (key === " " || key === "enter") {
      event.preventDefault();
      this.game.serveSelected();
    } else if (key === "backspace" || key === "delete") {
      this.game.discardSelected();
    } else if (key === "escape") {
      this.game.togglePause();
    }
  };

  return InputController;
});
