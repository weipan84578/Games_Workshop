(function (PSG) {
  'use strict';

  function currentStage(save) {
    for (var stage = 6; stage >= 1; stage -= 1) if (PSG.economy.equipment.isStageUnlocked(stage, save.player.bestRank)) return stage;
    return 1;
  }
  PSG.pet.outing = {
    perform: function (save, location) {
      var check = PSG.pet.daily.can(save, 'outing');
      if (!check.ok) return check;
      var candidates = PSG.data.events.filter(function (event) { return event.location === location; });
      var recent = save.day.recentEventIds.slice(-2);
      var rng = new PSG.utils.RNG(PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, save.day.rngCounter++, location));
      var event = rng.weighted(candidates, function (item) { return recent.indexOf(item.id) >= 0 ? 0 : item.weight; }) || rng.pick(candidates);
      var mood = PSG.pet.daily.moodMultiplier(save.pet.mood);
      var baseXp = Math.round((18 + 1.5 * save.pet.level) * mood);
      var xpResult = PSG.pet.progression.addXp(save, baseXp);
      PSG.pet.daily.applyFixed(save, 'outing');
      var reward = { type: event.reward, value: 0, itemId: null };
      if (event.reward === 'coins') { reward.value = rng.int(40, 120); save.player.coins += reward.value; }
      if (event.reward === 'affection') { reward.value = rng.int(1, 3); PSG.pet.affection.add(save, Math.round(reward.value * mood)); }
      if (event.reward === 'xp') { reward.value = Math.round((10 + save.pet.level) * mood); PSG.pet.progression.addXp(save, reward.value); }
      if (event.reward === 'consumable') {
        var stage = currentStage(save); var pool = PSG.data.consumables.filter(function (item) { return item.stage === stage; });
        var item = rng.pick(pool); reward.itemId = item.id; reward.value = 1;
        save.economy.consumables[item.id] = Math.min(99, (save.economy.consumables[item.id] || 0) + 1);
      }
      save.day.recentEventIds.push(event.id); save.day.recentEventIds = save.day.recentEventIds.slice(-2);
      PSG.ranking.matchmaking.refresh(save);
      PSG.storage.save.write(save);
      return { ok: true, event: event, reward: reward, xp: xpResult };
    }
  };
})(window.PSG);
