(function (ns) {
  "use strict";

  var constants = ns.Constants;

  function safeParse(raw) {
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function sanitizeSettings(candidate) {
    var settings = Object.assign({}, constants.DEFAULT_SETTINGS, candidate || {});
    var valid = constants.VALID;

    if (settings.language !== "auto" && valid.languages.indexOf(settings.language) === -1) {
      settings.language = constants.DEFAULT_SETTINGS.language;
    }
    if (valid.themes.indexOf(settings.theme) === -1) {
      settings.theme = constants.DEFAULT_SETTINGS.theme;
    }
    if (valid.effectsQuality.indexOf(settings.effectsQuality) === -1) {
      settings.effectsQuality = constants.DEFAULT_SETTINGS.effectsQuality;
    }
    if (valid.targetScore.indexOf(Number(settings.targetScore)) === -1) {
      settings.targetScore = constants.DEFAULT_SETTINGS.targetScore;
    }

    settings.bgmVolume = ns.Helpers.clamp(Number(settings.bgmVolume), 0, 100);
    settings.sfxVolume = ns.Helpers.clamp(Number(settings.sfxVolume), 0, 100);
    settings.muted = Boolean(settings.muted);
    settings.targetScore = Number(settings.targetScore);
    delete settings.touchSensitivity;
    delete settings.keyboardEnabled;
    return settings;
  }

  function loadSettings() {
    return sanitizeSettings(safeParse(localStorage.getItem(constants.STORAGE_KEYS.SETTINGS)));
  }

  function saveSettings(settings) {
    return write(constants.STORAGE_KEYS.SETTINGS, sanitizeSettings(settings));
  }

  function patchSettings(patch) {
    var settings = Object.assign(loadSettings(), patch || {});
    saveSettings(settings);
    return settings;
  }

  function loadProgress() {
    var progress = safeParse(localStorage.getItem(constants.STORAGE_KEYS.PROGRESS));
    if (!progress || typeof progress !== "object") {
      return null;
    }
    if (!constants.DIFFICULTY[progress.difficulty]) {
      return null;
    }
    if (constants.VALID.targetScore.indexOf(Number(progress.targetScore)) === -1) {
      return null;
    }
    return {
      difficulty: progress.difficulty,
      playerScore: ns.Helpers.clamp(Number(progress.playerScore) || 0, 0, Number(progress.targetScore)),
      aiScore: ns.Helpers.clamp(Number(progress.aiScore) || 0, 0, Number(progress.targetScore)),
      targetScore: Number(progress.targetScore),
      timestamp: Number(progress.timestamp) || Date.now()
    };
  }

  function saveProgress(progress) {
    if (!progress || !constants.DIFFICULTY[progress.difficulty]) {
      return false;
    }
    return write(constants.STORAGE_KEYS.PROGRESS, {
      difficulty: progress.difficulty,
      playerScore: Number(progress.playerScore) || 0,
      aiScore: Number(progress.aiScore) || 0,
      targetScore: Number(progress.targetScore) || constants.DEFAULT_SETTINGS.targetScore,
      timestamp: Date.now()
    });
  }

  function clearProgress() {
    try {
      localStorage.removeItem(constants.STORAGE_KEYS.PROGRESS);
    } catch (error) {
      return false;
    }
    return true;
  }

  function hasChosenLanguage() {
    return localStorage.getItem(constants.STORAGE_KEYS.LANGUAGE_CHOSEN) === "1";
  }

  function markLanguageChosen() {
    try {
      localStorage.setItem(constants.STORAGE_KEYS.LANGUAGE_CHOSEN, "1");
    } catch (error) {
      return false;
    }
    return true;
  }

  ns.SaveManager = {
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    patchSettings: patchSettings,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    clearProgress: clearProgress,
    hasChosenLanguage: hasChosenLanguage,
    markLanguageChosen: markLanguageChosen
  };
})(window.AirHockey = window.AirHockey || {});
