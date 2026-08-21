'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// The production scripts intentionally use classic browser globals so file:// works.
// This tiny harness supplies only the browser APIs needed by the pure domain modules.
global.window = global;
Object.defineProperty(global, 'navigator', { value: { language: 'zh-TW' }, configurable: true });
global.document = { documentElement: { lang: 'zh-Hant' } };
const memory = new Map();
global.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear()
};

const root = path.resolve(__dirname, '..');
const scripts = [
  'js/core/namespace.js',
  'js/core/constants.js',
  'js/utils/math.js',
  'js/utils/rng.js',
  'js/utils/validator.js',
  'js/utils/formatter.js',
  'js/core/eventBus.js',
  'js/data/speciesData.js',
  'js/data/equipmentData.js',
  'js/data/consumableData.js',
  'js/data/abilityCandyData.js',
  'js/data/rivalData.js',
  'js/data/eventData.js',
  'js/i18n/lang-zh.js',
  'js/i18n/lang-en.js',
  'js/i18n/lang-ja.js',
  'js/i18n/featureLocales.js',
  'js/i18n/bossLocales.js',
  'js/i18n/i18n.js',
  'js/economy/equipmentManager.js',
  'js/pet/statCalculator.js',
  'js/economy/abilityCandyManager.js',
  'js/pet/progression.js',
  'js/economy/experienceManager.js',
  'js/pet/affection.js',
  'js/ranking/rankingGenerator.js',
  'js/ranking/matchmaking.js',
  'js/ranking/rankingManager.js',
  'js/core/gameState.js',
  'js/storage/migrationManager.js',
  'js/storage/saveManager.js',
  'js/economy/shopManager.js',
  'js/economy/inventoryManager.js',
  'js/economy/bankManager.js',
  'js/pet/dailyActions.js',
  'js/pet/petModel.js',
  'js/pet/playManager.js',
  'js/pet/outingManager.js',
  'js/training/trainingManager.js',
  'js/training/strengthGame.js',
  'js/training/enduranceGame.js',
  'js/training/agilityGame.js',
  'js/battle/damageCalculator.js',
  'js/battle/effectManager.js',
  'js/battle/battleAI.js',
  'js/battle/bossManager.js',
  'js/battle/battleEngine.js'
];
scripts.forEach((file) => vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file }));

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}
function fresh(species = 'lion') {
  memory.clear();
  const save = PSG.core.gameState.create('Trainer', 'Buddy', species, 123456789);
  PSG.core.gameState.set(save, 1);
  return save;
}
function movePlayerToRankOne(save) {
  const playerIndex = save.ranking.rankOrder.indexOf('player');
  const topId = save.ranking.rankOrder[0];
  save.ranking.rankOrder[playerIndex] = topId;
  save.ranking.rankOrder[0] = 'player';
  PSG.ranking.matchmaking.refresh(save);
  return save;
}

test('name validation counts Unicode code points and trims whitespace', () => {
  assert.equal(PSG.utils.validator.name('  小獅丸  ').value, '小獅丸');
  assert.equal(PSG.utils.validator.name('😀'.repeat(12)).valid, true);
  assert.equal(PSG.utils.validator.name('😀'.repeat(13)).reason, 'tooLong');
  assert.equal(PSG.utils.validator.name('a\nb').valid, false);
});

test('natural stats match the level 1, 50, and 100 formulas', () => {
  assert.deepEqual(PSG.pet.stats.natural('eagle', 1), {
    hp: 100,
    attack: 16,
    accuracy: 16,
    defense: 10,
    mobility: 18,
    spAttack: 12,
    spDefense: 10,
    speed: 18
  });
  assert.equal(PSG.pet.stats.natural('lion', 50).attack, Math.round(18 + 1.05 * 49));
  assert.deepEqual(PSG.pet.stats.natural('crocodile', 100), {
    hp: 585,
    attack: 90,
    accuracy: 64,
    defense: 122,
    mobility: 49,
    spAttack: 90,
    spDefense: 122,
    speed: 56
  });
});

test('species positioning is preserved at equal levels', () => {
  const all = ['eagle', 'lion', 'crocodile'].map((id) => PSG.pet.stats.natural(id, 70));
  assert.ok(all[0].accuracy > all[1].accuracy && all[1].accuracy > all[2].accuracy);
  assert.ok(all[0].mobility > all[1].mobility && all[0].speed > all[1].speed);
  assert.ok(all[1].attack > all[0].attack && all[1].spAttack > all[0].spAttack);
  assert.ok(all[2].hp > all[1].hp && all[2].defense > all[1].defense && all[2].spDefense > all[1].spDefense);
});

test('mastery 20 provides exactly +10 percent before flooring', () => {
  const save = fresh('eagle');
  save.pet.mastery.attack.level = 20;
  assert.equal(PSG.pet.stats.effective(save).attack, Math.floor(16 * 1.1));
});

test('mastery scales level-up growth from 1x to 3x', () => {
  assert.equal(PSG.pet.stats.masteryGrowthMultiplier(0), 1);
  assert.equal(PSG.pet.stats.masteryGrowthMultiplier(20), 3);
  const low = fresh('eagle');
  low.pet.level = 20;
  const high = fresh('eagle');
  high.pet.level = 20;
  high.pet.mastery.attack.level = 20;
  assert.ok(PSG.pet.stats.effective(high).attack > PSG.pet.stats.effective(low).attack);
});

test('affection thresholds provide 0/1/2/3/5 percent', () => {
  assert.deepEqual([0, 20, 40, 60, 80, 100].map(PSG.pet.stats.affectionBonus), [0, 0.01, 0.02, 0.03, 0.03, 0.05]);
});

