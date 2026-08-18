(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var dictionaries = { zh: global.LANG_ZH, en: global.LANG_EN, ja: global.LANG_JA };
  var current = "zh";

  function t(key, variables) {
    var dictionary = dictionaries[current] || dictionaries.zh;
    var fallback = dictionaries.zh || {};
    var value = dictionary[key] !== undefined ? dictionary[key] : fallback[key];
    if (value === undefined) {
      return key;
    }
    return String(value).replace(/\{(\w+)\}/g, function (match, variable) {
      return variables && variables[variable] !== undefined ? variables[variable] : match;
    });
  }

  function apply(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = t(element.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      element.setAttribute("placeholder", t(element.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (element) {
      element.setAttribute("title", t(element.getAttribute("data-i18n-title")));
    });
    global.document.documentElement.lang = current === "zh" ? "zh-Hant" : current === "ja" ? "ja" : "en";
  }

  function updateLanguageButtons() {
    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-language") === current);
    });
  }

  function setLanguage(language) {
    if (!dictionaries[language]) {
      return current;
    }
    current = language;
    app.SaveManager.saveSettings({ language: current });
    apply(document);
    updateLanguageButtons();
    app.events.emit("i18n:change", current);
    return current;
  }

  function init() {
    var saved = app.SaveManager.getSettings().language;
    current = dictionaries[saved] ? saved : app.Config.defaultLanguage;
    apply(document);
    updateLanguageButtons();
  }

  app.i18n = { init: init, t: t, apply: apply, setLanguage: setLanguage, getLanguage: function () { return current; }, updateLanguageButtons: updateLanguageButtons };
  app.t = t;
})(window);
