(function (window) {
  'use strict';

  const I18n = {
    currentLang: 'zh-TW',
    translations: {
      'zh-TW': ZH_TW,
      en: EN,
      ja: JA
    },

    t(key, params = {}) {
      const table = this.translations[this.currentLang] || this.translations['zh-TW'];
      let text = table[key] || this.translations['zh-TW'][key] || key;
      Object.entries(params).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, value);
      });
      return text;
    },

    setLang(lang) {
      if (!this.translations[lang]) return;
      this.currentLang = lang;
      document.documentElement.lang = lang;
      this.apply();
      const settings = Storage.get('settings', {});
      settings.lang = lang;
      Storage.set('settings', settings);
      window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
    },

    apply(root = document) {
      Helpers.qsa('[data-i18n]', root).forEach((el) => {
        el.textContent = this.t(el.dataset.i18n);
      });
      Helpers.qsa('[data-lang]', root).forEach((el) => {
        el.classList.toggle('is-active', el.dataset.lang === this.currentLang);
      });
    }
  };

  window.I18n = I18n;
})(window);
