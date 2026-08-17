(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var dt = 0.1;

  function makeCombatant(instance, side, index, modifiers, enemyScale) {
    var display = app.UnitData.getDisplay(instance);
    if (side === "player") display = app.SynergySystem.applyToDisplay(display, modifiers);
    var scale = enemyScale || 1;
    var health = Math.round(display.health * scale);
    return {
      id: instance.instanceId || app.Helpers.uid("combat"),
      typeId: instance.typeId,
      star: instance.star || 1,
      side: side,
      index: index,
      name: display.name,
      abilityName: display.ability,
      ability: display.ability,
      icon: display.icon,
      classId: display.classId,
      maxHealth: health,
      health: health,
      attack: Math.round(display.attack * scale),
      defense: Math.round(display.defense * scale),
      attackSpeed: display.attackSpeed,
      manaMax: display.manaMax,
      mana: Math.min(display.manaMax, display.startingMana || 0),
      manaGain: display.manaGain || 1,
      damageReduction: display.damageReduction || 0,
      spellMultiplier: display.spellMultiplier || 1,
      abilityData: app.UnitData.get(instance.typeId).ability,
      actionTimer: 0.56 + index * 0.04,
      shield: 0,
      alive: true,
      dead: false
    };
  }

  function alive(team) {
    return team.filter(function (unit) { return !unit.dead && unit.alive && unit.health > 0; });
  }

  function chooseTarget(actor, opponents, strategy) {
    var living = alive(opponents);
    if (!living.length) return null;
    if (strategy === "lowest") {
      return living.slice().sort(function (a, b) { return a.health - b.health; })[0];
    }
    return living.slice().sort(function (a, b) {
      return Math.abs(a.index - actor.index) - Math.abs(b.index - actor.index);
    })[0];
  }

  function pushEvent(events, event) {
    if (events.length < 140) events.push(event);
  }

  function applyDamage(target, amount) {
    var damage = Math.max(1, Math.round(amount * (1 - (target.damageReduction || 0))));
    var absorbed = Math.min(target.shield || 0, damage);
    target.shield -= absorbed;
    damage -= absorbed;
    target.health = Math.max(0, target.health - damage);
    if (target.health <= 0) {
      target.alive = false;
      target.dead = true;
    }
    return Math.max(1, damage);
  }

  function castSkill(actor, allies, opponents, events, strategy) {
    var ability = actor.abilityData || {};
    var spellPower = actor.spellMultiplier || 1;
    var target = chooseTarget(actor, opponents, strategy);
    var ally = alive(allies).sort(function (a, b) { return (a.health / a.maxHealth) - (b.health / b.maxHealth); })[0];
    pushEvent(events, { type: "skill", attacker: actor.name, skill: actor.abilityName });
    if (ability.type === "heal") {
      var healTarget = ally || actor;
      var amount = Math.round(healTarget.maxHealth * ability.value * spellPower);
      healTarget.health = Math.min(healTarget.maxHealth, healTarget.health + amount);
      pushEvent(events, { type: "heal", target: healTarget.name, amount: amount });
    } else if (ability.type === "shield") {
      actor.shield += Math.round(actor.maxHealth * ability.value * spellPower);
      pushEvent(events, { type: "shield", target: actor.name, amount: actor.shield });
    } else if (ability.type === "aoe") {
      opponents.forEach(function (enemy) {
        if (!enemy.alive) return;
        var damage = applyDamage(enemy, actor.attack * ability.value * spellPower);
        pushEvent(events, { type: "attack", attacker: actor.name, target: enemy.name, damage: damage, skillHit: true });
        if (!enemy.alive) pushEvent(events, { type: "defeat", name: enemy.name });
      });
    } else if (target) {
      var burst = applyDamage(target, actor.attack * ability.value * spellPower);
      pushEvent(events, { type: "attack", attacker: actor.name, target: target.name, damage: burst, skillHit: true });
      if (!target.alive) pushEvent(events, { type: "defeat", name: target.name });
    }
    actor.mana = 0;
  }

  app.BattleSystem = {
    damageFormula: function (attack, defense) {
      return Math.max(1, attack * (1 - defense / (defense + 100)));
    },
    simulate: function (state, playerInstances) {
      var modifiers = app.SynergySystem.getModifiers(state);
      var players = playerInstances.map(function (instance, index) { return makeCombatant(instance, "player", index, modifiers, 1); });
      var enemies = app.StageData.createEnemies(state.round).map(function (instance, index) { return makeCombatant(instance, "enemy", index, {}, instance.enemyScale); });
      var events = [];
      var totalTicks = 0;
      var targetStrategy = state.targetStrategy || "nearest";

      while (alive(players).length && alive(enemies).length && totalTicks < 360) {
        var actors = players.concat(enemies);
        actors.forEach(function (actor) {
          if (!actor.alive) return;
          var opponents = actor.side === "player" ? enemies : players;
          var allies = actor.side === "player" ? players : enemies;
          actor.actionTimer += actor.attackSpeed * dt;
          if (actor.actionTimer >= 1) {
            var target = chooseTarget(actor, opponents, actor.side === "player" ? targetStrategy : "nearest");
            if (target) {
              var damage = applyDamage(target, this.damageFormula(actor.attack, target.defense));
              actor.mana += 11 * actor.manaGain;
              target.mana += 7 * target.manaGain;
              pushEvent(events, { type: "attack", attacker: actor.name, target: target.name, damage: damage });
              if (!target.alive) pushEvent(events, { type: "defeat", name: target.name });
            }
            actor.actionTimer -= 1;
          }
          if (actor.alive && actor.mana >= actor.manaMax) castSkill(actor, allies, actor.side === "player" ? enemies : players, events, actor.side === "player" ? targetStrategy : "nearest");
        }, this);
        totalTicks += 1;
      }

      var playerAlive = alive(players);
      var enemyAlive = alive(enemies);
      var winner = playerAlive.length && !enemyAlive.length ? "player" : enemyAlive.length && !playerAlive.length ? "enemy" : "draw";
      if (winner === "draw") {
        var playerHealth = playerAlive.reduce(function (sum, unit) { return sum + unit.health; }, 0);
        var enemyHealth = enemyAlive.reduce(function (sum, unit) { return sum + unit.health; }, 0);
        winner = playerHealth > enemyHealth ? "player" : enemyHealth > playerHealth ? "enemy" : "draw";
      }
      var damage = 0;
      if (winner === "enemy") {
        damage = Math.max(1, enemyAlive.reduce(function (sum, unit) { return sum + 1 + (unit.star - 1) * 2; }, 0));
      }
      return {
        winner: winner,
        damage: damage,
        playerSurvivors: playerAlive.length,
        enemySurvivors: enemyAlive.length,
        events: events,
        ticks: totalTicks,
        playerTeam: players,
        enemyTeam: enemies
      };
    }
  };
}(window));
