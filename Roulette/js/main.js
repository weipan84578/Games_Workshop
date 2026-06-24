(() => {
  "use strict";

  const STORAGE_KEY = "roulette_save_v1";
  const SETTINGS_KEY = "roulette_settings_v1";
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const WHEEL_ORDER_EUROPEAN = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
    13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
    20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];
  const WHEEL_ORDER_AMERICAN = [
    0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
    "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,
  ];
  const CHIP_VALUES = [5, 10, 25, 50, 100, 500, 1000];
  const CHIP_COLORS = ["#d9b23f", "#d96f3f", "#3bb77a", "#4f91d9", "#9f78df", "#dedede", "#f0c15a"];

  const DEFAULT_SETTINGS = {
    language: "zh-TW",
    bgmVolume: 0.6,
    sfxVolume: 0.8,
    bgmEnabled: true,
    sfxEnabled: true,
    theme: "classic",
    animationSpeed: "normal",
    showHistory: true,
    difficulty: "normal",
    wheelType: "european",
    startingBalance: 3000,
  };

  const DIFFICULTY = {
    easy: {
      player: 5000,
      ai: 2000,
      target: 10000,
      aiRatio: 0.05,
      aiDiversity: 1,
      thinkMin: 500,
      thinkMax: 1000,
      labelColor: "easy",
    },
    normal: {
      player: 3000,
      ai: 3000,
      target: 8000,
      aiRatio: 0.08,
      aiDiversity: 3,
      thinkMin: 900,
      thinkMax: 1500,
      labelColor: "normal",
    },
    hard: {
      player: 2000,
      ai: 5000,
      target: 6000,
      aiRatio: 0.12,
      aiDiversity: 5,
      thinkMin: 1500,
      thinkMax: 3000,
      labelColor: "hard",
    },
  };

  const THEME_META = [
    { key: "classic", nameKey: "theme.classic", felt: "#1a5c2e", border: "#8b6914" },
    { key: "royal", nameKey: "theme.royal", felt: "#0d2b5e", border: "#c9a84c" },
    { key: "neon", nameKey: "theme.neon", felt: "#0a0a12", border: "#ff00ff" },
    { key: "rose", nameKey: "theme.rose", felt: "#3d1a24", border: "#e8a598" },
    { key: "midnight", nameKey: "theme.midnight", felt: "#1a0a2e", border: "#9c27b0" },
  ];

  const HELP_TABS = ["goal", "wheel", "bets", "payout", "ai", "controls"];

  const translations = {
    "zh-TW": {
      "menu.kicker": "玩家 vs AI",
      "menu.subtitle": "輪盤遊戲",
      "menu.start": "開始遊戲",
      "menu.continue": "繼續遊戲",
      "menu.help": "說明",
      "menu.settings": "設定",
      "difficulty.easy": "簡單",
      "difficulty.normal": "普通",
      "difficulty.hard": "困難",
      "settings.title": "設定",
      "settings.language": "語言",
      "settings.audio": "音效",
      "settings.bgm": "背景音樂",
      "settings.sfx": "音效",
      "settings.theme": "主題顏色",
      "settings.game": "遊戲",
      "settings.kicker": "偏好設定",
      "settings.save": "儲存設定",
      "settings.wheelType": "輪盤類型",
      "settings.wheelTypeHelp": "歐式輪盤只有 0；美式輪盤多 00，外注勝率較低、風險較高。",
      "settings.animationSpeed": "輪盤動畫速度",
      "settings.animationSpeedHelp": "慢、普通、快只影響轉盤演出時間，不改變中獎機率或派彩。",
      "settings.slow": "慢",
      "settings.normal": "普通",
      "settings.fast": "快",
      "settings.speedSlowDesc": "慢：轉盤演出較久，適合想看完整鋼球滾動效果。",
      "settings.speedNormalDesc": "普通：標準節奏，兼顧演出與等待時間。",
      "settings.speedFastDesc": "快：縮短等待，適合連續下注。",
      "theme.classic": "經典",
      "theme.royal": "皇家",
      "theme.neon": "霓虹",
      "theme.rose": "玫瑰",
      "theme.midnight": "深夜",
      "wheel.european": "歐式輪盤",
      "wheel.american": "美式輪盤",
      "wheel.europeanDesc": "歐式輪盤：0 到 36，共 37 格，沒有 00。",
      "wheel.americanDesc": "美式輪盤：0 到 36 加上 00，共 38 格，莊家優勢較高。",
      "game.spin": "轉動",
      "game.spinning": "轉動中",
      "game.thinking": "AI 思考中",
      "game.clear": "清除",
      "game.save": "存檔",
      "game.menu": "主選單",
      "game.restart": "重新開始",
      "game.balance": "籌碼餘額",
      "game.currentBet": "本輪下注",
      "game.player": "玩家",
      "game.bet": "下注",
      "game.table": "下注桌面板",
      "game.activeBets": "目前下注",
      "game.history": "歷史記錄",
      "game.placeBets": "請先下注",
      "game.result.win": "你贏了",
      "game.result.lose": "本輪失利",
      "game.result.push": "本輪打平",
      "game.round": "第 {round} 輪",
      "game.noBets": "尚未下注",
      "game.insufficient": "籌碼不足",
      "game.saved": "遊戲已存檔",
      "game.noSave": "沒有可讀取的存檔",
      "game.settingsSaved": "設定已儲存",
      "game.storageUnavailable": "瀏覽器本機儲存不可用",
      "game.loaded": "已讀取存檔",
      "game.winTitle": "恭喜獲勝",
      "game.loseTitle": "遊戲結束",
      "game.targetReached": "你達成目標籌碼 {amount}。",
      "game.aiBankrupt": "AI 籌碼歸零，你贏得對局。",
      "game.playerBankrupt": "你的籌碼已用完。",
      "game.net": "淨額 {amount}",
      "game.target": "目標 {amount}",
      "ai.panel": "AI 對手",
      "ai.ready": "等待下注",
      "ai.thinking": "AI 思考中...",
      "ai.hidden": "下注區域：隱藏",
      "ai.reveal": "AI 下注：{bets}",
      "bet.red": "紅",
      "bet.black": "黑",
      "bet.odd": "奇",
      "bet.even": "偶",
      "bet.low": "1-18",
      "bet.high": "19-36",
      "bet.dozen1": "第1打",
      "bet.dozen2": "第2打",
      "bet.dozen3": "第3打",
      "bet.columnTop": "上列",
      "bet.columnMiddle": "中列",
      "bet.columnBottom": "下列",
      "bet.number": "直注 {number}",
      "betType.straight": "直注",
      "betType.redBlack": "紅 / 黑",
      "betType.oddEven": "奇 / 偶",
      "betType.lowHigh": "低 / 高",
      "betType.dozen": "打注",
      "betType.column": "直列",
      "betType.split": "分注",
      "betType.street": "街注",
      "betType.corner": "角注",
      "betType.sixLine": "線注",
      "betType.outside": "外注",
      "help.title": "遊戲說明",
      "help.kicker": "教學指南",
      "help.goal": "遊戲目標",
      "help.wheel": "輪盤介紹",
      "help.bets": "下注類型",
      "help.payout": "賠率計算",
      "help.ai": "AI 對手",
      "help.controls": "操作說明",
      "help.prev": "上一頁",
      "help.next": "下一頁",
      "help.goalBody": "預測鋼球停落的位置，下注並依賠率獲得獎勵。玩家與 AI 同桌競賽，先讓 AI 破產或達到目標籌碼即可獲勝。",
      "help.wheelBody": "歐式輪盤有 0 到 36 共 37 格，美式輪盤多一個 00。0 與 00 為綠色，外注在綠色結果時皆失利。",
      "help.aiBody": "簡單 AI 保守下注；普通 AI 混合外注與打注；困難 AI 會參考近期結果與玩家下注偏好，偶爾採用倍投策略。",
      "help.controlsBody": "先選擇籌碼，再點擊下注桌面板。可在轉動前清除下注；輪盤旋轉期間下注區會鎖定。",
      "help.wheelColors": "紅色、黑色、綠色依標準輪盤規則標示；0 與 00 都是綠色。",
      "help.aiEasy": "簡單：每輪約下注餘額 3-5%，通常只押一種外注。",
      "help.aiNormal": "普通：每輪約下注餘額 5-8%，混合外注、打注或直列。",
      "help.aiHard": "困難：每輪最高約下注餘額 12%，會參考歷史與玩家偏好。",
      "help.controlClear": "清除：轉動前退回目前所有玩家下注。",
      "help.controlSave": "存檔：把目前對局與設定寫入瀏覽器本機儲存。",
      "help.controlTheme": "主題顏色：立即切換五種視覺風格，不影響玩法。",
      "help.settingsReference": "設定項目說明",
      "help.settingSpeed": "慢、普通、快是輪盤動畫速度，只改變等待時間，不改變結果。",
      "help.settingWheel": "歐式輪盤只有 0；美式輪盤多 00，外注命中率較低。",
      "help.coverage": "覆蓋",
      "help.payoutRatio": "賠率",
      "help.winAmount": "贏得",
      "help.probability": "勝率",
    },
    en: {
      "menu.kicker": "Player vs AI",
      "menu.subtitle": "Roulette Game",
      "menu.start": "Start Game",
      "menu.continue": "Continue",
      "menu.help": "Help",
      "menu.settings": "Settings",
      "difficulty.easy": "Easy",
      "difficulty.normal": "Normal",
      "difficulty.hard": "Hard",
      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.audio": "Audio",
      "settings.bgm": "Background Music",
      "settings.sfx": "Sound Effects",
      "settings.theme": "Color Theme",
      "settings.game": "Game",
      "settings.kicker": "Preferences",
      "settings.save": "Save Settings",
      "settings.wheelType": "Wheel Type",
      "settings.wheelTypeHelp": "European uses only 0. American adds 00, which lowers outside-bet odds.",
      "settings.animationSpeed": "Wheel Animation Speed",
      "settings.animationSpeedHelp": "Slow, Normal, and Fast only change spin presentation time. Odds and payouts do not change.",
      "settings.slow": "Slow",
      "settings.normal": "Normal",
      "settings.fast": "Fast",
      "settings.speedSlowDesc": "Slow: longer spin presentation for the full ball-roll effect.",
      "settings.speedNormalDesc": "Normal: balanced timing for regular play.",
      "settings.speedFastDesc": "Fast: shorter wait for repeated betting.",
      "theme.classic": "Classic",
      "theme.royal": "Royal",
      "theme.neon": "Neon",
      "theme.rose": "Rose",
      "theme.midnight": "Midnight",
      "wheel.european": "European Wheel",
      "wheel.american": "American Wheel",
      "wheel.europeanDesc": "European wheel: 0-36, 37 pockets, no 00.",
      "wheel.americanDesc": "American wheel: 0-36 plus 00, 38 pockets, higher house edge.",
      "game.spin": "Spin",
      "game.spinning": "Spinning",
      "game.thinking": "AI Thinking",
      "game.clear": "Clear",
      "game.save": "Save",
      "game.menu": "Main Menu",
      "game.restart": "Restart",
      "game.balance": "Balance",
      "game.currentBet": "Round Bet",
      "game.player": "Player",
      "game.bet": "Place Bet",
      "game.table": "Betting Board",
      "game.activeBets": "Active Bets",
      "game.history": "History",
      "game.placeBets": "Place bets",
      "game.result.win": "You Win",
      "game.result.lose": "You Lose",
      "game.result.push": "Push",
      "game.round": "Round {round}",
      "game.noBets": "No active bets",
      "game.insufficient": "Not enough chips",
      "game.saved": "Game saved",
      "game.noSave": "No saved game found",
      "game.settingsSaved": "Settings saved",
      "game.storageUnavailable": "Browser local storage is unavailable",
      "game.loaded": "Save loaded",
      "game.winTitle": "Victory",
      "game.loseTitle": "Game Over",
      "game.targetReached": "You reached the target balance {amount}.",
      "game.aiBankrupt": "The AI is out of chips. You win.",
      "game.playerBankrupt": "You are out of chips.",
      "game.net": "Net {amount}",
      "game.target": "Target {amount}",
      "ai.panel": "AI Opponent",
      "ai.ready": "Ready",
      "ai.thinking": "AI Thinking...",
      "ai.hidden": "Bets: hidden",
      "ai.reveal": "AI bets: {bets}",
      "bet.red": "Red",
      "bet.black": "Black",
      "bet.odd": "Odd",
      "bet.even": "Even",
      "bet.low": "1-18",
      "bet.high": "19-36",
      "bet.dozen1": "1st 12",
      "bet.dozen2": "2nd 12",
      "bet.dozen3": "3rd 12",
      "bet.columnTop": "Top row",
      "bet.columnMiddle": "Middle row",
      "bet.columnBottom": "Bottom row",
      "bet.number": "Straight {number}",
      "betType.straight": "Straight",
      "betType.redBlack": "Red / Black",
      "betType.oddEven": "Odd / Even",
      "betType.lowHigh": "Low / High",
      "betType.dozen": "Dozen",
      "betType.column": "Column",
      "betType.split": "Split",
      "betType.street": "Street",
      "betType.corner": "Corner",
      "betType.sixLine": "Six Line",
      "betType.outside": "Outside",
      "help.title": "How to Play",
      "help.kicker": "Guide",
      "help.goal": "Goal",
      "help.wheel": "Wheel",
      "help.bets": "Bet Types",
      "help.payout": "Payouts",
      "help.ai": "AI Opponent",
      "help.controls": "Controls",
      "help.prev": "Previous",
      "help.next": "Next",
      "help.goalBody": "Predict where the ball will land, place bets, and collect rewards by payout ratio. Beat the AI by bankrupting it or reaching the target balance.",
      "help.wheelBody": "European roulette has 37 pockets from 0 to 36. American roulette adds 00. Zero pockets are green, and outside bets lose on green.",
      "help.aiBody": "Easy AI bets conservatively. Normal AI mixes outside bets and dozens. Hard AI reads recent history and player patterns, sometimes using martingale pressure.",
      "help.controlsBody": "Choose a chip, then select a betting area. Clear bets before spinning; the board locks while the wheel spins.",
      "help.wheelColors": "Red, black, and green follow standard roulette color mapping. 0 and 00 are both green.",
      "help.aiEasy": "Easy: bets about 3-5% of balance and usually chooses one outside bet.",
      "help.aiNormal": "Normal: bets about 5-8% of balance and mixes outside, dozen, or column bets.",
      "help.aiHard": "Hard: bets up to about 12% of balance and considers history plus player patterns.",
      "help.controlClear": "Clear: refunds every active player bet before the wheel spins.",
      "help.controlSave": "Save: writes the current match and settings to browser local storage.",
      "help.controlTheme": "Color Theme: switches among five visual styles without changing gameplay.",
      "help.settingsReference": "Settings Reference",
      "help.settingSpeed": "Slow, Normal, and Fast are wheel animation speeds. They change wait time, not the result.",
      "help.settingWheel": "European has only 0. American adds 00, which lowers outside-bet hit rates.",
      "help.coverage": "Coverage",
      "help.payoutRatio": "Payout",
      "help.winAmount": "Win",
      "help.probability": "Chance",
    },
    ja: {
      "menu.kicker": "プレイヤー vs AI",
      "menu.subtitle": "ルーレットゲーム",
      "menu.start": "ゲームスタート",
      "menu.continue": "続ける",
      "menu.help": "説明",
      "menu.settings": "設定",
      "difficulty.easy": "簡単",
      "difficulty.normal": "普通",
      "difficulty.hard": "難しい",
      "settings.title": "設定",
      "settings.language": "言語",
      "settings.audio": "音声",
      "settings.bgm": "BGM",
      "settings.sfx": "効果音",
      "settings.theme": "テーマカラー",
      "settings.game": "ゲーム",
      "settings.kicker": "設定",
      "settings.save": "設定を保存",
      "settings.wheelType": "ホイール種類",
      "settings.wheelTypeHelp": "ヨーロピアンは 0 のみ。アメリカンは 00 が追加され、外側ベットの勝率が下がります。",
      "settings.animationSpeed": "ホイール演出速度",
      "settings.animationSpeedHelp": "遅い・普通・速いは演出時間だけを変えます。確率や配当は変わりません。",
      "settings.slow": "遅い",
      "settings.normal": "普通",
      "settings.fast": "速い",
      "settings.speedSlowDesc": "遅い：ボールの動きを長く見られる演出です。",
      "settings.speedNormalDesc": "普通：待ち時間と演出の標準バランスです。",
      "settings.speedFastDesc": "速い：連続プレイ向けに待ち時間を短くします。",
      "theme.classic": "クラシック",
      "theme.royal": "ロイヤル",
      "theme.neon": "ネオン",
      "theme.rose": "ローズ",
      "theme.midnight": "ミッドナイト",
      "wheel.european": "ヨーロピアン",
      "wheel.american": "アメリカン",
      "wheel.europeanDesc": "ヨーロピアン：0 から 36、合計 37 ポケット。00 はありません。",
      "wheel.americanDesc": "アメリカン：0 から 36 に 00 を追加した 38 ポケット。ハウスエッジが高くなります。",
      "game.spin": "スピン",
      "game.spinning": "回転中",
      "game.thinking": "AI考慮中",
      "game.clear": "クリア",
      "game.save": "保存",
      "game.menu": "メニュー",
      "game.restart": "再開",
      "game.balance": "残高",
      "game.currentBet": "今回のベット",
      "game.player": "プレイヤー",
      "game.bet": "ベット",
      "game.table": "ベットボード",
      "game.activeBets": "現在のベット",
      "game.history": "履歴",
      "game.placeBets": "ベットしてください",
      "game.result.win": "勝ちです",
      "game.result.lose": "負けです",
      "game.result.push": "引き分け",
      "game.round": "ラウンド {round}",
      "game.noBets": "ベットがありません",
      "game.insufficient": "チップ不足",
      "game.saved": "保存しました",
      "game.noSave": "保存データがありません",
      "game.settingsSaved": "設定を保存しました",
      "game.storageUnavailable": "ブラウザのローカル保存を使用できません",
      "game.loaded": "保存データを読み込みました",
      "game.winTitle": "勝利",
      "game.loseTitle": "ゲーム終了",
      "game.targetReached": "目標残高 {amount} に到達しました。",
      "game.aiBankrupt": "AI のチップがなくなりました。",
      "game.playerBankrupt": "チップがなくなりました。",
      "game.net": "収支 {amount}",
      "game.target": "目標 {amount}",
      "ai.panel": "AI相手",
      "ai.ready": "待機中",
      "ai.thinking": "AI考慮中...",
      "ai.hidden": "ベット：非表示",
      "ai.reveal": "AIベット：{bets}",
      "bet.red": "赤",
      "bet.black": "黒",
      "bet.odd": "奇数",
      "bet.even": "偶数",
      "bet.low": "1-18",
      "bet.high": "19-36",
      "bet.dozen1": "第1ダズン",
      "bet.dozen2": "第2ダズン",
      "bet.dozen3": "第3ダズン",
      "bet.columnTop": "上段",
      "bet.columnMiddle": "中段",
      "bet.columnBottom": "下段",
      "bet.number": "ストレート {number}",
      "betType.straight": "ストレート",
      "betType.redBlack": "赤 / 黒",
      "betType.oddEven": "奇数 / 偶数",
      "betType.lowHigh": "ロー / ハイ",
      "betType.dozen": "ダズン",
      "betType.column": "コラム",
      "betType.split": "スプリット",
      "betType.street": "ストリート",
      "betType.corner": "コーナー",
      "betType.sixLine": "シックスライン",
      "betType.outside": "外側ベット",
      "help.title": "遊び方",
      "help.kicker": "ガイド",
      "help.goal": "目標",
      "help.wheel": "ルーレット",
      "help.bets": "ベット種類",
      "help.payout": "配当",
      "help.ai": "AI相手",
      "help.controls": "操作",
      "help.prev": "前へ",
      "help.next": "次へ",
      "help.goalBody": "ボールが止まる場所を予測し、ベットして配当を得ます。AIを破産させるか目標残高に到達すると勝利です。",
      "help.wheelBody": "ヨーロピアンは 0 から 36 の 37 ポケット。アメリカンは 00 が追加されます。0/00 は緑で、外側ベットは負けになります。",
      "help.aiBody": "簡単AIは保守的、普通AIは外側とダズンを混ぜ、難しいAIは履歴とプレイヤー傾向を参考にします。",
      "help.controlsBody": "チップを選び、ベットエリアを押します。スピン前にクリアでき、回転中はボードがロックされます。",
      "help.wheelColors": "赤・黒・緑は標準ルーレットの色分けです。0 と 00 はどちらも緑です。",
      "help.aiEasy": "簡単：約 3-5% の残高を賭け、通常は外側ベットを 1 種類だけ選びます。",
      "help.aiNormal": "普通：約 5-8% の残高を賭け、外側・ダズン・コラムを組み合わせます。",
      "help.aiHard": "難しい：最大約 12% の残高を賭け、履歴とプレイヤー傾向を参考にします。",
      "help.controlClear": "クリア：スピン前にプレイヤーの現在ベットをすべて返金します。",
      "help.controlSave": "保存：現在の対局と設定をブラウザのローカル保存に書き込みます。",
      "help.controlTheme": "テーマカラー：ゲーム性を変えずに 5 種類の見た目を切り替えます。",
      "help.settingsReference": "設定項目の説明",
      "help.settingSpeed": "遅い・普通・速いはホイール演出速度です。待ち時間だけが変わり、結果は変わりません。",
      "help.settingWheel": "ヨーロピアンは 0 のみ。アメリカンは 00 が追加され、外側ベットの命中率が下がります。",
      "help.coverage": "範囲",
      "help.payoutRatio": "配当",
      "help.winAmount": "勝利額",
      "help.probability": "確率",
    },
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomPick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function formatMoney(value) {
    const rounded = Math.round(value);
    const sign = rounded < 0 ? "-" : "";
    return `${sign}$${Math.abs(rounded).toLocaleString()}`;
  }

  function getWheelOrder(type) {
    return type === "american" ? WHEEL_ORDER_AMERICAN : WHEEL_ORDER_EUROPEAN;
  }

  function normalizeResult(value) {
    return value === "00" ? "00" : Number(value);
  }

  function getResultColor(value) {
    if (value === "00" || Number(value) === 0) return "green";
    return RED_NUMBERS.includes(Number(value)) ? "red" : "black";
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  const i18n = {
    currentLang: DEFAULT_SETTINGS.language,
    t(key, params = {}) {
      const langTable = translations[this.currentLang] || translations["zh-TW"];
      const fallback = translations["zh-TW"][key] || key;
      let text = langTable[key] || fallback;
      Object.entries(params).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, value);
      });
      return text;
    },
    setLang(lang) {
      this.currentLang = translations[lang] ? lang : "zh-TW";
      document.documentElement.lang = this.currentLang === "zh-TW" ? "zh-Hant" : this.currentLang;
      this.updateDom();
    },
    updateDom() {
      $all("[data-i18n]").forEach((el) => {
        const params = el.dataset.i18nParam ? JSON.parse(el.dataset.i18nParam) : {};
        el.textContent = this.t(el.dataset.i18n, params);
      });
    },
  };

  class ToastNotification {
    constructor(host) {
      this.host = host;
      this.types = {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
      };
    }

    show(message, type = "info", duration = 2400) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.style.setProperty("--toast-color", this.types[type] || this.types.info);
      toast.textContent = message;
      this.host.appendChild(toast);
      window.setTimeout(() => {
        toast.classList.add("removing");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
      }, duration);
    }
  }

  class SettingsManager {
    constructor() {
      this.settings = { ...DEFAULT_SETTINGS };
      this.load();
    }

    load() {
      const raw = safeStorageGet(SETTINGS_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        this.settings = { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }

    save() {
      return safeStorageSet(SETTINGS_KEY, JSON.stringify(this.settings));
    }

    update(key, value) {
      this.settings[key] = value;
      this.apply();
      this.save();
    }

    apply() {
      document.documentElement.dataset.theme = this.settings.theme;
      i18n.setLang(this.settings.language);
    }
  }

  class SaveManager {
    save(settings, gameState) {
      const data = {
        version: "1.0.0",
        savedAt: new Date().toISOString(),
        settings: { ...settings },
        game: structuredCloneSafe(gameState),
      };
      data.game.wheel.isSpinning = false;
      return safeStorageSet(STORAGE_KEY, JSON.stringify(data));
    }

    load() {
      const raw = safeStorageGet(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }

    hasSave() {
      return Boolean(safeStorageGet(STORAGE_KEY));
    }
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createGameState(settings) {
    const difficulty = settings.difficulty;
    const config = DIFFICULTY[difficulty] || DIFFICULTY.normal;
    return {
      gameId: globalThis.crypto && typeof globalThis.crypto.randomUUID === "function" ? globalThis.crypto.randomUUID() : `game-${Date.now()}`,
      difficulty,
      round: 1,
      targetBalance: config.target,
      player: {
        balance: config.player,
        totalBet: 0,
        bets: [],
        winHistory: [],
      },
      ai: {
        balance: config.ai,
        totalBet: 0,
        bets: [],
        strategy: null,
        thinkingDuration: 0,
        winHistory: [],
      },
      wheel: {
        type: settings.wheelType,
        lastResults: [],
        currentResult: null,
        isSpinning: false,
      },
      betHistory: [],
      resultHistory: [],
      settings: { ...settings },
    };
  }

  class AudioManager {
    constructor(settingsManager) {
      this.settingsManager = settingsManager;
      this.audioCtx = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.bgmTimer = null;
      this.bgmStep = 0;
      this.muted = false;
      this.supported = Boolean(window.AudioContext || window.webkitAudioContext);
      document.addEventListener("pointerdown", () => this.ensure(), { once: true });
    }

    ensure() {
      if (!this.supported) return null;
      if (!this.audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new Ctx();
        this.bgmGain = this.audioCtx.createGain();
        this.sfxGain = this.audioCtx.createGain();
        this.bgmGain.connect(this.audioCtx.destination);
        this.sfxGain.connect(this.audioCtx.destination);
        this.applySettings();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      this.startBgm();
      return this.audioCtx;
    }

    applySettings() {
      if (!this.audioCtx) return;
      const { bgmVolume, sfxVolume, bgmEnabled, sfxEnabled } = this.settingsManager.settings;
      const now = this.audioCtx.currentTime;
      const bgmLevel = this.muted || !bgmEnabled ? 0 : bgmVolume * 0.1 * 5;
      const sfxLevel = this.muted || !sfxEnabled ? 0 : sfxVolume;
      this.bgmGain.gain.setTargetAtTime(bgmLevel, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(sfxLevel, now, 0.03);
      if (!bgmEnabled || this.muted) this.stopBgm();
      if (bgmEnabled && !this.muted) this.startBgm();
    }

    setMuted(muted) {
      this.muted = muted;
      this.applySettings();
    }

    startBgm() {
      if (!this.audioCtx || this.bgmTimer || this.muted || !this.settingsManager.settings.bgmEnabled) return;
      const sequence = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
      this.bgmTimer = window.setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state !== "running") return;
        const freq = sequence[this.bgmStep % sequence.length];
        this.playPluck(freq, 0.14, this.bgmGain);
        if (this.bgmStep % 4 === 0) this.playPluck(freq / 2, 0.18, this.bgmGain, "sine");
        this.bgmStep += 1;
      }, 240);
    }

    stopBgm() {
      if (this.bgmTimer) {
        window.clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    playPluck(freq, duration, output, type = "triangle") {
      const ctx = this.audioCtx;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(output);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    }

    tone(freq, duration, type = "sine", volume = 0.3, delay = 0) {
      const ctx = this.ensure();
      if (!ctx || this.muted || !this.settingsManager.settings.sfxEnabled) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.02);
    }

    click() {
      this.tone(1200, 0.08, "sine", 0.25);
    }

    chip() {
      this.tone(659, 0.08, "triangle", 0.22);
      this.tone(880, 0.06, "sine", 0.12, 0.025);
    }

    clear() {
      this.tone(293.66, 0.18, "sawtooth", 0.12);
    }

    spinStart() {
      this.tone(87.31, 0.45, "sawtooth", 0.15);
      this.tone(174.61, 0.35, "triangle", 0.1, 0.08);
    }

    drop() {
      this.tone(987.77, 0.12, "triangle", 0.28);
    }

    win() {
      [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
        this.tone(note, 0.19, "triangle", 0.24, index * 0.12);
      });
    }

    lose() {
      this.tone(196, 0.32, "sawtooth", 0.16);
    }
  }

  class RouletteWheel {
    constructor(canvas, settingsManager) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.settingsManager = settingsManager;
      this.innerAngle = 0;
      this.ballAngle = -Math.PI / 2;
      this.ballRadiusRatio = 0.76;
      this.spinning = false;
      this.order = getWheelOrder(settingsManager.settings.wheelType);
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
    }

    setWheelType(type) {
      this.order = getWheelOrder(type);
      this.draw();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const size = Math.max(260, Math.floor(rect.width || 420));
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.floor(size * dpr);
      this.canvas.height = Math.floor(size * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.size = size;
      this.draw();
    }

    spin(result, speed = "normal") {
      if (this.spinning) return Promise.resolve(result);
      this.spinning = true;
      const durationMap = { slow: 7000, normal: 5400, fast: 3800 };
      const duration = durationMap[speed] || durationMap.normal;
      const start = performance.now();
      const startAngle = this.innerAngle;
      const rotations = 9 + Math.random() * 4;
      const finalAngle = startAngle + rotations * Math.PI * 2;
      const startBall = this.ballAngle;

      return new Promise((resolve) => {
        const step = (now) => {
          const progress = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const wobble = Math.sin(progress * Math.PI * 40) * (1 - progress) * 0.035;
          this.innerAngle = startAngle + (finalAngle - startAngle) * eased;
          this.ballAngle = startBall - rotations * Math.PI * 2 * 1.4 * eased + wobble;
          this.ballRadiusRatio = progress < 0.65 ? 0.83 : lerp(0.83, 0.64, (progress - 0.65) / 0.35);
          this.draw();
          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }
          this.spinning = false;
          this.innerAngle = finalAngle % (Math.PI * 2);
          this.ballAngle = this.angleForResult(result);
          this.ballRadiusRatio = 0.64;
          this.draw(result);
          resolve(result);
        };
        requestAnimationFrame(step);
      });
    }

    angleForResult(result) {
      const index = this.order.findIndex((value) => String(value) === String(result));
      const safeIndex = Math.max(0, index);
      const segment = (Math.PI * 2) / this.order.length;
      return -Math.PI / 2 + this.innerAngle + safeIndex * segment + segment / 2;
    }

    draw(highlightResult = null) {
      if (!this.ctx || !this.size) return;
      const ctx = this.ctx;
      const size = this.size;
      const center = size / 2;
      const outer = size * 0.48;
      const pocketOuter = outer * 0.86;
      const pocketInner = outer * 0.5;
      const colors = getComputedStyle(document.documentElement);
      const wheelBase = colors.getPropertyValue("--color-wheel-base").trim();
      const wheelAccent = colors.getPropertyValue("--color-wheel-accent").trim();
      const red = colors.getPropertyValue("--color-number-red").trim();
      const black = colors.getPropertyValue("--color-number-black").trim();
      const green = colors.getPropertyValue("--color-number-green").trim();
      const border = colors.getPropertyValue("--color-table-border").trim();
      ctx.clearRect(0, 0, size, size);

      const baseGradient = ctx.createRadialGradient(center * 0.8, center * 0.72, outer * 0.1, center, center, outer);
      baseGradient.addColorStop(0, "#f5d985");
      baseGradient.addColorStop(0.22, wheelAccent);
      baseGradient.addColorStop(0.45, wheelBase);
      baseGradient.addColorStop(0.74, border);
      baseGradient.addColorStop(1, "#2b160b");
      ctx.beginPath();
      ctx.arc(center, center, outer, 0, Math.PI * 2);
      ctx.fillStyle = baseGradient;
      ctx.fill();
      ctx.lineWidth = outer * 0.04;
      ctx.strokeStyle = "rgba(255,255,255,0.24)";
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(this.innerAngle);
      const segment = (Math.PI * 2) / this.order.length;
      this.order.forEach((number, index) => {
        const start = -Math.PI / 2 + index * segment;
        const end = start + segment;
        const color = getResultColor(number);
        ctx.beginPath();
        ctx.arc(0, 0, pocketOuter, start, end);
        ctx.arc(0, 0, pocketInner, end, start, true);
        ctx.closePath();
        ctx.fillStyle = color === "green" ? green : color === "red" ? red : black;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const mid = start + segment / 2;
        ctx.save();
        ctx.rotate(mid);
        ctx.translate((pocketOuter + pocketInner) / 2, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#fff7dc";
        ctx.font = `800 ${Math.max(11, size * 0.03)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(number), 0, 0);
        ctx.restore();

        if (highlightResult !== null && String(highlightResult) === String(number)) {
          ctx.beginPath();
          ctx.arc(0, 0, pocketOuter, start, end);
          ctx.arc(0, 0, pocketInner, end, start, true);
          ctx.closePath();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
      ctx.restore();

      ctx.beginPath();
      ctx.arc(center, center, outer * 0.48, 0, Math.PI * 2);
      const innerGradient = ctx.createRadialGradient(center * 0.9, center * 0.82, outer * 0.05, center, center, outer * 0.48);
      innerGradient.addColorStop(0, "#ffe7a4");
      innerGradient.addColorStop(0.42, wheelAccent);
      innerGradient.addColorStop(1, "#5b4215");
      ctx.fillStyle = innerGradient;
      ctx.fill();

      for (let i = 0; i < 12; i += 1) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(this.innerAngle * -0.65 + i * Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(outer * 0.16, outer * 0.05, outer * 0.32, 0);
        ctx.quadraticCurveTo(outer * 0.16, -outer * 0.05, 0, 0);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(center, center, outer * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = wheelBase;
      ctx.fill();
      ctx.strokeStyle = wheelAccent;
      ctx.lineWidth = 3;
      ctx.stroke();

      const ballRadius = Math.max(5, size * 0.018);
      const ballDistance = outer * this.ballRadiusRatio;
      const bx = center + Math.cos(this.ballAngle) * ballDistance;
      const by = center + Math.sin(this.ballAngle) * ballDistance;
      const ballGradient = ctx.createRadialGradient(bx - ballRadius * 0.4, by - ballRadius * 0.45, 1, bx, by, ballRadius * 1.25);
      ballGradient.addColorStop(0, "#ffffff");
      ballGradient.addColorStop(0.45, "#e5e5e5");
      ballGradient.addColorStop(1, "#777777");
      ctx.beginPath();
      ctx.arc(bx, by, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient;
      ctx.fill();
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
  }

  class BettingBoard {
    constructor(root, onBet) {
      this.root = root;
      this.onBet = onBet;
      this.betDefs = new Map();
      this.currentWheelType = "european";
      this.root.addEventListener("click", (event) => {
        const target = event.target.closest("[data-bet-id]");
        if (!target || !this.root.contains(target)) return;
        this.onBet(target.dataset.betId, target);
      });
      this.root.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const target = event.target.closest("[data-bet-id]");
        if (!target) return;
        event.preventDefault();
        this.onBet(target.dataset.betId, target);
      });
    }

    buildDefs(wheelType) {
      const defs = [];
      const numbers = Array.from({ length: 36 }, (_, index) => index + 1);
      const topRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
      const middleRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
      const bottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
      const redNumbers = numbers.filter((number) => getResultColor(number) === "red");
      const blackNumbers = numbers.filter((number) => getResultColor(number) === "black");
      const add = (def) => defs.push(def);

      add({ id: "number:0", type: "number", label: "0", covers: [0], payout: 35 });
      if (wheelType === "american") add({ id: "number:00", type: "number", label: "00", covers: ["00"], payout: 35 });
      numbers.forEach((number) => {
        add({ id: `number:${number}`, type: "number", label: i18n.t("bet.number", { number }), covers: [number], payout: 35 });
      });
      add({ id: "column:top", type: "column", label: i18n.t("bet.columnTop"), covers: topRow, payout: 2 });
      add({ id: "column:middle", type: "column", label: i18n.t("bet.columnMiddle"), covers: middleRow, payout: 2 });
      add({ id: "column:bottom", type: "column", label: i18n.t("bet.columnBottom"), covers: bottomRow, payout: 2 });
      add({ id: "dozen:1", type: "dozen", label: i18n.t("bet.dozen1"), covers: numbers.slice(0, 12), payout: 2 });
      add({ id: "dozen:2", type: "dozen", label: i18n.t("bet.dozen2"), covers: numbers.slice(12, 24), payout: 2 });
      add({ id: "dozen:3", type: "dozen", label: i18n.t("bet.dozen3"), covers: numbers.slice(24, 36), payout: 2 });
      add({ id: "outside:low", type: "outside", label: i18n.t("bet.low"), covers: numbers.slice(0, 18), payout: 1 });
      add({ id: "outside:even", type: "outside", label: i18n.t("bet.even"), covers: numbers.filter((number) => number % 2 === 0), payout: 1 });
      add({ id: "outside:red", type: "outside", label: i18n.t("bet.red"), covers: redNumbers, payout: 1 });
      add({ id: "outside:black", type: "outside", label: i18n.t("bet.black"), covers: blackNumbers, payout: 1 });
      add({ id: "outside:odd", type: "outside", label: i18n.t("bet.odd"), covers: numbers.filter((number) => number % 2 === 1), payout: 1 });
      add({ id: "outside:high", type: "outside", label: i18n.t("bet.high"), covers: numbers.slice(18, 36), payout: 1 });

      this.betDefs = new Map(defs.map((def) => [def.id, def]));
      return defs;
    }

    getDef(id) {
      return this.betDefs.get(id);
    }

    render({ wheelType, bets = [], result = null, locked = false }) {
      this.currentWheelType = wheelType;
      this.buildDefs(wheelType);
      this.root.classList.toggle("locked", locked);
      const W = 74;
      const H = 58;
      const left = 86;
      const top = 22;
      const rightW = 64;
      const zeroW = 66;
      const boardW = left + W * 12 + rightW + 22;
      const boardH = top + H * 5 + 32;
      const rowMap = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
      ];
      const cells = [];
      const addCell = (id, x, y, w, h, label, fill, subLabel = "") => {
        const def = this.betDefs.get(id);
        const winning = result !== null && def && covers(def, result);
        cells.push({ id, x, y, w, h, label, fill, subLabel, winning });
      };

      if (wheelType === "american") {
        addCell("number:0", 14, top, zeroW, H * 1.5, "0", "green");
        addCell("number:00", 14, top + H * 1.5, zeroW, H * 1.5, "00", "green");
      } else {
        addCell("number:0", 14, top, zeroW, H * 3, "0", "green");
      }

      rowMap.forEach((row, rowIndex) => {
        row.forEach((number, colIndex) => {
          addCell(`number:${number}`, left + colIndex * W, top + rowIndex * H, W, H, String(number), getResultColor(number));
        });
      });

      const rightX = left + W * 12;
      addCell("column:top", rightX, top, rightW, H, "2:1", "outside", i18n.t("bet.columnTop"));
      addCell("column:middle", rightX, top + H, rightW, H, "2:1", "outside", i18n.t("bet.columnMiddle"));
      addCell("column:bottom", rightX, top + H * 2, rightW, H, "2:1", "outside", i18n.t("bet.columnBottom"));

      const dozenY = top + H * 3;
      addCell("dozen:1", left, dozenY, W * 4, H, "1st 12", "outside");
      addCell("dozen:2", left + W * 4, dozenY, W * 4, H, "2nd 12", "outside");
      addCell("dozen:3", left + W * 8, dozenY, W * 4, H, "3rd 12", "outside");

      const outsideY = dozenY + H;
      [
        ["outside:low", "1-18", "outside"],
        ["outside:even", i18n.t("bet.even"), "outside"],
        ["outside:red", i18n.t("bet.red"), "red"],
        ["outside:black", i18n.t("bet.black"), "black"],
        ["outside:odd", i18n.t("bet.odd"), "outside"],
        ["outside:high", "19-36", "outside"],
      ].forEach(([id, label, fill], index) => {
        addCell(id, left + index * W * 2, outsideY, W * 2, H, label, fill);
      });

      const chips = new Map();
      bets.forEach((bet) => {
        chips.set(bet.id, (chips.get(bet.id) || 0) + bet.amount);
      });

      const cellMarkup = cells.map((cell) => this.cellMarkup(cell, chips.get(cell.id) || 0)).join("");
      this.root.innerHTML = `
        <svg class="roulette-table-svg" viewBox="0 0 ${boardW} ${boardH}" role="group" aria-label="Roulette betting table">
          <rect x="0" y="0" width="${boardW}" height="${boardH}" rx="14" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.2)" />
          ${cellMarkup}
        </svg>
      `;
    }

    cellMarkup(cell, chipAmount) {
      const fillMap = {
        red: "var(--color-number-red)",
        black: "var(--color-number-black)",
        green: "var(--color-number-green)",
        outside: "rgba(0,0,0,0.28)",
      };
      const centerX = cell.x + cell.w / 2;
      const centerY = cell.y + cell.h / 2;
      const chip = chipAmount > 0 ? `
        <g class="chip-token" transform="translate(${centerX + cell.w * 0.24}, ${centerY - cell.h * 0.2})">
          <circle r="18"></circle>
          <text text-anchor="middle" dominant-baseline="middle">${formatCompact(chipAmount)}</text>
        </g>
      ` : "";
      return `
        <g class="bet-cell fill-${cell.fill} ${cell.winning ? "winning" : ""}" data-bet-id="${cell.id}" tabindex="0" role="button" aria-label="${cell.label}">
          <rect x="${cell.x}" y="${cell.y}" width="${cell.w}" height="${cell.h}" rx="4" fill="${fillMap[cell.fill] || fillMap.outside}"></rect>
          <text x="${centerX}" y="${centerY - (cell.subLabel ? 7 : 0)}" text-anchor="middle" dominant-baseline="middle">${cell.label}</text>
          ${cell.subLabel ? `<text class="sub-label" x="${centerX}" y="${centerY + 15}" text-anchor="middle" dominant-baseline="middle">${cell.subLabel}</text>` : ""}
          ${chip}
        </g>
      `;
    }
  }

  function formatCompact(value) {
    if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
    return String(value);
  }

  function covers(def, result) {
    const normalized = normalizeResult(result);
    return def.covers.some((item) => String(item) === String(normalized));
  }

  class AIPlayer {
    decideBets(state, board) {
      const config = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
      const balance = state.ai.balance;
      const maxBudget = Math.max(5, Math.floor(balance * config.aiRatio / 5) * 5);
      const budget = Math.min(balance, maxBudget);
      if (budget < 5) return [];
      const defs = board.betDefs;
      const bets = [];
      const addBet = (id) => {
        const def = defs.get(id);
        if (def && !bets.some((bet) => bet.id === id)) bets.push(def);
      };

      if (state.difficulty === "easy") {
        addBet(randomPick(["outside:red", "outside:black", "outside:odd", "outside:even", "outside:low", "outside:high"]));
      } else if (state.difficulty === "normal") {
        addBet(this.pickOuterByHistory(state));
        if (Math.random() < 0.55) addBet(randomPick(["dozen:1", "dozen:2", "dozen:3"]));
        if (Math.random() < 0.25) addBet(randomPick(["column:top", "column:middle", "column:bottom"]));
        if (Math.random() < 0.1 && state.player.bets[0]) addBet(state.player.bets[0].id);
      } else {
        addBet(this.pickOuterByHistory(state));
        addBet(randomPick(["dozen:1", "dozen:2", "dozen:3"]));
        addBet(randomPick(["column:top", "column:middle", "column:bottom"]));
        const hot = this.hotNumber(state);
        if (hot !== null) addBet(`number:${hot}`);
        if (Math.random() < 0.25 && state.player.bets[0]) addBet(state.player.bets[0].id);
      }

      const diversity = clamp(config.aiDiversity, 1, bets.length || 1);
      const selected = bets.slice(0, diversity);
      const lastNet = state.ai.winHistory[0] || 0;
      const martingale = state.difficulty === "hard" && lastNet < 0 && Math.random() < 0.3 ? 2 : 1;
      const perBet = Math.max(5, Math.floor((budget * martingale) / selected.length / 5) * 5);
      let spent = 0;
      return selected.map((def) => {
        const amount = Math.min(perBet, balance - spent);
        spent += amount;
        return createBet(def, amount);
      }).filter((bet) => bet.amount >= 5);
    }

    pickOuterByHistory(state) {
      const recent = state.wheel.lastResults.slice(0, 5).filter((value) => value !== 0 && value !== "00");
      if (recent.length < 3 || Math.random() > 0.45) {
        return randomPick(["outside:red", "outside:black", "outside:odd", "outside:even", "outside:low", "outside:high"]);
      }
      const redCount = recent.filter((value) => getResultColor(value) === "red").length;
      const oddCount = recent.filter((value) => Number(value) % 2 === 1).length;
      if (redCount >= 3) return "outside:black";
      if (redCount <= 1) return "outside:red";
      if (oddCount >= 3) return "outside:even";
      return "outside:odd";
    }

    hotNumber(state) {
      const counts = new Map();
      state.wheel.lastResults.slice(0, 10).forEach((value) => {
        if (value === "00") return;
        const number = Number(value);
        counts.set(number, (counts.get(number) || 0) + 1);
      });
      let hot = null;
      let count = 0;
      counts.forEach((value, key) => {
        if (value > count) {
          count = value;
          hot = key;
        }
      });
      return hot ?? Math.floor(Math.random() * 37);
    }
  }

  function createBet(def, amount) {
    return {
      id: def.id,
      type: def.type,
      label: def.label,
      covers: [...def.covers],
      payout: def.payout,
      amount,
    };
  }

  function calculateSettlement(bets, result) {
    return bets.reduce((summary, bet) => {
      summary.totalBet += bet.amount;
      if (covers(bet, result)) {
        summary.gross += bet.amount * (bet.payout + 1);
        summary.winningBets.push(bet);
      }
      return summary;
    }, { totalBet: 0, gross: 0, winningBets: [] });
  }

  class ParticleController {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.running = false;
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.floor(window.innerWidth * dpr);
      this.canvas.height = Math.floor(window.innerHeight * dpr);
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
      const colors = ["#ffd700", "#ffa500", "#ff6b6b", "#4caf50", "#ffffff"];
      for (let i = 0; i < 48; i += 1) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 9 - 3,
          size: Math.random() * 7 + 3,
          color: randomPick(colors),
          life: 1,
          decay: 0.018 + Math.random() * 0.025,
        });
      }
      if (!this.running) this.animate();
    }

    animate() {
      this.running = true;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.particles = this.particles.filter((particle) => particle.life > 0);
      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.28;
        particle.life -= particle.decay;
        this.ctx.globalAlpha = Math.max(0, particle.life);
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1;
      if (this.particles.length) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.running = false;
      }
    }
  }

  class GameApp {
    constructor() {
      this.settingsManager = new SettingsManager();
      this.saveManager = new SaveManager();
      this.toast = new ToastNotification($("#toastHost"));
      this.audio = new AudioManager(this.settingsManager);
      this.particles = new ParticleController($("#particleCanvas"));
      this.wheel = new RouletteWheel($("#wheelCanvas"), this.settingsManager);
      this.ai = new AIPlayer();
      this.board = new BettingBoard($("#bettingBoard"), (id, target) => this.placeBet(id, target));
      this.state = createGameState(this.settingsManager.settings);
      this.selectedChip = 25;
      this.activeScreen = "menu";
      this.previousScreen = "menu";
      this.helpTab = "goal";
      this.lastResult = null;
      this.cacheDom();
      this.bindEvents();
      this.settingsManager.apply();
      this.renderAll();
    }

    cacheDom() {
      this.els = {
        screens: {
          menu: $("#menuScreen"),
          game: $("#gameScreen"),
          settings: $("#settingsScreen"),
          help: $("#helpScreen"),
        },
        languageSelect: $("#languageSelect"),
        quickMuteBtn: $("#quickMuteBtn"),
        quickMuteIcon: $("#quickMuteIcon"),
        startGameBtn: $("#startGameBtn"),
        continueGameBtn: $("#continueGameBtn"),
        openHelpBtn: $("#openHelpBtn"),
        openSettingsBtn: $("#openSettingsBtn"),
        backToMenuBtn: $("#backToMenuBtn"),
        settingsFromGameBtn: $("#settingsFromGameBtn"),
        soundFromGameBtn: $("#soundFromGameBtn"),
        saveGameBtn: $("#saveGameBtn"),
        roundLabel: $("#roundLabel"),
        aiDifficultyBadge: $("#aiDifficultyBadge"),
        aiBalance: $("#aiBalance"),
        aiBetTotal: $("#aiBetTotal"),
        aiThinkingLabel: $("#aiThinkingLabel"),
        aiThinkingBar: $("#aiThinkingBar"),
        aiReveal: $("#aiReveal"),
        targetBadge: $("#targetBadge"),
        playerBalance: $("#playerBalance"),
        playerBetTotal: $("#playerBetTotal"),
        resultNumber: $("#resultNumber"),
        resultText: $("#resultText"),
        resultDisplay: $("#resultDisplay"),
        selectedChipLabel: $("#selectedChipLabel"),
        wheelTypeLabel: $("#wheelTypeLabel"),
        activeBetCount: $("#activeBetCount"),
        activeBetList: $("#activeBetList"),
        historyList: $("#historyList"),
        chipRack: $("#chipRack"),
        clearBetsBtn: $("#clearBetsBtn"),
        spinBtn: $("#spinBtn"),
        bgmEnabledInput: $("#bgmEnabledInput"),
        sfxEnabledInput: $("#sfxEnabledInput"),
        bgmVolumeInput: $("#bgmVolumeInput"),
        sfxVolumeInput: $("#sfxVolumeInput"),
        bgmVolumeLabel: $("#bgmVolumeLabel"),
        sfxVolumeLabel: $("#sfxVolumeLabel"),
        themeGrid: $("#themeGrid"),
        saveSettingsBtn: $("#saveSettingsBtn"),
        helpTabs: $("#helpTabs"),
        helpContent: $("#helpContent"),
        helpPrevBtn: $("#helpPrevBtn"),
        helpNextBtn: $("#helpNextBtn"),
        endDialog: $("#endDialog"),
        endTitle: $("#endTitle"),
        endMessage: $("#endMessage"),
        endMenuBtn: $("#endMenuBtn"),
        endRestartBtn: $("#endRestartBtn"),
      };
    }

    bindEvents() {
      document.addEventListener("click", (event) => {
        const clickable = event.target.closest("button");
        if (clickable) this.audio.click();
      });
      this.els.startGameBtn.addEventListener("click", () => this.newGame());
      this.els.continueGameBtn.addEventListener("click", () => this.continueGame());
      this.els.openHelpBtn.addEventListener("click", () => this.route("help"));
      this.els.openSettingsBtn.addEventListener("click", () => this.route("settings"));
      this.els.backToMenuBtn.addEventListener("click", () => {
        this.saveGame(false);
        this.route("menu");
      });
      this.els.settingsFromGameBtn.addEventListener("click", () => this.route("settings"));
      this.els.soundFromGameBtn.addEventListener("click", () => this.toggleMute());
      this.els.quickMuteBtn.addEventListener("click", () => this.toggleMute());
      this.els.saveGameBtn.addEventListener("click", () => this.saveGame(true));
      this.els.clearBetsBtn.addEventListener("click", () => this.clearBets());
      this.els.spinBtn.addEventListener("click", () => this.spinRound());
      this.els.languageSelect.addEventListener("change", (event) => this.updateSetting("language", event.target.value));
      this.els.saveSettingsBtn.addEventListener("click", () => {
        this.settingsManager.save();
        this.toast.show(i18n.t("game.settingsSaved"), "success");
      });
      $all("[data-route-back]").forEach((button) => button.addEventListener("click", () => this.route(this.previousScreen || "menu")));
      document.addEventListener("change", (event) => {
        if (event.target === this.els.bgmEnabledInput) this.updateSetting("bgmEnabled", event.target.checked);
        if (event.target === this.els.sfxEnabledInput) this.updateSetting("sfxEnabled", event.target.checked);
        if (event.target === this.els.bgmVolumeInput) this.updateSetting("bgmVolume", Number(event.target.value) / 100);
        if (event.target === this.els.sfxVolumeInput) this.updateSetting("sfxVolume", Number(event.target.value) / 100);
      });
      document.addEventListener("input", (event) => {
        if (event.target === this.els.bgmVolumeInput) this.updateSetting("bgmVolume", Number(event.target.value) / 100);
        if (event.target === this.els.sfxVolumeInput) this.updateSetting("sfxVolume", Number(event.target.value) / 100);
      });
      document.addEventListener("click", (event) => {
        const settingButton = event.target.closest("[data-setting]");
        if (!settingButton) return;
        this.updateSetting(settingButton.dataset.setting, settingButton.dataset.value);
      });
      this.els.helpTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-tab]");
        if (!button) return;
        this.helpTab = button.dataset.tab;
        this.renderHelp();
      });
      this.els.helpPrevBtn.addEventListener("click", () => this.shiftHelp(-1));
      this.els.helpNextBtn.addEventListener("click", () => this.shiftHelp(1));
      this.els.endMenuBtn.addEventListener("click", () => {
        this.hideEndDialog();
        this.route("menu");
      });
      this.els.endRestartBtn.addEventListener("click", () => {
        this.hideEndDialog();
        this.newGame();
      });
    }

    route(screenName) {
      if (!this.els.screens[screenName]) return;
      if (screenName !== this.activeScreen) {
        this.previousScreen = this.activeScreen;
        this.activeScreen = screenName;
      }
      Object.entries(this.els.screens).forEach(([name, screen]) => {
        screen.classList.toggle("active", name === screenName);
      });
      if (screenName === "help") this.renderHelp();
      if (screenName === "settings") this.renderSettings();
    }

    newGame() {
      this.state = createGameState(this.settingsManager.settings);
      this.lastResult = null;
      this.els.resultNumber.textContent = "--";
      this.els.resultText.textContent = i18n.t("game.placeBets");
      this.els.resultNumber.className = "";
      this.els.resultDisplay.classList.remove("win", "result-red", "result-black", "result-green");
      this.els.aiReveal.textContent = i18n.t("ai.hidden");
      this.wheel.setWheelType(this.state.wheel.type);
      this.route("game");
      this.renderAll();
      this.saveGame(false);
    }

    continueGame() {
      const save = this.saveManager.load();
      if (!save || !save.game) {
        this.toast.show(i18n.t("game.noSave"), "warning");
        return;
      }
      this.settingsManager.settings = { ...DEFAULT_SETTINGS, ...save.settings };
      this.settingsManager.apply();
      this.state = { ...createGameState(this.settingsManager.settings), ...save.game };
      this.state.wheel.isSpinning = false;
      this.lastResult = this.state.wheel.currentResult;
      this.wheel.setWheelType(this.state.wheel.type);
      this.route("game");
      this.renderAll();
      this.toast.show(i18n.t("game.loaded"), "success");
    }

    saveGame(showToast) {
      const saved = this.saveManager.save(this.settingsManager.settings, this.state);
      if (showToast) this.toast.show(saved ? i18n.t("game.saved") : i18n.t("game.storageUnavailable"), saved ? "success" : "warning");
    }

    updateSetting(key, value) {
      if (key === "bgmVolume" || key === "sfxVolume") value = clamp(Number(value), 0, 1);
      if (key === "difficulty" && !DIFFICULTY[value]) return;
      if (key === "wheelType" && !["european", "american"].includes(value)) return;
      this.settingsManager.update(key, value);
      if (key === "language") this.els.languageSelect.value = value;
      if (key === "wheelType") {
        this.state.wheel.type = value;
        this.wheel.setWheelType(value);
      }
      if (key === "difficulty") {
        this.state.difficulty = value;
      }
      this.audio.applySettings();
      this.renderAll();
    }

    toggleMute() {
      this.audio.setMuted(!this.audio.muted);
      this.renderSoundButtons();
    }

    renderAll() {
      i18n.updateDom();
      this.renderSettings();
      this.renderChips();
      this.renderGame();
      this.renderHelp();
      this.renderSoundButtons();
      this.els.continueGameBtn.disabled = !this.saveManager.hasSave();
    }

    renderSettings() {
      const settings = this.settingsManager.settings;
      this.els.languageSelect.value = settings.language;
      this.els.bgmEnabledInput.checked = settings.bgmEnabled;
      this.els.sfxEnabledInput.checked = settings.sfxEnabled;
      this.els.bgmVolumeInput.value = Math.round(settings.bgmVolume * 100);
      this.els.sfxVolumeInput.value = Math.round(settings.sfxVolume * 100);
      this.els.bgmVolumeLabel.textContent = `${Math.round(settings.bgmVolume * 100)}%`;
      this.els.sfxVolumeLabel.textContent = `${Math.round(settings.sfxVolume * 100)}%`;

      $all("[data-setting]").forEach((button) => {
        const key = button.dataset.setting;
        const isActive = String(settings[key]) === String(button.dataset.value);
        button.classList.toggle("active", isActive);
        if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", String(isActive));
      });

      this.els.themeGrid.innerHTML = THEME_META.map((theme) => `
        <button class="theme-card ${settings.theme === theme.key ? "active" : ""}" type="button" data-setting="theme" data-value="${theme.key}"
          style="background: linear-gradient(135deg, ${theme.felt} 0 58%, ${theme.border} 59% 100%)">
          ${i18n.t(theme.nameKey)}
        </button>
      `).join("");
    }

    renderSoundButtons() {
      const label = this.audio.muted ? "×" : "♪";
      this.els.quickMuteIcon.textContent = label;
      $("#soundFromGameBtn span").textContent = label;
    }

    renderChips() {
      this.els.chipRack.innerHTML = CHIP_VALUES.map((value, index) => `
        <button class="chip ${this.selectedChip === value ? "active" : ""}" type="button" data-chip="${value}" style="--chip-color:${CHIP_COLORS[index]}">
          $${value}
        </button>
      `).join("");
      $all("[data-chip]", this.els.chipRack).forEach((button) => {
        button.addEventListener("click", () => {
          this.selectedChip = Number(button.dataset.chip);
          this.renderChips();
          this.renderGame();
        });
      });
    }

    renderGame() {
      const state = this.state;
      const difficultyText = i18n.t(`difficulty.${state.difficulty}`);
      const config = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
      state.player.totalBet = sumBets(state.player.bets);
      state.ai.totalBet = sumBets(state.ai.bets);
      this.els.roundLabel.textContent = i18n.t("game.round", { round: state.round });
      this.els.aiDifficultyBadge.textContent = difficultyText;
      this.els.aiDifficultyBadge.className = `badge ${config.labelColor}`;
      this.els.targetBadge.textContent = i18n.t("game.target", { amount: formatMoney(state.targetBalance) });
      this.els.aiBalance.textContent = formatMoney(state.ai.balance);
      this.els.aiBetTotal.textContent = formatMoney(state.ai.totalBet);
      this.els.playerBalance.textContent = formatMoney(state.player.balance);
      this.els.playerBetTotal.textContent = formatMoney(state.player.totalBet);
      this.els.selectedChipLabel.textContent = `$${this.selectedChip}`;
      this.els.wheelTypeLabel.textContent = i18n.t(state.wheel.type === "american" ? "wheel.american" : "wheel.european");
      this.els.activeBetCount.textContent = String(state.player.bets.length);
      this.renderActiveBets();
      this.renderHistory();
      this.board.render({
        wheelType: state.wheel.type,
        bets: state.player.bets,
        result: state.wheel.currentResult,
        locked: state.wheel.isSpinning,
      });
      this.els.clearBetsBtn.disabled = state.wheel.isSpinning || state.player.bets.length === 0;
      this.els.spinBtn.disabled = state.wheel.isSpinning || state.player.bets.length === 0;
      this.els.spinBtn.textContent = state.wheel.isSpinning ? i18n.t("game.spinning") : i18n.t("game.spin");
    }

    renderActiveBets() {
      if (!this.state.player.bets.length) {
        this.els.activeBetList.innerHTML = `<span class="bet-pill">${i18n.t("game.noBets")}</span>`;
        return;
      }
      this.els.activeBetList.innerHTML = this.state.player.bets.map((bet) => `
        <span class="bet-pill"><strong>${bet.label}</strong>${formatMoney(bet.amount)}</span>
      `).join("");
    }

    renderHistory() {
      const results = this.state.wheel.lastResults.slice(0, 30);
      this.els.historyList.innerHTML = results.map((result) => `
        <span class="history-ball ${getResultColor(result)}">${result}</span>
      `).join("");
    }

    placeBet(betId, targetEl) {
      if (this.state.wheel.isSpinning) return;
      const def = this.board.getDef(betId);
      if (!def) return;
      if (this.state.player.balance < this.selectedChip) {
        this.toast.show(i18n.t("game.insufficient"), "warning");
        return;
      }
      this.state.player.balance -= this.selectedChip;
      const existing = this.state.player.bets.find((bet) => bet.id === betId);
      if (existing) {
        existing.amount += this.selectedChip;
      } else {
        this.state.player.bets.push(createBet(def, this.selectedChip));
      }
      this.state.betHistory.unshift({ id: betId, type: def.type, amount: this.selectedChip });
      this.state.wheel.currentResult = null;
      this.audio.chip();
      this.animateChip(targetEl);
      this.renderGame();
      this.saveGame(false);
    }

    animateChip(targetEl) {
      const activeChip = $(`[data-chip="${this.selectedChip}"]`, this.els.chipRack);
      if (!activeChip || !targetEl) return;
      const from = activeChip.getBoundingClientRect();
      const to = targetEl.getBoundingClientRect();
      const chip = document.createElement("div");
      chip.className = "chip-fly";
      chip.textContent = `$${this.selectedChip}`;
      chip.style.left = `${from.left}px`;
      chip.style.top = `${from.top}px`;
      chip.style.width = `${from.width}px`;
      chip.style.height = `${from.height}px`;
      document.body.appendChild(chip);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      requestAnimationFrame(() => {
        chip.style.transform = `translate(${dx}px, ${dy}px) scale(0.72)`;
        chip.style.opacity = "0.35";
      });
      window.setTimeout(() => chip.remove(), 360);
    }

    clearBets() {
      if (this.state.wheel.isSpinning || !this.state.player.bets.length) return;
      const refund = sumBets(this.state.player.bets);
      this.state.player.balance += refund;
      this.state.player.bets = [];
      this.state.player.totalBet = 0;
      this.audio.clear();
      this.toast.show(`${i18n.t("game.clear")} ${formatMoney(refund)}`, "info");
      this.renderGame();
      this.saveGame(false);
    }

    async spinRound() {
      if (this.state.wheel.isSpinning) return;
      if (!this.state.player.bets.length) {
        this.toast.show(i18n.t("game.noBets"), "warning");
        return;
      }
      this.state.wheel.isSpinning = true;
      this.state.ai.bets = [];
      this.state.ai.totalBet = 0;
      this.els.aiReveal.textContent = i18n.t("ai.hidden");
      this.renderGame();

      await this.runAiThinking();
      this.board.buildDefs(this.state.wheel.type);
      const aiBets = this.ai.decideBets(this.state, this.board);
      let aiSpent = 0;
      aiBets.forEach((bet) => {
        if (this.state.ai.balance >= bet.amount) {
          this.state.ai.balance -= bet.amount;
          aiSpent += bet.amount;
          this.state.ai.bets.push(bet);
        }
      });
      this.state.ai.totalBet = aiSpent;
      this.renderGame();

      const result = randomPick(getWheelOrder(this.state.wheel.type));
      this.audio.spinStart();
      await this.wheel.spin(result, this.settingsManager.settings.animationSpeed);
      this.audio.drop();
      this.settle(result);
    }

    runAiThinking() {
      const config = DIFFICULTY[this.state.difficulty] || DIFFICULTY.normal;
      const duration = config.thinkMin + Math.random() * (config.thinkMax - config.thinkMin);
      this.state.ai.thinkingDuration = duration;
      this.els.aiThinkingLabel.textContent = i18n.t("ai.thinking");
      this.els.spinBtn.textContent = i18n.t("game.thinking");
      this.els.spinBtn.disabled = true;
      const startedAt = performance.now();
      return new Promise((resolve) => {
        const tick = (now) => {
          const progress = clamp((now - startedAt) / duration, 0, 1);
          this.els.aiThinkingBar.style.width = `${Math.round(progress * 100)}%`;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            this.els.aiThinkingBar.style.width = "100%";
            window.setTimeout(() => resolve(), 120);
          }
        };
        requestAnimationFrame(tick);
      });
    }

    settle(result) {
      const state = this.state;
      const playerSettlement = calculateSettlement(state.player.bets, result);
      const aiSettlement = calculateSettlement(state.ai.bets, result);
      state.player.balance += playerSettlement.gross;
      state.ai.balance += aiSettlement.gross;
      const playerNet = playerSettlement.gross - playerSettlement.totalBet;
      const aiNet = aiSettlement.gross - aiSettlement.totalBet;
      state.player.winHistory.unshift(playerNet);
      state.ai.winHistory.unshift(aiNet);
      state.player.winHistory = state.player.winHistory.slice(0, 30);
      state.ai.winHistory = state.ai.winHistory.slice(0, 30);
      state.wheel.currentResult = result;
      state.wheel.lastResults.unshift(result);
      state.wheel.lastResults = state.wheel.lastResults.slice(0, 30);
      state.resultHistory.unshift(result);
      state.resultHistory = state.resultHistory.slice(0, 30);

      const color = getResultColor(result);
      this.els.resultNumber.textContent = String(result);
      this.els.resultNumber.className = color;
      this.els.resultText.textContent = i18n.t(playerNet > 0 ? "game.result.win" : playerNet < 0 ? "game.result.lose" : "game.result.push");
      this.els.resultDisplay.classList.remove("win", "result-red", "result-black", "result-green");
      this.els.resultDisplay.classList.add(`result-${color}`);
      requestAnimationFrame(() => this.els.resultDisplay.classList.add("win"));

      const aiDetails = state.ai.bets.length
        ? state.ai.bets.map((bet) => `${bet.label} ${formatMoney(bet.amount)}`).join(" / ")
        : i18n.t("game.noBets");
      this.els.aiReveal.textContent = i18n.t("ai.reveal", { bets: aiDetails });

      if (playerNet > 0) {
        this.audio.win();
        this.particles.burst(window.innerWidth * 0.5, window.innerHeight * 0.45);
        this.toast.show(`${i18n.t("game.result.win")} ${i18n.t("game.net", { amount: formatMoney(playerNet) })}`, "success");
      } else if (playerNet < 0) {
        this.audio.lose();
        this.toast.show(`${i18n.t("game.result.lose")} ${i18n.t("game.net", { amount: formatMoney(playerNet) })}`, "warning");
      } else {
        this.toast.show(i18n.t("game.result.push"), "info");
      }

      state.player.bets = [];
      state.ai.bets = [];
      state.player.totalBet = 0;
      state.ai.totalBet = 0;
      state.round += 1;
      state.wheel.isSpinning = false;
      this.els.aiThinkingLabel.textContent = i18n.t("ai.ready");
      this.els.aiThinkingBar.style.width = "0%";
      this.renderGame();
      this.saveGame(false);
      this.checkEndConditions();
    }

    checkEndConditions() {
      if (this.state.player.balance >= this.state.targetBalance) {
        this.showEndDialog(i18n.t("game.winTitle"), i18n.t("game.targetReached", { amount: formatMoney(this.state.targetBalance) }));
      } else if (this.state.ai.balance < 5) {
        this.showEndDialog(i18n.t("game.winTitle"), i18n.t("game.aiBankrupt"));
      } else if (this.state.player.balance < 5) {
        this.showEndDialog(i18n.t("game.loseTitle"), i18n.t("game.playerBankrupt"));
      }
    }

    showEndDialog(title, message) {
      this.els.endTitle.textContent = title;
      this.els.endMessage.textContent = message;
      this.els.endDialog.classList.remove("hidden");
    }

    hideEndDialog() {
      this.els.endDialog.classList.add("hidden");
    }

    shiftHelp(direction) {
      const index = HELP_TABS.indexOf(this.helpTab);
      const next = (index + direction + HELP_TABS.length) % HELP_TABS.length;
      this.helpTab = HELP_TABS[next];
      this.renderHelp();
    }

    renderHelp() {
      $all("[data-tab]", this.els.helpTabs).forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === this.helpTab);
      });
      const content = {
        goal: this.helpGoal(),
        wheel: this.helpWheel(),
        bets: this.helpBets(),
        payout: this.helpPayout(),
        ai: this.helpAi(),
        controls: this.helpControls(),
      }[this.helpTab];
      this.els.helpContent.innerHTML = content;
      this.bindCalculator();
    }

    miniWheelSvg() {
      return `
        <svg class="mini-diagram" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="78" fill="var(--color-table-border)"></circle>
          <circle cx="90" cy="90" r="66" fill="var(--color-wheel-base)"></circle>
          ${Array.from({ length: 12 }, (_, index) => {
            const start = index * 30;
            const color = index === 0 ? "var(--color-number-green)" : index % 2 ? "var(--color-number-red)" : "var(--color-number-black)";
            return `<path d="${describeArc(90, 90, 62, start, start + 28)} L90 90 Z" fill="${color}"></path>`;
          }).join("")}
          <circle cx="90" cy="90" r="28" fill="var(--color-wheel-accent)"></circle>
          <circle cx="128" cy="44" r="7" fill="#fff"></circle>
        </svg>
      `;
    }

    helpGoal() {
      return `
        <article class="help-card">
          <div class="help-grid">
            <div>${this.miniWheelSvg()}</div>
            <div>
              <h3>${i18n.t("help.goal")}</h3>
              <p>${i18n.t("help.goalBody")}</p>
            </div>
          </div>
        </article>
      `;
    }

    helpWheel() {
      return `
        <article class="help-card">
          <div class="help-grid">
            <div>${this.miniWheelSvg()}</div>
            <div>
              <h3>${i18n.t("help.wheel")}</h3>
              <p>${i18n.t("help.wheelBody")}</p>
              <ul>
                <li>${i18n.t("wheel.europeanDesc")}</li>
                <li>${i18n.t("wheel.americanDesc")}</li>
                <li>${i18n.t("help.wheelColors")}</li>
              </ul>
            </div>
          </div>
        </article>
      `;
    }

    helpBets() {
      const cards = [
        ["betType.straight", "1", "35:1", "neutral"],
        ["betType.redBlack", "18", "1:1", "red"],
        ["betType.oddEven", "18", "1:1", "neutral"],
        ["betType.lowHigh", "18", "1:1", "neutral"],
        ["betType.dozen", "12", "2:1", "neutral"],
        ["betType.column", "12", "2:1", "neutral"],
        ["betType.split", "2", "17:1", "neutral"],
        ["betType.corner", "4", "8:1", "neutral"],
      ];
      return `
        <article class="help-card">
          <h3>${i18n.t("help.bets")}</h3>
          <div class="help-grid">
            ${cards.map(([nameKey, coverage, payout, tone]) => `
              <section class="bet-type-card">
                ${miniBetSvg(tone)}
                <h4>${i18n.t(nameKey)}</h4>
                <p>${i18n.t("help.coverage")}: ${coverage}</p>
                <p>${i18n.t("help.payoutRatio")}: ${payout}</p>
              </section>
            `).join("")}
          </div>
        </article>
      `;
    }

    helpPayout() {
      const options = [
        ["35", "2.70", "betType.straight", "35:1"],
        ["17", "5.40", "betType.split", "17:1"],
        ["11", "8.10", "betType.street", "11:1"],
        ["8", "10.81", "betType.corner", "8:1"],
        ["5", "16.21", "betType.sixLine", "5:1"],
        ["2", "32.43", "betType.dozen", "2:1"],
        ["1", "48.65", "betType.outside", "1:1"],
      ];
      return `
        <article class="help-card">
          <h3>${i18n.t("help.payout")}</h3>
          <div class="calculator">
            <div class="calculator-controls">
              <select id="payoutType">
                ${options.map(([value, probability, key, ratio]) => `<option value="${value}" data-prob="${probability}">${i18n.t(key)} ${ratio}</option>`).join("")}
              </select>
              <input id="payoutAmount" type="number" min="5" step="5" value="100">
            </div>
            <div id="payoutOutput"></div>
          </div>
        </article>
      `;
    }

    helpAi() {
      return `
        <article class="help-card">
          <h3>${i18n.t("help.ai")}</h3>
          <p>${i18n.t("help.aiBody")}</p>
          <div class="help-grid">
            <section class="bet-type-card"><h4>${i18n.t("difficulty.easy")}</h4><p>${i18n.t("help.aiEasy")}</p></section>
            <section class="bet-type-card"><h4>${i18n.t("difficulty.normal")}</h4><p>${i18n.t("help.aiNormal")}</p></section>
            <section class="bet-type-card"><h4>${i18n.t("difficulty.hard")}</h4><p>${i18n.t("help.aiHard")}</p></section>
          </div>
        </article>
      `;
    }

    helpControls() {
      return `
        <article class="help-card">
          <h3>${i18n.t("help.controls")}</h3>
          <p>${i18n.t("help.controlsBody")}</p>
          <ul>
            <li>${i18n.t("help.controlClear")}</li>
            <li>${i18n.t("help.controlSave")}</li>
            <li>${i18n.t("help.controlTheme")}</li>
          </ul>
          <h4>${i18n.t("help.settingsReference")}</h4>
          <ul>
            <li>${i18n.t("help.settingSpeed")}</li>
            <li>${i18n.t("help.settingWheel")}</li>
          </ul>
        </article>
      `;
    }

    bindCalculator() {
      const type = $("#payoutType");
      const amount = $("#payoutAmount");
      const output = $("#payoutOutput");
      if (!type || !amount || !output) return;
      const update = () => {
        const option = type.selectedOptions[0];
        const ratio = Number(type.value);
        const stake = Math.max(0, Number(amount.value) || 0);
        const gross = stake * (ratio + 1);
        output.innerHTML = `
          <p>${i18n.t("help.winAmount")}: <strong>${formatMoney(gross)}</strong></p>
          <p>${i18n.t("help.probability")}: <strong>${option.dataset.prob}%</strong></p>
        `;
      };
      type.addEventListener("change", update);
      amount.addEventListener("input", update);
      update();
    }
  }

  function sumBets(bets) {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  }

  function describeArc(cx, cy, radius, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  }

  function miniBetSvg(tone) {
    const fill = tone === "red" ? "var(--color-number-red)" : tone === "black" ? "var(--color-number-black)" : "rgba(0,0,0,0.3)";
    return `
      <svg class="mini-diagram" viewBox="0 0 180 80" aria-hidden="true">
        <rect x="8" y="8" width="164" height="64" rx="8" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.35)"></rect>
        <rect x="24" y="20" width="36" height="40" rx="4" fill="${fill}" stroke="rgba(255,255,255,0.65)"></rect>
        <rect x="68" y="20" width="36" height="40" rx="4" fill="var(--color-number-red)" stroke="rgba(255,255,255,0.45)"></rect>
        <rect x="112" y="20" width="36" height="40" rx="4" fill="var(--color-number-black)" stroke="rgba(255,255,255,0.45)"></rect>
      </svg>
    `;
  }

  window.addEventListener("DOMContentLoaded", () => {
    new GameApp();
  });
})();
