(function () {
  const screenMap = {
    "main-menu": { id: "screen-main-menu", renderer: MainMenu },
    game: { id: "screen-game", renderer: GameScreen },
    help: { id: "screen-help", renderer: HelpScreen },
    settings: { id: "screen-settings", renderer: SettingsScreen },
  };

  const App = {
    currentScreen: "main-menu",

    init() {
      const settings = UnoStorage.getSettings();
      I18n.init(settings.lang);
      Themes.apply(settings.theme);
      AudioManager.init();
      AudioManager.setVolumes(settings);
      this.bindAudioUnlock();
      this.bindGlobalUpdates();
      this.showScreen("main-menu");
    },

    bindAudioUnlock() {
      const unlock = () => {
        AudioManager.resume();
        AudioManager.startBGM();
        document.removeEventListener("pointerdown", unlock);
        document.removeEventListener("keydown", unlock);
      };
      document.addEventListener("pointerdown", unlock, { once: true });
      document.addEventListener("keydown", unlock, { once: true });
    },

    bindGlobalUpdates() {
      GameState.subscribe(() => {
        if (this.currentScreen === "game") GameScreen.render();
        if (this.currentScreen === "main-menu") MainMenu.render();
      });
      Helpers.on("uno:language-changed", () => this.renderCurrent());
      Helpers.on("uno:theme-changed", () => this.renderCurrent());
    },

    showScreen(name) {
      this.currentScreen = name;
      Object.values(screenMap).forEach((screen) => {
        Helpers.qs(`#${screen.id}`).hidden = true;
      });
      const screen = screenMap[name] || screenMap["main-menu"];
      const element = Helpers.qs(`#${screen.id}`);
      element.hidden = false;
      screen.renderer.render(element);
      I18n.applyToDOM();
    },

    renderCurrent() {
      this.showScreen(this.currentScreen);
    },

    startNewGame(difficulty) {
      GameScreen.selectedCardId = null;
      GameScreen.shownResultId = null;
      GameState.init(difficulty);
      this.showScreen("game");
    },

    continueGame() {
      if (!GameState.loadSaved()) {
        Toast.show(I18n.t("menu.noSave"), "warning");
        this.showScreen("main-menu");
        return;
      }
      GameScreen.selectedCardId = null;
      GameScreen.shownResultId = null;
      this.showScreen("game");
    },
  };

  window.App = App;
  App.init();
})();
