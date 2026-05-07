const ROWS = 5;
const COLS = 9;
const MAX_LEVEL = 50;
const MAX_SELECTED_PLANTS = 12;
const SAVE_KEY = 'pvz_save';

const PlantDefs = [
  { id: 'P01', name: '向日葵', emoji: '🌻', cost: 50, cooldown: 6000, hp: 300, kind: 'sun', produceInterval: 10000 },
  { id: 'P02', name: '豌豆射手', emoji: '🌱', cost: 75, cooldown: 5000, hp: 300, kind: 'shooter', attackInterval: 1500, damage: 20, projectile: 'pea' },
  { id: 'P03', name: '寒冰射手', emoji: '❄️', cost: 150, cooldown: 7500, hp: 300, kind: 'shooter', attackInterval: 1650, damage: 20, projectile: 'ice', effect: 'slow' },
  { id: 'P04', name: '雙發射手', emoji: '🌿', cost: 150, cooldown: 7500, hp: 400, kind: 'shooter', attackInterval: 1700, damage: 20, projectile: 'pea', shots: 2 },
  { id: 'P05', name: '櫻桃炸彈', emoji: '🍒', cost: 150, cooldown: 35000, hp: 999, kind: 'bomb', blast: 'cross', blastDamage: 999 },
  { id: 'P06', name: '堅果牆', emoji: '🥔', cost: 50, cooldown: 15000, hp: 4000, kind: 'wall' },
  { id: 'P07', name: '尖刺草', emoji: '🌵', cost: 125, cooldown: 7500, hp: 300, kind: 'spike', attackInterval: 1100, damage: 20 },
  { id: 'P08', name: '火焰射手', emoji: '🔥', cost: 200, cooldown: 14500, hp: 300, kind: 'shooter', attackInterval: 1550, damage: 40, projectile: 'fire', effect: 'burn' },
  { id: 'P09', name: '三線射手', emoji: '☘️', cost: 325, cooldown: 7500, hp: 400, kind: 'threepeater', attackInterval: 1800, damage: 20, projectile: 'pea' },
  { id: 'P10', name: '催眠菇', emoji: '🍄', cost: 100, cooldown: 15000, hp: 300, kind: 'hypno' },
  { id: 'P11', name: '雙子向日葵', emoji: '🌼', cost: 150, cooldown: 12000, hp: 300, kind: 'sun', produceInterval: 9000, sunValue: 50 },
  { id: 'P12', name: '機槍豌豆', emoji: '🫛', cost: 250, cooldown: 12000, hp: 350, kind: 'shooter', attackInterval: 1200, damage: 18, projectile: 'pea', shots: 4 },
  { id: 'P13', name: '玉米投手', emoji: '🌽', cost: 100, cooldown: 9000, hp: 300, kind: 'lobber', attackInterval: 2300, damage: 35, projectile: 'corn', effect: 'stun' },
  { id: 'P14', name: '西瓜投手', emoji: '🍉', cost: 300, cooldown: 14000, hp: 300, kind: 'lobber', attackInterval: 2600, damage: 70, projectile: 'melon', splash: 45 },
  { id: 'P15', name: '冰西瓜', emoji: '🧊', cost: 425, cooldown: 18000, hp: 300, kind: 'lobber', attackInterval: 2800, damage: 65, projectile: 'ice-melon', splash: 40, effect: 'slow' },
  { id: 'P16', name: '辣椒', emoji: '🌶️', cost: 125, cooldown: 30000, hp: 999, kind: 'rowBomb', blastDamage: 999 },
  { id: 'P17', name: '土豆地雷', emoji: '🧨', readyEmoji: '💣', cost: 25, cooldown: 22000, hp: 300, kind: 'mine', armTime: 8000, blastDamage: 700 },
  { id: 'P18', name: '南瓜罩', emoji: '🎃', cost: 125, cooldown: 20000, hp: 2500, kind: 'wall' },
  { id: 'P19', name: '大嘴花', emoji: '🌺', cost: 150, cooldown: 18000, hp: 400, kind: 'chomper', attackInterval: 6500, damage: 999 },
  { id: 'P20', name: '星星果', emoji: '⭐', cost: 125, cooldown: 9000, hp: 300, kind: 'star', attackInterval: 1700, damage: 18, projectile: 'star' },
  { id: 'P21', name: '毒菇', emoji: '☠️', cost: 75, cooldown: 9000, hp: 250, kind: 'shooter', attackInterval: 1900, damage: 12, projectile: 'poison', effect: 'poison' },
  { id: 'P22', name: '磁力菇', emoji: '🧲', cost: 125, cooldown: 18000, hp: 300, kind: 'magnet', attackInterval: 7000 },
  { id: 'P23', name: '咖啡豆', emoji: '☕', cost: 75, cooldown: 12000, hp: 180, kind: 'aura', aura: 'haste', attackInterval: 1000 },
  { id: 'P24', name: '蘆葦閃電', emoji: '⚡', cost: 175, cooldown: 13000, hp: 300, kind: 'chain', attackInterval: 2100, damage: 35, chains: 3 },
  { id: 'P25', name: '竹刺炮', emoji: '🎋', cost: 175, cooldown: 11000, hp: 320, kind: 'shooter', attackInterval: 1900, damage: 25, projectile: 'pierce', pierce: 3 },
  { id: 'P26', name: '回力花', emoji: '🪃', cost: 125, cooldown: 10000, hp: 300, kind: 'boomerang', attackInterval: 2200, damage: 28, pierce: 2 },
  { id: 'P27', name: '治療草', emoji: '💚', cost: 100, cooldown: 16000, hp: 280, kind: 'healer', attackInterval: 3000, heal: 80 },
  { id: 'P28', name: '寒霜薄荷', emoji: '🪻', cost: 175, cooldown: 24000, hp: 300, kind: 'freezeAura', attackInterval: 2500, damage: 10 },
  { id: 'P29', name: '風車草', emoji: '🌀', cost: 150, cooldown: 15000, hp: 300, kind: 'shooter', attackInterval: 2100, damage: 18, projectile: 'wind', effect: 'knockback' },
  { id: 'P30', name: '金盞花', emoji: '🏵️', cost: 75, cooldown: 9000, hp: 260, kind: 'sun', produceInterval: 14000, sunValue: 15, scoreValue: 120 },
  { id: 'P31', name: '火焰西瓜', emoji: '🍈', cost: 425, cooldown: 18000, hp: 300, kind: 'lobber', attackInterval: 2800, damage: 65, projectile: 'fire-melon', splash: 40, effect: 'burn' },
  { id: 'P32', name: '高大堅果', emoji: '🪵', cost: 150, cooldown: 25000, hp: 8000, kind: 'wall', tall: true }
];

