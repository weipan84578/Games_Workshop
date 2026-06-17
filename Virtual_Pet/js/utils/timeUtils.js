window.VP = window.VP || {};

VP.TimeUtils = (function () {
  var minute = 60 * 1000;
  var hour = 60 * minute;

  function formatDuration(ms) {
    var safe = Math.max(0, Number(ms) || 0);
    var minutes = Math.floor(safe / minute);
    var hours = Math.floor(safe / hour);

    if (minutes < 1) {
      return "0m";
    }
    if (hours < 1) {
      return minutes + "m";
    }
    return hours + "h " + (minutes % 60) + "m";
  }

  function formatClock(timestamp) {
    if (!timestamp) {
      return "--";
    }
    var date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function now() {
    return Date.now();
  }

  return {
    formatDuration: formatDuration,
    formatClock: formatClock,
    now: now
  };
})();
