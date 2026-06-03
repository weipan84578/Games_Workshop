/* js/entities/bullet.js */
(function() {
  class Bullet {
    constructor(x, y, isPlayerOwned) {
      this.width = GameConfig.BULLET.width;
      this.height = GameConfig.BULLET.height;
      this.x = x - this.width / 2; // Center horizontally on emitter
      this.y = y;
      
      this.isPlayerOwned = isPlayerOwned;
      this.speed = isPlayerOwned ? GameConfig.BULLET.playerSpeed : GameConfig.BULLET.invaderSpeed;
      this.active = true;
    }

    update(dt) {
      this.y += this.speed * dt;

      // Deactivate if out of canvas bounds
      if (this.y < 0 || this.y > GameConfig.CANVAS_HEIGHT) {
        this.active = false;
      }
    }

    draw(ctx, colors) {
      ctx.fillStyle = this.isPlayerOwned ? colors.player : colors.danger;
      
      // Draw standard glowing pixel bullet
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Add subtle glow trail
      ctx.shadowColor = this.isPlayerOwned ? colors.player : colors.danger;
      ctx.shadowBlur = 4;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowBlur = 0; // reset
    }
  }

  window.Bullet = Bullet;
})();
