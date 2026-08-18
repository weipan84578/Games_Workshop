(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function init(api) {
    var start = document.getElementById("menu-start");
    var continueButton = document.getElementById("menu-continue");
    var howTo = document.getElementById("menu-howto");
    var settings = document.getElementById("menu-settings");

    start.addEventListener("click", function () {
      app.AudioManager.unlock();
      app.AudioManager.playSfx("click");
      if (app.SaveManager.hasSave()) {
        api.confirm("confirm_new_body", function () {
          app.SaveManager.clearSave();
          api.showLevels();
        });
      } else {
        api.showLevels();
      }
    });
    continueButton.addEventListener("click", function () {
      if (continueButton.disabled) {
        return;
      }
      app.AudioManager.unlock();
      app.AudioManager.playSfx("click");
      var activeBattle = app.SaveManager.getActiveBattle();
      if (activeBattle) {
        api.startBattle(activeBattle.levelId, activeBattle);
      } else {
        api.showLevels();
      }
    });
    howTo.addEventListener("click", function () {
      app.AudioManager.unlock();
      app.AudioManager.playSfx("click");
      api.showHowTo();
    });
    settings.addEventListener("click", function () {
      app.AudioManager.unlock();
      app.AudioManager.playSfx("click");
      api.showSettings();
    });

    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        app.AudioManager.unlock();
        app.AudioManager.playSfx("click");
        app.i18n.setLanguage(button.getAttribute("data-language"));
      });
    });
    app.events.on("save:settings", update);
    app.events.on("save:complete", update);
    app.events.on("save:cleared", update);
    app.events.on("i18n:change", update);
    update();
  }

  function update() {
    var button = document.getElementById("menu-continue");
    var hint = document.getElementById("continue-hint");
    if (!button || !hint) {
      return;
    }
    var canContinue = app.SaveManager.hasSave();
    button.disabled = !canContinue;
    hint.setAttribute("data-i18n", canContinue ? "menu_continue_ready" : "menu_no_save");
    app.i18n.apply(document);
  }

  app.MainMenu = { init: init, update: update };
})(window);
