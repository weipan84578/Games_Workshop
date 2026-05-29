(function (BS) {
  BS.Game.Collision = {
    stepShot: function (shot, grid, metrics, dt) {
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;

      if (shot.x <= metrics.wallLeft) {
        shot.x = metrics.wallLeft;
        shot.vx = Math.abs(shot.vx);
        return { type: "bounce" };
      }

      if (shot.x >= metrics.wallRight) {
        shot.x = metrics.wallRight;
        shot.vx = -Math.abs(shot.vx);
        return { type: "bounce" };
      }

      if (shot.y <= metrics.top + metrics.radius) {
        shot.y = metrics.top + metrics.radius;
        return { type: "ceiling" };
      }

      var hit = null;
      grid.eachBubble(metrics, function (cell) {
        if (hit) {
          return;
        }
        var distance = BS.Utils.distance(shot.x, shot.y, cell.x, cell.y);
        if (distance <= metrics.radius * 1.92) {
          hit = {
            type: "bubble",
            cell: cell
          };
        }
      });

      return hit;
    }
  };
})(window.BubbleShooter);
