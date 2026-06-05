(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var Utils = Pinball.Utils;

  function limitSpeed(body, maxSpeed) {
    var speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
    if (speed > maxSpeed) {
      var scale = maxSpeed / speed;
      body.vx *= scale;
      body.vy *= scale;
    }
  }

  function reflectVelocity(body, nx, ny, restitution) {
    var vn = body.vx * nx + body.vy * ny;
    if (vn >= 0) return false;
    body.vx -= (1 + restitution) * vn * nx;
    body.vy -= (1 + restitution) * vn * ny;
    return true;
  }

  function applyImpulse(body, nx, ny, force) {
    body.vx += nx * force;
    body.vy += ny * force;
  }

  function closestPointOnSegment(px, py, ax, ay, bx, by) {
    var abx = bx - ax;
    var aby = by - ay;
    var denom = abx * abx + aby * aby || 1;
    var t = ((px - ax) * abx + (py - ay) * aby) / denom;
    t = Utils.clamp(t, 0, 1);
    return {
      x: ax + abx * t,
      y: ay + aby * t,
      t: t
    };
  }

  function anglePoint(x, y, length, angle) {
    return {
      x: x + Math.cos(angle) * length,
      y: y + Math.sin(angle) * length
    };
  }

  Pinball.Physics = {
    limitSpeed: limitSpeed,
    reflectVelocity: reflectVelocity,
    applyImpulse: applyImpulse,
    closestPointOnSegment: closestPointOnSegment,
    anglePoint: anglePoint
  };
})(window);
