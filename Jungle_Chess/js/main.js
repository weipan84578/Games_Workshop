const ROWS = 9;
const COLS = 7;
const RED = "red";
const BLUE = "blue";
const SETTINGS_KEY = "jungleChess_settings";
const DIFFICULTY_DEPTH = { easy: 1, normal: 2, hard: 3, expert: 4 };
const PIECE_VALUE = { 8:800, 7:700, 6:600, 5:500, 4:400, 3:300, 2:200, 1:150 };
const DEFAULT_SETTINGS = {
  aiDifficulty:"normal",
  language:"zh-TW",
  sfxVolume:70,
  bgmVolume:40,
  showMovableSquares:true,
  showCoordinates:false,
  showAIThinkAnimation:true,
  autoFlipBoard:true,
  fixedMapId:"random"
};
const PIECE_INFO = {
  elephant:{ name:"\u8c61", emoji:"\u{1F418}", ability:"\u7b49\u7d1a\u6700\u9ad8\uff0c\u4f46\u4e0d\u80fd\u5403\u9f20\u3002", canEat:"\u53ef\u5403 2-8 \u7d1a\uff0c\u4e0d\u80fd\u5403\u9f20\u3002" },
  lion:{ name:"\u7345", emoji:"\u{1F981}", ability:"\u53ef\u76f4\u7dda\u8df3\u904e\u6cb3\u6d41\uff0c\u8def\u5f91\u4e0a\u6709\u9f20\u6642\u4e0d\u80fd\u8df3\u3002", canEat:"\u53ef\u5403 1-6 \u7d1a\u3002" },
  tiger:{ name:"\u864e", emoji:"\u{1F42F}", ability:"\u53ef\u76f4\u7dda\u8df3\u904e\u6cb3\u6d41\uff0c\u8def\u5f91\u4e0a\u6709\u9f20\u6642\u4e0d\u80fd\u8df3\u3002", canEat:"\u53ef\u5403 1-5 \u7d1a\u3002" },
  leopard:{ name:"\u8c79", emoji:"\u{1F406}", ability:"\u6bcf\u6b21\u4e0a\u4e0b\u5de6\u53f3\u79fb\u52d5\u4e00\u683c\u3002", canEat:"\u53ef\u5403 1-4 \u7d1a\u3002" },
  wolf:{ name:"\u72fc", emoji:"\u{1F43A}", ability:"\u6bcf\u6b21\u4e0a\u4e0b\u5de6\u53f3\u79fb\u52d5\u4e00\u683c\u3002", canEat:"\u53ef\u5403 1-3 \u7d1a\u3002" },
  dog:{ name:"\u72d7", emoji:"\u{1F436}", ability:"\u6bcf\u6b21\u4e0a\u4e0b\u5de6\u53f3\u79fb\u52d5\u4e00\u683c\u3002", canEat:"\u53ef\u5403 1-2 \u7d1a\u3002" },
  cat:{ name:"\u8c93", emoji:"\u{1F431}", ability:"\u6bcf\u6b21\u4e0a\u4e0b\u5de6\u53f3\u79fb\u52d5\u4e00\u683c\u3002", canEat:"\u53ef\u5403\u9f20\u3002" },
  rat:{ name:"\u9f20", emoji:"\u{1F42D}", ability:"\u552f\u4e00\u53ef\u9032\u5165\u6cb3\u6d41\u7684\u68cb\u5b50\uff0c\u53ef\u5728\u9678\u5730\u5403\u8c61\u3002", canEat:"\u53ef\u5403\u9f20\uff1b\u5728\u9678\u5730\u53ef\u5403\u8c61\u3002" }
};
const MAP_THEMES = [
  { id:"classic", name:"\u7d93\u5178\u53e2\u6797", icon:"\u{1F33F}", description:"\u6a19\u6e96\u6cb3\u9053\u8207\u53e2\u6797\u68cb\u76e4", riverCells:[[1,3],[2,3],[4,3],[5,3],[1,4],[2,4],[4,4],[5,4],[1,5],[2,5],[4,5],[5,5]], cssVars:{"--color-bg-primary":"#1a2e1a","--color-bg-secondary":"#2d4a2d","--color-board-light":"#c8a96e","--color-board-dark":"#a07840","--color-board-river":"#4a90d4","--color-board-trap":"#8b0000","--color-board-den":"#ffd700"}, terrainIcons:{ river:"\u6cb3", trapPlayer:"\u9677", trapAI:"\u9677", denPlayer:"\u7a74", denAI:"\u7a74" }, particleEffect:"leaf", defaultBGM:"jungle" },
  { id:"arctic", name:"\u51b0\u539f\u51cd\u571f", icon:"\u2744\ufe0f", description:"\u4e2d\u592e\u51b0\u6cb3\u8207\u5169\u5074\u51b0\u88c2", riverCells:[[3,2],[3,3],[3,4],[3,5],[3,6],[1,4],[2,4],[4,4],[5,4]], cssVars:{"--color-bg-primary":"#0a1e3a","--color-bg-secondary":"#1a3a5a","--color-board-light":"#ddeeff","--color-board-dark":"#aaccee","--color-board-river":"#b0d8ff","--color-board-trap":"#003366","--color-board-den":"#e0f8ff"}, terrainIcons:{ river:"\u51b0", trapPlayer:"\u51cd", trapAI:"\u51cd", denPlayer:"\u7a9f", denAI:"\u7a9f" }, particleEffect:"snow", particleConfig:{ count:40, color:"#ffffff", speedX:-0.3, speedY:0.8, size:3 }, defaultBGM:"guqin" },
  { id:"desert", name:"\u6c99\u6f20\u907a\u8de1", icon:"\u{1F3DC}\ufe0f", description:"\u7da0\u6d32\u6c34\u9053\u5206\u6563\u5728\u907a\u8de1\u9593", riverCells:[[1,2],[3,2],[1,3],[5,3],[1,4],[3,4],[5,4],[1,5],[3,5],[5,5]], cssVars:{"--color-bg-primary":"#3a2010","--color-bg-secondary":"#5a3818","--color-board-light":"#e8c87a","--color-board-dark":"#c8923a","--color-board-river":"#2a8a4a","--color-board-trap":"#6a3a00","--color-board-den":"#ffa500"}, terrainIcons:{ river:"\u6cc9", trapPlayer:"\u5751", trapAI:"\u5751", denPlayer:"\u6bbf", denAI:"\u6bbf" }, particleEffect:"sand", particleConfig:{ count:24, color:"#e8c87a", speedX:-1.2, speedY:0.2, size:2 }, defaultBGM:"jungle" },
  { id:"volcanic", name:"\u6eab\u6cb3\u5ce1\u8c37", icon:"\u2668\ufe0f", description:"\u6eab\u6696\u6cb3\u6d41\u5448\u659c\u7dda\u5206\u5e03", riverCells:[[1,3],[2,3],[2,4],[3,4],[4,4],[4,5],[5,5],[1,5],[5,3]], cssVars:{"--color-bg-primary":"#24140a","--color-bg-secondary":"#4a2c16","--color-board-light":"#8a6248","--color-board-dark":"#5a3a2a","--color-board-river":"#d98c45","--color-board-trap":"#8b2f18","--color-board-den":"#d0a15f"}, terrainIcons:{ river:"\u6e6f", trapPlayer:"\u9677", trapAI:"\u9677", denPlayer:"\u7a9f", denAI:"\u7a9f" }, particleEffect:"spark", particleConfig:{ count:20, color:"#ffd08a", speedX:0.1, speedY:-0.6, size:2 }, defaultBGM:"jungle" },
  { id:"ink", name:"\u6c34\u58a8\u5c71\u6cb3", icon:"\u{1F58C}\ufe0f", description:"\u6c34\u58a8\u98a8\u683c\u7684\u66f2\u6298\u6c34\u9053", riverCells:[[1,2],[3,2],[5,2],[2,3],[4,3],[2,4],[3,4],[4,4],[2,5],[4,5],[1,6],[3,6],[5,6]], cssVars:{"--color-bg-primary":"#1a1210","--color-bg-secondary":"#2e2018","--color-board-light":"#f5f0e0","--color-board-dark":"#e0d8c0","--color-board-river":"#3a6a90","--color-board-trap":"#8a0000","--color-board-den":"#cc2200"}, terrainIcons:{ river:"\u5ddd", trapPlayer:"\u7f60", trapAI:"\u7f60", denPlayer:"\u7a74", denAI:"\u7a74" }, particleEffect:null, defaultBGM:"guqin" }
];
const PIECE_META = {
  elephant:{ rank:8, emoji:"\u{1F418}", chinese:"\u8c61", short:"E" },
  lion:{ rank:7, emoji:"\u{1F981}", chinese:"\u7345", short:"L" },
  tiger:{ rank:6, emoji:"\u{1F42F}", chinese:"\u864e", short:"T" },
  leopard:{ rank:5, emoji:"\u{1F406}", chinese:"\u8c79", short:"P" },
  wolf:{ rank:4, emoji:"\u{1F43A}", chinese:"\u72fc", short:"W" },
  dog:{ rank:3, emoji:"\u{1F436}", chinese:"\u72d7", short:"D" },
  cat:{ rank:2, emoji:"\u{1F431}", chinese:"\u8c93", short:"C" },
  rat:{ rank:1, emoji:"\u{1F42D}", chinese:"\u9f20", short:"R" }
};
const INITIAL_PIECES = [
  { type:"lion", color:RED, col:6, row:8 },
  { type:"tiger", color:RED, col:0, row:8 },
  { type:"dog", color:RED, col:5, row:7 },
  { type:"cat", color:RED, col:1, row:7 },
  { type:"rat", color:RED, col:6, row:6 },
  { type:"leopard", color:RED, col:4, row:6 },
  { type:"wolf", color:RED, col:2, row:6 },
  { type:"elephant", color:RED, col:0, row:6 },
  { type:"lion", color:BLUE, col:0, row:0 },
  { type:"tiger", color:BLUE, col:6, row:0 },
  { type:"dog", color:BLUE, col:1, row:1 },
  { type:"cat", color:BLUE, col:5, row:1 },
  { type:"rat", color:BLUE, col:0, row:2 },
  { type:"leopard", color:BLUE, col:2, row:2 },
  { type:"wolf", color:BLUE, col:4, row:2 },
  { type:"elephant", color:BLUE, col:6, row:2 }
];
const DIRECTIONS = [[1,0],[-1,0],[0,1],[0,-1]];

