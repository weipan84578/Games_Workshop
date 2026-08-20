(function (PSG) {
  'use strict';
  PSG.training.endurance = {
    scoreAt: function (phase) {
      var target = 0.72;
      return Math.round(PSG.utils.math.clamp(100 - Math.abs(target - PSG.utils.math.clamp(phase, 0, 1)) * 260, 0, 100));
    }
  };
})(window.PSG);
