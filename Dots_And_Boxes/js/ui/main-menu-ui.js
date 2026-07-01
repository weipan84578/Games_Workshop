(function (ns) {
  "use strict";

  var selectedSize = 4;
  var selectedDifficulty = "normal";
  var selectedFirst = "player";

  function updateLanguageCode(language) {
    var item = ns.Constants.LANGUAGES.filter(function (entry) {
      return entry.code === language;
    })[0];
    var code = document.getElementById("menu-language-code");
    if (code && item) {
      code.textContent = item.short;
    }
  }

  function updateSoundIcon() {
    var icon = document.getElementById("menu-sound-icon");
    var gameIcon = document.getElementById("game-mute-icon");
    var value = ns.appSettings && ns.appSettings.muted ? "×" : "♪";
    if (icon) {
      icon.textContent = value;
    }
    if (gameIcon) {
      gameIcon.textContent = value;
    }
  }

  ns.MainMenuUI = {
    init: function () {
      var startButton = document.getElementById("start-game-button");
      var continueButton = document.getElementById("continue-game-button");
      var howButton = document.getElementById("how-to-button");
      var settingsButton = document.getElementById("settings-button");
      var languageButton = document.getElementById("menu-language-button");
      var languageMenu = document.getElementById("menu-language-menu");
      var soundButton = document.getElementById("menu-sound-button");

      startButton.addEventListener("click", this.openStartModal);
      continueButton.addEventListener("click", function () {
        ns.GameUI.continueSavedGame();
      });
      howButton.addEventListener("click", function () {
        ns.Router.show("how");
      });
      settingsButton.addEventListener("click", function () {
        ns.Router.show("settings");
      });
      languageButton.addEventListener("click", function () {
        languageMenu.hidden = !languageMenu.hidden;
        languageButton.setAttribute("aria-expanded", String(!languageMenu.hidden));
      });
      languageMenu.addEventListener("click", function (event) {
        var button = event.target.closest("[data-language]");
        if (!button) {
          return;
        }
        ns.appSettings.language = button.dataset.language;
        ns.SaveManager.saveSettings(ns.appSettings);
        ns.I18n.applyLanguage(ns.appSettings.language);
        ns.SettingsUI.sync();
        languageMenu.hidden = true;
        updateLanguageCode(ns.appSettings.language);
      });
      soundButton.addEventListener("click", function () {
        ns.AudioManager.toggleMuted();
        ns.appSettings.muted = ns.AudioManager.settings.muted;
        ns.SaveManager.saveSettings(ns.appSettings);
        updateSoundIcon();
      });

      ns.$$("#size-options button").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedSize = Number(button.dataset.size);
          ns.setPressedGroup(document.getElementById("size-options"), button);
        });
      });
      ns.$$("#difficulty-options button").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedDifficulty = button.dataset.difficulty;
          ns.setPressedGroup(document.getElementById("difficulty-options"), button);
        });
      });
      ns.$$("#first-player-options button").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedFirst = button.dataset.first;
          ns.setPressedGroup(document.getElementById("first-player-options"), button);
        });
      });
      document.getElementById("confirm-start-button").addEventListener("click", function () {
        ns.closeModal("start-modal");
        ns.GameUI.startNewGame({
          size: selectedSize,
          difficulty: selectedDifficulty,
          firstPlayer: selectedFirst
        });
      });

      ns.events.on("languagechange", updateLanguageCode);
      this.refresh();
      updateSoundIcon();
    },

    openStartModal: function () {
      ns.openModal("start-modal");
    },

    refresh: function () {
      var continueButton = document.getElementById("continue-game-button");
      continueButton.hidden = !ns.SaveManager.hasSavedGame();
      updateLanguageCode(ns.appSettings.language);
      updateSoundIcon();
    }
  };
})(window.DAB = window.DAB || {});
