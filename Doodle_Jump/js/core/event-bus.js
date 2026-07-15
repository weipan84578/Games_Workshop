(function (Game) {
  "use strict";
  function EventBus() {
    this.listeners = Object.create(null);
  }
  EventBus.prototype.on = function (event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
    var self = this;
    return function () {
      self.off(event, handler);
    };
  };
  EventBus.prototype.off = function (event, handler) {
    var list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter(function (item) {
      return item !== handler;
    });
  };
  EventBus.prototype.emit = function (event, payload) {
    var list = (this.listeners[event] || []).slice();
    list.forEach(function (handler) {
      try {
        handler(payload);
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    });
  };
  EventBus.prototype.clear = function () {
    this.listeners = Object.create(null);
  };
  Game.EventBus = EventBus;
})(window.DJGame);
