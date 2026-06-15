/* storage.js — localStorage 存讀檔。對局與設定分開儲存。 */
(function (L) {
  'use strict';

  var cfg = L.config;
  var st = L.storage;

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { window.localStorage.setItem(key, val); return true; } catch (e) { return false; }
  }
  function safeDel(key) {
    try { window.localStorage.removeItem(key); } catch (e) {}
  }

  // ---- 對局存檔 ----
  st.saveGame = function () {
    if (!L.state.game) return;
    safeSet(cfg.SAVE_KEY, JSON.stringify(L.state.game));
  };

  st.hasSave = function () {
    var raw = safeGet(cfg.SAVE_KEY);
    if (!raw) return false;
    try {
      var g = JSON.parse(raw);
      return g && g.winner == null && Array.isArray(g.tokens);
    } catch (e) { return false; }
  };

  st.loadGame = function () {
    var raw = safeGet(cfg.SAVE_KEY);
    if (!raw) return null;
    try {
      var g = JSON.parse(raw);
      L.state.game = g;
      return g;
    } catch (e) { return null; }
  };

  st.clearSave = function () { safeDel(cfg.SAVE_KEY); };

  // ---- 設定存檔 ----
  st.loadSettings = function () {
    var raw = safeGet(cfg.SETTINGS_KEY);
    var s = {};
    if (raw) { try { s = JSON.parse(raw) || {}; } catch (e) { s = {}; } }
    var d = cfg.defaults;
    L.state.settings = {
      theme: s.theme || d.theme,
      language: s.language || d.language,
      bgmVolume: s.bgmVolume != null ? s.bgmVolume : d.bgmVolume,
      sfxVolume: s.sfxVolume != null ? s.sfxVolume : d.sfxVolume,
      muted: s.muted != null ? s.muted : d.muted,
      animSpeed: s.animSpeed != null ? s.animSpeed : d.animSpeed,
      lastDifficulty: s.lastDifficulty || 'normal'
    };
    return L.state.settings;
  };

  st.saveSettings = function () {
    if (!L.state.settings) return;
    safeSet(cfg.SETTINGS_KEY, JSON.stringify(L.state.settings));
  };
})(window.Ludo);
