(function (BS) {
  BS.Core.Loop = function (update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.lastTime = 0;
    this.frameId = 0;
  };

  BS.Core.Loop.prototype.start = function () {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick.bind(this));
  };

  BS.Core.Loop.prototype.stop = function () {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  };

  BS.Core.Loop.prototype.tick = function (time) {
    if (!this.running) {
      return;
    }

    var dt = Math.min(0.033, (time - this.lastTime) / 1000);
    this.lastTime = time;
    this.update(dt);
    this.render(time);
    this.frameId = requestAnimationFrame(this.tick.bind(this));
  };
})(window.BubbleShooter);
