(function (NimGame) {
  'use strict';

  var SETTINGS_KEY = 'nimGame.settings';
  var SAVE_KEY = 'nimGame.saveData';
  var VERSION_KEY = 'nimGame.version';
  var VERSION = 1;

  var DEFAULT_SETTINGS = {
    language: 'zh-TW',
    theme: 'cute',
    bgmVolume: 0.22,
    sfxVolume: 0.7,
    bgmEnabled: true,
    sfxEnabled: true,
    difficulty: 'normal',
    rule: 'misere',
    setup: 'classic',
    firstTurn: 'player',
    objectSkin: 'stone',
    reduceMotion: false,
    customPiles: [3, 4, 5]
  };

  var settings = null;
  var game = null;

  function sanitizeSettings(raw) {
    var next = Object.assign({}, DEFAULT_SETTINGS, raw || {});
    next.bgmVolume = NimGame.dom.clamp(Number(next.bgmVolume), 0, 1);
    next.sfxVolume = NimGame.dom.clamp(Number(next.sfxVolume), 0, 1);
    next.customPiles = (Array.isArray(next.customPiles) ? next.customPiles : DEFAULT_SETTINGS.customPiles)
      .slice(0, 6)
      .map(function (count) {
        return NimGame.dom.clamp(parseInt(count, 10) || 1, 1, 20);
      });
    while (next.customPiles.length < 2) {
      next.customPiles.push(1);
    }
    return next;
  }

  function loadSettings() {
    var stored = NimGame.Storage.get(SETTINGS_KEY, null);
    settings = sanitizeSettings(stored);
    if (!stored && NimGame.i18n) {
      settings.language = NimGame.i18n.detectLanguage();
    }
    saveSettings();
    NimGame.Storage.set(VERSION_KEY, VERSION);
    return settings;
  }

  function saveSettings() {
    NimGame.Storage.set(SETTINGS_KEY, settings);
  }

  function updateSettings(partial) {
    settings = sanitizeSettings(Object.assign({}, settings || DEFAULT_SETTINGS, partial || {}));
    saveSettings();
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.skin = settings.objectSkin;
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false';
    document.dispatchEvent(new CustomEvent('nim:settings-change', { detail: { settings: settings } }));
    return settings;
  }

  function startNewGame() {
    game = NimGame.GameEngine.createGame(settings);
    saveGame();
    return game;
  }

  function loadGame() {
    var saved = NimGame.Storage.get(SAVE_KEY, null);
    if (!saved || saved.status === 'ended') {
      game = null;
      return null;
    }
    game = NimGame.GameEngine.createGame(settings, saved);
    return game;
  }

  function saveGame() {
    if (!game || game.status === 'ended') {
      NimGame.Storage.remove(SAVE_KEY);
      return;
    }
    NimGame.Storage.set(SAVE_KEY, Object.assign({}, game, {
      savedAt: Date.now(),
      rule: game.rule,
      difficulty: game.difficulty,
      setup: game.setup,
      objectSkin: game.objectSkin
    }));
  }

  function hasSave() {
    var saved = NimGame.Storage.get(SAVE_KEY, null);
    return Boolean(saved && saved.status === 'playing' && Array.isArray(saved.piles));
  }

  function clearSave() {
    game = null;
    NimGame.Storage.remove(SAVE_KEY);
    document.dispatchEvent(new CustomEvent('nim:save-change'));
  }

  function setGame(nextGame) {
    game = nextGame;
    saveGame();
  }

  function getState() {
    return {
      settings: settings,
      game: game
    };
  }

  NimGame.StateManager = {
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    updateSettings: updateSettings,
    startNewGame: startNewGame,
    loadGame: loadGame,
    saveGame: saveGame,
    hasSave: hasSave,
    clearSave: clearSave,
    setGame: setGame,
    getState: getState
  };
}(window.NimGame = window.NimGame || {}));
