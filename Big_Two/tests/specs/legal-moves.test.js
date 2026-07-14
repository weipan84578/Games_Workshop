(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;
  function c(rank, suit) { return BigTwo.Card.create(rank, suit || 'clubs'); }

  describe('Legal moves and game transitions', function () {
    it('returns every known legal combination once and no illegal combination', function () {
      var hand = [c('3'), c('3', 'diamonds'), c('4'), c('4', 'diamonds'), c('5'), c('6', 'diamonds'), c('7', 'hearts')];
      var moves = BigTwo.Rules.getLegalMoves(hand, [], {});
      var signatures = moves.map(BigTwo.Utils.makeCardSignature);
      assertEqual(signatures.length, BigTwo.Utils.unique(signatures).length);
      assertTrue(signatures.indexOf(BigTwo.Utils.makeCardSignature([hand[0], hand[1]])) !== -1);
      assertTrue(signatures.indexOf(BigTwo.Utils.makeCardSignature([hand[0], hand[2], hand[4], hand[5], hand[6]])) !== -1);
      assertTrue(moves.every(function (move) { return BigTwo.Rules.classifyHand(move).valid; }));
    });

    it('requires the three of clubs on the opening move', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'opening-legal' });
      var moves = BigTwo.Game.getLegalMovesForCurrentPlayer(state);
      assertTrue(moves.length > 0);
      assertTrue(moves.every(function (move) {
        return move.some(function (card) { return card.id === '3-clubs'; });
      }));
      assertTrue(!BigTwo.Game.canPass(state));
    });

    it('filters table responses by card count and comparison result', function () {
      var hand = [c('3'), c('4'), c('5'), c('5', 'diamonds'), c('6'), c('2', 'spades')];
      var table = [c('4', 'spades')];
      var moves = BigTwo.Rules.getLegalMoves(hand, table, {});
      assertTrue(moves.every(function (move) {
        return move.length === 1 && BigTwo.Rules.canBeat(move, table);
      }));
      assertEqual(moves.length, 4);
    });

    it('keeps the original state and history unchanged after an illegal action', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'immutable-illegal' });
      var original = BigTwo.Utils.deepClone(state);
      var current = state.players[state.currentPlayerIndex];
      assertThrows(function () {
        BigTwo.Game.applyAction(state, { type: 'PLAY_CARDS', playerId: current.id, cardIds: [] });
      });
      assertDeepEqual(state, original);
      assertEqual(state.actionHistory.length, 0);
    });

    it('advances turns and gives the lead back after three consecutive passes', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'three-passes' });
      var leaderIndex = state.currentPlayerIndex;
      var leader = state.players[leaderIndex];
      var opening = BigTwo.Game.getLegalMovesForCurrentPlayer(state)[0];
      state = BigTwo.Game.applyAction(state, {
        type: 'PLAY_CARDS', playerId: leader.id,
        cardIds: opening.map(function (card) { return card.id; })
      });
      assertEqual(state.currentPlayerIndex, (leaderIndex + 1) % 4);
      [0, 1, 2].forEach(function () {
        state = BigTwo.Game.applyAction(state, {
          type: 'PASS', playerId: state.players[state.currentPlayerIndex].id
        });
      });
      assertEqual(state.currentPlayerIndex, leaderIndex);
      assertEqual(state.lastPlayedCards.length, 0);
      assertEqual(state.consecutivePasses, 0);
      assertTrue(!BigTwo.Game.canPass(state));
    });

    it('resets consecutive passes when another player successfully plays', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'pass-reset' });
      var opening = BigTwo.Game.getLegalMovesForCurrentPlayer(state)[0];
      state = BigTwo.Game.applyAction(state, {
        type: 'PLAY_CARDS', playerId: state.players[state.currentPlayerIndex].id,
        cardIds: opening.map(function (card) { return card.id; })
      });
      state = BigTwo.Game.applyAction(state, { type: 'PASS', playerId: state.players[state.currentPlayerIndex].id });
      var moves = BigTwo.Game.getLegalMovesForCurrentPlayer(state);
      if (moves.length) {
        state = BigTwo.Game.applyAction(state, {
          type: 'PLAY_CARDS', playerId: state.players[state.currentPlayerIndex].id,
          cardIds: moves[0].map(function (card) { return card.id; })
        });
        assertEqual(state.consecutivePasses, 0);
      } else {
        assertTrue(true);
      }
    });
  });
}(window));
