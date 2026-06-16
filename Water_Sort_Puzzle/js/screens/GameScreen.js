import { LEVELS_EASY } from '../data/levels-easy.js';
import { LEVELS_NORMAL } from '../data/levels-normal.js';
import { LEVELS_HARD } from '../data/levels-hard.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GameEngine } from '../core/GameEngine.js';
import { SaveManager } from '../storage/SaveManager.js';
import { SettingsManager } from '../storage/SettingsManager.js';
import { AnimationManager } from '../ui/AnimationManager.js';
import { ConfettiEffect } from '../ui/ConfettiEffect.js';
import { ModalManager } from '../ui/ModalManager.js';
import { renderTubes } from '../ui/TubeRenderer.js';
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

let engine = null;
let timer = null;
let hintMove = null;
let toastTimer = null;
let currentLevel = null;

function formatTime(total) {
  const minutes = Math.floor(total / 60).toString();
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getLevel(diff, levelId) {
  return LEVELS[diff]?.find((level) => level.id === Number(levelId)) ?? LEVELS.easy[0];
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('toast--show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('toast--show'), 1300);
}

function updateHud(state) {
  const settings = SettingsManager.get();
  const moves = document.querySelector('[data-stat="moves"] strong');
  const time = document.querySelector('[data-stat="time"] strong');
  const hints = document.querySelector('[data-stat="hints"] strong');
  const undoButton = document.querySelector('[data-action="undo"]');

  if (moves) moves.textContent = state.moves;
  if (time) {
    const value = currentLevel.difficulty === 'hard'
      ? Math.max(0, engine.timeLimit - state.time)
      : state.time;
    time.textContent = settings.showTimer ? formatTime(value) : '--';
  }
  if (hints) hints.textContent = state.hintsUsed;
  if (undoButton) undoButton.disabled = !engine.canUndo;
}

function renderBoard() {
  const grid = document.querySelector('.tubes-grid');
  if (!grid || !engine) return;
  renderTubes(grid, engine.gameState.tubes, {
    selectedTube: engine.gameState.selectedTube,
    hintMove,
    onTubeClick: (idx) => {
      hintMove = null;
      engine.selectTube(idx);
    },
  });
  updateHud(engine.gameState);
}

function resultStars(count) {
  return Array.from({ length: 3 }, (_, idx) => idx < count ? '★' : '☆').join('');
}

function showWin(stars) {
  const state = engine.gameState;
  SaveManager.markLevelCleared(currentLevel.difficulty, currentLevel.id, stars);
  SaveManager.clearSave();
  ConfettiEffect.play();
  AudioManager.play('confetti');
  const nextLevel = LEVELS[currentLevel.difficulty].find((level) => level.id === currentLevel.id + 1);

  ModalManager.show({
    title: '關卡完成',
    body: `
      <div class="stars" aria-label="${stars} 星">${resultStars(stars)}</div>
      <div class="result-summary">
        <div><span>步數</span><strong>${state.moves}</strong></div>
        <div><span>時間</span><strong>${formatTime(state.time)}</strong></div>
        <div><span>提示</span><strong>${state.hintsUsed}</strong></div>
        <div><span>Undo</span><strong>${state.undoCount}</strong></div>
      </div>
    `,
    actions: [
      { label: '重玩', handler: () => engine.restart() },
      { label: '選關', handler: () => Router.navigateTo('levels', { diff: currentLevel.difficulty }) },
      ...(nextLevel ? [{ label: '下一關', primary: true, handler: () => Router.navigateTo('game', { diff: currentLevel.difficulty, level: nextLevel.id }) }] : []),
    ],
  });
}

function showFail(reason) {
  AudioManager.play('level_fail');
  ModalManager.show({
    title: reason === 'time' ? '時間到' : '沒有可用倒法',
    body: '<p>可以重開本關，或回選關換一題。</p>',
    actions: [
      { label: '選關', handler: () => Router.navigateTo('levels', { diff: currentLevel.difficulty }) },
      { label: '重開', primary: true, handler: () => engine.restart() },
    ],
  });
}

function bindEngine() {
  engine.addEventListener('state-change', (event) => {
    renderBoard();
    if (engine.status !== 'WIN' && engine.status !== 'FAIL') SaveManager.save(event.detail);
  });
  engine.addEventListener('selection-change', () => AudioManager.play(engine.gameState.selectedTube === null ? 'deselect' : 'select'));
  engine.addEventListener('invalid', (event) => {
    AudioManager.play('invalid');
    const reason = event.detail.reason;
    showToast(reason === 'empty' ? '這支試管是空的' : reason === 'undo' ? '沒有可復原的步驟' : reason === 'hint' ? '暫時找不到提示' : '只能倒入空試管或同色試管');
  });
  engine.addEventListener('pour-end', (event) => {
    AudioManager.play('pour_end');
    AnimationManager.markPour(document.querySelector('.tubes-grid'), event.detail.from, event.detail.to);
  });
  engine.addEventListener('hint', (event) => {
    AudioManager.play('hint');
    hintMove = event.detail.move;
    showToast(`提示：第 ${hintMove.from + 1} 支倒到第 ${hintMove.to + 1} 支`);
    renderBoard();
  });
  engine.addEventListener('undo-applied', () => {
    hintMove = null;
    AudioManager.play('undo');
  });
  engine.addEventListener('restart', () => {
    hintMove = null;
    SaveManager.save(engine.gameState);
    ModalManager.close();
  });
  engine.addEventListener('win', (event) => {
    AudioManager.play('level_clear');
    showWin(event.detail.stars);
  });
  engine.addEventListener('fail', (event) => showFail(event.detail.reason));
}

export default {
  init(app, params = {}) {
    const diff = LEVELS[params.diff] ? params.diff : 'easy';
    currentLevel = getLevel(diff, params.level ?? 1);
    const lastSave = params.resume === '1' ? SaveManager.getLastSave() : null;
    const resumeOptions = lastSave && lastSave.difficulty === diff && lastSave.levelId === currentLevel.id
      ? {
          resumeTubes: lastSave.tubes,
          resumeMoves: lastSave.moves,
          resumeTime: lastSave.time,
          resumeHintsUsed: lastSave.hintsUsed,
          resumeUndoCount: lastSave.undoCount,
        }
      : {};

    engine = new GameEngine(currentLevel, resumeOptions);
    app.className = 'screen game-screen';
    app.innerHTML = `
      <main class="app-shell app-shell--game">
        <header class="game-hud">
          <button class="btn btn--icon btn--ghost" data-action="back" aria-label="回選關">←</button>
          <div class="game-hud__title">
            <strong>${DIFF_LABEL[diff]} 第 ${currentLevel.id} 關</strong>
            <span>${currentLevel.colors} 色 · 最佳 ${currentLevel.optimalMoves} 步${diff === 'hard' ? ` · 限時 ${formatTime(engine.timeLimit)}` : ''}</span>
          </div>
          <div class="game-hud__stats">
            <div class="stat-pill" data-stat="moves"><span>步數</span><strong>0</strong></div>
            <div class="stat-pill" data-stat="time"><span>${diff === 'hard' ? '剩餘' : '時間'}</span><strong>0:00</strong></div>
            <div class="stat-pill" data-stat="hints"><span>提示</span><strong>0</strong></div>
          </div>
        </header>
        <section class="tubes-area">
          <div class="tubes-grid" aria-label="試管區"></div>
        </section>
        <div class="toast" role="status"></div>
        <nav class="game-controls" aria-label="遊戲操作">
          <button class="btn" data-action="undo"><span class="btn__icon">↶</span>Undo</button>
          <button class="btn" data-action="hint"><span class="btn__icon">!</span>提示</button>
          <button class="btn" data-action="restart"><span class="btn__icon">↻</span>重開</button>
        </nav>
      </main>
    `;

    bindEngine();
    renderBoard();
    SaveManager.save(engine.gameState);
    timer = window.setInterval(() => engine.tick(), 1000);

    app.querySelector('[data-action="back"]').addEventListener('click', () => {
      AudioManager.play('btn_click');
      Router.navigateTo('levels', { diff });
    });
    app.querySelector('[data-action="undo"]').addEventListener('click', () => engine.undo());
    app.querySelector('[data-action="hint"]').addEventListener('click', () => engine.hint());
    app.querySelector('[data-action="restart"]').addEventListener('click', () => {
      AudioManager.play('btn_click');
      engine.restart();
    });
  },
  destroy() {
    if (timer) window.clearInterval(timer);
    window.clearTimeout(toastTimer);
    ModalManager.close();
    engine = null;
    currentLevel = null;
    hintMove = null;
  },
};
