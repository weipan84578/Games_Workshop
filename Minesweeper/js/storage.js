const STORAGE_KEYS = {
    BEST: 'ms_best_v2',
    SETTINGS: 'ms_settings_v2',
    HISTORY: 'ms_history_v2'
};

const DEFAULT_SETTINGS = {
    difficulty: 'medium',
    customRows: 10,
    customCols: 10,
    customMines: 15,
    questionMarkEnabled: true,
    soundEnabled: true,
    darkMode: false
};

window.Storage = {
    saveBestTime(difficulty, time) {
        const best = this.getBestTimes();
        const currentBest = best[difficulty];
        
        // 嚴格判斷：0 秒也是一個有效的成績
        if (currentBest === null || currentBest === undefined || time <= currentBest) {
            best[difficulty] = time;
            localStorage.setItem(STORAGE_KEYS.BEST, JSON.stringify(best));
            return true;
        }
        return false;
    },

    getBestTimes() {
        const data = localStorage.getItem(STORAGE_KEYS.BEST);
        const defaults = { easy: null, medium: null, expert: null, custom: null };
        if (!data) return defaults;
        try {
            const parsed = JSON.parse(data);
            return { ...defaults, ...parsed };
        } catch (e) {
            return defaults;
        }
    },

    saveGameRecord(difficulty, time, isWin) {
        const history = this.getHistory();
        history.unshift({
            id: Date.now(),
            difficulty,
            time,
            isWin,
            date: new Date().toLocaleString()
        });
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
    },

    getHistory() {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    saveSettings(settings) {
        const current = this.getSettings();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
    },

    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...settings };
    },

    clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.BEST);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
    }
};