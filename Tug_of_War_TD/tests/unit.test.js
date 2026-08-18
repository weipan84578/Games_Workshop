const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

global.window = global;
const storage = {};
global.localStorage = {
  getItem: function (key) {
    return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
  },
  setItem: function (key, value) {
    storage[key] = value;
  }
};

const root = path.resolve(__dirname, "..");
const scripts = [
  "js/core/config.js",
  "js/core/eventBus.js",
  "js/core/saveManager.js",
  "data/unitsData.js",
  "data/levels.js",
  "js/entities/Unit.js",
  "js/entities/PlayerUnits.js",
  "js/entities/EnemyUnits.js",
  "js/entities/Base.js",
  "js/engine/pathManager.js",
  "js/engine/collision.js",
  "js/engine/gameLoop.js",
  "js/systems/resourceSystem.js",
  "js/systems/spawnSystem.js",
  "js/systems/aiSystem.js",
  "js/systems/abilitySystem.js",
  "js/systems/bossSystem.js",
  "js/systems/battleSystem.js",
  "js/systems/levelSystem.js"
];

function loadScript(relativePath) {
  const filename = path.join(root, relativePath);
  vm.runInThisContext(fs.readFileSync(filename, "utf8"), { filename });
}

scripts.forEach(loadScript);

const app = global.TugOfWar;
const silentAudio = { playSfx: function () {} };
app.AudioManager = silentAudio;

let passed = 0;

function test(name, callback) {
  try {
    callback();
    passed += 1;
    console.log("PASS - " + name);
  } catch (error) {
    console.error("FAIL - " + name);
    throw error;
  }
}

function createSession(levelId) {
  return new app.BattleSession(global.LEVELS_DATA.find(function (level) {
    return level.id === levelId;
  }));
}

test("unit catalog contains regular, special, and boss definitions", function () {
  assert.equal(global.UNIT_ORDER.length, 13);
  assert.equal(global.UNIT_ORDER.filter(function (id) {
    return global.UNITS_DATA[id].special;
  }).length, 5);
  assert.equal(global.UNITS_DATA.boss.isBoss, true);
  const regularUnits = global.UNIT_ORDER.map(function (id) { return global.UNITS_DATA[id]; });
  assert.ok(global.UNITS_DATA.boss.hp > Math.max.apply(Math, regularUnits.map(function (unit) { return unit.hp; })));
  assert.ok(global.UNITS_DATA.boss.atk > Math.max.apply(Math, regularUnits.map(function (unit) { return unit.atk; })));
  assert.ok(global.UNITS_DATA.boss.defense > 0);
  const boss = new app.Unit(global.UNITS_DATA.boss, "enemy", 870, 350);
  boss.takeDamage(100);
  assert.equal(boss.hp, global.UNITS_DATA.boss.hp - 60);
  assert.equal(global.LEVELS_DATA.length, 6);
  assert.equal(global.LEVELS_DATA[5].enhancedBoss, true);
  assert.ok(global.LEVELS_DATA.every(function (level) {
    return !("maxTime" in level);
  }));
  assert.ok(global.LEVELS_DATA.every(function (level) {
    return app.LevelSystem.isUnlocked(level.id);
  }));
});

test("music scene changes stop the previous scheduled track", function () {
  const originalAudioContext = global.AudioContext;
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  const scheduled = [];
  const oscillators = [];

  function parameter() {
    return {
      value: 0,
      setValueAtTime: function () {},
      exponentialRampToValueAtTime: function () {},
      cancelScheduledValues: function () {},
      setTargetAtTime: function () {}
    };
  }
  function gainNode() {
    return { gain: parameter(), connect: function () {} };
  }
  function limiterNode() {
    return { threshold: parameter(), knee: parameter(), ratio: parameter(), attack: parameter(), release: parameter(), connect: function () {} };
  }
  function oscillatorNode() {
    const oscillator = {
      type: "triangle",
      frequency: parameter(),
      stopCalls: 0,
      connect: function () {},
      start: function () {},
      stop: function () { this.stopCalls += 1; },
      onended: null
    };
    oscillators.push(oscillator);
    return oscillator;
  }
  function FakeAudioContext() {
    this.currentTime = 0;
    this.state = "running";
    this.destination = {};
  }
  FakeAudioContext.prototype.createGain = gainNode;
  FakeAudioContext.prototype.createDynamicsCompressor = limiterNode;
  FakeAudioContext.prototype.createOscillator = oscillatorNode;

  global.AudioContext = FakeAudioContext;
  global.setTimeout = function (callback) {
    scheduled.push(callback);
    return scheduled.length;
  };
  global.clearTimeout = function () {};
  loadScript("js/audio/audioConfig.js");
  loadScript("js/audio/audioManager.js");

  try {
    app.AudioManager.unlock();
    const firstTrackCount = oscillators.length;
    app.AudioManager.setScene("battle");
    assert.ok(firstTrackCount > 0);
    assert.ok(oscillators.slice(0, firstTrackCount).every(function (oscillator) {
      return oscillator.stopCalls > 0;
    }));
    assert.ok(scheduled.length >= 2);
  } finally {
    global.AudioContext = originalAudioContext;
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  }
});

