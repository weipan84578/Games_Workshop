/* Generated from modular source files for direct file:// browser use. */
(() => {
"use strict";

/* js/utils/constants.js */
const APP_VERSION = "1.0.0";
const SAVE_KEY = "puzzle-challenge-session-v1";

const DIFFICULTIES = [
  { id: "3x3", cols: 3, pieces: 9, zh: "入門", en: "Easy", note: "9 片", snapRatio: 0.2 },
  { id: "4x4", cols: 4, pieces: 16, zh: "輕鬆", en: "Casual", note: "16 片", snapRatio: 0.15 },
  { id: "5x5", cols: 5, pieces: 25, zh: "標準", en: "Classic", note: "25 片", snapRatio: 0.15 },
  { id: "6x6", cols: 6, pieces: 36, zh: "進階", en: "Advanced", note: "36 片", snapRatio: 0.12 },
  { id: "8x8", cols: 8, pieces: 64, zh: "專家", en: "Expert", note: "64 片", snapRatio: 0.1 },
  { id: "10x10", cols: 10, pieces: 100, zh: "極限", en: "Master", note: "100 片", snapRatio: 0.1 }
];

const THEMES = [
  { id: "theme-ocean", label: "海洋", colors: ["#0077B6", "#00B4D8", "#F97316"] },
  { id: "theme-forest", label: "森林", colors: ["#2D6A4F", "#52B788", "#E9A227"] },
  { id: "theme-sunset", label: "夕陽", colors: ["#E85D04", "#F48C06", "#0077B6"] },
  { id: "theme-candy", label: "糖果", colors: ["#D62B7A", "#FF6FB2", "#00A896"] },
  { id: "theme-midnight", label: "午夜", colors: ["#7B2FBE", "#E040FB", "#FFD166"] },
  { id: "theme-gold", label: "金色", colors: ["#C9A227", "#FFD700", "#0F766E"] }
];

const DEFAULT_SETTINGS = {
  musicVolume: 68,
  sfxVolume: 86,
  theme: "theme-ocean",
  appearance: "light",
  defaultDifficulty: "4x4"
};

const IMAGE_RULES = {
  maxBytes: 10 * 1024 * 1024,
  minSide: 100,
  outputSize: 800,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"]
};


/* js/utils/helpers.js */
function $(selector, root = document) {
  return root.querySelector(selector);
}

function el(tagName, options = {}, children = []) {
  const node = document.createElement(tagName);

  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.html) node.innerHTML = options.html;
  if (options.type) node.type = options.type;
  if (options.value !== undefined) node.value = options.value;
  if (options.disabled !== undefined) node.disabled = options.disabled;
  if (options.ariaLabel) node.setAttribute("aria-label", options.ariaLabel);
  if (options.title) node.title = options.title;
  if (options.role) node.setAttribute("role", options.role);
  if (options.id) node.id = options.id;

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      node.dataset[key] = value;
    });
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, value);
    });
  }

  if (options.on) {
    Object.entries(options.on).forEach(([eventName, handler]) => {
      node.addEventListener(eventName, handler);
    });
  }

  const normalizedChildren = Array.isArray(children) ? children : [children];
  normalizedChildren
    .filter((child) => child !== null && child !== undefined)
    .forEach((child) => {
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });

  return node;
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDifficultyById(difficulties, id) {
  return difficulties.find((difficulty) => difficulty.id === id) || difficulties[1];
}

function copyCanvas(source) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

function drawCanvasPreview(source, target) {
  const ctx = target.getContext("2d");
  target.width = target.clientWidth || 320;
  target.height = target.clientHeight || target.width;
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0, target.width, target.height);
}

function makeButton(label, options = {}) {
  const classes = ["btn", options.variant ? `btn-${options.variant}` : ""].filter(Boolean).join(" ");
  return el("button", {
    className: classes,
    type: "button",
    ariaLabel: options.ariaLabel || label,
    disabled: options.disabled,
    on: options.on
  }, label);
}


/* js/utils/storage.js */

function saveGameSnapshot(snapshot) {
  try {
    sessionStorage.setItem(SAVE_KEY, JSON.stringify({
      version: APP_VERSION,
      timestamp: Date.now(),
      ...snapshot
    }));
    return true;
  } catch {
    return false;
  }
}

function loadGameSnapshot() {
  try {
    const raw = sessionStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.version ? parsed : null;
  } catch {
    return null;
  }
}

function clearGameSnapshot() {
  try {
    sessionStorage.removeItem(SAVE_KEY);
  } catch {
    // Session storage can be disabled by the browser.
  }
}

function hasGameSnapshot() {
  return Boolean(loadGameSnapshot());
}


/* js/core/event-bus.js */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
    this.listeners.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    this.listeners.get(eventName)?.delete(handler);
  }

  emit(eventName, payload) {
    this.listeners.get(eventName)?.forEach((handler) => handler(payload));
  }
}


/* js/core/state.js */

class AppState {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.imageCanvas = null;
    this.imageName = "預設插畫";
    this.imageSourceKind = "demo";
    this.gameConfig = null;
    this.lastResult = null;
  }

  get defaultDifficulty() {
    return getDifficultyById(DIFFICULTIES, this.settings.defaultDifficulty);
  }

  setSettings(nextSettings) {
    this.settings = {
      ...this.settings,
      ...nextSettings
    };
  }

  setImage(canvas, name, sourceKind = "upload") {
    this.imageCanvas = canvas;
    this.imageName = name || "自訂圖片";
    this.imageSourceKind = sourceKind;
  }

  setGameConfig(config) {
    this.gameConfig = config;
  }

  clearGameConfig() {
    this.gameConfig = null;
  }
}


/* js/core/router.js */
class Router {
  constructor(root, factories) {
    this.root = root;
    this.factories = factories;
    this.currentScreen = null;
    this.currentName = "";
  }

  navigate(name, data = {}) {
    this.currentScreen?.destroy?.();
    this.root.replaceChildren();

    const ScreenFactory = this.factories[name];
    if (!ScreenFactory) {
      throw new Error(`Unknown screen: ${name}`);
    }

    const screen = ScreenFactory(data);
    this.currentScreen = screen;
    this.currentName = name;
    this.root.append(screen.render());
    screen.afterRender?.();
  }

  refresh(data = {}) {
    if (this.currentName) this.navigate(this.currentName, data);
  }
}


/* js/image/ImageImporter.js */

class ImageImporter {
  async importFile(file) {
    this.validateFile(file);
    const dataUrl = await this.readAsDataUrl(file);
    const image = await this.loadImage(dataUrl);

    if (image.naturalWidth < IMAGE_RULES.minSide || image.naturalHeight < IMAGE_RULES.minSide) {
      throw new Error(`圖片最短邊需至少 ${IMAGE_RULES.minSide}px`);
    }

    return {
      image,
      name: file.name.replace(/\.[^.]+$/, "")
    };
  }

  validateFile(file) {
    if (!file) throw new Error("請選擇圖片檔案");
    if (!IMAGE_RULES.acceptedTypes.includes(file.type)) {
      throw new Error("支援 JPG、PNG、WebP、GIF、BMP，不支援 SVG");
    }
    if (file.size > IMAGE_RULES.maxBytes) {
      throw new Error("圖片大小需小於 10MB");
    }
  }

  readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("讀取圖片失敗"));
      reader.readAsDataURL(file);
    });
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("載入圖片失敗"));
      image.src = src;
    });
  }
}


/* js/image/ImageCropper.js */
function toCenterSquare(image, outputSize = 800) {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = Math.floor((image.naturalWidth - side) / 2);
  const sy = Math.floor((image.naturalHeight - side) / 2);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, side, side, 0, 0, outputSize, outputSize);

  return canvas;
}


