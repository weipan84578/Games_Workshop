(function registerScoring(app) {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  app.Scoring = {
    scoreSlot(slot, now) {
      const timing = app.Config.slotTiming;
      const cookedAge = slot.cookedAt ? now - slot.cookedAt : 0;
      const cookAccuracy = clamp(1 - cookedAge / timing.cookedToBurnt, 0, 1);
      const flipAccuracy = clamp(slot.flipAccuracy || 0.75, 0, 1);
      let score = 70;
      score += slot.hasOctopus ? 30 : 0;
      score += slot.hasTopping ? 25 : 0;
      score += Math.round(flipAccuracy * 35);
      score += Math.round(cookAccuracy * 35);
      score += slot.sauced ? 35 : 0;
      return score;
    },

    scoreBurnPenalty() {
      return -35;
    },

    starsForLevel(score, target) {
      const average = target > 0 ? score / target : 0;
      if (average >= 175) {
        return 3;
      }
      if (average >= 130) {
        return 2;
      }
      if (average >= 80) {
        return 1;
      }
      return 0;
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
