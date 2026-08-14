(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Battle = (cg.Battle = {});
  var canvas;
  var ctx;
  var palette = {};

  function cssColor(name, fallback) {
    return (
      getComputedStyle(document.body).getPropertyValue(name).trim() || fallback
    );
  }
  function refreshPalette() {
    palette = {
      skyTop: cssColor("--scene-sky-top", "#172454"),
      skyBottom: cssColor("--scene-sky-bottom", "#70c9e6"),
      hillBack: cssColor("--scene-hill-back", "#39517e"),
      hillFront: cssColor("--scene-hill-front", "#1c644f"),
      ground: cssColor("--scene-ground", "#123f3d"),
      sun: cssColor("--scene-sun", "#ffe5a2"),
      primary: cssColor("--color-primary", "#62d5ff"),
      secondary: cssColor("--color-secondary", "#ffcf6b"),
      accent: cssColor("--color-accent", "#ff7aa8"),
      danger: cssColor("--color-danger", "#ff7186"),
      success: cssColor("--color-success", "#73e6b2"),
      panel: "rgba(8, 19, 49, .84)",
    };
  }
  function roundedRect(context, x, y, w, h, radius) {
    var r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }
  function origin(side) {
    var portrait = Battle.orientation === "portrait";
    var offset = portrait
      ? cg.Constants.CASTLE_VERTICAL_OFFSET
      : cg.Constants.CASTLE_WORLD_OFFSET;
    if (portrait)
      return side === "player"
        ? { x: 0.5, y: 0.5 + offset }
        : { x: 0.5, y: 0.5 - offset };
    return side === "player"
      ? { x: 0.5 - offset, y: 0.5 }
      : { x: 0.5 + offset, y: 0.5 };
  }

  function aimTarget(source, aim) {
    var target = origin(source === "player" ? "enemy" : "player");

    if (Battle.orientation === "portrait") target.x = aim.x;
    else target.y = aim.y;

    return target;
  }

  function calculateGravity(start, target) {
    var constants = cg.Constants;
    var flightTime = constants.PROJECTILE_FLIGHT_TIME;
    var gravity =
      Battle.orientation === "portrait"
        ? constants.PROJECTILE_GRAVITY
        : constants.LANDSCAPE_PROJECTILE_GRAVITY;
    var verticalDelta = target.y - start.y;

    if (verticalDelta < 0) {
      var apexOffset = constants.UPWARD_ARC_APEX_RATIO - 0.5;
      var requiredGravity =
        -verticalDelta / (flightTime * flightTime * apexOffset);
      gravity = Math.max(gravity, requiredGravity);
    }

    return gravity;
  }

  function calculateVelocity(start, target) {
    var flightTime = cg.Constants.PROJECTILE_FLIGHT_TIME;
    var gravity = calculateGravity(start, target);

    return {
      x: (target.x - start.x) / flightTime,
      y: (target.y - start.y) / flightTime - 0.5 * gravity * flightTime,
      gravity: gravity,
    };
  }

  function rotateVelocity(velocity, angle) {
    var cosine = Math.cos(angle);
    var sine = Math.sin(angle);

    return {
      x: velocity.x * cosine - velocity.y * sine,
      y: velocity.x * sine + velocity.y * cosine,
    };
  }
  function maxVisual() {
    return cg.Utils.isTouchDevice()
      ? cg.Constants.MAX_RENDER_PROJECTILES_MOBILE
      : cg.Constants.MAX_RENDER_PROJECTILES_DESKTOP;
  }

  Battle.canvas = null;
  Battle.ctx = null;
  Battle.active = false;
  Battle.paused = false;
  Battle.orientation = "portrait";
  Battle.width = 0;
  Battle.height = 0;
  Battle.dpr = 1;
  Battle.levelNumber = 1;
  Battle.levelData = null;
  Battle.player = null;
  Battle.enemy = null;
  Battle.gates = [];
  Battle.terrain = [];
  Battle.projectiles = [];
  Battle.projectilePool = new cg.Projectile.Pool();
  Battle.aim = { x: 0.5, y: 0.12 };
  Battle.elapsed = 0;
  Battle.skillCooldown = 0;
  Battle.slowTimer = 0;
  Battle.comboTimer = 0;
  Battle.turn = "player";
  Battle.turnNumber = 1;
  Battle.volleyActive = false;
  Battle.volleySource = null;
  Battle.enemyFireTimer = 0;
  Battle.stats = null;
  Battle.ai = null;

  Battle.init = function (targetCanvas) {
    canvas = targetCanvas;
    ctx = canvas.getContext("2d", { alpha: false });
    Battle.canvas = canvas;
    Battle.ctx = ctx;
    refreshPalette();
    Battle.resize();
  };
  Battle.refreshPalette = refreshPalette;
  Battle.resize = function () {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(
      320,
      Math.floor(rect.width || canvas.clientWidth || 640),
    );
    var height = Math.max(
      240,
      Math.floor(rect.height || canvas.clientHeight || 480),
    );
    var nextOrientation = width >= height ? "landscape" : "portrait";
    var changed = Battle.orientation !== nextOrientation;
    Battle.width = width;
    Battle.height = height;
    Battle.dpr = cg.Utils.getDpr();
    Battle.orientation = nextOrientation;
    canvas.width = Math.floor(width * Battle.dpr);
    canvas.height = Math.floor(height * Battle.dpr);
    if (changed && Battle.active && Battle.gates.length)
      cg.Gate.reflow(Battle.gates, Battle.orientation);
    if (changed && Battle.active && Battle.terrain.length)
      cg.Terrain.reflow(Battle.terrain, Battle.orientation);
    refreshPalette();
  };
  Battle.getPlayerOrigin = function () {
    return origin("player");
  };
  Battle.getEnemyOrigin = function () {
    return origin("enemy");
  };
  Battle.getOrientation = function () {
    return Battle.orientation;
  };
  Battle.isFirstTurnShieldActive = function () {
    return Battle.turnNumber <= 1;
  };
  Battle.beginTurn = function (side) {
    Battle.turn = side === "enemy" ? "enemy" : "player";
    Battle.volleySource = Battle.turn;
    Battle.volleyActive = false;
    Battle.enemyFireTimer = Battle.turn === "enemy" ? 0.42 : 0;
    cg.Camera.snapToSide(Battle.turn, Battle.orientation);
    if (cg.Hud) cg.Hud.refresh();
  };
  Battle.finishVolley = function () {
    if (!Battle.active || !Battle.volleyActive || Battle.projectiles.length)
      return;

    Battle.volleyActive = false;
    if (Battle.volleySource === "player") {
      Battle.beginTurn("enemy");
    } else {
      Battle.turnNumber += 1;
      Battle.beginTurn("player");
    }
  };
  Battle.start = function (levelNumber) {
    if (!canvas) return;
    var number = Math.max(
      1,
      Math.min(cg.Level.count, Number(levelNumber) || 1),
    );
    Battle.levelNumber = number;
    Battle.levelData = cg.Level.get(number);
    Battle.active = true;
    Battle.paused = false;
    Battle.elapsed = 0;
    Battle.skillCooldown = 0;
    Battle.slowTimer = 0;
    Battle.comboTimer = 0;
    Battle.turn = "player";
    Battle.turnNumber = 1;
    Battle.volleyActive = false;
    Battle.volleySource = null;
    Battle.enemyFireTimer = 0;
    Battle.stats = {
      shots: 0,
      volleys: 0,
      playerMissilesSpawned: 0,
      hits: 0,
      damage: 0,
      maxMultiplier: 1,
      combo: 0,
      time: 0,
    };
    Battle.player = cg.Castle.create(
      "player",
      Battle.levelData,
      root.GameState.settings.difficulty,
      root.GameState.save && root.GameState.save.playerStats,
    );
    Battle.enemy = cg.Castle.create(
      "enemy",
      Battle.levelData,
      root.GameState.settings.difficulty,
    );
    Battle.aim = Battle.getEnemyOrigin();
    Battle.resize();
    Battle.gates = cg.Gate.create(
      Battle.levelData,
      Battle.orientation,
      cg.Difficulty.get(root.GameState.settings.difficulty).gateBias,
    );
    Battle.terrain = cg.Terrain.create(Battle.orientation, Battle.gates, [
      Battle.getPlayerOrigin(),
      Battle.getEnemyOrigin(),
    ]);
    Battle.projectiles.length = 0;
    Battle.projectilePool.clear();
    cg.Particles.reset();
    cg.Camera.reset();
    Battle.ai = cg.EnemyAI.create(Battle);
    Battle.beginTurn("player");
    root.GameState.battle = Battle;
    cg.State.setScreen(cg.Constants.SCREENS.GAME);
    if (cg.Audio) {
      cg.Audio.ensure();
      cg.Audio.startBgm("battle");
    }
    if (cg.Hud) cg.Hud.refresh();
  };
  Battle.restart = function () {
    Battle.start(Battle.levelNumber);
  };
  Battle.pause = function () {
    if (!Battle.active || Battle.paused) return;
    Battle.paused = true;
    cg.State.setScreen(cg.Constants.SCREENS.PAUSE);
    if (cg.Audio) cg.Audio.setPaused(true);
    if (cg.ScreenManager) cg.ScreenManager.show(cg.Constants.SCREENS.PAUSE);
  };
  Battle.resume = function () {
    if (!Battle.active) return;
    Battle.paused = false;
    cg.State.setScreen(cg.Constants.SCREENS.GAME);
    if (cg.Audio) cg.Audio.setPaused(false);
    if (cg.ScreenManager) cg.ScreenManager.show(cg.Constants.SCREENS.GAME);
  };
  Battle.pauseForVisibility = function () {
    if (Battle.active && !Battle.paused) Battle.pause();
  };
  Battle.setAim = function (x, y) {
    var target = {
      x: cg.Utils.clamp(x, 0.04, 0.96),
      y: cg.Utils.clamp(y, 0.04, 0.96),
    };
    if (Battle.orientation === "portrait") target.y = Math.min(target.y, 0.8);
    else target.x = Math.max(target.x, 0.2);
    Battle.aim = target;
    if (cg.Hud) cg.Hud.setAim(target);
  };
  Battle.adjustAim = function (dx, dy) {
    Battle.setAim(Battle.aim.x + dx, Battle.aim.y + dy);
  };
  Battle.spawnMissile = function (source, aim, critical) {
    if (Battle.projectilePool.activeCount() >= maxVisual()) return null;

    var start = origin(source);
    var target = aimTarget(
      source,
      aim || origin(source === "player" ? "enemy" : "player"),
    );
    var castle = source === "player" ? Battle.player : Battle.enemy;
    var velocity = calculateVelocity(start, target);
    var projectile = Battle.projectilePool.acquire();
    var isCritical = Boolean(
      source === "player" && (critical || Math.random() < castle.criticalRate),
    );
    var damage = castle.attack * (isCritical ? 2 : 1);

    projectile.launch(source, start.x, start.y, velocity, damage, isCritical);
    Battle.projectiles.push(projectile);
    castle.recoil = 0.18;

    if (source === "player") Battle.stats.playerMissilesSpawned += 1;
    cg.Particles.burst(
      start.x,
      start.y,
      source === "player" ? palette.primary : palette.accent,
      7,
      0.12,
    );
    return projectile;
  };
  Battle.spawnVolley = function (source, aim) {
    if (Battle.volleyActive || !Battle.active) return false;

    Battle.volleyActive = true;
    Battle.volleySource = source;
    var spread = 0.014;
    var spawned = 0;

    for (var index = 0; index < cg.Constants.VOLLEY_SIZE; index += 1) {
      var offset = (index - (cg.Constants.VOLLEY_SIZE - 1) / 2) * spread;
      var missileAim = {
        x: aim.x,
        y: aim.y,
      };

      if (Battle.orientation === "portrait") missileAim.x += offset;
      else missileAim.y += offset;

      if (Battle.spawnMissile(source, missileAim)) spawned += 1;
    }

    if (source === "player") Battle.stats.shots += spawned;
    if (!spawned) {
      Battle.volleyActive = false;
      return false;
    }
    Battle.stats.volleys += 1;
    cg.Audio.playSfx("fire", source === "player" ? 1.2 : 1);
    if (cg.Hud) cg.Hud.refresh();
    return spawned > 0;
  };
  Battle.firePlayer = function () {
    if (
      !Battle.active ||
      Battle.paused ||
      Battle.turn !== "player" ||
      Battle.volleyActive
    )
      return false;

    return Battle.spawnVolley("player", Battle.aim);
  };
  Battle.fireEnemy = function (target) {
    if (
      !Battle.active ||
      Battle.paused ||
      Battle.turn !== "enemy" ||
      Battle.volleyActive
    )
      return false;

    return Battle.spawnVolley("enemy", target || Battle.getPlayerOrigin());
  };
  Battle.useSkill = function () {
    if (
      !Battle.active ||
      Battle.paused ||
      Battle.turn !== "player" ||
      Battle.volleyActive ||
      Battle.skillCooldown > 0
    )
      return false;
    Battle.skillCooldown = cg.Constants.SKILL_COOLDOWN;
    Battle.slowTimer = 4.8;
    cg.Particles.burst(
      Battle.getPlayerOrigin().x,
      Battle.getPlayerOrigin().y,
      palette.success,
      28,
      0.25,
    );
    cg.Particles.shockwave(
      Battle.getPlayerOrigin().x,
      Battle.getPlayerOrigin().y,
      palette.success,
    );
    cg.Audio.playSfx("skill", 1.2);
    if (cg.Toast) cg.Toast.show(cg.I18n.t("toast.skill"), "success");
    if (cg.Hud) cg.Hud.refresh();
    return true;
  };
  Battle.processGate = function (projectile, gate) {
    var baseDamage = projectile.damageTotal;
    var result = cg.Gate.apply(gate, projectile);
    var zeroed = result.factor === 0;

    if (zeroed) {
      projectile.active = false;
      projectile.visualCount = 0;
    } else {
      var available = Math.max(
        1,
        maxVisual() - Battle.projectilePool.activeCount() + 1,
      );
      var splitCount = Math.min(
        result.splitCount,
        cg.Constants.MAX_GATE_SPLIT,
        available,
      );

      projectile.logicalCount = 1;
      projectile.damageTotal = Math.max(1, baseDamage);
      projectile.refreshVisualCount(maxVisual());

      for (var index = 1; index < splitCount; index += 1) {
        var clone = Battle.projectilePool.acquire();
        var ratio = index / Math.max(1, splitCount - 1);
        var angle = (ratio - 0.5) * 0.24;
        var velocity = rotateVelocity(
          { x: projectile.vx, y: projectile.vy },
          angle,
        );
        clone.copyFrom(projectile, velocity);
        Battle.projectiles.push(clone);
        if (projectile.source === "player") {
          Battle.stats.shots += 1;
          Battle.stats.playerMissilesSpawned += 1;
        }
      }
    }

    Battle.stats.maxMultiplier = Math.max(
      Battle.stats.maxMultiplier,
      result.factor,
      projectile.multiplier,
    );
    Battle.stats.combo += 1;
    Battle.comboTimer = 1.7;
    var color =
      gate.type === "divide"
        ? palette.danger
        : gate.special
          ? palette.secondary
          : palette.primary;
    cg.Particles.burst(
      gate.x,
      gate.y,
      color,
      gate.type === "divide" ? 15 : 23,
      0.18,
    );
    cg.Particles.text(
      gate.x,
      gate.y - 0.035,
      gate.type === "divide"
        ? "÷" + gate.value
        : "x" + cg.Utils.formatNumber(result.factor),
      color,
    );
    cg.Audio.playSfx(
      gate.type === "divide"
        ? "hit"
        : result.factor >= 10
          ? "multiplier"
          : "gate",
      Math.max(0.7, Math.min(2, result.factor)),
    );
    if (result.factor >= 10) {
      cg.Particles.text(
        gate.x,
        gate.y - 0.085,
        cg.I18n.t("game.megashot"),
        palette.secondary,
      );
      cg.Camera.impactZoom(1.035);
      cg.Camera.shake(0.045);
    }
    if (cg.Hud) cg.Hud.showCombo(Battle.stats.combo, projectile.multiplier);
    if (cg.Toast && result.factor >= 5)
      cg.Toast.show(
        cg.I18n.t("toast.gate", {
          value: "x" + cg.Utils.formatNumber(result.factor),
        }),
        "success",
      );
    return zeroed;
  };
  Battle.hitCastle = function (projectile, targetSide) {
    var target = targetSide === "enemy" ? Battle.enemy : Battle.player;
    var point =
      targetSide === "enemy"
        ? Battle.getEnemyOrigin()
        : Battle.getPlayerOrigin();
    var defenseReduction =
      target.defense * Math.min(8, projectile.logicalCount);
    var rawDamage = Math.max(1, projectile.damageTotal - defenseReduction);
    var shielded = Battle.isFirstTurnShieldActive();
    var damage = shielded
      ? Math.max(
          1,
          Math.round(
            rawDamage * (1 - cg.Constants.FIRST_TURN_SHIELD_REDUCTION),
          ),
        )
      : rawDamage;
    var dealt = target.takeDamage(damage);
    target.shieldFlash = shielded ? 0.24 : 0;
    Battle.stats.damage += dealt;
    Battle.stats.hits += projectile.source === "player" ? 1 : 0;
    var color = targetSide === "enemy" ? palette.secondary : palette.danger;
    cg.Particles.burst(
      point.x,
      point.y,
      color,
      projectile.logicalCount > 20 ? 25 : 14,
      0.2,
    );
    cg.Particles.shockwave(point.x, point.y, color);
    cg.Particles.text(
      point.x,
      point.y - 0.07,
      "-" + cg.Utils.formatNumber(dealt),
      color,
    );
    if (shielded) {
      cg.Particles.text(
        point.x,
        point.y - 0.115,
        cg.I18n.t("game.shieldActive"),
        palette.primary,
      );
    }
    cg.Camera.shake(projectile.logicalCount > 20 ? 0.055 : 0.022);
    cg.Audio.playSfx(
      shielded ? "shield" : projectile.logicalCount > 20 ? "explosion" : "hit",
      shielded ? 0.9 : projectile.logicalCount > 20 ? 1.4 : 1,
    );
    if (projectile.logicalCount > 20) cg.Camera.impactZoom(1.03);
    if (target.hp <= 0) Battle.end(targetSide === "enemy" ? "win" : "lose");
  };
  Battle.update = function (delta) {
    if (!Battle.active || Battle.paused) return;
    var dt = Math.min(cg.Constants.MAX_DELTA, Math.max(0, delta));
    var slowFactor = Battle.slowTimer > 0 ? 0.46 : 1;
    var simDt = dt * slowFactor;
    Battle.elapsed += dt;
    Battle.stats.time += dt;
    Battle.skillCooldown = Math.max(0, Battle.skillCooldown - dt);
    Battle.slowTimer = Math.max(0, Battle.slowTimer - dt);
    Battle.comboTimer -= dt;
    if (Battle.comboTimer <= 0) Battle.stats.combo = 0;
    cg.Gate.updateAll(Battle.gates, simDt, Battle.elapsed, Battle.orientation);
    cg.Terrain.update(Battle.terrain, simDt, Battle.elapsed);

    if (Battle.turn === "enemy" && !Battle.volleyActive && Battle.ai) {
      Battle.enemyFireTimer -= simDt;
      if (Battle.enemyFireTimer <= 0) {
        Battle.fireEnemy(Battle.ai.chooseAim());
      }
    }

    for (var i = Battle.projectiles.length - 1; i >= 0; i -= 1) {
      var projectile = Battle.projectiles[i];
      if (!projectile.active) {
        Battle.projectiles.splice(i, 1);
        continue;
      }
      projectile.life += simDt;
      projectile.prevX = projectile.x;
      projectile.prevY = projectile.y;
      projectile.vy +=
        (projectile.gravity || cg.Constants.PROJECTILE_GRAVITY) * simDt;
      projectile.x += projectile.vx * simDt;
      projectile.y += projectile.vy * simDt;
      if (projectile.trail.length > 9) projectile.trail.shift();
      projectile.trail.push({ x: projectile.x, y: projectile.y });
      if (Math.random() < 0.72)
        cg.Particles.trail(
          projectile.x,
          projectile.y,
          projectile.source === "player" ? palette.primary : palette.accent,
        );
      var consumed = false;
      for (var g = 0; g < Battle.gates.length; g += 1) {
        var gate = Battle.gates[g];
        if (
          !gate.active ||
          projectile.passedGates[gate.id] ||
          !cg.Collision.segmentVsRect(
            projectile.prevX,
            projectile.prevY,
            projectile.x,
            projectile.y,
            cg.Gate.rect(gate),
          )
        )
          continue;
        projectile.passedGates[gate.id] = true;
        consumed = Battle.processGate(projectile, gate);
        break;
      }
      if (!consumed) {
        var terrain = cg.Terrain.findHit(
          Battle.terrain,
          projectile.prevX,
          projectile.prevY,
          projectile.x,
          projectile.y,
        );
        if (terrain) {
          var destroyed = cg.Terrain.absorb(terrain);
          cg.Particles.burst(
            terrain.x + terrain.w / 2,
            terrain.y + terrain.h / 2,
            palette.secondary,
            destroyed ? 18 : 9,
            0.14,
          );
          cg.Particles.text(
            terrain.x + terrain.w / 2,
            terrain.y - 0.025,
            cg.I18n.t("game.coverBlocked"),
            palette.secondary,
          );
          cg.Audio.playSfx(
            destroyed ? "explosion" : "hit",
            destroyed ? 1.1 : 0.7,
          );
          consumed = true;
        }
      }
      var targetSide = projectile.source === "player" ? "enemy" : "player";
      if (
        !consumed &&
        cg.Collision.projectileHitsCastle(
          projectile,
          targetSide === "enemy"
            ? Battle.getEnemyOrigin()
            : Battle.getPlayerOrigin(),
          targetSide === "enemy" ? Battle.enemy.radius : Battle.player.radius,
        )
      ) {
        Battle.hitCastle(projectile, targetSide);
        consumed = true;
      }
      if (!Battle.active) break;
      if (
        projectile.life > 5 ||
        projectile.x < cg.Constants.WORLD_MIN - 0.08 ||
        projectile.x > cg.Constants.WORLD_MAX + 0.08 ||
        projectile.y < cg.Constants.WORLD_MIN - 0.08 ||
        projectile.y > cg.Constants.WORLD_MAX + 0.08
      )
        consumed = true;
      if (consumed) {
        Battle.projectiles.splice(i, 1);
        Battle.projectilePool.release(projectile);
      }
    }

    if (
      Battle.active &&
      Battle.volleyActive &&
      Battle.projectiles.length === 0
    ) {
      Battle.finishVolley();
    }

    if (Battle.active) {
      Battle.player.recoil = Math.max(0, Battle.player.recoil - dt);
      Battle.enemy.recoil = Math.max(0, Battle.enemy.recoil - dt);
      Battle.player.hitFlash = Math.max(0, Battle.player.hitFlash - dt);
      Battle.enemy.hitFlash = Math.max(0, Battle.enemy.hitFlash - dt);
      Battle.player.shieldFlash = Math.max(0, Battle.player.shieldFlash - dt);
      Battle.enemy.shieldFlash = Math.max(0, Battle.enemy.shieldFlash - dt);
    }
    cg.Particles.update(simDt);

    if (Battle.volleyActive && Battle.projectiles.length) {
      cg.Camera.follow(Battle.projectiles[0]);
    } else {
      cg.Camera.returnToSide(Battle.turn, Battle.orientation);
    }
    cg.Camera.update(dt);
    if (cg.Hud) cg.Hud.refresh();
  };
  Battle.end = function (outcome) {
    if (!Battle.active) return;
    Battle.active = false;
    Battle.paused = false;
    Battle.volleyActive = false;
    Battle.volleySource = null;
    var snapshot = Battle.getStats();
    snapshot.level = Battle.levelNumber;
    cg.SaveManager.recordBattle(outcome, Battle.levelNumber, snapshot);
    cg.State.setScreen(
      outcome === "win"
        ? cg.Constants.SCREENS.RESULT_WIN
        : cg.Constants.SCREENS.RESULT_LOSE,
    );
    if (cg.Audio) {
      cg.Audio.setPaused(false);
      cg.Audio.startForScreen(root.GameState.screen);
      cg.Audio.playSfx(outcome === "win" ? "victory" : "defeat");
    }
    if (cg.Result) cg.Result.show(outcome, snapshot);
    if (cg.ScreenManager) cg.ScreenManager.show(root.GameState.screen);
    Battle.projectiles.forEach(function (p) {
      Battle.projectilePool.release(p);
    });
    Battle.projectiles.length = 0;
    if (outcome === "win") {
      var p = Battle.getEnemyOrigin();
      cg.Particles.burst(p.x, p.y, palette.secondary, 50, 0.35);
    } else {
      var q = Battle.getPlayerOrigin();
      cg.Particles.burst(q.x, q.y, palette.primary, 20, 0.18);
    }
  };
  Battle.getStats = function () {
    return Object.assign({}, Battle.stats || {}, {
      level: Battle.levelNumber,
      hitRate:
        Battle.stats && Battle.stats.shots
          ? Battle.stats.hits / Battle.stats.shots
          : 0,
    });
  };
  Battle.forceWin = function () {
    if (Battle.active) {
      Battle.enemy.hp = 0;
      Battle.end("win");
    }
  };
  Battle.forceLose = function () {
    if (Battle.active) {
      Battle.player.hp = 0;
      Battle.end("lose");
    }
  };

  Battle.render = function () {
    if (!ctx || !Battle.width || !Battle.height) return;
    var width = Battle.width;
    var height = Battle.height;
    ctx.setTransform(Battle.dpr, 0, 0, Battle.dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    refreshPalette();
    var offset = cg.Camera.offset(width, height);
    var zoom = cg.Camera.state.zoom;
    var pan = cg.Camera.state.pan;
    drawBackground(width, height);
    ctx.save();
    ctx.translate(
      width / 2 + offset.x - pan.x * width,
      height / 2 + offset.y - pan.y * height,
    );
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);
    cg.Terrain.drawAll(
      Battle.terrain,
      ctx,
      width,
      height,
      palette,
      cg.Utils.getQuality(),
    );
    drawTrajectory(width, height);
    Battle.gates.forEach(function (gate) {
      drawGate(gate, width, height);
    });
    if (Battle.enemy) drawCastle(Battle.enemy, width, height);
    if (Battle.player) drawCastle(Battle.player, width, height);
    Battle.projectiles.forEach(function (p) {
      drawProjectile(p, width, height);
    });
    cg.Particles.draw(ctx, width, height);
    ctx.restore();
  };
  function drawBackground(width, height) {
    var gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(1, palette.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    var isNight = Battle.levelData && Battle.levelData.weather === "night";
    ctx.globalAlpha = isNight ? 0.75 : 0.9;
    ctx.fillStyle = palette.sun;
    ctx.beginPath();
    ctx.arc(
      width * (Battle.orientation === "portrait" ? 0.78 : 0.72),
      height * 0.18,
      Math.min(width, height) * 0.085,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.globalAlpha = 1;
    drawCloud(width * 0.18, height * 0.19, width * 0.16, 0.45);
    drawCloud(width * 0.75, height * 0.3, width * 0.13, 0.3);
    drawCloud(width * 0.5, height * 0.11, width * 0.1, 0.2);
    drawHill(width, height, 0.53, palette.hillBack, 0.07);
    drawHill(width, height, 0.68, palette.hillFront, 0.09);
    ctx.fillStyle = palette.ground;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.78);
    ctx.lineTo(width, height * 0.78);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.08)";
    ctx.fillRect(0, height * 0.78, width, 2);
    var weather = Battle.levelData && Battle.levelData.weather;
    if (weather === "rain") drawRain(width, height);
    if (weather === "snow") drawSnow(width, height);
    if (weather === "night") drawStars(width, height);
    ctx.fillStyle = "rgba(4, 13, 32, .15)";
    ctx.fillRect(0, height * 0.81, width, height * 0.19);
  }
  function drawCloud(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#e8f5ff";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.25, Math.PI, 0);
    ctx.arc(x + size * 0.2, y - size * 0.06, size * 0.34, Math.PI, 0);
    ctx.arc(x + size * 0.48, y, size * 0.25, Math.PI, 0);
    ctx.lineTo(x + size * 0.73, y + size * 0.18);
    ctx.lineTo(x - size * 0.08, y + size * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  function drawHill(width, height, base, color, variance) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height * base);
    for (var i = 0; i <= 12; i += 1) {
      var x = width * (i / 12);
      var y =
        height *
        (base -
          0.12 -
          Math.sin(i * 1.7 + Battle.levelNumber) * variance -
          (i % 3) * 0.018);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }
  function drawRain(width, height) {
    ctx.save();
    ctx.strokeStyle = "rgba(180, 229, 255, .25)";
    ctx.lineWidth = 1.2;
    for (var i = 0; i < 28; i += 1) {
      var x = ((i * 89 + Battle.elapsed * 80) % (width + 80)) - 40;
      var y = (i * 47) % height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y + 18);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawSnow(width, height) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    for (var i = 0; i < 22; i += 1) {
      var x = (i * 71 + Math.sin(Battle.elapsed * 0.5 + i) * 20) % width;
      var y = (i * 43 + Battle.elapsed * 18) % height;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawStars(width, height) {
    ctx.save();
    ctx.fillStyle = palette.secondary;
    for (var i = 0; i < 28; i += 1) {
      var x = (i * 113) % width;
      var y = (i * 47) % (height * 0.58);
      var a = 0.35 + 0.35 * Math.sin(Battle.elapsed * 2 + i);
      ctx.globalAlpha = a;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();
  }
  function drawTrajectory(width, height) {
    if (
      !Battle.active ||
      Battle.paused ||
      Battle.turn !== "player" ||
      Battle.volleyActive
    )
      return;

    var start = Battle.getPlayerOrigin();
    var target = aimTarget("player", Battle.aim);
    var velocity = calculateVelocity(start, target);
    var duration = cg.Constants.PROJECTILE_FLIGHT_TIME;
    var count = 24;

    ctx.save();
    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,.42)";
    ctx.beginPath();
    for (var i = 0; i <= count; i += 1) {
      var t = (i / count) * duration;
      var x = start.x + velocity.x * t;
      var y = start.y + velocity.y * t + 0.5 * velocity.gravity * t * t;
      if (i === 0) ctx.moveTo(x * width, y * height);
      else ctx.lineTo(x * width, y * height);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = palette.secondary;
    ctx.beginPath();
    ctx.arc(target.x * width, target.y * height, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawGate(gate, width, height) {
    var rect = cg.Gate.rect(gate);
    var x = rect.x * width;
    var y = rect.y * height;
    var w = rect.w * width;
    var h = rect.h * height;
    var color =
      gate.type === "divide"
        ? palette.danger
        : gate.special
          ? palette.secondary
          : palette.primary;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = root.GameState.settings.graphicsQuality === "low" ? 0 : 24;
    roundedRect(ctx, x, y, w, h, Math.min(14, Math.min(w, h) * 0.4));
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
    ctx.lineWidth = gate.flash > 0 ? 5 : 2;
    roundedRect(ctx, x, y, w, h, Math.min(14, Math.min(w, h) * 0.4));
    ctx.stroke();
    ctx.fillStyle = palette.panel;
    roundedRect(
      ctx,
      x + 4,
      y + 4,
      Math.max(2, w - 8),
      Math.max(2, h - 8),
      Math.min(10, Math.min(w, h) * 0.3),
    );
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1;
    roundedRect(
      ctx,
      x + 8,
      y + 8,
      Math.max(2, w - 16),
      Math.max(2, h - 16),
      Math.min(8, Math.min(w, h) * 0.25),
    );
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.font =
      "900 " +
      Math.max(16, Math.min(width, height) * 0.045) +
      "px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(5, 12, 32, .9)";
    var label = (gate.type === "divide" ? "÷" : "x") + gate.value;
    ctx.strokeText(label, gate.x * width, gate.y * height);
    ctx.fillText(label, gate.x * width, gate.y * height);
    ctx.font =
      "900 " +
      Math.max(12, Math.min(width, height) * 0.027) +
      "px Arial, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      gate.icon || "↑",
      gate.x * width,
      gate.y * height + (gate.portrait ? h * 0.72 : h * 0.64),
    );
    ctx.restore();
  }
  function drawCastle(castle, width, height) {
    var point =
      castle.side === "player"
        ? Battle.getPlayerOrigin()
        : Battle.getEnemyOrigin();
    var x = point.x * width;
    var y = point.y * height;
    var scale = Math.min(width, height);
    var towerW = scale * 0.055;
    var bodyW = scale * 0.13;
    var bodyH = scale * 0.12;
    var recoil = castle.recoil * scale * 0.08;
    var base = castle.side === "player" ? palette.primary : palette.accent;
    var roof = castle.side === "player" ? palette.success : palette.danger;
    ctx.save();
    ctx.translate(x, y + recoil);
    if (Battle.isFirstTurnShieldActive()) {
      var shieldColor =
        castle.side === "player" ? palette.primary : palette.accent;
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = shieldColor;
      ctx.beginPath();
      ctx.arc(0, 0, bodyW * 1.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = shieldColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, bodyW * 1.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#071329";
    ctx.beginPath();
    ctx.ellipse(0, scale * 0.05, bodyW * 1.1, scale * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#8c9db8";
    roundedRect(ctx, -bodyW / 2, -bodyH / 2, bodyW, bodyH, 8);
    ctx.fill();
    ctx.strokeStyle = "#e7ddb3";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = base;
    roundedRect(
      ctx,
      -bodyW * 0.39,
      -bodyH * 0.29,
      bodyW * 0.78,
      bodyH * 0.58,
      5,
    );
    ctx.fill();
    [-0.52, 0.52].forEach(function (offset) {
      ctx.fillStyle = "#9aa9c1";
      roundedRect(
        ctx,
        offset * bodyW - towerW / 2,
        -bodyH * 0.76,
        towerW,
        bodyH * 0.92,
        4,
      );
      ctx.fill();
      ctx.strokeStyle = "#e7ddb3";
      ctx.stroke();
      ctx.fillStyle = roof;
      ctx.beginPath();
      ctx.moveTo(offset * bodyW - towerW * 0.65, -bodyH * 0.76);
      ctx.lineTo(offset * bodyW, -bodyH * 1.08);
      ctx.lineTo(offset * bodyW + towerW * 0.65, -bodyH * 0.76);
      ctx.closePath();
      ctx.fill();
    });
    ctx.fillStyle = "#283b63";
    roundedRect(
      ctx,
      -bodyW * 0.12,
      bodyH * 0.05,
      bodyW * 0.24,
      bodyH * 0.45,
      3,
    );
    ctx.fill();
    ctx.fillStyle = castle.side === "player" ? palette.secondary : "#ffb3c3";
    ctx.fillRect(bodyW * 0.18, -bodyH * 0.98, 2, bodyH * 0.38);
    ctx.beginPath();
    ctx.moveTo(bodyW * 0.2, -bodyH * 0.98);
    ctx.lineTo(bodyW * 0.2 + bodyW * 0.38, -bodyH * 0.88);
    ctx.lineTo(bodyW * 0.2, -bodyH * 0.76);
    ctx.closePath();
    ctx.fill();
    if (castle.shieldFlash > 0) {
      ctx.globalAlpha = (castle.shieldFlash / 0.24) * 0.45;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, bodyW * 1.46, 0, Math.PI * 2);
      ctx.fill();
    }
    if (castle.hitFlash > 0) {
      ctx.globalAlpha = (castle.hitFlash / 0.24) * 0.45;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, bodyW * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawProjectile(projectile, width, height) {
    var x = projectile.x * width;
    var y = projectile.y * height;
    var color =
      projectile.source === "player" ? palette.primary : palette.accent;
    var size = Math.max(5, Math.min(width, height) * 0.014);
    var angle = Math.atan2(projectile.vy, projectile.vx);

    ctx.save();
    ctx.lineCap = "round";
    if (projectile.trail.length > 1) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.32;
      ctx.lineWidth = size * 0.72;
      ctx.beginPath();
      projectile.trail.forEach(function (point, index) {
        if (index === 0) ctx.moveTo(point.x * width, point.y * height);
        else ctx.lineTo(point.x * width, point.y * height);
      });
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowColor = color;
    ctx.shadowBlur = root.GameState.settings.graphicsQuality === "low" ? 0 : 16;

    ctx.fillStyle = palette.secondary;
    ctx.beginPath();
    ctx.moveTo(-size * 2.2, 0);
    ctx.lineTo(-size * 0.75, -size * 0.5);
    ctx.lineTo(-size * 0.75, size * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    roundedRect(
      ctx,
      -size * 1.3,
      -size * 0.48,
      size * 2.1,
      size * 0.96,
      size * 0.28,
    );
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(size * 0.8, -size * 0.48);
    ctx.lineTo(size * 1.55, 0);
    ctx.lineTo(size * 0.8, size * 0.48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(7, 19, 48, .8)";
    ctx.beginPath();
    ctx.arc(size * 0.35, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size * 0.72, -size * 0.42);
    ctx.lineTo(-size * 0.2, -size * 1.02);
    ctx.lineTo(size * 0.05, -size * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-size * 0.72, size * 0.42);
    ctx.lineTo(-size * 0.2, size * 1.02);
    ctx.lineTo(size * 0.05, size * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
})(window);
