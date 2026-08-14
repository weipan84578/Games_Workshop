(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Gate = (cg.Gate = {});

  function shuffledValues(count) {
    var values = cg.Constants.MULTIPLIER_VALUES.slice();

    for (var index = values.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var value = values[index];
      values[index] = values[swapIndex];
      values[swapIndex] = value;
    }

    return values.slice(0, count);
  }

  function lateralPositions(count) {
    if (count === 1) return [0.5];
    if (count === 2) return [0.32, 0.68];
    return [0.2, 0.5, 0.8];
  }

  Gate.create = function (levelData, orientation, difficultyBias) {
    var portrait = orientation === "portrait";
    var maxCount = Math.min(levelData.gateCount || 1, 3);
    var count = cg.Utils.randInt(1, maxCount);
    var values = shuffledValues(count);
    var positions = lateralPositions(count);
    var depth = cg.Utils.rand(0.28, 0.38);

    return values.map(function (value, index) {
      var lateral = cg.Utils.clamp(
        positions[index] + (difficultyBias || 0) * 0.04,
        0.12,
        0.88,
      );

      return {
        id: "gate-" + levelData.number + "-" + index,
        x: portrait ? lateral : depth,
        y: portrait ? depth : lateral,
        w: portrait ? 0.16 : 0.1,
        h: portrait ? 0.12 : 0.16,
        value: value,
        type: cg.Constants.GATE_TYPES.MULTIPLY,
        icon: value >= 15 ? "★" : "↑",
        move: "sway",
        speed: 0.65 + levelData.number * 0.012,
        phase: index * 1.7 + levelData.number * 0.2,
        special: value >= 15,
        active: true,
        flash: 0,
        crossed: 0,
        portrait: portrait,
        depth: depth,
        baseLateral: lateral,
      };
    });
  };

  Gate.reflow = function (gates, orientation) {
    var portrait = orientation === "portrait";
    var positions = lateralPositions(gates.length);

    gates.forEach(function (gate, index) {
      gate.baseLateral = positions[index] || 0.5;
      gate.portrait = portrait;
      gate.x = portrait ? gate.baseLateral : gate.depth;
      gate.y = portrait ? gate.depth : gate.baseLateral;
      gate.w = portrait ? 0.16 : 0.1;
      gate.h = portrait ? 0.12 : 0.16;
    });
  };

  Gate.update = function (gate, dt, elapsed) {
    if (!gate.active) return;

    var wave = Math.sin(elapsed * gate.speed + gate.phase) * 0.025;
    var lateral = cg.Utils.clamp(gate.baseLateral + wave, 0.1, 0.9);

    if (gate.portrait) gate.x = lateral;
    else gate.y = lateral;

    gate.flash = Math.max(0, gate.flash - dt);
  };

  Gate.rect = function (gate) {
    return {
      x: gate.x - gate.w / 2,
      y: gate.y - gate.h / 2,
      w: gate.w,
      h: gate.h,
    };
  };

  Gate.apply = function (gate, projectile) {
    var before = projectile.logicalCount;
    var factor = gate.value;

    projectile.logicalCount = Math.max(1, projectile.logicalCount * factor);
    projectile.damageTotal = Math.max(1, projectile.damageTotal * factor);
    projectile.multiplier = Math.max(1, projectile.multiplier * factor);
    gate.flash = 0.38;
    gate.crossed += 1;

    return {
      before: before,
      after: projectile.logicalCount,
      factor: factor,
      splitCount: factor,
    };
  };
})(window);
