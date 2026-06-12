(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Input = Game.Input || {};

  class MouseInput {
    constructor(app) {
      this.app = app;
      this.target = null;
      this.shootQueued = false;
      this.enabled = window.matchMedia("(pointer: fine)").matches;

      app.canvas.addEventListener("pointermove", (event) => this.onMove(event));
      app.canvas.addEventListener("pointerleave", () => {
        this.target = null;
      });
      app.canvas.addEventListener("pointerdown", (event) => this.onDown(event));
    }

    logicalPoint(event) {
      const rect = this.app.canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / rect.width * Game.Config.WIDTH,
        y: (event.clientY - rect.top) / rect.height * Game.Config.HEIGHT
      };
    }

    onMove(event) {
      if (!this.enabled || !this.app.state.is("PLAYING")) {
        return;
      }
      this.target = this.logicalPoint(event);
    }

    onDown(event) {
      event.preventDefault();
      this.app.unlockAudio();
      if (this.app.state.is("MENU")) {
        return;
      }
      if (this.app.state.is("PAUSED")) {
        this.app.resume();
        return;
      }
      this.target = this.logicalPoint(event);
      this.shootQueued = true;
    }

    consumeShoot() {
      if (!this.shootQueued) {
        return false;
      }
      this.shootQueued = false;
      return true;
    }
  }

  Game.Input.MouseInput = MouseInput;
})(window);
