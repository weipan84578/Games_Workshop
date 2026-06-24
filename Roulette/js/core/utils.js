(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { RED_NUMBERS, WHEEL_ORDER_AMERICAN, WHEEL_ORDER_EUROPEAN } = R;

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomPick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function formatMoney(value) {
    const rounded = Math.round(value);
    const sign = rounded < 0 ? "-" : "";
    return `${sign}$${Math.abs(rounded).toLocaleString()}`;
  }

  function getWheelOrder(type) {
    return type === "american" ? WHEEL_ORDER_AMERICAN : WHEEL_ORDER_EUROPEAN;
  }

  function normalizeResult(value) {
    return value === "00" ? "00" : Number(value);
  }

  function getResultColor(value) {
    if (value === "00" || Number(value) === 0) return "green";
    return RED_NUMBERS.includes(Number(value)) ? "red" : "black";
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  Object.assign(R, { $, $all, clamp, randomPick, formatMoney, getWheelOrder, normalizeResult, getResultColor, lerp, safeStorageGet, safeStorageSet, structuredCloneSafe });
})();
