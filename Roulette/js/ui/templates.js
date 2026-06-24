(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};

  function renderAppShell(root) {
    if (!root) return;
    root.innerHTML = `
      <canvas id="particleCanvas" class="particle-canvas" aria-hidden="true"></canvas>
      <div id="toastHost" class="toast-host" aria-live="polite" aria-atomic="true"></div>

      <section id="menuScreen" class="screen menu-screen active" aria-labelledby="menuTitle">
        <div class="screen-tools">
          <label class="select-shell">
            <span class="sr-only" data-i18n="settings.language">語言</span>
            <select id="languageSelect" aria-label="Language">
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </label>
          <button id="quickMuteBtn" class="icon-button" type="button" aria-label="Toggle sound" title="Sound">
            <span id="quickMuteIcon" aria-hidden="true">♪</span>
          </button>
        </div>

        <div class="menu-stage">
          <div class="logo-wheel" aria-hidden="true">
            <div class="logo-wheel-core"></div>
          </div>
          <p class="kicker" data-i18n="menu.kicker">玩家 vs AI</p>
          <h1 id="menuTitle">ROULETTE</h1>
          <p class="menu-subtitle" data-i18n="menu.subtitle">輪盤遊戲</p>

          <div class="menu-actions" aria-label="Main menu">
            <button class="btn-menu" id="startGameBtn" type="button">
              <span class="btn-symbol" aria-hidden="true">▶</span>
              <span data-i18n="menu.start">開始遊戲</span>
            </button>
            <button class="btn-menu" id="continueGameBtn" type="button">
              <span class="btn-symbol" aria-hidden="true">↻</span>
              <span data-i18n="menu.continue">繼續遊戲</span>
            </button>
            <button class="btn-menu" id="openHelpBtn" type="button">
              <span class="btn-symbol" aria-hidden="true">?</span>
              <span data-i18n="menu.help">說明</span>
            </button>
            <button class="btn-menu" id="openSettingsBtn" type="button">
              <span class="btn-symbol" aria-hidden="true">⚙</span>
              <span data-i18n="menu.settings">設定</span>
            </button>
          </div>

          <div class="difficulty-group" id="menuDifficulty" role="radiogroup" aria-label="Difficulty">
            <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="easy" role="radio">
              <span class="status-dot easy"></span>
              <span data-i18n="difficulty.easy">簡單</span>
            </button>
            <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="normal" role="radio">
              <span class="status-dot normal"></span>
              <span data-i18n="difficulty.normal">普通</span>
            </button>
            <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="hard" role="radio">
              <span class="status-dot hard"></span>
              <span data-i18n="difficulty.hard">困難</span>
            </button>
          </div>
          <p class="version-label">v1.0.0 ©2026</p>
        </div>
      </section>

      <section id="gameScreen" class="screen game-screen" aria-labelledby="gameTitle">
        <header class="game-header">
          <button class="icon-button" id="backToMenuBtn" type="button" aria-label="Back">
            <span aria-hidden="true">←</span>
          </button>
          <div>
            <p class="kicker" id="roundLabel">第 1 輪</p>
            <h2 id="gameTitle">ROULETTE</h2>
          </div>
          <div class="game-header-actions">
            <button class="icon-button" id="settingsFromGameBtn" type="button" aria-label="Settings" title="Settings">
              <span aria-hidden="true">⚙</span>
            </button>
            <button class="icon-button" id="soundFromGameBtn" type="button" aria-label="Sound" title="Sound">
              <span aria-hidden="true">♪</span>
            </button>
            <button class="btn compact" id="saveGameBtn" type="button" data-i18n="game.save">存檔</button>
          </div>
        </header>

        <main class="game-content">
          <aside class="side-panel">
            <section class="status-card">
              <div class="status-card-header">
                <h3 data-i18n="ai.panel">AI 對手</h3>
                <span id="aiDifficultyBadge" class="badge">普通</span>
              </div>
              <dl class="stat-list">
                <div>
                  <dt data-i18n="game.balance">籌碼餘額</dt>
                  <dd id="aiBalance">$0</dd>
                </div>
                <div>
                  <dt data-i18n="game.currentBet">本輪下注</dt>
                  <dd id="aiBetTotal">$0</dd>
                </div>
              </dl>
              <div class="thinking-meter" aria-hidden="true">
                <span id="aiThinkingLabel" data-i18n="ai.ready">等待下注</span>
                <div class="meter-track"><span id="aiThinkingBar"></span></div>
              </div>
              <div id="aiReveal" class="ai-reveal" data-i18n="ai.hidden">下注區域：隱藏</div>
            </section>

            <section class="status-card">
              <div class="status-card-header">
                <h3 data-i18n="game.player">玩家</h3>
                <span id="targetBadge" class="badge">目標 $8,000</span>
              </div>
              <dl class="stat-list">
                <div>
                  <dt data-i18n="game.balance">籌碼餘額</dt>
                  <dd id="playerBalance">$0</dd>
                </div>
                <div>
                  <dt data-i18n="game.currentBet">本輪下注</dt>
                  <dd id="playerBetTotal">$0</dd>
                </div>
              </dl>
            </section>

            <section class="wheel-panel">
              <canvas id="wheelCanvas" width="420" height="420">
                Roulette wheel is not supported by this browser.
              </canvas>
              <div class="result-display" id="resultDisplay">
                <span id="resultNumber">--</span>
                <small id="resultText" data-i18n="game.placeBets">請先下注</small>
              </div>
            </section>
          </aside>

          <section class="table-section" aria-label="Betting table">
            <div class="board-toolbar">
              <div>
                <p class="kicker" data-i18n="game.bet">下注</p>
                <h3 data-i18n="game.table">下注桌面板</h3>
              </div>
              <div class="board-summary">
                <span id="selectedChipLabel">$25</span>
                <span id="wheelTypeLabel">歐式輪盤</span>
              </div>
            </div>
            <div class="betting-board-scroll">
              <div id="bettingBoard" class="betting-board"></div>
            </div>
            <div class="bet-list-shell">
              <div class="bet-list-header">
                <span data-i18n="game.activeBets">目前下注</span>
                <strong id="activeBetCount">0</strong>
              </div>
              <div id="activeBetList" class="bet-list"></div>
            </div>
          </section>
        </main>

        <footer class="history-bar">
          <span data-i18n="game.history">歷史記錄</span>
          <div id="historyList" class="history-list"></div>
        </footer>

        <section class="action-bar" aria-label="Round actions">
          <div id="chipRack" class="chip-rack" role="radiogroup" aria-label="Chip values"></div>
          <div class="round-actions">
            <button class="btn secondary" id="clearBetsBtn" type="button" data-i18n="game.clear">清除</button>
            <button class="btn primary" id="spinBtn" type="button" data-i18n="game.spin">轉動</button>
          </div>
        </section>
      </section>

      <section id="settingsScreen" class="screen utility-screen" aria-labelledby="settingsTitle">
        <div class="utility-shell">
          <header class="utility-header">
            <button class="icon-button" data-route-back type="button" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <div>
              <p class="kicker" data-i18n="settings.kicker">偏好設定</p>
              <h2 id="settingsTitle" data-i18n="settings.title">設定</h2>
            </div>
          </header>

          <div class="settings-grid">
            <section class="setting-block">
              <h3 data-i18n="settings.language">語言</h3>
              <div class="segmented" id="settingsLanguageGroup" role="radiogroup" aria-label="Language">
                <button type="button" data-setting="language" data-value="zh-TW">繁體中文</button>
                <button type="button" data-setting="language" data-value="en">English</button>
                <button type="button" data-setting="language" data-value="ja">日本語</button>
              </div>
            </section>

            <section class="setting-block">
              <h3 data-i18n="settings.audio">音效</h3>
              <label class="toggle-line">
                <span data-i18n="settings.bgm">背景音樂</span>
                <input id="bgmEnabledInput" type="checkbox">
              </label>
              <label class="slider-line">
                <span id="bgmVolumeLabel">60%</span>
                <input id="bgmVolumeInput" class="settings-slider" type="range" min="0" max="100" step="1">
              </label>
              <label class="toggle-line">
                <span data-i18n="settings.sfx">音效</span>
                <input id="sfxEnabledInput" type="checkbox">
              </label>
              <label class="slider-line">
                <span id="sfxVolumeLabel">80%</span>
                <input id="sfxVolumeInput" class="settings-slider" type="range" min="0" max="100" step="1">
              </label>
            </section>

            <section class="setting-block">
              <h3 data-i18n="settings.theme">主題顏色</h3>
              <div class="theme-grid" id="themeGrid" role="radiogroup" aria-label="Color theme"></div>
            </section>

            <section class="setting-block">
              <h3 data-i18n="settings.game">遊戲</h3>
              <div class="difficulty-group wrap" id="settingsDifficulty" role="radiogroup" aria-label="Difficulty">
                <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="easy">
                  <span class="status-dot easy"></span>
                  <span data-i18n="difficulty.easy">簡單</span>
                </button>
                <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="normal">
                  <span class="status-dot normal"></span>
                  <span data-i18n="difficulty.normal">普通</span>
                </button>
                <button class="difficulty-btn" type="button" data-setting="difficulty" data-value="hard">
                  <span class="status-dot hard"></span>
                  <span data-i18n="difficulty.hard">困難</span>
                </button>
              </div>
              <div class="setting-subsection">
                <h4 data-i18n="settings.wheelType">輪盤類型</h4>
                <p class="setting-help" data-i18n="settings.wheelTypeHelp">歐式只有 0；美式多 00，風險更高。</p>
                <div class="segmented" id="wheelTypeGroup" role="radiogroup" aria-label="Wheel type">
                  <button type="button" data-setting="wheelType" data-value="european" data-i18n="wheel.european">歐式輪盤</button>
                  <button type="button" data-setting="wheelType" data-value="american" data-i18n="wheel.american">美式輪盤</button>
                </div>
                <ul class="setting-detail-list">
                  <li data-i18n="wheel.europeanDesc">歐式輪盤：0 到 36，共 37 格，沒有 00。</li>
                  <li data-i18n="wheel.americanDesc">美式輪盤：0 到 36 加上 00，共 38 格，莊家優勢較高。</li>
                </ul>
              </div>
              <div class="setting-subsection">
                <h4 data-i18n="settings.animationSpeed">輪盤動畫速度</h4>
                <p class="setting-help" data-i18n="settings.animationSpeedHelp">只影響轉盤演出時間，不改變中獎機率。</p>
                <div class="segmented" id="animationSpeedGroup" role="radiogroup" aria-label="Animation speed">
                  <button type="button" data-setting="animationSpeed" data-value="slow" data-i18n="settings.slow">慢</button>
                  <button type="button" data-setting="animationSpeed" data-value="normal" data-i18n="settings.normal">普通</button>
                  <button type="button" data-setting="animationSpeed" data-value="fast" data-i18n="settings.fast">快</button>
                </div>
                <ul class="setting-detail-list">
                  <li data-i18n="settings.speedSlowDesc">慢：轉盤演出較久，適合想看完整鋼球滾動效果。</li>
                  <li data-i18n="settings.speedNormalDesc">普通：標準節奏，兼顧演出與等待時間。</li>
                  <li data-i18n="settings.speedFastDesc">快：縮短等待，適合連續下注。</li>
                </ul>
              </div>
            </section>
          </div>

          <div class="utility-actions">
            <button class="btn primary" id="saveSettingsBtn" type="button" data-i18n="settings.save">儲存設定</button>
          </div>
        </div>
      </section>

      <section id="helpScreen" class="screen utility-screen" aria-labelledby="helpTitle">
        <div class="utility-shell wide">
          <header class="utility-header">
            <button class="icon-button" data-route-back type="button" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <div>
              <p class="kicker" data-i18n="help.kicker">教學指南</p>
              <h2 id="helpTitle" data-i18n="help.title">遊戲說明</h2>
            </div>
          </header>

          <nav id="helpTabs" class="tab-list" aria-label="Help topics">
            <button type="button" data-tab="goal" data-i18n="help.goal">遊戲目標</button>
            <button type="button" data-tab="wheel" data-i18n="help.wheel">輪盤介紹</button>
            <button type="button" data-tab="bets" data-i18n="help.bets">下注類型</button>
            <button type="button" data-tab="payout" data-i18n="help.payout">賠率計算</button>
            <button type="button" data-tab="ai" data-i18n="help.ai">AI 對手</button>
            <button type="button" data-tab="controls" data-i18n="help.controls">操作說明</button>
          </nav>

          <div id="helpContent" class="help-content"></div>

          <div class="utility-actions split">
            <button class="btn secondary" id="helpPrevBtn" type="button" data-i18n="help.prev">上一頁</button>
            <button class="btn secondary" id="helpNextBtn" type="button" data-i18n="help.next">下一頁</button>
          </div>
        </div>
      </section>

      <div id="endDialog" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="endTitle">
        <div class="modal">
          <h2 id="endTitle">Game Over</h2>
          <p id="endMessage"></p>
          <div class="modal-actions">
            <button class="btn secondary" id="endMenuBtn" type="button" data-i18n="game.menu">主選單</button>
            <button class="btn primary" id="endRestartBtn" type="button" data-i18n="game.restart">重新開始</button>
          </div>
        </div>
      </div>
    `;
  }

  Object.assign(R, { renderAppShell });
})();