/* js/image/ImageSlicer.js */
function slice(source, cols) {
  const pieces = [];
  const sourceSize = source.width;
  const tileSize = sourceSize / cols;

  for (let row = 0; row < cols; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = tileSize;
      canvas.height = tileSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(source, col * tileSize, row * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
      pieces.push({ id: row * cols + col, row, col, canvas });
    }
  }

  return pieces;
}


/* js/game/PuzzlePiece.js */

class PuzzlePiece {
  constructor({ id, row, col, cols, boardSize }) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.cols = cols;
    this.size = boardSize / cols;
    this.correctX = col * this.size;
    this.correctY = row * this.size;
    this.x = this.correctX;
    this.y = this.correctY;
    this.solved = false;
  }

  resize(newBoardSize, oldBoardSize) {
    const oldSize = oldBoardSize || newBoardSize;
    const scale = newBoardSize / oldSize;
    this.size = newBoardSize / this.cols;
    this.x *= scale;
    this.y *= scale;
    this.correctX = this.col * this.size;
    this.correctY = this.row * this.size;

    if (this.solved) {
      this.x = this.correctX;
      this.y = this.correctY;
    }
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size;
  }

  moveTo(x, y, boardSize) {
    this.x = clamp(x, 0, boardSize - this.size);
    this.y = clamp(y, 0, boardSize - this.size);
  }

  distanceToHome() {
    return Math.hypot(this.x - this.correctX, this.y - this.correctY);
  }

  snapHome() {
    this.x = this.correctX;
    this.y = this.correctY;
    this.solved = true;
  }

  serialize(boardSize) {
    return {
      id: this.id,
      x: this.x / boardSize,
      y: this.y / boardSize,
      solved: this.solved
    };
  }

  hydrate(data, boardSize) {
    this.x = data.x * boardSize;
    this.y = data.y * boardSize;
    this.solved = Boolean(data.solved);
    if (this.solved) this.snapHome();
  }

  draw(ctx, sourceCanvas, options = {}) {
    const sourcePieceSize = sourceCanvas.width / this.cols;
    const sourceX = this.col * sourcePieceSize;
    const sourceY = this.row * sourcePieceSize;
    const radius = Math.max(4, this.size * 0.035);

    ctx.save();
    ctx.globalAlpha = this.solved ? 0.98 : 1;
    ctx.shadowColor = options.selected ? "rgba(0,0,0,0.30)" : "rgba(0,0,0,0.18)";
    ctx.shadowBlur = options.selected ? 16 : 8;
    ctx.shadowOffsetY = options.selected ? 8 : 4;

    roundedRect(ctx, this.x, this.y, this.size, this.size, radius);
    ctx.clip();
    ctx.drawImage(sourceCanvas, sourceX, sourceY, sourcePieceSize, sourcePieceSize, this.x, this.y, this.size, this.size);
    ctx.restore();

    ctx.save();
    roundedRect(ctx, this.x, this.y, this.size, this.size, radius);
    ctx.lineWidth = options.selected ? 4 : 2;
    ctx.strokeStyle = options.selected ? options.accentColor : "rgba(255,255,255,0.88)";
    ctx.stroke();

    if (this.solved) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(45,106,79,0.88)";
      ctx.stroke();
    }
    ctx.restore();
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}


/* js/game/PuzzleEngine.js */

class PuzzleEngine {
  constructor({ canvas, sourceCanvas, difficulty, sfx, onChange, onSolvedChange, onVictory }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sourceCanvas = sourceCanvas;
    this.difficulty = difficulty;
    this.sfx = sfx;
    this.onChange = onChange;
    this.onSolvedChange = onSolvedChange;
    this.onVictory = onVictory;
    this.boardSize = 0;
    this.pieces = [];
    this.selectedPiece = null;
    this.dragOffset = { x: 0, y: 0 };
    this.hintId = null;
    this.hintTimer = null;
    this.isPaused = false;
  }

  init(snapshot = null) {
    this.resize();
    this.createPieces();

    if (snapshot?.pieces?.length === this.pieces.length) {
      snapshot.pieces.forEach((data) => {
        const piece = this.pieces.find((item) => item.id === data.id);
        piece?.hydrate(data, this.boardSize);
      });
    } else {
      this.shuffle();
    }

    this.reportSolved();
    this.render();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const newSize = Math.max(280, Math.round(rect.width || 600));
    const oldSize = this.boardSize || newSize;
    const ratio = Math.max(1, window.devicePixelRatio || 1);

    this.boardSize = newSize;
    this.canvas.width = Math.round(newSize * ratio);
    this.canvas.height = Math.round(newSize * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.pieces.forEach((piece) => piece.resize(newSize, oldSize));
    this.render();
  }

  createPieces() {
    if (this.pieces.length) return;
    const cols = this.difficulty.cols;
    for (let row = 0; row < cols; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        this.pieces.push(new PuzzlePiece({
          id: row * cols + col,
          row,
          col,
          cols,
          boardSize: this.boardSize
        }));
      }
    }
  }

