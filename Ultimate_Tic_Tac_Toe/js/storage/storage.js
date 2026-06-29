(function () {
  "use strict";

  var STORAGE_KEYS = {
    SETTINGS: "utttt_settings",
    SAVE: "utttt_save",
    STATS: "utttt_stats"
  };

  var memoryStore = {};
  var localStorageAvailable = true;

  try {
    window.localStorage.setItem("__utttt_test__", "1");
    window.localStorage.removeItem("__utttt_test__");
  } catch (error) {
    localStorageAvailable = false;
    console.warn("LocalStorage unavailable; using memory store.");
  }

  function getItem(key) {
    return localStorageAvailable ? window.localStorage.getItem(key) : memoryStore[key] || null;
  }

  function setItem(key, value) {
    if (localStorageAvailable) window.localStorage.setItem(key, value);
    else memoryStore[key] = value;
  }

  function removeItem(key) {
    if (localStorageAvailable) window.localStorage.removeItem(key);
    else delete memoryStore[key];
  }

  function loadJson(key, fallback) {
    try {
      var raw = getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      removeItem(key);
      return fallback;
    }
  }

  function saveSettings(settings) {
    setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  function loadSettings() {
    var saved = loadJson(STORAGE_KEYS.SETTINGS, {});
    return Object.assign({}, window.AppDefaults.settings, saved || {});
  }

  function saveGame(state) {
    if (!state || state.phase !== "playing") return;
    setItem(STORAGE_KEYS.SAVE, JSON.stringify(window.GameState.toSave(state)));
  }

  function loadGame() {
    try {
      var save = loadJson(STORAGE_KEYS.SAVE, null);
      if (!save) return null;
      if (save.version !== "1.0") throw new Error("Version mismatch");
      return save;
    } catch (error) {
      console.error("Save load failed; clearing save.", error);
      clearSave();
      return null;
    }
  }

  function hasSave() {
    return !!loadGame();
  }

  function clearSave() {
    removeItem(STORAGE_KEYS.SAVE);
  }

  function loadStats() {
    return Object.assign({
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      bestMoves: null
    }, loadJson(STORAGE_KEYS.STATS, {}) || {});
  }

  function saveStats(stats) {
    setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }

  function clearAll() {
    removeItem(STORAGE_KEYS.SETTINGS);
    removeItem(STORAGE_KEYS.SAVE);
    removeItem(STORAGE_KEYS.STATS);
  }

  window.StorageManager = {
    keys: STORAGE_KEYS,
    saveSettings: saveSettings,
    loadSettings: loadSettings,
    saveGame: saveGame,
    loadGame: loadGame,
    hasSave: hasSave,
    clearSave: clearSave,
    saveStats: saveStats,
    loadStats: loadStats,
    clearAll: clearAll
  };
})();
