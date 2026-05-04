const TILE = 64;
const STORAGE_KEY = "monkey-fortress-td:settings";
const PROGRESS_KEY = "monkey-fortress-td:progress";

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
  speedControls: document.querySelector("#speedControls"),
  muteBtn: document.querySelector("#muteBtn"),
  homeBtn: document.querySelector("#homeBtn"),
  towerList: document.querySelector("#towerList"),
  startWaveBtn: document.querySelector("#startWaveBtn"),
  autoWaveBtn: document.querySelector("#autoWaveBtn"),
  selectionContent: document.querySelector("#selectionContent"),
  toast: document.querySelector("#toast"),
  modal: document.querySelector("#modal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalContent: document.querySelector("#modalContent"),
  modalCloseBtn: document.querySelector("#modalCloseBtn"),
};

const TILE_CHARS = new Set(["#", ">", "<", "^", "v", "S", "E", "2"]);
const BLOCKED_CHARS = new Set(["X", "W", "R", "T", "B", "L", "C", "A", "G", "F", "H", "P", "Q", "N", "O", "M"]);
const UPGRADE_COSTS = {
  A: [120, 200, 450],
  B: [100, 180, 400],
  apex: 550,
};

const towerTypes = {
  dart: {
    id: "dart",
    name: "飛鏢猴",
    emoji: "🐵",
    cost: 35,
    damage: 1,
    range: 150,
    fireRate: 1.5,
    projectileSpeed: 430,
    color: "#b77935",
    kind: "dart",
    attackType: "dart",
    desc: "便宜穩定",
  },
  bomb: {
    id: "bomb",
    name: "炸彈猴",
    emoji: "💣",
    cost: 90,
    damage: 3,
    range: 160,
    fireRate: 0.8,
    projectileSpeed: 300,
    splash: 70,
    color: "#4b5563",
    kind: "bomb",
    attackType: "explosion",
    desc: "範圍爆破",
  },
  ice: {
    id: "ice",
    name: "冰凍猴",
    emoji: "❄️",
    cost: 70,
    damage: 0,
    range: 128,
    fireRate: 0.55,
    projectileSpeed: 0,
    freeze: 2.4,
    color: "#60a5fa",
    kind: "ice",
    attackType: "freeze",
    desc: "減速控場",
  },
  thorn: {
    id: "thorn",
    name: "荊棘猴",
    emoji: "🌿",
    cost: 60,
    damage: 2,
    range: 224,
    fireRate: 2.0,
    projectileSpeed: 520,
    poison: 3.5,
    color: "#15803d",
    kind: "thorn",
    attackType: "poison",
    desc: "長程毒傷",
  },
  wizard: {
    id: "wizard",
    name: "巫師猴",
    emoji: "🧙",
    cost: 100,
    damage: 8,
    range: 192,
    fireRate: 0.5,
    projectileSpeed: 260,
    splash: 45,
    color: "#7c3aed",
    kind: "wizard",
    attackType: "flame",
    desc: "v1.2 火焰爆發",
  },
  eagle: {
    id: "eagle",
    name: "狙擊猴",
    emoji: "🦅",
    cost: 200,
    damage: 3,
    range: 260,
    fireRate: 1.0,
    projectileSpeed: 620,
    color: "#92400e",
    kind: "eagle",
    attackType: "dart",
    desc: "超遠距單體",
  },
  bell: {
    id: "bell",
    name: "鐘猴",
    emoji: "🔔",
    cost: 80,
    damage: 2,
    range: 224,
    fireRate: 2.5,
    projectileSpeed: 0,
    freeze: 0.5,
    color: "#d97706",
    kind: "bell",
    attackType: "sonic",
    desc: "音波破甲",
  },
  magnet: {
    id: "magnet",
    name: "磁鐵猴",
    emoji: "🧲",
    cost: 110,
    damage: 0,
    range: 160,
    fireRate: 0.7,
    projectileSpeed: 0,
    freeze: 1.0,
    magnetize: 4,
    color: "#64748b",
    kind: "magnet",
    attackType: "magnet",
    desc: "聚怪增傷",
  },
  thunder: {
    id: "thunder",
    name: "雷電猴",
    emoji: "⚡",
    cost: 130,
    damage: 3,
    range: 192,
    fireRate: 1.0,
    projectileSpeed: 0,
    chain: 3,
    color: "#facc15",
    kind: "thunder",
    attackType: "thunder",
    desc: "連鎖電擊",
  },
  mushroom: {
    id: "mushroom",
    name: "蘑菇猴",
    emoji: "🍄",
    cost: 90,
    damage: 1,
    range: 192,
    fireRate: 2.0,
    projectileSpeed: 0,
    poison: 4,
    color: "#dc2626",
    kind: "mushroom",
    attackType: "poison",
    desc: "毒霧持續傷害",
  },
  mirror: {
    id: "mirror",
    name: "鏡像猴",
    emoji: "🪞",
    cost: 150,
    damage: 2,
    range: 256,
    fireRate: 0.8,
    projectileSpeed: 520,
    color: "#38bdf8",
    kind: "mirror",
    attackType: "mirror",
    desc: "複製彈道",
  },
  vortex: {
    id: "vortex",
    name: "漩渦猴",
    emoji: "🌀",
    cost: 160,
    damage: 2,
    range: 224,
    fireRate: 1.5,
    projectileSpeed: 0,
    freeze: 1.5,
    color: "#06b6d4",
    kind: "vortex",
    attackType: "vortex",
    desc: "範圍牽制",
  },
  oracle: {
    id: "oracle",
    name: "先知猴",
    emoji: "🔮",
    cost: 200,
    damage: 5,
    range: 256,
    fireRate: 0.8,
    projectileSpeed: 500,
    curse: 5,
    color: "#a855f7",
    kind: "oracle",
    attackType: "oracle",
    desc: "詛咒弱化",
  },
  horn: {
    id: "horn",
    name: "號角猴",
    emoji: "📯",
    cost: 180,
    damage: 0,
    range: 320,
    fireRate: 0.35,
    projectileSpeed: 0,
    support: true,
    color: "#f59e0b",
    kind: "horn",
    attackType: "support",
    desc: "全隊增益",
  },
};

