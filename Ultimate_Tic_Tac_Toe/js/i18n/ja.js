(function () {
  "use strict";
  window.I18nMessages = window.I18nMessages || {};
  window.I18nMessages.ja = {
    app: {
      title: "究極三目並べ",
      subtitle: "Ultimate Tic-Tac-Toe"
    },
    menu: {
      start: "ゲーム開始",
      startAria: "新しいゲームを開始",
      continue: "続きから",
      continueAria: "保存したゲームを読み込む",
      help: "説明",
      helpAria: "説明を開く",
      settings: "設定",
      settingsAria: "設定を開く"
    },
    difficulty: {
      title: "AI 難易度を選択",
      easy: "かんたん",
      easyDesc: "ランダム AI",
      normal: "ふつう",
      normalDesc: "戦略 AI",
      hard: "むずかしい",
      hardDesc: "Minimax + Alpha-Beta",
      confirm: "決定",
      cancel: "キャンセル"
    },
    game: {
      player: "プレイヤー",
      ai: "AI",
      turn: "手番",
      playerTurn: "プレイヤーの手番",
      aiTurn: "AI の手番",
      aiThinking: "AI 思考中",
      difficulty: "難易度",
      moveCount: "手数",
      target: "指定ボード",
      anyBoard: "任意の空きボード",
      boardCoord: "{row} 行 {col} 列",
      restart: "最初から",
      undo: "戻す",
      elapsed: "時間",
      confirmRestart: "現在の対局を最初から始めますか？",
      invalid: "ここには置けません"
    },
    settings: {
      title: "設定",
      language: "言語",
      theme: "テーマ",
      sound: "サウンド",
      bgmVolume: "BGM 音量",
      sfxVolume: "効果音 音量",
      mute: "ミュート切替",
      muted: "ミュート中",
      soundOn: "サウンド ON",
      reset: "設定をリセット"
    },
    theme: {
      classic: "クラシック",
      neon: "ネオン",
      ocean: "オーシャン",
      sakura: "サクラ"
    },
    help: {
      title: "遊び方",
      goalTitle: "目的",
      goalBody: "3×3 の大きな盤面で、小さな盤面を三つ一直線に取ると勝利です。",
      boardTitle: "盤面",
      boardBody: "大きな盤面は 9 つの小さな盤面で構成され、各小盤面には 9 マスあります。",
      rulesTitle: "置き方",
      rulesBody: "置いたマスの位置が、相手の次に置く小盤面を指定します。指定先が終了済みなら、未終了の盤面を自由に選べます。",
      winTitle: "勝利条件",
      winBody: "小盤面で三目を作るとその盤面を獲得し、大盤面で三つ並べると勝利です。",
      strategyTitle: "ヒント",
      tipCenter: "中央の小盤面を狙いましょう。",
      tipSend: "AI を不利な場所へ送ります。",
      tipFork: "複数の勝ち筋を同時に作ります。",
      aiTitle: "AI 難易度",
      aiBody: "かんたんはランダム、ふつうは攻防判断、むずかしいは Minimax と Alpha-Beta 探索です。"
    },
    result: {
      playerWin: "プレイヤーの勝利！",
      aiWin: "AI の勝利！",
      draw: "引き分け！",
      detail: "手数：{moves}　時間：{time}",
      playAgain: "もう一度",
      home: "メインメニュー"
    },
    board: {
      cell: "小盤面 {br},{bc} のマス {cr},{cc}",
      occupied: "{player} が配置済み",
      open: "配置可能"
    },
    common: {
      ok: "決定",
      cancel: "キャンセル"
    }
  };
})();
