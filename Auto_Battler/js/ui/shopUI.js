(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function cardMarkup(offer, state) {
    var base = app.UnitData.get(offer.typeId);
    if (!base) return "";
    var display = app.UnitData.getDisplay({ typeId: base.id, star: 1, instanceId: offer.offerId });
    var canBuy = state.gold >= base.cost && state.bench.length < 8 && state.mode === "prepare";
    var race = app.I18n.t("races." + display.race);
    var className = app.I18n.t("classes." + display.classId);
    return '<article class="shop-unit-card" style="--unit-color:' + display.color + '" title="' + display.ability + '"><div class="unit-portrait" aria-hidden="true">' + display.icon + '</div><div class="shop-unit-info"><div class="unit-name">' + display.name + '</div><div class="unit-stars">★</div><div class="unit-tags"><span class="tag">' + race + '</span><span class="tag">' + className + '</span></div></div><button class="shop-buy-button" type="button" data-action="buy-unit" data-offer-id="' + offer.offerId + '" ' + (canBuy ? "" : "disabled") + '>' + base.cost + '💰</button></article>';
  }

  app.ShopUI = {
    render: function (state) {
      var list = document.getElementById("shop-list");
      if (!list || !state) return;
      list.innerHTML = (state.shop || []).map(function (offer) { return cardMarkup(offer, state); }).join("");
      var lock = document.getElementById("lock-shop-button");
      if (lock) {
        lock.classList.toggle("lock-active", !!state.shopLocked);
        lock.innerHTML = state.shopLocked ? "🔓<span>" + app.I18n.t("game.unlock") + "</span>" : "🔒<span>" + app.I18n.t("game.lock") + "</span>";
      }
    }
  };
}(window));
