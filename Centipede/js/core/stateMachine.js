(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class StateMachine {
    constructor(initial) {
      this.value = initial || "BOOT";
    }

    set(value) {
      this.value = value;
      if (document && document.body) {
        document.body.dataset.gameState = String(value).toLowerCase();
      }
      const app = window.Game && window.Game.app;
      if (app && typeof app.updateChromeState === "function") {
        app.updateChromeState();
      }
    }

    is(value) {
      return this.value === value;
    }
  }

  Game.StateMachine = StateMachine;
})(window);