const enemyTypes = {
  red: { name: "紅氣球", hp: 1, speed: 64, reward: 1, lives: 1, color: "#ef4444", emoji: "🎈" },
  blue: { name: "藍氣球", hp: 1, speed: 96, reward: 1, lives: 1, color: "#3b82f6", emoji: "🎈" },
  green: { name: "綠氣球", hp: 1, speed: 160, reward: 2, lives: 1, color: "#22c55e", emoji: "🎈" },
  yellow: { name: "黃氣球", hp: 3, speed: 64, reward: 2, lives: 2, color: "#eab308", emoji: "🎈" },
  armor: { name: "裝甲氣球", hp: 5, speed: 77, reward: 3, lives: 2, color: "#94a3b8", armor: true, armorValue: 0.4, emoji: "🛡️" },
  lead: { name: "鉛氣球", hp: 10, speed: 51, reward: 5, lives: 3, color: "#475569", armor: true, armorValue: 0.5, emoji: "🎈" },
  boss: { name: "Boss 氣球", hp: 50, speed: 38, reward: 20, lives: 5, color: "#9333ea", armor: true, armorValue: 0.35, emoji: "👑" },
  steel: { name: "鋼殼氣球", hp: 8, speed: 58, reward: 4, lives: 2, armor: true, armorValue: 0.45, weaknesses: { sonic: 2 }, color: "#71717a", emoji: "🛡️" },
  emp: { name: "電磁氣球", hp: 6, speed: 77, reward: 4, lives: 2, immunities: ["thunder"], weaknesses: { explosion: 1.5 }, color: "#38bdf8", emoji: "⚙️" },
  insulated: { name: "絕緣氣球", hp: 10, speed: 45, reward: 5, lives: 3, armor: true, armorValue: 0.3, immunities: ["thunder"], weaknesses: { freeze: 1.8 }, color: "#f97316", emoji: "🧤" },
  purified: { name: "淨化氣球", hp: 5, speed: 83, reward: 3, lives: 1, immunities: ["poison"], weaknesses: { freeze: 1.5 }, color: "#f8fafc", emoji: "✨" },
  gale: { name: "疾風氣球", hp: 2, speed: 288, reward: 2, lives: 1, weaknesses: { dart: 1.5, vortex: 2 }, color: "#a7f3d0", emoji: "💨" },
  tortoise: { name: "龜甲氣球", hp: 60, speed: 22, reward: 8, lives: 5, armor: true, armorValue: 0.65, weaknesses: { poison: 2, vortex: 1.5 }, color: "#166534", emoji: "🐢" },
  chrono: { name: "時序氣球", hp: 12, speed: 96, reward: 10, lives: 3, specialBehavior: "timeJump", color: "#6366f1", emoji: "⏱️" },
  regen: { name: "再生氣球", hp: 15, speed: 64, reward: 6, lives: 2, specialBehavior: "regen", color: "#ec4899", emoji: "💗" },
  cursed: { name: "詛咒氣球", hp: 7, speed: 70, reward: 5, lives: 2, weaknesses: { oracle: 2 }, color: "#581c87", emoji: "☠️" },
  mirror: { name: "鏡像氣球", hp: 4, speed: 77, reward: 3, lives: 1, specialBehavior: "split", color: "#67e8f9", emoji: "🪞" },
  suicide: { name: "自爆氣球", hp: 3, speed: 115, reward: 1, lives: 0, specialBehavior: "explode", color: "#f43f5e", emoji: "💥" },
  shadow: { name: "暗影氣球", hp: 8, speed: 102, reward: 7, lives: 3, immunities: ["dart"], weaknesses: { oracle: 1.5 }, color: "#020617", emoji: "🌑" },
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

const MAPS = [
  {
    id: "map01",
    name: "森林小徑",
    nameEn: "Jungle Path",
    theme: "jungle",
    difficulty: 1,
    gridWidth: 16,
    gridHeight: 12,
    startGold: 150,
    startLives: 20,
    waveCount: 10,
    paths: [
      { id: "main", waypoints: [{ x: 0, y: 3 }, { x: 14, y: 3 }, { x: 14, y: 6 }, { x: 0, y: 6 }, { x: 0, y: 11 }, { x: 15, y: 11 }] },
    ],
    grid: [
      "................",
      ".T.....T.....T..",
      "................",
      "S>>>>>>>>>>>>>v.",
      "........T.....v.",
      "..T...........v.",
      "v<<<<<<<<<<<<<<.",
      "v...............",
      "v...............",
      "v.T.......T.....",
      "v...............",
      ">>>>>>>>>>>>>>>E",
    ],
    background: { bgColor: "#2D5A27", pathColor: "#8B6914", pathEdgeColor: "#6B4F10", emptyColor: "#3A7A32", obstacleColor: "#1A3D18", accentColor: "#A8D5A2", uiTint: "#4CAF50" },
    hint: "單一路徑很長，適合在轉角集中火力。",
  },
  {
    id: "map02",
    name: "沙漠雙蛇",
    nameEn: "Desert Serpent",
    theme: "desert",
    difficulty: 2,
    gridWidth: 18,
    gridHeight: 13,
    startGold: 130,
    startLives: 18,
    waveCount: 12,
    paths: [
      { id: "upper", waypoints: [{ x: 0, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 17, y: 3 }] },
      { id: "lower", waypoints: [{ x: 0, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 12, y: 4 }, { x: 12, y: 3 }, { x: 17, y: 3 }] },
    ],
    grid: [
      "..................",
      ".R....R.....R...R.",
      "..>>>>>>>>>>v.....",
      "S.2.........2....E",
      "..>>>>>>>>>>^.....",
      ".R.....R......R...",
      "..................",
      "....R.......R.....",
      "..................",
      ".R..............R.",
      "..................",
      ".....R.....R......",
      "..................",
    ],
    background: { bgColor: "#C2A060", pathColor: "#A0784A", pathEdgeColor: "#7A5A30", emptyColor: "#D4B878", obstacleColor: "#8B7355", accentColor: "#E8D5A0", uiTint: "#F5A623" },
    hint: "敵人會在上下兩條蛇形路徑間分流，遠距離塔更有價值。",
  },
  {
    id: "map03",
    name: "冰霜堡壘",
    nameEn: "Frozen Fortress",
    theme: "snow",
    difficulty: 3,
    gridWidth: 18,
    gridHeight: 14,
    startGold: 120,
    startLives: 15,
    waveCount: 14,
    paths: [
      { id: "spiral", waypoints: [{ x: 0, y: 0 }, { x: 17, y: 0 }, { x: 17, y: 13 }, { x: 0, y: 13 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 11 }, { x: 4, y: 11 }, { x: 4, y: 2 }, { x: 16, y: 2 }, { x: 16, y: 9 }, { x: 6, y: 9 }, { x: 6, y: 6 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 8, y: 7 }] },
    ],
    grid: [
      "S>>>>>>>>>>>>>>>>v",
      "^................v",
      "^.>>>>>>>>>>>>>>v.",
      "^.^.............v.",
      "^.^.X....X......v.",
      "^.^.............v.",
      "^.^...>>>>>>v...v.",
      "^.^...^..E<<<...v.",
      "^.^...^.........v.",
      "^.^...<<<<<<<<<<v.",
      "^.^..............v",
      "^.<<<.............",
      "^................<",
      "<<<<<<<<<<<<<<<<<<",
    ],
    background: { bgColor: "#B0C8E0", pathColor: "#8EAABB", pathEdgeColor: "#6A8FA8", emptyColor: "#D8EAF5", obstacleColor: "#4A6B8A", accentColor: "#FFFFFF", uiTint: "#64B5F6" },
    hint: "螺旋路徑很長，但可建造區被壓縮，升級既有猴塔比鋪滿更重要。",
  },
  {
    id: "map04",
    name: "熔岩迷宮",
    nameEn: "Lava Maze",
    theme: "lava",
    difficulty: 4,
    gridWidth: 20,
    gridHeight: 14,
    startGold: 110,
    startLives: 12,
    waveCount: 16,
    paths: [
      { id: "top", waypoints: [{ x: 0, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 7, y: 3 }, { x: 7, y: 1 }, { x: 13, y: 1 }, { x: 13, y: 3 }, { x: 17, y: 3 }, { x: 17, y: 5 }, { x: 19, y: 5 }] },
      { id: "middle", waypoints: [{ x: 0, y: 5 }, { x: 19, y: 5 }] },
      { id: "bottom", waypoints: [{ x: 0, y: 9 }, { x: 3, y: 9 }, { x: 3, y: 7 }, { x: 7, y: 7 }, { x: 7, y: 9 }, { x: 13, y: 9 }, { x: 13, y: 7 }, { x: 17, y: 7 }, { x: 17, y: 5 }, { x: 19, y: 5 }] },
    ],
    grid: [
      "....................",
      "S>>v...^>>>>>v......",
      "..L...L....L..v.L...",
      "..L>>>>^..L..>>>>v..",
      "..L.......L......v..",
      "S>>>>>>>>>>>>>>>>>2E",
      "..L.......L......^..",
      "..L>>>>v..L..>>>>^..",
      "..L...v.L...........",
      "S>>v...>>>>>>^......",
      "..L.......L.........",
      "....................",
      "....................",
      "....................",
    ],
    background: { bgColor: "#3A1A0A", pathColor: "#5A3020", pathEdgeColor: "#3A1A08", emptyColor: "#4A2810", obstacleColor: "#FF6B2B", accentColor: "#FF4500", uiTint: "#FF5722" },
    hint: "三路同時進攻，熔岩區不能建造。優先守住匯流點。",
  },
  {
    id: "map05",
    name: "天空群島",
    nameEn: "Sky Islands",
    theme: "sky",
    difficulty: 5,
    gridWidth: 20,
    gridHeight: 15,
    startGold: 100,
    startLives: 10,
    waveCount: 20,
    paths: [
      { id: "islands", waypoints: [{ x: 0, y: 0 }, { x: 7, y: 0 }, { x: 7, y: 3 }, { x: 0, y: 3 }, { x: 0, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 15, y: 6 }, { x: 15, y: 9 }, { x: 19, y: 9 }, { x: 19, y: 13 }, { x: 3, y: 13 }, { x: 19, y: 13 }, { x: 19, y: 14 }] },
    ],
    grid: [
      "S>>>>>>vWWWWWWWWWWWW",
      ".......vWWW.......WW",
      ".......vWWW.......WW",
      "<<<<<<<<WWW.......WW",
      "^......WWWWWWWWWWWWW",
      ">>>>B..WWWWB......WW",
      "WWWW>>>>>>>>>>>vWWWW",
      "WWWWWWWWWWWW...vWWWW",
      "WWWWWWWWWWWW...vWWWW",
      "WWWWWWWWWWWW...<<<<<",
      "WWWWWWWWWWWWWWW....v",
      "...vWWWWWWWWWWW....v",
      "...vWWWWWWWWWWW....v",
      "...<<<<<<<<<<<<<<<<<",
      "...................E",
    ],
    background: { bgColor: "#87CEEB", pathColor: "#C8A96E", pathEdgeColor: "#A0845A", emptyColor: "#98D4A3", obstacleColor: "#FFFFFF", accentColor: "#FFE08A", uiTint: "#29B6F6" },
    hint: "可建造島嶼有限，橋樑附近的範圍攻擊是關鍵。",
  },
  {
    id: "map06",
    name: "沉沒遺跡",
    nameEn: "Sunken Ruins",
    theme: "ocean",
    difficulty: 6,
    gridWidth: 18,
    gridHeight: 14,
    startGold: 130,
    startLives: 15,
    waveCount: 15,
    paths: [
      { id: "leftUpper", waypoints: [{ x: 0, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 6 }, { x: 8, y: 6 }] },
      { id: "leftLower", waypoints: [{ x: 0, y: 10 }, { x: 4, y: 10 }, { x: 4, y: 6 }, { x: 8, y: 6 }] },
      { id: "rightUpper", waypoints: [{ x: 17, y: 3 }, { x: 13, y: 3 }, { x: 13, y: 6 }, { x: 8, y: 6 }] },
      { id: "rightLower", waypoints: [{ x: 17, y: 10 }, { x: 13, y: 10 }, { x: 13, y: 6 }, { x: 8, y: 6 }] },
    ],
    grid: [
      "..................",
      ".C....C...C....C..",
      "..................",
      "S>>>v........v<<<E",
      "....v.C....C.v....",
      ".C..v........v.C..",
      "....>>>>E<<<<<....",
      "....^........^....",
      ".C..^........^.C..",
      "....^.C....C.^....",
      "S>>>^........^<<<E",
      "..................",
      ".C.....C.C....C...",
      "..................",
    ],
    background: { bgColor: "#0A1628", pathColor: "#2A4A6A", pathEdgeColor: "#1A3050", emptyColor: "#0E2040", obstacleColor: "#FF6B9D", accentColor: "#00BCD4", uiTint: "#0288D1" },
    hint: "四路潮汐同時匯入中央，先守住中線交會點。",
  },
  {
    id: "map07",
    name: "古代迷宮",
    nameEn: "Ancient Labyrinth",
    theme: "ancient",
    difficulty: 7,
    gridWidth: 20,
    gridHeight: 16,
    startGold: 120,
    startLives: 12,
    waveCount: 18,
    paths: [
      { id: "h1", waypoints: [{ x: 0, y: 2 }, { x: 19, y: 2 }] },
      { id: "h2", waypoints: [{ x: 0, y: 7 }, { x: 19, y: 7 }] },
      { id: "h3", waypoints: [{ x: 0, y: 11 }, { x: 19, y: 11 }] },
      { id: "v1", waypoints: [{ x: 8, y: 0 }, { x: 8, y: 15 }] },
    ],
    grid: [
      "........v...........",
      ".A...A...A...A...A..",
      "S>>>>>>>+>>>>>>>>>>E",
      "........X...........",
      ".A...A..X...A...A...",
      "........v...........",
      "........v...........",
      "S.......+..........E",
      "........v...........",
      ".A...A..v...A...A...",
      "........X...........",
      "S>>>>>>>+>>>>>>>>>>E",
      "........X...........",
      ".A...A..v...A...A...",
      "........v...........",
      "........E...........",
    ],
    background: { bgColor: "#2C1A0E", pathColor: "#8B7355", pathEdgeColor: "#6B5335", emptyColor: "#4A3520", obstacleColor: "#C8A878", accentColor: "#FFD700", uiTint: "#FF8F00" },
    hint: "水平與垂直通道交錯，交會點周邊是主要火力區。",
  },
  {
    id: "map08",
    name: "機械堡壘",
    nameEn: "Mech Fortress",
    theme: "mech",
    difficulty: 8,
    gridWidth: 20,
    gridHeight: 15,
    startGold: 115,
    startLives: 12,
    waveCount: 20,
    paths: [
      { id: "main", waypoints: [{ x: 0, y: 7 }, { x: 19, y: 7 }] },
      { id: "auxA", waypoints: [{ x: 0, y: 1 }, { x: 7, y: 1 }, { x: 7, y: 5 }, { x: 11, y: 5 }, { x: 11, y: 1 }, { x: 19, y: 1 }] },
      { id: "auxB", waypoints: [{ x: 0, y: 12 }, { x: 7, y: 12 }, { x: 7, y: 9 }, { x: 12, y: 9 }, { x: 12, y: 12 }, { x: 19, y: 12 }] },
    ],
    grid: [
      "....................",
      "S>>>>>>v...^<<<<<<<E",
      ".......v...^........",
      ".G...G.v...^.G...G..",
      ".......v...^........",
      ".......>>>>>........",
      ".G...G.......G...G..",
      "S>>>>>>>>>>>>>>>>>>E",
      ".G...G.......G...G..",
      ".......v>>>>^.......",
      ".......v....^.......",
      ".G...G.v....^.G...G.",
      "S>>>>>>v....^<<<<<<E",
      "....................",
      ".G...G......G...G...",
    ],
    background: { bgColor: "#1A1A1A", pathColor: "#4A4A5A", pathEdgeColor: "#2A2A3A", emptyColor: "#2A2A2A", obstacleColor: "#FF8C00", accentColor: "#00E5FF", uiTint: "#FF6F00" },
    hint: "主線穩定推進，兩條輔助路線會分散防線壓力。",
  },
  {
    id: "map09",
    name: "黑暗森林",
    nameEn: "Dark Forest",
    theme: "dark",
    difficulty: 9,
    gridWidth: 22,
    gridHeight: 16,
    startGold: 110,
    startLives: 10,
    waveCount: 22,
    paths: [
      { id: "upper", waypoints: [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 2 }, { x: 8, y: 2 }, { x: 8, y: 4 }, { x: 14, y: 4 }, { x: 14, y: 6 }, { x: 18, y: 6 }, { x: 18, y: 8 }, { x: 20, y: 8 }] },
      { id: "middle", waypoints: [{ x: 0, y: 8 }, { x: 2, y: 8 }, { x: 2, y: 10 }, { x: 7, y: 10 }, { x: 7, y: 12 }, { x: 13, y: 12 }, { x: 13, y: 14 }, { x: 20, y: 14 }] },
      { id: "lower", waypoints: [{ x: 0, y: 14 }, { x: 20, y: 14 }] },
    ],
    grid: [
      "S>>vFFFFFFFFFFFFFFFFF.",
      "...vFFFFFFFFFFFFFFFFF.",
      "...>>>>>>vFFFFFFFFFFF.",
      "........vFFFFFFFFFFFF.",
      "FFFFFFFF>>>>>>vFFFFFF.",
      "FFFFFFFF......vFFFFFF.",
      "FFFFFFFF......>>>>vFF.",
      "FFFFFFFF..........vFF.",
      "S>vFFFFFFFFFFFFFFF>>E.",
      "..vFFFFFFFFFFFFFF.....",
      "..>>>>>vFFFFFFFFF.....",
      ".......vFFFFFFFFF.....",
      "FFFFFFF>>>>>>vFFF.....",
      "FFFFFFF......vFFF.....",
      "S>>>>>>>>>>>>>>>>>>>E.",
      "......................",
    ],
    background: { bgColor: "#0A0A0A", pathColor: "#1A2A1A", pathEdgeColor: "#0A1A0A", emptyColor: "#0F1A0F", obstacleColor: "#000000", accentColor: "#4CAF50", fogColor: "rgba(0,0,0,0.92)", uiTint: "#1B5E20" },
    hint: "大量森林霧區限制建塔空間，優先覆蓋三路的共同轉折。",
  },
  {
    id: "map10",
    name: "宇宙終局",
    nameEn: "Cosmic Finale",
    theme: "cosmic",
    difficulty: 10,
    gridWidth: 24,
    gridHeight: 18,
    startGold: 200,
    startLives: 8,
    waveCount: 30,
    paths: [
      { id: "cosmicA", waypoints: [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 4 }, { x: 10, y: 4 }, { x: 10, y: 8 }, { x: 12, y: 8 }] },
      { id: "cosmicB", waypoints: [{ x: 23, y: 0 }, { x: 17, y: 0 }, { x: 17, y: 4 }, { x: 13, y: 4 }, { x: 13, y: 8 }, { x: 12, y: 8 }] },
      { id: "cosmicC", waypoints: [{ x: 0, y: 9 }, { x: 8, y: 9 }, { x: 8, y: 11 }, { x: 12, y: 11 }] },
      { id: "cosmicD", waypoints: [{ x: 23, y: 9 }, { x: 15, y: 9 }, { x: 15, y: 11 }, { x: 12, y: 11 }] },
      { id: "cosmicE", waypoints: [{ x: 0, y: 17 }, { x: 5, y: 17 }, { x: 5, y: 12 }, { x: 12, y: 12 }] },
      { id: "cosmicF", waypoints: [{ x: 23, y: 17 }, { x: 18, y: 17 }, { x: 18, y: 14 }, { x: 14, y: 14 }, { x: 14, y: 11 }, { x: 12, y: 11 }] },
    ],
    grid: [
      "S>>>>>v..........<<<<E..",
      "......v..........^......",
      "..H...v....H.....^..H...",
      "......v..........^......",
      "......>>>>v.<<<<<<......",
      "..........v..^..........",
      "...H......v..^....H.....",
      "..........v..^..........",
      "..........>>E<..........",
      "S>>>>>>>v......^<<<<<<E.",
      "........v......^........",
      "........>>>>E<<<........",
      ".....v......E...........",
      ".....v....H.^...........",
      ".....v........<<<v......",
      ".....v............v.....",
      ".....v....H.......v.....",
      "S>>>>^............<<<<E.",
    ],
    background: { bgColor: "#050510", pathColor: "#1A1040", pathEdgeColor: "#0D0820", emptyColor: "#0A0A20", obstacleColor: "#4A0080", accentColor: "#E040FB", fogColor: "rgba(5,5,30,0.88)", starParticles: true, uiTint: "#7C4DFF" },
    hint: "六條宇宙路線同時壓迫，黑洞周圍不要過度集中火力。",
  },
];

