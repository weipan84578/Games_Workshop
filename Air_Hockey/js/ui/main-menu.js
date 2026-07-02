(function (ns) {
  "use strict";

  function MainMenu(app) {
    this.app = app;
    this.continueButton = ns.Helpers.$("#continue-button");
  }

  MainMenu.prototype.init = function () {
    var self = this;
    document.addEventListener("click", function (event) {
      var actionButton = event.target.closest("[data-action]");
      if (!actionButton) {
        return;
      }
      var action = actionButton.getAttribute("data-action");
      if (action === "start-menu") {
        self.app.screen.show("difficulty");
      }
      if (action === "continue-game") {
        self.app.continueGame();
      }
      if (action === "show-howto") {
        self.app.audio.setMode("menu");
        self.app.screen.show("howto");
      }
      if (action === "show-settings") {
        self.app.audio.setMode("menu");
        self.app.settingsMenu.refresh();
        self.app.screen.show("settings");
      }
      if (action === "show-menu") {
        self.app.showMenu();
      }
    });

    ns.Helpers.$$("[data-difficulty]").forEach(function (button) {
      button.addEventListener("click", function () {
        self.app.startGame(button.getAttribute("data-difficulty"));
      });
    });
    this.refreshContinue();
  };

  MainMenu.prototype.refreshContinue = function () {
    var progress = ns.SaveManager.loadProgress();
    this.continueButton.disabled = !progress;
    this.continueButton.classList.toggle("has-progress", Boolean(progress));
  };

  ns.MainMenu = MainMenu;
})(window.AirHockey = window.AirHockey || {});
