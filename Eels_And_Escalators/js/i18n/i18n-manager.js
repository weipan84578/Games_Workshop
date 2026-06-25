(function () {
  window.EAE = window.EAE || {};

  class I18nManager {
    constructor(initialLocale) {
      this.locales = {
        "zh-TW": window.EAE.zhTW,
        en: window.EAE.en,
        ja: window.EAE.ja
      };
      this.currentLocale = this.locales[initialLocale] ? initialLocale : "zh-TW";
    }

    t(key, params) {
      const table = this.locales[this.currentLocale] || this.locales["zh-TW"];
      const fallback = this.locales["zh-TW"][key] || key;
      const template = table[key] || fallback;
      return template.replace(/\{(\w+)\}/g, function (_, name) {
        return params && Object.prototype.hasOwnProperty.call(params, name) ? params[name] : "{" + name + "}";
      });
    }

    setLocale(locale) {
      if (!this.locales[locale]) return;
      this.currentLocale = locale;
      document.documentElement.lang = locale;
      this.applyToDOM();
    }

    applyToDOM(root) {
      const scope = root || document;
      scope.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = this.t(el.dataset.i18n);
      });
      document.documentElement.lang = this.currentLocale;
      document.querySelectorAll("[data-locale]").forEach((el) => {
        el.classList.toggle("is-active", el.dataset.locale === this.currentLocale);
      });
    }
  }

  window.EAE.I18nManager = I18nManager;
})();
