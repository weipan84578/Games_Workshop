(function (root, factory) {
  var Physics = root.WormsGame && root.WormsGame.Physics;
  var Weapons = root.WormsGame && root.WormsGame.Weapons;
  if (typeof require === "function") {
    if (!Physics) Physics = require("../physics/physics.js");
    if (!Weapons) Weapons = require("../weapons/weapons.js");
  }
  var api = factory(Physics, Weapons);
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.AIController = api.AIController;
  if (typeof module === "object" && module.exports) module.exports = api;
})(
  typeof window !== "undefined" ? window : globalThis,
  function (Physics, Weapons) {
    "use strict";
    var WeaponRegistry = Weapons.WeaponRegistry;
    var LEVELS = Object.freeze({
      easy: Object.freeze({
        limit: 60,
        angleError: 8,
        powerError: 0.14,
        friendlyPenalty: 1.2,
        rarePenalty: 5,
      }),
      normal: Object.freeze({
        limit: 180,
        angleError: 4,
        powerError: 0.07,
        friendlyPenalty: 2.2,
        rarePenalty: 12,
      }),
      hard: Object.freeze({
        limit: 420,
        angleError: 1.5,
        powerError: 0.03,
        friendlyPenalty: 3.4,
        rarePenalty: 20,
      }),
    });

    function nearestEnemy(actor, characters) {
      return (
        characters
          .filter(function (item) {
            return item.alive && item.team !== actor.team;
          })
          .sort(function (a, b) {
            return Math.abs(a.x - actor.x) - Math.abs(b.x - actor.x);
          })[0] || null
      );
    }

    function scoreImpact(point, actor, characters, weapon, level) {
      var score = 0;
      characters.forEach(function (character) {
        if (!character.alive) return;
        var distance = Math.hypot(character.x - point.x, character.y - point.y);
        var damage = Physics.explosionDamage(
          weapon.maxDamage,
          weapon.blastRadius,
          distance,
        );
        if (character.team === actor.team)
          score -= damage * level.friendlyPenalty;
        else score += damage;
        if (character.team !== actor.team && character.y > 900 && damage)
          score += 18;
      });
      return score - (Number.isFinite(weapon.ammo) ? level.rarePenalty : 0);
    }

    function hasAmmo(snapshot, weaponId) {
      return !snapshot.ammo || snapshot.ammo[weaponId] !== 0;
    }

    /** Seeded, side-effect-free tactical planner using the shared projectile predictor. */
    function AIController(physics) {
      this.physics = physics;
    }

    AIController.prototype.planTurn = function (snapshot, difficulty, rng) {
      var level = LEVELS[difficulty] || LEVELS.normal;
      var random =
        typeof rng === "function"
          ? rng
          : function () {
              return 0.5;
            };
      var actor = snapshot.current;
      var target = nearestEnemy(actor, snapshot.characters);
      if (!target) return { type: "skip", reason: "no-target" };
      var candidates = [];
      var simulations = 0;
      var weaponIds = ["bazooka", "grenade", "banana", "holy"].filter(
        function (weaponId) {
          return hasAmmo(snapshot, weaponId);
        },
      );
      var perWeaponLimit = Math.max(
        1,
        Math.floor(level.limit / Math.max(1, weaponIds.length)),
      );
      weaponIds.forEach(function (weaponId) {
        var weapon = WeaponRegistry.get(weaponId);
        var facing = target.x >= actor.x ? 1 : -1;
        var simulatedActor = Object.assign({}, actor, { facing: facing });
        var weaponSimulations = 0;
        for (
          var angle = 15;
          angle <= 75 &&
          simulations < level.limit &&
          weaponSimulations < perWeaponLimit;
          angle += difficulty === "hard" ? 3 : difficulty === "normal" ? 5 : 8
        ) {
          for (
            var power = 0.2;
            power <= 1.001 &&
            simulations < level.limit &&
            weaponSimulations < perWeaponLimit;
            power +=
              difficulty === "hard"
                ? 0.04
                : difficulty === "normal"
                  ? 0.07
                  : 0.12
          ) {
            simulations += 1;
            weaponSimulations += 1;
            var speed =
              weapon.minSpeed + (weapon.maxSpeed - weapon.minSpeed) * power;
            var radians = (angle * Math.PI) / 180;
            var projectile = {
              x: simulatedActor.x,
              y: simulatedActor.y - 8,
              vx: Math.cos(radians) * facing * speed,
              vy: -Math.sin(radians) * speed,
              windFactor: weapon.windFactor,
              bounce: weapon.bounce || 0,
              age: 0,
            };
            var result = this.physics.predict(
              projectile,
              weapon.fuse || 5,
              snapshot.wind,
            );
            var score = scoreImpact(
              result,
              actor,
              snapshot.characters,
              weapon,
              level,
            );
            candidates.push({
              type: "fire",
              weaponId: weaponId,
              angle: angle,
              power: power,
              facing: facing,
              score: score,
            });
          }
        }
      }, this);

      var dx = target.x - actor.x;
      var dy = target.y - actor.y;
      var distance = Math.hypot(dx, dy);
      var facing = dx >= 0 ? 1 : -1;
      var directAngle = Physics.clamp(
        (Math.atan2(-dy, Math.abs(dx)) * 180) / Math.PI,
        -80,
        80,
      );
      if (hasAmmo(snapshot, "shotgun") && distance <= 600) {
        candidates.push({
          type: "fire",
          weaponId: "shotgun",
          angle: directAngle,
          power: 1,
          facing: facing,
          score: WeaponRegistry.get("shotgun").maxDamage + 8,
        });
      }
      if (hasAmmo(snapshot, "bat") && distance <= 64) {
        candidates.push({
          type: "fire",
          weaponId: "bat",
          angle: directAngle,
          power: 1,
          facing: facing,
          score: WeaponRegistry.get("bat").maxDamage + 20,
        });
      }
      if (hasAmmo(snapshot, "mine")) {
        candidates.push({
          type: "fire",
          weaponId: "mine",
          angle: 0,
          power: 1,
          facing: facing,
          score: (distance < 180 ? 34 : 8) - level.rarePenalty,
        });
      }
      if (hasAmmo(snapshot, "sheep")) {
        candidates.push({
          type: "fire",
          weaponId: "sheep",
          angle: 0,
          power: 1,
          facing: facing,
          score: (distance < 700 ? 46 : 14) - level.rarePenalty,
        });
      }
      if (hasAmmo(snapshot, "airstrike")) {
        candidates.push({
          type: "target",
          weaponId: "airstrike",
          target: { x: target.x, y: target.y },
          score:
            WeaponRegistry.get("airstrike").maxDamage * 1.8 - level.rarePenalty,
        });
      }
      candidates.sort(function (a, b) {
        return b.score - a.score;
      });
      var best = candidates[0];
      if (!best || best.score < -5) {
        var direction = target.x >= actor.x ? 1 : -1;
        if (hasAmmo(snapshot, "teleport"))
          return {
            type: "target",
            weaponId: "teleport",
            target: {
              x: Math.max(90, Math.min(1830, target.x - direction * 250)),
              y: target.y,
            },
            score: 0,
          };
        return {
          type: "move",
          direction: direction,
          duration: 0.8 + random() * 0.6,
          score: 0,
        };
      }
      if (best.type === "fire") {
        best.angle = Physics.clamp(
          best.angle + (random() * 2 - 1) * level.angleError,
          -80,
          80,
        );
        best.power = Physics.clamp(
          best.power + (random() * 2 - 1) * level.powerError,
          0.1,
          1,
        );
      }
      delete best.score;
      return best;
    };

    AIController.LEVELS = LEVELS;
    return {
      LEVELS: LEVELS,
      AIController: AIController,
      nearestEnemy: nearestEnemy,
      scoreImpact: scoreImpact,
    };
  },
);
