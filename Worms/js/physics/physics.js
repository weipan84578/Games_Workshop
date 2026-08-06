(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.PhysicsEngine = api.PhysicsEngine;
  root.WormsGame.Physics = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var FIXED_DT = 1 / 120;
  var GRAVITY = 900;
  var CHARACTER_RADIUS = 18;

  /** Clamp a value between two inclusive boundaries. */
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /** Calculate linearly attenuated blast damage. */
  function explosionDamage(maxDamage, radius, distance) {
    if (radius <= 0 || distance >= radius) return 0;
    return Math.max(
      0,
      Math.ceil(maxDamage * (1 - Math.max(0, distance) / radius)),
    );
  }

  /** Calculate fall damage from a downward impact speed. */
  function fallDamage(impactSpeed) {
    if (!Number.isFinite(impactSpeed) || impactSpeed <= 420) return 0;
    return Math.min(60, Math.max(0, Math.floor((impactSpeed - 420) / 12)));
  }

  /** Integrate one projectile using semi-implicit Euler integration. */
  function integrateProjectile(projectile, dt, wind, gravity) {
    var next = Object.assign({}, projectile);
    var step = Number.isFinite(dt) ? dt : FIXED_DT;
    var windFactor = Number.isFinite(projectile.windFactor)
      ? projectile.windFactor
      : 0;
    next.vx += (Number.isFinite(wind) ? wind : 0) * windFactor * step;
    next.vy += (Number.isFinite(gravity) ? gravity : GRAVITY) * step;
    next.x += next.vx * step;
    next.y += next.vy * step;
    next.age = (next.age || 0) + step;
    return next;
  }

  /** Simulate a projectile for a duration using the game's fixed time step. */
  function simulateProjectile(initial, duration, wind, terrain, options) {
    var state = Object.assign({ age: 0, radius: 5, bounces: 0 }, initial);
    var elapsed = 0;
    var settings = options || {};
    var path = [{ x: state.x, y: state.y }];
    while (elapsed + 1e-9 < duration && !state.done) {
      var before = state;
      state = integrateProjectile(
        state,
        Math.min(FIXED_DT, duration - elapsed),
        wind,
        settings.gravity,
      );
      elapsed += Math.min(FIXED_DT, duration - elapsed);
      if (terrain && terrain.isSolid(state.x, state.y)) {
        if (state.bounce > 0 && Math.abs(state.vy) > 45) {
          state.y = before.y;
          state.vy = -Math.abs(state.vy) * state.bounce;
          state.vx *= 0.82;
          state.bounces += 1;
        } else {
          state.hit = true;
          state.done = true;
        }
      }
      if (state.y > 1140 || state.x < -220 || state.x > 2140 || state.age > 8.1)
        state.done = true;
      if (path.length < 800) path.push({ x: state.x, y: state.y });
    }
    state.path = path;
    return state;
  }

  /** Apply one blast to characters and return immutable event records. */
  function resolveExplosion(center, definition, characters, explosionId) {
    var events = [];
    var seen = new Set();
    characters.forEach(function (character) {
      if (!character.alive || seen.has(character.id)) return;
      seen.add(character.id);
      var dx = character.x - center.x;
      var dy = character.y - center.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var damage = explosionDamage(
        definition.maxDamage,
        definition.blastRadius,
        distance,
      );
      if (!damage) return;
      var length = Math.max(1, distance);
      var ratio = 1 - Math.min(1, distance / definition.blastRadius);
      var impulse = (definition.impulse || definition.maxDamage * 7) * ratio;
      events.push({
        id: explosionId,
        characterId: character.id,
        damage: damage,
        vx: (dx / length) * impulse,
        vy: (dy / length) * impulse - impulse * 0.35,
      });
    });
    return events;
  }

  /** Physics facade shared by the battle and AI predictor. */
  function PhysicsEngine(terrain) {
    this.terrain = terrain || null;
    this.gravity = GRAVITY;
  }

  PhysicsEngine.prototype.projectileStep = function (projectile, wind, dt) {
    return integrateProjectile(projectile, dt || FIXED_DT, wind, this.gravity);
  };

  PhysicsEngine.prototype.predict = function (initial, duration, wind) {
    return simulateProjectile(initial, duration, wind, this.terrain, {
      gravity: this.gravity,
    });
  };

  PhysicsEngine.prototype.isSupported = function (character) {
    if (!this.terrain) return false;
    return [-12, 0, 12].some(function (offset) {
      return this.terrain.isSolid(
        character.x + offset,
        character.y + CHARACTER_RADIUS + 2,
      );
    }, this);
  };

  PhysicsEngine.prototype.placeOnSurface = function (character) {
    if (!this.terrain) return character;
    var surface = this.terrain.getSurfaceY(
      character.x,
      Math.max(0, character.y - 80),
    );
    if (surface != null) character.y = surface - CHARACTER_RADIUS;
    return character;
  };

  PhysicsEngine.prototype.moveCharacter = function (character, input, dt) {
    var step = dt || FIXED_DT;
    if (!character.alive) return character;
    var supported = this.isSupported(character);
    if (supported && character.vy >= 0) {
      character.vy = 0;
      character.grounded = true;
      if (input.jump) character.vy = -360;
      if (input.backflip) {
        character.vy = -470;
        character.vx = -character.facing * 150;
      }
      if (input.axis) {
        character.facing = input.axis > 0 ? 1 : -1;
        character.vx = input.axis * 110;
      } else if (!input.backflip) {
        character.vx *= Math.pow(0.02, step);
      }
    } else {
      character.grounded = false;
      character.vx += clamp(input.axis || 0, -1, 1) * 220 * 0.25 * step;
      character.vx = clamp(character.vx, -180, 180);
      character.vy += this.gravity * step;
    }
    var nextX = character.x + character.vx * step;
    var nextY = character.y + character.vy * step;
    if (!this.terrain || !this.terrain.isSolid(nextX, nextY)) {
      character.x = nextX;
      character.y = nextY;
    } else if (supported) {
      var climbY = this.terrain.getSurfaceY(nextX, character.y - 42);
      if (climbY != null && climbY - (character.y + CHARACTER_RADIUS) <= 14) {
        character.x = nextX;
        character.y = climbY - CHARACTER_RADIUS;
      } else {
        character.vx = 0;
      }
    } else {
      character.vx *= 0.4;
      character.vy = Math.min(0, character.vy * -0.15);
    }
    return character;
  };

  return {
    FIXED_DT: FIXED_DT,
    GRAVITY: GRAVITY,
    CHARACTER_RADIUS: CHARACTER_RADIUS,
    clamp: clamp,
    explosionDamage: explosionDamage,
    fallDamage: fallDamage,
    integrateProjectile: integrateProjectile,
    simulateProjectile: simulateProjectile,
    resolveExplosion: resolveExplosion,
    PhysicsEngine: PhysicsEngine,
  };
});
