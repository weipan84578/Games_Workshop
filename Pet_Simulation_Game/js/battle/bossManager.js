(function (PSG) {
  'use strict';

  var SPECIES_IDS = ['lion', 'crocodile', 'eagle'];
  var BOSS_LEVEL = 100;
  var BASE_STAT_MULTIPLIER = 2;
  var STAT_MULTIPLIER_STEP = 0.15;
  var BASE_COINS = 1200;
  var COINS_PER_STAGE = 300;
  var BASE_XP = 600;
  var XP_PER_STAGE = 120;
  var CANDY_DROP_RATE = 0.01;
  var ARENAS = [
    { id: 'grassland', safeSpeciesId: 'lion', damageRate: 0.03 },
    { id: 'swamp', safeSpeciesId: 'crocodile', damageRate: 0.03 },
    { id: 'sky', safeSpeciesId: 'eagle', damageRate: 0.03 }
  ];

  function whole(value) {
    return Math.max(0, Math.floor(Number(value) || 0));
  }

  function playerRank(save) {
    return PSG.ranking.matchmaking.playerRank(save);
  }

  function isUnlocked(save) {
    return Boolean(save && playerRank(save) === 1);
  }

  function winsFor(save) {
    return whole(save && save.progression && save.progression.bossWins);
  }

  function attemptsFor(save) {
    return Math.max(winsFor(save), whole(save && save.progression && save.progression.bossAttempts));
  }

  function multiplierFor(stage) {
    return BASE_STAT_MULTIPLIER + Math.max(0, stage - 1) * STAT_MULTIPLIER_STEP;
  }

  function arenaFor(save) {
    var attempt = attemptsFor(save) + 1;
    var seed = PSG.utils.seedFrom(save.ranking.rankingSeed, 'boss-arena', attempt);
    var arena = ARENAS[new PSG.utils.RNG(seed).int(0, ARENAS.length - 1)];
    return Object.assign({}, arena);
  }

  function preview(save) {
    if (!isUnlocked(save)) return { ok: false, reason: 'locked' };
    var stage = winsFor(save) + 1;
    return {
      ok: true,
      stage: stage,
      attempt: attemptsFor(save) + 1,
      arena: arenaFor(save),
      multiplier: multiplierFor(stage)
    };
  }

  function statsFor(speciesId, stage) {
    var base = PSG.pet.stats.natural(speciesId, BOSS_LEVEL);
    var multiplier = multiplierFor(stage);
    var stats = {};
    PSG.constants.STAT_KEYS.forEach(function (key) {
      stats[key] = Math.max(1, Math.round(base[key] * multiplier));
    });
    return stats;
  }

  function battlePower(stats) {
    return Math.round(
      stats.hp +
        4 * stats.attack +
        4.3 * stats.defense +
        3.2 * stats.mobility +
        4 * stats.spAttack +
        4.3 * stats.spDefense +
        2.8 * stats.speed
    );
  }

  function tacticFor(speciesId) {
    if (speciesId === 'crocodile') return 'defense';
    if (speciesId === 'lion') return 'offense';
    return 'normal';
  }

  function create(save, speciesId) {
    if (SPECIES_IDS.indexOf(speciesId) < 0) return { ok: false, reason: 'species' };
    var plan = preview(save);
    if (!plan.ok) return plan;
    var species = PSG.data.species[speciesId];
    var name = PSG.i18n.t('boss.name.' + speciesId);
    var stats = statsFor(speciesId, plan.stage);
    var opponent = {
      id: 'boss_' + speciesId + '_' + plan.stage,
      name: name,
      nameKey: 'boss.name.' + speciesId,
      speciesId: speciesId,
      level: BOSS_LEVEL,
      tactic: tacticFor(speciesId),
      equipmentStage: 6,
      milestone: false,
      boss: true,
      bossStage: plan.stage,
      stats: stats,
      bp: battlePower(stats),
      pet: {
        name: name,
        speciesId: speciesId,
        level: BOSS_LEVEL,
        xp: 0,
        affection: 0,
        mastery: {}
      },
      economy: { equipped: { armor: null, accessory: null, emblem: null } },
      image: species.image
    };
    return {
      ok: true,
      opponent: opponent,
      stage: plan.stage,
      attempt: plan.attempt,
      arena: plan.arena,
      multiplier: plan.multiplier
    };
  }

  function begin(save, challenge) {
    if (!isUnlocked(save)) return { ok: false, reason: 'locked' };
    var plan = preview(save);
    if (!challenge || challenge.stage !== plan.stage || challenge.attempt !== plan.attempt)
      return { ok: false, reason: 'stale' };
    save.progression.bossAttempts = plan.attempt;
    return { ok: true, attempt: plan.attempt };
  }

  function arenaTick(state) {
    if (!state.arena) return [];
    var events = [];
    [state.player, state.enemy].forEach(function (target) {
      if (target.hp <= 0 || target.speciesId === state.arena.safeSpeciesId) return;
      var damage = Math.max(1, Math.floor(target.maxHp * state.arena.damageRate));
      target.hp = Math.max(0, target.hp - damage);
      var event = {
        type: 'arena',
        defender: target.id,
        damage: damage,
        hpDamage: damage,
        arenaId: state.arena.id
      };
      state.logs.push(event);
      events.push(event);
    });
    return events;
  }

  function emptyXp(save) {
    return {
      gained: 0,
      levels: 0,
      oldLevel: save.pet.level,
      newLevel: save.pet.level
    };
  }

  function settle(save, challenge, won) {
    var stage = challenge.stage;
    if (!won)
      return {
        won: false,
        stage: stage,
        coins: 0,
        xp: emptyXp(save),
        candy: null
      };

    var coins = BASE_COINS + (stage - 1) * COINS_PER_STAGE;
    var xpAmount = save.pet.level >= PSG.constants.MAX_LEVEL ? 0 : BASE_XP + (stage - 1) * XP_PER_STAGE;
    var xp = xpAmount ? PSG.pet.progression.addXp(save, xpAmount) : emptyXp(save);
    save.player.coins += coins;

    var rewardRng = new PSG.utils.RNG(PSG.utils.seedFrom(save.ranking.rankingSeed, 'boss-reward', challenge.attempt));
    var candy = null;
    if (rewardRng.next() < CANDY_DROP_RATE) {
      var item = rewardRng.pick(PSG.data.abilityCandies);
      var grant = PSG.economy.candy.grant(save, item.id);
      candy = grant.ok ? { itemId: item.id, stat: grant.stat, gain: grant.gain } : null;
    }
    save.progression.bossWins = Math.max(winsFor(save), stage);
    return {
      won: true,
      stage: stage,
      coins: coins,
      xp: xp,
      candy: candy
    };
  }

  PSG.battle.boss = {
    speciesIds: function () {
      return SPECIES_IDS.slice();
    },
    arenas: function () {
      return ARENAS.map(function (arena) {
        return Object.assign({}, arena);
      });
    },
    isUnlocked: isUnlocked,
    winsFor: winsFor,
    attemptsFor: attemptsFor,
    multiplierFor: multiplierFor,
    preview: preview,
    create: create,
    begin: begin,
    arenaTick: arenaTick,
    settle: settle,
    candyDropRate: CANDY_DROP_RATE,
    baseCoins: BASE_COINS,
    coinsPerStage: COINS_PER_STAGE,
    baseXp: BASE_XP,
    xpPerStage: XP_PER_STAGE
  };
})(window.PSG);