function buildGrid(width, height, paths, obstacles = []) {
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
  obstacles.forEach(({ x, y, char }) => {
    if (grid[y]?.[x] === ".") grid[y][x] = char;
  });
  paths.forEach((path) => {
    const cells = expandWaypoints(path.waypoints);
    cells.forEach((cell, index) => {
      if (!grid[cell.y]?.[cell.x]) return;
      if (index === 0) grid[cell.y][cell.x] = "S";
      else if (index === cells.length - 1) grid[cell.y][cell.x] = "E";
      else {
        const next = cells[index + 1];
        const prev = cells[index - 1];
        const dx = next ? Math.sign(next.x - cell.x) : Math.sign(cell.x - prev.x);
        const dy = next ? Math.sign(next.y - cell.y) : Math.sign(cell.y - prev.y);
        grid[cell.y][cell.x] = dx > 0 ? ">" : dx < 0 ? "<" : dy > 0 ? "v" : "^";
      }
    });
  });
  return grid.map((row) => row.join(""));
}

function makeExpansionMap(config) {
  return {
    ...config,
    grid: buildGrid(config.gridWidth, config.gridHeight, config.paths, config.obstacles),
  };
}

const EXPANSION_MAPS = [
  makeExpansionMap({
    id: "map11",
    name: "毒沼廢土",
    nameEn: "Toxic Wasteland",
    theme: "toxic",
    difficulty: 11,
    gridWidth: 20,
    gridHeight: 15,
    startGold: 115,
    startLives: 12,
    waveCount: 32,
    paths: [
      { id: "upper", waypoints: [{ x: 0, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 4 }, { x: 12, y: 4 }, { x: 12, y: 7 }, { x: 19, y: 7 }] },
      { id: "middle", waypoints: [{ x: 0, y: 7 }, { x: 19, y: 7 }] },
      { id: "lower", waypoints: [{ x: 0, y: 13 }, { x: 4, y: 13 }, { x: 4, y: 10 }, { x: 12, y: 10 }, { x: 12, y: 7 }, { x: 19, y: 7 }] },
    ],
    obstacles: [
      { x: 6, y: 0, char: "P" }, { x: 7, y: 0, char: "P" }, { x: 12, y: 0, char: "P" }, { x: 13, y: 0, char: "P" },
      { x: 2, y: 3, char: "P" }, { x: 3, y: 3, char: "P" }, { x: 14, y: 3, char: "P" }, { x: 15, y: 3, char: "P" },
      { x: 6, y: 6, char: "P" }, { x: 7, y: 6, char: "P" }, { x: 10, y: 6, char: "P" }, { x: 11, y: 6, char: "P" },
      { x: 2, y: 11, char: "P" }, { x: 3, y: 11, char: "P" }, { x: 14, y: 11, char: "P" }, { x: 15, y: 11, char: "P" },
      { x: 6, y: 14, char: "P" }, { x: 7, y: 14, char: "P" }, { x: 12, y: 14, char: "P" }, { x: 13, y: 14, char: "P" },
    ],
    background: { bgColor: "#1A2A0A", pathColor: "#3A4A2A", pathEdgeColor: "#203018", emptyColor: "#2A3A1A", obstacleColor: "#4AFF4A", accentColor: "#80FF00", uiTint: "#558B2F" },
    hint: "毒池壓縮建造空間，三路最後會匯入中央出口。",
  }),
  makeExpansionMap({
    id: "map12",
    name: "水晶洞窟",
    nameEn: "Crystal Cavern",
    theme: "crystal",
    difficulty: 12,
    gridWidth: 20,
    gridHeight: 16,
    startGold: 110,
    startLives: 10,
    waveCount: 34,
    paths: [
      { id: "top", waypoints: [{ x: 0, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 6 }, { x: 14, y: 6 }, { x: 14, y: 10 }, { x: 19, y: 10 }] },
      { id: "bottom", waypoints: [{ x: 0, y: 13 }, { x: 8, y: 13 }, { x: 8, y: 9 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 19, y: 10 }] },
    ],
    obstacles: [
      { x: 3, y: 4, char: "Q" }, { x: 10, y: 3, char: "Q" }, { x: 16, y: 3, char: "Q" },
      { x: 2, y: 8, char: "Q" }, { x: 5, y: 9, char: "Q" }, { x: 11, y: 11, char: "Q" }, { x: 17, y: 13, char: "Q" },
      { x: 12, y: 1, char: "Q" }, { x: 6, y: 15, char: "Q" },
    ],
    background: { bgColor: "#0D0D2B", pathColor: "#2A2A5A", pathEdgeColor: "#151540", emptyColor: "#1A1A3A", obstacleColor: "#88EEFF", accentColor: "#00FFFF", uiTint: "#1565C0" },
    hint: "水晶阻擋格切割視野，適合長射程塔控住兩路交會處。",
  }),
  makeExpansionMap({
    id: "map13",
    name: "颱風之眼",
    nameEn: "Typhoon Eye",
    theme: "storm",
    difficulty: 13,
    gridWidth: 22,
    gridHeight: 18,
    startGold: 105,
    startLives: 10,
    waveCount: 35,
    paths: [
      { id: "north", waypoints: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 12 }, { x: 21, y: 12 }] },
      { id: "west", waypoints: [{ x: 0, y: 9 }, { x: 7, y: 9 }, { x: 7, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 12 }, { x: 21, y: 12 }] },
      { id: "south", waypoints: [{ x: 11, y: 17 }, { x: 11, y: 12 }, { x: 17, y: 12 }, { x: 21, y: 12 }] },
    ],
    obstacles: [
      { x: 10, y: 8, char: "O" }, { x: 11, y: 8, char: "O" }, { x: 10, y: 9, char: "O" }, { x: 11, y: 9, char: "O" },
      { x: 4, y: 3, char: "O" }, { x: 18, y: 2, char: "O" }, { x: 4, y: 15, char: "O" }, { x: 19, y: 15, char: "O" },
    ],
    background: { bgColor: "#0A1520", pathColor: "#2A4060", pathEdgeColor: "#132840", emptyColor: "#152030", obstacleColor: "#5ECFFF", accentColor: "#B3E5FC", uiTint: "#0277BD" },
    hint: "三個入口繞著風眼匯流，中心周邊的建造格最珍貴。",
  }),
  makeExpansionMap({
    id: "map14",
    name: "聖域長廊",
    nameEn: "Sacred Corridor",
    theme: "sacred",
    difficulty: 14,
    gridWidth: 22,
    gridHeight: 18,
    startGold: 115,
    startLives: 9,
    waveCount: 36,
    paths: [
      { id: "left", waypoints: [{ x: 0, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 8 }, { x: 16, y: 8 }, { x: 16, y: 13 }, { x: 21, y: 13 }] },
      { id: "right", waypoints: [{ x: 21, y: 4 }, { x: 16, y: 4 }, { x: 16, y: 8 }, { x: 5, y: 8 }, { x: 5, y: 13 }, { x: 0, y: 13 }] },
    ],
    obstacles: [
      { x: 10, y: 5, char: "A" }, { x: 11, y: 5, char: "A" }, { x: 10, y: 11, char: "A" }, { x: 11, y: 11, char: "A" },
      { x: 2, y: 2, char: "A" }, { x: 19, y: 2, char: "A" }, { x: 2, y: 15, char: "A" }, { x: 19, y: 15, char: "A" },
    ],
    background: { bgColor: "#1A1020", pathColor: "#5A4A7A", pathEdgeColor: "#3A2858", emptyColor: "#2A1A3A", obstacleColor: "#FFD700", accentColor: "#FFFFFF", uiTint: "#7B1FA2" },
    hint: "雙向長廊會互相穿插，需在中段建立穩定火力網。",
  }),
  makeExpansionMap({
    id: "map15",
    name: "混沌裂隙",
    nameEn: "Chaos Rift",
    theme: "chaos",
    difficulty: 15,
    gridWidth: 22,
    gridHeight: 18,
    startGold: 130,
    startLives: 8,
    waveCount: 38,
    paths: [
      { id: "riftA", waypoints: [{ x: 0, y: 4 }, { x: 7, y: 4 }, { x: 7, y: 2 }, { x: 14, y: 2 }, { x: 14, y: 9 }, { x: 21, y: 9 }] },
      { id: "riftB", waypoints: [{ x: 0, y: 9 }, { x: 9, y: 9 }, { x: 9, y: 14 }, { x: 16, y: 14 }, { x: 16, y: 9 }, { x: 21, y: 9 }] },
      { id: "riftC", waypoints: [{ x: 0, y: 14 }, { x: 5, y: 14 }, { x: 5, y: 7 }, { x: 13, y: 7 }, { x: 13, y: 9 }, { x: 21, y: 9 }] },
    ],
    obstacles: [
      { x: 4, y: 1, char: "M" }, { x: 18, y: 1, char: "M" }, { x: 11, y: 5, char: "M" }, { x: 3, y: 10, char: "M" },
      { x: 18, y: 11, char: "M" }, { x: 11, y: 16, char: "M" },
    ],
    background: { bgColor: "#0D0015", pathColor: "#4A00AA", pathEdgeColor: "#240055", emptyColor: "#1A0030", obstacleColor: "#FF00FF", accentColor: "#FF40FF", uiTint: "#6A00AA" },
    hint: "混沌裂隙提供三條不規則路線，後段匯出口壓力極高。",
  }),
  makeExpansionMap({
    id: "map16",
    name: "深淵巢穴",
    nameEn: "Abyss Nest",
    theme: "abyss",
    difficulty: 16,
    gridWidth: 22,
    gridHeight: 18,
    startGold: 120,
    startLives: 8,
    waveCount: 40,
    paths: [
      { id: "nestTop", waypoints: [{ x: 0, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 8 }, { x: 15, y: 8 }, { x: 15, y: 15 }, { x: 21, y: 15 }] },
      { id: "nestMid", waypoints: [{ x: 0, y: 9 }, { x: 21, y: 9 }] },
      { id: "nestBot", waypoints: [{ x: 0, y: 15 }, { x: 7, y: 15 }, { x: 7, y: 11 }, { x: 15, y: 11 }, { x: 15, y: 9 }, { x: 21, y: 9 }] },
    ],
    obstacles: [
      { x: 4, y: 6, char: "N" }, { x: 11, y: 5, char: "N" }, { x: 17, y: 6, char: "N" },
      { x: 4, y: 12, char: "N" }, { x: 11, y: 13, char: "N" }, { x: 18, y: 13, char: "N" },
    ],
    background: { bgColor: "#050505", pathColor: "#1A0A0A", pathEdgeColor: "#090303", emptyColor: "#0A0505", obstacleColor: "#8B0000", accentColor: "#FF3333", uiTint: "#B71C1C" },
    hint: "巢穴阻擋建造並製造壓迫感，三路中段必須提早佈防。",
  }),
  makeExpansionMap({
    id: "map17",
    name: "時序迷宮",
    nameEn: "Temporal Maze",
    theme: "temporal",
    difficulty: 17,
    gridWidth: 24,
    gridHeight: 18,
    startGold: 110,
    startLives: 8,
    waveCount: 42,
    paths: [
      { id: "timeA", waypoints: [{ x: 0, y: 2 }, { x: 10, y: 2 }, { x: 10, y: 7 }, { x: 4, y: 7 }, { x: 4, y: 14 }, { x: 23, y: 14 }] },
      { id: "timeB", waypoints: [{ x: 23, y: 3 }, { x: 14, y: 3 }, { x: 14, y: 8 }, { x: 19, y: 8 }, { x: 19, y: 14 }, { x: 23, y: 14 }] },
      { id: "timeC", waypoints: [{ x: 0, y: 16 }, { x: 8, y: 16 }, { x: 8, y: 11 }, { x: 16, y: 11 }, { x: 16, y: 14 }, { x: 23, y: 14 }] },
    ],
    obstacles: [
      { x: 6, y: 4, char: "T" }, { x: 17, y: 5, char: "T" }, { x: 11, y: 10, char: "T" }, { x: 3, y: 12, char: "T" }, { x: 21, y: 16, char: "T" },
    ],
    background: { bgColor: "#080820", pathColor: "#202060", pathEdgeColor: "#101030", emptyColor: "#101040", obstacleColor: "#8080FF", accentColor: "#4444FF", uiTint: "#1A237E" },
    hint: "時序障礙切斷直線火力，迷宮路線長但交會點少。",
  }),
  makeExpansionMap({
    id: "map18",
    name: "鏡像世界",
    nameEn: "Mirror World",
    theme: "mirror",
    difficulty: 18,
    gridWidth: 24,
    gridHeight: 20,
    startGold: 100,
    startLives: 6,
    waveCount: 45,
    paths: [
      { id: "mirrorA", waypoints: [{ x: 0, y: 4 }, { x: 11, y: 4 }, { x: 11, y: 9 }, { x: 23, y: 9 }] },
      { id: "mirrorB", waypoints: [{ x: 23, y: 4 }, { x: 12, y: 4 }, { x: 12, y: 10 }, { x: 0, y: 10 }] },
      { id: "mirrorC", waypoints: [{ x: 0, y: 15 }, { x: 11, y: 15 }, { x: 11, y: 10 }, { x: 23, y: 10 }] },
      { id: "mirrorD", waypoints: [{ x: 23, y: 15 }, { x: 12, y: 15 }, { x: 12, y: 9 }, { x: 0, y: 9 }] },
    ],
    obstacles: [
      { x: 11, y: 0, char: "M" }, { x: 12, y: 0, char: "M" }, { x: 11, y: 19, char: "M" }, { x: 12, y: 19, char: "M" },
      { x: 5, y: 7, char: "M" }, { x: 18, y: 7, char: "M" }, { x: 5, y: 13, char: "M" }, { x: 18, y: 13, char: "M" },
    ],
    background: { bgColor: "#101025", pathColor: "#303060", pathEdgeColor: "#181830", emptyColor: "#181840", obstacleColor: "#8888FF", accentColor: "#AAAAFF", uiTint: "#3949AB" },
    hint: "鏡像雙側同時進攻，左右半場都需要獨立防線。",
  }),
  makeExpansionMap({
    id: "map19",
    name: "末日熔爐",
    nameEn: "Doomsday Forge",
    theme: "doomsday",
    difficulty: 19,
    gridWidth: 26,
    gridHeight: 20,
    startGold: 95,
    startLives: 5,
    waveCount: 50,
    paths: [
      { id: "forgeA", waypoints: [{ x: 0, y: 2 }, { x: 7, y: 2 }, { x: 7, y: 8 }, { x: 18, y: 8 }, { x: 18, y: 17 }, { x: 25, y: 17 }] },
      { id: "forgeB", waypoints: [{ x: 0, y: 6 }, { x: 12, y: 6 }, { x: 12, y: 12 }, { x: 25, y: 12 }] },
      { id: "forgeC", waypoints: [{ x: 0, y: 12 }, { x: 5, y: 12 }, { x: 5, y: 17 }, { x: 25, y: 17 }] },
      { id: "forgeD", waypoints: [{ x: 25, y: 3 }, { x: 20, y: 3 }, { x: 20, y: 9 }, { x: 12, y: 9 }, { x: 12, y: 12 }, { x: 25, y: 12 }] },
      { id: "forgeE", waypoints: [{ x: 25, y: 19 }, { x: 18, y: 19 }, { x: 18, y: 17 }, { x: 25, y: 17 }] },
    ],
    obstacles: [
      { x: 3, y: 4, char: "L" }, { x: 16, y: 3, char: "L" }, { x: 23, y: 6, char: "L" }, { x: 9, y: 10, char: "L" },
      { x: 2, y: 16, char: "L" }, { x: 14, y: 16, char: "L" }, { x: 22, y: 15, char: "L" },
    ],
    background: { bgColor: "#0A0500", pathColor: "#3A2010", pathEdgeColor: "#1A0800", emptyColor: "#201008", obstacleColor: "#FF4500", accentColor: "#FF6600", uiTint: "#BF360C" },
    hint: "五路熔爐進攻且生命極低，範圍與控場必須平均分配。",
  }),
  makeExpansionMap({
    id: "map20",
    name: "創世終局",
    nameEn: "Genesis End",
    theme: "genesis",
    difficulty: 20,
    gridWidth: 28,
    gridHeight: 22,
    startGold: 200,
    startLives: 5,
    waveCount: 55,
    paths: [
      { id: "genesisA", waypoints: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 5 }, { x: 14, y: 5 }, { x: 14, y: 11 }] },
      { id: "genesisB", waypoints: [{ x: 27, y: 0 }, { x: 19, y: 0 }, { x: 19, y: 5 }, { x: 14, y: 5 }, { x: 14, y: 11 }] },
      { id: "genesisC", waypoints: [{ x: 0, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 15 }, { x: 14, y: 15 }, { x: 14, y: 11 }] },
      { id: "genesisD", waypoints: [{ x: 27, y: 10 }, { x: 18, y: 10 }, { x: 18, y: 15 }, { x: 14, y: 15 }, { x: 14, y: 11 }] },
      { id: "genesisE", waypoints: [{ x: 0, y: 21 }, { x: 7, y: 21 }, { x: 7, y: 17 }, { x: 14, y: 17 }, { x: 14, y: 11 }] },
      { id: "genesisF", waypoints: [{ x: 27, y: 21 }, { x: 20, y: 21 }, { x: 20, y: 17 }, { x: 14, y: 17 }, { x: 14, y: 11 }] },
      { id: "genesisCore", waypoints: [{ x: 14, y: 0 }, { x: 14, y: 11 }] },
    ],
    obstacles: [
      { x: 5, y: 3, char: "H" }, { x: 22, y: 3, char: "H" }, { x: 4, y: 14, char: "H" }, { x: 23, y: 14, char: "H" },
      { x: 10, y: 19, char: "H" }, { x: 18, y: 19, char: "H" }, { x: 13, y: 10, char: "H" }, { x: 15, y: 10, char: "H" },
    ],
    background: { bgColor: "#02020F", pathColor: "#15153A", pathEdgeColor: "#08081A", emptyColor: "#080820", obstacleColor: "#6600CC", accentColor: "#CC44FF", starParticles: true, cosmicNebula: true, uiTint: "#4A148C" },
    hint: "七路終局壓迫核心點，所有防線都必須服務中央收束口。",
  }),
];

