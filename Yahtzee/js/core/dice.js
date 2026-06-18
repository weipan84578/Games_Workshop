window.YZ = window.YZ || {};

YZ.Dice = (function () {
  function roll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollSet(count) {
    var dice = [];
    for (var i = 0; i < count; i += 1) dice.push(roll());
    return dice;
  }

  function reroll(dice, held) {
    return dice.map(function (value, index) {
      return held[index] && value ? value : roll();
    });
  }

  function sum(dice) {
    return dice.reduce(function (total, value) {
      return total + (value || 0);
    }, 0);
  }

  function counts(dice) {
    var map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    dice.forEach(function (value) {
      if (map[value] !== undefined) map[value] += 1;
    });
    return map;
  }

  function sortedUnique(dice) {
    var seen = {};
    dice.forEach(function (value) {
      if (value) seen[value] = true;
    });
    return Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
  }

  function faceString(dice) {
    return dice.map(function (value) {
      return YZ.Constants.DIE_FACES[value] || "?";
    }).join(" ");
  }

  return {
    roll: roll,
    rollSet: rollSet,
    reroll: reroll,
    sum: sum,
    counts: counts,
    sortedUnique: sortedUnique,
    faceString: faceString
  };
})();
