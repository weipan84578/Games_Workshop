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

  function lateralPositions(count, orientation) {
    var landscape = orientation === "landscape";
    var minimum = landscape ? 0.1 : 0.14;
    var maximum = landscape ? cg.Constants.GATE_LANDSCAPE_UPPER_LIMIT : 0.86;
    var positions = [];
    var attempts = 0;
    var minimumGap = landscape ? 0.08 : 0.14;

    while (positions.length < count && attempts < count * 80) {
      var candidate = cg.Utils.rand(minimum, maximum);
      var separated = positions.every(function (position) {
        return Math.abs(position - candidate) >= minimumGap;
      });

      if (separated) positions.push(candidate);
      attempts += 1;
    }

    if (positions.length < count) {
      positions.length = 0;
      var fallbackStep = (maximum - minimum) / Math.max(1, count - 1);
      for (var fallbackIndex = 0; fallbackIndex < count; fallbackIndex += 1)
        positions.push(minimum + fallbackIndex * fallbackStep);
    }

    return positions.sort(function (first, second) {
      return first - second;
    });
  }

  function randomDepth() {
    var referenceDepth = cg.Utils.rand(
      cg.Constants.GATE_SKY_DEPTH_MIN,
      cg.Constants.GATE_SKY_DEPTH_MAX,
    );
    var scale = cg.Utils.rand(
      cg.Constants.GATE_SKY_DEPTH_SCALE_MIN,
      cg.Constants.GATE_SKY_DEPTH_SCALE_MAX,
    );

    return cg.Utils.clamp(
      referenceDepth * scale,
      0.08,
      cg.Constants.GATE_UPPER_LIMIT,
    );
  }

  function movementBounds(gate) {
    return gate.portrait
      ? { min: 0.14, max: 0.86 }
      : { min: 0.1, max: cg.Constants.GATE_LANDSCAPE_UPPER_LIMIT };
  }

  function chooseWanderTarget(gate) {
    var bounds = movementBounds(gate);
    var distance = gate.portrait
      ? cg.Constants.GATE_WANDER_DISTANCE_PORTRAIT
      : cg.Constants.GATE_WANDER_DISTANCE_LANDSCAPE;

    gate.wanderTarget = cg.Utils.clamp(
      gate.baseLateral + cg.Utils.rand(-distance, distance),
      bounds.min,
      bounds.max,
    );
    gate.wanderTimer = cg.Utils.rand(
      cg.Constants.GATE_WANDER_INTERVAL_MIN,
      cg.Constants.GATE_WANDER_INTERVAL_MAX,
    );
  }

  function updateOne(gate, dt) {
    if (!gate.active) return;

    gate.wanderTimer -= dt;
    if (gate.wanderTimer <= 0) chooseWanderTarget(gate);

    gate.baseLateral +=
      (gate.wanderTarget - gate.baseLateral) *
      Math.min(1, dt * cg.Constants.GATE_WANDER_SPEED);
    gate.flash = Math.max(0, gate.flash - dt);
  }

  function keepSeparated(gates, orientation) {
    var portrait = orientation === "portrait";
    var minimum = portrait ? 0.14 : 0.12;
    var maximum = portrait ? 0.86 : cg.Constants.GATE_LANDSCAPE_UPPER_LIMIT;
    var gap = portrait ? 0.14 : 0.08;
    var positions = gates.map(function (gate) {
      return cg.Utils.clamp(gate.baseLateral, minimum, maximum);
    });

    for (var index = 1; index < positions.length; index += 1) {
      positions[index] = Math.max(positions[index], positions[index - 1] + gap);
    }

    if (positions[positions.length - 1] > maximum) {
      positions[positions.length - 1] = maximum;
      for (
        var reverseIndex = positions.length - 2;
        reverseIndex >= 0;
        reverseIndex -= 1
      ) {
        positions[reverseIndex] = Math.min(
          positions[reverseIndex],
          positions[reverseIndex + 1] - gap,
        );
      }
    }

    if (positions[0] < minimum) {
      positions[0] = minimum;
      for (
        var forwardIndex = 1;
        forwardIndex < positions.length;
        forwardIndex += 1
      ) {
        positions[forwardIndex] = Math.max(
          positions[forwardIndex],
          positions[forwardIndex - 1] + gap,
        );
      }
    }

    gates.forEach(function (gate, index) {
      gate.baseLateral = positions[index];
      if (portrait) gate.x = gate.baseLateral;
      else gate.y = gate.baseLateral;
    });
  }

  Gate.create = function (levelData, orientation, difficultyBias) {
    var portrait = orientation === "portrait";
    var count = cg.Constants.GATE_COUNT_PER_BATTLE;
    var values = shuffledValues(count);
    var positions = lateralPositions(count, orientation);

    return values.map(function (value, index) {
      var depth = randomDepth();
      var lateral = cg.Utils.clamp(
        positions[index] + (difficultyBias || 0) * 0.04,
        portrait ? 0.14 : 0.1,
        portrait ? 0.86 : cg.Constants.GATE_LANDSCAPE_UPPER_LIMIT,
      );

      return {
        id: "gate-" + levelData.number + "-" + index,
        x: portrait ? lateral : depth,
        y: portrait ? depth : lateral,
        w: portrait ? 0.12 : 0.1,
        h: portrait ? 0.12 : 0.07,
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
        wanderTarget: lateral,
        wanderTimer: cg.Utils.rand(
          cg.Constants.GATE_WANDER_INTERVAL_MIN,
          cg.Constants.GATE_WANDER_INTERVAL_MAX,
        ),
      };
    });
  };

  Gate.reflow = function (gates, orientation) {
    var portrait = orientation === "portrait";
    var positions = lateralPositions(gates.length, orientation);

    gates.forEach(function (gate, index) {
      gate.baseLateral = positions[index] || 0.5;
      gate.portrait = portrait;
      gate.x = portrait ? gate.baseLateral : gate.depth;
      gate.y = portrait ? gate.depth : gate.baseLateral;
      gate.w = portrait ? 0.12 : 0.1;
      gate.h = portrait ? 0.12 : 0.07;
      gate.wanderTarget = gate.baseLateral;
      gate.wanderTimer = cg.Utils.rand(
        cg.Constants.GATE_WANDER_INTERVAL_MIN,
        cg.Constants.GATE_WANDER_INTERVAL_MAX,
      );
    });
  };

  Gate.update = function (gate, dt, elapsed) {
    updateOne(gate, dt);
    if (!gate.active) return;

    if (gate.portrait) gate.x = gate.baseLateral;
    else gate.y = gate.baseLateral;
  };

  Gate.updateAll = function (gates, dt, elapsed, orientation) {
    var items = gates || [];
    var currentOrientation =
      orientation || (items[0] && items[0].portrait ? "portrait" : "landscape");

    items.forEach(function (gate) {
      updateOne(gate, dt, elapsed);
    });
    keepSeparated(items, currentOrientation);
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

    projectile.logicalCount =
      factor === 0 ? 0 : Math.max(1, projectile.logicalCount * factor);
    projectile.damageTotal =
      factor === 0 ? 0 : Math.max(1, projectile.damageTotal * factor);
    projectile.multiplier =
      factor === 0 ? 0 : Math.max(1, projectile.multiplier * factor);
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
