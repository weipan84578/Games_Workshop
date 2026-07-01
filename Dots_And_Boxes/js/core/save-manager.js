(function (ns) {
  "use strict";

  var keys = ns.Constants.STORAGE_KEYS;

  ns.SaveManager = {
    loadSettings: function () {
      var stored = ns.Storage.getJson(keys.SETTINGS, {});
      var settings = Object.assign({}, ns.Constants.DEFAULT_SETTINGS, stored || {});
      var language = ns.Storage.get(keys.LANGUAGE, settings.language);
      settings.language = language || settings.language;
      return settings;
    },

    saveSettings: function (settings) {
      ns.Storage.setJson(keys.SETTINGS, settings);
      ns.Storage.set(keys.LANGUAGE, settings.language);
    },

    saveGame: function (model) {
      if (!model || model.status !== "playing") {
        this.clearGame();
        return;
      }
      ns.Storage.setJson(keys.SAVED_GAME, model);
    },

    loadGame: function () {
      var saved = ns.Storage.getJson(keys.SAVED_GAME, null);
      if (!saved || saved.status !== "playing") {
        return null;
      }
      return saved;
    },

    hasSavedGame: function () {
      return Boolean(this.loadGame());
    },

    clearGame: function () {
      ns.Storage.remove(keys.SAVED_GAME);
    }
  };
})(window.DAB = window.DAB || {});
