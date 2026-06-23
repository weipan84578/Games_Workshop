(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.App = {
    currentScreen: "menu",
    previousScreen: "menu",

    showScreen(name) {
      this.previousScreen = this.currentScreen;
      this.currentScreen = name;
      document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.toggle("active", screen.id === `${name}Screen`);
      });
      if (name === "game") BG.GameUI.render();
      if (name === "menu") BG.MenuUI.refreshContinue();
    },

    back() {
      if (BG.GameState.game && this.previousScreen === "game") {
        this.showScreen("game");
      } else {
        this.showScreen("menu");
      }
    },
  };

  document.addEventListener("DOMContentLoaded", async () => {
    BG.GameState.settings = BG.Storage.loadSettings();
    await BG.I18n.load(BG.GameState.settings.language);
    BG.Theme.apply(BG.GameState.settings.theme);
    BG.AudioEngine.init(BG.GameState.settings);
    BG.Modal.init();
    BG.MenuUI.init();
    BG.SettingsUI.init();
    BG.HelpUI.init();
    BG.GameUI.init();
    BG.App.showScreen("menu");

    document.addEventListener("pointerdown", () => BG.AudioEngine.unlock(BG.GameState.settings), { once: true });
  });
})(window);
