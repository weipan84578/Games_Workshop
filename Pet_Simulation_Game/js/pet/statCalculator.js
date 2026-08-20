(function (PSG) {
  'use strict';

  function natural(speciesId, level) {
    var species = PSG.data.species[speciesId];
    if (!species) throw new Error('Unknown species: ' + speciesId);
    var safeLevel = PSG.utils.math.clamp(Math.round(level), 1, 100);
    var result = {};
    // Spec §5.2: natural = round(base + growth × (level - 1)).
    PSG.constants.STAT_KEYS.forEach(function (key) {
      result[key] = Math.round(species.base[key] + species.growth[key] * (safeLevel - 1));
    });
    return result;
  }

  function affectionBonus(affection) {
    if (affection >= 100) return 0.05;
    if (affection >= 60) return 0.03;
    if (affection >= 40) return 0.02;
    if (affection >= 20) return 0.01;
    return 0;
  }

  function effective(saveLike) {
    var pet = saveLike.pet;
    var base = natural(pet.speciesId, pet.level);
    var equipped = saveLike.economy && saveLike.economy.equipped || {};
    var gear = PSG.economy.equipment.bonuses(equipped);
    var bond = 1 + affectionBonus(pet.affection || 0);
    var result = {};
    // Mastery and gear are additive percentages; bond is a separate multiplier.
    // Flooring only here prevents intermediate rounding from drifting at high levels.
    PSG.constants.STAT_KEYS.forEach(function (key) {
      var mastery = pet.mastery && pet.mastery[key] ? pet.mastery[key].level : 0;
      result[key] = Math.floor(base[key] * (1 + mastery * 0.005 + (gear[key] || 0)) * bond);
    });
    return result;
  }

  function critRate(saveLike, consumableId, speciesSpecial) {
    var gear = PSG.economy.equipment.bonuses(saveLike.economy && saveLike.economy.equipped || {});
    var item = PSG.data.consumableById[consumableId];
    var consumable = item && item.type === 'focus' ? item.value / 100 : 0;
    var normal = Math.min(0.20, 0.05 + (gear.crit || 0) + consumable);
    return speciesSpecial && saveLike.pet.speciesId === 'lion' ? Math.min(0.30, normal + 0.10) : normal;
  }

  function battlePower(saveLike) {
    var stats = effective(saveLike);
    var gear = PSG.economy.equipment.bonuses(saveLike.economy && saveLike.economy.equipped || {});
    var displayedCritPoints = Math.round(critRate(saveLike) * 100);
    // Keep the public BP weights next to the implementation so previews and matchmaking share one source.
    var statScore = stats.hp + 4 * stats.attack + 4.3 * stats.defense + 3.2 * stats.mobility + 4 * stats.spAttack + 4.3 * stats.spDefense + 2.8 * stats.speed;
    return Math.round(statScore + 25 * Math.max(0, displayedCritPoints - 5) + (gear.passiveBp || 0));
  }

  PSG.pet.stats = { natural: natural, effective: effective, affectionBonus: affectionBonus, critRate: critRate, battlePower: battlePower };
})(window.PSG);
