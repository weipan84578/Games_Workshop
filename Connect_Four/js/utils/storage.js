(function initStorage(global) {
  const CF = global.CF || (global.CF = {});

  function isAvailable() {
    try {
      const key = "__connectfour_storage_test__";
      global.localStorage.setItem(key, "1");
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  const available = isAvailable();
  const memoryStore = new Map();

  function getRaw(key) {
    if (!available) {
      return memoryStore.has(key) ? memoryStore.get(key) : null;
    }
    return global.localStorage.getItem(key);
  }

  function setRaw(key, value) {
    if (!available) {
      memoryStore.set(key, value);
      return;
    }
    global.localStorage.setItem(key, value);
  }

  function remove(key) {
    if (!available) {
      memoryStore.delete(key);
      return;
    }
    global.localStorage.removeItem(key);
  }

  function read(key, fallback) {
    const raw = getRaw(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      remove(key);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      setRaw(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  CF.storage = { read, write, remove, available };
})(window);
