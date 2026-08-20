(function (PSG) {
  'use strict';

  function templateFor(stat) {
    if (stat === 'attack' || stat === 'spAttack') return 'strength';
    if (stat === 'mobility' || stat === 'speed') return 'agility';
    return 'endurance';
  }
  function gradeFor(score) {
    if (score >= 85) return { id: 'gold', multiplier: 1.25 };
    if (score >= 60) return { id: 'silver', multiplier: 1 };
    return { id: 'bronze', multiplier: 0.75 };
  }
  function settle(save, stat, score) {
    var check = PSG.pet.daily.can(save, 'training');
    if (!check.ok) return check;
    var grade = gradeFor(score);
    var mood = PSG.pet.daily.moodMultiplier(save.pet.mood);
    var xp = Math.round((30 + 3 * save.pet.level) * grade.multiplier * mood);
    var masteryXp = Math.round((20 + 2 * save.pet.level) * grade.multiplier * mood);
    var xpResult = PSG.pet.progression.addXp(save, xp);
    var masteryResult = PSG.pet.progression.addMastery(save, stat, masteryXp);
    PSG.pet.daily.applyFixed(save, 'training');
    if (grade.id === 'gold') save.stats.trainingGolds += 1;
    PSG.ranking.matchmaking.refresh(save);
    PSG.storage.save.write(save);
    return { ok: true, score: Math.round(score), grade: grade.id, xp: xpResult, mastery: masteryResult, bp: PSG.pet.stats.battlePower(save) };
  }
  PSG.training.manager = { templateFor: templateFor, gradeFor: gradeFor, settle: settle };
})(window.PSG);
