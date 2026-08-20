(function (PSG) {
  'use strict';
  PSG.training.strength = {
    scoreAt: function (phase) {
      var distance = Math.abs(0.5 - PSG.utils.math.clamp(phase, 0, 1));
      return Math.round(PSG.utils.math.clamp(100 - distance * 240, 0, 100));
    }
  };
})(window.PSG);