  shuffle() {
    const positions = this.pieces.map((piece) => ({
      x: piece.correctX,
      y: piece.correctY
    }));

    for (let i = positions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    this.pieces.forEach((piece, index) => {
      let position = positions[index];
      if (position.x === piece.correctX && position.y === piece.correctY && positions.length > 1) {
        const swapIndex = (index + 1) % positions.length;
        [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
        position = positions[index];
      }
      piece.x = position.x;
      piece.y = position.y;
      piece.solved = false;
    });

    this.bringUnsolvedForward();
    this.sfx?.play("shuffle");
    this.changed();
  }

  shuffleUnsolved() {
    const unsolved = this.pieces.filter((piece) => !piece.solved);
    const positions = unsolved.map((piece) => ({ x: piece.x, y: piece.y }));

    for (let i = positions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    unsolved.forEach((piece, index) => {
      piece.x = positions[index].x;
      piece.y = positions[index].y;
    });

    this.sfx?.play("shuffle");
    this.changed();
  }

  getSolvedCount() {
    return this.pieces.filter((piece) => piece.solved).length;
  }

  pick(x, y) {
    if (this.isPaused) return null;
    for (let i = this.pieces.length - 1; i >= 0; i -= 1) {
      const piece = this.pieces[i];
      if (!piece.solved && piece.contains(x, y)) {
        this.selectedPiece = piece;
        this.dragOffset = { x: x - piece.x, y: y - piece.y };
        this.pieces.splice(i, 1);
        this.pieces.push(piece);
        this.sfx?.play("pickup");
        this.render();
        return piece;
      }
    }
    return null;
  }

  dragTo(x, y) {
    if (!this.selectedPiece || this.isPaused) return;
    this.selectedPiece.moveTo(x - this.dragOffset.x, y - this.dragOffset.y, this.boardSize);
    this.render();
  }

  drop(pointerType = "mouse") {
    if (!this.selectedPiece) return false;

    const piece = this.selectedPiece;
    this.selectedPiece = null;
    const thresholdRatio = pointerType === "touch" ? 0.25 : this.difficulty.snapRatio;
    const threshold = piece.size * thresholdRatio;

    if (piece.distanceToHome() <= threshold) {
      piece.snapHome();
      this.sfx?.play("snap");
      this.bringSolvedBackward();
      this.reportSolved();
      this.changed();

      if (this.getSolvedCount() === this.pieces.length) {
        this.sfx?.play("victory");
        this.onVictory?.();
      }
      return true;
    }

    this.sfx?.play("drop");
    this.changed();
    return false;
  }

  setPaused(isPaused) {
    this.isPaused = isPaused;
    this.render();
  }

  showHint() {
    const unsolved = this.pieces.filter((piece) => !piece.solved);
    if (!unsolved.length) return;
    const piece = unsolved[Math.floor(Math.random() * unsolved.length)];
    this.hintId = piece.id;
    this.sfx?.play("hint");
    clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => {
      this.hintId = null;
      this.render();
    }, 1400);
    this.render();
  }

  serialize() {
    return {
      difficulty: this.difficulty.id,
      pieces: this.pieces.map((piece) => piece.serialize(this.boardSize))
    };
  }

  destroy() {
    clearTimeout(this.hintTimer);
  }

  changed() {
    this.render();
    this.reportSolved();
    this.onChange?.();
  }

  reportSolved() {
    this.onSolvedChange?.(this.getSolvedCount(), this.pieces.length);
  }

  bringSolvedBackward() {
    this.pieces.sort((a, b) => Number(a.solved) - Number(b.solved));
  }

  bringUnsolvedForward() {
    this.pieces.sort((a, b) => Number(a.solved) - Number(b.solved));
  }

  render() {
    if (!this.ctx || !this.boardSize) return;
    const ctx = this.ctx;
    const size = this.boardSize;
    const tile = size / this.difficulty.cols;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.drawImage(this.sourceCanvas, 0, 0, size, size);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(20,33,61,0.13)";
    ctx.lineWidth = 1;
    for (let i = 1; i < this.difficulty.cols; i += 1) {
      const pos = Math.round(i * tile) + 0.5;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }
    ctx.restore();

    if (this.hintId !== null) {
      const piece = this.pieces.find((item) => item.id === this.hintId);
      if (piece) {
        ctx.save();
        ctx.fillStyle = "rgba(255,183,3,0.24)";
        ctx.strokeStyle = "rgba(255,183,3,0.92)";
        ctx.lineWidth = 4;
        ctx.fillRect(piece.correctX + 2, piece.correctY + 2, piece.size - 4, piece.size - 4);
        ctx.strokeRect(piece.correctX + 2, piece.correctY + 2, piece.size - 4, piece.size - 4);
        ctx.restore();
      }
    }

    this.pieces.forEach((piece) => {
      if (piece !== this.selectedPiece) {
        piece.draw(ctx, this.sourceCanvas, {
          accentColor: getComputedStyle(document.body).getPropertyValue("--color-accent").trim() || "#ffb703"
        });
      }
    });

    if (this.selectedPiece) {
      this.selectedPiece.draw(ctx, this.sourceCanvas, {
        selected: true,
        accentColor: getComputedStyle(document.body).getPropertyValue("--color-accent").trim() || "#ffb703"
      });
    }

    if (this.isPaused) {
      ctx.save();
      ctx.fillStyle = "rgba(8,13,27,0.56)";
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
    }
  }
}


/* js/game/DragController.js */
class DragController {
  constructor(canvas, engine, options = {}) {
    this.canvas = canvas;
    this.engine = engine;
    this.onInteraction = options.onInteraction;
    this.pointerType = "mouse";
    this.activePointerId = null;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  attach() {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerUp);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
  }

  handlePointerDown(event) {
    const point = this.getPoint(event);
    const piece = this.engine.pick(point.x, point.y);
    if (!piece) return;

    this.pointerType = event.pointerType || "mouse";
    this.activePointerId = event.pointerId;
    this.canvas.setPointerCapture?.(event.pointerId);
    this.onInteraction?.();
    event.preventDefault();
  }

  handlePointerMove(event) {
    if (this.activePointerId !== event.pointerId) return;
    const point = this.getPoint(event);
    this.engine.dragTo(point.x, point.y);
    event.preventDefault();
  }

  handlePointerUp(event) {
    if (this.activePointerId !== event.pointerId) return;
    this.engine.drop(this.pointerType);
    this.activePointerId = null;
    this.canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  getPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.engine.boardSize / rect.width;
    const scaleY = this.engine.boardSize / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }
}


/* js/game/TouchController.js */

class TouchController extends DragController {}


/* js/game/Timer.js */
class Timer {
  constructor({ startAt = 0, onTick }) {
    this.elapsedBeforeStart = startAt * 1000;
    this.onTick = onTick;
    this.startedAt = 0;
    this.intervalId = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startedAt = performance.now();
    this.intervalId = window.setInterval(() => this.tick(), 250);
    this.tick();
  }

  pause() {
    if (!this.running) return;
    this.elapsedBeforeStart = this.getElapsedMilliseconds();
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.tick();
  }

  resume() {
    this.start();
  }

  stop() {
    if (this.running) {
      this.elapsedBeforeStart = this.getElapsedMilliseconds();
    }
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.tick();
  }

  reset(seconds = 0) {
    this.elapsedBeforeStart = seconds * 1000;
    this.startedAt = performance.now();
    this.tick();
  }

  getElapsedMilliseconds() {
    if (!this.running) return this.elapsedBeforeStart;
    return this.elapsedBeforeStart + (performance.now() - this.startedAt);
  }

  getElapsedSeconds() {
    return Math.floor(this.getElapsedMilliseconds() / 1000);
  }

  tick() {
    this.onTick?.(this.getElapsedSeconds());
  }
}


/* js/game/ScoreManager.js */
class ScoreManager {
  constructor() {
    this.bestTimes = new Map();
  }

  record(difficultyId, seconds) {
    const previous = this.bestTimes.get(difficultyId);
    if (!previous || seconds < previous) {
      this.bestTimes.set(difficultyId, seconds);
      return { best: seconds, isNewBest: true };
    }
    return { best: previous, isNewBest: false };
  }

  getBest(difficultyId) {
    return this.bestTimes.get(difficultyId) || null;
  }
}


/* js/audio/AudioEngine.js */
class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
  }

  ensure() {
    if (this.context) return this.context;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    this.applySettings(this.settings);
    return this.context;
  }

  async unlock() {
    const context = this.ensure();
    if (context?.state === "suspended") await context.resume();
  }

  applySettings(settings) {
    this.settings = settings;
    this.ensure();
    if (!this.context) return;
    this.musicGain.gain.setTargetAtTime(settings.musicVolume / 100, this.context.currentTime, 0.02);
    this.sfxGain.gain.setTargetAtTime(settings.sfxVolume / 100, this.context.currentTime, 0.02);
    this.masterGain.gain.setTargetAtTime(1, this.context.currentTime, 0.02);
  }

