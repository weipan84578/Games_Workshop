/* js/entities/invader.js */
(function() {
  // Pixel art templates for 3 invader types, each with 2 animation states
  const SPRITES = {
    // Type 0 (Top row - Squid/Octopus)
    0: [
      // Frame A (8 x 8)
      [
        [0,0,0,1,1,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,0,1,0,0,1,0,0],
        [0,1,0,1,1,0,1,0],
        [1,0,1,0,0,1,0,1]
      ],
      // Frame B (8 x 8)
      [
        [0,0,0,1,1,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,0,1,1,0,1,0],
        [1,0,0,0,0,0,0,1],
        [0,1,0,0,0,0,1,0]
      ]
    ],
    // Type 1 (Middle rows - Crab)
    1: [
      // Frame A (11 x 8)
      [
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [0,0,0,1,1,0,1,1,0,0,0]
      ],
      // Frame B (11 x 8)
      [
        [0,0,1,0,0,0,0,0,1,0,0],
        [1,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,0,0,0,1,0]
      ]
    ],
    // Type 2 (Bottom rows - Jellyfish)
    2: [
      // Frame A (12 x 8)
      [
        [0,0,0,0,1,1,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,0,0,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,1,1,0,1,1,0,0],
        [1,1,0,0,0,0,0,0,0,0,1,1]
      ],
      // Frame B (12 x 8)
      [
        [0,0,0,0,1,1,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,0,0,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,0,0,1,1,1,0,0],
        [0,1,1,0,0,1,1,0,0,1,1,0],
        [0,0,0,1,1,0,0,1,1,0,0,0]
      ]
    ]
  };

  class Invader {
    constructor(x, y, row, col, type) {
      this.x = x;
      this.y = y;
      this.width = GameConfig.INVADER.width;
      this.height = GameConfig.INVADER.height;
      this.row = row;
      this.col = col;
      this.type = type; // 0 (top), 1 (middle), 2 (bottom)
      this.points = GameConfig.INVADER.points[row] || 10;
      this.alive = true;
    }

    draw(ctx, colors, animFrame) {
      if (!this.alive) return;

      const sprite = SPRITES[this.type][animFrame];
      const px = this.width / sprite[0].length;
      const py = this.height / sprite.length;

      ctx.fillStyle = colors.enemy;
      ctx.shadowColor = colors.enemy;
      ctx.shadowBlur = 1; // Soft glow

      for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
          if (sprite[r][c] === 1) {
            ctx.fillRect(
              this.x + c * px, 
              this.y + r * py, 
              Math.ceil(px), 
              Math.ceil(py)
            );
          }
        }
      }
      ctx.shadowBlur = 0; // Reset shadow
    }
  }

  window.Invader = Invader;
})();
