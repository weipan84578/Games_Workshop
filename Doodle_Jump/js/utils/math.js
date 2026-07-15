(function (Game) {
  "use strict";
  var MathUtil = {
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    lerp: function (a, b, amount) {
      return a + (b - a) * amount;
    },
    approach: function (value, target, delta) {
      return value < target
        ? Math.min(value + delta, target)
        : Math.max(value - delta, target);
    },
    rectsOverlap: function (a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    },
    horizontalOverlap: function (a, b) {
      return Math.max(
        0,
        Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
      );
    },
    distance: function (a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    },
    round: function (value, digits) {
      var factor = Math.pow(10, digits || 0);
      return Math.round(value * factor) / factor;
    },
    safeNumber: function (value, fallback) {
      return typeof value === "number" && Number.isFinite(value)
        ? value
        : fallback;
    },
  };
  Game.Math = Object.freeze(MathUtil);
})(window.DJGame);
