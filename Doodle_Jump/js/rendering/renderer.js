(function (Game) {
  "use strict";
  function Renderer(canvasView) {
    this.view = canvasView;
    this.ctx = canvasView.ctx;
    this.quality = "high";
  }
  Renderer.prototype.render = function (state, alpha) {
    if (!state) return;
    var ctx = this.ctx;
    var cameraY = state.camera.y;
    Game.Background.draw(ctx, state);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, Game.Constants.LOGICAL_WIDTH, Game.Constants.LOGICAL_HEIGHT);
    ctx.clip();
    state.platforms.forEach(function (platform) {
      var y = platform.y - cameraY;
      if (y > -40 && y < 760)
        Game.Sprites.platform(ctx, platform, platform.x, y, state.time);
    });
    state.items.forEach(function (item) {
      var y = item.y - cameraY;
      if (y > -40 && y < 760)
        Game.Sprites.item(ctx, item, item.x, y, state.time);
    });
    state.enemies.forEach(function (enemy) {
      var y = enemy.y - cameraY;
      if (y > -70 && y < 780)
        Game.Sprites.enemy(ctx, enemy, enemy.x, y, state.time);
    });
    Game.Particles.draw(ctx, state.particles, cameraY);
    var x = Game.Math.lerp(state.player.previousX, state.player.x, alpha);
    var y =
      Game.Math.lerp(state.player.previousY, state.player.y, alpha) - cameraY;
    Game.Sprites.player(ctx, state.player, x, y, state.time);
    ctx.restore();
  };
  Renderer.prototype.setQuality = function (quality) {
    this.quality = quality;
  };
  Game.Renderer = Renderer;
})(window.DJGame);
