"use strict";

const STORAGE_KEYS = {
  SETTINGS: "boxmaster_settings",
  PROGRESS: "boxmaster_progress",
  RECORDS: "boxmaster_records",
};

const DEFAULT_SETTINGS = {
  musicVolume: 45,
  sfxVolume: 80,
  musicStyle: "RELAX",
  cellSize: "auto",
  darkMode: true,
  haptic: true,
  undoLimit: 99,
  showTimer: true,
  showStepCount: true,
};

const DIFFICULTIES = {
  easy: { label: "新手", color: "#4caf73", count: 20 },
  medium: { label: "進階", color: "#f2994a", count: 20 },
  hard: { label: "高手", color: "#e85f54", count: 20 },
};

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const LEVEL_TEMPLATES = {
  easy: [
    ["#######", "#     #", "#  $  #", "#  .  #", "#  @  #", "#     #", "#######"],
    ["######", "#    #", "# $@ #", "# .  #", "#    #", "######"],
    ["#######", "#     #", "# $ $ #", "# . . #", "#  @  #", "#     #", "#######"],
    ["#######", "#  .  #", "#  $  #", "#  $  #", "#  .  #", "#  @  #", "#######"],
    ["########", "#      #", "# $$   #", "# ..   #", "#  @   #", "#      #", "########"],
    ["########", "#      #", "#  .   #", "#  $   #", "#  @ $ #", "#    . #", "#      #", "########"],
    ["########", "#      #", "#  $   #", "#  .   #", "#  @   #", "#      #", "#      #", "########"],
    ["#######", "# . . #", "# $$$ #", "#  @  #", "#  .  #", "#     #", "#######"],
    ["#####", "#   #", "# $ #", "# . #", "# $ #", "# . #", "# @ #", "#   #", "#####"],
    ["########", "#      #", "#  $$  #", "#  ..  #", "#  @   #", "#      #", "#      #", "########"],
  ],
  medium: [
    ["#########", "#       #", "#  ###  #", "#  $ $  #", "#  . .  #", "#   @   #", "#       #", "#       #", "#########"],
    ["##########", "#        #", "#  . .   #", "#  $ $   #", "#   @    #", "#   ###  #", "#        #", "##########"],
    ["#########", "#       #", "# . . . #", "# $ $ $ #", "#   @   #", "#  ###  #", "#       #", "#       #", "#########"],
    ["##########", "#        #", "#  .##.  #", "#  $  $  #", "#   @    #", "#        #", "#   ##   #", "#        #", "##########"],
    ["##########", "#        #", "# . . .  #", "# $ $ $  #", "#   @    #", "#  ####  #", "#        #", "#        #", "##########"],
    ["##########", "#        #", "#  ..    #", "#  $$    #", "#   @    #", "#    $   #", "#    .   #", "#        #", "#        #", "##########"],
    ["#########", "#       #", "# . . . #", "# $#$ $ #", "#   @   #", "#       #", "#       #", "#       #", "#########"],
    ["##########", "#        #", "#  . .   #", "#  $ $   #", "#  ##    #", "#   @    #", "#    $.  #", "#        #", "##########"],
    ["##########", "#        #", "#  ....  #", "#  $$$$  #", "#   @    #", "#   ##   #", "#        #", "#        #", "##########"],
    ["#########", "#       #", "# .. .. #", "# $$ $$ #", "#   @   #", "#  ###  #", "#       #", "#       #", "#########"],
  ],
  hard: [
    ["###########", "#         #", "#  . . .  #", "#  $ $ $  #", "#   ###   #", "#    @    #", "#         #", "#         #", "#         #", "###########"],
    ["###########", "#         #", "# . . . . #", "# $ $ $ $ #", "#    @    #", "#  #####  #", "#         #", "#         #", "#         #", "###########"],
    ["############", "#          #", "#  ..  ..  #", "#  $$  $$  #", "#    @     #", "#  ####    #", "#          #", "#          #", "#          #", "###########"],
    ["###########", "#         #", "# . . . . #", "# $ $ $ $ #", "#   ###   #", "#    @    #", "#   ###   #", "#         #", "#         #", "#         #", "###########"],
    ["############", "#          #", "#  . . .   #", "#  $ $ $   #", "#    @     #", "#   ####   #", "#     $.   #", "#     $.   #", "#          #", "#          #", "############"],
    ["############", "#          #", "#  ......  #", "#  $$$$$$  #", "#    @     #", "#   ####   #", "#          #", "#          #", "#          #", "#          #", "############"],
    ["###########", "#         #", "# .. . .. #", "# $$ $ $$ #", "#    @    #", "#  #####  #", "#         #", "#         #", "#         #", "#         #", "###########"],
    ["############", "#          #", "# . . . .  #", "# $ $ $ $  #", "#   ##     #", "#    @     #", "#     $.   #", "#     $.   #", "#          #", "#          #", "############"],
    ["############", "#          #", "#  .. ..   #", "#  $$ $$   #", "#    @     #", "#  ######  #", "#    $.    #", "#    $.    #", "#          #", "#          #", "############"],
    ["############", "#          #", "#  ......  #", "#  $$$$$$  #", "#    @     #", "#  ######  #", "#          #", "#          #", "#          #", "#          #", "############"],
  ],
};

