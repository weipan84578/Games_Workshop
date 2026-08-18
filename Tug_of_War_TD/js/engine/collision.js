(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function nearest(unit, units) {
    var best = null;
    var bestDistance = Infinity;
    (units || []).forEach(function (candidate) {
      if (!candidate.isAlive()) {
        return;
      }
      var distance = Math.abs(candidate.x - unit.x);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    });
    return { unit: best, distance: bestDistance };
  }

  function separate(playerUnits, enemyUnits) {
    playerUnits.forEach(function (player) {
      enemyUnits.forEach(function (enemy) {
        var minimum = (player.def.size + enemy.def.size) * .72;
        var distance = enemy.x - player.x;
        if (distance > 0 && distance < minimum) {
          var correction = (minimum - distance) / 2;
          player.x -= correction;
          enemy.x += correction;
        }
      });
    });
  }

  app.Collision = { nearest: nearest, separate: separate };
})(window);
