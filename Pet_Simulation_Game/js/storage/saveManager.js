(function (PSG) {
  'use strict';

  function settingsDefaults() {
    return { language: null, theme: 'candy', textScale: 1, masterVolume: 0.5, bgmVolume: 0.3, sfxVolume: 0.65, muted: false, motion: 'standard' };
  }
  function repair(save) {
    // Repair optional/ranged values conservatively; structural ranking corruption is not guessed.
    if (!save.player || !save.pet || !save.day || !save.ranking || !Array.isArray(save.ranking.rankOrder)) throw new Error('Required save fields are missing');
    if (!PSG.data.species[save.pet.speciesId]) throw new Error('Unknown species');
    if (save.ranking.rankOrder.length !== 1000 || save.ranking.rankOrder.filter(function (id) { return id === 'player'; }).length !== 1 || new Set(save.ranking.rankOrder).size !== 1000) throw new Error('Invalid ranking');
    save.pet.level = PSG.utils.math.clamp(Math.round(Number(save.pet.level) || 1), 1, 100);
    save.pet.energy = PSG.utils.math.clamp(Math.round(Number(save.pet.energy) || 0), 0, 100);
    save.pet.mood = PSG.utils.math.clamp(Math.round(Number(save.pet.mood) || 0), 0, 100);
    save.pet.affection = PSG.utils.math.clamp(Math.round(Number(save.pet.affection) || 0), 0, 100);
    save.pet.candyBoosts = save.pet.candyBoosts || {};
    PSG.constants.STAT_KEYS.forEach(function (key) {
      save.pet.candyBoosts[key] = PSG.utils.math.clamp(Math.floor(Number(save.pet.candyBoosts[key]) || 0), 0, 10000);
    });
    save.day.actionPoints = PSG.utils.math.clamp(Math.round(Number(save.day.actionPoints) || 0), 0, 5);
    save.day.recentPlayIds = Array.isArray(save.day.recentPlayIds) ? save.day.recentPlayIds.slice(-2) : [];
    save.day.recentEventIds = Array.isArray(save.day.recentEventIds) ? save.day.recentEventIds.slice(-2) : [];
    save.day.rngCounter = Number(save.day.rngCounter) || 0;
    save.progression = Object.assign({ tutorialCompleted: false, viewedAffectionEvents: [], pendingAffectionEvents: [], defeatedRivals: [], championUnlocked: false, unlockedCosmetics: [] }, save.progression || {});
    save.economy = Object.assign({ ownedEquipment: [], consumables: {}, equipped: { armor: null, accessory: null, emblem: null } }, save.economy || {});
    save.economy.equipped = Object.assign({ armor: null, accessory: null, emblem: null }, save.economy.equipped || {});
    Object.keys(save.economy.equipped).forEach(function (slot) { var item = PSG.data.equipmentById[save.economy.equipped[slot]]; if (!item || item.slot !== slot) save.economy.equipped[slot] = null; });
    save.ranking.battleHistory = Array.isArray(save.ranking.battleHistory) ? save.ranking.battleHistory.slice(-50) : [];
    save.stats = Object.assign({ battles: 0, wins: 0, losses: 0, criticalHits: 0, dodges: 0, trainingGolds: 0, daysPlayed: 1 }, save.stats || {});
    var maxHp = PSG.pet.stats.effective(save).hp;
    save.pet.currentHp = PSG.utils.math.clamp(Math.round(Number(save.pet.currentHp) || maxHp), 0, maxHp);
    return save;
  }
  function read() {
    var raw = localStorage.getItem(PSG.constants.SAVE_KEY);
    if (!raw) return null;
    try { return repair(PSG.storage.migrations.run(JSON.parse(raw))); }
    catch (error) {
      try { localStorage.setItem(PSG.constants.BACKUP_KEY + '.' + Date.now(), raw); } catch (ignored) {}
      PSG.storage.save.lastError = error;
      return null;
    }
  }
  function write(save) {
    save.updatedAt = new Date().toISOString();
    // Validate a detached clone before touching the formal key, preserving the previous valid save on failure.
    var repaired = repair(JSON.parse(JSON.stringify(save)));
    var serialized = JSON.stringify(repaired);
    JSON.parse(serialized);
    localStorage.setItem(PSG.constants.SAVE_KEY, serialized);
    PSG.core.gameState.current = save;
    PSG.core.events.emit('save:written', save);
    return true;
  }
  function loadSettings() {
    var defaults = settingsDefaults();
    try { return Object.assign(defaults, JSON.parse(localStorage.getItem(PSG.constants.SETTINGS_KEY) || '{}')); } catch (error) { return defaults; }
  }
  function saveSettings(settings) { localStorage.setItem(PSG.constants.SETTINGS_KEY, JSON.stringify(settings)); return settings; }

  PSG.storage.save = { read: read, write: write, repair: repair, remove: function () { localStorage.removeItem(PSG.constants.SAVE_KEY); }, has: function () { return Boolean(localStorage.getItem(PSG.constants.SAVE_KEY)); }, settingsDefaults: settingsDefaults, loadSettings: loadSettings, saveSettings: saveSettings, lastError: null };
})(window.PSG);
