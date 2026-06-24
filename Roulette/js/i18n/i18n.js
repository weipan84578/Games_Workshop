(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { DEFAULT_SETTINGS, $all, translations } = R;

  const i18n = {
    currentLang: DEFAULT_SETTINGS.language,
    t(key, params = {}) {
      const langTable = translations[this.currentLang] || translations["zh-TW"];
      const fallback = translations["zh-TW"][key] || key;
      let text = langTable[key] || fallback;
      Object.entries(params).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, value);
      });
      return text;
    },
    setLang(lang) {
      this.currentLang = translations[lang] ? lang : "zh-TW";
      document.documentElement.lang = this.currentLang === "zh-TW" ? "zh-Hant" : this.currentLang;
      this.updateDom();
    },
    updateDom() {
      $all("[data-i18n]").forEach((el) => {
        const params = el.dataset.i18nParam ? JSON.parse(el.dataset.i18nParam) : {};
        el.textContent = this.t(el.dataset.i18n, params);
      });
    },
  };

  Object.assign(R, { i18n });
})();