test('affection scenes queue once and their rewards are idempotent', () => {
  const save = fresh('eagle');
  PSG.pet.affection.add(save, 20);
  assert.deepEqual(save.progression.pendingAffectionEvents, ['eagle_affection_20']);
  assert.equal(PSG.pet.affection.markViewed(save, 'eagle_affection_20'), true);
  assert.equal(save.player.coins, 100);
  assert.ok(save.progression.unlockedCosmetics.includes('eagle_sticker_1'));
  assert.equal(PSG.pet.affection.markViewed(save, 'eagle_affection_20'), false);
  assert.equal(save.player.coins, 100);
});

test('XP can overflow across multiple levels', () => {
  const save = fresh();
  const result = PSG.pet.progression.addXp(save, 500);
  assert.equal(result.levels, 4);
  assert.equal(save.pet.level, 5);
  assert.equal(save.pet.xp, 28);
});

test('level 100 is capped and shows no retained XP', () => {
  const save = fresh();
  save.pet.level = 99;
  save.pet.xp = 0;
  PSG.pet.progression.addXp(save, 10000);
  assert.equal(save.pet.level, 100);
  assert.equal(save.pet.xp, 0);
});

test('mastery XP overflows and caps at level 20', () => {
  const save = fresh();
  PSG.pet.progression.addMastery(save, 'hp', 100000);
  assert.equal(save.pet.mastery.hp.level, 20);
  assert.equal(save.pet.mastery.hp.xp, 0);
});

test('mood reward multipliers use exact thresholds', () => {
  assert.deepEqual([0, 29, 30, 69, 70, 100].map(PSG.pet.daily.moodMultiplier), [0.75, 0.75, 1, 1, 1.1, 1.1]);
});

test('daily activities reject insufficient AP, stamina, and mood', () => {
  const save = fresh();
  save.day.actionPoints = 0;
  assert.equal(PSG.pet.daily.can(save, 'training').reason, 'ap');
  save.day.actionPoints = 7;
  save.pet.energy = 10;
  assert.equal(PSG.pet.daily.can(save, 'training').reason, 'energy');
  save.pet.energy = 80;
  save.pet.mood = 19;
  assert.equal(PSG.pet.daily.can(save, 'battle').reason, 'mood');
});

test('status values are clamped after activities and rest', () => {
  const save = fresh();
  save.pet.mood = 99;
  save.pet.affection = 99;
  PSG.pet.daily.applyFixed(save, 'play');
  assert.equal(save.pet.mood, 100);
  assert.equal(save.pet.affection, 100);
  PSG.pet.daily.nextDay(save);
  assert.equal(save.day.actionPoints, 7);
  assert.ok(save.pet.energy <= 100);
});

test('training grade boundaries and score helpers are exact', () => {
  assert.equal(PSG.training.manager.gradeFor(85).id, 'gold');
  assert.equal(PSG.training.manager.gradeFor(60).id, 'silver');
  assert.equal(PSG.training.manager.gradeFor(59).id, 'bronze');
  assert.equal(PSG.training.strength.scoreAt(0.5), 100);
  assert.equal(PSG.training.endurance.scoreAt(0.72), 100);
  assert.equal(PSG.training.manager.feedbackFor(90).id, 'perfect');
  assert.equal(PSG.training.manager.feedbackFor(60).id, 'great');
  assert.equal(PSG.training.manager.feedbackFor(59).id, 'keep');
  assert.equal(PSG.training.manager.templateFor('accuracy'), 'agility');
});

test('gold training settlement applies grade and mood multipliers', () => {
  const save = fresh();
  const result = PSG.training.manager.settle(save, 'attack', 100);
  assert.equal(result.xp.gained, 45);
  assert.equal(result.mastery.gained, 30);
  assert.equal(save.day.actionPoints, 6);
  assert.equal(save.pet.energy, 60);
});

test('equipment, consumable, and event catalog sizes match the specification', () => {
  assert.equal(PSG.data.equipment.length, 36);
  assert.equal(PSG.data.mythicEquipment.length, 3);
  assert.deepEqual(PSG.data.mythicEquipment[0].bonuses, { hp: 0.18, defense: 0.09, spDefense: 0.09 });
  assert.deepEqual(PSG.data.mythicEquipment[1].bonuses, { attack: 0.09, spAttack: 0.09, accuracy: 0.06 });
  assert.deepEqual(PSG.data.mythicEquipment[2].bonuses, { speed: 0.07, mobility: 0.075, crit: 0.2 });
  assert.equal(PSG.data.consumables.length, 18);
  assert.equal(PSG.data.abilityCandies.length, 8);
  assert.equal(PSG.data.events.length, 24);
  PSG.data.equipment
    .concat(PSG.data.consumables)
    .forEach((item) => assert.ok(fs.existsSync(path.join(root, item.image)), `missing ${item.image}`));
});

test('each outing location has eight events totaling weight 100', () => {
  PSG.data.outingLocations.forEach((location) => {
    const rows = PSG.data.events.filter((event) => event.location === location);
    assert.equal(rows.length, 8);
    assert.equal(
      rows.reduce((sum, event) => sum + event.weight, 0),
      100
    );
  });
});

test('six equipment stage thresholds unlock from best rank permanently', () => {
  assert.equal(PSG.economy.equipment.isStageUnlocked(1, 1000), true);
  assert.equal(PSG.economy.equipment.isStageUnlocked(2, 751), false);
  assert.equal(PSG.economy.equipment.isStageUnlocked(2, 750), true);
  assert.equal(PSG.economy.equipment.isStageUnlocked(6, 25), true);
});

