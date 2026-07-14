(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;
  function playersWithCounts(counts) {
    var deck = BigTwo.Deck.createDeck();
    var cursor = 0;
    return counts.map(function (count, index) {
      var hand = deck.slice(cursor, cursor + count);
      cursor += count;
      return { id: BigTwo.Config.PLAYER_IDS[index], seat: index, hand: hand, score: index * 10 };
    });
  }

  describe('Round scoring', function () {
    it('uses every multiplier boundary exactly', function () {
      assertEqual(BigTwo.Rules.getPenalty(1), 1);
      assertEqual(BigTwo.Rules.getPenalty(7), 7);
      assertEqual(BigTwo.Rules.getPenalty(8), 16);
      assertEqual(BigTwo.Rules.getPenalty(10), 20);
      assertEqual(BigTwo.Rules.getPenalty(11), 33);
      assertEqual(BigTwo.Rules.getPenalty(12), 36);
      assertEqual(BigTwo.Rules.getPenalty(13), 52);
    });

    it('awards the winner all loser penalties and keeps the round sum at zero', function () {
      var players = playersWithCounts([0, 7, 10, 13]);
      var original = BigTwo.Utils.deepClone(players);
      var result = BigTwo.Rules.scoreRound(players, 'human');
      assertEqual(result.deltas.human, 79);
      assertEqual(result.deltas.ai1, -7);
      assertEqual(result.deltas.ai2, -20);
      assertEqual(result.deltas.ai3, -52);
      assertEqual(result.totalDelta, 0);
      assertDeepEqual(players, original);
    });

    it('finishes immediately and updates cumulative scores when a player empties their hand', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'finish-now' });
      var current = state.players[state.currentPlayerIndex];
      var winningCard = current.hand.filter(function (card) { return card.id === '3-clubs'; })[0];
      current.hand = [winningCard];
      current.cardCount = 1;
      state = BigTwo.Game.applyAction(state, {
        type: 'PLAY_CARDS', playerId: current.id, cardIds: [winningCard.id]
      });
      assertEqual(state.phase, 'finished');
      assertEqual(state.players.filter(function (player) { return player.id === current.id; })[0].hand.length, 0);
      assertEqual(state.roundResult.winnerId, current.id);
      assertEqual(state.roundResult.totalDelta, 0);
    });
  });
}(window));
