(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var GS = NMM.GameState;
  var C = NMM.Constants;
  var SAVE_KEY = "nmm_save_game";
  var SETTINGS_KEY = "nmm_settings";
  var FIRST_KEY = "nmm_first_launch";

  function safeGet(key) {
    try {
      return global.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      global.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function defaultSettings() {
    return {
      language: NMM.I18n ? NMM.I18n.detectLanguage() : "zh",
      theme: "classic",
      difficulty: "normal",
      musicEnabled: true,
      sfxEnabled: true,
      volume: 0.55
    };
  }

  function loadSettings() {
    var settings = defaultSettings();
    var raw = safeGet(SETTINGS_KEY);
    if (!raw) {
      return settings;
    }
    try {
      var parsed = JSON.parse(raw);
      settings.language = C.LANGUAGES.indexOf(parsed.language) >= 0 ? parsed.language : settings.language;
      settings.theme = C.THEMES.indexOf(parsed.theme) >= 0 ? parsed.theme : settings.theme;
      settings.difficulty = C.DIFFICULTIES.indexOf(parsed.difficulty) >= 0 ? parsed.difficulty : settings.difficulty;
      settings.musicEnabled = typeof parsed.musicEnabled === "boolean" ? parsed.musicEnabled : settings.musicEnabled;
      settings.sfxEnabled = typeof parsed.sfxEnabled === "boolean" ? parsed.sfxEnabled : settings.sfxEnabled;
      settings.volume = Math.max(0, Math.min(1, Number(parsed.volume)));
      if (!Number.isFinite(settings.volume)) {
        settings.volume = 0.55;
      }
    } catch (error) {
      safeRemove(SETTINGS_KEY);
    }
    return settings;
  }

  function saveSettings(settings) {
    return safeSet(SETTINGS_KEY, JSON.stringify(settings));
  }

  function saveGame(state) {
    if (!state || state.gameOver) {
      clearGame();
      return true;
    }
    state.timestamp = Date.now();
    return safeSet(SAVE_KEY, JSON.stringify(state));
  }

  function loadGame() {
    var raw = safeGet(SAVE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return GS.normalize(JSON.parse(raw));
    } catch (error) {
      safeRemove(SAVE_KEY);
      return null;
    }
  }

  function hasGame() {
    var state = loadGame();
    return Boolean(state && !state.gameOver);
  }

  function clearGame() {
    return safeRemove(SAVE_KEY);
  }

  function markLaunched() {
    safeSet(FIRST_KEY, "false");
  }

  NMM.SaveManager = {
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    saveGame: saveGame,
    loadGame: loadGame,
    hasGame: hasGame,
    clearGame: clearGame,
    markLaunched: markLaunched
  };
})(window);
