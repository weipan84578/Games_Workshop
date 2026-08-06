(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.Camera = api;
  root.WormsGame.CameraController = api.CameraController;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  var ATTACK_STATES = Object.freeze([
    "ACTION_ACTIVE",
    "WORLD_SETTLING",
    "DAMAGE_SUMMARY",
  ]);

  /**
   * Choose the camera target for the current battle phase.
   * Attack targets are locked until the turn has completely settled.
   */
  function chooseBattleFocus(snapshot, lastImpact) {
    if (!snapshot) return { target: null, locked: false, mode: "none" };
    var attackActive = ATTACK_STATES.indexOf(snapshot.turn.state) >= 0;
    if (!attackActive) {
      return {
        target: snapshot.current || null,
        locked: false,
        mode: "character",
      };
    }

    var projectile = snapshot.projectiles.find(function (candidate) {
      return candidate.delay <= 0;
    });
    projectile = projectile || snapshot.projectiles[0];
    if (projectile) {
      return { target: projectile, locked: true, mode: "projectile" };
    }

    var movingWeapon = snapshot.placed.find(function (entity) {
      return entity.type === "sheep" || entity.triggered;
    });
    if (movingWeapon) {
      return { target: movingWeapon, locked: true, mode: "placed" };
    }

    var effect = snapshot.effects[snapshot.effects.length - 1];
    if (effect) return { target: effect, locked: true, mode: "effect" };
    if (lastImpact) return { target: lastImpact, locked: true, mode: "impact" };

    return {
      target: snapshot.current || null,
      locked: true,
      mode: "character",
    };
  }
  /** Bounded world camera with coordinate conversion and optional smooth follow. */
  function CameraController(viewWidth, viewHeight) {
    this.viewWidth = viewWidth || 1280;
    this.viewHeight = viewHeight || 720;
    this.worldWidth = 1920;
    this.worldHeight = 1080;
    this.x = 960;
    this.y = 540;
    this.zoom = 0.75;
    this.target = null;
    this.manual = false;
  }
  CameraController.prototype.resize = function (width, height) {
    this.viewWidth = width;
    this.viewHeight = height;
    this.constrain();
  };
  CameraController.prototype.constrain = function () {
    var halfW = this.viewWidth / (2 * this.zoom),
      halfH = this.viewHeight / (2 * this.zoom);
    this.x = clamp(
      this.x,
      Math.min(halfW, this.worldWidth / 2),
      Math.max(this.worldWidth - halfW, this.worldWidth / 2),
    );
    this.y = clamp(
      this.y,
      Math.min(halfH, this.worldHeight / 2),
      Math.max(this.worldHeight - halfH, this.worldHeight / 2),
    );
  };
  CameraController.prototype.focus = function (point, immediate) {
    this.target = point;
    this.manual = false;
    if (immediate && point) {
      this.x = point.x;
      this.y = point.y;
      this.constrain();
    }
  };
  CameraController.prototype.update = function (dt, reducedMotion) {
    if (this.target && !this.manual) {
      var speed = reducedMotion ? 1 : Math.min(1, dt * 4.8);
      this.x += (this.target.x - this.x) * speed;
      this.y += (this.target.y - this.y) * speed;
      this.constrain();
    }
  };
  CameraController.prototype.pan = function (dx, dy) {
    this.manual = true;
    this.x -= dx / this.zoom;
    this.y -= dy / this.zoom;
    this.constrain();
  };
  CameraController.prototype.setZoom = function (value, anchor) {
    var before = anchor ? this.screenToWorld(anchor) : null;
    this.zoom = clamp(value, 0.65, 1.5);
    if (before && anchor) {
      var after = this.screenToWorld(anchor);
      this.x += before.x - after.x;
      this.y += before.y - after.y;
    }
    this.constrain();
  };
  CameraController.prototype.worldToScreen = function (point) {
    return {
      x: (point.x - this.x) * this.zoom + this.viewWidth / 2,
      y: (point.y - this.y) * this.zoom + this.viewHeight / 2,
    };
  };
  CameraController.prototype.screenToWorld = function (point) {
    return {
      x: (point.x - this.viewWidth / 2) / this.zoom + this.x,
      y: (point.y - this.viewHeight / 2) / this.zoom + this.y,
    };
  };
  CameraController.prototype.apply = function (context) {
    context.translate(this.viewWidth / 2, this.viewHeight / 2);
    context.scale(this.zoom, this.zoom);
    context.translate(-this.x, -this.y);
  };
  return {
    ATTACK_STATES: ATTACK_STATES,
    chooseBattleFocus: chooseBattleFocus,
    CameraController: CameraController,
  };
});
