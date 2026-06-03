/* js/main.js */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Canvas and Game Controller
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error("Canvas element '#game-canvas' not found.");
      return;
    }
    
    const game = new Game(canvas);

    // 2. Initialize Inputs (Keyboard + Virtual Controls)
    GameInput.init();

    // 3. Setup Screens State Machine
    const stateManager = new StateManager(game);

    // 4. Wire DOM interfaces
    window.MenuUI.init(stateManager);
    window.PauseUI.init(stateManager);
    window.GameOverUI.init(stateManager);
    window.SettingsUI.init(stateManager, game);
    window.HelpUI.init(stateManager);
    window.HudUI.init(game);

    // 5. Autoplay Bypass: unlock audio context on first user click or tap
    const unlockAudio = () => {
      window.AudioManager.init();
      window.AudioManager.resumeContext();
      
      // Bind hover sounds for dynamically updated buttons once audio is loaded
      window.MenuUI.bindHoverSounds();

      // Clean up event listeners
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    // 6. Enter Main Menu State
    stateManager.transitionTo(window.GameStates.MENU);
    
    console.log("Space Invaders initialised and running.");
  });
})();
