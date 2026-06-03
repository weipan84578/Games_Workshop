/* js/ui/settings.js */
(function() {
  window.SettingsUI = {
    init: function(stateManager, game) {
      this.stateManager = stateManager;
      this.game = game;

      // DOM Elements
      this.musicSlider = document.getElementById('music-volume');
      this.sfxSlider = document.getElementById('sfx-volume');
      this.muteCheckbox = document.getElementById('mute-switch');
      this.themeSelect = document.getElementById('theme-select');
      this.difficultySelect = document.getElementById('difficulty-select');
      
      const btnResetHigh = document.getElementById('btn-reset-high');
      const btnBack = document.getElementById('btn-back-settings');

      // 1. Hook inputs
      if (this.musicSlider) {
        this.musicSlider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          window.AudioManager.setMusicVolume(val);
          GameStorage.saveSettings({ musicVol: val });
        });
      }

      if (this.sfxSlider) {
        this.sfxSlider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          window.AudioManager.setSfxVolume(val);
          GameStorage.saveSettings({ sfxVol: val });
        });
        // Play a little blip test when releasing slider to let player hear the level
        this.sfxSlider.addEventListener('change', () => {
          window.AudioManager.playSfx('shoot');
        });
      }

      if (this.muteCheckbox) {
        this.muteCheckbox.addEventListener('change', (e) => {
          const checked = e.target.checked;
          window.AudioManager.muteAll(checked);
          GameStorage.saveSettings({ muted: checked });
        });
      }

      if (this.themeSelect) {
        this.themeSelect.addEventListener('change', (e) => {
          const themeId = e.target.value;
          document.body.setAttribute('data-theme', themeId);
          GameStorage.saveSettings({ theme: themeId });
          
          // Propagate immediately to game canvas rendering color palette
          this.game.syncColors();
        });
      }

      if (this.difficultySelect) {
        this.difficultySelect.addEventListener('change', (e) => {
          const diff = e.target.value;
          GameStorage.saveSettings({ difficulty: diff });
        });
      }

      if (btnResetHigh) {
        btnResetHigh.addEventListener('click', () => {
          if (confirm('確定要清除最高得分紀錄嗎？')) {
            window.AudioManager.playSfx('ui-click');
            GameStorage.resetHighScore();
            alert('最高分數已歸零！');
            this.game.updateHud();
          }
        });
      }

      if (btnBack) {
        btnBack.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          this.stateManager.transitionTo(window.GameStates.MENU);
        });
      }

      // Populate themes dropdown options dynamically
      this.populateThemeOptions();
      
      // Load initial settings
      this.loadCurrentSettings();
    },

    populateThemeOptions: function() {
      if (!this.themeSelect) return;
      this.themeSelect.innerHTML = "";
      
      GameConfig.THEMES.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        this.themeSelect.appendChild(option);
      });
    },

    loadCurrentSettings: function() {
      const settings = GameStorage.getSettings();

      // Apply states to UI DOM controls
      if (this.musicSlider) this.musicSlider.value = settings.musicVol;
      if (this.sfxSlider) this.sfxSlider.value = settings.sfxVol;
      if (this.muteCheckbox) this.muteCheckbox.checked = settings.muted;
      if (this.themeSelect) this.themeSelect.value = settings.theme;
      if (this.difficultySelect) this.difficultySelect.value = settings.difficulty;

      // Sync settings to active engine components
      document.body.setAttribute('data-theme', settings.theme);
      window.AudioManager.setMusicVolume(settings.musicVol);
      window.AudioManager.setSfxVolume(settings.sfxVol);
      window.AudioManager.muteAll(settings.muted);
      this.game.syncColors();
    }
  };
})();
