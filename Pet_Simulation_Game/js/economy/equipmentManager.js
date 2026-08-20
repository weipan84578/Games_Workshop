(function (PSG) {
  'use strict';

  function bonusesForEquipped(equipped) {
    var totals = { hp: 0, attack: 0, defense: 0, mobility: 0, spAttack: 0, spDefense: 0, speed: 0, crit: 0, passiveBp: 0 };
    Object.keys(equipped || {}).forEach(function (slot) {
      var item = PSG.data.equipmentById[equipped[slot]];
      if (!item) return;
      Object.keys(item.bonuses).forEach(function (key) { totals[key] = (totals[key] || 0) + item.bonuses[key]; });
    });
    return totals;
  }

  PSG.economy.equipment = {
    bonuses: bonusesForEquipped,
    isStageUnlocked: function (stage, bestRank) { return Number(bestRank) <= PSG.data.equipmentStages[stage - 1].threshold; },
    describe: function (item) {
      var t = PSG.i18n.t;
      var parts = [];
      Object.keys(item.bonuses).forEach(function (key) {
        if (key === 'crit') parts.push(t('stat.' + 'attack') + ' CRIT +' + Math.round(item.bonuses[key] * 100) + '%');
        else parts.push(t('stat.' + key) + ' +' + (item.bonuses[key] * 100).toFixed(item.bonuses[key] * 100 % 1 ? 1 : 0) + '%');
      });
      return parts.join(' · ');
    },
    equip: function (save, itemId) {
      var item = PSG.data.equipmentById[itemId];
      if (!item || save.economy.ownedEquipment.indexOf(itemId) < 0) return { ok: false, reason: 'notOwned' };
      var oldMax = PSG.pet.stats.effective(save).hp;
      save.economy.equipped[item.slot] = itemId;
      var newMax = PSG.pet.stats.effective(save).hp;
      save.pet.currentHp = Math.min(newMax, save.pet.currentHp + Math.max(0, newMax - oldMax));
      PSG.ranking.matchmaking.refresh(save);
      PSG.storage.save.write(save);
      return { ok: true, oldMax: oldMax, newMax: newMax };
    },
    unequip: function (save, slot) {
      var oldMax = PSG.pet.stats.effective(save).hp;
      save.economy.equipped[slot] = null;
      var newMax = PSG.pet.stats.effective(save).hp;
      save.pet.currentHp = Math.min(save.pet.currentHp, newMax);
      PSG.ranking.matchmaking.refresh(save);
      PSG.storage.save.write(save);
      return { ok: true, oldMax: oldMax, newMax: newMax };
    }
  };
})(window.PSG);
