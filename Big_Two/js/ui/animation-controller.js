(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.UI = BigTwo.UI || {};

  function AnimationController(options) {
    this.enabled = !options || options.enabled !== false;
    this.active = [];
    this.reducedQuery = global.matchMedia ? global.matchMedia('(prefers-reduced-motion: reduce)') : null;
  }

  AnimationController.prototype.shouldReduce = function () {
    return !this.enabled || Boolean(this.reducedQuery && this.reducedQuery.matches);
  };

  AnimationController.prototype.setEnabled = function (enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) { this.clearAll(); }
  };

  AnimationController.prototype.animate = function (element, keyframes, options) {
    var self = this;
    var opts = Object.assign({}, options || {});
    var animation;
    if (!element) { return Promise.resolve(); }
    opts.duration = this.shouldReduce() ? Math.min(Number(opts.duration) || 0, 80) : (Number(opts.duration) || 0);
    if (typeof element.animate !== 'function' || opts.duration === 0) {
      if (keyframes && keyframes.length) {
        Object.keys(keyframes[keyframes.length - 1]).forEach(function (property) {
          if (property !== 'offset') { element.style[property] = keyframes[keyframes.length - 1][property]; }
        });
      }
      return Promise.resolve();
    }
    animation = element.animate(keyframes, opts);
    this.active.push(animation);
    return new Promise(function (resolve) {
      function done() {
        var index = self.active.indexOf(animation);
        if (index >= 0) { self.active.splice(index, 1); }
        resolve();
      }
      animation.addEventListener('finish', done, { once: true });
      animation.addEventListener('cancel', done, { once: true });
    });
  };

  AnimationController.prototype.shake = function (element) {
    if (this.shouldReduce()) { return Promise.resolve(); }
    return this.animate(element, [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' }
    ], { duration: 180, easing: 'ease-out' });
  };

  AnimationController.prototype.clearAll = function () {
    this.active.slice().forEach(function (animation) {
      try { animation.cancel(); } catch (error) { /* already finished */ }
    });
    this.active.length = 0;
  };

  BigTwo.UI.AnimationController = AnimationController;
}(window));
