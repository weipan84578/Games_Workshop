export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    const listeners = this.listeners.get(eventName) ?? new Set();
    listeners.add(callback);
    this.listeners.set(eventName, listeners);
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    this.listeners.get(eventName)?.delete(callback);
  }

  emit(eventName, payload) {
    for (const callback of this.listeners.get(eventName) ?? []) {
      callback(payload);
    }
  }
}
