(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.InputManager = api.InputManager;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var COMMANDS = Object.freeze({
    KeyW: "jump",
    KeyS: "backflip",
    ArrowUp: "aimUp",
    ArrowDown: "aimDown",
    KeyQ: "previousWeapon",
    KeyE: "nextWeapon",
    KeyR: "weapons",
    KeyF: "focus",
    Escape: "pause",
  });

  function isTypingTarget(target) {
    return (
      target &&
      (target.matches("input, select, textarea") || target.isContentEditable)
    );
  }

  /** Normalizes keyboard and pointer input into semantic commands. */
  function InputManager(canvas, camera, callbacks) {
    this.canvas = canvas;
    this.camera = camera;
    this.callbacks = callbacks || {};
    this.keys = new Set();
    this.aimPointer = null;
    this.panPointer = null;
    this.activePointers = new Map();
    this.pinch = null;
    this.listeners = [];
  }

  InputManager.prototype.emit = function (type, payload) {
    if (this.callbacks.command)
      this.callbacks.command(Object.assign({ type: type }, payload || {}));
  };

  InputManager.prototype.listen = function (target, event, handler, options) {
    target.addEventListener(event, handler, options);
    this.listeners.push(function () {
      target.removeEventListener(event, handler, options);
    });
  };

  InputManager.prototype.attach = function () {
    var self = this;
    this.listen(window, "keydown", function (event) {
      if (isTypingTarget(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        ["KeyA", "KeyD", "ArrowLeft", "ArrowRight", "Space"].indexOf(
          event.code,
        ) >= 0 ||
        COMMANDS[event.code]
      )
        event.preventDefault();
      if (
        event.repeat &&
        COMMANDS[event.code] !== "aimUp" &&
        COMMANDS[event.code] !== "aimDown"
      )
        return;
      self.keys.add(event.code);
      if (event.code === "Space") self.emit("chargeStart");
      else if (COMMANDS[event.code]) self.emit(COMMANDS[event.code]);
    });
    this.listen(window, "keyup", function (event) {
      if (isTypingTarget(event.target)) return;
      self.keys.delete(event.code);
      if (event.code === "Space") self.emit("fire");
    });
    this.listen(this.canvas, "pointerdown", function (event) {
      var point = self.localPoint(event);
      var world = self.camera.screenToWorld(point);
      if (event.pointerType === "touch") {
        self.activePointers.set(event.pointerId, point);
        if (self.activePointers.size === 2) {
          var touches = Array.from(self.activePointers.values());
          self.pinch = {
            distance: Math.hypot(
              touches[1].x - touches[0].x,
              touches[1].y - touches[0].y,
            ),
            midpoint: {
              x: (touches[0].x + touches[1].x) / 2,
              y: (touches[0].y + touches[1].y) / 2,
            },
            zoom: self.camera.zoom,
          };
          self.aimPointer = null;
          self.emit("chargeCancel");
          self.canvas.setPointerCapture(event.pointerId);
          return;
        }
      }
      if (event.button === 1 || event.button === 2) {
        self.panPointer = { id: event.pointerId, point: point };
      } else if (
        self.callbacks.canStartAim &&
        self.callbacks.canStartAim(world, point)
      ) {
        self.aimPointer = { id: event.pointerId, start: world };
        self.emit("chargeStart", { pointer: true, world: world });
      } else {
        self.emit("selectTarget", { world: world, screen: point });
      }
      self.canvas.setPointerCapture(event.pointerId);
    });
    this.listen(this.canvas, "pointermove", function (event) {
      var point = self.localPoint(event);
      if (
        event.pointerType === "touch" &&
        self.activePointers.has(event.pointerId)
      ) {
        self.activePointers.set(event.pointerId, point);
        if (self.pinch && self.activePointers.size >= 2) {
          var touches = Array.from(self.activePointers.values()).slice(0, 2);
          var distance = Math.max(
            1,
            Math.hypot(
              touches[1].x - touches[0].x,
              touches[1].y - touches[0].y,
            ),
          );
          var midpoint = {
            x: (touches[0].x + touches[1].x) / 2,
            y: (touches[0].y + touches[1].y) / 2,
          };
          self.camera.pan(
            midpoint.x - self.pinch.midpoint.x,
            midpoint.y - self.pinch.midpoint.y,
          );
          self.camera.setZoom(
            self.pinch.zoom * (distance / self.pinch.distance),
            midpoint,
          );
          self.pinch.midpoint = midpoint;
          return;
        }
      }
      if (self.panPointer && self.panPointer.id === event.pointerId) {
        self.camera.pan(
          point.x - self.panPointer.point.x,
          point.y - self.panPointer.point.y,
        );
        self.panPointer.point = point;
      }
      if (self.aimPointer && self.aimPointer.id === event.pointerId) {
        self.emit("aimPointer", {
          world: self.camera.screenToWorld(point),
          start: self.aimPointer.start,
        });
      }
      if (!self.aimPointer && !self.panPointer)
        self.emit("previewTarget", {
          world: self.camera.screenToWorld(point),
          screen: point,
        });
    });
    this.listen(this.canvas, "pointerup", function (event) {
      if (self.aimPointer && self.aimPointer.id === event.pointerId)
        self.emit("fire", { pointer: true });
      self.aimPointer = null;
      self.panPointer = null;
      self.activePointers.delete(event.pointerId);
      if (self.activePointers.size < 2) self.pinch = null;
    });
    this.listen(this.canvas, "pointercancel", function (event) {
      self.aimPointer = null;
      self.panPointer = null;
      self.activePointers.delete(event.pointerId);
      if (self.activePointers.size < 2) self.pinch = null;
      self.emit("chargeCancel");
    });
    this.listen(this.canvas, "contextmenu", function (event) {
      event.preventDefault();
    });
    this.listen(
      this.canvas,
      "wheel",
      function (event) {
        event.preventDefault();
        self.camera.setZoom(
          self.camera.zoom * Math.exp(-event.deltaY * 0.001),
          self.localPoint(event),
        );
        self.camera.manual = true;
      },
      { passive: false },
    );
  };

  InputManager.prototype.localPoint = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  InputManager.prototype.axis = function () {
    var left = this.keys.has("KeyA") || this.keys.has("ArrowLeft");
    var right = this.keys.has("KeyD") || this.keys.has("ArrowRight");
    return (right ? 1 : 0) - (left ? 1 : 0);
  };

  InputManager.prototype.detach = function () {
    this.listeners.splice(0).forEach(function (dispose) {
      dispose();
    });
    this.keys.clear();
    this.activePointers.clear();
    this.pinch = null;
  };

  return {
    COMMANDS: COMMANDS,
    InputManager: InputManager,
    isTypingTarget: isTypingTarget,
  };
});
