(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  const SAVE_KEYS = {
    GAME_SAVE: "bml_save",
    SETTINGS: "bml_settings",
    HIGH_SCORES: "bml_scores",
    ACHIEVEMENTS: "bml_achiev"
  };

  const DEFAULT_SETTINGS = {
    bgmVolume: 80,
    sfxVolume: 90,
    theme: "classic",
    controls: "arrow",
    showJoystick: true,
    vibration: true,
    language: "zh-TW"
  };

  function read(key, fallback) {
    return H.safeJsonParse(localStorage.getItem(key), fallback);
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const SaveManager = {
    keys: SAVE_KEYS,

    getSettings() {
      return Object.assign({}, DEFAULT_SETTINGS, read(SAVE_KEYS.SETTINGS, {}));
    },

    saveSettings(settings) {
      const next = Object.assign({}, DEFAULT_SETTINGS, settings);
      write(SAVE_KEYS.SETTINGS, next);
      return next;
    },

    getGame() {
      const save = read(SAVE_KEYS.GAME_SAVE, null);
      if (!save || save.version !== root.CONFIG.saveVersion) return null;
      return save;
    },

    saveGame(save) {
      const next = Object.assign({}, save, {
        version: root.CONFIG.saveVersion,
        timestamp: Date.now()
      });
      write(SAVE_KEYS.GAME_SAVE, next);
      return next;
    },

    clearGame() {
      localStorage.removeItem(SAVE_KEYS.GAME_SAVE);
    },

    getScores() {
      return Object.assign({
        bestScore: 0,
        bestStage: 0,
        clears: 0,
        bestRank: "C"
      }, read(SAVE_KEYS.HIGH_SCORES, {}));
    },

    saveScore(result) {
      const scores = this.getScores();
      const next = {
        bestScore: Math.max(scores.bestScore || 0, result.score || 0),
        bestStage: Math.max(scores.bestStage || 0, result.stage || 0),
        clears: (scores.clears || 0) + (result.cleared ? 1 : 0),
        bestRank: result.rank || scores.bestRank || "C"
      };
      write(SAVE_KEYS.HIGH_SCORES, next);
      return next;
    }
  };

  root.SaveManager = SaveManager;
}());
