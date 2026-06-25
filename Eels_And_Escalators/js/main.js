(function () {
  window.addEventListener("DOMContentLoaded", function () {
    const saveManager = new window.EAE.SaveManager();
    const initialSettings = saveManager.loadSettings();
    const i18n = new window.EAE.I18nManager(initialSettings.locale);
    const screenManager = new window.EAE.ScreenManager();
    const sfx = new window.EAE.SFXEngine();
    const bgm = new window.EAE.BGMEngine();
    const aiEngine = new window.EAE.AIEngine(window.EAE.BoardData);
    const gameEngine = new window.EAE.GameEngine({
      boardData: window.EAE.BoardData,
      saveManager: saveManager
    });
    const boardRenderer = new window.EAE.BoardRenderer(
      document.getElementById("board-container"),
      window.EAE.BoardData
    );
    const pieceAnimator = new window.EAE.PieceAnimator(boardRenderer, sfx);
    const diceAnimator = new window.EAE.DiceAnimator(document.querySelectorAll(".dice"));

    let homeUI;
    let gameUI;
    let settingsUI;
    let audioUnlocked = false;

    function showToast(message) {
      const toast = document.getElementById("toast");
      window.clearTimeout(showToast.timer);
      toast.textContent = message;
      toast.classList.add("is-visible");
      showToast.timer = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 1500);
    }

    function applySettings(settings) {
      document.documentElement.dataset.theme = settings.theme;
      i18n.setLocale(settings.locale);
      sfx.setVolume(settings.sfxVolume);
      sfx.setEnabled(settings.sfxEnabled);
      bgm.setVolume(settings.bgmVolume);
      bgm.setEnabled(settings.bgmEnabled, audioUnlocked);
      if (settingsUI) settingsUI.sync();
      if (gameUI) gameUI.updateUI();
      if (homeUI) homeUI.updateContinue();
    }

    function unlockAmbientAudio() {
      if (audioUnlocked) return;
      audioUnlocked = true;
      sfx.resume();
      bgm.resume();
      applySettings(saveManager.loadSettings());
    }

    function persistSettings(settings) {
      const saved = saveManager.saveSettings(settings);
      applySettings(saved);
      return saved;
    }

    settingsUI = new window.EAE.SettingsUI({
      screenManager: screenManager,
      saveManager: saveManager,
      i18n: i18n,
      sfx: sfx,
      applySettings: function (settings) {
        applySettings(settings);
      },
      showToast: showToast,
      onSaveCleared: function () {
        if (homeUI) homeUI.updateContinue();
      }
    });

    gameUI = new window.EAE.GameUI({
      screenManager: screenManager,
      i18n: i18n,
      saveManager: saveManager,
      engine: gameEngine,
      aiEngine: aiEngine,
      renderer: boardRenderer,
      pieceAnimator: pieceAnimator,
      diceAnimator: diceAnimator,
      sfx: sfx,
      bgm: bgm,
      getSettings: function () {
        return saveManager.loadSettings();
      },
      saveSettings: persistSettings,
      openSettings: function () {
        settingsUI.open("game");
      },
      showToast: showToast,
      onReturnHome: function () {
        if (homeUI) homeUI.updateContinue();
        applySettings(saveManager.loadSettings());
      }
    });

    homeUI = new window.EAE.HomeUI({
      screenManager: screenManager,
      saveManager: saveManager,
      sfx: sfx,
      onStart: function (difficulty) {
        gameUI.startNewGame(difficulty);
      },
      onContinue: function () {
        gameUI.continueGame();
      },
      onHelp: function () {
        screenManager.show("help");
      },
      onSettings: function () {
        settingsUI.open("home");
      },
      onLocale: function (locale) {
        settingsUI.setLocale(locale, true);
      }
    });

    const helpUI = new window.EAE.HelpUI({
      screenManager: screenManager,
      boardData: window.EAE.BoardData,
      sfx: sfx
    });

    document.querySelectorAll(".modal-close").forEach(function (button) {
      button.addEventListener("click", function () {
        sfx.playClick();
        screenManager.hideModal(button.dataset.modalClose);
      });
    });

    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) screenManager.hideModal(modal.id);
      });
    });

    document.addEventListener("keydown", function (event) {
      unlockAmbientAudio();
      if (event.key === "Escape") screenManager.hideAllModals();
    });
    document.addEventListener("pointerdown", unlockAmbientAudio, { once: true });

    settingsUI.init();
    gameUI.init();
    homeUI.init();
    helpUI.init();
    applySettings(initialSettings);
    i18n.applyToDOM();

    window.eelsAndEscalators = {
      saveManager: saveManager,
      gameEngine: gameEngine,
      gameUI: gameUI
    };
  });
})();
