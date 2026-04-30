(function(ER) {
    var KEY = 'endless_runner_data';
    var defaults = {
        bestScore: 0,
        settings: { volMaster: 1.0, volBGM: 0.7, volSFX: 0.9, quality: 'high', vibration: true, speedPreset: 'normal' },
        totalPlayCount: 0,
        totalDistance: 0
    };

    ER.Storage = {
        load: function() {
            try {
                var raw = localStorage.getItem(KEY);
                if (raw) {
                    var d = JSON.parse(raw);
                    return { bestScore: d.bestScore || 0,
                        settings: Object.assign({}, defaults.settings, d.settings || {}),
                        totalPlayCount: d.totalPlayCount || 0,
                        totalDistance: d.totalDistance || 0 };
                }
            } catch(e) {}
            return JSON.parse(JSON.stringify(defaults));
        },
        save: function(data) {
            try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e) {}
        }
    };
})(window.ER = window.ER || {});
