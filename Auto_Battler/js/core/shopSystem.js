(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var costWeights = {
    1: [1, 1, 1, 1, 1, 1, 1, 2, 2, 3],
    2: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
    3: [1, 1, 2, 2, 2, 3, 3, 4, 4, 5],
    4: [1, 2, 2, 3, 3, 3, 4, 4, 5, 5],
    5: [1, 2, 3, 3, 4, 4, 5, 5, 5, 5],
    6: [1, 2, 3, 3, 4, 4, 5, 5, 5, 5],
    7: [1, 2, 3, 4, 4, 4, 5, 5, 5, 5],
    8: [1, 2, 3, 4, 4, 5, 5, 5, 5, 5]
  };

  function pickCost(level) {
    var list = costWeights[Math.min(8, level)] || costWeights[1];
    return app.Helpers.pick(list);
  }

  function createOffer(typeId) {
    return { typeId: typeId, offerId: app.Helpers.uid("offer") };
  }

  app.ShopSystem = {
    generate: function (level) {
      return Array.from({ length: 5 }, function () {
        var cost = pickCost(level);
        var pool = app.UnitData.all.filter(function (unit) { return unit.cost === cost; });
        return createOffer(app.Helpers.pick(pool.length ? pool : app.UnitData.all).id);
      });
    },
    ensure: function (state) {
      if (!state.shop || state.shop.length !== 5) state.shop = this.generate(state.level);
    },
    refresh: function (state, force) {
      if (state.shopLocked && !force) return { ok: false, reason: "locked" };
      var cost = 2;
      if (!force && state.gold < cost) return { ok: false, reason: "gold" };
      if (!force) state.gold -= cost;
      state.shop = this.generate(state.level);
      return { ok: true, cost: force ? 0 : cost };
    },
    toggleLock: function (state) {
      state.shopLocked = !state.shopLocked;
      return state.shopLocked;
    },
    buy: function (state, offerId) {
      var offerIndex = state.shop.findIndex(function (offer) { return offer.offerId === offerId; });
      if (offerIndex < 0) return { ok: false, reason: "missing" };
      if (state.bench.length >= 8) return { ok: false, reason: "bench-full" };
      var base = app.UnitData.get(state.shop[offerIndex].typeId);
      var price = base ? app.UnitData.price(base.id, 1) : 0;
      if (!base || state.gold < price) return { ok: false, reason: "gold", cost: price };
      state.gold -= price;
      var unit = app.UnitData.create(base.id, 1);
      state.bench.push(unit);
      state.shop.splice(offerIndex, 1);
      state.shop.push(createOffer(app.Helpers.pick(app.UnitData.all).id));
      var merged = app.BoardSystem.autoMerge(state);
      return { ok: true, unit: unit, base: base, cost: price, merged: merged };
    }
  };
}(window));
