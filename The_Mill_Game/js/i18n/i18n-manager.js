(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var dictionaries = {
    zh: global.LANG_ZH || {},
    en: global.LANG_EN || {},
    ja: global.LANG_JA || {}
  };
  var language = "zh";

  function detectLanguage() {
    var nav = (global.navigator && global.navigator.language || "").toLowerCase();
    if (nav.indexOf("ja") === 0) {
      return "ja";
    }
    if (nav.indexOf("zh") === 0) {
      return "zh";
    }
    return "en";
  }

  function setLanguage(nextLanguage) {
    language = dictionaries[nextLanguage] ? nextLanguage : "en";
    document.documentElement.lang = language === "zh" ? "zh-Hant" : language;
  }

  function t(key, params) {
    var dict = dictionaries[language] || dictionaries.en;
    var fallback = dictionaries.en || {};
    var value = dict[key] || fallback[key] || key;
    var replacements = params || {};
    Object.keys(replacements).forEach(function (name) {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), replacements[name]);
    });
    return value;
  }

  function apply(root) {
    var scope = root || document;
    var textNodes = scope.querySelectorAll("[data-i18n]");
    var attrNodes = scope.querySelectorAll("[data-i18n-attr]");
    var i;

    for (i = 0; i < textNodes.length; i += 1) {
      textNodes[i].textContent = t(textNodes[i].getAttribute("data-i18n"));
    }

    for (i = 0; i < attrNodes.length; i += 1) {
      var pairs = attrNodes[i].getAttribute("data-i18n-attr").split(",");
      for (var j = 0; j < pairs.length; j += 1) {
        var parts = pairs[j].split(":");
        if (parts.length === 2) {
          attrNodes[i].setAttribute(parts[0].trim(), t(parts[1].trim()));
        }
      }
    }
  }

  function getLanguage() {
    return language;
  }

  NMM.I18n = {
    detectLanguage: detectLanguage,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    t: t,
    apply: apply
  };
})(window);
