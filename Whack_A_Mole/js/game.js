(function (app) {
  "use strict";

  const { AudioEngine, DIFFICULTY, LEVELS, MOLES, SaveSystem } = app;

  class Game {
    constructor() {
      this.save = new SaveSystem();
      this.audio = new AudioEngine(this.save);
      this.activeScreen = "home";
      this.currentLevelId = this.save.data.progress.currentLevel || 1;
      this.level = LEVELS[0];
      this.timerId = null;
      this.spawnId = null;
      this.obstacleId = null;
      this.holes = [];
      this.activeMoles = new Map();
      this.state = "idle";
      this.userInteracted = false;
      this.score = 0;
      this.lives = 3;
      this.timeLeft = 60;
      this.combo = 0;
      this.bestCombo = 0;
      this.hits = 0;
      this.misses = 0;
      this.spawned = 0;
      this.multiplierUntil = 0;
      this.freezeUntil = 0;
      this.bossHp = 100;
      this.powers = { time: 0, heart: 0, frenzy: 0 };
      this.bind();
      this.renderLevelSelect();
      this.syncSettingsUI();
      this.showScreen("home");
    }

    bind() {
      document.addEventListener("click", (event) => {
        this.userInteracted = true;
        this.audio.resume();
        if (this.activeScreen === "home") this.audio.startHomeMusic();
        const screenBtn = event.target.closest("[data-screen]");
        if (screenBtn) this.showScreen(screenBtn.dataset.screen);

        const actionBtn = event.target.closest("[data-action]");
        if (actionBtn) this.handleAction(actionBtn.dataset.action);

        const levelBtn = event.target.closest("[data-level]");
        if (levelBtn && !levelBtn.disabled) this.startLevel(Number(levelBtn.dataset.level));
      });

      document.getElementById("music-volume").addEventListener("input", (event) => {
        this.save.data.settings.musicVolume = Number(event.target.value);
        this.save.save();
        this.audio.applyVolumes();
      });

      document.getElementById("sfx-volume").addEventListener("input", (event) => {
        this.save.data.settings.sfxVolume = Number(event.target.value);
        this.save.save();
        this.audio.applyVolumes();
      });

      document.querySelectorAll(".segmented button").forEach(button => {
        button.addEventListener("click", () => {
          const setting = button.parentElement.dataset.setting;
          const value = button.dataset.value;
          this.save.data.settings[setting] = value === "true" ? true : value === "false" ? false : value;
          this.save.save();
          this.syncSettingsUI();
        });
      });
    }

    handleAction(action) {
      if (action === "quick-start") this.startLevel(this.firstUnlockedLevel());
      if (action === "reset-save") {
        this.stopGame();
        this.save.reset();
        this.currentLevelId = 1;
        this.renderLevelSelect();
        this.syncSettingsUI();
        this.toast("紀錄已重置");
      }
      if (action === "exit-game") {
        this.stopGame();
        this.showScreen("home");
        this.toast("已離開遊戲");
      }
      if (action === "retry-level") this.startLevel(this.currentLevelId);
      if (action === "next-level") this.startLevel(Math.min(10, this.currentLevelId + 1));
    }

    firstUnlockedLevel() {
      return Math.max(1, Number(this.save.data.progress.currentLevel) || 1);
    }

    showScreen(name) {
      if (name !== "game") this.stopGame();
      if (name === "game") this.audio.stopMusic();
      document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
      document.getElementById(`screen-${name}`).classList.add("active");
      this.activeScreen = name;
      if (name === "select") this.renderLevelSelect();
      if (name === "home" && this.userInteracted) this.audio.startHomeMusic();
    }

    syncSettingsUI() {
      const settings = this.save.data.settings;
      document.getElementById("music-volume").value = settings.musicVolume;
      document.getElementById("sfx-volume").value = settings.sfxVolume;
      document.querySelectorAll(".segmented").forEach(group => {
        const value = String(settings[group.dataset.setting]);
        group.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.value === value));
      });
    }

    renderLevelSelect() {
      const progress = this.save.data.progress;
      const grid = document.getElementById("level-grid");
      grid.innerHTML = "";
      LEVELS.forEach(level => {
        const data = progress.levels[level.id] || { stars: 0, highScore: 0, unlocked: level.id === 1 };
        const button = document.createElement("button");
        button.className = "level-card";
        button.disabled = false;
        button.dataset.level = level.id;
        button.innerHTML = `
          <strong>STAGE ${level.id}</strong>
          <span>${level.name}</span>
          <span>${level.rows}x${level.cols} / ${level.boss ? "BOSS" : `${level.time}s`}</span>
          <span class="stars">${"★".repeat(data.stars || 0)}${"☆".repeat(3 - (data.stars || 0))}</span>
          <span>BEST ${data.highScore || 0}</span>
        `;
        grid.appendChild(button);
      });
    }

    startLevel(id) {
      this.audio.resume();
      this.currentLevelId = id;
      this.level = LEVELS[id - 1];
      const diff = DIFFICULTY[this.save.data.settings.difficulty] || DIFFICULTY.normal;
      this.score = 0;
      this.lives = 3;
      this.timeLeft = Math.ceil(this.level.time * diff.time);
      this.combo = 0;
      this.bestCombo = 0;
      this.hits = 0;
      this.misses = 0;
      this.spawned = 0;
      this.powers = { time: 0, heart: 0, frenzy: 0 };
      this.activeMoles.clear();
      this.multiplierUntil = 0;
      this.freezeUntil = 0;
      this.bossHp = 100;
      this.showScreen("game");
      this.buildGrid();
      this.updateHud();
      const sessionId = Date.now();
      this.sessionId = sessionId;
      this.countdown().then(() => {
        if (this.sessionId === sessionId && this.activeScreen === "game") this.runLevel();
      });
    }

    buildGrid() {
      const grid = document.getElementById("game-grid");
      document.documentElement.style.setProperty("--level-tint", this.level.tint);
      grid.className = `game-grid grid-${this.level.rows}x${this.level.cols}`;
      grid.innerHTML = "";
      this.holes = [];
      const count = this.level.rows * this.level.cols;
      for (let i = 0; i < count; i++) {
        const hole = document.createElement("button");
        hole.className = "hole";
        hole.type = "button";
        hole.dataset.index = i;
        hole.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          this.handleHole(i, hole);
        });
        grid.appendChild(hole);
        this.holes.push(hole);
      }
    }

    async countdown() {
      const overlay = document.getElementById("overlay-countdown");
      const text = document.getElementById("countdown-text");
      overlay.classList.remove("hidden");
      for (const item of ["3", "2", "1", "GO!"]) {
        text.textContent = item;
        this.audio.sfx(item === "GO!" ? "power" : "miss");
        await new Promise(resolve => setTimeout(resolve, item === "GO!" ? 520 : 720));
      }
      overlay.classList.add("hidden");
    }

    runLevel() {
      this.state = "running";
      this.save.data.stats.gamesPlayed += 1;
      this.save.save();
      this.audio.startMusic(this.level);
      this.scheduleSpawn();
      if (this.level.obstacle) this.scheduleObstacle();
      this.timerId = setInterval(() => {
        if (Date.now() < this.freezeUntil) return;
        this.timeLeft -= 1;
        this.updateHud();
        if (this.timeLeft <= 0) this.finishLevel(false);
      }, 1000);
    }

    scheduleSpawn() {
      if (this.state !== "running") return;
      const diff = DIFFICULTY[this.save.data.settings.difficulty] || DIFFICULTY.normal;
      const frenzy = Date.now() < this.multiplierUntil ? 0.62 : 1;
      const base = Math.max(360, 980 - this.level.id * 48);
      const delay = (base + Math.random() * 430) * diff.spawn * frenzy;
      this.spawnId = setTimeout(() => {
        this.spawnMole();
        if (this.level.id >= 7 && Math.random() < 0.35) setTimeout(() => this.spawnMole(), 130);
        this.scheduleSpawn();
      }, delay);
    }

    scheduleObstacle() {
      if (this.state !== "running") return;
      this.obstacleId = setTimeout(() => {
        const free = this.holes.filter((hole, index) => !hole.classList.contains("blocked") && !this.activeMoles.has(index));
        if (free.length) {
          const hole = free[Math.floor(Math.random() * free.length)];
          hole.classList.add("blocked");
          this.toast("障礙出現");
          setTimeout(() => hole.classList.remove("blocked"), 5200);
        }
        this.scheduleObstacle();
      }, 8000 + Math.random() * 5500);
    }

    spawnMole() {
      if (this.state !== "running") return;
      const available = this.holes
        .map((hole, index) => ({ hole, index }))
        .filter(item => !item.hole.classList.contains("blocked") && !this.activeMoles.has(item.index));
      if (!available.length) return;

      const slot = available[Math.floor(Math.random() * available.length)];
      const type = this.pickMoleType();
      const config = MOLES[type];
      const active = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        hp: type === "boss" ? Math.min(18 + this.level.id * 2, this.bossHp) : config.hp,
        createdAt: Date.now(),
        timeout: null,
        element: null
      };

      const mole = document.createElement("div");
      mole.className = `mole ${type}`;
      mole.innerHTML = `
        <div class="mole-art">
          <span class="mole-snout"></span>
          <span class="mole-teeth"><span></span><span></span></span>
        </div>
        ${config.shield || type === "boss" ? "<span class=\"shield\"></span>" : ""}
      `;
      active.element = mole;
      slot.hole.appendChild(mole);
      requestAnimationFrame(() => mole.classList.add("visible"));
      this.activeMoles.set(slot.index, active);
      this.spawned += 1;

      const duration = Math.max(360, config.duration - this.level.id * 35);
      active.timeout = setTimeout(() => this.moleEscaped(slot.index), duration);
    }

    pickMoleType() {
      const pool = this.level.types.map(type => ({ type, weight: MOLES[type].weight }));
      if (this.level.boss && Math.random() < 0.22) return "boss";
      const total = pool.reduce((sum, item) => sum + item.weight, 0);
      let roll = Math.random() * total;
      for (const item of pool) {
        roll -= item.weight;
        if (roll <= 0) return item.type;
      }
      return pool[0].type;
    }

    handleHole(index, hole) {
      if (this.state !== "running") return;
      if (hole.classList.contains("blocked")) {
        hole.classList.remove("blocked");
        this.pop(hole, "CLEAR", "good");
        this.audio.sfx("hit");
        return;
      }

      const active = this.activeMoles.get(index);
      if (!active) {
        this.breakCombo();
        this.misses += 1;
        this.audio.sfx("miss");
        this.pop(hole, "MISS", "bad");
        return;
      }

      active.hp -= 1;
      const config = MOLES[active.type];
      if (active.hp > 0) {
        this.pop(hole, "HIT", "good");
        this.audio.sfx("hit");
        return;
      }

      clearTimeout(active.timeout);
      this.activeMoles.delete(index);
      this.resolveHit(active, hole, config);
      active.element.classList.remove("visible");
      active.element.classList.add("hit");
      setTimeout(() => active.element.remove(), 180);
    }

    resolveHit(active, hole, config) {
      const isBad = config.reward < 0 || config.penalty > 0;
      if (isBad) {
        const diff = DIFFICULTY[this.save.data.settings.difficulty] || DIFFICULTY.normal;
        this.score = Math.max(0, this.score + config.reward);
        this.lives = Math.max(0, this.lives - Math.ceil(config.penalty * diff.penalty));
        this.breakCombo();
        this.audio.sfx("bad");
        this.vibrate([50, 30, 50]);
        this.shake();
        this.pop(hole, String(config.reward), "bad");
        if (this.lives <= 0) this.finishLevel(true);
      } else {
        this.hits += 1;
        this.combo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        let multiplier = this.comboMultiplier();
        if (Date.now() < this.multiplierUntil) multiplier *= 2;
        const gained = Math.round(config.reward * multiplier);
        this.score += gained;
        this.audio.sfx(active.type === "boss" ? "boss" : "hit");
        this.vibrate(35);
        this.pop(hole, `+${gained}`, active.type === "bonus" ? "good" : "");
        this.checkPower(active.type, config);
        this.checkComboBanner();
        if (active.type === "boss") {
          this.bossHp = Math.max(0, this.bossHp - 8);
          if (this.bossHp <= 0) this.finishLevel(false);
        }
      }
      this.updateHud();
    }

    moleEscaped(index) {
      const active = this.activeMoles.get(index);
      if (!active) return;
      this.activeMoles.delete(index);
      const config = MOLES[active.type];
      active.element.classList.remove("visible");
      active.element.classList.add("leaving");
      setTimeout(() => active.element.remove(), 160);
      if (config.reward > 0 && active.type !== "bonus") {
        this.misses += 1;
        this.breakCombo();
      }
      this.updateHud();
    }

    comboMultiplier() {
      if (this.combo >= 30) return 5;
      if (this.combo >= 20) return 3;
      if (this.combo >= 10) return 2;
      if (this.combo >= 5) return 1.5;
      return 1;
    }

    checkComboBanner() {
      if (![5, 10, 20, 30].includes(this.combo)) return;
      const banner = document.getElementById("combo-banner");
      banner.textContent = `${this.combo} COMBO x${this.comboMultiplier()}`;
      banner.classList.remove("show");
      void banner.offsetWidth;
      banner.classList.add("show");
    }

    checkPower(type, config) {
      if (type !== "bonus" && Math.random() > 0.08) return;
      const powers = ["time", "heart", "frenzy"];
      const power = powers[Math.floor(Math.random() * powers.length)];
      if (power === "time") {
        this.timeLeft += 5;
        this.toast("+5 秒");
      } else if (power === "heart") {
        this.lives = Math.min(5, this.lives + 1);
        this.toast("+1 生命");
      } else {
        this.multiplierUntil = Date.now() + 10000;
        this.toast("狂熱 x2");
      }
      this.powers[power] += 1;
      this.audio.sfx("power");
    }

    breakCombo() {
      this.combo = 0;
    }

    pop(hole, text, tone = "") {
      const pop = document.createElement("span");
      pop.className = `score-pop ${tone}`;
      pop.textContent = text;
      hole.appendChild(pop);
      const ring = document.createElement("span");
      ring.className = "hit-ring";
      hole.appendChild(ring);
      setTimeout(() => pop.remove(), 800);
      setTimeout(() => ring.remove(), 450);
    }

    updateHud() {
      document.getElementById("hud-score").textContent = this.score.toLocaleString("zh-TW");
      document.getElementById("hud-time").textContent = Math.max(0, this.timeLeft);
      document.getElementById("hud-combo").textContent = `COMBO ${this.combo}`;
      document.getElementById("hud-stage").textContent = `STAGE ${this.level.id} ${this.level.name}`;
      document.getElementById("heart-row").innerHTML = Array.from({ length: this.lives }, () => "<span class=\"heart\">♥</span>").join("");
      document.getElementById("power-row").innerHTML = `
        <span class="power" title="加時">⏱<small>${this.powers.time}</small></span>
        <span class="power" title="生命">♥<small>${this.powers.heart}</small></span>
        <span class="power" title="狂熱">⚡<small>${this.powers.frenzy}</small></span>
      `;
    }

    finishLevel(gameOver) {
      if (this.state !== "running") return;
      this.state = "done";
      this.stopTimers();
      this.audio.stopMusic();
      this.activeMoles.forEach(active => {
        clearTimeout(active.timeout);
        active.element.remove();
      });
      this.activeMoles.clear();

      if (gameOver) {
        this.audio.sfx("bad");
        document.getElementById("over-score").textContent = this.score.toLocaleString("zh-TW");
        document.getElementById("over-combo").textContent = this.bestCombo;
        this.showScreen("gameover");
        return;
      }

      const passed = this.level.boss ? this.bossHp <= 0 : this.score >= this.level.target;
      const stars = this.starsForScore();
      if (passed) this.persistResult(stars);
      this.audio.sfx(passed ? "win" : "bad");
      document.getElementById("result-title").textContent = passed ? "關卡完成" : "挑戰失敗";
      document.getElementById("result-score").textContent = this.score.toLocaleString("zh-TW");
      document.getElementById("result-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
      const attempts = Math.max(1, this.hits + this.misses);
      document.getElementById("result-accuracy").textContent = `${Math.round(this.hits / attempts * 100)}%`;
      document.getElementById("result-combo").textContent = this.bestCombo;
      document.querySelector("[data-action='next-level']").disabled = !passed || this.currentLevelId >= 10;
      this.showScreen("result");
    }

    starsForScore() {
      if (this.level.boss) {
        if (this.bossHp <= 0 && this.lives >= 3) return 3;
        if (this.bossHp <= 0) return 2;
        return 0;
      }
      if (this.score >= this.level.target * 2.2) return 3;
      if (this.score >= this.level.target * 1.5) return 2;
      if (this.score >= this.level.target) return 1;
      return 0;
    }

    persistResult(stars) {
      const progress = this.save.data.progress;
      const current = progress.levels[this.currentLevelId] || { stars: 0, highScore: 0, unlocked: true };
      progress.levels[this.currentLevelId] = {
        stars: Math.max(current.stars || 0, stars),
        highScore: Math.max(current.highScore || 0, this.score),
        unlocked: true
      };
      if (this.currentLevelId < 10) {
        const next = progress.levels[this.currentLevelId + 1] || { stars: 0, highScore: 0 };
        progress.levels[this.currentLevelId + 1] = { ...next, unlocked: true };
        progress.currentLevel = Math.max(progress.currentLevel || 1, this.currentLevelId + 1);
      }
      progress.totalScore = Math.max(progress.totalScore || 0, Object.values(progress.levels).reduce((sum, item) => sum + (item.highScore || 0), 0));
      this.save.data.stats.totalMolesHit += this.hits;
      this.save.data.stats.totalMolesMissed += this.misses;
      this.save.data.stats.highestCombo = Math.max(this.save.data.stats.highestCombo || 0, this.bestCombo);
      this.save.save();
      this.renderLevelSelect();
    }

    stopTimers() {
      clearInterval(this.timerId);
      clearTimeout(this.spawnId);
      clearTimeout(this.obstacleId);
      this.timerId = null;
      this.spawnId = null;
      this.obstacleId = null;
    }

    stopGame() {
      this.sessionId = Date.now();
      this.stopTimers();
      this.audio.stopMusic();
      this.activeMoles.forEach(active => {
        clearTimeout(active.timeout);
        if (active.element) active.element.remove();
      });
      this.activeMoles.clear();
      this.state = "idle";
      document.getElementById("overlay-countdown").classList.add("hidden");
    }

    shake() {
      if (!this.save.data.settings.screenShake) return;
      const screen = document.getElementById("screen-game");
      screen.classList.remove("shake");
      void screen.offsetWidth;
      screen.classList.add("shake");
    }

    vibrate(pattern) {
      if ("vibrate" in navigator) navigator.vibrate(pattern);
    }

    toast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(this.toastId);
      this.toastId = setTimeout(() => toast.classList.remove("show"), 1400);
    }
  }

  app.Game = Game;
})(window.MoleMayhem = window.MoleMayhem || {});
