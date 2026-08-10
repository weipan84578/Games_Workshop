(function (global) {
  "use strict";

  var CCC = global.CCC = global.CCC || {};

  CCC.version = "1.0.0";
  CCC.SAVE_VERSION = 1;
  CCC.config = {
    progressKey: "crispy-cutlet-corner.progress.v1",
    preferencesKey: "crispy-cutlet-corner.preferences.v1",
    maxParticles: 28,
    maxSounds: 6
  };

  CCC.state = {
    screen: "boot",
    previousScreen: null,
    selectedDay: 1,
    progress: null,
    preferences: null,
    session: null,
    storageAvailable: true,
    pausedByLifecycle: false,
    dialogOpen: false,
    orientationTipDismissed: false
  };

  var listeners = {};
  CCC.events = {
    on: function (name, callback) {
      listeners[name] = listeners[name] || [];
      listeners[name].push(callback);
      return function () {
        listeners[name] = (listeners[name] || []).filter(function (item) { return item !== callback; });
      };
    },
    emit: function (name, payload) {
      (listeners[name] || []).slice().forEach(function (callback) {
        try { callback(payload); } catch (error) { setTimeout(function () { throw error; }, 0); }
      });
    }
  };

  CCC.utils = {
    clamp: function (value, min, max) { return Math.min(max, Math.max(min, value)); },
    round: function (value, places) {
      var factor = Math.pow(10, places || 0);
      return Math.round((value + Number.EPSILON) * factor) / factor;
    },
    uid: (function () {
      var value = 0;
      return function (prefix) { value += 1; return (prefix || "id") + "-" + Date.now().toString(36) + "-" + value; };
    }()),
    deepClone: function (value) { return JSON.parse(JSON.stringify(value)); },
    isFiniteNumber: function (value) { return typeof value === "number" && Number.isFinite(value); },
    escapeHtml: function (value) {
      return String(value).replace(/[&<>'"]/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char];
      });
    },
    randomChoice: function (items) { return items[Math.floor(Math.random() * items.length)]; },
    formatTime: function (seconds) {
      var whole = Math.max(0, Math.ceil(seconds));
      var minutes = Math.floor(whole / 60);
      return String(minutes).padStart(2, "0") + ":" + String(whole % 60).padStart(2, "0");
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
