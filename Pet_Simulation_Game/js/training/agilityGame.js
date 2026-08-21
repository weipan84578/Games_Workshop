(function (PSG) {
  'use strict';
  PSG.training.agility = {
    score: function (hits, misses) {
      return PSG.utils.math.clamp(Math.round(hits * 10 - misses * 3), 0, 100);
    }
  };
})(window.PSG);
