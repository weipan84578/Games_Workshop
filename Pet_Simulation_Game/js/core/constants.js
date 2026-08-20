(function (PSG) {
  'use strict';

  PSG.constants = Object.freeze({
    SAVE_KEY: 'psg.save.v1',
    SETTINGS_KEY: 'psg.settings.v1',
    BACKUP_KEY: 'psg.save.backup',
    SCHEMA_VERSION: 1,
    MAX_LEVEL: 100,
    MAX_MASTERY: 20,
    MAX_STATUS: 100,
    DAILY_AP: 5,
    MAX_RANK: 1000,
    MAX_BATTLE_ROUNDS: 20,
    STAT_KEYS: ['hp', 'attack', 'defense', 'mobility', 'spAttack', 'spDefense', 'speed'],
    ACTIONS: Object.freeze({
      training: { ap: 1, minEnergy: 20, energy: -20, mood: -5, affection: 1 },
      play: { ap: 1, minEnergy: 10, energy: -10, mood: 20, affection: 5 },
      outing: { ap: 1, minEnergy: 15, energy: -15, mood: 15, affection: 4 },
      battle: { ap: 2, minEnergy: 30, minMood: 20, energy: -25 },
      rest: { energy: 50, mood: 10 }
    }),
    AFFECTION_THRESHOLDS: [20, 40, 60, 80, 100]
  });
})(window.PSG);
