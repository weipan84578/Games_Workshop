(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function EventBus() {
    this.listeners = {};
  }

  EventBus.prototype.on = function (eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    return function () {
      this.off(eventName, callback);
    }.bind(this);
  };

  EventBus.prototype.off = function (eventName, callback) {
    var list = this.listeners[eventName] || [];
    this.listeners[eventName] = list.filter(function (listener) {
      return listener !== callback;
    });
  };

  EventBus.prototype.emit = function (eventName, payload) {
    (this.listeners[eventName] || []).slice().forEach(function (listener) {
      listener(payload);
    });
  };

  app.EventBus = EventBus;
  app.events = new EventBus();
})(window);
