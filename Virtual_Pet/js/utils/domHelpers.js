window.VP = window.VP || {};

VP.dom = (function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function on(target, eventName, handler, options) {
    if (!target) {
      return function () {};
    }
    target.addEventListener(eventName, handler, options || false);
    return function () {
      target.removeEventListener(eventName, handler, options || false);
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function create(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  return {
    $: $,
    $$: $$,
    on: on,
    clamp: clamp,
    create: create
  };
})();
