(function (global) {
  "use strict";
  var CCC = global.CCC;
  var fallback = "zh-TW";

  function detectLanguage() {
    var language = String((global.navigator && (navigator.language || navigator.userLanguage)) || fallback).toLowerCase();
    if (language.indexOf("ja") === 0) { return "ja"; }
    if (language.indexOf("en") === 0) { return "en"; }
    if (language.indexOf("zh-tw") === 0 || language.indexOf("zh-hant") === 0) { return "zh-TW"; }
    return fallback;
  }

  function interpolate(text, values) {
    return String(text).replace(/\{([^}]+)\}/g, function (_, key) {
      return values && Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : "";
    });
  }

  CCC.i18n = {
    current: fallback,
    detect: detectLanguage,
    setLanguage: function (language, emit) {
      this.current = CCC.i18nData[language] ? language : fallback;
      document.documentElement.lang = this.current === "zh-TW" ? "zh-Hant" : this.current;
      document.title = this.t("app.title") + "｜Crispy Cutlet Corner";
      if (CCC.state.preferences) { CCC.state.preferences.language = this.current; }
      if (emit !== false) { CCC.events.emit("languagechange", this.current); }
    },
    t: function (key, values) {
      var primary = CCC.i18nData[this.current] || {};
      var backup = CCC.i18nData[fallback] || {};
      var text = primary[key];
      if (typeof text !== "string") { text = backup[key]; }
      if (typeof text !== "string") { text = backup["app.title"] + " — ?"; }
      return interpolate(text, values);
    },
    number: function (value) {
      try { return new Intl.NumberFormat(this.current).format(value); }
      catch (_) { return String(value); }
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