test('luck emblems respect normal critical-rate cap', () => {
  const save = fresh();
  save.economy.equipped.emblem = 'eq_6_fortune';
  assert.equal(PSG.pet.stats.critRate(save), 0.2);
  assert.equal(PSG.pet.stats.critRate(save, null, true), 0.3);
});

test('reaching rank one grants the three Mythic items exactly once', () => {
  const save = fresh();
  const playerIndex = save.ranking.rankOrder.indexOf('player');
  const rankOneId = save.ranking.rankOrder[0];
  save.ranking.rankOrder[playerIndex] = save.ranking.rankOrder[1];
  save.ranking.rankOrder[1] = 'player';
  PSG.ranking.matchmaking.refresh(save);
  const result = PSG.ranking.manager.settle(save, rankOneId, true);
  assert.equal(result.after, 1);
  assert.deepEqual(result.mythicEquipment, ['mythic_armor', 'mythic_accessory', 'mythic_emblem']);
  assert.deepEqual(save.economy.ownedEquipment, result.mythicEquipment);
  assert.deepEqual(save.economy.equipmentUpgrades, {
    mythic_armor: 0,
    mythic_accessory: 0,
    mythic_emblem: 0
  });
  assert.deepEqual(PSG.economy.equipment.grantMythic(save), []);
});

test('Mythic gear supports escalating batch upgrades while CRIT stays fixed', () => {
  const save = fresh('eagle');
  PSG.economy.equipment.grantMythic(save);
  save.player.coins = 100000;
  assert.equal(PSG.economy.equipment.upgradePreview(save, 'mythic_accessory', 1).reason, 'notEquipped');
  save.economy.equipped.accessory = 'mythic_accessory';
  save.economy.equipped.emblem = 'mythic_emblem';
  const preview = PSG.economy.equipment.upgradePreview(save, 'mythic_accessory', 3);
  assert.equal(preview.price, 33000);
  assert.equal(preview.afterLevel, 3);
  assert.equal(preview.nextPrice, 13000);
  assert.equal(PSG.economy.equipment.upgradePreview(save, 'mythic_accessory', 1000).quantity, 999);
  const result = PSG.economy.equipment.upgrade(save, 'mythic_accessory', 3);
  assert.equal(result.ok, true);
  assert.equal(save.player.coins, 67000);
  assert.equal(PSG.economy.equipment.upgradeLevel(save, 'mythic_accessory'), 3);

  const emblemResult = PSG.economy.equipment.upgrade(save, 'mythic_emblem', 5);
  assert.equal(emblemResult.ok, true);
  const gear = PSG.economy.equipment.bonuses(save.economy.equipped, save.economy.equipmentUpgrades);
  assert.equal(gear.attack, 0.093);
  assert.equal(gear.spAttack, 0.093);
  assert.equal(gear.accuracy, 0.063);
  assert.ok(Math.abs(gear.speed - 0.075) < 1e-12);
  assert.ok(Math.abs(gear.mobility - 0.08) < 1e-12);
  assert.equal(gear.crit, 0.2);
  assert.equal(PSG.economy.equipment.upgrade(save, 'eq_1_vital', 1).reason, 'notMythic');

  const poor = fresh();
  PSG.economy.equipment.grantMythic(poor);
  poor.economy.equipped.armor = 'mythic_armor';
  assert.equal(PSG.economy.equipment.upgrade(poor, 'mythic_armor', 1).reason, 'coins');
  assert.equal(PSG.economy.equipment.upgradeLevel(poor, 'mythic_armor'), 0);
});

test('ranking always has 1,000 distinct IDs and one player', () => {
  const save = fresh();
  assert.equal(save.ranking.rankOrder.length, 1000);
  assert.equal(new Set(save.ranking.rankOrder).size, 1000);
  assert.equal(save.ranking.rankOrder.filter((id) => id === 'player').length, 1);
});

test('all 12 milestone rivals occupy their fixed ranks', () => {
  const save = fresh();
  PSG.data.rivals.forEach((rival) => assert.equal(save.ranking.rankOrder[rival.rank - 1], rival.id));
});

test('same ranking seed yields identical AI identity and configuration', () => {
  const a = PSG.ranking.generator.getAI('ai_0421', 99, 'en');
  const b = PSG.ranking.generator.getAI('ai_0421', 99, 'en');
  assert.equal(a.name, b.name);
  assert.equal(a.speciesId, b.speciesId);
  assert.equal(a.bp, b.bp);
});

test('AI names are unique and every 30-rank species window stays balanced', () => {
  const save = fresh();
  const species = save.ranking.rankOrder
    .slice(0, 999)
    .map((id) => PSG.ranking.generator.getAI(id, save.ranking.rankingSeed, 'en').speciesId);
  const names = save.ranking.rankOrder
    .slice(0, 999)
    .map((id) => PSG.ranking.generator.getAI(id, save.ranking.rankingSeed, 'en').name);
  assert.equal(new Set(names).size, 999);
  for (let start = 0; start <= species.length - 30; start += 1) {
    const counts = ['eagle', 'lion', 'crocodile'].map(
      (id) => species.slice(start, start + 30).filter((value) => value === id).length
    );
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 3, `unbalanced window at rank ${start + 1}`);
  }
});

