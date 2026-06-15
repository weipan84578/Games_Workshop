/* main.js — 啟動程序,串接所有模組(最後載入)。 */
(function (L) {
  'use strict';

  function boot() {
    // 1) 設定:載入並套用主題/音量
    L.storage.loadSettings();
    L.ui.settings.applyTheme(L.state.settings.theme);

    // 2) 音訊管理器(常駐單例)
    L.audio.init();
    L.audio.playBgm('bgm_menu');

    // 3) 輸入
    L.input.init();
    L.input.mobileControls.init();

    // 4) 主選單初始化
    L.ui.menu.init();
    L.ui.settings.refreshUI();

    // 5) 顯示主選單
    L.ui.screen.show('screen-menu', true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.Ludo);
