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
    encyclopedia: "圖鑑",
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
    warm: "加熱",
    feed: "餵食",
    play: "玩耍",
    clean: "清潔",
    sleep: "睡覺",
    pet: "摸摸",
    train: "訓練"
  },
  actionMessages: {
    eggChosen: "選好蛋了。先保持溫暖，慢慢等待孵化。",
    warm: "蛋變暖了，裡面有東西在動。",
    hatched: "{pet} 孵化了！",
    feed: "吃飽了，精神也亮起來。",
    play: "玩得很開心，但有點累。",
    clean: "乾乾淨淨，舒服多了。",
    sleep: "小睡一下，體力回來了。",
    pet: "牠很喜歡這樣的陪伴。",
    train: "訓練完成，成長速度提高了。",
    blocked: "牠現在需要先恢復一下。",
    levelup: "長大了！新的階段開啟。",
    elder: "牠進入老年期了，健康會逐漸下降。",
    death: "牠安靜地結束了這一生。",
    warning: "牠的狀態偏低，需要照顧。"
  },
  speech: {
    ready: "今天也想和你待在一起。",
    happy: "感覺很好，再一起玩吧。",
    normal: "今天過得平穩。",
    sad: "有點沒精神，想被照顧。",
    sick: "狀態不好，需要你幫忙。",
    sleeping: "Zzz...",
    dead: "這段生命旅程已經結束。"
  },
  game: {
    petRoom: "Pet Room",
    stage: "階段",
    species: "種族",
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
    juvenile: "幼年期",
    mature: "成熟期",
    prime: "壯年期",
    elder: "老年期"
  },
  eggSelection: {
    kicker: "New Life",
    title: "選一顆蛋",
    lede: "每顆蛋都藏著未知的生命。選好以後，孵出什麼才會揭曉。",
    mysteryEgg: "神祕蛋",
    unknown: "孵化前未知",
    eggs: {
      ember: "餘燼蛋",
      tide: "潮汐蛋",
      meadow: "草原蛋",
      moon: "月影蛋",
      crystal: "稜晶蛋"
    }
  },
  encyclopedia: {
    title: "養成圖鑑",
    summary: "成功養成到老年期的寵物會在這裡解鎖。",
    lockedName: "未解鎖",
    lockedHint: "成功養成後顯示",
    raisedAt: "解鎖 {time}"
  },
  families: {
    dragon: "龍",
    fish: "魚",
    cat: "貓",
    dog: "狗",
    cow: "牛",
    bird: "鳥",
    rabbit: "兔",
    fox: "狐",
    turtle: "龜",
    unicorn: "獨角獸"
  },
  instructions: {
    title: "照顧手冊",
    tabs: {
      actions: "照顧",
      stats: "狀態",
      growth: "成長",
      encyclopedia: "圖鑑",
      save: "存檔"
    },
    cards: {
      actions: [
        { icon: "🔥", title: "加熱", body: "蛋期只能加熱與摸摸，加熱能推進孵化，其他照顧會在孵化後解鎖。" },
        { icon: "🍙", title: "餵食", body: "孵化後可餵食，飽足提高 30。" },
        { icon: "🎾", title: "玩耍", body: "心情提高 25，但體力與清潔會下降。" },
        { icon: "🫧", title: "清潔", body: "清潔提高 40，也會讓心情微幅變好。" },
        { icon: "🌙", title: "睡覺", body: "體力提高 50，短暫進入睡眠狀態。" },
        { icon: "🤍", title: "摸摸", body: "心情提高 10，是最溫和的互動。" },
        { icon: "⭐", title: "訓練", body: "成熟期後解鎖，成長較快但會消耗更多體力與飽足。" },
        { icon: "⚠", title: "提醒", body: "狀態過低會影響健康，健康歸零會結束本輪。" }
      ],
      stats: [
        { icon: "🍙", title: "飽足", body: "代表是否吃飽，會隨時間下降。" },
        { icon: "😊", title: "心情", body: "影響表情、BGM 與成長節奏。" },
        { icon: "✨", title: "清潔", body: "太低時健康會慢慢下降。" },
        { icon: "⚡", title: "體力", body: "玩耍會消耗，睡覺可補回。" },
        { icon: "❤", title: "健康", body: "由其他狀態共同影響。進入老年期後，健康會開始自然下降。" }
      ],
      growth: [
        { icon: "🥚", title: "蛋", body: "新遊戲先選蛋，孵化前不知道會是什麼寵物。" },
        { icon: "🌱", title: "幼年期", body: "體力消耗很慢，適合多互動。" },
        { icon: "⭐", title: "成熟期", body: "能力最平均，訓練開始解鎖。" },
        { icon: "🏅", title: "壯年期", body: "成長穩定，照顧節奏變得更重要。" },
        { icon: "🍂", title: "老年期", body: "一進入老年期就會開始扣健康，最後自然死亡並重新開始。" }
      ],
      encyclopedia: [
        { icon: "▦", title: "養成圖鑑", body: "寵物成功養到老年期後，會在圖鑑中解鎖。" },
        { icon: "❓", title: "未知寵物", body: "蛋孵化前不知道會是哪一種；圖鑑中未養成的寵物會保持鎖定。" },
        { icon: "50", title: "50 種收集", body: "目前共有 50 種寵物，分成龍、魚、貓、狗、牛等 10 個家族。" }
      ],
      save: [
        { icon: "💾", title: "自動存檔", body: "選蛋、孵化結果、照顧動作、圖鑑與設定都會保存。" },
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
