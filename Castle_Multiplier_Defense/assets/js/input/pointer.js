(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var Input = cg.Input = cg.Input || { listeners: {}, emit: function () {} };
    var canvas = document.getElementById("battle-canvas");
    var dragging = false;
    function aimFromEvent(event) {
        if (!canvas) return;
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        Input.emit("AIM_ABSOLUTE", { x: cg.Utils.clamp((event.clientX - rect.left) / rect.width, 0, 1), y: cg.Utils.clamp((event.clientY - rect.top) / rect.height, 0, 1) });
    }
    if (canvas) {
        canvas.addEventListener("pointermove", function (event) { if (root.GameState.screen !== cg.Constants.SCREENS.GAME && root.GameState.screen !== cg.Constants.SCREENS.PAUSE) return; event.preventDefault(); aimFromEvent(event); if (dragging && event.pointerType !== "mouse") canvas.setPointerCapture(event.pointerId); });
        canvas.addEventListener("pointerdown", function (event) { if (root.GameState.screen !== cg.Constants.SCREENS.GAME) return; event.preventDefault(); dragging = true; canvas.focus(); aimFromEvent(event); if (event.pointerType === "mouse" && event.button === 0) Input.emit("FIRE"); else canvas.setPointerCapture(event.pointerId); });
        canvas.addEventListener("pointerup", function (event) { if (!dragging) return; event.preventDefault(); dragging = false; if (event.pointerType !== "mouse") Input.emit("FIRE"); try { canvas.releasePointerCapture(event.pointerId); } catch (error) { /* pointer may already be released */ } });
        canvas.addEventListener("pointercancel", function () { dragging = false; });
        canvas.addEventListener("contextmenu", function (event) { event.preventDefault(); });
    }
}(window));
