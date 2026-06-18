window.YZ = window.YZ || {};

YZ.I18n = (function () {
  var current = "zh";

  function detectBrowserLang() {
    var lang = (navigator.language || "").toLowerCase();
    if (lang.indexOf("ja") === 0) return "ja";
    if (lang.indexOf("en") === 0) return "en";
    return "zh";
  }

  function t(key, args) {
    var table = YZ.LANG[current] || YZ.LANG.zh || {};
    var str = table[key] || (YZ.LANG.zh && YZ.LANG.zh[key]) || key;
    if (args) {
      Object.keys(args).forEach(function (name) {
        str = str.replace(new RegExp("\\{" + name + "\\}", "g"), args[name]);
      });
    }
    return str;
  }

  function apply(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var rawArgs = el.getAttribute("data-i18n-args");
      var args = null;
      if (rawArgs) {
        try {
          args = JSON.parse(rawArgs);
        } catch (err) {
          args = null;
        }
      }
      el.textContent = t(key, args);
    });
  }

  function set(lang, options) {
    options = options || {};
    if (YZ.Constants.LANGS.indexOf(lang) === -1) lang = "zh";
    current = lang;
    document.documentElement.lang = lang === "ja" ? "ja" : lang === "en" ? "en" : "zh-Hant";
    if (options.persist !== false && YZ.Save) {
      YZ.Save.savePref("lang", lang);
    }
    apply();
    if (options.render !== false && YZ.ScreenManager) {
      YZ.ScreenManager.renderCurrent();
    }
  }

  function init() {
    var saved = YZ.Save && YZ.Save.loadPref("lang");
    set(saved || detectBrowserLang() || YZ.Constants.DEFAULT_PREFS.lang, { persist: false, render: false });
  }

  function get() {
    return current;
  }

  return {
    init: init,
    set: set,
    get: get,
    t: t,
    apply: apply
  };
})();
