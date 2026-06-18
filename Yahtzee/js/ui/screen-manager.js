window.YZ = window.YZ || {};

YZ.ScreenManager = (function () {
  var current = "menu";
  var screenMap = {
    menu: "screen-menu",
    game: "screen-game",
    instructions: "screen-instructions",
    settings: "screen-settings"
  };

  function init() {
    renderCurrent();
    show("menu", { silent: true });
  }

  function show(name, options) {
    options = options || {};
    if (!screenMap[name]) name = "menu";
    if (current === "game" && name !== "game") {
      YZ.Game.saveIfPlayable();
    }
    current = name;
    Object.keys(screenMap).forEach(function (key) {
      var el = document.getElementById(screenMap[key]);
      if (el) el.classList.toggle("is-active", key === name);
    });
    renderCurrent();
    if (YZ.Audio) {
      if (!options.silent) YZ.Audio.playSfx("transition");
      if (name === "game") {
        var state = YZ.State.get();
        if (state.turn !== "result") YZ.Audio.playBgm("game", { boost: 5, fade: 650 });
      } else {
        YZ.Audio.playBgm("menu", { boost: 1, fade: 500 });
      }
    }
  }

  function renderCurrent() {
    if (current === "menu" && YZ.MainMenu) YZ.MainMenu.render();
    if (current === "game" && YZ.GameUI) YZ.GameUI.render();
    if (current === "instructions" && YZ.InstructionsUI) YZ.InstructionsUI.render();
    if (current === "settings" && YZ.SettingsUI) YZ.SettingsUI.render();
    YZ.I18n.apply();
  }

  function getCurrent() {
    return current;
  }

  return {
    init: init,
    show: show,
    renderCurrent: renderCurrent,
    getCurrent: getCurrent
  };
})();
