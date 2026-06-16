const KEY = 'wsp_save';

const DEFAULT_SAVE = {
  version: '1.0.0',
  lastPlayed: null,
  progress: {
    easy: { cleared: [], stars: {} },
    normal: { cleared: [], stars: {} },
    hard: { cleared: [], stars: {} },
  },
};

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function normalize(save) {
  return {
    ...clone(DEFAULT_SAVE),
    ...save,
    progress: {
      easy: { ...DEFAULT_SAVE.progress.easy, ...(save?.progress?.easy ?? {}) },
      normal: { ...DEFAULT_SAVE.progress.normal, ...(save?.progress?.normal ?? {}) },
      hard: { ...DEFAULT_SAVE.progress.hard, ...(save?.progress?.hard ?? {}) },
    },
  };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : clone(DEFAULT_SAVE);
  } catch {
    return clone(DEFAULT_SAVE);
  }
}

function write(save) {
  const normalized = normalize(save);
  try {
    localStorage.setItem(KEY, JSON.stringify(normalized));
  } catch {
    // Ignore storage failures and keep the current in-memory flow working.
  }
  return normalized;
}

export const SaveManager = {
  load() {
    return read();
  },
  save(gameState) {
    const save = read();
    save.lastPlayed = {
      difficulty: gameState.difficulty,
      levelId: gameState.levelId,
      tubes: gameState.tubes,
      moves: gameState.moves,
      time: gameState.time,
      hintsUsed: gameState.hintsUsed,
      undoCount: gameState.undoCount,
      savedAt: Date.now(),
    };
    return write(save);
  },
  getLastSave() {
    return read().lastPlayed;
  },
  clearSave() {
    const save = read();
    save.lastPlayed = null;
    return write(save);
  },
  clearAll() {
    return write(clone(DEFAULT_SAVE));
  },
  markLevelCleared(diff, levelId, stars) {
    const save = read();
    const progress = save.progress[diff] ?? { cleared: [], stars: {} };
    if (!progress.cleared.includes(levelId)) progress.cleared.push(levelId);
    progress.stars[levelId] = Math.max(Number(progress.stars[levelId] ?? 0), stars);
    save.progress[diff] = progress;
    if (save.lastPlayed?.difficulty === diff && save.lastPlayed?.levelId === levelId) {
      save.lastPlayed = null;
    }
    return write(save);
  },
};
