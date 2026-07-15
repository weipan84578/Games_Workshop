(function (window) {
  "use strict";
  window.DJGame = window.DJGame || {};
  window.DJGame.version = "1.2.0";
  window.DJGame.clone = function (value) {
    return JSON.parse(JSON.stringify(value));
  };
  window.DJGame.now = function () {
    return Date.now();
  };
})(window);
