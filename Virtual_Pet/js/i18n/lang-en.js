window.VP = window.VP || {};

VP.LANG_EN = {
  app: {
    kicker: "Pocket Companion",
    title: "Virtual Pet",
    tagline: "Care for small routines and watch your pet grow."
  },
  common: {
    confirm: "Confirm",
    cancel: "Cancel",
    back: "Back"
  },
  menu: {
    start: "New Game",
    continue: "Continue",
    instructions: "Instructions",
    settings: "Settings",
    noSave: "No save data",
    saveReady: "Last save: {time}",
    confirmNewTitle: "New Game",
    confirmNew: "A save already exists. Starting over will replace it."
  },
  status: {
    hunger: "Fullness",
    mood: "Mood",
    clean: "Clean",
    energy: "Energy",
    health: "Health"
  },
  actions: {
    feed: "Feed",
    play: "Play",
    clean: "Clean",
    sleep: "Sleep",
    pet: "Pet"
  },
  actionMessages: {
    feed: "A good meal brightened the room.",
    play: "That was fun, but it used some energy.",
    clean: "Fresh and clean.",
    sleep: "A short nap restored energy.",
    pet: "Your pet likes the attention.",
    blocked: "Your pet needs a moment first.",
    levelup: "Growth stage unlocked.",
    warning: "Some stats are low. Your pet needs care."
  },
  speech: {
    ready: "I want to stay with you today.",
    happy: "Feeling good. Let's play again.",
    normal: "A calm day in the room.",
    sad: "A little low. Care would help.",
    sick: "Not feeling well. Please help.",
    sleeping: "Zzz..."
  },
  game: {
    petRoom: "Pet Room",
    stage: "Stage",
    level: "Level",
    age: "Age",
    growth: "Growth",
    activity: "Care Log",
    lastSaved: "Saved {time}",
    autosaved: "Autosaved",
    gameOver: "Health reached zero. Start a new care cycle."
  },
  stages: {
    egg: "Egg",
    baby: "Baby",
    child: "Child",
    adult: "Adult"
  },
  instructions: {
    title: "Care Guide",
    tabs: {
      actions: "Care",
      stats: "Stats",
      growth: "Growth",
      save: "Save"
    },
    cards: {
      actions: [
        { icon: "🍙", title: "Feed", body: "Fullness rises by 30. Best when hunger is low." },
        { icon: "🎾", title: "Play", body: "Mood rises by 25, while energy and clean drop." },
        { icon: "🫧", title: "Clean", body: "Clean rises by 40 and mood improves slightly." },
        { icon: "🌙", title: "Sleep", body: "Energy rises by 50 and the pet rests briefly." },
        { icon: "🤍", title: "Pet", body: "Mood rises by 10 with a gentle interaction." },
        { icon: "⚠", title: "Warning", body: "Low stats affect health. Zero health ends the run." }
      ],
      stats: [
        { icon: "🍙", title: "Fullness", body: "Drops over time as your pet gets hungry." },
        { icon: "😊", title: "Mood", body: "Controls expression, BGM, and growth rhythm." },
        { icon: "✨", title: "Clean", body: "Low clean will slowly reduce health." },
        { icon: "⚡", title: "Energy", body: "Play consumes it. Sleep restores it." },
        { icon: "❤", title: "Health", body: "The most important stat, shaped by all others." }
      ],
      growth: [
        { icon: "🥚", title: "Egg", body: "Every new game starts here." },
        { icon: "🌱", title: "Baby", body: "Unlocked at level 2 after early care." },
        { icon: "⭐", title: "Child", body: "Unlocked at level 4 with a larger body." },
        { icon: "🏅", title: "Adult", body: "Unlocked at level 7 as the main growth goal." }
      ],
      save: [
        { icon: "💾", title: "Autosave", body: "Care actions, settings, and 30-second intervals save progress." },
        { icon: "⏱", title: "Offline Time", body: "Elapsed time is applied when reopening, capped at 12 hours." },
        { icon: "⚙", title: "Settings", body: "Language, theme, audio, and accessibility are stored." }
      ]
    }
  },
  settings: {
    title: "Game Settings",
    language: "Language",
    theme: "Theme",
    audio: "Audio",
    bgm: "BGM",
    sfx: "SFX",
    accessibility: "Accessibility",
    reducedMotion: "Reduced motion",
    textScale: "Text size",
    resetSave: "Clear Save",
    resetTitle: "Clear Save",
    resetConfirm: "Clear the current pet progress?",
    resetDone: "Save data cleared",
    saved: "Settings saved"
  },
  themes: {
    candy: "Candy",
    ocean: "Ocean",
    forest: "Forest",
    night: "Night",
    sunset: "Sunset"
  }
};
