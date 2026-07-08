(function (NimGame) {
  'use strict';

  var currentScreen = 'menu';
  var selection = null;
  var aiTimer = null;

  function init() {
    var settings = NimGame.StateManager.loadSettings();
    NimGame.StateManager.updateSettings(settings);
    NimGame.i18n.setLanguage(settings.language);
    NimGame.ModalController.init();
    NimGame.BoardRenderer.init({ onSelectPile: selectPile });
    NimGame.MenuController.init(App);
    NimGame.SettingsController.init(App);
    NimGame.InstructionsController.init(App);

    wireHeader();
    wireGameControls();
    NimGame.MenuController.refresh();
    NimGame.SettingsController.render();
    showScreen('menu');
    NimGame.i18n.apply(document);
  }

  function wireHeader() {
    NimGame.dom.on(NimGame.dom.$('#quick-mute'), 'click', function () {
      var settings = NimGame.StateManager.getState().settings;
      NimGame.StateManager.updateSettings({ bgmEnabled: !settings.bgmEnabled });
      NimGame.AudioManager.playSfx('click');
      updateHeader();
    });
    NimGame.dom.on(NimGame.dom.$('#quick-language'), 'change', function (event) {
      NimGame.i18n.setLanguage(event.target.value);
      NimGame.SettingsController.render();
      updateHeader();
      renderGame();
    });
  }

  function wireGameControls() {
    NimGame.dom.on(NimGame.dom.$('#amount-minus'), 'click', function () {
      changeAmount(-1);
    });
    NimGame.dom.on(NimGame.dom.$('#amount-plus'), 'click', function () {
      changeAmount(1);
    });
    NimGame.dom.on(NimGame.dom.$('#amount-range'), 'input', function (event) {
      setAmount(parseInt(event.target.value, 10) || 1);
    });
    NimGame.dom.on(NimGame.dom.$('#confirm-move'), 'click', confirmPlayerMove);
    NimGame.dom.on(NimGame.dom.$('#new-round'), 'click', confirmNewGame);
    NimGame.dom.on(NimGame.dom.$('#game-menu'), 'click', function () {
      showScreen('menu');
    });
  }

  function updateHeader() {
    var state = NimGame.StateManager.getState();
    var settings = state.settings;
    NimGame.dom.$('#quick-language').value = settings.language;
    NimGame.dom.$('#quick-mute').classList.toggle('is-muted', !settings.bgmEnabled);
  }

  function showScreen(name) {
    currentScreen = name;
    NimGame.dom.$$('.screen').forEach(function (screen) {
      screen.hidden = screen.dataset.screen !== name;
      screen.classList.toggle('is-active', screen.dataset.screen === name);
    });
    NimGame.dom.$('#game-controls').hidden = name !== 'game';
    if (name === 'game') {
      NimGame.AudioManager.enterGameScreen();
      renderGame();
      maybeRunAiTurn();
    } else {
      NimGame.AudioManager.leaveGameScreen();
      clearAiTimer();
    }
    if (name === 'settings') {
      NimGame.SettingsController.render();
    }
    updateHeader();
    NimGame.MenuController.refresh();
  }

  function clearAiTimer() {
    if (aiTimer) {
      window.clearTimeout(aiTimer);
      aiTimer = null;
    }
  }

  function startNewGame() {
    selection = null;
    NimGame.StateManager.startNewGame();
    document.dispatchEvent(new CustomEvent('nim:save-change'));
    showScreen('game');
  }

  function confirmNewGame() {
    NimGame.AudioManager.playSfx('click');
    NimGame.ModalController.confirm({
      title: NimGame.t('game.newRoundConfirmTitle'),
      body: NimGame.t('game.newRoundConfirmBody'),
      onConfirm: startNewGame
    });
  }

  function continueGame() {
    selection = null;
    var loaded = NimGame.StateManager.loadGame();
    if (loaded) {
      showScreen('game');
    } else {
      NimGame.MenuController.refresh();
    }
  }

  function selectPile(pileIndex) {
    var game = NimGame.StateManager.getState().game;
    if (!game || game.currentTurn !== 'player' || game.status !== 'playing' || game.piles[pileIndex] <= 0) {
      return;
    }
    selection = {
      pileIndex: pileIndex,
      amount: Math.min(1, game.piles[pileIndex])
    };
    NimGame.AudioManager.playSfx('select');
    renderGame();
  }

  function setAmount(amount) {
    var game = NimGame.StateManager.getState().game;
    if (!game || !selection) {
      return;
    }
    selection.amount = NimGame.dom.clamp(amount, 1, game.piles[selection.pileIndex]);
    renderControls(game);
  }

  function changeAmount(delta) {
    if (!selection) {
      return;
    }
    setAmount(selection.amount + delta);
    NimGame.AudioManager.playSfx('click');
  }

  function confirmPlayerMove() {
    var game = NimGame.StateManager.getState().game;
    if (!game || !selection || !NimGame.GameEngine.validateMove(game, selection.pileIndex, selection.amount)) {
      return;
    }
    var pileIndex = selection.pileIndex;
    var amount = selection.amount;
    var result = NimGame.GameEngine.applyMove(game, 'player', pileIndex, amount);
    NimGame.AnimationController.markTaking(pileIndex, amount);
    NimGame.AudioManager.playSfx('pick');
    selection = null;
    NimGame.StateManager.saveGame();
    renderGame();
    if (result.ended) {
      finishGame(result.winner);
      return;
    }
    maybeRunAiTurn();
  }

  function maybeRunAiTurn() {
    var game = NimGame.StateManager.getState().game;
    if (!game || currentScreen !== 'game' || game.currentTurn !== 'ai' || game.status !== 'playing' || aiTimer) {
      return;
    }
    renderGame();
    var delay = 800 + Math.floor(Math.random() * 700);
    aiTimer = window.setTimeout(function () {
      aiTimer = null;
      runAiTurn();
    }, delay);
  }

  function runAiTurn() {
    var game = NimGame.StateManager.getState().game;
    if (!game || currentScreen !== 'game' || game.currentTurn !== 'ai' || game.status !== 'playing') {
      return;
    }
    var move = NimGame.AIEngine.chooseMove(game.piles, {
      rule: game.rule,
      difficulty: game.difficulty
    });
    if (!move) {
      return;
    }
    var result = NimGame.GameEngine.applyMove(game, 'ai', move.pileIndex, move.amount);
    NimGame.AnimationController.markTaking(move.pileIndex, move.amount);
    NimGame.AudioManager.playSfx('pick');
    NimGame.StateManager.saveGame();
    renderGame();
    if (result.ended) {
      finishGame(result.winner);
    }
  }

  function finishGame(winner) {
    NimGame.StateManager.clearSave();
    NimGame.AudioManager.playSfx(winner === 'player' ? 'win' : 'lose');
    NimGame.AnimationController.burst(document.body, winner === 'player' ? 'win' : 'lose');
    window.setTimeout(function () {
      NimGame.ModalController.result(winner, {
        playAgain: startNewGame,
        toMenu: function () {
          showScreen('menu');
        }
      });
    }, 380);
  }

  function renderGame() {
    var state = NimGame.StateManager.getState();
    var game = state.game;
    if (!game) {
      return;
    }
    game.rule = state.settings.rule;
    game.difficulty = state.settings.difficulty;
    game.objectSkin = state.settings.objectSkin;
    NimGame.BoardRenderer.render(game, selection);
    renderHud(game);
    renderControls(game);
    updateHeader();
  }

  function renderHud(game) {
    var ruleHint = game.rule === 'normal' ? NimGame.t('game.rule.normalHint') : NimGame.t('game.rule.misereHint');
    NimGame.dom.$('#turn-label').textContent = game.currentTurn === 'player' ? NimGame.t('game.yourTurn') : NimGame.t('game.aiTurn');
    NimGame.dom.$('#rule-label').textContent = NimGame.t('game.rule.' + game.rule);
    NimGame.dom.$('#rule-hint').textContent = ruleHint;
    NimGame.dom.$('#difficulty-label').textContent = NimGame.t('game.difficulty.' + game.difficulty);
    NimGame.dom.$('#piles-summary').textContent = game.piles.join(' / ');
    NimGame.dom.$('#mascot').dataset.mood = game.currentTurn === 'ai' ? 'thinking' : 'idle';
  }

  function renderControls(game) {
    var info = NimGame.dom.$('#selection-info');
    var range = NimGame.dom.$('#amount-range');
    var confirm = NimGame.dom.$('#confirm-move');
    var minus = NimGame.dom.$('#amount-minus');
    var plus = NimGame.dom.$('#amount-plus');
    var canAct = game.currentTurn === 'player' && game.status === 'playing' && selection;
    var max = canAct ? game.piles[selection.pileIndex] : 1;
    var amount = canAct ? selection.amount : 1;

    range.max = max;
    range.value = amount;
    range.disabled = !canAct;
    minus.disabled = !canAct || amount <= 1;
    plus.disabled = !canAct || amount >= max;
    confirm.disabled = !canAct || !NimGame.GameEngine.validateMove(game, selection.pileIndex, amount);

    if (canAct) {
      info.textContent = NimGame.t('game.selectedPile', {
        index: selection.pileIndex + 1,
        amount: amount
      });
    } else {
      info.textContent = game.currentTurn === 'player' ? NimGame.t('game.selectPile') : NimGame.t('game.aiTurn');
    }
  }

  var App = {
    init: init,
    showScreen: showScreen,
    startNewGame: startNewGame,
    continueGame: continueGame,
    renderGame: renderGame
  };

  NimGame.App = App;
  document.addEventListener('DOMContentLoaded', init);
}(window.NimGame = window.NimGame || {}));
