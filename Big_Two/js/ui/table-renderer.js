(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function text(key, values) {
    return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key;
  }

  function playerName(player) {
    var id = player && player.id;
    return text('player.' + (id || 'human'));
  }

  function cardCount(player) {
    if (!player) { return 0; }
    if (typeof player.cardCount === 'number') { return player.cardCount; }
    return Array.isArray(player.hand) ? player.hand.length : 0;
  }

  function currentPlayer(state) {
    return state && Array.isArray(state.players) ? state.players[state.currentPlayerIndex] : null;
  }

  function createAvatar(playerId, className) {
    var avatar = global.document.createElement('span');
    var svg = global.document.createElementNS(SVG_NS, 'svg');
    var face = global.document.createElementNS(SVG_NS, 'circle');
    var features = global.document.createElementNS(SVG_NS, 'path');
    var ears = global.document.createElementNS(SVG_NS, 'path');
    avatar.className = className || ('avatar avatar--' + playerId);
    avatar.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    face.setAttribute('cx', '24');
    face.setAttribute('cy', '25');
    face.setAttribute('r', '14');
    face.setAttribute('fill', 'rgba(255,255,255,.82)');
    face.setAttribute('stroke', 'currentColor');
    face.setAttribute('stroke-width', '2');
    if (playerId === 'ai1') {
      ears.setAttribute('d', 'M13 16 10 6l11 7M35 16 38 6l-11 7');
      features.setAttribute('d', 'M18 24h1m10 0h1m-9 6c2 2 4 2 6 0m-3-4v3');
    } else if (playerId === 'ai2') {
      ears.setAttribute('d', 'M17 14c-4-9-1-13 2-10 2 2 2 8 2 11M31 14c4-9 1-13-2-10-2 2-2 8-2 11');
      features.setAttribute('d', 'M18 24h1m10 0h1m-8 6c1.5 1 2.5 1 4 0m-2-4v3');
    } else if (playerId === 'ai3') {
      ears.setAttribute('d', 'M11 19c-5-6 4-12 8-6M37 19c5-6-4-12-8-6');
      features.setAttribute('d', 'M17 24h2m10 0h2M20 30c3 2 5 2 8 0');
    } else {
      ears.setAttribute('d', 'M15 13c3-5 15-5 18 0');
      features.setAttribute('d', 'M18 24h2m8 0h2m-10 6c3 3 5 3 8 0');
    }
    [ears, features].forEach(function (path) {
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', path === ears ? '3' : '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
    });
    svg.appendChild(ears);
    svg.appendChild(face);
    svg.appendChild(features);
    avatar.appendChild(svg);
    return avatar;
  }

  function findPlayer(state, id, seat) {
    var players = state && state.players || [];
    var found = players.find(function (player) { return player.id === id; });
    if (!found && seat != null) {
      found = players.find(function (player) { return player.seat === seat; });
    }
    return found;
  }

  function seat(state, player, placement) {
    var article = global.document.createElement('article');
    var avatar = createAvatar(player ? player.id : placement,
      'player-seat__avatar avatar avatar--' + (player ? player.id : placement));
    var details = global.document.createElement('div');
    var name = global.document.createElement('h2');
    var count = global.document.createElement('p');
    var isCurrent = currentPlayer(state) === player;
    article.className = 'player-seat player-seat--' + placement + (isCurrent ? ' is-current' : '');
    article.dataset.seat = placement;
    if (isCurrent) { article.setAttribute('aria-current', 'true'); }
    article.setAttribute('aria-label', text(player && player.kind === 'human' ? 'aria.humanHand' : 'aria.aiHand', {
      name: playerName(player), count: cardCount(player)
    }));
    details.className = 'player-seat__details';
    name.className = 'player-seat__name';
    name.textContent = playerName(player);
    count.className = 'player-seat__count';
    count.textContent = text('game.cardsRemaining', { count: cardCount(player) });
    details.appendChild(name);
    details.appendChild(count);
    article.appendChild(avatar);
    article.appendChild(details);
    if (state && state.actionHistory && state.actionHistory.length) {
      var lastAction = state.actionHistory[state.actionHistory.length - 1];
      if (lastAction.type === 'PASS' && player && lastAction.playerId === player.id) {
        var pass = global.document.createElement('span');
        pass.className = 'pass-feedback';
        pass.textContent = text('game.pass');
        pass.setAttribute('role', 'status');
        article.appendChild(pass);
      }
    }
    return article;
  }

  function tableCenter(state) {
    var center = global.document.createElement('section');
    var label = global.document.createElement('p');
    var cards = global.document.createElement('div');
    var lastPlayer = state && findPlayer(state, state.lastPlayedBy);
    var lastCards = state && state.lastPlayedCards || [];
    var handType = state && state.lastHand && state.lastHand.type;
    center.className = 'table-center';
    center.setAttribute('aria-label', text('aria.tableCards'));
    label.className = 'table-center__status';
    if (lastCards.length) {
      label.textContent = text('game.lastPlay', {
        name: playerName(lastPlayer),
        hand: text('hand.' + (handType || 'invalid'))
      });
    } else if (state && state.openingMoveRequired) {
      label.textContent = text('game.opening');
    } else {
      label.textContent = text('game.leading');
    }
    cards.className = 'table-cards';
    lastCards.forEach(function (card) {
      var node = BigTwo.UI.CardRenderer.render(card, { disabled: true, tabIndex: -1 });
      node.removeAttribute('aria-pressed');
      cards.appendChild(node);
    });
    if (!lastCards.length) {
      var empty = global.document.createElement('p');
      empty.className = 'table-cards__empty';
      empty.textContent = text('game.emptyTable');
      cards.appendChild(empty);
    }
    center.appendChild(label);
    center.appendChild(cards);
    return center;
  }

  function renderTable(container, state) {
    var table = global.document.createElement('div');
    table.className = 'game-table';
    table.appendChild(seat(state, findPlayer(state, 'ai1', 1), 'left'));
    table.appendChild(seat(state, findPlayer(state, 'ai2', 2), 'top'));
    table.appendChild(seat(state, findPlayer(state, 'ai3', 3), 'right'));
    table.appendChild(tableCenter(state));
    table.appendChild(seat(state, findPlayer(state, 'human', 0), 'human'));
    container.appendChild(table);
    return table;
  }

  function renderHand(container, cards, options) {
    var opts = options || {};
    var selected = opts.selected || [];
    var sorted = BigTwo.UI.CardRenderer.sortCards(cards, opts.sortMode);
    var hand = global.document.createElement('div');
    hand.className = 'human-hand playing-cards';
    hand.setAttribute('role', 'group');
    hand.setAttribute('aria-label', text('aria.humanHand'));
    sorted.forEach(function (card, index) {
      var node = BigTwo.UI.CardRenderer.render(card, {
        selected: selected.indexOf(card.id) >= 0,
        disabled: Boolean(opts.disabled),
        tabIndex: index === (opts.focusIndex || 0) ? 0 : -1
      });
      if (typeof opts.onCardToggle === 'function') {
        node.addEventListener('click', function () { opts.onCardToggle(card.id, node); });
      }
      hand.appendChild(node);
    });
    container.appendChild(hand);
    return hand;
  }

  BigTwo.UI.TableRenderer = {
    render: renderTable,
    renderTable: renderTable,
    renderHand: renderHand,
    renderSeat: seat,
    createAvatar: createAvatar,
    playerName: playerName,
    cardCount: cardCount,
    currentPlayer: currentPlayer
  };
}(window));
