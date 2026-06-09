(function () {
  const HelpScreen = {
    render() {
      const app = Pong.DOM.setApp(`
        <main class="screen screen-scroll help-screen">
          <div class="screen-inner">
            <h1 class="subtitle">說明</h1>
            <section class="content-panel help-grid body-copy">
              <div class="help-section">
                <h3>操控</h3>
                <p>鍵盤使用 ↑ ↓ 或 W S 移動左側球拍；行動裝置可滑動 Canvas 左半部，也可使用左側方向鍵。</p>
              </div>
              <div class="help-section">
                <h3>規則</h3>
                <p>上下邊界會反彈，左右邊界為得分區。率先達到設定目標分數者獲勝。</p>
              </div>
              <div class="help-section">
                <h3>AI 難度</h3>
                <p>簡單模式反應慢且誤差大；普通模式較穩定；困難模式會預測反彈落點，但仍保留可被擊敗的失誤率。</p>
              </div>
              <div class="help-section">
                <h3>快捷鍵</h3>
                <p>ESC 暫停或繼續，M 靜音切換，R 在遊戲中重新開始。</p>
              </div>
              <div class="grid-2">
                ${Pong.DOM.button("返回主選單", { action: "back" })}
                ${Pong.DOM.button("開始遊戲", { action: "start" })}
              </div>
            </section>
          </div>
        </main>
      `);

      Pong.Audio.playMusic("menu_theme");
      Pong.DOM.bindClicks(app, {
        back: () => {
          Pong.Audio.playSfx("menu_close");
          Pong.ScreenManager.show("mainMenu");
        },
        start: () => {
          Pong.ScreenManager.show("mainMenu");
          Pong.MainMenu.openDifficulty();
        }
      });
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.HelpScreen = HelpScreen;
})();
