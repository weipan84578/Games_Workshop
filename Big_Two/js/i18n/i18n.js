(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var dictionaries = Object.create(null);
  var listeners = [];
  var supported = ['zh-Hant', 'en', 'ja'];
  var currentLocale = 'zh-Hant';

  function normaliseLocale(value) {
    var locale = String(value || '').replace(/_/g, '-').toLowerCase();
    if (locale === 'zh-hant' || locale.indexOf('zh-tw') === 0 ||
        locale.indexOf('zh-hk') === 0 || locale.indexOf('zh-hant') === 0) {
      return 'zh-Hant';
    }
    if (locale.indexOf('ja') === 0) {
      return 'ja';
    }
    if (locale.indexOf('en') === 0) {
      return 'en';
    }
    return null;
  }

  function detectLocale(savedLocale) {
    var saved = normaliseLocale(savedLocale);
    var languages;
    var i;
    var detected;
    if (saved) {
      return saved;
    }
    languages = global.navigator && global.navigator.languages;
    if (!languages || !languages.length) {
      languages = [global.navigator && global.navigator.language];
    }
    for (i = 0; i < languages.length; i += 1) {
      detected = normaliseLocale(languages[i]);
      if (detected) {
        return detected;
      }
    }
    return 'zh-Hant';
  }

  function escapeValue(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function interpolate(template, values) {
    return String(template).replace(/\{([A-Za-z0-9_]+)\}/g, function (match, key) {
      return values && Object.prototype.hasOwnProperty.call(values, key)
        ? escapeValue(values[key])
        : match;
    });
  }

  function lookup(locale, key) {
    var messages = dictionaries[locale];
    if (messages && Object.prototype.hasOwnProperty.call(messages, key)) {
      return messages[key];
    }
    messages = dictionaries['zh-Hant'];
    if (messages && Object.prototype.hasOwnProperty.call(messages, key)) {
      return messages[key];
    }
    return key;
  }

  function t(key, values) {
    return interpolate(lookup(currentLocale, key), values);
  }

  function translateElement(element) {
    var key = element.getAttribute('data-i18n');
    var attribute = element.getAttribute('data-i18n-attr');
    var value;
    if (!key) {
      return;
    }
    value = t(key);
    if (attribute) {
      element.setAttribute(attribute, value);
    } else {
      element.textContent = value;
    }
  }

  function translate(root) {
    var scope = root || global.document;
    var nodes;
    var i;
    if (!scope || !scope.querySelectorAll) {
      return;
    }
    if (scope.nodeType === 1 && scope.hasAttribute('data-i18n')) {
      translateElement(scope);
    }
    nodes = scope.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i += 1) {
      translateElement(nodes[i]);
    }
  }

  function updateDocument() {
    if (!global.document) {
      return;
    }
    global.document.documentElement.lang = currentLocale;
    global.document.title = t('app.documentTitle');
    translate(global.document);
  }

  function notify() {
    listeners.slice().forEach(function (listener) {
      try {
        listener(currentLocale);
      } catch (error) {
        if (global.console && typeof global.console.error === 'function') {
          global.console.error('BigTwo locale listener failed:', error);
        }
      }
    });
    if (global.document && typeof global.CustomEvent === 'function') {
      global.document.dispatchEvent(new global.CustomEvent('bigtwo:localechange', {
        detail: { locale: currentLocale }
      }));
    }
  }

  function setLocale(locale, options) {
    var next = normaliseLocale(locale) || 'zh-Hant';
    var changed = next !== currentLocale;
    currentLocale = next;
    updateDocument();
    if (changed || (options && options.force)) {
      notify();
    }
    return currentLocale;
  }

  function register(locale, messages) {
    var normalised = normaliseLocale(locale);
    if (!normalised || !messages || typeof messages !== 'object') {
      return false;
    }
    dictionaries[normalised] = Object.assign(Object.create(null), messages);
    return true;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      return function () {};
    }
    listeners.push(listener);
    return function () {
      var index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    };
  }

  function formatNumber(value, options) {
    try {
      return new Intl.NumberFormat(currentLocale, options).format(value);
    } catch (error) {
      return String(value);
    }
  }

  function formatDate(value, options) {
    var date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    try {
      return new Intl.DateTimeFormat(currentLocale, options || {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(date);
    } catch (error) {
      return date.toLocaleString();
    }
  }

  BigTwo.I18n = {
    SUPPORTED_LOCALES: supported.slice(),
    register: register,
    detectLocale: detectLocale,
    normaliseLocale: normaliseLocale,
    init: function (savedLocale) { return setLocale(detectLocale(savedLocale), { force: true }); },
    setLocale: setLocale,
    getLocale: function () { return currentLocale; },
    t: t,
    translate: translate,
    subscribe: subscribe,
    formatNumber: formatNumber,
    formatDate: formatDate,
    escapeInterpolation: escapeValue,
    getMessages: function (locale) {
      var normalised = normaliseLocale(locale);
      return normalised && dictionaries[normalised]
        ? Object.assign({}, dictionaries[normalised])
        : {};
    }
  };
}(window));
