(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.Screens = BigTwo.Screens || {};

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }

  function button(label, className, action) {
    var node = global.document.createElement('button');
    node.type = 'button';
    node.className = className;
    node.textContent = label;
    node.addEventListener('click', action);
    return node;
  }

  function findHuman(state) {
    return state && state.players && state.players.find(function (player) { return player.id === 'human'; });
  }

  function isEditableTarget(target) {
    if (!target || !target.tagName) { return false; }
    return target.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName);
  }

  function cardNodeById(scope, cardId) {
    var nodes = scope ? scope.querySelectorAll('[data-card-id]') : [];
    var index;
    for (index = 0; index < nodes.length; index += 1) {
      if (nodes[index].dataset.cardId === cardId) { return nodes[index]; }
    }
    return null;
  }

  BigTwo.Screens.createGameScreen = function (app) {
    var selectedIds = [];
    var sortMode = 'rank';
    var root = null;
    var refs = {};

    function state() { return app.getGameState(); }
    function human() { return findHuman(state()); }
    function selectedCards() {
      var player = human();
      return player && player.hand.filter(function (card) { return selectedIds.indexOf(card.id) >= 0; }) || [];
    }
    function evaluation() {
      var cards = selectedCards();
      if (!cards.length || !BigTwo.Rules || typeof BigTwo.Rules.classifyHand !== 'function') { return null; }
      try { return BigTwo.Rules.classifyHand(cards); } catch (error) { return null; }
    }
    function currentIsHuman() {
      var game = state();
      var current = game && game.players && game.players[game.currentPlayerIndex];
      return Boolean(current && current.id === 'human' && game.phase === 'playing');
    }
    function validatePlay() {
      var game = state();
      if (!game || !selectedIds.length || !currentIsHuman() || app.isBusy()) { return { valid: false }; }
      if (BigTwo.Game && typeof BigTwo.Game.validateAction === 'function') {
        try {
          return BigTwo.Game.validateAction(game, {
            type: 'PLAY_CARDS', playerId: 'human', cardIds: selectedIds.slice()
          });
        } catch (error) { return { valid: false }; }
      }
      var hand = evaluation();
      return { valid: Boolean(hand && hand.valid), evaluation: hand };
    }
    function canPass() {
      var game = state();
      if (!currentIsHuman() || app.isBusy()) { return false; }
      return BigTwo.Game && typeof BigTwo.Game.canPass === 'function'
        ? BigTwo.Game.canPass(game)
        : Boolean(game.lastPlayedCards && game.lastPlayedCards.length);
    }
    function summaryText() {
      var cards = selectedCards();
      var hand = evaluation();
      if (!cards.length) { return t('game.selectedEmpty'); }
      return t('game.selectedSummary', {
        count: cards.length,
        cards: cards.map(BigTwo.UI.CardRenderer.cardName).join('、'),
        hand: t('hand.' + (hand && hand.valid ? hand.type : 'invalid'))
      });
    }
    function updateSelectionUI(focusId) {
      var game = state();
      var disabled = !currentIsHuman() || app.isBusy();
      if (!root || !game) { return; }
      root.querySelectorAll('.human-hand .card').forEach(function (cardNode) {
        var isSelected = selectedIds.indexOf(cardNode.dataset.cardId) >= 0;
        var card = human().hand.find(function (item) { return item.id === cardNode.dataset.cardId; });
        cardNode.classList.toggle('is-selected', isSelected);
        cardNode.setAttribute('aria-pressed', String(isSelected));
        cardNode.disabled = disabled;
        if (card) {
          cardNode.setAttribute('aria-label', t('aria.card', {
            suit: t('suit.' + card.suit), rank: card.rank,
            state: t(isSelected ? 'aria.selected' : 'aria.notSelected')
          }));
        }
      });
      if (refs.summary) { refs.summary.textContent = summaryText(); }
      if (refs.play) { refs.play.disabled = !validatePlay().valid; }
      if (refs.pass) { refs.pass.disabled = !canPass(); }
      if (refs.clear) { refs.clear.disabled = selectedIds.length === 0 || disabled; }
      if (focusId) {
        var focus = cardNodeById(root, focusId);
        if (focus) { focus.focus(); }
      }
    }
    function toggleCard(cardId, node) {
      var index;
      if (!currentIsHuman() || app.isBusy()) { return; }
      index = selectedIds.indexOf(cardId);
      if (index >= 0) {
        selectedIds.splice(index, 1);
        app.playSfx('cardDeselect');
      } else {
        selectedIds.push(cardId);
        app.playSfx('cardSelect');
      }
      updateSelectionUI(cardId);
      if (node) { node.setAttribute('aria-pressed', String(selectedIds.indexOf(cardId) >= 0)); }
    }
    function renderHand() {
      var player = human();
      var old = refs.hand;
      var holder = refs.handHolder;
      var focused = global.document.activeElement && global.document.activeElement.dataset && global.document.activeElement.dataset.cardId;
      if (!player || !holder) { return; }
      if (old && old.parentNode) { old.parentNode.removeChild(old); }
      refs.hand = BigTwo.UI.TableRenderer.renderHand(holder, player.hand, {
        selected: selectedIds,
        sortMode: sortMode,
        disabled: !currentIsHuman() || app.isBusy(),
        onCardToggle: toggleCard
      });
      if (focused) {
        var next = cardNodeById(refs.hand, focused);
        if (next) {
          refs.hand.querySelectorAll('[data-card-id]').forEach(function (node) { node.tabIndex = node === next ? 0 : -1; });
          next.focus();
        }
      }
    }
    function clearSelection() {
      selectedIds.length = 0;
      updateSelectionUI();
    }
    function play() {
      if (!validatePlay().valid) {
        app.reportActionError('INVALID_HAND', refs.actions);
        return;
      }
      app.dispatchHuman({ type: 'PLAY_CARDS', playerId: 'human', cardIds: selectedIds.slice() })
        .then(function (ok) { if (ok) { selectedIds.length = 0; } });
    }
    function pass() {
      if (!canPass()) {
        app.reportActionError('CANNOT_PASS_ON_LEAD', refs.actions);
        return;
      }
      app.dispatchHuman({ type: 'PASS', playerId: 'human' });
    }
    function hint() {
      var game = state();
      var action = null;
      var moves;
      if (!currentIsHuman() || app.isBusy()) { return; }
      try {
        if (BigTwo.AI && typeof BigTwo.AI.chooseAction === 'function') {
          action = BigTwo.AI.chooseAction(game, 'human', 'normal', BigTwo.Utils.RNG.create(game.rngState + ':hint'));
        }
      } catch (error) { action = null; }
      if (!action && BigTwo.Game && typeof BigTwo.Game.getLegalMovesForCurrentPlayer === 'function') {
        moves = BigTwo.Game.getLegalMovesForCurrentPlayer(game);
        if (moves.length) {
          action = { type: 'PLAY_CARDS', cardIds: moves[0].map(function (card) { return card.id; }) };
        }
      }
      if (!action || action.type === 'PASS') {
        selectedIds.length = 0;
        updateSelectionUI();
        app.toast(t('game.noMoveHint'));
        if (refs.pass && !refs.pass.disabled) { refs.pass.focus(); }
        return;
      }
      selectedIds = action.cardIds.slice();
      updateSelectionUI(selectedIds[0]);
      app.toast(t('game.hintApplied'));
    }
    function toggleSort() {
      sortMode = sortMode === 'rank' ? 'suit' : 'rank';
      refs.sort.textContent = t('game.sortLabel', { mode: t(sortMode === 'rank' ? 'game.sortRank' : 'game.sortSuit') });
      renderHand();
      updateSelectionUI();
    }
    function keydown(event) {
      var cards;
      var index;
      var next;
      if (isEditableTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) { return; }
      if (app.isDialogOpen()) { return; }
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.target.closest && event.target.closest('.human-hand')) {
        cards = Array.prototype.slice.call(root.querySelectorAll('.human-hand .card:not([disabled])'));
        index = cards.indexOf(event.target);
        if (index >= 0 && cards.length) {
          event.preventDefault();
          next = event.key === 'ArrowRight' ? (index + 1) % cards.length : (index - 1 + cards.length) % cards.length;
          cards.forEach(function (card, cardIndex) { card.tabIndex = cardIndex === next ? 0 : -1; });
          cards[next].focus();
        }
        return;
      }
      if (event.key.toLowerCase() === 'p' && refs.pass && !refs.pass.disabled) {
        event.preventDefault(); pass();
      } else if (event.key.toLowerCase() === 'h' && refs.hint && !refs.hint.disabled) {
        event.preventDefault(); hint();
      } else if (event.key === 'Escape') {
        event.preventDefault(); clearSelection();
      }
    }

    return {
      render: function (container) {
        var game = state();
        var player;
        var current;
        var header;
        var title;
        var status;
        var music;
        var leave;
        var tableHolder;
        var humanZone;
        var handHeading;
        var actionBar;
        root = container;
        refs = {};
        if (!game || !game.players) {
          title = global.document.createElement('h1');
          title.id = 'screen-game-title';
          title.setAttribute('data-screen-heading', '');
          title.textContent = t('game.title');
          container.appendChild(title);
          var error = global.document.createElement('p');
          error.setAttribute('role', 'alert');
          error.textContent = t('game.error.unavailable');
          container.appendChild(error);
          container.appendChild(button(t('common.home'), 'button button--secondary', function () { app.navigate('home'); }));
          return;
        }
        player = findHuman(game);
        current = game.players[game.currentPlayerIndex];
        selectedIds = selectedIds.filter(function (id) { return player.hand.some(function (card) { return card.id === id; }); });
        header = global.document.createElement('header');
        header.className = 'game-status-bar app-header';
        title = global.document.createElement('h1');
        title.id = 'screen-game-title';
        title.setAttribute('data-screen-heading', '');
        title.textContent = t('game.title');
        status = global.document.createElement('div');
        status.className = 'game-status-bar__details';
        [t('game.round', { round: game.roundNumber }), t('game.score', { score: player.score }),
          t('game.difficulty', { difficulty: t('difficulty.' + (game.difficulty || app.getSettings().difficulty)) }),
          current && current.id === 'human' ? t('game.yourTurn') : t('game.thinking', { name: t('player.' + current.id) })]
          .forEach(function (value) {
            var item = global.document.createElement('span');
            item.textContent = value;
            status.appendChild(item);
          });
        music = button(t('game.music') + ' · ' + t(app.getSettings().musicEnabled ? 'common.on' : 'common.off'), 'button button--compact audio-toggle', function () {
          app.toggleMusic();
        });
        music.setAttribute('aria-pressed', String(app.getSettings().musicEnabled));
        leave = button(t('game.leave'), 'button button--compact button--secondary', function () { app.confirmLeaveGame(); });
        header.appendChild(title);
        header.appendChild(status);
        header.appendChild(music);
        header.appendChild(leave);
        tableHolder = global.document.createElement('div');
        tableHolder.className = 'game-table-wrap';
        BigTwo.UI.TableRenderer.renderTable(tableHolder, game);
        humanZone = global.document.createElement('section');
        humanZone.className = 'human-zone';
        handHeading = global.document.createElement('h2');
        handHeading.className = 'sr-only';
        handHeading.textContent = t('aria.humanHand');
        refs.summary = global.document.createElement('p');
        refs.summary.className = 'selection-summary';
        refs.summary.setAttribute('aria-live', 'polite');
        refs.summary.textContent = summaryText();
        refs.handHolder = global.document.createElement('div');
        refs.handHolder.className = 'human-hand-wrap';
        humanZone.appendChild(handHeading);
        humanZone.appendChild(refs.summary);
        humanZone.appendChild(refs.handHolder);
        renderHand();
        actionBar = global.document.createElement('nav');
        actionBar.className = 'action-bar';
        actionBar.setAttribute('aria-label', t('aria.gameActions'));
        refs.actions = actionBar;
        refs.play = button(t('game.play'), 'button button--primary action-play', play);
        refs.pass = button(t('game.pass'), 'button button--secondary action-pass', pass);
        refs.hint = button(t('game.hint'), 'button button--secondary', hint);
        refs.clear = button(t('game.clearSelection'), 'button button--secondary', clearSelection);
        refs.sort = button(t('game.sortLabel', { mode: t(sortMode === 'rank' ? 'game.sortRank' : 'game.sortSuit') }), 'button button--secondary', toggleSort);
        actionBar.appendChild(refs.play);
        actionBar.appendChild(refs.pass);
        actionBar.appendChild(refs.hint);
        actionBar.appendChild(refs.clear);
        actionBar.appendChild(refs.sort);
        container.appendChild(header);
        container.appendChild(tableHolder);
        container.appendChild(humanZone);
        container.appendChild(actionBar);
        updateSelectionUI();
      },
      onShow: function () {
        global.document.addEventListener('keydown', keydown);
        app.ensureAITurn();
      },
      onHide: function () {
        global.document.removeEventListener('keydown', keydown);
        root = null;
        refs = {};
      },
      clearSelection: clearSelection
    };
  };
}(window));
