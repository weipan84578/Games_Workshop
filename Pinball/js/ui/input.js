(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function InputController(game) {
    this.game = game;
    this.keys = {};
    this.touchLeft = document.getElementById("touch-left");
    this.touchRight = document.getElementById("touch-right");
    this.touchLaunch = document.getElementById("touch-launch");
  }

  InputController.prototype.init = function () {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
    this.bindHold(this.touchLeft, function (down) { this.game.setFlipper("left", down); }.bind(this));
    this.bindHold(this.touchRight, function (down) { this.game.setFlipper("right", down); }.bind(this));
    this.bindHold(this.touchLaunch, function (down) {
      if (down) this.game.startPlunger();
      else this.game.releasePlunger();
    }.bind(this));
  };

  InputController.prototype.bindHold = function (element, callback) {
    var down = function (event) {
      event.preventDefault();
      Pinball.AudioManager.unlock();
      callback(true);
    };
    var up = function (event) {
      event.preventDefault();
      callback(false);
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", up);
  };

  InputController.prototype.onKeyDown = function (event) {
    if (this.keys[event.code]) return;
    this.keys[event.code] = true;
    Pinball.AudioManager.unlock();

    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      event.preventDefault();
      this.game.setFlipper("left", true);
    } else if (event.code === "ArrowRight" || event.code === "KeyD") {
      event.preventDefault();
      this.game.setFlipper("right", true);
    } else if (event.code === "Space" || event.code === "ArrowDown" || event.code === "KeyS") {
      event.preventDefault();
      this.game.startPlunger();
    } else if (event.code === "Escape") {
      event.preventDefault();
      this.game.togglePause();
    }
  };

  InputController.prototype.onKeyUp = function (event) {
    this.keys[event.code] = false;
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      event.preventDefault();
      this.game.setFlipper("left", false);
    } else if (event.code === "ArrowRight" || event.code === "KeyD") {
      event.preventDefault();
      this.game.setFlipper("right", false);
    } else if (event.code === "Space" || event.code === "ArrowDown" || event.code === "KeyS") {
      event.preventDefault();
      this.game.releasePlunger();
    }
  };

  Pinball.InputController = InputController;
})(window);
