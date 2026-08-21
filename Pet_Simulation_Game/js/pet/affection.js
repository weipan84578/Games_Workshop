(function (PSG) {
  'use strict';

  PSG.pet.affection = {
    add: function (save, amount) {
      var before = save.pet.affection;
      save.pet.affection = PSG.utils.math.clamp(before + Math.round(amount), 0, 100);
      save.progression.pendingAffectionEvents = save.progression.pendingAffectionEvents || [];
      PSG.constants.AFFECTION_THRESHOLDS.forEach(function (threshold) {
        var id = save.pet.speciesId + '_affection_' + threshold;
        if (
          before < threshold &&
          save.pet.affection >= threshold &&
          save.progression.viewedAffectionEvents.indexOf(id) < 0 &&
          save.progression.pendingAffectionEvents.indexOf(id) < 0
        ) {
          save.progression.pendingAffectionEvents.push(id);
        }
      });
      return save.pet.affection - before;
    },
    nextPending: function (save) {
      return (save.progression.pendingAffectionEvents || [])[0] || null;
    },
    markViewed: function (save, id) {
      if (save.progression.viewedAffectionEvents.indexOf(id) >= 0) return false;
      save.progression.pendingAffectionEvents = (save.progression.pendingAffectionEvents || []).filter(function (item) {
        return item !== id;
      });
      save.progression.viewedAffectionEvents.push(id);
      var threshold = Number(id.split('_').pop());
      var species = save.pet.speciesId;
      var unlocks = save.progression.unlockedCosmetics;
      function unlock(cosmeticId) {
        if (unlocks.indexOf(cosmeticId) < 0) unlocks.push(cosmeticId);
      }
      // Rewards are granted when the queued scene is acknowledged, making each one naturally idempotent.
      if (threshold === 20) {
        save.player.coins += 100;
        unlock(species + '_sticker_1');
      }
      if (threshold === 40) {
        var stage = 1;
        PSG.data.equipmentStages.forEach(function (row) {
          if (save.player.bestRank <= row.threshold) stage = row.id;
        });
        var itemId = 'con_' + stage + '_energy';
        save.economy.consumables[itemId] = Math.min(99, (save.economy.consumables[itemId] || 0) + 1);
        unlock(species + '_sticker_2');
      }
      if (threshold === 60) {
        unlock(species + '_nameplate');
        unlock(species + '_idle');
      }
      if (threshold === 80) {
        unlock(species + '_special_fx');
        unlock(species + '_champion_dialogue');
      }
      if (threshold === 100) {
        unlock('true_bond_title');
        unlock(species + '_final_photo');
      }
      return true;
    }
  };
})(window.PSG);
