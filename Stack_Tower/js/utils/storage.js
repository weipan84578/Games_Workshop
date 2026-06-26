(function (window) {
  'use strict';

  const Storage = {
    get(key, defaultValue = null) {
      try {
        const raw = localStorage.getItem(`stack_${key}`);
        return raw !== null ? JSON.parse(raw) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(`stack_${key}`, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(`stack_${key}`);
      } catch {
        return false;
      }
      return true;
    },

    clear() {
      ['leaderboard', 'settings', 'save', 'best'].forEach((key) => this.remove(key));
    }
  };

  window.Storage = Storage;
})(window);