MAPS.push(...EXPANSION_MAPS);

const V13_WAVE_COUNTS = {
  map01: 20,
  map02: 22,
  map03: 24,
  map04: 25,
  map05: 26,
  map06: 28,
  map07: 30,
  map08: 30,
  map09: 32,
  map10: 32,
};

MAPS.forEach((map) => {
  if (V13_WAVE_COUNTS[map.id]) map.waveCount = V13_WAVE_COUNTS[map.id];
});

const settings = loadSettings();
const progress = loadProgress();
let selectedMapId = settings.selectedMapId || "map01";
let lastTime = performance.now();
let animationId = 0;
let toastTimer = 0;
let autoWaveTimer = 0;
let nextId = 1;

const game = {
  status: "menu",
  map: null,
  pathCells: new Set(),
  pathPixelSets: {},
  lives: 20,
  gold: 150,
  score: 0,
  currentWave: 0,
  waveInProgress: false,
  speed: normalizeSpeed(settings.speed),
  selectedTowerType: "dart",
  selectedTower: null,
  towers: [],
  enemies: [],
  projectiles: [],
  particles: [],
  spawners: [],
  paused: false,
  autoWaveEnabled: false,
  kills: 0,
  cheatUsed: false,
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
    else if (id === "cheat") [523, 659, 784, 1046, 1319].forEach((f, i) => this.tone(f, now + i * 0.1, 0.12, "square", 0.22));
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

function getMapById(mapId) {
  return MAPS.find((map) => map.id === mapId) || MAPS[0];
}

function isMapUnlocked(map) {
  return true;
}

function prepareMap(map) {
  const prepared = cloneData(map);
  prepared.paths = prepared.paths.map((path) => {
    const cells = expandWaypoints(path.waypoints);
    return {
      ...path,
      cells,
      points: cells.map((cell) => tileCenter(cell.x, cell.y)),
    };
  });
  prepared.pathCells = new Set(prepared.paths.flatMap((path) => path.cells.map((cell) => `${cell.x},${cell.y}`)));
  prepared.waves = createMapWaves(prepared.waveCount, prepared.difficulty, prepared.paths.map((path) => path.id));
  return prepared;
}

function expandWaypoints(waypoints) {
  const cells = [];
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const start = waypoints[i];
    const end = waypoints[i + 1];
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    let x = start.x;
    let y = start.y;
    if (i === 0) cells.push({ x, y });
    while (x !== end.x || y !== end.y) {
      x += dx;
      y += dy;
      cells.push({ x, y });
    }
  }
  return cells;
}

