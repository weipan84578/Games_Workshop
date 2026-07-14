(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var AI = BigTwo.AI = BigTwo.AI || {};

  function visibleControlBonus(move, state, playerId) {
    var evaluation = BigTwo.Rules.classifyHand(move);
    var threat = AI.Common.getThreatLevel(state, playerId);
    var bonus = 0;
    if (threat <= 1) {
      bonus += AI.Common.strengthOfMove(move) / 30;
      if (evaluation.type === 'single' && Config.RANK_VALUES[move[0].rank] === 12) {
        bonus += 500;
      }
      if (evaluation.type === 'pair' && Config.RANK_VALUES[move[0].rank] >= 11) {
        bonus += 350;
      }
    } else if (threat === 2) {
      bonus += AI.Common.strengthOfMove(move) / 180;
    }
    if (state.lastPlayedCards && state.lastPlayedCards.length &&
        evaluation.cardCount === state.lastPlayedCards.length) {
      bonus += 8;
    }
    return bonus;
  }

  function singletonPenalty(hand, move) {
    var selected = {};
    var remainingRanks = {};
    move.forEach(function (card) { selected[card.id] = true; });
    hand.forEach(function (card) {
      if (!selected[card.id]) {
        remainingRanks[card.rank] = (remainingRanks[card.rank] || 0) + 1;
      }
    });
    return Object.keys(remainingRanks).filter(function (rank) {
      return remainingRanks[rank] === 1;
    }).length;
  }

  function playedMemoryBonus(move, state) {
    var evaluation = BigTwo.Rules.classifyHand(move);
    var representativeKey;
    var higherCardsSeen = 0;
    if (!Array.isArray(state.actionHistory) || !state.actionHistory.length || evaluation.type !== 'single') {
      return 0;
    }
    representativeKey = BigTwo.Card.getKey(move[0]);
    state.actionHistory.forEach(function (action) {
      if (action && action.type === 'PLAY_CARDS' && Array.isArray(action.cardIds)) {
        action.cardIds.forEach(function (cardId) {
          var card = BigTwo.Card.parse(cardId);
          if (card && BigTwo.Card.getKey(card) > representativeKey) {
            higherCardsSeen += 1;
          }
        });
      }
    });
    return higherCardsSeen * 2;
  }

  function chooseHard(moves, hand, state, playerId, rng) {
    var nodeLimit = Number(rng && rng.nodeLimit) || Config.AI.hardNodeLimit;
    var timeLimit = Number(rng && rng.timeLimitMs) || Config.AI.hardTimeLimitMs;
    var now = rng && typeof rng.now === 'function' ? rng.now : Date.now;
    var started = now();
    var planner;
    var scored = [];
    var index;
    try {
      planner = AI.Common.createPlanningContext(hand, nodeLimit);
      for (index = 0; index < moves.length; index += 1) {
        if (now() - started > timeLimit) {
          throw new Error('AI_TIME_LIMIT');
        }
        scored.push({
          cards: moves[index],
          score: AI.Common.scoreNormalMove(moves[index], hand, planner, state, playerId) +
            visibleControlBonus(moves[index], state, playerId) -
            AI.Common.fragmentationCost(hand, moves[index]) * 3 -
            singletonPenalty(hand, moves[index]) * 2 +
            playedMemoryBonus(moves[index], state)
        });
      }
      return AI.Common.chooseHighestScored(scored, rng);
    } catch (error) {
      return AI.chooseNormal(moves, hand, state, playerId, rng);
    }
  }

  AI.chooseHard = chooseHard;
  AI.Hard = {
    visibleControlBonus: visibleControlBonus,
    singletonPenalty: singletonPenalty,
    playedMemoryBonus: playedMemoryBonus
  };
}(window));
