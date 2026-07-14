(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var AI = BigTwo.AI = BigTwo.AI || {};

  function chooseEasy(moves, hand, state, playerId, rng) {
    var weighted = [];
    var total = 0;
    var roll;
    moves.forEach(function (cards, index) {
      var evaluation = BigTwo.Rules.classifyHand(cards);
      var weight = Math.max(1, moves.length - index);
      if (!state.lastPlayedCards.length && (evaluation.type === 'single' || evaluation.type === 'pair')) {
        weight *= 3;
      }
      total += weight;
      weighted.push({ cards: cards, ceiling: total });
    });
    roll = BigTwo.Utils.RNG.next(rng) * total;
    return weighted.filter(function (entry) { return roll < entry.ceiling; })[0].cards;
  }

  AI.chooseEasy = chooseEasy;
}(window));
