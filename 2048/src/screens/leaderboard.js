const LeaderboardScreen = (() => {
  function render() {
    document.getElementById('btn-lb-back').onclick = () => {
      AudioEngine.buttonClick();
      App.showScreen('home');
      HomeScreen.refresh();
    };

    const stats = ScoresStore.getStats();
    const top = ScoresStore.getTopTen();

    document.getElementById('lb-stats').innerHTML = `
      <div class="stat-box"><span class="stat-label">總局數</span><span class="stat-val">${stats.totalGames}</span></div>
      <div class="stat-box"><span class="stat-label">最高分</span><span class="stat-val">${stats.bestScore.toLocaleString()}</span></div>
      <div class="stat-box"><span class="stat-label">勝利次數</span><span class="stat-val">${stats.wins}</span></div>
      <div class="stat-box"><span class="stat-label">平均步數</span><span class="stat-val">${stats.totalGames ? Math.round(stats.totalMoves / stats.totalGames) : 0}</span></div>
    `;

    if (!top.length) {
      document.getElementById('lb-list').innerHTML = '<p style="padding:16px;opacity:0.6">尚無紀錄</p>';
      return;
    }

    const rows = top.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${r.score.toLocaleString()}</td>
        <td>${r.maxTile}</td>
        <td>${r.moves}</td>
        <td>${r.size}×${r.size}</td>
        <td>${r.date}</td>
      </tr>`).join('');

    document.getElementById('lb-list').innerHTML = `
      <table>
        <thead><tr><th>#</th><th>分數</th><th>最大</th><th>步數</th><th>棋盤</th><th>日期</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  return { render };
})();
