(function (ns) {
  "use strict";

  ns.Langs = ns.Langs || {};
  ns.Langs.zh = {
    app: {
      subtitle: "玩家 VS AI"
    },
    menu: {
      start: "開始遊戲",
      continue: "繼續遊戲",
      noProgress: "尚無進度",
      howToPlay: "說明",
      settings: "設定"
    },
    difficulty: {
      title: "選擇難度",
      easy: "簡單",
      normal: "普通",
      hard: "困難",
      easyDesc: "反應較慢，適合熟悉操作。",
      normalDesc: "具備基礎預測，節奏均衡。",
      hardDesc: "快速封堵與主動進攻。"
    },
    hud: {
      player: "玩家:",
      ai: "電腦:"
    },
    game: {
      ready: "準備開球",
      countdown: "倒數",
      playing: "進行中",
      scored: "得分！",
      pause: "暫停",
      pauseGame: "暫停遊戲",
      rotate: "請將裝置橫向使用"
    },
    pause: {
      title: "暫停",
      resume: "繼續",
      restart: "重新開始",
      menu: "回主畫面"
    },
    result: {
      win: "你贏了！",
      lose: "電腦獲勝",
      detail: "精彩的一局。",
      playAgain: "再玩一次",
      combo: "連續得分！"
    },
    howto: {
      title: "遊戲說明",
      goalTitle: "遊戲目標",
      goalText: "控制下方球拍，把冰球打進電腦球門。先達到目標分數者獲勝。",
      controlsTitle: "操作方式",
      controlsText: "桌機用滑鼠或鍵盤，手機與平板用手指拖曳。球拍會被限制在己方半場。",
      rulesTitle: "遊戲規則",
      rulesText: "得分後會倒數 3 秒重新開球。暫停或關閉頁面時會保留未完成進度。",
      difficultyTitle: "難度說明",
      difficultyText: "簡單速度上限較低、AI 反應較溫和；普通速度與預測能力提高；困難會快速加速、預判反彈並主動壓迫。",
      interfaceTitle: "介面導覽",
      interfaceText: "上方 HUD 顯示比分、狀態與倒數。左上暫停，右上可快速靜音。",
      tipsTitle: "小技巧",
      tipsText: "善用邊牆反彈製造角度，擊中球拍邊緣可以讓冰球偏折。"
    },
    settings: {
      title: "設定",
      audio: "音訊設定",
      bgmVolume: "BGM 音量",
      sfxVolume: "音效音量",
      mute: "靜音",
      musicSettings: "音樂設定",
      display: "顯示設定",
      effectsQuality: "特效品質",
      language: "語言設定",
      targetScore: "勝利分數",
      other: "其他",
      resetProgress: "重置進度",
      confirmResetTitle: "確認重置？",
      confirmResetText: "這會清除目前未完成的對戰進度。"
    },
    theme: {
      neon: "霓虹",
      classic: "經典藍",
      sunset: "日落橘",
      ice: "冰藍"
    },
    quality: {
      low: "低",
      medium: "中",
      high: "高"
    },
    actions: {
      back: "返回",
      confirm: "確認",
      cancel: "取消",
      saved: "已儲存",
      resetDone: "進度已清除"
    }
  };
})(window.AirHockey = window.AirHockey || {});
