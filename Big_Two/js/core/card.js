(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;

  function createCard(rank, suit) {
    if (Config.RANKS.indexOf(rank) === -1 || Config.SUITS.indexOf(suit) === -1) {
      throw new TypeError('Invalid card rank or suit');
    }
    return { id: rank + '-' + suit, rank: rank, suit: suit };
  }

  function parseCard(id) {
    var separator;
    if (typeof id !== 'string') {
      return null;
    }
    separator = id.lastIndexOf('-');
    if (separator < 1) {
      return null;
    }
    try {
      return createCard(id.slice(0, separator), id.slice(separator + 1));
    } catch (error) {
      return null;
    }
  }

  function getCardKey(card) {
    if (!BigTwo.Utils.Validation.isCard(card)) {
      throw new TypeError('Invalid card');
    }
    return Config.RANK_VALUES[card.rank] * 4 + Config.SUIT_VALUES[card.suit];
  }

  function compareCards(left, right) {
    var difference = getCardKey(left) - getCardKey(right);
    return difference === 0 ? 0 : (difference > 0 ? 1 : -1);
  }

  function sortCards(cards) {
    return cards.slice().sort(compareCards);
  }

  BigTwo.Card = {
    create: createCard,
    parse: parseCard,
    getKey: getCardKey,
    compare: compareCards,
    sort: sortCards
  };
}(window));
