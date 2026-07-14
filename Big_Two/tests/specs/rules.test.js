(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;
  function c(rank, suit) { return BigTwo.Card.create(rank, suit || 'clubs'); }
  function cards(ranks, suits) {
    var available = suits || ['clubs', 'diamonds', 'hearts', 'spades', 'clubs'];
    return ranks.map(function (rank, index) { return c(rank, available[index]); });
  }

  describe('Hand classification', function () {
    it('classifies singles, pairs and triples at their low and high boundaries', function () {
      assertEqual(BigTwo.Rules.classifyHand([c('3')]).type, 'single');
      assertEqual(BigTwo.Rules.classifyHand([c('2', 'spades')]).type, 'single');
      assertEqual(BigTwo.Rules.classifyHand([c('3'), c('3', 'spades')]).type, 'pair');
      assertEqual(BigTwo.Rules.classifyHand([c('2'), c('2', 'spades')]).type, 'pair');
      assertEqual(BigTwo.Rules.classifyHand([c('3'), c('3', 'diamonds'), c('3', 'hearts')]).type, 'triple');
      assertEqual(BigTwo.Rules.classifyHand([c('2'), c('2', 'diamonds'), c('2', 'spades')]).type, 'triple');
    });

    it('classifies all five-card types and gives straight flush precedence', function () {
      assertEqual(BigTwo.Rules.classifyHand(cards(['3', '4', '5', '6', '7'])).type, 'straight');
      assertEqual(BigTwo.Rules.classifyHand(cards(['3', '5', '8', 'J', '2'], ['hearts', 'hearts', 'hearts', 'hearts', 'hearts'])).type, 'flush');
      assertEqual(BigTwo.Rules.classifyHand([c('6'), c('6', 'diamonds'), c('6', 'hearts'), c('9'), c('9', 'spades')]).type, 'fullHouse');
      assertEqual(BigTwo.Rules.classifyHand([c('A'), c('A', 'diamonds'), c('A', 'hearts'), c('A', 'spades'), c('3')]).type, 'fourOfAKind');
      assertEqual(BigTwo.Rules.classifyHand(cards(['10', 'J', 'Q', 'K', 'A'], ['spades', 'spades', 'spades', 'spades', 'spades'])).type, 'straightFlush');
    });

    it('accepts exactly the ten specified straight rank sets', function () {
      var patterns = [
        ['3', '4', '5', '6', '7'], ['4', '5', '6', '7', '8'], ['5', '6', '7', '8', '9'],
        ['6', '7', '8', '9', '10'], ['7', '8', '9', '10', 'J'], ['8', '9', '10', 'J', 'Q'],
        ['9', '10', 'J', 'Q', 'K'], ['10', 'J', 'Q', 'K', 'A'], ['A', '2', '3', '4', '5'], ['2', '3', '4', '5', '6']
      ];
      patterns.forEach(function (ranks) {
        assertEqual(BigTwo.Rules.classifyHand(cards(ranks)).type, 'straight');
      });
    });

    it('rejects unsupported counts, malformed groups and unlisted wraparound straights', function () {
      assertTrue(!BigTwo.Rules.classifyHand([]).valid);
      assertTrue(!BigTwo.Rules.classifyHand(cards(['3', '4', '5', '6'])).valid);
      assertTrue(!BigTwo.Rules.classifyHand(cards(['3', '4', '5', '6', '7', '8'])).valid);
      assertTrue(!BigTwo.Rules.classifyHand([c('3'), c('4')]).valid);
      assertTrue(!BigTwo.Rules.classifyHand([c('3'), c('3', 'diamonds'), c('4', 'hearts')]).valid);
      [['J', 'Q', 'K', 'A', '2'], ['Q', 'K', 'A', '2', '3'], ['K', 'A', '2', '3', '4']].forEach(function (ranks) {
        assertTrue(!BigTwo.Rules.classifyHand(cards(ranks)).valid);
      });
    });

    it('is independent of input order and never mutates its input', function () {
      var hand = [c('8'), c('8', 'diamonds'), c('K'), c('K', 'hearts'), c('K', 'spades')];
      var original = BigTwo.Utils.deepClone(hand);
      var reversed = hand.slice().reverse();
      assertDeepEqual(BigTwo.Rules.classifyHand(hand), BigTwo.Rules.classifyHand(reversed));
      assertDeepEqual(hand, original);
    });
  });
}(window));
