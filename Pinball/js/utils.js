(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function distance(ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function normalize(x, y) {
    var len = Math.sqrt(x * x + y * y) || 1;
    return { x: x / len, y: y / len, length: len };
  }

  function dot(ax, ay, bx, by) {
    return ax * bx + ay * by;
  }

  function formatScore(score) {
    return Math.max(0, Math.floor(score)).toLocaleString("en-US");
  }

  function readNumber(value, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function loadJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadNumber(key, fallback) {
    try {
      return readNumber(window.localStorage.getItem(key), fallback);
    } catch (error) {
      return fallback;
    }
  }

  function saveNumber(key, value) {
    try {
      window.localStorage.setItem(key, String(Math.floor(value)));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearStorage(keys) {
    keys.forEach(function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        return false;
      }
      return true;
    });
  }

  function getCssColor(name, fallback) {
    var style = window.getComputedStyle(document.body);
    var value = style.getPropertyValue(name).trim();
    return value || fallback;
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  Pinball.Utils = {
    clamp: clamp,
    lerp: lerp,
    distance: distance,
    normalize: normalize,
    dot: dot,
    formatScore: formatScore,
    readNumber: readNumber,
    loadJSON: loadJSON,
    saveJSON: saveJSON,
    loadNumber: loadNumber,
    saveNumber: saveNumber,
    clearStorage: clearStorage,
    getCssColor: getCssColor,
    vibrate: vibrate
  };
})(window);
