(function (NimGame) {
  'use strict';

  var modal;
  var title;
  var body;
  var actions;

  function init() {
    modal = NimGame.dom.$('#app-modal');
    title = NimGame.dom.$('#modal-title');
    body = NimGame.dom.$('#modal-body');
    actions = NimGame.dom.$('#modal-actions');
    NimGame.dom.on(modal, 'click', function (event) {
      if (event.target === modal) {
        close();
      }
    });
  }

  function clearActions() {
    actions.innerHTML = '';
  }

  function close() {
    if (!modal) {
      return;
    }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function open(options) {
    title.textContent = options.title || '';
    body.textContent = options.body || '';
    clearActions();

    (options.buttons || []).forEach(function (buttonConfig) {
      var button = NimGame.dom.create('button', buttonConfig.className || 'btn btn-secondary', {
        type: 'button',
        text: buttonConfig.label
      });
      NimGame.dom.on(button, 'click', function () {
        if (buttonConfig.onClick) {
          buttonConfig.onClick();
        }
        if (buttonConfig.close !== false) {
          close();
        }
      });
      actions.appendChild(button);
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    var focusTarget = actions.querySelector('button');
    if (focusTarget) {
      focusTarget.focus();
    }
  }

  function confirm(options) {
    open({
      title: options.title,
      body: options.body,
      buttons: [
        {
          label: NimGame.t('common.cancel'),
          className: 'btn btn-secondary',
          onClick: options.onCancel
        },
        {
          label: NimGame.t('common.confirm'),
          className: 'btn btn-danger',
          onClick: options.onConfirm
        }
      ]
    });
  }

  function result(winner, callbacks) {
    var didWin = winner === 'player';
    open({
      title: NimGame.t(didWin ? 'result.win' : 'result.lose'),
      body: NimGame.t(didWin ? 'result.winBody' : 'result.loseBody'),
      buttons: [
        {
          label: NimGame.t('result.toMenu'),
          className: 'btn btn-secondary',
          onClick: callbacks.toMenu
        },
        {
          label: NimGame.t('result.playAgain'),
          className: 'btn btn-primary',
          onClick: callbacks.playAgain
        }
      ]
    });
  }

  NimGame.ModalController = {
    init: init,
    open: open,
    close: close,
    confirm: confirm,
    result: result
  };
}(window.NimGame = window.NimGame || {}));
