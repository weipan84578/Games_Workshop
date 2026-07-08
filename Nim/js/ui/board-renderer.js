(function (NimGame) {
  'use strict';

  var board;
  var onSelectPile = function () {};

  function init(options) {
    board = NimGame.dom.$('#board');
    onSelectPile = options.onSelectPile;
  }

  function createObjects(count, skin) {
    var stack = NimGame.dom.create('div', 'pile-stack pile-stack-' + skin);
    for (var i = 0; i < count; i += 1) {
      var item = NimGame.dom.create('span', 'pile-object object-' + skin, {
        'aria-hidden': 'true'
      });
      item.style.setProperty('--item-index', i);
      stack.appendChild(item);
    }
    return stack;
  }

  function render(game, selection) {
    if (!board || !game) {
      return;
    }

    var skin = game.objectSkin || 'stone';
    board.innerHTML = '';
    board.style.setProperty('--pile-count', game.piles.length);

    game.piles.forEach(function (count, index) {
      var isSelected = selection && selection.pileIndex === index;
      var pile = NimGame.dom.create('button', 'pile' + (isSelected ? ' is-selected' : ''), {
        type: 'button',
        dataset: { pileIndex: index },
        'aria-pressed': isSelected ? 'true' : 'false',
        'aria-label': NimGame.t('game.pileLabel', { index: index + 1 }) + ', ' + NimGame.t('game.remaining', { count: count })
      });
      pile.disabled = game.currentTurn !== 'player' || count === 0 || game.status !== 'playing';

      var label = NimGame.dom.create('span', 'pile-label', {
        text: NimGame.t('game.pileLabel', { index: index + 1 })
      });
      var countLabel = NimGame.dom.create('span', 'pile-count', {
        text: NimGame.t('game.remaining', { count: count })
      });

      pile.appendChild(createObjects(count, skin));
      pile.appendChild(label);
      pile.appendChild(countLabel);
      NimGame.dom.on(pile, 'click', function () {
        onSelectPile(index);
      });
      board.appendChild(pile);
    });
  }

  NimGame.BoardRenderer = {
    init: init,
    render: render
  };
}(window.NimGame = window.NimGame || {}));
