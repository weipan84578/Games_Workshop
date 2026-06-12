(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  const PREFIX = "centipede.";

  const defaults = {
    musicVol: 60,
    sfxVol: 90,
    theme: "neon",
    fontSize: "normal",
    shake: true,
    controlSide: "right",
    language: "zh-Hant"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (error) {
      return false;
    }
  }

  Game.Storage = {
    defaults,

    loadSettings() {
      return Object.assign({}, defaults, read("settings", {}));
    },

    saveSettings(settings) {
      return write("settings", Object.assign({}, defaults, settings));
    },

    loadHighScore() {
      const value = Number(read("highscore", 0));
      return Number.isFinite(value) ? value : 0;
    },

    saveHighScore(score) {
      return write("highscore", Math.max(0, Math.floor(score)));
    },

    loadSave() {
      const save = read("save", null);
      if (!save || !Number.isFinite(save.level) || !Number.isFinite(save.score) || !Array.isArray(save.mushrooms)) {
        return null;
      }
      return save;
    },

    saveGame(save) {
      return write("save", Object.assign({ timestamp: Date.now() }, save));
    },

    clearSave() {
      return remove("save");
    }
  };
})(window);
