(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;
  var Utils = Pinball.Utils;

  function Menu(screenManager) {
    this.screenManager = screenManager;
    this.highScore = document.getElementById("menu-high-score");
    this.start = document.getElementById("btn-start");
    this.continueGame = document.getElementById("btn-continue");
    this.help = document.getElementById("btn-help");
    this.settings = document.getElementById("btn-settings");
    this.backButtons = Array.prototype.slice.call(document.querySelectorAll(".js-back-menu"));
  }

  Menu.prototype.init = function (callbacks) {
    callbacks = callbacks || {};
    this.start.addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      Pinball.AudioManager.playSFX("uiClick");
      callbacks.start();
    });
    this.continueGame.addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      Pinball.AudioManager.playSFX("uiClick");
      callbacks.continueGame();
    });
    this.help.addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      this.screenManager.show("help");
    }.bind(this));
    this.settings.addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      this.screenManager.show("settings");
    }.bind(this));
    this.backButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        Pinball.AudioManager.unlock();
        this.screenManager.show("menu");
      }.bind(this));
    }, this);
    this.refresh();
  };

  Menu.prototype.refresh = function () {
    var high = Utils.loadNumber(CONFIG.STORAGE.HIGH_SCORE, 0);
    var saved = Utils.loadJSON(CONFIG.STORAGE.SAVED_GAME, null);
    this.highScore.textContent = Utils.formatScore(high);
    this.continueGame.disabled = !saved;
  };

  Pinball.Menu = Menu;
})(window);