class SettingsStore {
  constructor(key) {
    this._key = key;
    this._saved = null;
    this._draft = null;
  }
  load() {
    try {
      const raw = localStorage.getItem(this._key);
      this._saved = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      this._saved = { ...DEFAULT_SETTINGS };
    }
    return { ...this._saved };
  }
  beginEdit() {
    if (!this._saved) this.load();
    this._draft = { ...this._saved };
    return { ...this._draft };
  }
  updateDraft(key, value) {
    if (!this._draft) this.beginEdit();
    this._draft[key] = value;
  }
  getDraft() {
    return this._draft ? { ...this._draft } : this.beginEdit();
  }
  save() {
    if (!this._draft) return false;
    this._saved = { ...this._draft };
    try {
      localStorage.setItem(this._key, JSON.stringify(this._saved));
    } catch {
      // Some file:// or privacy-mode contexts block localStorage; keep the in-memory copy.
    }
    this._draft = null;
    return true;
  }
  discard() {
    this._draft = null;
    if (!this._saved) this.load();
    return { ...this._saved };
  }
  resetToDefault() {
    this._draft = { ...DEFAULT_SETTINGS };
    return { ...this._draft };
  }
  hasUnsavedChanges() {
    return !!this._draft && JSON.stringify(this._draft) !== JSON.stringify(this._saved);
  }
}

