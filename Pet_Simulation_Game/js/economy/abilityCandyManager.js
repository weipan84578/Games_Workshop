(function (PSG) {
  'use strict';

  var REGULAR_CANDY_PRICE_FACTOR = 0.6;
  var FESTIVAL_PRICE_FACTOR = 0.5;
  var FESTIVAL_INTERVAL_DAYS = 5;
  var MAX_CANDY_PURCHASE = 999;

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

  function quantityFor(value) {
    var quantity = Math.floor(Number(value));
    return Number.isFinite(quantity) && quantity >= 1 && quantity <= MAX_CANDY_PURCHASE ? quantity : 0;
  }

  function totalPriceFor(save, itemOrId, quantityValue, festival) {
    var item = typeof itemOrId === 'string' ? PSG.data.abilityCandyById[itemOrId] : itemOrId;
    var quantity = quantityFor(quantityValue);
    if (!item || !quantity) return 0;

    var preview = {
      pet: {
        speciesId: save.pet.speciesId,
        level: save.pet.level,
        candyBoosts: Object.assign({}, save.pet.candyBoosts || {})
      }
    };
    var total = 0;
    for (var index = 0; index < quantity; index += 1) {
      total += priceFor(preview, item, festival);
      preview.pet.candyBoosts[item.stat] = boostFor(preview, item.stat) + item.gain;
    }
    return total;
  }

  function applyGrant(save, item, quantity) {
    var oldMaxHp = PSG.pet.stats.effective(save).hp;
    var before = intrinsicValue(save, item);
    save.pet.candyBoosts = save.pet.candyBoosts || {};
    save.pet.candyBoosts[item.stat] = boostFor(save, item.stat) + item.gain * quantity;
    var newMaxHp = PSG.pet.stats.effective(save).hp;
    if (item.stat === 'hp') save.pet.currentHp = Math.min(newMaxHp, save.pet.currentHp + newMaxHp - oldMaxHp);
    return {
      ok: true,
      stat: item.stat,
      quantity: quantity,
      gain: item.gain * quantity,
      before: before,
      after: intrinsicValue(save, item),
      nextPrice: priceFor(save, item, false)
    };
  }

  function grant(save, itemId, quantityValue) {
    var item = PSG.data.abilityCandyById[itemId];
    if (!item) return { ok: false, reason: 'missing' };
    var quantity = quantityValue == null ? 1 : quantityFor(quantityValue);
    if (!quantity) return { ok: false, reason: 'quantity' };
    var result = applyGrant(save, item, quantity);
    PSG.ranking.matchmaking.refresh(save);
    return result;
  }

  function purchase(save, itemId, festival, quantityValue) {
    var item = PSG.data.abilityCandyById[itemId];
    if (!item) return { ok: false, reason: 'missing' };
    var quantity = quantityValue == null ? 1 : quantityFor(quantityValue);
    if (!quantity) return { ok: false, reason: 'quantity' };
    var unitPrice = priceFor(save, item, festival);
    var price = totalPriceFor(save, item, quantity, festival);
    if (save.player.coins < price) return { ok: false, reason: 'coins', price: price };

    var result = applyGrant(save, item, quantity);
    save.player.coins -= price;
    PSG.ranking.matchmaking.refresh(save);
    PSG.storage.save.write(save);
    return Object.assign(result, {
      price: price,
      unitPrice: unitPrice,
      nextPrice: priceFor(save, item, festival)
    });
  }

  PSG.economy.candy = {
    boostFor: boostFor,
    intrinsicValue: intrinsicValue,
    isCandyFestival: isCandyFestival,
    priceFor: priceFor,
    quantityFor: quantityFor,
    totalPriceFor: totalPriceFor,
    maxQuantity: MAX_CANDY_PURCHASE,
    grant: grant,
    purchase: purchase
  };
})(window.PSG);
