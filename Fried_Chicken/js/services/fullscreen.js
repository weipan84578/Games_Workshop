(function (global) {
  "use strict";
  var CCC = global.CCC;

  CCC.fullscreen = {
    supported: function () { return !!(document.fullscreenEnabled && document.documentElement.requestFullscreen); },
    active: function () { return !!document.fullscreenElement; },
    toggle: function () {
      if (!this.supported()) { return Promise.reject(new Error("unsupported")); }
      if (this.active()) { return document.exitFullscreen(); }
      return document.documentElement.requestFullscreen();
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
