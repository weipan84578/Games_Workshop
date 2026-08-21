(function (PSG) {
  'use strict';

  var MAX_UPGRADE_QUANTITY = 999;

  function whole(value) {
    var number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
  }

  function quantityFor(value) {
    var quantity = whole(value);
    return quantity >= 1 ? Math.min(MAX_UPGRADE_QUANTITY, quantity) : 0;
  }

  function upgradeLevel(save, itemId) {
    return whole(save && save.economy && save.economy.equipmentUpgrades && save.economy.equipmentUpgrades[itemId]);
  }

  function bonusesForItem(item, level) {
    var bonuses = {};
    var upgrade = item.mythic ? whole(level) * 0.001 : 0;
    Object.keys(item.bonuses || {}).forEach(function (key) {
      bonuses[key] = item.bonuses[key] + (key === 'crit' ? 0 : upgrade);
    });
    return bonuses;
  }

  function bonusesForEquipped(equipped, upgrades) {
    var totals = {
      hp: 0,
      attack: 0,
      accuracy: 0,
      defense: 0,
      mobility: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 0,
      crit: 0,
      passiveBp: 0
    };
    Object.keys(equipped || {}).forEach(function (slot) {
      var item = PSG.data.equipmentById[equipped[slot]];
      if (!item) return;
      var bonuses = bonusesForItem(item, item.mythic && upgrades ? upgrades[item.id] : 0);
      Object.keys(bonuses).forEach(function (key) {
        totals[key] = (totals[key] || 0) + bonuses[key];
      });
    });
    return totals;
  }

  function upgradePrice(item, level) {
    if (!item || !item.mythic) return 0;
    return Math.ceil(item.upgradeBasePrice * (1 + whole(level) * item.upgradePriceRate));
  }

  function upgradeTotalPrice(item, level, quantity) {
    var count = quantityFor(quantity);
    var total = 0;
    for (var index = 0; index < count; index += 1) total += upgradePrice(item, whole(level) + index);
    return total;
  }

  function grantMythic(save) {
    save.economy = save.economy || {};
    save.economy.ownedEquipment = Array.isArray(save.economy.ownedEquipment) ? save.economy.ownedEquipment : [];
    save.economy.equipmentUpgrades = save.economy.equipmentUpgrades || {};
    var added = [];
    PSG.data.mythicEquipment.forEach(function (item) {
      if (save.economy.ownedEquipment.indexOf(item.id) < 0) {
        save.economy.ownedEquipment.push(item.id);
        added.push(item.id);
      }
      save.economy.equipmentUpgrades[item.id] = whole(save.economy.equipmentUpgrades[item.id]);
    });
    return added;
  }

  function upgradePreview(save, itemId, quantity) {
    var item = PSG.data.equipmentById[itemId];
    if (!item) return { ok: false, reason: 'missing' };
    if (!item.mythic) return { ok: false, reason: 'notMythic' };
    if (save.economy.ownedEquipment.indexOf(itemId) < 0) return { ok: false, reason: 'notOwned' };
    var count = quantityFor(quantity);
    if (!count) return { ok: false, reason: 'quantity' };
    var beforeLevel = upgradeLevel(save, itemId);
    var price = upgradeTotalPrice(item, beforeLevel, count);
    return {
      ok: true,
      itemId: itemId,
      quantity: count,
      beforeLevel: beforeLevel,
      afterLevel: beforeLevel + count,
      price: price,
      nextPrice: upgradePrice(item, beforeLevel + count),
      affordable: save.player.coins >= price
    };
  }

  PSG.economy.equipment = {
    bonuses: bonusesForEquipped,
    maxUpgradeQuantity: MAX_UPGRADE_QUANTITY,
    mythicIds: function () {
      return PSG.data.mythicEquipment.map(function (item) {
        return item.id;
      });
    },
    upgradeLevel: upgradeLevel,
    upgradePrice: function (save, itemId) {
      var item = PSG.data.equipmentById[itemId];
      return upgradePrice(item, upgradeLevel(save, itemId));
    },
    upgradePriceFor: function (itemId, level) {
      return upgradePrice(PSG.data.equipmentById[itemId], level);
    },
    upgradeTotalPrice: function (save, itemId, quantity) {
      var item = PSG.data.equipmentById[itemId];
      return upgradeTotalPrice(item, upgradeLevel(save, itemId), quantity);
    },
    grantMythic: grantMythic,
    upgradePreview: upgradePreview,
    isStageUnlocked: function (stage, bestRank) {
      return Number(bestRank) <= PSG.data.equipmentStages[stage - 1].threshold;
    },
    describe: function (item, context) {
      var t = PSG.i18n.t;
      var level = context && context.economy ? upgradeLevel(context, item.id) : whole(context);
      var bonuses = bonusesForItem(item, level);
      var parts = [];
      Object.keys(bonuses).forEach(function (key) {
        if (key === 'crit') parts.push(t('stat.' + 'attack') + ' CRIT +' + Math.round(bonuses[key] * 100) + '%');
        else parts.push(t('stat.' + key) + ' +' + (bonuses[key] * 100).toFixed((bonuses[key] * 100) % 1 ? 1 : 0) + '%');
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
    },
    upgrade: function (save, itemId, quantity) {
      var plan = upgradePreview(save, itemId, quantity);
      if (!plan.ok) return plan;
      if (!plan.affordable) return Object.assign({}, plan, { ok: false, reason: 'coins' });
      save.economy.equipmentUpgrades = save.economy.equipmentUpgrades || {};
      save.economy.equipmentUpgrades[itemId] = plan.afterLevel;
      save.player.coins -= plan.price;
      PSG.ranking.matchmaking.refresh(save);
      PSG.storage.save.write(save);
      return plan;
    }
  };
})(window.PSG);
