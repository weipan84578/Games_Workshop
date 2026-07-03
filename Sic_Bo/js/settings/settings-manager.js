(function () {
  window.SicBo = window.SicBo || {};

  const defaults = {
    bgmVolume: window.SicBo.AudioManager.BASE_BGM_VOLUME,
    language: "zh-TW",
    sfxVolume: window.SicBo.AudioManager.DEFAULT_SFX_VOLUME,
    theme: "classic-red",
    vibration: true
  };

  function createSettingsManager(deps) {
    const storage = deps.storage;
    const audio = deps.audio;
    const values = Object.assign({}, defaults, storage ? storage.loadSettings() : {});
    const listeners = [];

    function persist() {
      if (storage) storage.saveSettings(values);
      listeners.forEach(function (listener) { listener(Object.assign({}, values)); });
    }

    function applyAll() {
      values.theme = window.SicBo.ThemeManager.apply(values.theme);
      window.SicBo.I18n.setLanguage(values.language);
      if (audio) {
        audio.setBGMVolume(values.bgmVolume);
        audio.setSFXVolume(values.sfxVolume);
      }
    }

    function set(key, value) {
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
      values[key] = value;
      if (key === "language") window.SicBo.I18n.setLanguage(value);
      if (key === "theme") values.theme = window.SicBo.ThemeManager.apply(value);
      if (key === "bgmVolume" && audio) audio.setBGMVolume(value);
      if (key === "sfxVolume" && audio) audio.setSFXVolume(value);
      persist();
    }

    applyAll();

    return {
      defaults: defaults,
      get: function () { return Object.assign({}, values); },
      onChange: function (listener) { listeners.push(listener); },
      set: set
    };
  }

  window.SicBo.SettingsManager = {
    create: createSettingsManager,
    defaults: defaults
  };
})();
