(function (window) {
  'use strict';

  const ScreenManager = {
    mount() {
      const app = Helpers.qs('#app');
      if (!app || app.dataset.mounted === 'true') return;
      app.dataset.mounted = 'true';
      app.innerHTML = `
        <div class="skyline" aria-hidden="true">
          <span class="star star-a"></span>
          <span class="star star-b"></span>
          <span class="star star-c"></span>
          <span class="city city-back"></span>
          <span class="city city-front"></span>
        </div>

        <section id="screen-menu" class="screen screen-menu is-active" data-screen="menu" aria-labelledby="app-title">
          <div class="menu-shell">
            <div class="brand-mark" aria-hidden="true">
              <span class="crane-boom"></span>
              <span class="crane-cable"></span>
              <span class="crane-hook"></span>
              <span class="mini-floor floor-one"></span>
              <span class="mini-floor floor-two"></span>
              <span class="mini-floor floor-three"></span>
            </div>
            <h1 id="app-title">Stack Tower <span data-i18n="app.subtitle">堆疊高塔</span></h1>
            <p class="menu-tagline" data-i18n="menu.tagline">把每一層樓精準放上去，蓋出最高的房子。</p>

            <nav class="menu-actions" aria-label="Main menu">
              <button id="start-btn" class="btn btn-primary" type="button">
                <span class="btn-icon" aria-hidden="true">▶</span>
                <span data-i18n="menu.start">開始遊戲</span>
              </button>
              <button id="continue-btn" class="btn btn-ghost is-hidden" type="button">
                <span class="btn-icon" aria-hidden="true">⏵</span>
                <span data-i18n="menu.continue">繼續遊戲</span>
              </button>
              <button class="btn btn-ghost" data-go="leaderboard" type="button">
                <span class="btn-icon" aria-hidden="true">♛</span>
                <span data-i18n="leaderboard.title">排行榜</span>
              </button>
              <button class="btn btn-ghost" data-go="instructions" type="button">
                <span class="btn-icon" aria-hidden="true">?</span>
                <span data-i18n="menu.instructions">說明</span>
              </button>
              <button class="btn btn-ghost" data-go="settings" type="button">
                <span class="btn-icon" aria-hidden="true">⚙</span>
                <span data-i18n="menu.settings">設定</span>
              </button>
            </nav>

          </div>
        </section>

        <section id="screen-game" class="screen screen-game" data-screen="game" aria-label="Game">
          <header class="game-hud">
            <button id="back-btn" class="icon-btn" type="button" aria-label="Back">‹</button>
            <div class="hud-score" aria-live="polite">
              <span data-i18n="game.score">分數</span>
              <strong id="score-value">0</strong>
            </div>
            <div class="hud-floor">
              <span data-i18n="game.level">層數</span>
              <strong id="floor-value">0</strong>
            </div>
            <button id="mute-btn" class="icon-btn" type="button" aria-label="Mute">♪</button>
          </header>

          <div class="game-shell">
            <div id="canvas-wrap" class="canvas-wrap">
              <canvas id="game-canvas" tabindex="0" aria-label="Stack Tower game canvas"></canvas>
              <div id="game-callout" class="game-callout" aria-hidden="true"></div>
            </div>
            <div class="action-bar">
              <button id="place-btn" class="btn btn-primary place-btn" type="button">
                <span class="btn-icon" aria-hidden="true">⬇</span>
                <span data-i18n="game.place">放置樓層</span>
              </button>
            </div>
          </div>
        </section>

        <section id="screen-instructions" class="screen scroll-screen" data-screen="instructions" aria-labelledby="instructions-title">
          <div class="screen-panel">
            <div class="screen-header">
              <button class="icon-btn" data-go="menu" type="button" aria-label="Back">‹</button>
              <h2 id="instructions-title" data-i18n="menu.instructions">說明</h2>
            </div>
            <div class="guide-grid">
              <article class="guide-item">
                <h3><span aria-hidden="true">◎</span><span data-i18n="help.goalTitle">遊戲目標</span></h3>
                <p data-i18n="help.goal">抓準時機放置樓層，未對齊的部分會被切掉。越高、越準，分數越高。</p>
                <div class="goal-demo" aria-hidden="true">
                  <span class="goal-floor goal-floor-a"></span>
                  <span class="goal-floor goal-floor-b"></span>
                  <span class="goal-floor goal-floor-c"></span>
                  <span class="goal-spark spark-one"></span>
                  <span class="goal-spark spark-two"></span>
                </div>
              </article>
              <article class="guide-item">
                <h3><span aria-hidden="true">⌨</span><span data-i18n="help.controlsTitle">操作方式</span></h3>
                <div class="control-map">
                  <span><span aria-hidden="true">⌨</span><span data-i18n="help.desktop">電腦：空白鍵、Enter 或點擊畫面</span></span>
                  <span><span aria-hidden="true">▣</span><span data-i18n="help.mobile">手機：點擊畫面或底部按鈕</span></span>
                </div>
              </article>
              <article class="guide-item assist-card">
                <h3><span aria-hidden="true">╋</span><span data-i18n="help.assistTitle">前 10 層輔助</span></h3>
                <div class="assist-demo" aria-hidden="true">
                  <span class="assist-guide"></span>
                  <span class="assist-edge assist-left"></span>
                  <span class="assist-edge assist-right"></span>
                  <span class="assist-base"></span>
                  <span class="assist-moving"></span>
                  <span class="assist-badge">1-10F</span>
                </div>
                <p data-i18n="help.assist">前 10 層會顯示淡藍色對照線，幫你抓中心與左右邊界；第 11 層開始隱藏。</p>
              </article>
              <article class="guide-item">
                <h3><span aria-hidden="true">✓</span><span data-i18n="help.perfectTitle">新手完美判定</span></h3>
                <div class="perfect-demo" aria-hidden="true">
                  <span class="perfect-base"></span>
                  <span class="perfect-zone"></span>
                  <span class="perfect-moving"></span>
                  <span class="perfect-label">Perfect</span>
                </div>
                <p data-i18n="help.perfect">前 10 層 Perfect 判定比較寬鬆，偏差小於 12px 也會自動對齊；第 11 層恢復正常 2px。</p>
              </article>
              <article class="guide-item flow-demo">
                <h3><span aria-hidden="true">▤</span><span data-i18n="help.mechanicTitle">方塊機制</span></h3>
                <div class="slice-demo" aria-hidden="true">
                  <span class="demo-base"></span>
                  <span class="demo-moving"></span>
                  <span class="demo-cut"></span>
                </div>
                <p data-i18n="help.mechanic">像吊裝預製樓層一樣放上去，重疊部分留下，不重疊部分掉落。</p>
              </article>
              <article class="guide-item">
                <h3><span aria-hidden="true">★</span><span data-i18n="help.scoringTitle">計分規則</span></h3>
                <ul class="score-rules">
                  <li><span aria-hidden="true">◆</span><span data-i18n="help.scoreNormal">一般放置 +10</span></li>
                  <li><span aria-hidden="true">◇</span><span data-i18n="help.scoreGood">精準放置 +15</span></li>
                  <li><span aria-hidden="true">✦</span><span data-i18n="help.scorePerfect">完美放置 +25，連續完美會累加倍率</span></li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="screen-settings" class="screen scroll-screen" data-screen="settings" aria-labelledby="settings-title">
          <div class="screen-panel">
            <div class="screen-header">
              <button class="icon-btn" data-go="menu" type="button" aria-label="Back">‹</button>
              <h2 id="settings-title" data-i18n="menu.settings">設定</h2>
            </div>

            <div class="setting-row">
              <label for="bgm-volume" data-i18n="settings.bgm">背景音樂</label>
              <div class="range-wrap">
                <input id="bgm-volume" type="range" min="0" max="100" step="1">
                <output id="bgm-output" for="bgm-volume">60%</output>
              </div>
            </div>

            <div class="setting-row">
              <label for="sfx-volume" data-i18n="settings.sfx">音效</label>
              <div class="range-wrap">
                <input id="sfx-volume" type="range" min="0" max="100" step="1">
                <output id="sfx-output" for="sfx-volume">75%</output>
              </div>
            </div>

            <div class="setting-row">
              <span data-i18n="settings.lang">語言</span>
              <div class="segmented" role="group" aria-label="Language">
                <button type="button" data-lang="zh-TW">繁中</button>
                <button type="button" data-lang="en">English</button>
                <button type="button" data-lang="ja">日本語</button>
              </div>
            </div>

            <div class="settings-actions">
              <button id="reset-data-btn" class="btn btn-danger-outline" type="button" data-i18n="settings.reset">清除所有紀錄</button>
            </div>
          </div>
        </section>

        <section id="screen-leaderboard" class="screen scroll-screen" data-screen="leaderboard" aria-labelledby="leaderboard-title">
          <div class="screen-panel leaderboard-panel">
            <div class="screen-header">
              <button class="icon-btn" data-go="menu" type="button" aria-label="Back">‹</button>
              <h2 id="leaderboard-title" data-i18n="leaderboard.title">排行榜</h2>
            </div>
            <ol id="leaderboard-list" class="leaderboard-list"></ol>
            <p id="leaderboard-empty" class="empty-state is-hidden" data-i18n="leaderboard.empty">還沒有紀錄，去挑戰看看吧！</p>
            <div class="settings-actions">
              <button id="clear-leaderboard-btn" class="btn btn-danger-outline" type="button" data-i18n="leaderboard.clear">清除紀錄</button>
              <button class="btn btn-primary" data-go="menu" type="button" data-i18n="nav.backMenu">返回主選單</button>
            </div>
          </div>
        </section>

        <div id="modal" class="modal is-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-panel">
            <h2 id="modal-title">Game Over</h2>
            <p id="modal-body"></p>
            <div id="modal-actions" class="modal-actions"></div>
          </div>
        </div>

        <div id="toast" class="toast" role="status" aria-live="polite"></div>
      `;
    },

    current: 'menu',

    show(name) {
      Helpers.qsa('.screen').forEach((screen) => {
        screen.classList.toggle('is-active', screen.dataset.screen === name);
      });
      this.current = name;
      this.closeModal();
      window.dispatchEvent(new CustomEvent('screen:change', { detail: { screen: name } }));
    },

    showModal(title, body, actions = []) {
      const modal = Helpers.qs('#modal');
      const actionWrap = Helpers.qs('#modal-actions');
      Helpers.qs('#modal-title').textContent = title;
      Helpers.qs('#modal-body').textContent = body;
      actionWrap.replaceChildren();
      actions.forEach((action) => {
        const button = Helpers.makeButton(action.label, action.className || 'btn btn-ghost', () => {
          if (action.close !== false) this.closeModal();
          action.onClick?.();
        });
        actionWrap.append(button);
      });
      modal.classList.remove('is-hidden');
      const firstButton = actionWrap.querySelector('button');
      if (firstButton) firstButton.focus();
    },

    closeModal() {
      Helpers.qs('#modal').classList.add('is-hidden');
    },

    isModalOpen() {
      return !Helpers.qs('#modal').classList.contains('is-hidden');
    },

    toast(message) {
      const toast = Helpers.qs('#toast');
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
    }
  };

  window.ScreenManager = ScreenManager;
})(window);