const ZombieDefs = {
  Z01: { name: '普通殭屍', emoji: '🧟', hp: 150, speed: .35, damage: 100, score: 100 },
  Z02: { name: '路障殭屍', emoji: '🚧', hp: 560, armor: 180, speed: .35, damage: 100, score: 180 },
  Z03: { name: '鐵桶殭屍', emoji: '🪣', hp: 1100, armor: 500, speed: .35, damage: 100, score: 260 },
  Z04: { name: '旗手殭屍', emoji: '🚩', hp: 200, speed: .42, damage: 100, score: 130 },
  Z05: { name: '撐竿殭屍', emoji: '🏃', hp: 250, speed: .5, damage: 100, score: 180, jumper: true },
  Z06: { name: '巨人殭屍', emoji: '💪', hp: 1600, speed: .28, damage: 180, score: 500 },
  Z07: { name: '舞者殭屍', emoji: '🕺', hp: 200, speed: .28, damage: 100, score: 220, dancer: true },
  Z08: { name: '潛地殭屍', emoji: '🕳️', hp: 200, speed: .18, damage: 150, score: 260, damageTakenMultiplier: .5 },
  Z09: { name: '報紙殭屍', emoji: '📰', hp: 380, armor: 120, speed: .38, damage: 100, score: 170, rageAt: .45, rageSpeed: .72 },
  Z10: { name: '橄欖球殭屍', emoji: '🏈', hp: 1300, armor: 420, speed: .55, damage: 130, score: 360 },
  Z11: { name: '氣球殭屍', emoji: '🎈', hp: 260, speed: .62, damage: 80, score: 210, flying: true },
  Z12: { name: '小鬼殭屍', emoji: '👶', hp: 100, speed: .75, damage: 70, score: 90 },
  Z13: { name: '礦工殭屍', emoji: '⛏️', hp: 500, speed: .58, damage: 120, score: 260, tunnel: true },
  Z14: { name: '雪橇殭屍', emoji: '🛷', hp: 700, speed: .68, damage: 110, score: 300, iceResist: true, fireWeak: true },
  Z15: { name: '巫師殭屍', emoji: '🧙', hp: 450, speed: .32, damage: 80, score: 320, ranged: true },
  Z16: { name: '盾牌殭屍', emoji: '🛡️', hp: 900, armor: 700, speed: .28, damage: 120, score: 340 },
  Z17: { name: '毒霧殭屍', emoji: '🧪', hp: 520, speed: .36, damage: 95, score: 300, poisonAura: true },
  Z18: { name: '火焰殭屍', emoji: '🔥', hp: 480, speed: .44, damage: 140, score: 310, fireResist: true, iceWeak: true },
  Z19: { name: '治療殭屍', emoji: '🩹', hp: 380, speed: .34, damage: 70, score: 330, healer: true },
  Z20: { name: '王冠殭屍', emoji: '👑', hp: 2200, armor: 600, speed: .25, damage: 220, score: 900, boss: true }
};

