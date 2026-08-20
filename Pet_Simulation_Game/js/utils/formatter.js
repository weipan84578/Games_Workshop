(function (PSG) {
  'use strict';

  PSG.utils.formatter = {
    number: function (value) {
      var language = (PSG.i18n && PSG.i18n.current) || 'zh-Hant';
      return new Intl.NumberFormat(language).format(value);
    },
    dateTime: function (value) {
      var language = (PSG.i18n && PSG.i18n.current) || 'zh-Hant';
      try {
        return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
      } catch (error) {
        return String(value || '—');
      }
    },
    percent: function (value, digits) { return (value * 100).toFixed(digits == null ? 1 : digits) + '%'; }
  };
})(window.PSG);
