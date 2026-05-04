const TILE = 64;
const COLS = 15;
const ROWS = 10;
const STORAGE_KEY = "monkey-fortress-td:settings";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const els = {
  menu: document.querySelector("#menu"),
  game: document.querySelector("#game"),
  newGameBtn: document.querySelector("#newGameBtn"),
  mapBtn: document.querySelector("#mapBtn"),
  settingsBtn: document.querySelector("#settingsBtn"),
  helpBtn: document.querySelector("#helpBtn"),
  livesText: document.querySelector("#livesText"),
  goldText: document.querySelector("#goldText"),
  scoreText: document.querySelector("#scoreText"),
  waveText: document.querySelector("#waveText"),
  pauseBtn: document.querySelector("#pauseBtn"),
  speedBtn: document.querySelector("#speedBtn"),
  muteBtn: document.querySelector("#muteBtn"),
  homeBtn: document.querySelector("#homeBtn"),
  towerList: document.querySelector("#towerList"),
  startWaveBtn: document.querySelector("#startWaveBtn"),
  selectionContent: document.querySelector("#selectionContent"),
  toast: document.querySelector("#toast"),
  modal: document.querySelector("#modal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalContent: document.querySelector("#modalContent"),
  modalCloseBtn: document.querySelector("#modalCloseBtn"),
};

const pathTiles = [
  [0, 4], [1, 4], [2, 4], [3, 4], [3, 3], [4, 3], [5, 3], [6, 3],
  [6, 4], [6, 5], [7, 5], [8, 5], [9, 5], [9, 4], [9, 3], [10, 3],
  [11, 3], [11, 4], [11, 5], [12, 5], [13, 5], [14, 5],
];

const pathPoints = pathTiles.map(([x, y]) => ({
  x: x * TILE + TILE / 2,
  y: y * TILE + TILE / 2,
}));

const pathSet = new Set(pathTiles.map(([x, y]) => `${x},${y}`));

const towerTypes = {
  dart: {
    id: "dart",
    name: "飛鏢猴",
    emoji: "🐵",
    cost: 50,
    damage: 1,
    range: 150,
    fireRate: 1.5,
    projectileSpeed: 430,
    color: "#b77935",
    kind: "dart",
    desc: "便宜穩定",
  },
  bomb: {
    id: "bomb",
    name: "炸彈猴",
    emoji: "💣",
    cost: 80,
    damage: 3,
    range: 160,
    fireRate: 0.8,
    projectileSpeed: 300,
    splash: 70,
    color: "#4b5563",
    kind: "bomb",
    desc: "範圍爆破",
  },
  ice: {
    id: "ice",
    name: "冰凍猴",
    emoji: "❄️",
    cost: 70,
    damage: 0,
    range: 135,
    fireRate: 0.55,
    projectileSpeed: 0,
    freeze: 2.4,
    color: "#60a5fa",
    kind: "ice",
    desc: "減速控場",
  },
  thorn: {
    id: "thorn",
    name: "荊棘猴",
    emoji: "🌿",
    cost: 90,
    damage: 1,
    range: 125,
    fireRate: 2.1,
    projectileSpeed: 520,
    poison: 3.5,
    color: "#15803d",
    kind: "thorn",
    desc: "快速中毒",
  },
  cannon: {
    id: "cannon",
    name: "重砲猴",
    emoji: "🧨",
    cost: 120,
    damage: 7,
    range: 190,
    fireRate: 0.5,
    projectileSpeed: 260,
    splash: 100,
    color: "#7f1d1d",
    kind: "cannon",
    desc: "慢速高傷",
  },
  eagle: {
    id: "eagle",
    name: "飛鷹猴",
    emoji: "🦅",
    cost: 110,
    damage: 2,
    range: 260,
    fireRate: 1.0,
    projectileSpeed: 620,
    color: "#92400e",
    kind: "eagle",
    desc: "超遠距離",
  },
};

const enemyTypes = {
  red: { name: "紅氣球", hp: 1, speed: 68, reward: 1, lives: 1, color: "#ef4444", emoji: "🎈" },
  blue: { name: "藍氣球", hp: 1, speed: 96, reward: 1, lives: 1, color: "#3b82f6", emoji: "🎈" },
  green: { name: "綠氣球", hp: 1, speed: 140, reward: 2, lives: 1, color: "#22c55e", emoji: "🎈" },
  yellow: { name: "黃氣球", hp: 3, speed: 78, reward: 2, lives: 2, color: "#eab308", emoji: "🎈" },
  armor: { name: "裝甲氣球", hp: 5, speed: 82, reward: 3, lives: 2, color: "#94a3b8", armor: true, emoji: "🛡️" },
  lead: { name: "鉛氣球", hp: 10, speed: 58, reward: 5, lives: 3, color: "#475569", armor: true, emoji: "🎈" },
  boss: { name: "Boss 氣球", hp: 65, speed: 45, reward: 20, lives: 5, color: "#9333ea", armor: true, emoji: "👑" },
};

const waves = [
  [{ type: "red", count: 10, interval: 0.7 }],
  [{ type: "red", count: 15, interval: 0.55 }, { type: "blue", count: 5, interval: 0.8, delay: 6 }],
  [{ type: "blue", count: 15, interval: 0.55 }, { type: "green", count: 5, interval: 0.9, delay: 7 }],
  [{ type: "green", count: 10, interval: 0.6 }, { type: "yellow", count: 5, interval: 1.1, delay: 6 }],
  [{ type: "red", count: 12, interval: 0.35 }, { type: "blue", count: 10, interval: 0.45, delay: 5 }, { type: "yellow", count: 5, interval: 0.9, delay: 10 }],
  [{ type: "yellow", count: 15, interval: 0.75 }, { type: "armor", count: 5, interval: 1.1, delay: 8 }],
  [{ type: "armor", count: 10, interval: 0.9 }, { type: "lead", count: 5, interval: 1.2, delay: 8 }],
  [{ type: "lead", count: 12, interval: 0.8 }, { type: "green", count: 12, interval: 0.38, delay: 5 }],
  [{ type: "green", count: 22, interval: 0.28 }, { type: "armor", count: 12, interval: 0.65, delay: 5 }, { type: "lead", count: 7, interval: 0.9, delay: 10 }],
  [{ type: "boss", count: 1, interval: 1 }, { type: "lead", count: 15, interval: 0.65, delay: 4 }, { type: "green", count: 20, interval: 0.28, delay: 8 }],
];

const settings = loadSettings();
let lastTime = performance.now();
let animationId = 0;
let toastTimer = 0;
let nextId = 1;

const game = {
  status: "menu",
  lives: 20,
  gold: 150,
  score: 0,
  currentWave: 0,
  waveInProgress: false,
  speed: settings.speed,
  selectedTowerType: "dart",
  selectedTower: null,
  towers: [],
  enemies: [],
  projectiles: [],
  particles: [],
  spawners: [],
  paused: false,
  kills: 0,
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicTimer = 0;
    this.muted = settings.muted;
  }

  ensure() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.setMusicVolume(settings.musicVolume);
    this.setSfxVolume(settings.sfxVolume);
    this.master.gain.value = this.muted ? 0 : 1;
  }

  setMusicVolume(value) {
    settings.musicVolume = Number(value);
    if (this.musicGain) this.musicGain.gain.value = settings.musicVolume;
    saveSettings();
  }

  setSfxVolume(value) {
    settings.sfxVolume = Number(value);
    if (this.sfxGain) this.sfxGain.gain.value = settings.sfxVolume;
    saveSettings();
  }

  toggleMute() {
    this.ensure();
    this.muted = !this.muted;
    settings.muted = this.muted;
    this.master.gain.value = this.muted ? 0 : 1;
    els.muteBtn.textContent = this.muted ? "🔇" : "🔊";
    saveSettings();
  }

  play(id) {
    this.ensure();
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.sfxGain);

    const osc = this.ctx.createOscillator();
    osc.connect(gain);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.0001, now);

    const blip = (freq, length, type = "sine", volume = 0.32) => {
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
      osc.start(now);
      osc.stop(now + length + 0.02);
    };

    if (id === "pop") blip(540, 0.08, "square", 0.24);
    else if (id === "shoot") blip(760, 0.05, "triangle", 0.18);
    else if (id === "bomb") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.42, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (id === "freeze") blip(900, 0.18, "sine", 0.18);
    else if (id === "place") blip(420, 0.14, "triangle", 0.22);
    else if (id === "upgrade") {
      [440, 660, 880].forEach((f, i) => this.tone(f, now + i * 0.07, 0.09, "triangle", 0.18));
    } else if (id === "bad") blip(120, 0.22, "sawtooth", 0.2);
    else if (id === "win") [523, 659, 784, 1046].forEach((f, i) => this.tone(f, now + i * 0.11, 0.15, "triangle", 0.2));
    else if (id === "lose") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.start(now);
      osc.stop(now + 0.95);
    }
  }

  tone(freq, start, length, type, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.start(start);
    osc.stop(start + length + 0.03);
  }

  startMusic() {
    this.ensure();
    if (this.musicTimer) return;
    const notes = [196, 247, 294, 330, 294, 247];
    let index = 0;
    this.musicTimer = window.setInterval(() => {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.type = "triangle";
      osc.frequency.value = notes[index % notes.length];
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.11, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.start(now);
      osc.stop(now + 0.45);
      index += 1;
    }, 360);
  }
}

