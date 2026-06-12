(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Helpers = {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    rand(min, max) {
      return min + Math.random() * (max - min);
    },

    randInt(min, max) {
      return Math.floor(this.rand(min, max + 1));
    },

    choice(items) {
      return items[Math.floor(Math.random() * items.length)];
    },

    dist(aX, aY, bX, bY) {
      const dx = aX - bX;
      const dy = aY - bY;
      return Math.hypot(dx, dy);
    },

    key(col, row) {
      return `${col},${row}`;
    },

    parseKey(key) {
      const parts = key.split(",");
      return { col: Number(parts[0]), row: Number(parts[1]) };
    },

    formatScore(score) {
      return String(Math.max(0, Math.floor(score))).padStart(6, "0");
    },

    cssVar(name, fallback) {
      const value = getComputedStyle(document.body).getPropertyValue(name).trim();
      return value || fallback;
    },

    now() {
      return performance.now();
    }
  };
})(window);
