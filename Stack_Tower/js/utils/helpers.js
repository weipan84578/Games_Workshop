(function (window) {
  'use strict';

  const Helpers = {
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    lerp(start, end, amount) {
      return start + (end - start) * amount;
    },

    rand(min, max) {
      return min + Math.random() * (max - min);
    },

    qs(selector, root = document) {
      return root.querySelector(selector);
    },

    qsa(selector, root = document) {
      return Array.from(root.querySelectorAll(selector));
    },

    formatDate(date = new Date()) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },

    makeButton(label, className, onClick) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = label;
      button.addEventListener('click', onClick);
      return button;
    }
  };

  window.Helpers = Helpers;
})(window);
