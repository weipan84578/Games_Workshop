window.VP = window.VP || {};

VP.LANG_ZH = {
  app: {
    kicker: "Pocket Companion",
    title: "Virtual Pet",
    tagline: "照顧牠的日常，陪牠慢慢長大。"
  },
  common: {
    confirm: "確認",
    cancel: "取消",
    back: "返回"
  },
  menu: {
    start: "開始遊戲",
    continue: "繼續遊戲",
    instructions: "說明",
    settings: "設定",
    noSave: "尚無存檔",
    saveReady: "最近存檔：{time}",
    confirmNewTitle: "開始新遊戲",
    confirmNew: "目前已有存檔。開始新遊戲會覆蓋現有進度。"
  },
  status: {
    hunger: "飽足",
    mood: "心情",
    clean: "清潔",
    energy: "體力",
    health: "健康"
  },
  actions: {
    feed: "餵食",
    play: "玩耍",
    clean: "清潔",
    sleep: "睡覺",
    pet: "摸摸"
  },
  actionMessages: {
    feed: "吃飽了，精神也亮起來。",
    play: "玩得很開心，但有點累。",
    clean: "乾乾淨淨，舒服多了。",
    sleep: "小睡一下，體力回來了。",
    pet: "牠很喜歡這樣的陪伴。",
    blocked: "牠現在需要先恢復一下。",
    levelup: "長大了！新的階段開啟。",
    warning: "牠的狀態偏低，需要照顧。"
  },
  speech: {
    ready: "今天也想和你待在一起。",
    happy: "感覺很好，再一起玩吧。",
    normal: "今天過得平穩。",
    sad: "有點沒精神，想被照顧。",
    sick: "狀態不好，需要你幫忙。",
    sleeping: "Zzz..."
  },
  game: {
    petRoom: "Pet Room",
    stage: "階段",
    level: "等級",
    age: "年齡",
    growth: "成長",
    activity: "照顧紀錄",
    lastSaved: "已存檔 {time}",
    autosaved: "已自動存檔",
    gameOver: "健康歸零，請重新開始照顧。"
  },
  stages: {
    egg: "蛋",
    baby: "幼年",
    child: "童年",
    adult: "成年"
  },
  instructions: {
    title: "照顧手冊",
    tabs: {
      actions: "照顧",
      stats: "狀態",
      growth: "成長",
      save: "存檔"
    },
    cards: {
      actions: [
        { icon: "🍙", title: "餵食", body: "飽足提高 30，適合在飢餓偏低時使用。" },
        { icon: "🎾", title: "玩耍", body: "心情提高 25，但體力與清潔會下降。" },
        { icon: "🫧", title: "清潔", body: "清潔提高 40，也會讓心情微幅變好。" },
        { icon: "🌙", title: "睡覺", body: "體力提高 50，短暫進入睡眠狀態。" },
        { icon: "🤍", title: "摸摸", body: "心情提高 10，是最溫和的互動。" },
        { icon: "⚠", title: "提醒", body: "狀態過低會影響健康，健康歸零會結束本輪。" }
      ],
      stats: [
        { icon: "🍙", title: "飽足", body: "代表是否吃飽，會隨時間下降。" },
        { icon: "😊", title: "心情", body: "影響表情、BGM 與成長節奏。" },
        { icon: "✨", title: "清潔", body: "太低時健康會慢慢下降。" },
        { icon: "⚡", title: "體力", body: "玩耍會消耗，睡覺可補回。" },
        { icon: "❤", title: "健康", body: "由其他狀態共同影響，是最重要的指標。" }
      ],
      growth: [
        { icon: "🥚", title: "蛋", body: "新遊戲的起點，開始照顧後會孵化。" },
        { icon: "🌱", title: "幼年", body: "等級 2 進入幼年，開始有更多動作。" },
        { icon: "⭐", title: "童年", body: "等級 4 進入童年，體型變大。" },
        { icon: "🏅", title: "成年", body: "等級 7 進入成年，完成主要成長。" }
      ],
      save: [
        { icon: "💾", title: "自動存檔", body: "照顧動作、設定變更與每 30 秒會寫入存檔。" },
        { icon: "⏱", title: "離線時間", body: "再次開啟時會套用流逝時間，最多計算 12 小時。" },
        { icon: "⚙", title: "設定保存", body: "語言、主題、音量與輔助設定會一起保存。" }
      ]
    }
  },
  settings: {
    title: "遊戲設定",
    language: "語言",
    theme: "主題",
    audio: "音量",
    bgm: "BGM",
    sfx: "SFX",
    accessibility: "輔助",
    reducedMotion: "減少動畫",
    textScale: "文字大小",
    resetSave: "清除存檔",
    resetTitle: "清除存檔",
    resetConfirm: "確定要清除目前的寵物進度嗎？",
    resetDone: "存檔已清除",
    saved: "設定已保存"
  },
  themes: {
    candy: "糖果",
    ocean: "海洋",
    forest: "森林",
    night: "夜晚",
    sunset: "夕陽"
  }
};
