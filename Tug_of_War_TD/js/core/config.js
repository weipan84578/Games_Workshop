(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var uid = 0;

  app.Config = Object.freeze({
    version: "1.0.0",
    world: { width: 1000, height: 560, laneY: 350 },
    storageKey: "tug-of-war-td-save-v1",
    defaultTheme: "cute-pink",
    defaultLanguage: "zh",
    maxDelta: 0.05,
    lowPerformanceUnitLimit: 36,
    enemyRangedDamageMultiplier: .8,
    playerEnergyRateMultiplier: 1.24,
    unitCostMultiplier: .8,
    playerDefensiveHpMultiplier: 1.2,
    playerDefensiveDefenseBonus: .2
  });

  app.utils = {
    clamp: function (value, min, max) {
      return Math.min(max, Math.max(min, value));
    },
    lerp: function (a, b, amount) {
      return a + (b - a) * amount;
    },
    randomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomItem: function (items) {
      return items[Math.floor(Math.random() * items.length)];
    },
    uid: function (prefix) {
      uid += 1;
      return (prefix || "id") + "-" + uid + "-" + Date.now().toString(36);
    },
    clone: function (value) {
      return JSON.parse(JSON.stringify(value));
    },
    formatNumber: function (value) {
      return Math.round(value).toLocaleString();
    },
    getUnitCost: function (definition) {
      if (!definition || definition.isBoss || !definition.cost) {
        return definition ? definition.cost : 0;
      }
      return Math.max(1, Math.round(definition.cost * app.Config.unitCostMultiplier));
    },
    getUnitMaxHp: function (definition, side) {
      var multiplier = side === "player" && definition && definition.defensive ? app.Config.playerDefensiveHpMultiplier : 1;
      return Math.round((definition ? definition.hp : 0) * multiplier);
    },
    getUnitDefense: function (definition, side) {
      var defense = Number(definition && definition.defense || 0);
      if (side === "player" && definition && definition.defensive) {
        defense += app.Config.playerDefensiveDefenseBonus;
      }
      return app.utils.clamp(defense, 0, .9);
    },
    percent: function (value, total) {
      return total > 0 ? app.utils.clamp((value / total) * 100, 0, 100) : 0;
    }
  };
})(window);