  playTone({
    frequency = 440,
    endFrequency = null,
    duration = 0.12,
    type = "sine",
    gain = 0.12,
    destination = "sfx",
    delay = 0,
    attack = 0.012,
    pan = 0
  }) {
    const context = this.ensure();
    if (!context) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const output = this.createOutputNode(destination, pan);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
    }
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  playNoise({
    duration = 0.12,
    gain = 0.08,
    delay = 0,
    destination = "sfx",
    filterType = "bandpass",
    frequency = 900,
    pan = 0
  }) {
    const context = this.ensure();
    if (!context) return;
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = context.createBufferSource();
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    const output = this.createOutputNode(destination, pan);
    const start = context.currentTime + delay;

    filter.type = filterType;
    filter.frequency.setValueAtTime(frequency, start);
    filter.Q.setValueAtTime(1.8, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  createOutputNode(destination, pan) {
    const base = destination === "music" ? this.musicGain : this.sfxGain;
    if (!this.context.createStereoPanner || pan === 0) return base;

    const panner = this.context.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    panner.connect(base);
    return panner;
  }
}


/* js/audio/SoundEffects.js */
class SoundEffects {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.snapStreak = 0;
    this.snapReset = null;
  }

  play(name) {
    switch (name) {
      case "click":
        this.audio.playTone({ frequency: 720, endFrequency: 920, duration: 0.055, type: "triangle", gain: 0.1 });
        this.audio.playTone({ frequency: 1440, duration: 0.035, type: "sine", gain: 0.035, delay: 0.025, pan: 0.25 });
        break;
      case "start":
        [392, 523, 659, 784].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.12, type: "triangle", gain: 0.09, delay: index * 0.055 });
        });
        break;
      case "pickup":
        this.audio.playTone({ frequency: 280, endFrequency: 430, duration: 0.13, type: "sine", gain: 0.09, pan: -0.14 });
        this.audio.playNoise({ duration: 0.055, gain: 0.035, filterType: "highpass", frequency: 1900, pan: 0.15 });
        break;
      case "drop":
        this.audio.playTone({ frequency: 210, endFrequency: 130, duration: 0.13, type: "triangle", gain: 0.085 });
        this.audio.playNoise({ duration: 0.075, gain: 0.05, filterType: "lowpass", frequency: 620 });
        break;
      case "snap":
        this.audio.playTone({ frequency: 520, duration: 0.075, type: "triangle", gain: 0.12, pan: -0.12 });
        this.audio.playTone({ frequency: 780, duration: 0.105, type: "sine", gain: 0.08, delay: 0.045, pan: 0.12 });
        this.audio.playTone({ frequency: 1175, duration: 0.075, type: "sine", gain: 0.045, delay: 0.095 });
        this.trackCombo();
        break;
      case "combo":
        [660, 880, 990, 1320].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.12, type: "sine", gain: 0.085, delay: index * 0.055, pan: (index - 1.5) / 4 });
        });
        break;
      case "shuffle":
        this.audio.playNoise({ duration: 0.22, gain: 0.075, filterType: "bandpass", frequency: 850, pan: -0.18 });
        this.audio.playNoise({ duration: 0.18, gain: 0.055, delay: 0.1, filterType: "highpass", frequency: 2200, pan: 0.18 });
        this.audio.playTone({ frequency: 260, endFrequency: 520, duration: 0.18, type: "sawtooth", gain: 0.035, delay: 0.04 });
        break;
      case "hint":
        this.audio.playTone({ frequency: 880, duration: 0.12, type: "sine", gain: 0.085 });
        this.audio.playTone({ frequency: 660, duration: 0.12, type: "sine", gain: 0.075, delay: 0.08 });
        this.audio.playTone({ frequency: 990, duration: 0.16, type: "triangle", gain: 0.06, delay: 0.16 });
        break;
      case "pause":
        this.audio.playTone({ frequency: 440, endFrequency: 220, duration: 0.18, type: "triangle", gain: 0.075 });
        break;
      case "resume":
        this.audio.playTone({ frequency: 220, endFrequency: 440, duration: 0.18, type: "triangle", gain: 0.075 });
        break;
      case "victory":
        [523, 659, 784, 1046, 1318].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.22, type: "triangle", gain: 0.12, delay: index * 0.12, pan: (index - 2) / 4 });
        });
        this.audio.playNoise({ duration: 0.28, gain: 0.045, delay: 0.18, filterType: "bandpass", frequency: 2400 });
        break;
      case "error":
        this.audio.playTone({ frequency: 190, endFrequency: 110, duration: 0.2, type: "sawtooth", gain: 0.075 });
        this.audio.playTone({ frequency: 160, endFrequency: 90, duration: 0.2, type: "square", gain: 0.045, delay: 0.055 });
        break;
      default:
        this.play("click");
    }
  }

  trackCombo() {
    this.snapStreak += 1;
    clearTimeout(this.snapReset);
    this.snapReset = window.setTimeout(() => {
      this.snapStreak = 0;
    }, 1800);

    if (this.snapStreak > 0 && this.snapStreak % 3 === 0) {
      this.play("combo");
    }
  }
}


/* js/audio/MusicPlayer.js */
const TRACKS = {
  menu: {
    interval: 310,
    wave: "triangle",
    melodyGain: 0.06,
    bassGain: 0.035,
    melody: [392, 494, 587, 659, 587, 494, 440, 523, 659, 784, 659, 523, 494, 440, 392, 0],
    bass: [196, 196, 220, 220, 247, 247, 220, 220],
    chords: [[392, 494, 587], [440, 523, 659], [349, 440, 587], [392, 494, 659]]
  },
  game_easy: {
    interval: 260,
    wave: "sine",
    melodyGain: 0.055,
    bassGain: 0.032,
    melody: [330, 392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392],
    bass: [165, 165, 196, 196, 174, 174, 196, 196],
    chords: [[330, 392, 494], [349, 440, 523], [392, 494, 587], [330, 440, 523]]
  },
  game_hard: {
    interval: 210,
    wave: "square",
    melodyGain: 0.045,
    bassGain: 0.038,
    melody: [220, 330, 392, 440, 392, 330, 294, 330, 247, 370, 440, 494, 440, 370, 330, 294],
    bass: [110, 110, 147, 147, 123, 123, 165, 165],
    chords: [[220, 330, 440], [247, 370, 494], [294, 392, 523], [247, 330, 440]]
  },
  victory: {
    interval: 190,
    wave: "triangle",
    melodyGain: 0.075,
    bassGain: 0.04,
    melody: [523, 659, 784, 1046, 880, 1046, 1175, 1318, 1046, 880, 784, 659, 784, 1046, 1318, 0],
    bass: [262, 262, 330, 330, 392, 392, 330, 330],
    chords: [[523, 659, 784], [587, 740, 880], [659, 784, 1046], [523, 784, 1046]]
  }
};

class MusicPlayer {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.currentPattern = "";
    this.step = 0;
    this.intervalId = null;
  }

  playFor(screenName, difficulty = null) {
    let pattern = "menu";
    if (screenName === "game") {
      pattern = difficulty?.cols >= 6 ? "game_hard" : "game_easy";
    }
    if (screenName === "victory") pattern = "victory";
    if (this.currentPattern === pattern) return;

    this.stop();
    this.currentPattern = pattern;
    this.step = 0;
    this.intervalId = window.setInterval(() => this.tick(), TRACKS[pattern].interval);
    this.tick();
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentPattern = "";
  }

  tick() {
    const track = TRACKS[this.currentPattern];
    if (!track) return;

    const beat = this.step % track.melody.length;
    const phrase = Math.floor(this.step / track.melody.length);
    const melody = track.melody[beat];
    const chord = track.chords[Math.floor(beat / 4) % track.chords.length];
    const pan = ((beat % 8) - 3.5) / 7;

    if (melody) {
      this.audio.playTone({
        frequency: melody,
        duration: track.interval / 1000 * 0.76,
        type: track.wave,
        gain: track.melodyGain,
        destination: "music",
        pan
      });
    }

    if (beat % 4 === 0) {
      const bass = track.bass[(beat / 2) % track.bass.length];
      this.audio.playTone({
        frequency: bass,
        duration: track.interval / 1000 * 1.8,
        type: "sine",
        gain: track.bassGain,
        destination: "music",
        pan: -0.18
      });

      chord.forEach((frequency, index) => {
        this.audio.playTone({
          frequency,
          duration: track.interval / 1000 * 2.4,
          type: "triangle",
          gain: 0.018,
          destination: "music",
          delay: index * 0.018,
          pan: 0.18
        });
      });
    }

    if (this.currentPattern === "game_hard" && beat % 4 === 2) {
      this.audio.playNoise({
        duration: 0.045,
        gain: 0.018,
        destination: "music",
        filterType: "highpass",
        frequency: 2600,
        pan: 0.22
      });
    }

    if (this.currentPattern === "victory" && beat % 8 === 0 && phrase < 4) {
      this.audio.playNoise({
        duration: 0.18,
        gain: 0.025,
        destination: "music",
        filterType: "bandpass",
        frequency: 1800
      });
    }

    this.step += 1;
  }
}


/* js/audio/AudioSettings.js */
class AudioSettings {
  constructor(audioEngine, appState) {
    this.audio = audioEngine;
    this.state = appState;
  }

  update(partial) {
    this.state.setSettings(partial);
    this.audio.applySettings(this.state.settings);
  }
}


/* js/ui/ThemeManager.js */

class ThemeManager {
  constructor(appState) {
    this.state = appState;
  }

