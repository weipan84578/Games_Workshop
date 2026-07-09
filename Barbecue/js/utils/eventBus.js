(function exposeEventBus(root, factory) {
  var EventBus = factory();
  root.BBQ = root.BBQ || {};
  root.BBQ.EventBus = EventBus;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = EventBus;
  }
})(typeof window !== "undefined" ? window : globalThis, function eventBusFactory() {
  "use strict";

  function EventBus() {
    this.listeners = new Map();
  }

  EventBus.prototype.on = function on(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);

    return function unsubscribe() {
      var set = this.listeners.get(type);
      if (set) {
        set.delete(handler);
      }
    }.bind(this);
  };

  EventBus.prototype.emit = function emit(type, payload) {
    var set = this.listeners.get(type);
    if (!set) {
      return;
    }
    Array.from(set).forEach(function notify(handler) {
      handler(payload);
    });
  };

  EventBus.prototype.clear = function clear() {
    this.listeners.clear();
  };

  return EventBus;
});
