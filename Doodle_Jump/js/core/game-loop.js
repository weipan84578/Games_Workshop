(function (Game) {
  "use strict";
  function GameLoop(options) {
    options = options || {};
    this.step = options.step || function () {};
    this.render = options.render || function () {};
    this.fixedStep = options.fixedStep || Game.Constants.FIXED_STEP;
    this.maxAccumulator =
      options.maxAccumulator || Game.Constants.MAX_ACCUMULATOR;
    this.maxSteps = options.maxSteps || Game.Constants.MAX_STEPS_PER_FRAME;
    this.accumulator = 0;
    this.lastTime = 0;
    this.running = false;
    this.frame = 0;
    this.raf = 0;
    this.onFrame = options.onFrame || function () {};
    this.boundFrame = this.frameTick.bind(this);
  }
  GameLoop.prototype.frameTick = function (timestamp) {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = timestamp;
    var delta = Math.min(
      (timestamp - this.lastTime) / 1000,
      this.maxAccumulator,
    );
    this.lastTime = timestamp;
    this.accumulator += delta;
    var steps = 0;
    while (this.accumulator >= this.fixedStep && steps < this.maxSteps) {
      this.step(this.fixedStep);
      this.accumulator -= this.fixedStep;
      steps += 1;
    }
    if (steps === this.maxSteps) this.accumulator = 0;
    this.render(this.accumulator / this.fixedStep, timestamp);
    this.frame += 1;
    this.onFrame(timestamp, delta * 1000);
    this.raf = window.requestAnimationFrame(this.boundFrame);
  };
  GameLoop.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.lastTime = 0;
    this.raf = window.requestAnimationFrame(this.boundFrame);
  };
  GameLoop.prototype.stop = function () {
    this.running = false;
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.lastTime = 0;
    this.accumulator = 0;
  };
  GameLoop.prototype.resetClock = function () {
    this.lastTime = 0;
    this.accumulator = 0;
  };
  Game.GameLoop = GameLoop;
})(window.DJGame);
