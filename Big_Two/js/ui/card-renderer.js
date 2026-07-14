(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};
  var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  var ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
  var symbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };

  function rankIndex(card) {
    if (typeof card.rank === 'number') { return card.rank; }
    return ranks.indexOf(String(card.rank));
  }

  function suitIndex(card) {
    if (typeof card.suit === 'number') { return card.suit; }
    return suits.indexOf(card.suit);
  }

  function displayRank(card) {
    return typeof card.rank === 'number' ? (ranks[card.rank] || String(card.rank)) : String(card.rank);
  }

  function displaySuit(card) {
    var suit = typeof card.suit === 'number' ? suits[card.suit] : card.suit;
    return symbols[suit] || '';
  }

  function cardName(card) {
    var I18n = BigTwo.I18n;
    var suit = typeof card.suit === 'number' ? suits[card.suit] : card.suit;
    return (I18n ? I18n.t('suit.' + suit) : suit) + ' ' + displayRank(card);
  }

  function render(card, options) {
    var opts = options || {};
    var button = global.document.createElement('button');
    var corner = global.document.createElement('span');
    var rank = global.document.createElement('span');
    var suit = global.document.createElement('span');
    var center = global.document.createElement('span');
    var suitName = typeof card.suit === 'number' ? suits[card.suit] : card.suit;
    var selected = Boolean(opts.selected);
    button.type = 'button';
    button.className = 'card playing-card card--' + suitName + ((suitName === 'diamonds' || suitName === 'hearts') ? ' is-red' : ' is-black');
    if (selected) { button.classList.add('is-selected'); }
    button.dataset.cardId = card.id;
    button.dataset.rank = displayRank(card);
    button.dataset.suit = suitName;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', BigTwo.I18n ? BigTwo.I18n.t('aria.card', {
      suit: BigTwo.I18n.t('suit.' + suitName),
      rank: displayRank(card),
      state: BigTwo.I18n.t(selected ? 'aria.selected' : 'aria.notSelected')
    }) : cardName(card));
    if (opts.disabled) { button.disabled = true; }
    if (opts.tabIndex != null) { button.tabIndex = opts.tabIndex; }
    corner.className = 'card__corner';
    rank.className = 'card__rank';
    rank.textContent = displayRank(card);
    suit.className = 'card__suit';
    suit.textContent = displaySuit(card);
    center.className = 'card__center-suit';
    center.setAttribute('aria-hidden', 'true');
    center.textContent = displaySuit(card);
    corner.appendChild(rank);
    corner.appendChild(suit);
    button.appendChild(corner);
    button.appendChild(center);
    return button;
  }

  function sortCards(cards, mode) {
    return (cards || []).slice().sort(function (a, b) {
      var rankDiff = rankIndex(a) - rankIndex(b);
      var suitDiff = suitIndex(a) - suitIndex(b);
      return mode === 'suit' ? (suitDiff || rankDiff) : (rankDiff || suitDiff);
    });
  }

  BigTwo.UI.CardRenderer = {
    render: render,
    sortCards: sortCards,
    cardName: cardName,
    rankIndex: rankIndex,
    suitIndex: suitIndex,
    suitSymbol: displaySuit
  };
}(window));
