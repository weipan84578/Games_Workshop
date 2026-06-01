(function () {
  const SETTINGS_KEY = "crossword_settings";
  const SAVE_KEY = "crossword_save";

  const defaults = {
    theme: "ocean",
    bgmVolume: 0.7,
    sfxVolume: 0.8,
    showTimer: true,
    showErrors: true,
    fontSize: "normal",
    language: "zh-TW",
  };

  let pendingGameSave = null;
  let saveHandle = null;
  let saveHandleType = "";

  function read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Unable to read ${key}`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Unable to write ${key}`, error);
      return false;
    }
  }

  function loadSettings() {
    return { ...defaults, ...read(SETTINGS_KEY, {}) };
  }

  function saveSettings(settings) {
    return write(SETTINGS_KEY, { ...defaults, ...settings });
  }

  function loadGame() {
    return read(SAVE_KEY, null);
  }

  function saveGame(save) {
    pendingGameSave = {
      ...save,
      savedAt: new Date().toISOString(),
    };
    scheduleGameSave();
    return true;
  }

  function clearGame() {
    cancelScheduledGameSave();
    pendingGameSave = null;
    localStorage.removeItem(SAVE_KEY);
  }

  function scheduleGameSave() {
    if (saveHandle) {
      return;
    }
    const flush = () => {
      saveHandle = null;
      saveHandleType = "";
      flushGameSave();
    };
    if (typeof window.requestIdleCallback === "function") {
      saveHandleType = "idle";
      saveHandle = window.requestIdleCallback(flush, { timeout: 900 });
    } else {
      saveHandleType = "timeout";
      saveHandle = window.setTimeout(flush, 120);
    }
  }

  function cancelScheduledGameSave() {
    if (!saveHandle) {
      return;
    }
    if (saveHandleType === "idle" && typeof window.cancelIdleCallback === "function") {
      window.cancelIdleCallback(saveHandle);
    } else {
      window.clearTimeout(saveHandle);
    }
    saveHandle = null;
    saveHandleType = "";
  }

  function flushGameSave() {
    if (!pendingGameSave) {
      return true;
    }
    cancelScheduledGameSave();
    const payload = pendingGameSave;
    pendingGameSave = null;
    return write(SAVE_KEY, payload);
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("beforeunload", flushGameSave);
  }

  window.GameStorage = {
    SETTINGS_KEY,
    SAVE_KEY,
    defaults,
    loadSettings,
    saveSettings,
    loadGame,
    saveGame,
    flushGameSave,
    clearGame,
  };
})();
