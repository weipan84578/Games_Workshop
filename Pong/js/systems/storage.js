(function () {
  const defaultSettings = {
    targetScore: CONSTANTS.DEFAULT_TARGET_SCORE,
    theme: "neon",
    musicVolume: CONSTANTS.DEFAULT_MUSIC_VOLUME,
    sfxVolume: CONSTANTS.DEFAULT_SFX_VOLUME,
    ballSpeed: "normal",
    showFPS: false,
    vibration: true,
    language: "zh-TW"
  };

  function safeParse(raw) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function sanitizeSettings(settings) {
    const merged = Object.assign({}, defaultSettings, settings || {});
    if (!CONSTANTS.TARGET_SCORES.includes(Number(merged.targetScore))) {
      merged.targetScore = defaultSettings.targetScore;
    }
    merged.targetScore = Number(merged.targetScore);
    if (!CONSTANTS.THEMES.some((theme) => theme.id === merged.theme)) {
      merged.theme = defaultSettings.theme;
    }
    if (!CONSTANTS.SPEED_MULTIPLIERS[merged.ballSpeed]) {
      merged.ballSpeed = defaultSettings.ballSpeed;
    }
    if (!Pong.I18n.isSupported(merged.language)) {
      merged.language = defaultSettings.language;
    }
    merged.musicVolume = Pong.Math.clamp(Number(merged.musicVolume), 0, 1);
    merged.sfxVolume = Pong.Math.clamp(Number(merged.sfxVolume), 0, 1);
    merged.showFPS = Boolean(merged.showFPS);
    merged.vibration = Boolean(merged.vibration);
    return merged;
  }

  const Storage = {
    defaults() {
      return Object.assign({}, defaultSettings);
    },

    loadSettings() {
      const settings = sanitizeSettings(safeParse(localStorage.getItem(CONSTANTS.SETTINGS_KEY)));
      Pong.GameState.settings = settings;
      document.documentElement.setAttribute("data-theme", settings.theme);
      Pong.I18n.apply(settings.language);
      return settings;
    },

    saveSettings(settings) {
      const sanitized = sanitizeSettings(settings);
      Pong.GameState.settings = sanitized;
      document.documentElement.setAttribute("data-theme", sanitized.theme);
      Pong.I18n.apply(sanitized.language);
      localStorage.setItem(CONSTANTS.SETTINGS_KEY, JSON.stringify(sanitized));
      Pong.Audio.applySettings();
      return sanitized;
    },

    resetSettings() {
      return Storage.saveSettings(defaultSettings);
    },

    hasSave() {
      const save = Storage.loadSave();
      return Boolean(save);
    },

    loadSave() {
      const save = safeParse(localStorage.getItem(CONSTANTS.SAVE_KEY));
      if (!save || save.version !== CONSTANTS.SAVE_VERSION) {
        return null;
      }
      if (!CONSTANTS.AI[save.difficulty]) {
        return null;
      }
      return save;
    },

    saveGame() {
      const game = Pong.GameState.game;
      if (!game.active || !game.ball || game.winner) {
        return;
      }

      const save = {
        version: CONSTANTS.SAVE_VERSION,
        timestamp: Date.now(),
        difficulty: game.difficulty,
        playerScore: game.playerScore,
        aiScore: game.aiScore,
        targetScore: game.targetScore,
        ballState: {
          x: game.ball.x,
          y: game.ball.y,
          vx: game.ball.vx,
          vy: game.ball.vy
        },
        paddlePlayer: { y: game.player.y },
        paddleAI: { y: game.ai.y }
      };

      localStorage.setItem(CONSTANTS.SAVE_KEY, JSON.stringify(save));
    },

    clearSave() {
      localStorage.removeItem(CONSTANTS.SAVE_KEY);
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Storage = Storage;
})();
