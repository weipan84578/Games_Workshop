(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Camera = cg.Camera = {};
    var state = { shake: 0, trauma: 0, zoom: 1 };
    Camera.state = state;
    Camera.shake = function (strength) { if (!root.GameState.settings.cameraShake || root.GameState.settings.reducedMotion || cg.Utils.prefersReducedMotion()) return; state.trauma = Math.max(state.trauma, Math.min(.08, strength || .02)); };
    Camera.impactZoom = function (amount) { if (root.GameState.settings.reducedMotion || cg.Utils.prefersReducedMotion()) return; state.zoom = Math.max(state.zoom, amount || 1.03); };
    Camera.update = function (dt) { state.trauma = Math.max(0, state.trauma - dt * .65); state.shake = state.trauma * state.trauma; state.zoom = cg.Utils.lerp(state.zoom, 1, Math.min(1, dt * 5)); };
    Camera.offset = function (width, height) { return { x: (Math.random() * 2 - 1) * state.shake * width, y: (Math.random() * 2 - 1) * state.shake * height }; };
    Camera.reset = function () { state.shake = 0; state.trauma = 0; state.zoom = 1; };
}(window));
