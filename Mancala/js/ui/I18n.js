(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  var LANG_META = {
    "zh-Hant": { htmlLang: "zh-Hant" },
    en: { htmlLang: "en" },
    ja: { htmlLang: "ja" }
  };

  var DICTIONARY = {
    "zh-Hant": {
      appTitle: "Mancala 播棋",
      subtitle: "雙方輪流播種、佈局、搶分的 Kalah 策略棋盤遊戲",
      mainMenu: "主選單",
      version: "版本 1.0.0",
      startGame: "開始遊戲",
      continueGame: "繼續遊戲",
      noSave: "尚無存檔",
      lastPlayed: "上次遊玩：{time}",
      instructions: "遊戲說明",
      settings: "設定",
      aiDifficulty: "AI 難度",
      time: "時間",
      aiStore: "AI 大倉",
      playerStore: "玩家大倉",
      boardArea: "播棋棋盤區",
      board: "播棋棋盤",
      gameControls: "遊戲操作",
      sfx: "音效",
      music: "音樂",
      pause: "暫停",
      mainMenuAction: "主選單",
      backToMenu: "返回主選單",
      rulesTitle: "遊戲說明",
      rulesBoardTitle: "棋盤配置",
      rulesBoardBody: "玩家控制下方 6 個小坑與右側大倉，AI 控制上方 6 個小坑與左側大倉。開局每個小坑放入設定數量的棋子。",
      rulesMoveTitle: "走法",
      rulesMoveBody: "輪到你時選擇自己側邊非空小坑，取出全部棋子並逆時針一格一格播下。播種時會略過對手的大倉。",
      rulesSpecialTitle: "特殊規則",
      rulesSpecialBody: "最後一顆落在自己的大倉可再走一次；最後一顆落在自己空坑，且對面有棋子時，可將雙方該坑的棋子收入自己的大倉。",
      rulesWinTitle: "勝利條件",
      rulesWinBody: "任一方 6 個小坑全空時遊戲結束，另一方剩餘棋子收入自己的大倉。大倉棋子多者獲勝。",
      learnedStart: "我了解了，開始遊戲",
      audio: "音量",
      bgMusic: "背景音樂",
      theme: "遊戲主題",
      gameplay: "玩法",
      showTimer: "顯示計時器",
      defaultDifficulty: "預設 AI 難度",
      initialStones: "每坑初始棋子",
      language: "語言",
      languageZh: "繁體中文",
      languageEn: "English",
      languageJa: "日本語",
      saveSettings: "儲存設定",
      settingsSaved: "設定已儲存",
      result: "遊戲結束",
      gameDuration: "遊戲時長",
      totalMoves: "總回合數",
      playAgain: "再玩一局",
      easy: "簡單",
      normal: "普通",
      hard: "困難",
      classic: "經典木質",
      ocean: "海洋藍",
      forest: "森林綠",
      sunset: "夕陽橙紅",
      night: "暗夜紫黑",
      candy: "糖果粉彩",
      chooseDifficulty: "選擇 AI 難度",
      close: "關閉",
      easyDescription: "AI 會從合法走法中隨機選擇，適合熟悉規則。",
      normalDescription: "AI 會優先選擇再走一次、吃子與得分較高的走法。",
      hardDescription: "AI 使用 Minimax 搜尋與剪枝，會規劃多步後果。",
      noSaveToast: "目前沒有可繼續的存檔",
      leaveTitle: "返回主選單？",
      leaveBody: "目前進度會自動儲存，下次可從主選單繼續。",
      cancel: "取消",
      back: "返回",
      pausedToast: "遊戲已暫停",
      resumedToast: "遊戲繼續",
      captureToast: "{player}吃子 {count} 顆",
      extraTurnToast: "{player}再走一次",
      gameOverStatus: "遊戲結束",
      pausedStatus: "遊戲已暫停",
      aiThinking: "AI 正在思考",
      playerTurn: "玩家的回合，請選擇一個坑。",
      aiTurn: "AI 的回合。",
      playerWin: "玩家獲勝",
      aiWin: "AI 獲勝",
      draw: "平手",
      player: "玩家",
      ai: "AI",
      aiPit: "AI {number}",
      playerPit: "玩家 {number}",
      pitAria: "{label}，現有 {count} 顆棋子",
      storeAria: "{label}，共 {count} 顆棋子"
    },
    en: {
      appTitle: "Mancala",
      subtitle: "A Kalah strategy board game of sowing, planning, and scoring.",
      mainMenu: "Main Menu",
      version: "Version 1.0.0",
      startGame: "Start Game",
      continueGame: "Continue",
      noSave: "No saved game",
      lastPlayed: "Last played: {time}",
      instructions: "How to Play",
      settings: "Settings",
      aiDifficulty: "AI Difficulty",
      time: "Time",
      aiStore: "AI Store",
      playerStore: "Player Store",
      boardArea: "Mancala board area",
      board: "Mancala board",
      gameControls: "Game controls",
      sfx: "SFX",
      music: "Music",
      pause: "Pause",
      mainMenuAction: "Main Menu",
      backToMenu: "Back to main menu",
      rulesTitle: "How to Play",
      rulesBoardTitle: "Board",
      rulesBoardBody: "You control the 6 pits on the bottom and the store on the right. The AI controls the 6 pits on top and the store on the left. Each pit starts with the configured number of stones.",
      rulesMoveTitle: "Move",
      rulesMoveBody: "On your turn, choose a non-empty pit on your side. Pick up all stones and sow them counter-clockwise one by one, skipping the opponent's store.",
      rulesSpecialTitle: "Special Rules",
      rulesSpecialBody: "If your last stone lands in your store, you move again. If it lands in your empty pit and the opposite pit has stones, both pits are captured into your store.",
      rulesWinTitle: "Win Condition",
      rulesWinBody: "The game ends when either side's 6 pits are empty. Remaining stones go to the other side's store. The higher store total wins.",
      learnedStart: "Got it, start game",
      audio: "Audio",
      bgMusic: "Background Music",
      theme: "Theme",
      gameplay: "Gameplay",
      showTimer: "Show Timer",
      defaultDifficulty: "Default AI Difficulty",
      initialStones: "Initial Stones Per Pit",
      language: "Language",
      languageZh: "繁體中文",
      languageEn: "English",
      languageJa: "日本語",
      saveSettings: "Save Settings",
      settingsSaved: "Settings saved",
      result: "Game Over",
      gameDuration: "Duration",
      totalMoves: "Total Moves",
      playAgain: "Play Again",
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
      classic: "Classic Wood",
      ocean: "Ocean Blue",
      forest: "Forest Green",
      sunset: "Sunset Red",
      night: "Night Violet",
      candy: "Candy Pastel",
      chooseDifficulty: "Choose AI Difficulty",
      close: "Close",
      easyDescription: "The AI randomly chooses from legal moves. Good for learning the rules.",
      normalDescription: "The AI prioritizes extra turns, captures, and higher-scoring moves.",
      hardDescription: "The AI uses Minimax search with pruning to plan several moves ahead.",
      noSaveToast: "No saved game to continue",
      leaveTitle: "Return to the main menu?",
      leaveBody: "Your current progress will be saved automatically and can be continued later.",
      cancel: "Cancel",
      back: "Return",
      pausedToast: "Game paused",
      resumedToast: "Game resumed",
      captureToast: "{player} captured {count} stones",
      extraTurnToast: "{player} gets another turn",
      gameOverStatus: "Game over",
      pausedStatus: "Game paused",
      aiThinking: "AI is thinking",
      playerTurn: "Your turn. Choose a pit.",
      aiTurn: "AI's turn.",
      playerWin: "Player Wins",
      aiWin: "AI Wins",
      draw: "Draw",
      player: "Player",
      ai: "AI",
      aiPit: "AI {number}",
      playerPit: "Player {number}",
      pitAria: "{label}, {count} stones",
      storeAria: "{label}, {count} stones total"
    },
    ja: {
      appTitle: "Mancala",
      subtitle: "種まき、戦略、得点を競う Kalah ルールのボードゲームです。",
      mainMenu: "メインメニュー",
      version: "バージョン 1.0.0",
      startGame: "ゲーム開始",
      continueGame: "続きから",
      noSave: "セーブデータなし",
      lastPlayed: "前回プレイ：{time}",
      instructions: "遊び方",
      settings: "設定",
      aiDifficulty: "AI 難易度",
      time: "時間",
      aiStore: "AI ストア",
      playerStore: "プレイヤーストア",
      boardArea: "マンカラ盤エリア",
      board: "マンカラ盤",
      gameControls: "ゲーム操作",
      sfx: "効果音",
      music: "音楽",
      pause: "一時停止",
      mainMenuAction: "メニュー",
      backToMenu: "メインメニューに戻る",
      rulesTitle: "遊び方",
      rulesBoardTitle: "盤面",
      rulesBoardBody: "プレイヤーは下側の 6 つのピットと右側のストアを操作します。AI は上側の 6 つのピットと左側のストアを操作します。各ピットには設定した数の石が入ります。",
      rulesMoveTitle: "手番",
      rulesMoveBody: "自分の番では、自分側の空でないピットを選びます。すべての石を取り、反時計回りに 1 個ずつまきます。相手のストアは飛ばします。",
      rulesSpecialTitle: "特別ルール",
      rulesSpecialBody: "最後の石が自分のストアに入ると、もう一度手番を得ます。最後の石が自分の空ピットに入り、向かいのピットに石がある場合、両方の石を自分のストアに獲得します。",
      rulesWinTitle: "勝利条件",
      rulesWinBody: "どちらか一方の 6 つのピットがすべて空になると終了です。残った石は相手側のストアに入ります。ストアの石が多い方が勝ちです。",
      learnedStart: "理解しました、開始",
      audio: "音量",
      bgMusic: "BGM",
      theme: "テーマ",
      gameplay: "ゲーム設定",
      showTimer: "タイマーを表示",
      defaultDifficulty: "既定の AI 難易度",
      initialStones: "各ピットの初期石数",
      language: "言語",
      languageZh: "繁體中文",
      languageEn: "English",
      languageJa: "日本語",
      saveSettings: "設定を保存",
      settingsSaved: "設定を保存しました",
      result: "ゲーム終了",
      gameDuration: "プレイ時間",
      totalMoves: "合計手数",
      playAgain: "もう一度",
      easy: "かんたん",
      normal: "ふつう",
      hard: "むずかしい",
      classic: "クラシック木目",
      ocean: "オーシャンブルー",
      forest: "フォレストグリーン",
      sunset: "サンセットレッド",
      night: "ナイトバイオレット",
      candy: "キャンディパステル",
      chooseDifficulty: "AI 難易度を選択",
      close: "閉じる",
      easyDescription: "AI は合法手からランダムに選びます。ルール確認に向いています。",
      normalDescription: "AI は追加手番、獲得、得点の高い手を優先します。",
      hardDescription: "AI は Minimax 探索と枝刈りで数手先まで考えます。",
      noSaveToast: "続きから遊べるセーブデータがありません",
      leaveTitle: "メインメニューに戻りますか？",
      leaveBody: "現在の進行状況は自動保存され、次回続きから遊べます。",
      cancel: "キャンセル",
      back: "戻る",
      pausedToast: "一時停止しました",
      resumedToast: "再開しました",
      captureToast: "{player} が {count} 個獲得",
      extraTurnToast: "{player} がもう一度手番",
      gameOverStatus: "ゲーム終了",
      pausedStatus: "一時停止中",
      aiThinking: "AI が考えています",
      playerTurn: "あなたの番です。ピットを選んでください。",
      aiTurn: "AI の番です。",
      playerWin: "プレイヤーの勝利",
      aiWin: "AI の勝利",
      draw: "引き分け",
      player: "プレイヤー",
      ai: "AI",
      aiPit: "AI {number}",
      playerPit: "プレイヤー {number}",
      pitAria: "{label}、石 {count} 個",
      storeAria: "{label}、合計 {count} 個"
    }
  };

  var BINDINGS = [
    ["html", "lang", "htmlLang"],
    [".brand-lockup", "aria-label", "appTitle"],
    ["#main-title", "text", "appTitle"],
    [".brand-lockup p", "text", "subtitle"],
    [".menu-actions", "aria-label", "mainMenu"],
    ["#btn-start", "tailText", "startGame"],
    ["#btn-continue > span", "text", "continueGame"],
    ["#btn-instructions", "tailText", "instructions"],
    ["#btn-settings", "tailText", "settings"],
    [".version-label", "text", "version"],
    ["#game-title", "text", "appTitle"],
    ["#btn-game-settings", "aria-label", "settings"],
    [".game-hud .hud-card:nth-child(1) .hud-label", "text", "aiDifficulty"],
    [".game-hud .hud-card:nth-child(2) .hud-label", "text", "time"],
    [".game-hud .hud-card:nth-child(3) .hud-label", "text", "aiStore"],
    [".game-hud .hud-card:nth-child(4) .hud-label", "text", "playerStore"],
    [".board-stage", "aria-label", "boardArea"],
    ["#game-board", "aria-label", "board"],
    [".game-controls-bar", "aria-label", "gameControls"],
    ["#btn-toggle-sfx", "tailText", "sfx"],
    ["#btn-toggle-music", "tailText", "music"],
    ["#btn-pause", "tailText", "pause"],
    ["#btn-return-menu", "tailText", "mainMenuAction"],
    [".js-back-menu", "aria-label", "backToMenu"],
    ["#instructions-title", "text", "rulesTitle"],
    [".rule-block:nth-child(1) h3", "text", "rulesBoardTitle"],
    [".rule-block:nth-child(1) p", "text", "rulesBoardBody"],
    [".mini-board span:first-child", "text", "aiStore"],
    [".mini-board span:last-child", "text", "playerStore"],
    [".rule-block:nth-child(2) h3", "text", "rulesMoveTitle"],
    [".rule-block:nth-child(2) p", "text", "rulesMoveBody"],
    [".rule-block:nth-child(3) h3", "text", "rulesSpecialTitle"],
    [".rule-block:nth-child(3) p", "text", "rulesSpecialBody"],
    [".rule-block:nth-child(4) h3", "text", "rulesWinTitle"],
    [".rule-block:nth-child(4) p", "text", "rulesWinBody"],
    ["#btn-learned-start", "tailText", "learnedStart"],
    ["#settings-title", "text", "settings"],
    ["#setting-audio", "text", "audio"],
    [".range-field:nth-of-type(1) span", "text", "bgMusic"],
    [".range-field:nth-of-type(2) span", "text", "sfx"],
    ["#setting-theme", "text", "theme"],
    [".swatch-grid", "aria-label", "theme"],
    ['[data-theme-choice="classic"]', "tailText", "classic"],
    ['[data-theme-choice="ocean"]', "tailText", "ocean"],
    ['[data-theme-choice="forest"]', "tailText", "forest"],
    ['[data-theme-choice="sunset"]', "tailText", "sunset"],
    ['[data-theme-choice="night"]', "tailText", "night"],
    ['[data-theme-choice="candy"]', "tailText", "candy"],
    ["#setting-gameplay", "text", "gameplay"],
    [".toggle-row span", "text", "showTimer"],
    [".settings-group--split > div:nth-of-type(1) .field-label", "text", "defaultDifficulty"],
    [".settings-group--split > div:nth-of-type(1) .segmented", "aria-label", "defaultDifficulty"],
    [".settings-group--split > div:nth-of-type(2) .field-label", "text", "initialStones"],
    [".settings-group--split > div:nth-of-type(2) .segmented", "aria-label", "initialStones"],
    ['[data-difficulty-choice="easy"]', "text", "easy"],
    ['[data-difficulty-choice="normal"]', "text", "normal"],
    ['[data-difficulty-choice="hard"]', "text", "hard"],
    ["#setting-language", "text", "language"],
    [".language-options", "aria-label", "language"],
    ['[data-language-choice="zh-Hant"]', "text", "languageZh"],
    ['[data-language-choice="en"]', "text", "languageEn"],
    ['[data-language-choice="ja"]', "text", "languageJa"],
    ['#settings-form button[type="submit"]', "tailText", "saveSettings"],
    ["#game-over-title", "text", "result"],
    [".result-scoreboard > div:nth-child(1) span", "text", "playerStore"],
    [".result-scoreboard > div:nth-child(2) span", "text", "aiStore"],
    [".result-stats > div:nth-child(1) dt", "text", "gameDuration"],
    [".result-stats > div:nth-child(2) dt", "text", "totalMoves"],
    ["#btn-play-again", "tailText", "playAgain"],
    ["#btn-result-menu", "tailText", "mainMenuAction"]
  ];

  function I18n(language) {
    this.language = normalizeLanguage(language);
  }

  I18n.prototype.setLanguage = function(language) {
    this.language = normalizeLanguage(language);
    this.apply();
  };

  I18n.prototype.t = function(key, params) {
    var table = DICTIONARY[this.language] || DICTIONARY["zh-Hant"];
    var fallback = DICTIONARY["zh-Hant"];
    var value = table[key] || fallback[key] || key;
    return interpolate(value, params);
  };

  I18n.prototype.apply = function(root) {
    var scope = root || document;
    var self = this;
    document.title = this.t("appTitle");

    BINDINGS.forEach(function(binding) {
      var selector = binding[0];
      var mode = binding[1];
      var key = binding[2];
      var nodes = selector === "html" ? [document.documentElement] : scope.querySelectorAll(selector);
      Array.prototype.forEach.call(nodes, function(node) {
        if (mode === "text") {
          node.textContent = self.t(key);
        } else if (mode === "tailText") {
          setTailText(node, self.t(key));
        } else if (mode === "htmlLang") {
          node.setAttribute("lang", LANG_META[self.language].htmlLang);
        } else {
          node.setAttribute(mode, self.t(key));
        }
      });
    });
  };

  function setTailText(node, value) {
    var textNode = null;
    for (var i = node.childNodes.length - 1; i >= 0; i -= 1) {
      if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
        textNode = node.childNodes[i];
        break;
      }
    }
    if (textNode) {
      textNode.nodeValue = " " + value;
    } else {
      node.appendChild(document.createTextNode(" " + value));
    }
  }

  function normalizeLanguage(language) {
    return DICTIONARY[language] ? language : "zh-Hant";
  }

  function interpolate(value, params) {
    params = params || {};
    return value.replace(/\{(\w+)\}/g, function(match, key) {
      return Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match;
    });
  }

  Mancala.I18n = I18n;
})(window);
