(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var supported = ["zh-TW", "en", "ja"];
  var languageNames = { "zh-TW": "繁中", en: "EN", ja: "日本語" };
  var savedLanguage = app.Storage.load(app.Storage.SETTINGS_KEY, {}).language;
  var browserLanguage = (navigator.language || "zh-TW").toLowerCase();
  var detectedLanguage = browserLanguage.indexOf("ja") === 0 ? "ja" : browserLanguage.indexOf("en") === 0 ? "en" : "zh-TW";
  var currentLanguage = supported.indexOf(savedLanguage) >= 0 ? savedLanguage : detectedLanguage;

  function getPath(object, path) {
    return String(path).split(".").reduce(function (value, key) {
      return value == null ? undefined : value[key];
    }, object);
  }

  function currentDictionary() {
    return (root.AutoBattlerLang && root.AutoBattlerLang[currentLanguage]) || {};
  }

  function translate(key, fallback) {
    var value = getPath(currentDictionary(), key);
    if (value === undefined && currentLanguage !== "zh-TW") {
      value = getPath((root.AutoBattlerLang || {})["zh-TW"] || {}, key);
    }
    return value === undefined ? (fallback === undefined ? key : fallback) : value;
  }

  function applyTranslations(scope) {
    var container = scope || document;
    container.querySelectorAll("[data-i18n]").forEach(function (element) {
      var value = translate(element.getAttribute("data-i18n"));
      if (element.hasAttribute("data-i18n-html")) element.innerHTML = value;
      else element.textContent = value;
    });
    container.querySelectorAll("[data-i18n-title]").forEach(function (element) {
      element.title = translate(element.getAttribute("data-i18n-title"));
    });
    container.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
      element.setAttribute("aria-label", translate(element.getAttribute("data-i18n-aria")));
    });
    container.querySelectorAll("[data-i18n-tooltip]").forEach(function (element) {
      element.setAttribute("data-tooltip", translate(element.getAttribute("data-i18n-tooltip")));
    });
    document.documentElement.lang = currentLanguage === "zh-TW" ? "zh-Hant" : currentLanguage;
  }

  function saveLanguage() {
    var settings = app.Storage.load(app.Storage.SETTINGS_KEY, {});
    settings.language = currentLanguage;
    app.Storage.save(app.Storage.SETTINGS_KEY, settings);
  }

  app.I18n = {
    supported: supported,
    languageNames: languageNames,
    t: translate,
    get: getPath,
    getLanguage: function () { return currentLanguage; },
    setLanguage: function (language) {
      if (supported.indexOf(language) < 0) return false;
      currentLanguage = language;
      saveLanguage();
      applyTranslations();
      if (app.MainMenuUI) app.MainMenuUI.renderLanguageMenu();
      if (app.GameUI) app.GameUI.render();
      if (app.HelpUI && app.UIManager && app.UIManager.currentScreen === "help") app.HelpUI.render();
      if (app.SettingsUI && app.UIManager && app.UIManager.currentScreen === "settings") app.SettingsUI.render();
      document.dispatchEvent(new CustomEvent("autobattler:language", { detail: { language: language } }));
      return true;
    },
    apply: applyTranslations
  };
}(window));
