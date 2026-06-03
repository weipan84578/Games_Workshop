/* js/ui/menu.js */
(function() {
  // 1. MAIN MENU CONTROLLER
  window.MenuUI = {
    init: function(stateManager) {
      this.stateManager = stateManager;

      const btnNewGame = document.getElementById('btn-new-game');
      const btnContinue = document.getElementById('btn-continue');
      const btnHelp = document.getElementById('btn-help');
      const btnSettings = document.getElementById('btn-settings');

      if (btnNewGame) {
        btnNewGame.addEventListener('click', () => {
          window.AudioManager.playSfx('game-start');
          this.stateManager.transitionTo(window.GameStates.PLAYING, { continueGame: false });
        });
      }

      if (btnContinue) {
        btnContinue.addEventListener('click', () => {
          if (GameStorage.hasGameSave()) {
            window.AudioManager.playSfx('ui-click');
            this.stateManager.transitionTo(window.GameStates.PLAYING, { continueGame: true });
          }
        });
      }

      if (btnHelp) {
        btnHelp.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          this.stateManager.transitionTo(window.GameStates.HELP);
        });
      }

      if (btnSettings) {
        btnSettings.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          this.stateManager.transitionTo(window.GameStates.SETTINGS);
        });
      }

      this.bindHoverSounds();
      this.updateContinueButton();
    },

    updateContinueButton: function() {
      const btnContinue = document.getElementById('btn-continue');
      if (btnContinue) {
        const hasSave = GameStorage.hasGameSave();
        btnContinue.disabled = !hasSave;
      }
    },

    bindHoverSounds: function() {
      const buttons = document.querySelectorAll('.btn-retro, .btn-pause-quick, .select-retro, .checkbox-retro');
      buttons.forEach(btn => {
        if (btn.dataset.hoverBound) return;
        btn.dataset.hoverBound = "true";

        btn.addEventListener('mouseenter', () => {
          if (!btn.disabled) {
            window.AudioManager.playSfx('ui-hover');
          }
        });
      });
    }
  };

  // 2. PAUSE MENU CONTROLLER
  window.PauseUI = {
    init: function(stateManager) {
      this.stateManager = stateManager;

      const btnResume = document.getElementById('btn-resume');
      const btnQuitPaused = document.getElementById('btn-quit-paused');

      if (btnResume) {
        btnResume.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          this.stateManager.transitionTo(window.GameStates.PLAYING);
        });
      }

      if (btnQuitPaused) {
        btnQuitPaused.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          // State transition automatically saves game progress
          this.stateManager.transitionTo(window.GameStates.MENU);
        });
      }
    }
  };

  // 3. GAMEOVER MENU CONTROLLER
  window.GameOverUI = {
    init: function(stateManager) {
      this.stateManager = stateManager;

      const btnRestart = document.getElementById('btn-restart');
      const btnQuitGameOver = document.getElementById('btn-quit-gameover');

      if (btnRestart) {
        btnRestart.addEventListener('click', () => {
          window.AudioManager.playSfx('game-start');
          this.stateManager.transitionTo(window.GameStates.PLAYING, { continueGame: false });
        });
      }

      if (btnQuitGameOver) {
        btnQuitGameOver.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          this.stateManager.transitionTo(window.GameStates.MENU);
        });
      }
    },

    show: function(score, highscore, isNewRecord) {
      const elFinalScore = document.getElementById('gameover-final-score');
      const elHighScore = document.getElementById('gameover-high-score');
      const elNewRecordTag = document.getElementById('gameover-new-record');

      if (elFinalScore) {
        elFinalScore.textContent = score.toString();
      }

      if (elHighScore) {
        elHighScore.textContent = highscore.toString();
      }

      if (elNewRecordTag) {
        if (isNewRecord) {
          elNewRecordTag.classList.remove('hidden');
        } else {
          elNewRecordTag.classList.add('hidden');
        }
      }
    }
  };
})();
