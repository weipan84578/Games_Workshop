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
  easy: { label: "簡單", color: "#4caf73", count: 20 },
  medium: { label: "中級", color: "#f2994a", count: 20 },
  hard: { label: "困難", color: "#e85f54", count: 20 },
};

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const LEVEL_NAMES = {
  easy: ["Warm Up", "Straight Push", "Twin Boxes", "Short Hall", "Open Room", "Side Step", "Three Marks", "Compact Room", "Clean Line", "Easy Review"],
  medium: ["Long Lane", "Split Storage", "Offset Boxes", "Wide Room", "Center Posts", "Four Crates", "Side Targets", "Warehouse Bend", "Two Rows", "Medium Review"],
  hard: ["Deep Warehouse", "Six Crates", "Staggered Goals", "Heavy Floor", "Long Pushes", "Inner Pillars", "Crowded Storage", "Final Rows", "Wide Sweep", "Hard Review"],
};

const LEVEL_RULES = {
  easy: { width: 7, height: 7, minBoxes: 1, maxBoxes: 3, minPush: 1, maxPush: 2, wallCount: 0, basePar: 8 },
  medium: { width: 11, height: 10, minBoxes: 3, maxBoxes: 4, minPush: 8, maxPush: 16, wallCount: 6, basePar: 34 },
  hard: { width: 13, height: 12, minBoxes: 5, maxBoxes: 6, minPush: 24, maxPush: 44, wallCount: 18, basePar: 72 },
};

function buildLevels() {
  const levels = {};
  for (const difficulty of Object.keys(DIFFICULTIES)) {
    levels[difficulty] = [];
    for (let i = 0; i < DIFFICULTIES[difficulty].count; i += 1) {
      const index = i + 1;
      const grid = ensureTargetCapacity(generateSolvableGrid(difficulty, index));
      const boxCount = countTiles(grid, "$*");
      const rules = LEVEL_RULES[difficulty];
      levels[difficulty].push({
        id: `${difficulty}_${String(index).padStart(2, "0")}`,
        difficulty,
        index,
        name: `${LEVEL_NAMES[difficulty][i % LEVEL_NAMES[difficulty].length]} ${i >= 10 ? "II" : ""}`.trim(),
        width: Math.max(...grid.map((row) => row.length)),
        height: grid.length,
        par: rules.basePar + index * (difficulty === "easy" ? 1 : difficulty === "medium" ? 3 : 5) + boxCount * (difficulty === "hard" ? 9 : difficulty === "medium" ? 6 : rules.maxPush),
        grid: normalizeGrid(grid),
        hint: difficulty === "hard" ? "困難關卡要先想箱子的順序，避免先把通道堵住。" : "先找出每個箱子的直推路線，再調整人物站位。",
      });
    }
  }
  return levels;
}

function generateSolvableGrid(difficulty, index) {
  if (difficulty === "medium") return generateScrambledGrid("medium", index);
  if (difficulty === "hard") return generateHardGrid(index);

  const rules = LEVEL_RULES[difficulty];
  const width = rules.width + Math.floor((index - 1) / 10);
  const height = rules.height + (difficulty !== "easy" && index > 10 ? 1 : 0);
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => (x === 0 || y === 0 || x === width - 1 || y === height - 1 ? "#" : " ")),
  );
  const boxCount = rules.minBoxes + ((index - 1) % (rules.maxBoxes - rules.minBoxes + 1));
  const pushDistance = rules.minPush + Math.floor((index - 1) / 5) % (rules.maxPush - rules.minPush + 1);
  const lanes = chooseLanes(width, boxCount, index);
  const targetRow = 1 + ((index + Math.floor(index / 4)) % Math.max(1, height - pushDistance - 4));
  const boxRow = targetRow + pushDistance;
  const playerRow = Math.min(height - 2, boxRow + 1);

  for (const lane of lanes) {
    grid[targetRow][lane] = ".";
    grid[boxRow][lane] = "$";
  }

  const playerX = lanes[Math.floor(lanes.length / 2)];
  grid[playerRow][playerX] = "@";
  addDecorativeWalls(grid, lanes, targetRow, boxRow, playerRow, rules.wallCount, index);
  return grid.map((row) => row.join(""));
}

