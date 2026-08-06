(function (root, factory) {
  var WG = root.WormsGame || {};
  if (typeof require === "function") {
    WG.Random = WG.Random || require("../utils/random.js");
    WG.Physics = WG.Physics || require("../physics/physics.js");
    WG.TerrainMask =
      WG.TerrainMask || require("../terrain/terrain.js").TerrainMask;
    var weaponModule = require("../weapons/weapons.js");
    WG.WeaponRegistry = WG.WeaponRegistry || weaponModule.WeaponRegistry;
    WG.Weapons = WG.Weapons || weaponModule;
    WG.TurnManager = WG.TurnManager || require("./turn-manager.js").TurnManager;
    WG.AIController = WG.AIController || require("../ai/ai.js").AIController;
  }
  var api = factory(WG);
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.GameState = api.GameState;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (WG) {
  "use strict";

  var TEAM_COLORS = Object.freeze({
    pink: "#f47ba3",
    mint: "#61d0a9",
    sky: "#62b9e9",
    grape: "#9175da",
  });
  var ENEMY_COLORS = Object.freeze({
    pink: "mint",
    mint: "grape",
    sky: "pink",
    grape: "sky",
  });
  var PLAYER_NAMES = Object.freeze(["Pip", "Pop", "Puff"]);
  var ENEMY_NAMES = Object.freeze(["Fizz", "Mochi", "Zuzu"]);

  function cloneCharacter(character) {
    return {
      id: character.id,
      team: character.team,
      slot: character.slot,
      name: character.name,
      color: character.color,
      hp: character.hp,
      alive: character.alive,
      x: character.x,
      y: character.y,
      vx: character.vx,
      vy: character.vy,
      facing: character.facing,
      grounded: character.grounded,
    };
  }

  function makeCharacter(spawn, team, slot, color) {
    return {
      id: (team === 0 ? "p" : "e") + (slot + 1),
      team: team,
      slot: slot,
      name: (team === 0 ? PLAYER_NAMES : ENEMY_NAMES)[slot],
      color: TEAM_COLORS[color],
      hp: 100,
      alive: true,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      facing: team === 0 ? 1 : -1,
      grounded: true,
      lastGroundedVy: 0,
    };
  }

  /** Complete mutable battle model. Rendering consumes only its snapshots. */
  function GameState(config, eventHandler) {
    this.config = Object.assign(
      {
        seed: Date.now() >>> 0,
        aiDifficulty: "normal",
        theme: "random",
        turnSeconds: 30,
        playerTeamName: "蹦蹦隊",
        playerColor: "pink",
      },
      config || {},
    );
    this.onEvent =
      typeof eventHandler === "function" ? eventHandler : function () {};
    this.reset(this.config.seed);
  }

  GameState.prototype.reset = function (seed) {
    this.config.seed = WG.Random.normalizeSeed(seed);
    this.terrain = new WG.TerrainMask(this.config.seed, this.config.theme);
    this.physics = new WG.Physics.PhysicsEngine(this.terrain);
    this.terrainSnapshot = this.terrain.snapshot();
    this.characters = [];
    var playerColor = this.config.playerColor;
    var enemyColor = ENEMY_COLORS[playerColor] || "mint";
    for (var slot = 0; slot < 3; slot += 1) {
      var playerSpawn = this.terrain.spawns.find(function (spawn) {
        return spawn.team === 0 && spawn.slot === slot;
      });
      var enemySpawn = this.terrain.spawns.find(function (spawn) {
        return spawn.team === 1 && spawn.slot === slot;
      });
      this.characters.push(makeCharacter(playerSpawn, 0, slot, playerColor));
      this.characters.push(makeCharacter(enemySpawn, 1, slot, enemyColor));
    }
    this.ammo = [
      WG.WeaponRegistry.createAmmo(),
      WG.WeaponRegistry.createAmmo(),
    ];
    this.selectedWeapons = ["bazooka", "bazooka"];
    this.angle = 45;
    this.power = 0.1;
    this.charging = false;
    this.moveAxis = 0;
    this.pendingMove = { jump: false, backflip: false };
    this.projectiles = [];
    this.placed = [];
    this.effects = [];
    this.targetMode = null;
    this.targetPreview = null;
    this.validTarget = null;
    this.targetArmed = false;
    this.turn = new WG.TurnManager(
      this.characters,
      this.config.turnSeconds,
      this.config.seed,
    );
    this.turn.startTurn();
    this.aiRng = WG.Random.mulberry32(
      WG.Random.deriveSeed(this.config.seed, "ai"),
    );
    this.airstrikeRng = WG.Random.mulberry32(
      WG.Random.deriveSeed(this.config.seed, "airstrike"),
    );
    this.ai = new WG.AIController(this.physics);
    this.aiTimer = 0;
    this.aiPlan = null;
    this.aiMoveRemaining = 0;
    this.actionElapsed = 0;
    this.stableElapsed = 0;
    this.summaryElapsed = 0;
    this.elapsed = 0;
    this.result = null;
    this.shotgunShots = 0;
    this.secondShotTime = 0;
    this.damageEvents = [];
    this.lastCountdown = this.config.turnSeconds;
    this.metrics = {
      shotsFired: 0,
      shotsHit: 0,
      damageDealt: 0,
      damageTaken: 0,
      weaponUses: {},
      recentWeapon: "",
      hitAttackIds: new Set(),
      startedAt: Date.now(),
    };
    this.emit("turnStart", { sudden: this.turn.suddenJustStarted });
    return this;
  };

  GameState.prototype.emit = function (type, detail) {
    this.onEvent(type, detail || {});
  };

  // -------------------------------------------------------------------------
  // Current turn queries and player intent
  // -------------------------------------------------------------------------

  GameState.prototype.currentCharacter = function () {
    return this.turn.currentCharacter();
  };

  GameState.prototype.currentWeapon = function () {
    return WG.WeaponRegistry.get(this.selectedWeapons[this.turn.activeTeam]);
  };

  GameState.prototype.setMoveAxis = function (axis) {
    this.moveAxis = WG.Physics.clamp(axis, -1, 1);
  };

  GameState.prototype.queueMove = function (type) {
    if (this.turn.state !== "PLAYER_CONTROL") return;
    if (type === "jump") this.pendingMove.jump = true;
    if (type === "backflip") this.pendingMove.backflip = true;
  };

  GameState.prototype.adjustAim = function (amount) {
    if (this.turn.state !== "PLAYER_CONTROL") return;
    this.angle = WG.Physics.clamp(this.angle + amount, -80, 80);
  };

  GameState.prototype.aimFromPointer = function (point) {
    if (this.turn.state !== "PLAYER_CONTROL" || this.targetMode) return;
    var actor = this.currentCharacter();
    var dx = point.x - actor.x;
    var dy = point.y - actor.y;
    actor.facing = dx >= 0 ? 1 : -1;
    this.angle = WG.Physics.clamp(
      (Math.atan2(-dy, Math.abs(dx)) * 180) / Math.PI,
      -80,
      80,
    );
    this.power = WG.Physics.clamp(Math.hypot(dx, dy) / 180, 0.1, 1);
  };

  GameState.prototype.startCharge = function () {
    if (this.turn.state === "ACTION_ACTIVE") {
      var sheep = this.placed.find(function (entity) {
        return entity.type === "sheep" && !entity.exploded;
      });
      if (sheep) sheep.triggered = true;
      return;
    }
    if (this.turn.state !== "PLAYER_CONTROL" || this.targetMode) return;
    this.charging = true;
    this.power = 0.1;
  };

  GameState.prototype.cancelCharge = function () {
    this.charging = false;
    this.power = 0.1;
  };

  // -------------------------------------------------------------------------
  // Weapon selection, targeting, and execution
  // -------------------------------------------------------------------------

  GameState.prototype.selectWeapon = function (weaponId) {
    var weapon = WG.WeaponRegistry.get(weaponId);
    if (!weapon) return false;
    if (this.shotgunShots === 1) {
      this.emit("weaponLocked");
      return false;
    }
    if (this.ammo[this.turn.activeTeam][weaponId] === 0) {
      this.emit("noAmmo", { weaponId: weaponId });
      return false;
    }
    this.selectedWeapons[this.turn.activeTeam] = weaponId;
    this.cancelTargeting();
    if (weapon.category === "targeted") this.beginTargeting(weaponId);
    this.emit("weaponSelected", { weaponId: weaponId });
    return true;
  };

  GameState.prototype.cycleWeapon = function (direction) {
    var list = WG.WeaponRegistry.list();
    var current = this.currentWeapon();
    var start = list.findIndex(function (weapon) {
      return weapon.id === current.id;
    });
    for (var offset = 1; offset <= list.length; offset += 1) {
      var index = (start + direction * offset + list.length * 2) % list.length;
      if (this.ammo[this.turn.activeTeam][list[index].id] !== 0)
        return this.selectWeapon(list[index].id);
    }
    return false;
  };

  GameState.prototype.beginTargeting = function (weaponId) {
    if (this.turn.state !== "PLAYER_CONTROL") return;
    this.targetMode = weaponId;
    this.targetPreview = null;
    this.validTarget = false;
    this.targetArmed = false;
  };

  GameState.prototype.cancelTargeting = function () {
    this.targetMode = null;
    this.targetPreview = null;
    this.validTarget = null;
    this.targetArmed = false;
  };

  GameState.prototype.updateTargetPreview = function (point) {
    if (!this.targetMode || !point) return false;
    var candidate = { x: WG.Physics.clamp(point.x, 0, 1919), y: point.y };
    if (this.targetMode === "teleport") {
      var surface = this.terrain.getSurfaceY(candidate.x, 0);
      candidate.y =
        surface == null ? point.y : surface - WG.Physics.CHARACTER_RADIUS;
      this.validTarget = WG.Weapons.isTeleportValid(
        candidate,
        this.terrain,
        this.characters,
        this.currentCharacter().id,
      );
    } else {
      candidate.y = WG.Physics.clamp(point.y, 80, this.turn.waterY - 10);
      this.validTarget = candidate.x >= 0 && candidate.x <= 1920;
    }
    this.targetPreview = candidate;
    return this.validTarget;
  };

  GameState.prototype.selectTarget = function (point) {
    if (!this.targetMode) return false;
    this.updateTargetPreview(point);
    if (!this.validTarget) {
      this.targetArmed = false;
      this.emit("invalidTarget");
      return false;
    }
    if (!this.targetArmed) {
      this.targetArmed = true;
      return true;
    }
    return this.confirmTarget();
  };

  GameState.prototype.recordAttack = function (weaponId) {
    var attackId =
      "attack-" + this.turn.turnNumber + "-" + this.metrics.shotsFired;
    this.metrics.shotsFired += 1;
    this.metrics.weaponUses[weaponId] =
      (this.metrics.weaponUses[weaponId] || 0) + 1;
    this.metrics.recentWeapon = weaponId;
    return attackId;
  };

  GameState.prototype.consumeAmmo = function (weaponId) {
    return WG.WeaponRegistry.consume(
      this.ammo[this.turn.activeTeam],
      weaponId,
      true,
    );
  };

  GameState.prototype.confirmTarget = function () {
    if (!this.targetMode || !this.targetPreview || !this.validTarget) {
      this.emit("invalidTarget");
      return false;
    }
    var weaponId = this.targetMode;
    var target = { x: this.targetPreview.x, y: this.targetPreview.y };
    var actor = this.currentCharacter();
    if (!this.consumeAmmo(weaponId)) return false;
    var attackId = this.recordAttack(weaponId);
    this.cancelTargeting();
    if (weaponId === "teleport") {
      actor.x = target.x;
      actor.y = target.y;
      actor.vx = 0;
      actor.vy = 0;
      actor.grounded = true;
      this.turn.markAction();
      this.enterSettling();
      this.emit("teleport", { point: target });
      return true;
    }
    var side = this.airstrikeRng() < 0.5 ? -1 : 1;
    var missiles = WG.Weapons.createAirstrike(target, this.turn.wind, side);
    missiles.forEach(function (missile) {
      missile.ownerId = actor.id;
      missile.ownerTeam = actor.team;
      missile.attackId = attackId;
    });
    this.projectiles.push.apply(this.projectiles, missiles);
    this.turn.markAction();
    this.actionElapsed = 0;
    this.emit("fired", { weaponId: weaponId, focus: target });
    return true;
  };

  GameState.prototype.fire = function () {
    if (this.turn.state === "ACTION_ACTIVE") {
      var activeSheep = this.placed.find(function (entity) {
        return entity.type === "sheep" && !entity.exploded;
      });
      if (activeSheep) activeSheep.triggered = true;
      return !!activeSheep;
    }
    if (
      this.turn.state !== "PLAYER_CONTROL" &&
      this.turn.state !== "AI_THINKING"
    )
      return false;
    var weapon = this.currentWeapon();
    if (weapon.category === "targeted") {
      if (!this.targetMode) this.beginTargeting(weapon.id);
      return false;
    }
    if (!this.consumeAmmo(weapon.id)) {
      this.emit("noAmmo", { weaponId: weapon.id });
      return false;
    }
    var actor = this.currentCharacter();
    var attackId = this.recordAttack(weapon.id);
    this.charging = false;
    if (weapon.category === "projectile")
      this.fireProjectile(actor, weapon, attackId);
    else if (weapon.category === "hitscan")
      this.fireShotgun(actor, weapon, attackId);
    else if (weapon.category === "melee")
      this.swingBat(actor, weapon, attackId);
    else if (weapon.category === "placed")
      this.placeWeapon(actor, weapon, attackId);
    return true;
  };

  GameState.prototype.fireProjectile = function (actor, weapon, attackId) {
    var projectile = WG.Weapons.launchState(
      actor,
      weapon,
      this.angle,
      this.power,
    );
    projectile.attackId = attackId;
    projectile.holyBeeped = false;
    this.projectiles.push(projectile);
    this.turn.markAction();
    this.actionElapsed = 0;
    this.emit("fired", {
      weaponId: weapon.id,
      focus: { x: projectile.x, y: projectile.y },
    });
  };

  GameState.prototype.applyDirectDamage = function (
    target,
    damage,
    impulse,
    attackId,
    ownerTeam,
  ) {
    target.hp = Math.max(0, target.hp - damage);
    target.vx += impulse.x;
    target.vy += impulse.y;
    target.grounded = false;
    this.damageEvents.push({
      characterId: target.id,
      damage: damage,
      x: target.x,
      y: target.y,
    });
    if (ownerTeam === 0 && target.team === 1) {
      this.metrics.damageDealt += damage;
      if (!this.metrics.hitAttackIds.has(attackId)) {
        this.metrics.hitAttackIds.add(attackId);
        this.metrics.shotsHit += 1;
      }
    }
    if (ownerTeam === 1 && target.team === 0)
      this.metrics.damageTaken += damage;
  };

  GameState.prototype.fireShotgun = function (actor, weapon, attackId) {
    var radians = (this.angle * Math.PI) / 180;
    var hit = WG.Weapons.raycastCharacter(
      actor,
      this.characters,
      this.angle,
      weapon.range,
      this.terrain,
    );
    if (hit) {
      this.applyDirectDamage(
        hit.target,
        weapon.maxDamage,
        {
          x: Math.cos(radians) * actor.facing * weapon.impulse,
          y: -Math.sin(radians) * weapon.impulse - 60,
        },
        attackId,
        actor.team,
      );
      this.carve(hit.target.x, hit.target.y, weapon.terrainRadius);
    }
    this.shotgunShots += 1;
    this.emit("fired", {
      weaponId: weapon.id,
      hit: !!hit,
      focus: hit
        ? { x: hit.target.x, y: hit.target.y }
        : {
            x: actor.x + Math.cos(radians) * actor.facing * weapon.range,
            y: actor.y - Math.sin(radians) * weapon.range,
          },
    });
    if (this.shotgunShots < 2) {
      this.turn.state = actor.team === 0 ? "PLAYER_CONTROL" : "AI_THINKING";
      this.turn.timeLeft = Math.min(8, this.turn.timeLeft);
      if (actor.team === 1) this.aiTimer = 0;
      this.secondShotTime = 8;
      this.emit("secondShot");
    } else {
      this.turn.markAction();
      this.enterSettling();
    }
  };

  GameState.prototype.swingBat = function (actor, weapon, attackId) {
    var hitAny = false;
    var focus = { x: actor.x + actor.facing * weapon.range, y: actor.y };
    this.characters.forEach(function (target) {
      if (!target.alive || target.id === actor.id) return;
      var dx = target.x - actor.x;
      var dy = target.y - actor.y;
      var distance = Math.hypot(dx, dy);
      var inFront = Math.sign(dx || actor.facing) === actor.facing;
      var angle = Math.abs((Math.atan2(-dy, Math.abs(dx)) * 180) / Math.PI);
      if (distance <= weapon.range && inFront && angle <= weapon.arc / 2) {
        hitAny = true;
        focus = { x: target.x, y: target.y };
        this.applyDirectDamage(
          target,
          weapon.maxDamage,
          { x: actor.facing * weapon.impulse, y: -weapon.impulse * 0.62 },
          attackId,
          actor.team,
        );
      }
    }, this);
    this.turn.markAction();
    this.enterSettling();
    this.emit("fired", {
      weaponId: weapon.id,
      hit: hitAny,
      focus: focus,
    });
  };

  GameState.prototype.placeWeapon = function (actor, weapon, attackId) {
    var entity = {
      id: weapon.id + "-" + this.turn.turnNumber,
      type: weapon.id,
      x: actor.x + actor.facing * 34,
      y: actor.y + 10,
      vx: weapon.id === "sheep" ? actor.facing * weapon.speed : 0,
      vy: 0,
      facing: actor.facing,
      ownerId: actor.id,
      ownerTeam: actor.team,
      attackId: attackId,
      age: 0,
      armed: false,
      triggered: false,
      triggerTimer: weapon.triggerDelay || 0,
      exploded: false,
    };
    this.placed.push(entity);
    this.turn.markAction();
    this.actionElapsed = 0;
    if (weapon.id === "mine") this.enterSettling();
    this.emit("fired", {
      weaponId: weapon.id,
      focus: { x: entity.x, y: entity.y },
    });
  };

  GameState.prototype.carve = function (x, y, radius) {
    if (!radius) return;
    this.terrain.carveCircle(x, y, radius);
    this.terrainSnapshot = this.terrain.snapshot();
    this.characters.forEach(function (character) {
      if (
        character.alive &&
        Math.abs(character.x - x) < radius + 30 &&
        Math.abs(character.y - y) < radius + 50
      )
        character.grounded = false;
    });
  };

  GameState.prototype.explode = function (
    x,
    y,
    weaponId,
    ownerTeam,
    attackId,
    sourceId,
  ) {
    var weapon = WG.WeaponRegistry.get(weaponId);
    if (!weapon) return;
    this.carve(x, y, weapon.terrainRadius);
    var events = WG.Physics.resolveExplosion(
      { x: x, y: y },
      weapon,
      this.characters,
      sourceId || attackId,
    );
    events.forEach(function (event) {
      var target = this.characters.find(function (character) {
        return character.id === event.characterId;
      });
      if (!target) return;
      this.applyDirectDamage(
        target,
        event.damage,
        { x: event.vx, y: event.vy },
        attackId,
        ownerTeam,
      );
    }, this);
    this.effects.push({
      x: x,
      y: y,
      radius: weapon.blastRadius,
      age: 0,
      life: 0.7,
      color: weapon.maxDamage >= 70 ? "#fff0a0" : "#fff",
    });
    this.placed.forEach(function (entity) {
      if (entity.exploded || entity.id === sourceId) return;
      if (Math.hypot(entity.x - x, entity.y - y) <= weapon.blastRadius + 18) {
        entity.triggered = true;
        entity.triggerTimer = Math.min(entity.triggerTimer, 0.08);
      }
    });
    this.emit("explosion", { large: weapon.maxDamage >= 70, x: x, y: y });
  };

  GameState.prototype.updateProjectile = function (projectile, dt) {
    if (projectile.delay > 0) {
      projectile.delay -= dt;
      return true;
    }
    var weapon = WG.WeaponRegistry.get(projectile.weaponId);
    var previous = { x: projectile.x, y: projectile.y };
    var integrated = WG.Physics.integrateProjectile(
      projectile,
      dt,
      this.turn.wind,
      WG.Physics.GRAVITY,
    );
    Object.assign(projectile, integrated);
    var terrainHit = this.terrain.isSolid(projectile.x, projectile.y);
    var characterHit = this.characters.find(function (character) {
      if (
        !character.alive ||
        (character.id === projectile.ownerId && projectile.age < 0.24)
      )
        return false;
      return (
        Math.hypot(character.x - projectile.x, character.y - projectile.y) <=
        WG.Physics.CHARACTER_RADIUS + (projectile.radius || 5)
      );
    });
    var fuseExpired = weapon.fuse > 0 && projectile.age >= weapon.fuse;
    if (
      weapon.id === "holy" &&
      !projectile.holyBeeped &&
      weapon.fuse - projectile.age <= 1
    ) {
      projectile.holyBeeped = true;
      this.emit("holyWarning");
    }
    if ((terrainHit || characterHit) && weapon.bounce > 0 && !fuseExpired) {
      projectile.x = previous.x;
      projectile.y = previous.y;
      projectile.vy = -Math.abs(projectile.vy) * weapon.bounce;
      projectile.vx *= 0.82;
      if (Math.abs(projectile.vy) < 30) projectile.vy = 0;
      return true;
    }
    if (fuseExpired || characterHit || (terrainHit && weapon.impact)) {
      this.explode(
        projectile.x,
        projectile.y,
        weapon.id,
        projectile.ownerTeam,
        projectile.attackId,
        projectile.id,
      );
      return false;
    }
    if (
      projectile.y >= this.turn.waterY ||
      projectile.x < -200 ||
      projectile.x > 2120 ||
      projectile.age > 8
    )
      return false;
    return true;
  };

  GameState.prototype.updateMine = function (mine, dt) {
    var weapon = WG.WeaponRegistry.get("mine");
    mine.age += dt;
    if (!mine.armed && mine.age >= weapon.armTime) {
      mine.armed = true;
      mine.wasClear = false;
      this.emit("mineArmed");
    }
    if (mine.armed && !mine.triggered) {
      var occupied = this.characters.some(function (character) {
        return (
          character.alive &&
          Math.hypot(character.x - mine.x, character.y - mine.y) <=
            weapon.triggerRadius
        );
      });
      if (!occupied) mine.wasClear = true;
      mine.triggered = mine.wasClear && occupied;
    }
    if (mine.triggered) {
      mine.triggerTimer -= dt;
      if (mine.triggerTimer <= 0) {
        mine.exploded = true;
        this.explode(
          mine.x,
          mine.y,
          "mine",
          mine.ownerTeam,
          mine.attackId,
          mine.id,
        );
      }
    }
  };

  GameState.prototype.updateSheep = function (sheep, dt) {
    var weapon = WG.WeaponRegistry.get("sheep");
    sheep.age += dt;
    sheep.vy += WG.Physics.GRAVITY * dt;
    var nextX = sheep.x + sheep.vx * dt;
    var nextY = sheep.y + sheep.vy * dt;
    if (this.terrain.isSolid(nextX, sheep.y)) {
      sheep.vy = -285;
      nextY = sheep.y + sheep.vy * dt;
    }
    if (this.terrain.isSolid(nextX, nextY + 13) && sheep.vy >= 0) {
      var surface = this.terrain.getSurfaceY(nextX, nextY - 30);
      sheep.y = surface == null ? nextY : surface - 13;
      sheep.vy = 0;
    } else {
      sheep.y = nextY;
    }
    sheep.x = nextX;
    if (
      sheep.triggered ||
      sheep.age >= weapon.fuse ||
      sheep.y >= this.turn.waterY
    ) {
      sheep.exploded = true;
      this.explode(
        sheep.x,
        sheep.y,
        "sheep",
        sheep.ownerTeam,
        sheep.attackId,
        sheep.id,
      );
    }
  };

  GameState.prototype.updatePlaced = function (dt) {
    this.placed.forEach(function (entity) {
      if (entity.exploded) return;
      if (entity.type === "mine") this.updateMine(entity, dt);
      if (entity.type === "sheep") this.updateSheep(entity, dt);
    }, this);
    this.placed = this.placed.filter(function (entity) {
      return !entity.exploded;
    });
  };

  // -------------------------------------------------------------------------
  // Character settling, elimination, and AI execution
  // -------------------------------------------------------------------------

  GameState.prototype.damageFall = function (character, speed) {
    var damage = WG.Physics.fallDamage(speed);
    if (!damage) return;
    this.applyDirectDamage(
      character,
      damage,
      { x: 0, y: 0 },
      "fall-" + this.turn.turnNumber + "-" + character.id,
      1 - character.team,
    );
    this.emit("fallDamage", { characterId: character.id, damage: damage });
  };

  GameState.prototype.settleCharacter = function (character, dt) {
    if (!character.alive) return false;
    var supported = this.physics.isSupported(character);
    if (supported && character.vy >= 0) {
      if (!character.grounded) {
        this.damageFall(character, character.vy);
        this.emit("landed", { characterId: character.id });
      }
      character.vy = 0;
      character.vx *= Math.pow(0.015, dt);
      character.grounded = true;
      var surface = this.terrain.getSurfaceY(character.x, character.y - 30);
      if (surface != null) character.y = surface - WG.Physics.CHARACTER_RADIUS;
    } else {
      character.grounded = false;
      character.vy += WG.Physics.GRAVITY * dt;
      var nextX = character.x + character.vx * dt;
      var nextY = character.y + character.vy * dt;
      if (
        this.terrain.isSolid(nextX, nextY + WG.Physics.CHARACTER_RADIUS) &&
        character.vy >= 0
      ) {
        var impactSpeed = character.vy;
        var landing = this.terrain.getSurfaceY(nextX, nextY - 35);
        character.x = nextX;
        character.y =
          landing == null ? nextY : landing - WG.Physics.CHARACTER_RADIUS;
        character.vy = 0;
        character.grounded = true;
        this.damageFall(character, impactSpeed);
        this.emit("landed", { characterId: character.id });
      } else {
        character.x = nextX;
        character.y = nextY;
      }
    }
    if (
      character.hp <= 0 ||
      character.y >= this.turn.waterY ||
      character.x < -40 ||
      character.x > 1960 ||
      character.y > 1120
    ) {
      character.alive = false;
      character.hp = 0;
      this.emit(character.y >= this.turn.waterY ? "drowned" : "eliminated", {
        characterId: character.id,
      });
    }
    return (
      Math.abs(character.vx) > 2 ||
      Math.abs(character.vy) > 2 ||
      !character.grounded
    );
  };

  GameState.prototype.updateCharacters = function (dt) {
    var moving = false;
    var actor = this.currentCharacter();
    this.characters.forEach(function (character) {
      if (!character.alive) return;
      if (character === actor && this.turn.state === "PLAYER_CONTROL") {
        var before = { x: character.x, y: character.y };
        this.physics.moveCharacter(
          character,
          {
            axis: this.moveAxis,
            jump: this.pendingMove.jump,
            backflip: this.pendingMove.backflip,
          },
          dt,
        );
        moving =
          moving ||
          Math.hypot(character.x - before.x, character.y - before.y) > 0.01;
      } else if (
        !character.grounded ||
        Math.abs(character.vx) > 2 ||
        Math.abs(character.vy) > 2
      ) {
        moving = this.settleCharacter(character, dt) || moving;
      }
    }, this);
    this.pendingMove.jump = false;
    this.pendingMove.backflip = false;
    return moving;
  };

  GameState.prototype.enterSettling = function () {
    this.turn.beginSettling();
    this.stableElapsed = 0;
  };

  GameState.prototype.updateAI = function (dt) {
    this.aiTimer += dt;
    var actor = this.currentCharacter();
    if (this.shotgunShots === 1 && this.aiTimer >= 0.35) {
      this.aiTimer = 0;
      this.power = 1;
      this.fire();
      return;
    }
    if (!this.aiPlan && this.aiTimer >= 0.45) {
      this.aiPlan = this.ai.planTurn(
        {
          current: cloneCharacter(actor),
          characters: this.characters.map(cloneCharacter),
          ammo: Object.assign({}, this.ammo[1]),
          wind: this.turn.wind,
          terrain: this.terrainSnapshot,
        },
        this.config.aiDifficulty,
        this.aiRng,
      );
    }
    if (!this.aiPlan || this.aiTimer < 0.85) return;
    var plan = this.aiPlan;
    this.aiPlan = null;
    if (plan.type === "fire") {
      this.selectedWeapons[1] = plan.weaponId;
      actor.facing = plan.facing;
      this.angle = plan.angle;
      this.power = plan.power;
      this.fire();
      return;
    }
    if (plan.type === "target") {
      this.selectedWeapons[1] = plan.weaponId;
      this.targetMode = plan.weaponId;
      this.updateTargetPreview(plan.target);
      this.targetArmed = true;
      if (!this.confirmTarget()) this.enterSettling();
      return;
    }
    if (plan.type === "move") {
      this.aiMoveRemaining = plan.duration;
      this.moveAxis = plan.direction;
      return;
    }
    this.enterSettling();
  };

  GameState.prototype.updateAIMovement = function (dt) {
    if (this.aiMoveRemaining <= 0) return false;
    var actor = this.currentCharacter();
    this.physics.moveCharacter(actor, { axis: this.moveAxis }, dt);
    this.aiMoveRemaining -= dt;
    if (this.aiMoveRemaining <= 0) {
      this.moveAxis = 0;
      this.enterSettling();
    }
    return true;
  };

  GameState.prototype.checkWorldEliminations = function () {
    var current = this.currentCharacter();
    var currentEliminated = false;
    this.characters.forEach(function (character) {
      if (!character.alive) return;
      if (
        character.hp <= 0 ||
        character.y >= this.turn.waterY ||
        character.x < -40 ||
        character.x > 1960 ||
        character.y > 1120
      ) {
        character.alive = false;
        character.hp = 0;
        if (current && current.id === character.id) currentEliminated = true;
        this.emit(character.y >= this.turn.waterY ? "drowned" : "eliminated", {
          characterId: character.id,
        });
      }
    }, this);
    if (
      currentEliminated &&
      (this.turn.state === "PLAYER_CONTROL" ||
        this.turn.state === "AI_THINKING")
    )
      this.enterSettling();
  };

  GameState.prototype.updateEffects = function (dt) {
    this.effects.forEach(function (effect) {
      effect.age += dt;
    });
    this.effects = this.effects.filter(function (effect) {
      return effect.age < effect.life;
    });
  };

  // -------------------------------------------------------------------------
  // Turn completion, simulation entry point, and renderer snapshot
  // -------------------------------------------------------------------------

  GameState.prototype.finish = function (resultCode) {
    if (this.result) return;
    var outcome =
      resultCode === "draw" ? "draw" : resultCode === "team0" ? "win" : "loss";
    this.result = {
      outcome: outcome,
      winner: resultCode,
      survivors: this.characters
        .filter(function (character) {
          return character.alive;
        })
        .map(cloneCharacter),
      duration: this.elapsed,
      seed: this.config.seed,
      shotsFired: this.metrics.shotsFired,
      shotsHit: this.metrics.shotsHit,
      damageDealt: this.metrics.damageDealt,
      damageTaken: this.metrics.damageTaken,
      weaponUses: Object.assign({}, this.metrics.weaponUses),
      recentWeapon: this.metrics.recentWeapon,
    };
    this.turn.state = "RESULT";
    this.emit("result", this.result);
  };

  GameState.prototype.completeTurn = function () {
    this.characters.forEach(function (character) {
      if (character.hp <= 0) {
        character.alive = false;
        character.hp = 0;
      }
      if (character.y >= this.turn.waterY) {
        character.alive = false;
        character.hp = 0;
      }
    }, this);
    var result = this.turn.checkVictory();
    if (result) return this.finish(result);
    result = this.turn.advance();
    this.characters.forEach(function (character) {
      if (character.alive && character.y >= this.turn.waterY) {
        character.alive = false;
        character.hp = 0;
      }
    }, this);
    result = result || this.turn.checkVictory();
    if (result) return this.finish(result);
    this.angle = 45;
    this.power = 0.1;
    this.charging = false;
    this.shotgunShots = 0;
    this.secondShotTime = 0;
    this.damageEvents = [];
    this.aiTimer = 0;
    this.aiPlan = null;
    this.actionElapsed = 0;
    this.summaryElapsed = 0;
    this.emit("turnStart", { sudden: this.turn.suddenJustStarted });
  };

  GameState.prototype.update = function (dt) {
    if (this.result || this.turn.paused) return;
    this.elapsed += dt;
    this.updateEffects(dt);
    this.updatePlaced(dt);
    var beforeState = this.turn.state;
    var timerEvent = this.turn.tick(dt);
    if (timerEvent === "timeout") {
      this.emit("timeout");
      this.enterSettling();
    }
    if (beforeState === "TURN_INTRO" && this.turn.state !== "TURN_INTRO") {
      this.aiTimer = 0;
      this.aiPlan = null;
      this.emit("controlStart", { team: this.turn.activeTeam });
    }
    var countdown = Math.ceil(this.turn.timeLeft);
    if (countdown !== this.lastCountdown) {
      this.lastCountdown = countdown;
      if (countdown <= 5 && countdown > 0)
        this.emit("countdown", { value: countdown });
    }
    if (this.charging && this.turn.state === "PLAYER_CONTROL")
      this.power = Math.min(1, this.power + dt / 1.2);
    if (this.secondShotTime > 0) {
      this.secondShotTime -= dt;
      if (this.secondShotTime <= 0 && this.shotgunShots === 1)
        this.enterSettling();
    }
    if (this.turn.state === "AI_THINKING") {
      if (!this.updateAIMovement(dt)) this.updateAI(dt);
    }
    var characterMoving = this.updateCharacters(dt);
    this.checkWorldEliminations();
    if (this.turn.state === "ACTION_ACTIVE") {
      this.actionElapsed += dt;
      this.projectiles = this.projectiles.filter(function (projectile) {
        return this.updateProjectile(projectile, dt);
      }, this);
      var activePlaced = this.placed.some(function (entity) {
        return entity.type === "sheep" || entity.triggered;
      });
      if (
        (!this.projectiles.length && !activePlaced) ||
        this.actionElapsed >= 8
      ) {
        this.projectiles = [];
        this.enterSettling();
      }
    }
    if (this.turn.state === "WORLD_SETTLING") {
      var triggered = this.placed.some(function (entity) {
        return entity.triggered;
      });
      if (!characterMoving && !triggered) this.stableElapsed += dt;
      else this.stableElapsed = 0;
      this.actionElapsed += dt;
      if (this.stableElapsed >= 0.6 || this.actionElapsed >= 8) {
        this.turn.beginSummary();
        this.summaryElapsed = 0;
        this.emit("damageSummary", { events: this.damageEvents.slice() });
      }
    } else if (this.turn.state === "DAMAGE_SUMMARY") {
      this.summaryElapsed += dt;
      if (this.summaryElapsed >= 0.85) this.completeTurn();
    }
  };

  /** Create a detached read-only snapshot for UI, rendering, and AI. */
  GameState.prototype.snapshot = function () {
    var current = this.currentCharacter();
    return Object.freeze({
      config: Object.assign({}, this.config),
      terrain: this.terrainSnapshot,
      characters: this.characters.map(cloneCharacter),
      current: current ? cloneCharacter(current) : null,
      ammo: this.ammo.map(function (ammo) {
        return Object.assign({}, ammo);
      }),
      selectedWeapon: this.selectedWeapons[this.turn.activeTeam],
      angle: this.angle,
      power: this.power,
      charging: this.charging,
      projectiles: this.projectiles.map(function (projectile) {
        return Object.assign({}, projectile);
      }),
      placed: this.placed.map(function (entity) {
        return Object.assign({}, entity);
      }),
      effects: this.effects.map(function (effect) {
        return Object.assign({}, effect);
      }),
      targetMode: this.targetMode,
      targetPreview:
        this.targetPreview && Object.assign({}, this.targetPreview),
      validTarget: this.validTarget,
      turn: {
        state: this.turn.state,
        activeTeam: this.turn.activeTeam,
        timeLeft: this.turn.timeLeft,
        wind: this.turn.wind,
        windLevel: this.turn.windLevel(),
        waterY: this.turn.waterY,
        suddenDeath: this.turn.suddenDeath,
        turnNumber: this.turn.turnNumber,
      },
      elapsed: this.elapsed,
      result: this.result,
    });
  };

  GameState.TEAM_COLORS = TEAM_COLORS;
  return { TEAM_COLORS: TEAM_COLORS, GameState: GameState };
});
