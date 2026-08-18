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
    enemyRangedDamageMultiplier: .6,
    playerEnergyRateMultiplier: 1.12
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
    formatTime: function (seconds) {
      var safe = Math.max(0, Math.ceil(seconds));
      var minutes = Math.floor(safe / 60);
      var remaining = safe % 60;
      return String(minutes).padStart(2, "0") + ":" + String(remaining).padStart(2, "0");
    },
    formatNumber: function (value) {
      return Math.round(value).toLocaleString();
    },
    percent: function (value, total) {
      return total > 0 ? app.utils.clamp((value / total) * 100, 0, 100) : 0;
    }
  };
})(window);