function generateScrambledGrid(difficulty, index) {
  const rules = LEVEL_RULES[difficulty];
  const seed = difficulty === "hard" ? index * 17 + 3 : index * 11 + 5;
  const width = rules.width + Math.floor((index - 1) / 10);
  const height = rules.height + (difficulty !== "medium" && index > 10 ? 0 : 0);
  const grid = createScrambledBaseGrid(width, height, seed, rules.wallCount);
  const boxCount = rules.minBoxes + (index % (rules.maxBoxes - rules.minBoxes + 1));
  const targets = chooseScrambledTargets(width, height, boxCount, seed, grid);
  const targetKeys = new Set(targets.map(posKey));
  let boxes = targets.map((target) => ({ ...target }));
  let player = findNearestFloor(grid, Math.floor(width / 2), height - 3, boxes);
  const scrambleSteps = rules.minPush + ((seed * 7) % (rules.maxPush - rules.minPush + 1));
  let movedCount = 0;

  const attemptLimit = difficulty === "hard" ? scrambleSteps * 8 : scrambleSteps * 4;
  for (let attempt = 0; attempt < attemptLimit && movedCount < scrambleSteps; attempt += 1) {
    const moved = reverseScrambleOnce(grid, boxes, player, seed, attempt, targetKeys);
    if (!moved) continue;
    boxes = moved.boxes;
    player = moved.player;
    movedCount += 1;
  }

  const boxKeys = new Set(boxes.map(posKey));
  for (const target of targets) grid[target.y][target.x] = ".";
  for (const box of boxes) grid[box.y][box.x] = targetKeys.has(posKey(box)) ? "*" : "$";
  if (boxKeys.has(posKey(player))) player = findNearestFloor(grid, Math.floor(width / 2), height - 2, boxes);
  grid[player.y][player.x] = targetKeys.has(posKey(player)) ? "+" : "@";
  return grid.map((row) => row.join(""));
}

function generateHardGrid(index) {
  return generateScrambledGrid("hard", index);
}

function createScrambledBaseGrid(width, height, index, wallCount) {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => (x === 0 || y === 0 || x === width - 1 || y === height - 1 ? "#" : " ")),
  );
  const pillars = [
    [3, 3], [3, 7], [5, 5], [7, 3], [7, 8], [9, 5],
    [width - 4, 3], [width - 4, 7], [width - 6, 6],
  ];
  for (const [x, y] of pillars) {
    if (x > 1 && x < width - 2 && y > 1 && y < height - 2) grid[y][x] = "#";
  }

  let placed = 0;
  for (let y = 2; y < height - 2 && placed < wallCount; y += 3) {
    const gap = 2 + ((index + y) % (width - 4));
    for (let x = 2; x < width - 2; x += 1) {
      if (placed >= wallCount) break;
      if (x !== gap && x !== gap + 1 && (x + y + index) % 5 === 0) {
        grid[y][x] = "#";
        placed += 1;
      }
    }
  }
  return grid;
}

function chooseScrambledTargets(width, height, boxCount, index, grid) {
  const fixedCandidates = [
    { x: 2, y: 3 }, { x: width - 3, y: 3 }, { x: 4, y: 5 },
    { x: width - 5, y: 5 }, { x: 3, y: height - 4 }, { x: width - 4, y: height - 4 },
    { x: Math.floor(width / 2), y: 4 }, { x: Math.floor(width / 2), y: height - 5 },
  ].filter((pos) => isBoxSafeFloor(grid, pos.x, pos.y));
  const candidates = [...fixedCandidates];
  for (let y = 2; y < height - 2; y += 1) {
    for (let x = 2; x < width - 2; x += 1) {
      if (isBoxSafeFloor(grid, x, y) && !candidates.some((pos) => pos.x === x && pos.y === y)) candidates.push({ x, y });
    }
  }
  const targets = [];
  let cursor = index % candidates.length;
  let attempts = 0;
  while (targets.length < boxCount && attempts < candidates.length * 2) {
    attempts += 1;
    const pos = candidates[cursor % candidates.length];
    if (!targets.some((target) => target.x === pos.x && target.y === pos.y)) targets.push({ ...pos });
    cursor += 2;
  }
  for (const pos of candidates) {
    if (targets.length >= boxCount) break;
    if (!targets.some((target) => target.x === pos.x && target.y === pos.y)) targets.push({ ...pos });
  }
  return targets;
}

