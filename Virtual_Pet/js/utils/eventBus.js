window.VP = window.VP || {};

VP.EventBus = (function () {
  var listeners = {};

  function on(eventName, handler) {
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(handler);
    return function () {
      off(eventName, handler);
    };
  }

  function off(eventName, handler) {
    if (!listeners[eventName]) {
      return;
    }
    listeners[eventName] = listeners[eventName].filter(function (item) {
      return item !== handler;
    });
  }

  function emit(eventName, payload) {
    (listeners[eventName] || []).slice().forEach(function (handler) {
      handler(payload);
    });
  }

  return {
    on: on,
    off: off,
    emit: emit
  };
})();
