const STAGES = [
  {
    id: "stage1",
    label: "Stage 1",
    title: "倉庫",
    seconds: 90,
    quota: 18,
    maxActive: 2,
    spawnEvery: 1150,
    stay: 2300,
    hostages: 0.08,
    enemies: ["normal"],
    scene: "linear-gradient(180deg, rgba(8, 12, 18, 0.15), rgba(8, 12, 18, 0.45)), repeating-linear-gradient(90deg, #2a3038 0 130px, #222830 130px 260px), linear-gradient(#3d4652, #171d25)"
  },
  {
    id: "stage2",
    label: "Stage 2",
    title: "城市街道",
    seconds: 80,
    quota: 24,
    maxActive: 3,
    spawnEvery: 980,
    stay: 1900,
    hostages: 0.18,
    enemies: ["normal", "fast"],
    scene: "linear-gradient(180deg, rgba(9, 17, 28, 0.1), rgba(9, 17, 28, 0.5)), repeating-linear-gradient(90deg, #192237 0 90px, #26354b 90px 148px, #111827 148px 214px), linear-gradient(#24324a, #111827)"
  },
  {
    id: "stage3",
    label: "Stage 3",
    title: "銀行大廳",
    seconds: 70,
    quota: 26,
    maxActive: 3,
    spawnEvery: 900,
    stay: 1800,
    hostages: 0.2,
    enemies: ["normal", "shield"],
    scene: "linear-gradient(180deg, rgba(7, 8, 12, 0.08), rgba(7, 8, 12, 0.38)), repeating-linear-gradient(90deg, #44414a 0 72px, #302f37 72px 144px), linear-gradient(#6e6870, #24242d)"
  },
  {
    id: "stage4",
    label: "Stage 4",
    title: "停車場",
    seconds: 70,
    quota: 30,
    maxActive: 4,
    spawnEvery: 820,
    stay: 1650,
    hostages: 0.22,
    enemies: ["normal", "fast", "shield"],
    scene: "radial-gradient(circle at 30% 18%, rgba(244, 162, 97, 0.25), transparent 16%), radial-gradient(circle at 75% 20%, rgba(46, 196, 182, 0.2), transparent 14%), repeating-linear-gradient(180deg, #141924 0 78px, #0f131d 78px 154px)"
  },
  {
    id: "stage5",
    label: "Stage 5",
    title: "頂樓 Boss",
    seconds: 60,
    quota: 16,
    maxActive: 4,
    spawnEvery: 780,
    stay: 1500,
    hostages: 0.16,
    boss: true,
    enemies: ["normal", "fast", "far"],
    scene: "linear-gradient(180deg, #19243b 0 42%, #0f1320 42% 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 90px)"
  },
  {
    id: "endless",
    label: "ENDLESS",
    title: "無盡模式",
    seconds: 999,
    quota: Infinity,
    maxActive: 5,
    spawnEvery: 720,
    stay: 1450,
    hostages: 0.2,
    endless: true,
    enemies: ["normal", "fast", "shield", "far"],
    scene: "linear-gradient(135deg, #151a27, #2a1520 52%, #102521)"
  }
];

const DIFFICULTY = {
  easy: { label: "簡單", ammo: Infinity, reloadMs: 1000, damageScale: 0.75 },
  normal: { label: "普通", ammo: 12, reloadMs: 1500, damageScale: 1 },
  hard: { label: "困難", ammo: 8, reloadMs: 2000, damageScale: 1.25 }
};

const ENEMY_TYPES = {
  normal: { className: "target-normal", hp: 1, score: 100, width: 96, height: 168, body: "#516c96", head: "#d0a278" },
  fast: { className: "target-fast", hp: 1, score: 130, width: 84, height: 146, body: "#7f4fa3", head: "#d7a780", stayScale: 0.58 },
  shield: { className: "target-shield", hp: 2, score: 180, width: 112, height: 174, body: "#48665a", head: "#d8aa82" },
  far: { className: "target-far", hp: 1, score: 180, width: 68, height: 126, body: "#6e7584", head: "#d3a17b" },
  boss: { className: "target-boss", hp: 18, score: 1000, width: 210, height: 330, body: "#811c2a", head: "#c98d6f" }
};

const SPAWN_POINTS = [
  [17, 26], [50, 24], [82, 27],
  [22, 52], [50, 50], [78, 52],
  [18, 78], [50, 76], [82, 77]
];
