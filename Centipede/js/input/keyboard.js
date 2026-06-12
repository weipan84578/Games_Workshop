(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Input = Game.Input || {};

  class KeyboardInput {
    constructor(app) {
      this.app = app;
      this.keys = new Set();
      this.gameKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space", "Enter", "Escape"]);
      window.addEventListener("keydown", (event) => this.onDown(event));
      window.addEventListener("keyup", (event) => this.onUp(event));
      window.addEventListener("blur", () => this.keys.clear());
    }

    onDown(event) {
      const code = event.code || event.key;
      if (this.gameKeys.has(code)) {
        event.preventDefault();
        this.app.unlockAudio();
      }

      if (this.app.state.is("MENU")) {
        if (code === "ArrowUp" || code === "KeyW") {
          this.app.menu.move(-1);
          return;
        }
        if (code === "ArrowDown" || code === "KeyS") {
          this.app.menu.move(1);
          return;
        }
        if (code === "Enter" || code === "Space") {
          this.app.menu.activateSelected();
          return;
        }
      }

      if (code === "Escape") {
        if (this.app.modal.isOpen()) {
          this.app.modal.close();
        } else {
          this.app.togglePause();
        }
        return;
      }

      if ((code === "Enter" || code === "Space") && this.app.state.is("PAUSED")) {
        this.app.resume();
        return;
      }

      this.keys.add(code);
    }

    onUp(event) {
      this.keys.delete(event.code || event.key);
    }

    vector() {
      let x = 0;
      let y = 0;
      if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) {
        x -= 1;
      }
      if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) {
        x += 1;
      }
      if (this.keys.has("ArrowUp") || this.keys.has("KeyW")) {
        y -= 1;
      }
      if (this.keys.has("ArrowDown") || this.keys.has("KeyS")) {
        y += 1;
      }
      const len = Math.hypot(x, y);
      return len > 0 ? { x: x / len, y: y / len } : { x: 0, y: 0 };
    }

    wantsShoot() {
      return this.keys.has("Space") || this.keys.has("Enter");
    }
  }

  Game.Input.KeyboardInput = KeyboardInput;
})(window);