function reverseScrambleOnce(grid, boxes, player, index, step, targetKeys) {
  const order = [
    DIRS.up, DIRS.left, DIRS.down, DIRS.right,
    DIRS.left, DIRS.up, DIRS.right, DIRS.down,
  ];
  const boxOrder = boxes
    .map((box, i) => ({ index: i, onTarget: targetKeys.has(posKey(box)) }))
    .sort((a, b) => Number(b.onTarget) - Number(a.onTarget))
    .map((item, i) => boxes[(item.index + index + step + i) % boxes.length] ? item.index : item.index);
  for (const boxIndex of boxOrder) {
    const box = boxes[boxIndex];
    for (let i = 0; i < order.length; i += 1) {
      const dir = order[(i + index + step + boxIndex) % order.length];
      const stand = { x: box.x - dir.x, y: box.y - dir.y };
      const pulledBox = { x: box.x - dir.x * 2, y: box.y - dir.y * 2 };
      if (targetKeys.has(posKey(pulledBox))) continue;
      if (!isOpenFloor(grid, stand.x, stand.y) || !isBoxSafeFloor(grid, pulledBox.x, pulledBox.y)) continue;
      if (boxes.some((other, iBox) => iBox !== boxIndex && (samePos(other, stand) || samePos(other, pulledBox)))) continue;
      if (!canReach(grid, player, stand, boxes)) continue;
      const nextBoxes = boxes.map((other, iBox) => (iBox === boxIndex ? pulledBox : { ...other }));
      return { boxes: nextBoxes, player: { x: stand.x, y: stand.y } };
    }
  }
  return null;
}

function canReach(grid, start, goal, boxes) {
  if (samePos(start, goal)) return true;
  const blocked = new Set(boxes.map(posKey));
  const queue = [start];
  const seen = new Set([posKey(start)]);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pos = queue[cursor];
    for (const dir of Object.values(DIRS)) {
      const next = { x: pos.x + dir.x, y: pos.y + dir.y };
      const key = posKey(next);
      if (seen.has(key) || blocked.has(key) || !isOpenFloor(grid, next.x, next.y)) continue;
      if (samePos(next, goal)) return true;
      seen.add(key);
      queue.push(next);
    }
  }
  return false;
}

function findNearestFloor(grid, x, y, boxes) {
  const blocked = new Set(boxes.map(posKey));
  const queue = [{ x, y }];
  const seen = new Set();
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pos = queue[cursor];
    const key = posKey(pos);
    if (seen.has(key)) continue;
    seen.add(key);
    if (isOpenFloor(grid, pos.x, pos.y) && !blocked.has(key)) return pos;
    for (const dir of Object.values(DIRS)) {
      const next = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (next.x >= 0 && next.x < grid[0].length && next.y >= 0 && next.y < grid.length) queue.push(next);
    }
  }
  return { x: 1, y: 1 };
}

function isOpenFloor(grid, x, y) {
  return y > 0 && y < grid.length - 1 && x > 0 && x < grid[y].length - 1 && grid[y][x] !== "#";
}

function isBoxSafeFloor(grid, x, y) {
  if (!isOpenFloor(grid, x, y)) return false;
  if (x <= 1 || y <= 1 || x >= grid[y].length - 2 || y >= grid.length - 2) return false;
  return Object.values(DIRS).every((dir) => isOpenFloor(grid, x + dir.x, y + dir.y));
}

function samePos(a, b) {
  return a.x === b.x && a.y === b.y;
}

function posKey(pos) {
  return `${pos.x},${pos.y}`;
}

