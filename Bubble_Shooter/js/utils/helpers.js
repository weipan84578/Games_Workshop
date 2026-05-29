(function (BS) {
  BS.Utils.clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };

  BS.Utils.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  BS.Utils.pick = function (items) {
    return items[Math.floor(Math.random() * items.length)];
  };

  BS.Utils.distance = function (ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  };

  BS.Utils.deepClone = function (value) {
    return JSON.parse(JSON.stringify(value));
  };

  BS.Utils.formatScore = function (value) {
    return String(Math.max(0, value || 0));
  };

  BS.Utils.cssVar = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  BS.Utils.getCanvasPoint = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var source = event;

    if (event.touches && event.touches.length) {
      source = event.touches[0];
    } else if (event.changedTouches && event.changedTouches.length) {
      source = event.changedTouches[0];
    }

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top
    };
  };

  BS.Utils.prevent = function (event) {
    if (event && event.cancelable) {
      event.preventDefault();
    }
  };
})(window.BubbleShooter);
