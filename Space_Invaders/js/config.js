/* js/config.js */
(function() {
  window.GameConfig = {
    // Canvas Logic Size
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 1000,
    
    // FPS target (for deltaTime fallback)
    TARGET_FPS: 60,

    // Difficulty Settings
    DIFFICULTIES: {
      easy: {
        label: '簡單',
        invaderSpeedMultiplier: 0.7,
        invaderFireRate: 0.005, // Lower means less frequent shooting
        playerLives: 4,
      },
      normal: {
        label: '普通',
        invaderSpeedMultiplier: 1.0,
        invaderFireRate: 0.012,
        playerLives: 3,
      },
      hard: {
        label: '困難',
        invaderSpeedMultiplier: 1.4,
        invaderFireRate: 0.022,
        playerLives: 2,
      }
    },

    // Player Settings
    PLAYER: {
      width: 48,
      height: 28,
      speed: 300,            // Pixels per second
      shootCooldown: 500,    // ms between shots
      extraLifeScore: 10000, // Points to earn an extra life
    },

    // Invader Settings
    INVADER: {
      rows: 5,
      cols: 11,
      width: 36,
      height: 28,
      gapX: 16,
      gapY: 16,
      startX: 50,
      startY: 120,
      baseSpeedX: 40,        // Horizontal speed pixels/sec (increases as fleet thins)
      descendAmount: 24,     // Drop distance when hitting walls
      points: [30, 20, 20, 10, 10], // Score for rows from top to bottom
    },

    // Bullet Settings
    BULLET: {
      width: 4,
      height: 12,
      playerSpeed: -600,     // Negative moves up
      invaderSpeed: 300,     // Positive moves down
    },

    // Shield/Barrier Settings
    BARRIER: {
      count: 4,
      width: 72,
      height: 48,
      y: 800,                // Vertical position on canvas
      gridRows: 6,           // Grid resolution for destructible barriers
      gridCols: 9,
      pixelSize: 8,          // Width/height of each sub-block
    },

    // UFO Settings
    UFO: {
      width: 60,
      height: 24,
      speed: 180,            // Pixels per second
      y: 60,                 // Flight height
      spawnIntervalMin: 15000, // ms
      spawnIntervalMax: 30000, // ms
      scores: [50, 100, 150, 300], // Random values
    },

    // Available Themes
    THEMES: [
      { id: 'classic-green', name: '經典綠' },
      { id: 'amber', name: '復古琥珀' },
      { id: 'neon-purple', name: '霓虹紫' },
      { id: 'ocean-blue', name: '海洋藍' },
      { id: 'high-contrast', name: '高對比' }
    ]
  };
})();
