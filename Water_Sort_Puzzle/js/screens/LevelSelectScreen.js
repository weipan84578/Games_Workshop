import { LEVELS_EASY } from '../data/levels-easy.js';
import { LEVELS_NORMAL } from '../data/levels-normal.js';
import { LEVELS_HARD } from '../data/levels-hard.js';
import { AudioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../storage/SaveManager.js';
import { Router } from '../router/Router.js';

const LEVELS = {
  easy: LEVELS_EASY,
  normal: LEVELS_NORMAL,
  hard: LEVELS_HARD,
};

const DIFF_LABEL = {
  easy: '簡單',
  normal: '普通',
  hard: '困難',
};

function stars(value = 0) {
  return value ? '★'.repeat(value) : '';
}

export default {
  init(app, params = {}) {
    const diff = LEVELS[params.diff] ? params.diff : 'easy';
    const save = SaveManager.load();
    const progress = save.progress[diff];
    app.className = 'screen level-select-screen';
    app.innerHTML = `
      <main class="app-shell">
        <div class="content-width">
          <header class="screen__header">
            <div>
              <p class="kicker">Level Select</p>
              <h1 class="section-title">${DIFF_LABEL[diff]}關卡</h1>
              <p class="screen__copy">${LEVELS[diff].length} 個關卡，已完成 ${progress.cleared.length} 個。</p>
            </div>
            <div class="top-bar__actions">
              <button class="btn btn--icon btn--ghost" data-nav="home" aria-label="回首頁">←</button>
              <button class="btn btn--icon btn--ghost" data-nav="settings" aria-label="設定">⚙</button>
            </div>
          </header>
          <div class="level-toolbar">
            <div class="segmented" aria-label="難度切換">
              ${Object.entries(DIFF_LABEL).map(([key, label]) => `
                <button class="btn" data-diff="${key}" aria-pressed="${key === diff}">${label}</button>
              `).join('')}
            </div>
          </div>
          <section class="level-grid" aria-label="關卡列表">
            ${LEVELS[diff].map((level) => `
              <button class="level-tile" data-level="${level.id}">
                <strong>${level.id}</strong>
                <span aria-label="${progress.stars[level.id] ?? 0} 星">${stars(progress.stars[level.id])}</span>
                <small>${level.colors} 色</small>
              </button>
            `).join('')}
          </section>
        </div>
      </main>
    `;

    app.querySelectorAll('[data-diff]').forEach((button) => {
      button.addEventListener('click', () => {
        AudioManager.play('btn_click');
        Router.navigateTo('levels', { diff: button.dataset.diff });
      });
    });

    app.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => {
        AudioManager.play('btn_click');
        Router.navigateTo('game', { diff, level: button.dataset.level });
      });
    });

    app.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        AudioManager.play('btn_click');
        Router.navigateTo(button.dataset.nav);
      });
    });
  },
  destroy() {},
};
