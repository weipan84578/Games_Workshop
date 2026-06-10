(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function ScreenManager() {
    this.current = "screen-main-menu";
  }

  ScreenManager.prototype.show = function(screenId) {
    if (this.current === screenId) {
      return;
    }

    var from = this.current;
    var screens = document.querySelectorAll(".screen");
    screens.forEach(function(screen) {
      screen.classList.toggle("screen--active", screen.id === screenId);
    });

    this.current = screenId;
    document.dispatchEvent(new CustomEvent("mancala:screenChange", {
      detail: { from: from, to: screenId }
    }));
  };

  Mancala.ScreenManager = ScreenManager;
})(window);
