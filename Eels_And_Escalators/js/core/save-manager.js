(function () {
  window.EAE = window.EAE || {};

  const SAVE_KEYS = {
    SETTINGS: "eae_settings",
    SAVE_GAME: "eae_save",
    STATISTICS: "eae_stats"
  };

  const defaultSettings = {
    locale: "zh-TW",
    theme: "ocean",
    bgmEnabled: true,
    sfxEnabled: true,
    bgmVolume: 0.75,
    sfxVolume: 0.8
  };

  const defaultStatistics = {
    wins: { easy: 0, normal: 0, hard: 0 },
    losses: { easy: 0, normal: 0, hard: 0 },
    totalGames: 0,
    bestRound: null
  };

  class SaveManager {
    get keys() {
      return SAVE_KEYS;
    }

    loadSettings() {
      return Object.assign({}, defaultSettings, this._read(SAVE_KEYS.SETTINGS, {}));
    }

    saveSettings(settings) {
      const next = Object.assign({}, defaultSettings, settings);
      this._write(SAVE_KEYS.SETTINGS, next);
      localStorage.setItem("locale", next.locale);
      return next;
    }

    resetSettings() {
      this.saveSettings(defaultSettings);
      return Object.assign({}, defaultSettings);
    }

    hasSave() {
      return Boolean(this.loadGame());
    }

    loadGame() {
      const save = this._read(SAVE_KEYS.SAVE_GAME, null);
      if (!save || typeof save !== "object") return null;
      if (!Number.isFinite(save.playerPos) || !Number.isFinite(save.aiPos)) return null;
      return save;
    }

    saveGame(game) {
      const snapshot = Object.assign({}, game, { savedAt: Date.now() });
      this._write(SAVE_KEYS.SAVE_GAME, snapshot);
      return snapshot;
    }

    clearSave() {
      localStorage.removeItem(SAVE_KEYS.SAVE_GAME);
    }

    loadStatistics() {
      return Object.assign({}, defaultStatistics, this._read(SAVE_KEYS.STATISTICS, {}));
    }

    recordResult(winner, difficulty, round) {
      const stats = this.loadStatistics();
      const bucket = winner === "player" ? stats.wins : stats.losses;
      bucket[difficulty] = (bucket[difficulty] || 0) + 1;
      stats.totalGames += 1;
      if (winner === "player" && (stats.bestRound === null || round < stats.bestRound)) {
        stats.bestRound = round;
      }
      this._write(SAVE_KEYS.STATISTICS, stats);
      return stats;
    }

    _read(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    _write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // Storage failures should not break a local game turn.
      }
    }
  }

  window.EAE.SaveManager = SaveManager;
  window.EAE.DEFAULT_SETTINGS = defaultSettings;
})();
