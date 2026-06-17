window.VP = window.VP || {};

VP.SaveManager = (function () {
  var SAVE_KEY = "vp_save";

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function load() {
    var raw = safeGet(SAVE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function serialize(state) {
    var settings = state.settings || {};
    return {
      version: "1.0",
      petName: state.petName,
      speciesId: state.speciesId,
      eggType: state.eggType,
      isRevealed: state.isRevealed,
      isDead: state.isDead,
      stage: state.stage,
      level: state.level,
      exp: state.exp,
      bornAt: state.bornAt,
      totalCare: state.totalCare,
      stats: state.stats,
      isSleeping: state.isSleeping,
      sleepingUntil: state.sleepingUntil,
      lastAction: state.lastAction,
      activity: state.activity,
      theme: settings.theme,
      lang: settings.lang,
      bgmVolume: settings.bgmVolume,
      sfxVolume: settings.sfxVolume,
      reducedMotion: settings.reducedMotion,
      textScale: settings.textScale,
      lastSavedAt: Date.now()
    };
  }

  function save(state) {
    if (!state) {
      return false;
    }
    var payload = serialize(state);
    var ok = safeSet(SAVE_KEY, JSON.stringify(payload));
    if (ok) {
      VP.EventBus.emit("save:updated", payload);
    }
    return ok;
  }

  function hasSave() {
    return !!load();
  }

  function clear() {
    return safeRemove(SAVE_KEY);
  }

  function loadSettings() {
    var save = load() || {};
    var settingsRaw = safeGet("vp_settings");
    var settings = {};
    if (settingsRaw) {
      try {
        settings = JSON.parse(settingsRaw) || {};
      } catch (error) {
        settings = {};
      }
    }
    return {
      lang: safeGet("vp_lang") || settings.lang || save.lang || "zh",
      theme: safeGet("vp_theme") || settings.theme || save.theme || "candy",
      bgmVolume: Number(settings.bgmVolume === undefined ? (save.bgmVolume === undefined ? 0.6 : save.bgmVolume) : settings.bgmVolume),
      sfxVolume: Number(settings.sfxVolume === undefined ? (save.sfxVolume === undefined ? 0.8 : save.sfxVolume) : settings.sfxVolume),
      reducedMotion: Boolean(settings.reducedMotion === undefined ? save.reducedMotion : settings.reducedMotion),
      textScale: Number(settings.textScale || save.textScale || 100)
    };
  }

  function persistSettings(settings) {
    safeSet("vp_lang", settings.lang || "zh");
    safeSet("vp_theme", settings.theme || "candy");
    safeSet("vp_settings", JSON.stringify(settings || {}));
  }

  return {
    load: load,
    save: save,
    hasSave: hasSave,
    clear: clear,
    loadSettings: loadSettings,
    persistSettings: persistSettings
  };
})();
