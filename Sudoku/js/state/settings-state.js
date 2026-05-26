(function (global) {
  "use strict";

  const DEFAULT_SETTINGS = {
    theme: "classic",
    bgmVolume: 50,
    sfxVolume: 80,
    bgmEnabled: true,
    sfxEnabled: true,
    errorLimit: 3,
    showTimer: true,
    autoHighlight: true,
    validateOnInput: true,
  };

  let settings = { ...DEFAULT_SETTINGS };

  function emit(key, value) {
    document.dispatchEvent(new CustomEvent("sudoku:settingsChange", {
      detail: { key, value, settings: { ...settings } },
    }));
  }

  function normalize(next) {
    const merged = { ...DEFAULT_SETTINGS, ...(next || {}) };
    if (merged.errorLimit !== "none") {
      merged.errorLimit = Number(merged.errorLimit) || DEFAULT_SETTINGS.errorLimit;
    }
    merged.bgmVolume = Math.max(0, Math.min(100, Number(merged.bgmVolume)));
    merged.sfxVolume = Math.max(0, Math.min(100, Number(merged.sfxVolume)));
    return merged;
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", getThemeColor(settings.theme));
    document.dispatchEvent(new CustomEvent("sudoku:themeChange", {
      detail: { theme: settings.theme },
    }));
  }

  function getThemeColor(theme) {
    const colors = {
      classic: "#1565c0",
      dark: "#64b5f6",
      ocean: "#00838f",
      forest: "#388e3c",
      sakura: "#c2185b",
      galaxy: "#ab47bc",
    };
    return colors[theme] || colors.classic;
  }

  function save() {
    global.SudokuStorage.saveSettings(settings);
  }

  global.SettingsState = {
    DEFAULT_SETTINGS,
    init() {
      settings = normalize(global.SudokuStorage.loadSettings());
      applyTheme();
      save();
    },
    get() {
      return { ...settings };
    },
    set(key, value) {
      if (!(key in DEFAULT_SETTINGS)) {
        return;
      }

      settings = normalize({ ...settings, [key]: value });
      if (key === "theme") {
        applyTheme();
      }
      save();
      emit(key, settings[key]);
    },
    reset() {
      settings = { ...DEFAULT_SETTINGS };
      save();
      applyTheme();
      emit("reset", null);
    },
  };
})(window);
