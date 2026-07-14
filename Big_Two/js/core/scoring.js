(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Rules = BigTwo.Rules = BigTwo.Rules || {};

  function getPenalty(cardCount) {
    if (!Number.isInteger(cardCount) || cardCount < 0 || cardCount > 13) {
      throw new RangeError('Remaining card count must be between 0 and 13');
    }
    if (cardCount === 0) { return 0; }
    if (cardCount <= 7) { return cardCount; }
    if (cardCount <= 10) { return cardCount * 2; }
    if (cardCount <= 12) { return cardCount * 3; }
    return 52;
  }

  function scoreRound(players, winnerId) {
    var ids = {};
    var winner;
    var winnerGain = 0;
    var deltas = {};
    var entries;
    var ranked;
    if (!Array.isArray(players) || players.length !== 4) {
      throw new TypeError('Exactly four players are required');
    }
    players.forEach(function (player) {
      if (!player || typeof player.id !== 'string' || ids[player.id] || !Array.isArray(player.hand)) {
        throw new TypeError('Invalid player state');
      }
      ids[player.id] = true;
      if (player.id === winnerId) {
        winner = player;
      }
    });
    if (!winner) {
      throw new RangeError('Winner does not exist');
    }
    players.forEach(function (player) {
      var penalty;
      if (player.id === winnerId) {
        return;
      }
      penalty = getPenalty(player.hand.length);
      deltas[player.id] = -penalty;
      winnerGain += penalty;
    });
    deltas[winnerId] = winnerGain;
    entries = players.map(function (player) {
      var previousScore = typeof player.score === 'number' && isFinite(player.score) ? player.score : 0;
      return {
        playerId: player.id,
        id: player.id,
        remainingCards: player.hand.length,
        delta: deltas[player.id],
        scoreDelta: deltas[player.id],
        previousScore: previousScore,
        totalScore: previousScore + deltas[player.id],
        seat: player.seat
      };
    });
    ranked = entries.slice().sort(function (left, right) {
      if (left.playerId === winnerId) { return -1; }
      if (right.playerId === winnerId) { return 1; }
      if (left.remainingCards !== right.remainingCards) {
        return left.remainingCards - right.remainingCards;
      }
      return (left.seat || 0) - (right.seat || 0);
    });
    ranked.forEach(function (entry, index) { entry.rank = index + 1; });
    return {
      winnerId: winnerId,
      winnerDelta: winnerGain,
      deltas: deltas,
      scoreChanges: BigTwo.Utils.deepClone(deltas),
      entries: entries,
      scores: entries,
      standings: ranked,
      totalDelta: entries.reduce(function (sum, entry) { return sum + entry.delta; }, 0)
    };
  }

  Rules.getPenalty = getPenalty;
  Rules.scoreRound = scoreRound;
}(window));
