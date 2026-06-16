import { AudioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../storage/SaveManager.js';
import { SettingsManager } from '../storage/SettingsManager.js';
import { THEMES, ThemeManager } from '../ui/ThemeManager.js';
import { ModalManager } from '../ui/ModalManager.js';
import { Router } from '../router/Router.js';

const THEME_LABELS = {
  ocean: 'Ocean',
  forest: 'Forest',
  sunset: 'Sunset',
  midnight: 'Midnight',
};

function render(app, settings) {
  app.className = 'screen settings-screen';
  app.innerHTML = `
    <main class="app-shell">
      <div class="content-width">
        <header class="screen__header">
          <div>
            <p class="kicker">Settings</p>
            <h1 class="section-title">設定</h1>
          </div>
          <button class="btn btn--icon btn--ghost" data-nav="home" aria-label="回首頁">←</button>
        </header>
        <section class="panel panel--padded">
          <div class="settings-list">
            <div class="setting-row">
              <label for="bgmVolume">背景音量</label>
              <input id="bgmVolume" type="range" min="0" max="1" step="0.05" value="${settings.bgmVolume}">
            </div>
            <div class="setting-row">
              <label for="sfxVolume">音效音量</label>
              <input id="sfxVolume" type="range" min="0" max="1" step="0.05" value="${settings.sfxVolume}">
            </div>
            <div class="setting-row">
              <div class="setting-row__label">主題</div>
              <div class="theme-swatches">
                ${THEMES.map((theme) => `
                  <button class="theme-swatch theme-swatch--${theme}" data-theme-choice="${theme}" aria-pressed="${settings.theme === theme}" aria-label="${THEME_LABELS[theme]}"><span></span></button>
                `).join('')}
              </div>
            </div>
            <div class="setting-row">
              <span class="setting-row__label">背景音樂</span>
              <label class="switch"><input type="checkbox" data-setting="bgmEnabled" ${settings.bgmEnabled ? 'checked' : ''}>啟用</label>
            </div>
            <div class="setting-row">
              <span class="setting-row__label">音效</span>
              <label class="switch"><input type="checkbox" data-setting="sfxEnabled" ${settings.sfxEnabled ? 'checked' : ''}>啟用</label>
            </div>
            <div class="setting-row">
              <span class="setting-row__label">震動回饋</span>
              <label class="switch"><input type="checkbox" data-setting="vibration" ${settings.vibration ? 'checked' : ''}>啟用</label>
            </div>
            <div class="setting-row">
              <span class="setting-row__label">顯示計時</span>
              <label class="switch"><input type="checkbox" data-setting="showTimer" ${settings.showTimer ? 'checked' : ''}>啟用</label>
            </div>
          </div>
        </section>
        <div class="btn-group" style="margin-top: 16px;">
          <button class="btn" data-action="reset-settings">重設設定</button>
          <button class="btn btn--danger" data-action="clear-save">清除進度</button>
        </div>
      </div>
    </main>
  `;
}

export default {
  init(app) {
    render(app, SettingsManager.get());

    app.querySelector('[data-nav="home"]').addEventListener('click', () => {
      AudioManager.play('btn_click');
      Router.navigateTo('home');
    });

    app.querySelector('#bgmVolume').addEventListener('input', (event) => {
      SettingsManager.update({ bgmVolume: Number(event.target.value) });
    });

    app.querySelector('#sfxVolume').addEventListener('input', (event) => {
      SettingsManager.update({ sfxVolume: Number(event.target.value) });
      AudioManager.play('btn_hover');
    });

    app.querySelectorAll('[data-setting]').forEach((input) => {
      input.addEventListener('change', () => {
        SettingsManager.update({ [input.dataset.setting]: input.checked });
        AudioManager.play('btn_click');
      });
    });

    app.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.dataset.themeChoice;
        SettingsManager.update({ theme });
        ThemeManager.apply(theme);
        app.querySelectorAll('[data-theme-choice]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        AudioManager.play('btn_click');
      });
    });

    app.querySelector('[data-action="reset-settings"]').addEventListener('click', () => {
      const settings = SettingsManager.reset();
      ThemeManager.apply(settings.theme);
      render(app, settings);
      this.init(app);
    });

    app.querySelector('[data-action="clear-save"]').addEventListener('click', () => {
      ModalManager.show({
        title: '清除進度',
        body: '<p>這會刪除已完成關卡、星等與目前續玩資料。</p>',
        actions: [
          { label: '取消' },
          { label: '清除', primary: true, handler: () => SaveManager.clearAll() },
        ],
      });
    });
  },
  destroy() {
    ModalManager.close();
  },
};
