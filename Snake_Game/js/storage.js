// storage.js
const Storage = {
    KEYS: {
        SETTINGS: 'snake_settings',
        SCORES: 'snake_scores',
        BEST: 'snake_best'
    },

    getSettings() {
        const defaults = {
            sound: true,
            music: true,
            grid: true,
            borderMode: 'wall', // 'wall' or 'wrap'
            theme: 'dark',
            mobileControl: 'swipe'
        };
        const saved = localStorage.getItem(this.KEYS.SETTINGS);
        return saved ? JSON.parse(saved) : defaults;
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    getBestScore(mode = 'classic') {
        const best = localStorage.getItem(this.KEYS.BEST);
        const data = best ? JSON.parse(best) : {};
        return data[mode] || 0;
    },

    saveBestScore(mode, score) {
        const best = localStorage.getItem(this.KEYS.BEST);
        const data = best ? JSON.parse(best) : {};
        if (score > (data[mode] || 0)) {
            data[mode] = score;
            localStorage.setItem(this.KEYS.BEST, JSON.stringify(data));
            return true; // New record
        }
        return false;
    },

    getLeaderboard(mode = 'classic') {
        const scores = localStorage.getItem(this.KEYS.SCORES);
        const data = scores ? JSON.parse(scores) : {};
        return data[mode] || [];
    },

    saveScore(mode, entry) {
        const scores = localStorage.getItem(this.KEYS.SCORES);
        const data = scores ? JSON.parse(scores) : {};
        if (!data[mode]) data[mode] = [];
        
        data[mode].push(entry);
        // 只保留前 10 名
        data[mode].sort((a, b) => b.score - a.score);
        data[mode] = data[mode].slice(0, 10);
        
        localStorage.setItem(this.KEYS.SCORES, JSON.stringify(data));
    }
};
