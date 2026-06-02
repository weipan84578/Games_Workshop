export class Storage {
  constructor(prefix = "") {
    this.prefix = prefix;
  }

  key(name) {
    return `${this.prefix}${name}`;
  }

  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  set(name, value) {
    localStorage.setItem(this.key(name), JSON.stringify(value));
  }

  remove(name) {
    localStorage.removeItem(this.key(name));
  }

  clear() {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}
