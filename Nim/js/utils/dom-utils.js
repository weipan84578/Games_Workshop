(function (NimGame) {
  'use strict';

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function on(element, eventName, handler) {
    if (!element) {
      return function noop() {};
    }
    element.addEventListener(eventName, handler);
    return function off() {
      element.removeEventListener(eventName, handler);
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function create(tagName, className, attributes) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    Object.keys(attributes || {}).forEach(function (key) {
      if (key === 'text') {
        element.textContent = attributes[key];
      } else if (key === 'html') {
        element.innerHTML = attributes[key];
      } else if (key === 'dataset') {
        Object.keys(attributes.dataset).forEach(function (dataKey) {
          element.dataset[dataKey] = attributes.dataset[dataKey];
        });
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
    return element;
  }

  function setHidden(element, hidden) {
    if (element) {
      element.hidden = Boolean(hidden);
    }
  }

  NimGame.dom = {
    $: $,
    $$: $$,
    on: on,
    clamp: clamp,
    create: create,
    setHidden: setHidden
  };
}(window.NimGame = window.NimGame || {}));