function chooseLanes(width, boxCount, index) {
  const usable = [];
  for (let x = 2; x <= width - 3; x += 1) usable.push(x);
  const lanes = [];
  const stride = index % 2 === 0 ? 2 : 3;
  let cursor = index % usable.length;
  while (lanes.length < boxCount && lanes.length < usable.length) {
    const lane = usable[cursor % usable.length];
    if (!lanes.includes(lane) && !lanes.includes(lane - 1) && !lanes.includes(lane + 1)) lanes.push(lane);
    cursor += stride;
    if (cursor > usable.length * 4 && lanes.length < boxCount) {
      for (const fallback of usable) {
        if (!lanes.includes(fallback)) lanes.push(fallback);
        if (lanes.length === boxCount) break;
      }
    }
  }
  return lanes.sort((a, b) => a - b);
}

function addDecorativeWalls(grid, lanes, targetRow, boxRow, playerRow, wallCount, index) {
  if (!wallCount) return;
  const protectedCells = new Set();
  for (const lane of lanes) {
    for (let y = targetRow; y <= playerRow; y += 1) protectedCells.add(`${lane},${y}`);
    protectedCells.add(`${lane},${playerRow + 1}`);
  }

  let placed = 0;
  let attempt = 0;
  while (placed < wallCount && attempt < wallCount * 12) {
    attempt += 1;
    const x = 1 + ((index * 7 + attempt * 3) % (grid[0].length - 2));
    const y = 1 + ((index * 5 + attempt * 2) % (grid.length - 2));
    const key = `${x},${y}`;
    if (protectedCells.has(key) || grid[y][x] !== " ") continue;
    if (lanes.some((lane) => Math.abs(lane - x) <= 1 && y >= targetRow && y <= playerRow + 1)) continue;
    grid[y][x] = "#";
    placed += 1;
  }
}

function countTiles(grid, chars) {
  return grid.join("").split("").filter((char) => chars.includes(char)).length;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
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
    const unit = cell / 64;
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, cell * 0.34, cell * 0.22, cell * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#24476f";
    ctx.lineWidth = Math.max(2, 4 * unit);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-cell * 0.16, cell * 0.05);
    ctx.lineTo(-cell * 0.29, cell * 0.17);
    ctx.moveTo(cell * 0.16, cell * 0.05);
    ctx.lineTo(cell * 0.29, cell * 0.17);
    ctx.stroke();

    ctx.fillStyle = "#377fd1";
    roundRect(ctx, -cell * 0.18, -cell * 0.01, cell * 0.36, cell * 0.35, cell * 0.09);
    ctx.fill();

    ctx.strokeStyle = "#1b3555";
    ctx.beginPath();
    ctx.moveTo(-cell * 0.08, cell * 0.31);
    ctx.lineTo(-cell * 0.13, cell * 0.43);
    ctx.moveTo(cell * 0.08, cell * 0.31);
    ctx.lineTo(cell * 0.13, cell * 0.43);
    ctx.stroke();

    ctx.fillStyle = "#f2c59e";
    ctx.beginPath();
    ctx.arc(0, -cell * 0.22, cell * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3a2a24";
    ctx.beginPath();
    ctx.arc(0, -cell * 0.28, cell * 0.21, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-cell * 0.19, -cell * 0.27, cell * 0.38, cell * 0.08);

    ctx.fillStyle = "#17223a";
    ctx.beginPath();
    ctx.arc(-cell * 0.07, -cell * 0.22, cell * 0.025, 0, Math.PI * 2);
    ctx.arc(cell * 0.07, -cell * 0.22, cell * 0.025, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#8f4d42";
    ctx.lineWidth = Math.max(1.5, 2 * unit);
    ctx.beginPath();
    ctx.arc(0, -cell * 0.17, cell * 0.065, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.strokeStyle = "#1d3555";
    ctx.lineWidth = Math.max(2, 3 * unit);
    ctx.strokeRect(-cell * 0.18, -cell * 0.01, cell * 0.36, cell * 0.35);
    ctx.restore();
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
      hint: () => this.toast(this.game.level?.hint || "請先選擇一個關卡。"),
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
