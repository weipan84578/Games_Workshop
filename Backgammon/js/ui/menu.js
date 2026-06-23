(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.MenuUI = {
    init() {
      document.getElementById("startGameBtn").addEventListener("click", () => {
        BG.AudioEngine.unlock(BG.GameState.settings);
        BG.AudioEngine.playSfx("btn_click");
        BG.Modal.chooseDifficulty((difficulty) => BG.GameUI.startNewGame(difficulty));
      });

      document.getElementById("continueGameBtn").addEventListener("click", () => {
        BG.AudioEngine.unlock(BG.GameState.settings);
        BG.AudioEngine.playSfx("btn_click");
        BG.GameUI.continueGame();
      });

      document.getElementById("helpBtn").addEventListener("click", () => {
        BG.AudioEngine.playSfx("btn_click");
        BG.App.showScreen("help");
        BG.HelpUI.render();
      });

      document.getElementById("settingsBtn").addEventListener("click", () => {
        BG.AudioEngine.playSfx("btn_click");
        BG.SettingsUI.open();
      });

      document.querySelectorAll("[data-locale]").forEach((button) => {
        button.addEventListener("click", async () => {
          const locale = button.dataset.locale;
          BG.GameState.settings.language = locale;
          BG.Storage.saveSettings(BG.GameState.settings);
          await BG.I18n.load(locale);
          BG.SettingsUI.sync();
          BG.HelpUI.render();
          this.refreshContinue();
        });
      });

      this.refreshContinue();
    },

    refreshContinue() {
      const control = document.getElementById("continueGameBtn");
      control.disabled = !BG.Storage.hasSavedGame();
    },
  };
})(window);
