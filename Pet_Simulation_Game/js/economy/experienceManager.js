(function (PSG) {
  'use strict';

  var XP_PER_PURCHASE = 100;
  var MAX_EXPERIENCE_PURCHASE = 9999;
  var BASE_EXPERIENCE_PRICE = 40;
  var EXPERIENCE_PRICE_STEP = 8;
  var MAX_EXPERIENCE_PRICE = 400;
  var FESTIVAL_PRICE_FACTOR = 0.6;

  function cloneForPricing(save) {
    return JSON.parse(JSON.stringify(save));
  }

  function quantityFor(value) {
    var quantity = Math.floor(Number(value));
    return Number.isFinite(quantity) && quantity >= 1 && quantity <= MAX_EXPERIENCE_PURCHASE ? quantity : 0;
  }

  function priceFor(save, festival) {
    var level = Math.max(1, Math.floor(Number(save.pet.level) || 1));
    var regularPrice = Math.min(MAX_EXPERIENCE_PRICE, BASE_EXPERIENCE_PRICE + (level - 1) * EXPERIENCE_PRICE_STEP);
    return festival ? Math.floor(regularPrice * FESTIVAL_PRICE_FACTOR) : regularPrice;
  }

  function maxQuantityFor(save) {
    if (!save || !save.pet || save.pet.level >= PSG.constants.MAX_LEVEL) return 0;
    var preview = cloneForPricing(save);
    var quantity = 0;
    while (quantity < MAX_EXPERIENCE_PURCHASE && preview.pet.level < PSG.constants.MAX_LEVEL) {
      PSG.pet.progression.addXp(preview, XP_PER_PURCHASE);
      quantity += 1;
    }
    return quantity;
  }

  function totalPriceFor(save, quantityValue, festival) {
    var quantity = quantityFor(quantityValue);
    var maxQuantity = maxQuantityFor(save);
    if (!quantity || quantity > maxQuantity) return 0;

    var preview = cloneForPricing(save);
    var total = 0;
    for (var index = 0; index < quantity; index += 1) {
      total += priceFor(preview, festival);
      PSG.pet.progression.addXp(preview, XP_PER_PURCHASE);
    }
    return total;
  }

  function preview(save, quantityValue, festival) {
    var quantity = quantityFor(quantityValue);
    if (!quantity) return { ok: false, reason: 'quantity' };
    var maxQuantity = maxQuantityFor(save);
    if (!maxQuantity) return { ok: false, reason: 'maxLevel', maxQuantity: 0 };
    if (quantity > maxQuantity) return { ok: false, reason: 'maxLevel', maxQuantity: maxQuantity };

    var copy = cloneForPricing(save);
    var beforeLevel = copy.pet.level;
    var beforeXp = copy.pet.xp;
    PSG.pet.progression.addXp(copy, XP_PER_PURCHASE * quantity);
    return {
      ok: true,
      quantity: quantity,
      xp: XP_PER_PURCHASE * quantity,
      price: totalPriceFor(save, quantity, festival),
      unitPrice: priceFor(save, festival),
      beforeLevel: beforeLevel,
      afterLevel: copy.pet.level,
      levels: copy.pet.level - beforeLevel,
      beforeXp: beforeXp,
      afterXp: copy.pet.xp,
      nextXp: copy.pet.level >= PSG.constants.MAX_LEVEL ? 0 : PSG.pet.progression.xpToNext(copy.pet.level),
      maxQuantity: maxQuantity
    };
  }

  function purchase(save, quantityValue, festival) {
    var plan = preview(save, quantityValue, festival);
    if (!plan.ok) return plan;
    if (save.player.coins < plan.price)
      return { ok: false, reason: 'coins', price: plan.price, quantity: plan.quantity };

    var result = PSG.pet.progression.addXp(save, plan.xp);
    save.player.coins = Math.max(0, Math.floor(Number(save.player.coins) || 0)) - plan.price;
    PSG.storage.save.write(save);
    return Object.assign({}, plan, {
      ok: true,
      levels: result.levels,
      beforeLevel: result.oldLevel,
      afterLevel: result.newLevel,
      afterXp: save.pet.xp,
      coins: save.player.coins
    });
  }

  PSG.economy.experience = {
    xpPerPurchase: XP_PER_PURCHASE,
    maxQuantity: MAX_EXPERIENCE_PURCHASE,
    basePrice: BASE_EXPERIENCE_PRICE,
    maxPrice: MAX_EXPERIENCE_PRICE,
    festivalPriceFactor: FESTIVAL_PRICE_FACTOR,
    quantityFor: quantityFor,
    priceFor: priceFor,
    maxQuantityFor: maxQuantityFor,
    totalPriceFor: totalPriceFor,
    preview: preview,
    purchase: purchase
  };
})(window.PSG);
