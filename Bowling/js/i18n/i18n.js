import zh from "./lang-zh.js";
import en from "./lang-en.js";
import ja from "./lang-ja.js";
import { LANGUAGES } from "../utils/constants.js";
import { getStorage } from "../utils/storage.js";

export const dictionaries = Object.freeze({ zh, en, ja });

export function createI18n({ storage, documentRef } = {}) {
  const targetStorage = getStorage(storage);
  let storedLanguage = null;
  try {
    storedLanguage = targetStorage?.getItem?.("lang");
  } catch {
    storedLanguage = null;
  }
  let currentLang = LANGUAGES.includes(storedLanguage) ? storedLanguage : "zh";

  function translate(key, params = {}) {
    let text = dictionaries[currentLang]?.[key] ?? dictionaries.zh[key] ?? key;
    Object.entries(params).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
  }

  function dispatchChange() {
    if (!documentRef?.dispatchEvent) return;
    const EventConstructor = documentRef.defaultView?.CustomEvent || globalThis.CustomEvent;
    if (EventConstructor) documentRef.dispatchEvent(new EventConstructor("language-changed"));
  }

  function setLanguage(language) {
    if (!LANGUAGES.includes(language)) return currentLang;
    currentLang = language;
    try {
      targetStorage?.setItem?.("lang", language);
    } catch {
      // Private browsing or disabled storage should not stop the game.
    }
    dispatchChange();
    return currentLang;
  }

  function applyTranslations(root = documentRef) {
    if (!root?.querySelectorAll) return;
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      let params = {};
      if (element.dataset.i18nParams) {
        try {
          params = JSON.parse(element.dataset.i18nParams);
        } catch {
          params = {};
        }
      }
      element.textContent = translate(element.dataset.i18n, params);
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });
    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", translate(element.dataset.i18nTitle));
    });
  }

  return {
    t: translate,
    setLanguage,
    getLanguage: () => currentLang,
    applyTranslations,
    supportedLanguages: [...LANGUAGES],
  };
}

const defaultI18n = createI18n({ documentRef: typeof document === "undefined" ? undefined : document });
export const t = defaultI18n.t;
export const setLanguage = defaultI18n.setLanguage;
export const getLanguage = defaultI18n.getLanguage;
export const applyTranslations = defaultI18n.applyTranslations;
