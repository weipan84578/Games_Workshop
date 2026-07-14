(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var settings = null;
  var statistics = null;
  var gameState = null;
  var continueInfo = { status: 'empty' };
  var router = null;
  var toastController = null;
  var dialogController = null;
  var animationController = null;
  var audioManager = null;
  var aiTimer = null;
  var busy = false;
  var initialized = false;
  var localeUnsubscribe = null;
  var actionBarObserver = null;
  var actionBarFrame = null;
  var recordedRound = null;
  var visibilityHandler = null;
  var audioWarningHandler = null;

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }
  function clone(value) {
    if (BigTwo.Utils && typeof BigTwo.Utils.deepClone === 'function') { return BigTwo.Utils.deepClone(value); }
    return JSON.parse(JSON.stringify(value));
  }
  function defaults() {
    return clone(BigTwo.Config && BigTwo.Config.DEFAULT_SETTINGS || {
      difficulty: 'normal', theme: 'realistic', locale: 'zh-Hant', animationsEnabled: true,
      musicEnabled: true, musicVolume: 40, sfxEnabled: true, sfxVolume: 70, musicTrack: 'auto'
    });
  }
  function defaultStatistics() {
    return clone(BigTwo.Config && BigTwo.Config.DEFAULT_STATISTICS || {
      gamesPlayed: 0, gamesWon: 0, gamesLost: 0, currentWinStreak: 0,
      bestWinStreak: 0, totalScore: 0, winsByDifficulty: { easy: 0, normal: 0, hard: 0 }
    });
  }

  function storedSettingsExist() {
    var key = BigTwo.Config && BigTwo.Config.STORAGE_KEYS && BigTwo.Config.STORAGE_KEYS.settings;
    try { return Boolean(key && global.localStorage && global.localStorage.getItem(key) != null); }
    catch (error) { return false; }
  }

  function loadSettings() {
    var hasSaved = storedSettingsExist();
    var loaded = defaults();
    try {
      if (BigTwo.Storage && typeof BigTwo.Storage.loadSettings === 'function') {
        loaded = BigTwo.Storage.loadSettings();
      }
    } catch (error) { loaded = defaults(); }
    if (!hasSaved && BigTwo.I18n) {
      loaded.locale = BigTwo.I18n.detectLocale();
    }
    return loaded;
  }

  function loadStatistics() {
    try {
      return BigTwo.Storage && typeof BigTwo.Storage.loadStatistics === 'function'
        ? BigTwo.Storage.loadStatistics() : defaultStatistics();
    } catch (error) { return defaultStatistics(); }
  }

  function refreshContinueInfo(showNotice) {
    var result = { status: 'empty' };
    try {
      if (BigTwo.Storage && typeof BigTwo.Storage.loadActiveGame === 'function') {
        result = BigTwo.Storage.loadActiveGame();
      } else if (gameState && gameState.phase === 'playing') {
        result = { status: 'ok', gameState: gameState };
      }
    } catch (error) {
      result = { status: 'unavailable', error: error };
    }
    continueInfo = {
      status: result.status || (result.gameState ? 'ok' : 'empty'),
      round: result.gameState && result.gameState.roundNumber,
      savedAt: result.snapshot && result.snapshot.savedAt || new Date().toISOString(),
      gameState: result.gameState || null
    };
    if (showNotice && result.status === 'invalid') {
      toast(t('home.corruptSave'), { type: 'warning' });
    } else if (showNotice && result.status === 'unavailable') {
      toast(t('home.storageUnavailable'), { type: 'warning', duration: 5000 });
    }
    return continueInfo;
  }

  function applyTheme(theme) {
    var allowed = ['realistic', 'midnight', 'sakura', 'cuteParty'];
    var next = allowed.indexOf(theme) >= 0 ? theme : 'realistic';
    global.document.body.dataset.theme = next;
    global.document.documentElement.style.colorScheme = next === 'midnight' ? 'dark' : 'light';
  }

  function configureAudio() {
    var AudioNS = BigTwo.Audio || {};
    audioManager = AudioNS.manager || null;
    if (!audioManager && typeof AudioNS.AudioManager === 'function') {
      audioManager = new AudioNS.AudioManager();
      AudioNS.manager = audioManager;
    }
    if (audioManager && typeof audioManager.init === 'function') {
      try { audioManager.init(settings, global.document); } catch (error) { /* audio degrades silently */ }
    } else if (AudioNS && typeof AudioNS.init === 'function') {
      try { AudioNS.init(settings, global.document); } catch (error) { /* audio degrades silently */ }
    }
  }

  function toast(message, options) {
    if (toastController) { toastController.show(message, options); }
  }

  function announce(message, assertive) {
    var region = global.document.getElementById(assertive ? 'alert-live' : 'status-live');
    if (!region) { return; }
    region.textContent = '';
    global.setTimeout(function () { region.textContent = message; }, 20);
  }

  function playSfx(name) {
    try {
      if (audioManager && typeof audioManager.playSfx === 'function') { return audioManager.playSfx(name); }
      if (BigTwo.Audio && typeof BigTwo.Audio.playSfx === 'function') { return BigTwo.Audio.playSfx(name); }
    } catch (error) { return false; }
    return false;
  }

  function saveGame() {
    if (!gameState || gameState.phase !== 'playing') { return false; }
    try {
      return Boolean(BigTwo.Storage && typeof BigTwo.Storage.saveActiveGame === 'function' &&
        BigTwo.Storage.saveActiveGame(gameState).ok);
    } catch (error) { return false; }
  }

  function clearAITimer() {
    if (aiTimer) {
      global.clearTimeout(aiTimer);
      aiTimer = null;
    }
  }

  function syncActionBarHeight() {
    if (actionBarFrame) { global.cancelAnimationFrame(actionBarFrame); }
    actionBarFrame = global.requestAnimationFrame(function () {
      var bar = global.document.querySelector('.action-bar');
      actionBarFrame = null;
      if (actionBarObserver) { actionBarObserver.disconnect(); actionBarObserver = null; }
      if (!bar) {
        global.document.documentElement.style.setProperty('--action-bar-height', '0px');
        return;
      }
      function update() {
        global.document.documentElement.style.setProperty('--action-bar-height', Math.ceil(bar.getBoundingClientRect().height) + 'px');
      }
      update();
      if (typeof global.ResizeObserver === 'function') {
        actionBarObserver = new global.ResizeObserver(update);
        actionBarObserver.observe(bar);
      }
    });
  }

  function navigate(name, params) {
    if (!router) { return false; }
    if (name !== 'game') {
      clearAITimer();
      busy = false;
    }
    var result = router.navigate(name, params);
    syncActionBarHeight();
    playSfx('button');
    return result;
  }

  function refreshGame() {
    if (router && router.currentName === 'game') {
      router.refresh();
      syncActionBarHeight();
    }
  }

  function recordFinishedRound() {
    var result;
    var delta;
    var signature;
    if (!gameState || gameState.phase !== 'finished' || !gameState.roundResult) { return; }
    result = gameState.roundResult;
    signature = String(gameState.roundNumber) + ':' + String(result.winnerId) + ':' + String(gameState.actionHistory.length);
    if (recordedRound === signature) { return; }
    recordedRound = signature;
    delta = result.deltas && result.deltas.human || 0;
    try {
      if (BigTwo.Storage && typeof BigTwo.Storage.recordGame === 'function') {
        statistics = BigTwo.Storage.recordGame(statistics, {
          won: result.winnerId === 'human', difficulty: gameState.difficulty || settings.difficulty, scoreDelta: delta
        });
      } else {
        statistics.gamesPlayed += 1;
        statistics.totalScore += delta;
        if (result.winnerId === 'human') {
          statistics.gamesWon += 1;
          statistics.currentWinStreak += 1;
          statistics.bestWinStreak = Math.max(statistics.bestWinStreak, statistics.currentWinStreak);
          statistics.winsByDifficulty[gameState.difficulty || settings.difficulty] += 1;
        } else {
          statistics.gamesLost += 1;
          statistics.currentWinStreak = 0;
        }
      }
      if (BigTwo.Storage && typeof BigTwo.Storage.saveStatistics === 'function') {
        BigTwo.Storage.saveStatistics(statistics);
      }
      if (BigTwo.Storage && typeof BigTwo.Storage.saveActiveGame === 'function') {
        BigTwo.Storage.saveActiveGame(gameState);
      }
    } catch (error) { /* statistics must not block results */ }
  }

  function errorKey(code) {
    var map = {
      NOT_CURRENT_PLAYER: 'game.error.notYourTurn',
      NO_CARDS_SELECTED: 'game.error.noSelection',
      INVALID_CARD_IDS: 'game.error.invalidHand',
      CARD_NOT_IN_HAND: 'game.error.invalidHand',
      INVALID_HAND: 'game.error.invalidHand',
      CANNOT_BEAT_TABLE: 'game.error.cannotBeat',
      OPENING_CARD_REQUIRED: 'game.error.openingClub3',
      CANNOT_PASS_ON_LEAD: 'game.error.passLeading',
      GAME_NOT_PLAYING: 'game.error.busy'
    };
    return map[code] || 'game.error.invalidHand';
  }

  function reportActionError(code, element) {
    var message = t(errorKey(code));
    playSfx('invalid');
    toast(message, { type: 'error', assertive: true });
    announce(message, true);
    if (animationController) { animationController.shake(element); }
  }

  function afterAction(action) {
    if (action.type === 'PASS') { playSfx('pass'); }
    else { playSfx('play'); }
    saveGame();
    if (gameState.phase === 'finished') {
      busy = false;
      recordFinishedRound();
      navigate('results');
      return;
    }
    busy = false;
    refreshGame();
    ensureAITurn();
  }

  function applyAction(action) {
    try {
      if (!BigTwo.Game || typeof BigTwo.Game.applyAction !== 'function') {
        throw new Error('GAME_UNAVAILABLE');
      }
      gameState = BigTwo.Game.applyAction(gameState, action);
      afterAction(action);
      return true;
    } catch (error) {
      busy = false;
      reportActionError(error.code || (error.message === 'GAME_UNAVAILABLE' ? 'GAME_NOT_PLAYING' : 'INVALID_HAND'));
      refreshGame();
      return false;
    }
  }

  function dispatchHuman(action) {
    if (busy || !gameState || gameState.phase !== 'playing') {
      reportActionError('GAME_NOT_PLAYING');
      return Promise.resolve(false);
    }
    var current = gameState.players[gameState.currentPlayerIndex];
    if (!current || current.id !== 'human') {
      reportActionError('NOT_CURRENT_PLAYER');
      return Promise.resolve(false);
    }
    busy = true;
    return Promise.resolve(applyAction(action));
  }

  function fallbackAIAction() {
    var current = gameState && gameState.players[gameState.currentPlayerIndex];
    var moves = BigTwo.Game && typeof BigTwo.Game.getLegalMovesForCurrentPlayer === 'function'
      ? BigTwo.Game.getLegalMovesForCurrentPlayer(gameState) : [];
    if (moves.length) {
      return { type: 'PLAY_CARDS', playerId: current.id, cardIds: moves[0].map(function (card) { return card.id; }) };
    }
    return { type: 'PASS', playerId: current.id };
  }

  function ensureAITurn() {
    var current;
    var delay;
    if (busy || aiTimer || !gameState || gameState.phase !== 'playing' || !gameState.players) { return; }
    current = gameState.players[gameState.currentPlayerIndex];
    if (!current || current.kind !== 'ai') {
      if (current && current.id === 'human') {
        announce(t('game.yourTurn'));
        playSfx('turn');
      }
      return;
    }
    busy = true;
    announce(t('game.thinking', { name: t('player.' + current.id) }));
    refreshGame();
    delay = settings.animationsEnabled ? 350 + Math.floor(Math.random() * 351) : 50;
    aiTimer = global.setTimeout(function () {
      var action;
      var rng;
      aiTimer = null;
      try {
        rng = BigTwo.Utils && BigTwo.Utils.RNG
          ? BigTwo.Utils.RNG.create(gameState.rngState + ':turn:' + gameState.actionHistory.length) : null;
        action = BigTwo.AI.chooseAction(gameState, current.id, gameState.difficulty || settings.difficulty, rng);
      } catch (error) {
        try { action = fallbackAIAction(); }
        catch (fallbackError) {
          busy = false;
          toast(t('dialog.unexpectedBody'), { type: 'error' });
          refreshGame();
          return;
        }
      }
      applyAction(action);
    }, delay);
  }

  function startNewGame() {
    if (!BigTwo.Game || typeof BigTwo.Game.createNewGame !== 'function') {
      toast(t('game.error.unavailable'), { type: 'error', assertive: true });
      return false;
    }
    clearAITimer();
    busy = false;
    recordedRound = null;
    try {
      gameState = BigTwo.Game.createNewGame({
        seed: BigTwo.Utils && BigTwo.Utils.RNG ? BigTwo.Utils.RNG.randomSeed() : String(Date.now()),
        difficulty: settings.difficulty,
        roundNumber: 1
      });
      saveGame();
      navigate('game');
      if (audioManager && typeof audioManager.startMusic === 'function') { audioManager.startMusic(); }
      ensureAITurn();
      return true;
    } catch (error) {
      gameState = null;
      toast(t('game.error.unavailable'), { type: 'error', assertive: true });
      return false;
    }
  }

  function continueGame() {
    refreshContinueInfo(false);
    if (continueInfo.status !== 'ok' || !continueInfo.gameState) {
      toast(t('home.continueEmpty'), { type: 'warning' });
      return false;
    }
    gameState = clone(continueInfo.gameState);
    recordedRound = null;
    busy = false;
    navigate('game');
    ensureAITurn();
    return true;
  }

  function startNextRound() {
    if (!gameState || gameState.phase !== 'finished') { return false; }
    clearAITimer();
    try {
      gameState = BigTwo.Game.applyAction(gameState, { type: 'START_NEXT_ROUND' });
      recordedRound = null;
      busy = false;
      saveGame();
      navigate('game');
      ensureAITurn();
      return true;
    } catch (error) {
      toast(t('dialog.unexpectedBody'), { type: 'error' });
      return false;
    }
  }

  function finishToHome() {
    clearAITimer();
    if (BigTwo.Storage && typeof BigTwo.Storage.clearActiveGame === 'function') {
      try { BigTwo.Storage.clearActiveGame(); } catch (error) { /* already finished */ }
    }
    gameState = null;
    refreshContinueInfo(false);
    navigate('home');
  }

  function confirmLeaveGame() {
    if (!dialogController) { return Promise.resolve(false); }
    return dialogController.confirm({
      title: t('game.leaveTitle'), body: t('game.leaveBody'),
      confirmText: t('game.leave'), cancelText: t('common.cancel')
    }).then(function (confirmed) {
      if (!confirmed) { return false; }
      clearAITimer();
      busy = false;
      saveGame();
      refreshContinueInfo(false);
      navigate('home');
      return true;
    });
  }

  function updateSettings(patch) {
    var next = Object.assign({}, settings, patch || {});
    var result = { ok: true };
    if (BigTwo.Utils && BigTwo.Utils.Validation && typeof BigTwo.Utils.Validation.normalizeSettings === 'function') {
      next = BigTwo.Utils.Validation.normalizeSettings(next);
    }
    settings = next;
    applyTheme(settings.theme);
    if (animationController) { animationController.setEnabled(settings.animationsEnabled); }
    if (audioManager && typeof audioManager.setSettings === 'function') {
      try { audioManager.setSettings(settings); } catch (error) { /* audio is optional */ }
    }
    try {
      if (BigTwo.Storage && typeof BigTwo.Storage.saveSettings === 'function') {
        result = BigTwo.Storage.saveSettings(settings);
      }
    } catch (error) { result = { ok: false }; }
    if (patch && patch.locale && BigTwo.I18n) { BigTwo.I18n.setLocale(settings.locale); }
    return result.ok !== false;
  }

  function toggleMusic() {
    updateSettings({ musicEnabled: !settings.musicEnabled });
    refreshGame();
  }

  function confirmResetData() {
    if (!dialogController) { return Promise.resolve(false); }
    return dialogController.confirm({
      title: t('settings.resetTitle'), body: t('settings.resetBody'),
      confirmText: t('settings.resetConfirm'), cancelText: t('common.cancel'), danger: true,
      dismissible: false
    }).then(function (confirmed) {
      if (!confirmed) { return false; }
      clearAITimer();
      try { if (BigTwo.Storage && typeof BigTwo.Storage.clearAll === 'function') { BigTwo.Storage.clearAll(); } }
      catch (error) { /* reset local state regardless */ }
      settings = defaults();
      settings.locale = BigTwo.I18n ? BigTwo.I18n.detectLocale() : 'zh-Hant';
      statistics = defaultStatistics();
      gameState = null;
      continueInfo = { status: 'empty' };
      updateSettings(settings);
      return true;
    });
  }

  function playResultAudio(won) { playSfx(won ? 'victory' : 'defeat'); }

  function registerScreens() {
    router
      .register('home', BigTwo.Screens.createHomeScreen(App))
      .register('game', BigTwo.Screens.createGameScreen(App))
      .register('help', BigTwo.Screens.createHelpScreen(App))
      .register('settings', BigTwo.Screens.createSettingsScreen(App))
      .register('results', BigTwo.Screens.createResultsScreen(App));
  }

  function init() {
    var root;
    var initialSaveStatus;
    if (initialized) { return App; }
    initialized = true;
    settings = loadSettings();
    statistics = loadStatistics();
    if (BigTwo.I18n) { BigTwo.I18n.init(settings.locale); }
    applyTheme(settings.theme);
    root = global.document.getElementById('screen-root');
    toastController = new BigTwo.UI.ToastController(global.document.getElementById('toast-root'));
    dialogController = new BigTwo.UI.DialogController(global.document.getElementById('dialog-root'));
    animationController = new BigTwo.UI.AnimationController({ enabled: settings.animationsEnabled });
    router = new BigTwo.UI.Router(root);
    configureAudio();
    registerScreens();
    initialSaveStatus = refreshContinueInfo(false).status;
    router.navigate('home');
    syncActionBarHeight();
    if (initialSaveStatus === 'invalid') { toast(t('home.corruptSave'), { type: 'warning' }); }
    else if (initialSaveStatus === 'unavailable') { toast(t('home.storageUnavailable'), { type: 'warning', duration: 5000 }); }
    localeUnsubscribe = BigTwo.I18n && BigTwo.I18n.subscribe(function () {
      if (router) { router.refresh(); syncActionBarHeight(); }
    });
    visibilityHandler = function () {
      if (global.document.hidden) { saveGame(); }
    };
    audioWarningHandler = function () {
      try {
        if (BigTwo.Storage && typeof BigTwo.Storage.getAudioNoticeSeen === 'function' &&
            BigTwo.Storage.getAudioNoticeSeen()) {
          return;
        }
        if (BigTwo.Storage && typeof BigTwo.Storage.setAudioNoticeSeen === 'function') {
          BigTwo.Storage.setAudioNoticeSeen(true);
        }
      } catch (error) { /* a warning may still be shown when storage is blocked */ }
      toast(t('audio.volumeNotice'), { type: 'warning', duration: 5000 });
    };
    global.document.addEventListener('visibilitychange', visibilityHandler);
    global.document.addEventListener('bigtwo:audio-warning', audioWarningHandler);
    return App;
  }

  function destroy() {
    clearAITimer();
    if (visibilityHandler) {
      global.document.removeEventListener('visibilitychange', visibilityHandler);
      visibilityHandler = null;
    }
    if (audioWarningHandler) {
      global.document.removeEventListener('bigtwo:audio-warning', audioWarningHandler);
      audioWarningHandler = null;
    }
    if (localeUnsubscribe) { localeUnsubscribe(); localeUnsubscribe = null; }
    if (actionBarObserver) { actionBarObserver.disconnect(); actionBarObserver = null; }
    if (actionBarFrame) { global.cancelAnimationFrame(actionBarFrame); actionBarFrame = null; }
    if (router) { router.destroy(); router = null; }
    if (animationController) { animationController.clearAll(); }
    if (dialogController) { dialogController.close(false); }
    if (toastController) { toastController.clear(); }
    if (audioManager && typeof audioManager.destroy === 'function') { audioManager.destroy(); }
    initialized = false;
  }

  var App = {
    init: init,
    destroy: destroy,
    navigate: navigate,
    startNewGame: startNewGame,
    continueGame: continueGame,
    startNextRound: startNextRound,
    finishToHome: finishToHome,
    dispatchHuman: dispatchHuman,
    ensureAITurn: ensureAITurn,
    confirmLeaveGame: confirmLeaveGame,
    confirmResetData: confirmResetData,
    updateSettings: updateSettings,
    toggleMusic: toggleMusic,
    playSfx: playSfx,
    playResultAudio: playResultAudio,
    reportActionError: reportActionError,
    toast: toast,
    announce: announce,
    isBusy: function () { return busy; },
    isDialogOpen: function () { return Boolean(dialogController && dialogController.isOpen()); },
    isAudioAvailable: function () { return !audioManager || audioManager.available !== false; },
    getSettings: function () { return settings || defaults(); },
    getStatistics: function () { return statistics || defaultStatistics(); },
    getGameState: function () { return gameState; },
    getContinueInfo: function () { return continueInfo; }
  };

  BigTwo.App = App;
  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}(window));
