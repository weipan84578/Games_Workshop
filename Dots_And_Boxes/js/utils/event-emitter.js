(function (ns) {
  "use strict";

  function EventEmitter() {
    this.listeners = {};
  }

  EventEmitter.prototype.on = function (eventName, handler) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(handler);
    return function () {
      this.off(eventName, handler);
    }.bind(this);
  };

  EventEmitter.prototype.off = function (eventName, handler) {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName] = this.listeners[eventName].filter(function (item) {
      return item !== handler;
    });
  };

  EventEmitter.prototype.emit = function (eventName, payload) {
    (this.listeners[eventName] || []).slice().forEach(function (handler) {
      handler(payload);
    });
  };

  ns.EventEmitter = EventEmitter;
  ns.events = ns.events || new EventEmitter();
})(window.DAB = window.DAB || {});