function addWave(base, extra) {
  const wave = { ...base };
  Object.entries(extra).forEach(([type, count]) => {
    if (count > 0) wave[type] = (wave[type] || 0) + count;
  });
  return wave;
}

function generateLevel(level) {
  const tier = Math.floor((level - 1) / 10);
  const hard = level - 1;
  const waveCount = 8 + Math.min(6, Math.floor(hard / 7));
  const firstHuge = Math.max(4, Math.floor(waveCount * .48));
  const secondHuge = waveCount;
  const waves = [];

  for (let wave = 1; wave <= waveCount; wave++) {
    const beforeFirstHuge = wave < firstHuge;
    const huge = wave === firstHuge || wave === secondHuge;
    const pressure = hard * .45 + wave * .8 + tier * 1.8;
    const normalCount = beforeFirstHuge ? 1 + Math.floor((wave - 1) / 3) : 2 + Math.floor(pressure / 3.2);
    const pack = { Z01: Math.max(1, normalCount) };

    if (beforeFirstHuge) {
      if (level >= 12 && wave >= firstHuge - 1) pack.Z02 = 1;
      if (level >= 30 && wave === firstHuge - 1) pack.Z04 = 1;
    } else {
      pack.Z02 = Math.max(0, Math.floor((pressure - 4) / 4));
      if (level >= 11) pack.Z03 = Math.max(0, Math.floor((pressure - 12) / 6));
      if (level >= 4 && wave % 4 === 0) pack.Z04 = 1 + Math.floor(tier / 2);
      if (level >= 16 && wave % 3 === 0) pack.Z05 = 1 + Math.floor((level - 16) / 12);
      if (level >= 21 && wave % 5 === 0) pack.Z07 = 1 + Math.floor((level - 21) / 15);
      if (level >= 31 && wave % 4 === 1) pack.Z08 = 1 + Math.floor((level - 31) / 12);
      if (level >= 36 && (huge || wave % 6 === 0)) pack.Z06 = huge ? 1 + Math.floor((level - 36) / 8) : 1;
      if (level >= 8 && wave % 3 === 1) pack.Z09 = 1 + Math.floor((level - 8) / 14);
      if (level >= 14 && wave % 5 === 2) pack.Z11 = 1 + Math.floor((level - 14) / 16);
      if (level >= 18 && wave % 4 === 2) pack.Z12 = 1 + Math.floor((level - 18) / 18);
      if (level >= 22 && wave % 6 === 3) pack.Z10 = 1 + Math.floor((level - 22) / 16);
      if (level >= 25 && wave % 5 === 3) pack.Z13 = 1 + Math.floor((level - 25) / 18);
      if (level >= 28 && wave % 6 === 4) pack.Z14 = 1 + Math.floor((level - 28) / 18);
      if (level >= 32 && wave % 5 === 4) pack.Z15 = 1 + Math.floor((level - 32) / 20);
      if (level >= 34 && wave % 7 === 2) pack.Z16 = 1 + Math.floor((level - 34) / 18);
      if (level >= 38 && wave % 5 === 0) pack.Z17 = 1 + Math.floor((level - 38) / 16);
      if (level >= 40 && wave % 6 === 1) pack.Z18 = 1 + Math.floor((level - 40) / 16);
      if (level >= 43 && wave % 7 === 4) pack.Z19 = 1 + Math.floor((level - 43) / 16);
      if (level >= 48 && huge) pack.Z20 = 1;
    }

    waves.push(huge ? addWave(pack, {
      Z01: 3 + tier * 2 + Math.floor(level / 8),
      Z02: 2 + tier,
      Z03: level >= 12 ? 1 + Math.floor((level - 12) / 10) : 0,
      Z05: level >= 18 ? 1 + Math.floor((level - 18) / 14) : 0,
      Z06: level >= 38 ? 1 + Math.floor((level - 38) / 8) : 0,
      Z08: level >= 34 ? 1 : 0,
      Z10: level >= 24 ? 1 + Math.floor((level - 24) / 15) : 0,
      Z11: level >= 16 ? 1 + Math.floor((level - 16) / 18) : 0,
      Z14: level >= 30 ? 1 + Math.floor((level - 30) / 15) : 0,
      Z16: level >= 36 ? 1 + Math.floor((level - 36) / 14) : 0,
      Z18: level >= 42 ? 1 : 0,
      Z19: level >= 45 ? 1 : 0,
      Z20: level >= 50 && wave === secondHuge ? 1 : 0
    }) : pack);
  }
  return { waves, hugeWaves: [firstHuge, secondHuge] };
}

const Levels = Object.fromEntries(
  Array.from({ length: MAX_LEVEL }, (_, i) => [i + 1, generateLevel(i + 1)])
);