const audio = new AudioEngine();

function loadSettings() {
  const defaults = { musicVolume: 0.6, sfxVolume: 0.8, speed: 1, muted: false };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function resetGame() {
  Object.assign(game, {
    status: "playing",
    lives: 20,
    gold: 150,
    score: 0,
    currentWave: 0,
    waveInProgress: false,
    speed: settings.speed || 1,
    selectedTowerType: "dart",
    selectedTower: null,
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    spawners: [],
    paused: false,
    kills: 0,
  });
  els.pauseBtn.textContent = "⏸";
  els.speedBtn.textContent = `${game.speed}x`;
  showGame();
  renderTowerList();
  updateHud();
  updateSelection();
  showToast("選擇猴塔後，點草地建造防線。");
}

function showGame() {
  els.menu.classList.add("hidden");
  els.game.classList.remove("hidden");
  audio.ensure();
  audio.startMusic();
}

function showMenu() {
  game.status = "menu";
  els.game.classList.add("hidden");
  els.menu.classList.remove("hidden");
}

function startWave() {
  if (game.waveInProgress || game.currentWave >= waves.length || game.status !== "playing") return;
  audio.play("upgrade");
  game.waveInProgress = true;
  game.currentWave += 1;
  game.spawners = waves[game.currentWave - 1].map((group) => ({
    ...group,
    spawned: 0,
    timer: -(group.delay || 0),
  }));
  els.startWaveBtn.disabled = true;
  showToast(`第 ${game.currentWave} 波開始`);
  updateHud();
}

function update(dt) {
  if (game.status !== "playing" || game.paused) return;
  const scaledDt = Math.min(dt * game.speed, 0.05);
  updateSpawners(scaledDt);
  updateEnemies(scaledDt);
  updateTowers(scaledDt);
  updateProjectiles(scaledDt);
  updateParticles(scaledDt);
  checkWaveComplete();
}

function updateSpawners(dt) {
  for (const spawner of game.spawners) {
    if (spawner.spawned >= spawner.count) continue;
    spawner.timer += dt;
    while (spawner.timer >= spawner.interval && spawner.spawned < spawner.count) {
      spawner.timer -= spawner.interval;
      spawnEnemy(spawner.type);
      spawner.spawned += 1;
    }
  }
}

function spawnEnemy(type) {
  const base = enemyTypes[type];
  const hpBoost = 1 + Math.max(0, game.currentWave - 1) * 0.12;
  game.enemies.push({
    id: makeId(),
    type,
    x: pathPoints[0].x,
    y: pathPoints[0].y,
    pathIndex: 0,
    hp: Math.ceil(base.hp * hpBoost),
    maxHp: Math.ceil(base.hp * hpBoost),
    speed: base.speed,
    reward: base.reward,
    lives: base.lives,
    armor: Boolean(base.armor),
    color: base.color,
    emoji: base.emoji,
    frozen: 0,
    poison: 0,
    poisonTick: 0,
  });
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  nextId += 1;
  return `entity-${Date.now()}-${nextId}`;
}

function updateEnemies(dt) {
  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = game.enemies[i];
    if (enemy.poison > 0) {
      enemy.poison -= dt;
      enemy.poisonTick += dt;
      if (enemy.poisonTick >= 0.5) {
        enemy.poisonTick = 0;
        enemy.hp -= 1;
        addFloatText(enemy.x, enemy.y - 22, "-1", "#86efac");
      }
    }
    if (enemy.frozen > 0) enemy.frozen -= dt;
    if (enemy.hp <= 0) {
      killEnemy(i, enemy);
      continue;
    }
    const target = pathPoints[enemy.pathIndex + 1];
    if (!target) {
      game.enemies.splice(i, 1);
      game.lives -= enemy.lives;
      audio.play("bad");
      addFloatText(enemy.x, enemy.y, `-${enemy.lives}`, "#fca5a5");
      if (game.lives <= 0) endGame(false);
      updateHud();
      continue;
    }
    const slowFactor = enemy.frozen > 0 ? 0.45 : 1;
    const step = enemy.speed * slowFactor * dt;
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= step) {
      enemy.x = target.x;
      enemy.y = target.y;
      enemy.pathIndex += 1;
    } else {
      enemy.x += (dx / dist) * step;
      enemy.y += (dy / dist) * step;
    }
  }
}

