(function (window) {
  'use strict';

  function boot() {
    ScreenManager.mount();
    const canvas = Helpers.qs('#game-canvas');
    const wrap = Helpers.qs('#canvas-wrap');
    if (!canvas.getContext) {
      Helpers.qs('#app').innerHTML = '<p>您的瀏覽器不支援 Canvas，請使用 Chrome、Firefox 或 Safari。</p>';
      return;
    }

    let settings = SettingsUI.load();
    let audioCtx = null;

    HUD.init();
    SettingsUI.init((nextSettings) => {
      settings = nextSettings;
      applyAudioSettings();
      updateMenuState();
    });
    Leaderboard.init();
    I18n.setLang(settings.lang || 'zh-TW');

    const game = new StackTowerGame(canvas, {
      onHud: (data) => HUD.update(data),
      onPlace: handlePlace,
      onGameOver: handleGameOver,
      onStorageFail: () => ScreenManager.toast(I18n.t('toast.storageFail'))
    });
    window.StackTowerApp = { game };

    const resizeGame = () => {
      const rect = wrap.getBoundingClientRect();
      game.resize(rect.width, rect.height);
    };
    const observer = new ResizeObserver(resizeGame);
    observer.observe(wrap);
    window.addEventListener('resize', resizeGame);
    window.setTimeout(resizeGame, 0);

    function ensureAudio() {
      if (audioCtx) {
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        return;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
      SFX.init(audioCtx);
      BGM.init(audioCtx);
      applyAudioSettings();
      BGM.play();
    }

    function applyAudioSettings() {
      SFX.setVolume(settings.sfxVolume);
      BGM.setVolume(settings.bgmVolume);
      SFX.setMuted(Boolean(settings.muted));
      BGM.setMuted(Boolean(settings.muted));
      HUD.setMuted(Boolean(settings.muted));
    }

    function updateMenuState() {
      const save = Storage.get('save', null);
      Helpers.qs('#continue-btn').classList.toggle('is-hidden', !save);
      Helpers.qsa('[data-lang]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.lang === I18n.currentLang);
      });
    }

    function startGame(loadSave = false) {
      ensureAudio();
      ScreenManager.show('game');
      requestAnimationFrame(() => {
        resizeGame();
        if (loadSave) {
          const save = Storage.get('save', null);
          if (!game.load(save)) {
            ScreenManager.show('menu');
            ScreenManager.toast(I18n.t('leaderboard.empty'));
            updateMenuState();
            return;
          }
        } else {
          game.startNew();
        }
        canvas.focus();
      });
    }

    function handlePlace({ isPerfect, combo, points }) {
      if (isPerfect && combo >= 3) {
        HUD.callout(`${I18n.t('game.combo', { count: combo })} +${points}`);
      } else if (isPerfect) {
        HUD.callout(`${I18n.t('game.perfect')} +${points}`);
      } else {
        HUD.callout(`+${points}`);
      }
      updateMenuState();
    }

    function handleGameOver(result) {
      updateMenuState();
      Leaderboard.render();
      const body = `${I18n.t('game.final', result)}${result.isBest ? ` ${I18n.t('game.newBest')}` : ''}`;
      ScreenManager.showModal(I18n.t('game.gameover'), body, [
        {
          label: I18n.t('game.retry'),
          className: 'btn btn-primary',
          onClick: () => startGame(false)
        },
        {
          label: I18n.t('leaderboard.title'),
          className: 'btn btn-ghost',
          onClick: () => ScreenManager.show('leaderboard')
        },
        {
          label: I18n.t('nav.backMenu'),
          className: 'btn btn-ghost',
          onClick: () => ScreenManager.show('menu')
        }
      ]);
    }

    function pauseFromBack() {
      if (game.state !== 'playing') {
        ScreenManager.show('menu');
        return;
      }
      game.pause();
      ScreenManager.showModal(I18n.t('game.pauseTitle'), I18n.t('game.pauseBody'), [
        {
          label: I18n.t('game.resume'),
          className: 'btn btn-primary',
          onClick: () => {
            ScreenManager.show('game');
            game.resume();
            canvas.focus();
          }
        },
        {
          label: I18n.t('game.quit'),
          className: 'btn btn-ghost',
          onClick: () => {
            game.quitToMenu();
            updateMenuState();
            ScreenManager.show('menu');
          }
        }
      ]);
    }

    function toggleMute() {
      settings = { ...settings, muted: !settings.muted };
      SettingsUI.save(settings);
      applyAudioSettings();
    }

    Helpers.qs('#start-btn').addEventListener('click', () => startGame(false));
    Helpers.qs('#continue-btn').addEventListener('click', () => startGame(true));
    Helpers.qs('#back-btn').addEventListener('click', pauseFromBack);
    Helpers.qs('#mute-btn').addEventListener('click', toggleMute);
    Helpers.qs('#place-btn').addEventListener('click', () => {
      ensureAudio();
      game.place();
    });
    canvas.addEventListener('pointerdown', () => {
      ensureAudio();
      game.place();
    });

    Helpers.qsa('[data-go]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.go === 'leaderboard') Leaderboard.render();
        ScreenManager.show(button.dataset.go);
      });
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        ensureAudio();
        SFX.play('click');
      }
    });

    document.addEventListener('keydown', (event) => {
      const tag = event.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || ScreenManager.isModalOpen()) return;
      if (ScreenManager.current === 'game' && (event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        ensureAudio();
        game.place();
      }
      if (ScreenManager.current === 'game' && event.code === 'Escape') {
        event.preventDefault();
        pauseFromBack();
      }
      if (event.code === 'KeyM') {
        event.preventDefault();
        toggleMute();
      }
    });

    window.addEventListener('screen:change', ({ detail }) => {
      if (detail.screen === 'leaderboard') Leaderboard.render();
      if (detail.screen === 'settings') SettingsUI.syncControls();
      updateMenuState();
    });
    window.addEventListener('i18n:change', () => {
      Leaderboard.render();
      updateMenuState();
    });
    window.addEventListener('settings:cleared', updateMenuState);
    window.addEventListener('beforeunload', () => {
      if (game.state === 'playing') game.save();
    });

    applyAudioSettings();
    updateMenuState();
  }

  window.addEventListener('DOMContentLoaded', boot);
})(window);
