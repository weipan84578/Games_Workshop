import { LEVELS_EASY } from '../data/levels-easy.js';
import { SaveManager } from '../storage/SaveManager.js';
import { AudioManager } from '../audio/AudioManager.js';
import { ModalManager } from '../ui/ModalManager.js';
import { Router } from '../router/Router.js';

function previewTube(colors) {
  return `
    <button class="tube" type="button" tabindex="-1" aria-hidden="true">
      <span class="tube__stack">
        ${colors.map((color) => `<span class="tube__layer tube__layer--${color}"></span>`).join('')}
      </span>
      <span class="tube__base"></span>
    </button>
  `;
}

function showDifficultyModal() {
  ModalManager.show({
    title: '選擇難度',
    body: '<p>每個難度都有獨立關卡與星等紀錄。</p>',
    actions: [
      { label: '簡單', primary: true, handler: () => Router.navigateTo('levels', { diff: 'easy' }) },
      { label: '普通', handler: () => Router.navigateTo('levels', { diff: 'normal' }) },
      { label: '困難', handler: () => Router.navigateTo('levels', { diff: 'hard' }) },
    ],
  });
}

export default {
  init(app) {
    const lastSave = SaveManager.getLastSave();
    const firstLevel = LEVELS_EASY[0];
    app.className = 'screen home-screen';
    app.innerHTML = `
      <main class="app-shell">
        <div class="content-width home-layout">
          <section class="home-copy">
            <p class="kicker">Pour. Match. Clear.</p>
            <h1 class="app-title">Water Sort Puzzle</h1>
            <p>把同色液體集中到同一支試管。每次只能把頂端連續同色倒進空試管或同色試管。</p>
            <div class="home-actions">
              <button class="btn btn--primary" data-action="play"><span class="btn__icon">▶</span>開始遊戲</button>
              <button class="btn" data-action="continue" ${lastSave ? '' : 'disabled'}><span class="btn__icon">↻</span>繼續遊戲</button>
              <button class="btn" data-nav="instructions"><span class="btn__icon">?</span>玩法說明</button>
              <button class="btn" data-nav="settings"><span class="btn__icon">⚙</span>設定</button>
            </div>
            <div class="save-summary">${lastSave ? `上次進度：${lastSave.difficulty} 第 ${lastSave.levelId} 關，${lastSave.moves} 步` : '尚無可繼續的進度'}</div>
          </section>
          <section class="preview-rack" aria-label="遊戲預覽">
            ${firstLevel.tubes.slice(0, 4).map(previewTube).join('')}
          </section>
        </div>
      </main>
    `;

    app.querySelector('[data-action="play"]').addEventListener('click', () => {
      AudioManager.play('btn_click');
      showDifficultyModal();
    });

    app.querySelector('[data-action="continue"]').addEventListener('click', () => {
      if (!lastSave) return;
      AudioManager.play('btn_click');
      Router.navigateTo('game', { diff: lastSave.difficulty, level: lastSave.levelId, resume: '1' });
    });

    app.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        AudioManager.play('btn_click');
        Router.navigateTo(button.dataset.nav);
      });
    });
  },
  destroy() {
    ModalManager.close();
  },
};
