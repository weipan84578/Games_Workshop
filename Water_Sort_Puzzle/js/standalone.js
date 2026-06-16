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
    bgmVolume: 1,
    sfxVolume: 1,
    bgmEnabled: true,
    sfxEnabled: true,
    theme: 'ocean',
    vibration: true,
    showTimer: true,
    language: detectLanguage()
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

  var I18N = {
    en: {
      'diff.easy': 'Easy',
      'diff.normal': 'Normal',
      'diff.hard': 'Hard',
      'home.kicker': 'Pour. Match. Clear.',
      'home.copy': 'Move matching colors into the same tube. You can pour only onto empty tubes or matching top colors.',
      'home.start': 'Start Game',
      'home.continue': 'Continue',
      'home.rules': 'Rules',
      'home.settings': 'Settings',
      'home.lastSave': 'Last save: {difficulty} level {level}, {moves} moves',
      'home.noSave': 'No saved game yet',
      'home.preview': 'Game preview',
      'modal.difficulty.title': 'Choose Difficulty',
      'modal.difficulty.body': 'Each difficulty has its own level progress.',
      'levels.kicker': 'Level Select',
      'levels.title': '{difficulty} Levels',
      'levels.copy': '{total} levels. Cleared {cleared}.',
      'levels.back': 'Back',
      'levels.settings': 'Settings',
      'levels.difficulty': 'Difficulty',
      'levels.list': 'Levels',
      'levels.stars': '{count} stars',
      'levels.colors': '{count} colors',
      'game.back': 'Back',
      'game.title': '{difficulty} Level {level}',
      'game.subtitle': '{colors} colors - best {moves} moves',
      'game.subtitleHard': '{colors} colors - best {moves} moves - limit {time}',
      'game.moves': 'Moves',
      'game.time': 'Time',
      'game.left': 'Left',
      'game.hints': 'Hints',
      'game.tubes': 'Tubes',
      'game.controls': 'Game controls',
      'game.undo': 'Undo',
      'game.hint': 'Hint',
      'game.restart': 'Restart',
      'tube.empty': 'Tube {index}, empty',
      'tube.top': 'Tube {index}, top {color}',
      'toast.empty': 'This tube is empty',
      'toast.invalid': 'Pour onto empty or matching color only',
      'toast.undo': 'No undo available',
      'toast.noHint': 'No hint found',
      'toast.hint': 'Hint: tube {from} to tube {to}',
      'win.title': 'Level Clear',
      'win.stars': '{count} stars',
      'win.replay': 'Replay',
      'win.levels': 'Levels',
      'win.next': 'Next',
      'fail.time': 'Time Up',
      'fail.stuck': 'No Moves Left',
      'fail.body': 'Restart this level or choose another one.',
      'instructions.kicker': 'How To Play',
      'instructions.title': 'Rules',
      'instructions.copy': 'Complete the puzzle by sorting each color into its own tube.',
      'instructions.select.title': 'Select And Pour',
      'instructions.select.body': 'Click a source tube, then click a target tube.',
      'instructions.target.title': 'Legal Target',
      'instructions.target.body': 'The target must be empty or have the same top color, and it must have space.',
      'instructions.goal.title': 'Clear Goal',
      'instructions.goal.body': 'Every non-empty tube must contain four layers of one color.',
      'instructions.help.title': 'Help',
      'instructions.help.body': 'Undo keeps up to 30 moves. Hint searches ahead with BFS and suggests a good move.',
      'instructions.objective.title': 'Objective',
      'instructions.objective.body': 'Sort the liquids until each completed tube contains exactly four layers of one color. Empty tubes are allowed and are useful temporary space.',
      'instructions.select.detail': 'Click or tap one tube to select it. The selected tube lifts up. Click the same tube again to cancel the selection.',
      'instructions.pour.title': 'Pour Rule',
      'instructions.pour.body': 'A pour moves only the connected top layers of the same color. If the target has less free space than the source stack, only the amount that fits will move.',
      'instructions.valid.title': 'Valid Moves',
      'instructions.valid.body': 'You can pour into an empty tube, or onto a tube whose top color matches the source top color. The target also needs at least one empty slot.',
      'instructions.invalid.title': 'Blocked Moves',
      'instructions.invalid.body': 'You cannot pour from an empty tube, into a full tube, onto a different color, or out of a completed sealed tube.',
      'instructions.cork.title': 'Cork Seal',
      'instructions.cork.body': 'A cork appears only when a tube is full and all four layers are the same color. Mixed full tubes stay uncorked because they are not solved.',
      'instructions.tools.title': 'Undo And Hint',
      'instructions.tools.body': 'Undo restores previous board states up to 30 moves. Hint searches ahead and highlights a suggested source and target tube.',
      'instructions.score.title': 'Stars',
      'instructions.score.body': 'Fewer moves, faster clears, fewer hints, and fewer undo actions improve the star rating. Hard levels also care about the timer.',
      'instructions.settings.title': 'Settings',
      'instructions.settings.body': 'Use Settings to change language, theme, timer display, vibration, music, effects, and their volumes.',
      'instructions.flow.title': 'Recommended Flow',
      'instructions.flow.body': 'Use empty tubes as buffers, finish one color at a time, and avoid moving liquid out of a solved tube.',
      'settings.kicker': 'Settings',
      'settings.title': 'Settings',
      'settings.bgmVolume': 'BGM Volume',
      'settings.sfxVolume': 'SFX Volume',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.bgm': 'BGM',
      'settings.sfx': 'SFX',
      'settings.vibration': 'Vibration',
      'settings.timer': 'Show Timer',
      'settings.on': 'On',
      'settings.reset': 'Reset Settings',
      'settings.clear': 'Clear Progress',
      'clear.title': 'Clear Progress',
      'clear.body': 'This removes level stars and the current saved game.',
      'clear.cancel': 'Cancel',
      'clear.confirm': 'Clear',
      'color.red': 'Red',
      'color.orange': 'Orange',
      'color.yellow': 'Yellow',
      'color.lime': 'Lime',
      'color.green': 'Green',
      'color.cyan': 'Cyan',
      'color.blue': 'Blue',
      'color.purple': 'Purple',
      'color.pink': 'Pink',
      'color.brown': 'Berry',
      'color.gray': 'Gray',
      'color.navy': 'Navy'
    },
    zh: {
      'diff.easy': '簡單',
      'diff.normal': '普通',
      'diff.hard': '困難',
      'home.kicker': '倒水、配色、清盤',
      'home.copy': '把相同顏色集中到同一支試管。每次只能倒入空試管，或頂端顏色相同的試管。',
      'home.start': '開始遊戲',
      'home.continue': '繼續遊戲',
      'home.rules': '玩法說明',
      'home.settings': '設定',
      'home.lastSave': '上次進度：{difficulty}第 {level} 關，{moves} 步',
      'home.noSave': '尚無可繼續的進度',
      'home.preview': '遊戲預覽',
      'modal.difficulty.title': '選擇難度',
      'modal.difficulty.body': '每個難度都有獨立的關卡進度。',
      'levels.kicker': '關卡選擇',
      'levels.title': '{difficulty}關卡',
      'levels.copy': '共 {total} 關，已完成 {cleared} 關。',
      'levels.back': '返回',
      'levels.settings': '設定',
      'levels.difficulty': '難度',
      'levels.list': '關卡列表',
      'levels.stars': '{count} 星',
      'levels.colors': '{count} 色',
      'game.back': '返回',
      'game.title': '{difficulty} 第 {level} 關',
      'game.subtitle': '{colors} 色 - 最佳 {moves} 步',
      'game.subtitleHard': '{colors} 色 - 最佳 {moves} 步 - 限時 {time}',
      'game.moves': '步數',
      'game.time': '時間',
      'game.left': '剩餘',
      'game.hints': '提示',
      'game.tubes': '試管區',
      'game.controls': '遊戲操作',
      'game.undo': '復原',
      'game.hint': '提示',
      'game.restart': '重開',
      'tube.empty': '第 {index} 支試管，空白',
      'tube.top': '第 {index} 支試管，頂端 {color}',
      'toast.empty': '這支試管是空的',
      'toast.invalid': '只能倒入空試管或同色試管',
      'toast.undo': '沒有可復原的步驟',
      'toast.noHint': '暫時找不到提示',
      'toast.hint': '提示：第 {from} 支倒到第 {to} 支',
      'win.title': '關卡完成',
      'win.stars': '{count} 星',
      'win.replay': '重玩',
      'win.levels': '選關',
      'win.next': '下一關',
      'fail.time': '時間到',
      'fail.stuck': '沒有可用倒法',
      'fail.body': '可以重開本關，或回選關換一題。',
      'instructions.kicker': '玩法',
      'instructions.title': '玩法說明',
      'instructions.copy': '目標是讓每支非空試管只留下同一種顏色。',
      'instructions.select.title': '選取與倒水',
      'instructions.select.body': '先點來源試管，再點目標試管。',
      'instructions.target.title': '合法目標',
      'instructions.target.body': '目標必須是空試管，或頂端顏色與來源相同，且仍有空位。',
      'instructions.goal.title': '完成條件',
      'instructions.goal.body': '所有非空試管都必須裝滿四層同色液體。',
      'instructions.help.title': '輔助功能',
      'instructions.help.body': '復原最多保存 30 步；提示會用 BFS 搜尋較佳下一步。',
      'instructions.objective.title': '遊戲目標',
      'instructions.objective.body': '把液體整理到每支完成的試管都只有同一種顏色，而且剛好四層。空試管可以保留，通常是最重要的暫存空間。',
      'instructions.select.detail': '點一下試管即可選取，被選取的試管會往上抬起。再點同一支試管可以取消選取。',
      'instructions.pour.title': '倒水規則',
      'instructions.pour.body': '每次只會倒出頂端連續相同顏色的液體。若目標空位不足，只會倒入能容納的層數。',
      'instructions.valid.title': '合法倒法',
      'instructions.valid.body': '可以倒入空試管，也可以倒到頂端顏色相同的試管；目標試管必須至少有一格空位。',
      'instructions.invalid.title': '不能倒的情況',
      'instructions.invalid.body': '不能從空試管倒、不能倒進滿管、不能倒到不同顏色上，也不能把已完成並封口的同色試管再倒出去。',
      'instructions.cork.title': '木塞封口',
      'instructions.cork.body': '只有滿管且四層都是同一顏色時才會蓋上木塞。混色滿管不算完成，所以不會封口。',
      'instructions.tools.title': '復原與提示',
      'instructions.tools.body': '復原最多保留 30 步。提示會往後搜尋，並高亮建議的來源試管與目標試管。',
      'instructions.score.title': '星等評分',
      'instructions.score.body': '步數越少、時間越短、提示與復原用得越少，星等越高；困難關卡也會計入倒數時間。',
      'instructions.settings.title': '設定',
      'instructions.settings.body': '可在設定中切換語言、主題、計時顯示、震動、音樂、音效與音量。',
      'instructions.flow.title': '建議流程',
      'instructions.flow.body': '善用空試管作為暫存區，優先完成單一顏色，並避免把已經完成的試管再次打散。',
      'settings.kicker': 'Settings',
      'settings.title': '設定',
      'settings.bgmVolume': '音樂音量',
      'settings.sfxVolume': '音效音量',
      'settings.language': '語言',
      'settings.theme': '主題',
      'settings.bgm': '背景音樂',
      'settings.sfx': '音效',
      'settings.vibration': '震動回饋',
      'settings.timer': '顯示計時',
      'settings.on': '啟用',
      'settings.reset': '重設設定',
      'settings.clear': '清除進度',
      'clear.title': '清除進度',
      'clear.body': '這會刪除星等與目前續玩資料。',
      'clear.cancel': '取消',
      'clear.confirm': '清除',
      'color.red': '紅色',
      'color.orange': '橘色',
      'color.yellow': '黃色',
      'color.lime': '萊姆綠',
      'color.green': '綠色',
      'color.cyan': '青色',
      'color.blue': '藍色',
      'color.purple': '紫色',
      'color.pink': '粉紅色',
      'color.brown': '莓紫色',
      'color.gray': '灰色',
      'color.navy': '深藍色'
    },
    ja: {
      'diff.easy': 'かんたん',
      'diff.normal': 'ふつう',
      'diff.hard': 'むずかしい',
      'home.kicker': '注ぐ、そろえる、クリア',
      'home.copy': '同じ色を同じ試験管に集めます。空の試験管、または上の色が同じ試験管にだけ注げます。',
      'home.start': 'ゲーム開始',
      'home.continue': '続きから',
      'home.rules': '遊び方',
      'home.settings': '設定',
      'home.lastSave': '前回：{difficulty} レベル {level}、{moves} 手',
      'home.noSave': '保存されたゲームはありません',
      'home.preview': 'ゲームプレビュー',
      'modal.difficulty.title': '難易度を選択',
      'modal.difficulty.body': '難易度ごとに進行状況が保存されます。',
      'levels.kicker': 'レベル選択',
      'levels.title': '{difficulty} レベル',
      'levels.copy': '全 {total} レベル。クリア済み {cleared}。',
      'levels.back': '戻る',
      'levels.settings': '設定',
      'levels.difficulty': '難易度',
      'levels.list': 'レベル一覧',
      'levels.stars': '{count} 星',
      'levels.colors': '{count} 色',
      'game.back': '戻る',
      'game.title': '{difficulty} レベル {level}',
      'game.subtitle': '{colors} 色 - 最短 {moves} 手',
      'game.subtitleHard': '{colors} 色 - 最短 {moves} 手 - 制限 {time}',
      'game.moves': '手数',
      'game.time': '時間',
      'game.left': '残り',
      'game.hints': 'ヒント',
      'game.tubes': '試験管',
      'game.controls': '操作',
      'game.undo': '戻す',
      'game.hint': 'ヒント',
      'game.restart': '再開',
      'tube.empty': '{index} 本目の試験管、空',
      'tube.top': '{index} 本目の試験管、上は {color}',
      'toast.empty': 'この試験管は空です',
      'toast.invalid': '空か同じ色の試験管にだけ注げます',
      'toast.undo': '戻せる手がありません',
      'toast.noHint': 'ヒントが見つかりません',
      'toast.hint': 'ヒント：{from} 本目から {to} 本目へ',
      'win.title': 'レベルクリア',
      'win.stars': '{count} 星',
      'win.replay': 'もう一度',
      'win.levels': 'レベル',
      'win.next': '次へ',
      'fail.time': '時間切れ',
      'fail.stuck': '注げる手がありません',
      'fail.body': 'このレベルをやり直すか、別のレベルを選んでください。',
      'instructions.kicker': '遊び方',
      'instructions.title': 'ルール',
      'instructions.copy': '色ごとに試験管をそろえるとクリアです。',
      'instructions.select.title': '選択と注水',
      'instructions.select.body': '元の試験管を選び、次に注ぎ先を選びます。',
      'instructions.target.title': '注げる場所',
      'instructions.target.body': '注ぎ先は空、または上の色が同じで空きがある必要があります。',
      'instructions.goal.title': 'クリア条件',
      'instructions.goal.body': '空でない試験管は、同じ色 4 層で満たします。',
      'instructions.help.title': '補助機能',
      'instructions.help.body': 'Undo は最大 30 手保存。ヒントは BFS で次の手を探します。',
      'instructions.objective.title': '目的',
      'instructions.objective.body': '完成した試験管が 4 層すべて同じ色になるように液体を整理します。空の試験管は残っていてもよく、重要な一時置き場になります。',
      'instructions.select.detail': '試験管をクリックまたはタップすると選択され、少し上に持ち上がります。同じ試験管をもう一度選ぶと解除できます。',
      'instructions.pour.title': '注水ルール',
      'instructions.pour.body': '一度に注げるのは、上から連続している同じ色の層だけです。注ぎ先の空きが少ない場合は、入る分だけ移動します。',
      'instructions.valid.title': '有効な手',
      'instructions.valid.body': '空の試験管、または上の色が同じ試験管に注げます。注ぎ先には少なくとも 1 層分の空きが必要です。',
      'instructions.invalid.title': 'できない手',
      'instructions.invalid.body': '空の試験管からは注げません。満杯の試験管、違う色の上、完成して栓がされた試験管からの移動もできません。',
      'instructions.cork.title': '木栓',
      'instructions.cork.body': '試験管が満杯で、4 層すべて同じ色になったときだけ木栓が付きます。混色で満杯の場合は未完成なので栓は付きません。',
      'instructions.tools.title': 'Undo とヒント',
      'instructions.tools.body': 'Undo は最大 30 手まで戻せます。ヒントは先読みして、おすすめの元試験管と注ぎ先を強調します。',
      'instructions.score.title': '星評価',
      'instructions.score.body': '手数が少なく、クリアが速く、ヒントや Undo が少ないほど星評価が上がります。Hard ではタイマーも重要です。',
      'instructions.settings.title': '設定',
      'instructions.settings.body': '設定では言語、テーマ、タイマー表示、振動、音楽、効果音、音量を変更できます。',
      'instructions.flow.title': '進め方のコツ',
      'instructions.flow.body': '空の試験管を一時置き場として使い、1 色ずつ完成させます。完成した試験管は崩さないようにしましょう。',
      'settings.kicker': 'Settings',
      'settings.title': '設定',
      'settings.bgmVolume': '音楽音量',
      'settings.sfxVolume': '効果音音量',
      'settings.language': '言語',
      'settings.theme': 'テーマ',
      'settings.bgm': 'BGM',
      'settings.sfx': '効果音',
      'settings.vibration': '振動',
      'settings.timer': 'タイマー表示',
      'settings.on': 'オン',
      'settings.reset': '設定をリセット',
      'settings.clear': '進行状況を削除',
      'clear.title': '進行状況を削除',
      'clear.body': '星評価と現在の保存データを削除します。',
      'clear.cancel': 'キャンセル',
      'clear.confirm': '削除',
      'color.red': '赤',
      'color.orange': 'オレンジ',
      'color.yellow': '黄',
      'color.lime': 'ライム',
      'color.green': '緑',
      'color.cyan': 'シアン',
      'color.blue': '青',
      'color.purple': '紫',
      'color.pink': 'ピンク',
      'color.brown': 'ベリー',
      'color.gray': '灰',
      'color.navy': '紺'
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

  function detectLanguage() {
    var navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (navLang.indexOf('ja') === 0) return 'ja';
    if (navLang.indexOf('zh') === 0) return 'zh';
    return 'en';
  }

  function getLanguage() {
    return I18N[settings.language] ? settings.language : 'en';
  }

  function t(key) {
    var lang = getLanguage();
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  }

  function fmt(key, values) {
    return t(key).replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(values || {}, name) ? values[name] : match;
    });
  }

  function diffLabel(diff) {
    return t('diff.' + diff);
  }

  function colorLabel(color) {
    return t('color.' + color);
  }

  function updateSettings(patch) {
    settings = Object.assign({}, settings, patch);
    saveJson(SETTINGS_KEY, settings);
    applyTheme(settings.theme);
    applyLanguage(settings.language);
    if (!settings.bgmEnabled) stopBgm();
    if (settings.bgmEnabled) switchBgmForRoute(location.hash || '#home');
    return settings;
  }

  function resetSettings() {
    settings = clone(DEFAULT_SETTINGS);
    saveJson(SETTINGS_KEY, settings);
    applyTheme(settings.theme);
    applyLanguage(settings.language);
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

  function applyLanguage(language) {
    var safeLanguage = I18N[language] ? language : 'en';
    document.documentElement.lang = safeLanguage === 'zh' ? 'zh-Hant' : safeLanguage;
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
        return { type: 'win', from: selected, to: idx, color: result.color, stars: calculateStars(this.level, this.state) };
      }
      if (validMoves(this.state.tubes).length === 0) {
        this.status = 'FAIL';
        return { type: 'fail', reason: 'stuck' };
      }
      return { type: 'pour', from: selected, to: idx, color: result.color };
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

  function audioVolume(kind, scale) {
    var key = kind === 'bgm' ? settings.bgmVolume : settings.sfxVolume;
    return Math.max(0, Math.min(1, key)) * scale;
  }

  function playOsc(freq, delay, duration, type, volume) {
    var ctx = getAudioContext();
    if (!ctx) return;
    var start = ctx.currentTime + delay;
    var gain = ctx.createGain();
    var osc = ctx.createOscillator();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  function playNoise(delay, duration, volume, filterFreq) {
    var ctx = getAudioContext();
    if (!ctx) return;
    var sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
    var buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < sampleCount; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
    }
    var source = ctx.createBufferSource();
    var filter = ctx.createBiquadFilter();
    var gain = ctx.createGain();
    var start = ctx.currentTime + delay;
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq || 1200;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(start);
  }

  function beep(id) {
    if (!settings.sfxEnabled) return;
    var v = audioVolume('sfx', 0.36);
    if (id === 'select') {
      playOsc(520, 0, 0.055, 'sine', v * 0.55);
      playOsc(660, 0.045, 0.07, 'sine', v * 0.45);
    } else if (id === 'invalid') {
      playOsc(180, 0, 0.08, 'square', v * 0.45);
      playOsc(120, 0.07, 0.11, 'square', v * 0.35);
    } else if (id === 'pour') {
      playNoise(0, 0.32, v * 0.45, 900);
      playOsc(430, 0, 0.16, 'triangle', v * 0.25);
      playOsc(620, 0.18, 0.09, 'sine', v * 0.35);
    } else if (id === 'undo') {
      playOsc(420, 0, 0.06, 'triangle', v * 0.4);
      playOsc(300, 0.055, 0.08, 'triangle', v * 0.45);
    } else if (id === 'hint') {
      playOsc(760, 0, 0.08, 'sine', v * 0.42);
      playOsc(960, 0.08, 0.12, 'sine', v * 0.36);
    } else if (id === 'win') {
      playOsc(523, 0, 0.14, 'triangle', v * 0.55);
      playOsc(659, 0.12, 0.14, 'triangle', v * 0.55);
      playOsc(784, 0.24, 0.16, 'triangle', v * 0.55);
      playOsc(1047, 0.38, 0.28, 'sine', v * 0.65);
      playOsc(1319, 0.55, 0.36, 'sine', v * 0.45);
      playNoise(0.08, 0.72, v * 0.25, 2600);
    } else if (id === 'fail') {
      playOsc(220, 0, 0.16, 'sawtooth', v * 0.35);
      playOsc(160, 0.15, 0.24, 'sawtooth', v * 0.35);
    } else {
      playOsc(460, 0, 0.045, 'sine', v * 0.38);
    }
  }

  function stopBgm() {
    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = null;
  }

  function playBgmStep(step) {
    if (!audioUnlocked || !settings.bgmEnabled) return;
    var notes = Array.isArray(step) ? step : [step];
    var baseVolume = audioVolume('bgm', 0.12);
    notes.forEach(function (freq, idx) {
      playOsc(freq, idx * 0.018, idx === 0 ? 0.34 : 0.24, idx === 0 ? 'triangle' : 'sine', baseVolume * (idx === 0 ? 1 : 0.58));
    });
  }

  function switchBgm(track) {
    bgmTrack = track;
    stopBgm();
    if (!settings.bgmEnabled) return;
    var tracks = {
      menu: [[220, 330], [277], [330, 440], [277]],
      easy: [[262, 392], [330], [392, 523], [330], [294, 440], [349]],
      normal: [[196, 294], [247], [294, 370], [247], [220, 330], [277]],
      hard: [[147, 220], [185], [220, 277], [165], [196, 247], [185]]
    };
    var notes = tracks[track] || tracks.menu;
    var idx = 0;
    bgmTimer = setInterval(function () {
      playBgmStep(notes[idx % notes.length]);
      idx += 1;
    }, track === 'hard' ? 480 : 620);
    playBgmStep(notes[0]);
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
    var saveSummary = lastSave
      ? fmt('home.lastSave', { difficulty: diffLabel(lastSave.difficulty), level: lastSave.levelId, moves: lastSave.moves })
      : t('home.noSave');
    app.className = 'screen home-screen';
    app.innerHTML = [
      '<main class="app-shell">',
      '<div class="content-width home-layout">',
      '<section class="home-copy">',
      '<p class="kicker">' + t('home.kicker') + '</p>',
      '<h1 class="app-title">Water Sort Puzzle</h1>',
      '<p>' + t('home.copy') + '</p>',
      '<div class="home-actions">',
      '<button class="btn btn--primary" data-action="play"><span class="btn__icon">P</span>' + t('home.start') + '</button>',
      '<button class="btn" data-action="continue" ' + (lastSave ? '' : 'disabled') + '><span class="btn__icon">C</span>' + t('home.continue') + '</button>',
      '<button class="btn" data-nav="instructions"><span class="btn__icon">?</span>' + t('home.rules') + '</button>',
      '<button class="btn" data-nav="settings"><span class="btn__icon">S</span>' + t('home.settings') + '</button>',
      '</div>',
      '<div class="save-summary">' + saveSummary + '</div>',
      '</section>',
      '<section class="preview-rack" aria-label="' + t('home.preview') + '">',
      LEVELS.easy[0].tubes.slice(0, 4).map(previewTube).join(''),
      '</section>',
      '</div>',
      '</main>'
    ].join('');
    app.querySelector('[data-action="play"]').addEventListener('click', function () {
      showModal({
        title: t('modal.difficulty.title'),
        body: '<p>' + t('modal.difficulty.body') + '</p>',
        actions: [
          { label: diffLabel('easy'), primary: true, handler: function () { navigate('levels', { diff: 'easy' }); } },
          { label: diffLabel('normal'), handler: function () { navigate('levels', { diff: 'normal' }); } },
          { label: diffLabel('hard'), handler: function () { navigate('levels', { diff: 'hard' }); } }
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
      '<p class="kicker">' + t('levels.kicker') + '</p>',
      '<h1 class="section-title">' + fmt('levels.title', { difficulty: diffLabel(diff) }) + '</h1>',
      '<p class="screen__copy">' + fmt('levels.copy', { total: LEVELS[diff].length, cleared: progress.cleared.length }) + '</p>',
      '</div>',
      '<div class="top-bar__actions">',
      '<button class="btn btn--ghost" data-nav="home" aria-label="' + t('levels.back') + '">' + t('levels.back') + '</button>',
      '<button class="btn btn--ghost" data-nav="settings" aria-label="' + t('levels.settings') + '">' + t('levels.settings') + '</button>',
      '</div>',
      '</header>',
      '<div class="level-toolbar">',
      '<div class="segmented" aria-label="' + t('levels.difficulty') + '">',
      Object.keys(DIFF_LABEL).map(function (key) {
        return '<button class="btn" data-diff="' + key + '" aria-pressed="' + (key === diff) + '">' + diffLabel(key) + '</button>';
      }).join(''),
      '</div>',
      '</div>',
      '<section class="level-grid" aria-label="' + t('levels.list') + '">',
      LEVELS[diff].map(function (level) {
        return [
          '<button class="level-tile" data-level="' + level.id + '">',
          '<strong>' + level.id + '</strong>',
          '<span aria-label="' + fmt('levels.stars', { count: progress.stars[level.id] || 0 }) + '">' + starsText(progress.stars[level.id]) + '</span>',
          '<small>' + fmt('levels.colors', { count: level.colors }) + '</small>',
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
      if (isComplete(tube)) classes.push('tube--sealed');
      if (isComplete(tube)) classes.push('tube--complete');
      if (hintMove && (hintMove.from === idx || hintMove.to === idx)) classes.push('tube--hint');
      if (hintMove && hintMove.from === idx) classes.push('tube--source');
      if (hintMove && hintMove.to === idx) classes.push('tube--target');
      var layers = tube.map(function (color) {
        return '<span class="tube__layer tube__layer--' + color + '" aria-hidden="true"></span>';
      }).join('');
      var label = tube.length
        ? fmt('tube.top', { index: idx + 1, color: colorLabel(topColor(tube)) })
        : fmt('tube.empty', { index: idx + 1 });
      return [
        '<button class="' + classes.join(' ') + '" type="button" data-tube="' + idx + '" aria-label="' + label + '" aria-selected="' + (game.state.selectedTube === idx) + '">',
        isComplete(tube) ? '<span class="tube__cork" aria-hidden="true"></span>' : '',
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

  function animatePour(container, from, to, color) {
    var source = container.querySelector('[data-tube="' + from + '"]');
    var target = container.querySelector('[data-tube="' + to + '"]');
    if (!source || !target) return;

    var sourceRect = source.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    var direction = targetRect.left >= sourceRect.left ? 1 : -1;
    var startX = sourceRect.left + sourceRect.width * (direction > 0 ? 0.72 : 0.28);
    var startY = sourceRect.top + sourceRect.height * 0.08;
    var endX = targetRect.left + targetRect.width * 0.5;
    var endY = targetRect.top + targetRect.height * 0.11;
    var dx = endX - startX;
    var dy = endY - startY;
    var length = Math.max(36, Math.sqrt(dx * dx + dy * dy));
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    var stream = document.createElement('span');
    var splash = document.createElement('span');
    var bend = Math.min(96, Math.max(34, Math.abs(dx) * 0.22 + 18));

    source.classList.add(direction > 0 ? 'tube--pour-right' : 'tube--pour-left');
    target.classList.add('tube--target');
    stream.className = 'pour-arc tube__layer--' + (color || 'cyan');
    stream.style.left = startX + 'px';
    stream.style.top = startY + 'px';
    stream.style.width = length + 'px';
    stream.style.setProperty('--pour-bend', bend + 'px');
    stream.style.setProperty('--pour-angle', angle + 'deg');
    splash.className = 'pour-splash tube__layer--' + (color || 'cyan');
    splash.style.left = endX + 'px';
    splash.style.top = endY + 'px';
    document.body.appendChild(stream);
    splash.style.color = getComputedStyle(stream).backgroundColor;
    document.body.appendChild(splash);

    window.setTimeout(function () {
      stream.remove();
      splash.remove();
      source.classList.remove('tube--pour-right');
      source.classList.remove('tube--pour-left');
      target.classList.remove('tube--target');
    }, 820);
  }

  function confetti() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var colors = ['#ff4757', '#ffc312', '#12cbc4', '#9980fa', '#a3cb38', '#fda7df', '#00b4d8', '#ff6b35'];
    var pieces = [];
    var start = performance.now();
    var duration = 2600;
    canvas.className = 'confetti-canvas';
    function resize() {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    addEventListener('resize', resize);
    document.body.appendChild(canvas);

    function addPiece(originX, originY, burst) {
      var angle = burst ? Math.random() * Math.PI * 2 : Math.PI * 0.5 + (Math.random() - 0.5) * 0.9;
      var speed = burst ? 4 + Math.random() * 8 : 1.5 + Math.random() * 4;
      var streamer = Math.random() > 0.62;
      pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 5 : 0),
        width: streamer ? 5 + Math.random() * 5 : 5 + Math.random() * 8,
        height: streamer ? 22 + Math.random() * 26 : 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        spin: Math.random() * Math.PI,
        spinSpeed: -0.22 + Math.random() * 0.44,
        wave: Math.random() * Math.PI * 2,
        gravity: streamer ? 0.035 : 0.055,
        alpha: 0.82 + Math.random() * 0.18
      });
    }

    for (var i = 0; i < 150; i += 1) {
      addPiece(Math.random() * innerWidth, -24 - Math.random() * innerHeight * 0.25, false);
    }
    for (var j = 0; j < 110; j += 1) {
      addPiece(innerWidth * 0.5, innerHeight * 0.38, true);
    }

    function frame(now) {
      var elapsed = now - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      pieces.forEach(function (piece) {
        piece.wave += 0.08;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.x += Math.sin(piece.wave) * 0.55;
        piece.vy += piece.gravity;
        piece.spin += piece.spinSpeed;
        ctx.save();
        ctx.globalAlpha = piece.alpha * Math.max(0, 1 - elapsed / duration);
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.spin);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        ctx.restore();
      });
      if (elapsed < duration) {
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
      '<button class="btn btn--ghost" data-action="back" aria-label="' + t('game.back') + '">' + t('game.back') + '</button>',
      '<div class="game-hud__title">',
      '<strong>' + fmt('game.title', { difficulty: diffLabel(diff), level: level.id }) + '</strong>',
      '<span>' + (diff === 'hard'
        ? fmt('game.subtitleHard', { colors: level.colors, moves: level.optimalMoves, time: formatTime(game.timeLimit()) })
        : fmt('game.subtitle', { colors: level.colors, moves: level.optimalMoves })) + '</span>',
      '</div>',
      '<div class="game-hud__stats">',
      '<div class="stat-pill" data-stat="moves"><span>' + t('game.moves') + '</span><strong>0</strong></div>',
      '<div class="stat-pill" data-stat="time"><span>' + (diff === 'hard' ? t('game.left') : t('game.time')) + '</span><strong>0:00</strong></div>',
      '<div class="stat-pill" data-stat="hints"><span>' + t('game.hints') + '</span><strong>0</strong></div>',
      '</div>',
      '</header>',
      '<section class="tubes-area"><div class="tubes-grid" aria-label="' + t('game.tubes') + '"></div></section>',
      '<div class="toast" role="status"></div>',
      '<nav class="game-controls" aria-label="' + t('game.controls') + '">',
      '<button class="btn" data-action="undo"><span class="btn__icon">U</span>' + t('game.undo') + '</button>',
      '<button class="btn" data-action="hint"><span class="btn__icon">H</span>' + t('game.hint') + '</button>',
      '<button class="btn" data-action="restart"><span class="btn__icon">R</span>' + t('game.restart') + '</button>',
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
          showToast(result.reason === 'empty' ? t('toast.empty') : t('toast.invalid'));
        }
        if (result.type === 'pour' || result.type === 'win') beep('pour');
        if (game.status !== 'WIN' && game.status !== 'FAIL') saveGameState(game.state);
        renderBoard();
        if (result.type === 'pour' || result.type === 'win') {
          animatePour(grid, result.from, result.to, result.color);
        }
        if (result.type === 'win') {
          window.setTimeout(function () { showWin(result.stars); }, 420);
        }
        if (result.type === 'fail') showFail(result.reason);
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
        title: t('win.title'),
        body: [
          '<div class="stars" aria-label="' + fmt('win.stars', { count: stars }) + '">' + Array(stars + 1).join('*') + '</div>',
          '<div class="result-summary">',
          '<div><span>' + t('game.moves') + '</span><strong>' + game.state.moves + '</strong></div>',
          '<div><span>' + t('game.time') + '</span><strong>' + formatTime(game.state.time) + '</strong></div>',
          '<div><span>' + t('game.hints') + '</span><strong>' + game.state.hintsUsed + '</strong></div>',
          '<div><span>Undo</span><strong>' + game.state.undoCount + '</strong></div>',
          '</div>'
        ].join(''),
        actions: [
          { label: t('win.replay'), handler: function () { game.restart(); renderBoard(); saveGameState(game.state); } },
          { label: t('win.levels'), handler: function () { navigate('levels', { diff: diff }); } },
          nextLevel ? { label: t('win.next'), primary: true, handler: function () { navigate('game', { diff: diff, level: nextLevel.id }); } } : null
        ].filter(Boolean)
      });
    }

    function showFail(reason) {
      beep('fail');
      showModal({
        title: reason === 'time' ? t('fail.time') : t('fail.stuck'),
        body: '<p>' + t('fail.body') + '</p>',
        actions: [
          { label: t('win.levels'), handler: function () { navigate('levels', { diff: diff }); } },
          { label: t('game.restart'), primary: true, handler: function () { game.restart(); renderBoard(); saveGameState(game.state); } }
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
        showToast(t('toast.undo'));
      }
    });
    app.querySelector('[data-action="hint"]').addEventListener('click', function () {
      var move = findHint(game.state.tubes);
      if (!move) {
        beep('invalid');
        showToast(t('toast.noHint'));
        return;
      }
      game.state.hintsUsed += 1;
      hintMove = move;
      beep('hint');
      showToast(fmt('toast.hint', { from: move.from + 1, to: move.to + 1 }));
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
    var ruleItems = [
      { icon: 'GO', title: t('instructions.objective.title'), body: t('instructions.objective.body') },
      { icon: '1', title: t('instructions.select.title'), body: t('instructions.select.detail') },
      { icon: '~', title: t('instructions.pour.title'), body: t('instructions.pour.body') },
      { icon: '✓', title: t('instructions.valid.title'), body: t('instructions.valid.body') },
      { icon: '×', title: t('instructions.invalid.title'), body: t('instructions.invalid.body') },
      { icon: 'C', title: t('instructions.cork.title'), body: t('instructions.cork.body') },
      { icon: '↶', title: t('instructions.tools.title'), body: t('instructions.tools.body') },
      { icon: '*', title: t('instructions.score.title'), body: t('instructions.score.body') },
      { icon: 'S', title: t('instructions.settings.title'), body: t('instructions.settings.body') },
      { icon: '→', title: t('instructions.flow.title'), body: t('instructions.flow.body') }
    ];

    function miniTube(colors, sealed) {
      return [
        '<span class="mini-tube' + (sealed ? ' mini-tube--sealed' : '') + '">',
        sealed ? '<span class="mini-cork"></span>' : '',
        colors.map(function (color) { return '<span class="mini-layer tube__layer--' + color + '"></span>'; }).join(''),
        '</span>'
      ].join('');
    }

    app.className = 'screen instructions-screen';
    app.innerHTML = [
      '<main class="app-shell">',
      '<div class="content-width">',
      '<header class="screen__header">',
      '<div><p class="kicker">' + t('instructions.kicker') + '</p><h1 class="section-title">' + t('instructions.title') + '</h1>',
      '<p class="screen__copy">' + t('instructions.copy') + '</p></div>',
      '<button class="btn btn--ghost" data-nav="home" aria-label="' + t('game.back') + '">' + t('game.back') + '</button>',
      '</header>',
      '<section class="instruction-demo panel panel--padded" aria-label="' + t('instructions.title') + '">',
      '<div class="instruction-demo__flow">',
      '<div>' + miniTube(['red', 'blue', 'red'], false) + '<span class="demo-label">' + t('instructions.select.title') + '</span></div>',
      '<div class="demo-arrow">→</div>',
      '<div>' + miniTube(['green', 'blue'], false) + '<span class="demo-label">' + t('instructions.valid.title') + '</span></div>',
      '<div class="demo-arrow">→</div>',
      '<div>' + miniTube(['red', 'red', 'red', 'red'], true) + '<span class="demo-label">' + t('instructions.cork.title') + '</span></div>',
      '</div>',
      '</section>',
      '<section class="rules-grid">',
      ruleItems.map(function (item) {
        return '<article class="rule-card"><div class="rule-card__icon" aria-hidden="true">' + item.icon + '</div><div><h2>' + item.title + '</h2><p>' + item.body + '</p></div></article>';
      }).join(''),
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
        '<div><p class="kicker">' + t('settings.kicker') + '</p><h1 class="section-title">' + t('settings.title') + '</h1></div>',
        '<button class="btn btn--ghost" data-nav="home" aria-label="' + t('game.back') + '">' + t('game.back') + '</button>',
        '</header>',
        '<section class="panel panel--padded">',
        '<div class="settings-list">',
        '<div class="setting-row"><label for="bgmVolume">' + t('settings.bgmVolume') + '</label><input id="bgmVolume" type="range" min="0" max="1" step="0.05" value="' + settings.bgmVolume + '"></div>',
        '<div class="setting-row"><label for="sfxVolume">' + t('settings.sfxVolume') + '</label><input id="sfxVolume" type="range" min="0" max="1" step="0.05" value="' + settings.sfxVolume + '"></div>',
        '<div class="setting-row"><label for="languageSelect">' + t('settings.language') + '</label><select id="languageSelect" class="select-control">',
        '<option value="en" ' + (settings.language === 'en' ? 'selected' : '') + '>English</option>',
        '<option value="zh" ' + (settings.language === 'zh' ? 'selected' : '') + '>繁體中文</option>',
        '<option value="ja" ' + (settings.language === 'ja' ? 'selected' : '') + '>日本語</option>',
        '</select></div>',
        '<div class="setting-row"><div class="setting-row__label">' + t('settings.theme') + '</div><div class="theme-swatches">',
        THEMES.map(function (theme) {
          return '<button class="theme-swatch theme-swatch--' + theme + '" data-theme-choice="' + theme + '" aria-pressed="' + (settings.theme === theme) + '" aria-label="' + theme + '"><span></span></button>';
        }).join(''),
        '</div></div>',
        checkboxRow(t('settings.bgm'), 'bgmEnabled'),
        checkboxRow(t('settings.sfx'), 'sfxEnabled'),
        checkboxRow(t('settings.vibration'), 'vibration'),
        checkboxRow(t('settings.timer'), 'showTimer'),
        '</div>',
        '</section>',
        '<div class="btn-group" style="margin-top: 16px;">',
        '<button class="btn" data-action="reset-settings">' + t('settings.reset') + '</button>',
        '<button class="btn btn--danger" data-action="clear-save">' + t('settings.clear') + '</button>',
        '</div>',
        '</div>',
        '</main>'
      ].join('');
    }

    function checkboxRow(label, key) {
      return '<div class="setting-row"><span class="setting-row__label">' + label + '</span><label class="switch"><input type="checkbox" data-setting="' + key + '" ' + (settings[key] ? 'checked' : '') + '>' + t('settings.on') + '</label></div>';
    }

    function bind() {
      app.querySelector('[data-nav="home"]').addEventListener('click', function () { navigate('home'); });
      app.querySelector('#bgmVolume').addEventListener('input', function (event) { updateSettings({ bgmVolume: Number(event.target.value) }); });
      app.querySelector('#sfxVolume').addEventListener('input', function (event) {
        updateSettings({ sfxVolume: Number(event.target.value) });
        beep('click');
      });
      app.querySelector('#languageSelect').addEventListener('change', function (event) {
        updateSettings({ language: event.target.value });
        beep('click');
        renderSettings();
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
          title: t('clear.title'),
          body: '<p>' + t('clear.body') + '</p>',
          actions: [
            { label: t('clear.cancel') },
            { label: t('clear.confirm'), primary: true, handler: function () { clearAllSave(); } }
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
  applyLanguage(settings.language);
  addEventListener('hashchange', renderRoute);
  if (!location.hash) location.hash = '#home';
  renderRoute();
})();
