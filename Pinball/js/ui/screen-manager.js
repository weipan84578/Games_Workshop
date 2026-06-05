(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function ScreenManager() {
    this.current = "menu";
    this.screens = {
      menu: document.getElementById("screen-menu"),
      game: document.getElementById("screen-game"),
      help: document.getElementById("screen-help"),
      settings: document.getElementById("screen-settings")
    };
    this.listeners = [];
  }

  ScreenManager.prototype.onChange = function (callback) {
    this.listeners.push(callback);
  };

  ScreenManager.prototype.show = function (name) {
    if (!this.screens[name]) return;
    Object.keys(this.screens).forEach(function (key) {
      this.screens[key].classList.toggle("is-active", key === name);
    }, this);
    this.current = name;
    Pinball.AudioManager.playSFX("screenChange");
    Pinball.AudioManager.playBGM(name === "game" ? "game" : "menu");
    this.listeners.forEach(function (callback) {
      callback(name);
    });
  };

  Pinball.ScreenManager = ScreenManager;
})(window);
