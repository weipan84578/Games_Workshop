(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;
  function c(rank, suit) { return BigTwo.Card.create(rank, suit || 'clubs'); }
  function actionCards(state, action) {
    var player = state.players.filter(function (item) { return item.id === action.playerId; })[0];
    return action.cardIds.map(function (id) {
      return player.hand.filter(function (card) { return card.id === id; })[0];
    });
  }

  describe('AI decisions', function () {
    ['easy', 'normal', 'hard'].forEach(function (difficulty) {
      it(difficulty + ' returns only a legal opening action', function () {
        var state = BigTwo.Game.createNewGame({ seed: 'ai-' + difficulty });
        var player = state.players[state.currentPlayerIndex];
        var original = BigTwo.Utils.deepClone(state);
        var action = BigTwo.AI.chooseAction(state, player.id, difficulty, BigTwo.Utils.RNG.create('choice'));
        var cards = actionCards(state, action);
        assertEqual(action.type, 'PLAY_CARDS');
        assertTrue(BigTwo.Rules.classifyHand(cards).valid);
        assertTrue(cards.some(function (card) { return card.id === '3-clubs'; }));
        assertDeepEqual(state, original);
      });
    });

    it('passes when no legal response exists and never passes while leading', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'ai-pass' });
      var player = state.players[state.currentPlayerIndex];
      player.hand = [c('3'), c('4', 'diamonds')];
      player.cardCount = 2;
      state.openingMoveRequired = false;
      state.lastPlayedCards = [c('2', 'spades')];
      state.lastHand = BigTwo.Rules.classifyHand(state.lastPlayedCards);
      state.lastPlayedBy = state.players[(state.currentPlayerIndex + 3) % 4].id;
      assertEqual(BigTwo.AI.chooseAction(state, player.id, 'normal', BigTwo.Utils.RNG.create('pass')).type, 'PASS');
      state.lastPlayedCards = [];
      state.lastHand = null;
      state.lastPlayedBy = null;
      assertEqual(BigTwo.AI.chooseAction(state, player.id, 'normal', BigTwo.Utils.RNG.create('lead')).type, 'PLAY_CARDS');
    });

    it('is reproducible for the same state, difficulty and seed', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'repro-state' });
      var player = state.players[state.currentPlayerIndex];
      var first = BigTwo.AI.chooseAction(state, player.id, 'easy', BigTwo.Utils.RNG.create('repro-choice'));
      var second = BigTwo.AI.chooseAction(state, player.id, 'easy', BigTwo.Utils.RNG.create('repro-choice'));
      assertDeepEqual(first, second);
    });

    it('does not access opponents hidden hands', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'hidden-hands' });
      var playerId = state.players[state.currentPlayerIndex].id;
      state.players = state.players.map(function (player) {
        if (player.id === playerId) { return player; }
        return new Proxy(player, {
          get: function (target, property) {
            if (property === 'hand') { throw new Error('opponent hand was accessed'); }
            return target[property];
          }
        });
      });
      var action = BigTwo.AI.chooseAction(state, playerId, 'hard', BigTwo.Utils.RNG.create('proxy'));
      assertEqual(action.type, 'PLAY_CARDS');
    });

    it('normal AI preserves a pair when a standalone response is available', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'normal-preserve' });
      var player = state.players[state.currentPlayerIndex];
      player.hand = [c('5'), c('5', 'diamonds'), c('6')];
      player.cardCount = 3;
      state.openingMoveRequired = false;
      state.lastPlayedCards = [c('4', 'spades')];
      state.lastHand = BigTwo.Rules.classifyHand(state.lastPlayedCards);
      state.lastPlayedBy = state.players[(state.currentPlayerIndex + 3) % 4].id;
      var action = BigTwo.AI.chooseAction(state, player.id, 'normal', BigTwo.Utils.RNG.create('preserve'));
      assertDeepEqual(action.cardIds, ['6-clubs']);
    });

    it('hard AI spends a control card to block an opponent with one card', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'hard-block' });
      var player = state.players[state.currentPlayerIndex];
      player.hand = [c('4', 'diamonds'), c('5', 'diamonds'), c('2', 'spades')];
      player.cardCount = 3;
      state.players.forEach(function (item) { if (item.id !== player.id) { item.cardCount = 1; } });
      state.openingMoveRequired = false;
      state.lastPlayedCards = [c('3')];
      state.lastHand = BigTwo.Rules.classifyHand(state.lastPlayedCards);
      state.lastPlayedBy = state.players[(state.currentPlayerIndex + 3) % 4].id;
      var action = BigTwo.AI.chooseAction(state, player.id, 'hard', BigTwo.Utils.RNG.create('block'));
      assertDeepEqual(action.cardIds, ['2-spades']);
    });

    it('falls back safely when the hard-search clock expires', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'hard-timeout' });
      var player = state.players[state.currentPlayerIndex];
      var seeded = BigTwo.Utils.RNG.create('timeout-choice');
      var tick = 0;
      var rng = {
        next: function () { return seeded.next(); },
        now: function () { tick += 10; return tick; },
        timeLimitMs: 1,
        nodeLimit: 2
      };
      var action = BigTwo.AI.chooseAction(state, player.id, 'hard', rng);
      assertEqual(action.type, 'PLAY_CARDS');
      assertTrue(BigTwo.Rules.classifyHand(actionCards(state, action)).valid);
    });
  });
}(window));
