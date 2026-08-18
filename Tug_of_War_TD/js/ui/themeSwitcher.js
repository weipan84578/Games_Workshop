(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var themeNames = ["cute-pink", "ocean", "forest", "sunset", "night"];

  function setTheme(theme, persist) {
    var selected = themeNames.indexOf(theme) >= 0 ? theme : app.Config.defaultTheme;
    themeNames.forEach(function (name) {
      document.body.classList.remove("theme-" + name);
    });
    document.body.classList.add("theme-" + selected);
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-theme-choice") === selected);
    });
    if (persist !== false) {
      app.SaveManager.saveSettings({ theme: selected });
    }
    app.events.emit("theme:change", selected);
    return selected;
  }

  function init() {
    setTheme(app.SaveManager.getSettings().theme || app.Config.defaultTheme, false);
  }

  app.ThemeSwitcher = { init: init, setTheme: setTheme, getThemes: function () { return themeNames.slice(); } };
})(window);
