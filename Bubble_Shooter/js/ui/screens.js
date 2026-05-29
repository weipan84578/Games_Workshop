(function (BS) {
  var screens = {};
  var modals = {};
  var activeScreen = "menu";

  BS.UI.Screens = {
    init: function () {
      screens.menu = document.getElementById("screen-menu");
      screens.game = document.getElementById("screen-game");
      screens.instructions = document.getElementById("screen-instructions");
      screens.settings = document.getElementById("screen-settings");
      modals.pause = document.getElementById("modal-pause");
      modals.result = document.getElementById("modal-result");
    },

    show: function (name) {
      Object.keys(screens).forEach(function (key) {
        screens[key].classList.toggle("is-active", key === name);
      });
      activeScreen = name;
    },

    getActive: function () {
      return activeScreen;
    },

    modal: function (name, visible) {
      if (!modals[name]) {
        return;
      }
      modals[name].classList.toggle("is-active", !!visible);
      modals[name].setAttribute("aria-hidden", visible ? "false" : "true");
    }
  };
})(window.BubbleShooter);
