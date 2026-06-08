(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;
  const TILE = root.TILE;

  class Game {
    constructor() {
      this.settings = root.SaveManager.getSettings();
      document.documentElement.setAttribute("data-theme", this.settings.theme);
      this.stateManager = new root.StateManager();
      this.modal = new root.Modal();
      this.notifier = new root.Notifier(document.getElementById("notification-layer"));
      this.audio = new root.AudioEngine(this.settings);
      this.music = new root.MusicPlayer(this.audio);
      this.input = new root.InputManager(this.settings);
      this.mainMenu = new root.MainMenu(this);
      this.loop = new root.GameLoop((dt) => this.update(dt), () => this.render());
      this.mode = "MENU";
      this.stage = 1;
      this.score = 0;
      this.deaths = 0;
      this.elapsed = 0;
      this.stageElapsed = 0;
      this.spawnTimer = 0;
      this.finishNoticeShown = false;
      this.nextEnemyId = 1;
      this.buildGameScreen();
      this.showMenu();
      document.addEventListener("pointerdown", () => this.ensureAudio(), true);
      window.addEventListener("beforeunload", () => this.saveCurrentGame());
    }

    ensureAudio() {
      this.audio.unlock();
      if (!this.music.currentTrack) this.music.switchBGM("bgm_menu");
    }

    showMenu() {
      this.loop.stop();
      this.mode = "MENU";
      this.stateManager.show("menu");
      this.mainMenu.render();
      this.music.switchBGM("bgm_menu");
    }

    buildGameScreen() {
      const host = document.getElementById("screen-game");
      host.innerHTML = `
        <div class="screen-shell game-shell">
          <div class="game-topbar">
            <button class="icon-btn" data-game-menu title="返回選單">≡</button>
            <div id="hud-root"></div>
            <button class="icon-btn" data-game-pause title="暫停">Ⅱ</button>
          </div>
          <div class="canvas-frame">
            <canvas id="game-canvas" width="${root.CONFIG.baseWidth}" height="${root.CONFIG.baseHeight}"></canvas>
            <div class="game-overlay-label" data-stage-label></div>
          </div>
          <div id="touch-root"></div>
        </div>
      `;
      this.hud = new root.HUD(document.getElementById("hud-root"));
      this.renderer = new root.TileRenderer(document.getElementById("game-canvas"));
      this.virtualJoystick = new root.VirtualJoystick(document.getElementById("touch-root"), this.input.touch, this);
      host.querySelector("[data-game-menu]").addEventListener("click", () => this.pause(true));
      host.querySelector("[data-game-pause]").addEventListener("click", () => this.pause());
    }

    requestNewGame() {
      this.ensureAudio();
      this.audio.play("sfx_ui_click");
      if (root.SaveManager.getGame()) {
        this.modal.confirm("確定要從第 1 關重新開始？舊存檔會被覆蓋。", () => this.newGame());
      } else {
        this.newGame();
      }
    }

    newGame() {
      root.SaveManager.clearGame();
      this.audio.play("sfx_ui_start");
      this.deaths = 0;
      this.score = 0;
      this.loadStage(1, {
        lives: root.CONFIG.startLives,
        score: 0,
        powerups: {
          bombCount: root.CONFIG.startBombs,
          fireRange: root.CONFIG.startFireRange,
          speed: root.CONFIG.startSpeed,
          shield: false,
          remoteCtrl: false,
          pierce: false
        }
      });
    }

    continueGame() {
      this.ensureAudio();
      const save = root.SaveManager.getGame();
      if (!save) return;
      this.audio.play("sfx_ui_resume");
      this.deaths = save.deaths || 0;
      this.score = save.score || 0;
      this.loadStage(save.stage, save);
    }

    startAtStage(stage) {
      this.ensureAudio();
      this.deaths = 0;
      this.score = 0;
      this.loadStage(stage, {
        lives: root.CONFIG.startLives,
        score: 0,
        powerups: {
          bombCount: root.CONFIG.startBombs,
          fireRange: root.CONFIG.startFireRange,
          speed: root.CONFIG.startSpeed,
          shield: false,
          remoteCtrl: false,
          pierce: false
        }
      });
    }

    loadStage(stage, save) {
      const loaded = root.LevelLoader.create(stage);
      this.config = loaded.config;
      this.map = loaded.map;
      this.stage = stage;
      this.score = save.score || this.score || 0;
      this.timeLimit = this.config.timeLimit || 0;
      this.timeLeft = this.timeLimit;
      this.stageElapsed = 0;
      this.spawnTimer = 0;
      this.finishNoticeShown = false;
      this.bombs = [];
      this.explosions = [];
      this.powerups = [];
      this.player = new root.Player(save);
      this.enemies = this.config.enemies.map((type, index) => {
        const spawn = this.map.meta.enemySpawns[index] || { x: 13, y: 11 };
        return this.createEnemy(type, spawn.x, spawn.y);
      });
      this.stateManager.show("game");
      this.mode = "PLAYING";
      this.loop.start();
      this.music.switchBGM(this.trackForStage(stage));
      this.audio.play(stage === 25 ? "sfx_boss_appear" : "sfx_stage_start");
      document.querySelector("[data-stage-label]").textContent = this.config.name;
      this.hud.update(this);
    }

    createEnemy(type, x, y) {
      const enemy = new root.Enemy(type, x, y, this.stage * 100 + this.nextEnemyId);
      enemy.id = "enemy-" + this.nextEnemyId;
      this.nextEnemyId += 1;
      return enemy;
    }

    trackForStage(stage) {
      if (stage === 25) return "bgm_boss";
      if (stage >= 11) return "bgm_game_hard";
      return "bgm_game_easy";
    }

    update(dt) {
      this.elapsed += dt;
      if (this.mode !== "PLAYING") return;
      this.stageElapsed += dt;
      const input = this.input.getSnapshot();
      if (input.pause) {
        this.pause();
        return;
      }
      if (this.timeLimit) {
        this.timeLeft -= dt / 1000;
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.player.hurt(this);
          return;
        }
      }
      if (input.bomb) this.handleBombAction();
      this.player.update(dt, input, this);
      this.bombs.slice().forEach((bomb) => bomb.update(dt, this));
      this.explosions.forEach((explosion) => explosion.update(dt));
      this.explosions = this.explosions.filter((explosion) => explosion.isAlive());
      this.enemies.slice().forEach((enemy) => enemy.update(dt, this));
      this.checkExplosionDamage();
      this.checkEnemyContact();
      this.handleTimedSpawns(dt);
      this.checkStageClear();
      this.hud.update(this);
    }

    render() {
      this.renderer.draw(this);
    }

    canMoveRect(rect, options) {
      const opts = options || {};
      const tiles = root.CollisionDetector.tilesForRect(rect);
      for (let i = 0; i < tiles.length; i += 1) {
        const tile = tiles[i];
        if (!this.map.isWalkable(tile.x, tile.y, opts.allowPhase)) return false;
        const bomb = this.bombAt(tile.x, tile.y);
        if (bomb && H.tileKey(tile.x, tile.y) !== opts.ignoreBombKey && !opts.allowPhase) return false;
      }
      return true;
    }

    bombAt(x, y) {
      return this.bombs.find((bomb) => !bomb.exploded && bomb.x === x && bomb.y === y) || null;
    }

    handleBombAction() {
      const tile = H.centerTile(this.player);
      const playerBombs = this.bombs.filter((bomb) => bomb.owner === this.player);
      if (this.player.remoteCtrl && playerBombs.length >= this.player.bombsMax) {
        this.explodeBomb(playerBombs[0], true);
        return;
      }
      if (playerBombs.length >= this.player.bombsMax) {
        this.notify("炸彈數已達上限");
        return;
      }
      if (this.bombAt(tile.x, tile.y) || !this.map.isWalkable(tile.x, tile.y, false)) return;
      const bomb = new root.Bomb(this.player, tile.x, tile.y);
      this.player.ignoreBombKey = H.tileKey(tile.x, tile.y);
      this.bombs.push(bomb);
      this.audio.play("sfx_bomb_place");
      this.vibrate(20);
    }

    explodeBomb(bomb, chain) {
      if (!bomb || bomb.exploded) return;
      bomb.exploded = true;
      this.bombs = this.bombs.filter((item) => item !== bomb);
      const cells = [{ x: bomb.x, y: bomb.y }];
      root.DIRECTIONS.forEach((dir) => {
        for (let step = 1; step <= bomb.range; step += 1) {
          const x = bomb.x + dir.x * step;
          const y = bomb.y + dir.y * step;
          const tile = this.map.get(x, y);
          if (tile === TILE.WALL) break;
          cells.push({ x, y });
          const chained = this.bombAt(x, y);
          if (chained) setTimeout(() => this.explodeBomb(chained, true), root.BOMB_CONFIG.chainDelay);
          if (tile === TILE.BRICK) {
            const hidden = this.map.destroyBrick(x, y);
            this.audio.play("sfx_brick_destroy");
            if (hidden && hidden.kind === "powerup") this.powerups.push(new root.PowerUp(hidden.type, x, y));
            if (hidden && hidden.kind === "exit") this.notify("出口開啟");
            if (!bomb.pierce) break;
          }
        }
      });
      this.explosions.push(new root.Explosion(cells));
      this.audio.play(chain ? "sfx_explosion_chain" : "sfx_explosion");
      this.vibrate(chain ? 50 : 35);
      this.checkExplosionDamage();
    }

    checkExplosionDamage() {
      this.explosions.forEach((explosion) => {
        const playerTile = H.centerTile(this.player);
        if (!explosion.hitKeys.has("player") && explosion.containsTile(playerTile.x, playerTile.y)) {
          explosion.hitKeys.add("player");
          this.player.hurt(this);
        }
        this.enemies.slice().forEach((enemy) => {
          const tile = H.centerTile(enemy);
          const key = enemy.id;
          if (!explosion.hitKeys.has(key) && explosion.containsTile(tile.x, tile.y)) {
            explosion.hitKeys.add(key);
            enemy.hurt(this);
          }
        });
      });
    }

    checkEnemyContact() {
      this.enemies.forEach((enemy) => {
        if (H.rectsOverlap(this.player, enemy)) this.player.hurt(this);
      });
    }

    defeatEnemy(enemy) {
      this.enemies = this.enemies.filter((item) => item !== enemy);
      const def = root.ENEMY_TYPES[enemy.type];
      this.score += root.SCORE[def.scoreKey] || 100;
      this.audio.play("sfx_enemy_die");
      this.notify(def.label + " defeated");
    }

    onPlayerDeath() {
      if (this.mode !== "PLAYING") return;
      this.deaths += 1;
      if (this.player.lives <= 0) {
        this.gameOver(false);
        return;
      }
      this.mode = "DYING";
      const save = {
        lives: this.player.lives,
        score: this.score,
        powerups: this.player.snapshotPowerups(),
        deaths: this.deaths
      };
      this.notify("生命 -1");
      setTimeout(() => this.loadStage(this.stage, save), 1000);
    }

    handleTimedSpawns(dt) {
      if (!this.config.spawnEvery) return;
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.config.spawnEvery.seconds * 1000 && this.enemies.length < 9) {
        this.spawnTimer = 0;
        this.spawnEnemyNear(this.config.spawnEvery.type, { x: 13, y: 11 });
      }
    }

    spawnEnemyNear(type, origin) {
      const candidates = [];
      for (let y = 1; y < this.map.height - 1; y += 1) {
        for (let x = 1; x < this.map.width - 1; x += 1) {
          if (!this.map.isWalkable(x, y, false) || this.bombAt(x, y)) continue;
          if (Math.abs(x - origin.x) + Math.abs(y - origin.y) < 3) candidates.push({ x, y });
        }
      }
      const tile = candidates[0] || { x: 13, y: 11 };
      this.enemies.push(this.createEnemy(type, tile.x, tile.y));
      this.notify("敵人增援");
    }

    checkStageClear() {
      if (!this.enemies.length) {
        if (this.stage === 25) {
          this.completeStage();
          return;
        }
        if (!this.map.exitRevealed && !this.finishNoticeShown) {
          this.finishNoticeShown = true;
          this.map.revealExitFallback();
          this.notify("敵人全滅，出口開啟");
        }
        const tile = H.centerTile(this.player);
        if (this.map.get(tile.x, tile.y) === TILE.EXIT) this.completeStage();
      }
    }

    completeStage() {
      if (this.mode !== "PLAYING") return;
      this.mode = "LEVEL_UP";
      const timeBonus = this.timeLimit ? Math.ceil(this.timeLeft) * root.SCORE.time_bonus : 0;
      this.score += root.SCORE.clear_stage + timeBonus;
      const rank = this.rank();
      root.SaveManager.saveScore({ score: this.score, stage: this.stage, rank, cleared: true });
      this.audio.play("sfx_stage_clear");
      this.hud.update(this);

      if (this.stage >= 25) {
        root.SaveManager.clearGame();
        setTimeout(() => this.gameOver(true, rank), 900);
        return;
      }

      const nextSave = {
        stage: this.stage + 1,
        lives: this.player.lives,
        score: this.score,
        powerups: this.player.snapshotPowerups(),
        deaths: this.deaths
      };
      root.SaveManager.saveGame(nextSave);
      this.modal.open({
        title: "Stage " + this.stage + " Clear",
        body: `
          <p>${this.config.name}</p>
          <p>Rank: <strong>${rank}</strong></p>
          <p>Score: ${H.formatScore(this.score)}</p>
          <p>下一關進度已自動存檔。</p>
        `,
        onClose: () => {
          if (this.mode === "LEVEL_UP") this.showMenu();
        },
        actions: [
          { label: "返回選單", className: "btn-secondary", action: () => { this.modal.close(); this.showMenu(); } },
          { label: "下一關", className: "btn-primary", action: () => { this.modal.close(); this.loadStage(this.stage + 1, nextSave); } }
        ]
      });
    }

    rank() {
      if (this.deaths === 0 && (!this.timeLimit || this.timeLeft > this.timeLimit * 0.5)) return "S";
      if (this.deaths <= 1 && (!this.timeLimit || this.timeLeft > this.timeLimit * 0.3)) return "A";
      if (this.deaths <= 2) return "B";
      return "C";
    }

    pause(forceMenu) {
      if (this.mode !== "PLAYING") return;
      this.mode = "PAUSED";
      this.saveCurrentGame();
      if (forceMenu) {
        this.modal.open({
          title: "確認",
          body: "<p>離開本關並返回主選單？目前進度已存檔。</p>",
          onClose: () => {
            if (this.mode === "PAUSED") this.mode = "PLAYING";
          },
          actions: [
            { label: "取消", className: "btn-secondary", action: () => this.modal.close() },
            { label: "返回選單", className: "btn-primary", action: () => { this.modal.close(); this.showMenu(); } }
          ]
        });
        return;
      }
      this.modal.open({
        title: "暫停",
        body: "<p>目前進度已存檔。</p>",
        onClose: () => {
          if (this.mode === "PAUSED") this.mode = "PLAYING";
        },
        actions: [
          { label: "返回選單", className: "btn-secondary", action: () => { this.modal.close(); this.showMenu(); } },
          { label: "繼續", className: "btn-primary", action: () => { this.modal.close(); this.mode = "PLAYING"; } }
        ]
      });
    }

    gameOver(victory, rank) {
      this.loop.stop();
      this.mode = "GAME_OVER";
      root.SaveManager.saveScore({ score: this.score, stage: this.stage, rank: rank || this.rank(), cleared: !!victory });
      if (!victory) root.SaveManager.clearGame();
      this.audio.play(victory ? "sfx_stage_clear" : "sfx_game_over");
      this.stateManager.show("gameover");
      document.getElementById("screen-gameover").innerHTML = `
        <div class="panel gameover-card">
          <h1 class="game-title">${victory ? "CONGRATULATIONS" : "GAME OVER"}</h1>
          <div class="rank-badge">${rank || this.rank()}</div>
          <p>Stage ${this.stage}/25</p>
          <p>Score ${H.formatScore(this.score)}</p>
          <div class="button-row">
            <button class="btn-secondary" data-menu>主選單</button>
            <button class="btn-primary" data-retry>${victory ? "再玩一次" : "重試"}</button>
          </div>
        </div>
      `;
      document.querySelector("[data-menu]").addEventListener("click", () => this.showMenu());
      document.querySelector("[data-retry]").addEventListener("click", () => this.startAtStage(victory ? 1 : this.stage));
    }

    saveCurrentGame() {
      if (!this.player || this.mode === "MENU" || this.mode === "GAME_OVER") return;
      root.SaveManager.saveGame({
        stage: this.stage,
        lives: this.player.lives,
        score: this.score,
        powerups: this.player.snapshotPowerups(),
        deaths: this.deaths
      });
    }

    addTime(seconds) {
      if (!this.timeLimit) {
        this.timeLimit = seconds;
        this.timeLeft = seconds;
      } else {
        this.timeLeft += seconds;
      }
    }

    applySettings(settings) {
      this.settings = root.SaveManager.saveSettings(settings);
      document.documentElement.setAttribute("data-theme", this.settings.theme);
      this.audio.applySettings(this.settings);
      this.input.setSettings(this.settings);
      if (this.virtualJoystick) this.virtualJoystick.applySettings(this.settings);
      this.mainMenu.render();
    }

    notify(text) {
      this.notifier.show(text);
    }

    vibrate(ms) {
      if (this.settings.vibration && navigator.vibrate) navigator.vibrate(ms);
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    window.bombermanLite = new Game();
  });

  root.Game = Game;
}());
