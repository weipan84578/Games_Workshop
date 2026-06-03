/* js/utils/storage.js */
(function() {
  const SAVE_KEY = 'si_save';
  const HIGHSCORE_KEY = 'si_highscore';
  const SETTINGS_KEY = 'si_settings';

  const DEFAULT_SETTINGS = {
    musicVol: 50,
    sfxVol: 50,
    muted: false,
    theme: 'classic-green',
    difficulty: 'normal'
  };

  window.GameStorage = {
    // 1. GAME SAVE METHODS
    saveGame: function(level, score, lives, difficulty) {
      const data = {
        level: level,
        score: score,
        lives: lives,
        difficulty: difficulty,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving game state', e);
      }
    },

    loadGame: function() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Error loading game state', e);
        return null;
      }
    },

    clearGameSave: function() {
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {
        console.error('Error clearing game save', e);
      }
    },

    hasGameSave: function() {
      return localStorage.getItem(SAVE_KEY) !== null;
    },

    // 2. HIGH SCORE METHODS
    getHighScore: function() {
      try {
        const score = localStorage.getItem(HIGHSCORE_KEY);
        return score ? parseInt(score, 10) : 0;
      } catch (e) {
        return 0;
      }
    },

    saveHighScore: function(score) {
      try {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
          localStorage.setItem(HIGHSCORE_KEY, score.toString());
          return true; // New record
        }
      } catch (e) {
        console.error('Error saving high score', e);
      }
      return false;
    },

    resetHighScore: function() {
      try {
        localStorage.setItem(HIGHSCORE_KEY, '0');
      } catch (e) {
        console.error('Error resetting high score', e);
      }
    },

    // 3. SETTINGS METHODS
    getSettings: function() {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        
        const parsed = JSON.parse(raw);
        // Ensure fallback for missing fields
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return { ...DEFAULT_SETTINGS };
      }
    },

    saveSettings: function(settings) {
      try {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving settings', e);
      }
    }
  };
})();
