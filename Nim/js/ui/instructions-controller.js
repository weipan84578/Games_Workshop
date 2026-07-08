(function (NimGame) {
  'use strict';

  function init(app) {
    NimGame.dom.on(NimGame.dom.$('#instructions-back'), 'click', function () {
      NimGame.AudioManager.playSfx('click');
      app.showScreen('menu');
    });

    NimGame.dom.on(NimGame.dom.$('#instruction-tabs'), 'click', function (event) {
      var button = event.target.closest('[data-tab]');
      if (!button) {
        return;
      }
      activateTab(button.dataset.tab);
      NimGame.AudioManager.playSfx('select');
    });

    NimGame.dom.$$('#faq-list details').forEach(function (detail) {
      NimGame.dom.on(detail, 'toggle', function () {
        if (detail.open) {
          NimGame.AudioManager.playSfx('click');
        }
      });
    });
  }

  function activateTab(tab) {
    NimGame.dom.$$('#instruction-tabs [data-tab]').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.tab === tab);
    });
    NimGame.dom.$$('.instruction-panel').forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== tab;
    });
  }

  NimGame.InstructionsController = {
    init: init,
    activateTab: activateTab
  };
}(window.NimGame = window.NimGame || {}));
