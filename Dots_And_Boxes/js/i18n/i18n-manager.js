(function (ns) {
  "use strict";

  function resolve(dict, path) {
    return path.split(".").reduce(function (current, part) {
      return current && current[part] !== undefined ? current[part] : undefined;
    }, dict);
  }

  ns.I18n = {
    language: "zh-TW",

    init: function (language) {
      this.language = language || "zh-TW";
      this.applyLanguage(this.language);
    },

    t: function (path) {
      var dict = window.DAB_I18N[this.language] || window.DAB_I18N["zh-TW"];
      var value = resolve(dict, path);
      if (value === undefined) {
        value = resolve(window.DAB_I18N["zh-TW"], path);
        if (value === undefined) {
          console.warn("Missing i18n key:", path);
          return path;
        }
      }
      return value;
    },

    applyLanguage: function (language) {
      this.language = language || this.language;
      document.documentElement.lang = this.language;
      ns.$$("[data-i18n]").forEach(function (node) {
        node.textContent = ns.I18n.t(node.getAttribute("data-i18n"));
      });
      ns.$$("[data-i18n-aria]").forEach(function (node) {
        node.setAttribute("aria-label", ns.I18n.t(node.getAttribute("data-i18n-aria")));
      });
      ns.events.emit("languagechange", this.language);
    }
  };
})(window.DAB = window.DAB || {});