const LEVEL_NAMES = {
  easy: ["暖身一步", "推進教室", "雙箱入門", "直線倉庫", "並排練習", "角落避讓", "窄房間", "三箱同列", "長廊", "基礎總測"],
  medium: ["分隔牆", "側翼推送", "三點整理", "雙門庫房", "長牆轉位", "分段收納", "中央障礙", "側邊補位", "四箱排列", "交錯路線"],
  hard: ["高牆之間", "四箱壓力", "倉庫折返", "雙牆中庭", "側翼雙點", "六箱列陣", "交錯陣列", "補位工廠", "雙段推進", "最終倉庫"],
};

function buildLevels() {
  const levels = {};
  for (const [difficulty, templates] of Object.entries(LEVEL_TEMPLATES)) {
    levels[difficulty] = [];
    for (let i = 0; i < 20; i += 1) {
      const grid = ensureTargetCapacity(templates[i % templates.length]);
      const index = i + 1;
      const boxCount = grid.join("").replace(/[^$*]/g, "").length;
      const basePar = difficulty === "easy" ? 8 : difficulty === "medium" ? 24 : 55;
      levels[difficulty].push({
        id: `${difficulty}_${String(index).padStart(2, "0")}`,
        difficulty,
        index,
        name: `${LEVEL_NAMES[difficulty][i % templates.length]} ${i >= 10 ? "II" : ""}`.trim(),
        width: Math.max(...grid.map((row) => row.length)),
        height: grid.length,
        par: basePar + i * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 4) + boxCount,
        grid: normalizeGrid(grid),
        hint: "先觀察目標點和牆的位置，避免把箱子推進角落。",
      });
    }
  }
  return levels;
}

function normalizeGrid(grid) {
  const width = Math.max(...grid.map((row) => row.length));
  return grid.map((row) => row.padEnd(width, "#"));
}

