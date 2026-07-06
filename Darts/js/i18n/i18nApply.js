(function () {
  "use strict";

  window.Darts = window.Darts || {};

  var currentLanguage = "zh-TW";

  function dictionary() {
    return window.Darts.Translations[currentLanguage] || window.Darts.Translations["zh-TW"];
  }

  function t(key, vars) {
    var table = dictionary();
    var fallback = window.Darts.Translations["en-US"] || {};
    var text = table[key] || fallback[key] || key;
    Object.keys(vars || {}).forEach(function (name) {
      text = text.replace(new RegExp("\\{" + name + "\\}", "g"), vars[name]);
    });
    return text;
  }

  function apply(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (node) {
      node.setAttribute("title", t(node.getAttribute("data-i18n-title")));
    });
    document.documentElement.lang = currentLanguage === "zh-TW" ? "zh-Hant" : currentLanguage;
  }

  window.Darts.I18n = {
    setLanguage: function (language) {
      currentLanguage = window.Darts.Translations[language] ? language : "zh-TW";
      apply(document);
    },
    getLanguage: function () {
      return currentLanguage;
    },
    t: t,
    apply: apply
  };
})();
