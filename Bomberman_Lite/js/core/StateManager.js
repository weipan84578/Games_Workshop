(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class StateManager {
    constructor() {
      this.screens = {
        menu: document.getElementById("screen-menu"),
        game: document.getElementById("screen-game"),
        gameover: document.getElementById("screen-gameover")
      };
      this.current = "menu";
    }

    show(name) {
      Object.keys(this.screens).forEach((key) => {
        if (this.screens[key]) this.screens[key].classList.toggle("hidden", key !== name);
      });
      this.current = name;
    }
  }

  root.StateManager = StateManager;
}());
