(function (PSG) {
  'use strict';

  function masteryDefaults() {
    var mastery = {};
    PSG.constants.STAT_KEYS.forEach(function (key) { mastery[key] = { level: 0, xp: 0 }; });
    return mastery;
  }
  function create(playerName, petName, speciesId, seed) {
    var now = new Date().toISOString();
    var save = {
      schemaVersion: 1, createdAt: now, updatedAt: now, completedAt: null,
      player: { name: playerName, bestRank: 1000, coins: 0 },
      pet: { name: petName, speciesId: speciesId, level: 1, xp: 0, energy: 80, mood: 80, affection: 0, currentHp: PSG.data.species[speciesId].base.hp, mastery: masteryDefaults() },
      day: { number: 1, actionPoints: 5, recentPlayIds: [], recentEventIds: [], rngCounter: 0 },
      progression: { tutorialCompleted: false, viewedAffectionEvents: [], pendingAffectionEvents: [], defeatedRivals: [], championUnlocked: false, unlockedCosmetics: [] },
      economy: { ownedEquipment: [], consumables: {}, equipped: { armor: null, accessory: null, emblem: null } },
      ranking: { rankingSeed: (seed || Date.now()) >>> 0, rankOrder: [], candidateIds: [], battleHistory: [] },
      stats: { battles: 0, wins: 0, losses: 0, criticalHits: 0, dodges: 0, trainingGolds: 0, daysPlayed: 1 }
    };
    save.ranking.rankOrder = PSG.ranking.generator.createRankOrder(save.ranking.rankingSeed);
    PSG.ranking.matchmaking.refresh(save);
    return save;
  }

  PSG.core.gameState = {
    current: null,
    create: create,
    set: function (save) { this.current = save; PSG.core.events.emit('state:changed', save); return save; },
    get: function () { return this.current; }
  };
})(window.PSG);
