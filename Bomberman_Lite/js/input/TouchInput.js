(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class TouchInput {
    constructor() {
      this.direction = { x: 0, y: 0 };
      this.bombPressed = false;
      this.pausePressed = false;
    }

    setDirection(direction) {
      this.direction = root.Helpers.normalizeDirection(direction);
    }

    pressBomb() {
      this.bombPressed = true;
    }

    pressPause() {
      this.pausePressed = true;
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

  root.TouchInput = TouchInput;
}());
