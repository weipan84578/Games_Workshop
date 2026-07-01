(function (ns) {
  "use strict";

  var storageAvailable = true;

  function safeCall(operation, fallback) {
    try {
      return operation();
    } catch (error) {
      storageAvailable = false;
      console.warn("localStorage unavailable:", error);
      return fallback;
    }
  }

  ns.Storage = {
    isAvailable: function () {
      return storageAvailable;
    },
    get: function (key, fallback) {
      return safeCall(function () {
        var value = window.localStorage.getItem(key);
        return value === null ? fallback : value;
      }, fallback);
    },
    set: function (key, value) {
      return safeCall(function () {
        window.localStorage.setItem(key, String(value));
        return true;
      }, false);
    },
    remove: function (key) {
      return safeCall(function () {
        window.localStorage.removeItem(key);
        return true;
      }, false);
    },
    getJson: function (key, fallback) {
      var value = this.get(key, null);
      if (value === null) {
        return fallback;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn("Invalid JSON in localStorage:", key, error);
        return fallback;
      }
    },
    setJson: function (key, value) {
      return this.set(key, JSON.stringify(value));
    }
  };
})(window.DAB = window.DAB || {});
