(function () {
  "use strict";

  var running = false;
  var last = 0;
  var frameTimes = [];

  function loop(timestamp) {
    if (!running) return;
    var dt = last ? Math.min(0.05, (timestamp - last) / 1000) : 0;
    last = timestamp;

    if (Game.App) {
      Game.App.update(dt);
      Game.App.draw();
      frameTimes.push(dt);
      if (frameTimes.length > 30) frameTimes.shift();
      Game.App.fps = frameTimes.length / frameTimes.reduce(function (sum, value) {
        return sum + value;
      }, 0);
    }

    requestAnimationFrame(loop);
  }

  Game.GameLoop = {
    start: function () {
      if (running) return;
      running = true;
      last = 0;
      requestAnimationFrame(loop);
    },

    stop: function () {
      running = false;
    }
  };
}());
