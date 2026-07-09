(function registerEventBus(app) {
  "use strict";

  const listeners = new Map();

  app.EventBus = {
    on(eventName, handler) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Set());
      }
      listeners.get(eventName).add(handler);
      return () => this.off(eventName, handler);
    },

    off(eventName, handler) {
      listeners.get(eventName)?.delete(handler);
    },

    emit(eventName, payload) {
      listeners.get(eventName)?.forEach((handler) => handler(payload));
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
