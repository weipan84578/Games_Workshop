(function (PSG) {
  'use strict';

  PSG.utils.math = {
    clamp: function (value, min, max) { return Math.min(max, Math.max(min, value)); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    round: function (value) { return Math.round(Number(value) || 0); },
    floor: function (value) { return Math.floor(Number(value) || 0); },
    percentDifference: function (a, b) {
      if (!b) return a ? 100 : 0;
      return ((a - b) / b) * 100;
    }
  };
})(window.PSG);
