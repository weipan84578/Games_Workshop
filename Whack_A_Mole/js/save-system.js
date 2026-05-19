(function (app) {
  "use strict";

  const { SAVE_KEY } = app;

  class SaveSystem {
    constructor() {
      this.data = this.load();
    }

    defaultSave() {
      return {
        version: "1.0",
        settings: {
          musicVolume: 0.55,
          sfxVolume: 0.85,
          screenShake: true,
          difficulty: "normal"
        },
        progress: {
          currentLevel: 1,
          levels: { 1: { stars: 0, highScore: 0, unlocked: true } },
          totalScore: 0
        },
        stats: {
          totalMolesHit: 0,
          totalMolesMissed: 0,
          highestCombo: 0,
          gamesPlayed: 0
        }
      };
    }

    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return this.defaultSave();
        const parsed = JSON.parse(raw);
        return { ...this.defaultSave(), ...parsed };
      } catch {
        return this.defaultSave();
      }
    }

    save() {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    }

    reset() {
      localStorage.removeItem(SAVE_KEY);
      this.data = this.defaultSave();
      this.save();
    }
  }

  app.SaveSystem = SaveSystem;
})(window.MoleMayhem = window.MoleMayhem || {});
