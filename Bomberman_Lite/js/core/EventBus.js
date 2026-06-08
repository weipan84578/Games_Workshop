(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class EventBus {
    constructor() {
      this.listeners = {};
    }

    on(type, handler) {
      if (!this.listeners[type]) this.listeners[type] = new Set();
      this.listeners[type].add(handler);
      return () => this.off(type, handler);
    }

    off(type, handler) {
      if (this.listeners[type]) this.listeners[type].delete(handler);
    }

    emit(type, payload) {
      if (!this.listeners[type]) return;
      this.listeners[type].forEach((handler) => handler(payload));
    }
  }

  root.EventBus = EventBus;
}());
