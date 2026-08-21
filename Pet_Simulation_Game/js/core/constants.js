(function (PSG) {
  'use strict';

  PSG.constants = Object.freeze({
    SAVE_KEY: 'psg.save.v1',
    SAVE_SLOT_KEY_PREFIX: 'psg.save.v1.slot.',
    SAVE_SLOT_COUNT: 3,
    SETTINGS_KEY: 'psg.settings.v1',
    BACKUP_KEY: 'psg.save.backup',
    SCHEMA_VERSION: 1,
    MAX_LEVEL: 100,
    MAX_MASTERY: 20,
    MAX_STATUS: 100,
    DAILY_AP_TIERS: [
      { maxLevel: 30, ap: 7 },
      { maxLevel: 50, ap: 10 },
      { maxLevel: 75, ap: 12 },
      { maxLevel: 100, ap: 15 }
    ],
    actionPointsForLevel: function (level) {
      var safeLevel = Math.max(1, Math.min(100, Math.round(Number(level) || 1)));
      for (var index = 0; index < this.DAILY_AP_TIERS.length; index += 1) {
        if (safeLevel <= this.DAILY_AP_TIERS[index].maxLevel) return this.DAILY_AP_TIERS[index].ap;
      }
      return this.DAILY_AP_TIERS[this.DAILY_AP_TIERS.length - 1].ap;
    },
    MAX_RANK: 1000,
    MAX_BATTLE_ROUNDS: 20,
    BOSS_BATTLE_ROUNDS: 80,
    STAT_KEYS: ['hp', 'attack', 'accuracy', 'defense', 'mobility', 'spAttack', 'spDefense', 'speed'],
    ACTIONS: Object.freeze({
      training: { ap: 1, minEnergy: 20, energy: -20, mood: -5, affection: 1 },
      play: { ap: 1, minEnergy: 10, energy: -10, mood: 20, affection: 5 },
      outing: { ap: 1, minEnergy: 15, energy: -15, mood: 15, affection: 4 },
      battle: { ap: 2, minEnergy: 30, minMood: 20, energy: -25 },
      bossBattle: { ap: 0, minEnergy: 5, minMood: 5, energy: -5 },
      rest: { energy: 50, mood: 10 }
    }),
    AFFECTION_THRESHOLDS: [20, 40, 60, 80, 100]
  });
})(window.PSG);
