(function () {
  window.SicBo = window.SicBo || {};

  document.addEventListener("DOMContentLoaded", function () {
    const storage = window.SicBo.SaveManager;
    const audio = window.SicBo.AudioManager.create();
    const modals = window.SicBo.ModalController.create();
    const settings = window.SicBo.SettingsManager.create({ audio: audio, storage: storage });
    let gameApi = null;
    let menu = null;

    const renderer = window.SicBo.BoardRenderer.create({
      onBetClick: function (id) { gameApi.placeBet(id); },
      onChipSelect: function (value) {
        audio.playSFX("button");
        gameApi.selectChip(value);
      }
    });

    gameApi = window.SicBo.GameEngine.create({
      audio: audio,
      modals: modals,
      renderer: renderer,
      settings: settings,
      storage: storage
    });

    function syncSettingsUI() {
      const value = settings.get();
      const bgmInput = document.getElementById("bgmVolumeInput");
      const sfxInput = document.getElementById("sfxVolumeInput");
      const languageSelect = document.getElementById("languageSelect");
      const vibrationInput = document.getElementById("vibrationInput");
      bgmInput.value = Math.round(value.bgmVolume * 100);
      sfxInput.value = Math.round(value.sfxVolume * 100);
      document.getElementById("bgmVolumeValue").textContent = bgmInput.value + "%";
      document.getElementById("sfxVolumeValue").textContent = sfxInput.value + "%";
      languageSelect.value = value.language;
      vibrationInput.checked = Boolean(value.vibration);
      document.querySelectorAll(".theme-swatch").forEach(function (button) {
        button.classList.toggle("is-active", button.dataset.theme === value.theme);
      });
    }

    menu = window.SicBo.MenuController.create({
      audio: audio,
      game: gameApi,
      modals: modals,
      settings: settings,
      storage: storage,
      syncSettingsUI: syncSettingsUI
    });

    modals.setResultMenuHandler(function () {
      menu.showMenu();
    });

    function renderThemeSwatches() {
      const root = document.getElementById("themeSwatches");
      root.textContent = "";
      window.SicBo.ThemeManager.themes.forEach(function (theme) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "theme-swatch";
        button.dataset.theme = theme.id;
        button.style.background = theme.swatch;
        button.setAttribute("aria-label", theme.id);
        button.addEventListener("click", function () {
          settings.set("theme", theme.id);
          audio.playSFX("button");
          renderer.render(gameApi);
          syncSettingsUI();
        });
        root.appendChild(button);
      });
    }

    function bindSettingsControls() {
      const bgmInput = document.getElementById("bgmVolumeInput");
      const sfxInput = document.getElementById("sfxVolumeInput");
      const languageSelect = document.getElementById("languageSelect");
      const vibrationInput = document.getElementById("vibrationInput");
      let lastSfxPreview = 0;

      bgmInput.addEventListener("input", function () {
        const next = Number(bgmInput.value) / 100;
        document.getElementById("bgmVolumeValue").textContent = bgmInput.value + "%";
        settings.set("bgmVolume", next);
        audio.playBGM();
      });

      sfxInput.addEventListener("input", function () {
        const next = Number(sfxInput.value) / 100;
        document.getElementById("sfxVolumeValue").textContent = sfxInput.value + "%";
        settings.set("sfxVolume", next);
        const now = Date.now();
        if (now - lastSfxPreview > 180) {
          audio.playSFX("button");
          lastSfxPreview = now;
        }
      });

      languageSelect.addEventListener("change", function () {
        settings.set("language", languageSelect.value);
        audio.playSFX("button");
        renderer.render(gameApi);
        menu.updateContinue();
        syncSettingsUI();
      });

      vibrationInput.addEventListener("change", function () {
        settings.set("vibration", vibrationInput.checked);
        audio.playSFX("button");
      });

      document.getElementById("clearSaveButton").addEventListener("click", function () {
        if (!window.confirm(window.SicBo.I18n.t("game.clearSaveConfirm"))) return;
        storage.clearSave();
        modals.toast(window.SicBo.I18n.t("game.saveCleared"), "success");
        menu.updateContinue();
      });
    }

    function bindGameActions() {
      document.getElementById("repeatBetButton").addEventListener("click", gameApi.repeatBets);
      document.getElementById("undoBetButton").addEventListener("click", gameApi.undoBet);
      document.getElementById("clearBetButton").addEventListener("click", gameApi.clearBets);
      document.getElementById("confirmBetButton").addEventListener("click", gameApi.confirmBets);
      document.getElementById("rollButton").addEventListener("click", gameApi.rollRound);
    }

    window.SicBo.I18n.onChange(function () {
      renderer.render(gameApi);
      menu.updateContinue();
      syncSettingsUI();
    });

    renderThemeSwatches();
    bindSettingsControls();
    bindGameActions();
    window.SicBo.I18n.apply(document);
    syncSettingsUI();
    gameApi.render();
    menu.updateContinue();
  });
})();
