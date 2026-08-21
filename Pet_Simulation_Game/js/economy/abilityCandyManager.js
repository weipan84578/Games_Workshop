(function (PSG) {
  'use strict';

  var REGULAR_CANDY_PRICE_FACTOR = 0.6;
  var FESTIVAL_PRICE_FACTOR = 0.5;
  var FESTIVAL_INTERVAL_DAYS = 5;

  function boostFor(save, stat) {
    return Math.max(0, Math.floor(Number(save.pet.candyBoosts && save.pet.candyBoosts[stat]) || 0));
  }

  function intrinsicValue(save, item) {
    return PSG.pet.stats.natural(save.pet.speciesId, save.pet.level)[item.stat] + boostFor(save, item.stat);
  }

  function roundedPrice(value) {
    return Math.ceil(value / 10) * 10;
  }

  function regularPriceFor(save, item) {
    var statCost = intrinsicValue(save, item) * item.priceWeight;
    var levelMultiplier = 1 + (save.pet.level - 1) * 0.025;
    return roundedPrice((120 + statCost) * levelMultiplier * REGULAR_CANDY_PRICE_FACTOR);
  }

  function isCandyFestival(save) {
    if (!save || !save.day || !save.ranking) return false;
    var seed = PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, 'candy-festival');
    return new PSG.utils.RNG(seed).next() < 1 / FESTIVAL_INTERVAL_DAYS;
  }

  function priceFor(save, itemOrId, festival) {
    var item = typeof itemOrId === 'string' ? PSG.data.abilityCandyById[itemOrId] : itemOrId;
    if (!item) return 0;
    var regularPrice = regularPriceFor(save, item);
    return festival ? regularPrice * FESTIVAL_PRICE_FACTOR : regularPrice;
  }

  function purchase(save, itemId, festival) {
    var item = PSG.data.abilityCandyById[itemId];
    if (!item) return { ok: false, reason: 'missing' };
    var price = priceFor(save, item, festival);
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
      nextPrice: priceFor(save, item, festival)
    };
  }

  PSG.economy.candy = {
    boostFor: boostFor,
    intrinsicValue: intrinsicValue,
    isCandyFestival: isCandyFestival,
    priceFor: priceFor,
    purchase: purchase
  };
})(window.PSG);
