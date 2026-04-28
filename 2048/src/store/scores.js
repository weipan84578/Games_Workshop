const SCORES_KEY = '2048_scores';
const BEST_KEY = '2048_best';
const STATS_KEY = '2048_stats';

const ScoresStore = (() => {
  function getRecords() {
    try { return JSON.parse(localStorage.getItem(SCORES_KEY)) || []; } catch { return []; }
  }

  function getBest() {
    return parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
  }

  function getStats() {
    try {
      return JSON.parse(localStorage.getItem(STATS_KEY)) || {
        totalGames: 0, totalMoves: 0, wins: 0, bestScore: 0,
      };
    } catch {
      return { totalGames: 0, totalMoves: 0, wins: 0, bestScore: 0 };
    }
  }

  function saveRecord(record) {
    const records = getRecords();
    records.unshift(record);
    if (records.length > 20) records.length = 20;
    localStorage.setItem(SCORES_KEY, JSON.stringify(records));

    const currentBest = getBest();
    if (record.score > currentBest) {
      localStorage.setItem(BEST_KEY, String(record.score));
    }

    const stats = getStats();
    stats.totalGames++;
    stats.totalMoves += record.moves;
    if (record.won) stats.wins++;
    if (record.score > stats.bestScore) stats.bestScore = record.score;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  function getTopTen() {
    return [...getRecords()].sort((a, b) => b.score - a.score).slice(0, 10);
  }

  return { getRecords, getBest, getStats, saveRecord, getTopTen };
})();
