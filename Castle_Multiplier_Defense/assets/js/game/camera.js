(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Camera = (cg.Camera = {});
  var state = {
    shake: 0,
    trauma: 0,
    zoom: cg.Constants.DEFAULT_CAMERA_ZOOM,
    targetZoom: cg.Constants.DEFAULT_CAMERA_ZOOM,
    pan: { x: 0, y: 0 },
    targetPan: { x: 0, y: 0 },
    mode: "side",
  };

  Camera.state = state;

  function clampPan(value) {
    return cg.Utils.clamp(
      value,
      -cg.Constants.CAMERA_PAN_LIMIT,
      cg.Constants.CAMERA_PAN_LIMIT,
    );
  }

  function setSideTarget(side, orientation) {
    if (orientation === "portrait") {
      state.targetPan.x = 0;
      state.targetPan.y = side === "player" ? 0.34 : -0.34;
    } else {
      state.targetPan.x = side === "player" ? -0.28 : 0.28;
      state.targetPan.y = 0;
    }
    state.targetZoom = cg.Constants.DEFAULT_CAMERA_ZOOM;
  }

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

  Camera.returnToSide = function (side, orientation, force) {
    if (state.mode === "manual" && !force) return;
    state.mode = "side";
    setSideTarget(side, orientation);
  };

  Camera.snapToSide = function (side, orientation) {
    state.mode = "side";
    setSideTarget(side, orientation);
    state.pan.x = state.targetPan.x;
    state.pan.y = state.targetPan.y;
    state.zoom = state.targetZoom;
  };

  Camera.follow = function (point) {
    if (state.mode === "manual") return;
    state.mode = "follow";
    state.targetPan.x = clampPan(point.x - 0.5);
    state.targetPan.y = clampPan(point.y - 0.5);
    state.targetZoom = cg.Constants.DEFAULT_CAMERA_ZOOM;
  };

  Camera.panBy = function (dx, dy) {
    state.mode = "manual";
    state.targetPan.x = clampPan(state.targetPan.x + (dx || 0));
    state.targetPan.y = clampPan(state.targetPan.y + (dy || 0));
  };

  Camera.setPan = function (x, y) {
    state.mode = "manual";
    state.targetPan.x = clampPan(x || 0);
    state.targetPan.y = clampPan(y || 0);
  };

  Camera.zoomBy = function (amount) {
    state.mode = "manual";
    state.targetZoom = cg.Utils.clamp(
      state.targetZoom + (amount || 0),
      cg.Constants.MIN_CAMERA_ZOOM,
      cg.Constants.MAX_CAMERA_ZOOM,
    );
  };

  Camera.setZoom = function (value) {
    state.mode = "manual";
    state.targetZoom = cg.Utils.clamp(
      Number(value) || cg.Constants.DEFAULT_CAMERA_ZOOM,
      cg.Constants.MIN_CAMERA_ZOOM,
      cg.Constants.MAX_CAMERA_ZOOM,
    );
  };

  Camera.overview = function () {
    state.mode = "manual";
    state.targetPan.x = 0;
    state.targetPan.y = 0;
    state.targetZoom = cg.Constants.OVERVIEW_CAMERA_ZOOM;
  };

  Camera.resetView = function (side, orientation) {
    Camera.snapToSide(side, orientation);
  };

  Camera.update = function (dt) {
    state.trauma = Math.max(0, state.trauma - dt * 0.65);
    state.shake = state.trauma * state.trauma;
    state.zoom = cg.Utils.lerp(
      state.zoom,
      state.targetZoom,
      Math.min(1, dt * 5),
    );
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
    state.zoom = cg.Constants.DEFAULT_CAMERA_ZOOM;
    state.targetZoom = cg.Constants.DEFAULT_CAMERA_ZOOM;
    state.pan.x = 0;
    state.pan.y = 0;
    state.targetPan.x = 0;
    state.targetPan.y = 0;
    state.mode = "side";
  };
})(window);
