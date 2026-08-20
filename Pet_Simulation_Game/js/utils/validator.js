(function (PSG) {
  'use strict';

  PSG.utils.validator = {
    name: function (value) {
      var cleaned = String(value == null ? '' : value).trim();
      var length = Array.from(cleaned).length;
      var hasControl = /[\u0000-\u001F\u007F-\u009F\r\n]/.test(cleaned);
      return {
        valid: length >= 1 && length <= 12 && !hasControl,
        value: cleaned,
        length: length,
        reason: !length ? 'required' : length > 12 ? 'tooLong' : hasControl ? 'control' : null
      };
    },
    finiteNumber: function (value, fallback, min, max) {
      var number = Number(value);
      if (!Number.isFinite(number)) number = fallback;
      return PSG.utils.math.clamp(number, min, max);
    }
  };
})(window.PSG);
