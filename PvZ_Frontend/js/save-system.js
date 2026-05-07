class SaveSystem {
  static defaultSave() {
    return {
      version: '1.0.0',
      highScores: [],
      unlockedLevels: [1],
      settings: { masterVolume: .8, musicVolume: .45, sfxVolume: .8, vibration: true },
      lastPlay: null
    };
  }
  static load() {
    try { return { ...SaveSystem.defaultSave(), ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') }; }
    catch { return SaveSystem.defaultSave(); }
  }
  static save(data) { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); }
  static recordScore(level, score) {
    const save = SaveSystem.load();
    save.highScores = [{ level, score, date: new Date().toISOString().slice(0, 10) }, ...save.highScores]
      .sort((a, b) => b.score - a.score).slice(0, 10);
    const nextLevel = Math.min(MAX_LEVEL, level + 1);
    if (level < MAX_LEVEL && !save.unlockedLevels.includes(nextLevel)) save.unlockedLevels.push(nextLevel);
    save.lastPlay = null;
    SaveSystem.save(save);
  }
}

