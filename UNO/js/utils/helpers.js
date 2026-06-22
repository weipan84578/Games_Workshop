(function () {
  const Helpers = {
    qs(selector, root) {
      return (root || document).querySelector(selector);
    },

    qsa(selector, root) {
      return Array.from((root || document).querySelectorAll(selector));
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    delay(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    },

    shuffle(items) {
      const array = items.slice();
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    uid(prefix) {
      return `${prefix || "id"}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    },

    deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    },

    escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    formatTime(ms) {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    },

    interpolate(template, params) {
      return String(template).replace(/\{(\w+)\}/g, (_, key) => {
        if (!params || params[key] === undefined || params[key] === null) return `{${key}}`;
        return params[key];
      });
    },

    emit(name, detail) {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    },

    on(name, handler) {
      window.addEventListener(name, handler);
      return () => window.removeEventListener(name, handler);
    },

    debounce(fn, wait) {
      let timer = null;
      return function debounced() {
        const args = arguments;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn.apply(this, args), wait);
      };
    },
  };

  window.Helpers = Helpers;
})();
