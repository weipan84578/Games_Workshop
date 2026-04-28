const HomeScreen = (() => {
  function init() {
    document.getElementById('home-best-score').textContent = ScoresStore.getBest().toLocaleString();

    const hasSave = !!localStorage.getItem('2048_save');
    document.getElementById('btn-continue').disabled = !hasSave;

    document.getElementById('btn-new-game').addEventListener('click', () => {
      AudioEngine.buttonClick();
      localStorage.removeItem('2048_save');
      App.showScreen('game');
      GameScreen.start(false);
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
      if (document.getElementById('btn-continue').disabled) return;
      AudioEngine.buttonClick();
      App.showScreen('game');
      GameScreen.start(true);
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      AudioEngine.buttonClick();
      App.showScreen('settings');
      SettingsScreen.init();
    });

    document.getElementById('btn-leaderboard').addEventListener('click', () => {
      AudioEngine.buttonClick();
      App.showScreen('leaderboard');
      LeaderboardScreen.render();
    });

    document.getElementById('btn-howto').addEventListener('click', () => {
      AudioEngine.buttonClick();
      App.showScreen('howto');
    });

    document.getElementById('btn-mute-home').addEventListener('click', () => {
      const muted = !AudioEngine.isMuted();
      AudioEngine.setMuted(muted);
      SettingsStore.set('muted', muted);
      document.getElementById('btn-mute-home').textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('btn-howto-back').addEventListener('click', () => {
      AudioEngine.buttonClick();
      App.showScreen('home');
      HomeScreen.refresh();
    });
  }

  function refresh() {
    document.getElementById('home-best-score').textContent = ScoresStore.getBest().toLocaleString();
    const hasSave = !!localStorage.getItem('2048_save');
    document.getElementById('btn-continue').disabled = !hasSave;
    const muted = AudioEngine.isMuted();
    document.getElementById('btn-mute-home').textContent = muted ? '🔇' : '🔊';
  }

  return { init, refresh };
})();
