(function (PSG) {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  PSG.utils.dom = {
    one: function (selector, root) {
      return (root || document).querySelector(selector);
    },
    all: function (selector, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    },
    escape: escapeHtml,
    on: function (root, eventName, selector, handler) {
      var listener = function (event) {
        var target = event.target.closest(selector);
        if (target && root.contains(target)) handler(event, target);
      };
      root.addEventListener(eventName, listener);
      return function () {
        root.removeEventListener(eventName, listener);
      };
    },
    bar: function (label, value, max, icon, tone) {
      var safeMax = Math.max(1, max);
      var percent = PSG.utils.math.clamp((value / safeMax) * 100, 0, 100);
      return (
        '<div class="meter meter--' +
        (tone || 'primary') +
        '"><div class="meter__label"><span>' +
        icon +
        ' ' +
        escapeHtml(label) +
        '</span><strong>' +
        escapeHtml(value) +
        ' / ' +
        escapeHtml(max) +
        '</strong></div><div class="meter__track" role="meter" aria-valuemin="0" aria-valuemax="' +
        safeMax +
        '" aria-valuenow="' +
        value +
        '"><span style="width:' +
        percent +
        '%"></span></div></div>'
      );
    }
  };
})(window.PSG);
