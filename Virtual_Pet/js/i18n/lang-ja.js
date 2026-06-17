window.VP = window.VP || {};

VP.LANG_JA = {
  app: {
    kicker: "Pocket Companion",
    title: "Virtual Pet",
    tagline: "毎日のお世話で、少しずつ成長します。"
  },
  common: {
    confirm: "決定",
    cancel: "キャンセル",
    back: "戻る"
  },
  menu: {
    start: "はじめる",
    continue: "つづきから",
    instructions: "説明",
    settings: "設定",
    noSave: "セーブなし",
    saveReady: "最終セーブ：{time}",
    confirmNewTitle: "新しく始める",
    confirmNew: "セーブがあります。新しく始めると進行状況を上書きします。"
  },
  status: {
    hunger: "満腹",
    mood: "気分",
    clean: "清潔",
    energy: "体力",
    health: "健康"
  },
  actions: {
    feed: "ごはん",
    play: "あそぶ",
    clean: "そうじ",
    sleep: "ねむる",
    pet: "なでる"
  },
  actionMessages: {
    feed: "おなかいっぱいで元気になりました。",
    play: "楽しく遊んで、少し疲れました。",
    clean: "きれいになって気持ちよさそうです。",
    sleep: "短い昼寝で体力が戻りました。",
    pet: "やさしくなでられて喜んでいます。",
    blocked: "少し休ませてあげましょう。",
    levelup: "成長しました。",
    warning: "状態が低いです。お世話が必要です。"
  },
  speech: {
    ready: "今日も一緒にいたいです。",
    happy: "いい気分です。もっと遊びたい。",
    normal: "おだやかな一日です。",
    sad: "少し元気がありません。",
    sick: "調子が悪いです。助けてください。",
    sleeping: "Zzz..."
  },
  game: {
    petRoom: "Pet Room",
    stage: "段階",
    level: "レベル",
    age: "年齢",
    growth: "成長",
    activity: "お世話ログ",
    lastSaved: "セーブ済み {time}",
    autosaved: "自動セーブしました",
    gameOver: "健康が 0 になりました。新しく始めてください。"
  },
  stages: {
    egg: "たまご",
    baby: "幼年",
    child: "子ども",
    adult: "大人"
  },
  instructions: {
    title: "お世話ガイド",
    tabs: {
      actions: "お世話",
      stats: "状態",
      growth: "成長",
      save: "セーブ"
    },
    cards: {
      actions: [
        { icon: "🍙", title: "ごはん", body: "満腹が 30 上がります。" },
        { icon: "🎾", title: "あそぶ", body: "気分が 25 上がり、体力と清潔が下がります。" },
        { icon: "🫧", title: "そうじ", body: "清潔が 40 上がり、気分も少し上がります。" },
        { icon: "🌙", title: "ねむる", body: "体力が 50 上がり、少し眠ります。" },
        { icon: "🤍", title: "なでる", body: "やさしい交流で気分が 10 上がります。" },
        { icon: "⚠", title: "注意", body: "状態が低いと健康に影響します。" }
      ],
      stats: [
        { icon: "🍙", title: "満腹", body: "時間とともに下がります。" },
        { icon: "😊", title: "気分", body: "表情、BGM、成長に影響します。" },
        { icon: "✨", title: "清潔", body: "低いと健康が下がります。" },
        { icon: "⚡", title: "体力", body: "遊ぶと減り、眠ると回復します。" },
        { icon: "❤", title: "健康", body: "ほかの状態から決まる大切な値です。" }
      ],
      growth: [
        { icon: "🥚", title: "たまご", body: "新しいゲームの始まりです。" },
        { icon: "🌱", title: "幼年", body: "レベル 2 で成長します。" },
        { icon: "⭐", title: "子ども", body: "レベル 4 で体が大きくなります。" },
        { icon: "🏅", title: "大人", body: "レベル 7 で主な成長が完了します。" }
      ],
      save: [
        { icon: "💾", title: "自動セーブ", body: "操作、設定、30 秒ごとに保存します。" },
        { icon: "⏱", title: "経過時間", body: "再開時に最大 12 時間まで反映します。" },
        { icon: "⚙", title: "設定", body: "言語、テーマ、音量、補助設定を保存します。" }
      ]
    }
  },
  settings: {
    title: "ゲーム設定",
    language: "言語",
    theme: "テーマ",
    audio: "音量",
    bgm: "BGM",
    sfx: "SFX",
    accessibility: "補助",
    reducedMotion: "動きを減らす",
    textScale: "文字サイズ",
    resetSave: "セーブ削除",
    resetTitle: "セーブ削除",
    resetConfirm: "現在の進行状況を削除しますか？",
    resetDone: "セーブを削除しました",
    saved: "設定を保存しました"
  },
  themes: {
    candy: "キャンディ",
    ocean: "オーシャン",
    forest: "フォレスト",
    night: "ナイト",
    sunset: "サンセット"
  }
};
