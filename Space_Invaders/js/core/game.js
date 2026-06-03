/* js/core/game.js */
(function() {
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      // Sync logical dimensions
      this.canvas.width = GameConfig.CANVAS_WIDTH;
      this.canvas.height = GameConfig.CANVAS_HEIGHT;

      // Entities
      this.player = null;
      this.fleet = null;
      this.ufo = null;
      this.barriers = [];
      this.bullets = [];

      // States
      this.score = 0;
      this.level = 1;
      this.lives = 3;
      this.difficulty = 'normal';
      this.isGameOver = false;
      this.extraLifeEarnedCount = 0;

      // Active Theme colors mapping (will be updated on sync)
      this.colors = {};
      this.syncColors();

      // Setup Game Loop
      this.loop = new GameLoop(
        (dt) => this.update(dt),
        () => this.draw()
      );

      // Bind HUD updater (to be set by HUD module)
      this.onHudUpdate = null;
      this.onStateChange = null;
    }

    // Connect color schemes from settings
    syncColors() {
      const currentTheme = GameStorage.getSettings().theme || 'classic-green';
      const themes = {
        'classic-green': { bg: '#000000', fg: '#00ff66', accent: '#00ff66', enemy: '#00ff66', player: '#ffffff', danger: '#ff3333', barrier: '#00ff66' },
        'amber': { bg: '#1a0f00', fg: '#ffb000', accent: '#ffd166', enemy: '#ff8800', player: '#fff4d6', danger: '#ff4d4d', barrier: '#ffb000' },
        'neon-purple': { bg: '#0d0221', fg: '#b388ff', accent: '#ff2a6d', enemy: '#7c4dff', player: '#00e5ff', danger: '#ff1744', barrier: '#ff2a6d' },
        'ocean-blue': { bg: '#001018', fg: '#29b6f6', accent: '#00e5ff', enemy: '#4fc3f7', player: '#e0f7fa', danger: '#ff5252', barrier: '#29b6f6' },
        'high-contrast': { bg: '#000000', fg: '#ffffff', accent: '#ffff00', enemy: '#ffffff', player: '#00ffff', danger: '#ff0000', barrier: '#ffffff' }
      };
      this.colors = themes[currentTheme] || themes['classic-green'];
    }

    initNewGame() {
      const settings = GameStorage.getSettings();
      this.difficulty = settings.difficulty;
      
      const diffConfig = GameConfig.DIFFICULTIES[this.difficulty] || GameConfig.DIFFICULTIES.normal;
      
      this.score = 0;
      this.level = 1;
      this.lives = diffConfig.playerLives;
      this.extraLifeEarnedCount = 0;
      this.isGameOver = false;

      this.player = new Player();
      this.fleet = new InvaderFleet(this.difficulty);
      this.ufo = new Ufo();
      this.bullets = [];

      this.initBarriers();
      this.syncColors();
      this.updateHud();
      GameStorage.clearGameSave();
    }

    initBarriers() {
      this.barriers = [];
      const numBarriers = GameConfig.BARRIER.count;
      const barrierWidth = GameConfig.BARRIER.width;
      const y = GameConfig.BARRIER.y;

      // Evenly distribute 4 barriers along 800px width
      // Spacing algorithm: (CanvasWidth - count * barrierWidth) / (count + 1)
      const spacing = (GameConfig.CANVAS_WIDTH - numBarriers * barrierWidth) / (numBarriers + 1);

      for (let i = 0; i < numBarriers; i++) {
        const x = spacing + i * (barrierWidth + spacing);
        this.barriers.push(new Barrier(x, y));
      }
    }

    loadSavedGame(saveData) {
      this.score = saveData.score;
      this.level = saveData.level;
      this.lives = saveData.lives;
      this.difficulty = saveData.difficulty;
      this.extraLifeEarnedCount = Math.floor(this.score / GameConfig.PLAYER.extraLifeScore);
      this.isGameOver = false;

      this.player = new Player();
      this.ufo = new Ufo();
      this.bullets = [];

      // Restore Fleet Grid
      this.fleet = new InvaderFleet(this.difficulty);
      if (saveData.fleetState) {
        this.fleet.loadState(saveData.fleetState);
      }

      // Restore Bunkers
      this.initBarriers();
      if (saveData.barriersState) {
        this.barriers.forEach((barrier, index) => {
          if (saveData.barriersState[index]) {
            barrier.loadState(saveData.barriersState[index]);
          }
        });
      }

      this.syncColors();
      this.updateHud();
    }

    saveCurrentProgress() {
      if (this.isGameOver || this.lives <= 0) return;

      const saveData = {
        level: this.level,
        score: this.score,
        lives: this.lives,
        difficulty: this.difficulty,
        fleetState: this.fleet.getState(),
        barriersState: this.barriers.map(b => b.getState())
      };

      try {
        localStorage.setItem('si_save', JSON.stringify(saveData));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    }

    startNextLevel() {
      this.level++;
      
      // Keep existing score, player lives, and repair shield blocks
      this.player.resetPosition();
      this.fleet = new InvaderFleet(this.difficulty);
      
      // Speed multiplier scales up slowly with levels (10% extra speed per wave)
      const scale = 1 + (this.level - 1) * 0.1;
      this.fleet.speedMultiplier *= scale;
      // Cap speed multiplier at 2.5 times difficulty base
      if (this.fleet.speedMultiplier > 2.5) {
        this.fleet.speedMultiplier = 2.5;
      }

      // Also aliens shoot slightly more often on higher waves
      this.fleet.fireRate *= 1.15;
      if (this.fleet.fireRate > 0.08) {
        this.fleet.fireRate = 0.08;
      }

      this.ufo = new Ufo();
      this.bullets = [];

      // fully restore bunkers for next wave
      this.initBarriers();
      
      this.updateHud();
      window.AudioManager.playSfx('level-up');
      
      // Auto save on entering next wave
      this.saveCurrentProgress();
    }

    update(dt) {
      if (this.isGameOver) return;

      // 1. Update Player (handles explosion timers)
      const wasExploding = this.player.isExploding;
      this.player.update(dt, GameInput.actions, (bullet) => {
        this.bullets.push(bullet);
      });

      // If player finished exploding during this frame
      if (wasExploding && !this.player.isExploding) {
        if (this.lives <= 0) {
          this.triggerGameOver();
          return;
        } else {
          this.player.resetPosition();
        }
      }

      // If player is currently exploding, freeze main simulation
      if (this.player.isExploding) {
        return; 
      }

      // 2. Update UFO
      this.ufo.update(dt);

      // 3. Update Invader Fleet (and check if they land at player's y coordinate)
      this.fleet.update(
        dt, 
        this.player.y, 
        (bullet) => this.bullets.push(bullet),
        () => this.triggerGameOver() // Fleet reached player bottom
      );

      // If all aliens destroyed, trigger next wave!
      if (this.fleet.getAliveCount() === 0) {
        this.startNextLevel();
        return;
      }

      // 4. Update Projectiles
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const bullet = this.bullets[i];
        bullet.update(dt);
        
        if (!bullet.active) {
          this.bullets.splice(i, 1);
        }
      }

      // 5. Collision Checks
      this.resolveCollisions();
    }

    resolveCollisions() {
      // Loop bullets
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const bullet = this.bullets[i];
        if (!bullet.active) continue;

        if (bullet.isPlayerOwned) {
          // PLAYER BULLET COLLISIONS
          
          // A. Check hit against UFO
          const ufoPoints = this.ufo.checkBulletCollision(bullet);
          if (ufoPoints) {
            this.addScore(ufoPoints);
            this.bullets.splice(i, 1);
            continue;
          }

          // B. Check hit against Invader fleet
          let hitAlien = false;
          for (const invader of this.fleet.invaders) {
            if (!invader.alive) continue;
            
            const invBox = { x: invader.x, y: invader.y, width: invader.width, height: invader.height };
            if (GameHelpers.boxCollision(bullet, invBox)) {
              invader.alive = false;
              bullet.active = false;
              hitAlien = true;
              
              this.addScore(invader.points);
              window.AudioManager.playSfx('invader-killed');
              break;
            }
          }
          if (hitAlien) {
            this.bullets.splice(i, 1);
            continue;
          }

          // C. Check hit against Bunker Shields
          for (const barrier of this.barriers) {
            if (barrier.checkBulletCollision(bullet)) {
              this.bullets.splice(i, 1);
              break;
            }
          }

        } else {
          // INVADER BULLET COLLISIONS
          
          // A. Check hit against Player Tank
          const playerBox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };
          if (GameHelpers.boxCollision(bullet, playerBox)) {
            bullet.active = false;
            this.bullets.splice(i, 1);
            
            this.lives--;
            this.updateHud();
            this.player.triggerExplosion();
            
            if (this.lives <= 0) {
              // Wait until explosion animation finishes to show game over
            }
            break;
          }

          // B. Check hit against Bunker Shields
          for (const barrier of this.barriers) {
            if (barrier.checkBulletCollision(bullet)) {
              this.bullets.splice(i, 1);
              break;
            }
          }
        }
      }

      // 6. Check alien grid collision overlay on barriers
      for (const invader of this.fleet.invaders) {
        if (!invader.alive) continue;
        for (const barrier of this.barriers) {
          barrier.checkInvaderOverlap(invader);
        }
      }
    }

    addScore(points) {
      this.score += points;
      this.updateHud();

      // Extra life every 10k score points
      const threshold = GameConfig.PLAYER.extraLifeScore;
      const targetMilestone = Math.floor(this.score / threshold);
      
      if (targetMilestone > this.extraLifeEarnedCount) {
        this.lives++;
        this.extraLifeEarnedCount = targetMilestone;
        this.updateHud();
        window.AudioManager.playSfx('extra-life');
      }
    }

    updateHud() {
      if (this.onHudUpdate) {
        const highScore = Math.max(this.score, GameStorage.getHighScore());
        this.onHudUpdate(this.score, highScore, this.lives, this.level);
      }
    }

    triggerGameOver() {
      this.isGameOver = true;
      this.loop.stop();
      this.ufo.deactivate();

      // Check record highscores
      const isNewHighScore = GameStorage.saveHighScore(this.score);
      GameStorage.clearGameSave();

      if (this.onStateChange) {
        this.onStateChange('GAMEOVER', {
          score: this.score,
          highscore: GameStorage.getHighScore(),
          isNewRecord: isNewHighScore
        });
      }
    }

    draw() {
      // Clear Canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw barriers
      for (const barrier of this.barriers) {
        barrier.draw(this.ctx, this.colors);
      }

      // Draw bullets
      for (const bullet of this.bullets) {
        bullet.draw(this.ctx, this.colors);
      }

      // Draw Player Tank
      this.player.draw(this.ctx, this.colors);

      // Draw Invaders
      this.fleet.draw(this.ctx, this.colors);

      // Draw UFO & float text popups
      this.ufo.draw(this.ctx, this.colors);
    }
  }

  window.Game = Game;
})();