  apply(themeId = this.state.settings.theme, appearance = this.state.settings.appearance) {
    const known = THEMES.map((theme) => theme.id);
    const modes = ["mode-light", "mode-dark"];
    document.body.classList.remove(...known);
    document.body.classList.remove(...modes);
    document.body.classList.add(themeId);
    document.body.classList.add(`mode-${appearance || "light"}`);
  }

  set(themeId) {
    this.state.setSettings({ theme: themeId });
    this.apply(themeId);
  }

  setAppearance(appearance) {
    this.state.setSettings({ appearance });
    this.apply(this.state.settings.theme, appearance);
  }
}


/* js/ui/Toast.js */

class Toast {
  constructor(root = document.getElementById("toast-root")) {
    this.root = root;
  }

  show(message, type = "info") {
    const toast = el("div", {
      className: `toast ${type === "error" ? "is-error" : ""} ${type === "success" ? "is-success" : ""}`,
      role: "status",
      text: message
    });

    this.root.append(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 320);
    }, 3200);
  }
}


/* js/ui/Modal.js */

class Modal {
  constructor({ title, onClose }) {
    this.onClose = onClose;
    this.backdrop = el("div", {
      className: "modal-backdrop",
      role: "presentation",
      on: {
        pointerdown: (event) => {
          if (event.target === this.backdrop) this.close();
        }
      }
    });

    this.modal = el("section", {
      className: "modal",
      role: "dialog",
      attrs: { "aria-modal": "true", "aria-label": title }
    });

    this.titleEl = el("h2", { text: title });
    this.closeButton = makeButton("×", {
      ariaLabel: "關閉",
      on: { click: () => this.close() }
    });
    this.closeButton.classList.add("btn-icon");

    this.body = el("div", { className: "modal-body" });
    this.footer = el("div", { className: "modal-footer" });
    this.modal.append(
      el("header", { className: "modal-header" }, [this.titleEl, this.closeButton]),
      this.body,
      this.footer
    );
    this.backdrop.append(this.modal);

    this.handleKeyDown = (event) => {
      if (event.key === "Escape") this.close();
    };
  }

  open() {
    document.body.append(this.backdrop);
    document.addEventListener("keydown", this.handleKeyDown);
    this.closeButton.focus();
  }

  setTitle(title) {
    this.titleEl.textContent = title;
    this.modal.setAttribute("aria-label", title);
  }

  setBody(...children) {
    this.body.replaceChildren(...children);
  }

  setFooter(...children) {
    this.footer.replaceChildren(...children);
  }

  close() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.backdrop.remove();
    this.onClose?.();
  }
}


/* js/ui/Transitions.js */
function enterScreen(node) {
  node.style.opacity = "0";
  node.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    node.style.transition = "opacity 220ms ease, transform 220ms ease";
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
  });
}


/* js/screens/MainMenuScreen.js */

