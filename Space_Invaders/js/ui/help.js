/* js/ui/help.js */
(function() {
  window.HelpUI = {
    init: function(stateManager) {
      const btnBack = document.getElementById('btn-back-help');
      const btnToggle = document.getElementById('btn-toggle-help');
      const tabBasic = document.getElementById('help-tab-basic');
      const tabDetail = document.getElementById('help-tab-detail');
      
      if (btnBack) {
        btnBack.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          
          // Reset to basic tab on exit so next entry starts on basic controls
          if (tabBasic && tabDetail && btnToggle) {
            tabBasic.classList.remove('hidden');
            tabDetail.classList.add('hidden');
            btnToggle.textContent = '切換：詳細說明';
          }
          
          stateManager.transitionTo(window.GameStates.MENU);
        });
      }

      if (btnToggle && tabBasic && tabDetail) {
        btnToggle.addEventListener('click', () => {
          window.AudioManager.playSfx('ui-click');
          if (tabBasic.classList.contains('hidden')) {
            tabBasic.classList.remove('hidden');
            tabDetail.classList.add('hidden');
            btnToggle.textContent = '切換：詳細說明';
          } else {
            tabBasic.classList.add('hidden');
            tabDetail.classList.remove('hidden');
            btnToggle.textContent = '切換：操作與得分';
          }
        });
      }
    }
  };
})();
