'use strict';

// Check canvas support
(function() {
  const c = document.createElement('canvas');
  if (!c.getContext) {
    document.body.innerHTML = '<p style="color:white;text-align:center;margin-top:4em;font-family:monospace">您的瀏覽器不支援 Canvas，請更新瀏覽器。</p>';
  }
})();

let game = null;
let settings = Storage.getSettings();

// Build renderer
const gameCanvas     = document.getElementById('game-canvas');
const holdCanvas     = document.getElementById('hold-canvas');
const nextCanvas1    = document.getElementById('next-canvas-1');
const nextCanvas2    = document.getElementById('next-canvas-2');
const nextCanvas3    = document.getElementById('next-canvas-3');
const effectOverlay  = document.getElementById('effect-overlay');

const renderer = new Renderer(gameCanvas, holdCanvas, [nextCanvas1, nextCanvas2, nextCanvas3]);
const board    = new Board();
const scoring  = new Scoring();
const effects  = new Effects(effectOverlay);
const input    = new InputHandler(settings);

// Menu background animation
(function menuBg() {
  const cv = document.getElementById('menu-bg-canvas');
  if (!cv) return;
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const ctx = cv.getContext('2d');
  const COLORS = ['#00F0F0','#F0F000','#A000F0','#00F000','#F00000','#0000F0','#F0A000'];
  const drops = Array.from({length: 20}, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height - cv.height,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 30 + Math.random() * 60, size: 20 + Math.floor(Math.random() * 3) * 8
  }));
  let last = 0;
  const tick = (now) => {
    const dt = (now - last) / 1000; last = now;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const d of drops) {
      ctx.fillStyle = d.color; ctx.fillRect(d.x, d.y, d.size, d.size);
      d.y += d.speed * dt;
      if (d.y > cv.height) { d.y = -d.size; d.x = Math.random() * cv.width; }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.addEventListener('resize', () => { cv.width = window.innerWidth; cv.height = window.innerHeight; });
})();

function startGame() {
  if (game) game.stop();
  settings = Storage.getSettings();
  Audio.applySettings(settings);
  game = new Game(renderer, board, scoring, input, effects, settings);
  game.onScoreUpdate = (score, lines, level, time, combo) => UI.updateScore(score, lines, level, time, combo);
  game.onPause   = () => { UI.showModal('modal-pause'); };
  game.onResume  = () => { UI.hideModals(); };
  game.onGameOver = (stats) => { UI.showGameOver(stats); UI.updateMenuHighScore(); };
  game.onRestart  = () => { if (confirm('確定要重新開始嗎？')) startGame(); };
  UI.showScreen('screen-game');
  UI.hideModals();
  game.start();
}

// Menu buttons
document.getElementById('btn-start').addEventListener('click', () => {
  Audio.init(); Audio.resume(); Audio.SFX.uiClick();
  startGame();
});

document.getElementById('btn-settings-menu').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.settingsOrigin = 'menu';
  UI.loadSettingsUI(Storage.getSettings());
  UI.showScreen('screen-settings');
});

document.getElementById('btn-highscores').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.renderHighScores(); UI.showScreen('screen-highscores');
});

document.getElementById('btn-help').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.showScreen('screen-help');
});

// Pause modal
document.getElementById('btn-resume').addEventListener('click', () => {
  Audio.SFX.uiClick(); if (game) game.togglePause();
});

document.getElementById('btn-restart-pause').addEventListener('click', () => {
  Audio.SFX.uiClick();
  if (confirm('確定要重新開始嗎？')) startGame();
});

document.getElementById('btn-settings-pause').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.settingsOrigin = 'pause';
  UI.loadSettingsUI(Storage.getSettings());
  if (game && !game.paused) game.togglePause();
  UI.hideModals();
  UI.showScreen('screen-settings');
});

document.getElementById('btn-menu-pause').addEventListener('click', () => {
  Audio.SFX.uiClick();
  if (game) game.stop(); game = null;
  UI.hideModals(); UI.showScreen('screen-menu'); UI.updateMenuHighScore();
  Audio.startBGM(false);
});

// Game over modal
document.getElementById('btn-play-again').addEventListener('click', () => {
  Audio.SFX.uiClick(); startGame();
});

document.getElementById('btn-menu-gameover').addEventListener('click', () => {
  Audio.SFX.uiClick();
  if (game) { game.stop(); game = null; }
  UI.hideModals(); UI.showScreen('screen-menu'); UI.updateMenuHighScore();
  Audio.startBGM(false);
});

// High scores back
document.getElementById('btn-hs-back').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.showScreen('screen-menu');
});

// Help back
document.getElementById('btn-help-back').addEventListener('click', () => {
  Audio.SFX.uiClick(); UI.showScreen('screen-menu');
});

// Settings save
document.getElementById('btn-settings-save').addEventListener('click', () => {
  Audio.SFX.uiClick();
  const s = UI.readSettingsUI();
  Storage.saveSettings(s);
  settings = s;
  Audio.applySettings(s);
  if (game) game.updateSettings(s);
  if (UI.settingsOrigin === 'pause') {
    UI.showScreen('screen-game');
    UI.showModal('modal-pause');
  } else {
    UI.showScreen('screen-menu');
    Audio.startBGM(false);
  }
});

// Clear scores button
document.getElementById('set-clear-scores').addEventListener('click', () => {
  if (confirm('確定要清除所有最高分記錄嗎？')) {
    Storage.clearHighScores();
    alert('已清除最高分記錄。');
  }
});

// Game bottom buttons
document.getElementById('btn-pause').addEventListener('click', () => {
  Audio.init(); Audio.resume(); Audio.SFX.uiClick();
  if (game) game.togglePause();
});

document.getElementById('btn-restart').addEventListener('click', () => {
  Audio.SFX.uiClick();
  if (confirm('確定要重新開始嗎？')) startGame();
});

// Mobile virtual buttons
const mobileMap = {
  'm-left': 'left', 'm-right': 'right', 'm-down': 'softDrop',
  'm-rotate': 'rotateCW', 'm-hard-drop': 'hardDrop', 'm-hold': 'hold'
};
for (const [id, action] of Object.entries(mobileMap)) {
  const el = document.getElementById(id);
  if (el) input.bindMobileButton(el, action);
}
document.getElementById('m-pause')?.addEventListener('click', () => {
  Audio.init(); Audio.resume();
  if (game) game.togglePause();
});

// Visibility change: auto-pause
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game && !game.paused && !game.over) game.togglePause();
});

// First interaction: init audio and start menu BGM
// Note: click bubbles button → document, so button handlers fire before this.
// If a game was started by the button handler, game != null and we skip menu BGM.
const initAudio = () => {
  Audio.init();
  Audio.resume();
  if (!game) Audio.startBGM(false);
};
document.addEventListener('keydown', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// Resize: re-scale canvas display
window.addEventListener('resize', () => {
  // Canvas internal resolution stays fixed; CSS handles display scaling via media queries.
});

// Init menu
UI.showScreen('screen-menu');
UI.updateMenuHighScore();
Audio.startBGM(false);
