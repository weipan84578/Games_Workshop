(function () {
  const listeners = new Map();

  function on(eventName, handler) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }
    listeners.get(eventName).add(handler);
    return () => off(eventName, handler);
  }

  function off(eventName, handler) {
    const set = listeners.get(eventName);
    if (set) {
      set.delete(handler);
    }
  }

  function emit(eventName, payload = {}) {
    const set = listeners.get(eventName);
    if (!set) {
      return;
    }
    set.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Event handler failed for ${eventName}`, error);
      }
    });
  }

  window.EventBus = {
    on,
    off,
    emit,
  };
})();