function killEnemy(index, enemy) {
  game.enemies.splice(index, 1);
  game.gold += enemy.reward;
  game.score += enemy.reward * 10;
  game.kills += 1;
  audio.play("pop");
  addBurst(enemy.x, enemy.y, enemy.color);
  updateHud();
}

function updateTowers(dt) {
  for (const tower of game.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;
    const target = findTarget(tower);
    if (!target) continue;
    tower.cooldown = 1 / tower.fireRate;
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    fireTower(tower, target);
  }
}

function findTarget(tower) {
  let best = null;
  let bestProgress = -1;
  for (const enemy of game.enemies) {
    const dist = distance(tower, enemy);
    if (dist > tower.range) continue;
    const progress = enemy.pathIndex * 10000 + distance(pathPoints[enemy.pathIndex] || enemy, enemy);
    if (progress > bestProgress) {
      best = enemy;
      bestProgress = progress;
    }
  }
  return best;
}

function fireTower(tower, target) {
  audio.play(tower.kind === "ice" ? "freeze" : "shoot");
  if (tower.kind === "ice") {
    for (const enemy of game.enemies) {
      if (distance(tower, enemy) <= tower.range) {
        enemy.frozen = Math.max(enemy.frozen, tower.freeze);
        if (tower.damage > 0) applyDamage(enemy, tower.damage, "ice");
      }
    }
    addRing(tower.x, tower.y, tower.range, "#93c5fd");
    return;
  }

  const shots = tower.multishot || 1;
  for (let i = 0; i < shots; i += 1) {
    const spread = (i - (shots - 1) / 2) * 0.16;
    game.projectiles.push({
      x: tower.x,
      y: tower.y,
      target,
      damage: tower.damage,
      speed: tower.projectileSpeed,
      color: tower.color,
      kind: tower.kind,
      splash: tower.splash || 0,
      poison: tower.poison || 0,
      pierce: tower.pierce ? 2 : 0,
      angleOffset: spread,
      radius: tower.kind === "bomb" || tower.kind === "cannon" ? 7 : 4,
    });
  }
}

