(function (window, document) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class App {
    constructor() {
      Game.app = this;
      this.canvas = document.getElementById("gameCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.state = new Game.StateMachine("BOOT");
      this.settings = Game.Storage.loadSettings();
      this.audio = new Game.AudioEngine(this.settings);
      this.palette = {};
      this.dpr = 1;
      this.score = 0;
      this.highScore = Game.Storage.loadHighScore();
      this.lives = Game.Config.INITIAL_LIVES;
      this.level = 1;
      this.nextLifeAt = Game.Config.EXTRA_LIFE_EVERY;
      this.mushrooms = new Map();
      this.centipedes = [];
      this.fleas = [];
      this.scorpions = [];
      this.spider = null;
      this.player = new Game.Entities.Shooter();
      this.bullet = new Game.Entities.Bullet();
      this.particles = new Game.ParticleSystem();
      this.spawner = new Game.Spawner(this);
      this.shakeTime = 0;
      this.ribbonTimer = 0;
      this.levelClearPending = false;

      this.hud = new Game.UI.Hud(this);
      this.modal = new Game.UI.Modal(this);
      this.settingsPanel = new Game.UI.SettingsPanel(this);
      this.menu = new Game.UI.Menu(this);
      this.keyboard = new Game.Input.KeyboardInput(this);
      this.mouse = new Game.Input.MouseInput(this);
      this.touch = new Game.Input.TouchInput(this);

      this.bindChrome();
      this.updateSettings(this.settings);
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      window.addEventListener("orientationchange", () => window.setTimeout(() => this.resizeCanvas(), 80));

      this.hud.update();
      this.menu.show();
      this.loop = new Game.GameLoop((dt) => this.tick(dt));
      this.loop.start();
    }

    bindChrome() {
      this.pauseBtn = document.getElementById("pauseBtn");
      this.settingsBtn = document.getElementById("settingsBtn");
      this.pauseIcon = this.pauseBtn.querySelector(".control-icon");

      this.pauseBtn.addEventListener("click", () => {
        this.unlockAudio();
        this.togglePause();
      });
      this.settingsBtn.addEventListener("click", () => {
        this.unlockAudio();
        if (this.state.is("PLAYING")) {
          this.state.set("PAUSED");
          this.saveGame();
          Game.Music.pause(this.audio, true);
        }
        this.settingsPanel.show();
      });
      this.canvas.tabIndex = 0;
    }

    updateChromeState() {
      if (!this.pauseBtn || !this.pauseIcon) {
        return;
      }
      const isPaused = this.state.is("PAUSED");
      this.pauseBtn.setAttribute("aria-label", isPaused ? "繼續" : "暫停");
      this.pauseBtn.title = isPaused ? "繼續" : "暫停";
      this.pauseIcon.className = `control-icon control-icon--${isPaused ? "play" : "pause"}`;
    }

    unlockAudio() {
      if (this.audio.ensure()) {
        this.audio.resumePendingMusic();
      }
    }

    updateSettings(settings) {
      this.settings = Object.assign({}, Game.Storage.defaults, settings);
      document.body.dataset.theme = this.settings.theme;
      document.body.dataset.fontSize = this.settings.fontSize;
      document.getElementById("touchControls").classList.toggle("is-left", this.settings.controlSide === "left");
      Game.Storage.saveSettings(this.settings);
      this.audio.applySettings(this.settings);
      this.syncPalette();
      window.setTimeout(() => this.syncPalette(), 0);
    }

    syncPalette() {
      this.palette = {
        bg: Game.Helpers.cssVar("--c-bg", "#0a0a14"),
        surface: Game.Helpers.cssVar("--c-surface", "#151628"),
        primary: Game.Helpers.cssVar("--c-primary", "#39ff14"),
        secondary: Game.Helpers.cssVar("--c-secondary", "#ff4fd8"),
        accent: Game.Helpers.cssVar("--c-accent", "#ffe66d"),
        mushroom: Game.Helpers.cssVar("--c-mushroom", "#8df7ff"),
        poison: Game.Helpers.cssVar("--c-poison", "#b56cff"),
        text: Game.Helpers.cssVar("--c-text", "#f7fff9"),
        dim: Game.Helpers.cssVar("--c-text-dim", "#a8b8ad"),
        danger: Game.Helpers.cssVar("--c-danger", "#ff3158"),
        grid: Game.Helpers.cssVar("--c-grid", "rgba(255,255,255,0.08)"),
        zone: Game.Helpers.cssVar("--c-player-zone", "rgba(57,255,20,0.08)")
      };
    }

    resizeCanvas() {
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Game.Config.WIDTH * this.dpr;
      this.canvas.height = Game.Config.HEIGHT * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.draw();
    }

    startNewGame() {
      this.unlockAudio();
      this.menu.hide();
      this.modal.close();
      this.score = 0;
      this.lives = Game.Config.INITIAL_LIVES;
      this.level = 1;
      this.nextLifeAt = Game.Config.EXTRA_LIFE_EVERY;
      this.setupLevel();
      this.state.set("PLAYING");
      this.hud.update();
      Game.Music.play(this.audio, "battle_theme", this.level);
      this.saveGame();
    }

    continueGame() {
      this.unlockAudio();
      const save = Game.Storage.loadSave();
      if (!save) {
        this.toast("沒有可用的存檔");
        this.playSfx("ui_error");
        this.menu.refreshSaveState();
        return;
      }
      this.menu.hide();
      this.modal.close();
      this.score = save.score || 0;
      this.lives = save.lives || Game.Config.INITIAL_LIVES;
      this.level = save.level || 1;
      this.nextLifeAt = Math.floor(this.score / Game.Config.EXTRA_LIFE_EVERY + 1) * Game.Config.EXTRA_LIFE_EVERY;
      this.setupLevel(save.mushrooms);
      this.state.set("PLAYING");
      this.hud.update();
      Game.Music.play(this.audio, "battle_theme", this.level);
    }

    setupLevel(savedMushrooms) {
      this.levelSpec = Game.Level.create(this.level);
      this.mushrooms.clear();
      if (Array.isArray(savedMushrooms) && savedMushrooms.length) {
        savedMushrooms.forEach((m) => this.addMushroom(m.col, m.row, m.poisoned, m.hp));
      } else {
        this.seedMushrooms(this.levelSpec.mushroomCount);
      }
      this.startRound();
    }

    startRound() {
      this.player.reset();
      this.bullet.active = false;
      this.spider = null;
      this.fleas = [];
      this.scorpions = [];
      this.particles = new Game.ParticleSystem();
      this.spawner = new Game.Spawner(this);
      this.spawnCentipedes();
      this.levelClearPending = false;
    }

    spawnCentipedes() {
      const spec = this.levelSpec || Game.Level.create(this.level);
      this.centipedes = [
        new Game.Entities.Centipede({
          length: spec.mainLength,
          row: 0,
          startCol: spec.mainLength - 1,
          dir: 1,
          speed: spec.speed
        })
      ];
      const heads = Math.min(12, spec.extraHeads);
      for (let i = 0; i < heads; i += 1) {
        this.centipedes.push(new Game.Entities.Centipede({
          length: 1,
          row: Game.Helpers.randInt(1, Math.max(2, Game.Config.PLAYER_ZONE_START - 2)),
          startCol: Game.Helpers.randInt(0, Game.Config.GRID_COLS - 1),
          dir: Game.Helpers.choice([-1, 1]),
          speed: spec.speed + 0.35
        }));
      }
    }

    seedMushrooms(count) {
      let attempts = 0;
      while (this.mushrooms.size < count && attempts < count * 20) {
        attempts += 1;
        const col = Game.Helpers.randInt(1, Game.Config.GRID_COLS - 2);
        const row = Game.Helpers.randInt(2, Game.Config.PLAYER_ZONE_START - 2);
        this.addMushroom(col, row, false, Game.Config.MUSHROOM_HP);
      }
    }

    addMushroom(col, row, poisoned, hp) {
      if (!Number.isFinite(col) || !Number.isFinite(row)) {
        return null;
      }
      col = Game.Helpers.clamp(Math.floor(col), 0, Game.Config.GRID_COLS - 1);
      row = Game.Helpers.clamp(Math.floor(row), 0, Game.Config.GRID_ROWS - 1);
      if (row >= Game.Config.GRID_ROWS - 1) {
        return null;
      }
      const key = Game.Helpers.key(col, row);
      let mushroom = this.mushrooms.get(key);
      if (!mushroom) {
        mushroom = new Game.Entities.Mushroom(col, row, poisoned, hp);
        this.mushrooms.set(key, mushroom);
      } else {
        mushroom.poisoned = Boolean(poisoned || mushroom.poisoned);
        mushroom.hp = hp || mushroom.hp;
      }
      return mushroom;
    }

    getMushroom(col, row) {
      if (col < 0 || row < 0 || col >= Game.Config.GRID_COLS || row >= Game.Config.GRID_ROWS) {
        return null;
      }
      return this.mushrooms.get(Game.Helpers.key(Math.floor(col), Math.floor(row))) || null;
    }

    removeMushroom(col, row) {
      this.mushrooms.delete(Game.Helpers.key(col, row));
    }

    countPlayerZoneMushrooms() {
      let count = 0;
      this.mushrooms.forEach((mushroom) => {
        if (mushroom.row >= Game.Config.PLAYER_ZONE_START) {
          count += 1;
        }
      });
      return count;
    }

    serializeMushrooms() {
      return Array.from(this.mushrooms.values()).map((mushroom) => mushroom.serialize());
    }

    saveGame() {
      if (this.state.is("GAMEOVER")) {
        return;
      }
      Game.Storage.saveGame({
        level: this.level,
        score: this.score,
        lives: this.lives,
        mushrooms: this.serializeMushrooms()
      });
      this.menu.refreshSaveState();
    }

    tick(dt) {
      if (this.state.is("PLAYING")) {
        this.updateGame(dt);
      } else {
        this.particles.update(dt * 0.5);
      }
      this.draw();
    }

    updateGame(dt) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      this.player.update(dt, this);
      this.bullet.update(dt);
      this.centipedes.forEach((centipede) => centipede.update(this, dt));
      this.spawner.update(dt);
      if (this.spider) {
        this.spider.update(this, dt);
      }
      this.fleas.forEach((flea) => flea.update(this, dt));
      this.scorpions.forEach((scorpion) => scorpion.update(this, dt));
      this.particles.update(dt);
      this.checkBulletCollisions();
      this.checkPlayerCollisions();
      this.compactEntities();
      if (!this.levelClearPending && this.centipedes.every((centipede) => centipede.segments.length === 0)) {
        this.clearLevel();
      }
    }

    compactEntities() {
      this.centipedes = this.centipedes.filter((centipede) => centipede.segments.length > 0);
      this.fleas = this.fleas.filter((flea) => !flea.dead);
      this.scorpions = this.scorpions.filter((scorpion) => !scorpion.dead);
      if (this.spider && this.spider.dead) {
        this.spider = null;
      }
    }

    checkBulletCollisions() {
      if (!this.bullet.active) {
        return;
      }
      const bulletCircle = { x: this.bullet.x, y: this.bullet.y, r: this.bullet.r };
      for (const mushroom of this.mushrooms.values()) {
        if (Game.Collision.circleRect(bulletCircle, mushroom.rect)) {
          mushroom.damage(this);
          this.bullet.active = false;
          return;
        }
      }

      for (let i = 0; i < this.centipedes.length; i += 1) {
        const hit = this.centipedes[i].hitTest(bulletCircle);
        if (hit !== -1) {
          Game.Score.add(this, this.centipedes[i].hitAt(hit, this));
          this.bullet.active = false;
          return;
        }
      }

      if (this.spider && Game.Collision.circleCircle(bulletCircle, this.spider.circle)) {
        Game.Score.add(this, this.spider.scoreFor(this.player));
        this.playSfx("spider_kill");
        this.particles.burst(this.spider.x, this.spider.y, this.palette.secondary, 24, 200);
        this.spider.dead = true;
        this.bullet.active = false;
        return;
      }

      for (const flea of this.fleas) {
        if (Game.Collision.circleCircle(bulletCircle, flea.circle)) {
          Game.Score.add(this, 200);
          this.playSfx("flea_kill");
          this.particles.burst(flea.x, flea.y, this.palette.accent, 16, 180);
          flea.dead = true;
          this.bullet.active = false;
          return;
        }
      }

      for (const scorpion of this.scorpions) {
        if (Game.Collision.circleCircle(bulletCircle, scorpion.circle)) {
          Game.Score.add(this, 1000);
          this.playSfx("scorpion_kill");
          this.particles.burst(scorpion.x, scorpion.y, this.palette.poison, 22, 190);
          scorpion.dead = true;
          this.bullet.active = false;
          return;
        }
      }
    }

    checkPlayerCollisions() {
      if (this.player.invulnerable > 0) {
        return;
      }
      for (const centipede of this.centipedes) {
        if (centipede.collidesPlayer(this.player)) {
          this.loseLife();
          return;
        }
      }
      if (this.spider && Game.Collision.circleCircle(this.player.circle, this.spider.circle)) {
        this.loseLife();
        return;
      }
      for (const flea of this.fleas) {
        if (Game.Collision.circleCircle(this.player.circle, flea.circle)) {
          this.loseLife();
          return;
        }
      }
      for (const scorpion of this.scorpions) {
        if (Game.Collision.circleCircle(this.player.circle, scorpion.circle)) {
          this.loseLife();
          return;
        }
      }
    }

    loseLife() {
      const deathX = this.player.x;
      const deathY = this.player.y;
      this.playSfx("player_death");
      this.shakeTime = this.settings.shake ? 0.45 : 0;
      this.lives -= 1;
      this.hud.update();
      if (this.lives <= 0) {
        this.particles.burst(deathX, deathY, this.palette.danger, 36, 260);
        this.gameOver();
        return;
      }
      this.mushrooms.forEach((mushroom) => mushroom.repair(this));
      this.startRound();
      this.particles.burst(deathX, deathY, this.palette.danger, 36, 260);
      this.showRibbon("READY", 700);
      this.saveGame();
    }

    clearLevel() {
      this.levelClearPending = true;
      this.playSfx("level_clear");
      this.showRibbon("LEVEL CLEAR", 900);
      this.saveGame();
      this.state.set("LEVELCLEAR");
      window.setTimeout(() => {
        if (!this.state.is("LEVELCLEAR")) {
          return;
        }
        this.level += 1;
        this.setupLevel();
        this.state.set("PLAYING");
        this.hud.update();
        Game.Music.play(this.audio, "battle_theme", this.level);
        this.saveGame();
      }, 950);
    }

    gameOver() {
      this.state.set("GAMEOVER");
      Game.Storage.clearSave();
      this.menu.refreshSaveState();
      Game.Music.gameOver(this.audio);
      this.hud.update();
      this.modal.show("遊戲結束", `
        <p>本次分數：<strong>${Game.Helpers.formatScore(this.score)}</strong></p>
        <p>最高分：<strong>${Game.Helpers.formatScore(this.highScore)}</strong></p>
      `, [
        { label: "再玩一次", action: () => this.startNewGame() },
        { label: "主選單", action: () => { this.modal.close(); this.menu.show(); } }
      ]);
    }

    pause() {
      if (!this.state.is("PLAYING")) {
        return;
      }
      this.state.set("PAUSED");
      this.saveGame();
      Game.Music.pause(this.audio, true);
      this.modal.show("暫停", "<p>目前進度已保存。</p>", [
        { label: "繼續", action: () => this.resume() },
        { label: "主選單", action: () => { this.modal.close(); this.menu.show(); } }
      ]);
    }

    resume() {
      if (!this.state.is("PAUSED")) {
        this.modal.close();
        return;
      }
      this.modal.close();
      this.state.set("PLAYING");
      Game.Music.pause(this.audio, false);
      Game.Music.play(this.audio, "battle_theme", this.level);
    }

    togglePause() {
      if (this.state.is("PLAYING")) {
        this.pause();
      } else if (this.state.is("PAUSED")) {
        this.resume();
      }
    }

    showHelp() {
      this.modal.show("操作說明", `
        <div class="help-layout">
          <section class="help-card">
            <span class="help-icon help-icon--keyboard" aria-hidden="true"></span>
            <div>
              <h3>鍵盤</h3>
              <p><span class="keycap">↑</span><span class="keycap">↓</span><span class="keycap">←</span><span class="keycap">→</span> 或 <span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> 移動砲台。</p>
              <p><span class="keycap keycap--wide">Space</span> 或 <span class="keycap keycap--wide">Enter</span> 射擊，<span class="keycap">Esc</span> 暫停。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--touch" aria-hidden="true"></span>
            <div>
              <h3>滑鼠與觸控</h3>
              <p>滑鼠移到遊戲區內可牽引砲台，點擊畫布射擊。</p>
              <p>手機使用虛擬搖桿移動，射擊按鈕可連續開火；可在設定中切換射擊鍵位置。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--mushroom" aria-hidden="true"></span>
            <div>
              <h3>場地與蘑菇</h3>
              <p>蘑菇有 4 格耐久，會阻擋蜈蚣並讓牠轉向下移。</p>
              <p>蠍子會把蘑菇變成毒蘑菇；蜈蚣碰到毒蘑菇會向玩家區俯衝。</p>
            </div>
          </section>
          <section class="help-card">
            <span class="help-icon help-icon--enemy" aria-hidden="true"></span>
            <div>
              <h3>敵人與得分</h3>
              <p>蜈蚣身體 10 分，頭部 100 分；擊中身體會分裂成新的蜈蚣。</p>
              <p>蜘蛛依距離給 300 / 600 / 900 分，跳蚤 200 分，蠍子 1000 分。</p>
              <p>每 12000 分加 1 條生命，最多 6 條。死亡後蘑菇會修復並給少量分數。</p>
            </div>
          </section>
        </div>
      `, [{ label: "返回", action: () => this.modal.close() }]);
    }

    getMoveVector() {
      const k = this.keyboard.vector();
      const t = this.touch.vector();
      const x = k.x + t.x;
      const y = k.y + t.y;
      const len = Math.hypot(x, y);
      return len > 1 ? { x: x / len, y: y / len } : { x, y };
    }

    consumeShoot() {
      return this.keyboard.wantsShoot() || this.touch.wantsShoot() || this.mouse.consumeShoot();
    }

    playSfx(id) {
      Game.Sfx.play(this.audio, id);
    }

    showRibbon(text, ms) {
      const ribbon = document.getElementById("statusRibbon");
      window.clearTimeout(this.ribbonTimer);
      ribbon.textContent = text;
      ribbon.hidden = false;
      this.ribbonTimer = window.setTimeout(() => {
        ribbon.hidden = true;
      }, ms || 800);
    }

    toast(text) {
      const toast = document.getElementById("toast");
      toast.textContent = text;
      toast.hidden = false;
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        toast.hidden = true;
      }, 1800);
    }

    draw() {
      if (!this.ctx) {
        return;
      }
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, Game.Config.WIDTH, Game.Config.HEIGHT);
      ctx.save();
      if (this.shakeTime > 0 && this.settings.shake) {
        const amount = this.shakeTime * 8;
        ctx.translate(Game.Helpers.rand(-amount, amount), Game.Helpers.rand(-amount, amount));
      }
      this.drawBoard(ctx);
      this.mushrooms.forEach((mushroom) => mushroom.draw(ctx, this.palette));
      this.centipedes.forEach((centipede) => centipede.draw(ctx, this.palette));
      if (this.spider) {
        this.spider.draw(ctx, this.palette);
      }
      this.fleas.forEach((flea) => flea.draw(ctx, this.palette));
      this.scorpions.forEach((scorpion) => scorpion.draw(ctx, this.palette));
      this.bullet.draw(ctx, this.palette);
      this.player.draw(ctx, this.palette);
      this.particles.draw(ctx);
      ctx.restore();
    }

    drawBoard(ctx) {
      const cfg = Game.Config;
      ctx.fillStyle = this.palette.bg || "#0a0a14";
      ctx.fillRect(0, 0, cfg.WIDTH, cfg.HEIGHT);

      ctx.fillStyle = this.palette.zone || "rgba(57,255,20,0.08)";
      ctx.fillRect(0, cfg.PLAYER_ZONE_START * cfg.CELL, cfg.WIDTH, cfg.PLAYER_ZONE_ROWS * cfg.CELL);

      ctx.strokeStyle = this.palette.grid || "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cfg.GRID_COLS; c += 1) {
        const x = c * cfg.CELL + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cfg.HEIGHT);
      }
      for (let r = 0; r <= cfg.GRID_ROWS; r += 1) {
        const y = r * cfg.CELL + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(cfg.WIDTH, y);
      }
      ctx.stroke();

      ctx.strokeStyle = this.palette.accent || "#ffe66d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cfg.PLAYER_ZONE_START * cfg.CELL + 0.5);
      ctx.lineTo(cfg.WIDTH, cfg.PLAYER_ZONE_START * cfg.CELL + 0.5);
      ctx.stroke();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    Game.app = new App();
  });
})(window, document);
