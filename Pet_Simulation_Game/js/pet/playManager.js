(function (PSG) {
  'use strict';
  PSG.pet.play = {
    perform: function (save) {
      var check = PSG.pet.daily.can(save, 'play');
      if (!check.ok) return check;
      var species = save.pet.speciesId;
      var ids = [species + '.0', species + '.1', species + '.2'];
      var lastTwo = save.day.recentPlayIds.slice(-2);
      var available = ids.filter(function (id) {
        return !(lastTwo.length === 2 && lastTwo[0] === id && lastTwo[1] === id);
      });
      var rng = new PSG.utils.RNG(
        PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, save.day.rngCounter++, 'play')
      );
      var id = rng.pick(available);
      var mood = PSG.pet.daily.moodMultiplier(save.pet.mood);
      var xp = Math.round((12 + save.pet.level) * mood);
      var xpResult = PSG.pet.progression.addXp(save, xp);
      PSG.pet.daily.applyFixed(save, 'play');
      save.day.recentPlayIds.push(id);
      save.day.recentPlayIds = save.day.recentPlayIds.slice(-2);
      PSG.ranking.matchmaking.refresh(save);
      PSG.storage.save.write(save);
      return { ok: true, id: id, xp: xpResult };
    }
  };
})(window.PSG);
