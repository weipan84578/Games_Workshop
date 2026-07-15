(function (Game) {
  "use strict";
  function PerformanceMonitor(onQualityChange) {
    this.onQualityChange = onQualityChange || function () {};
    this.samples = [];
    this.lastReport = 0;
    this.quality = "high";
    this.lowSince = 0;
    this.recoveredSince = 0;
  }
  PerformanceMonitor.prototype.sample = function (frameMs, now) {
    this.samples.push(frameMs);
    if (this.samples.length > 90) this.samples.shift();
    if (now - this.lastReport < 1000 || this.samples.length < 30) return;
    this.lastReport = now;
    var average =
      this.samples.reduce(function (sum, value) {
        return sum + value;
      }, 0) / this.samples.length;
    var fps = average ? 1000 / average : 60;
    if (fps < 45) {
      this.lowSince = this.lowSince || now;
      this.recoveredSince = 0;
      if (now - this.lowSince > 3000 && this.quality !== "low") {
        this.quality = "low";
        this.onQualityChange("low");
      }
    } else if (fps > 56) {
      this.recoveredSince = this.recoveredSince || now;
      this.lowSince = 0;
      if (now - this.recoveredSince > 15000 && this.quality !== "high") {
        this.quality = "high";
        this.onQualityChange("high");
      }
    }
  };
  PerformanceMonitor.prototype.getReport = function () {
    var values = this.samples.slice().sort(function (a, b) {
      return a - b;
    });
    var index = Math.floor(values.length * 0.95);
    return {
      fps: values.length
        ? Math.round(
            1000 /
              (values.reduce(function (sum, value) {
                return sum + value;
              }, 0) /
                values.length),
          )
        : 0,
      p95FrameMs: values[index] || 0,
      quality: this.quality,
    };
  };
  Game.PerformanceMonitor = PerformanceMonitor;
})(window.DJGame);
