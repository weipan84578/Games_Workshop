/* js/entities/player.js */
(function() {
  class Player {
    constructor() {
      this.width = GameConfig.PLAYER.width;
      this.height = GameConfig.PLAYER.height;
      
      // Center at bottom
      this.x = GameConfig.CANVAS_WIDTH / 2 - this.width / 2;
      this.y = GameConfig.CANVAS_HEIGHT - 80;
      
      this.speed = GameConfig.PLAYER.speed;
      this.cooldownTimer = 0;
      
      this.isExploding = false;
      this.explosionTimer = 0;
      this.explosionDuration = 1000; // 1 second explosion animation
    }

    resetPosition() {
      this.x = GameConfig.CANVAS_WIDTH / 2 - this.width / 2;
      this.isExploding = false;
      this.explosionTimer = 0;
    }

    update(dt, actions, onShoot) {
      if (this.isExploding) {
        this.explosionTimer += dt * 1000;
        if (this.explosionTimer >= this.explosionDuration) {
          this.isExploding = false;
          this.explosionTimer = 0;
        }
        return; // No controls during explosion
      }

      // 1. Move
      if (actions.left) {
        this.x -= this.speed * dt;
      }
      if (actions.right) {
        this.x += this.speed * dt;
      }

      // Constrain boundaries (keep margins)
      const margin = 20;
      this.x = GameHelpers.clamp(this.x, margin, GameConfig.CANVAS_WIDTH - this.width - margin);

      // 2. Cooldown
      if (this.cooldownTimer > 0) {
        this.cooldownTimer -= dt * 1000; // convert to ms
      }

      // 3. Shoot
      if (actions.fire && this.cooldownTimer <= 0) {
        this.cooldownTimer = GameConfig.PLAYER.shootCooldown;
        const bulletX = this.x + this.width / 2;
        const bulletY = this.y;
        onShoot(new Bullet(bulletX, bulletY, true));
        window.AudioManager.playSfx('shoot');
      }
    }

    triggerExplosion() {
      this.isExploding = true;
      this.explosionTimer = 0;
      window.AudioManager.playSfx('player-explosion');
    }

    draw(ctx, colors) {
      if (this.isExploding) {
        this.drawExplosion(ctx, colors);
        return;
      }

      ctx.fillStyle = colors.player;
      ctx.shadowColor = colors.player;
      
      // Draw classic pixel tank cannon
      ctx.beginPath();
      // Base: width x 16 (bottom part)
      ctx.rect(this.x, this.y + 12, this.width, 16);
      // Mid platform: narrower
      ctx.rect(this.x + 4, this.y + 6, this.width - 8, 6);
      // Turret gun nozzle
      ctx.rect(this.x + this.width / 2 - 4, this.y, 8, 6);
      // Left and right tank wheels blocks
      ctx.rect(this.x + 2, this.y + 8, 4, 4);
      ctx.rect(this.x + this.width - 6, this.y + 8, 4, 4);
      
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    drawExplosion(ctx, colors) {
      ctx.fillStyle = colors.danger;
      ctx.shadowColor = colors.danger;
      ctx.shadowBlur = 10;
      
      // Retro spark particles using simple lines
      const particleCount = 12;
      const progress = this.explosionTimer / this.explosionDuration;
      const radius = progress * 60;
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + progress * 2;
        // Spark line length decreases as it goes out
        const length = (1 - progress) * 15;
        const startDist = radius * 0.5;
        const endDist = startDist + length;

        const sx = centerX + Math.cos(angle) * startDist;
        const sy = centerY + Math.sin(angle) * startDist;
        const ex = centerX + Math.cos(angle) * endDist;
        const ey = centerY + Math.sin(angle) * endDist;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.lineWidth = 3;
        ctx.strokeStyle = progress > 0.7 ? colors.player : colors.danger;
        ctx.stroke();
      }
      ctx.shadowBlur = 0; // reset
    }
  }

  window.Player = Player;
})();
