(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var AI = BigTwo.AI = BigTwo.AI || {};

  function chooseNormal(moves, hand, state, playerId, rng) {
    var planner;
    var scored;
    try {
      planner = AI.Common.createPlanningContext(hand, 20000);
      scored = moves.map(function (cards) {
        return { cards: cards, score: AI.Common.scoreNormalMove(cards, hand, planner, state, playerId) };
      });
      return AI.Common.chooseHighestScored(scored, rng);
    } catch (error) {
      return moves[0];
    }
  }

  AI.chooseNormal = chooseNormal;
}(window));
