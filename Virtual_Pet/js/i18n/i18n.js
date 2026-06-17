window.VP = window.VP || {};

VP.i18n = (function () {
  var dictionaries = {
    zh: VP.LANG_ZH,
    en: VP.LANG_EN,
    ja: VP.LANG_JA
  };
  var currentLang = "zh";

  function resolve(path) {
    var parts = String(path || "").split(".");
    var value = dictionaries[currentLang];
    var fallback = dictionaries.zh;

    parts.forEach(function (part) {
      value = value && value[part];
      fallback = fallback && fallback[part];
    });

    return value === undefined ? fallback : value;
  }

  function format(template, params) {
    return String(template).replace(/\{(\w+)\}/g, function (_, key) {
      return params && params[key] !== undefined ? params[key] : "";
    });
  }

  function t(path, params) {
    var value = resolve(path);
    if (value === undefined || value === null) {
      return path;
    }
    if (typeof value === "string") {
      return format(value, params);
    }
    return value;
  }

  function apply(root) {
    VP.dom.$$("[data-i18n]", root || document).forEach(function (element) {
      var value = t(element.getAttribute("data-i18n"));
      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    document.documentElement.lang = currentLang === "zh" ? "zh-Hant" : currentLang;
  }

  function setLang(lang) {
    currentLang = dictionaries[lang] ? lang : "zh";
    try {
      localStorage.setItem("vp_lang", currentLang);
    } catch (error) {}
    apply();
    VP.EventBus.emit("i18n:changed", currentLang);
  }

  function getLang() {
    return currentLang;
  }

  function init(lang) {
    currentLang = dictionaries[lang] ? lang : "zh";
    apply();
  }

  return {
    init: init,
    apply: apply,
    setLang: setLang,
    getLang: getLang,
    t: t
  };
})();
