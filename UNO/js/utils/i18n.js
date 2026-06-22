(function () {
  const languageNames = {
    "zh-TW": "繁中",
    "zh-CN": "简中",
    en: "EN",
    ja: "日本語",
  };

  const I18n = {
    currentLang: "zh-TW",
    translations: {},

    register(lang, messages) {
      this.translations[lang] = messages;
    },

    init(lang) {
      const settings = window.UnoStorage ? UnoStorage.getSettings() : {};
      this.currentLang = lang || settings.lang || "zh-TW";
      this.applyFont();
      this.applyToDOM();
    },

    setLang(lang) {
      if (!this.translations[lang]) return;
      this.currentLang = lang;
      if (window.UnoStorage) UnoStorage.saveSettings({ lang });
      this.applyFont();
      this.applyToDOM();
      Helpers.emit("uno:language-changed", { lang });
    },

    t(key, params) {
      const messages = this.translations[this.currentLang] || this.translations["zh-TW"] || {};
      const fallback = this.translations["zh-TW"] || {};
      const value = key.split(".").reduce((obj, part) => (obj ? obj[part] : undefined), messages);
      const fallbackValue = key.split(".").reduce((obj, part) => (obj ? obj[part] : undefined), fallback);
      return Helpers.interpolate(value || fallbackValue || key, params);
    },

    applyToDOM() {
      Helpers.qsa("[data-i18n]").forEach((el) => {
        el.textContent = this.t(el.dataset.i18n);
      });
      Helpers.qsa("[data-i18n-title]").forEach((el) => {
        el.title = this.t(el.dataset.i18nTitle);
      });
      Helpers.qsa("[data-i18n-aria]").forEach((el) => {
        el.setAttribute("aria-label", this.t(el.dataset.i18nAria));
      });
    },

    applyFont() {
      document.documentElement.lang = this.currentLang;
      document.documentElement.className = `lang-${this.currentLang}`;
    },

    getLanguageName(lang) {
      return languageNames[lang] || lang;
    },
  };

  window.I18n = I18n;
})();
