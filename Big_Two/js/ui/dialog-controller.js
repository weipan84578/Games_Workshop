(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};

  function makeButton(text, className) {
    var button = global.document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    return button;
  }

  function DialogController(root) {
    this.root = typeof root === 'string' ? global.document.querySelector(root) : root;
    this.active = null;
    this.previousFocus = null;
  }

  DialogController.prototype.open = function (options) {
    var self = this;
    var opts = options || {};
    var dialog;
    var panel;
    var header;
    var title;
    var close;
    var body;
    var actions;
    var cancel;
    var confirm;
    var appRoot = global.document.getElementById('app');

    if (!this.root) {
      return Promise.resolve(false);
    }
    this.close(false);
    this.previousFocus = global.document.activeElement;
    dialog = global.document.createElement('dialog');
    dialog.className = 'modal';
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'active-dialog-title');
    panel = global.document.createElement('div');
    panel.className = 'modal__panel';
    header = global.document.createElement('header');
    header.className = 'modal__header';
    title = global.document.createElement('h2');
    title.id = 'active-dialog-title';
    title.textContent = opts.title || '';
    close = makeButton((BigTwo.I18n && BigTwo.I18n.t('common.close')) || 'Close', 'modal__close button button--secondary');
    close.setAttribute('aria-label', BigTwo.I18n ? BigTwo.I18n.t('aria.closeDialog') : 'Close');
    header.appendChild(title);
    header.appendChild(close);
    body = global.document.createElement('div');
    body.className = 'modal__body';
    if (opts.body && opts.body.nodeType) {
      body.appendChild(opts.body);
    } else {
      body.textContent = opts.body || '';
    }
    actions = global.document.createElement('footer');
    actions.className = 'modal__actions';
    if (opts.cancelText !== null) {
      cancel = makeButton(opts.cancelText || (BigTwo.I18n && BigTwo.I18n.t('common.cancel')) || 'Cancel', 'button button--secondary');
      actions.appendChild(cancel);
    }
    confirm = makeButton(opts.confirmText || (BigTwo.I18n && BigTwo.I18n.t('common.confirm')) || 'Confirm',
      'button ' + (opts.danger ? 'button--danger' : 'button--primary'));
    actions.appendChild(confirm);
    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(actions);
    dialog.appendChild(panel);
    this.root.appendChild(dialog);

    return new Promise(function (resolve) {
      var settled = false;
      function finish(result) {
        if (settled) { return; }
        settled = true;
        if (dialog.open && typeof dialog.close === 'function') {
          dialog.close();
        }
        if (dialog.parentNode) {
          dialog.parentNode.removeChild(dialog);
        }
        if (appRoot) {
          appRoot.removeAttribute('inert');
          appRoot.removeAttribute('aria-hidden');
        }
        self.active = null;
        if (self.previousFocus && typeof self.previousFocus.focus === 'function') {
          self.previousFocus.focus();
        }
        self.previousFocus = null;
        resolve(Boolean(result));
      }
      function trapFocus(event) {
        var focusable;
        var first;
        var last;
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(false);
          return;
        }
        if (event.key !== 'Tab') { return; }
        focusable = dialog.querySelectorAll('button:not([disabled]), [href], select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) { return; }
        first = focusable[0];
        last = focusable[focusable.length - 1];
        if (event.shiftKey && global.document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && global.document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      close.addEventListener('click', function () { finish(false); });
      if (cancel) { cancel.addEventListener('click', function () { finish(false); }); }
      confirm.addEventListener('click', function () { finish(true); });
      dialog.addEventListener('cancel', function (event) {
        event.preventDefault();
        finish(false);
      });
      dialog.addEventListener('keydown', trapFocus);
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog && opts.dismissible !== false) { finish(false); }
      });
      self.active = { element: dialog, finish: finish };
      if (appRoot) {
        appRoot.setAttribute('inert', '');
        appRoot.setAttribute('aria-hidden', 'true');
      }
      try {
        dialog.showModal();
      } catch (error) {
        dialog.setAttribute('open', '');
        dialog.setAttribute('role', 'dialog');
        dialog.classList.add('is-open');
      }
      (cancel || confirm).focus();
    });
  };

  DialogController.prototype.alert = function (options) {
    var opts = Object.assign({}, options || {}, { cancelText: null });
    return this.open(opts);
  };

  DialogController.prototype.confirm = function (options) {
    return this.open(options);
  };

  DialogController.prototype.close = function (result) {
    if (this.active && typeof this.active.finish === 'function') {
      this.active.finish(Boolean(result));
    }
  };

  DialogController.prototype.isOpen = function () {
    return Boolean(this.active);
  };

  BigTwo.UI.DialogController = DialogController;
}(window));
