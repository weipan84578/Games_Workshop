(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function percent(value) {
    return `${Math.round(Number(value) * 100)}%`;
  }

  BG.SettingsUI = {
    init() {
      document.querySelectorAll("[data-back]").forEach((button) => {
        button.addEventListener("click", () => BG.App.back());
      });

      document.querySelectorAll("[data-setting]").forEach((button) => {
        button.addEventListener("click", async () => {
          const key = button.dataset.setting;
          const value = button.dataset.value;
          BG.GameState.settings[key] = value;
          if (key === "theme") BG.Theme.apply(value);
          if (key === "language") await BG.I18n.load(value);
          this.sync();
          BG.GameUI.render();
        });
      });

      const bgm = document.getElementById("bgmVolumeInput");
      const sfx = document.getElementById("sfxVolumeInput");
      bgm.addEventListener("input", () => {
        BG.GameState.settings.bgmVolume = Number(bgm.value) / 100;
        BG.AudioEngine.setBgmVolume(BG.GameState.settings.bgmVolume);
        this.syncVolumes();
      });
      sfx.addEventListener("input", () => {
        BG.GameState.settings.sfxVolume = Number(sfx.value) / 100;
        BG.AudioEngine.setSfxVolume(BG.GameState.settings.sfxVolume);
        this.syncVolumes();
      });

      document.getElementById("saveSettingsBtn").addEventListener("click", () => {
        BG.Storage.saveSettings(BG.GameState.settings);
        BG.AudioEngine.playSfx("btn_click");
        if (BG.GameState.game) BG.Storage.saveGame(BG.GameState.game, BG.GameState.settings);
        BG.GameUI.setMessage(BG.I18n.t("settings.saved"));
        BG.MenuUI.refreshContinue();
      });

      document.getElementById("resetSettingsBtn").addEventListener("click", async () => {
        BG.GameState.settings = BG.Storage.resetSettings();
        BG.Theme.apply(BG.GameState.settings.theme);
        await BG.I18n.load(BG.GameState.settings.language);
        BG.AudioEngine.init(BG.GameState.settings);
        this.sync();
        BG.GameUI.render();
      });

      this.sync();
    },

    open() {
      if (BG.GameState.game) BG.Storage.saveGame(BG.GameState.game, BG.GameState.settings);
      this.sync();
      BG.App.showScreen("settings");
    },

    sync() {
      const settings = BG.GameState.settings;
      document.querySelectorAll("[data-setting]").forEach((button) => {
        button.classList.toggle("active", settings[button.dataset.setting] === button.dataset.value);
      });
      this.syncVolumes();
    },

    syncVolumes() {
      const settings = BG.GameState.settings;
      const bgm = document.getElementById("bgmVolumeInput");
      const sfx = document.getElementById("sfxVolumeInput");
      if (!bgm || !sfx) return;
      bgm.value = Math.round(settings.bgmVolume * 100);
      sfx.value = Math.round(settings.sfxVolume * 100);
      document.getElementById("bgmVolumeValue").textContent = percent(settings.bgmVolume);
      document.getElementById("sfxVolumeValue").textContent = percent(settings.sfxVolume);
    },
  };
})(window);
