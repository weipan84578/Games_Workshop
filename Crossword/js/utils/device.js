(function () {
  function isTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function isSmallViewport() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  window.Device = {
    isTouch,
    isSmallViewport,
  };
})();
