window.YZ = window.YZ || {};
YZ.AI = YZ.AI || {};

YZ.AI.hard = (function () {
  var Base = YZ.AI.Base;

  function upperTargetFace(dice, score) {
    var entries = Base.countEntries(dice).filter(function (entry) {
      var meta = YZ.Constants.SCORE_CATEGORIES.filter(function (item) {
        return item.face === entry.face;
      })[0];
      return meta && score[meta.key] === null;
    });
    if (!entries.length) return null;
    entries.sort(function (a, b) {
      var av = a.count * a.face + (a.face >= 4 ? 3 : 0);
      var bv = b.count * b.face + (b.face >= 4 ? 3 : 0);
      return bv - av;
    });
    return entries[0].face;
  }

  function selectHolds(dice, score) {
    var entries = Base.countEntries(dice);
    var straight = Base.longestStraightFaces(dice);
    var held;

    if ((score.yahtzee === null || score.yahtzee === 50) && entries[0].count >= 3) {
      held = Base.holdFace(dice, entries[0].face);
    } else if (score.largeStraight === null && straight.length >= 4) {
      held = Base.holdFaces(dice, straight);
    } else if (score.smallStraight === null && straight.length >= 3 && entries[0].count < 3) {
      held = Base.holdFaces(dice, straight);
    } else {
      var face = upperTargetFace(dice, score);
      if (face && YZ.Dice.counts(dice)[face] >= 2) {
        held = Base.holdFace(dice, face);
      } else if (entries[0].count >= 2) {
        held = Base.holdFace(dice, entries[0].face);
      } else {
        held = dice.map(function (value) { return value >= 5; });
      }
    }

    return {
      held: held,
      stop: Base.allHeld(held)
    };
  }

  function shouldStop(dice, score, rollsLeft) {
    var best = YZ.Scoring.bestAvailable(dice, score, strategyWeights(score));
    if (!best) return false;
    if (best.key === "yahtzee" && best.preview.base === 50) return true;
    if (best.key === "largeStraight" && best.preview.base === 40) return true;
    if (best.key === "fullHouse" && best.preview.base === 25 && rollsLeft <= 1) return true;
    if (best.preview.total >= 35) return true;
    return rollsLeft <= 1 && best.preview.total >= 26;
  }

  function strategyWeights(score) {
    var totals = YZ.Scoring.totals(score);
    var filledUpper = YZ.Constants.UPPER_KEYS.filter(function (key) {
      return score[key] !== null;
    }).length;
    var upperPace = filledUpper ? totals.upperSubtotal / filledUpper : 0;
    var upperBoost = upperPace < 10.5 ? 1.45 : 1.22;
    return Base.mergeWeights(Base.upperWeights(score, upperBoost), {
      yahtzee: score.yahtzee === null ? 1.35 : 1.05,
      largeStraight: score.largeStraight === null ? 1.25 : 1,
      smallStraight: score.smallStraight === null ? 1.1 : 1,
      fullHouse: score.fullHouse === null ? 1.08 : 1,
      chance: score.chance === null ? 0.78 : 1,
      ones: score.ones === null ? 0.82 : 1,
      twos: score.twos === null ? 0.9 : 1
    });
  }

  function chooseCategory(dice, score) {
    var best = YZ.Scoring.bestAvailable(dice, score, strategyWeights(score));
    if (best && best.preview.total > 0) return best.key;
    return Base.damageControl(dice, score);
  }

  return {
    selectHolds: selectHolds,
    shouldStop: shouldStop,
    chooseCategory: chooseCategory
  };
})();
