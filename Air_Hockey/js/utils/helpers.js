(function (ns) {
  "use strict";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function debounce(fn, delay) {
    var timer = 0;
    return function () {
      var args = arguments;
      var context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function throttle(fn, interval) {
    var last = 0;
    var trailing = 0;
    return function () {
      var now = performance.now();
      var args = arguments;
      var context = this;
      if (now - last >= interval) {
        last = now;
        fn.apply(context, args);
      } else {
        window.clearTimeout(trailing);
        trailing = window.setTimeout(function () {
          last = performance.now();
          fn.apply(context, args);
        }, interval - (now - last));
      }
    };
  }

  function pointerToCanvas(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    var point = event.touches && event.touches.length ? event.touches[0] : event;
    return {
      x: ((point.clientX - rect.left) / rect.width) * canvas.width,
      y: ((point.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function deepGet(object, path) {
    return path.split(".").reduce(function (current, key) {
      return current && Object.prototype.hasOwnProperty.call(current, key) ? current[key] : undefined;
    }, object);
  }

  function normalizeHexColor(value, fallback) {
    if (!value || typeof value !== "string") {
      return fallback;
    }
    return value.trim() || fallback;
  }

  ns.Helpers = {
    $: $,
    $$: $$,
    clamp: clamp,
    lerp: lerp,
    distance: distance,
    randomBetween: randomBetween,
    debounce: debounce,
    throttle: throttle,
    pointerToCanvas: pointerToCanvas,
    deepGet: deepGet,
    normalizeHexColor: normalizeHexColor
  };
})(window.AirHockey = window.AirHockey || {});
