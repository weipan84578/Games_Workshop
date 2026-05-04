(function () {
  const DEFAULT_SETTINGS = {
    difficulty: 'medium',
    playerColor: 'red',
    musicVolume: 0.45,
    sfxVolume: 0.8,
    musicEnabled: true,
    sfxEnabled: true,
    theme: 'classic'
  };

  const DEFAULT_STATS = {
    playerWins: 0,
    aiWins: 0,
    draws: 0,
    totalGames: 0,
    longestWinStreak: 0,
    currentStreak: 0,
    lastPlayed: null
  };

  function read(key, fallback) {
    try {
      return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}'));
    } catch (_) {
      return Object.assign({}, fallback);
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  window.CheckersStorage = {
    getSettings() {
      return read('checkers_settings', DEFAULT_SETTINGS);
    },
    saveSettings(settings) {
      write('checkers_settings', Object.assign({}, DEFAULT_SETTINGS, settings));
    },
    getStats() {
      return read('checkers_stats', DEFAULT_STATS);
    },
    recordGame(winner) {
      const stats = this.getStats();
      stats.totalGames += 1;
      stats.lastPlayed = new Date().toISOString();
      if (winner === 'player') {
        stats.playerWins += 1;
        stats.currentStreak = Math.max(1, stats.currentStreak + 1);
        stats.longestWinStreak = Math.max(stats.longestWinStreak, stats.currentStreak);
      } else if (winner === 'ai') {
        stats.aiWins += 1;
        stats.currentStreak = 0;
      } else {
        stats.draws += 1;
        stats.currentStreak = 0;
      }
      write('checkers_stats', stats);
      return stats;
    }
  };
})();
