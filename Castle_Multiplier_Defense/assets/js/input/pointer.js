(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Input = (cg.Input = cg.Input || { listeners: {}, emit: function () {} });
  var canvas = document.getElementById("battle-canvas");
  var aiming = false;
  var cameraDragging = false;
  var lastCameraPoint = null;

  function aimFromEvent(event) {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    Input.emit("AIM_ABSOLUTE", {
      x: cg.Utils.clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: cg.Utils.clamp((event.clientY - rect.top) / rect.height, 0, 1),
    });
  }

  function panCamera(event) {
    if (!canvas || !lastCameraPoint) return;
    var rect = canvas.getBoundingClientRect();
    var dx = (event.clientX - lastCameraPoint.x) / Math.max(1, rect.width);
    var dy = (event.clientY - lastCameraPoint.y) / Math.max(1, rect.height);
    cg.Camera.panBy(-dx, -dy);
    lastCameraPoint = { x: event.clientX, y: event.clientY };
  }

  function releasePointer(event) {
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (error) {
      /* pointer may already be released */
    }
  }

  if (canvas) {
    canvas.addEventListener("pointermove", function (event) {
      if (cameraDragging) {
        event.preventDefault();
        panCamera(event);
        return;
      }
      if (
        root.GameState.screen !== cg.Constants.SCREENS.GAME &&
        root.GameState.screen !== cg.Constants.SCREENS.PAUSE
      )
        return;
      event.preventDefault();
      aimFromEvent(event);
      if (aiming && event.pointerType !== "mouse")
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointerdown", function (event) {
      if (root.GameState.screen !== cg.Constants.SCREENS.GAME) return;
      event.preventDefault();
      canvas.focus();

      if (event.shiftKey || event.button === 1) {
        cameraDragging = true;
        lastCameraPoint = { x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
        return;
      }

      aiming = true;
      aimFromEvent(event);
      if (event.pointerType === "mouse" && event.button === 0)
        Input.emit("FIRE");
      else canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointerup", function (event) {
      if (cameraDragging) {
        cameraDragging = false;
        lastCameraPoint = null;
        releasePointer(event);
        return;
      }
      if (!aiming) return;
      event.preventDefault();
      aiming = false;
      if (event.pointerType !== "mouse") Input.emit("FIRE");
      releasePointer(event);
    });

    canvas.addEventListener("pointercancel", function (event) {
      aiming = false;
      cameraDragging = false;
      lastCameraPoint = null;
      releasePointer(event);
    });

    canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  }
})(window);
