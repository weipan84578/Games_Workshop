(function (global) {
  "use strict";

  const SAVE_KEY = "sudoku_save";
  const SETTINGS_KEY = "sudoku_settings";

  function readJson(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to read localStorage", error);
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Unable to write localStorage", error);
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Unable to remove localStorage item", error);
    }
  }

  global.SudokuStorage = {
    SAVE_KEY,
    SETTINGS_KEY,
    loadGame() {
      return readJson(SAVE_KEY);
    },
    saveGame(data) {
      return writeJson(SAVE_KEY, data);
    },
    clearGame() {
      remove(SAVE_KEY);
    },
    hasGame() {
      return Boolean(readJson(SAVE_KEY));
    },
    loadSettings() {
      return readJson(SETTINGS_KEY);
    },
    saveSettings(data) {
      return writeJson(SETTINGS_KEY, data);
    },
    clearSettings() {
      remove(SETTINGS_KEY);
    },
  };
})(window);
