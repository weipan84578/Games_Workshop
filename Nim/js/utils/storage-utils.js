(function (NimGame) {
  'use strict';

  var Storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn('Storage read failed:', key, error);
        return fallback;
      }
    },

    set: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Storage write failed:', key, error);
        return false;
      }
    },

    remove: function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn('Storage remove failed:', key, error);
      }
    }
  };

  NimGame.Storage = Storage;
}(window.NimGame = window.NimGame || {}));
