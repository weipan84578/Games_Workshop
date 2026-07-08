(function (NimGame) {
  'use strict';

  var continueButton;

  function init(app) {
    continueButton = NimGame.dom.$('#continue-game');
    NimGame.dom.on(NimGame.dom.$('#start-game'), 'click', function () {
      NimGame.AudioManager.playSfx('click');
      app.startNewGame();
    });
    NimGame.dom.on(continueButton, 'click', function () {
      NimGame.AudioManager.playSfx('click');
      app.continueGame();
    });
    NimGame.dom.on(NimGame.dom.$('#open-instructions'), 'click', function () {
      NimGame.AudioManager.playSfx('click');
      app.showScreen('instructions');
    });
    NimGame.dom.on(NimGame.dom.$('#open-settings'), 'click', function () {
      NimGame.AudioManager.playSfx('click');
      app.showScreen('settings');
    });
    document.addEventListener('nim:save-change', refresh);
    document.addEventListener('nim:language-change', refresh);
  }

  function refresh() {
    if (!continueButton) {
      return;
    }
    var hasSave = NimGame.StateManager.hasSave();
    continueButton.disabled = !hasSave;
    continueButton.querySelector('.btn-note').textContent = hasSave ? '' : NimGame.t('menu.noSave');
  }

  NimGame.MenuController = {
    init: init,
    refresh: refresh
  };
}(window.NimGame = window.NimGame || {}));
