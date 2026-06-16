(function () {
  'use strict';

  var TUBE_CAPACITY = 4;
  var COLOR_IDS = ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'brown', 'gray', 'navy'];
  var COLOR_NAMES = {
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    lime: 'Lime',
    green: 'Green',
    cyan: 'Cyan',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    brown: 'Berry',
    gray: 'Gray',
    navy: 'Navy'
  };
  var DIFF_LABEL = { easy: 'Easy', normal: 'Normal', hard: 'Hard' };
  var THEMES = ['ocean', 'forest', 'sunset', 'midnight'];
  var SETTINGS_KEY = 'wsp_settings';
  var SAVE_KEY = 'wsp_save';
  var DEFAULT_SETTINGS = {
    bgmVolume: 0.5,
    sfxVolume: 0.8,
    bgmEnabled: true,
    sfxEnabled: true,
    theme: 'ocean',
    vibration: true,
    showTimer: true
  };
  var DEFAULT_SAVE = {
    version: '1.0.0',
    lastPlayed: null,
    progress: {
      easy: { cleared: [], stars: {} },
      normal: { cleared: [], stars: {} },
      hard: { cleared: [], stars: {} }
    }
  };

  var app = document.getElementById('app');
  var settings = loadSettings();
  var currentScreenDestroy = null;
  var modalRoot = null;
  var audioContext = null;
  var bgmTimer = null;
  var bgmTrack = null;
  var audioUnlocked = false;

  function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return value;
    }
    return value;
  }

  function normalizeSave(save) {
    save = save || {};
    return {
      version: save.version || DEFAULT_SAVE.version,
      lastPlayed: save.lastPlayed || null,
      progress: {
        easy: Object.assign({}, DEFAULT_SAVE.progress.easy, save.progress && save.progress.easy),
        normal: Object.assign({}, DEFAULT_SAVE.progress.normal, save.progress && save.progress.normal),
        hard: Object.assign({}, DEFAULT_SAVE.progress.hard, save.progress && save.progress.hard)
      }
    };
  }

  function loadSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, loadJson(SETTINGS_KEY, DEFAULT_SETTINGS));
  }

  function updateSettings(patch) {
    settings = Object.assign({}, settings, patch);
    saveJson(SETTINGS_KEY, settings);
    applyTheme(settings.theme);
    if (!settings.bgmEnabled) stopBgm();
    if (settings.bgmEnabled) switchBgmForRoute(location.hash || '#home');
    return settings;
  }

  function resetSettings() {
    settings = clone(DEFAULT_SETTINGS);
    saveJson(SETTINGS_KEY, settings);
    applyTheme(settings.theme);
    switchBgmForRoute(location.hash || '#home');
    return settings;
  }

  function loadSave() {
    return normalizeSave(loadJson(SAVE_KEY, DEFAULT_SAVE));
  }

  function writeSave(save) {
    return saveJson(SAVE_KEY, normalizeSave(save));
  }

  function saveGameState(state) {
    var save = loadSave();
    save.lastPlayed = {
      difficulty: state.difficulty,
      levelId: state.levelId,
      tubes: clone(state.tubes),
      moves: state.moves,
      time: state.time,
      hintsUsed: state.hintsUsed,
      undoCount: state.undoCount,
      savedAt: Date.now()
    };
    writeSave(save);
  }

  function clearLastSave() {
    var save = loadSave();
    save.lastPlayed = null;
    writeSave(save);
  }

  function markLevelCleared(diff, levelId, stars) {
    var save = loadSave();
    var progress = save.progress[diff] || { cleared: [], stars: {} };
    if (progress.cleared.indexOf(levelId) === -1) progress.cleared.push(levelId);
    progress.stars[levelId] = Math.max(Number(progress.stars[levelId] || 0), stars);
    save.progress[diff] = progress;
    if (save.lastPlayed && save.lastPlayed.difficulty === diff && save.lastPlayed.levelId === levelId) {
      save.lastPlayed = null;
    }
    writeSave(save);
  }

  function clearAllSave() {
    writeSave(clone(DEFAULT_SAVE));
  }

  function applyTheme(theme) {
    var safeTheme = THEMES.indexOf(theme) >= 0 ? theme : 'ocean';
    document.documentElement.dataset.theme = safeTheme;
    app.dataset.theme = safeTheme;
  }

  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(values, seed) {
    var next = values.slice();
    var random = rng(seed);
    for (var i = next.length - 1; i > 0; i -= 1) {
      var j = Math.floor(random() * (i + 1));
      var temp = next[i];
      next[i] = next[j];
      next[j] = temp;
    }
    return next;
  }

  function generatedTubes(colorCount, seed) {
    var colors = COLOR_IDS.slice(0, colorCount);
    var pool = [];
    colors.forEach(function (color) {
      pool.push(color, color, color, color);
    });
    var packed = [];
    for (var attempt = 0; attempt < 18; attempt += 1) {
      var candidate = shuffled(pool, seed + attempt * 997);
      packed = [];
      for (var i = 0; i < colorCount; i += 1) {
        packed.push(candidate.slice(i * 4, i * 4 + 4));
      }
      if (packed.every(function (tube) { return new Set(tube).size > 1; })) break;
    }
    return packed.concat([[], []]);
  }

  function createLevelSet(config) {
    var levels = [];
    (config.manual || []).forEach(function (level) {
      levels.push({
        difficulty: config.difficulty,
        id: level.id,
        name: level.name,
        colors: level.colors,
        optimalMoves: level.optimalMoves,
        timeBenchmark: level.timeBenchmark,
        tubes: level.tubes.map(function (tube) { return tube.slice(); })
      });
    });
    for (var id = levels.length + 1; id <= config.count; id += 1) {
      var span = config.colorMax - config.colorMin + 1;
      var colors = config.colorMin + ((id - 1) % span);
      levels.push({
        difficulty: config.difficulty,
        id: id,
        name: 'Level ' + id,
        colors: colors,
        optimalMoves: Math.round(colors * 2.8 + (id % 9) + (config.difficulty === 'hard' ? 8 : 0)),
        timeBenchmark: 45 + colors * 8 + Math.floor(id * 1.5),
        tubes: generatedTubes(colors, config.seedBase + id * 131)
      });
    }
    return levels;
  }

  var LEVELS = {
    easy: createLevelSet({
      difficulty: 'easy',
      count: 30,
      colorMin: 4,
      colorMax: 5,
      seedBase: 1000,
      manual: [
        {
          id: 1,
          name: 'First Pour',
          colors: 4,
          optimalMoves: 7,
          timeBenchmark: 60,
          tubes: [
            ['red', 'blue', 'red', 'blue'],
            ['blue', 'red', 'blue', 'red'],
            ['yellow', 'green', 'yellow', 'green'],
            ['green', 'yellow', 'green', 'yellow'],
            [],
            []
          ]
        },
        {
          id: 2,
          name: 'Cross Mix',
          colors: 4,
          optimalMoves: 9,
          timeBenchmark: 70,
          tubes: [
            ['red', 'yellow', 'blue', 'green'],
            ['green', 'red', 'yellow', 'blue'],
            ['blue', 'green', 'red', 'yellow'],
            ['yellow', 'blue', 'green', 'red'],
            [],
            []
          ]
        }
      ]
    }),
    normal: createLevelSet({
      difficulty: 'normal',
      count: 40,
      colorMin: 6,
      colorMax: 8,
      seedBase: 4000,
      manual: [
        {
          id: 1,
          name: 'Six Color Start',
          colors: 6,
          optimalMoves: 15,
          timeBenchmark: 105,
          tubes: [
            ['red', 'blue', 'orange', 'green'],
            ['green', 'yellow', 'red', 'cyan'],
            ['cyan', 'orange', 'blue', 'yellow'],
            ['yellow', 'green', 'cyan', 'red'],
            ['blue', 'red', 'yellow', 'orange'],
            ['orange', 'cyan', 'green', 'blue'],
            [],
            []
          ]
        }
      ]
    }),
    hard: createLevelSet({
      difficulty: 'hard',
      count: 50,
      colorMin: 9,
      colorMax: 12,
      seedBase: 9000
    })
  };

  function topColor(tube) {
    return tube.length ? tube[tube.length - 1] : null;
  }

  function emptyCount(tube) {
    return TUBE_CAPACITY - tube.length;
  }

  function isComplete(tube) {
    return tube.length === TUBE_CAPACITY && tube.every(function (color) { return color === tube[0]; });
  }

  function isSolved(tubes) {
    return tubes.every(function (tube) { return tube.length === 0 || isComplete(tube); });
  }

  function countTopLayers(tube, color) {
    color = color || topColor(tube);
    if (!color) return 0;
    var amount = 0;
    for (var i = tube.length - 1; i >= 0; i -= 1) {
      if (tube[i] !== color) break;
      amount += 1;
    }
    return amount;
  }

  function canPour(tubes, fromIdx, toIdx, allowCompleteSource) {
    if (fromIdx === toIdx) return false;
    var from = tubes[fromIdx];
    var to = tubes[toIdx];
    if (!from || !to) return false;
    var fromTop = topColor(from);
    var toTop = topColor(to);
    if (!fromTop) return false;
    if (emptyCount(to) === 0) return false;
    if (toTop !== null && toTop !== fromTop) return false;
    if (!allowCompleteSource && isComplete(from)) return false;
    return true;
  }

  function pour(tubes, fromIdx, toIdx) {
    var next = tubes.map(function (tube) { return tube.slice(); });
    if (!canPour(next, fromIdx, toIdx, false)) return { tubes: next, amount: 0, color: null };
    var color = topColor(next[fromIdx]);
    var amount = Math.min(countTopLayers(next[fromIdx], color), emptyCount(next[toIdx]));
    for (var i = 0; i < amount; i += 1) {
      next[toIdx].push(next[fromIdx].pop());
    }
    return { tubes: next, amount: amount, color: color };
  }

  function validMoves(tubes) {
    var moves = [];
    for (var from = 0; from < tubes.length; from += 1) {
      for (var to = 0; to < tubes.length; to += 1) {
        if (canPour(tubes, from, to, false)) moves.push({ from: from, to: to });
      }
    }
    return moves;
  }

  function scoreMove(tubes, move) {
    var to = tubes[move.to];
    var from = tubes[move.from];
    var color = topColor(from);
    var result = pour(tubes, move.from, move.to).tubes;
    var score = 0;
    if (topColor(to) === color) score += 8;
    if (to.length === 0) score += 2;
    if (isComplete(result[move.to])) score += 14;
    if (result[move.from].length === 0) score += 5;
    return score;
  }

  function findHint(tubes) {
    if (isSolved(tubes)) return null;
    var queue = [{ tubes: clone(tubes), depth: 0, firstMove: null }];
    var visited = new Set([JSON.stringify(tubes)]);
    var bestMove = null;
    var bestScore = -Infinity;
    while (queue.length) {
      var node = queue.shift();
      if (node.depth >= 12) continue;
      validMoves(node.tubes).sort(function (a, b) {
        return scoreMove(node.tubes, b) - scoreMove(node.tubes, a);
      }).forEach(function (move) {
        var next = pour(node.tubes, move.from, move.to).tubes;
        var key = JSON.stringify(next);
        if (visited.has(key)) return;
        visited.add(key);
        var firstMove = node.firstMove || move;
        var score = scoreMove(node.tubes, move);
        if (score > bestScore) {
          bestMove = firstMove;
          bestScore = score;
        }
        if (isSolved(next)) {
          bestMove = firstMove;
          queue.length = 0;
          return;
        }
        queue.push({ tubes: next, depth: node.depth + 1, firstMove: firstMove });
      });
    }
    return bestMove;
  }

  function calculateStars(level, state) {
    var moveRatio = level.optimalMoves > 0 ? state.moves / level.optimalMoves : 1;
    var timeRatio = level.timeBenchmark > 0 ? state.time / level.timeBenchmark : 1;
    if (level.difficulty === 'easy') {
      if (moveRatio <= 1.3) return 3;
      if (moveRatio <= 1.8) return 2;
      return 1;
    }
    if (level.difficulty === 'hard') {
      if (moveRatio <= 1.2 && timeRatio <= 1.3 && state.undoCount === 0 && state.hintsUsed === 0) return 3;
      if (moveRatio <= 1.5 && timeRatio <= 2.0) return 2;
      return 1;
    }
    if (moveRatio <= 1.3 && timeRatio <= 1.5) return 3;
    if (moveRatio <= 1.8 && timeRatio <= 2.0) return 2;
    return 1;
  }

  function Game(level, resume) {
    this.level = level;
    this.initialTubes = clone((resume && resume.tubes) || level.tubes);
    this.undoStack = [];
    this.status = 'IDLE';
    this.state = {
      tubes: clone(this.initialTubes),
      moves: (resume && resume.moves) || 0,
      time: (resume && resume.time) || 0,
      selectedTube: null,
      difficulty: level.difficulty,
      levelId: level.id,
      hintsUsed: (resume && resume.hintsUsed) || 0,
      undoCount: (resume && resume.undoCount) || 0
    };
  }

  Game.prototype.pushUndo = function () {
    if (this.undoStack.length >= 30) this.undoStack.shift();
    this.undoStack.push({
      tubes: clone(this.state.tubes),
      moves: this.state.moves,
      time: this.state.time,
      hintsUsed: this.state.hintsUsed,
      undoCount: this.state.undoCount
    });
  };

  Game.prototype.selectTube = function (idx) {
    if (this.status === 'WIN' || this.status === 'FAIL') return { type: 'blocked' };
    var selected = this.state.selectedTube;
    var tube = this.state.tubes[idx];
    if (selected === null) {
      if (!tube || !tube.length) return { type: 'invalid', reason: 'empty' };
      this.state.selectedTube = idx;
      return { type: 'select' };
    }
    if (selected === idx) {
      this.state.selectedTube = null;
      return { type: 'deselect' };
    }
    if (canPour(this.state.tubes, selected, idx, false)) {
      this.pushUndo();
      var result = pour(this.state.tubes, selected, idx);
      this.state.tubes = result.tubes;
      this.state.moves += 1;
      this.state.selectedTube = null;
      if (isSolved(this.state.tubes)) {
        this.status = 'WIN';
        return { type: 'win', from: selected, to: idx, stars: calculateStars(this.level, this.state) };
      }
      if (validMoves(this.state.tubes).length === 0) {
        this.status = 'FAIL';
        return { type: 'fail', reason: 'stuck' };
      }
      return { type: 'pour', from: selected, to: idx };
    }
    if (tube && tube.length) {
      this.state.selectedTube = idx;
      return { type: 'invalid', reason: 'blocked', reselect: true };
    }
    return { type: 'invalid', reason: 'blocked' };
  };

  Game.prototype.undo = function () {
    var previous = this.undoStack.pop();
    if (!previous || this.status === 'WIN') return false;
    this.state.tubes = clone(previous.tubes);
    this.state.moves = previous.moves;
    this.state.time = previous.time;
    this.state.hintsUsed = previous.hintsUsed;
    this.state.undoCount += 1;
    this.state.selectedTube = null;
    this.status = 'IDLE';
    return true;
  };

  Game.prototype.restart = function () {
    this.undoStack = [];
    this.status = 'IDLE';
    this.state = {
      tubes: clone(this.initialTubes),
      moves: 0,
      time: 0,
      selectedTube: null,
      difficulty: this.level.difficulty,
      levelId: this.level.id,
      hintsUsed: 0,
      undoCount: 0
    };
  };

  Game.prototype.timeLimit = function () {
    return Math.max(120, Math.round(this.level.timeBenchmark * 1.8));
  };

  function getAudioContext() {
    if (!audioContext) {
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function beep(id) {
    if (!settings.sfxEnabled) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var profiles = {
      select: [520, 0.06],
      invalid: [130, 0.12],
      pour: [700, 0.08],
      win: [1040, 0.18],
      fail: [160, 0.2],
      undo: [300, 0.09],
      hint: [760, 0.1],
      click: [460, 0.05]
    };
    var profile = profiles[id] || profiles.click;
    var gain = ctx.createGain();
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = profile[0];
    gain.gain.value = Math.max(0, Math.min(1, settings.sfxVolume)) * 0.08;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + profile[1]);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + profile[1]);
  }

  function stopBgm() {
    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = null;
  }

  function playBgmTone(freq) {
    if (!audioUnlocked || !settings.bgmEnabled) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    var gain = ctx.createGain();
    var osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.value = Math.max(0, Math.min(1, settings.bgmVolume)) * 0.025;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  }

  function switchBgm(track) {
    bgmTrack = track;
    stopBgm();
    if (!settings.bgmEnabled) return;
    var tracks = {
      menu: [220, 277, 330, 277],
      easy: [262, 330, 392, 330],
      normal: [196, 247, 294, 370],
      hard: [147, 185, 220, 277]
    };
    var notes = tracks[track] || tracks.menu;
    var idx = 0;
    bgmTimer = setInterval(function () {
      playBgmTone(notes[idx % notes.length]);
      idx += 1;
    }, 760);
  }

  function switchBgmForRoute(hash) {
    if (hash.indexOf('#game') === 0) {
      var params = new URLSearchParams((hash.split('?')[1] || ''));
      switchBgm(params.get('diff') || 'easy');
      return;
    }
    switchBgm('menu');
  }

  document.addEventListener('pointerdown', function () {
    audioUnlocked = true;
    getAudioContext();
    switchBgm(bgmTrack || 'menu');
  }, { once: true });

  function parseHash(hash) {
    var clean = (hash || '#home').replace(/^#/, '');
    var parts = clean.split('?');
    return {
      id: parts[0] || 'home',
      params: Object.fromEntries(new URLSearchParams(parts[1] || '')),
      full: hash || '#home'
    };
  }

  function navigate(screen, params) {
    beep('click');
    var query = new URLSearchParams(params || {}).toString();
    location.hash = query ? '#' + screen + '?' + query : '#' + screen;
  }

  function showModal(config) {
    closeModal();
    modalRoot = document.createElement('div');
    modalRoot.className = 'modal-root';
    modalRoot.innerHTML = [
      '<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">',
      '<div class="modal__header">',
      '<h2 class="modal__title" id="modal-title">' + config.title + '</h2>',
      '<button class="btn btn--icon btn--ghost" data-modal-close aria-label="Close">x</button>',
      '</div>',
      '<div class="modal__body">' + (config.body || '') + '</div>',
      '<div class="modal__actions">',
      (config.actions || []).map(function (action, idx) {
        return '<button class="btn ' + (action.primary ? 'btn--primary' : 'btn--ghost') + '" data-action="' + idx + '">' + action.label + '</button>';
      }).join(''),
      '</div>',
      '</section>'
    ].join('');
    modalRoot.addEventListener('click', function (event) {
      if (event.target === modalRoot || event.target.closest('[data-modal-close]')) {
        closeModal();
        return;
      }
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = config.actions[Number(button.dataset.action)];
      if (action && action.handler) action.handler();
      if (!action || action.close !== false) closeModal();
    });
    document.body.appendChild(modalRoot);
  }

  function closeModal() {
    if (modalRoot) modalRoot.remove();
    modalRoot = null;
  }

  function previewTube(colors) {
    return [
      '<button class="tube" type="button" tabindex="-1" aria-hidden="true">',
      '<span class="tube__stack">',
      colors.map(function (color) { return '<span class="tube__layer tube__layer--' + color + '"></span>'; }).join(''),
      '</span>',
      '<span class="tube__base"></span>',
      '</button>'
    ].join('');
  }

  function renderHome() {
    var lastSave = loadSave().lastPlayed;
    app.className = 'screen home-screen';
    app.innerHTML = [
      '<main class="app-shell">',
      '<div class="content-width home-layout">',
      '<section class="home-copy">',
      '<p class="kicker">Pour. Match. Clear.</p>',
      '<h1 class="app-title">Water Sort Puzzle</h1>',
      '<p>Move matching colors into the same tube. You can pour only onto empty tubes or matching top colors.</p>',
      '<div class="home-actions">',
      '<button class="btn btn--primary" data-action="play"><span class="btn__icon">P</span>Start Game</button>',
      '<button class="btn" data-action="continue" ' + (lastSave ? '' : 'disabled') + '><span class="btn__icon">C</span>Continue</button>',
      '<button class="btn" data-nav="instructions"><span class="btn__icon">?</span>Rules</button>',
      '<button class="btn" data-nav="settings"><span class="btn__icon">S</span>Settings</button>',
      '</div>',
      '<div class="save-summary">' + (lastSave ? 'Last save: ' + lastSave.difficulty + ' level ' + lastSave.levelId + ', ' + lastSave.moves + ' moves' : 'No saved game yet') + '</div>',
      '</section>',
      '<section class="preview-rack" aria-label="Game preview">',
      LEVELS.easy[0].tubes.slice(0, 4).map(previewTube).join(''),
      '</section>',
      '</div>',
      '</main>'
    ].join('');
    app.querySelector('[data-action="play"]').addEventListener('click', function () {
      showModal({
        title: 'Choose Difficulty',
        body: '<p>Each difficulty has its own level progress.</p>',
        actions: [
          { label: 'Easy', primary: true, handler: function () { navigate('levels', { diff: 'easy' }); } },
          { label: 'Normal', handler: function () { navigate('levels', { diff: 'normal' }); } },
          { label: 'Hard', handler: function () { navigate('levels', { diff: 'hard' }); } }
        ]
      });
    });
    app.querySelector('[data-action="continue"]').addEventListener('click', function () {
      if (!lastSave) return;
      navigate('game', { diff: lastSave.difficulty, level: lastSave.levelId, resume: '1' });
    });
    app.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () { navigate(button.dataset.nav); });
    });
  }

  function starsText(value) {
    return value ? Array(value + 1).join('*') : '';
  }

  function renderLevels(params) {
    var diff = LEVELS[params.diff] ? params.diff : 'easy';
    var save = loadSave();
    var progress = save.progress[diff];
    app.className = 'screen level-select-screen';
    app.innerHTML = [
      '<main class="app-shell">',
      '<div class="content-width">',
      '<header class="screen__header">',
      '<div>',
      '<p class="kicker">Level Select</p>',
      '<h1 class="section-title">' + DIFF_LABEL[diff] + ' Levels</h1>',
      '<p class="screen__copy">' + LEVELS[diff].length + ' levels. Cleared ' + progress.cleared.length + '.</p>',
      '</div>',
      '<div class="top-bar__actions">',
      '<button class="btn btn--ghost" data-nav="home" aria-label="Home">Back</button>',
      '<button class="btn btn--ghost" data-nav="settings" aria-label="Settings">Settings</button>',
      '</div>',
      '</header>',
      '<div class="level-toolbar">',
      '<div class="segmented" aria-label="Difficulty">',
      Object.keys(DIFF_LABEL).map(function (key) {
        return '<button class="btn" data-diff="' + key + '" aria-pressed="' + (key === diff) + '">' + DIFF_LABEL[key] + '</button>';
      }).join(''),
      '</div>',
      '</div>',
      '<section class="level-grid" aria-label="Levels">',
      LEVELS[diff].map(function (level) {
        return [
          '<button class="level-tile" data-level="' + level.id + '">',
          '<strong>' + level.id + '</strong>',
          '<span aria-label="' + (progress.stars[level.id] || 0) + ' stars">' + starsText(progress.stars[level.id]) + '</span>',
          '<small>' + level.colors + ' colors</small>',
          '</button>'
        ].join('');
      }).join(''),
      '</section>',
      '</div>',
      '</main>'
    ].join('');
    app.querySelectorAll('[data-diff]').forEach(function (button) {
      button.addEventListener('click', function () { navigate('levels', { diff: button.dataset.diff }); });
    });
    app.querySelectorAll('[data-level]').forEach(function (button) {
      button.addEventListener('click', function () { navigate('game', { diff: diff, level: button.dataset.level }); });
    });
    app.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () { navigate(button.dataset.nav); });
    });
  }

  function formatTime(total) {
    var minutes = Math.floor(total / 60).toString();
    var seconds = String(total % 60).padStart(2, '0');
    return minutes + ':' + seconds;
  }

  function getLevel(diff, levelId) {
    return (LEVELS[diff] || LEVELS.easy).find(function (level) { return level.id === Number(levelId); }) || LEVELS.easy[0];
  }

  function renderTubes(container, game, hintMove, clickHandler) {
    container.innerHTML = game.state.tubes.map(function (tube, idx) {
      var classes = ['tube'];
      if (game.state.selectedTube === idx) classes.push('tube--selected');
      if (isComplete(tube)) classes.push('tube--complete');
      if (hintMove && (hintMove.from === idx || hintMove.to === idx)) classes.push('tube--hint');
      if (hintMove && hintMove.from === idx) classes.push('tube--source');
      if (hintMove && hintMove.to === idx) classes.push('tube--target');
      var layers = tube.map(function (color) {
        return '<span class="tube__layer tube__layer--' + color + '" aria-hidden="true"></span>';
      }).join('');
      var label = tube.length ? 'Tube ' + (idx + 1) + ', top ' + COLOR_NAMES[topColor(tube)] : 'Tube ' + (idx + 1) + ', empty';
      return [
        '<button class="' + classes.join(' ') + '" type="button" data-tube="' + idx + '" aria-label="' + label + '" aria-selected="' + (game.state.selectedTube === idx) + '">',
        '<span class="tube__stack">' + layers + '</span>',
        '<span class="tube__base" aria-hidden="true"></span>',
        '</button>'
      ].join('');
    }).join('');
    container.querySelectorAll('[data-tube]').forEach(function (button) {
      button.addEventListener('click', function () { clickHandler(Number(button.dataset.tube)); });
      button.addEventListener('touchstart', function (event) {
        event.preventDefault();
        clickHandler(Number(button.dataset.tube));
      }, { passive: false });
    });
  }

  function confetti() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['#ff4757', '#ffc312', '#12cbc4', '#9980fa', '#a3cb38', '#fda7df'];
    var pieces = [];
    var start = performance.now();
    canvas.className = 'confetti-canvas';
    function resize() {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    addEventListener('resize', resize);
    document.body.appendChild(canvas);
    for (var i = 0; i < 120; i += 1) {
      pieces.push({
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 0.35,
        vx: -2 + Math.random() * 4,
        vy: 2 + Math.random() * 4,
        size: 5 + Math.random() * 7,
        color: colors[i % colors.length],
        spin: Math.random() * Math.PI
      });
    }
    function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      pieces.forEach(function (piece) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.035;
        piece.spin += 0.18;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.spin);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
        ctx.restore();
      });
      if (now - start < 1600) {
        requestAnimationFrame(frame);
      } else {
        removeEventListener('resize', resize);
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  function renderGame(params) {
    var diff = LEVELS[params.diff] ? params.diff : 'easy';
    var level = getLevel(diff, params.level || 1);
    var lastSave = loadSave().lastPlayed;
    var resume = params.resume === '1' && lastSave && lastSave.difficulty === diff && lastSave.levelId === level.id ? lastSave : null;
    var game = new Game(level, resume);
    var hintMove = null;
    var toastTimer = null;
    var timer = null;

    currentScreenDestroy = function () {
      if (timer) clearInterval(timer);
      if (toastTimer) clearTimeout(toastTimer);
      closeModal();
    };

    app.className = 'screen game-screen';
    app.innerHTML = [
      '<main class="app-shell app-shell--game">',
      '<header class="game-hud">',
      '<button class="btn btn--ghost" data-action="back" aria-label="Back">Back</button>',
      '<div class="game-hud__title">',
      '<strong>' + DIFF_LABEL[diff] + ' Level ' + level.id + '</strong>',
      '<span>' + level.colors + ' colors - best ' + level.optimalMoves + ' moves' + (diff === 'hard' ? ' - limit ' + formatTime(game.timeLimit()) : '') + '</span>',
      '</div>',
      '<div class="game-hud__stats">',
      '<div class="stat-pill" data-stat="moves"><span>Moves</span><strong>0</strong></div>',
      '<div class="stat-pill" data-stat="time"><span>' + (diff === 'hard' ? 'Left' : 'Time') + '</span><strong>0:00</strong></div>',
      '<div class="stat-pill" data-stat="hints"><span>Hints</span><strong>0</strong></div>',
      '</div>',
      '</header>',
      '<section class="tubes-area"><div class="tubes-grid" aria-label="Tubes"></div></section>',
      '<div class="toast" role="status"></div>',
      '<nav class="game-controls" aria-label="Game controls">',
      '<button class="btn" data-action="undo"><span class="btn__icon">U</span>Undo</button>',
      '<button class="btn" data-action="hint"><span class="btn__icon">H</span>Hint</button>',
      '<button class="btn" data-action="restart"><span class="btn__icon">R</span>Restart</button>',
      '</nav>',
      '</main>'
    ].join('');

    var grid = app.querySelector('.tubes-grid');
    var toast = app.querySelector('.toast');

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('toast--show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('toast--show'); }, 1300);
    }

    function updateHud() {
      app.querySelector('[data-stat="moves"] strong').textContent = game.state.moves;
      var timeValue = diff === 'hard' ? Math.max(0, game.timeLimit() - game.state.time) : game.state.time;
      app.querySelector('[data-stat="time"] strong').textContent = settings.showTimer ? formatTime(timeValue) : '--';
      app.querySelector('[data-stat="hints"] strong').textContent = game.state.hintsUsed;
      app.querySelector('[data-action="undo"]').disabled = game.undoStack.length === 0;
    }

    function renderBoard() {
      renderTubes(grid, game, hintMove, function (idx) {
        hintMove = null;
        var result = game.selectTube(idx);
        if (result.type === 'select' || result.type === 'deselect') beep('select');
        if (result.type === 'invalid') {
          beep('invalid');
          showToast(result.reason === 'empty' ? 'This tube is empty' : 'Pour onto empty or matching color only');
        }
        if (result.type === 'pour') beep('pour');
        if (result.type === 'win') showWin(result.stars);
        if (result.type === 'fail') showFail(result.reason);
        if (game.status !== 'WIN' && game.status !== 'FAIL') saveGameState(game.state);
        renderBoard();
      });
      updateHud();
    }

    function showWin(stars) {
      beep('win');
      markLevelCleared(diff, level.id, stars);
      clearLastSave();
      confetti();
      var nextLevel = LEVELS[diff].find(function (item) { return item.id === level.id + 1; });
      showModal({
        title: 'Level Clear',
        body: [
          '<div class="stars" aria-label="' + stars + ' stars">' + Array(stars + 1).join('*') + '</div>',
          '<div class="result-summary">',
          '<div><span>Moves</span><strong>' + game.state.moves + '</strong></div>',
          '<div><span>Time</span><strong>' + formatTime(game.state.time) + '</strong></div>',
          '<div><span>Hints</span><strong>' + game.state.hintsUsed + '</strong></div>',
          '<div><span>Undo</span><strong>' + game.state.undoCount + '</strong></div>',
          '</div>'
        ].join(''),
        actions: [
          { label: 'Replay', handler: function () { game.restart(); renderBoard(); saveGameState(game.state); } },
          { label: 'Levels', handler: function () { navigate('levels', { diff: diff }); } },
          nextLevel ? { label: 'Next', primary: true, handler: function () { navigate('game', { diff: diff, level: nextLevel.id }); } } : null
        ].filter(Boolean)
      });
    }

    function showFail(reason) {
      beep('fail');
      showModal({
        title: reason === 'time' ? 'Time Up' : 'No Moves Left',
        body: '<p>Restart this level or choose another one.</p>',
        actions: [
          { label: 'Levels', handler: function () { navigate('levels', { diff: diff }); } },
          { label: 'Restart', primary: true, handler: function () { game.restart(); renderBoard(); saveGameState(game.state); } }
        ]
      });
    }

    app.querySelector('[data-action="back"]').addEventListener('click', function () { navigate('levels', { diff: diff }); });
    app.querySelector('[data-action="undo"]').addEventListener('click', function () {
      if (game.undo()) {
        hintMove = null;
        beep('undo');
        renderBoard();
        saveGameState(game.state);
      } else {
        beep('invalid');
        showToast('No undo available');
      }
    });
    app.querySelector('[data-action="hint"]').addEventListener('click', function () {
      var move = findHint(game.state.tubes);
      if (!move) {
        beep('invalid');
        showToast('No hint found');
        return;
      }
      game.state.hintsUsed += 1;
      hintMove = move;
      beep('hint');
      showToast('Hint: tube ' + (move.from + 1) + ' to tube ' + (move.to + 1));
      saveGameState(game.state);
      renderBoard();
    });
    app.querySelector('[data-action="restart"]').addEventListener('click', function () {
      game.restart();
      hintMove = null;
      beep('click');
      renderBoard();
      saveGameState(game.state);
    });

    timer = setInterval(function () {
      if (game.status === 'WIN' || game.status === 'FAIL') return;
      game.state.time += 1;
      if (diff === 'hard' && game.state.time >= game.timeLimit()) {
        game.status = 'FAIL';
        showFail('time');
      }
      updateHud();
      saveGameState(game.state);
    }, 1000);

    renderBoard();
    saveGameState(game.state);
  }

  function renderInstructions() {
    app.className = 'screen instructions-screen';
    app.innerHTML = [
      '<main class="app-shell">',
      '<div class="content-width">',
      '<header class="screen__header">',
      '<div><p class="kicker">How To Play</p><h1 class="section-title">Rules</h1>',
      '<p class="screen__copy">Complete the puzzle by sorting each color into its own tube.</p></div>',
      '<button class="btn btn--ghost" data-nav="home" aria-label="Home">Back</button>',
      '</header>',
      '<section class="rules-grid">',
      '<article class="rule-card"><h2>Select And Pour</h2><p>Click a source tube, then click a target tube.</p></article>',
      '<article class="rule-card"><h2>Legal Target</h2><p>The target must be empty or have the same top color, and it must have space.</p></article>',
      '<article class="rule-card"><h2>Clear Goal</h2><p>Every non-empty tube must contain four layers of one color.</p></article>',
      '<article class="rule-card"><h2>Help</h2><p>Undo keeps up to 30 moves. Hint searches ahead with BFS and suggests a good move.</p></article>',
      '</section>',
      '</div>',
      '</main>'
    ].join('');
    app.querySelector('[data-nav="home"]').addEventListener('click', function () { navigate('home'); });
  }

  function renderSettings() {
    function html() {
      return [
        '<main class="app-shell">',
        '<div class="content-width">',
        '<header class="screen__header">',
        '<div><p class="kicker">Settings</p><h1 class="section-title">Settings</h1></div>',
        '<button class="btn btn--ghost" data-nav="home" aria-label="Home">Back</button>',
        '</header>',
        '<section class="panel panel--padded">',
        '<div class="settings-list">',
        '<div class="setting-row"><label for="bgmVolume">BGM Volume</label><input id="bgmVolume" type="range" min="0" max="1" step="0.05" value="' + settings.bgmVolume + '"></div>',
        '<div class="setting-row"><label for="sfxVolume">SFX Volume</label><input id="sfxVolume" type="range" min="0" max="1" step="0.05" value="' + settings.sfxVolume + '"></div>',
        '<div class="setting-row"><div class="setting-row__label">Theme</div><div class="theme-swatches">',
        THEMES.map(function (theme) {
          return '<button class="theme-swatch theme-swatch--' + theme + '" data-theme-choice="' + theme + '" aria-pressed="' + (settings.theme === theme) + '" aria-label="' + theme + '"><span></span></button>';
        }).join(''),
        '</div></div>',
        checkboxRow('BGM', 'bgmEnabled'),
        checkboxRow('SFX', 'sfxEnabled'),
        checkboxRow('Vibration', 'vibration'),
        checkboxRow('Show Timer', 'showTimer'),
        '</div>',
        '</section>',
        '<div class="btn-group" style="margin-top: 16px;">',
        '<button class="btn" data-action="reset-settings">Reset Settings</button>',
        '<button class="btn btn--danger" data-action="clear-save">Clear Progress</button>',
        '</div>',
        '</div>',
        '</main>'
      ].join('');
    }

    function checkboxRow(label, key) {
      return '<div class="setting-row"><span class="setting-row__label">' + label + '</span><label class="switch"><input type="checkbox" data-setting="' + key + '" ' + (settings[key] ? 'checked' : '') + '>On</label></div>';
    }

    function bind() {
      app.querySelector('[data-nav="home"]').addEventListener('click', function () { navigate('home'); });
      app.querySelector('#bgmVolume').addEventListener('input', function (event) { updateSettings({ bgmVolume: Number(event.target.value) }); });
      app.querySelector('#sfxVolume').addEventListener('input', function (event) {
        updateSettings({ sfxVolume: Number(event.target.value) });
        beep('click');
      });
      app.querySelectorAll('[data-setting]').forEach(function (input) {
        input.addEventListener('change', function () {
          var patch = {};
          patch[input.dataset.setting] = input.checked;
          updateSettings(patch);
          beep('click');
        });
      });
      app.querySelectorAll('[data-theme-choice]').forEach(function (button) {
        button.addEventListener('click', function () {
          updateSettings({ theme: button.dataset.themeChoice });
          app.querySelectorAll('[data-theme-choice]').forEach(function (item) {
            item.setAttribute('aria-pressed', String(item === button));
          });
          beep('click');
        });
      });
      app.querySelector('[data-action="reset-settings"]').addEventListener('click', function () {
        resetSettings();
        renderSettings();
      });
      app.querySelector('[data-action="clear-save"]').addEventListener('click', function () {
        showModal({
          title: 'Clear Progress',
          body: '<p>This removes level stars and the current saved game.</p>',
          actions: [
            { label: 'Cancel' },
            { label: 'Clear', primary: true, handler: function () { clearAllSave(); } }
          ]
        });
      });
    }

    app.className = 'screen settings-screen';
    app.innerHTML = html();
    bind();
  }

  function renderRoute() {
    if (currentScreenDestroy) currentScreenDestroy();
    currentScreenDestroy = null;
    closeModal();
    var route = parseHash(location.hash);
    switchBgmForRoute(route.full);
    if (route.id === 'levels') renderLevels(route.params);
    else if (route.id === 'game') renderGame(route.params);
    else if (route.id === 'instructions') renderInstructions();
    else if (route.id === 'settings') renderSettings();
    else renderHome();
  }

  applyTheme(settings.theme);
  addEventListener('hashchange', renderRoute);
  if (!location.hash) location.hash = '#home';
  renderRoute();
})();
