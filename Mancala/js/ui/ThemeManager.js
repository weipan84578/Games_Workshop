(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function ThemeManager(root) {
    this.root = root || document.documentElement;
  }

  ThemeManager.prototype.apply = function(themeId) {
    this.root.setAttribute("data-theme", themeId || "classic");
    dispatch("mancala:themeChange", { theme: themeId || "classic" });
  };

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  Mancala.ThemeManager = ThemeManager;
})(window);
