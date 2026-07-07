(function initSettingsManager(global) {
  const CF = global.CF || (global.CF = {});
  const { DEFAULT_SETTINGS, STORAGE_KEYS } = CF.constants;

  function normalizeLanguage(language) {
    const value = String(language || "").toLowerCase();
    if (value.startsWith("zh")) return "zh-TW";
    if (value.startsWith("ja")) return "ja";
    if (value.startsWith("en")) return "en";
    return "en";
  }

  function detectLanguage() {
    return normalizeLanguage(global.navigator && global.navigator.language);
  }

  function loadSettings() {
    const saved = CF.storage.read(STORAGE_KEYS.settings, {});
    const initialLanguage = saved.language || detectLanguage() || DEFAULT_SETTINGS.language;
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      language: normalizeLanguage(initialLanguage)
    };
  }

  let current = loadSettings();

  function saveSettings(next) {
    current = { ...DEFAULT_SETTINGS, ...next };
    CF.storage.write(STORAGE_KEYS.settings, current);
    applySettings(current);
    return current;
  }

  function updateSettings(patch) {
    return saveSettings({ ...current, ...patch });
  }

  function resetSettings() {
    return saveSettings({ ...DEFAULT_SETTINGS, language: detectLanguage() || DEFAULT_SETTINGS.language });
  }

  function applySettings(settings) {
    document.body.dataset.theme = settings.theme;
    document.documentElement.lang = settings.language === "zh-TW" ? "zh-Hant" : settings.language;
    document.body.classList.toggle("reduce-animations", !settings.animations);
  }

  function getSettings() {
    return { ...current };
  }

  applySettings(current);

  CF.settingsManager = { getSettings, updateSettings, resetSettings, normalizeLanguage, detectLanguage };
})(window);
