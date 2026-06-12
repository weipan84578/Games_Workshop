(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class GameLoop {
    constructor(update) {
      this.update = update;
      this.last = 0;
      this.acc = 0;
      this.fixed = 1 / 60;
      this.running = false;
      this.frame = this.frame.bind(this);
    }

    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame(this.frame);
    }

    frame(time) {
      if (!this.running) {
        return;
      }
      let dt = Math.min(0.05, (time - this.last) / 1000);
      this.last = time;
      this.acc += dt;
      while (this.acc >= this.fixed) {
        this.update(this.fixed);
        this.acc -= this.fixed;
      }
      requestAnimationFrame(this.frame);
    }
  }

  Game.GameLoop = GameLoop;
})(window);
