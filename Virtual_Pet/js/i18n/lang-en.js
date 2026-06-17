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
    encyclopedia: "Dex",
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
    warm: "Warm",
    feed: "Feed",
    play: "Play",
    clean: "Clean",
    sleep: "Sleep",
    pet: "Pet",
    train: "Train"
  },
  actionMessages: {
    eggChosen: "Egg chosen. Keep it warm and wait for it to hatch.",
    warm: "The egg warmed up. Something moved inside.",
    hatched: "{pet} hatched!",
    feed: "A good meal brightened the room.",
    play: "That was fun, but it used some energy.",
    clean: "Fresh and clean.",
    sleep: "A short nap restored energy.",
    pet: "Your pet likes the attention.",
    train: "Training complete. Growth moved faster.",
    blocked: "Your pet needs a moment first.",
    levelup: "Growth stage unlocked.",
    elder: "Your pet entered elder age. Health will slowly fall.",
    death: "Your pet quietly finished its life.",
    warning: "Some stats are low. Your pet needs care."
  },
  speech: {
    ready: "I want to stay with you today.",
    happy: "Feeling good. Let's play again.",
    normal: "A calm day in the room.",
    sad: "A little low. Care would help.",
    sick: "Not feeling well. Please help.",
    sleeping: "Zzz...",
    dead: "This life journey has ended."
  },
  game: {
    petRoom: "Pet Room",
    stage: "Stage",
    species: "Species",
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
    juvenile: "Juvenile",
    mature: "Mature",
    prime: "Prime",
    elder: "Elder"
  },
  eggSelection: {
    kicker: "New Life",
    title: "Choose an Egg",
    lede: "Each egg hides an unknown life. You will only know what it is after it hatches.",
    mysteryEgg: "Mystery Egg",
    unknown: "Unknown until hatch",
    eggs: {
      ember: "Ember Egg",
      tide: "Tide Egg",
      meadow: "Meadow Egg",
      moon: "Moon Egg",
      crystal: "Crystal Egg"
    }
  },
  encyclopedia: {
    title: "Care Dex",
    summary: "Pets successfully raised to elder age unlock here.",
    lockedName: "Locked",
    lockedHint: "Raise one successfully",
    raisedAt: "Unlocked {time}"
  },
  families: {
    dragon: "Dragon",
    fish: "Fish",
    cat: "Cat",
    dog: "Dog",
    cow: "Cow",
    bird: "Bird",
    rabbit: "Rabbit",
    fox: "Fox",
    turtle: "Turtle",
    unicorn: "Unicorn"
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
        { icon: "🔥", title: "Warm", body: "Eggs can only be warmed and petted. Warmth moves hatching forward." },
        { icon: "🍙", title: "Feed", body: "After hatching, fullness rises by 30." },
        { icon: "🎾", title: "Play", body: "Mood rises by 25, while energy and clean drop." },
        { icon: "🫧", title: "Clean", body: "Clean rises by 40 and mood improves slightly." },
        { icon: "🌙", title: "Sleep", body: "Energy rises by 50 and the pet rests briefly." },
        { icon: "🤍", title: "Pet", body: "Mood rises by 10 with a gentle interaction." },
        { icon: "⭐", title: "Train", body: "Unlocked from mature age. It grows fast but costs energy." },
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
        { icon: "🥚", title: "Egg", body: "Choose an egg first. The pet stays unknown until hatch." },
        { icon: "🌱", title: "Juvenile", body: "Energy drains slowly, so it can play often." },
        { icon: "⭐", title: "Mature", body: "The most balanced phase. Training unlocks here." },
        { icon: "🏅", title: "Prime", body: "Stable growth, but care rhythm matters more." },
        { icon: "🍂", title: "Elder", body: "Health slowly falls until natural death and a new start." }
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
