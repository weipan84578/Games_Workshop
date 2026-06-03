/* js/ui/hud.js */
(function() {
  window.HudUI = {
    init: function(game) {
      const elScore = document.getElementById('hud-score');
      const elHighScore = document.getElementById('hud-highscore');
      const elLevel = document.getElementById('hud-level');
      const elLivesContainer = document.getElementById('hud-lives-container');

      // Hook game controller events
      game.onHudUpdate = (score, highscore, lives, level) => {
        // Pad numbers to match retro styling (e.g. 0080, 0000)
        if (elScore) {
          elScore.textContent = score.toString().padStart(4, '0');
        }

        if (elHighScore) {
          elHighScore.textContent = highscore.toString().padStart(4, '0');
        }

        if (elLevel) {
          elLevel.textContent = level.toString().padStart(2, '0');
        }

        // Recreate health/lives icons dynamically
        if (elLivesContainer) {
          elLivesContainer.innerHTML = "";
          // Constrain loop in case lives goes very high to avoid layout overflow
          const displayLives = Math.min(lives, 8); 
          
          for (let i = 0; i < displayLives; i++) {
            const icon = document.createElement('span');
            icon.className = 'hud-life-icon';
            elLivesContainer.appendChild(icon);
          }
          
          // If lives exceed 8, print "+X" text indicator
          if (lives > 8) {
            const extraCount = document.createElement('span');
            extraCount.style.fontSize = 'var(--font-size-xs)';
            extraCount.style.marginLeft = '4px';
            extraCount.textContent = `+${lives - 8}`;
            elLivesContainer.appendChild(extraCount);
          }
        }
      };
    }
  };
})();