function tileCenter(x, y) {
  return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
}

function createMapWaves(total, difficulty, pathIds) {
  const result = [];
  const advancedTypes = ["steel", "emp", "insulated", "purified", "gale", "tortoise", "chrono", "regen", "cursed", "mirror", "suicide", "shadow"];
  for (let i = 0; i < total; i += 1) {
    const base = waves[Math.min(i, waves.length - 1)];
    const multiplier = 1 + difficulty * 0.15 + i * 0.08;
    const groups = base.map((group, groupIndex) => ({
      ...group,
      count: Math.max(1, Math.round(group.count * multiplier)),
      interval: Math.max(0.18, group.interval - difficulty * 0.02),
      pathId: pathIds.length > 1 ? pathIds[(i + groupIndex) % pathIds.length] : pathIds[0],
    }));
    if (difficulty >= 6 && i >= 4) {
      const type = advancedTypes[(i + difficulty) % advancedTypes.length];
      groups.push({
        type,
        count: Math.max(2, Math.round((difficulty + i) * 0.45)),
        interval: Math.max(0.45, 1.15 - difficulty * 0.04),
        delay: 3 + (i % 4),
        pathId: pathIds[(i + 1) % pathIds.length],
      });
    }
    if (i === total - 1) {
      groups.forEach((group) => {
        group.count = Math.ceil(group.count * (difficulty >= 15 ? 2.4 : difficulty >= 10 ? 1.9 : 1.5));
        group.interval = Math.max(0.12, group.interval * 0.6);
      });
      const bossCount = difficulty >= 19 ? 3 : difficulty >= 16 ? 2 : 1;
      groups.unshift({ type: "boss", count: bossCount, interval: 1.0, pathId: pathIds[0] });
    }
    result.push(groups);
  }
  return result;
}

