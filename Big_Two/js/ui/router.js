(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};

  function Router(root, options) {
    this.root = typeof root === 'string' ? global.document.querySelector(root) : root;
    this.options = options || {};
    this.screens = Object.create(null);
    this.currentName = null;
    this.currentScreen = null;
    this.currentParams = null;
    this.navigating = false;
  }

  Router.prototype.register = function (name, screen) {
    if (!name || !screen) {
      throw new Error('A screen name and controller are required.');
    }
    this.screens[name] = screen;
    return this;
  };

  Router.prototype.navigate = function (name, params) {
    var next = this.screens[name];
    var section;
    var heading;
    if (!next || !this.root || this.navigating) {
      return false;
    }
    this.navigating = true;
    try {
      if (this.currentScreen && typeof this.currentScreen.onHide === 'function') {
        this.currentScreen.onHide();
      }
      this.root.textContent = '';
      section = global.document.createElement('section');
      section.id = 'screen-' + name;
      section.className = 'screen ' + name + '-screen is-active';
      section.setAttribute('data-screen', name);
      section.setAttribute('aria-labelledby', 'screen-' + name + '-title');
      this.root.appendChild(section);
      this.currentName = name;
      this.currentScreen = next;
      this.currentParams = params || {};
      if (typeof next.render === 'function') {
        next.render(section, this.currentParams);
      }
      if (BigTwo.I18n) {
        BigTwo.I18n.translate(section);
      }
      if (typeof next.onShow === 'function') {
        next.onShow(this.currentParams);
      }
      heading = section.querySelector('[data-screen-heading], h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      } else {
        this.root.focus({ preventScroll: true });
      }
      global.scrollTo(0, 0);
      return true;
    } finally {
      this.navigating = false;
    }
  };

  Router.prototype.refresh = function () {
    if (!this.currentName) {
      return false;
    }
    return this.navigate(this.currentName, this.currentParams);
  };

  Router.prototype.destroy = function () {
    if (this.currentScreen && typeof this.currentScreen.onHide === 'function') {
      this.currentScreen.onHide();
    }
    Object.keys(this.screens).forEach(function (name) {
      var screen = this.screens[name];
      if (screen && typeof screen.destroy === 'function') {
        screen.destroy();
      }
    }, this);
    this.screens = Object.create(null);
    this.currentName = null;
    this.currentScreen = null;
    if (this.root) {
      this.root.textContent = '';
    }
  };

  BigTwo.UI.Router = Router;
}(window));