function updateProjectiles(dt) {
  for (let i = game.projectiles.length - 1; i >= 0; i -= 1) {
    const p = game.projectiles[i];
    if (!game.enemies.includes(p.target) || p.target.hp <= 0) {
      game.projectiles.splice(i, 1);
      continue;
    }
    const angle = Math.atan2(p.target.y - p.y, p.target.x - p.x) + p.angleOffset;
    p.x += Math.cos(angle) * p.speed * dt;
    p.y += Math.sin(angle) * p.speed * dt;
    if (distance(p, p.target) <= p.radius + 13) {
      hitProjectile(p, i);
    }
  }
}

function hitProjectile(p, index) {
  if (p.splash > 0) {
    audio.play("bomb");
    addRing(p.target.x, p.target.y, p.splash, "#fbbf24");
    for (const enemy of game.enemies) {
      if (distance(enemy, p.target) <= p.splash) applyDamage(enemy, p.damage, p.kind);
    }
  } else {
    applyDamage(p.target, p.damage, p.kind);
    if (p.poison) p.target.poison = Math.max(p.target.poison, p.poison);
  }
  game.projectiles.splice(index, 1);
}

function applyDamage(enemy, amount, kind) {
  let damage = amount;
  if (enemy.armor && kind !== "bomb" && kind !== "cannon") damage = Math.ceil(damage * 0.5);
  enemy.hp -= Math.max(1, damage);
  addFloatText(enemy.x, enemy.y - 20, `-${Math.max(1, damage)}`, "#fee2e2");
}

