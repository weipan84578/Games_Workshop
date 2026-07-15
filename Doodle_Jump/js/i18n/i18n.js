(function (Game) {
  "use strict";
  var dictionaries = Object.create(null);
  var locale = "zh-TW";
  var fallback = "zh-TW";
  function getPath(dictionary, key) {
    return key.split(".").reduce(function (value, part) {
      return value && value[part];
    }, dictionary);
  }
  function interpolate(value, params) {
    return value.replace(/\{(\w+)\}/g, function (match, name) {
      return params && params[name] !== undefined
        ? String(params[name])
        : match;
    });
  }
  var I18n = {
    register: function (name, dictionary) {
      dictionaries[name] = dictionary;
    },
    dictionaries: dictionaries,
    setLocale: function (name) {
      if (dictionaries[name]) locale = name;
      return locale;
    },
    getLocale: function () {
      return locale;
    },
    supported: function () {
      return Object.keys(dictionaries);
    },
    detect: function (saved) {
      if (Game.Locales.indexOf(saved) !== -1) return saved;
      var languages = navigator.languages || [navigator.language];
      for (var i = 0; i < languages.length; i += 1) {
        var match = Game.Locales.find(function (supported) {
          return (
            supported.toLowerCase() === String(languages[i]).toLowerCase() ||
            supported.split("-")[0].toLowerCase() ===
              String(languages[i]).split("-")[0].toLowerCase()
          );
        });
        if (match) return match;
      }
      return fallback;
    },
    t: function (key, params) {
      var value = getPath(dictionaries[locale], key);
      if (typeof value !== "string")
        value = getPath(dictionaries[fallback], key);
      if (typeof value !== "string") return "[" + key + "]";
      return interpolate(value, params);
    },
    number: function (value) {
      try {
        return new Intl.NumberFormat(locale).format(value);
      } catch (error) {
        return String(value);
      }
    },
    date: function (value) {
      try {
        return new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(value));
      } catch (error) {
        return String(value).slice(0, 10);
      }
    },
    apply: function (root) {
      var scope = root || document;
      scope.querySelectorAll("[data-i18n]").forEach(function (element) {
        element.textContent = I18n.t(element.getAttribute("data-i18n"));
      });
      scope
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(function (element) {
          element.placeholder = I18n.t(
            element.getAttribute("data-i18n-placeholder"),
          );
        });
      scope
        .querySelectorAll("[data-i18n-aria-label]")
        .forEach(function (element) {
          element.setAttribute(
            "aria-label",
            I18n.t(element.getAttribute("data-i18n-aria-label")),
          );
        });
      document.documentElement.lang = locale;
      document.title = I18n.t("app.title");
    },
    keySet: function (name) {
      return Object.keys(dictionaries[name] || {}).sort();
    },
  };
  Game.I18n = I18n;
})(window.DJGame);
