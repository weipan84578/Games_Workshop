(function (ns) {
  "use strict";

  ns.Langs = ns.Langs || {};
  ns.Langs.ja = {
    app: {
      subtitle: "プレイヤー VS AI"
    },
    menu: {
      start: "スタート",
      continue: "つづきから",
      noProgress: "セーブなし",
      howToPlay: "あそびかた",
      settings: "設定"
    },
    difficulty: {
      title: "難易度を選択",
      easy: "かんたん",
      normal: "ふつう",
      hard: "むずかしい",
      easyDesc: "反応が遅めで操作練習向け。",
      normalDesc: "短い予測でバランスよく対戦。",
      hardDesc: "すばやい守備と積極的な攻撃。"
    },
    hud: {
      player: "プレイヤー",
      ai: "AI"
    },
    game: {
      ready: "準備中",
      countdown: "カウント",
      playing: "プレイ中",
      scored: "ゴール！",
      pause: "一時停止",
      rotate: "横向きでプレイしてください"
    },
    pause: {
      title: "一時停止",
      resume: "再開",
      restart: "リスタート",
      menu: "メニューへ"
    },
    result: {
      win: "勝利！",
      lose: "AI の勝利",
      detail: "白熱した試合でした。",
      playAgain: "もう一度",
      combo: "連続ゴール！"
    },
    howto: {
      title: "あそびかた",
      goalTitle: "目的",
      goalText: "下側のマレットを操作して、パックを AI のゴールへ入れます。先に目標点へ到達すると勝利です。",
      controlsTitle: "操作",
      controlsText: "デスクトップはマウスまたはキーボード、スマホとタブレットは指でドラッグします。マレットは自分の陣地内に制限されます。",
      rulesTitle: "ルール",
      rulesText: "得点後は 3 秒カウントして再開します。一時停止またはページを閉じると途中経過を保存します。",
      difficultyTitle: "難易度",
      difficultyText: "かんたんは反応遅め、ふつうは短く予測、むずかしいは反射も予測して攻めます。",
      interfaceTitle: "画面",
      interfaceText: "上部 HUD に得点、状態、カウントを表示します。左上は一時停止、右上はミュートです。",
      tipsTitle: "ヒント",
      tipsText: "壁の反射で角度を作りましょう。マレットの端で当てるとパックの進路を曲げられます。"
    },
    settings: {
      title: "設定",
      audio: "オーディオ",
      bgmVolume: "BGM 音量",
      sfxVolume: "効果音 音量",
      mute: "ミュート",
      display: "表示",
      controls: "操作",
      keyboard: "キーボード補助",
      language: "言語",
      rules: "ルール",
      other: "その他",
      resetProgress: "進行をリセット",
      confirmResetTitle: "リセットしますか？",
      confirmResetText: "未完了の試合データを消去します。"
    },
    theme: {
      neon: "ネオン",
      classic: "クラシック",
      sunset: "サンセット",
      ice: "アイス"
    },
    quality: {
      low: "低",
      medium: "中",
      high: "高"
    },
    sensitivity: {
      low: "低",
      medium: "中",
      high: "高"
    },
    actions: {
      back: "戻る",
      confirm: "確認",
      cancel: "キャンセル",
      saved: "保存しました",
      resetDone: "進行を削除しました"
    }
  };
})(window.AirHockey = window.AirHockey || {});
