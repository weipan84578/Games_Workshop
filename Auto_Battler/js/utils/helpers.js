(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  app.Helpers = {
    clamp: function (value, min, max) {
      return Math.min(max, Math.max(min, value));
    },
    randomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pick: function (list) {
      return list[Math.floor(Math.random() * list.length)];
    },
    shuffle: function (list) {
      var copy = list.slice();
      for (var index = copy.length - 1; index > 0; index -= 1) {
        var swapIndex = Math.floor(Math.random() * (index + 1));
        var value = copy[index];
        copy[index] = copy[swapIndex];
        copy[swapIndex] = value;
      }
      return copy;
    },
    clone: function (value) {
      return JSON.parse(JSON.stringify(value));
    },
    uid: function (prefix) {
      return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    },
    formatNumber: function (value, language) {
      try {
        return new Intl.NumberFormat(language || "zh-TW").format(value);
      } catch (error) {
        return String(value);
      }
    },
    escapeHtml: function (value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    percent: function (value) {
      return Math.round(value * 100) + "%";
    },
    capitalize: function (value) {
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    }
  };
}(window));