test('AI levels are deterministic and fixed to their original ranks', () => {
  assert.equal(PSG.ranking.generator.levelForRank(999), 1);
  assert.equal(PSG.ranking.generator.levelForRank(1), 100);
  for (let rank = 2; rank <= 999; rank += 1)
    assert.ok(PSG.ranking.generator.levelForRank(rank) <= PSG.ranking.generator.levelForRank(rank - 1));
  const ai = PSG.ranking.generator.getAI('ai_0421', 123, 'en');
  assert.equal(ai.level, PSG.ranking.generator.levelForRank(421));
});

test('candidate matching returns five unique opponents at rank 1000 and rank 1', () => {
  const save = fresh();
  let rows = PSG.ranking.matchmaking.candidates(save);
  assert.equal(rows.length, 5);
  assert.equal(new Set(rows.map((row) => row.id)).size, 5);
  const first = save.ranking.rankOrder[0];
  save.ranking.rankOrder[0] = 'player';
  save.ranking.rankOrder[999] = first;
  rows = PSG.ranking.matchmaking.candidates(save);
  assert.equal(rows.length, 5);
  assert.ok(rows.every((row) => row.rank > 1));
});

test('mid-table candidate matching uses three higher and two lower ranks', () => {
  const save = fresh();
  const displaced = save.ranking.rankOrder[499];
  save.ranking.rankOrder[499] = 'player';
  save.ranking.rankOrder[999] = displaced;
  const rows = PSG.ranking.matchmaking.candidates(save);
  assert.equal(rows.filter((row) => row.rank < 500).length, 3);
  assert.equal(rows.filter((row) => row.rank > 500).length, 2);
  assert.ok(rows.every((row) => Math.abs(row.rank - 500) <= 12));
});

test('rank one unlocks all three endless Boss species with growing stats and random arenas', () => {
  const save = fresh('lion');
  assert.equal(PSG.battle.boss.isUnlocked(save), false);
  movePlayerToRankOne(save);
  assert.equal(PSG.battle.boss.isUnlocked(save), true);
  const plan = PSG.battle.boss.preview(save);
  assert.equal(plan.stage, 1);
  assert.equal(plan.attempt, 1);
  assert.ok(['grassland', 'swamp', 'sky'].includes(plan.arena.id));
  const bosses = PSG.battle.boss.speciesIds().map((speciesId) => PSG.battle.boss.create(save, speciesId));
  assert.deepEqual(
    bosses.map((boss) => boss.opponent.speciesId),
    ['lion', 'crocodile', 'eagle']
  );
  assert.ok(bosses.every((boss) => boss.opponent.boss && boss.opponent.level === 100));
  assert.ok(bosses.every((boss) => boss.opponent.stats.hp > 800));

  save.progression.bossWins = 4;
  const stronger = PSG.battle.boss.create(save, 'lion');
  assert.equal(stronger.stage, 5);
  assert.ok(stronger.opponent.stats.attack > bosses[0].opponent.stats.attack);
});

test('Boss arenas protect their native species and damage others by three percent', () => {
  const arena = PSG.battle.boss.arenas().find((item) => item.id === 'grassland');
  const state = {
    arena,
    logs: [],
    player: { id: 'player', speciesId: 'eagle', hp: 1000, maxHp: 1000 },
    enemy: { id: 'boss', speciesId: 'lion', hp: 1000, maxHp: 1000 }
  };
  const events = PSG.battle.boss.arenaTick(state);
  assert.equal(events.length, 1);
  assert.equal(state.player.hp, 970);
  assert.equal(state.enemy.hp, 1000);
  assert.equal(events[0].damage, 30);
});

test('Boss victories award large rewards, advance the endless stage, and skip XP at max level', () => {
  const save = movePlayerToRankOne(fresh('lion'));
  const challenge = PSG.battle.boss.create(save, 'lion');
  assert.equal(PSG.battle.boss.begin(save, challenge).ok, true);
  const beforeCoins = save.player.coins;
  const reward = PSG.battle.boss.settle(save, challenge, true);
  assert.equal(reward.won, true);
  assert.equal(reward.stage, 1);
  assert.equal(reward.coins, 1200);
  assert.ok(reward.xp.gained > 0);
  assert.equal(save.progression.bossWins, 1);
  assert.equal(save.progression.bossAttempts, 1);
  assert.equal(save.player.coins, beforeCoins + 1200);

  save.pet.level = 100;
  const next = PSG.battle.boss.create(save, 'eagle');
  const maxReward = PSG.battle.boss.settle(save, next, true);
  assert.equal(maxReward.xp.gained, 0);
  assert.equal(PSG.battle.boss.candyDropRate, 0.01);
});

