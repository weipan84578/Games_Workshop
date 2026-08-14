(function (root) {
  "use strict";
  var cg = (root.CastleGame = root.CastleGame || {});
  var Collision = (cg.Collision = {});
  Collision.segmentVsRect = function (x1, y1, x2, y2, rect) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var t0 = 0;
    var t1 = 1;
    var axes = [
      [-dx, x1 - rect.x],
      [dx, rect.x + rect.w - x1],
      [-dy, y1 - rect.y],
      [dy, rect.y + rect.h - y1],
    ];
    for (var i = 0; i < axes.length; i += 1) {
      var p = axes[i][0];
      var q = axes[i][1];
      if (Math.abs(p) < 0.000001) {
        if (q < 0) return false;
        continue;
      }
      var ratio = q / p;
      if (p < 0) {
        if (ratio > t1) return false;
        if (ratio > t0) t0 = ratio;
      } else {
        if (ratio < t0) return false;
        if (ratio < t1) t1 = ratio;
      }
    }
    return true;
  };
  Collision.circleHitsPoint = function (circle, point, radius) {
    return (
      Math.hypot(circle.x - point.x, circle.y - point.y) <=
      circle.radius + radius
    );
  };
  Collision.segmentVsCircle = function (x1, y1, x2, y2, point, radius) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var lengthSquared = dx * dx + dy * dy;
    var ratio = lengthSquared
      ? ((point.x - x1) * dx + (point.y - y1) * dy) / lengthSquared
      : 0;
    var clampedRatio = Math.max(0, Math.min(1, ratio));
    var closestX = x1 + dx * clampedRatio;
    var closestY = y1 + dy * clampedRatio;

    return Math.hypot(closestX - point.x, closestY - point.y) <= radius;
  };
  Collision.projectileHitsCastle = function (
    projectile,
    castlePoint,
    castleRadius,
  ) {
    return Collision.segmentVsCircle(
      projectile.prevX,
      projectile.prevY,
      projectile.x,
      projectile.y,
      castlePoint,
      castleRadius,
    );
  };
})(window);
