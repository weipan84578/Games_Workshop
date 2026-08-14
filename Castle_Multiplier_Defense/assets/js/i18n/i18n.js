(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var dictionaries = { "zh-TW": root.I18N_ZH_TW, "en-US": root.I18N_EN_US, "ja-JP": root.I18N_JA_JP };
    var I18n = cg.I18n = {};
    I18n.dictionaries = dictionaries;
    I18n.t = function (key, params) {
        var locale = root.GameState && root.GameState.locale || "zh-TW";
        var dict = dictionaries[locale] || dictionaries["zh-TW"];
        var fallback = dictionaries["zh-TW"] || {};
        var value = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : fallback[key];
        if (typeof value !== "string") return key;
        Object.keys(params || {}).forEach(function (name) { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(params[name])); });
        return value;
    };
    I18n.apply = function (rootElement) {
        var scope = rootElement || document;
        scope.querySelectorAll("[data-i18n]").forEach(function (element) { element.textContent = I18n.t(element.getAttribute("data-i18n")); });
        scope.querySelectorAll("[data-i18n-title]").forEach(function (element) { element.title = I18n.t(element.getAttribute("data-i18n-title")); });
        scope.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) { element.setAttribute("aria-label", I18n.t(element.getAttribute("data-i18n-aria-label"))); });
        document.documentElement.lang = root.GameState.locale === "zh-TW" ? "zh-Hant" : root.GameState.locale === "ja-JP" ? "ja" : "en";
    };
    I18n.setLocale = function (locale) {
        if (!dictionaries[locale]) return;
        root.GameState.locale = locale;
        I18n.apply(document);
    };
}(window));
