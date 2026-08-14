(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Input = cg.Input = cg.Input || { listeners: {} };
    Input.on = function (action, callback) { (Input.listeners[action] = Input.listeners[action] || []).push(callback); };
    Input.emit = function (action, payload) { (Input.listeners[action] || []).slice().forEach(function (callback) { callback(payload); }); };
    document.addEventListener("keydown", function (event) {
        var code = event.code;
        if (code === "Escape") { event.preventDefault(); Input.emit("PAUSE"); return; }
        if (root.GameState.screen !== cg.Constants.SCREENS.GAME || root.GameState.battle && root.GameState.battle.paused) return;
        if (code === "Space") { event.preventDefault(); Input.emit("FIRE"); }
        else if (code === "KeyA" || code === "ArrowLeft") { event.preventDefault(); Input.emit("AIM", { x: -.025, y: 0 }); }
        else if (code === "KeyD" || code === "ArrowRight") { event.preventDefault(); Input.emit("AIM", { x: .025, y: 0 }); }
        else if (code === "KeyW" || code === "ArrowUp") { event.preventDefault(); Input.emit("AIM", { x: 0, y: -.025 }); }
        else if (code === "KeyS" || code === "ArrowDown") { event.preventDefault(); Input.emit("AIM", { x: 0, y: .025 }); }
        else if (code === "KeyE") { event.preventDefault(); Input.emit("SKILL"); }
    });
}(window));
