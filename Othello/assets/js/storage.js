// localStorage adapter for settings, saved games, and records.
const StorageManager = {
      settingsKey: 'othello_settings',
      stateKey: 'othello_game_state',
      recordsKey: 'othello_records',
      defaults: {
        musicEnabled: true,
        sfxEnabled: true,
        masterVolume: 0.7,
        musicVolume: 0.4,
        sfxVolume: 0.8,
        aiSpeed: 'normal',
        playerColor: 'black',
        showHints: true,
        difficulty: 'normal'
      },
      settings: {},
      records: {},
      init() {
        this.settings = { ...this.defaults, ...this.read(this.settingsKey, {}) };
        this.records = { wins: 0, losses: 0, draws: 0, totalGames: 0, winStreak: 0, bestStreak: 0, ...this.read(this.recordsKey, {}) };
      },
      read(key, fallback) {
        try {
          return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
          return fallback;
        }
      },
      write(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
          UIManager.toast('儲存失敗，將只保留本次遊戲資料');
        }
      },
      saveSettings() { this.write(this.settingsKey, this.settings); },
      saveState(state) { this.write(this.stateKey, { ...state, savedAt: Date.now() }); },
      loadState() { return this.read(this.stateKey, null); },
      clearState() { localStorage.removeItem(this.stateKey); },
      saveRecords() { this.write(this.recordsKey, this.records); },
      resetRecords() {
        this.records = { wins: 0, losses: 0, draws: 0, totalGames: 0, winStreak: 0, bestStreak: 0 };
        this.saveRecords();
      }
    };
