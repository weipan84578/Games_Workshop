(function (PSG) {
  'use strict';
  var HOME_TALK_VARIANTS = 4;
  PSG.pet.model = {
    statusLabel: function (save) {
      return save.pet.mood >= 70 ? 'high' : save.pet.mood >= 30 ? 'mid' : 'low';
    },
    talkKey: function (save, state) {
      var moodState = state || this.statusLabel(save);
      var variant = new PSG.utils.RNG(
        PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, moodState, 'home-talk')
      ).int(1, HOME_TALK_VARIANTS);
      return 'home.talk.' + moodState + '.' + variant;
    },
    xpProgress: function (save) {
      return save.pet.level >= 100 ? 1 : save.pet.xp / PSG.pet.progression.xpToNext(save.pet.level);
    }
  };
})(window.PSG);
