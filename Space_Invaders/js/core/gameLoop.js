/* js/core/gameLoop.js */
(function() {
  class GameLoop {
    constructor(updateCallback, renderCallback) {
      this.updateCallback = updateCallback;
      this.renderCallback = renderCallback;
      
      this.isRunning = false;
      this.lastTime = 0;
      this.rafId = null;
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();
      
      const tick = (currentTime) => {
        if (!this.isRunning) return;

        // Calculate delta time in seconds
        let dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap dt to 0.1 seconds to avoid physics clipping during background lag
        if (dt > 0.1) {
          dt = 0.1;
        }

        // Execute step updates and screen redraws
        this.updateCallback(dt);
        this.renderCallback();

        this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  window.GameLoop = GameLoop;
})();
