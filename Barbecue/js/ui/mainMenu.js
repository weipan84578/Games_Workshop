(function exposeMainMenu(root, factory) {
  var MainMenu = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.MainMenu = MainMenu;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MainMenu;
  }
})(typeof window !== "undefined" ? window : globalThis, function mainMenuFactory() {
  "use strict";

  function MainMenu(options) {
    this.storage = options.storage;
    this.audio = options.audio;
    this.elements = {
      screen: options.screen,
      start: options.startButton,
      continueGame: options.continueButton,
      help: options.helpButton,
      settings: options.settingsButton
    };
    this.callbacks = options.callbacks || {};
  }

  MainMenu.prototype.bind = function bind() {
    this.elements.start.addEventListener("click", function startGame() {
      this.click();
      this.callbacks.onStart();
    }.bind(this));

    this.elements.continueGame.addEventListener("click", function continueGame() {
      this.click();
      this.callbacks.onContinue();
    }.bind(this));

    this.elements.help.addEventListener("click", function openHelp() {
      this.click();
      this.callbacks.onHelp();
    }.bind(this));

    this.elements.settings.addEventListener("click", function openSettings() {
      this.click();
      this.callbacks.onSettings();
    }.bind(this));

    this.refresh();
  };

  MainMenu.prototype.click = function click() {
    if (this.audio) {
      this.audio.playSfx("click");
    }
  };

  MainMenu.prototype.refresh = function refresh() {
    this.elements.continueGame.disabled = !this.storage.hasSaveGame();
  };

  MainMenu.prototype.show = function show() {
    this.elements.screen.classList.add("active");
    this.refresh();
  };

  MainMenu.prototype.hide = function hide() {
    this.elements.screen.classList.remove("active");
  };

  return MainMenu;
});
