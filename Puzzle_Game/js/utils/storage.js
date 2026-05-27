import { APP_VERSION, SAVE_KEY } from "./constants.js";

export function saveGameSnapshot(snapshot) {
  try {
    sessionStorage.setItem(SAVE_KEY, JSON.stringify({
      version: APP_VERSION,
      timestamp: Date.now(),
      ...snapshot
    }));
    return true;
  } catch {
    return false;
  }
}

export function loadGameSnapshot() {
  try {
    const raw = sessionStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.version ? parsed : null;
  } catch {
    return null;
  }
}

export function clearGameSnapshot() {
  try {
    sessionStorage.removeItem(SAVE_KEY);
  } catch {
    // Session storage can be disabled by the browser.
  }
}

export function hasGameSnapshot() {
  return Boolean(loadGameSnapshot());
}