function loadSettings() {
  const defaults = { musicVolume: 0.6, sfxVolume: 0.8, speed: 1, muted: false };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveSettings() {
  settings.selectedMapId = selectedMapId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function normalizeSpeed(value) {
  const speed = Number(value) || 1;
  return Math.min(5, Math.max(1, Math.round(speed)));
}

function setSpeed(speed) {
  game.speed = normalizeSpeed(speed);
  settings.speed = game.speed;
  saveSettings();
  updateSpeedButtons();
}

function updateSpeedButtons() {
  document.querySelectorAll(".speed-button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.speed) === game.speed);
  });
}

function loadProgress() {
  const defaults = {
    completedMaps: {},
    highScores: {},
    cheatClears: 0,
  };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function resetGame() {
  if (!isMapUnlocked(getMapById(selectedMapId))) selectedMapId = "map01";
  const map = prepareMap(getMapById(selectedMapId));
  clearAutoWaveTimer();
  Object.assign(game, {
    status: "playing",
    map,
    pathCells: map.pathCells,
    lives: map.startLives,
    gold: map.startGold,
    score: 0,
    currentWave: 0,
    waveInProgress: false,
    speed: normalizeSpeed(settings.speed),
    selectedTowerType: "dart",
    selectedTower: null,
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    spawners: [],
    paused: false,
    autoWaveEnabled: false,
    kills: 0,
    cheatUsed: false,
  });
  canvas.width = map.gridWidth * TILE;
  canvas.height = map.gridHeight * TILE;
  els.pauseBtn.textContent = "⏸";
  updateSpeedButtons();
  showGame();
  renderTowerList();
  updateHud();
  updateSelection();
  showToast(`${map.name}：${map.hint}`);
}

function showGame() {
  els.menu.classList.add("hidden");
  els.game.classList.remove("hidden");
  audio.ensure();
  audio.startMusic();
}

function showMenu() {
  clearAutoWaveTimer();
  game.status = "menu";
  cheatDetector.buffer = [];
  els.game.classList.add("hidden");
  els.menu.classList.remove("hidden");
}

function startWave() {
  if (game.waveInProgress || game.currentWave >= game.map.waves.length || game.status !== "playing") return;
  const earlyAutoStart = Boolean(autoWaveTimer) && game.autoWaveEnabled && !game.cheatUsed;
  clearAutoWaveTimer();
  if (earlyAutoStart) changeGold(10);
  audio.play("upgrade");
  game.waveInProgress = true;
  game.currentWave += 1;
  game.spawners = game.map.waves[game.currentWave - 1].map((group) => ({
    ...group,
    spawned: 0,
    timer: -(group.delay || 0),
  }));
  els.startWaveBtn.disabled = true;
  showToast(`第 ${game.currentWave} 波開始`);
  updateHud();
}

function clearAutoWaveTimer() {
  if (!autoWaveTimer) return;
  clearTimeout(autoWaveTimer);
  autoWaveTimer = 0;
}

function canAutoStartNextWave() {
  if (!game.autoWaveEnabled || game.cheatUsed) return false;
  if (game.status !== "playing" || game.paused || game.waveInProgress || !game.map) return false;
  if (game.currentWave >= game.map.waves.length - 1) return false;
  return true;
}

function scheduleAutoWave() {
  clearAutoWaveTimer();
  if (!canAutoStartNextWave()) {
    updateAutoWaveButton();
    return;
  }
  autoWaveTimer = setTimeout(() => {
    autoWaveTimer = 0;
    if (!canAutoStartNextWave()) {
      updateAutoWaveButton();
      return;
    }
    changeGold(10);
    showToast("自動波次：提前出擊獎勵 +10 金幣");
    startWave();
  }, 500);
  updateAutoWaveButton();
}

function toggleAutoWave() {
  if (game.status !== "playing") return;
  if (game.cheatUsed) {
    game.autoWaveEnabled = false;
    updateAutoWaveButton();
    showToast("作弊局不可使用自動波次");
    return;
  }
  game.autoWaveEnabled = !game.autoWaveEnabled;
  if (game.autoWaveEnabled) {
    scheduleAutoWave();
  } else {
    clearAutoWaveTimer();
    updateAutoWaveButton();
  }
}

function updateAutoWaveButton() {
  if (!els.autoWaveBtn) return;
  const locked = game.status !== "playing" || game.cheatUsed;
  els.autoWaveBtn.disabled = locked;
  els.autoWaveBtn.textContent = `自動: ${game.autoWaveEnabled && !locked ? "ON" : "OFF"}`;
  els.autoWaveBtn.classList.toggle("enabled", game.autoWaveEnabled && !locked);
  els.autoWaveBtn.classList.toggle("disabled", !game.autoWaveEnabled || locked);
}

function changeGold(amount) {
  game.gold = Math.max(0, game.gold + amount);
}

function update(dt) {
  if (game.status !== "playing" || game.paused) return;
  const scaledDt = Math.min(dt, 0.05) * game.speed;
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
      spawnEnemy(spawner.type, spawner.pathId, spawner.spawned);
      spawner.spawned += 1;
    }
  }
}

function spawnEnemy(type, pathId, spawnIndex = 0) {
  const base = enemyTypes[type];
  const hpBoost = 1 + Math.max(0, game.currentWave - 1) * 0.12;
  const path = chooseEnemyPath(pathId, spawnIndex);
  const start = path.points[0];
  game.enemies.push({
    id: makeId(),
    type,
    pathId: path.id,
    path,
    x: start.x,
    y: start.y,
    pathIndex: 0,
    hp: Math.ceil(base.hp * hpBoost),
    maxHp: Math.ceil(base.hp * hpBoost),
    speed: base.speed,
    reward: base.reward,
    lives: base.lives,
    armor: Boolean(base.armor),
    armorValue: base.armorValue || (base.armor ? 0.4 : 0),
    immunities: base.immunities || [],
    weaknesses: base.weaknesses || {},
    specialBehavior: base.specialBehavior || null,
    behaviorState: { timer: 0, splitDone: false },
    color: base.color,
    emoji: base.emoji,
    frozen: 0,
    poison: 0,
    poisonTick: 0,
    magnetized: 0,
    cursed: 0,
  });
}

function chooseEnemyPath(pathId, spawnIndex) {
  if (pathId) {
    const found = game.map.paths.find((path) => path.id === pathId);
    if (found) return found;
  }
  return game.map.paths[spawnIndex % game.map.paths.length];
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
    if (enemy.magnetized > 0) enemy.magnetized -= dt;
    if (enemy.cursed > 0) enemy.cursed -= dt;
    if (enemy.specialBehavior === "regen" && enemy.hp < enemy.maxHp) {
      enemy.behaviorState.timer += dt;
      if (enemy.behaviorState.timer >= 3) {
        enemy.behaviorState.timer = 0;
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 2);
        addFloatText(enemy.x, enemy.y - 22, "+2", "#f9a8d4");
      }
    }
    if (enemy.hp <= 0) {
      killEnemy(i, enemy);
      continue;
    }
    const target = enemy.path.points[enemy.pathIndex + 1];
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
  if (enemy.specialBehavior === "split" && !enemy.behaviorState.splitDone) {
    spawnSplitEnemies(enemy, "blue", 3);
  }
  if (enemy.specialBehavior === "explode") {
    for (const nearby of game.enemies) {
      if (nearby !== enemy && distance(nearby, enemy) <= 96) {
        nearby.hp -= 5;
      }
    }
    addRing(enemy.x, enemy.y, 96, "#fb7185");
  }
  game.enemies.splice(index, 1);
  changeGold(enemy.reward);
  game.score += enemy.reward * 10;
  game.kills += 1;
  audio.play("pop");
  addBurst(enemy.x, enemy.y, enemy.color);
  updateHud();
}

function spawnSplitEnemies(enemy, type, count) {
  const base = enemyTypes[type];
  for (let i = 0; i < count; i += 1) {
    game.enemies.push({
      id: makeId(),
      type,
      pathId: enemy.pathId,
      path: enemy.path,
      x: enemy.x + (i - 1) * 8,
      y: enemy.y,
      pathIndex: enemy.pathIndex,
      hp: base.hp,
      maxHp: base.hp,
      speed: base.speed,
      reward: 0,
      lives: base.lives,
      armor: Boolean(base.armor),
      armorValue: base.armorValue || 0,
      immunities: base.immunities || [],
      weaknesses: base.weaknesses || {},
      specialBehavior: null,
      behaviorState: { timer: 0, splitDone: true },
      color: base.color,
      emoji: base.emoji,
      frozen: 0,
      poison: 0,
      poisonTick: 0,
      magnetized: 0,
      cursed: 0,
    });
  }
}

function updateTowers(dt) {
  for (const tower of game.towers) {
    if (tower.supportBoost > 0) tower.supportBoost -= dt;
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;
    const target = findTarget(tower);
    if (!target) continue;
    const fireRate = tower.fireRate * (tower.supportBoost > 0 ? 1.3 : 1);
    tower.cooldown = 1 / fireRate;
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
    const progress = enemy.pathIndex * 10000 + distance(enemy.path.points[enemy.pathIndex] || enemy, enemy);
    if (progress > bestProgress) {
      best = enemy;
      bestProgress = progress;
    }
  }
  return best;
}

function fireTower(tower, target) {
  audio.play(tower.kind === "ice" ? "freeze" : "shoot");
  if (tower.support) {
    applySupportPulse(tower);
    return;
  }
  if (["ice", "bell", "magnet", "thunder", "mushroom", "vortex"].includes(tower.kind)) {
    let hits = 0;
    for (const enemy of game.enemies) {
      if (distance(tower, enemy) <= tower.range) {
        if (tower.freeze) enemy.frozen = Math.max(enemy.frozen, tower.freeze);
        if (tower.magnetize) enemy.magnetized = Math.max(enemy.magnetized, tower.magnetize);
        if (tower.poison && !enemy.immunities?.includes("poison")) enemy.poison = Math.max(enemy.poison, tower.poison);
        if (tower.damage > 0) applyDamage(enemy, tower.damage, tower.attackType || tower.kind, tower);
        hits += 1;
        if (tower.chain && hits >= tower.chain) break;
      }
    }
    addRing(tower.x, tower.y, tower.range, tower.color);
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
      attackType: tower.attackType || tower.kind,
      splash: tower.splash || 0,
      poison: tower.poison || 0,
      curse: tower.curse || 0,
      pierce: tower.pierce ? 2 : 0,
      pierceLevel: tower.pathA || 0,
      angleOffset: spread,
      radius: tower.kind === "bomb" || tower.kind === "wizard" ? 7 : 4,
    });
  }
}