test("income upgrade increases production and stops at level five", function () {
  const resource = new app.ResourceSystem(global.LEVELS_DATA[0]);
  const baseRate = resource.basePlayerRate;

  assert.ok(Math.abs(baseRate - global.LEVELS_DATA[0].energyRate * app.Config.playerEnergyRateMultiplier) < .0001);
  assert.equal(app.Config.incomeUpgradeCostMultiplier, .7);
  assert.equal(resource.getUpgradeCost(), 21);
  resource.player = resource.getUpgradeCost();
  const firstUpgrade = resource.upgradePlayer();
  assert.deepEqual(firstUpgrade.ok, true);
  assert.equal(firstUpgrade.cost, 21);
  assert.equal(resource.incomeLevel, 2);
  assert.equal(resource.playerRate, baseRate * 1.28);
  assert.equal(resource.max, 118);
  assert.equal(firstUpgrade.max, resource.max);

  for (let level = 2; level < 5; level += 1) {
    const cost = resource.getUpgradeCost();
    assert.equal(cost, [39, 56, 74][level - 2]);
    resource.player = cost;
    const upgrade = resource.upgradePlayer();
    assert.equal(upgrade.ok, true);
    assert.equal(upgrade.cost, cost);
  }
  assert.equal(resource.incomeLevel, 5);
  assert.equal(resource.max, 172);
  assert.equal(resource.getUpgradeCost(), 0);
  assert.equal(resource.upgradePlayer().reason, "max");
});

test("unit costs and defensive bonuses are applied consistently", function () {
  assert.equal(app.Config.unitCostMultiplier, .8);
  assert.equal(app.utils.getUnitCost(global.UNITS_DATA.ranger), 13);
  assert.equal(app.utils.getUnitCost(global.UNITS_DATA.boss), 0);

  const session = createSession(1);
  const rangerCost = app.utils.getUnitCost(global.UNITS_DATA.ranger);
  session.resource.player = rangerCost;
  const spawnResult = session.spawnSystem.spawnPlayer(session, "ranger");
  assert.equal(spawnResult.ok, true);
  assert.equal(session.resource.player, 0);

  ["basic", "tank", "guard", "guardian"].forEach(function (unitId) {
    const definition = global.UNITS_DATA[unitId];
    const player = new app.Unit(definition, "player", 300, 350);
    const enemy = new app.Unit(definition, "enemy", 700, 350);
    assert.equal(player.maxHp, Math.round(definition.hp * 1.2));
    assert.equal(enemy.maxHp, definition.hp);
    player.takeDamage(100);
    enemy.takeDamage(100);
    assert.equal(player.hp, player.maxHp - 80);
    assert.equal(enemy.hp, enemy.maxHp - 100);
  });
});

test("unit damage consumes barrier and preserves position and slow state", function () {
  const tank = new app.Unit(global.UNITS_DATA.tank, "player", 300, 350);
  const startingX = tank.x;
  tank.barrier = 40;
  tank.takeDamage(25);
  assert.equal(tank.hp, tank.maxHp);
  assert.equal(tank.barrier, 20);

  tank.takeDamage(30);
  assert.equal(tank.hp, tank.maxHp - 4);

  tank.applySlow(2, .5);
  assert.equal(tank.slowTimer, 2);
  assert.equal(tank.slowFactor, .5);
  tank.updateTimers(.1);
  assert.equal(tank.x, startingX);
  assert.equal("knockbackVelocity" in tank, false);

  const restored = app.Unit.fromSnapshot(tank.snapshot());
  assert.equal(restored.x, tank.x);
  assert.equal(restored.slowFactor, tank.slowFactor);
  assert.equal(restored.barrier, tank.barrier);
});

