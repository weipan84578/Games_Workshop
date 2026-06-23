(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  const SETTINGS_KEY = "backgammon_settings";
  const SAVE_KEY = "backgammon_save";

  const DEFAULT_SETTINGS = {
    language: "zh-TW",
    theme: "classic",
    bgmVolume: 0.75,
    sfxVolume: 1,
    difficulty: "normal",
    animationSpeed: "normal",
    soundEnabled: true,
  };

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      /* ignore */
    }
  }

  BG.Storage = {
    SETTINGS_KEY,
    SAVE_KEY,
    DEFAULT_SETTINGS,

    loadSettings() {
      const raw = safeGet(SETTINGS_KEY);
      if (!raw) return { ...DEFAULT_SETTINGS };
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      } catch (error) {
        return { ...DEFAULT_SETTINGS };
      }
    },

    saveSettings(settings) {
      return safeSet(SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }));
    },

    resetSettings() {
      safeRemove(SETTINGS_KEY);
      return { ...DEFAULT_SETTINGS };
    },

    saveGame(gameState, settings) {
      if (!gameState) return false;
      const save = {
        version: BG.VERSION,
        timestamp: Date.now(),
        settings: { ...settings },
        gameState: JSON.parse(JSON.stringify(gameState)),
      };
      return safeSet(SAVE_KEY, JSON.stringify(save));
    },

    loadGame() {
      const raw = safeGet(SAVE_KEY);
      if (!raw) return null;
      try {
        const data = JSON.parse(raw);
        if (data.version !== BG.VERSION || !data.gameState || data.gameState.isOver) return null;
        return data;
      } catch (error) {
        return null;
      }
    },

    hasSavedGame() {
      return Boolean(this.loadGame());
    },

    clearGame() {
      safeRemove(SAVE_KEY);
    },
  };
})(window);
