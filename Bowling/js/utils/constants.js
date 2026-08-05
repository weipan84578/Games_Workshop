export const GAME_VERSION = 1;
export const MAX_FRAMES = 10;
export const PINS_PER_FRAME = 10;

export const SCREENS = Object.freeze({
  MENU: "main-menu",
  GAME: "game",
  INSTRUCTIONS: "instructions",
  SETTINGS: "settings",
});

export const DEFAULT_SETTINGS = Object.freeze({
  language: "zh",
  theme: "cute",
  bgmVolume: 0.5,
  sfxVolume: 0.7,
  vibration: true,
  controlPreference: "drag",
});

export const THEMES = Object.freeze(["cute", "ocean", "sunset", "forest", "night"]);
export const LANGUAGES = Object.freeze(["zh", "en", "ja"]);

// Normalized coordinates: x is lane position and y increases toward the player.
export const PIN_LAYOUT = Object.freeze([
  { x: 0.5, y: 0.18 },
  { x: 0.455, y: 0.23 },
  { x: 0.545, y: 0.23 },
  { x: 0.41, y: 0.28 },
  { x: 0.5, y: 0.28 },
  { x: 0.59, y: 0.28 },
  { x: 0.365, y: 0.33 },
  { x: 0.455, y: 0.33 },
  { x: 0.545, y: 0.33 },
  { x: 0.635, y: 0.33 },
]);

export const BALL_START = Object.freeze({ x: 0.5, y: 0.9 });
export const BALL_RADIUS = 0.035;
export const GAME_BGM_GAIN_MULTIPLIER = 10;
export const MAX_SAFE_GAIN = 3;

export function createInitialGameState(settings = DEFAULT_SETTINGS) {
  return {
    version: GAME_VERSION,
    rolls: [],
    currentFrame: 1,
    theme: settings.theme,
    language: settings.language,
    updatedAt: Date.now(),
  };
}
