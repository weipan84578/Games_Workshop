(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Utils = BigTwo.Utils = BigTwo.Utils || {};

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isCard(value) {
    return isPlainObject(value) &&
      typeof value.id === 'string' &&
      Config.RANKS.indexOf(value.rank) !== -1 &&
      Config.SUITS.indexOf(value.suit) !== -1 &&
      value.id === value.rank + '-' + value.suit;
  }

  function isFiniteInteger(value, minimum, maximum) {
    return Number.isInteger(value) && value >= minimum && value <= maximum;
  }

  function validateSettings(settings) {
    return isPlainObject(settings) &&
      Config.AI.difficulties.indexOf(settings.difficulty) !== -1 &&
      ['realistic', 'midnight', 'sakura', 'cuteParty'].indexOf(settings.theme) !== -1 &&
      ['zh-Hant', 'en', 'ja'].indexOf(settings.locale) !== -1 &&
      typeof settings.animationsEnabled === 'boolean' &&
      typeof settings.musicEnabled === 'boolean' &&
      isFiniteInteger(settings.musicVolume, 0, 100) &&
      typeof settings.sfxEnabled === 'boolean' &&
      isFiniteInteger(settings.sfxVolume, 0, 100) &&
      ['auto', 'track1', 'track2', 'track3', 'track4'].indexOf(settings.musicTrack) !== -1;
  }

  function normalizeSettings(settings) {
    var source = isPlainObject(settings) ? settings : {};
    var output = Utils.deepClone(Config.DEFAULT_SETTINGS);
    Object.keys(output).forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        output[key] = source[key];
      }
    });
    output.musicVolume = Math.round(Number(output.musicVolume));
    output.sfxVolume = Math.round(Number(output.sfxVolume));
    return validateSettings(output) ? output : Utils.deepClone(Config.DEFAULT_SETTINGS);
  }

  Utils.Validation = {
    isPlainObject: isPlainObject,
    isCard: isCard,
    isFiniteInteger: isFiniteInteger,
    validateSettings: validateSettings,
    normalizeSettings: normalizeSettings
  };
  BigTwo.Validation = Utils.Validation;
}(window));
