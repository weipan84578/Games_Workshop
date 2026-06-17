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
    encyclopedia: "図鑑",
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
    warm: "あたためる",
    feed: "ごはん",
    play: "あそぶ",
    clean: "そうじ",
    sleep: "ねむる",
    pet: "なでる",
    train: "トレーニング"
  },
  actionMessages: {
    eggChosen: "たまごを選びました。あたためながら孵化を待ちましょう。",
    warm: "たまごが温まり、中で何かが動きました。",
    hatched: "{pet} が孵化しました。",
    feed: "おなかいっぱいで元気になりました。",
    play: "楽しく遊んで、少し疲れました。",
    clean: "きれいになって気持ちよさそうです。",
    sleep: "短い昼寝で体力が戻りました。",
    pet: "やさしくなでられて喜んでいます。",
    train: "トレーニング完了。成長が進みました。",
    blocked: "少し休ませてあげましょう。",
    levelup: "成長しました。",
    elder: "老年期に入りました。健康が少しずつ下がります。",
    death: "静かに一生を終えました。",
    warning: "状態が低いです。お世話が必要です。"
  },
  speech: {
    ready: "今日も一緒にいたいです。",
    happy: "いい気分です。もっと遊びたい。",
    normal: "おだやかな一日です。",
    sad: "少し元気がありません。",
    sick: "調子が悪いです。助けてください。",
    sleeping: "Zzz...",
    dead: "この命の旅は終わりました。"
  },
  game: {
    petRoom: "Pet Room",
    stage: "段階",
    species: "種族",
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
    juvenile: "幼年期",
    mature: "成熟期",
    prime: "壮年期",
    elder: "老年期"
  },
  eggSelection: {
    kicker: "New Life",
    title: "たまごを選ぶ",
    lede: "どのたまごにも未知の命がいます。孵化するまで正体はわかりません。",
    mysteryEgg: "ふしぎなたまご",
    unknown: "孵化まで不明",
    eggs: {
      ember: "ほむらのたまご",
      tide: "しおのたまご",
      meadow: "くさはらのたまご",
      moon: "つきかげのたまご",
      crystal: "すいしょうのたまご"
    }
  },
  encyclopedia: {
    title: "育成図鑑",
    summary: "老年期まで育てたペットがここに解放されます。",
    lockedName: "未解放",
    lockedHint: "育成成功で表示",
    raisedAt: "{time} 解放"
  },
  families: {
    dragon: "ドラゴン",
    fish: "魚",
    cat: "猫",
    dog: "犬",
    cow: "牛",
    bird: "鳥",
    rabbit: "うさぎ",
    fox: "きつね",
    turtle: "かめ",
    unicorn: "ユニコーン"
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
        { icon: "🔥", title: "あたためる", body: "たまご期はあたためるとなでるだけ。孵化が進みます。" },
        { icon: "🍙", title: "ごはん", body: "孵化後、満腹が 30 上がります。" },
        { icon: "🎾", title: "あそぶ", body: "気分が 25 上がり、体力と清潔が下がります。" },
        { icon: "🫧", title: "そうじ", body: "清潔が 40 上がり、気分も少し上がります。" },
        { icon: "🌙", title: "ねむる", body: "体力が 50 上がり、少し眠ります。" },
        { icon: "🤍", title: "なでる", body: "やさしい交流で気分が 10 上がります。" },
        { icon: "⭐", title: "トレーニング", body: "成熟期から解放。成長が早いぶん体力を使います。" },
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
        { icon: "🥚", title: "たまご", body: "最初にたまごを選びます。孵化まで正体は不明です。" },
        { icon: "🌱", title: "幼年期", body: "体力が減りにくく、たくさん遊べます。" },
        { icon: "⭐", title: "成熟期", body: "もっともバランスがよく、トレーニングが解放されます。" },
        { icon: "🏅", title: "壮年期", body: "安定して成長しますが、お世話のリズムが重要です。" },
        { icon: "🍂", title: "老年期", body: "健康が少しずつ下がり、最後は自然に一生を終えます。" }
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
