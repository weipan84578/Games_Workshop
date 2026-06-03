/* js/entities/ufo.js */
(function() {
  const UFO_SPRITE = [
    [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,0,1,0,0,0]
  ];

  class Ufo {
    constructor() {
      this.width = GameConfig.UFO.width;
      this.height = GameConfig.UFO.height;
      this.y = GameConfig.UFO.y;
      
      this.x = 0;
      this.speedX = 0;
      this.active = false;
      
      // Floating score popup variables
      this.popupX = 0;
      this.popupY = 0;
      this.popupText = "";
      this.popupTimer = 0;
      this.popupDuration = 800; // ms to show score text
      
      this.spawnTimer = 0;
      this.resetSpawnTimer();
    }

    resetSpawnTimer() {
      this.spawnTimer = GameHelpers.randomRange(
        GameConfig.UFO.spawnIntervalMin,
        GameConfig.UFO.spawnIntervalMax
      );
    }

    spawn() {
      this.active = true;
      const flyFromRight = Math.random() > 0.5;
      
      if (flyFromRight) {
        this.x = GameConfig.CANVAS_WIDTH;
        this.speedX = -GameConfig.UFO.speed;
      } else {
        this.x = -this.width;
        this.speedX = GameConfig.UFO.speed;
      }
      
      window.AudioManager.playSfx('ufo-fly');
    }

    deactivate() {
      this.active = false;
      this.speedX = 0;
      window.AudioManager.stopUfoFlySfx();
      this.resetSpawnTimer();
    }

    update(dt, onKilled) {
      // 1. Handle score popup timer
      if (this.popupTimer > 0) {
        this.popupTimer -= dt * 1000;
      }

      // 2. Handle active flying
      if (this.active) {
        this.x += this.speedX * dt;
        
        // Check if out of bounds
        if ((this.speedX > 0 && this.x > GameConfig.CANVAS_WIDTH) ||
            (this.speedX < 0 && this.x < -this.width)) {
          this.deactivate();
        }
      } else {
        // Countdown to next spawn
        this.spawnTimer -= dt * 1000;
        if (this.spawnTimer <= 0) {
          this.spawn();
        }
      }
    }

    checkBulletCollision(bullet) {
      if (!this.active || !bullet.active || !bullet.isPlayerOwned) return false;

      const ufoBox = { x: this.x, y: this.y, width: this.width, height: this.height };
      if (GameHelpers.boxCollision(bullet, ufoBox)) {
        // Hit!
        bullet.active = false;
        
        // Random score
        const points = GameHelpers.randomChoice(GameConfig.UFO.scores);
        
        // Trigger popup
        this.popupX = this.x + this.width / 2;
        this.popupY = this.y + this.height / 2;
        this.popupText = points.toString();
        this.popupTimer = this.popupDuration;
        
        // Deactivate UFO flying
        this.deactivate();
        window.AudioManager.playSfx('ufo-killed');
        
        return points; // Return score awarded
      }
      return false;
    }

    draw(ctx, colors) {
      // Draw floating score popup if active
      if (this.popupTimer > 0) {
        ctx.fillStyle = colors.accent;
        ctx.font = `${GameConfig.CANVAS_WIDTH * 0.025}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.popupText, this.popupX, this.popupY);
      }

      if (!this.active) return;

      const px = this.width / UFO_SPRITE[0].length;
      const py = this.height / UFO_SPRITE.length;

      ctx.fillStyle = colors.danger;
      ctx.shadowColor = colors.danger;
      ctx.shadowBlur = 8; // Glowing spaceship effect

      for (let r = 0; r < UFO_SPRITE.length; r++) {
        for (let c = 0; c < UFO_SPRITE[r].length; c++) {
          if (UFO_SPRITE[r][c] === 1) {
            ctx.fillRect(
              this.x + c * px,
              this.y + r * py,
              Math.ceil(px),
              Math.ceil(py)
            );
          }
        }
      }
      ctx.shadowBlur = 0;
    }
  }

  window.Ufo = Ufo;
})();
