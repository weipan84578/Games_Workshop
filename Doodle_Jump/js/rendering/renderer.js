(function (Game) {
  "use strict";
  function Renderer(canvasView) {
    this.view = canvasView;
    this.ctx = canvasView.ctx;
    this.quality = "high";
    this.reducedMotion = false;
    this.shakeUntil = 0;
    this.shakeStrength = 0;
  }
  Renderer.prototype.render = function (state, alpha) {
    if (!state) return;
    var ctx = this.ctx;
    var cameraY = state.camera.y;
    var visualTime = this.reducedMotion ? 0 : state.time;
    var quality = this.quality;
    if (this.view.clear) this.view.clear();
    ctx.save();
    var now = Game.now();
    if (!this.reducedMotion && now < this.shakeUntil) {
      var remaining = (this.shakeUntil - now) / 1000;
      var strength = this.shakeStrength * Math.min(1, remaining * 8);
      ctx.translate(
        Math.sin(now * 0.045) * strength,
        Math.cos(now * 0.052) * strength,
      );
    }
    Game.Background.draw(ctx, state, {
      quality: this.quality,
      reducedMotion: this.reducedMotion,
    });
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, Game.Constants.LOGICAL_WIDTH, Game.Constants.LOGICAL_HEIGHT);
    ctx.clip();
    state.platforms.forEach(function (platform) {
      var y = platform.y - cameraY;
      if (y > -40 && y < 760)
        Game.Sprites.platform(ctx, platform, platform.x, y, visualTime);
    });
    state.items.forEach(function (item) {
      var y = item.y - cameraY;
      if (y > -40 && y < 760)
        Game.Sprites.item(ctx, item, item.x, y, visualTime, quality);
    });
    state.enemies.forEach(function (enemy) {
      var y = enemy.y - cameraY;
      if (y > -70 && y < 780)
        Game.Sprites.enemy(ctx, enemy, enemy.x, y, visualTime);
    });
    if (!this.reducedMotion && this.quality !== "low")
      Game.Particles.draw(ctx, state.particles, cameraY);
    var x = Game.Math.lerp(state.player.previousX, state.player.x, alpha);
    var y =
      Game.Math.lerp(state.player.previousY, state.player.y, alpha) - cameraY;
    Game.Sprites.player(ctx, state.player, x, y, visualTime);
    ctx.restore();
    ctx.restore();
  };
  Renderer.prototype.setQuality = function (quality) {
    this.quality = quality === "low" ? "low" : "high";
    if (this.view.setQuality) this.view.setQuality(this.quality);
  };
  Renderer.prototype.setReducedMotion = function (reduced) {
    this.reducedMotion = Boolean(reduced);
    if (this.reducedMotion) {
      this.shakeUntil = 0;
      this.shakeStrength = 0;
    }
  };
  Renderer.prototype.shake = function (strength, duration) {
    if (this.reducedMotion) return false;
    if (Game.now() >= this.shakeUntil) this.shakeStrength = 0;
    this.shakeStrength = Math.max(this.shakeStrength, Number(strength) || 0);
    this.shakeUntil = Math.max(
      this.shakeUntil,
      Game.now() + Math.max(0, Number(duration) || 0),
    );
    return true;
  };
  Game.Renderer = Renderer;
})(window.DJGame);
