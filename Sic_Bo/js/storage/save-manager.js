(function () {
  window.SicBo = window.SicBo || {};

  const KEY = "sicbo.save.v1";
  const settingKeys = ["language", "theme", "bgmVolume", "sfxVolume", "vibration"];

  function readRaw() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("SicBo save read failed.", error);
      return null;
    }
  }

  function writeRaw(data) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn("SicBo save write failed.", error);
      return false;
    }
  }

  function loadSettings() {
    const raw = readRaw() || {};
    return settingKeys.reduce(function (settings, key) {
      if (Object.prototype.hasOwnProperty.call(raw, key)) settings[key] = raw[key];
      return settings;
    }, {});
  }

  function hasPlayableSave() {
    const raw = readRaw();
    return Boolean(raw && typeof raw.balance === "number" && Array.isArray(raw.roundHistory) && Array.isArray(raw.lastBets));
  }

  function saveSettings(settings) {
    const current = readRaw() || {};
    settingKeys.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) current[key] = settings[key];
    });
    current.lastSavedAt = new Date().toISOString();
    writeRaw(current);
  }

  function saveGame(payload) {
    const currentSettings = loadSettings();
    const data = Object.assign({}, currentSettings, payload);
    data.lastSavedAt = payload.lastSavedAt || new Date().toISOString();
    writeRaw(data);
  }

  function clearSave() {
    try {
      window.localStorage.removeItem(KEY);
      return true;
    } catch (error) {
      console.warn("SicBo save clear failed.", error);
      return false;
    }
  }

  window.SicBo.SaveManager = {
    KEY: KEY,
    clearSave: clearSave,
    hasPlayableSave: hasPlayableSave,
    loadGame: readRaw,
    loadSettings: loadSettings,
    saveGame: saveGame,
    saveSettings: saveSettings
  };
})();
