(function (PSG) {
  'use strict';

  function interpolate(text, values) {
    return String(text).replace(/\{([\w]+)\}/g, function (_, key) { return values && values[key] != null ? values[key] : '{' + key + '}'; });
  }
  PSG.i18n.current = 'zh-Hant';
  PSG.i18n.t = function (key, values) {
    var dictionary = PSG.i18n.languages[PSG.i18n.current] || PSG.i18n.languages['zh-Hant'];
    var value = dictionary[key];
    if (value == null) value = PSG.i18n.languages['zh-Hant'][key];
    if (value == null) {
      if (PSG.env && PSG.env.development && window.console) console.error('Missing i18n key:', key);
      value = PSG.env && PSG.env.development ? '[missing:' + key + ']' : key;
    }
    return interpolate(value, values || {});
  };
  PSG.i18n.set = function (language) {
    var previous = PSG.i18n.current;
    PSG.i18n.current = PSG.i18n.languages[language] ? language : 'zh-Hant';
    document.documentElement.lang = PSG.i18n.current;
    document.title = PSG.i18n.t('app.title');
    if (previous !== PSG.i18n.current && PSG.core.events) PSG.core.events.emit('language:changed', PSG.i18n.current);
  };
  PSG.i18n.detect = function () {
    var lang = String(navigator.language || '').toLowerCase();
    if (lang.indexOf('ja') === 0) return 'ja';
    if (lang.indexOf('en') === 0) return 'en';
    return 'zh-Hant';
  };
})(window.PSG);
