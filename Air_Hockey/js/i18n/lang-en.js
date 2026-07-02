(function (ns) {
  "use strict";

  ns.Langs = ns.Langs || {};
  ns.Langs.en = {
    app: {
      subtitle: "Player vs AI"
    },
    menu: {
      start: "Start Game",
      continue: "Continue",
      noProgress: "No saved game",
      howToPlay: "How To Play",
      settings: "Settings"
    },
    difficulty: {
      title: "Choose Difficulty",
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
      easyDesc: "Slower reactions for learning the feel.",
      normalDesc: "Basic prediction with balanced pace.",
      hardDesc: "Fast blocking and active attacks."
    },
    hud: {
      player: "Player:",
      ai: "AI:"
    },
    game: {
      ready: "Ready",
      countdown: "Countdown",
      playing: "Playing",
      scored: "Goal!",
      pause: "Pause",
      pauseGame: "Pause Game",
      rotate: "Rotate your device to landscape"
    },
    pause: {
      title: "Paused",
      resume: "Resume",
      restart: "Restart",
      menu: "Main Menu"
    },
    result: {
      win: "You Win!",
      lose: "AI Wins",
      detail: "A sharp match.",
      playAgain: "Play Again",
      combo: "Combo Goal!"
    },
    howto: {
      title: "How To Play",
      goalTitle: "Goal",
      goalText: "Control the lower mallet and send the puck into the AI goal. First to the target score wins.",
      controlsTitle: "Controls",
      controlsText: "Use mouse or keyboard on desktop. Drag with one finger on phones and tablets. Your mallet stays in your half.",
      rulesTitle: "Rules",
      rulesText: "After each goal, a 3-second countdown restarts play. Pausing or closing the page preserves unfinished progress.",
      difficultyTitle: "Difficulty",
      difficultyText: "Easy keeps the puck speed capped lower with gentler AI. Normal raises speed and prediction. Hard accelerates quickly, predicts bounces, and pressures forward.",
      interfaceTitle: "Interface",
      interfaceText: "The top HUD shows scores, status, and countdown. Pause is at top left, quick mute at top right.",
      tipsTitle: "Tips",
      tipsText: "Use wall rebounds to create angles. Hitting near the mallet edge bends the puck path."
    },
    settings: {
      title: "Settings",
      audio: "Audio",
      bgmVolume: "BGM Volume",
      sfxVolume: "SFX Volume",
      mute: "Mute",
      musicSettings: "Music",
      display: "Display",
      effectsQuality: "Effects Quality",
      language: "Language",
      targetScore: "Winning Score",
      other: "Other",
      resetProgress: "Reset Progress",
      confirmResetTitle: "Reset progress?",
      confirmResetText: "This clears the unfinished match."
    },
    theme: {
      neon: "Neon",
      classic: "Classic",
      sunset: "Sunset",
      ice: "Ice"
    },
    quality: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    actions: {
      back: "Back",
      confirm: "Confirm",
      cancel: "Cancel",
      saved: "Saved",
      resetDone: "Progress cleared"
    }
  };
})(window.AirHockey = window.AirHockey || {});
