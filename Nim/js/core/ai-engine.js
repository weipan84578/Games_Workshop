(function (NimGame) {
  'use strict';

  var OPTIMAL_RATE = {
    easy: 0,
    normal: 0.7,
    hard: 0.95,
    master: 1
  };

  function nimSum(piles) {
    return piles.reduce(function (sum, count) {
      return sum ^ count;
    }, 0);
  }

  function getLegalMoves(piles) {
    var moves = [];
    piles.forEach(function (count, pileIndex) {
      for (var amount = 1; amount <= count; amount += 1) {
        moves.push({ pileIndex: pileIndex, amount: amount });
      }
    });
    return moves;
  }

  function getRandomMove(piles) {
    var moves = getLegalMoves(piles);
    return moves[Math.floor(Math.random() * moves.length)] || null;
  }

  function findNormalOptimalMove(piles) {
    var sum = nimSum(piles);
    if (sum === 0) {
      return null;
    }
    for (var i = 0; i < piles.length; i += 1) {
      var target = piles[i] ^ sum;
      if (target < piles[i]) {
        return { pileIndex: i, amount: piles[i] - target };
      }
    }
    return null;
  }

  function findMisereOptimalMove(piles) {
    var nonZero = piles.filter(function (count) { return count > 0; });
    var largePileCount = nonZero.filter(function (count) { return count > 1; }).length;
    var onesCount = nonZero.filter(function (count) { return count === 1; }).length;

    if (largePileCount === 0) {
      var firstOne = piles.findIndex(function (count) { return count === 1; });
      return firstOne === -1 ? null : { pileIndex: firstOne, amount: 1 };
    }

    if (largePileCount === 1) {
      var largeIndex = piles.findIndex(function (count) { return count > 1; });
      var targetOnes = onesCount % 2 === 0 ? 1 : 0;
      var amount = piles[largeIndex] - targetOnes;
      return { pileIndex: largeIndex, amount: Math.max(1, amount) };
    }

    return findNormalOptimalMove(piles);
  }

  function findOptimalMove(piles, rule) {
    if (rule === 'misere') {
      return findMisereOptimalMove(piles);
    }
    return findNormalOptimalMove(piles);
  }

  function chooseMove(piles, options) {
    var settings = options || {};
    var difficulty = settings.difficulty || 'normal';
    var optimal = findOptimalMove(piles, settings.rule || 'misere');
    var rate = OPTIMAL_RATE[difficulty];

    if (optimal && Math.random() < rate) {
      return optimal;
    }

    return getRandomMove(piles);
  }

  NimGame.AIEngine = {
    OPTIMAL_RATE: OPTIMAL_RATE,
    nimSum: nimSum,
    getLegalMoves: getLegalMoves,
    getRandomMove: getRandomMove,
    findOptimalMove: findOptimalMove,
    chooseMove: chooseMove
  };
}(window.NimGame = window.NimGame || {}));