test('Boss battle mode uses 80 rounds while ranked battles remain at 20', () => {
  const save = movePlayerToRankOne(fresh('lion'));
  const challenge = PSG.battle.boss.create(save, 'lion');
  const bossState = PSG.battle.engine.create(save, challenge.opponent, null, 7, {
    mode: 'boss',
    arena: challenge.arena,
    bossChallenge: challenge
  });
  const ranked = PSG.battle.engine.create(save, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'));
  assert.equal(bossState.maxRounds, 80);
  assert.equal(ranked.maxRounds, 20);
  assert.equal(bossState.mode, 'boss');
  assert.equal(bossState.arena.id, challenge.arena.id);
});

test('Boss battle entry and settlement persist the attempt and rewards', () => {
  const save = movePlayerToRankOne(fresh('lion'));
  save.pet.energy = 100;
  save.pet.mood = 100;
  const challenge = PSG.battle.boss.create(save, 'crocodile');
  const state = PSG.battle.engine.create(save, challenge.opponent, null, 8, {
    mode: 'boss',
    arena: challenge.arena,
    bossChallenge: challenge
  });
  assert.equal(PSG.battle.engine.start(state).ok, true);
  assert.equal(save.day.actionPoints, 7);
  assert.equal(save.pet.energy, 95);
  assert.equal(save.progression.bossAttempts, 1);
  state.ended = true;
  state.winnerId = 'player';
  const result = PSG.battle.engine.settle(state);
  assert.equal(result.boss, true);
  assert.equal(save.stats.bossChallenges, 1);
  assert.equal(save.stats.bossWins, 1);
  assert.equal(PSG.storage.save.read(1).progression.bossWins, 1);
});

test('daily coin income follows rank stages with the requested 300 percent increase', () => {
  const save = fresh();
  assert.equal(PSG.pet.daily.dailyCoins(save), 120);
  const bronzeId = save.ranking.rankOrder[749];
  save.ranking.rankOrder[749] = 'player';
  save.ranking.rankOrder[999] = bronzeId;
  assert.equal(PSG.pet.daily.dailyCoins(save), 240);
  const championId = save.ranking.rankOrder[0];
  save.ranking.rankOrder[0] = 'player';
  save.ranking.rankOrder[749] = championId;
  assert.equal(PSG.pet.daily.dailyCoins(save), 720);
  const before = save.player.coins;
  const result = PSG.pet.daily.nextDay(save);
  assert.equal(result.coins, 720);
  assert.equal(save.player.coins, before + 720);
});

test('daily AP scales by level tiers and Boss battles do not spend AP', () => {
  const save = fresh('lion');
  [
    [1, 7],
    [30, 7],
    [31, 10],
    [50, 10],
    [51, 12],
    [75, 12],
    [76, 15],
    [100, 15]
  ].forEach(([level, expected]) => assert.equal(PSG.pet.daily.maxActionPoints(level), expected));

  movePlayerToRankOne(save);
  save.pet.energy = 100;
  save.pet.mood = 100;
  save.pet.level = 50;
  save.day.actionPoints = 0;
  const challenge = PSG.battle.boss.create(save, 'lion');
  const state = PSG.battle.engine.create(save, challenge.opponent, null, 22, {
    mode: 'boss',
    arena: challenge.arena,
    bossChallenge: challenge
  });
  assert.equal(PSG.battle.engine.start(state).ok, true);
  assert.equal(save.day.actionPoints, 0);
  assert.equal(save.pet.energy, 95);
  assert.equal(PSG.battle.engine.cancel(state).ok, true);
  assert.equal(save.day.actionPoints, 0);
  assert.equal(save.pet.energy, 100);
});

test('home mood dialogue uses seeded variants and preserves all mood states', () => {
  const save = fresh();
  const high = PSG.pet.model.talkKey(save, 'high');
  assert.match(high, /^home\.talk\.high\.[1-4]$/);
  assert.equal(PSG.pet.model.talkKey(save, 'high'), high);
  save.pet.mood = 50;
  assert.match(PSG.pet.model.talkKey(save), /^home\.talk\.mid\.[1-4]$/);
  save.pet.mood = 10;
  assert.match(PSG.pet.model.talkKey(save), /^home\.talk\.low\.[1-4]$/);
});

test('savings account deposits and withdrawals keep coins and balance in sync', () => {
  const save = fresh();
  save.player.coins = 1000;
  assert.equal(PSG.economy.bank.deposit(save, 350).ok, true);
  assert.equal(save.player.coins, 650);
  assert.equal(PSG.economy.bank.balance(save), 350);
  assert.equal(PSG.economy.bank.deposit(save, 700).reason, 'coins');
  assert.equal(PSG.economy.bank.withdraw(save, 125).ok, true);
  assert.equal(save.player.coins, 775);
  assert.equal(PSG.economy.bank.balance(save), 225);
  assert.equal(PSG.economy.bank.withdraw(save, 300).reason, 'savings');
  assert.equal(PSG.economy.bank.deposit(save, 0).reason, 'amount');
});

test('rest pays one percent savings interest into hand-held coins', () => {
  const save = fresh();
  save.economy.savings.balance = 1000;
  const result = PSG.pet.daily.nextDay(save);
  assert.equal(result.interest, 10);
  assert.equal(PSG.economy.bank.balance(save), 1000);
  assert.equal(save.player.coins, 130);
});

test('winning against a higher rank swaps positions; losing does not', () => {
  const save = fresh();
  const opponent = save.ranking.rankOrder[998];
  let result = PSG.ranking.manager.settle(save, opponent, false);
  assert.equal(result.after, 1000);
  result = PSG.ranking.manager.settle(save, opponent, true);
  assert.equal(result.after, 999);
  assert.equal(save.ranking.rankOrder[999], opponent);
});

test('damage formula reproduces the documented level-50 example', () => {
  const normal = PSG.battle.damage.calculate({
    level: 50,
    power: 80,
    attack: 75,
    defense: 70,
    variance: 1.02,
    critical: false
  });
  const critical = PSG.battle.damage.calculate({
    level: 50,
    power: 80,
    attack: 75,
    defense: 70,
    variance: 1.02,
    critical: true
  });
  assert.equal(normal.damage, 40);
  assert.equal(critical.damage, 70);
});

test('damage variance is clamped and damage never falls below one', () => {
  const low = PSG.battle.damage.calculate({
    level: 1,
    power: 1,
    attack: 0,
    defense: 999,
    variance: 0,
    critical: false
  });
  assert.equal(low.damage, 1);
  assert.equal(low.variance, 0.95);
});

test('evasion follows the formula and never exceeds 40 percent', () => {
  assert.equal(PSG.battle.damage.evasion(9999, 1, 1), 0.4);
  const value = PSG.battle.damage.evasion(12, 1, 1);
  assert.ok(Math.abs(value - 0.18) < 1e-12);
  assert.ok(Math.abs(PSG.battle.damage.evasion(12, 1, 0.5) - 0.09) < 1e-12);
});

test('accuracy counters mobility and guarantees a hit at double mobility', () => {
  assert.equal(PSG.battle.damage.accuracyRatio(50, 50), 0.5);
  assert.equal(PSG.battle.damage.accuracyRatio(100, 50), 1);
  assert.ok(Math.abs(PSG.battle.damage.evasion(12, 1, 1, 0) - 0.18) < 1e-12);
  assert.ok(Math.abs(PSG.battle.damage.evasion(12, 1, 1, 12) - 0.09) < 1e-12);
  assert.equal(PSG.battle.damage.evasion(12, 1, 1, 24), 0);
  assert.equal(PSG.battle.damage.hitChance(24, 12, 1), 1);
});

test('battle energy starts, gains, spends, and clamps correctly', () => {
  const save = fresh('lion');
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 4);
  PSG.battle.engine.start(state);
  state.rng.next = () => 0.9;
  PSG.battle.engine.round(state, 'normal');
  assert.ok(state.player.energy === 30 || state.player.energy === 40);
  state.player.energy = 100;
  PSG.battle.engine.round(state, 'special');
  assert.ok(state.player.energy >= 0 && state.player.energy <= 10);
});

