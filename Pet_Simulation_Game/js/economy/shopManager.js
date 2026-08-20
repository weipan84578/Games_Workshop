(function (PSG) {
  'use strict';

  PSG.economy.shop = {
    purchaseEquipment: function (save, itemId) {
      var item = PSG.data.equipmentById[itemId];
      if (!item) return { ok: false, reason: 'missing' };
      if (!PSG.economy.equipment.isStageUnlocked(item.stage, save.player.bestRank)) return { ok: false, reason: 'locked' };
      if (save.economy.ownedEquipment.indexOf(itemId) >= 0) return { ok: false, reason: 'owned' };
      if (save.player.coins < item.price) return { ok: false, reason: 'coins' };
      save.player.coins -= item.price; save.economy.ownedEquipment.push(itemId); PSG.storage.save.write(save);
      return { ok: true };
    },
    purchaseConsumable: function (save, itemId) {
      var item = PSG.data.consumableById[itemId];
      var count = save.economy.consumables[itemId] || 0;
      if (!item) return { ok: false, reason: 'missing' };
      if (!PSG.economy.equipment.isStageUnlocked(item.stage, save.player.bestRank)) return { ok: false, reason: 'locked' };
      if (count >= 99) return { ok: false, reason: 'full' };
      if (save.player.coins < item.price) return { ok: false, reason: 'coins' };
      save.player.coins -= item.price; save.economy.consumables[itemId] = count + 1; PSG.storage.save.write(save);
      return { ok: true };
    }
  };
})(window.PSG);
