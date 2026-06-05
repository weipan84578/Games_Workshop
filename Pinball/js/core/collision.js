(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Physics = Pinball.Physics;
  var Utils = Pinball.Utils;

  function collideCircleSegment(ball, segment, restitution) {
    var hit = collideCircleCapsule(ball, segment.x1, segment.y1, segment.x2, segment.y2, 0, restitution || segment.restitution || 0.78);
    return hit;
  }

  function collideCircleCapsule(ball, x1, y1, x2, y2, radius, restitution) {
    var point = Physics.closestPointOnSegment(ball.x, ball.y, x1, y1, x2, y2);
    var dx = ball.x - point.x;
    var dy = ball.y - point.y;
    var minDist = ball.r + radius;
    var distSq = dx * dx + dy * dy;

    if (distSq > minDist * minDist) {
      return null;
    }

    var dist = Math.sqrt(distSq);
    var nx;
    var ny;

    if (dist > 0.0001) {
      nx = dx / dist;
      ny = dy / dist;
    } else {
      var sx = x2 - x1;
      var sy = y2 - y1;
      var normal = Utils.normalize(-sy, sx);
      nx = normal.x;
      ny = normal.y;
      dist = 0;
    }

    var overlap = minDist - dist + 0.12;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    Physics.reflectVelocity(ball, nx, ny, restitution);

    return {
      nx: nx,
      ny: ny,
      point: point,
      overlap: overlap
    };
  }

  function collideCircleCircle(ball, circle, restitution, impulse) {
    var dx = ball.x - circle.x;
    var dy = ball.y - circle.y;
    var minDist = ball.r + circle.r;
    var distSq = dx * dx + dy * dy;

    if (distSq > minDist * minDist) return null;

    var dist = Math.sqrt(distSq) || 1;
    var nx = dx / dist;
    var ny = dy / dist;
    var overlap = minDist - dist + 0.2;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    Physics.reflectVelocity(ball, nx, ny, restitution);

    if (impulse) {
      Physics.applyImpulse(ball, nx, ny, impulse);
    }

    return { nx: nx, ny: ny, overlap: overlap };
  }

  function collideCircleRect(ball, rect, restitution, impulse) {
    var closestX = Utils.clamp(ball.x, rect.x, rect.x + rect.w);
    var closestY = Utils.clamp(ball.y, rect.y, rect.y + rect.h);
    var dx = ball.x - closestX;
    var dy = ball.y - closestY;
    var minDist = ball.r + (rect.radius || 0);
    var distSq = dx * dx + dy * dy;

    if (distSq > minDist * minDist) return null;

    var nx;
    var ny;
    var dist = Math.sqrt(distSq);

    if (dist > 0.0001) {
      nx = dx / dist;
      ny = dy / dist;
    } else {
      var left = Math.abs(ball.x - rect.x);
      var right = Math.abs(ball.x - (rect.x + rect.w));
      var top = Math.abs(ball.y - rect.y);
      var bottom = Math.abs(ball.y - (rect.y + rect.h));
      var min = Math.min(left, right, top, bottom);
      nx = min === left ? -1 : min === right ? 1 : 0;
      ny = min === top ? -1 : min === bottom ? 1 : 0;
      dist = 0;
    }

    var overlap = minDist - dist + 0.2;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    Physics.reflectVelocity(ball, nx, ny, restitution);

    if (impulse) {
      Physics.applyImpulse(ball, nx, ny, impulse);
    }

    return { nx: nx, ny: ny, overlap: overlap };
  }

  Pinball.Collision = {
    collideCircleSegment: collideCircleSegment,
    collideCircleCapsule: collideCircleCapsule,
    collideCircleCircle: collideCircleCircle,
    collideCircleRect: collideCircleRect
  };
})(window);
