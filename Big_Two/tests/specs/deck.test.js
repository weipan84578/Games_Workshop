(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;

  describe('Deck and dealing', function () {
    it('creates exactly 52 unique cards with thirteen ranks and four suits', function () {
      var deck = BigTwo.Deck.createDeck();
      var ids = deck.map(function (card) { return card.id; });
      assertEqual(deck.length, 52);
      assertEqual(BigTwo.Utils.unique(ids).length, 52);
      BigTwo.Config.RANKS.forEach(function (rank) {
        assertEqual(deck.filter(function (card) { return card.rank === rank; }).length, 4);
      });
      BigTwo.Config.SUITS.forEach(function (suit) {
        assertEqual(deck.filter(function (card) { return card.suit === suit; }).length, 13);
      });
    });

    it('shuffles reproducibly from an injected seed without mutating the deck', function () {
      var deck = BigTwo.Deck.createDeck();
      var original = BigTwo.Utils.deepClone(deck);
      var first = BigTwo.Deck.shuffle(deck, BigTwo.Utils.RNG.create('same-seed'));
      var second = BigTwo.Deck.shuffle(deck, BigTwo.Utils.RNG.create('same-seed'));
      var different = BigTwo.Deck.shuffle(deck, BigTwo.Utils.RNG.create('different-seed'));
      assertDeepEqual(first, second);
      assertTrue(!BigTwo.Utils.deepEqual(first, different));
      assertDeepEqual(deck, original);
    });

    it('deals thirteen cards to four players with no omissions', function () {
      var shuffled = BigTwo.Deck.shuffle(BigTwo.Deck.createDeck(), BigTwo.Utils.RNG.create('deal'));
      var hands = BigTwo.Deck.deal(shuffled);
      var ids = [];
      assertDeepEqual(hands.map(function (hand) { return hand.length; }), [13, 13, 13, 13]);
      hands.forEach(function (hand) {
        ids = ids.concat(hand.map(function (card) { return card.id; }));
      });
      assertEqual(BigTwo.Utils.unique(ids).length, 52);
    });

    it('makes the holder of the three of clubs the opening player', function () {
      var state = BigTwo.Game.createNewGame({ seed: 'opening-player' });
      var holder = state.players.filter(function (player) {
        return player.hand.some(function (card) { return card.id === '3-clubs'; });
      })[0];
      assertEqual(state.players[state.currentPlayerIndex].id, holder.id);
      assertTrue(state.openingMoveRequired);
    });
  });
}(window));
