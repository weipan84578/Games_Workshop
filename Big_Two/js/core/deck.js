(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;

  function createDeck() {
    var cards = [];
    Config.RANKS.forEach(function (rank) {
      Config.SUITS.forEach(function (suit) {
        cards.push(BigTwo.Card.create(rank, suit));
      });
    });
    return cards;
  }

  function shuffleDeck(deck, rng) {
    return BigTwo.Utils.RNG.shuffle(deck, rng);
  }

  function deal(deck, playerCount, cardsPerPlayer) {
    var count = playerCount == null ? 4 : playerCount;
    var perPlayer = cardsPerPlayer == null ? 13 : cardsPerPlayer;
    var hands;
    var index;
    if (!Array.isArray(deck) || deck.length !== count * perPlayer) {
      throw new RangeError('Deck size does not match the requested deal');
    }
    hands = Array.from({ length: count }, function () { return []; });
    for (index = 0; index < deck.length; index += 1) {
      hands[index % count].push(deck[index]);
    }
    return hands.map(BigTwo.Card.sort);
  }

  function findOpeningPlayer(hands) {
    var index;
    for (index = 0; index < hands.length; index += 1) {
      if (hands[index].some(function (card) { return card.id === Config.OPENING_CARD_ID; })) {
        return index;
      }
    }
    return -1;
  }

  function createDeal(seedOrRng) {
    var rng = seedOrRng && typeof seedOrRng.next === 'function' ?
      seedOrRng : BigTwo.Utils.RNG.create(seedOrRng);
    var deck = shuffleDeck(createDeck(), rng);
    var hands = deal(deck, 4, 13);
    return {
      deck: deck,
      hands: hands,
      openingPlayerIndex: findOpeningPlayer(hands),
      rngState: typeof rng.getState === 'function' ? rng.getState() : ''
    };
  }

  BigTwo.Deck = {
    create: createDeck,
    createDeck: createDeck,
    shuffle: shuffleDeck,
    shuffleDeck: shuffleDeck,
    deal: deal,
    dealDeck: deal,
    findOpeningPlayer: findOpeningPlayer,
    createDeal: createDeal
  };
}(window));
