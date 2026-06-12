(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Collision = {
    circleCircle(a, b) {
      const r = a.r + b.r;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy <= r * r;
    },

    circleRect(circle, rect) {
      const x = Game.Helpers.clamp(circle.x, rect.x, rect.x + rect.w);
      const y = Game.Helpers.clamp(circle.y, rect.y, rect.y + rect.h);
      const dx = circle.x - x;
      const dy = circle.y - y;
      return dx * dx + dy * dy <= circle.r * circle.r;
    },

    pointRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }
  };
})(window);
