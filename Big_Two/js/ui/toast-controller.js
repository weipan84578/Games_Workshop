(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};

  function ToastController(root) {
    this.root = typeof root === 'string' ? global.document.querySelector(root) : root;
    this.timer = null;
    this.frame = null;
  }

  ToastController.prototype.show = function (message, options) {
    var toast;
    var duration = options && options.duration != null ? options.duration : 3200;
    var assertive = options && options.assertive;
    this.clear();
    if (!this.root || !message) {
      return;
    }
    toast = global.document.createElement('div');
    toast.className = 'toast toast--' + ((options && options.type) || 'info');
    toast.setAttribute('role', assertive ? 'alert' : 'status');
    toast.textContent = String(message);
    this.root.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    this.root.appendChild(toast);
    this.frame = global.requestAnimationFrame(function () {
      toast.classList.add('is-visible');
      this.frame = null;
    }.bind(this));
    if (duration > 0) {
      this.timer = global.setTimeout(this.clear.bind(this), duration);
    }
  };

  ToastController.prototype.clear = function () {
    if (this.timer) {
      global.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.frame) {
      global.cancelAnimationFrame(this.frame);
      this.frame = null;
    }
    if (this.root) {
      this.root.textContent = '';
    }
  };

  BigTwo.UI.ToastController = ToastController;
}(window));
