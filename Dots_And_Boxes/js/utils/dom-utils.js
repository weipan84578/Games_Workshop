(function (ns) {
  "use strict";

  ns.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  ns.$$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  ns.on = function (element, eventName, handler, options) {
    if (!element) {
      return function () {};
    }
    element.addEventListener(eventName, handler, options || false);
    return function () {
      element.removeEventListener(eventName, handler, options || false);
    };
  };

  ns.createSvg = function (tag, attrs) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  };

  ns.setHidden = function (element, hidden) {
    if (element) {
      element.hidden = Boolean(hidden);
    }
  };

  ns.setPressedGroup = function (container, button) {
    ns.$$("button", container).forEach(function (item) {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
  };

  ns.openModal = function (id) {
    var modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var firstButton = modal.querySelector("button, [href], input, select");
    if (firstButton) {
      firstButton.focus();
    }
  };

  ns.closeModal = function (id) {
    var modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    modal.hidden = true;
    if (!document.querySelector(".modal-backdrop:not([hidden])")) {
      document.body.classList.remove("modal-open");
    }
  };
})(window.DAB = window.DAB || {});
