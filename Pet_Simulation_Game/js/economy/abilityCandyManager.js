(function (PSG) {
  'use strict';

  var CANDY_PRICE_FACTOR = 0.60;

  function boostFor(save, stat) {
    return Math.max(0, Math.floor(Number(save.pet.candyBoosts && save.pet.candyBoosts[stat]) || 0));
  }

  function intrinsicValue(save, item) {
    return PSG.pet.stats.natural(save.pet.speciesId, save.pet.level)[item.stat] + boostFor(save, item.stat);
  }

  function priceFor(save, itemOrId) {
    var item = typeof itemOrId === 'string' ? PSG.data.abilityCandyById[itemOrId] : itemOrId;
    if (!item) return 0;
    var statCost = intrinsicValue(save, item) * item.priceWeight;
    var levelMultiplier = 1 + (save.pet.level - 1) * 0.025;
    // Apply the requested 40% price reduction, then round upward to a clean shop price.
    return Math.ceil(((120 + statCost) * levelMultiplier * CANDY_PRICE_FACTOR) / 10) * 10;
  }

  function purchase(save, itemId) {
    var item = PSG.data.abilityCandyById[itemId];
    if (!item) return { ok: false, reason: 'missing' };
    var price = priceFor(save, item);
    if (save.player.coins < price) return { ok: false, reason: 'coins', price: price };

    var oldMaxHp = PSG.pet.stats.effective(save).hp;
    var before = intrinsicValue(save, item);
    save.player.coins -= price;
    save.pet.candyBoosts = save.pet.candyBoosts || {};
    save.pet.candyBoosts[item.stat] = boostFor(save, item.stat) + item.gain;
    var newMaxHp = PSG.pet.stats.effective(save).hp;
    if (item.stat === 'hp') save.pet.currentHp = Math.min(newMaxHp, save.pet.currentHp + newMaxHp - oldMaxHp);

    PSG.ranking.matchmaking.refresh(save);
    PSG.storage.save.write(save);
    return {
      ok: true,
      stat: item.stat,
      gain: item.gain,
      price: price,
      before: before,
      after: intrinsicValue(save, item),
      nextPrice: priceFor(save, item)
    };
  }

  PSG.economy.candy = {
    boostFor: boostFor,
    intrinsicValue: intrinsicValue,
    priceFor: priceFor,
    purchase: purchase
  };
})(window.PSG);
