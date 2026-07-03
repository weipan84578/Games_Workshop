(function () {
  window.SicBo = window.SicBo || {};

  const DEFAULT_LANGUAGE = "zh-TW";
  let currentLanguage = DEFAULT_LANGUAGE;
  const listeners = [];

  function getDict(language) {
    return window.SicBoLangs[language] || window.SicBoLangs[DEFAULT_LANGUAGE];
  }

  function readPath(obj, path) {
    return path.split(".").reduce(function (value, key) {
      return value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
    }, obj);
  }

  function formatText(template, params) {
    if (typeof template !== "string") return "";
    return template.replace(/\{(\w+)\}/g, function (_, key) {
      return params && Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : "";
    });
  }

  function t(path, params) {
    const dict = getDict(currentLanguage);
    const fallback = getDict(DEFAULT_LANGUAGE);
    const value = readPath(dict, path);
    const fallbackValue = readPath(fallback, path);
    return formatText(value !== undefined ? value : fallbackValue !== undefined ? fallbackValue : path, params);
  }

  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });
    document.documentElement.lang = getDict(currentLanguage).meta.htmlLang;
    document.querySelectorAll(".language-option").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.language === currentLanguage);
    });
  }

  function setLanguage(language) {
    if (!window.SicBoLangs[language]) return;
    currentLanguage = language;
    applyTranslations(document);
    listeners.forEach(function (listener) { listener(currentLanguage); });
  }

  function betName(bet) {
    if (bet.kind === "total") return t("bets.total.name", { value: bet.value });
    if (bet.kind === "single") return t("bets.single.name", { value: bet.value });
    if (bet.kind === "double") return t("bets.double.name", { value: bet.value });
    if (bet.kind === "triple") return t("bets.triple.name", { value: bet.value });
    if (bet.kind === "combo") return t("bets.combo.name", { a: bet.values[0], b: bet.values[1] });
    if (bet.kind === "anyTriple") return t("bets.anyTriple.name");
    return t("bets." + bet.id + ".name");
  }

  function betDescription(bet) {
    if (bet.kind === "total") return t("bets.total.desc", { value: bet.value });
    if (bet.kind === "single") return t("bets.single.desc", { value: bet.value });
    if (bet.kind === "double") return t("bets.double.desc", { value: bet.value });
    if (bet.kind === "triple") return t("bets.triple.desc", { value: bet.value });
    if (bet.kind === "combo") return t("bets.combo.desc", { a: bet.values[0], b: bet.values[1] });
    if (bet.kind === "anyTriple") return t("bets.anyTriple.desc");
    return t("bets." + bet.id + ".desc");
  }

  function oddsLabel(bet) {
    if (bet.kind === "single") return t("bets.single.odds");
    return t("bets.odds", { payout: bet.payout });
  }

  function languageThemeLabel(theme) {
    const meta = getDict(currentLanguage).meta;
    const themeText = meta.themeShort[theme] || theme;
    return meta.short + " / " + themeText;
  }

  window.SicBo.I18n = {
    DEFAULT_LANGUAGE: DEFAULT_LANGUAGE,
    apply: applyTranslations,
    betDescription: betDescription,
    betName: betName,
    getLanguage: function () { return currentLanguage; },
    languageThemeLabel: languageThemeLabel,
    oddsLabel: oddsLabel,
    onChange: function (listener) { listeners.push(listener); },
    setLanguage: setLanguage,
    t: t
  };
})();
