(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class InputManager {
    constructor(settings) {
      this.settings = settings;
      this.keyboard = new root.KeyboardInput();
      this.touch = new root.TouchInput();
    }

    setSettings(settings) {
      this.settings = settings;
    }

    getSnapshot() {
      const keyboardDir = this.keyboard.getDirection(this.settings.controls);
      const touchDir = this.touch.direction;
      const direction = Math.hypot(touchDir.x, touchDir.y) > 0.05 ? touchDir : keyboardDir;
      return {
        direction,
        bomb: this.keyboard.consumeBomb() || this.touch.consumeBomb(),
        pause: this.keyboard.consumePause() || this.touch.consumePause()
      };
    }
  }

  root.InputManager = InputManager;
}());
