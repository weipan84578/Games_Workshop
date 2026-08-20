(function (PSG) {
  'use strict';
  PSG.battle.ai = {
    choose: function (self, enemy) {
      var canSpecial = self.energy >= 100;
      var normalEstimate = PSG.battle.damage.calculate({ level: self.level, power: 80, attack: self.stats.attack, defense: enemy.stats.defense, variance: 1, critical: false }).damage;
      if (self.tactic === 'defense' && self.speciesId === 'crocodile') {
        if (canSpecial && self.shield <= 0) return 'special';
        if (normalEstimate >= enemy.hp) return 'normal';
      }
      if (self.tactic === 'offense' && normalEstimate >= enemy.hp) return 'normal';
      return canSpecial ? 'special' : 'normal';
    }
  };
})(window.PSG);
