(function (ns) {
  "use strict";

  function applyTheme(theme) {
    ns.Constants.VALID.themes.forEach(function (name) {
      document.body.classList.remove("theme-" + name);
    });
    document.body.classList.add("theme-" + theme);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var settings = ns.SaveManager.loadSettings();
    applyTheme(settings.theme);

    var screen = new ns.ScreenManager();
    var i18n = new ns.I18nManager();
    var audio = new ns.AudioManager();
    i18n.init(settings);
    audio.updateSettings(settings);
    audio.setMode("menu");

    var app = {
      screen: screen,
      i18n: i18n,
      audio: audio,
      hud: null,
      game: null,
      mainMenu: null,
      settingsMenu: null,
      applySettings: function (nextSettings) {
        applyTheme(nextSettings.theme);
        audio.updateSettings(nextSettings);
        if (app.game) {
          app.game.applySettings(nextSettings);
        }
      },
      showMenu: function () {
        audio.setMode("menu");
        screen.hideAllModals();
        if (app.mainMenu) {
          app.mainMenu.refreshContinue();
        }
        screen.show("menu");
      },
      startGame: function (difficulty) {
        screen.hideAllModals();
        screen.show("game");
        app.game.startNew(difficulty);
      },
      continueGame: function () {
        var progress = ns.SaveManager.loadProgress();
        if (!progress) {
          return;
        }
        screen.hideAllModals();
        screen.show("game");
        app.game.continueFrom(progress);
      }
    };

    app.hud = new ns.HudController(i18n);
    app.game = new ns.Game(app);
    app.mainMenu = new ns.MainMenu(app);
    app.settingsMenu = new ns.SettingsMenu(app);

    app.game.init();
    app.mainMenu.init();
    app.settingsMenu.init();
    ns.HowToPlay.init();

    document.addEventListener("pointerdown", function () {
      audio.ensure();
    }, { once: true });

    document.addEventListener("click", function (event) {
      if (event.target.closest("button")) {
        audio.playSfx("button");
      }

      var actionButton = event.target.closest("[data-action]");
      if (!actionButton) {
        return;
      }
      var action = actionButton.getAttribute("data-action");
      if (action === "resume-game") {
        app.game.resume();
      }
      if (action === "restart-game") {
        app.game.restart();
      }
      if (action === "exit-game") {
        app.game.exitToMenu();
      }
      if (action === "play-again") {
        app.game.playAgain();
      }
    });

    window.addEventListener("airhockey:languagechange", function () {
      app.hud.setStatus(app.game.state === "playing" ? "game.playing" : "game.ready");
      app.settingsMenu.refresh();
    });

    if (!ns.SaveManager.hasChosenLanguage()) {
      screen.showModal("language-modal");
    }

    app.showMenu();
    window.AirHockeyApp = app;
  });
})(window.AirHockey = window.AirHockey || {});
