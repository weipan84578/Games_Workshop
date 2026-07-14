(function (global) {
  'use strict';

  var BigTwo = global.BigTwo;
  function c(rank, suit) { return BigTwo.Card.create(rank, suit || 'clubs'); }
  function mixed(ranks, representativeSuit) {
    var suits = ['clubs', 'diamonds', 'hearts', 'spades', 'clubs'];
    var representative = (ranks.indexOf('2') !== -1 && (ranks.indexOf('3') !== -1)) ? '2' : ranks[ranks.length - 1];
    return ranks.map(function (rank, index) {
      return c(rank, rank === representative ? representativeSuit : suits[index]);
    });
  }

  describe('Hand comparison', function () {
    it('uses rank then suit for singles and maximum pair suit for pairs', function () {
      assertEqual(BigTwo.Rules.compareHands([c('3', 'diamonds')], [c('3', 'clubs')]), 1);
      assertEqual(BigTwo.Rules.compareHands([c('4', 'clubs')], [c('3', 'spades')]), 1);
      assertEqual(BigTwo.Rules.compareHands([c('9'), c('9', 'spades')], [c('9'), c('9', 'hearts')]), 1);
    });

    it('compares triples and full houses by their triple rank', function () {
      assertTrue(BigTwo.Rules.canBeat([c('8'), c('8', 'diamonds'), c('8', 'spades')], [c('7'), c('7', 'diamonds'), c('7', 'spades')]));
      var high = [c('Q'), c('Q', 'diamonds'), c('Q', 'spades'), c('3'), c('3', 'diamonds')];
      var low = [c('J'), c('J', 'diamonds'), c('J', 'spades'), c('2'), c('2', 'diamonds')];
      assertTrue(BigTwo.Rules.canBeat(high, low));
    });

    it('allows stronger five-card types to beat weaker types in the specified order', function () {
      var straight = mixed(['3', '4', '5', '6', '7'], 'clubs');
      var flush = [c('3', 'diamonds'), c('5', 'diamonds'), c('8', 'diamonds'), c('J', 'diamonds'), c('2', 'diamonds')];
      var fullHouse = [c('3'), c('3', 'diamonds'), c('7'), c('7', 'hearts'), c('7', 'spades')];
      var four = [c('4'), c('4', 'diamonds'), c('4', 'hearts'), c('4', 'spades'), c('3')];
      var straightFlush = ['3', '4', '5', '6', '7'].map(function (rank) { return c(rank, 'spades'); });
      assertTrue(BigTwo.Rules.canBeat(flush, straight));
      assertTrue(BigTwo.Rules.canBeat(fullHouse, flush));
      assertTrue(BigTwo.Rules.canBeat(four, fullHouse));
      assertTrue(BigTwo.Rules.canBeat(straightFlush, four));
    });

    it('orders straights as 23456 above A2345 above TJQKA above 34567', function () {
      var low = mixed(['3', '4', '5', '6', '7'], 'clubs');
      var aceHigh = mixed(['10', 'J', 'Q', 'K', 'A'], 'clubs');
      var aceTwoLow = mixed(['A', '2', '3', '4', '5'], 'clubs');
      var twoHigh = mixed(['2', '3', '4', '5', '6'], 'clubs');
      assertTrue(BigTwo.Rules.canBeat(aceHigh, low));
      assertTrue(BigTwo.Rules.canBeat(aceTwoLow, aceHigh));
      assertTrue(BigTwo.Rules.canBeat(twoHigh, aceTwoLow));
    });

    it('uses representative-card suit for equal straights', function () {
      assertTrue(BigTwo.Rules.canBeat(
        mixed(['A', '2', '3', '4', '5'], 'spades'),
        mixed(['A', '2', '3', '4', '5'], 'hearts')
      ));
    });

    it('compares flush suit before descending rank sequence', function () {
      var lowSpades = ['3', '4', '6', '8', '10'].map(function (rank) { return c(rank, 'spades'); });
      var highHearts = ['8', '9', 'J', 'K', '2'].map(function (rank) { return c(rank, 'hearts'); });
      var heartsA = ['3', '5', '7', '9', 'A'].map(function (rank) { return c(rank, 'hearts'); });
      var heartsK = ['4', '6', '8', '10', 'K'].map(function (rank) { return c(rank, 'hearts'); });
      assertTrue(BigTwo.Rules.canBeat(lowSpades, highHearts));
      assertTrue(BigTwo.Rules.canBeat(heartsA, heartsK));
    });

    it('does not allow different card counts to beat one another', function () {
      assertTrue(!BigTwo.Rules.canBeat([c('2', 'spades')], [c('3'), c('3', 'diamonds')]));
    });
  });
}(window));
