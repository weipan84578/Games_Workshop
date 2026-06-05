(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function GameLoop(update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.step = 1 / 120;
    this.maxFrame = 0.08;
    this.rafId = 0;
  }

  GameLoop.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = window.requestAnimationFrame(this.tick.bind(this));
  };

  GameLoop.prototype.stop = function () {
    this.running = false;
    window.cancelAnimationFrame(this.rafId);
  };

  GameLoop.prototype.tick = function (time) {
    if (!this.running) return;
    var delta = Math.min((time - this.lastTime) / 1000, this.maxFrame);
    this.lastTime = time;
    this.accumulator += delta;

    while (this.accumulator >= this.step) {
      this.update(this.step);
      this.accumulator -= this.step;
    }

    this.render(this.accumulator / this.step);
    this.rafId = window.requestAnimationFrame(this.tick.bind(this));
  };

  Pinball.GameLoop = GameLoop;
})(window);
