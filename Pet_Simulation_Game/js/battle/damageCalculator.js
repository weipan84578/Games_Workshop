(function (PSG) {
  'use strict';

  function damage(options) {
    // Spec §12.1. Variance is clamped here as a second safety boundary for injected RNG sources.
    var effectiveLevel = Math.max(Number(options.level) || 1, 10);
    var levelFactor = (2 * effectiveLevel) / 5 + 2;
    var ratio = Math.max(0, Number(options.attack) || 0) / Math.max(1, Number(options.defense) || 1);
    var base = (levelFactor * Number(options.power) * ratio) / 50 + 2;
    var variance = PSG.utils.math.clamp(Number(options.variance == null ? 1 : options.variance), 0.95, 1.05);
    var result = Math.floor(Math.max(1, base * variance * (options.critical ? 1.75 : 1)));
    return { damage: result, base: base, variance: variance, criticalMultiplier: options.critical ? 1.75 : 1 };
  }
  function accuracyRatio(accuracy, mobility) {
    var safeAccuracy = Math.max(0, Number(accuracy) || 0);
    var threshold = Math.max(1, 2 * (Number(mobility) || 0));
    return Math.min(1, safeAccuracy / threshold);
  }
  function evasion(mobility, level, effectMultiplier, accuracy) {
    // The 40% hard cap applies after attack-specific modifiers such as Eagle's half-evasion dive.
    var reference = 12 + 0.8 * ((Number(level) || 1) - 1);
    var raw = 0.03 + 0.15 * ((Number(mobility) || 0) / reference);
    var remainingDodge = 1 - accuracyRatio(accuracy, mobility);
    return Math.min(0.4, Math.max(0, raw * remainingDodge * (effectMultiplier == null ? 1 : effectMultiplier)));
  }
  function hitChance(accuracy, mobility, level, effectMultiplier) {
    return 1 - evasion(mobility, level, effectMultiplier, accuracy);
  }
  function opponentXpMultiplier(ratio) {
    if (ratio < 0.85) return 0.7;
    if (ratio < 0.95) return 0.9;
    if (ratio <= 1.05) return 1;
    if (ratio <= 1.15) return 1.15;
    return 1.3;
  }
  PSG.battle.damage = {
    calculate: damage,
    accuracyRatio: accuracyRatio,
    evasion: evasion,
    hitChance: hitChance,
    opponentXpMultiplier: opponentXpMultiplier
  };
})(window.PSG);
