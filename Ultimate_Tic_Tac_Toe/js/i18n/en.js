(function () {
  "use strict";
  window.I18nMessages = window.I18nMessages || {};
  window.I18nMessages.en = {
    app: {
      title: "Ultimate Tic-Tac-Toe",
      subtitle: "Conquer three small boards"
    },
    menu: {
      start: "Start Game",
      startAria: "Start a new game",
      continue: "Continue",
      continueAria: "Load saved game",
      help: "Help",
      helpAria: "Open help",
      settings: "Settings",
      settingsAria: "Open settings"
    },
    difficulty: {
      title: "Choose AI Difficulty",
      easy: "Easy",
      easyDesc: "Random AI",
      normal: "Normal",
      normalDesc: "Strategic AI",
      hard: "Hard",
      hardDesc: "Deep Search AI",
      confirm: "Confirm",
      cancel: "Cancel"
    },
    symbol: {
      title: "Choose Your Mark",
      useX: "Play X",
      useO: "Play O",
      xDesc: "X moves first, so you open the game.",
      oDesc: "O moves second, so the AI opens as X."
    },
    game: {
      player: "Player",
      ai: "AI",
      turn: "Turn",
      playerTurn: "Player turn",
      aiTurn: "AI turn",
      aiThinking: "AI thinking",
      difficulty: "Difficulty",
      moveCount: "Moves",
      target: "Target board",
      anyBoard: "Any playable board",
      boardCoord: "row {row}, column {col}",
      restart: "Restart",
      undo: "Undo",
      elapsed: "Time",
      confirmRestart: "Restart the current game?",
      invalid: "That move is not allowed"
    },
    settings: {
      title: "Settings",
      language: "Language",
      theme: "Theme",
      sound: "Sound",
      bgmVolume: "BGM Volume",
      sfxVolume: "SFX Volume",
      mute: "Mute Toggle",
      muted: "Muted",
      soundOn: "Sound On",
      reset: "Reset Settings"
    },
    theme: {
      classic: "Classic",
      neon: "Neon",
      ocean: "Ocean",
      sakura: "Sakura"
    },
    help: {
      title: "How to Play",
      goalTitle: "Goal",
      goalBody: "Win three small boards in a row on the 3×3 mega board.",
      boardTitle: "Board",
      boardBody: "The mega board contains 9 small boards. Each small board has 9 cells, for 81 total cells.",
      rulesTitle: "Move Rule",
      rulesBody: "The cell you choose sends the AI to the matching small board. If that board is complete, any unfinished small board is available.",
      winTitle: "Winning",
      winBody: "Three in a row wins a small board; three claimed small boards in a row wins the game.",
      strategyTitle: "Tips",
      tipCenter: "Fight for the center board.",
      tipSend: "Send the AI to weak or blocked positions.",
      tipFork: "Create multiple threats at once.",
      aiTitle: "AI Difficulty",
      aiBody: "Easy moves randomly, Normal attacks and blocks, Hard searches with Minimax and Alpha-Beta pruning."
    },
    result: {
      playerWin: "Player Wins!",
      aiWin: "AI Wins!",
      draw: "Draw!",
      detail: "Moves: {moves}  Time: {time}",
      playAgain: "Play Again",
      home: "Main Menu"
    },
    board: {
      cell: "small board {br},{bc}, cell {cr},{cc}",
      occupied: "occupied by {player}",
      open: "open"
    },
    common: {
      ok: "OK",
      cancel: "Cancel"
    }
  };
})();
