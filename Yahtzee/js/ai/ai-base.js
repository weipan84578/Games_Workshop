window.YZ = window.YZ || {};
YZ.AI = YZ.AI || {};

YZ.AI.Base = (function () {
  function countEntries(dice) {
    var counts = YZ.Dice.counts(dice);
    return Object.keys(counts).map(function (face) {
      return { face: Number(face), count: counts[face] };
    }).sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return b.face - a.face;
    });
  }

  function holdFace(dice, face) {
    return dice.map(function (value) {
      return value === face;
    });
  }

  function holdFaces(dice, faces) {
    var lookup = {};
    faces.forEach(function (face) { lookup[face] = true; });
    return dice.map(function (value) {
      return !!lookup[value];
    });
  }

  function longestStraightFaces(dice) {
    var unique = YZ.Dice.sortedUnique(dice);
    var candidates = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6]
    ];
    var best = [];
    candidates.forEach(function (candidate) {
      var current = candidate.filter(function (face) {
        return unique.indexOf(face) !== -1;
      });
      if (current.length > best.length) best = current;
    });
    return best;
  }

  function randomOpen(score) {
    var open = YZ.Scoring.availableKeys(score);
    return open[Math.floor(Math.random() * open.length)];
  }

  function chooseBest(dice, score, weights) {
    var best = YZ.Scoring.bestAvailable(dice, score, weights);
    return best ? best.key : randomOpen(score);
  }

  function upperWeights(score, boostHigh) {
    var weights = {};
    YZ.Constants.UPPER_KEYS.forEach(function (key) {
      if (score[key] === null) {
        var face = YZ.Scoring.categoryMeta(key).face;
        weights[key] = face >= 4 ? boostHigh || 1.2 : 1.05;
      }
    });
    return weights;
  }

  function mergeWeights() {
    var merged = {};
    Array.prototype.slice.call(arguments).forEach(function (source) {
      Object.keys(source || {}).forEach(function (key) {
        merged[key] = source[key];
      });
    });
    return merged;
  }

  function allHeld(held) {
    return held.filter(Boolean).length === YZ.Constants.DICE_COUNT;
  }

  function damageControl(dice, score) {
    var open = YZ.Scoring.availableKeys(score);
    var previews = YZ.Scoring.scoreAll(dice, score);
    var positive = open.filter(function (key) {
      return previews[key].total > 0;
    });
    if (positive.length) {
      positive.sort(function (a, b) {
        return previews[b].total - previews[a].total;
      });
      return positive[0];
    }
    var preferredBurn = ["ones", "twos", "threes", "chance", "fourKind", "threeKind"];
    for (var i = 0; i < preferredBurn.length; i += 1) {
      if (open.indexOf(preferredBurn[i]) !== -1) return preferredBurn[i];
    }
    return open[0];
  }

  return {
    countEntries: countEntries,
    holdFace: holdFace,
    holdFaces: holdFaces,
    longestStraightFaces: longestStraightFaces,
    randomOpen: randomOpen,
    chooseBest: chooseBest,
    upperWeights: upperWeights,
    mergeWeights: mergeWeights,
    allHeld: allHeld,
    damageControl: damageControl
  };
})();
