(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var C = cg.Constants;
    var Storage = cg.SettingsStorage = {};

    function storage() { try { return window.localStorage; } catch (error) { return null; } }
    function sanitize(raw) {
        var result = Object.assign({}, C.DEFAULT_SETTINGS, raw || {});
        var validThemes = ["default", "ocean", "sunset", "forest", "night", "kawaii"];
        var validQuality = ["auto", "low", "medium", "high"];
        var validDifficulty = ["easy", "normal", "hard"];
        result.locale = ["zh-TW", "en-US", "ja-JP"].indexOf(result.locale) >= 0 ? result.locale : C.DEFAULT_SETTINGS.locale;
        result.theme = validThemes.indexOf(result.theme) >= 0 ? result.theme : C.DEFAULT_SETTINGS.theme;
        result.graphicsQuality = validQuality.indexOf(result.graphicsQuality) >= 0 ? result.graphicsQuality : C.DEFAULT_SETTINGS.graphicsQuality;
        result.difficulty = validDifficulty.indexOf(result.difficulty) >= 0 ? result.difficulty : C.DEFAULT_SETTINGS.difficulty;
        ["masterVolume", "bgmVolume", "sfxVolume"].forEach(function (key) { result[key] = cg.Utils.clamp(Number(result[key]), 0, 1); });
        ["mute", "bgmEnabled", "sfxEnabled", "reducedMotion", "cameraShake", "highContrast"].forEach(function (key) { result[key] = Boolean(result[key]); });
        return result;
    }
    Storage.load = function () {
        var store = storage();
        if (!store) return Object.assign({}, C.DEFAULT_SETTINGS);
        var parsed = cg.Utils.safeJsonParse(store.getItem(C.SETTINGS_KEY));
        return sanitize(parsed);
    };
    Storage.save = function (settings) {
        var clean = sanitize(settings);
        try { var store = storage(); if (store) store.setItem(C.SETTINGS_KEY, JSON.stringify(clean)); } catch (error) { /* local-only storage may be unavailable */ }
        return clean;
    };
    Storage.defaults = function () { return Object.assign({}, C.DEFAULT_SETTINGS); };
    Storage.sanitize = sanitize;
}(window));
