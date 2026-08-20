(function (PSG) {
  'use strict';

  var listeners = {};
  PSG.core.events = {
    on: function (name, callback) {
      listeners[name] = listeners[name] || [];
      listeners[name].push(callback);
      return function () { listeners[name] = (listeners[name] || []).filter(function (item) { return item !== callback; }); };
    },
    emit: function (name, payload) { (listeners[name] || []).slice().forEach(function (callback) { callback(payload); }); }
  };
})(window.PSG);
