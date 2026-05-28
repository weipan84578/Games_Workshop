(function () {
  "use strict";

  var COLS = 28;
  var ROWS = 31;
  var FIXED_MAX_DT = 0.05;
  var POWER_DURATION = 8;
  var STORAGE = {
    settings: "pacman_settings",
    highScore: "pacman_highscore",
    save: "pacman_save"
  };

  var MAZE_TEMPLATE = [
    "############################",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#o####.#####.##.#####.####o#",
    "#.####.#####.##.#####.####.#",
    "#..........................#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#......##....##....##......#",
    "######.#####.##.#####.######",
    "#####..#####.##.#####..#####",
    "#####.##............##.#####",
    "#####.##.###....###.##.#####",
    "#........##......##........#",
    "TT....##.##..HH..##.##....TT",
    "#........##......##........#",
    "#####.##.###....###.##.#####",
    "#####.##............##.#####",
    "#####..#####.##.#####..#####",
    "######.#####.##.#####.######",
    "#......##....##....##......#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#o..##................##..o#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#..........................#",
    "############################"
  ];

  var DIRS = {
    up: { name: "up", x: 0, y: -1, angle: -Math.PI / 2 },
    down: { name: "down", x: 0, y: 1, angle: Math.PI / 2 },
    left: { name: "left", x: -1, y: 0, angle: Math.PI },
    right: { name: "right", x: 1, y: 0, angle: 0 },
    none: { name: "none", x: 0, y: 0, angle: 0 }
  };
  var DIR_LIST = [DIRS.up, DIRS.left, DIRS.down, DIRS.right];
  var REVERSE = { up: "down", down: "up", left: "right", right: "left", none: "none" };
  var KEY_TO_DIR = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right"
  };

  var THEME_META = {
    classic: { label: "Classic", bg: "#000000", accent: "#ffff00" },
    neon: { label: "Neon", bg: "#120025", accent: "#00ff9f" },
    ocean: { label: "Ocean", bg: "#00203f", accent: "#00ffe7" },
    candy: { label: "Candy", bg: "#2d0044", accent: "#ff66cc" },
    forest: { label: "Forest", bg: "#0a120a", accent: "#66ff66" },
    retro: { label: "Retro", bg: "#e8d4a8", accent: "#cc0066" }
  };

  var DEFAULT_SETTINGS = {
    musicVolume: 70,
    sfxVolume: 90,
    theme: "classic",
    difficulty: "normal",
    bgmContinuous: true,
    vibration: true
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function formatScore(value) {
    return String(Math.max(0, Math.floor(value))).padStart(5, "0");
  }

  function safeRead(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      return false;
    }
    return true;
  }

  function cloneMaze(rows) {
    return rows.map(function (row) {
      return row.split("");
    });
  }

  function countDots(maze) {
    var total = 0;
    for (var y = 0; y < maze.length; y += 1) {
      for (var x = 0; x < maze[y].length; x += 1) {
        if (maze[y][x] === "." || maze[y][x] === "o") {
          total += 1;
        }
      }
    }
    return total;
  }

  function wrapCol(col) {
    if (col < 0) return COLS - 1;
    if (col >= COLS) return 0;
    return col;
  }

  function validateMazeTemplate() {
    if (MAZE_TEMPLATE.length !== ROWS) {
      console.warn("Maze row count mismatch:", MAZE_TEMPLATE.length);
    }
    MAZE_TEMPLATE.forEach(function (row, index) {
      if (row.length !== COLS) {
        console.warn("Maze width mismatch at row " + index + ":", row.length);
      }
    });
  }

  function AudioManager(getSettings) {
    this.getSettings = getSettings;
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicTimer = null;
    this.musicTrack = "";
    this.musicStep = 0;
  }

  AudioManager.prototype.ensure = function () {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return true;
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    this.ctx = new AudioContext();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);
    this.applyVolumes();
    return true;
  };

  AudioManager.prototype.applyVolumes = function () {
    if (!this.ctx) return;
    var settings = this.getSettings();
    this.musicGain.gain.setTargetAtTime((settings.musicVolume || 0) / 100 * 0.18, this.ctx.currentTime, 0.03);
    this.sfxGain.gain.setTargetAtTime((settings.sfxVolume || 0) / 100 * 0.55, this.ctx.currentTime, 0.02);
  };

  AudioManager.prototype.stopMusic = function () {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.musicTrack = "";
  };

  AudioManager.prototype.playBGM = function (track) {
    var settings = this.getSettings();
    if (!settings.bgmContinuous || settings.musicVolume <= 0) {
      this.stopMusic();
      return;
    }
    if (!this.ensure()) return;
    if (this.musicTrack === track && this.musicTimer) return;
    this.stopMusic();
    this.musicTrack = track;
    this.musicStep = 0;
    this.applyVolumes();
    this.scheduleMusicNote();
    var interval = track === "menu-theme" ? 260 : track === "game-over-theme" ? 420 : 180;
    this.musicTimer = window.setInterval(this.scheduleMusicNote.bind(this), interval);
  };

  AudioManager.prototype.scheduleMusicNote = function () {
    if (!this.ctx || !this.musicGain) return;
    var now = this.ctx.currentTime;
    var track = this.musicTrack;
    var menu = [196, 246.94, 293.66, 246.94];
    var game = [261.63, 329.63, 392, 493.88, 392, 329.63];
    var late = [329.63, 415.3, 493.88, 622.25, 493.88, 415.3];
    var over = [220, 196, 164.81, 146.83];
    var notes = track === "menu-theme" ? menu : track === "game-theme-2" ? late : track === "game-over-theme" ? over : game;
    var frequency = notes[this.musicStep % notes.length];
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.type = track === "game-over-theme" ? "triangle" : "square";
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.15);
    this.musicStep += 1;
  };

  AudioManager.prototype.tone = function (frequency, duration, type, gainValue, startAt) {
    if (!this.ensure()) return;
    var now = startAt || this.ctx.currentTime;
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  };

  AudioManager.prototype.sweep = function (from, to, duration, type, gainValue) {
    if (!this.ensure()) return;
    var now = this.ctx.currentTime;
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
    gain.gain.setValueAtTime(gainValue || 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  };

  AudioManager.prototype.playSFX = function (name) {
    var settings = this.getSettings();
    if (settings.sfxVolume <= 0) return;
    if (!this.ensure()) return;
    this.applyVolumes();
    if (name === "chomp") {
      this.sweep(220, 110, 0.055, "square", 0.22);
    } else if (name === "power-up") {
      this.sweep(180, 960, 0.28, "sawtooth", 0.18);
      this.tone(520, 0.08, "triangle", 0.2, this.ctx.currentTime + 0.08);
    } else if (name === "ghost-eat") {
      this.sweep(520, 920, 0.18, "triangle", 0.32);
    } else if (name === "ghost-return") {
      this.sweep(720, 260, 0.2, "sine", 0.2);
    } else if (name === "death") {
      this.sweep(440, 80, 0.62, "sawtooth", 0.35);
    } else if (name === "level-up") {
      this.tone(330, 0.08, "square", 0.25);
      this.tone(494, 0.08, "square", 0.25, this.ctx.currentTime + 0.09);
      this.tone(659, 0.15, "square", 0.25, this.ctx.currentTime + 0.18);
    } else if (name === "extra-life") {
      this.tone(523.25, 0.08, "triangle", 0.28);
      this.tone(659.25, 0.08, "triangle", 0.28, this.ctx.currentTime + 0.08);
      this.tone(783.99, 0.16, "triangle", 0.28, this.ctx.currentTime + 0.16);
    } else if (name === "button-click") {
      this.sweep(620, 300, 0.05, "square", 0.16);
    } else if (name === "intro") {
      this.tone(392, 0.09, "square", 0.22);
      this.tone(523.25, 0.09, "square", 0.22, this.ctx.currentTime + 0.11);
      this.tone(659.25, 0.15, "square", 0.22, this.ctx.currentTime + 0.22);
    }
  };

  function Game() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, safeRead(STORAGE.settings, {}));
    this.highScore = Number(safeRead(STORAGE.highScore, 0)) || 0;
    this.audio = new AudioManager(this.getSettings.bind(this));
    this.currentScreen = "menu";
    this.settingsReturnScreen = "menu";
    this.state = "MENU";
    this.canvas = $("#gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.tileSize = 20;
    this.boardWidth = COLS * this.tileSize;
    this.boardHeight = ROWS * this.tileSize;
    this.maze = cloneMaze(MAZE_TEMPLATE);
    this.remainingDots = countDots(this.maze);
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.nextExtraLife = 10000;
    this.powerTimer = 0;
    this.ghostEatValue = 200;
    this.readyTimer = 0;
    this.scatterClock = 0;
    this.lastTimestamp = 0;
    this.animationTime = 0;
    this.lastChompAt = 0;
    this.swipeStart = null;
    this.saveFlashTimer = 0;
    this.dom = {};
    this.resetActors();
  }

  Game.prototype.getSettings = function () {
    return this.settings;
  };

  Game.prototype.init = function () {
    validateMazeTemplate();
    this.cacheDom();
    this.buildThemeChoices();
    this.bindEvents();
    this.applySettingsToDom();
    this.applySettings();
    this.updateAllHud();
    this.updateContinueButton();
    this.resizeCanvas();
    this.switchScreen("menu");
    this.render();
    window.requestAnimationFrame(this.loop.bind(this));
  };

  Game.prototype.cacheDom = function () {
    this.dom.screens = {
      menu: $("#screen-menu"),
      instructions: $("#screen-instructions"),
      settings: $("#screen-settings"),
      game: $("#screen-game"),
      gameOver: $("#screen-game-over")
    };
    this.dom.headerHighScore = $("#headerHighScore");
    this.dom.headerPauseBtn = $("#headerPauseBtn");
    this.dom.menuHighScore = $("#menuHighScore");
    this.dom.newGameBtn = $("#newGameBtn");
    this.dom.continueGameBtn = $("#continueGameBtn");
    this.dom.instructionsBtn = $("#instructionsBtn");
    this.dom.settingsBtn = $("#settingsBtn");
    this.dom.pauseOverlay = $("#pauseOverlay");
    this.dom.resumeBtn = $("#resumeBtn");
    this.dom.saveQuitBtn = $("#saveQuitBtn");
    this.dom.restartBtn = $("#restartBtn");
    this.dom.pauseSettingsBtn = $("#pauseSettingsBtn");
    this.dom.playAgainBtn = $("#playAgainBtn");
    this.dom.scoreValue = $("#scoreValue");
    this.dom.levelValue = $("#levelValue");
    this.dom.highScoreValue = $("#highScoreValue");
    this.dom.lifeIcons = $("#lifeIcons");
    this.dom.dotCountValue = $("#dotCountValue");
    this.dom.modeValue = $("#modeValue");
    this.dom.saveStateValue = $("#saveStateValue");
    this.dom.readyBanner = $("#readyBanner");
    this.dom.finalScoreValue = $("#finalScoreValue");
    this.dom.finalHighScoreValue = $("#finalHighScoreValue");
    this.dom.finalLevelValue = $("#finalLevelValue");
    this.dom.musicVolume = $("#musicVolume");
    this.dom.sfxVolume = $("#sfxVolume");
    this.dom.musicVolumeValue = $("#musicVolumeValue");
    this.dom.sfxVolumeValue = $("#sfxVolumeValue");
    this.dom.themeChoices = $("#themeChoices");
    this.dom.difficultyChoices = $("#difficultyChoices");
    this.dom.bgmContinuous = $("#bgmContinuous");
    this.dom.vibrationToggle = $("#vibrationToggle");
    this.dom.resetSettingsBtn = $("#resetSettingsBtn");
    this.dom.resetScoreBtn = $("#resetScoreBtn");
  };

  Game.prototype.bindEvents = function () {
    var self = this;
    this.dom.newGameBtn.addEventListener("click", function () {
      self.uiClick();
      self.startNewGame();
    });
    this.dom.continueGameBtn.addEventListener("click", function () {
      self.uiClick();
      self.continueGame();
    });
    this.dom.instructionsBtn.addEventListener("click", function () {
      self.uiClick();
      self.switchScreen("instructions");
    });
    this.dom.settingsBtn.addEventListener("click", function () {
      self.uiClick();
      self.openSettings("menu");
    });
    this.dom.headerPauseBtn.addEventListener("click", function () {
      self.uiClick();
      self.pause();
    });
    this.dom.resumeBtn.addEventListener("click", function () {
      self.uiClick();
      self.resume();
    });
    this.dom.saveQuitBtn.addEventListener("click", function () {
      self.uiClick();
      self.saveGame("SAVED");
      self.switchScreen("menu");
    });
    this.dom.restartBtn.addEventListener("click", function () {
      self.uiClick();
      self.startNewGame();
    });
    this.dom.pauseSettingsBtn.addEventListener("click", function () {
      self.uiClick();
      self.openSettings("game");
    });
    this.dom.playAgainBtn.addEventListener("click", function () {
      self.uiClick();
      self.startNewGame();
    });
    $all(".back-to-menu").forEach(function (button) {
      button.addEventListener("click", function () {
        self.uiClick();
        self.handleBackButton();
      });
    });
    this.dom.musicVolume.addEventListener("input", function (event) {
      self.settings.musicVolume = Number(event.target.value);
      self.saveSettings();
    });
    this.dom.sfxVolume.addEventListener("input", function (event) {
      self.settings.sfxVolume = Number(event.target.value);
      self.saveSettings();
      self.audio.playSFX("button-click");
    });
    this.dom.bgmContinuous.addEventListener("change", function (event) {
      self.settings.bgmContinuous = event.target.checked;
      self.saveSettings();
      self.refreshMusicForScreen();
    });
    this.dom.vibrationToggle.addEventListener("change", function (event) {
      self.settings.vibration = event.target.checked;
      self.saveSettings();
      self.vibrate(10);
    });
    this.dom.resetSettingsBtn.addEventListener("click", function () {
      self.uiClick();
      self.settings = Object.assign({}, DEFAULT_SETTINGS);
      self.saveSettings();
      self.applySettingsToDom();
      self.applySettings();
      self.refreshMusicForScreen();
    });
    this.dom.resetScoreBtn.addEventListener("click", function () {
      self.uiClick();
      self.highScore = 0;
      safeWrite(STORAGE.highScore, 0);
      self.updateAllHud();
    });
    this.dom.difficultyChoices.addEventListener("click", function (event) {
      if (!event.target.matches("button[data-difficulty]")) return;
      self.uiClick();
      self.settings.difficulty = event.target.getAttribute("data-difficulty");
      self.saveSettings();
    });
    this.dom.themeChoices.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-theme]");
      if (!button) return;
      self.uiClick();
      self.settings.theme = button.getAttribute("data-theme");
      self.saveSettings();
    });
    $all(".mobile-controls button").forEach(function (button) {
      button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        self.setDirection(button.getAttribute("data-dir"));
        self.vibrate(10);
      });
    });
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    window.addEventListener("beforeunload", function () {
      if (self.state === "PLAYING" || self.state === "PAUSED") {
        self.saveGame("SAVED");
      }
    });
    this.canvas.addEventListener("pointerdown", function (event) {
      self.swipeStart = { x: event.clientX, y: event.clientY };
    });
    this.canvas.addEventListener("pointermove", function (event) {
      if (self.swipeStart) event.preventDefault();
    }, { passive: false });
    this.canvas.addEventListener("pointerup", function (event) {
      self.handleSwipe(event.clientX, event.clientY);
    });
    document.addEventListener("contextmenu", function (event) {
      if (self.currentScreen === "game") event.preventDefault();
    });
  };

  Game.prototype.buildThemeChoices = function () {
    var fragment = document.createDocumentFragment();
    Object.keys(THEME_META).forEach(function (key) {
      var meta = THEME_META[key];
      var button = document.createElement("button");
      var swatch = document.createElement("span");
      button.type = "button";
      button.className = "theme-choice";
      button.setAttribute("data-theme", key);
      button.setAttribute("title", meta.label);
      button.setAttribute("aria-label", meta.label);
      button.style.setProperty("--swatch-bg", meta.bg);
      button.style.setProperty("--swatch-accent", meta.accent);
      button.appendChild(swatch);
      fragment.appendChild(button);
    });
    this.dom.themeChoices.appendChild(fragment);
  };

  Game.prototype.handleKeyDown = function (event) {
    var dir = KEY_TO_DIR[event.code];
    if (dir) {
      event.preventDefault();
      this.setDirection(dir);
      return;
    }
    if (event.code === "Escape" || event.code === "KeyP") {
      if (this.state === "PLAYING") {
        event.preventDefault();
        this.pause();
      } else if (this.state === "PAUSED" && this.currentScreen === "game") {
        event.preventDefault();
        this.resume();
      }
    }
    if (event.code === "Enter" && this.currentScreen === "menu") {
      event.preventDefault();
      this.startNewGame();
    }
  };

  Game.prototype.handleSwipe = function (x, y) {
    if (!this.swipeStart) return;
    var dx = x - this.swipeStart.x;
    var dy = y - this.swipeStart.y;
    this.swipeStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.setDirection(dx > 0 ? "right" : "left");
    } else {
      this.setDirection(dy > 0 ? "down" : "up");
    }
  };

  Game.prototype.uiClick = function () {
    this.audio.playSFX("button-click");
    this.vibrate(10);
  };

  Game.prototype.vibrate = function (pattern) {
    if (this.settings.vibration && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  Game.prototype.saveSettings = function () {
    safeWrite(STORAGE.settings, this.settings);
    this.applySettingsToDom();
    this.applySettings();
  };

  Game.prototype.applySettings = function () {
    document.documentElement.setAttribute("data-theme", this.settings.theme);
    this.audio.applyVolumes();
    this.updateDifficultyButtons();
    this.updateThemeButtons();
  };

  Game.prototype.applySettingsToDom = function () {
    this.dom.musicVolume.value = this.settings.musicVolume;
    this.dom.sfxVolume.value = this.settings.sfxVolume;
    this.dom.musicVolumeValue.textContent = this.settings.musicVolume;
    this.dom.sfxVolumeValue.textContent = this.settings.sfxVolume;
    this.dom.bgmContinuous.checked = !!this.settings.bgmContinuous;
    this.dom.vibrationToggle.checked = !!this.settings.vibration;
  };

  Game.prototype.updateDifficultyButtons = function () {
    $all("#difficultyChoices button").forEach(function (button) {
      button.classList.toggle("is-selected", button.getAttribute("data-difficulty") === this.settings.difficulty);
    }, this);
  };

  Game.prototype.updateThemeButtons = function () {
    $all("#themeChoices button").forEach(function (button) {
      button.classList.toggle("is-selected", button.getAttribute("data-theme") === this.settings.theme);
    }, this);
  };

  Game.prototype.handleBackButton = function () {
    if (this.currentScreen === "settings" && this.settingsReturnScreen === "game") {
      this.switchScreen("game");
      this.showPauseOverlay(true);
      return;
    }
    if (this.currentScreen === "gameOver") {
      this.switchScreen("menu");
      return;
    }
    this.switchScreen("menu");
  };

  Game.prototype.openSettings = function (returnScreen) {
    this.settingsReturnScreen = returnScreen || "menu";
    if (returnScreen === "game") {
      this.state = "PAUSED";
      this.saveGame("SAVED");
      this.showPauseOverlay(false);
    }
    this.switchScreen("settings");
  };

  Game.prototype.switchScreen = function (screenName) {
    var normalized = screenName === "game-over" ? "gameOver" : screenName;
    Object.keys(this.dom.screens).forEach(function (key) {
      this.dom.screens[key].classList.toggle("is-active", key === normalized);
    }, this);
    this.currentScreen = normalized;
    document.body.setAttribute("data-screen", normalized);
    this.showPauseOverlay(normalized === "game" && this.state === "PAUSED");
    this.dom.headerPauseBtn.hidden = !(normalized === "game" && (this.state === "PLAYING" || this.state === "PAUSED"));
    if (normalized !== "game") {
      this.dom.headerPauseBtn.hidden = true;
    }
    this.updateContinueButton();
    this.refreshMusicForScreen();
    this.resizeCanvas();
  };

  Game.prototype.refreshMusicForScreen = function () {
    if (this.currentScreen === "game") {
      this.audio.playBGM(this.level >= 6 ? "game-theme-2" : "game-theme-1");
    } else if (this.currentScreen === "gameOver") {
      this.audio.playBGM("game-over-theme");
    } else {
      this.audio.playBGM("menu-theme");
    }
  };

  Game.prototype.showPauseOverlay = function (visible) {
    this.dom.pauseOverlay.hidden = !visible;
  };

  Game.prototype.updateContinueButton = function () {
    this.dom.continueGameBtn.disabled = !this.hasSave();
  };

  Game.prototype.hasSave = function () {
    var save = safeRead(STORAGE.save, null);
    return !!(save && save.lives > 0 && Array.isArray(save.mazeState));
  };

  Game.prototype.getDifficulty = function () {
    if (this.settings.difficulty === "easy") {
      return { lives: 5, pacmanSpeed: 6.2, ghostSpeed: 4.8, releaseScale: 0.45, readyTime: 1.0 };
    }
    if (this.settings.difficulty === "hard") {
      return { lives: 3, pacmanSpeed: 6.4, ghostSpeed: 6.5, releaseScale: 0.7, readyTime: 1.2 };
    }
    return { lives: 3, pacmanSpeed: 6.5, ghostSpeed: 5.7, releaseScale: 1, readyTime: 1.6 };
  };

  Game.prototype.resetActors = function () {
    var difficulty = this.getDifficulty();
    var releaseScale = difficulty.releaseScale || 1;
    var release = function (seconds) {
      return seconds * releaseScale;
    };
    this.pacman = {
      x: 13,
      y: 23,
      dir: DIRS.left,
      desiredDir: DIRS.left,
      radiusScale: 0.82
    };
    this.ghosts = [
      { name: "Blinky", colorVar: "--color-blinky", x: 13, y: 13, spawn: { x: 13, y: 13 }, dir: DIRS.left, mode: "CHASE", corner: { x: 26, y: 1 }, release: release(0) },
      { name: "Pinky", colorVar: "--color-pinky", x: 14, y: 13, spawn: { x: 14, y: 13 }, dir: DIRS.right, mode: "CHASE", corner: { x: 1, y: 1 }, release: release(1.5) },
      { name: "Inky", colorVar: "--color-inky", x: 13, y: 14, spawn: { x: 13, y: 14 }, dir: DIRS.up, mode: "CHASE", corner: { x: 26, y: 29 }, release: release(3) },
      { name: "Clyde", colorVar: "--color-clyde", x: 14, y: 14, spawn: { x: 14, y: 14 }, dir: DIRS.up, mode: "CHASE", corner: { x: 1, y: 29 }, release: release(4.5) }
    ];
  };

  Game.prototype.resetMaze = function () {
    this.maze = cloneMaze(MAZE_TEMPLATE);
    this.remainingDots = countDots(this.maze);
  };

  Game.prototype.startNewGame = function () {
    var difficulty = this.getDifficulty();
    this.audio.ensure();
    this.audio.playSFX("intro");
    safeRemove(STORAGE.save);
    this.score = 0;
    this.level = 1;
    this.lives = difficulty.lives;
    this.nextExtraLife = 10000;
    this.powerTimer = 0;
    this.ghostEatValue = 200;
    this.scatterClock = 0;
    this.resetMaze();
    this.resetActors();
    this.readyTimer = difficulty.readyTime;
    this.state = "PLAYING";
    this.updateAllHud();
    this.switchScreen("game");
  };

  Game.prototype.continueGame = function () {
    var save = safeRead(STORAGE.save, null);
    if (!save || !Array.isArray(save.mazeState)) return;
    this.audio.ensure();
    this.score = Number(save.score) || 0;
    this.level = Number(save.level) || 1;
    this.lives = Number(save.lives) || this.getDifficulty().lives;
    this.nextExtraLife = Math.max(10000, Math.ceil((this.score + 1) / 10000) * 10000);
    this.maze = save.mazeState.map(function (row) {
      return String(row).split("");
    });
    if (this.maze.length !== ROWS || this.maze.some(function (row) { return row.length !== COLS; })) {
      this.resetMaze();
    }
    this.remainingDots = countDots(this.maze);
    this.powerTimer = 0;
    this.ghostEatValue = 200;
    this.scatterClock = 0;
    this.resetActors();
    this.readyTimer = this.getDifficulty().readyTime;
    this.state = "PLAYING";
    this.saveFlashTimer = 1.4;
    this.updateAllHud();
    this.switchScreen("game");
  };

  Game.prototype.saveGame = function (label) {
    if (this.lives <= 0) return;
    var payload = {
      score: this.score,
      level: this.level,
      lives: this.lives,
      mazeState: this.maze.map(function (row) { return row.join(""); }),
      timestamp: Date.now()
    };
    safeWrite(STORAGE.save, payload);
    this.saveFlashTimer = 1.4;
    this.dom.saveStateValue.textContent = label || "SAVED";
    this.updateContinueButton();
  };

  Game.prototype.pause = function () {
    if (this.state !== "PLAYING") return;
    this.state = "PAUSED";
    this.saveGame("SAVED");
    this.showPauseOverlay(true);
    this.dom.headerPauseBtn.hidden = false;
  };

  Game.prototype.resume = function () {
    if (this.state !== "PAUSED") return;
    this.state = "PLAYING";
    this.readyTimer = Math.min(0.35, this.getDifficulty().readyTime);
    this.showPauseOverlay(false);
    this.dom.headerPauseBtn.hidden = false;
  };

  Game.prototype.setDirection = function (dirName) {
    if (!DIRS[dirName]) return;
    this.audio.ensure();
    if (this.state === "PLAYING") {
      this.pacman.desiredDir = DIRS[dirName];
    }
  };

  Game.prototype.loop = function (timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    var dt = Math.min(FIXED_MAX_DT, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.animationTime += dt;
    if (this.state === "PLAYING") {
      this.update(dt);
    }
    this.render();
    window.requestAnimationFrame(this.loop.bind(this));
  };

  Game.prototype.update = function (dt) {
    if (this.readyTimer > 0) {
      this.readyTimer = Math.max(0, this.readyTimer - dt);
      this.updateAllHud();
      return;
    }
    if (this.saveFlashTimer > 0) {
      this.saveFlashTimer -= dt;
    }
    this.scatterClock += dt;
    if (this.powerTimer > 0) {
      this.powerTimer = Math.max(0, this.powerTimer - dt);
      if (this.powerTimer === 0) {
        this.ghostEatValue = 200;
      }
    }
    this.updatePacman(dt);
    this.updateGhosts(dt);
    this.checkCollisions();
    this.updateAllHud();
  };

  Game.prototype.updatePacman = function (dt) {
    var speed = this.getDifficulty().pacmanSpeed + Math.min(2.2, (this.level - 1) * 0.12);
    this.moveEntity(this.pacman, dt, speed, "pacman");
    this.consumeCurrentTile();
  };

  Game.prototype.updateGhosts = function (dt) {
    var base = this.getDifficulty().ghostSpeed + Math.min(2.6, (this.level - 1) * 0.16);
    for (var i = 0; i < this.ghosts.length; i += 1) {
      var ghost = this.ghosts[i];
      var mode = this.getGhostMode(ghost);
      ghost.mode = mode;
      if (this.readyTimer > 0 || ghost.release > this.scatterClock) continue;
      var speed = mode === "FRIGHTENED" ? base * 0.72 : mode === "EATEN" ? base * 1.45 : base;
      if (this.isAtCenter(ghost, 0.08)) {
        this.snapToCenter(ghost);
        ghost.dir = this.chooseGhostDirection(ghost, mode);
      }
      this.moveEntity(ghost, dt, speed, "ghost");
      if (mode === "EATEN" && distance(ghost, ghost.spawn) < 0.35) {
        ghost.mode = "CHASE";
        ghost.x = ghost.spawn.x;
        ghost.y = ghost.spawn.y;
        this.audio.playSFX("ghost-return");
      }
    }
  };

  Game.prototype.getGhostMode = function (ghost) {
    if (ghost.mode === "EATEN") return "EATEN";
    if (this.powerTimer > 0) return "FRIGHTENED";
    var cycle = this.scatterClock % 27;
    return cycle < 7 ? "SCATTER" : "CHASE";
  };

  Game.prototype.moveEntity = function (entity, dt, speed, type) {
    if (this.isAtCenter(entity, 0.09)) {
      this.snapToCenter(entity);
      if (type === "pacman" && this.canMove(entity, entity.desiredDir, type)) {
        entity.dir = entity.desiredDir;
      }
      if (!this.canMove(entity, entity.dir, type)) {
        entity.dir = DIRS.none;
      }
    }
    entity.x += entity.dir.x * speed * dt;
    entity.y += entity.dir.y * speed * dt;
    if (entity.x < -0.6) entity.x = COLS - 0.45;
    if (entity.x > COLS - 0.4) entity.x = -0.55;
    entity.y = clamp(entity.y, 0, ROWS - 1);
  };

  Game.prototype.isAtCenter = function (entity, epsilon) {
    return Math.abs(entity.x - Math.round(entity.x)) < epsilon &&
      Math.abs(entity.y - Math.round(entity.y)) < epsilon;
  };

  Game.prototype.snapToCenter = function (entity) {
    if (entity.x >= -0.2 && entity.x <= COLS - 0.8) {
      entity.x = Math.round(entity.x);
    }
    entity.y = Math.round(entity.y);
  };

  Game.prototype.canMove = function (entity, dir, type) {
    if (!dir || dir.name === "none") return false;
    var col = Math.round(entity.x) + dir.x;
    var row = Math.round(entity.y) + dir.y;
    if (row < 0 || row >= ROWS) return false;
    if (col < 0 || col >= COLS) {
      col = wrapCol(col);
    }
    var tile = this.maze[row][col];
    if (tile === "#") return false;
    if (type === "pacman" && tile === "H") return false;
    return true;
  };

  Game.prototype.consumeCurrentTile = function () {
    if (!this.isAtCenter(this.pacman, 0.18)) return;
    var col = wrapCol(Math.round(this.pacman.x));
    var row = Math.round(this.pacman.y);
    var tile = this.maze[row] && this.maze[row][col];
    if (tile !== "." && tile !== "o") return;
    this.maze[row][col] = " ";
    this.remainingDots -= 1;
    if (tile === ".") {
      this.addScore(10);
      var now = performance.now();
      if (now - this.lastChompAt > 70) {
        this.audio.playSFX("chomp");
        this.lastChompAt = now;
      }
    } else {
      this.addScore(50);
      this.powerTimer = POWER_DURATION;
      this.ghostEatValue = 200;
      this.audio.playSFX("power-up");
      this.vibrate(40);
    }
    if (this.remainingDots <= 0) {
      this.nextLevel();
    }
  };

  Game.prototype.addScore = function (points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      safeWrite(STORAGE.highScore, this.highScore);
    }
    while (this.score >= this.nextExtraLife) {
      this.lives += 1;
      this.nextExtraLife += 10000;
      this.audio.playSFX("extra-life");
    }
  };

  Game.prototype.nextLevel = function () {
    this.level += 1;
    this.powerTimer = 0;
    this.ghostEatValue = 200;
    this.scatterClock = 0;
    this.resetMaze();
    this.resetActors();
    this.readyTimer = this.getDifficulty().readyTime;
    this.audio.playSFX("level-up");
    this.refreshMusicForScreen();
    this.saveGame("LEVEL");
  };

  Game.prototype.chooseGhostDirection = function (ghost, mode) {
    var valid = [];
    for (var i = 0; i < DIR_LIST.length; i += 1) {
      var dir = DIR_LIST[i];
      if (this.canMove(ghost, dir, "ghost")) {
        valid.push(dir);
      }
    }
    if (!valid.length) return DIRS.none;
    var forward = valid.filter(function (dir) {
      return dir.name !== REVERSE[ghost.dir.name];
    });
    if (forward.length) valid = forward;
    if (mode === "FRIGHTENED") {
      return valid[Math.floor(Math.random() * valid.length)];
    }
    var target = mode === "SCATTER" ? ghost.corner : this.getGhostTarget(ghost, mode);
    var best = valid[0];
    var bestScore = Infinity;
    for (var j = 0; j < valid.length; j += 1) {
      var option = valid[j];
      var next = {
        x: Math.round(ghost.x) + option.x,
        y: Math.round(ghost.y) + option.y
      };
      next.x = wrapCol(next.x);
      var d = Math.pow(next.x - target.x, 2) + Math.pow(next.y - target.y, 2);
      if (d < bestScore) {
        best = option;
        bestScore = d;
      }
    }
    return best;
  };

  Game.prototype.getGhostTarget = function (ghost, mode) {
    if (mode === "EATEN") return ghost.spawn;
    var pac = this.pacman;
    if (ghost.name === "Blinky") {
      return { x: pac.x, y: pac.y };
    }
    if (ghost.name === "Pinky") {
      return {
        x: clamp(Math.round(pac.x + pac.dir.x * 4), 0, COLS - 1),
        y: clamp(Math.round(pac.y + pac.dir.y * 4), 0, ROWS - 1)
      };
    }
    if (ghost.name === "Inky") {
      var blinky = this.ghosts[0];
      var ahead = {
        x: pac.x + pac.dir.x * 2,
        y: pac.y + pac.dir.y * 2
      };
      return {
        x: clamp(Math.round(ahead.x + (ahead.x - blinky.x)), 0, COLS - 1),
        y: clamp(Math.round(ahead.y + (ahead.y - blinky.y)), 0, ROWS - 1)
      };
    }
    if (ghost.name === "Clyde" && distance(ghost, pac) < 8) {
      return ghost.corner;
    }
    return { x: pac.x, y: pac.y };
  };

  Game.prototype.checkCollisions = function () {
    for (var i = 0; i < this.ghosts.length; i += 1) {
      var ghost = this.ghosts[i];
      if (ghost.mode === "EATEN") continue;
      if (distance(this.pacman, ghost) > 0.58) continue;
      if (ghost.mode === "FRIGHTENED") {
        this.addScore(this.ghostEatValue);
        this.ghostEatValue = Math.min(1600, this.ghostEatValue * 2);
        ghost.mode = "EATEN";
        ghost.dir = DIRS.up;
        this.audio.playSFX("ghost-eat");
        this.vibrate(50);
      } else {
        this.loseLife();
        break;
      }
    }
  };

  Game.prototype.loseLife = function () {
    this.lives -= 1;
    this.powerTimer = 0;
    this.ghostEatValue = 200;
    this.audio.playSFX("death");
    this.vibrate([200, 100, 200]);
    if (this.lives <= 0) {
      this.gameOver();
      return;
    }
    this.resetActors();
    this.readyTimer = this.getDifficulty().readyTime;
    this.saveGame("SAVED");
  };

  Game.prototype.gameOver = function () {
    this.state = "GAME_OVER";
    safeRemove(STORAGE.save);
    this.updateAllHud();
    this.dom.finalScoreValue.textContent = formatScore(this.score);
    this.dom.finalHighScoreValue.textContent = formatScore(this.highScore);
    this.dom.finalLevelValue.textContent = this.level;
    this.switchScreen("gameOver");
  };

  Game.prototype.updateAllHud = function () {
    this.dom.headerHighScore.textContent = formatScore(this.highScore);
    this.dom.menuHighScore.textContent = formatScore(this.highScore);
    this.dom.scoreValue.textContent = formatScore(this.score);
    this.dom.levelValue.textContent = this.level;
    this.dom.highScoreValue.textContent = formatScore(this.highScore);
    this.dom.dotCountValue.textContent = String(Math.max(0, this.remainingDots)).padStart(3, "0");
    this.dom.modeValue.textContent = this.powerTimer > 0 ? "POWER" : (this.scatterClock % 27 < 7 ? "SCATTER" : "CHASE");
    if (this.saveFlashTimer <= 0 && this.dom.saveStateValue.textContent !== "READY") {
      this.dom.saveStateValue.textContent = "READY";
    }
    this.dom.readyBanner.hidden = !(this.currentScreen === "game" && this.readyTimer > 0);
    this.dom.lifeIcons.innerHTML = "";
    for (var i = 0; i < Math.min(8, this.lives); i += 1) {
      var icon = document.createElement("span");
      icon.className = "life-icon";
      this.dom.lifeIcons.appendChild(icon);
    }
  };

  Game.prototype.resizeCanvas = function () {
    var reservedHeight = window.innerWidth < 1024 ? 260 : 126;
    var maxByWidth = window.innerWidth * 0.95;
    var maxByHeight = Math.max(260, window.innerHeight - reservedHeight) * (COLS / ROWS);
    var targetWidth = Math.min(maxByWidth, maxByHeight, 560);
    this.tileSize = Math.max(10, Math.floor(targetWidth / COLS));
    this.boardWidth = this.tileSize * COLS;
    this.boardHeight = this.tileSize * ROWS;
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.canvas.style.width = this.boardWidth + "px";
    this.canvas.style.height = this.boardHeight + "px";
    this.canvas.width = Math.floor(this.boardWidth * dpr);
    this.canvas.height = Math.floor(this.boardHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  };

  Game.prototype.render = function () {
    if (!this.ctx) return;
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    ctx.fillStyle = this.cssVar("--color-bg");
    ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
    this.drawMaze(ctx);
    for (var i = 0; i < this.ghosts.length; i += 1) {
      this.drawGhost(ctx, this.ghosts[i]);
    }
    this.drawPacman(ctx);
  };

  Game.prototype.cssVar = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  Game.prototype.drawMaze = function (ctx) {
    var tile = this.tileSize;
    var mazeColor = this.cssVar("--color-maze");
    var dotColor = this.cssVar("--color-dot");
    var bgColor = this.cssVar("--color-bg");
    for (var y = 0; y < ROWS; y += 1) {
      for (var x = 0; x < COLS; x += 1) {
        var tileType = this.maze[y][x];
        var px = x * tile;
        var py = y * tile;
        if (tileType === "#") {
          ctx.fillStyle = mazeColor;
          this.roundRect(ctx, px + tile * 0.08, py + tile * 0.08, tile * 0.84, tile * 0.84, tile * 0.18);
          ctx.fill();
          ctx.fillStyle = bgColor;
          this.roundRect(ctx, px + tile * 0.28, py + tile * 0.28, tile * 0.44, tile * 0.44, tile * 0.1);
          ctx.fill();
        } else if (tileType === "." || tileType === "o") {
          ctx.fillStyle = dotColor;
          ctx.beginPath();
          var radius = tileType === "o"
            ? tile * (0.22 + Math.sin(this.animationTime * 8) * 0.04)
            : tile * 0.085;
          ctx.arc(px + tile / 2, py + tile / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (tileType === "H") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.fillRect(px + tile * 0.12, py + tile * 0.12, tile * 0.76, tile * 0.76);
        }
      }
    }
    ctx.strokeStyle = mazeColor;
    ctx.lineWidth = Math.max(2, tile * 0.08);
    ctx.setLineDash([tile * 0.35, tile * 0.25]);
    ctx.beginPath();
    ctx.moveTo(0, 14.5 * tile);
    ctx.lineTo(2 * tile, 14.5 * tile);
    ctx.moveTo(26 * tile, 14.5 * tile);
    ctx.lineTo(28 * tile, 14.5 * tile);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  Game.prototype.drawPacman = function (ctx) {
    var tile = this.tileSize;
    var cx = (this.pacman.x + 0.5) * tile;
    var cy = (this.pacman.y + 0.5) * tile;
    var radius = tile * 0.42;
    var moving = this.pacman.dir.name !== "none";
    var mouth = moving ? 0.18 + Math.abs(Math.sin(this.animationTime * 13)) * 0.36 : 0.08;
    var angle = this.pacman.dir.angle;
    ctx.fillStyle = this.cssVar("--color-pacman");
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle + mouth, angle - mouth, false);
    ctx.closePath();
    ctx.fill();
  };

  Game.prototype.drawGhost = function (ctx, ghost) {
    var tile = this.tileSize;
    var cx = (ghost.x + 0.5) * tile;
    var cy = (ghost.y + 0.5) * tile;
    var width = tile * 0.82;
    var height = tile * 0.84;
    var left = cx - width / 2;
    var top = cy - height / 2;
    var mode = this.getGhostMode(ghost);
    if (mode === "EATEN") {
      this.drawGhostEyes(ctx, cx, cy, tile, ghost.dir);
      return;
    }
    var frightenedBlink = mode === "FRIGHTENED" && this.powerTimer < 2 && Math.floor(this.animationTime * 8) % 2 === 0;
    ctx.fillStyle = mode === "FRIGHTENED"
      ? (frightenedBlink ? "#ffffff" : "#243cff")
      : this.cssVar(ghost.colorVar);
    ctx.beginPath();
    ctx.arc(cx, top + width / 2, width / 2, Math.PI, 0);
    ctx.lineTo(left + width, top + height * 0.72);
    var waveY = top + height;
    var wave = width / 4;
    ctx.lineTo(left + width * 0.75, waveY - tile * 0.14);
    ctx.lineTo(left + width * 0.5, waveY);
    ctx.lineTo(left + width * 0.25, waveY - tile * 0.14);
    ctx.lineTo(left, waveY);
    ctx.lineTo(left, top + width / 2);
    ctx.closePath();
    ctx.fill();
    this.drawGhostEyes(ctx, cx, cy - tile * 0.06, tile, ghost.dir);
  };

  Game.prototype.drawGhostEyes = function (ctx, cx, cy, tile, dir) {
    var eyeOffset = tile * 0.16;
    var pupilOffsetX = dir.x * tile * 0.055;
    var pupilOffsetY = dir.y * tile * 0.055;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffset, cy - tile * 0.08, tile * 0.11, tile * 0.15, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeOffset, cy - tile * 0.08, tile * 0.11, tile * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1111aa";
    ctx.beginPath();
    ctx.arc(cx - eyeOffset + pupilOffsetX, cy - tile * 0.08 + pupilOffsetY, tile * 0.052, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + pupilOffsetX, cy - tile * 0.08 + pupilOffsetY, tile * 0.052, 0, Math.PI * 2);
    ctx.fill();
  };

  Game.prototype.roundRect = function (ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  document.addEventListener("DOMContentLoaded", function () {
    var game = new Game();
    game.init();
    window.pacmanGame = game;
  });
}());
