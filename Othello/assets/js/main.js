// Application bootstrap sequence.
document.addEventListener('DOMContentLoaded', () => {
      StorageManager.init();
      UIManager.init();
      AudioEngine.init();
      GameEngine.init();
      UIManager.render();
      UIManager.showScreen('home');
    });
