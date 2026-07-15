(function (Game) {
  "use strict";
  function CanvasView(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = 1;
    this.quality = "high";
    this.resizeTimer = 0;
    this.resize();
    this.onResize = this.resize.bind(this);
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("orientationchange", this.onResize, {
      passive: true,
    });
  }
  CanvasView.prototype.resize = function () {
    var ratio =
      this.quality === "low" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = ratio;
    this.canvas.width = Game.Constants.LOGICAL_WIDTH * ratio;
    this.canvas.height = Game.Constants.LOGICAL_HEIGHT * ratio;
    this.canvas.style.aspectRatio = "420 / 720";
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
  };
  CanvasView.prototype.clear = function () {
    this.ctx.clearRect(
      0,
      0,
      Game.Constants.LOGICAL_WIDTH,
      Game.Constants.LOGICAL_HEIGHT,
    );
  };
  CanvasView.prototype.setQuality = function (quality) {
    var next = quality === "low" ? "low" : "high";
    if (next === this.quality) return;
    this.quality = next;
    this.resize();
  };
  CanvasView.prototype.destroy = function () {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("orientationchange", this.onResize);
  };
  Game.CanvasView = CanvasView;
})(window.DJGame);
