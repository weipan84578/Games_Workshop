(function () {
  window.SicBo = window.SicBo || {};

  function createMenuController(deps) {
    const menuScreen = document.getElementById("menuScreen");
    const gameScreen = document.getElementById("gameScreen");
    const continueButton = document.getElementById("continueGameButton");

    function updateContinue() {
      continueButton.disabled = !deps.storage.hasPlayableSave();
    }

    function showMenu() {
      gameScreen.hidden = true;
      menuScreen.hidden = false;
      menuScreen.classList.add("screen-active");
      gameScreen.classList.remove("screen-active");
      deps.audio.setMode("menu");
      updateContinue();
    }

    function showGame() {
      menuScreen.hidden = true;
      gameScreen.hidden = false;
      gameScreen.classList.add("screen-active");
      menuScreen.classList.remove("screen-active");
      deps.audio.setMode("game");
      deps.game.render();
    }

    document.getElementById("startGameButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      if (deps.storage.hasPlayableSave() && !window.confirm(window.SicBo.I18n.t("game.newGameConfirm"))) {
        return;
      }
      deps.game.startNewGame();
      showGame();
    });

    continueButton.addEventListener("click", function () {
      const saved = deps.storage.loadGame();
      if (!saved || !deps.storage.hasPlayableSave()) return;
      deps.audio.ensureContext();
      deps.audio.playBGM();
      ["language", "theme", "bgmVolume", "sfxVolume", "vibration"].forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(saved, key)) deps.settings.set(key, saved[key]);
      });
      deps.game.loadGame(saved);
      showGame();
    });

    document.getElementById("helpButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      deps.audio.playSFX("page");
      deps.modals.openHelp();
    });

    document.getElementById("settingsButton").addEventListener("click", function () {
      deps.audio.ensureContext();
      deps.audio.playBGM();
      deps.audio.playSFX("page");
      deps.syncSettingsUI();
      deps.modals.openSettings();
    });

    document.getElementById("backToMenuButton").addEventListener("click", function () {
      deps.audio.playSFX("page");
      showMenu();
    });

    document.querySelectorAll(".language-option").forEach(function (button) {
      button.addEventListener("click", function () {
        deps.settings.set("language", button.dataset.language);
        deps.audio.ensureContext();
        deps.audio.playBGM();
        deps.audio.playSFX("button");
        deps.game.render();
        updateContinue();
      });
    });

    updateContinue();

    return {
      showGame: showGame,
      showMenu: showMenu,
      updateContinue: updateContinue
    };
  }

  window.SicBo.MenuController = {
    create: createMenuController
  };
})();
