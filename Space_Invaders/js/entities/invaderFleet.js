/* js/entities/invaderFleet.js */
(function() {
  class InvaderFleet {
    constructor(difficulty) {
      this.difficulty = difficulty;
      const diffConfig = GameConfig.DIFFICULTIES[difficulty] || GameConfig.DIFFICULTIES.normal;
      
      this.speedMultiplier = diffConfig.invaderSpeedMultiplier;
      this.fireRate = diffConfig.invaderFireRate;

      this.invaders = [];
      this.directionX = 1; // 1 = right, -1 = left
      this.animFrame = 0;
      this.moveSoundIndex = 1;
      
      this.moveTimer = 0;
      this.shootTimer = 0;
      this.resetShootTimer();

      // Horizontal step size per tick (pixels)
      this.stepSizeX = 12;

      this.initFleet();
    }

    initFleet() {
      const rows = GameConfig.INVADER.rows;
      const cols = GameConfig.INVADER.cols;
      const width = GameConfig.INVADER.width;
      const height = GameConfig.INVADER.height;
      const gapX = GameConfig.INVADER.gapX;
      const gapY = GameConfig.INVADER.gapY;
      const startX = GameConfig.INVADER.startX;
      const startY = GameConfig.INVADER.startY;

      this.invaders = [];

      for (let r = 0; r < rows; r++) {
        // Row 0 = top (30pts), Rows 1-2 = mid (20pts), Rows 3-4 = bottom (10pts)
        let type = 2; // bottom
        if (r === 0) type = 0; // top
        else if (r === 1 || r === 2) type = 1; // mid

        for (let c = 0; c < cols; c++) {
          const x = startX + c * (width + gapX);
          const y = startY + r * (height + gapY);
          this.invaders.push(new Invader(x, y, r, c, type));
        }
      }
    }

    getAliveCount() {
      return this.invaders.filter(inv => inv.alive).length;
    }

    getTotalCount() {
      return this.invaders.length;
    }

    resetShootTimer() {
      // Shoot every 0.8 to 2.5 seconds based on difficulty fire rate
      const baseMin = 1.0 / this.speedMultiplier;
      const baseMax = 3.0 / this.speedMultiplier;
      this.shootTimer = GameHelpers.randomRange(baseMin, baseMax);
    }

    update(dt, playerY, onShoot, onReachBottom) {
      const aliveCount = this.getAliveCount();
      if (aliveCount === 0) return;

      const totalCount = this.getTotalCount();
      
      // Calculate marching tick rate based on remaining aliens
      // Fewer aliens = much faster tick rate.
      const ratio = aliveCount / totalCount;
      const baseTickRate = 0.05 + 0.85 * ratio; // goes from 0.9s down to 0.05s
      const tickRate = baseTickRate / this.speedMultiplier;

      // 1. STEPPED MOVEMENT
      this.moveTimer += dt;
      if (this.moveTimer >= tickRate) {
        this.moveTimer -= tickRate;
        this.stepFleet(onReachBottom, playerY);
      }

      // 2. PROJECTILE FIRING
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.resetShootTimer();
        this.fireInvaderBullet(onShoot);
      }
    }

    stepFleet(onReachBottom, playerY) {
      const aliveInvaders = this.invaders.filter(inv => inv.alive);
      const margin = 15;
      const canvasWidth = GameConfig.CANVAS_WIDTH;
      let shouldDescend = false;

      // Check if moving sideways will hit boundaries
      for (const inv of aliveInvaders) {
        const nextX = inv.x + this.directionX * this.stepSizeX;
        if (nextX <= margin || nextX + inv.width >= canvasWidth - margin) {
          shouldDescend = true;
          break;
        }
      }

      if (shouldDescend) {
        // Descend and reverse direction
        this.directionX *= -1;
        for (const inv of this.invaders) {
          inv.y += GameConfig.INVADER.descendAmount;
          
          // Check if invader has invaded player line or bottom
          if (inv.alive && (inv.y + inv.height >= playerY)) {
            onReachBottom();
            return;
          }
        }
      } else {
        // Move sideways
        for (const inv of this.invaders) {
          inv.x += this.directionX * this.stepSizeX;
        }
      }

      // Step animation frame
      this.animFrame = 1 - this.animFrame;

      // Cycle retro sound step
      window.AudioManager.playSfx(`invader-move-${this.moveSoundIndex}`);
      this.moveSoundIndex = (this.moveSoundIndex % 4) + 1;
    }

    fireInvaderBullet(onShoot) {
      // Find bottom-most invaders in each column
      const columnsMap = {};
      
      for (const inv of this.invaders) {
        if (!inv.alive) continue;
        if (!columnsMap[inv.col] || columnsMap[inv.col].row < inv.row) {
          columnsMap[inv.col] = inv;
        }
      }

      const shootingAliens = Object.values(columnsMap);
      if (shootingAliens.length === 0) return;

      // Roll chance to fire based on difficulty rate
      const roll = Math.random();
      // Adjust shooting frequency slightly based on column size
      if (roll < this.fireRate * 40) {
        const shooter = GameHelpers.randomChoice(shootingAliens);
        const bulletX = shooter.x + shooter.width / 2;
        const bulletY = shooter.y + shooter.height;
        onShoot(new Bullet(bulletX, bulletY, false));
      }
    }

    draw(ctx, colors) {
      for (const inv of this.invaders) {
        inv.draw(ctx, colors, this.animFrame);
      }
    }

    // Capture state for game saving
    getState() {
      return this.invaders.map(inv => ({
        row: inv.row,
        col: inv.col,
        alive: inv.alive,
        x: inv.x,
        y: inv.y
      }));
    }

    // Apply state from game save
    loadState(fleetState) {
      // Match each saved invader back to current grid
      for (const saved of fleetState) {
        const matching = this.invaders.find(inv => inv.row === saved.row && inv.col === saved.col);
        if (matching) {
          matching.alive = saved.alive;
          matching.x = saved.x;
          matching.y = saved.y;
        }
      }
    }
  }

  window.InvaderFleet = InvaderFleet;
})();
