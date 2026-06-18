window.YZ = window.YZ || {};
YZ.AI = YZ.AI || {};

YZ.AI.easy = (function () {
  var Base = YZ.AI.Base;

  function selectHolds(dice, score, rollsLeft) {
    var entries = Base.countEntries(dice);
    var held = Array(YZ.Constants.DICE_COUNT).fill(false);
    if (entries[0].count >= 2 && Math.random() > 0.25) {
      held = Base.holdFace(dice, entries[0].face);
    } else {
      held = dice.map(function (value) {
        return value >= 5 && Math.random() > 0.45;
      });
    }
    return {
      held: held,
      stop: rollsLeft <= 1 && Math.random() > 0.65
    };
  }

  function shouldStop(dice, score, rollsLeft) {
    var best = YZ.Scoring.bestAvailable(dice, score);
    return !!best && (best.preview.total >= 30 || rollsLeft <= 1 && best.preview.total >= 22);
  }

  function chooseCategory(dice, score) {
    if (Math.random() < 0.38) return Base.randomOpen(score);
    var best = YZ.Scoring.bestAvailable(dice, score);
    if (best && best.preview.total > 0) return best.key;
    return Base.damageControl(dice, score);
  }

  return {
    selectHolds: selectHolds,
    shouldStop: shouldStop,
    chooseCategory: chooseCategory
  };
})();
