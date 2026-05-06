const SETTINGS_KEY = "blackjack_settings";
const RECORDS_KEY = "blackjack_records";

export const DEFAULT_SETTINGS = {
  aiCount: 1,
  difficulty: "normal",
  deckCount: 6,
  startingChips: 1000,
  musicVolume: 0.8,
  sfxVolume: 0.6
};

const DEFAULT_RECORDS = {
  highScore: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  leaderboard: []
};

function readJson(key, fallback) {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") };
  } catch {
    return { ...fallback };
  }
}

export function loadSettings() {
  return readJson(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings) {
  const next = {
    aiCount: Number(settings.aiCount),
    difficulty: settings.difficulty,
    deckCount: Number(settings.deckCount),
    startingChips: Number(settings.startingChips),
    musicVolume: Number(settings.musicVolume),
    sfxVolume: Number(settings.sfxVolume),
    lastUpdated: Date.now()
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

export function loadRecords() {
  const records = readJson(RECORDS_KEY, DEFAULT_RECORDS);
  records.leaderboard = Array.isArray(records.leaderboard) ? records.leaderboard : [];
  return records;
}

export function saveRoundRecord(score, won) {
  const records = loadRecords();
  records.gamesPlayed += 1;
  records.gamesWon += won ? 1 : 0;
  records.highScore = Math.max(records.highScore, score);
  records.leaderboard = [
    { score, date: new Date().toISOString().slice(0, 10) },
    ...records.leaderboard
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return records;
}
