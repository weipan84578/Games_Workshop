(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function init(api) {
    document.getElementById("mobile-pause").addEventListener("click", api.pauseBattle);
    document.getElementById("mobile-summon-toggle").addEventListener("click", function () {
      app.BattleHUD.togglePanel();
      app.AudioManager.playSfx("click");
    });
    document.getElementById("mobile-income-upgrade").addEventListener("click", function () {
      api.upgradeIncome();
    });
  }

  app.MobileControls = { init: init };
})(window);
