(function () {
  "use strict";

  var currentLanguage = "zh-TW";

  function lookup(key, lang) {
    var root = window.I18nMessages[lang] || window.I18nMessages["zh-TW"];
    return key.split(".").reduce(function (value, part) {
      return value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined;
    }, root);
  }

  function format(message, params) {
    if (typeof message !== "string") return "";
    return message.replace(/\{(\w+)\}/g, function (_, key) {
      return params && Object.prototype.hasOwnProperty.call(params, key) ? params[key] : "";
    });
  }

  function t(key, params) {
    var message = lookup(key, currentLanguage);
    if (message === undefined) message = lookup(key, "zh-TW");
    if (message === undefined) message = key;
    return format(message, params);
  }

  function translate(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (node) {
      node.setAttribute("title", t(node.getAttribute("data-i18n-title")));
    });
    document.documentElement.lang = currentLanguage;
    document.title = t("app.title");
  }

  function setLanguage(lang) {
    if (!window.I18nMessages[lang]) lang = "zh-TW";
    currentLanguage = lang;
    translate();
  }

  function getLanguage() {
    return currentLanguage;
  }

  window.I18n = {
    t: t,
    translate: translate,
    setLanguage: setLanguage,
    getLanguage: getLanguage
  };
})();
