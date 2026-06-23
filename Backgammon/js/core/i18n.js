(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  const translations = {
    "zh-TW": {
      menu: {
        title: "雙陸棋",
        start_game: "開始遊戲",
        continue_game: "繼續遊戲",
        instructions: "說明",
        settings: "設定",
      },
      game: {
        menu: "主選單",
        player: "玩家",
        ai: "AI",
        your_turn: "你的回合",
        ai_turn: "AI 回合",
        roll: "擲骰階段",
        move: "移動階段",
        opening: "開局擲骰",
        over: "遊戲結束",
        roll_dice: "擲骰",
        end_turn: "結束回合",
        bear_off: "熊入",
        undo: "悔棋",
        double: "對子，獲得 4 次移動",
        no_moves: "沒有合法移動，跳過回合",
        waiting_ai: "AI 思考中",
        choose_piece: "選擇一顆可移動的白棋",
        choose_target: "選擇高亮落點",
        bar_first: "BAR 上有棋時必須先入場",
        saved: "已自動存檔",
        invalid: "這一步不合法",
        use_dice: "剩餘骰子",
        opening_result: "開局：玩家 {player}，AI {ai}",
        winner_player: "你獲勝",
        winner_ai: "AI 獲勝",
      },
      result: {
        win: "恭喜獲勝",
        lose: "AI 獲勝",
        gammon: "豪奪（Gammon）",
        backgammon: "絕殺（Backgammon）",
        normal: "普通勝",
        play_again: "再玩一次",
        back_to_menu: "回主選單",
      },
      settings: {
        title: "設定",
        language: "語言",
        theme: "配色主題",
        volume: "音量控制",
        bgm_volume: "BGM 音量",
        sfx_volume: "音效音量",
        difficulty: "AI 難度",
        easy: "簡單",
        normal: "普通",
        hard: "困難",
        animation_speed: "動畫速度",
        slow: "慢",
        normal_speed: "普通",
        fast: "快",
        save: "儲存設定",
        reset: "重設預設值",
        saved: "設定已儲存",
      },
      themes: {
        classic_short: "古典",
        ocean_short: "海洋",
        forest_short: "森林",
        sunset_short: "夕陽",
        night_short: "深夜",
      },
      help: {
        title: "遊戲說明",
        tabs: {
          overview: "概覽",
          movement: "移動",
          bar: "BAR",
          bear_off: "熊入",
          winning: "勝利",
          terms: "術語",
        },
      },
      common: {
        back: "返回",
        close: "關閉",
        cancel: "取消",
        ok: "確定",
      },
    },
    en: {
      menu: {
        title: "Backgammon",
        start_game: "Start Game",
        continue_game: "Continue",
        instructions: "How to Play",
        settings: "Settings",
      },
      game: {
        menu: "Menu",
        player: "Player",
        ai: "AI",
        your_turn: "Your Turn",
        ai_turn: "AI Turn",
        roll: "Roll Phase",
        move: "Move Phase",
        opening: "Opening Roll",
        over: "Game Over",
        roll_dice: "Roll",
        end_turn: "End Turn",
        bear_off: "Bear Off",
        undo: "Undo",
        double: "Double: 4 moves",
        no_moves: "No legal moves. Turn skipped.",
        waiting_ai: "AI is thinking",
        choose_piece: "Choose a movable white checker",
        choose_target: "Choose a highlighted target",
        bar_first: "Enter from the bar first",
        saved: "Saved",
        invalid: "Illegal move",
        use_dice: "Dice left",
        opening_result: "Opening: Player {player}, AI {ai}",
        winner_player: "You win",
        winner_ai: "AI wins",
      },
      result: {
        win: "You Win",
        lose: "AI Wins",
        gammon: "Gammon",
        backgammon: "Backgammon",
        normal: "Normal Win",
        play_again: "Play Again",
        back_to_menu: "Back to Menu",
      },
      settings: {
        title: "Settings",
        language: "Language",
        theme: "Theme",
        volume: "Volume",
        bgm_volume: "BGM",
        sfx_volume: "SFX",
        difficulty: "AI Difficulty",
        easy: "Easy",
        normal: "Normal",
        hard: "Hard",
        animation_speed: "Animation Speed",
        slow: "Slow",
        normal_speed: "Normal",
        fast: "Fast",
        save: "Save Settings",
        reset: "Reset Defaults",
        saved: "Settings saved",
      },
      themes: {
        classic_short: "Classic",
        ocean_short: "Ocean",
        forest_short: "Forest",
        sunset_short: "Sunset",
        night_short: "Night",
      },
      help: {
        title: "How to Play",
        tabs: {
          overview: "Overview",
          movement: "Move",
          bar: "Bar",
          bear_off: "Bear Off",
          winning: "Win",
          terms: "Terms",
        },
      },
      common: {
        back: "Back",
        close: "Close",
        cancel: "Cancel",
        ok: "OK",
      },
    },
    ja: {
      menu: {
        title: "バックギャモン",
        start_game: "ゲーム開始",
        continue_game: "続きから",
        instructions: "説明",
        settings: "設定",
      },
      game: {
        menu: "メニュー",
        player: "プレイヤー",
        ai: "AI",
        your_turn: "あなたの番",
        ai_turn: "AI の番",
        roll: "ダイス",
        move: "移動",
        opening: "開始ロール",
        over: "ゲーム終了",
        roll_dice: "振る",
        end_turn: "手番終了",
        bear_off: "ベアオフ",
        undo: "戻す",
        double: "ゾロ目：4 回移動",
        no_moves: "合法手なし。手番を渡します。",
        waiting_ai: "AI 思考中",
        choose_piece: "動かす白チェッカーを選択",
        choose_target: "強調された行き先を選択",
        bar_first: "バーの駒を先に戻します",
        saved: "保存しました",
        invalid: "不正な手です",
        use_dice: "残りダイス",
        opening_result: "開始：プレイヤー {player}、AI {ai}",
        winner_player: "あなたの勝ち",
        winner_ai: "AI の勝ち",
      },
      result: {
        win: "勝利",
        lose: "AI 勝利",
        gammon: "ギャモン",
        backgammon: "バックギャモン",
        normal: "通常勝ち",
        play_again: "もう一度",
        back_to_menu: "メニューへ",
      },
      settings: {
        title: "設定",
        language: "言語",
        theme: "テーマ",
        volume: "音量",
        bgm_volume: "BGM 音量",
        sfx_volume: "効果音",
        difficulty: "AI 難易度",
        easy: "簡単",
        normal: "普通",
        hard: "難しい",
        animation_speed: "アニメ速度",
        slow: "遅い",
        normal_speed: "普通",
        fast: "速い",
        save: "設定を保存",
        reset: "初期化",
        saved: "保存しました",
      },
      themes: {
        classic_short: "古典",
        ocean_short: "海",
        forest_short: "森",
        sunset_short: "夕日",
        night_short: "夜",
      },
      help: {
        title: "遊び方",
        tabs: {
          overview: "概要",
          movement: "移動",
          bar: "バー",
          bear_off: "ベアオフ",
          winning: "勝利",
          terms: "用語",
        },
      },
      common: {
        back: "戻る",
        close: "閉じる",
        cancel: "取消",
        ok: "OK",
      },
    },
  };

  BG.I18n = {
    currentLocale: "zh-TW",
    strings: translations["zh-TW"],
    supportedLocales: {
      "zh-TW": { name: "繁體中文" },
      en: { name: "English" },
      ja: { name: "日本語" },
    },

    async load(locale) {
      const nextLocale = translations[locale] ? locale : "zh-TW";
      this.currentLocale = nextLocale;
      this.strings = translations[nextLocale];
      if (location.protocol !== "file:") {
        try {
          const response = await fetch(`locales/${nextLocale}.json`, { cache: "no-store" });
          if (response.ok) this.strings = await response.json();
        } catch (error) {
          this.strings = translations[nextLocale];
        }
      }
      document.documentElement.lang = nextLocale === "zh-TW" ? "zh-Hant" : nextLocale;
      this.applyAll();
      return this.strings;
    },

    t(key, replacements) {
      const value = key.split(".").reduce((obj, part) => (obj ? obj[part] : undefined), this.strings);
      let text = typeof value === "string" ? value : key;
      if (replacements) {
        Object.keys(replacements).forEach((name) => {
          text = text.replace(`{${name}}`, String(replacements[name]));
        });
      }
      return text;
    },

    applyAll() {
      document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = this.t(element.dataset.i18n);
      });
    },
  };
})(window);
