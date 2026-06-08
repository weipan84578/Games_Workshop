(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class KeyboardInput {
    constructor() {
      this.keys = new Set();
      this.bombPressed = false;
      this.pausePressed = false;
      this.bind();
    }

    bind() {
      window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "z", "p", "escape", "w", "a", "s", "d"].includes(key)) {
          event.preventDefault();
        }
        this.keys.add(key);
        if (key === " " || key === "z") this.bombPressed = true;
        if (key === "p" || key === "escape") this.pausePressed = true;
      });
      window.addEventListener("keyup", (event) => {
        this.keys.delete(event.key.toLowerCase());
      });
    }

    getDirection(controls) {
      const useWasd = controls === "wasd";
      let x = 0;
      let y = 0;
      if (this.keys.has("arrowleft") || (!useWasd && this.keys.has("a")) || (useWasd && this.keys.has("a"))) x -= 1;
      if (this.keys.has("arrowright") || (!useWasd && this.keys.has("d")) || (useWasd && this.keys.has("d"))) x += 1;
      if (this.keys.has("arrowup") || (!useWasd && this.keys.has("w")) || (useWasd && this.keys.has("w"))) y -= 1;
      if (this.keys.has("arrowdown") || (!useWasd && this.keys.has("s")) || (useWasd && this.keys.has("s"))) y += 1;
      return root.Helpers.normalizeDirection({ x, y });
    }

    consumeBomb() {
      const pressed = this.bombPressed;
      this.bombPressed = false;
      return pressed;
    }

    consumePause() {
      const pressed = this.pausePressed;
      this.pausePressed = false;
      return pressed;
    }
  }

  root.KeyboardInput = KeyboardInput;
}());