function applySupportPulse(tower) {
  for (const ally of game.towers) {
    if (ally === tower || distance(tower, ally) > tower.range) continue;
    ally.supportBoost = Math.max(ally.supportBoost || 0, 5);
  }
  addRing(tower.x, tower.y, tower.range, tower.color);
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
      if (distance(enemy, p.target) <= p.splash) applyDamage(enemy, p.damage, p.attackType || p.kind, p);
    }
  } else {
    applyDamage(p.target, p.damage, p.attackType || p.kind, p);
    if (p.poison && !p.target.immunities?.includes("poison")) p.target.poison = Math.max(p.target.poison, p.poison);
    if (p.curse) p.target.cursed = Math.max(p.target.cursed, p.curse);
  }
  game.projectiles.splice(index, 1);
}

function applyDamage(enemy, amount, attackType, source = {}) {
  const damage = calcDamage(amount, attackType, source, enemy);
  if (damage <= 0) {
    addFloatText(enemy.x, enemy.y - 20, "免疫", "#cbd5e1");
    return;
  }
  enemy.hp -= damage;
  addFloatText(enemy.x, enemy.y - 20, `-${damage}`, "#fee2e2");
}

function calcDamage(amount, attackType, source, enemy) {
  if (enemy.immunities?.includes(attackType)) return 0;
  let damage = amount;
  if (enemy.armor) {
    const pierceLevel = source.pierceLevel || source.pierce || 0;
    const reduction = Math.max(0, (enemy.armorValue || 0.4) - pierceLevel * 0.12);
    damage *= 1 - reduction;
  }
  if (enemy.weaknesses?.[attackType]) damage *= enemy.weaknesses[attackType];
  if (enemy.magnetized > 0) damage *= 1.5;
  if (enemy.cursed > 0) damage *= 1.25;
  return Math.ceil(Math.max(1, damage));
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
    changeGold(25);
    game.score += 250;
    audio.play(game.currentWave >= game.map.waves.length ? "win" : "upgrade");
    updateHud();
    if (game.currentWave >= game.map.waves.length) {
      endGame(true);
    } else {
      els.startWaveBtn.disabled = false;
      scheduleAutoWave();
      showToast(`第 ${game.currentWave} 波完成，獎勵 25 金幣`);
    }
  }
}

function endGame(win) {
  clearAutoWaveTimer();
  game.autoWaveEnabled = false;
  game.status = win ? "win" : "gameover";
  audio.play(win ? "win" : "lose");
  const mapId = game.map.id;
  const best = Number(progress.highScores[mapId] || 0);
  if (!game.cheatUsed) {
    if (game.score > best) progress.highScores[mapId] = game.score;
    if (win) {
      progress.completedMaps[mapId] = true;
    }
  } else {
    progress.cheatClears = Number(progress.cheatClears || 0) + (win ? 1 : 0);
  }
  saveProgress();
  openModal(win ? "勝利" : "城門失守", `
    <p>${win ? `你守住了 ${game.map.name}。` : "氣球突破了防線。"}</p>
    <p>分數：<strong>${game.score}</strong>　擊破：<strong>${game.kills}</strong></p>
    <p>${game.cheatUsed ? "本局使用作弊碼，不更新最高分與解鎖進度。" : `最高分：<strong>${Math.max(best, game.score)}</strong>`}</p>
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
  const map = game.map || prepareMap(getMapById(selectedMapId));
  const colors = map.background;
  ctx.fillStyle = colors.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < map.gridHeight; y += 1) {
    for (let x = 0; x < map.gridWidth; x += 1) {
      const char = map.grid[y]?.[x] || ".";
      ctx.fillStyle = tileColor(char, colors, x, y);
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
      drawTileDetail(char, x, y, colors);
    }
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = colors.pathEdgeColor;
  ctx.lineWidth = 52;
  drawPathLines(map);
  ctx.strokeStyle = colors.pathColor;
  ctx.lineWidth = 38;
  drawPathLines(map);
  ctx.lineWidth = 1;
  drawEndpoints(map);
}

function tileColor(char, colors, x, y) {
  if (BLOCKED_CHARS.has(char)) return colors.obstacleColor;
  if (TILE_CHARS.has(char)) return colors.pathColor;
  return (x + y) % 2 ? colors.emptyColor : blendColor(colors.emptyColor, colors.bgColor, 0.18);
}

function drawTileDetail(char, x, y, colors) {
  const cx = x * TILE + TILE / 2;
  const cy = y * TILE + TILE / 2;
  if (char === "T") drawText("♣", cx, cy + 2, 24, "center", colors.accentColor);
  if (char === "R") drawText("◆", cx, cy, 22, "center", colors.accentColor);
  if (char === "W") {
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 7, Math.sin(performance.now() / 500 + x) * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  if (char === "L") {
    ctx.fillStyle = `rgba(255, 184, 77, ${0.45 + Math.sin(performance.now() / 180 + x + y) * 0.2})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  if (char === "B") drawText("□", cx, cy, 24, "center", colors.accentColor);
  if (char === "C") drawText("C", cx, cy, 22, "center", colors.accentColor);
  if (char === "A") drawText("A", cx, cy, 22, "center", colors.accentColor);
  if (char === "G") drawText("G", cx, cy, 22, "center", colors.accentColor);
  if (char === "F") drawText("F", cx, cy, 18, "center", colors.accentColor);
  if (char === "H") drawText("BH", cx, cy, 18, "center", colors.accentColor);
  if (char === "P") drawText("P", cx, cy, 22, "center", "#0f172a");
  if (char === "Q") drawText("◆", cx, cy, 24, "center", colors.accentColor);
  if (char === "N") drawText("N", cx, cy, 22, "center", colors.accentColor);
  if (char === "O") drawText("◎", cx, cy, 24, "center", colors.accentColor);
  if (char === "M") drawText("M", cx, cy, 20, "center", colors.accentColor);
}

function drawPathLines(map) {
  map.paths.forEach((path) => {
    ctx.beginPath();
    path.points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });
}

function drawEndpoints(map) {
  map.paths.forEach((path) => {
    const start = path.points[0];
    const end = path.points[path.points.length - 1];
    drawText("S", start.x, start.y, 22, "center", "#ffffff");
    drawText("E", end.x, end.y, 22, "center", "#ffffff");
  });
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
    <strong>${tower.emoji} ${tower.name} Lv.${1 + tower.pathA + tower.pathB}${tower.apexActivated ? " Apex" : ""}</strong><br>
    傷害 ${tower.damage}　範圍 ${Math.round(tower.range)}<br>
    射速 ${tower.fireRate.toFixed(1)}/秒<br>
    A 路線：${tower.pathA}/3　B 路線：${tower.pathB}/3
    <div class="upgrade-row">
      <button id="upgradeA" class="upgrade-button">${tower.pathA >= 3 ? "A 已滿" : `升級 A　$${upgradeCost(tower, "A")}`}</button>
      <button id="upgradeB" class="upgrade-button">${tower.pathB >= 3 ? "B 已滿" : `升級 B　$${upgradeCost(tower, "B")}`}</button>
    </div>
    <button id="upgradeApex" class="upgrade-button" ${canUpgrade(tower, "apex") ? "" : "disabled"}>Apex　$${upgradeCost(tower, "apex")}</button>
    <button id="sellTower" class="sell-btn">出售　$${sellValue}</button>
  `;
  setUpgradeButtonState(document.querySelector("#upgradeA"), getUpgradeState(tower, "A"));
  setUpgradeButtonState(document.querySelector("#upgradeB"), getUpgradeState(tower, "B"));
  setUpgradeButtonState(document.querySelector("#upgradeApex"), getUpgradeState(tower, "apex"));
  document.querySelector("#upgradeA").addEventListener("click", () => upgradeTower(tower, "A"));
  document.querySelector("#upgradeB").addEventListener("click", () => upgradeTower(tower, "B"));
  document.querySelector("#upgradeApex").addEventListener("click", () => upgradeTower(tower, "apex"));
  document.querySelector("#sellTower").addEventListener("click", () => sellTower(tower));
}

function getUpgradeState(tower, path) {
  if (path === "apex") {
    if (tower.apexActivated) return "purchased";
    if (tower.pathA < 3 || tower.pathB < 3) return "locked";
    return game.gold >= upgradeCost(tower, path) ? "available" : "insufficient";
  }
  const own = path === "A" ? tower.pathA : tower.pathB;
  if (own >= 3) return "purchased";
  return game.gold >= upgradeCost(tower, path) ? "available" : "insufficient";
}

function setUpgradeButtonState(button, state) {
  button.dataset.state = state;
  button.classList.remove("state-available", "state-insufficient", "state-locked", "state-purchased");
  button.classList.add(`state-${state}`);
  button.disabled = state !== "available";
}

function upgradeCost(tower, path) {
  if (path === "apex") return tower.apexCost || UPGRADE_COSTS.apex;
  const level = path === "A" ? tower.pathA : tower.pathB;
  return UPGRADE_COSTS[path][level] || 0;
}

function canUpgrade(tower, path) {
  if (path === "apex") {
    return tower.pathA === 3 && tower.pathB === 3 && !tower.apexActivated && game.gold >= upgradeCost(tower, path);
  }
  const own = path === "A" ? tower.pathA : tower.pathB;
  if (own >= 3) return false;
  return game.gold >= upgradeCost(tower, path);
}

function upgradeTower(tower, path) {
  if (!canUpgrade(tower, path)) {
    audio.play("bad");
    showToast("金幣不足或升級路線已達限制");
    return;
  }
  const cost = upgradeCost(tower, path);
  changeGold(-cost);
  tower.spent += cost;
  if (path === "apex") {
    activateApex(tower);
    audio.play("win");
    updateHud();
    updateSelection();
    return;
  }
  if (path === "A") {
    tower.pathA += 1;
    tower.damage += tower.kind === "ice" || tower.support ? 1 : tower.pathA === 1 ? 1 : 2;
    tower.range += tower.pathA === 3 ? 35 : 16;
    if (tower.pathA >= 2) tower.pierce = true;
    if (tower.pathA === 3 && tower.splash) tower.splash += 45;
    if (tower.pathA === 3 && tower.freeze) tower.freeze += 0.8;
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

function activateApex(tower) {
  tower.apexActivated = true;
  tower.damage = Math.ceil(tower.damage * 1.5) + 1;
  tower.range += 40;
  tower.fireRate *= 1.35;
  tower.splash = tower.splash ? Math.ceil(tower.splash * 1.25) : 0;
  tower.freeze = tower.freeze ? tower.freeze + 1 : 0;
  tower.poison = tower.poison ? tower.poison + 2 : 0;
  tower.multishot = Math.max(tower.multishot || 1, 3);
  tower.pierce = true;
  addRing(tower.x, tower.y, tower.range, "#fef08a");
  showToast(`${tower.name} 已啟動 Apex`);
}

function sellTower(tower) {
  const index = game.towers.indexOf(tower);
  if (index < 0) return;
  changeGold(Math.floor(tower.spent * 0.5));
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
  changeGold(-type.cost);
  const tower = {
    ...cloneData(type),
    x: col * TILE + TILE / 2,
    y: row * TILE + TILE / 2,
    col,
    row,
    cooldown: 0,
    pathA: 0,
    pathB: 0,
    apexActivated: false,
    supportBoost: 0,
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
  if (game.pathCells.has(`${col},${row}`)) return false;
  const char = game.map.grid[row]?.[col] || ".";
  if (BLOCKED_CHARS.has(char) || TILE_CHARS.has(char)) return false;
  return !game.towers.some((tower) => tower.col === col && tower.row === row);
}

function updateHud() {
  els.livesText.textContent = Math.max(0, game.lives);
  els.goldText.textContent = game.gold;
  els.scoreText.textContent = game.score;
  const totalWaves = game.map?.waves.length || getMapById(selectedMapId).waveCount;
  els.waveText.textContent = `${Math.max(1, game.currentWave || 1)}/${totalWaves}`;
  els.startWaveBtn.disabled = game.waveInProgress || game.status !== "playing";
  updateAutoWaveButton();
  renderTowerList();
  if (game.selectedTower) updateSelection();
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
  const map = game.map || getMapById(selectedMapId);
  return col >= 0 && col < map.gridWidth && row >= 0 && row < map.gridHeight;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function blendColor(hexA, hexB, amount) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const rr = Math.round(ar + (br - ar) * amount);
  const rg = Math.round(ag + (bg - ag) * amount);
  const rb = Math.round(ab + (bb - ab) * amount);
  return `rgb(${rr}, ${rg}, ${rb})`;
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

const cheatDetector = {
  sequence: ["ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowRight", "ArrowLeft"],
  buffer: [],
  lastKeyTime: 0,
  windowMs: 2000,
  onKeyDown(event) {
    if (game.status !== "playing") return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const now = Date.now();
    if (now - this.lastKeyTime > this.windowMs) this.buffer = [];
    this.lastKeyTime = now;
    this.buffer.push(event.key);
    if (this.buffer.length > this.sequence.length) {
      this.buffer = this.buffer.slice(-this.sequence.length);
    }
    if (this.buffer.length === this.sequence.length && this.buffer.every((key, index) => key === this.sequence[index])) {
      this.buffer = [];
      triggerMoneyCheat();
    }
  },
};

function triggerMoneyCheat() {
  changeGold(9999);
  game.cheatUsed = true;
  game.autoWaveEnabled = false;
  clearAutoWaveTimer();
  audio.play("cheat");
  updateHud();
  showToast("作弊碼啟動：+9999 金幣。本局不更新最高分與解鎖進度。");
}

function openSettings() {
  openModal("設定", `
    <div class="settings-grid">
      <label>背景音樂 ${Math.round(settings.musicVolume * 100)}%
        <input id="musicVolume" type="range" min="0" max="1" step="0.05" value="${settings.musicVolume}">
      </label>
      <label>音效音量 ${Math.round(settings.sfxVolume * 100)}%
        <input id="sfxVolume" type="range" min="0" max="1" step="0.05" value="${settings.sfxVolume}">
      </label>
      <label>預設速度 ${normalizeSpeed(settings.speed)}x
        <input id="defaultSpeed" type="range" min="1" max="5" step="1" value="${normalizeSpeed(settings.speed)}">
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
    event.target.parentElement.firstChild.textContent = `預設速度 ${event.target.value}x`;
    setSpeed(event.target.value);
  });
}

