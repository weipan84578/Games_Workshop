(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function boardInstances(state) {
    return state.board.filter(Boolean);
  }

  function counts(state) {
    var result = { race: {}, class: {} };
    boardInstances(state).forEach(function (instance) {
      var base = app.UnitData.get(instance.typeId);
      if (!base) return;
      result.race[base.race] = (result.race[base.race] || 0) + 1;
      result.class[base.classId] = (result.class[base.classId] || 0) + 1;
    });
    return result;
  }

  function activeThreshold(definition, count) {
    return definition.thresholds.reduce(function (best, tier) {
      return count >= tier.count && tier.count > (best ? best.count : 0) ? tier : best;
    }, null);
  }

  app.SynergySystem = {
    getCounts: counts,
    getActive: function (state) {
      var tally = counts(state);
      return app.SynergyData.map(function (definition) {
        var count = tally[definition.type][definition.key] || 0;
        var active = activeThreshold(definition, count);
        var next = definition.thresholds.find(function (tier) { return tier.count > count; }) || null;
        return { key: definition.key, type: definition.type, count: count, active: active, next: next, definition: definition };
      });
    },
    getModifiers: function (state) {
      var modifiers = { attackPct: 0, defensePct: 0, healthPct: 0, speedPct: 0, manaPct: 0, guardianDamagePct: 0, strikerAttackPct: 0, spellPct: 0, rangerSpeedPct: 0, mageMana: 0 };
      this.getActive(state).forEach(function (entry) {
        if (entry.active) modifiers[entry.active.stat] = Math.max(modifiers[entry.active.stat], entry.active.value);
      });
      return modifiers;
    },
    applyToDisplay: function (display, modifiers) {
      var next = Object.assign({}, display);
      var isGuardian = display.classId === "guardian";
      var isStriker = display.classId === "striker";
      var isMystic = display.classId === "mystic";
      var isRanger = display.classId === "ranger";
      var isMage = display.classId === "mage";
      next.maxHealth = Math.round(display.health * (1 + modifiers.healthPct));
      next.health = next.maxHealth;
      next.attack = Math.round(display.attack * (1 + modifiers.attackPct + (isStriker ? modifiers.strikerAttackPct : 0)));
      next.defense = Math.round(display.defense * (1 + modifiers.defensePct));
      next.attackSpeed = display.attackSpeed * (1 + modifiers.speedPct + (isRanger ? modifiers.rangerSpeedPct : 0));
      next.manaMax = display.manaMax;
      next.startingMana = isMage ? modifiers.mageMana : 0;
      next.manaGain = 1 + modifiers.manaPct;
      next.damageReduction = isGuardian ? modifiers.guardianDamagePct : 0;
      next.spellMultiplier = 1 + (isMystic ? modifiers.spellPct : 0);
      return next;
    },
    boardInstances: boardInstances
  };
}(window));