test('accuracy stat can guarantee a battle hit against mobility', () => {
  const save = fresh('eagle');
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 4);
  state.player.stats.accuracy = state.enemy.stats.mobility * 2;
  state.rng.next = () => 0.99;
  const result = PSG.battle.engine.performAttack(state, state.player, state.enemy, 'normal');
  assert.equal(result.dodged, false);
  assert.equal(result.dodgeRate, 0);
  assert.equal(result.hitRate, 1);
});

test('battle consumable is deducted only after a valid snapshot starts', () => {
  const save = fresh();
  save.economy.consumables.con_1_energy = 1;
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, 'con_1_energy', 4);
  assert.equal(save.economy.consumables.con_1_energy, 1);
  assert.equal(PSG.battle.engine.start(state).ok, true);
  assert.equal(save.economy.consumables.con_1_energy, 0);
  assert.equal(state.player.energy, 10);
});

test('Eagle special halves dodge and grants two future mobility actions on hit', () => {
  const save = fresh('eagle');
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 1);
  state.player.energy = 100;
  state.player.stats.accuracy = state.enemy.stats.mobility;
  state.rng.next = () => 0.99;
  const expected = PSG.battle.damage.evasion(
    state.enemy.stats.mobility,
    state.enemy.level,
    0.5,
    state.player.stats.accuracy
  );
  const result = PSG.battle.engine.performAttack(state, state.player, state.enemy, 'special');
  assert.equal(result.dodged, false);
  assert.equal(result.dodgeRate, expected);
  assert.equal(state.player.effects.eagleMobility, 2);
});

test('Crocodile special creates a 12 percent max-HP shield on hit', () => {
  const save = fresh('crocodile');
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 1);
  state.player.energy = 100;
  state.rng.next = () => 0.99;
  PSG.battle.engine.performAttack(state, state.player, state.enemy, 'special');
  assert.equal(state.player.shield, Math.floor(state.player.maxHp * 0.12));
  assert.equal(state.player.effects.shieldTurns, 2);
});

test('a knockout prevents the defeated second actor from attacking', () => {
  const save = fresh('lion');
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 8);
  PSG.battle.engine.start(state);
  state.player.stats.speed = 999;
  state.player.stats.attack = 99999;
  state.rng.next = () => 0.9;
  const result = PSG.battle.engine.round(state, 'normal');
  assert.equal(result.events.length, 1);
  assert.equal(state.winnerId, 'player');
});

test('round-20 tiebreak always produces one winner', () => {
  const save = fresh();
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, null, 9);
  state.player.hp = state.player.maxHp;
  state.enemy.hp = state.enemy.maxHp;
  state.player.totalDamage = state.enemy.totalDamage;
  state.player.stats.speed = state.enemy.stats.speed;
  assert.ok(['player', state.enemy.id].includes(PSG.battle.engine.decideTurnLimit(state)));
});

test('shop blocks locked items, charges coins, and prevents duplicates', () => {
  const save = fresh();
  save.player.coins = 5000;
  assert.equal(PSG.economy.shop.purchaseEquipment(save, 'eq_2_vital').reason, 'locked');
  assert.equal(PSG.economy.shop.purchaseEquipment(save, 'eq_1_vital').ok, true);
  assert.equal(PSG.economy.shop.purchaseEquipment(save, 'eq_1_vital').reason, 'owned');
});

test('ability candy price scales with intrinsic stat, candy growth, and level', () => {
  const save = fresh('eagle');
  const attack = PSG.data.abilityCandyById.candy_attack;
  const levelOnePrice = PSG.economy.candy.priceFor(save, attack);
  assert.equal(levelOnePrice, 150);
  save.pet.candyBoosts.attack = 1;
  assert.ok(PSG.economy.candy.priceFor(save, attack) > levelOnePrice);
  save.pet.level = 50;
  assert.equal(PSG.economy.candy.priceFor(save, attack), 850);
});

