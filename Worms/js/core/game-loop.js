(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.GameLoop = api.GameLoop;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  /** Fixed-step simulation loop with interpolation and safe accumulator limits. */
  function GameLoop(update, render, options) {
    var settings = options || {};
    this.step = settings.step || 1 / 120;
    this.maxAccumulated = settings.maxAccumulated || 0.25;
    this.update = update || function () {};
    this.render = render || function () {};
    this.accumulator = 0;
    this.lastTime = 0;
    this.running = false;
    this.paused = false;
    this.frameId = null;
    this.boundFrame = this.frame.bind(this);
  }

  GameLoop.prototype.consume = function (elapsed) {
    if (this.paused) return 0;
    this.accumulator += Math.min(this.maxAccumulated, Math.max(0, elapsed));
    var steps = 0;
    while (this.accumulator + 1e-12 >= this.step) {
      this.update(this.step);
      this.accumulator -= this.step;
      steps += 1;
    }
    return steps;
  };

  GameLoop.prototype.frame = function (time) {
    if (!this.running) return;
    var seconds = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.lastTime = time;
    this.consume(seconds);
    this.render(this.accumulator / this.step);
    this.frameId = requestAnimationFrame(this.boundFrame);
  };

  GameLoop.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.lastTime = 0;
    if (typeof requestAnimationFrame === "function")
      this.frameId = requestAnimationFrame(this.boundFrame);
  };

  GameLoop.prototype.pause = function () {
    this.paused = true;
  };
  GameLoop.prototype.resume = function () {
    this.paused = false;
    this.lastTime = 0;
  };
  GameLoop.prototype.stop = function () {
    this.running = false;
    if (this.frameId != null && typeof cancelAnimationFrame === "function")
      cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.accumulator = 0;
  };

  return { GameLoop: GameLoop };
});
