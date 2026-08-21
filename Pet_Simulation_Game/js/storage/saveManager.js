(function (PSG) {
  'use strict';

  function settingsDefaults() {
    return {
      language: null,
      theme: 'candy',
      textScale: 1,
      masterVolume: 0.5,
      bgmVolume: 0.3,
      sfxVolume: 0.65,
      muted: false,
      motion: 'standard',
      battleFast: true
    };
  }
  function normalizeSlot(slot) {
    var value = Math.round(Number(slot));
    return Number.isFinite(value) && value >= 1 && value <= PSG.constants.SAVE_SLOT_COUNT ? value : 1;
  }
  function slotKey(slot) {
    return PSG.constants.SAVE_SLOT_KEY_PREFIX + normalizeSlot(slot);
  }
  function rawForSlot(slot) {
    var target = normalizeSlot(slot);
    var raw = localStorage.getItem(slotKey(target));
    // Keep the original single-save key readable so existing players enter slot 1 safely.
    return raw || (target === 1 ? localStorage.getItem(PSG.constants.SAVE_KEY) : null);
  }
  function parse(raw) {
    return repair(PSG.storage.migrations.run(JSON.parse(raw)));
  }
  function repair(save) {
    // Repair optional/ranged values conservatively; structural ranking corruption is not guessed.
    if (!save.player || !save.pet || !save.day || !save.ranking || !Array.isArray(save.ranking.rankOrder))
      throw new Error('Required save fields are missing');
    if (!PSG.data.species[save.pet.speciesId]) throw new Error('Unknown species');
    if (
      save.ranking.rankOrder.length !== 1000 ||
      save.ranking.rankOrder.filter(function (id) {
        return id === 'player';
      }).length !== 1 ||
      new Set(save.ranking.rankOrder).size !== 1000
    )
      throw new Error('Invalid ranking');
    save.pet.level = PSG.utils.math.clamp(Math.round(Number(save.pet.level) || 1), 1, 100);
    save.pet.energy = PSG.utils.math.clamp(Math.round(Number(save.pet.energy) || 0), 0, 100);
    save.pet.mood = PSG.utils.math.clamp(Math.round(Number(save.pet.mood) || 0), 0, 100);
    save.pet.affection = PSG.utils.math.clamp(Math.round(Number(save.pet.affection) || 0), 0, 100);
    save.pet.mastery = save.pet.mastery || {};
    PSG.constants.STAT_KEYS.forEach(function (key) {
      var existing = save.pet.mastery[key] || {};
      var level = PSG.utils.math.clamp(Math.round(Number(existing.level) || 0), 0, PSG.constants.MAX_MASTERY);
      var xp = Math.max(0, Math.floor(Number(existing.xp) || 0));
      if (level >= PSG.constants.MAX_MASTERY) xp = 0;
      else xp = Math.min(xp, 50 + 25 * level - 1);
      save.pet.mastery[key] = { level: level, xp: xp };
    });
    save.pet.candyBoosts = save.pet.candyBoosts || {};
    PSG.constants.STAT_KEYS.forEach(function (key) {
      save.pet.candyBoosts[key] = PSG.utils.math.clamp(Math.floor(Number(save.pet.candyBoosts[key]) || 0), 0, 10000);
    });
    save.day.actionPoints = PSG.utils.math.clamp(
      Math.round(Number(save.day.actionPoints) || 0),
      0,
      PSG.constants.actionPointsForLevel(save.pet.level)
    );
    save.day.recentPlayIds = Array.isArray(save.day.recentPlayIds) ? save.day.recentPlayIds.slice(-2) : [];
    save.day.recentEventIds = Array.isArray(save.day.recentEventIds) ? save.day.recentEventIds.slice(-2) : [];
    save.day.rngCounter = Number(save.day.rngCounter) || 0;
    save.progression = Object.assign(
      {
        tutorialCompleted: false,
        viewedAffectionEvents: [],
        pendingAffectionEvents: [],
        defeatedRivals: [],
        championUnlocked: false,
        bossWins: 0,
        bossAttempts: 0,
        unlockedCosmetics: []
      },
      save.progression || {}
    );
    save.progression.bossWins = Math.max(0, Math.floor(Number(save.progression.bossWins) || 0));
    save.progression.bossAttempts = Math.max(
      save.progression.bossWins,
      Math.floor(Number(save.progression.bossAttempts) || 0)
    );
    save.economy = Object.assign(
      {
        ownedEquipment: [],
        consumables: {},
        equipped: { armor: null, accessory: null, emblem: null },
        savings: { balance: 0 }
      },
      save.economy || {}
    );
    save.economy.equipped = Object.assign({ armor: null, accessory: null, emblem: null }, save.economy.equipped || {});
    save.economy.savings = Object.assign({ balance: 0 }, save.economy.savings || {});
    save.economy.savings.balance = Math.max(0, Math.floor(Number(save.economy.savings.balance) || 0));
    Object.keys(save.economy.equipped).forEach(function (slot) {
      var item = PSG.data.equipmentById[save.economy.equipped[slot]];
      if (!item || item.slot !== slot) save.economy.equipped[slot] = null;
    });
    save.ranking.battleHistory = Array.isArray(save.ranking.battleHistory) ? save.ranking.battleHistory.slice(-50) : [];
    save.stats = Object.assign(
      {
        battles: 0,
        wins: 0,
        losses: 0,
        bossChallenges: 0,
        bossWins: 0,
        criticalHits: 0,
        dodges: 0,
        trainingGolds: 0,
        daysPlayed: 1
      },
      save.stats || {}
    );
    save.stats.battles = Math.max(0, Math.floor(Number(save.stats.battles) || 0));
    save.stats.wins = Math.max(0, Math.floor(Number(save.stats.wins) || 0));
    save.stats.losses = Math.max(0, Math.floor(Number(save.stats.losses) || 0));
    save.stats.bossChallenges = Math.max(0, Math.floor(Number(save.stats.bossChallenges) || 0));
    save.stats.bossWins = Math.max(0, Math.floor(Number(save.stats.bossWins) || 0));
    var maxHp = PSG.pet.stats.effective(save).hp;
    save.pet.currentHp = PSG.utils.math.clamp(Math.round(Number(save.pet.currentHp) || maxHp), 0, maxHp);
    return save;
  }
  function read(slot) {
    var target = normalizeSlot(slot == null ? PSG.core.gameState.currentSlot : slot);
    var raw = rawForSlot(target);
    if (!raw) return null;
    try {
      return parse(raw);
    } catch (error) {
      try {
        localStorage.setItem(PSG.constants.BACKUP_KEY + '.slot.' + target + '.' + Date.now(), raw);
      } catch (ignored) {}
      PSG.storage.save.lastError = error;
      return null;
    }
  }
  function list() {
    var slots = [];
    for (var slot = 1; slot <= PSG.constants.SAVE_SLOT_COUNT; slot += 1) {
      var raw = rawForSlot(slot);
      if (!raw) {
        slots.push({ slot: slot, save: null, error: null });
        continue;
      }
      try {
        slots.push({ slot: slot, save: parse(raw), error: null });
      } catch (error) {
        slots.push({ slot: slot, save: null, error: error });
      }
    }
    return slots;
  }
  function write(save, slot) {
    var target = normalizeSlot(slot == null ? PSG.core.gameState.currentSlot : slot);
    save.updatedAt = new Date().toISOString();
    // Validate a detached clone before touching the formal key, preserving the previous valid save on failure.
    var repaired = repair(JSON.parse(JSON.stringify(save)));
    var serialized = JSON.stringify(repaired);
    JSON.parse(serialized);
    localStorage.setItem(slotKey(target), serialized);
    // A successful slot-1 write completes migration from the former single-save key.
    if (target === 1) localStorage.removeItem(PSG.constants.SAVE_KEY);
    PSG.core.gameState.current = save;
    PSG.core.gameState.currentSlot = target;
    PSG.core.events.emit('save:written', save);
    return true;
  }
  function loadSettings() {
    var defaults = settingsDefaults();
    try {
      return Object.assign(defaults, JSON.parse(localStorage.getItem(PSG.constants.SETTINGS_KEY) || '{}'));
    } catch (error) {
      return defaults;
    }
  }
  function saveSettings(settings) {
    localStorage.setItem(PSG.constants.SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  }

  PSG.storage.save = {
    read: read,
    list: list,
    write: write,
    repair: repair,
    normalizeSlot: normalizeSlot,
    slotKey: slotKey,
    remove: function (slot) {
      var target = normalizeSlot(slot == null ? PSG.core.gameState.currentSlot : slot);
      localStorage.removeItem(slotKey(target));
      if (target === 1) localStorage.removeItem(PSG.constants.SAVE_KEY);
    },
    has: function (slot) {
      return Boolean(rawForSlot(slot == null ? PSG.core.gameState.currentSlot : slot));
    },
    settingsDefaults: settingsDefaults,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    lastError: null
  };
})(window.PSG);
