(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var U = cg.Utils = {};
    U.clamp = function (value, min, max) { return Math.min(max, Math.max(min, value)); };
    U.lerp = function (a, b, t) { return a + (b - a) * t; };
    U.inverseLerp = function (a, b, value) { return a === b ? 0 : (value - a) / (b - a); };
    U.rand = function (min, max) { return min + Math.random() * (max - min); };
    U.randInt = function (min, max) { return Math.floor(U.rand(min, max + 1)); };
    U.choose = function (values) { return values[Math.floor(Math.random() * values.length)]; };
    U.distance = function (a, b) { return Math.hypot(b.x - a.x, b.y - a.y); };
    U.normalize = function (x, y) {
        var length = Math.hypot(x, y) || 1;
        return { x: x / length, y: y / length };
    };
    U.rectContains = function (rect, x, y) { return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h; };
    U.formatNumber = function (value) {
        try { return Math.round(value).toLocaleString(root.GameState && root.GameState.locale || "zh-TW"); } catch (error) { return String(Math.round(value)); }
    };
    U.formatPercent = function (value) { return Math.round(U.clamp(value, 0, 1) * 100) + "%"; };
    U.formatTime = function (seconds) {
        var total = Math.max(0, Math.floor(seconds));
        var minutes = Math.floor(total / 60);
        var secs = total % 60;
        return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    };
    U.uid = function (prefix) { return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); };
    U.isTouchDevice = function () { return window.matchMedia && window.matchMedia("(pointer: coarse)").matches; };
    U.prefersReducedMotion = function () { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
    U.getDpr = function () { return Math.min(window.devicePixelRatio || 1, cg.Constants.MAX_DPR); };
    U.getQuality = function () {
        var setting = root.GameState && root.GameState.settings && root.GameState.settings.graphicsQuality;
        if (setting && setting !== "auto") return setting;
        if (U.isTouchDevice()) return "medium";
        return "high";
    };
    U.safeJsonParse = function (value) { try { return JSON.parse(value); } catch (error) { return null; } };
    U.segmentLength = function (x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); };
    U.round = function (value, digits) { var power = Math.pow(10, digits || 0); return Math.round(value * power) / power; };
}(window));