function ensureTargetCapacity(grid) {
  const normalized = normalizeGrid(grid).map((row) => row.split(""));
  const boxCount = normalized.flat().filter((char) => char === "$" || char === "*").length;
  let targetCount = normalized.flat().filter((char) => char === "." || char === "*" || char === "+").length;
  if (targetCount >= boxCount) return normalized.map((row) => row.join(""));

  for (let y = normalized.length - 2; y > 0 && targetCount < boxCount; y -= 1) {
    for (let x = normalized[y].length - 2; x > 0 && targetCount < boxCount; x -= 1) {
      if (normalized[y][x] === " ") {
        normalized[y][x] = ".";
        targetCount += 1;
      }
    }
  }
  return normalized.map((row) => row.join(""));
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.music = null;
    this.sfx = null;
    this.timer = null;
    this.settings = DEFAULT_SETTINGS;
    this.unlocked = false;
  }

  attach(settings) {
    this.settings = settings;
  }

  ensure() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.music = this.ctx.createGain();
    this.sfx = this.ctx.createGain();
    this.music.connect(this.master);
    this.sfx.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.setVolumes();
  }

  resume() {
    this.ensure();
    this.unlocked = true;
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  setVolumes() {
    if (!this.ctx) return;
    this.music.gain.value = this.settings.musicVolume / 100;
    this.sfx.gain.value = this.settings.sfxVolume / 100;
  }

  playSfx(id) {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    const osc = this.ctx.createOscillator();
    const noise = id === "push" || id === "wall";
    const table = {
      move: [260, 0.07, "triangle", 0.12],
      push: [150, 0.15, "sawtooth", 0.18],
      place: [520, 0.22, "sine", 0.18],
      win: [660, 0.5, "triangle", 0.22],
      undo: [220, 0.1, "sine", 0.14],
      reset: [110, 0.18, "square", 0.14],
      wall: [80, 0.09, "square", 0.16],
      button: [420, 0.06, "sine", 0.1],
      lock: [90, 0.18, "sawtooth", 0.12],
    };
    const [freq, dur, type, volume] = table[id] || table.button;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.6), now + dur);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(this.sfx);
    osc.start(now);
    osc.stop(now + dur);
    if (noise) {
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = this.ctx.createBufferSource();
      const ng = this.ctx.createGain();
      ng.gain.value = 0.05;
      src.buffer = buffer;
      src.connect(ng);
      ng.connect(this.sfx);
      src.start(now);
    }
  }

  startMusic() {
    if (!this.unlocked) return;
    this.resume();
    if (!this.ctx || this.timer || this.settings.musicVolume === 0) return;
    const styles = {
      RELAX: [261.63, 329.63, 392, 329.63],
      FOCUS: [220, 277.18, 329.63, 415.3],
      TENSION: [196, 233.08, 261.63, 311.13],
      PIXEL: [523.25, 659.25, 783.99, 987.77],
    };
    const notes = styles[this.settings.musicStyle] || styles.RELAX;
    let step = 0;
    this.timer = setInterval(() => {
      if (!this.ctx || this.settings.musicVolume === 0) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = this.settings.musicStyle === "PIXEL" ? "square" : "sine";
      osc.frequency.value = notes[step % notes.length];
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.connect(gain);
      gain.connect(this.music);
      osc.start(now);
      osc.stop(now + 0.42);
      step += 1;
    }, this.settings.musicStyle === "TENSION" ? 430 : 620);
  }

  stopMusic() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

class Game {
  constructor(levels, audio) {
    this.levels = levels;
    this.audio = audio;
    this.level = null;
    this.base = [];
    this.player = { x: 0, y: 0 };
    this.boxes = new Set();
    this.history = [];
    this.steps = 0;
    this.startedAt = 0;
    this.elapsedBeforePause = 0;
    this.status = "idle";
  }

  load(level) {
    this.level = level;
    this.base = level.grid.map((row) => row.split("").map((char) => (char === "#" ? "#" : char === "." || char === "*" || char === "+" ? "." : " ")));
    this.boxes = new Set();
    this.history = [];
    this.steps = 0;
    this.elapsedBeforePause = 0;
    this.status = "playing";
    level.grid.forEach((row, y) => {
      [...row].forEach((char, x) => {
        if (char === "@" || char === "+") this.player = { x, y };
        if (char === "$" || char === "*") this.boxes.add(this.key(x, y));
      });
    });
    this.startedAt = Date.now();
  }

  key(x, y) {
    return `${x},${y}`;
  }

  snapshot() {
    return {
      player: { ...this.player },
      boxes: [...this.boxes],
      steps: this.steps,
      elapsedBeforePause: this.elapsedBeforePause,
      startedAt: this.startedAt,
    };
  }

  restore(snapshot) {
    this.player = { ...snapshot.player };
    this.boxes = new Set(snapshot.boxes);
    this.steps = snapshot.steps;
    this.elapsedBeforePause = snapshot.elapsedBeforePause;
    this.startedAt = snapshot.startedAt;
    this.status = "playing";
  }

  isWall(x, y) {
    return y < 0 || y >= this.base.length || x < 0 || x >= this.base[y].length || this.base[y][x] === "#";
  }

