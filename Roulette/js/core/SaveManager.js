(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { STORAGE_KEY, safeStorageGet, safeStorageSet, structuredCloneSafe } = R;

  class SaveManager {
    save(settings, gameState) {
      const data = {
        version: "1.0.0",
        savedAt: new Date().toISOString(),
        settings: { ...settings },
        game: structuredCloneSafe(gameState),
      };
      data.game.wheel.isSpinning = false;
      return safeStorageSet(STORAGE_KEY, JSON.stringify(data));
    }

    load() {
      const raw = safeStorageGet(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }

    hasSave() {
      return Boolean(safeStorageGet(STORAGE_KEY));
    }
  }

  Object.assign(R, { SaveManager });
})();
