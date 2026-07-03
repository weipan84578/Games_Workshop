(function () {
  window.SicBo = window.SicBo || {};

  const themes = [
    { id: "classic-red", swatch: "#c0392b" },
    { id: "emerald", swatch: "#0f7b61" },
    { id: "royal-blue", swatch: "#315bb8" },
    { id: "midnight", swatch: "#2f3440" },
    { id: "sakura", swatch: "#c75578" }
  ];

  function applyTheme(id) {
    const theme = themes.some(function (item) { return item.id === id; }) ? id : themes[0].id;
    document.documentElement.dataset.theme = theme;
    return theme;
  }

  window.SicBo.ThemeManager = {
    apply: applyTheme,
    themes: themes
  };
})();