class MainMenuScreen {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.previewCanvas = null;
  }

  render() {
    this.previewCanvas = el("canvas", { attrs: { width: 420, height: 420 } });

    const screen = el("main", { className: "screen main-menu" }, [
      el("div", { className: "screen-shell main-menu-layout" }, [
        el("section", { className: "brand-block" }, [
          el("span", { className: "screen-kicker", text: "Puzzle Challenge" }),
          el("h1", { text: "拼圖挑戰" }),
          el("p", {
            className: "brand-subtitle",
            text: "上傳一張圖片、選擇難度，拖曳碎片完成整張拼圖。"
          }),
          el("div", { className: "menu-actions" }, [
            makeButton("開始新遊戲", {
              variant: "primary",
              on: { click: () => this.openNewGameModal() }
            }),
            makeButton("繼續遊戲", {
              disabled: !this.app.canContinue(),
              on: { click: () => this.app.continueGame() }
            }),
            el("div", { className: "toolbar" }, [
              makeButton("玩法", { on: { click: () => this.app.navigate("instructions") } }),
              makeButton("設定", { on: { click: () => this.app.navigate("settings") } })
            ])
          ])
        ]),
        el("aside", { className: "preview-tile surface", attrs: { "aria-label": "拼圖預覽" } }, [
          this.previewCanvas,
          el("div", { className: "preview-caption" }, [
            el("span", { text: this.app.state.defaultDifficulty.zh }),
            el("strong", { text: `${this.app.state.defaultDifficulty.cols} × ${this.app.state.defaultDifficulty.cols}` })
          ])
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    drawCanvasPreview(this.app.getDefaultCanvas(), this.previewCanvas);
  }

  destroy() {
    if (this.modal) {
      const modal = this.modal;
      this.modal = null;
      modal.close();
    }
  }

  openNewGameModal() {
    let step = 0;
    let selectedCanvas = copyCanvas(this.app.getDefaultCanvas());
    let selectedName = "預設插畫";
    let selectedKind = "demo";
    let selectedDifficultyId = this.app.state.settings.defaultDifficulty;

    this.modal = new Modal({
      title: "建立新拼圖",
      onClose: () => {
        this.modal = null;
      }
    });

    const drawSelectedPreview = (canvas) => {
      requestAnimationFrame(() => {
        const preview = canvas.querySelector("canvas");
        if (preview) drawCanvasPreview(selectedCanvas, preview);
      });
    };

    const renderSteps = () => el("div", { className: "modal-steps", attrs: { "aria-hidden": "true" } },
      [0, 1, 2].map((index) => el("span", {
        className: `modal-step ${index <= step ? "is-active" : ""}`
      }))
    );

    const renderUploadStep = () => {
      const input = el("input", {
        type: "file",
        className: "sr-only",
        attrs: { accept: "image/jpeg,image/png,image/webp,image/gif,image/bmp" },
        on: {
          change: async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            try {
              const result = await this.app.importImageFile(file);
              selectedCanvas = result.canvas;
              selectedName = result.name;
              selectedKind = "upload";
              this.app.toast.show("圖片已載入", "success");
              render();
            } catch (error) {
              this.app.toast.show(error.message, "error");
            }
          }
        }
      });

      const chooseButton = makeButton("選擇圖片", {
        variant: "accent",
        on: { click: () => input.click() }
      });
      const defaultButton = makeButton("使用預設圖片", {
        on: {
          click: () => {
            selectedCanvas = copyCanvas(this.app.getDefaultCanvas());
            selectedName = "預設插畫";
            selectedKind = "demo";
            render();
          }
        }
      });

      const uploadZone = el("div", {
        className: "upload-zone",
        on: {
          dragover: (event) => {
            event.preventDefault();
            uploadZone.classList.add("is-dragging");
          },
          dragleave: () => uploadZone.classList.remove("is-dragging"),
          drop: async (event) => {
            event.preventDefault();
            uploadZone.classList.remove("is-dragging");
            const file = event.dataTransfer.files?.[0];
            if (!file) return;
            try {
              const result = await this.app.importImageFile(file);
              selectedCanvas = result.canvas;
              selectedName = result.name;
              selectedKind = "upload";
              this.app.toast.show("圖片已載入", "success");
              render();
            } catch (error) {
              this.app.toast.show(error.message, "error");
            }
          }
        }
      }, [
        el("div", {}, [
          el("h3", { text: "圖片來源" }),
          el("p", { className: "muted", text: "JPG、PNG、WebP、GIF、BMP，最大 10MB。" }),
          el("div", { className: "upload-actions" }, [chooseButton, defaultButton]),
          input
        ])
      ]);

      const previewWrap = el("div", { className: "stack" }, [
        uploadZone,
        el("div", { className: "image-preview" }, [
          el("canvas", { attrs: { width: 320, height: 320 } })
        ]),
        el("p", { className: "canvas-status", text: selectedName })
      ]);

      drawSelectedPreview(previewWrap);
      return previewWrap;
    };

    const renderDifficultyStep = () => el("div", { className: "stack" }, [
      el("p", { className: "muted", text: "難度越高，碎片越小，吸附距離也越精準。" }),
      el("div", { className: "difficulty-grid" }, DIFFICULTIES.map((difficulty) => {
        const button = el("button", {
          className: `difficulty-card ${difficulty.id === selectedDifficultyId ? "is-selected" : ""}`,
          type: "button",
          on: {
            click: () => {
              selectedDifficultyId = difficulty.id;
              render();
            }
          }
        }, [
          el("strong", { text: `${difficulty.zh} ${difficulty.cols}×${difficulty.cols}` }),
          el("span", { text: difficulty.note })
        ]);
        return button;
      }))
    ]);

    const renderConfirmStep = () => {
      const difficulty = getDifficultyById(DIFFICULTIES, selectedDifficultyId);
      const previewWrap = el("div", { className: "stack" }, [
        el("div", { className: "image-preview" }, [
          el("canvas", { attrs: { width: 320, height: 320 } })
        ]),
        el("div", { className: "result-grid" }, [
          el("div", { className: "result-stat" }, [el("span", { text: "圖片" }), el("strong", { text: selectedName })]),
          el("div", { className: "result-stat" }, [el("span", { text: "難度" }), el("strong", { text: difficulty.zh })]),
          el("div", { className: "result-stat" }, [el("span", { text: "碎片" }), el("strong", { text: String(difficulty.pieces) })])
        ])
      ]);
      drawSelectedPreview(previewWrap);
      return previewWrap;
    };

    const render = () => {
      this.modal.setTitle(["選擇圖片", "選擇難度", "確認開始"][step]);
      const content = el("div", { className: "stack" }, [
        renderSteps(),
        step === 0 ? renderUploadStep() : step === 1 ? renderDifficultyStep() : renderConfirmStep()
      ]);

      const backButton = makeButton("上一步", {
        disabled: step === 0,
        on: {
          click: () => {
            step -= 1;
            render();
          }
        }
      });
      const nextButton = makeButton(step === 2 ? "開始" : "下一步", {
        variant: step === 2 ? "primary" : "accent",
        on: {
          click: () => {
            if (step < 2) {
              step += 1;
              render();
              return;
            }
            const canvas = copyCanvas(selectedCanvas);
            this.modal.close();
            this.app.startGame({
              sourceCanvas: canvas,
              imageName: selectedName,
              sourceKind: selectedKind,
              difficultyId: selectedDifficultyId
            });
          }
        }
      });

      this.modal.setBody(content);
      this.modal.setFooter(backButton, nextButton);
    };

    render();
    this.modal.open();
  }
}


/* js/screens/GameScreen.js */

class GameScreen {
  constructor(app, data = {}) {
    this.app = app;
    this.snapshot = data.snapshot || null;
    this.engine = null;
    this.dragController = null;
    this.timer = null;
    this.completed = false;
    this.paused = false;
    this.resizeTimer = null;
    this.saveTimer = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render() {
    const config = this.app.state.gameConfig;
    const difficulty = getDifficultyById(DIFFICULTIES, config.difficultyId);
    this.timerEl = el("span", { text: "00:00" });
    this.progressEl = el("span", { text: `0/${difficulty.pieces}` });
    this.pauseOverlay = el("div", { className: "pause-overlay", text: "暫停" });
    this.canvas = el("canvas", { id: "puzzle-canvas", attrs: { width: 720, height: 720, "aria-label": "拼圖遊戲板" } });

    this.pauseButton = makeButton("暫停", { on: { click: () => this.togglePause() } });

    const screen = el("main", { className: "game-screen" }, [
      el("div", { className: "game-shell" }, [
        el("header", { className: "game-hud surface" }, [
          makeButton("主選單", { on: { click: () => this.app.navigate("main-menu") } }),
          el("div", { className: "game-title" }, [
            el("strong", { text: "拼圖挑戰" }),
            el("span", { className: "hud-stat" }, ["時間 ", this.timerEl]),
            el("span", { className: "hud-stat" }, [`${difficulty.zh} `, el("span", { text: `${difficulty.cols}×${difficulty.cols}` })]),
            el("span", { className: "hud-stat" }, ["進度 ", this.progressEl])
          ]),
          makeButton("設定", { on: { click: () => this.app.navigate("settings") } })
        ]),
        el("section", { className: "game-board-wrap" }, [
          el("div", { className: "canvas-frame" }, [
            this.canvas,
            this.pauseOverlay
          ]),
          el("div", { className: "canvas-status", text: this.app.state.imageName })
        ]),
        el("div", { className: "game-toolbar surface" }, [
          this.pauseButton,
          makeButton("打亂", { on: { click: () => this.engine?.shuffleUnsolved() } }),
          makeButton("提示", { on: { click: () => this.engine?.showHint() } }),
          makeButton("重開", { on: { click: () => this.app.restartCurrentGame() } })
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    const config = this.app.state.gameConfig;
    const difficulty = getDifficultyById(DIFFICULTIES, config.difficultyId);
    const sourceCanvas = this.app.state.imageCanvas || this.app.getDefaultCanvas();

    this.engine = new PuzzleEngine({
      canvas: this.canvas,
      sourceCanvas,
      difficulty,
      sfx: this.app.sfx,
      onChange: () => this.scheduleSave(),
      onSolvedChange: (solved, total) => {
        this.progressEl.textContent = `${solved}/${total}`;
      },
      onVictory: () => this.finish()
    });
    this.engine.init(this.snapshot);

    this.dragController = new DragController(this.canvas, this.engine, {
      onInteraction: () => this.app.unlockAudio()
    });
    this.dragController.attach();

    this.timer = new Timer({
      startAt: this.snapshot?.elapsedSeconds || 0,
      onTick: (seconds) => {
        this.timerEl.textContent = formatTime(seconds);
        if (seconds > 0 && seconds % 5 === 0) this.scheduleSave();
      }
    });
    this.timer.start();

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  destroy() {
    if (!this.completed) this.persist();
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.resizeTimer);
    clearTimeout(this.saveTimer);
    this.timer?.stop();
    this.dragController?.destroy();
    this.engine?.destroy();
  }

  persist() {
    if (!this.engine || !this.timer) return;
    this.app.saveCurrentGame({
      engineSnapshot: this.engine.serialize(),
      elapsedSeconds: this.timer.getElapsedSeconds()
    });
  }

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.persist(), 200);
  }

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.engine?.resize(), 120);
  }

  handleKeyDown(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;

    if (event.code === "Space") {
      event.preventDefault();
      this.togglePause();
    }
    if (event.key === "Escape") {
      this.app.navigate("main-menu");
    }
  }

  togglePause() {
    this.paused = !this.paused;
    this.app.sfx.play(this.paused ? "pause" : "resume");
    this.engine?.setPaused(this.paused);
    this.pauseOverlay.classList.toggle("is-visible", this.paused);
    this.pauseButton.textContent = this.paused ? "繼續" : "暫停";
    if (this.paused) this.timer?.pause();
    else this.timer?.resume();
  }

  finish() {
    if (this.completed) return;
    this.completed = true;
    this.timer?.stop();
    this.app.finishGame({
      elapsedSeconds: this.timer.getElapsedSeconds(),
      difficultyId: this.app.state.gameConfig.difficultyId,
      imageCanvas: this.app.state.imageCanvas,
      imageName: this.app.state.imageName
    });
  }
}


/* js/screens/SettingsScreen.js */

class SettingsScreen {
  constructor(app) {
    this.app = app;
  }

  render() {
    const settings = this.app.state.settings;
    const musicValue = el("strong", { text: `${settings.musicVolume}%` });
    const sfxValue = el("strong", { text: `${settings.sfxVolume}%` });

    const appearanceButton = (label, value) => {
      const button = makeButton(label, {
        on: { click: () => this.app.setAppearance(value) }
      });
      if (settings.appearance === value) button.classList.add("is-selected");
      button.setAttribute("aria-pressed", String(settings.appearance === value));
      return button;
    };

    const screen = el("main", { className: "screen" }, [
      el("div", { className: "screen-shell stack" }, [
        el("header", { className: "screen-topbar" }, [
          el("div", { className: "screen-title-block" }, [
            el("span", { className: "screen-kicker", text: "Settings" }),
            el("h2", { text: "設定" })
          ]),
          makeButton("返回", { on: { click: () => this.app.navigate("main-menu") } })
        ]),
        el("section", { className: "settings-list surface" }, [
          el("div", { className: "setting-row" }, [
            el("strong", { text: "背景音樂" }),
            el("div", { className: "setting-control" }, [
              el("input", {
                type: "range",
                value: settings.musicVolume,
                attrs: { min: "0", max: "100", "aria-label": "背景音樂音量" },
                on: {
                  input: (event) => {
                    const value = Number(event.currentTarget.value);
                    musicValue.textContent = `${value}%`;
                    this.app.updateSettings({ musicVolume: value });
                  }
                }
              }),
              musicValue
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "音效" }),
            el("div", { className: "setting-control" }, [
              el("input", {
                type: "range",
                value: settings.sfxVolume,
                attrs: { min: "0", max: "100", "aria-label": "音效音量" },
                on: {
                  input: (event) => {
                    const value = Number(event.currentTarget.value);
                    sfxValue.textContent = `${value}%`;
                    this.app.updateSettings({ sfxVolume: value });
                  }
                }
              }),
              sfxValue,
              makeButton("測試", {
                on: {
                  click: async () => {
                    await this.app.unlockAudio();
                    this.app.sfx.play("combo");
                  }
                }
              })
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "顯示模式" }),
            el("div", { className: "segmented" }, [
              appearanceButton("明亮", "light"),
              appearanceButton("黑暗", "dark")
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "預設難度" }),
            el("div", { className: "difficulty-grid" }, DIFFICULTIES.map((difficulty) => el("button", {
              className: `difficulty-card ${settings.defaultDifficulty === difficulty.id ? "is-selected" : ""}`,
              type: "button",
              on: {
                click: () => {
                  this.app.updateSettings({ defaultDifficulty: difficulty.id });
                  this.app.navigate("settings");
                }
              }
            }, [
              el("strong", { text: difficulty.zh }),
              el("span", { text: `${difficulty.cols}×${difficulty.cols} · ${difficulty.pieces} 片` })
            ])))
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "色彩主題" }),
            el("div", { className: "theme-grid" }, THEMES.map((theme) => el("button", {
              className: `theme-option ${settings.theme === theme.id ? "is-selected" : ""}`,
              type: "button",
              on: { click: () => this.app.setTheme(theme.id) }
            }, [
              el("span", { text: theme.label }),
              el("span", { className: "swatches" }, theme.colors.map((color) => el("span", {
                className: "swatch",
                attrs: { style: `background:${color}` }
              })))
            ])))
          ]),
          el("div", { className: "toolbar" }, [
            makeButton("播放背景音樂", {
              on: {
                click: async () => {
                  await this.app.unlockAudio();
                  this.app.playMusicForCurrentScreen();
                  this.app.toast.show("背景音樂已啟動", "success");
                }
              }
            }),
            makeButton("還原預設", {
              on: {
                click: () => {
                  this.app.updateSettings({ ...DEFAULT_SETTINGS });
                  this.app.setTheme(DEFAULT_SETTINGS.theme);
                  this.app.setAppearance(DEFAULT_SETTINGS.appearance);
                }
              }
            })
          ])
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }
}


/* js/screens/InstructionsScreen.js */

class InstructionsScreen {
  constructor(app) {
    this.app = app;
  }

  render() {
    const steps = [
      ["選擇圖片", "使用預設插畫，或上傳 JPG、PNG、WebP、GIF、BMP。"],
      ["設定難度", "3×3 到 10×10 共六段難度，碎片數越多挑戰越高。"],
      ["拖曳碎片", "用滑鼠或手指拖曳，靠近正確位置時會自動吸附。"],
      ["使用提示", "提示會短暫標出其中一片的正確位置。"],
      ["暫停與返回", "空白鍵暫停，Esc 返回主選單，系統會保存目前進度。"],
      ["完成拼圖", "所有碎片吸附後會進入完成畫面並記錄本次成績。"]
    ];

    const screen = el("main", { className: "screen" }, [
      el("div", { className: "screen-shell stack" }, [
        el("header", { className: "screen-topbar" }, [
          el("div", { className: "screen-title-block" }, [
            el("span", { className: "screen-kicker", text: "How to Play" }),
            el("h2", { text: "玩法說明" })
          ]),
          makeButton("返回", { on: { click: () => this.app.navigate("main-menu") } })
        ]),
        el("section", { className: "instructions-panel surface" }, [
          el("p", { className: "muted", text: "完成整張圖片即可過關。遊戲支援觸控與滑鼠操作，進度暫存在本分頁工作階段。" }),
          el("ol", { className: "instruction-steps" }, steps.map(([title, text]) => el("li", {}, [
            el("strong", { text: title }),
            el("span", { text })
          ])))
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }
}


/* js/screens/VictoryScreen.js */

class VictoryScreen {
  constructor(app, data = {}) {
    this.app = app;
    this.data = data;
    this.previewCanvas = null;
  }

  render() {
    const difficulty = getDifficultyById(DIFFICULTIES, this.data.difficultyId);
    this.previewCanvas = el("canvas", { attrs: { width: 360, height: 360 } });

    const screen = el("main", { className: "screen victory-screen" }, [
      el("section", { className: "victory-panel surface" }, [
        el("span", { className: "screen-kicker", text: "Completed" }),
        el("h1", { text: "完成拼圖" }),
        el("div", { className: "victory-preview" }, [this.previewCanvas]),
        el("div", { className: "result-grid" }, [
          el("div", { className: "result-stat" }, [
            el("span", { text: "時間" }),
            el("strong", { text: formatTime(this.data.elapsedSeconds || 0) })
          ]),
          el("div", { className: "result-stat" }, [
            el("span", { text: "難度" }),
            el("strong", { text: difficulty.zh })
          ]),
          el("div", { className: "result-stat" }, [
            el("span", { text: this.data.isNewBest ? "新紀錄" : "最佳" }),
            el("strong", { text: this.data.bestSeconds ? formatTime(this.data.bestSeconds) : "--:--" })
          ])
        ]),
        el("div", { className: "toolbar" }, [
          makeButton("再玩一次", { variant: "primary", on: { click: () => this.app.restartCurrentGame() } }),
          makeButton("主選單", { on: { click: () => this.app.navigate("main-menu") } })
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }

  afterRender() {
    drawCanvasPreview(this.data.imageCanvas || this.app.getDefaultCanvas(), this.previewCanvas);
  }
}


/* js/main.js */

class PuzzleApp {
  constructor(root) {
    this.root = root;
    this.state = new AppState();
    this.defaultCanvas = this.createDefaultImage();
    this.state.setImage(copyCanvas(this.defaultCanvas), "預設插畫", "demo");
    this.toast = new Toast();
    this.importer = new ImageImporter();
    this.audio = new AudioEngine(this.state.settings);
    this.audioSettings = new AudioSettings(this.audio, this.state);
    this.sfx = new SoundEffects(this.audio);
    this.music = new MusicPlayer(this.audio);
    this.theme = new ThemeManager(this.state);
    this.scoreManager = new ScoreManager();
    this.audioUnlocked = false;

    this.router = new Router(root, {
      "main-menu": () => new MainMenuScreen(this),
      game: (data) => new GameScreen(this, data),
      settings: () => new SettingsScreen(this),
      instructions: () => new InstructionsScreen(this),
      victory: (data) => new VictoryScreen(this, data)
    });

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleAudioGesture = this.handleAudioGesture.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  init() {
    this.theme.apply();
    document.addEventListener("pointerdown", this.handleAudioGesture, { passive: true });
    document.addEventListener("keydown", this.handleAudioGesture);
    document.addEventListener("click", this.handleDocumentClick);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    this.navigate("main-menu");
  }

  handleDocumentClick(event) {
    if (event.target.closest("button")) {
      void this.unlockAudio();
      this.sfx.play("click");
    }
  }

  handleAudioGesture() {
    void this.unlockAudio();
  }

  handleBeforeUnload() {
    this.router.currentScreen?.persist?.();
  }

  async unlockAudio() {
    await this.audio.unlock();
    if (!this.audioUnlocked) {
      this.audioUnlocked = true;
      this.playMusicForCurrentScreen();
    }
  }

  playMusicForCurrentScreen() {
    if (!this.audioUnlocked) return;
    const difficulty = this.state.gameConfig
      ? getDifficultyById(DIFFICULTIES, this.state.gameConfig.difficultyId)
      : this.state.defaultDifficulty;
    this.music.playFor(this.router.currentName || "main-menu", difficulty);
  }

  navigate(screenName, data = {}) {
    this.router.navigate(screenName, data);
    this.playMusicForCurrentScreen();
  }

  canContinue() {
    return hasGameSnapshot();
  }

  continueGame() {
    const snapshot = loadGameSnapshot();
    if (!snapshot) {
      this.toast.show("沒有可繼續的遊戲", "error");
      return;
    }

    if (snapshot.imageSourceKind === "upload" && this.state.imageSourceKind !== "upload") {
      this.toast.show("自訂圖片不會寫入瀏覽器儲存，請重新上傳圖片後開始。", "error");
      return;
    }

    if (snapshot.imageSourceKind === "demo") {
      this.state.setImage(copyCanvas(this.defaultCanvas), snapshot.imageName || "預設插畫", "demo");
    }

    this.state.setGameConfig({
      difficultyId: snapshot.difficulty,
      imageSourceKind: snapshot.imageSourceKind || this.state.imageSourceKind
    });

    this.sfx.play("start");
    this.navigate("game", { snapshot });
  }

  async importImageFile(file) {
    const imported = await this.importer.importFile(file);
    return {
      canvas: toCenterSquare(imported.image, IMAGE_RULES.outputSize),
      name: imported.name
    };
  }

  startGame({ sourceCanvas, imageName, sourceKind, difficultyId, snapshot = null }) {
    this.state.setImage(copyCanvas(sourceCanvas), imageName, sourceKind);
    this.state.setGameConfig({ difficultyId, imageSourceKind: sourceKind });
    this.sfx.play("start");
    this.navigate("game", { snapshot });
  }

  restartCurrentGame() {
    const config = this.state.gameConfig || {
      difficultyId: this.state.settings.defaultDifficulty,
      imageSourceKind: this.state.imageSourceKind
    };
    clearGameSnapshot();
    this.state.setGameConfig(config);
    this.navigate("game");
  }

  saveCurrentGame({ engineSnapshot, elapsedSeconds }) {
    if (!engineSnapshot || !this.state.gameConfig) return;
    saveGameSnapshot({
      difficulty: engineSnapshot.difficulty,
      pieces: engineSnapshot.pieces,
      elapsedSeconds,
      imageSourceKind: this.state.imageSourceKind,
      imageName: this.state.imageName
    });
  }

  finishGame({ elapsedSeconds, difficultyId, imageCanvas, imageName }) {
    clearGameSnapshot();
    const score = this.scoreManager.record(difficultyId, elapsedSeconds);
    this.state.lastResult = {
      elapsedSeconds,
      difficultyId,
      imageCanvas: imageCanvas || this.getDefaultCanvas(),
      imageName,
      bestSeconds: score.best,
      isNewBest: score.isNewBest
    };
    this.navigate("victory", this.state.lastResult);
  }

  updateSettings(partial) {
    this.audioSettings.update(partial);
    if (partial.theme || partial.appearance) {
      this.theme.apply(this.state.settings.theme, this.state.settings.appearance);
    }
    this.playMusicForCurrentScreen();
  }

  setTheme(themeId) {
    this.theme.set(themeId);
    this.playMusicForCurrentScreen();
    this.router.refresh();
  }

  setAppearance(appearance) {
    this.theme.setAppearance(appearance);
    this.playMusicForCurrentScreen();
    this.router.refresh();
  }

  getDefaultCanvas() {
    return this.defaultCanvas;
  }

  createDefaultImage() {
    const size = IMAGE_RULES.outputSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const sky = ctx.createLinearGradient(0, 0, 0, size * 0.62);
    sky.addColorStop(0, "#7dd3fc");
    sky.addColorStop(0.56, "#fef3c7");
    sky.addColorStop(1, "#fb7185");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#fff7ed";
    ctx.beginPath();
    ctx.arc(size * 0.75, size * 0.2, size * 0.09, 0, Math.PI * 2);
    ctx.fill();

    drawMountain(ctx, [[0, 500], [150, 270], [280, 500]], "#34506b");
    drawMountain(ctx, [[150, 510], [410, 220], [690, 510]], "#223b57");
    drawMountain(ctx, [[450, 510], [645, 310], [800, 510]], "#48627b");

    const land = ctx.createLinearGradient(0, 500, 0, size);
    land.addColorStop(0, "#2d6a4f");
    land.addColorStop(1, "#95d5b2");
    ctx.fillStyle = land;
    ctx.fillRect(0, 500, size, 300);

    ctx.fillStyle = "#90e0ef";
    ctx.beginPath();
    ctx.moveTo(330, 800);
    ctx.bezierCurveTo(380, 700, 300, 610, 385, 520);
    ctx.bezierCurveTo(455, 590, 520, 680, 500, 800);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 9; i += 1) {
      drawTree(ctx, 64 + i * 82, 610 + (i % 3) * 32, 46 + (i % 2) * 12);
    }

    drawBalloon(ctx, 190, 170, "#d62b7a", "#ffd166");
    drawBalloon(ctx, 560, 145, "#0077b6", "#f97316");
    drawBalloon(ctx, 665, 275, "#52b788", "#ffffff");

    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = "900 58px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PUZZLE", size / 2, 100);
    ctx.font = "900 38px Nunito, sans-serif";
    ctx.fillText("CHALLENGE", size / 2, 146);

    return canvas;
  }
}

function drawMountain(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(points[1][0], points[1][1]);
  ctx.lineTo(points[1][0] - 42, points[1][1] + 72);
  ctx.lineTo(points[1][0] + 54, points[1][1] + 62);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, x, y, height) {
  ctx.fillStyle = "#6d4c41";
  ctx.fillRect(x - 6, y - height * 0.25, 12, height * 0.45);
  ctx.fillStyle = "#1b4332";
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x - height * 0.38, y);
  ctx.lineTo(x + height * 0.38, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2d6a4f";
  ctx.beginPath();
  ctx.moveTo(x, y - height * 1.18);
  ctx.lineTo(x - height * 0.28, y - height * 0.36);
  ctx.lineTo(x + height * 0.28, y - height * 0.36);
  ctx.closePath();
  ctx.fill();
}

function drawBalloon(ctx, x, y, primary, secondary) {
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.ellipse(x, y, 38, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = secondary;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 49, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(20,33,61,0.46)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 42);
  ctx.lineTo(x - 10, y + 70);
  ctx.moveTo(x + 18, y + 42);
  ctx.lineTo(x + 10, y + 70);
  ctx.stroke();
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(x - 13, y + 68, 26, 18);
}

const app = new PuzzleApp(document.getElementById("app"));
app.init();


})();
