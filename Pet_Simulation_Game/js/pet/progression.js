(function (PSG) {
  'use strict';

  function xpToNext(level) {
    return 100 + 12 * (level - 1);
  }
  function masteryXpToNext(level) {
    return 50 + 25 * level;
  }

  function addXp(save, amount) {
    var pet = save.pet;
    var beforeLevel = pet.level;
    var beforeStats = PSG.pet.stats.effective(save);
    pet.xp += Math.max(0, Math.round(amount));
    // A loop is intentional: one settlement may cross several level thresholds.
    while (pet.level < PSG.constants.MAX_LEVEL && pet.xp >= xpToNext(pet.level)) {
      pet.xp -= xpToNext(pet.level);
      pet.level += 1;
    }
    if (pet.level >= PSG.constants.MAX_LEVEL) pet.xp = 0;
    var afterStats = PSG.pet.stats.effective(save);
    pet.currentHp = Math.min(afterStats.hp, pet.currentHp + Math.max(0, afterStats.hp - beforeStats.hp));
    return {
      gained: Math.round(amount),
      levels: pet.level - beforeLevel,
      oldLevel: beforeLevel,
      newLevel: pet.level,
      oldStats: beforeStats,
      newStats: afterStats
    };
  }

  function addMastery(save, stat, amount) {
    var mastery = save.pet.mastery[stat];
    if (!mastery) throw new Error('Unknown mastery stat: ' + stat);
    var before = mastery.level;
    mastery.xp += Math.max(0, Math.round(amount));
    while (mastery.level < PSG.constants.MAX_MASTERY && mastery.xp >= masteryXpToNext(mastery.level)) {
      mastery.xp -= masteryXpToNext(mastery.level);
      mastery.level += 1;
    }
    if (mastery.level >= PSG.constants.MAX_MASTERY) mastery.xp = 0;
    return { gained: Math.round(amount), levels: mastery.level - before, oldLevel: before, newLevel: mastery.level };
  }

  PSG.pet.progression = { xpToNext: xpToNext, masteryXpToNext: masteryXpToNext, addXp: addXp, addMastery: addMastery };
})(window.PSG);