const settingsStore = new SettingsStore(SETTINGS_KEY);
let settings = settingsStore.load();
let state = createInitialState();
let selectedId = null;
let legalTargets = [];
let aiBusy = false;
let lastResult = null;
let currentMap = MAP_THEMES[0];
let forcedPieceStyle = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function selectMap() {
  if (settings.fixedMapId === "random") {
    return MAP_THEMES[Math.floor(Math.random() * MAP_THEMES.length)];
  }
  return MAP_THEMES.find(map => map.id === settings.fixedMapId) || MAP_THEMES[0];
}

function applyMapTheme(mapTheme) {
  currentMap = mapTheme || MAP_THEMES[0];
  document.body.className = document.body.className.replace(/\bmap--\S+/g, "").trim();
  document.body.classList.add(`map--${currentMap.id}`);
  Object.entries(currentMap.cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  forcedPieceStyle = null;
  startParticles(currentMap);
  AudioManager.playBGM(currentMap.defaultBGM);
  renderBoard();
}

function showMapNameToast(mapTheme) {
  const oldToast = $(".map-toast");
  if (oldToast) oldToast.remove();
  const toast = document.createElement("div");
  toast.className = "map-toast";
  toast.textContent = `${mapTheme.icon} ${mapTheme.name}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function ensureBoardFit() {
  const boardGrid = $("#board");
  const container = $(".board-wrapper");
  if (!boardGrid || !container) return;
  const containerWidth = container.getBoundingClientRect().width;
  const boardWidth = boardGrid.getBoundingClientRect().width;
  if (containerWidth > 0 && boardWidth > containerWidth) {
    const forcedCellSize = Math.floor((containerWidth - 12) / 7);
    document.documentElement.style.setProperty("--cell-size", `${Math.max(34, forcedCellSize)}px`);
  }
}

function terrainAt(col, row) {
  if (col === 3 && row === 0) return "den_blue";
  if (col === 3 && row === 8) return "den_red";
  if ((row === 0 && (col === 2 || col === 4)) || (row === 1 && col === 3)) return "trap_blue";
  if ((row === 8 && (col === 2 || col === 4)) || (row === 7 && col === 3)) return "trap_red";
  const rivers = (currentMap && currentMap.riverCells) || MAP_THEMES[0].riverCells;
  if (rivers.some(([riverCol, riverRow]) => riverCol === col && riverRow === row)) return "river";
  return "plain";
}

function createInitialState() {
  const cells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const pieces = INITIAL_PIECES.map((piece, index) => {
    const meta = PIECE_META[piece.type];
    return {
      id:`${piece.color}_${piece.type}_${index}`,
      type:piece.type,
      rank:meta.rank,
      color:piece.color,
      col:piece.col,
      row:piece.row,
      isAlive:true,
      emoji:meta.emoji,
      chineseName:meta.chinese
    };
  });
  pieces.forEach(piece => cells[piece.row][piece.col] = piece);
  return {
    cells,
    pieces,
    currentTurn:RED,
    gameStatus:"playing",
    winner:null,
    winReason:null,
    moveHistory:[],
    capturedPieces:{ red:[], blue:[] },
    undoCount:0
  };
}

function saveSettings() {
  settingsStore.beginEdit();
  Object.entries(settings).forEach(([key, value]) => settingsStore.updateDraft(key, value));
  settingsStore.save();
}

const AudioManager = {
  ctx:null,
  bgmTimer:null,
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  tone(freq, duration, type = "sine", volume = 0.2) {
    if (settings.sfxVolume <= 0) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume * settings.sfxVolume / 100, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  play(name) {
    const map = {
      click:[520,.06,"triangle"],
      select:[660,.09,"sine"],
      move:[420,.14,"triangle"],
      capture:[120,.24,"sawtooth"],
      jump:[740,.24,"square"],
      error:[90,.18,"sawtooth"],
      win:[880,.5,"triangle"],
      lose:[160,.5,"sine"],
      ai_move:[360,.1,"triangle"],
      undo:[260,.2,"sine"]
    };
    const args = map[name] || map.click;
    this.tone(args[0], args[1], args[2]);
  },
  playBGM(themeOverride = null) {
    this.stopBGM();
    const theme = themeOverride || (currentMap && currentMap.defaultBGM) || "jungle";
    if (theme === "none" || settings.bgmVolume <= 0) return;
    const jungle = [220, 293.66, 261.63, 196];
    const guqin = [261.63, 293.66, 329.63, 392, 440];
    const lava = [110, 146.83, 164.81, 98];
    const notes = theme === "guqin" ? guqin : theme === "lava" ? lava : jungle;
    let i = 0;
    this.bgmTimer = setInterval(() => {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = theme === "guqin" ? "sine" : theme === "lava" ? "sawtooth" : "triangle";
      osc.frequency.value = notes[i % notes.length];
      gain.gain.setValueAtTime(0.035 * settings.bgmVolume / 100, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + .7);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + .75);
      i++;
    }, theme === "guqin" ? 900 : theme === "lava" ? 600 : 700);
  },
  stopBGM() {
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    this.bgmTimer = null;
  }
};

function inBounds(col, row) {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}
function pieceAt(board, col, row) {
  return inBounds(col, row) ? board[row][col] : null;
}
function isRiver(col, row) { return terrainAt(col, row) === "river"; }
function isOwnDen(piece, col, row) {
  return terrainAt(col, row) === `den_${piece.color}`;
}
function effectiveRank(piece, col = piece.col, row = piece.row) {
  const terrain = terrainAt(col, row);
  if ((terrain === "trap_red" && piece.color === BLUE) || (terrain === "trap_blue" && piece.color === RED)) return 0;
  return piece.rank;
}
function canCapture(attacker, defender, toCol, toRow, board) {
  if (!defender || attacker.color === defender.color) return false;
  const fromRiver = isRiver(attacker.col, attacker.row);
  const toRiver = isRiver(toCol, toRow);
  if (attacker.type !== "rat" && toRiver) return false;
  if (attacker.type === "rat" && defender.type === "elephant") return !fromRiver && !toRiver;
  if (attacker.type === "elephant" && defender.type === "rat") return false;
  if (fromRiver !== toRiver) return false;
  const defendingRank = effectiveRank(defender, toCol, toRow);
  return effectiveRank(attacker) >= defendingRank;
}
function jumpTarget(piece, dx, dy, board) {
  if (piece.type !== "lion" && piece.type !== "tiger") return null;
  let col = piece.col + dx;
  let row = piece.row + dy;
  if (!inBounds(col, row) || !isRiver(col, row)) return null;
  while (inBounds(col, row) && isRiver(col, row)) {
    const blocker = pieceAt(board, col, row);
    if (blocker && blocker.type === "rat") return null;
    col += dx;
    row += dy;
  }
  if (!inBounds(col, row)) return null;
  return { col, row, isJump:true };
}
function getLegalMovesForPiece(piece, board = state.cells) {
  if (!piece || !piece.isAlive) return [];
  const moves = [];
  for (const [dx, dy] of DIRECTIONS) {
    let toCol = piece.col + dx;
    let toRow = piece.row + dy;
    let isJump = false;
    const jump = jumpTarget(piece, dx, dy, board);
    if (jump) {
      toCol = jump.col;
      toRow = jump.row;
      isJump = true;
    }
    if (!inBounds(toCol, toRow) || isOwnDen(piece, toCol, toRow)) continue;
    if (isRiver(toCol, toRow) && piece.type !== "rat") continue;
    const target = pieceAt(board, toCol, toRow);
    if (!target) {
      moves.push({ piece, fromCol:piece.col, fromRow:piece.row, toCol, toRow, capturedPiece:null, isJump });
    } else if (canCapture(piece, target, toCol, toRow, board)) {
      moves.push({ piece, fromCol:piece.col, fromRow:piece.row, toCol, toRow, capturedPiece:target, isJump });
    }
  }
  return moves;
}
function getAllLegalMoves(color, board = state.cells, pieces = state.pieces) {
  return pieces.filter(p => p.color === color && p.isAlive).flatMap(piece => getLegalMovesForPiece(piece, board));
}
function cloneState(input) {
  const pieces = input.pieces.map(piece => ({ ...piece }));
  const cells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  pieces.filter(p => p.isAlive).forEach(piece => cells[piece.row][piece.col] = piece);
  return { ...input, pieces, cells, capturedPieces:{ red:[...input.capturedPieces.red], blue:[...input.capturedPieces.blue] }, moveHistory:[...input.moveHistory] };
}
function applyMoveToState(input, move, record = false) {
  const next = cloneState(input);
  const piece = next.pieces.find(p => p.id === move.piece.id);
  const captured = pieceAt(next.cells, move.toCol, move.toRow);
  next.cells[piece.row][piece.col] = null;
  if (captured) {
    captured.isAlive = false;
    next.capturedPieces[captured.color].push({ ...captured });
  }
  piece.col = move.toCol;
  piece.row = move.toRow;
  next.cells[piece.row][piece.col] = piece;
  if (record) {
    next.moveHistory.push({
      pieceId:piece.id,
      fromCol:move.fromCol,
      fromRow:move.fromRow,
      toCol:move.toCol,
      toRow:move.toRow,
      capturedPiece:captured ? { ...captured } : null,
      isJump:move.isJump,
      timestamp:Date.now()
    });
  }
  const nextTurn = next.currentTurn === RED ? BLUE : RED;
  const winner = checkWinner(next, nextTurn);
  if (winner) {
    next.winner = winner.color;
    next.winReason = winner.reason;
    next.gameStatus = "ended";
  } else {
    next.currentTurn = nextTurn;
  }
  return next;
}
function checkWinner(input, nextTurn = input.currentTurn) {
  const redAlive = input.pieces.some(p => p.color === RED && p.isAlive);
  const blueAlive = input.pieces.some(p => p.color === BLUE && p.isAlive);
  if (!redAlive) return { color:BLUE, reason:"annihilate" };
  if (!blueAlive) return { color:RED, reason:"annihilate" };
  const redInDen = input.pieces.some(p => p.color === RED && p.isAlive && terrainAt(p.col, p.row) === "den_blue");
  const blueInDen = input.pieces.some(p => p.color === BLUE && p.isAlive && terrainAt(p.col, p.row) === "den_red");
  if (redInDen) return { color:RED, reason:"den" };
  if (blueInDen) return { color:BLUE, reason:"den" };
  if (getAllLegalMoves(nextTurn, input.cells, input.pieces).length === 0) {
    return { color:nextTurn === RED ? BLUE : RED, reason:"blocked" };
  }
  return null;
}
function evaluateBoard(input, aiColor = BLUE) {
  if (input.winner === aiColor) return 100000;
  if (input.winner && input.winner !== aiColor) return -100000;
  let score = 0;
  for (const piece of input.pieces) {
    if (!piece.isAlive) continue;
    const sign = piece.color === aiColor ? 1 : -1;
    const targetRow = piece.color === BLUE ? 8 : 0;
    const denPressure = 18 - (Math.abs(piece.col - 3) + Math.abs(piece.row - targetRow));
    const trap = effectiveRank(piece) === 0 ? -90 : 0;
    score += sign * (PIECE_VALUE[piece.rank] + denPressure * 12 + trap);
  }
  score += (getAllLegalMoves(aiColor, input.cells, input.pieces).length - getAllLegalMoves(RED, input.cells, input.pieces).length) * 8;
  return score;
}
function orderMoves(moves) {
  return [...moves].sort((a, b) => {
    const captureScore = move => move.capturedPiece ? PIECE_VALUE[move.capturedPiece.rank] + 1000 : 0;
    const denScore = move => terrainAt(move.toCol, move.toRow).startsWith("den_") ? 2000 : 0;
    return (captureScore(b) + denScore(b) + (b.isJump ? 70 : 0)) - (captureScore(a) + denScore(a) + (a.isJump ? 70 : 0));
  });
}
function minimax(input, depth, alpha, beta, maximizing) {
  if (depth === 0 || input.gameStatus === "ended") return { score:evaluateBoard(input) };
  const color = maximizing ? BLUE : RED;
  const moves = orderMoves(getAllLegalMoves(color, input.cells, input.pieces));
  if (!moves.length) return { score:maximizing ? -99999 : 99999 };
  let bestMove = moves[0];
  if (maximizing) {
    let bestScore = -Infinity;
    for (const move of moves) {
      const child = applyMoveToState(input, move);
      const result = minimax(child, depth - 1, alpha, beta, false);
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score:bestScore, move:bestMove };
  }
  let bestScore = Infinity;
  for (const move of moves) {
    const child = applyMoveToState(input, move);
    const result = minimax(child, depth - 1, alpha, beta, true);
    if (result.score < bestScore) {
      bestScore = result.score;
      bestMove = move;
    }
    beta = Math.min(beta, bestScore);
    if (beta <= alpha) break;
  }
  return { score:bestScore, move:bestMove };
}
function getBestAIMove() {
  const moves = orderMoves(getAllLegalMoves(BLUE, state.cells, state.pieces));
  if (!moves.length) return null;
  if (settings.aiDifficulty === "easy" && Math.random() < .3) return moves[Math.floor(Math.random() * Math.min(3, moves.length))];
  const depth = DIFFICULTY_DEPTH[settings.aiDifficulty] || 2;
  return minimax(state, depth, -Infinity, Infinity, true).move || moves[0];
}

function renderBoard() {
  const board = $("#board");
  board.innerHTML = "";
  board.classList.toggle("thinking", aiBusy && settings.showAIThinkAnimation);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("button");
      const terrain = terrainAt(col, row);
      const piece = state.cells[row][col];
      cell.type = "button";
      cell.className = `cell ${terrainClass(terrain)}`;
      cell.dataset.col = col;
      cell.dataset.row = row;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", cellLabel(col, row, terrain, piece));
      cell.tabIndex = 0;
      if (selectedId && piece && piece.id === selectedId) cell.classList.add("selected");
      const target = legalTargets.find(m => m.toCol === col && m.toRow === row);
      if (settings.showMovableSquares && target) cell.classList.add(target.capturedPiece ? "capture-target" : "movable");
      if (piece) cell.appendChild(renderPiece(piece));
      const mark = document.createElement("span");
      mark.className = "terrain-mark";
      mark.innerHTML = `${terrainMark(terrain)}${settings.showCoordinates ? `<span class="coord">${String.fromCharCode(65 + col)}${row + 1}</span>` : ""}`;
      cell.appendChild(mark);
      cell.addEventListener("click", () => handleCellClick(col, row));
      cell.addEventListener("keydown", event => handleCellKey(event, col, row));
      board.appendChild(cell);
    }
  }
  renderStatus();
  ensureBoardFit();
}
function terrainClass(terrain) {
  if (terrain === "river") return "river";
  if (terrain.startsWith("trap")) return "trap";
  if (terrain.startsWith("den")) return "den";
  return "";
}
function terrainMark(terrain) {
  const icons = currentMap.terrainIcons || MAP_THEMES[0].terrainIcons;
  if (terrain === "river") return `<span>${icons.river}</span>`;
  if (terrain === "trap_red") return `<span>${icons.trapPlayer}</span>`;
  if (terrain === "trap_blue") return `<span>${icons.trapAI}</span>`;
  if (terrain === "den_red") return `<span>${icons.denPlayer}</span>`;
  if (terrain === "den_blue") return `<span>${icons.denAI}</span>`;
  return "<span></span>";
}
function cellLabel(col, row, terrain, piece) {
  const terrainText = terrain === "river" ? "河流" : terrain.startsWith("trap") ? "陷阱" : terrain.startsWith("den") ? "獸穴" : "平地";
  const pieceText = piece ? `${piece.color === RED ? "玩家" : "電腦"}${PIECE_INFO[piece.type].name}` : "空格";
  return `${String.fromCharCode(65 + col)}${row + 1}，${terrainText}，${pieceText}`;
}
function renderPiece(piece) {
  const el = document.createElement("div");
  const display = `${piece.emoji} ${piece.chineseName}`;
  const info = PIECE_INFO[piece.type];
  el.className = `piece ${piece.color} piece--${piece.type}`;
  el.dataset.type = piece.type;
  el.dataset.rank = piece.rank;
  el.tabIndex = -1;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", `${piece.color === RED ? "玩家" : "電腦"}${info.name}，等級 ${piece.rank}`);
  const shape = document.createElement("div");
  shape.className = "piece__shape";
  const icon = document.createElement("span");
  icon.className = "piece__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = display;
  shape.appendChild(icon);
  const rank = document.createElement("span");
  rank.className = "piece__rank";
  rank.textContent = effectiveRank(piece) === 0 ? "0" : piece.rank;
  rank.setAttribute("aria-hidden", "true");
  shape.appendChild(rank);
  const label = document.createElement("span");
  label.className = "piece__label";
  label.textContent = piece.chineseName;
  shape.appendChild(label);
  el.appendChild(shape);
  const tooltip = document.createElement("span");
  tooltip.className = "piece__tooltip";
  tooltip.textContent = `${info.name}，等級 ${piece.rank}`;
  el.appendChild(tooltip);
  return el;
}
function updatePieceInfoCard(piece) {
  const card = $("#piece-info");
  if (!card) return;
  if (!piece) {
    card.innerHTML = "";
    card.classList.add("visible");
    return;
  }
  const info = PIECE_INFO[piece.type];
  card.innerHTML = `
    <span class="piece-info__icon">${piece.emoji}</span>
    <div class="piece-info__text">
      <strong>${info.name}，等級 ${piece.rank}</strong>
      <span>${info.ability}</span>
      <span>可吃：${info.canEat}</span>
    </div>`;
  card.classList.add("visible");
}
function renderStatus() {
  $("#turn-badge").innerHTML = aiBusy ? `<span class="spinner"></span>電腦思考中...` : state.currentTurn === RED ? "輪到玩家" : "輪到電腦";
  $("#ai-status").textContent = state.currentTurn === BLUE ? "正在判斷走法" : "等待玩家行動";
  $("#player-status").textContent = state.currentTurn === RED ? (selectedId ? "請選擇目的地" : "請選擇紅方棋子") : "電腦回合";
  $("#captured-red").innerHTML = state.capturedPieces.red.map(p => `<span class="captured-piece">${p.emoji}${p.chineseName}</span>`).join("");
  $("#captured-blue").innerHTML = state.capturedPieces.blue.map(p => `<span class="captured-piece">${p.emoji}${p.chineseName}</span>`).join("");
}
function handleCellClick(col, row) {
  if (state.gameStatus !== "playing" || state.currentTurn !== RED || aiBusy) return;
  AudioManager.init();
  const piece = state.cells[row][col];
  if (piece && piece.color === RED) {
    selectedId = piece.id;
    legalTargets = getLegalMovesForPiece(piece);
    updatePieceInfoCard(piece);
    AudioManager.play("select");
    announce(`已選擇${piece.chineseName}`);
    renderBoard();
    return;
  }
  const move = legalTargets.find(m => m.toCol === col && m.toRow === row);
  if (move) {
    makePlayerMove(move);
  } else {
    AudioManager.play("error");
    selectedId = null;
    legalTargets = [];
    updatePieceInfoCard(null);
    renderBoard();
  }
}
function handleCellKey(event, col, row) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleCellClick(col, row);
  }
  if (event.key === "Escape") {
    selectedId = null;
    legalTargets = [];
    updatePieceInfoCard(null);
    renderBoard();
  }
}
function makePlayerMove(move) {
  const capture = !!move.capturedPiece;
  const jump = move.isJump;
  state = applyMoveToState(state, move, true);
  selectedId = null;
  legalTargets = [];
  updatePieceInfoCard(null);
  AudioManager.play(capture ? "capture" : jump ? "jump" : "move");
  if (capture) playCaptureEffect(move.toCol, move.toRow);
  announce(`紅方移動到 ${String.fromCharCode(65 + move.toCol)}${move.toRow + 1}`);
  renderBoard();
  if (state.gameStatus === "ended") return finishGame();
  setTimeout(aiTurn, 260);
}
function aiTurn() {
  if (state.currentTurn !== BLUE || state.gameStatus !== "playing") return;
  aiBusy = true;
  renderBoard();
  setTimeout(() => {
    const move = getBestAIMove();
    if (!move) {
      state.winner = RED;
      state.winReason = "blocked";
      state.gameStatus = "ended";
      aiBusy = false;
      finishGame();
      return;
    }
    const capture = !!move.capturedPiece;
    const jump = move.isJump;
    state = applyMoveToState(state, move, true);
    aiBusy = false;
    AudioManager.play(capture ? "capture" : jump ? "jump" : "ai_move");
    if (capture) playCaptureEffect(move.toCol, move.toRow);
    announce(`電腦移動到 ${String.fromCharCode(65 + move.toCol)}${move.toRow + 1}`);
    renderBoard();
    if (state.gameStatus === "ended") finishGame();
  }, settings.aiDifficulty === "expert" ? 380 : 220);
}
function rebuildFromHistory(history) {
  state = createInitialState();
  const kept = history.slice(0, -2);
  for (const item of kept) {
    const piece = state.pieces.find(p => p.id === item.pieceId);
    const move = { piece, fromCol:item.fromCol, fromRow:item.fromRow, toCol:item.toCol, toRow:item.toRow, capturedPiece:pieceAt(state.cells, item.toCol, item.toRow), isJump:item.isJump };
    state = applyMoveToState(state, move, true);
  }
  state.undoCount++;
  selectedId = null;
  legalTargets = [];
  AudioManager.play("undo");
  renderBoard();
}
function restartGame() {
  const map = selectMap();
  state = createInitialState();
  selectedId = null;
  legalTargets = [];
  aiBusy = false;
  lastResult = null;
  forcedPieceStyle = null;
  updatePieceInfoCard(null);
  location.hash = "#game";
  applyMapTheme(map);
  showMapNameToast(map);
  renderBoard();
}
function finishGame() {
  const playerWon = state.winner === RED;
  lastResult = { winner:state.winner, reason:state.winReason };
  AudioManager.play(playerWon ? "win" : "lose");
  $("#result-title").textContent = playerWon ? "你贏了！" : "你輸了";
  const reasonText = { den:"成功攻入獸穴", annihilate:"吃掉全部敵方棋子", surrender:"投降結束", blocked:"對手無棋可走" };
  $("#result-reason").textContent = reasonText[state.winReason] || "遊戲結束";
  location.hash = "#result";
}
function announce(text) {
  $("#game-announcer").textContent = text;
}
function playCaptureEffect(col, row) {
  const canvas = $("#effects-canvas");
  const ctx = canvas.getContext("2d");
  resizeCanvas(canvas);
  const boardRect = $("#board").getBoundingClientRect();
  const cell = boardRect.width / COLS;
  const x = boardRect.left + cell * (col + .5);
  const y = boardRect.top + cell * (row + .5);
  const particles = Array.from({ length: 24 }, () => ({
    x, y,
    vx:(Math.random() - .5) * 8,
    vy:(Math.random() - .5) * 8,
    life:1
  }));
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .12;
      p.life -= .04;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (particles.some(p => p.life > 0)) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frame();
}
function resizeCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(window.innerWidth * dpr);
  const height = Math.floor(window.innerHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
let particleFrame = null;
function startParticles(mapTheme = MAP_THEMES[0]) {
  if (particleFrame) cancelAnimationFrame(particleFrame);
  const canvas = $("#bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const config = mapTheme.particleConfig || { count:44, color:"#d6c17b", speedX:0.18, speedY:0.22, size:14 };
  const animals = ["🐘","🦁","🐯","🐆","🐺","🐶","🐱","🐭"];
  const glyphs = { leaf:animals, snow:animals, sand:animals, spark:animals };
  const group = glyphs[mapTheme.particleEffect] || glyphs.leaf;
  const particles = Array.from({ length: config.count || 36 }, () => ({
    x:Math.random() * window.innerWidth,
    y:Math.random() * window.innerHeight,
    s:Math.random() * (config.size || 12) + 6,
    vx:config.speedX || 0,
    vy:config.speedY || .25,
    a:Math.random() * .35 + .12,
    glyph:group[Math.floor(Math.random() * group.length)]
  }));
  resizeCanvas(canvas);
  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y / 70) * .18;
      if (p.y > window.innerHeight + 30) p.y = -30;
      if (p.y < -30) p.y = window.innerHeight + 30;
      if (p.x > window.innerWidth + 30) p.x = -30;
      if (p.x < -30) p.x = window.innerWidth + 30;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = config.color || "#d6c17b";
      const fontFamily = window.getComputedStyle ? getComputedStyle(document.body).fontFamily : "sans-serif";
      ctx.font = `${p.s}px ${fontFamily}`;
      ctx.fillText(p.glyph, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    particleFrame = requestAnimationFrame(loop);
  }
  loop();
}
function initBackground() {
  startParticles(currentMap || MAP_THEMES[0]);
}

function showScreen(hash) {
  const target = hash || "#home";
  $$(".screen").forEach(screen => screen.classList.remove("active"));
  const id = target.replace("#", "screen-");
  const screen = document.getElementById(id) || $("#screen-home");
  screen.classList.add("active");
  if (target === "#settings") {
    settings = settingsStore.beginEdit();
    syncSettingsForm(settings);
  }
  if (target === "#game") {
    ensureBoardFit();
    renderBoard();
  }
}
function renderMapOptions(activeId = settings.fixedMapId) {
  const host = $("#map-options");
  if (!host) return;
  const randomButton = `
    <button type="button" class="map-option" data-map-id="random" aria-pressed="${activeId === "random"}">
      <strong>🎲 隨機地圖</strong>
      <span>每局開始時隨機選擇一張地圖</span>
    </button>`;
  host.innerHTML = randomButton + MAP_THEMES.map(map => `
    <button type="button" class="map-option" data-map-id="${map.id}" aria-pressed="${map.id === activeId}">
      <strong>${map.icon} ${map.name}</strong>
      <span>${map.description}</span>
    </button>`).join("");
}
function syncSettingsForm(source = settings) {
  const setValue = (id, value) => {
    const control = $("#" + id);
    if (control) control.value = value;
  };
  const setChecked = (id, value) => {
    const control = $("#" + id);
    if (control) control.checked = !!value;
  };
  setValue("aiDifficulty", source.aiDifficulty);
  setValue("sfxVolume", source.sfxVolume);
  setValue("bgmVolume", source.bgmVolume);
  setChecked("showMovableSquares", source.showMovableSquares);
  setChecked("showCoordinates", source.showCoordinates);
  setChecked("showAIThinkAnimation", source.showAIThinkAnimation);
  setValue("quick-sfx", source.sfxVolume);
  setValue("quick-bgm", source.bgmVolume);
  renderMapOptions(source.fixedMapId);
  updateUnsavedIndicator();
}
function updateDraftFromControl(control) {
  const checkboxIds = new Set(["showMovableSquares", "showCoordinates", "showAIThinkAnimation"]);
  const numericIds = new Set(["sfxVolume", "bgmVolume"]);
  let value = checkboxIds.has(control.id) ? control.checked : numericIds.has(control.id) ? Number(control.value) : control.value;
  settingsStore.updateDraft(control.id, value);
  settings = settingsStore.getDraft();
  if (control.id === "sfxVolume") AudioManager.play("click");
  if (control.id === "bgmVolume") AudioManager.playBGM(currentMap.defaultBGM);
  if (control.id.startsWith("show")) renderBoard();
  updateUnsavedIndicator();
}
function updateUnsavedIndicator() {
  const indicator = $("#settings-unsaved");
  if (indicator) indicator.classList.toggle("visible", settingsStore.hasUnsavedChanges());
}
function saveDraftSettings() {
  settingsStore.save();
  settings = settingsStore.load();
  syncSettingsForm(settings);
  AudioManager.playBGM(currentMap.defaultBGM);
  renderBoard();
}
function discardDraftSettings() {
  settings = settingsStore.discard();
  syncSettingsForm(settings);
  AudioManager.playBGM(currentMap.defaultBGM);
  renderBoard();
}
function exitSettings() {
  discardDraftSettings();
  location.hash = "#home";
}
function bindUI() {
  document.addEventListener("click", event => {
    const mapButton = event.target.closest("[data-map-id]");
    if (mapButton) {
      settingsStore.updateDraft("fixedMapId", mapButton.dataset.mapId);
      settings = settingsStore.getDraft();
      renderMapOptions(settings.fixedMapId);
      updateUnsavedIndicator();
      AudioManager.play("click");
      return;
    }
    const routeButton = event.target.closest("[data-route]");
    const actionButton = event.target.closest("[data-action]");
    if (routeButton) {
      AudioManager.play("click");
      location.hash = routeButton.dataset.route;
    }
    if (!actionButton) return;
    AudioManager.play("click");
    const action = actionButton.dataset.action;
    if (action === "start" || action === "restart") restartGame();
    if (action === "surrender") {
      state.winner = BLUE;
      state.winReason = "surrender";
      state.gameStatus = "ended";
      finishGame();
    }
    if (action === "save-settings") saveDraftSettings();
    if (action === "reset-settings") {
      settings = settingsStore.resetToDefault();
      syncSettingsForm(settings);
      AudioManager.playBGM(currentMap.defaultBGM);
      renderBoard();
    }
    if (action === "exit-settings") exitSettings();
    if (action === "undo") {
      const history = [...state.moveHistory];
      if (history.length >= 2) rebuildFromHistory(history);
      else AudioManager.play("error");
    }
  });
  ["aiDifficulty", "sfxVolume", "bgmVolume", "showMovableSquares", "showCoordinates", "showAIThinkAnimation"].forEach(id => {
    const control = $("#" + id);
    if (!control) return;
    control.addEventListener("input", () => updateDraftFromControl(control));
    control.addEventListener("change", () => updateDraftFromControl(control));
  });
  const quickSfx = $("#quick-sfx");
  const quickBgm = $("#quick-bgm");
  if (quickSfx) quickSfx.addEventListener("input", event => {
    settings.sfxVolume = Number(event.target.value);
    const sfxControl = $("#sfxVolume");
    if (sfxControl) sfxControl.value = settings.sfxVolume;
    saveSettings();
  });
  if (quickBgm) quickBgm.addEventListener("input", event => {
    settings.bgmVolume = Number(event.target.value);
    const bgmControl = $("#bgmVolume");
    if (bgmControl) bgmControl.value = settings.bgmVolume;
    saveSettings();
    AudioManager.playBGM(currentMap.defaultBGM);
  });
  document.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "u" && location.hash === "#game") {
      const history = [...state.moveHistory];
      if (history.length >= 2) rebuildFromHistory(history);
    }
    if (event.key === "Escape") {
      selectedId = null;
      legalTargets = [];
      updatePieceInfoCard(null);
      renderBoard();
    }
  });
  window.addEventListener("hashchange", () => showScreen(location.hash));
  window.addEventListener("resize", ensureBoardFit);
  document.addEventListener("pointerdown", () => AudioManager.init(), { once:true });
}

syncSettingsForm();
bindUI();
initBackground();
showScreen(location.hash || "#home");
renderBoard();
updatePieceInfoCard(null);
