'use strict';

const Storage = (() => {
  const NS = 'tetris_';
  let available = true;

  try { localStorage.setItem('__test__', '1'); localStorage.removeItem('__test__'); }
  catch(e) { available = false; }

  const defaultSettings = {
    bgmVolume: 0.6, sfxVolume: 0.8,
    bgmEnabled: true, sfxEnabled: true,
    ghostPiece: true, das: 167, arr: 33
  };

  function getSettings() {
    if (!available) return { ...defaultSettings };
    try {
      const raw = localStorage.getItem(NS + 'settings');
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
    } catch(e) { return { ...defaultSettings }; }
  }

  function saveSettings(s) {
    if (!available) return;
    try { localStorage.setItem(NS + 'settings', JSON.stringify(s)); } catch(e) {}
  }

  function getHighScores() {
    if (!available) return [];
    try {
      const raw = localStorage.getItem(NS + 'highscores');
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function saveHighScore(entry) {
    if (!available) return false;
    const scores = getHighScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10);
    scores.forEach((s, i) => s.rank = i + 1);
    try { localStorage.setItem(NS + 'highscores', JSON.stringify(scores)); return true; }
    catch(e) { return false; }
  }

  function clearHighScores() {
    if (!available) return;
    try { localStorage.removeItem(NS + 'highscores'); } catch(e) {}
  }

  function getBestScore() {
    const scores = getHighScores();
    return scores.length ? scores[0].score : 0;
  }

  return { getSettings, saveSettings, getHighScores, saveHighScore, clearHighScores, getBestScore, available };
})();
