(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Storage = BigTwo.Storage = BigTwo.Storage || {};
  var configuredBackend = null;

  function backend(explicitBackend) {
    if (explicitBackend) { return explicitBackend; }
    if (configuredBackend) { return configuredBackend; }
    try {
      return global.localStorage || null;
    } catch (error) {
      return null;
    }
  }

  function safeCall(method, key, value, explicitBackend) {
    var target = backend(explicitBackend);
    try {
      if (!target || typeof target[method] !== 'function') {
        return { ok: false, error: new Error('localStorage unavailable') };
      }
      return { ok: true, value: value === undefined ? target[method](key) : target[method](key, value) };
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  function parse(text) {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  function configure(nextBackend) {
    configuredBackend = nextBackend || null;
  }

  function isAvailable(explicitBackend) {
    var probe = Config.STORAGE_KEYS.settings + '.probe';
    var write = safeCall('setItem', probe, '1', explicitBackend);
    if (!write.ok) { return false; }
    safeCall('removeItem', probe, undefined, explicitBackend);
    return true;
  }

  function saveSettings(settings, explicitBackend) {
    var normalized = BigTwo.Utils.Validation.normalizeSettings(settings);
    var result = safeCall('setItem', Config.STORAGE_KEYS.settings, JSON.stringify(normalized), explicitBackend);
    return { ok: result.ok, settings: normalized, error: result.error || null };
  }

  function loadSettings(explicitBackend) {
    var result = safeCall('getItem', Config.STORAGE_KEYS.settings, undefined, explicitBackend);
    var parsed;
    if (!result.ok || result.value == null) {
      return BigTwo.Utils.deepClone(Config.DEFAULT_SETTINGS);
    }
    parsed = parse(result.value);
    if (!parsed.ok) {
      safeCall('removeItem', Config.STORAGE_KEYS.settings, undefined, explicitBackend);
      return BigTwo.Utils.deepClone(Config.DEFAULT_SETTINGS);
    }
    return BigTwo.Utils.Validation.normalizeSettings(parsed.value);
  }

  function normalizeStatistics(value) {
    var defaults = BigTwo.Utils.deepClone(Config.DEFAULT_STATISTICS);
    var keys = ['gamesPlayed', 'gamesWon', 'gamesLost', 'currentWinStreak', 'bestWinStreak'];
    if (!value || typeof value !== 'object') { return defaults; }
    if (!keys.every(function (key) { return Number.isInteger(value[key]) && value[key] >= 0; }) ||
        typeof value.totalScore !== 'number' || !isFinite(value.totalScore) ||
        !value.winsByDifficulty || typeof value.winsByDifficulty !== 'object' ||
        !Config.AI.difficulties.every(function (difficulty) {
          return Number.isInteger(value.winsByDifficulty[difficulty]) && value.winsByDifficulty[difficulty] >= 0;
        })) {
      return defaults;
    }
    return {
      gamesPlayed: value.gamesPlayed,
      gamesWon: value.gamesWon,
      gamesLost: value.gamesLost,
      currentWinStreak: value.currentWinStreak,
      bestWinStreak: value.bestWinStreak,
      totalScore: value.totalScore,
      winsByDifficulty: {
        easy: value.winsByDifficulty.easy,
        normal: value.winsByDifficulty.normal,
        hard: value.winsByDifficulty.hard
      }
    };
  }

  function saveStatistics(statistics, explicitBackend) {
    var normalized = normalizeStatistics(statistics);
    var result = safeCall('setItem', Config.STORAGE_KEYS.statistics, JSON.stringify(normalized), explicitBackend);
    return { ok: result.ok, statistics: normalized, error: result.error || null };
  }

  function loadStatistics(explicitBackend) {
    var result = safeCall('getItem', Config.STORAGE_KEYS.statistics, undefined, explicitBackend);
    var parsed;
    if (!result.ok || result.value == null) { return BigTwo.Utils.deepClone(Config.DEFAULT_STATISTICS); }
    parsed = parse(result.value);
    return parsed.ok ? normalizeStatistics(parsed.value) : BigTwo.Utils.deepClone(Config.DEFAULT_STATISTICS);
  }

  function recordGame(statistics, outcome) {
    var stats = normalizeStatistics(statistics);
    var won = outcome && outcome.won === true;
    var difficulty = outcome && Config.AI.difficulties.indexOf(outcome.difficulty) !== -1 ? outcome.difficulty : 'normal';
    stats.gamesPlayed += 1;
    stats.totalScore += Number(outcome && outcome.scoreDelta) || 0;
    if (won) {
      stats.gamesWon += 1;
      stats.currentWinStreak += 1;
      stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.currentWinStreak);
      stats.winsByDifficulty[difficulty] += 1;
    } else {
      stats.gamesLost += 1;
      stats.currentWinStreak = 0;
    }
    return stats;
  }

  function clearActiveGame(explicitBackend) {
    var result = safeCall('removeItem', Config.STORAGE_KEYS.activeGame, undefined, explicitBackend);
    return { ok: result.ok, error: result.error || null };
  }

  function saveActiveGame(gameState, options) {
    var settings = options && typeof options.setItem === 'function' ? { backend: options } : (options || {});
    var target = settings.backend;
    var validation;
    var snapshot;
    var result;
    if (!gameState || gameState.phase === 'finished') {
      result = clearActiveGame(target);
      return { ok: result.ok, removed: true, error: result.error };
    }
    if (gameState.phase !== 'playing') {
      return { ok: false, reason: 'unstableState', error: null };
    }
    validation = BigTwo.SaveSchema.validateGameState(gameState);
    if (!validation.valid) {
      return { ok: false, reason: validation.reason, error: null };
    }
    snapshot = BigTwo.SaveSchema.createSnapshot(gameState, {
      savedAt: settings.savedAt,
      appVersion: settings.appVersion
    });
    result = safeCall('setItem', Config.STORAGE_KEYS.activeGame, JSON.stringify(snapshot), target);
    return { ok: result.ok, snapshot: snapshot, error: result.error || null };
  }

  function loadActiveGame(explicitBackend) {
    var result = safeCall('getItem', Config.STORAGE_KEYS.activeGame, undefined, explicitBackend);
    var parsed;
    var validation;
    if (!result.ok) {
      return { status: 'unavailable', gameState: null, snapshot: null, error: result.error };
    }
    if (result.value == null) {
      return { status: 'empty', gameState: null, snapshot: null, error: null };
    }
    parsed = parse(result.value);
    if (!parsed.ok) {
      clearActiveGame(explicitBackend);
      return { status: 'invalid', gameState: null, snapshot: null, error: parsed.error, reason: 'invalidJson' };
    }
    validation = BigTwo.SaveSchema.validateSnapshot(parsed.value);
    if (!validation.valid || parsed.value.gameState.phase === 'finished') {
      clearActiveGame(explicitBackend);
      return {
        status: 'invalid', gameState: null, snapshot: null,
        error: null, reason: validation.valid ? 'finishedGame' : validation.reason
      };
    }
    return {
      status: 'ok',
      gameState: BigTwo.Utils.deepClone(parsed.value.gameState),
      snapshot: BigTwo.Utils.deepClone(parsed.value),
      error: null
    };
  }

  function getActiveGame(explicitBackend) {
    var result = loadActiveGame(explicitBackend);
    return result.status === 'ok' ? result.gameState : null;
  }

  function hasActiveGame(explicitBackend) {
    return loadActiveGame(explicitBackend).status === 'ok';
  }

  function getAudioNoticeSeen(explicitBackend) {
    var result = safeCall('getItem', Config.STORAGE_KEYS.audioNoticeSeen, undefined, explicitBackend);
    return !!(result.ok && result.value === 'true');
  }

  function setAudioNoticeSeen(seen, explicitBackend) {
    var result = safeCall('setItem', Config.STORAGE_KEYS.audioNoticeSeen, seen ? 'true' : 'false', explicitBackend);
    return result.ok;
  }

  function clearAll(explicitBackend) {
    return Object.keys(Config.STORAGE_KEYS).map(function (name) {
      return safeCall('removeItem', Config.STORAGE_KEYS[name], undefined, explicitBackend).ok;
    }).every(function (ok) { return ok; });
  }

  Storage.keys = Config.STORAGE_KEYS;
  Storage.configure = configure;
  Storage.isAvailable = isAvailable;
  Storage.saveSettings = saveSettings;
  Storage.loadSettings = loadSettings;
  Storage.saveStatistics = saveStatistics;
  Storage.loadStatistics = loadStatistics;
  Storage.recordGame = recordGame;
  Storage.saveActiveGame = saveActiveGame;
  Storage.loadActiveGame = loadActiveGame;
  Storage.getActiveGame = getActiveGame;
  Storage.hasActiveGame = hasActiveGame;
  Storage.clearActiveGame = clearActiveGame;
  Storage.getAudioNoticeSeen = getAudioNoticeSeen;
  Storage.setAudioNoticeSeen = setAudioNoticeSeen;
  Storage.clearAll = clearAll;
}(window));
