(function () {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  Game.Screens = {
    show: function (screenId) {
      document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.toggle("active", screen.id === screenId);
      });
    },

    showModal: function (id) {
      byId(id).classList.remove("hidden");
    },

    hideModal: function (id) {
      byId(id).classList.add("hidden");
    },

    hideAllModals: function () {
      document.querySelectorAll(".modal").forEach(function (modal) {
        modal.classList.add("hidden");
      });
    }
  };

  Game.Menu = {
    returnTarget: "menu",

    init: function (app) {
      byId("btn-new-game").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.newGame();
      });

      byId("btn-continue").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.continueGame();
      });

      byId("btn-help").addEventListener("click", function () {
        Game.Sfx.play("ui");
        Game.Menu.returnTarget = "menu";
        Game.Screens.show("screen-help");
        Game.State.set(Game.Constants.STATES.HELP);
      });

      byId("btn-settings").addEventListener("click", function () {
        Game.Sfx.play("ui");
        Game.Menu.returnTarget = "menu";
        Game.Screens.show("screen-settings");
        Game.State.set(Game.Constants.STATES.SETTINGS);
      });

      document.querySelectorAll("[data-back-menu]").forEach(function (button) {
        button.addEventListener("click", function () {
          Game.Sfx.play("ui");
          if (Game.Menu.returnTarget === "pause") {
            Game.Screens.show("screen-game");
            Game.Screens.showModal("modal-pause");
            Game.State.set(Game.Constants.STATES.PAUSED);
          } else {
            app.showMenu();
          }
        });
      });

      byId("btn-hud-pause").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.pause();
      });

      byId("btn-hud-mute").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.toggleMute();
      });

      byId("btn-resume").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.resume();
      });

      byId("btn-restart").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.newGame();
      });

      byId("btn-pause-settings").addEventListener("click", function () {
        Game.Sfx.play("ui");
        Game.Menu.returnTarget = "pause";
        Game.Screens.hideModal("modal-pause");
        Game.Screens.show("screen-settings");
        Game.State.set(Game.Constants.STATES.SETTINGS);
      });

      byId("btn-menu-from-pause").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.showMenu();
      });

      byId("btn-play-again").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.newGame();
      });

      byId("btn-menu-from-gameover").addEventListener("click", function () {
        Game.Sfx.play("ui");
        app.showMenu();
      });

      Game.Menu.refresh();
    },

    refresh: function () {
      var save = Game.Storage.loadSave();
      var continueButton = byId("btn-continue");
      continueButton.disabled = !save;
      byId("menu-highscore").textContent = Game.Utils.formatScore(Game.Storage.getHighscore());
    }
  };
}());
