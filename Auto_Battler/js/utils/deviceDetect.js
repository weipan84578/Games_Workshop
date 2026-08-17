(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  app.Device = {
    isTouch: function () {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    },
    isNarrow: function () {
      return window.innerWidth < 320;
    },
    prefersReducedMotion: function () {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    getOrientation: function () {
      return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    },
    applyHints: function () {
      document.documentElement.dataset.touch = this.isTouch() ? "true" : "false";
      document.documentElement.dataset.narrow = this.isNarrow() ? "true" : "false";
      document.documentElement.dataset.orientation = this.getOrientation();
    }
  };
}(window));
