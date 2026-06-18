window.YZ = window.YZ || {};
YZ.AI = YZ.AI || {};

YZ.AI.normal = (function () {
  var Base = YZ.AI.Base;

  function selectHolds(dice, score) {
    var entries = Base.countEntries(dice);
    var straight = Base.longestStraightFaces(dice);
    var held;

    if (entries[0].count >= 3) {
      held = Base.holdFace(dice, entries[0].face);
    } else if (straight.length >= 4 && (score.smallStraight === null || score.largeStraight === null)) {
      held = Base.holdFaces(dice, straight);
    } else if (entries[0].count >= 2) {
      held = Base.holdFace(dice, entries[0].face);
    } else {
      held = dice.map(function (value) {
        return value >= 5;
      });
    }

    return {
      held: held,
      stop: Base.allHeld(held)
    };
  }

  function shouldStop(dice, score, rollsLeft) {
    var best = YZ.Scoring.bestAvailable(dice, score);
    if (!best) return false;
    if (best.key === "yahtzee" && best.preview.base === 50) return true;
    if (best.preview.total >= 30) return true;
    return rollsLeft <= 1 && best.preview.total >= 24;
  }

  function chooseCategory(dice, score) {
    var weights = Base.mergeWeights(Base.upperWeights(score, 1.28), {
      yahtzee: score.yahtzee === null ? 1.15 : 1,
      largeStraight: score.largeStraight === null ? 1.12 : 1,
      smallStraight: score.smallStraight === null ? 1.06 : 1,
      chance: score.chance === null ? 0.88 : 1
    });
    var best = YZ.Scoring.bestAvailable(dice, score, weights);
    if (best && (best.preview.total > 0 || YZ.Scoring.availableKeys(score).length <= 2)) return best.key;
    return Base.damageControl(dice, score);
  }

  return {
    selectHolds: selectHolds,
    shouldStop: shouldStop,
    chooseCategory: chooseCategory
  };
})();
