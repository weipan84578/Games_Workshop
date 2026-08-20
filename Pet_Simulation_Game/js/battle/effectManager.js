(function (PSG) {
  'use strict';
  PSG.battle.effects = {
    mobility: function (combatant) { return combatant.stats.mobility * (combatant.effects.eagleMobility > 0 ? 1.2 : 1); },
    tickOwnAction: function (combatant, created) {
      if (combatant.effects.eagleMobility > 0 && !created.eagle) combatant.effects.eagleMobility -= 1;
      if (combatant.effects.shieldTurns > 0 && !created.shield) {
        combatant.effects.shieldTurns -= 1;
        if (combatant.effects.shieldTurns === 0) combatant.shield = 0;
      }
    }
  };
})(window.PSG);
