window.YZ = window.YZ || {};

YZ.Scoring = (function () {
  var C = YZ.Constants;

  function emptyScoreSheet() {
    var sheet = {};
    C.SCORE_KEYS.forEach(function (key) {
      sheet[key] = null;
    });
    sheet.yahtzeeBonus = 0;
    return sheet;
  }

  function normalizeScoreSheet(input) {
    var sheet = emptyScoreSheet();
    input = input || {};
    C.SCORE_KEYS.forEach(function (key) {
      sheet[key] = input[key] === undefined ? null : input[key];
    });
    sheet.yahtzeeBonus = Number(input.yahtzeeBonus || 0);
    return sheet;
  }

  function hasRolled(dice) {
    return dice && dice.some(function (value) { return value > 0; });
  }

  function isYahtzee(dice) {
    return hasRolled(dice) && dice.every(function (value) { return value === dice[0]; });
  }

  function hasCount(counts, target) {
    return Object.keys(counts).some(function (key) {
      return counts[key] >= target;
    });
  }

  function hasSmallStraight(dice) {
    var uniq = YZ.Dice.sortedUnique(dice).join("");
    return uniq.indexOf("1234") !== -1 || uniq.indexOf("2345") !== -1 || uniq.indexOf("3456") !== -1;
  }

  function hasLargeStraight(dice) {
    var uniq = YZ.Dice.sortedUnique(dice).join("");
    return uniq === "12345" || uniq === "23456";
  }

  function isFullHouse(dice) {
    var values = Object.keys(YZ.Dice.counts(dice)).map(function (key) {
      return YZ.Dice.counts(dice)[key];
    }).filter(function (count) {
      return count > 0;
    }).sort(function (a, b) {
      return a - b;
    });
    return values.length === 2 && values[0] === 2 && values[1] === 3;
  }

  function qualifiesYahtzeeBonus(score, dice) {
    return isYahtzee(dice) && score && score.yahtzee === C.YAHTZEE_POINTS;
  }

  function scoreCategory(key, dice, score) {
    if (!hasRolled(dice)) return 0;
    var counts = YZ.Dice.counts(dice);
    var total = YZ.Dice.sum(dice);
    var joker = qualifiesYahtzeeBonus(score, dice);
    var category = C.SCORE_CATEGORIES.filter(function (item) { return item.key === key; })[0];

    if (category && category.section === "upper") {
      return counts[category.face] * category.face;
    }

    if (key === "threeKind") return hasCount(counts, 3) ? total : 0;
    if (key === "fourKind") return hasCount(counts, 4) ? total : 0;
    if (key === "fullHouse") return (isFullHouse(dice) || joker) ? 25 : 0;
    if (key === "smallStraight") return (hasSmallStraight(dice) || joker) ? 30 : 0;
    if (key === "largeStraight") return (hasLargeStraight(dice) || joker) ? 40 : 0;
    if (key === "yahtzee") return isYahtzee(dice) ? C.YAHTZEE_POINTS : 0;
    if (key === "chance") return total;
    return 0;
  }

  function previewScore(key, dice, score) {
    var base = scoreCategory(key, dice, score);
    var bonus = key !== "yahtzee" && qualifiesYahtzeeBonus(score, dice) ? C.YAHTZEE_BONUS_POINTS : 0;
    return {
      base: base,
      bonus: bonus,
      total: base + bonus
    };
  }

  function applyScore(score, key, dice) {
    var preview = previewScore(key, dice, score);
    score[key] = preview.base;
    if (preview.bonus) score.yahtzeeBonus += preview.bonus;
    return preview;
  }

  function availableKeys(score) {
    return C.SCORE_KEYS.filter(function (key) {
      return score[key] === null;
    });
  }

  function scoreAll(dice, score) {
    var result = {};
    availableKeys(score).forEach(function (key) {
      result[key] = previewScore(key, dice, score);
    });
    return result;
  }

  function upperSubtotal(score) {
    return C.UPPER_KEYS.reduce(function (total, key) {
      return total + (score[key] || 0);
    }, 0);
  }

  function lowerSubtotal(score) {
    return C.LOWER_KEYS.reduce(function (total, key) {
      return total + (score[key] || 0);
    }, 0);
  }

  function totals(score) {
    var upper = upperSubtotal(score);
    var upperBonus = upper >= C.UPPER_BONUS_TARGET ? C.UPPER_BONUS_POINTS : 0;
    var lower = lowerSubtotal(score);
    var yahtzeeBonus = score.yahtzeeBonus || 0;
    return {
      upperSubtotal: upper,
      upperBonus: upperBonus,
      lowerSubtotal: lower,
      yahtzeeBonus: yahtzeeBonus,
      grandTotal: upper + upperBonus + lower + yahtzeeBonus
    };
  }

  function filledCount(score) {
    return C.SCORE_KEYS.filter(function (key) {
      return score[key] !== null;
    }).length;
  }

  function isComplete(score) {
    return filledCount(score) === C.SCORE_KEYS.length;
  }

  function bestAvailable(dice, score, weights) {
    var all = scoreAll(dice, score);
    var best = null;
    Object.keys(all).forEach(function (key) {
      var weight = weights && weights[key] !== undefined ? weights[key] : 1;
      var strategic = all[key].total * weight;
      if (!best || strategic > best.strategic || (strategic === best.strategic && all[key].total > best.preview.total)) {
        best = { key: key, preview: all[key], strategic: strategic };
      }
    });
    return best;
  }

  function categoryMeta(key) {
    return C.SCORE_CATEGORIES.filter(function (item) {
      return item.key === key;
    })[0];
  }

  return {
    emptyScoreSheet: emptyScoreSheet,
    normalizeScoreSheet: normalizeScoreSheet,
    hasRolled: hasRolled,
    isYahtzee: isYahtzee,
    hasSmallStraight: hasSmallStraight,
    hasLargeStraight: hasLargeStraight,
    isFullHouse: isFullHouse,
    scoreCategory: scoreCategory,
    previewScore: previewScore,
    applyScore: applyScore,
    availableKeys: availableKeys,
    scoreAll: scoreAll,
    upperSubtotal: upperSubtotal,
    lowerSubtotal: lowerSubtotal,
    totals: totals,
    filledCount: filledCount,
    isComplete: isComplete,
    bestAvailable: bestAvailable,
    categoryMeta: categoryMeta,
    qualifiesYahtzeeBonus: qualifiesYahtzeeBonus
  };
})();
