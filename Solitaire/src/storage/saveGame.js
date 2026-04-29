const KEY = 'sol_save_game';

export function hasSave() {
  try { return !!localStorage.getItem(KEY); } catch { return false; }
}

export function saveGame(state) {
  try {
    const save = { ...state, timestamp: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(save));
    return true;
  } catch (e) {
    console.warn('Cannot save game:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    clearSave();
    return null;
  }
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch {}
}
