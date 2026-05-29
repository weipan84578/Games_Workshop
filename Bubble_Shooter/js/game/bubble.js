(function (BS) {
  BS.Game.Bubble = function (color, x, y, radius) {
    this.color = color;
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 18;
    this.vx = 0;
    this.vy = 0;
  };

  BS.Game.getBubbleColor = function (index) {
    return BS.Utils.cssVar("--bubble-" + ((index % 6) + 1));
  };

  BS.Game.makeColorPool = function (count) {
    var pool = [];
    for (var i = 0; i < count; i += 1) {
      pool.push(i);
    }
    return pool;
  };
})(window.BubbleShooter);
