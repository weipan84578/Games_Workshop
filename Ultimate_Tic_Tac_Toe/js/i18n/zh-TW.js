(function () {
  "use strict";
  window.I18nMessages = window.I18nMessages || {};
  window.I18nMessages["zh-TW"] = {
    app: {
      title: "終極井字棋",
      subtitle: "Ultimate Tic-Tac-Toe"
    },
    menu: {
      start: "開始遊戲",
      startAria: "開始新遊戲",
      continue: "繼續遊戲",
      continueAria: "讀取上次存檔",
      help: "說明",
      helpAria: "開啟遊戲說明",
      settings: "設定",
      settingsAria: "開啟設定"
    },
    difficulty: {
      title: "選擇 AI 難度",
      easy: "簡單",
      easyDesc: "隨機 AI",
      normal: "普通",
      normalDesc: "策略 AI",
      hard: "困難",
      hardDesc: "深度搜尋 AI",
      confirm: "確認",
      cancel: "取消"
    },
    symbol: {
      title: "選擇你的棋子",
      useX: "使用 X",
      useO: "使用 O",
      xDesc: "X 先手，由玩家先下。",
      oDesc: "O 後手，由 AI 使用 X 先下。"
    },
    game: {
      player: "玩家",
      ai: "AI",
      turn: "回合",
      playerTurn: "玩家回合",
      aiTurn: "AI 回合",
      aiThinking: "AI 思考中",
      difficulty: "難度",
      moveCount: "步數",
      target: "指定棋盤",
      anyBoard: "任意可用棋盤",
      boardCoord: "第 {row} 列第 {col} 欄",
      restart: "重新開始",
      undo: "悔棋",
      elapsed: "用時",
      confirmRestart: "要重新開始目前對局嗎？",
      invalid: "這裡不能落子"
    },
    settings: {
      title: "設定",
      language: "語言",
      theme: "主題",
      sound: "聲音",
      bgmVolume: "BGM 音量",
      sfxVolume: "音效音量",
      mute: "靜音切換",
      muted: "已靜音",
      soundOn: "聲音開啟",
      reset: "重置所有設定"
    },
    theme: {
      classic: "經典",
      neon: "霓虹",
      ocean: "海洋",
      sakura: "櫻花"
    },
    help: {
      title: "遊戲說明",
      goalTitle: "遊戲目標",
      goalBody: "在 3×3 的大棋盤中，率先佔領連成一線的三個小棋盤即可獲勝。",
      boardTitle: "棋盤介紹",
      boardBody: "大棋盤由 9 個小棋盤組成；每個小棋盤有 9 格，整局共有 81 個格子。",
      rulesTitle: "落子規則",
      rulesBody: "你落在小棋盤的哪一格，就會把 AI 送到大棋盤中相同位置的小棋盤。若指定棋盤已結束，就能自由選擇任何未完成的小棋盤。",
      winTitle: "勝利條件",
      winBody: "小棋盤內連成三子即可佔領該盤；大棋盤中連成三個已佔領的小棋盤即可取得最終勝利。",
      strategyTitle: "策略提示",
      tipCenter: "優先爭取中央小棋盤。",
      tipSend: "把 AI 送往不利或已堵住的位置。",
      tipFork: "建立多條潛在連線，迫使 AI 防守。",
      aiTitle: "AI 難度",
      aiBody: "簡單為隨機行動，普通會攻防判斷，困難使用 Minimax 與 Alpha-Beta 剪枝。"
    },
    result: {
      playerWin: "玩家獲勝！",
      aiWin: "AI 獲勝！",
      draw: "平局！",
      detail: "步數：{moves}　用時：{time}",
      playAgain: "再玩一次",
      home: "返回主選單"
    },
    board: {
      cell: "小棋盤 {br},{bc} 的格子 {cr},{cc}",
      occupied: "已由 {player} 佔用",
      open: "可落子"
    },
    common: {
      ok: "確認",
      cancel: "取消"
    }
  };
})();