test("attacks never push any character out of position", function () {
  const session = createSession(1);
  const attacker = new app.Unit(global.UNITS_DATA.striker, "enemy", 400, 350);
  const target = new app.Unit(global.UNITS_DATA.tank, "player", 430, 350);
  const nearby = new app.Unit(global.UNITS_DATA.basic, "player", 450, 350);
  const targetX = target.x;
  const nearbyX = nearby.x;

  target.takeDamage(attacker.def.atk);
  app.AbilitySystem.applyAttackEffects(session, attacker, target, [target, nearby], attacker.def.atk, function () {});
  assert.equal(target.x, targetX);
  assert.equal(nearby.x, nearbyX);
});

test("enemy ranged damage is reduced without weakening player ranged units", function () {
  const session = createSession(1);
  assert.equal(app.Config.enemyRangedDamageMultiplier, .8);
  const playerFrontline = new app.Unit(global.UNITS_DATA.basic, "player", 400, 350);
  const enemyRanger = new app.Unit(global.UNITS_DATA.ranger, "enemy", 520, 350);
  const secondEnemyRanger = new app.Unit(global.UNITS_DATA.ranger, "enemy", 540, 350);
  session.playerUnits.add(playerFrontline);
  session.enemyUnits.add(enemyRanger);
  session.enemyUnits.add(secondEnemyRanger);

  session.battleSystem.update(session, .05);
  const softenedRangedDamage = global.UNITS_DATA.ranger.atk * app.Config.enemyRangedDamageMultiplier * 2 * (1 - app.utils.getUnitDefense(global.UNITS_DATA.basic, "player"));
  assert.ok(Math.abs(playerFrontline.hp - (playerFrontline.maxHp - softenedRangedDamage)) < .0001);

  const enemyFrontline = new app.Unit(global.UNITS_DATA.basic, "enemy", 520, 350);
  const playerRanger = new app.Unit(global.UNITS_DATA.ranger, "player", 400, 350);
  const enemyHp = enemyFrontline.hp;
  const playerSession = createSession(1);
  playerSession.playerUnits.add(playerRanger);
  playerSession.enemyUnits.add(enemyFrontline);

  playerSession.battleSystem.update(playerSession, .05);
  assert.equal(enemyFrontline.hp, enemyHp - global.UNITS_DATA.ranger.atk);

  const baseSession = createSession(1);
  const baseRanger = new app.Unit(global.UNITS_DATA.ranger, "enemy", 220, 350);
  baseSession.enemyUnits.add(baseRanger);
  baseSession.battleSystem.update(baseSession, .05);
  const softenedBaseDamage = global.UNITS_DATA.ranger.atk * app.Config.enemyRangedDamageMultiplier;
  assert.ok(Math.abs(baseSession.playerBase.hp - (baseSession.playerBase.maxHp - softenedBaseDamage)) < .0001);
});

test("living opponents hold the lane until they are defeated", function () {
  const session = createSession(1);
  const player = new app.Unit(global.UNITS_DATA.basic, "player", 400, 350);
  const enemy = new app.Unit(global.UNITS_DATA.basic, "enemy", 438, 350);
  session.playerUnits.add(player);
  session.enemyUnits.add(enemy);

  session.battleSystem.update(session, .05);
  const blockedX = player.x;
  session.battleSystem.update(session, .05);
  assert.equal(player.x, blockedX);

  enemy.takeDamage(99999);
  session.enemyUnits.removeDead();
  player.attackCooldown = 0;
  session.battleSystem.update(session, .05);
  assert.ok(player.x > blockedX);
});

test("every deployable role stays in place during frontline contact", function () {
  global.UNIT_ORDER.forEach(function (unitId) {
    const session = createSession(1);
    const player = new app.Unit(global.UNITS_DATA[unitId], "player", 400, 350);
    const enemy = new app.Unit(global.UNITS_DATA.basic, "enemy", 405, 350);
    const playerX = player.x;
    const enemyX = enemy.x;
    session.playerUnits.add(player);
    session.enemyUnits.add(enemy);

    session.battleSystem.update(session, .05);
    assert.equal(player.x, playerX, unitId + " player moved");
    assert.equal(enemy.x, enemyX, unitId + " enemy moved");
  });
});

