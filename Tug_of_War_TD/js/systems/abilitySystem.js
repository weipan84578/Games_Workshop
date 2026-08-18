(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function applyAttackEffects(session, attacker, target, enemies, amount, emitHit) {
    var direction = attacker.side === "player" ? 1 : -1;
    target.applyKnockback(direction, target.def.knockbackForce);
    if (attacker.def.ability === "frost") {
      target.applySlow(2.6, .5);
    }
    if (attacker.def.ability !== "chain") {
      return;
    }
    enemies.filter(function (other) {
      return other !== target && other.isAlive() && Math.abs(other.x - target.x) <= 72;
    }).slice(0, 2).forEach(function (other) {
      var chainDamage = amount * .36;
      other.takeDamage(chainDamage);
      other.applyKnockback(direction, other.def.knockbackForce * .5);
      emitHit(session, attacker, other, chainDamage);
    });
  }

  function tryCastBarrier(session, guardian, allies, emitEffect) {
    if (guardian.def.ability !== "barrier" || guardian.abilityCooldown > 0) {
      return false;
    }
    allies.filter(function (ally) {
      return ally !== guardian && ally.isAlive() && Math.abs(ally.x - guardian.x) <= guardian.def.range;
    }).forEach(function (ally) {
      ally.barrier = Math.max(ally.barrier, guardian.def.barrier || 40);
      emitEffect(session, ally, "shield");
    });
    guardian.abilityCooldown = guardian.def.cooldown;
    return true;
  }

  function trySummon(session, summoner, emitEffect) {
    if (summoner.def.ability !== "summon" || summoner.abilityCooldown > 0 || summoner.age <= 2) {
      return false;
    }
    var direction = app.PathManager.getDirection(summoner.side);
    var spawnX = app.PathManager.clampX(summoner.x + direction * 28);
    var spawned = session.spawnSystem.spawnFree(session, "basic", summoner.side, spawnX);
    if (!spawned.ok) {
      return false;
    }
    summoner.abilityCooldown = summoner.def.abilityCooldown || 8;
    emitEffect(session, summoner, "summon");
    return true;
  }

  function findHurtAlly(unit, allies) {
    return allies.filter(function (ally) {
      return ally !== unit && ally.isAlive() && ally.hp / ally.maxHp < .82 && Math.abs(ally.x - unit.x) <= unit.def.range;
    }).sort(function (a, b) {
      return (a.hp / a.maxHp) - (b.hp / b.maxHp);
    })[0];
  }

  app.AbilitySystem = {
    applyAttackEffects: applyAttackEffects,
    tryCastBarrier: tryCastBarrier,
    trySummon: trySummon,
    findHurtAlly: findHurtAlly
  };
})(window);
