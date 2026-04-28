const App = (() => {
  const screens = ['home', 'game', 'settings', 'leaderboard', 'howto'];
  let confirmCallback = null;

  function showScreen(name) {
    screens.forEach(s => {
      const el = document.getElementById('screen-' + s);
      if (el) el.classList.toggle('active', s === name);
    });
  }

  function confirm(msg, callback) {
    document.getElementById('confirm-msg').textContent = msg;
    confirmCallback = callback;
    document.getElementById('overlay-confirm').classList.remove('hidden');
  }

  function init() {
    AudioEngine.init();

    const muted = SettingsStore.get('muted');
    if (muted) AudioEngine.setMuted(true);

    Renderer.applyTheme();
    AudioEngine.applyVolumes();

    InputHandler.init(null);
    HomeScreen.init();

    document.getElementById('btn-confirm-ok').onclick = () => {
      document.getElementById('overlay-confirm').classList.add('hidden');
      if (confirmCallback) { confirmCallback(); confirmCallback = null; }
    };
    document.getElementById('btn-confirm-cancel').onclick = () => {
      document.getElementById('overlay-confirm').classList.add('hidden');
      confirmCallback = null;
    };

    showScreen('home');
  }

  document.addEventListener('DOMContentLoaded', init);

  return { showScreen, confirm };
})();
