import { DEFAULT_SETTINGS, GAME_VERSION, LANGUAGES, THEMES } from "./constants.js";
import { isValidRollSequence } from "../core/scoring.js";

export const SAVE_KEY = "bowling_save_v1";
export const SETTINGS_KEY = "bowling_settings_v1";

export function getStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function parseObject(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function isValidGameState(state) {
  return Boolean(
    state &&
    typeof state === "object" &&
    (state.version === undefined || state.version === GAME_VERSION) &&
    isValidRollSequence(state.rolls),
  );
}

export function saveProgress(state, storage) {
  const target = getStorage(storage);
  if (!target || !isValidGameState(state)) return false;
  try {
    target.setItem(SAVE_KEY, JSON.stringify({ ...state, version: GAME_VERSION, updatedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function loadProgress(storage) {
  const target = getStorage(storage);
  if (!target) return null;
  try {
    const state = parseObject(target.getItem(SAVE_KEY));
    return isValidGameState(state) ? state : null;
  } catch {
    return null;
  }
}

export function hasSavedProgress(storage) {
  const progress = loadProgress(storage);
  return Boolean(progress && progress.rolls.length > 0);
}

export function clearProgress(storage) {
  const target = getStorage(storage);
  try {
    target?.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function normalizeSettings(settings = {}) {
  const next = { ...DEFAULT_SETTINGS, ...settings };
  return {
    language: LANGUAGES.includes(next.language) ? next.language : DEFAULT_SETTINGS.language,
    theme: THEMES.includes(next.theme) ? next.theme : DEFAULT_SETTINGS.theme,
    bgmVolume: Math.min(1, Math.max(0, Number(next.bgmVolume) || 0)),
    sfxVolume: Math.min(1, Math.max(0, Number(next.sfxVolume) || 0)),
    vibration: Boolean(next.vibration),
    controlPreference: next.controlPreference === "buttons" ? "buttons" : "drag",
  };
}

export function saveSettings(settings, storage) {
  const target = getStorage(storage);
  if (!target) return false;
  try {
    target.setItem(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
    return true;
  } catch {
    return false;
  }
}

export function loadSettings(storage) {
  const target = getStorage(storage);
  if (!target) return { ...DEFAULT_SETTINGS };
  try {
    return normalizeSettings(parseObject(target.getItem(SETTINGS_KEY)) || {});
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
