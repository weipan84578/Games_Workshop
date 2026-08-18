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

  app.Collision = { nearest: nearest };
})(window);
