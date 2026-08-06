(function (root, factory) {
  var physics = root.WormsGame && root.WormsGame.Physics;
  if (!physics && typeof require === "function")
    physics = require("../physics/physics.js");
  var api = factory(physics);
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.Weapons = api;
  root.WormsGame.WeaponRegistry = api.WeaponRegistry;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (Physics) {
  "use strict";

  function defaultExecute(context, command) {
    return Object.freeze({
      context: context || null,
      command: command || null,
    });
  }

  function definition(values) {
    return Object.freeze(
      Object.assign(
        {
          ammo: Infinity,
          terrainRadius: 0,
          windFactor: 0,
          impulse: 360,
          minSpeed: 0,
          maxSpeed: 0,
          fuse: 0,
          icon: "assets/images/icons/bazooka.svg",
          execute: defaultExecute,
        },
        values,
      ),
    );
  }

  var DEFINITIONS = Object.freeze([
    definition({
      id: "bazooka",
      category: "projectile",
      icon: "assets/images/icons/bazooka.svg",
      maxDamage: 45,
      blastRadius: 64,
      terrainRadius: 64,
      windFactor: 1,
      minSpeed: 280,
      maxSpeed: 900,
      impact: true,
    }),
    definition({
      id: "grenade",
      category: "projectile",
      icon: "assets/images/icons/grenade.svg",
      maxDamage: 50,
      blastRadius: 68,
      terrainRadius: 68,
      windFactor: 0.15,
      minSpeed: 220,
      maxSpeed: 700,
      fuse: 3,
      bounce: 0.45,
    }),
    definition({
      id: "shotgun",
      category: "hitscan",
      icon: "assets/images/icons/shotgun.svg",
      maxDamage: 25,
      blastRadius: 12,
      terrainRadius: 12,
      windFactor: 0,
      range: 600,
      shots: 2,
      impulse: 300,
    }),
    definition({
      id: "bat",
      category: "melee",
      icon: "assets/images/icons/bat.svg",
      maxDamage: 30,
      blastRadius: 0,
      terrainRadius: 0,
      windFactor: 0,
      range: 64,
      arc: 70,
      impulse: 620,
    }),
    definition({
      id: "mine",
      category: "placed",
      icon: "assets/images/icons/mine.svg",
      ammo: 2,
      maxDamage: 50,
      blastRadius: 65,
      terrainRadius: 65,
      windFactor: 0,
      armTime: 1,
      triggerRadius: 42,
      triggerDelay: 0.7,
    }),
    definition({
      id: "banana",
      category: "projectile",
      icon: "assets/images/icons/banana.svg",
      ammo: 1,
      maxDamage: 75,
      blastRadius: 85,
      terrainRadius: 85,
      windFactor: 0.1,
      minSpeed: 220,
      maxSpeed: 680,
      fuse: 3,
      bounce: 0.65,
      impulse: 500,
    }),
    definition({
      id: "airstrike",
      category: "targeted",
      icon: "assets/images/icons/airstrike.svg",
      ammo: 1,
      maxDamage: 24,
      blastRadius: 42,
      terrainRadius: 42,
      windFactor: 0,
      missiles: 5,
      spacing: 48,
    }),
    definition({
      id: "sheep",
      category: "placed",
      icon: "assets/images/icons/sheep.svg",
      ammo: 1,
      maxDamage: 65,
      blastRadius: 78,
      terrainRadius: 78,
      windFactor: 0,
      speed: 140,
      fuse: 8,
      impulse: 470,
    }),
    definition({
      id: "holy",
      category: "projectile",
      icon: "assets/images/icons/holy.svg",
      ammo: 1,
      maxDamage: 90,
      blastRadius: 100,
      terrainRadius: 100,
      windFactor: 0.05,
      minSpeed: 180,
      maxSpeed: 560,
      fuse: 3,
      bounce: 0.35,
      impulse: 620,
    }),
    definition({
      id: "teleport",
      category: "targeted",
      icon: "assets/images/icons/teleport.svg",
      ammo: 2,
      maxDamage: 0,
      blastRadius: 0,
      terrainRadius: 0,
      windFactor: 0,
    }),
  ]);
  var BY_ID = Object.freeze(
    DEFINITIONS.reduce(function (map, item) {
      map[item.id] = item;
      return map;
    }, {}),
  );

  /** Immutable collection of all weapon definitions. */
  var WeaponRegistry = Object.freeze({
    get: function (id) {
      return BY_ID[id] || null;
    },
    list: function () {
      return DEFINITIONS.slice();
    },
    createAmmo: function () {
      return DEFINITIONS.reduce(function (ammo, item) {
        ammo[item.id] = item.ammo;
        return ammo;
      }, {});
    },
    consume: function (ammo, id, legal) {
      var weapon = BY_ID[id];
      if (!weapon || !legal || ammo[id] === 0) return false;
      if (Number.isFinite(ammo[id])) ammo[id] -= 1;
      return true;
    },
    validate: function () {
      var ids = new Set();
      return (
        DEFINITIONS.length === 10 &&
        DEFINITIONS.every(function (item) {
          var valid =
            !ids.has(item.id) &&
            ["projectile", "hitscan", "melee", "placed", "targeted"].indexOf(
              item.category,
            ) >= 0 &&
            item.maxDamage >= 0 &&
            item.blastRadius >= 0 &&
            item.terrainRadius >= 0 &&
            item.windFactor >= 0 &&
            typeof item.execute === "function";
          ids.add(item.id);
          return valid;
        })
      );
    },
  });

  /** Convert angle, facing, and charge into a projectile launch state. */
  function launchState(character, weapon, angle, power) {
    var charge = Physics.clamp(power, 0.1, 1);
    var speed = weapon.minSpeed + (weapon.maxSpeed - weapon.minSpeed) * charge;
    var radians = (Physics.clamp(angle, -80, 80) * Math.PI) / 180;
    var facing = character.facing || 1;
    return {
      x: character.x + Math.cos(radians) * facing * 29,
      y: character.y - Math.sin(radians) * 29,
      vx: Math.cos(radians) * facing * speed,
      vy: -Math.sin(radians) * speed,
      windFactor: weapon.windFactor,
      bounce: weapon.bounce || 0,
      fuse: weapon.fuse || 0,
      weaponId: weapon.id,
      ownerId: character.id,
      ownerTeam: character.team,
      age: 0,
      radius: weapon.id === "banana" ? 9 : 6,
    };
  }

  /** Validate teleport position against terrain, water, bounds, and characters. */
  function isTeleportValid(point, terrain, characters, currentId) {
    if (
      !point ||
      point.x < 20 ||
      point.x > 1900 ||
      point.y < 60 ||
      point.y >= terrain.waterY - 30
    )
      return false;
    if (!terrain.isSolid(point.x, point.y + 19)) return false;
    for (var y = point.y - 52; y <= point.y + 15; y += 5)
      if (terrain.isSolid(point.x, y)) return false;
    return !characters.some(function (character) {
      if (!character.alive || character.id === currentId) return false;
      var dx = character.x - point.x;
      var dy = character.y - point.y;
      return dx * dx + dy * dy < 44 * 44;
    });
  }

  /** Build five deterministic air-strike missiles around a target. */
  function createAirstrike(target, wind, side) {
    var direction = wind === 0 ? (side < 0 ? -1 : 1) : wind > 0 ? -1 : 1;
    var missiles = [];
    for (var i = -2; i <= 2; i += 1) {
      missiles.push({
        x: target.x + i * 48 - direction * 165,
        y: Math.max(-80, target.y - 720 - Math.abs(i) * 18),
        vx: direction * 180,
        vy: 190,
        windFactor: 0,
        weaponId: "airstrike",
        age: 0,
        radius: 5,
        delay: (i + 2) * 0.12,
      });
    }
    return missiles;
  }

  /** Return a hitscan victim within range and a narrow aim corridor. */
  function raycastCharacter(character, characters, angle, range, terrain) {
    var radians = (angle * Math.PI) / 180;
    var dx = Math.cos(radians) * (character.facing || 1);
    var dy = -Math.sin(radians);
    var best = null;
    characters.forEach(function (target) {
      if (!target.alive || target.id === character.id) return;
      var tx = target.x - character.x;
      var ty = target.y - character.y;
      var along = tx * dx + ty * dy;
      var perpendicular = Math.abs(tx * dy - ty * dx);
      if (
        along > 0 &&
        along <= range &&
        perpendicular <= 22 &&
        (!best || along < best.distance)
      ) {
        var blocked = false;
        if (terrain) {
          for (var distance = 24; distance < along; distance += 8) {
            if (
              terrain.isSolid(
                character.x + dx * distance,
                character.y + dy * distance,
              )
            ) {
              blocked = true;
              break;
            }
          }
        }
        if (!blocked) best = { target: target, distance: along };
      }
    });
    return best;
  }

  return {
    WeaponRegistry: WeaponRegistry,
    DEFINITIONS: DEFINITIONS,
    launchState: launchState,
    isTeleportValid: isTeleportValid,
    createAirstrike: createAirstrike,
    raycastCharacter: raycastCharacter,
  };
});
