import { AudioManager } from '../audio/AudioManager.js';
import { Router } from '../router/Router.js';

export default {
  init(app) {
    app.className = 'screen instructions-screen';
    app.innerHTML = `
      <main class="app-shell">
        <div class="content-width">
          <header class="screen__header">
            <div>
              <p class="kicker">How To Play</p>
              <h1 class="section-title">玩法說明</h1>
              <p class="screen__copy">目標是讓每支非空試管只留下同一種顏色，或完全清空。</p>
            </div>
            <button class="btn btn--icon btn--ghost" data-nav="home" aria-label="回首頁">←</button>
          </header>
          <section class="rules-grid">
            <article class="rule-card">
              <h2>選取與倒水</h2>
              <p>先點來源試管，再點目標試管。只能把頂端連續同色倒出去。</p>
            </article>
            <article class="rule-card">
              <h2>合法目標</h2>
              <p>目標必須是空試管，或頂端顏色與來源頂端相同，且仍有空位。</p>
            </article>
            <article class="rule-card">
              <h2>完成條件</h2>
              <p>所有顏色各自集中成完整試管，剩下的試管保持空白，即可過關。</p>
            </article>
            <article class="rule-card">
              <h2>輔助功能</h2>
              <p>Undo 最多保存 30 步；提示會用 BFS 優先找可通關路徑，再給出較佳下一步。</p>
            </article>
          </section>
        </div>
      </main>
    `;

    app.querySelector('[data-nav="home"]').addEventListener('click', () => {
      AudioManager.play('btn_click');
      Router.navigateTo('home');
    });
  },
  destroy() {},
};
