(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  var stages = [
    { round: 1, enemyUnitIds: ["emberfox", "mossling"] },
    { round: 2, enemyUnitIds: ["tidepup", "emberfox", "mossling"] },
    { round: 3, enemyUnitIds: ["stoneback", "moonmoth", "emberfox"] },
    { round: 4, enemyUnitIds: ["cloudmage", "tidepup", "thornknight", "mossling"] },
    { round: 5, enemyUnitIds: ["starseer", "stoneback", "moonmoth", "emberfox"] },
    { round: 6, enemyUnitIds: ["sunlion", "cloudmage", "thornknight", "tidepup", "mossling"] },
    { round: 7, enemyUnitIds: ["crystaldragon", "starseer", "sunlion", "stoneback", "moonmoth"] }
  ];

  app.StageData = {
    all: stages,
    get: function (round) {
      if (round <= stages.length) return stages[round - 1];
      return stages[(round - 1) % stages.length];
    },
    createEnemies: function (round) {
      var stage = this.get(round);
      var scale = 1 + Math.max(0, round - 1) * 0.055;
      return stage.enemyUnitIds.map(function (typeId) {
        var instance = app.UnitData.create(typeId, round >= 9 ? 2 : 1);
        instance.enemyScale = scale;
        return instance;
      });
    }
  };
}(window));
