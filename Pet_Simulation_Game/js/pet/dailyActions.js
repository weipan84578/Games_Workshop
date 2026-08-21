(function (PSG) {
  'use strict';

  var MIN_DAILY_COINS = 30;
  var COINS_PER_STAGE = 30;
  var DAILY_COIN_MULTIPLIER = 4;

  function moodMultiplier(mood) {
    return mood >= 70 ? 1.1 : mood >= 30 ? 1 : 0.75;
  }
  function can(save, actionName) {
    var action = PSG.constants.ACTIONS[actionName];
    if (!action) return { ok: false, reason: 'unknown' };
    if (action.ap && save.day.actionPoints < action.ap) return { ok: false, reason: 'ap', required: action.ap };
    if (action.minEnergy != null && save.pet.energy < action.minEnergy)
      return { ok: false, reason: 'energy', required: action.minEnergy };
    if (action.minMood != null && save.pet.mood < action.minMood)
      return { ok: false, reason: 'mood', required: action.minMood };
    return { ok: true };
  }
  function applyFixed(save, actionName, outcome) {
    var action = PSG.constants.ACTIONS[actionName];
    var check = can(save, actionName);
    if (!check.ok) return check;
    save.day.actionPoints -= action.ap || 0;
    save.pet.energy = PSG.utils.math.clamp(save.pet.energy + (action.energy || 0), 0, 100);
    var mood = action.mood;
    var affection = action.affection || 0;
    if (actionName === 'battle') {
      mood = outcome === 'win' ? 8 : -8;
      affection = outcome === 'win' ? 2 : 1;
    }
    save.pet.mood = PSG.utils.math.clamp(save.pet.mood + (mood || 0), 0, 100);
    if (affection > 0 && actionName !== 'battle')
      affection = Math.round(affection * moodMultiplier(save.pet.mood - (mood || 0)));
    PSG.pet.affection.add(save, affection);
    return { ok: true, moodMultiplier: moodMultiplier(save.pet.mood) };
  }
  function dailyCoins(save) {
    var rank = PSG.ranking.matchmaking.playerRank(save);
    var stage = PSG.ranking.generator.stageForRank(rank);
    return Math.max(MIN_DAILY_COINS, stage * COINS_PER_STAGE) * DAILY_COIN_MULTIPLIER;
  }
  function nextDay(save) {
    // Daily settlement is kept in the exact spec order before the single autosave below.
    var reward = dailyCoins(save);
    var interest = PSG.economy.bank.settleInterest(save);
    save.player.coins = Math.max(0, Math.floor(Number(save.player.coins) || 0)) + reward;
    save.pet.energy = PSG.utils.math.clamp(save.pet.energy + 50, 0, 100);
    save.pet.mood = PSG.utils.math.clamp(save.pet.mood + 10, 0, 100);
    save.day.number += 1;
    save.day.actionPoints = 5;
    save.stats.daysPlayed = save.day.number;
    save.pet.currentHp = PSG.pet.stats.effective(save).hp;
    PSG.ranking.matchmaking.refresh(save);
    PSG.storage.save.write(save);
    return { day: save.day.number, coins: reward, interest: interest.interest };
  }
  function beginBattle(save) {
    var check = can(save, 'battle');
    if (!check.ok) return check;
    save.day.actionPoints -= 2;
    save.pet.energy = PSG.utils.math.clamp(save.pet.energy - 25, 0, 100);
    return { ok: true };
  }
  function finishBattle(save, won) {
    save.pet.mood = PSG.utils.math.clamp(save.pet.mood + (won ? 8 : -8), 0, 100);
    PSG.pet.affection.add(save, won ? 2 : 1);
  }
  PSG.pet.daily = {
    moodMultiplier: moodMultiplier,
    can: can,
    applyFixed: applyFixed,
    dailyCoins: dailyCoins,
    beginBattle: beginBattle,
    finishBattle: finishBattle,
    nextDay: nextDay
  };
})(window.PSG);