  isBox(x, y) {
    return this.boxes.has(this.key(x, y));
  }

  isTarget(x, y) {
    return this.base[y]?.[x] === ".";
  }

  move(direction, undoLimit) {
    if (this.status !== "playing") return "paused";
    const dir = DIRS[direction];
    const nx = this.player.x + dir.x;
    const ny = this.player.y + dir.y;
    if (this.isWall(nx, ny)) return "wall";
    const nextKey = this.key(nx, ny);
    if (this.boxes.has(nextKey)) {
      const bx = nx + dir.x;
      const by = ny + dir.y;
      const boxKey = this.key(bx, by);
      if (this.isWall(bx, by) || this.boxes.has(boxKey)) return "blocked";
      this.pushHistory(undoLimit);
      this.boxes.delete(nextKey);
      this.boxes.add(boxKey);
      this.player = { x: nx, y: ny };
      this.steps += 1;
      return this.isTarget(bx, by) ? "place" : "push";
    }
    this.pushHistory(undoLimit);
    this.player = { x: nx, y: ny };
    this.steps += 1;
    return "move";
  }

  pushHistory(limit) {
    this.history.push(this.snapshot());
    while (this.history.length > limit) this.history.shift();
  }

  undo() {
    const snapshot = this.history.pop();
    if (!snapshot) return false;
    this.restore(snapshot);
    return true;
  }

  pause() {
    if (this.status !== "playing") return;
    this.elapsedBeforePause = this.elapsed();
    this.status = "paused";
  }

  resume() {
    if (this.status !== "paused") return;
    this.startedAt = Date.now();
    this.status = "playing";
  }

  elapsed() {
    if (!this.startedAt) return 0;
    const live = this.status === "playing" ? Date.now() - this.startedAt : 0;
    return Math.floor((this.elapsedBeforePause + live) / 1000);
  }

  won() {
    for (const box of this.boxes) {
      const [x, y] = box.split(",").map(Number);
      if (!this.isTarget(x, y)) return false;
    }
    return this.boxes.size > 0;
  }
}

class Renderer {
  constructor(canvas, game, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;
    this.settings = settings;
    this.cell = 64;
    this.offset = { x: 0, y: 0 };
    this.tick = 0;
  }

  resize() {
    const wrap = this.canvas.parentElement.getBoundingClientRect();
    const level = this.game.level;
    if (!level) return;
    const maxCell = { small: 44, medium: 58, large: 72, auto: 72 }[this.settings.cellSize] || 72;
    this.cell = Math.max(32, Math.min(Math.floor(wrap.width / level.width), Math.floor(wrap.height / level.height), maxCell));
    const width = this.cell * level.width;
    const height = this.cell * level.height;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw() {
    if (!this.game.level) return;
    this.tick += 1;
    const { ctx, cell } = this;
    const width = this.game.level.width * cell;
    const height = this.game.level.height * cell;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface");
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < this.game.level.height; y += 1) {
      for (let x = 0; x < this.game.level.width; x += 1) {
        this.drawFloor(x, y);
        if (this.game.base[y][x] === "#") this.drawWall(x, y);
        if (this.game.isTarget(x, y)) this.drawTarget(x, y);
      }
    }
    for (const key of this.game.boxes) {
      const [x, y] = key.split(",").map(Number);
      this.drawBox(x, y, this.game.isTarget(x, y));
    }
    this.drawPlayer(this.game.player.x, this.game.player.y);
  }

  drawFloor(x, y) {
    const { ctx, cell } = this;
    ctx.fillStyle = (x + y) % 2 === 0 ? "#2a3148" : "#252c42";
    if (!this.settings.darkMode) ctx.fillStyle = (x + y) % 2 === 0 ? "#ede7dc" : "#e3dccf";
    ctx.fillRect(x * cell, y * cell, cell, cell);
  }

