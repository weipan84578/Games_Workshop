/* i18n.js — 簡單多國語系字典與 DOM 套用。 */
(function (L) {
  'use strict';

  var I = L.i18n = L.i18n || {};

  var dict = {
    'zh-Hant': {
      appTitle: 'Ludo 飛行棋',
      appSubtitle: '飛行棋',
      menuTag: '擲骰子 · 繞棋盤 · 搶先回家',
      version: '版本',
      startGame: '開始遊戲',
      continueGame: '繼續遊戲',
      instructions: '說明',
      settings: '設定',
      newMatch: '開始新對局',
      opponentCount: '對手數量',
      aiOne: '1 位 AI',
      aiTwo: '2 位 AI',
      aiThree: '3 位 AI',
      aiDifficulty: 'AI 難度',
      easy: '簡單',
      normal: '普通',
      hard: '困難',
      yourColor: '你的顏色',
      red: '紅',
      green: '綠',
      yellow: '黃',
      blue: '藍',
      start: '開始!',
      back: '返回',
      ready: '準備開始',
      muteTitle: '靜音',
      menuTitle: '選單',
      rollDiceAria: '擲骰子',
      instructionsTitle: '遊戲說明',
      instructionsLead: '目標很單純:把 4 顆棋子全部送回中央。關鍵在於何時出棋、何時追擊、何時躲進安全格。',
      ruleGoalTitle: '到家才算贏',
      ruleGoalBody: '每位玩家有 4 顆棋子。從基地出發,繞外圈一圈後進入自己的終點通道,全部抵達中央即獲勝。',
      ruleRollTitle: '擲到 6 才能出棋',
      ruleRollBody: '基地裡的棋子只有擲到 6 才能移到起點。擲到 6 可再擲一次,但連續三次 6 會讓本回合作廢。',
      ruleCaptureTitle: '追擊與安全格',
      ruleCaptureBody: '停在對手單一棋子的格子上可以吃子。起點與星號格是安全格,棋子不會被吃。',
      ruleFortressTitle: '堡壘會阻擋路線',
      ruleFortressBody: '兩顆以上同色棋子在同一格會形成堡壘。其他棋子不能停在上面,也不能穿越。',
      ruleFinishTitle: '終點需要精準點數',
      ruleFinishBody: '進入終點時必須剛好抵達中央。點數超過就不能移動該棋子。',
      theme: '主題配色',
      themeClassic: '經典',
      themeOcean: '海洋',
      themeSunset: '夕陽',
      themeForest: '森林',
      themeNight: '夜間',
      themeHighContrast: '高對比',
      language: '語言',
      bgmVolume: '背景音樂音量',
      sfxVolume: '音效音量',
      mute: '靜音',
      muted: '已靜音',
      soundOn: '開啟',
      animSpeed: '動畫速度:',
      animOff: '關閉',
      animNormal: '正常',
      animFast: '快速',
      backMenu: '返回選單',
      clickDice: '點擊骰子',
      yourTurn: '輪到你了 — 擲骰子',
      aiThinking: '{color} (AI) 思考中...',
      aiRollAgain: '{color} (AI) 再擲一次...',
      tripleSix: '連續三次 6 — 本回合作廢!',
      noMoves: '沒有可走的棋 — 跳過',
      chooseToken: '選擇要移動的棋子',
      captured: '吃掉了對手棋子!',
      bonusRoll: '額外回合 — 再擲一次!',
      you: '你',
      home: '到家',
      quitTitle: '離開對局?',
      quitText: '目前進度已自動儲存,可從「繼續遊戲」回來。',
      quitYes: '回主選單',
      quitNo: '繼續對局',
      resultWinTitle: '你贏了!',
      resultWinSub: '恭喜把 4 顆棋子全部送進終點!',
      resultLoseTitle: '{color}方獲勝',
      resultLoseSub: '再接再厲,下次一定行!',
      playAgain: '再玩一局'
    },
    en: {
      appTitle: 'Ludo',
      appSubtitle: 'Board Game',
      menuTag: 'Roll · Race · Bring every token home',
      version: 'Version',
      startGame: 'Start Game',
      continueGame: 'Continue',
      instructions: 'How to Play',
      settings: 'Settings',
      newMatch: 'New Match',
      opponentCount: 'Opponents',
      aiOne: '1 AI',
      aiTwo: '2 AI',
      aiThree: '3 AI',
      aiDifficulty: 'AI Difficulty',
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      yourColor: 'Your Color',
      red: 'Red',
      green: 'Green',
      yellow: 'Yellow',
      blue: 'Blue',
      start: 'Start!',
      back: 'Back',
      ready: 'Ready',
      muteTitle: 'Mute',
      menuTitle: 'Menu',
      rollDiceAria: 'Roll dice',
      instructionsTitle: 'How to Play',
      instructionsLead: 'Bring all 4 tokens to the center. The real decisions are when to enter, chase, block, or shelter.',
      ruleGoalTitle: 'Win by coming home',
      ruleGoalBody: 'Each player has 4 tokens. Leave the yard, complete the outer loop, enter your home lane, and finish in the center.',
      ruleRollTitle: 'Roll 6 to enter',
      ruleRollBody: 'A token in the yard can enter only on a 6. Rolling a 6 grants another roll, but three 6s in a row forfeits the turn.',
      ruleCaptureTitle: 'Capture and safety',
      ruleCaptureBody: 'Landing on a single opponent token sends it back to the yard. Start cells and star cells are safe.',
      ruleFortressTitle: 'Fortresses block paths',
      ruleFortressBody: 'Two or more same-color tokens on one cell form a fortress. Other tokens cannot land on it or pass through it.',
      ruleFinishTitle: 'Finish exactly',
      ruleFinishBody: 'A token must reach the center by exact count. If the roll overshoots, that token cannot move.',
      theme: 'Theme',
      themeClassic: 'Classic',
      themeOcean: 'Ocean',
      themeSunset: 'Sunset',
      themeForest: 'Forest',
      themeNight: 'Night',
      themeHighContrast: 'Contrast',
      language: 'Language',
      bgmVolume: 'Music Volume',
      sfxVolume: 'SFX Volume',
      mute: 'Mute',
      muted: 'Muted',
      soundOn: 'On',
      animSpeed: 'Animation:',
      animOff: 'Off',
      animNormal: 'Normal',
      animFast: 'Fast',
      backMenu: 'Back to Menu',
      clickDice: 'Click dice',
      yourTurn: 'Your turn — roll the dice',
      aiThinking: '{color} (AI) is thinking...',
      aiRollAgain: '{color} (AI) rolls again...',
      tripleSix: 'Three 6s in a row — turn forfeited!',
      noMoves: 'No legal moves — skipped',
      chooseToken: 'Choose a token to move',
      captured: 'Captured an opponent token!',
      bonusRoll: 'Bonus turn — roll again!',
      you: 'You',
      home: 'Home',
      quitTitle: 'Leave this match?',
      quitText: 'Progress has been saved. You can return with Continue.',
      quitYes: 'Back to Menu',
      quitNo: 'Keep Playing',
      resultWinTitle: 'You win!',
      resultWinSub: 'All 4 tokens reached the finish.',
      resultLoseTitle: '{color} wins',
      resultLoseSub: 'Try again and take the board back.',
      playAgain: 'Play Again'
    },
    ja: {
      appTitle: 'ルドー',
      appSubtitle: '飛行棋',
      menuTag: 'サイコロを振る · 盤面を進む · 全員をゴールへ',
      version: 'バージョン',
      startGame: 'ゲーム開始',
      continueGame: '続きから',
      instructions: '遊び方',
      settings: '設定',
      newMatch: '新しい対局',
      opponentCount: '相手の数',
      aiOne: 'AI 1人',
      aiTwo: 'AI 2人',
      aiThree: 'AI 3人',
      aiDifficulty: 'AI 難易度',
      easy: 'かんたん',
      normal: '普通',
      hard: '難しい',
      yourColor: '自分の色',
      red: '赤',
      green: '緑',
      yellow: '黄',
      blue: '青',
      start: '開始!',
      back: '戻る',
      ready: '準備完了',
      muteTitle: 'ミュート',
      menuTitle: 'メニュー',
      rollDiceAria: 'サイコロを振る',
      instructionsTitle: '遊び方',
      instructionsLead: '4つのコマをすべて中央へ戻せば勝利です。出す、追う、守る、ふさぐ判断が勝負を分けます。',
      ruleGoalTitle: '全コマをゴールへ',
      ruleGoalBody: '各プレイヤーは4つのコマを持ちます。基地から出て外周を一周し、自分のゴール通路を通って中央を目指します。',
      ruleRollTitle: '6でスタート',
      ruleRollBody: '基地のコマは6を出した時だけ出せます。6を出すともう一度振れますが、3回連続の6はターンが無効になります。',
      ruleCaptureTitle: '捕獲と安全マス',
      ruleCaptureBody: '相手の単独コマに止まると、そのコマを基地へ戻せます。スタートマスと星マスは安全です。',
      ruleFortressTitle: '砦は通行止め',
      ruleFortressBody: '同じ色のコマが2つ以上同じマスにあると砦になります。他のコマは止まることも通過することもできません。',
      ruleFinishTitle: 'ゴールはぴったり',
      ruleFinishBody: '中央へ入るには出目がぴったり必要です。出目が大きすぎる場合、そのコマは動かせません。',
      theme: 'テーマ',
      themeClassic: 'クラシック',
      themeOcean: '海',
      themeSunset: '夕焼け',
      themeForest: '森',
      themeNight: '夜',
      themeHighContrast: '高コントラスト',
      language: '言語',
      bgmVolume: 'BGM 音量',
      sfxVolume: '効果音 音量',
      mute: 'ミュート',
      muted: 'ミュート中',
      soundOn: 'オン',
      animSpeed: 'アニメ速度:',
      animOff: 'オフ',
      animNormal: '普通',
      animFast: '高速',
      backMenu: 'メニューへ戻る',
      clickDice: 'サイコロを押す',
      yourTurn: 'あなたの番 — サイコロを振る',
      aiThinking: '{color} (AI) が考え中...',
      aiRollAgain: '{color} (AI) がもう一度振ります...',
      tripleSix: '6が3回連続 — このターンは無効!',
      noMoves: '動かせるコマがありません — スキップ',
      chooseToken: '動かすコマを選んでください',
      captured: '相手のコマを捕獲しました!',
      bonusRoll: '追加ターン — もう一度!',
      you: 'あなた',
      home: 'ゴール',
      quitTitle: '対局を離れますか?',
      quitText: '進行状況は保存済みです。「続きから」で戻れます。',
      quitYes: 'メニューへ戻る',
      quitNo: '対局を続ける',
      resultWinTitle: '勝利!',
      resultWinSub: '4つのコマがすべてゴールしました。',
      resultLoseTitle: '{color}の勝利',
      resultLoseSub: '次は盤面を取り返しましょう。',
      playAgain: 'もう一局'
    }
  };

  I.t = function (key, vars) {
    var lang = I.current();
    var text = (dict[lang] && dict[lang][key]) || dict['zh-Hant'][key] || key;
    vars = vars || {};
    return text.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] != null ? vars[name] : '';
    });
  };

  I.current = function () {
    var s = L.state.settings;
    var lang = s && s.language;
    return dict[lang] ? lang : 'zh-Hant';
  };

  I.setLanguage = function (lang) {
    if (!dict[lang]) lang = 'zh-Hant';
    L.state.settings.language = lang;
    document.documentElement.setAttribute('lang', lang);
    L.storage.saveSettings();
    I.apply();
  };

  I.colorName = function (owner) {
    var key = L.config.COLORS[owner];
    return I.t(key);
  };

  I.apply = function () {
    var lang = I.current();
    document.documentElement.setAttribute('lang', lang);
    document.title = I.t('appTitle');

    applyAttr('[data-i18n]', 'textContent');
    applyAttr('[data-i18n-title]', 'title');
    applyAttr('[data-i18n-aria]', 'aria-label');

    if (L.ui && L.ui.settings && L.ui.settings.refreshUI) L.ui.settings.refreshUI();
    if (L.ui && L.ui.menu && L.ui.menu.refreshLabels) L.ui.menu.refreshLabels();
    if (L.ui && L.ui.hud && L.ui.hud.update) L.ui.hud.update();
    if (L.ui && L.ui.hud && L.ui.hud.refreshPrompt) L.ui.hud.refreshPrompt();
  };

  function applyAttr(selector, target) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute(selector.slice(1, -1));
      if (target === 'textContent') els[i].textContent = I.t(key);
      else els[i].setAttribute(target, I.t(key));
    }
  }
})(window.Ludo);
