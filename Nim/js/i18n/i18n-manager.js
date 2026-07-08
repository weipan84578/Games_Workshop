(function (NimGame) {
  'use strict';

  var SUPPORTED = ['zh-TW', 'en', 'ja'];
  var currentLanguage = 'zh-TW';

  function detectLanguage() {
    var language = (navigator.language || '').toLowerCase();
    if (language.indexOf('ja') === 0) {
      return 'ja';
    }
    if (language.indexOf('en') === 0) {
      return 'en';
    }
    return 'zh-TW';
  }

  function interpolate(text, params) {
    return String(text).replace(/\{(\w+)\}/g, function (_, key) {
      return params && Object.prototype.hasOwnProperty.call(params, key) ? params[key] : '';
    });
  }

  function t(key, params) {
    var dictionary = NimGame.locales[currentLanguage] || NimGame.locales['zh-TW'];
    var fallback = NimGame.locales['zh-TW'] || {};
    return interpolate(dictionary[key] || fallback[key] || key, params);
  }

  function apply(root) {
    NimGame.dom.$$('[data-i18n]', root).forEach(function (node) {
      node.textContent = t(node.dataset.i18n);
    });
    NimGame.dom.$$('[data-i18n-aria]', root).forEach(function (node) {
      node.setAttribute('aria-label', t(node.dataset.i18nAria));
    });
    NimGame.dom.$$('[data-i18n-title]', root).forEach(function (node) {
      node.setAttribute('title', t(node.dataset.i18nTitle));
    });
  }

  function setLanguage(language) {
    if (SUPPORTED.indexOf(language) === -1) {
      language = 'zh-TW';
    }
    currentLanguage = language;
    document.documentElement.lang = language;
    apply(document);
    if (NimGame.StateManager) {
      NimGame.StateManager.updateSettings({ language: language });
    }
    document.dispatchEvent(new CustomEvent('nim:language-change', { detail: { language: language } }));
  }

  NimGame.i18n = {
    supported: SUPPORTED,
    detectLanguage: detectLanguage,
    getLanguage: function () {
      return currentLanguage;
    },
    setLanguage: setLanguage,
    apply: apply,
    t: t
  };

  NimGame.t = t;
}(window.NimGame = window.NimGame || {}));
