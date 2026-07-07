(function initHelpers(global) {
  const CF = global.CF || (global.CF = {});

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function delay(ms) {
    return new Promise((resolve) => global.setTimeout(resolve, ms));
  }

  function sample(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function debounce(fn, wait) {
    let timer = null;
    return function debounced(...args) {
      global.clearTimeout(timer);
      timer = global.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
  }

  CF.helpers = { deepClone, clamp, delay, sample, debounce, escapeHtml, formatPercent };
})(window);
