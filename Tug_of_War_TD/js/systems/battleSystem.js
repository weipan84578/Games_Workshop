(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function multiplier(attacker, defender) {
    if (global.ATTRIBUTE_ADVANTAGE[attacker] === defender) {
      return 2;
    }
    if (global.ATTRIBUTE_ADVANTAGE[defender] === attacker) {
      return .72;
    }
    return 1;
  }

  function pushHitEffect(session, attacker, target, damage) {
    session.effects.push({
      type: "hit", x1: attacker.x, y1: attacker.y, x2: target.x, y2: target.y,
      color: attacker.side === "player" ? "#fff1a6" : "#ffb1bc", life: .25, damage: damage
    });
  }

  function pushHealEffect(session, unit) {
    session.effects.push({ type: "heal", x: unit.x, y: unit.y, color: "#9cf5a6", life: .25 });
  }

  function attackUnit(session, attacker, target) {
    var amount = attacker.def.atk * multiplier(attacker.def.attribute, target.def.attribute);
    target.takeDamage(amount);
    attacker.attackCooldown = attacker.def.cooldown;
    pushHitEffect(session, attacker, target, amount);
    if (session.hitSoundTimer <= 0) {
      app.AudioManager.playSfx("hit");
      session.hitSoundTimer = .18;
    }
  }

  function attackBase(session, attacker, base) {
    var amount = attacker.def.atk;
    base.takeDamage(amount);
    attacker.attackCooldown = attacker.def.cooldown;
    session.effects.push({ type: "hit", x1: attacker.x, y1: attacker.y, x2: base.x, y2: base.y, color: "#ffe48b", life: .25, damage: amount });
    if (session.hitSoundTimer <= 0) {
      app.AudioManager.playSfx("hit");
      session.hitSoundTimer = .18;
    }
  }

  function healAlly(session, healer, ally) {
    ally.heal(healer.def.heal);
    healer.attackCooldown = healer.def.cooldown;
    pushHealEffect(session, ally);
  }

  function moveTowardBase(unit, delta) {
    unit.x = app.PathManager.clampX(unit.x + app.PathManager.getDirection(unit.side) * unit.def.speed * delta);
  }

  function updateUnit(session, unit, allies, enemies, enemyBase) {
    unit.updateTimers(session.delta);
    unit.y = app.PathManager.getY(unit.x, session.elapsed);
    if (!unit.isAlive()) {
      return;
    }

    if (unit.def.attackType === "support") {
      var hurtAlly = allies.filter(function (ally) {
        return ally !== unit && ally.isAlive() && ally.hp / ally.maxHp < .82 && Math.abs(ally.x - unit.x) <= unit.def.range;
      }).sort(function (a, b) {
        return (a.hp / a.maxHp) - (b.hp / b.maxHp);
      })[0];
      if (hurtAlly) {
        if (unit.attackCooldown <= 0) {
          healAlly(session, unit, hurtAlly);
        }
        return;
      }
    }

    var nearest = app.Collision.nearest(unit, enemies);
    if (nearest.unit && nearest.distance <= unit.def.range) {
      if (unit.attackCooldown <= 0) {
        attackUnit(session, unit, nearest.unit);
      }
      return;
    }

    var baseDistance = Math.abs(enemyBase.x - unit.x);
    if (baseDistance <= unit.def.range + 8) {
      if (unit.attackCooldown <= 0) {
        attackBase(session, unit, enemyBase);
      }
      return;
    }
    moveTowardBase(unit, session.delta);
  }

  function checkOutcome(session) {
    if (session.enemyBase.hp <= 0) {
      session.finish("victory", "castle");
      return;
    }
    if (session.playerBase.hp <= 0) {
      session.finish("defeat", "castle");
      return;
    }
    if (session.timeRemaining <= 0) {
      var playerPercent = session.playerBase.getPercent();
      var enemyPercent = session.enemyBase.getPercent();
      var outcome = Math.abs(playerPercent - enemyPercent) < 1 ? "draw" : playerPercent > enemyPercent ? "victory" : "defeat";
      session.finish(outcome, "time");
    }
  }

  function BattleSystem() {}
  BattleSystem.prototype.update = function (session, delta) {
    session.delta = delta;
    var player = session.playerUnits.getAlive();
    var enemy = session.enemyUnits.getAlive();
    player.forEach(function (unit) { updateUnit(session, unit, player, enemy, session.enemyBase); });
    enemy.forEach(function (unit) { updateUnit(session, unit, enemy, player, session.playerBase); });
    app.Collision.separate(player, enemy);
    var deadPlayer = session.playerUnits.removeDead();
    var deadEnemy = session.enemyUnits.removeDead();
    session.kills += deadEnemy.length;
    if (deadPlayer.length || deadEnemy.length) {
      app.events.emit("battle:units-removed", { player: deadPlayer.length, enemy: deadEnemy.length });
    }
    checkOutcome(session);
  };
  app.BattleSystem = BattleSystem;
})(window);