test("special abilities apply slow, chain damage, and ally barriers", function () {
  const session = createSession(1);
  const frost = new app.Unit(global.UNITS_DATA.frostMage, "player", 200, 350);
  const target = new app.Unit(global.UNITS_DATA.basic, "enemy", 230, 350);
  const nearby = new app.Unit(global.UNITS_DATA.basic, "enemy", 250, 350);
  session.enemyUnits.add(target);
  session.enemyUnits.add(nearby);
  target.takeDamage(frost.def.atk);
  app.AbilitySystem.applyAttackEffects(session, frost, target, [target, nearby], frost.def.atk, function () {});
  assert.ok(target.slowTimer > 0);
  assert.equal(target.x, 230);
  assert.equal(nearby.x, 250);

  const thunder = new app.Unit(global.UNITS_DATA.thunderMage, "player", 200, 350);
  const chainTarget = new app.Unit(global.UNITS_DATA.basic, "enemy", 230, 350);
  const chainNearby = new app.Unit(global.UNITS_DATA.basic, "enemy", 250, 350);
  const chainBefore = chainNearby.hp;
  chainTarget.takeDamage(thunder.def.atk);
  app.AbilitySystem.applyAttackEffects(session, thunder, chainTarget, [chainTarget, chainNearby], thunder.def.atk, function () {});
  assert.ok(chainNearby.hp < chainBefore);

  const guardian = new app.Unit(global.UNITS_DATA.guardian, "player", 400, 350);
  const ally = new app.Unit(global.UNITS_DATA.basic, "player", 430, 350);
  assert.equal(app.AbilitySystem.tryCastBarrier(session, guardian, [guardian, ally], function () {}), true);
  assert.equal(ally.barrier, global.UNITS_DATA.guardian.barrier);
});

test("normal level triggers one boss below thirty percent and blocks base damage", function () {
  const session = createSession(1);
  session.enemyBase.hp = 290;
  app.BossSystem.trigger(session);

  assert.equal(session.enemyUnits.units.length, 1);
  assert.equal(session.enemyUnits.units[0].def.isBoss, true);
  assert.equal(app.BossSystem.blocksEnemyBase(session), true);
  assert.ok(session.enemyBase.hp > 0);

  session.enemyUnits.units[0].takeDamage(99999);
  session.enemyUnits.removeDead();
  assert.equal(app.BossSystem.blocksEnemyBase(session), false);
});

test("enhanced level makes each later Boss tier stronger and restorable", function () {
  const level = global.LEVELS_DATA[5];
  const session = createSession(6);
  assert.equal(app.BossSystem.getTier(level, 90), 1);
  assert.equal(app.BossSystem.getTier(level, 50), 5);
  assert.equal(app.BossSystem.getTier(level, 10), 9);

  session.enemyBase.hp = 1980;
  app.BossSystem.trigger(session);
  const firstBoss = session.enemyUnits.units[0];
  assert.equal(firstBoss.def.bossTier, 1);

  session.enemyBase.hp = 1760;
  app.BossSystem.trigger(session);
  const secondBoss = session.enemyUnits.units[1];
  assert.equal(secondBoss.def.bossTier, 2);
  assert.ok(secondBoss.def.hp > firstBoss.def.hp);
  assert.ok(secondBoss.def.atk > firstBoss.def.atk);
  assert.ok(secondBoss.def.defense > firstBoss.def.defense);

  const lateBoss = app.utils.getEnhancedBossDefinition(global.UNITS_DATA.boss, 9);
  assert.equal(lateBoss.hp, 5368);
  assert.equal(lateBoss.atk, 306);
  assert.equal(lateBoss.defense, .72);

  const restored = app.BattleSession.fromSnapshot(session.snapshot());
  const restoredSecondBoss = restored.enemyUnits.units.find(function (unit) {
    return unit.def.bossTier === 2;
  });
  assert.equal(restoredSecondBoss.def.hp, secondBoss.def.hp);
  assert.equal(restoredSecondBoss.def.atk, secondBoss.def.atk);
  assert.equal(restoredSecondBoss.def.defense, secondBoss.def.defense);
});

test("enhanced level accelerates waves and unlocks higher-tier enemies", function () {
  const level = global.LEVELS_DATA[5];
  const starterPool = level.enemyRamp.starterPool;
  const firstTierPool = level.enemyRamp.tierPools[0];
  const secondTierPool = level.enemyRamp.tierPools[1];
  const finalTierPool = level.enemyRamp.tierPools[2];

  assert.deepEqual(app.AISystem.getAvailablePool(level, 0), starterPool);
  assert.equal(app.AISystem.getNewestTierIndex(level, 17), -1);
  assert.ok(app.AISystem.getAvailablePool(level, 18).some(function (unitId) {
    return firstTierPool.indexOf(unitId) >= 0;
  }));
  assert.ok(app.AISystem.getAvailablePool(level, 36).some(function (unitId) {
    return secondTierPool.indexOf(unitId) >= 0;
  }));
  assert.ok(app.AISystem.getAvailablePool(level, 54).some(function (unitId) {
    return finalTierPool.indexOf(unitId) >= 0;
  }));
  assert.equal(app.AISystem.getIntervalMultiplier(level, 0), 1);
  assert.ok(app.AISystem.getIntervalMultiplier(level, 120) < 1);
  assert.equal(app.AISystem.getIntervalMultiplier(level, 240), level.enemyRamp.intervalFloor);
});

