(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var AI = BigTwo.AI = BigTwo.AI || {};
  var Common = AI.Common = AI.Common || {};

  function getOwnPlayer(state, playerId) {
    var index;
    for (index = 0; index < state.players.length; index += 1) {
      if (state.players[index].id === playerId) {
        return state.players[index];
      }
    }
    return null;
  }

  function getPublicCardCount(player, ownPlayerId) {
    if (typeof player.cardCount === 'number') {
      return player.cardCount;
    }
    if (typeof player.remainingCards === 'number') {
      return player.remainingCards;
    }
    if (player.id === ownPlayerId && Array.isArray(player.hand)) {
      return player.hand.length;
    }
    return 13;
  }

  function getThreatLevel(state, ownPlayerId) {
    var minimum = 13;
    state.players.forEach(function (player) {
      if (player.id !== ownPlayerId) {
        minimum = Math.min(minimum, getPublicCardCount(player, ownPlayerId));
      }
    });
    return minimum;
  }

  function toAction(playerId, cards) {
    return {
      type: 'PLAY_CARDS',
      playerId: playerId,
      cardIds: cards.map(function (card) { return card.id; })
    };
  }

  function attachRngState(action, rng) {
    if (rng && typeof rng.getState === 'function') {
      action.rngState = rng.getState();
    }
    return action;
  }

  function randomIndex(length, rng) {
    if (length <= 1) {
      return 0;
    }
    return Math.floor(BigTwo.Utils.RNG.next(rng) * length);
  }

  function chooseHighestScored(scored, rng) {
    var maximum = -Infinity;
    var best = [];
    scored.forEach(function (entry) {
      if (entry.score > maximum) {
        maximum = entry.score;
        best = [entry];
      } else if (entry.score === maximum) {
        best.push(entry);
      }
    });
    best.sort(function (left, right) {
      return BigTwo.Utils.makeCardSignature(left.cards)
        .localeCompare(BigTwo.Utils.makeCardSignature(right.cards));
    });
    return best[randomIndex(best.length, rng)].cards;
  }

  function strengthOfMove(cards) {
    var evaluation = BigTwo.Rules.classifyHand(cards);
    var typeStrength = cards.length === 5 ? Config.FIVE_CARD_STRENGTH[evaluation.type] : 0;
    return typeStrength * 10000 + evaluation.tieBreakers.reduce(function (total, value, index) {
      return total + value * Math.pow(20, evaluation.tieBreakers.length - index - 1);
    }, 0);
  }

  function fragmentationCost(hand, move) {
    var allCounts = {};
    var selectedCounts = {};
    var cost = 0;
    var evaluation = BigTwo.Rules.classifyHand(move);
    hand.forEach(function (card) {
      allCounts[card.rank] = (allCounts[card.rank] || 0) + 1;
    });
    move.forEach(function (card) {
      selectedCounts[card.rank] = (selectedCounts[card.rank] || 0) + 1;
    });
    Object.keys(selectedCounts).forEach(function (rank) {
      var total = allCounts[rank];
      var used = selectedCounts[rank];
      if (total >= 2 && used < total) {
        cost += (total - used) * (total === 4 ? 7 : (total === 3 ? 4 : 2));
      }
    });
    if (move.length === 1 && allCounts[move[0].rank] >= 2) {
      cost += 5;
    }
    if ((evaluation.type === 'fourOfAKind' || evaluation.type === 'straightFlush') && move.length < hand.length) {
      cost += 9;
    }
    return cost;
  }

  function controlCost(move, remainingCount) {
    var cost = 0;
    move.forEach(function (card) {
      var rank = Config.RANK_VALUES[card.rank];
      if (rank === 12) { cost += 10; }
      else if (rank === 11) { cost += 4; }
      else if (rank >= 9) { cost += 1.5; }
      if (rank >= 11 && card.suit === 'spades') { cost += 1; }
    });
    return remainingCount === 0 ? 0 : cost;
  }

  function planningContext(hand, nodeLimit) {
    var ids = {};
    var fullMask = 0;
    var moveMasks;
    var cache = { 0: 0 };
    var nodes = 0;
    hand.forEach(function (card, index) {
      ids[card.id] = index;
      fullMask |= (1 << index);
    });
    moveMasks = BigTwo.Rules.getLegalMoves(hand, [], {}).map(function (move) {
      return move.reduce(function (mask, card) { return mask | (1 << ids[card.id]); }, 0);
    }).filter(function (mask, index, masks) { return masks.indexOf(mask) === index; });

    function minimumTurns(mask) {
      var first;
      var best;
      var index;
      var candidate;
      if (Object.prototype.hasOwnProperty.call(cache, mask)) {
        return cache[mask];
      }
      nodes += 1;
      if (nodes > nodeLimit) {
        throw new Error('AI_NODE_LIMIT');
      }
      first = mask & -mask;
      best = 14;
      for (index = 0; index < moveMasks.length; index += 1) {
        if ((moveMasks[index] & first) && (moveMasks[index] & mask) === moveMasks[index]) {
          candidate = 1 + minimumTurns(mask ^ moveMasks[index]);
          if (candidate < best) {
            best = candidate;
          }
        }
      }
      cache[mask] = best;
      return best;
    }

    function maskFor(move) {
      return move.reduce(function (mask, card) { return mask | (1 << ids[card.id]); }, 0);
    }

    return {
      fullMask: fullMask,
      maskFor: maskFor,
      minimumTurnsAfter: function (move) { return minimumTurns(fullMask ^ maskFor(move)); },
      getNodes: function () { return nodes; }
    };
  }

  function scoreNormalMove(move, hand, planner, state, playerId) {
    var remainingCount = hand.length - move.length;
    var turns = planner.minimumTurnsAfter(move);
    var evaluation = BigTwo.Rules.classifyHand(move);
    var score = -turns * 100;
    score -= fragmentationCost(hand, move) * 8;
    score -= controlCost(move, remainingCount) * 3;
    score += move.length * 5;
    score -= strengthOfMove(move) / 10000;
    if (evaluation.type === 'fourOfAKind' || evaluation.type === 'straightFlush') {
      score -= remainingCount ? 35 : 0;
    }
    if (remainingCount === 0) {
      score += 100000;
    }
    if (getThreatLevel(state, playerId) <= 2 && state.lastPlayedCards && state.lastPlayedCards.length) {
      score += strengthOfMove(move) / 250;
    }
    return score;
  }

  function chooseAction(state, playerId, difficulty, rng) {
    var player;
    var table;
    var moves;
    var context;
    var injectedRng = rng || BigTwo.Utils.RNG.create(state && state.rngState || 'ai-default');
    var chooser;
    if (!state || !Array.isArray(state.players) || state.phase !== 'playing') {
      throw new TypeError('AI requires a playing GameState');
    }
    player = getOwnPlayer(state, playerId);
    if (!player || !Array.isArray(player.hand)) {
      throw new RangeError('AI player does not exist');
    }
    if (!state.players[state.currentPlayerIndex] || state.players[state.currentPlayerIndex].id !== playerId) {
      throw new BigTwo.Errors.GameActionError('NOT_CURRENT_PLAYER', 'AI may only act on its turn');
    }
    table = Array.isArray(state.lastPlayedCards) ? state.lastPlayedCards : [];
    context = { openingMoveRequired: state.openingMoveRequired === true };
    moves = BigTwo.Rules.getLegalMoves(player.hand, table, context);
    if (!moves.length) {
      if (!table.length) {
        throw new BigTwo.Errors.GameActionError('NO_LEADING_MOVE', 'The leading AI has no legal move');
      }
      return attachRngState({ type: 'PASS', playerId: playerId }, injectedRng);
    }
    chooser = difficulty === 'easy' ? AI.chooseEasy :
      (difficulty === 'hard' ? AI.chooseHard : AI.chooseNormal);
    if (typeof chooser !== 'function') {
      throw new RangeError('Unsupported or unloaded AI difficulty');
    }
    return attachRngState(
      toAction(playerId, chooser(moves, player.hand, state, playerId, injectedRng)),
      injectedRng
    );
  }

  Common.getOwnPlayer = getOwnPlayer;
  Common.getPublicCardCount = getPublicCardCount;
  Common.getThreatLevel = getThreatLevel;
  Common.toAction = toAction;
  Common.attachRngState = attachRngState;
  Common.randomIndex = randomIndex;
  Common.chooseHighestScored = chooseHighestScored;
  Common.strengthOfMove = strengthOfMove;
  Common.fragmentationCost = fragmentationCost;
  Common.controlCost = controlCost;
  Common.createPlanningContext = planningContext;
  Common.scoreNormalMove = scoreNormalMove;
  AI.chooseAction = chooseAction;
}(window));
