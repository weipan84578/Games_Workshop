(function (ns) {
  "use strict";

  function getSpeedProfile(profile) {
    var table = ns.Constants.TABLE;
    return {
      minPuckSpeed: profile && profile.minPuckSpeed ? profile.minPuckSpeed : table.MIN_PUCK_SPEED,
      maxPuckSpeed: profile && profile.maxPuckSpeed ? profile.maxPuckSpeed : table.MAX_PUCK_SPEED,
      rallyAcceleration: profile && profile.rallyAcceleration ? profile.rallyAcceleration : table.RALLY_ACCELERATION_PER_SECOND
    };
  }

  function capVelocity(puck, profile) {
    var max = getSpeedProfile(profile).maxPuckSpeed;
    var speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
    if (speed > max) {
      puck.vx = (puck.vx / speed) * max;
      puck.vy = (puck.vy / speed) * max;
    }
  }

  function maintainActiveSpeed(puck, dt, profile) {
    var speedProfile = getSpeedProfile(profile);
    var speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
    if (speed < 0.001) {
      var angle = Math.random() * Math.PI * 2;
      puck.vx = Math.cos(angle) * speedProfile.minPuckSpeed;
      puck.vy = Math.sin(angle) * speedProfile.minPuckSpeed;
      return;
    }

    var targetSpeed = Math.max(speed, speedProfile.minPuckSpeed);
    targetSpeed *= Math.pow(speedProfile.rallyAcceleration, dt);
    targetSpeed = Math.min(targetSpeed, speedProfile.maxPuckSpeed);
    puck.vx = (puck.vx / speed) * targetSpeed;
    puck.vy = (puck.vy / speed) * targetSpeed;
  }

  function collideMallet(puck, mallet) {
    var table = ns.Constants.TABLE;
    var dx = puck.x - mallet.x;
    var dy = puck.y - mallet.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var minimum = puck.radius + mallet.radius;

    if (distance >= minimum || distance <= 0.0001) {
      return false;
    }

    var nx = dx / distance;
    var ny = dy / distance;
    var overlap = minimum - distance;
    puck.x += nx * overlap;
    puck.y += ny * overlap;

    var relativeVx = puck.vx - mallet.vx;
    var relativeVy = puck.vy - mallet.vy;
    var velocityAlongNormal = relativeVx * nx + relativeVy * ny;
    if (velocityAlongNormal > 0) {
      velocityAlongNormal = 0;
    }

    var impulse = -(1 + table.MALLET_RESTITUTION) * velocityAlongNormal;
    puck.vx += impulse * nx + mallet.vx * 0.28;
    puck.vy += impulse * ny + mallet.vy * 0.28;

    var edgeFactor = (dx / minimum) * 120;
    puck.vx += edgeFactor;
    capVelocity(puck);
    return true;
  }

  function updatePuck(puck, dt, profile) {
    var table = ns.Constants.TABLE;
    var events = [];

    puck.trail.push({ x: puck.x, y: puck.y, life: 1 });
    if (puck.trail.length > 14) {
      puck.trail.shift();
    }

    maintainActiveSpeed(puck, dt, profile);
    puck.x += puck.vx * dt;
    puck.y += puck.vy * dt;

    var insideGoal = ns.Table.isInsideGoalX(puck.x);
    if (puck.x - puck.radius <= 0) {
      puck.x = puck.radius;
      puck.vx = Math.abs(puck.vx) * table.WALL_RESTITUTION;
      events.push({ type: "wall", x: puck.x, y: puck.y });
    } else if (puck.x + puck.radius >= table.WIDTH) {
      puck.x = table.WIDTH - puck.radius;
      puck.vx = -Math.abs(puck.vx) * table.WALL_RESTITUTION;
      events.push({ type: "wall", x: puck.x, y: puck.y });
    }

    if (puck.y - puck.radius <= 0 && !insideGoal) {
      puck.y = puck.radius;
      puck.vy = Math.abs(puck.vy) * table.WALL_RESTITUTION;
      events.push({ type: "wall", x: puck.x, y: puck.y });
    } else if (puck.y + puck.radius >= table.HEIGHT && !insideGoal) {
      puck.y = table.HEIGHT - puck.radius;
      puck.vy = -Math.abs(puck.vy) * table.WALL_RESTITUTION;
      events.push({ type: "wall", x: puck.x, y: puck.y });
    }

    if (insideGoal && puck.y < -puck.radius) {
      events.push({ type: "goal", scorer: "player", x: puck.x, y: 0 });
    }
    if (insideGoal && puck.y > table.HEIGHT + puck.radius) {
      events.push({ type: "goal", scorer: "ai", x: puck.x, y: table.HEIGHT });
    }

    capVelocity(puck, profile);
    return events;
  }

  ns.Physics = {
    updatePuck: updatePuck,
    collideMallet: collideMallet,
    maintainActiveSpeed: maintainActiveSpeed,
    capVelocity: capVelocity
  };
})(window.AirHockey = window.AirHockey || {});
