(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class GameLoop {
    constructor(update, render) {
      this.update = update;
      this.render = render;
      this.running = false;
      this.last = 0;
      this.frame = this.frame.bind(this);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame(this.frame);
    }

    stop() {
      this.running = false;
    }

    frame(timestamp) {
      if (!this.running) return;
      const dt = Math.min(timestamp - this.last, 1000 / root.CONFIG.targetFps * 3);
      this.last = timestamp;
      this.update(dt);
      this.render();
      requestAnimationFrame(this.frame);
    }
  }

  root.GameLoop = GameLoop;
}());
