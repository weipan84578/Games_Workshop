(function () {
  const Themes = {
    apply(theme) {
      const nextTheme = UNO_CONSTANTS.THEME_META[theme] ? theme : "classic";
      document.documentElement.dataset.theme = nextTheme;
      const color = getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim();
      Helpers.qs('meta[name="theme-color"]')?.setAttribute("content", color || "#1a1a2e");
      return nextTheme;
    },

    set(theme) {
      const applied = this.apply(theme);
      UnoStorage.saveSettings({ theme: applied });
      Helpers.emit("uno:theme-changed", { theme: applied });
    },

    getMeta(theme) {
      return UNO_CONSTANTS.THEME_META[theme] || UNO_CONSTANTS.THEME_META.classic;
    },
  };

  window.Themes = Themes;
})();
