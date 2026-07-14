(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Game = BigTwo.Game = BigTwo.Game || {};

  function createController(options) {
    var settings = options || {};
    var state = settings.state ? BigTwo.Utils.deepClone(settings.state) : Game.createNewGame(settings.gameOptions || {});
    var listeners = [];
    var autoSave = settings.autoSave !== false;
    var storageApi = settings.storage || BigTwo.Storage;

    function save() {
      if (!autoSave || !storageApi || typeof storageApi.saveActiveGame !== 'function') {
        return { ok: false, reason: 'storageUnavailable' };
      }
      return storageApi.saveActiveGame(state);
    }

    function notify(action) {
      listeners.slice().forEach(function (listener) {
        listener(state, action);
      });
      if (typeof settings.onChange === 'function') {
        settings.onChange(state, action);
      }
    }

    function dispatch(action) {
      var next = Game.applyAction(state, action);
      state = next;
      save();
      notify(action);
      return state;
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('listener must be a function');
      }
      listeners.push(listener);
      return function () {
        listeners = listeners.filter(function (item) { return item !== listener; });
      };
    }

    if (!settings.state) {
      save();
    }
    return {
      getState: function () { return state; },
      dispatch: dispatch,
      dispatchSafe: function (action) {
        try {
          return { ok: true, state: dispatch(action) };
        } catch (error) {
          return { ok: false, state: state, error: error };
        }
      },
      save: save,
      subscribe: subscribe
    };
  }

  function applyAndSave(state, action, storageApi) {
    var next = Game.applyAction(state, action);
    var api = storageApi || BigTwo.Storage;
    if (api && typeof api.saveActiveGame === 'function') {
      api.saveActiveGame(next);
    }
    return next;
  }

  Game.createController = createController;
  Game.applyAndSave = applyAndSave;
}(window));