test('ability candy supports batch purchases up to 999 with escalating totals', () => {
  const save = fresh('lion');
  const attack = PSG.data.abilityCandyById.candy_attack;
  const quantity = 3;
  const totalPrice = PSG.economy.candy.totalPriceFor(save, attack, quantity, false);
  assert.equal(PSG.economy.candy.quantityFor(999), 999);
  assert.equal(PSG.economy.candy.quantityFor(1000), 0);
  assert.ok(totalPrice > PSG.economy.candy.priceFor(save, attack, false) * quantity);
  save.player.coins = totalPrice;
  const result = PSG.economy.shop.purchaseCandy(save, attack.id, false, quantity);
  assert.equal(result.ok, true);
  assert.equal(result.quantity, quantity);
  assert.equal(result.price, totalPrice);
  assert.equal(result.gain, attack.gain * quantity);
  assert.equal(save.pet.candyBoosts.attack, attack.gain * quantity);
  assert.equal(save.player.coins, 0);
});

test('experience shop sells discounted batches, reports level ups, and caps price', () => {
  const save = fresh('lion');
  const plan = PSG.economy.experience.preview(save, 2, true);
  assert.equal(PSG.economy.experience.quantityFor(999), 999);
  assert.equal(plan.ok, true);
  assert.equal(plan.xp, 200);
  assert.equal(plan.levels, 1);
  assert.equal(plan.price, 52);
  save.player.coins = plan.price;
  const result = PSG.economy.shop.purchaseExperience(save, true, 2);
  assert.equal(result.ok, true);
  assert.equal(result.quantity, 2);
  assert.equal(result.levels, 1);
  assert.equal(save.pet.level, 2);
  assert.equal(save.pet.xp, 100);
  assert.equal(save.player.coins, 0);

  const capped = fresh();
  capped.pet.level = 100;
  assert.equal(PSG.economy.experience.priceFor(capped, false), 400);
  assert.equal(PSG.economy.experience.priceFor(capped, true), 240);
  assert.equal(PSG.economy.experience.preview(capped, 1, false).reason, 'maxLevel');
});

test('Candy Festival halves the current regular candy price', () => {
  const save = fresh('eagle');
  const attack = PSG.data.abilityCandyById.candy_attack;
  const regularPrice = PSG.economy.candy.priceFor(save, attack, false);
  const festivalPrice = PSG.economy.candy.priceFor(save, attack, true);
  assert.equal(regularPrice, 150);
  assert.equal(festivalPrice, 75);
  assert.equal(PSG.economy.candy.isCandyFestival(save), PSG.economy.candy.isCandyFestival(save));
  save.player.coins = festivalPrice;
  const result = PSG.economy.shop.purchaseCandy(save, attack.id, true);
  assert.equal(result.ok, true);
  assert.equal(result.price, festivalPrice);
  assert.equal(save.player.coins, 0);
});

test('ability candy purchases immediately grant permanent stats and recalculate the next price', () => {
  const save = fresh('lion');
  save.player.coins = 5000;
  const beforeStat = PSG.pet.stats.effective(save).attack;
  const beforePrice = PSG.economy.candy.priceFor(save, 'candy_attack');
  const result = PSG.economy.shop.purchaseCandy(save, 'candy_attack');
  assert.equal(result.ok, true);
  assert.equal(result.price, beforePrice);
  assert.equal(save.player.coins, 5000 - beforePrice);
  assert.equal(save.pet.candyBoosts.attack, 1);
  assert.equal(PSG.pet.stats.effective(save).attack, beforeStat + 1);
  assert.ok(result.nextPrice >= result.price);
});

test('accuracy candy permanently increases the accuracy stat', () => {
  const save = fresh('eagle');
  save.player.coins = 5000;
  const before = PSG.pet.stats.effective(save).accuracy;
  const result = PSG.economy.shop.purchaseCandy(save, 'candy_accuracy');
  assert.equal(result.ok, true);
  assert.equal(result.gain, 1);
  assert.equal(PSG.pet.stats.effective(save).accuracy, before + 1);
});

test('HP candy grants three points and also extends current HP', () => {
  const save = fresh('crocodile');
  save.player.coins = 5000;
  const beforeMax = PSG.pet.stats.effective(save).hp;
  const beforeCurrent = save.pet.currentHp;
  const result = PSG.economy.shop.purchaseCandy(save, 'candy_hp');
  assert.equal(result.gain, 3);
  assert.equal(PSG.pet.stats.effective(save).hp, beforeMax + 3);
  assert.equal(save.pet.currentHp, beforeCurrent + 3);
});

test('ability candy rejects insufficient coins without changing stats', () => {
  const save = fresh();
  const before = PSG.pet.stats.effective(save).speed;
  const result = PSG.economy.shop.purchaseCandy(save, 'candy_speed');
  assert.equal(result.reason, 'coins');
  assert.equal(PSG.pet.stats.effective(save).speed, before);
  assert.equal(save.pet.candyBoosts.speed, undefined);
});

