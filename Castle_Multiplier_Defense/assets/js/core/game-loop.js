(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Loop = cg.GameLoop = { running: false, last: 0, fps: 60, frameTime: 0 };
    Loop.start = function () { if (Loop.running) return; Loop.running = true; Loop.last = performance.now(); requestAnimationFrame(Loop.frame); };
    Loop.frame = function (time) {
        if (!Loop.running) return; var delta = Math.min(cg.Constants.MAX_DELTA, Math.max(0, (time - Loop.last) / 1000)); Loop.last = time; Loop.frameTime = delta; Loop.fps = delta > 0 ? cg.Utils.lerp(Loop.fps, 1 / delta, .08) : Loop.fps; if (root.GameState.screen === cg.Constants.SCREENS.GAME && cg.Battle && cg.Battle.active) cg.Battle.update(delta); if (cg.Battle && (root.GameState.screen === cg.Constants.SCREENS.GAME || root.GameState.screen === cg.Constants.SCREENS.PAUSE)) cg.Battle.render(); if (cg.DEBUG && root.GameState.screen === cg.Constants.SCREENS.GAME && cg.App) cg.App.updateDebug(Loop.fps, delta); requestAnimationFrame(Loop.frame);
    };
}(window));
