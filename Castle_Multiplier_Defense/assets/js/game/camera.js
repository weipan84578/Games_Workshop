(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Camera = (cg.Camera = {});
  var state = {
    shake: 0,
    trauma: 0,
    zoom: 1,
    pan: { x: 0, y: 0 },
    targetPan: { x: 0, y: 0 },
  };

  Camera.state = state;

  Camera.shake = function (strength) {
    if (
      !root.GameState.settings.cameraShake ||
      root.GameState.settings.reducedMotion ||
      cg.Utils.prefersReducedMotion()
    ) {
      return;
    }

    state.trauma = Math.max(state.trauma, Math.min(0.08, strength || 0.02));
  };

  Camera.impactZoom = function (amount) {
    if (
      root.GameState.settings.reducedMotion ||
      cg.Utils.prefersReducedMotion()
    ) {
      return;
    }

    state.zoom = Math.max(state.zoom, amount || 1.03);
  };

  Camera.returnToSide = function (side, orientation) {
    if (orientation === "portrait") {
      state.targetPan.x = 0;
      state.targetPan.y = side === "player" ? 0.22 : -0.22;
      return;
    }

    state.targetPan.x = side === "player" ? -0.22 : 0.22;
    state.targetPan.y = 0;
  };

  Camera.snapToSide = function (side, orientation) {
    Camera.returnToSide(side, orientation);
    state.pan.x = state.targetPan.x;
    state.pan.y = state.targetPan.y;
  };

  Camera.follow = function (point) {
    state.targetPan.x = cg.Utils.clamp(point.x - 0.5, -0.3, 0.3);
    state.targetPan.y = cg.Utils.clamp(point.y - 0.5, -0.3, 0.3);
  };

  Camera.update = function (dt) {
    state.trauma = Math.max(0, state.trauma - dt * 0.65);
    state.shake = state.trauma * state.trauma;
    state.zoom = cg.Utils.lerp(state.zoom, 1, Math.min(1, dt * 5));
    state.pan.x = cg.Utils.lerp(state.pan.x, state.targetPan.x, dt * 4);
    state.pan.y = cg.Utils.lerp(state.pan.y, state.targetPan.y, dt * 4);
  };

  Camera.offset = function (width, height) {
    return {
      x: (Math.random() * 2 - 1) * state.shake * width,
      y: (Math.random() * 2 - 1) * state.shake * height,
    };
  };

  Camera.reset = function () {
    state.shake = 0;
    state.trauma = 0;
    state.zoom = 1;
    state.pan.x = 0;
    state.pan.y = 0;
    state.targetPan.x = 0;
    state.targetPan.y = 0;
  };
})(window);
