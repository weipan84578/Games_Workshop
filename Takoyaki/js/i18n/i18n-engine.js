(function registerI18n(app) {
  "use strict";

  const dictionaries = {
    "zh-TW": app.LangZh,
    en: app.LangEn,
    ja: app.LangJp
  };

  let activeLanguage = "zh-TW";

  function detectLanguage(languageCode) {
    const normalized = String(languageCode || "").toLowerCase();
    if (normalized.startsWith("ja")) {
      return "ja";
    }
    if (normalized.startsWith("en")) {
      return "en";
    }
    return "zh-TW";
  }

  function interpolate(template, params = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) => {
      return Object.prototype.hasOwnProperty.call(params, key) ? params[key] : `{${key}}`;
    });
  }

  app.I18n = {
    init(settings) {
      activeLanguage = settings.language && settings.language !== "auto"
        ? settings.language
        : detectLanguage(window.navigator.language);
      this.applyLanguage(activeLanguage);
    },

    detectLanguage,

    getLanguage() {
      return activeLanguage;
    },

    setLanguage(language) {
      activeLanguage = dictionaries[language] ? language : "zh-TW";
      this.applyLanguage(activeLanguage);
      app.EventBus.emit("i18n:changed", activeLanguage);
    },

    applyLanguage(language) {
      document.documentElement.lang = language === "zh-TW" ? "zh-Hant" : language;
      document.body.dataset.lang = language;
    },

    t(key, params) {
      const dict = dictionaries[activeLanguage] || dictionaries["zh-TW"];
      const fallback = dictionaries["zh-TW"];
      return interpolate(dict[key] || fallback[key] || key, params);
    },

    keys() {
      return Object.keys(dictionaries["zh-TW"]);
    },

    dictionaries
  };
})(window.Takoyaki = window.Takoyaki || {});
