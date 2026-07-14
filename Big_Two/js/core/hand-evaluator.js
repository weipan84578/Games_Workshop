(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Rules = BigTwo.Rules = BigTwo.Rules || {};

  var STRAIGHTS = [
    { ranks: [0, 1, 2, 3, 4], representativeRank: 4 },
    { ranks: [1, 2, 3, 4, 5], representativeRank: 5 },
    { ranks: [2, 3, 4, 5, 6], representativeRank: 6 },
    { ranks: [3, 4, 5, 6, 7], representativeRank: 7 },
    { ranks: [4, 5, 6, 7, 8], representativeRank: 8 },
    { ranks: [5, 6, 7, 8, 9], representativeRank: 9 },
    { ranks: [6, 7, 8, 9, 10], representativeRank: 10 },
    { ranks: [7, 8, 9, 10, 11], representativeRank: 11 },
    { ranks: [0, 1, 2, 11, 12], representativeRank: 12 },
    { ranks: [0, 1, 2, 3, 12], representativeRank: 12 }
  ];

  function invalid(cardCount, reason) {
    return { valid: false, type: null, cardCount: cardCount, tieBreakers: [], reason: reason };
  }

  function valid(type, cardCount, tieBreakers) {
    return { valid: true, type: type, cardCount: cardCount, tieBreakers: tieBreakers, reason: null };
  }

  function groupByRank(cards) {
    var groups = {};
    cards.forEach(function (card) {
      var value = Config.RANK_VALUES[card.rank];
      groups[value] = groups[value] || [];
      groups[value].push(card);
    });
    return groups;
  }

  function getStraightInfo(cards) {
    var rankValues = cards.map(function (card) {
      return Config.RANK_VALUES[card.rank];
    }).sort(function (left, right) { return left - right; });
    var uniqueRanks = rankValues.filter(function (rank, index) {
      return index === 0 || rank !== rankValues[index - 1];
    });
    var index;
    var representative;
    if (uniqueRanks.length !== 5) {
      return null;
    }
    for (index = 0; index < STRAIGHTS.length; index += 1) {
      if (uniqueRanks.every(function (rank, rankIndex) {
        return rank === STRAIGHTS[index].ranks[rankIndex];
      })) {
        representative = cards.filter(function (card) {
          return Config.RANK_VALUES[card.rank] === STRAIGHTS[index].representativeRank;
        })[0];
        return {
          order: index,
          representativeRank: STRAIGHTS[index].representativeRank,
          representativeSuit: Config.SUIT_VALUES[representative.suit]
        };
      }
    }
    return null;
  }

  function classifyHand(cards) {
    var count = Array.isArray(cards) ? cards.length : 0;
    var seen = {};
    var groups;
    var rankKeys;
    var counts;
    var straight;
    var isFlush;
    var flushRanks;
    var mainRank;
    var maxSuit;

    if (!Array.isArray(cards)) {
      return invalid(0, 'cardsNotArray');
    }
    if ([1, 2, 3, 5].indexOf(count) === -1) {
      return invalid(count, 'unsupportedCardCount');
    }
    if (!cards.every(function (card) { return BigTwo.Utils.Validation.isCard(card); })) {
      return invalid(count, 'invalidCard');
    }
    if (cards.some(function (card) {
      if (seen[card.id]) {
        return true;
      }
      seen[card.id] = true;
      return false;
    })) {
      return invalid(count, 'duplicateCard');
    }

    groups = groupByRank(cards);
    rankKeys = Object.keys(groups).map(Number).sort(function (left, right) { return left - right; });
    counts = rankKeys.map(function (rank) { return groups[rank].length; }).sort(function (left, right) {
      return right - left;
    });

    if (count === 1) {
      return valid('single', count, [BigTwo.Card.getKey(cards[0])]);
    }
    if (count === 2) {
      if (rankKeys.length !== 1) {
        return invalid(count, 'notPair');
      }
      maxSuit = Math.max.apply(null, cards.map(function (card) { return Config.SUIT_VALUES[card.suit]; }));
      return valid('pair', count, [rankKeys[0], maxSuit]);
    }
    if (count === 3) {
      if (rankKeys.length !== 1) {
        return invalid(count, 'notTriple');
      }
      return valid('triple', count, [rankKeys[0]]);
    }

    straight = getStraightInfo(cards);
    isFlush = cards.every(function (card) { return card.suit === cards[0].suit; });
    if (straight && isFlush) {
      return valid('straightFlush', count, [straight.order, Config.SUIT_VALUES[cards[0].suit]]);
    }
    if (counts[0] === 4) {
      mainRank = rankKeys.filter(function (rank) { return groups[rank].length === 4; })[0];
      return valid('fourOfAKind', count, [mainRank]);
    }
    if (counts[0] === 3 && counts[1] === 2) {
      mainRank = rankKeys.filter(function (rank) { return groups[rank].length === 3; })[0];
      return valid('fullHouse', count, [mainRank]);
    }
    if (isFlush) {
      flushRanks = cards.map(function (card) { return Config.RANK_VALUES[card.rank]; })
        .sort(function (left, right) { return right - left; });
      return valid('flush', count, [Config.SUIT_VALUES[cards[0].suit]].concat(flushRanks));
    }
    if (straight) {
      return valid('straight', count, [straight.order, straight.representativeSuit]);
    }
    return invalid(count, 'invalidFiveCardHand');
  }

  Rules.classifyHand = classifyHand;
  Rules.getStraightInfo = getStraightInfo;
  Rules.STRAIGHT_PATTERNS = STRAIGHTS.map(function (entry) {
    return { ranks: entry.ranks.slice(), representativeRank: entry.representativeRank };
  });
}(window));