test('save repair clamps ranges and preserves a valid ranking', () => {
  const save = fresh();
  delete save.economy.savings;
  save.pet.energy = -20;
  save.pet.mood = 150;
  save.day.actionPoints = 99;
  save.pet.candyBoosts.attack = -4;
  save.pet.candyBoosts.hp = 3.9;
  delete save.pet.mastery.accuracy;
  delete save.progression.bossWins;
  delete save.progression.bossAttempts;
  delete save.stats.bossChallenges;
  delete save.stats.bossWins;
  delete save.economy.equipmentUpgrades;
  const repaired = PSG.storage.save.repair(save);
  assert.equal(repaired.pet.energy, 0);
  assert.equal(repaired.pet.mood, 100);
  assert.equal(repaired.day.actionPoints, 7);
  assert.equal(repaired.pet.candyBoosts.attack, 0);
  assert.equal(repaired.pet.candyBoosts.hp, 3);
  assert.deepEqual(repaired.pet.mastery.accuracy, { level: 0, xp: 0 });
  assert.equal(repaired.economy.savings.balance, 0);
  assert.equal(repaired.progression.bossWins, 0);
  assert.equal(repaired.progression.bossAttempts, 0);
  assert.equal(repaired.stats.bossChallenges, 0);
  assert.equal(repaired.stats.bossWins, 0);
  assert.deepEqual(repaired.economy.equipmentUpgrades, {
    mythic_armor: 0,
    mythic_accessory: 0,
    mythic_emblem: 0
  });
  PSG.constants.STAT_KEYS.forEach((key) => assert.ok(Number.isInteger(repaired.pet.candyBoosts[key])));

  repaired.economy.savings.balance = -20.7;
  assert.equal(PSG.storage.save.repair(repaired).economy.savings.balance, 0);

  const champion = movePlayerToRankOne(fresh());
  champion.economy.ownedEquipment = [];
  delete champion.economy.equipmentUpgrades;
  const repairedChampion = PSG.storage.save.repair(champion);
  assert.equal(repairedChampion.progression.championUnlocked, true);
  assert.deepEqual(repairedChampion.economy.ownedEquipment, ['mythic_armor', 'mythic_accessory', 'mythic_emblem']);
});

test('validated saves round-trip through localStorage', () => {
  const save = fresh();
  save.player.coins = 321;
  PSG.storage.save.write(save);
  const loaded = PSG.storage.save.read();
  assert.equal(loaded.player.coins, 321);
  assert.equal(loaded.ranking.rankOrder.length, 1000);
});

test('three save slots stay independent and legacy saves enter slot one', () => {
  const first = fresh('eagle');
  first.pet.name = 'Sky';
  PSG.storage.save.write(first, 1);
  const second = PSG.core.gameState.create('Trainer', 'Roar', 'lion', 987654321);
  PSG.core.gameState.set(second, 2);
  PSG.storage.save.write(second, 2);
  const slots = PSG.storage.save.list();
  assert.equal(slots.length, 3);
  assert.equal(slots[0].save.pet.name, 'Sky');
  assert.equal(slots[1].save.pet.name, 'Roar');
  assert.equal(slots[2].save, null);
  assert.equal(PSG.storage.save.read(1).pet.speciesId, 'eagle');
  assert.equal(PSG.storage.save.read(2).pet.speciesId, 'lion');

  const legacy = PSG.core.gameState.create('Trainer', 'Legacy', 'crocodile', 123);
  memory.clear();
  localStorage.setItem(PSG.constants.SAVE_KEY, JSON.stringify(legacy));
  assert.equal(PSG.storage.save.read(1).pet.name, 'Legacy');
  PSG.storage.save.write(legacy, 1);
  assert.equal(localStorage.getItem(PSG.constants.SAVE_KEY), null);
});

test('battle speed defaults on and persists as a separate setting', () => {
  memory.clear();
  assert.equal(PSG.storage.save.settingsDefaults().battleFast, true);
  const settings = PSG.storage.save.loadSettings();
  settings.battleFast = false;
  PSG.storage.save.saveSettings(settings);
  assert.equal(PSG.storage.save.loadSettings().battleFast, false);
});

test('cancelling an active battle refunds its entry cost and consumable', () => {
  const save = fresh();
  save.economy.consumables.con_1_energy = 1;
  const ai = Object.assign({}, PSG.ranking.generator.getAI('ai_0999', save.ranking.rankingSeed, 'en'), { rank: 999 });
  const state = PSG.battle.engine.create(save, ai, 'con_1_energy', 4);
  assert.equal(PSG.battle.engine.start(state).ok, true);
  assert.equal(save.day.actionPoints, 5);
  assert.equal(save.pet.energy, 55);
  assert.equal(save.economy.consumables.con_1_energy, 0);
  assert.equal(PSG.battle.engine.cancel(state).ok, true);
  assert.equal(save.day.actionPoints, 7);
  assert.equal(save.pet.energy, 80);
  assert.equal(save.economy.consumables.con_1_energy, 1);
  assert.equal(PSG.storage.save.read(1).day.actionPoints, 7);
});

test('all Traditional Chinese UI keys exist in English and Japanese dictionaries', () => {
  const keys = Object.keys(PSG.i18n.languages['zh-Hant']);
  keys.forEach((key) => {
    assert.ok(PSG.i18n.languages.en[key] != null, `missing en ${key}`);
    assert.ok(PSG.i18n.languages.ja[key] != null, `missing ja ${key}`);
  });
});

test('all required local BGM and generated sound files exist', () => {
  ['menu', 'home', 'training', 'outing', 'battle', 'champion', 'bossbattle'].forEach((name) =>
    assert.ok(fs.statSync(path.join(root, `bgm/bgm_${name}.mp3`)).size > 44)
  );
  assert.equal(fs.readdirSync(path.join(root, 'assets/audio/sfx')).filter((name) => name.endsWith('.wav')).length, 22);
});

(async () => {
  let passed = 0;
  for (const item of tests) {
    try {
      await item.fn();
      passed += 1;
      process.stdout.write(`✓ ${item.name}\n`);
    } catch (error) {
      process.stderr.write(`✗ ${item.name}\n${error.stack}\n`);
      process.exitCode = 1;
    }
  }
  process.stdout.write(`\n${passed}/${tests.length} unit tests passed.\n`);
})();
