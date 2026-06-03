/* js/entities/barrier.js */
(function() {
  // Classic space invaders bunker arch shape
  // 1 = solid block, 0 = empty space
  const SHIELD_LAYOUT = [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1]
  ];

  class Barrier {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.pixelSize = GameConfig.BARRIER.pixelSize;
      
      this.rows = GameConfig.BARRIER.gridRows;
      this.cols = GameConfig.BARRIER.gridCols;
      
      this.width = this.cols * this.pixelSize;
      this.height = this.rows * this.pixelSize;
      
      this.grid = [];
      this.initGrid();
    }

    initGrid() {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        this.grid[r] = [];
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = SHIELD_LAYOUT[r][c]; // 1 or 0
        }
      }
    }

    // Check collision with a bullet
    checkBulletCollision(bullet) {
      if (!bullet.active) return false;

      // Quick bounding box check for whole barrier first
      const barrierBox = { x: this.x, y: this.y, width: this.width, height: this.height };
      if (!GameHelpers.boxCollision(bullet, barrierBox)) return false;

      // Detailed check on individual pixel blocks
      // Iterate from bottom up for invader bullets, and top down for player bullets
      // (makes erosion patterns feel more realistic)
      const isPlayerBullet = bullet.isPlayerOwned;
      const startRow = isPlayerBullet ? this.rows - 1 : 0;
      const endRow = isPlayerBullet ? -1 : this.rows;
      const step = isPlayerBullet ? -1 : 1;

      for (let r = startRow; r !== endRow; r += step) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c] === 1) {
            const blockBox = {
              x: this.x + c * this.pixelSize,
              y: this.y + r * this.pixelSize,
              width: this.pixelSize,
              height: this.pixelSize
            };

            if (GameHelpers.boxCollision(bullet, blockBox)) {
              // Destroy block
              this.grid[r][c] = 0;
              bullet.active = false;
              window.AudioManager.playSfx('barrier-hit');
              return true; // Collided
            }
          }
        }
      }

      return false;
    }

    // Alien overlapping destroys the barrier blocks
    checkInvaderOverlap(invader) {
      if (!invader.alive) return;

      const barrierBox = { x: this.x, y: this.y, width: this.width, height: this.height };
      if (!GameHelpers.boxCollision(invader, barrierBox)) return;

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c] === 1) {
            const blockBox = {
              x: this.x + c * this.pixelSize,
              y: this.y + r * this.pixelSize,
              width: this.pixelSize,
              height: this.pixelSize
            };

            if (GameHelpers.boxCollision(invader, blockBox)) {
              this.grid[r][c] = 0; // Erode block immediately
            }
          }
        }
      }
    }

    draw(ctx, colors) {
      ctx.fillStyle = colors.barrier;
      ctx.shadowColor = colors.barrier;
      
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c] === 1) {
            ctx.fillRect(
              this.x + c * this.pixelSize,
              this.y + r * this.pixelSize,
              this.pixelSize,
              this.pixelSize
            );
          }
        }
      }
      ctx.shadowBlur = 0;
    }

    // Capture state for saving
    getState() {
      return this.grid.map(row => [...row]);
    }

    // Load state from save
    loadState(gridState) {
      if (gridState && gridState.length === this.rows) {
        this.grid = gridState.map(row => [...row]);
      }
    }
  }

  window.Barrier = Barrier;
})();
