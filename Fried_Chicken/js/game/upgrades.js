(function (global) {
  "use strict";
  var CCC = global.CCC;

  CCC.upgrades = {
    priceForNext: function (id) {
      var level = CCC.state.progress.upgrades[id];
      var data = CCC.data.upgrades[id];
      return level >= 3 ? null : data.prices[level];
    },
    canBuy: function (id) {
      var price = this.priceForNext(id);
      return price !== null && CCC.state.progress.coins >= price;
    },
    buy: function (id) {
      if (!this.canBuy(id)) { return false; }
      var price = this.priceForNext(id);
      CCC.state.progress.coins -= price;
      CCC.state.progress.upgrades[id] += 1;
      CCC.storage.saveProgress();
      CCC.audio.play("upgrade");
      CCC.events.emit("progresschange", CCC.state.progress);
      return true;
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
