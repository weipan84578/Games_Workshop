const SETTINGS_KEY = "shootingGame.settings";
const LEADERBOARD_KEY = "shootingGame.leaderboard";

function loadSettings() {
  const fallback = {
    musicVolume: 45,
    sfxVolume: 70,
    difficulty: "normal",
    language: "zh",
    fxEnabled: true,
    muted: false
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Some browsers restrict localStorage for file:// pages.
  }
}

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
  } catch {
    return [];
  }
}

function addLeaderboardEntry(entry) {
  const rows = loadLeaderboard();
  rows.push({ ...entry, date: new Date().toISOString().slice(0, 10) });
  rows.sort((a, b) => b.score - a.score);
  const next = rows.slice(0, 10);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));
  } catch {
    // Keep the current in-memory result path working when storage is blocked.
  }
  return next;
}