test("enemy base damage resumes only after the Boss is defeated", function () {
  const session = createSession(1);
  const attacker = new app.Unit(global.UNITS_DATA.tank, "player", 915, 350);
  session.playerUnits.add(attacker);
  session.enemyBase.hp = 290;
  app.BossSystem.trigger(session);

  session.battleSystem.update(session, .05);
  assert.equal(session.enemyBase.hp, 290);

  session.enemyUnits.units[0].takeDamage(99999);
  session.enemyUnits.removeDead();
  attacker.attackCooldown = 0;
  session.battleSystem.update(session, .05);
  assert.ok(session.enemyBase.hp < 290);
});

test("Boss spawning takes priority over the regular unit performance cap", function () {
  const session = createSession(1);
  for (let index = 0; index < app.Config.lowPerformanceUnitLimit * 2; index += 1) {
    session.playerUnits.add(new app.Unit(global.UNITS_DATA.basic, "player", 130, 350));
  }
  session.enemyBase.hp = 290;

  app.BossSystem.trigger(session);
  assert.equal(session.enemyUnits.units.some(function (unit) {
    return unit.def.isBoss;
  }), true);
});

test("unlimited battles ignore elapsed time and finish only by castle rules", function () {
  const session = createSession(1);
  const snapshot = session.snapshot();
  session.elapsed = 999999;

  session.battleSystem.update(session, 0);
  assert.equal(session.result, null);
  assert.equal("timeRemaining" in session, false);
  assert.equal("timeRemaining" in snapshot, false);

  session.playerBase.hp = 0;
  session.battleSystem.update(session, 0);
  assert.equal(session.result.outcome, "defeat");
  assert.equal(session.result.reason, "castle");
});

test("legacy best-time progress is removed during save migration", function () {
  storage[app.Config.storageKey] = JSON.stringify({
    progression: { unlockedLevel: 3, stars: { 1: 2 }, bestTimes: { 1: 99 } }
  });

  const migrated = app.SaveManager.loadGame();
  assert.equal(migrated.progression.unlockedLevel, 3);
  assert.equal(migrated.progression.stars[1], 2);
  assert.equal("bestTimes" in migrated.progression, false);

  const completed = app.SaveManager.completeLevel(1, 3, 999);
  assert.equal(completed.progression.stars[1], 3);
  assert.equal("bestTimes" in completed.progression, false);
});

test("enhanced level triggers a boss at every ten percent threshold", function () {
  const session = createSession(6);
  session.enemyBase.hp = 1980;
  app.BossSystem.trigger(session);
  assert.equal(session.enemyUnits.units.length, 1);
  assert.equal(session.bossTriggered[90], true);

  session.enemyBase.hp = 1760;
  app.BossSystem.trigger(session);
  assert.equal(session.enemyUnits.units.length, 2);
  assert.equal(session.bossTriggered[80], true);
  assert.deepEqual(app.BossSystem.getThresholds(session.level), [90, 80, 70, 60, 50, 40, 30, 20, 10]);
});

test("battle snapshot restores resource upgrades and living bosses", function () {
  const session = createSession(6);
  session.resource.player = session.resource.getUpgradeCost();
  session.resource.upgradePlayer();
  session.enemyBase.hp = 1980;
  app.BossSystem.trigger(session);

  const restored = app.BattleSession.fromSnapshot(session.snapshot());
  assert.equal(restored.resource.incomeLevel, 2);
  assert.equal(restored.resource.playerRate, session.resource.playerRate);
  assert.equal(restored.resource.max, session.resource.max);
  assert.equal(restored.bosses.length, 1);
  assert.equal(restored.bossTriggered[90], true);

  const legacySnapshot = session.snapshot();
  delete legacySnapshot.resource.playerRateMultiplier;
  legacySnapshot.resource.basePlayerRate = global.LEVELS_DATA[5].energyRate;
  legacySnapshot.resource.playerRate = legacySnapshot.resource.basePlayerRate * 1.28;
  const migrated = app.BattleSession.fromSnapshot(legacySnapshot);
  assert.equal(migrated.resource.basePlayerRate, global.LEVELS_DATA[5].energyRate * app.Config.playerEnergyRateMultiplier);
  assert.equal(migrated.resource.playerRate, migrated.resource.basePlayerRate * 1.28);
});

console.log("\n" + passed + " unit tests passed.");