  drawWall(x, y) {
    const { ctx, cell } = this;
    const px = x * cell;
    const py = y * cell;
    ctx.fillStyle = "#58627b";
    ctx.fillRect(px + 2, py + 2, cell - 4, cell - 4);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(px + 7, py + 7, cell - 14, Math.max(5, cell * 0.14));
    ctx.strokeStyle = "rgba(0,0,0,0.24)";
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 2, py + 2, cell - 4, cell - 4);
  }

  drawTarget(x, y) {
    const { ctx, cell } = this;
    const cx = x * cell + cell / 2;
    const cy = y * cell + cell / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.23, 0, Math.PI * 2);
    ctx.strokeStyle = "#f2b84b";
    ctx.lineWidth = Math.max(4, cell * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = "#f2b84b";
    ctx.fill();
  }

  drawBox(x, y, placed) {
    const { ctx, cell } = this;
    const pad = cell * 0.13;
    const px = x * cell + pad;
    const py = y * cell + pad;
    const size = cell - pad * 2;
    ctx.fillStyle = placed ? "#d79d33" : "#b9793f";
    ctx.fillRect(px, py, size, size);
    ctx.strokeStyle = placed ? "#fff0b5" : "#6b3d21";
    ctx.lineWidth = Math.max(3, cell * 0.06);
    ctx.strokeRect(px, py, size, size);
    ctx.beginPath();
    ctx.moveTo(px + size * 0.2, py + size * 0.2);
    ctx.lineTo(px + size * 0.8, py + size * 0.8);
    ctx.moveTo(px + size * 0.8, py + size * 0.2);
    ctx.lineTo(px + size * 0.2, py + size * 0.8);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = Math.max(2, cell * 0.04);
    ctx.stroke();
  }

  drawPlayer(x, y) {
    const { ctx, cell } = this;
    const cx = x * cell + cell / 2;
    const cy = y * cell + cell / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#5aa8ff";
    ctx.fill();
    ctx.fillStyle = "#f4f5fb";
    ctx.beginPath();
    ctx.arc(cx - cell * 0.09, cy - cell * 0.07, cell * 0.045, 0, Math.PI * 2);
    ctx.arc(cx + cell * 0.09, cy - cell * 0.07, cell * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1d3555";
    ctx.lineWidth = Math.max(2, cell * 0.04);
    ctx.stroke();
  }
}

class App {
  constructor() {
    this.levels = buildLevels();
    this.settings = { ...DEFAULT_SETTINGS, ...loadJson(STORAGE_KEYS.SETTINGS, {}) };
    this.progress = loadJson(STORAGE_KEYS.PROGRESS, { easy: { cleared: [], stars: {} }, medium: { cleared: [], stars: {} }, hard: { cleared: [], stars: {} } });
    this.records = loadJson(STORAGE_KEYS.RECORDS, {});
    this.audio = new AudioEngine();
    this.audio.attach(this.settings);
    this.game = new Game(this.levels, this.audio);
    this.renderer = new Renderer(document.querySelector("#gameCanvas"), this.game, this.settings);
    this.currentDifficulty = "easy";
    this.toastTimer = null;
    this.timerId = null;
    this.bind();
    this.applySettings();
    this.renderLevels();
    this.show("menuScreen");
    requestAnimationFrame(() => this.loop());
  }

