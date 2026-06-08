(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  function pulse(time, speed, min, max) {
    const value = (Math.sin(time * speed) + 1) / 2;
    return root.Helpers.lerp(min, max, value);
  }

  function flash(time, interval) {
    return Math.floor(time / interval) % 2 === 0;
  }

  root.Animator = { pulse, flash };
}());
