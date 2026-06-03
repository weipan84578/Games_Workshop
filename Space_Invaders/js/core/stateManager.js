/* js/core/stateManager.js */
(function() {
  const States = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    SETTINGS: 'SETTINGS',
    HELP: 'HELP',
    GAMEOVER: 'GAMEOVER'
  };

  class StateManager {
    constructor(game) {
      this.game = game;
      this.currentState = States.MENU;

      // Overlay DOM handles
      this.screens = {};
      this.canvas = document.getElementById('game-canvas');
      this.hud = document.getElementById('game-hud');

      this.init();
    }

    init() {
      // Find DOM overlays
      this.screens[States.MENU] = document.getElementById('screen-menu');
      this.screens[States.SETTINGS] = document.getElementById('screen-settings');
      this.screens[States.HELP] = document.getElementById('screen-help');
      this.screens[States.PAUSED] = document.getElementById('screen-paused');
      this.screens[States.GAMEOVER] = document.getElementById('screen-gameover');

      // Sync game triggers
      this.game.onStateChange = (newState, params) => {
        this.transitionTo(newState, params);
      };

      // Set input callback for Escape / Pause key
      GameInput.onPress('pause', () => {
        if (this.currentState === States.PLAYING) {
          this.transitionTo(States.PAUSED);
        } else if (this.currentState === States.PAUSED) {
          this.transitionTo(States.PLAYING);
        }
      });
    }

    transitionTo(nextState, params = {}) {
      console.log(`State transition: ${this.currentState} -> ${nextState}`);

      // Handle leaving current states
      this.exitState(this.currentState, nextState);

      // Set current state
      const prevState = this.currentState;
      this.currentState = nextState;

      // Update body class for styling adjustments (like showing mobile controllers)
      document.body.className = `state-${nextState.toLowerCase()}`;

      // Handle entering new states
      this.enterState(nextState, prevState, params);
    }

    exitState(state, nextState) {
      // Hide current screen overlay if it exists
      if (this.screens[state]) {
        this.screens[state].classList.add('hidden');
      }

      if (state === States.PLAYING && nextState !== States.PAUSED) {
        this.game.loop.stop();
        window.AudioManager.stopUfoFlySfx();
      }

      if (state === States.PAUSED) {
        window.AudioManager.duckMusic(false); // Restore music volume
      }
    }

    enterState(state, prevState, params) {
      // Show destination screen overlay if it exists
      if (this.screens[state]) {
        this.screens[state].classList.remove('hidden');
      }

      // Sync BGM
      this.handleStateAudio(state, prevState);

      switch (state) {
        case States.MENU:
          // Canvas and HUD remain hidden
          this.canvas.classList.add('hidden');
          this.hud.classList.add('hidden');
          
          // Recheck continue button availability
          if (window.MenuUI) {
            window.MenuUI.updateContinueButton();
          }
          break;

        case States.SETTINGS:
          // Settings screen shown
          if (window.SettingsUI) {
            window.SettingsUI.loadCurrentSettings();
          }
          break;

        case States.HELP:
          // Help screen shown
          break;

        case States.PLAYING:
          // Make canvas and HUD visible
          this.canvas.classList.remove('hidden');
          this.hud.classList.remove('hidden');
          
          // If entering playing from MENU, we initialize a new game or load game
          if (prevState === States.MENU) {
            if (params.continueGame && GameStorage.hasGameSave()) {
              const saveData = GameStorage.loadGame();
              this.game.loadSavedGame(saveData);
            } else {
              this.game.initNewGame();
            }
          }
          
          // Start physics calculations
          this.game.loop.start();
          break;

        case States.PAUSED:
          // Pause screen overlaps the active canvas (which remains visible in the background)
          this.canvas.classList.remove('hidden');
          this.hud.classList.remove('hidden');
          this.game.loop.stop();
          this.game.saveCurrentProgress(); // Auto save when pausing
          break;

        case States.GAMEOVER:
          this.canvas.classList.add('hidden');
          this.hud.classList.add('hidden');
          
          // Show scores in Game Over DOM UI
          if (window.GameOverUI) {
            window.GameOverUI.show(params.score, params.highscore, params.isNewRecord);
          }
          break;
      }
    }

    handleStateAudio(state, prevState) {
      switch (state) {
        case States.MENU:
        case States.SETTINGS:
        case States.HELP:
          // Share menu music loop, will keep playing without restarting
          window.AudioManager.playMusic('menu-theme');
          break;
          
        case States.PLAYING:
          // Gameplay has no melodic BGM track, it uses alien marching steps
          // Or if wave is high, play boss theme!
          if (this.game.level >= 5) {
            window.AudioManager.playMusic('boss-theme');
          } else {
            window.AudioManager.playMusic('gameplay-theme');
          }
          break;
          
        case States.PAUSED:
          // Duck the music slightly (gameplay theme has no melody, but this is good design for boss-theme)
          window.AudioManager.duckMusic(true);
          break;
          
        case States.GAMEOVER:
          window.AudioManager.playMusic('gameover-theme');
          break;
      }
    }
  }

  window.StateManager = StateManager;
  window.GameStates = States;
})();
