(function (PSG) {
  'use strict';
  PSG.pet.model = {
    statusLabel: function (save) {
      return save.pet.mood >= 70 ? 'high' : save.pet.mood >= 30 ? 'mid' : 'low';
    },
    xpProgress: function (save) {
      return save.pet.level >= 100 ? 1 : save.pet.xp / PSG.pet.progression.xpToNext(save.pet.level);
    }
  };
})(window.PSG);