  bind() {
    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      this.audio.playSfx("button");
      this.handleAction(action);
    });
    document.querySelectorAll("[data-difficulty]").forEach((button) => {
      button.addEventListener("click", () => {
        this.currentDifficulty = button.dataset.difficulty;
        this.renderLevels();
      });
    });
    document.addEventListener("keydown", (event) => this.onKey(event));
    window.addEventListener("resize", () => {
      this.renderer.resize();
      this.renderer.draw();
    });
    this.bindSettings();
    this.bindSwipe();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
    document.addEventListener("pointerdown", () => {
      this.audio.resume();
      this.audio.startMusic();
    }, { once: true });
  }

  bindSettings() {
    for (const key of ["musicVolume", "sfxVolume", "musicStyle", "cellSize"]) {
      const input = document.querySelector(`#${key}`);
      input.value = this.settings[key];
      input.addEventListener("input", () => {
        this.settings[key] = key.includes("Volume") ? Number(input.value) : input.value;
        this.persistSettings();
      });
    }
    for (const key of ["darkMode", "haptic", "showTimer"]) {
      const input = document.querySelector(`#${key}`);
      input.checked = this.settings[key];
      input.addEventListener("change", () => {
        this.settings[key] = input.checked;
        this.persistSettings();
      });
    }
  }

  bindSwipe() {
    const canvas = this.renderer.canvas;
    let start = null;
    canvas.addEventListener("pointerdown", (event) => {
      start = { x: event.clientX, y: event.clientY, t: Date.now() };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const dt = Date.now() - start.t;
      start = null;
      if (dt > 500 || Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      this.tryMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    });
  }

  handleAction(action) {
    const actions = {
      "open-levels": () => this.show("levelScreen"),
      "open-settings": () => this.show("settingsScreen"),
      "open-help": () => this.show("helpScreen"),
      menu: () => this.show("menuScreen"),
      levels: () => this.show("levelScreen"),
      undo: () => this.undo(),
      reset: () => this.reset(),
      pause: () => this.pause(),
      hint: () => this.toast(this.game.level?.hint || "選一個關卡開始。"),
      "clear-save": () => this.clearSave(),
    };
    actions[action]?.();
  }

  show(id) {
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === id));
    document.querySelector("#app").dataset.screen = id;
    if (id !== "gameScreen") this.closeModal();
    if (id === "levelScreen") this.renderLevels();
  }

  renderLevels() {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.difficulty === this.currentDifficulty));
    const grid = document.querySelector("#levelGrid");
    document.querySelector("#unlockHint").textContent = "";
    grid.innerHTML = "";
    this.levels[this.currentDifficulty].forEach((level) => {
      const card = document.createElement("button");
      card.className = "level-card";
      const stars = this.progress[level.difficulty]?.stars?.[level.index] || 0;
      card.innerHTML = `${level.index}<small>${stars ? "★".repeat(stars) : "未通關"}</small>`;
      card.addEventListener("click", () => this.startLevel(level));
      grid.append(card);
    });
  }

  startLevel(level) {
    this.game.load(level);
    document.querySelector("#currentLevelName").textContent = `${level.index}. ${level.name}`;
    document.querySelector("#difficultyBadge").textContent = DIFFICULTIES[level.difficulty].label;
    document.querySelector("#difficultyBadge").style.color = DIFFICULTIES[level.difficulty].color;
    this.show("gameScreen");
    this.renderer.resize();
    this.renderer.draw();
    this.startTimer();
    this.audio.startMusic();
  }

  onKey(event) {
    const keyMap = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
    if (keyMap[event.key]) {
      event.preventDefault();
      this.tryMove(keyMap[event.key]);
    } else if (event.key === "z" || event.key === "Z" || (event.ctrlKey && event.key.toLowerCase() === "z")) {
      event.preventDefault();
      this.undo();
    } else if (event.key === "r" || event.key === "R") {
      this.reset();
    } else if (event.key === "Escape") {
      this.pause();
    } else if (event.key === "h" || event.key === "H") {
      this.toast(this.game.level?.hint || "");
    } else if (event.key === "m" || event.key === "M") {
      this.settings.musicVolume = this.settings.musicVolume ? 0 : 45;
      document.querySelector("#musicVolume").value = this.settings.musicVolume;
      this.persistSettings();
    }
  }

  tryMove(direction) {
    const result = this.game.move(direction, this.settings.undoLimit);
    if (["move", "push", "place"].includes(result)) this.vibrate(result === "push" ? [20, 10, 20] : 12);
    if (["wall", "blocked"].includes(result)) this.vibrate(40);
    this.audio.playSfx(result);
    this.renderer.draw();
    this.updateHud();
    if (this.game.won()) this.win();
  }

  undo() {
    if (this.game.undo()) {
      this.audio.playSfx("undo");
      this.vibrate(20);
      this.renderer.draw();
      this.updateHud();
    }
  }

  reset() {
    if (!this.game.level) return;
    this.audio.playSfx("reset");
    this.startLevel(this.game.level);
  }

  pause() {
    if (!this.game.level || this.game.status !== "playing") return;
    this.game.pause();
    this.openModal("暫停", "", "", [
      ["繼續", () => { this.game.resume(); this.closeModal(); }],
      ["重來", () => { this.closeModal(); this.reset(); }],
      ["選關", () => { this.closeModal(); this.show("levelScreen"); }],
    ]);
  }

  win() {
    const level = this.game.level;
    const elapsed = this.game.elapsed();
    this.game.status = "win";
    const stars = this.getStars(this.game.steps, level.par);
    const progress = this.progress[level.difficulty] || { cleared: [], stars: {} };
    if (!progress.cleared.includes(level.index)) progress.cleared.push(level.index);
    progress.stars[level.index] = Math.max(progress.stars[level.index] || 0, stars);
    this.progress[level.difficulty] = progress;
    const record = this.records[level.id] || {};
    this.records[level.id] = {
      bestSteps: Math.min(record.bestSteps || Infinity, this.game.steps),
      bestTime: Math.min(record.bestTime || Infinity, elapsed),
    };
    saveJson(STORAGE_KEYS.PROGRESS, this.progress);
    saveJson(STORAGE_KEYS.RECORDS, this.records);
    this.audio.playSfx("win");
    this.vibrate([50, 30, 50, 30, 160]);
    this.openModal("完成", `第 ${level.index} 關已通關`, `${"★".repeat(stars)}　${this.game.steps} 步　${this.formatTime(elapsed)}`, [
      ["下一關", () => this.nextLevel()],
      ["重玩", () => { this.closeModal(); this.reset(); }],
      ["選關", () => { this.closeModal(); this.show("levelScreen"); }],
    ]);
  }

  nextLevel() {
    const list = this.levels[this.game.level.difficulty];
    const next = list[this.game.level.index] || null;
    this.closeModal();
    if (next) this.startLevel(next);
    else this.show("levelScreen");
  }

  getStars(steps, par) {
    if (steps <= par) return 3;
    if (steps <= par * 1.5) return 2;
    return 1;
  }

  openModal(title, text, stats, actions) {
    const modal = document.querySelector("#modal");
    document.querySelector("#modalTitle").textContent = title;
    document.querySelector("#modalText").textContent = text;
    document.querySelector("#modalStats").textContent = stats;
    const wrap = document.querySelector("#modalActions");
    wrap.innerHTML = "";
    for (const [label, handler] of actions) {
      const button = document.createElement("button");
      button.className = "btn";
      button.textContent = label;
      button.addEventListener("click", handler);
      wrap.append(button);
    }
    modal.hidden = false;
  }

  closeModal() {
    document.querySelector("#modal").hidden = true;
  }

  startTimer() {
    clearInterval(this.timerId);
    this.updateHud();
    this.timerId = setInterval(() => this.updateHud(), 500);
  }

  updateHud() {
    document.querySelector("#timerText").textContent = this.settings.showTimer ? this.formatTime(this.game.elapsed()) : "--:--";
    document.querySelector("#stepsText").textContent = this.settings.showStepCount ? `${this.game.steps} 步` : "";
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  persistSettings() {
    saveJson(STORAGE_KEYS.SETTINGS, this.settings);
    this.applySettings();
  }

  applySettings() {
    document.documentElement.dataset.theme = this.settings.darkMode ? "dark" : "light";
    this.audio.attach(this.settings);
    this.audio.setVolumes();
    this.audio.stopMusic();
    this.audio.startMusic();
    this.renderer.resize();
    this.renderer.draw();
  }

  clearSave() {
    this.progress = { easy: { cleared: [], stars: {} }, medium: { cleared: [], stars: {} }, hard: { cleared: [], stars: {} } };
    this.records = {};
    saveJson(STORAGE_KEYS.PROGRESS, this.progress);
    saveJson(STORAGE_KEYS.RECORDS, this.records);
    this.renderLevels();
    this.toast("紀錄已清除。");
  }

  toast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  vibrate(pattern) {
    if (this.settings.haptic && "vibrate" in navigator) navigator.vibrate(pattern);
  }

  loop() {
    if (this.game.status === "playing") this.renderer.draw();
    requestAnimationFrame(() => this.loop());
  }
}

new App();
