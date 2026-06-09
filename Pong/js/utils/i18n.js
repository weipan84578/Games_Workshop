(function () {
  const TRANSLATIONS = {
    "zh-TW": {
      app: { title: "Pong", subtitle: "Player vs AI" },
      aria: {
        mainMenu: "主選單",
        themeSwitch: "主題切換",
        gameCanvas: "Pong 遊戲畫布",
        touchControls: "觸控方向鍵",
        touchUp: "上移",
        touchDown: "下移",
        pause: "暫停",
        mute: "靜音",
        unmute: "取消靜音"
      },
      menu: {
        start: "開始遊戲",
        continueGame: "繼續遊戲",
        help: "說明",
        settings: "設定",
        difficultyTitle: "選擇難度",
        cancel: "取消"
      },
      difficulty: { easy: "簡單", normal: "普通", hard: "困難" },
      speed: { slow: "慢", normal: "正常", fast: "快" },
      themes: {
        neon: "霓虹",
        classic: "經典",
        ocean: "海洋",
        fire: "火焰",
        forest: "森林",
        candy: "糖果",
        ice: "冰川",
        galaxy: "星河"
      },
      settings: {
        title: "設定",
        gameTab: "遊戲設定",
        audioTab: "音效設定",
        visualTab: "視覺設定",
        reset: "重設預設值",
        back: "返回主選單",
        targetScore: "目標分數",
        ballSpeed: "球速",
        musicVolume: "背景音樂音量",
        sfxVolume: "音效音量",
        theme: "配色主題",
        showFPS: "顯示 FPS",
        vibration: "震動回饋",
        language: "語言"
      },
      game: { player: "玩家" },
      pause: { title: "暫停中", resume: "繼續遊戲", restart: "重新開始", menu: "主選單" },
      result: {
        winTitle: "YOU WIN!",
        loseTitle: "GAME OVER",
        scoreLine: "玩家 {playerScore} - AI {aiScore}",
        again: "再來一局",
        menu: "主選單"
      },
      help: {
        title: "說明",
        controlsTitle: "操控",
        controlsBody: "鍵盤使用 ↑ ↓ 或 W S 移動左側球拍；行動裝置可滑動 Canvas 左半部，也可使用左側方向鍵。",
        rulesTitle: "規則",
        rulesBody: "上下邊界會反彈，左右邊界為得分區。率先達到設定目標分數者獲勝。",
        difficultyTitle: "AI 難度",
        difficultyBody: "簡單模式反應慢且誤差大；普通模式較穩定；困難模式會預測反彈落點，但仍保留可被擊敗的失誤率。",
        shortcutsTitle: "快捷鍵",
        shortcutsBody: "ESC 暫停或繼續，M 靜音切換，R 在遊戲中重新開始。",
        back: "返回主選單",
        start: "開始遊戲"
      }
    },

    en: {
      app: { title: "Pong", subtitle: "Player vs AI" },
      aria: {
        mainMenu: "Main menu",
        themeSwitch: "Theme switcher",
        gameCanvas: "Pong game canvas",
        touchControls: "Touch controls",
        touchUp: "Move up",
        touchDown: "Move down",
        pause: "Pause",
        mute: "Mute",
        unmute: "Unmute"
      },
      menu: {
        start: "Start Game",
        continueGame: "Continue",
        help: "Help",
        settings: "Settings",
        difficultyTitle: "Select Difficulty",
        cancel: "Cancel"
      },
      difficulty: { easy: "Easy", normal: "Normal", hard: "Hard" },
      speed: { slow: "Slow", normal: "Normal", fast: "Fast" },
      themes: {
        neon: "Neon",
        classic: "Classic",
        ocean: "Ocean",
        fire: "Fire",
        forest: "Forest",
        candy: "Candy",
        ice: "Ice",
        galaxy: "Galaxy"
      },
      settings: {
        title: "Settings",
        gameTab: "Game",
        audioTab: "Audio",
        visualTab: "Visual",
        reset: "Reset Defaults",
        back: "Back to Menu",
        targetScore: "Target Score",
        ballSpeed: "Ball Speed",
        musicVolume: "Music Volume",
        sfxVolume: "SFX Volume",
        theme: "Theme",
        showFPS: "Show FPS",
        vibration: "Vibration",
        language: "Language"
      },
      game: { player: "Player" },
      pause: { title: "Paused", resume: "Resume", restart: "Restart", menu: "Main Menu" },
      result: {
        winTitle: "YOU WIN!",
        loseTitle: "GAME OVER",
        scoreLine: "Player {playerScore} - AI {aiScore}",
        again: "Play Again",
        menu: "Main Menu"
      },
      help: {
        title: "Help",
        controlsTitle: "Controls",
        controlsBody: "Use ↑ ↓ or W S to move the left paddle. On mobile, swipe on the left half of the canvas or use the touch buttons.",
        rulesTitle: "Rules",
        rulesBody: "The top and bottom walls bounce the ball. The left and right edges are scoring zones. First to the target score wins.",
        difficultyTitle: "AI Difficulty",
        difficultyBody: "Easy reacts slowly with larger errors. Normal is steadier. Hard predicts bounces but still leaves a small chance to miss.",
        shortcutsTitle: "Shortcuts",
        shortcutsBody: "ESC pauses or resumes, M toggles mute, and R restarts during a match.",
        back: "Back to Menu",
        start: "Start Game"
      }
    },

    ja: {
      app: { title: "Pong", subtitle: "Player vs AI" },
      aria: {
        mainMenu: "メインメニュー",
        themeSwitch: "テーマ切り替え",
        gameCanvas: "Pongゲームキャンバス",
        touchControls: "タッチ操作",
        touchUp: "上へ移動",
        touchDown: "下へ移動",
        pause: "一時停止",
        mute: "ミュート",
        unmute: "ミュート解除"
      },
      menu: {
        start: "ゲーム開始",
        continueGame: "続きから",
        help: "ヘルプ",
        settings: "設定",
        difficultyTitle: "難易度を選択",
        cancel: "キャンセル"
      },
      difficulty: { easy: "かんたん", normal: "ふつう", hard: "むずかしい" },
      speed: { slow: "遅い", normal: "標準", fast: "速い" },
      themes: {
        neon: "ネオン",
        classic: "クラシック",
        ocean: "オーシャン",
        fire: "ファイア",
        forest: "フォレスト",
        candy: "キャンディ",
        ice: "アイス",
        galaxy: "ギャラクシー"
      },
      settings: {
        title: "設定",
        gameTab: "ゲーム",
        audioTab: "サウンド",
        visualTab: "表示",
        reset: "初期設定に戻す",
        back: "メニューへ戻る",
        targetScore: "目標スコア",
        ballSpeed: "ボール速度",
        musicVolume: "BGM音量",
        sfxVolume: "効果音音量",
        theme: "テーマ",
        showFPS: "FPSを表示",
        vibration: "振動フィードバック",
        language: "言語"
      },
      game: { player: "プレイヤー" },
      pause: { title: "一時停止中", resume: "再開", restart: "リスタート", menu: "メインメニュー" },
      result: {
        winTitle: "勝利!",
        loseTitle: "敗北",
        scoreLine: "プレイヤー {playerScore} - AI {aiScore}",
        again: "もう一度",
        menu: "メインメニュー"
      },
      help: {
        title: "ヘルプ",
        controlsTitle: "操作",
        controlsBody: "↑ ↓ または W S で左側のパドルを動かします。モバイルではキャンバス左半分をスワイプするか、タッチボタンを使います。",
        rulesTitle: "ルール",
        rulesBody: "上下の壁ではボールが跳ね返ります。左右の端は得点エリアです。目標スコアに先に到達した側の勝利です。",
        difficultyTitle: "AI難易度",
        difficultyBody: "かんたんは反応が遅く誤差が大きめです。ふつうは安定しています。むずかしいは反射後の位置を予測しますが、少しだけミスします。",
        shortcutsTitle: "ショートカット",
        shortcutsBody: "ESCで一時停止/再開、Mでミュート切り替え、試合中にRでリスタートできます。",
        back: "メニューへ戻る",
        start: "ゲーム開始"
      }
    }
  };

  function readPath(source, key) {
    return key.split(".").reduce((value, part) => {
      if (value && Object.prototype.hasOwnProperty.call(value, part)) {
        return value[part];
      }
      return undefined;
    }, source);
  }

  function interpolate(text, params) {
    if (!params) {
      return text;
    }
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match;
    });
  }

  const I18n = {
    defaultLanguage: "zh-TW",

    currentLanguage() {
      const settings = window.Pong && Pong.GameState ? Pong.GameState.settings : null;
      return settings && settings.language ? settings.language : I18n.defaultLanguage;
    },

    t(key, params) {
      const language = I18n.currentLanguage();
      const value = readPath(TRANSLATIONS[language] || TRANSLATIONS[I18n.defaultLanguage], key);
      const fallback = readPath(TRANSLATIONS[I18n.defaultLanguage], key);
      return interpolate(value || fallback || key, params);
    },

    isSupported(language) {
      return CONSTANTS.LANGUAGES.some((item) => item.id === language);
    },

    meta(language) {
      return CONSTANTS.LANGUAGES.find((item) => item.id === language) || CONSTANTS.LANGUAGES[0];
    },

    apply(language) {
      const meta = I18n.meta(language || I18n.currentLanguage());
      document.documentElement.setAttribute("lang", meta.htmlLang);
      document.title = I18n.t("app.title");
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.I18n = I18n;
})();
