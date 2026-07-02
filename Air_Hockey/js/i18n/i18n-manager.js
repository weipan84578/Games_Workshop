(function (ns) {
  "use strict";

  function detectLanguage(settings) {
    if (settings.language && settings.language !== "auto") {
      return settings.language;
    }
    var browserLanguage = (navigator.language || "en").toLowerCase();
    if (browserLanguage.indexOf("zh") === 0) {
      return "zh";
    }
    if (browserLanguage.indexOf("ja") === 0) {
      return "ja";
    }
    return "en";
  }

  function I18nManager() {
    this.language = "en";
    this.dictionary = ns.Langs.en;
  }

  I18nManager.prototype.init = function (settings) {
    this.setLanguage(detectLanguage(settings), false);
  };

  I18nManager.prototype.t = function (key) {
    var value = ns.Helpers.deepGet(this.dictionary, key);
    if (typeof value === "undefined") {
      value = ns.Helpers.deepGet(ns.Langs.en, key);
    }
    return typeof value === "undefined" ? key : value;
  };

  I18nManager.prototype.apply = function (root) {
    var scope = root || document;
    var self = this;
    ns.Helpers.$$("[data-i18n-key]", scope).forEach(function (element) {
      element.textContent = self.t(element.getAttribute("data-i18n-key"));
    });
    ns.Helpers.$$("[data-i18n-aria]", scope).forEach(function (element) {
      element.setAttribute("aria-label", self.t(element.getAttribute("data-i18n-aria")));
    });
    document.documentElement.lang = this.language === "zh" ? "zh-Hant" : this.language;
  };

  I18nManager.prototype.setLanguage = function (language, persist) {
    if (ns.Constants.VALID.languages.indexOf(language) === -1) {
      language = "en";
    }
    this.language = language;
    this.dictionary = ns.Langs[language] || ns.Langs.en;
    this.apply(document);
    if (persist) {
      ns.SaveManager.patchSettings({ language: language });
      ns.SaveManager.markLanguageChosen();
    }
    window.dispatchEvent(new CustomEvent("airhockey:languagechange", { detail: { language: language } }));
  };

  ns.I18nManager = I18nManager;
})(window.AirHockey = window.AirHockey || {});
