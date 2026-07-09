(function exposeI18n(root, factory) {
  var I18n = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.I18n = I18n;
  root.BBQ.i18n = new I18n();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = I18n;
  }
})(typeof window !== "undefined" ? window : globalThis, function i18nFactory(root) {
  "use strict";

  function I18n(options) {
    options = options || {};
    this.language = options.language || "zh-Hant";
    this.fallbackLanguage = "zh-Hant";
    this.dictionaries = Object.assign({}, options.dictionaries || {});
  }

  I18n.prototype.register = function register(language, messages) {
    this.dictionaries[language] = Object.assign({}, this.dictionaries[language] || {}, messages || {});
    return this;
  };

  I18n.prototype.setLanguage = function setLanguage(language) {
    if (!this.dictionaries[language]) {
      language = this.fallbackLanguage;
    }
    this.language = language;
    if (root.document && root.document.documentElement) {
      root.document.documentElement.lang = language === "zh-Hant" ? "zh-Hant" : language;
    }
    this.translatePage();
    return this.language;
  };

  I18n.prototype.t = function translate(key, params) {
    params = params || {};
    var table = this.dictionaries[this.language] || {};
    var fallback = this.dictionaries[this.fallbackLanguage] || {};
    var template = table[key] || fallback[key] || key;
    return String(template).replace(/\{(\w+)\}/g, function replaceToken(match, name) {
      return Object.prototype.hasOwnProperty.call(params, name) ? params[name] : match;
    });
  };

  I18n.prototype.translatePage = function translatePage(scope) {
    if (!root.document) {
      return;
    }
    var container = scope || root.document;
    var nodes = container.querySelectorAll("[data-i18n]");
    nodes.forEach(function applyText(node) {
      node.textContent = this.t(node.getAttribute("data-i18n"));
    }, this);

    container.querySelectorAll("[data-i18n-title]").forEach(function applyTitle(node) {
      node.setAttribute("title", this.t(node.getAttribute("data-i18n-title")));
    }, this);

    container.querySelectorAll("[data-i18n-aria]").forEach(function applyAria(node) {
      node.setAttribute("aria-label", this.t(node.getAttribute("data-i18n-aria")));
    }, this);
  };

  return I18n;
});
