(function (PSG) {
  'use strict';

  function combatant(id, name, speciesId, level, stats, baseCrit, tactic) {
    return {
      id: id,
      name: name,
      speciesId: speciesId,
      level: level,
      stats: Object.assign({}, stats),
      maxHp: stats.hp,
      hp: stats.hp,
      energy: 0,
      shield: 0,
      baseCrit: baseCrit,
      tactic: tactic || 'normal',
      totalDamage: 0,
      effects: { eagleMobility: 0, shieldTurns: 0 }
    };
  }

  function create(save, ai, consumableId, seed, options) {
    options = options || {};
    var mode = options.mode || (ai && ai.boss ? 'boss' : 'ranking');
    var bossChallenge = options.bossChallenge || null;
    var arena = options.arena || null;
    var maxRounds =
      options.maxRounds || (mode === 'boss' ? PSG.constants.BOSS_BATTLE_ROUNDS : PSG.constants.MAX_BATTLE_ROUNDS);
    var battleSeed =
      seed ||
      (mode === 'boss'
        ? PSG.utils.seedFrom(save.ranking.rankingSeed, 'boss-battle', bossChallenge && bossChallenge.attempt)
        : PSG.utils.seedFrom(save.ranking.rankingSeed, ai.id, save.stats.battles));
    // Effective stats are snapshotted once; later UI/state changes cannot alter an active duel.
    var playerStats = PSG.pet.stats.effective(save);
    var player = combatant(
      'player',
      save.pet.name,
      save.pet.speciesId,
      save.pet.level,
      playerStats,
      PSG.pet.stats.critRate(save, consumableId, false),
      'player'
    );
    var enemy = combatant(
      ai.id,
      ai.name,
      ai.speciesId,
      ai.level,
      ai.stats,
      PSG.pet.stats.critRate(ai, null, false),
      ai.tactic
    );
    var item = PSG.data.consumableById[consumableId];
    if (item && item.type === 'energy') player.energy = item.value;
    if (item && item.type === 'shield') {
      player.shield = Math.floor((player.maxHp * item.value) / 100);
      player.effects.shieldTurns = 2;
    }
    return {
      save: save,
      opponent: ai,
      consumableId: consumableId || null,
      rng: new PSG.utils.RNG(battleSeed),
      player: player,
      enemy: enemy,
      round: 0,
      ended: false,
      winnerId: null,
      logs: [],
      reason: null,
      started: false,
      mode: mode,
      arena: arena,
      maxRounds: maxRounds,
      bossChallenge: bossChallenge
    };
  }

  function start(state) {
    if (state.started) return { ok: true };
    var actionName = state.mode === 'boss' ? 'bossBattle' : 'battle';
    var check = PSG.pet.daily.can(state.save, actionName);
    if (!check.ok) return check;
    if (state.consumableId && PSG.economy.inventory.count(state.save, state.consumableId) <= 0)
      return { ok: false, reason: 'consumable' };
    if (state.mode === 'boss') {
      var bossStart = PSG.battle.boss.begin(state.save, state.bossChallenge);
      if (!bossStart.ok) return bossStart;
    }
    PSG.pet.daily.beginBattle(state.save, actionName);
    if (state.consumableId) PSG.economy.inventory.consume(state.save, state.consumableId);
    state.started = true;
    PSG.storage.save.write(state.save);
    return { ok: true };
  }

  function cancel(state) {
    if (!state.started || state.settled || state.cancelled) return { ok: false, reason: 'notActive' };
    var save = state.save;
    // An unfinished duel has no outcome, so return its entry costs and item.
    var action = PSG.constants.ACTIONS[state.mode === 'boss' ? 'bossBattle' : 'battle'];
    save.day.actionPoints = Math.min(
      PSG.constants.actionPointsForLevel(save.pet.level),
      save.day.actionPoints + (action.ap || 0)
    );
    save.pet.energy = PSG.utils.math.clamp(save.pet.energy - action.energy, 0, 100);
    if (state.consumableId)
      save.economy.consumables[state.consumableId] = (save.economy.consumables[state.consumableId] || 0) + 1;
    state.cancelled = true;
    PSG.storage.save.write(save);
    return { ok: true };
  }

  function performAttack(state, attacker, defender, action) {
    if (action === 'special' && attacker.energy < 100) action = 'normal';
    var species = PSG.data.species[attacker.speciesId];
    var attackData = action === 'special' ? species.special : species.normal;
    var created = { eagle: false, shield: false };
    if (action === 'special') attacker.energy -= 100;
    var mobility = PSG.battle.effects.mobility(defender);
    var effectMultiplier = action === 'special' && attacker.speciesId === 'eagle' ? 0.5 : 1;
    var dodgeRate = PSG.battle.damage.evasion(mobility, defender.level, effectMultiplier);
    // Resolution order is observable and tested: hit → critical → variance → shield → HP.
    var dodged = state.rng.next() < dodgeRate;
    var result = {
      attacker: attacker.id,
      defender: defender.id,
      action: action,
      attackKey: attackData.key,
      dodged: dodged,
      critical: false,
      damage: 0,
      hpDamage: 0,
      shieldAbsorbed: 0,
      dodgeRate: dodgeRate
    };
    if (dodged) {
      defender.energy = Math.min(100, defender.energy + 5);
      state.logs.push(result);
      PSG.battle.effects.tickOwnAction(attacker, created);
      return result;
    }
    var critRate =
      action === 'special' && attacker.speciesId === 'lion'
        ? Math.min(0.3, attacker.baseCrit + 0.1)
        : Math.min(0.2, attacker.baseCrit);
    result.critical = state.rng.next() < critRate;
    var attackingStat = action === 'special' ? attacker.stats.spAttack : attacker.stats.attack;
    var defendingStat = action === 'special' ? defender.stats.spDefense : defender.stats.defense;
    var roll = PSG.battle.damage.calculate({
      level: attacker.level,
      power: attackData.power,
      attack: attackingStat,
      defense: defendingStat,
      variance: 0.95 + state.rng.next() * 0.1,
      critical: result.critical
    });
    result.damage = roll.damage;
    result.shieldAbsorbed = Math.min(defender.shield, roll.damage);
    defender.shield -= result.shieldAbsorbed;
    result.hpDamage = Math.min(defender.hp, roll.damage - result.shieldAbsorbed);
    defender.hp -= result.hpDamage;
    attacker.totalDamage += result.shieldAbsorbed + result.hpDamage;
    defender.energy = Math.min(100, defender.energy + 10);
    if (action === 'normal') attacker.energy = Math.min(100, attacker.energy + 30);
    if (action === 'special' && attacker.speciesId === 'eagle') {
      attacker.effects.eagleMobility = 2;
      created.eagle = true;
    }
    if (action === 'special' && attacker.speciesId === 'crocodile') {
      attacker.shield = Math.floor(attacker.maxHp * 0.12);
      attacker.effects.shieldTurns = 2;
      created.shield = true;
    }
    state.logs.push(result);
    PSG.battle.effects.tickOwnAction(attacker, created);
    return result;
  }

  function decideTurnLimit(state) {
    // Do not reorder: HP ratio, effective damage, initial speed, then seeded 50/50 is contractual.
    var playerRatio = state.player.hp / state.player.maxHp;
    var enemyRatio = state.enemy.hp / state.enemy.maxHp;
    if (playerRatio !== enemyRatio) return playerRatio > enemyRatio ? 'player' : state.enemy.id;
    if (state.player.totalDamage !== state.enemy.totalDamage)
      return state.player.totalDamage > state.enemy.totalDamage ? 'player' : state.enemy.id;
    if (state.player.stats.speed !== state.enemy.stats.speed)
      return state.player.stats.speed > state.enemy.stats.speed ? 'player' : state.enemy.id;
    return state.rng.next() < 0.5 ? 'player' : state.enemy.id;
  }

  function round(state, playerAction) {
    if (!state.started || state.ended) return { ok: false, reason: state.ended ? 'ended' : 'notStarted' };
    state.round += 1;
    var aiAction = PSG.battle.ai.choose(state.enemy, state.player);
    var order;
    // AI commits without reading playerAction; only the engine sees both commands when resolving initiative.
    if (state.player.stats.speed === state.enemy.stats.speed)
      order =
        state.rng.next() < 0.5
          ? [
              [state.player, state.enemy, playerAction],
              [state.enemy, state.player, aiAction]
            ]
          : [
              [state.enemy, state.player, aiAction],
              [state.player, state.enemy, playerAction]
            ];
    else
      order =
        state.player.stats.speed > state.enemy.stats.speed
          ? [
              [state.player, state.enemy, playerAction],
              [state.enemy, state.player, aiAction]
            ]
          : [
              [state.enemy, state.player, aiAction],
              [state.player, state.enemy, playerAction]
            ];
    var events = [];
    for (var i = 0; i < order.length; i += 1) {
      if (order[i][0].hp <= 0 || order[i][1].hp <= 0) break;
      events.push(performAttack(state, order[i][0], order[i][1], order[i][2]));
      if (order[i][1].hp <= 0) {
        state.ended = true;
        state.winnerId = order[i][0].id;
        state.reason = 'knockout';
        break;
      }
    }
    if (!state.ended && state.arena) {
      events = events.concat(PSG.battle.boss.arenaTick(state));
      var playerDown = state.player.hp <= 0;
      var enemyDown = state.enemy.hp <= 0;
      if (playerDown || enemyDown) {
        state.ended = true;
        state.winnerId = playerDown && enemyDown ? decideTurnLimit(state) : playerDown ? state.enemy.id : 'player';
        state.reason = 'arena';
      }
    }
    if (!state.ended && state.round >= state.maxRounds) {
      state.ended = true;
      state.winnerId = decideTurnLimit(state);
      state.reason = 'turnLimit';
    }
    return { ok: true, events: events, ended: state.ended, winnerId: state.winnerId, reason: state.reason };
  }

  function settleBoss(state) {
    if (!state.ended || state.settled) return null;
    var save = state.save;
    var won = state.winnerId === 'player';
    var rank = PSG.ranking.matchmaking.playerRank(save);
    var reward = PSG.battle.boss.settle(save, state.bossChallenge, won);
    PSG.pet.daily.finishBattle(save, won);
    save.stats.battles += 1;
    save.stats[won ? 'wins' : 'losses'] += 1;
    save.stats.bossChallenges = (save.stats.bossChallenges || 0) + 1;
    if (won) save.stats.bossWins = (save.stats.bossWins || 0) + 1;
    save.stats.criticalHits += state.logs.filter(function (log) {
      return log.attacker === 'player' && log.critical;
    }).length;
    save.stats.dodges += state.logs.filter(function (log) {
      return log.defender === 'player' && log.dodged;
    }).length;
    save.ranking.battleHistory.push({
      time: new Date().toISOString(),
      opponentId: state.opponent.id,
      bossStage: reward.stage,
      arenaId: state.arena && state.arena.id,
      playerRankBefore: rank,
      opponentRankBefore: null,
      result: won ? 'boss-win' : 'boss-loss',
      rounds: state.round,
      consumableId: state.consumableId,
      xp: reward.xp.gained,
      coins: reward.coins,
      rankAfter: rank
    });
    save.ranking.battleHistory = save.ranking.battleHistory.slice(-50);
    PSG.ranking.matchmaking.refresh(save);
    save.pet.currentHp = PSG.pet.stats.effective(save).hp;
    state.settled = {
      won: won,
      boss: true,
      stage: reward.stage,
      arena: state.arena,
      xp: reward.xp,
      coins: reward.coins,
      candy: reward.candy,
      rank: { changed: false, before: rank, after: rank, champion: false },
      champion: false,
      firstMilestone: false
    };
    PSG.storage.save.write(save);
    return state.settled;
  }

  function settle(state) {
    if (!state.ended || state.settled) return null;
    if (state.mode === 'boss') return settleBoss(state);
    var save = state.save;
    var won = state.winnerId === 'player';
    var playerBp = PSG.pet.stats.battlePower(save);
    var ratio = state.opponent.bp / Math.max(1, playerBp);
    var xp = won
      ? Math.round((45 + 4 * save.pet.level) * PSG.battle.damage.opponentXpMultiplier(ratio))
      : Math.round(18 + 2 * save.pet.level);
    var baseCoins = 30 + Math.ceil(state.opponent.bp / 100);
    var beforeRank = PSG.ranking.matchmaking.playerRank(save);
    var firstMilestone = state.opponent.milestone && save.progression.defeatedRivals.indexOf(state.opponent.id) < 0;
    var coins = won
      ? Math.floor(baseCoins * (state.opponent.rank < beforeRank ? 1.25 : 1))
      : Math.floor(baseCoins * 0.2);
    if (won && firstMilestone) coins += 200 + Math.floor((1000 - state.opponent.rank) / 2);
    var xpResult = PSG.pet.progression.addXp(save, xp);
    save.player.coins += coins;
    PSG.pet.daily.finishBattle(save, won);
    var rankResult = PSG.ranking.manager.settle(save, state.opponent.id, won);
    save.stats.battles += 1;
    save.stats[won ? 'wins' : 'losses'] += 1;
    save.stats.criticalHits += state.logs.filter(function (log) {
      return log.attacker === 'player' && log.critical;
    }).length;
    save.stats.dodges += state.logs.filter(function (log) {
      return log.defender === 'player' && log.dodged;
    }).length;
    save.ranking.battleHistory.push({
      time: new Date().toISOString(),
      opponentId: state.opponent.id,
      playerRankBefore: beforeRank,
      opponentRankBefore: state.opponent.rank,
      result: won ? 'win' : 'loss',
      rounds: state.round,
      consumableId: state.consumableId,
      xp: xp,
      coins: coins,
      rankAfter: rankResult.after
    });
    save.ranking.battleHistory = save.ranking.battleHistory.slice(-50);
    save.pet.currentHp = PSG.pet.stats.effective(save).hp;
    state.settled = {
      won: won,
      xp: xpResult,
      coins: coins,
      rank: rankResult,
      champion: rankResult.champion,
      firstMilestone: won && firstMilestone
    };
    PSG.storage.save.write(save);
    return state.settled;
  }

  PSG.battle.engine = {
    create: create,
    start: start,
    cancel: cancel,
    round: round,
    settle: settle,
    performAttack: performAttack,
    decideTurnLimit: decideTurnLimit
  };
})(window.PSG);