function updateParticles(dt) {
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    const p = game.particles[i];
    p.life -= dt;
    p.x += (p.vx || 0) * dt;
    p.y += (p.vy || 0) * dt;
    p.radius += (p.grow || 0) * dt;
    if (p.life <= 0) game.particles.splice(i, 1);
  }
}

function checkWaveComplete() {
  if (!game.waveInProgress) return;
  const allSpawned = game.spawners.every((spawner) => spawner.spawned >= spawner.count);
  if (allSpawned && game.enemies.length === 0) {
    game.waveInProgress = false;
    game.gold += 25;
    game.score += 250;
    audio.play(game.currentWave >= waves.length ? "win" : "upgrade");
    updateHud();
    if (game.currentWave >= waves.length) {
      endGame(true);
    } else {
      els.startWaveBtn.disabled = false;
      showToast(`第 ${game.currentWave} 波完成，獎勵 25 金幣`);
    }
  }
}

function endGame(win) {
  game.status = win ? "win" : "gameover";
  audio.play(win ? "win" : "lose");
  const best = Number(localStorage.getItem("monkey-fortress-td:best") || "0");
  if (game.score > best) localStorage.setItem("monkey-fortress-td:best", String(game.score));
  openModal(win ? "勝利" : "城門失守", `
    <p>${win ? "你守住了香蕉堡壘。" : "氣球突破了防線。"}</p>
    <p>分數：<strong>${game.score}</strong>　擊破：<strong>${game.kills}</strong></p>
    <p>最高分：<strong>${Math.max(best, game.score)}</strong></p>
    <button id="restartFromModal" class="primary-btn full">重新開始</button>
  `);
  document.querySelector("#restartFromModal").addEventListener("click", () => {
    els.modal.close();
    resetGame();
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlacementPreview();
  drawTowers();
  drawEnemies();
  drawProjectiles();
  drawParticles();
  if (game.paused && game.status === "playing") drawOverlay("暫停");
  if (game.status === "gameover") drawOverlay("城門失守");
  if (game.status === "win") drawOverlay("勝利");
}

function drawMap() {
  const grassA = "#2f8f50";
  const grassB = "#3da85b";
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      ctx.fillStyle = (x + y) % 2 ? grassA : grassB;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#8b6d3a";
  ctx.lineWidth = 52;
  drawPathLine();
  ctx.strokeStyle = "#b99555";
  ctx.lineWidth = 38;
  drawPathLine();
  ctx.lineWidth = 1;
  drawScenery();
}

function drawPathLine() {
  ctx.beginPath();
  pathPoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function drawScenery() {
  ctx.fillStyle = "rgba(23, 91, 44, 0.55)";
  [[2, 1], [12, 2], [4, 7], [13, 8], [1, 8]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * TILE + 26, y * TILE + 30, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6b4f2a";
    ctx.fillRect(x * TILE + 22, y * TILE + 42, 8, 20);
    ctx.fillStyle = "rgba(23, 91, 44, 0.55)";
  });
  ctx.fillStyle = "rgba(45, 156, 219, 0.62)";
  ctx.beginPath();
  ctx.ellipse(800, 92, 84, 32, -0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlacementPreview() {
  if (!game.hover || game.status !== "playing") return;
  const x = game.hover.col;
  const y = game.hover.row;
  if (!inBounds(x, y)) return;
  const canPlace = canPlaceAt(x, y);
  ctx.fillStyle = canPlace ? "rgba(255,255,255,0.18)" : "rgba(229,57,53,0.3)";
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
}

function drawTowers() {
  for (const tower of game.towers) {
    if (game.selectedTower === tower) {
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 215, 0, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 215, 0, 0.58)";
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(tower.x, tower.y);
    ctx.rotate(tower.angle || 0);
    ctx.fillStyle = tower.color;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(8, -5, 18, 10);
    ctx.restore();
    drawText(tower.emoji, tower.x, tower.y + 8, 30, "center");
    drawUpgradeDots(tower);
  }
}

function drawUpgradeDots(tower) {
  const total = tower.pathA + tower.pathB;
  for (let i = 0; i < total; i += 1) {
    ctx.fillStyle = i < tower.pathA ? "#fbbf24" : "#93c5fd";
    ctx.beginPath();
    ctx.arc(tower.x - 14 + i * 9, tower.y + 30, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnemies() {
  for (const enemy of game.enemies) {
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.type === "boss" ? 22 : 15, 0, Math.PI * 2);
    ctx.fill();
    drawText(enemy.emoji, enemy.x, enemy.y + 7, enemy.type === "boss" ? 23 : 18, "center");
    if (enemy.frozen > 0) {
      ctx.strokeStyle = "#bfdbfe";
      ctx.lineWidth = 3;
      ctx.strokeRect(enemy.x - 15, enemy.y - 15, 30, 30);
      ctx.lineWidth = 1;
    }
    if (enemy.poison > 0) {
      ctx.fillStyle = "rgba(134, 239, 172, 0.45)";
      ctx.beginPath();
      ctx.arc(enemy.x + 10, enemy.y - 9, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    const w = enemy.type === "boss" ? 48 : 34;
    ctx.fillStyle = "rgba(0,0,0,0.48)";
    ctx.fillRect(enemy.x - w / 2, enemy.y - 28, w, 5);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(enemy.x - w / 2, enemy.y - 28, w * Math.max(0, enemy.hp / enemy.maxHp), 5);
  }
}

function drawProjectiles() {
  for (const p of game.projectiles) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles() {
  for (const p of game.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    if (p.text) {
      drawText(p.text, p.x, p.y, 16, "center", p.color);
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    ctx.globalAlpha = 1;
  }
}

function drawOverlay(text) {
  ctx.fillStyle = "rgba(2,6,23,0.58)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawText(text, canvas.width / 2, canvas.height / 2, 52, "center", "#fff");
}

function drawText(text, x, y, size, align = "left", color = "#fff") {
  ctx.font = `900 ${size}px "Noto Sans TC", Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function addBurst(x, y, color) {
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * 60,
      vy: Math.sin(angle) * 60,
      radius: 4,
      grow: 4,
      life: 0.28,
      maxLife: 0.28,
      color,
    });
  }
}

function addRing(x, y, radius, color) {
  game.particles.push({ x, y, radius: 8, grow: radius * 2.6, life: 0.28, maxLife: 0.28, color });
}

function addFloatText(x, y, text, color) {
  game.particles.push({ x, y, vy: -32, text, life: 0.65, maxLife: 0.65, color });
}

function renderTowerList() {
  els.towerList.innerHTML = "";
  Object.values(towerTypes).forEach((tower) => {
    const btn = document.createElement("button");
    btn.className = `tower-card${game.selectedTowerType === tower.id ? " selected" : ""}`;
    btn.innerHTML = `<strong>${tower.emoji} ${tower.name}</strong><span>$${tower.cost} · ${tower.desc}</span><span>傷害 ${tower.damage} / 範圍 ${tower.range}</span>`;
    btn.addEventListener("click", () => {
      audio.play("place");
      game.selectedTowerType = tower.id;
      game.selectedTower = null;
      renderTowerList();
      updateSelection();
    });
    els.towerList.appendChild(btn);
  });
}

function updateSelection() {
  const tower = game.selectedTower;
  if (!tower) {
    const selected = towerTypes[game.selectedTowerType];
    els.selectionContent.className = "selection-empty";
    els.selectionContent.innerHTML = `目前選擇：<strong>${selected.emoji} ${selected.name}</strong><br>花費 $${selected.cost}。點選非道路草地建造。`;
    return;
  }
  els.selectionContent.className = "selection-content";
  const sellValue = Math.floor(tower.spent * 0.5);
  els.selectionContent.innerHTML = `
    <strong>${tower.emoji} ${tower.name} Lv.${1 + tower.pathA + tower.pathB}</strong><br>
    傷害 ${tower.damage}　範圍 ${Math.round(tower.range)}<br>
    射速 ${tower.fireRate.toFixed(1)}/秒<br>
    A 路線：${tower.pathA}/3　B 路線：${tower.pathB}/3
    <div class="upgrade-row">
      <button id="upgradeA">升級 A　$${upgradeCost(tower, "A")}</button>
      <button id="upgradeB">升級 B　$${upgradeCost(tower, "B")}</button>
    </div>
    <button id="sellTower" class="sell-btn">出售　$${sellValue}</button>
  `;
  document.querySelector("#upgradeA").disabled = !canUpgrade(tower, "A");
  document.querySelector("#upgradeB").disabled = !canUpgrade(tower, "B");
  document.querySelector("#upgradeA").addEventListener("click", () => upgradeTower(tower, "A"));
  document.querySelector("#upgradeB").addEventListener("click", () => upgradeTower(tower, "B"));
  document.querySelector("#sellTower").addEventListener("click", () => sellTower(tower));
}

function upgradeCost(tower, path) {
  const level = path === "A" ? tower.pathA : tower.pathB;
  return path === "A" ? [100, 150, 300][level] || 0 : [80, 120, 250][level] || 0;
}

function canUpgrade(tower, path) {
  const own = path === "A" ? tower.pathA : tower.pathB;
  const other = path === "A" ? tower.pathB : tower.pathA;
  if (own >= 3 || other >= 3 && own >= 2) return false;
  return game.gold >= upgradeCost(tower, path);
}

function upgradeTower(tower, path) {
  if (!canUpgrade(tower, path)) {
    audio.play("bad");
    showToast("金幣不足或升級路線已達限制");
    return;
  }
  const cost = upgradeCost(tower, path);
  game.gold -= cost;
  tower.spent += cost;
  if (path === "A") {
    tower.pathA += 1;
    tower.damage += tower.kind === "ice" ? 1 : tower.pathA === 1 ? 1 : 2;
    tower.range += tower.pathA === 3 ? 35 : 12;
    if (tower.pathA >= 2) tower.pierce = true;
    if (tower.pathA === 3 && tower.splash) tower.splash += 45;
  } else {
    tower.pathB += 1;
    tower.fireRate += tower.pathB === 3 ? 0.8 : 0.45;
    if (tower.pathB === 2 && tower.freeze) tower.freeze += 1.2;
    if (tower.pathB === 2 && tower.poison) tower.poison += 1.5;
    if (tower.pathB === 3) tower.multishot = 3;
  }
  audio.play("upgrade");
  updateHud();
  updateSelection();
}

function sellTower(tower) {
  const index = game.towers.indexOf(tower);
  if (index < 0) return;
  game.gold += Math.floor(tower.spent * 0.5);
  game.towers.splice(index, 1);
  game.selectedTower = null;
  audio.play("place");
  updateHud();
  updateSelection();
}

function placeTower(col, row) {
  const type = towerTypes[game.selectedTowerType];
  if (!canPlaceAt(col, row)) {
    const existing = game.towers.find((tower) => tower.col === col && tower.row === row);
    if (existing) {
      game.selectedTower = existing;
      renderTowerList();
      updateSelection();
      return;
    }
    audio.play("bad");
    showToast("這裡不能建造。");
    return;
  }
  if (game.gold < type.cost) {
    audio.play("bad");
    showToast("金幣不足。");
    return;
  }
  game.gold -= type.cost;
  const tower = {
    ...cloneData(type),
    x: col * TILE + TILE / 2,
    y: row * TILE + TILE / 2,
    col,
    row,
    cooldown: 0,
    pathA: 0,
    pathB: 0,
    spent: type.cost,
    angle: 0,
  };
  game.towers.push(tower);
  game.selectedTower = tower;
  audio.play("place");
  updateHud();
  updateSelection();
}

function cloneData(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function canPlaceAt(col, row) {
  if (!inBounds(col, row)) return false;
  if (pathSet.has(`${col},${row}`)) return false;
  return !game.towers.some((tower) => tower.col === col && tower.row === row);
}

function updateHud() {
  els.livesText.textContent = Math.max(0, game.lives);
  els.goldText.textContent = game.gold;
  els.scoreText.textContent = game.score;
  els.waveText.textContent = `${Math.max(1, game.currentWave || 1)}/${waves.length}`;
  els.startWaveBtn.disabled = game.waveInProgress || game.status !== "playing";
  renderTowerList();
}

function canvasToTile(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  return { col: Math.floor(x / TILE), row: Math.floor(y / TILE), x, y };
}

function inBounds(col, row) {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.add("hidden"), 2200);
}

function openModal(title, html) {
  els.modalTitle.textContent = title;
  els.modalContent.innerHTML = html;
  els.modal.showModal();
}

function openSettings() {
  openModal("遊戲設定", `
    <div class="settings-grid">
      <label>背景音樂 ${Math.round(settings.musicVolume * 100)}%
        <input id="musicVolume" type="range" min="0" max="1" step="0.05" value="${settings.musicVolume}">
      </label>
      <label>音效音量 ${Math.round(settings.sfxVolume * 100)}%
        <input id="sfxVolume" type="range" min="0" max="1" step="0.05" value="${settings.sfxVolume}">
      </label>
      <label>預設速度
        <input id="defaultSpeed" type="range" min="1" max="2" step="1" value="${settings.speed}">
      </label>
    </div>
  `);
  document.querySelector("#musicVolume").addEventListener("input", (event) => {
    audio.ensure();
    audio.setMusicVolume(event.target.value);
    event.target.parentElement.firstChild.textContent = `背景音樂 ${Math.round(event.target.value * 100)}%`;
  });
  document.querySelector("#sfxVolume").addEventListener("input", (event) => {
    audio.ensure();
    audio.setSfxVolume(event.target.value);
    event.target.parentElement.firstChild.textContent = `音效音量 ${Math.round(event.target.value * 100)}%`;
  });
  document.querySelector("#defaultSpeed").addEventListener("input", (event) => {
    settings.speed = Number(event.target.value);
    game.speed = settings.speed;
    els.speedBtn.textContent = `${game.speed}x`;
    saveSettings();
  });
}

function openHelp() {
  openModal("玩法說明", `
    <p>選擇右側猴子塔，再點選草地建造。道路與已有猴塔的位置不能建造。</p>
    <p>點選已建造猴塔可升級 A/B 路線或出售。阻止氣球走到終點，通過全部 10 波即可勝利。</p>
    <p>炸彈與重砲能有效處理裝甲氣球，冰凍猴負責控場，荊棘猴可讓敵人持續受傷。</p>
  `);
}

function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  update(dt);
  render();
  animationId = requestAnimationFrame(loop);
}

els.newGameBtn.addEventListener("click", resetGame);
els.mapBtn.addEventListener("click", () => openModal("選擇地圖", "<p>目前提供第一張森林堡壘地圖。後續可依規格新增 map02。</p>"));
els.settingsBtn.addEventListener("click", openSettings);
els.helpBtn.addEventListener("click", openHelp);
els.modalCloseBtn.addEventListener("click", () => els.modal.close());
els.startWaveBtn.addEventListener("click", startWave);
els.pauseBtn.addEventListener("click", () => {
  if (game.status !== "playing") return;
  game.paused = !game.paused;
  els.pauseBtn.textContent = game.paused ? "▶" : "⏸";
});
els.speedBtn.addEventListener("click", () => {
  game.speed = game.speed === 1 ? 2 : 1;
  settings.speed = game.speed;
  saveSettings();
  els.speedBtn.textContent = `${game.speed}x`;
});
els.muteBtn.addEventListener("click", () => audio.toggleMute());
els.homeBtn.addEventListener("click", showMenu);

canvas.addEventListener("pointermove", (event) => {
  game.hover = canvasToTile(event);
});
canvas.addEventListener("pointerleave", () => {
  game.hover = null;
});
canvas.addEventListener("pointerdown", (event) => {
  if (game.status !== "playing") return;
  audio.ensure();
  const tile = canvasToTile(event);
  placeTower(tile.col, tile.row);
});

renderTowerList();
updateHud();
els.muteBtn.textContent = settings.muted ? "🔇" : "🔊";
animationId = requestAnimationFrame(loop);