function openHelp() {
  openModal("遊戲說明", `
    <div class="help-tabs" role="tablist">
      <button class="help-tab active" data-help-tab="basic">基礎</button>
      <button class="help-tab" data-help-tab="gold">金幣</button>
      <button class="help-tab" data-help-tab="lives">生命</button>
      <button class="help-tab" data-help-tab="waves">波次</button>
      <button class="help-tab" data-help-tab="towers">升級</button>
      <button class="help-tab" data-help-tab="enemies">敵人</button>
    </div>
    <div class="help-panel" data-help-panel="basic">
      <p>選擇右側猴子塔，再點選非道路格建造。道路、障礙、水域、熔岩與已有猴塔的位置不能建造。</p>
      <p>每張地圖有不同路線、起始金幣、生命與波次。守住終點，撐過最後一波即可過關。</p>
    </div>
    <div class="help-panel hidden" data-help-panel="gold">
      <p>擊破敵人會獲得金幣；完成波次會得到額外獎勵。出售防禦塔只會返還一半投入金額。</p>
      <p>v1.2 飛鏢猴降為 $35，炸彈猴調整為 $90，巫師猴回復 $100。</p>
    </div>
    <div class="help-panel hidden" data-help-panel="lives">
      <p>敵人抵達終點會扣除生命。一般敵人扣 1 到 3 點，裝甲與 Boss 會造成更高損失。</p>
      <p>生命歸零時遊戲結束。</p>
    </div>
    <div class="help-panel hidden" data-help-panel="waves">
      <p>按下開始波次後敵人會依路線進場。高難度地圖會混入特殊敵人。</p>
      <p>HUD 的 1x 到 5x 可以即時調整整體遊戲速度。</p>
    </div>
    <div class="help-panel hidden" data-help-panel="towers">
      <p>點選已建造猴塔可升級 A/B 路線。兩條路線都可以升到 3 級，A3+B3 後可啟動 Apex。</p>
      <p>Apex 會大幅提高傷害、射程與射速，但使用成本高，適合後期主力塔。</p>
    </div>
    <div class="help-panel hidden" data-help-panel="enemies">
      <p>裝甲敵人會降低一般傷害，部分特殊敵人有免疫與弱點。音波、冰凍、毒、爆炸、先知與漩渦各有對應用途。</p>
      <p>再生、分裂、自爆與暗影敵人需要優先處理。</p>
    </div>
  `);
  document.querySelectorAll(".help-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".help-tab").forEach((item) => item.classList.toggle("active", item === tab));
      document.querySelectorAll(".help-panel").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.helpPanel !== tab.dataset.helpTab);
      });
    });
  });
}

function openMapSelect() {
  const cards = MAPS.map((map) => {
    const unlocked = isMapUnlocked(map);
    const best = progress.highScores[map.id] || 0;
    const selected = map.id === selectedMapId ? " selected" : "";
    return `
      <button class="map-card${selected}" data-map-id="${map.id}" ${unlocked ? "" : "disabled"}>
        <span class="map-thumb" style="--tint:${map.background.uiTint};--path:${map.background.pathColor};--empty:${map.background.emptyColor}"></span>
        <strong>${map.name}</strong>
        <small>${map.nameEn} · 難度 ${"★".repeat(Math.min(5, Math.ceil(map.difficulty / 4)))}</small>
        <small>${map.waveCount} 波 · $${map.startGold} · 生命 ${map.startLives}</small>
        <small>${unlocked ? `最高分 ${best}` : "通過前一張地圖解鎖"}</small>
      </button>
    `;
  }).join("");
  openModal("選擇地圖", `<div class="map-grid">${cards}</div>`);
  document.querySelectorAll(".map-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedMapId = card.dataset.mapId;
      settings.selectedMapId = selectedMapId;
      saveSettings();
      els.modal.close();
      resetGame();
    });
  });
}

function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  update(dt);
  render();
  animationId = requestAnimationFrame(loop);
}

els.newGameBtn.addEventListener("click", resetGame);
els.mapBtn.addEventListener("click", openMapSelect);
els.settingsBtn.addEventListener("click", openSettings);
els.helpBtn.addEventListener("click", openHelp);
els.modalCloseBtn.addEventListener("click", () => els.modal.close());
els.startWaveBtn.addEventListener("click", startWave);
els.autoWaveBtn.addEventListener("click", toggleAutoWave);
els.pauseBtn.addEventListener("click", () => {
  if (game.status !== "playing") return;
  game.paused = !game.paused;
  els.pauseBtn.textContent = game.paused ? "▶" : "⏸";
  if (game.paused) {
    clearAutoWaveTimer();
  } else {
    scheduleAutoWave();
  }
  updateHud();
});
document.querySelectorAll(".speed-button").forEach((button) => {
  button.addEventListener("click", () => setSpeed(button.dataset.speed));
});
els.muteBtn.addEventListener("click", () => audio.toggleMute());
els.homeBtn.addEventListener("click", showMenu);
document.addEventListener("keydown", (event) => cheatDetector.onKeyDown(event));

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
updateSpeedButtons();
els.muteBtn.textContent = settings.muted ? "🔇" : "🔊";
animationId = requestAnimationFrame(loop);
