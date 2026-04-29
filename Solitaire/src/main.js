import { getState, initGame, updateState, setState } from './state/gameState.js';
import { pushHistory, popHistory, clearHistory, historyLength } from './state/historyState.js';
import { getSettings, loadSettings, updateSetting, resetSettings } from './state/settingsState.js';
import { canMoveToTableau, canMoveToFoundation, getMovableCards, hasAnyMove } from './game/rules.js';
import { SCORE, clamp, calcTimeBonus, calcStars } from './game/scoring.js';
import { checkCanAutoComplete, getNextAutoMove } from './game/autoComplete.js';
import { findHint } from './game/solver.js';
import { createCardEl, createPileEmptyEl } from './ui/cardRenderer.js';
import { showScreen, showModal, hideModal, hideAllModals, showToast } from './ui/screenManager.js';
import { launchConfetti, dealAnimation, pulseHint, animDuration } from './ui/animations.js';
import { saveGame, loadGame, hasSave, clearSave } from './storage/saveGame.js';
import { getLeaderboard, addRecord, clearLeaderboard, sortRecords } from './storage/leaderboard.js';
import { init as audioInit, playSFX, playBGM, stopBGM, setBGMVolume, setSFXVolume, mute, unmute, isMuted } from './audio/audioManager.js';
import { TRACKS } from './audio/tracks.js';
import { initFloatingCards } from './router.js';

// ─── UI State ────────────────────────────────────────────────────────────────
let selected = null;   // { pile, cardIndex, cards }
let timerInterval = null;
let timerRunning = false;
let autoCompleting = false;
let hintTarget = null;
let pendingWin = false;

// ─── Bootstrap ───────────────────────────────────────────────────────────────
function boot() {
  const settings = loadSettings();
  audioInit(settings);
  applyTheme(settings.theme);
  applyAnimSpeed(settings.animationSpeed);
  applyCardBack(settings.cardBack);
  document.getElementById('btn-continue').style.display = hasSave() ? 'flex' : 'none';
  bindMenuEvents();
  bindGameEvents();
  bindSettingsEvents();
  bindLeaderboardEvents();
  bindModalEvents();
  bindKeyboard();
  loadSettingsUI();
  showScreen('menu');
  playBGM(TRACKS.bgm.menu.src, 'menu');
}

// ─── Theme / Visual helpers ───────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function applyAnimSpeed(speed) {
  document.documentElement.dataset.animSpeed = speed;
  const mult = speed === 'fast' ? 0.5 : speed === 'slow' ? 2 : 1;
  document.documentElement.style.setProperty('--anim-speed', mult);
}

function applyCardBack(back) {
  document.documentElement.dataset.cardBack = back;
}

// ─── Game Start / Stop ───────────────────────────────────────────────────────
function startNewGame(drawMode) {
  clearHistory();
  stopTimer();
  pendingWin = false;
  autoCompleting = false;
  selected = null;
  hideAllModals();
  const state = initGame(parseInt(drawMode));
  renderGame(true);
  startTimer();
  showScreen('game');
  playGameBGM();
  setTimeout(() => {
    const cols = [0,1,2,3,4,5,6].map(i => document.getElementById(`tableau-${i}`));
    dealAnimation(cols);
  }, 50);
}

function resumeGame() {
  const saved = loadGame();
  if (!saved) return;
  clearHistory();
  const { timestamp, ...state } = saved;
  setState(state);
  stopTimer();
  pendingWin = false;
  autoCompleting = false;
  selected = null;
  hideAllModals();
  renderGame(false);
  startTimer();
  showScreen('game');
  playGameBGM();
}

function playGameBGM() {
  const theme = getSettings().theme;
  const bgmKey = theme === 'retro' ? TRACKS.bgm.retro.src : TRACKS.bgm.classic.src;
  playBGM(bgmKey, 'game');
}

// ─── Timer ───────────────────────────────────────────────────────────────────
function startTimer() {
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (!timerRunning) return;
    const state = getState();
    updateState({ time: state.time + 1 });
    updateTimerDisplay(state.time + 1);
    // Draw-3: every 10 seconds after 30 sec, -2 pts
    if (state.drawMode === 3 && (state.time + 1) > 30 && (state.time + 1) % 10 === 0) {
      const newScore = clamp(state.score - 2);
      updateState({ score: newScore });
      updateScoreDisplay(newScore);
    }
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function pauseTimer() { timerRunning = false; }
function resumeTimer() { timerRunning = true; }

function updateTimerDisplay(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer-value').textContent = `${m}:${s}`;
}

function updateScoreDisplay(score) {
  document.getElementById('score-value').textContent = score.toLocaleString();
}

function updateMovesDisplay(moves) {
  document.getElementById('moves-value').textContent = moves;
}

// ─── Core Move Execution ─────────────────────────────────────────────────────
function executeMove(fromPile, cards, toPile, skipHistory = false) {
  const state = getState();
  if (!skipHistory) pushHistory(state);

  const s = JSON.parse(JSON.stringify(state));
  let scoreChange = 0;

  // Remove from source
  if (fromPile === 'waste') {
    s.waste.splice(s.waste.length - cards.length, cards.length);
  } else if (fromPile.startsWith('tableau_')) {
    const ti = parseInt(fromPile.split('_')[1]);
    s.tableaus[ti].splice(s.tableaus[ti].length - cards.length, cards.length);
    // Auto-flip new top card
    if (s.tableaus[ti].length > 0 && !s.tableaus[ti][s.tableaus[ti].length - 1].faceUp) {
      s.tableaus[ti][s.tableaus[ti].length - 1].faceUp = true;
      scoreChange += SCORE.FLIP_CARD;
      playSFX(TRACKS.sfx.flip);
    }
  } else if (fromPile.startsWith('foundation_')) {
    const fi = parseInt(fromPile.split('_')[1]);
    s.foundations[fi].pop();
  }

  // Place to destination
  const cardsToPlace = cards.map(c => ({ ...c, faceUp: true }));
  if (toPile.startsWith('foundation_')) {
    const fi = parseInt(toPile.split('_')[1]);
    s.foundations[fi].push(...cardsToPlace);
    scoreChange += (fromPile === 'waste') ? SCORE.WASTE_TO_FOUNDATION : SCORE.TABLEAU_TO_FOUNDATION;
    if (fromPile.startsWith('foundation_')) scoreChange = SCORE.FOUNDATION_TO_TABLEAU;
    playSFX(TRACKS.sfx.foundation);
  } else if (toPile.startsWith('tableau_')) {
    const ti = parseInt(toPile.split('_')[1]);
    s.tableaus[ti].push(...cardsToPlace);
    if (fromPile === 'waste') scoreChange += SCORE.WASTE_TO_TABLEAU;
    if (fromPile.startsWith('foundation_')) scoreChange = SCORE.FOUNDATION_TO_TABLEAU;
    playSFX(TRACKS.sfx.place);
  }

  // Adjust score change if foundation→tableau
  if (fromPile.startsWith('foundation_') && toPile.startsWith('tableau_')) {
    scoreChange = SCORE.FOUNDATION_TO_TABLEAU;
  }

  s.score = clamp(s.score + scoreChange);
  if (!skipHistory) s.moves++;
  s.canAutoComplete = checkCanAutoComplete(s);

  setState(s);
  selected = null;
  renderGame(false);
  updateScoreDisplay(s.score);
  if (!skipHistory) updateMovesDisplay(s.moves);

  // Auto-foundation check
  if (getSettings().autoFoundation && !skipHistory) {
    runAutoFoundationOnce();
  }

  // Win check
  if (s.foundations.every(f => f.length === 13)) {
    triggerWin();
  } else {
    const canRecycle = s.stock.length === 0 && s.waste.length > 0 && getSettings().unlimitedDraw;
    if (!hasAnyMove(s, getSettings().freeEmpty) && !s.canAutoComplete && !canRecycle) {
      setTimeout(() => showModal('modal-no-moves'), 300);
    }
  }
}

function runAutoFoundationOnce() {
  const state = getState();
  for (let t = 0; t < 7; t++) {
    const pile = state.tableaus[t];
    if (pile.length === 0) continue;
    const card = pile[pile.length - 1];
    if (!card.faceUp) continue;
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, state.foundations[f])) {
        executeMove(`tableau_${t}`, [card], `foundation_${f}`, true);
        setTimeout(runAutoFoundationOnce, 80);
        return;
      }
    }
  }
}

// ─── Stock Draw ───────────────────────────────────────────────────────────────
function drawFromStock() {
  const state = getState();
  if (state.stock.length === 0) {
    // 廢牌堆也是空的 → 無牌可循環
    if (state.waste.length === 0) {
      showToast('沒有可抽的牌了', 'warning');
      return;
    }
    // 關閉無限循環時，禁止任何循環
    if (!getSettings().unlimitedDraw) {
      showToast('已達循環上限', 'warning');
      return;
    }
    pushHistory(state);
    const s = JSON.parse(JSON.stringify(state));
    // 將廢牌堆翻回（最先抽出的牌排在最上）
    s.waste.reverse();
    s.stock = s.waste.map(c => ({ ...c, faceUp: false }));
    s.waste = [];
    s.recycleCount = (s.recycleCount || 0) + 1;
    if (state.drawMode === 3) s.score = clamp(s.score + SCORE.DRAW3_RECYCLE);
    setState(s);
    renderGame(false);
    updateScoreDisplay(s.score);
    showToast(`第 ${s.recycleCount} 次循環`, 'info');
    playSFX(TRACKS.sfx.draw);
    return;
  }
  pushHistory(state);
  const s = JSON.parse(JSON.stringify(state));
  const drawCount = state.drawMode === 3 ? 3 : 1;
  const count = Math.min(drawCount, s.stock.length);
  const drawn = s.stock.splice(s.stock.length - count, count);
  drawn.forEach(c => { c.faceUp = true; s.waste.push(c); });
  s.moves++;
  setState(s);
  renderGame(false);
  updateMovesDisplay(s.moves);
  playSFX(TRACKS.sfx.draw);
}

// ─── Selection Logic ──────────────────────────────────────────────────────────
function handleCardClick(e) {
  if (autoCompleting || pendingWin) return;
  const cardEl = e.target.closest('.card');
  if (!cardEl) {
    // Click on empty stock pile (recycle)
    if (e.target.closest('#stock')) { drawFromStock(); return; }
    // Click on empty pile
    const pileEl = e.target.closest('.pile-tableau, .pile-foundation');
    if (pileEl && selected) {
      const state = getState();
      if (pileEl.classList.contains('pile-tableau')) {
        const ti = parseInt(pileEl.dataset.tableau);
        if (canMoveToTableau(selected.cards[0], state.tableaus[ti], getSettings().freeEmpty)) {
          executeMove(selected.pile, selected.cards, `tableau_${ti}`);
          playSFX(TRACKS.sfx.place);
        } else {
          clearSelected();
        }
      } else if (pileEl.classList.contains('pile-foundation')) {
        const fi = parseInt(pileEl.dataset.foundation);
        if (selected.cards.length === 1 && canMoveToFoundation(selected.cards[0], state.foundations[fi])) {
          executeMove(selected.pile, selected.cards, `foundation_${fi}`);
        } else {
          clearSelected();
        }
      }
    }
    return;
  }

  const state = getState();
  const cardId = cardEl.dataset.cardId;
  const pile = cardEl.dataset.pile;
  const cardIdx = parseInt(cardEl.dataset.cardIndex);

  // Stock click
  if (pile === 'stock') { drawFromStock(); return; }

  // Face-down card: only top card of tableau can flip (auto-flip handled after move)
  if (cardEl.classList.contains('card-back')) {
    if (pile && pile.startsWith('tableau_')) {
      const ti = parseInt(pile.split('_')[1]);
      const col = state.tableaus[ti];
      if (cardIdx === col.length - 1) {
        pushHistory(state);
        const s = JSON.parse(JSON.stringify(state));
        s.tableaus[ti][col.length - 1].faceUp = true;
        s.score = clamp(s.score + SCORE.FLIP_CARD);
        s.moves++;
        setState(s);
        renderGame(false);
        updateScoreDisplay(s.score);
        updateMovesDisplay(s.moves);
        playSFX(TRACKS.sfx.flip);
      }
    }
    return;
  }

  // If something is already selected, try to move
  if (selected) {
    // Try to move selected onto this card's pile
    if (pile && pile.startsWith('tableau_')) {
      const ti = parseInt(pile.split('_')[1]);
      const col = state.tableaus[ti];
      const topCard = col[col.length - 1];
      if (topCard && topCard.faceUp && canMoveToTableau(selected.cards[0], col, getSettings().freeEmpty)) {
        executeMove(selected.pile, selected.cards, `tableau_${ti}`);
        return;
      }
    } else if (pile && pile.startsWith('foundation_')) {
      const fi = parseInt(pile.split('_')[1]);
      if (selected.cards.length === 1 && canMoveToFoundation(selected.cards[0], state.foundations[fi])) {
        executeMove(selected.pile, selected.cards, `foundation_${fi}`);
        return;
      }
    }
    // If clicking same card or same pile sequence, deselect
    if (selected.pile === pile && cardIdx <= selected.startCardIndex) {
      clearSelected();
      return;
    }
    clearSelected();
  }

  // Select card(s)
  if (pile === 'waste') {
    if (cardIdx === state.waste.length - 1) {
      selected = { pile: 'waste', cardIndex: cardIdx, startCardIndex: cardIdx, cards: [state.waste[cardIdx]] };
    }
  } else if (pile && pile.startsWith('tableau_')) {
    const ti = parseInt(pile.split('_')[1]);
    const movable = getMovableCards(state.tableaus, ti);
    const col = state.tableaus[ti];
    if (movable.length > 0 && cardIdx >= col.length - movable.length) {
      const cardsFromIdx = col.slice(cardIdx);
      selected = { pile: `tableau_${ti}`, cardIndex: cardIdx, startCardIndex: cardIdx, cards: cardsFromIdx };
    }
  } else if (pile && pile.startsWith('foundation_')) {
    const fi = parseInt(pile.split('_')[1]);
    if (getSettings().foundationMovable && state.foundations[fi].length > 0) {
      const top = state.foundations[fi][state.foundations[fi].length - 1];
      if (top.id === cardId) {
        selected = { pile: `foundation_${fi}`, cardIndex: fi, startCardIndex: fi, cards: [top] };
      }
    }
  }

  if (selected) renderSelectedHighlight();
}

function handleDoubleClick(e) {
  if (autoCompleting || pendingWin) return;
  const cardEl = e.target.closest('.card');
  if (!cardEl || cardEl.classList.contains('card-back')) return;
  const state = getState();
  const cardId = cardEl.dataset.cardId;
  const pile = cardEl.dataset.pile;
  if (!pile) return;

  let cardArr = null;
  if (pile === 'waste' && state.waste.length > 0 && state.waste[state.waste.length - 1].id === cardId) {
    cardArr = { cards: [state.waste[state.waste.length - 1]], from: 'waste' };
  } else if (pile.startsWith('tableau_')) {
    const ti = parseInt(pile.split('_')[1]);
    const col = state.tableaus[ti];
    if (col.length > 0 && col[col.length - 1].id === cardId) {
      cardArr = { cards: [col[col.length - 1]], from: `tableau_${ti}` };
    }
  } else if (pile.startsWith('foundation_')) {
    return;
  }

  if (!cardArr) return;
  const card = cardArr.cards[0];
  // Try foundation first
  for (let f = 0; f < 4; f++) {
    if (canMoveToFoundation(card, state.foundations[f])) {
      clearSelected();
      executeMove(cardArr.from, cardArr.cards, `foundation_${f}`);
      return;
    }
  }
}

function clearSelected() {
  selected = null;
  document.querySelectorAll('.card-selected').forEach(el => el.classList.remove('card-selected'));
}

function renderSelectedHighlight() {
  document.querySelectorAll('.card-selected').forEach(el => el.classList.remove('card-selected'));
  if (!selected) return;
  document.querySelectorAll(`.card[data-pile="${selected.pile}"]`).forEach(el => {
    const idx = parseInt(el.dataset.cardIndex);
    if (idx >= selected.cardIndex) el.classList.add('card-selected');
  });
}

// ─── Undo ─────────────────────────────────────────────────────────────────────
function doUndo() {
  if (historyLength() === 0) { showToast('沒有可悔棋的步驟', 'info'); return; }
  const prev = popHistory();
  if (!prev) return;
  setState(prev);
  selected = null;
  renderGame(false);
  updateScoreDisplay(prev.score);
  updateTimerDisplay(prev.time);
  updateMovesDisplay(prev.moves);
  playSFX(TRACKS.sfx.undo);
  showToast('悔棋成功', 'info');
}

// ─── Hint ─────────────────────────────────────────────────────────────────────
function doHint() {
  const state = getState();
  const hint = findHint(state, getSettings().freeEmpty);
  if (!hint) { showToast('找不到可用的提示', 'warning'); return; }

  const s = JSON.parse(JSON.stringify(state));
  s.score = clamp(s.score + SCORE.USE_HINT);
  updateState({ score: s.score });
  updateScoreDisplay(s.score);
  playSFX(TRACKS.sfx.hint);

  if (hint.type === 'draw') {
    const stockEl = document.getElementById('stock');
    if (stockEl) stockEl.classList.add('pile-hint');
    setTimeout(() => stockEl?.classList.remove('pile-hint'), 1500);
    return;
  }

  // Highlight source card(s)
  const fromPile = hint.from;
  if (fromPile === 'waste') {
    const wasteCards = document.querySelectorAll('#waste .card');
    if (wasteCards.length) pulseHint(wasteCards[wasteCards.length - 1]);
  } else if (fromPile.startsWith('tableau_')) {
    const ti = parseInt(fromPile.split('_')[1]);
    const state2 = getState();
    const col = state2.tableaus[ti];
    const startIdx = col.length - hint.cards.length;
    document.querySelectorAll(`#tableau-${ti} .card`).forEach(el => {
      if (parseInt(el.dataset.cardIndex) >= startIdx) pulseHint(el);
    });
  }
}

// ─── Auto-Complete ────────────────────────────────────────────────────────────
function startAutoComplete() {
  if (autoCompleting) return;
  autoCompleting = true;
  playSFX(TRACKS.sfx.click);
  runNextAutoMove();
}

function runNextAutoMove() {
  if (!autoCompleting) return;
  const state = getState();
  if (state.foundations.every(f => f.length === 13)) { triggerWin(); return; }
  const move = getNextAutoMove(state);
  if (!move) { autoCompleting = false; return; }
  executeMove(move.from, [move.card], move.to, true);
  playSFX(TRACKS.sfx.auto);
  setTimeout(runNextAutoMove, animDuration(160));
}

// ─── Win ──────────────────────────────────────────────────────────────────────
function triggerWin() {
  if (pendingWin) return;
  pendingWin = true;
  autoCompleting = false;
  stopTimer();
  clearSave();
  const state = getState();
  const timeBonus = calcTimeBonus(state.time);
  const finalScore = clamp(state.score + timeBonus);
  updateState({ score: finalScore, isWon: true });

  playSFX(TRACKS.sfx.win);
  playBGM(TRACKS.bgm.win.src, 'win');
  launchConfetti();

  const stars = calcStars(state.time, finalScore, state.drawMode);
  const m = Math.floor(state.time / 60);
  const s = state.time % 60;

  document.getElementById('win-score').textContent = `${finalScore.toLocaleString()} 分`;
  document.getElementById('win-time').textContent = `${m} 分 ${s} 秒`;
  document.getElementById('win-moves').textContent = `${state.moves} 次`;
  document.getElementById('win-stars').textContent = '⭐'.repeat(stars);

  setTimeout(() => showModal('modal-win'), 800);
}

// ─── Drag & Drop ──────────────────────────────────────────────────────────────
let drag = null;

function initDragDrop() {
  const ghost = document.getElementById('drag-ghost');

  document.getElementById('game-board').addEventListener('mousedown', e => {
    if (autoCompleting || pendingWin) return;
    const cardEl = e.target.closest('.card');
    if (!cardEl || cardEl.classList.contains('card-back')) return;

    const state = getState();
    const pile = cardEl.dataset.pile;
    const cardIdx = parseInt(cardEl.dataset.cardIndex);
    if (!pile || pile === 'stock') return;

    let dragCards = null;
    let fromPile = null;

    if (pile === 'waste') {
      if (cardIdx === state.waste.length - 1) {
        dragCards = [state.waste[cardIdx]];
        fromPile = 'waste';
      }
    } else if (pile.startsWith('tableau_')) {
      const ti = parseInt(pile.split('_')[1]);
      const movable = getMovableCards(state.tableaus, ti);
      const col = state.tableaus[ti];
      if (movable.length > 0 && cardIdx >= col.length - movable.length) {
        dragCards = col.slice(cardIdx);
        fromPile = `tableau_${ti}`;
      }
    } else if (pile.startsWith('foundation_')) {
      if (getSettings().foundationMovable) {
        const fi = parseInt(pile.split('_')[1]);
        if (state.foundations[fi].length > 0 && cardIdx === state.foundations[fi].length - 1) {
          dragCards = [state.foundations[fi][state.foundations[fi].length - 1]];
          fromPile = `foundation_${fi}`;
        }
      }
    }

    if (!dragCards || !fromPile) return;

    e.preventDefault();
    const settings = getSettings();
    const rect = cardEl.getBoundingClientRect();

    // Build ghost
    ghost.innerHTML = '';
    ghost.style.width = `${rect.width}px`;
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;

    const stackHeight = rect.height + (dragCards.length - 1) * 28;
    ghost.style.height = `${stackHeight}px`;

    dragCards.forEach((card, i) => {
      const el = createCardEl(card, { cardBack: settings.cardBack });
      el.style.position = 'absolute';
      el.style.top = `${i * 28}px`;
      el.style.left = '0';
      ghost.appendChild(el);
    });

    ghost.classList.add('dragging');

    drag = {
      cards: dragCards,
      fromPile,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    // Hide originals
    cardEl.style.opacity = '0.3';
    if (dragCards.length > 1) {
      const ti = parseInt(fromPile.split('_')[1]);
      document.querySelectorAll(`#tableau-${ti} .card`).forEach(el => {
        if (parseInt(el.dataset.cardIndex) > cardIdx) el.style.opacity = '0.3';
      });
    }
  });

  document.addEventListener('mousemove', e => {
    if (!drag) return;
    ghost.style.left = `${e.clientX - drag.offsetX}px`;
    ghost.style.top = `${e.clientY - drag.offsetY}px`;

    // Highlight valid drop targets
    document.querySelectorAll('.pile-highlight').forEach(el => el.classList.remove('pile-highlight'));
    const state = getState();
    const card = drag.cards[0];

    for (let t = 0; t < 7; t++) {
      if (drag.fromPile === `tableau_${t}`) continue;
      if (canMoveToTableau(card, state.tableaus[t], getSettings().freeEmpty)) {
        document.getElementById(`tableau-${t}`)?.classList.add('pile-highlight');
      }
    }
    if (drag.cards.length === 1) {
      for (let f = 0; f < 4; f++) {
        if (canMoveToFoundation(card, state.foundations[f])) {
          document.getElementById(`foundation-${f}`)?.classList.add('pile-highlight');
        }
      }
    }
  });

  document.addEventListener('mouseup', e => {
    if (!drag) return;
    ghost.classList.remove('dragging');
    ghost.innerHTML = '';
    document.querySelectorAll('[style*="opacity: 0.3"]').forEach(el => el.style.opacity = '');
    document.querySelectorAll('.pile-highlight').forEach(el => el.classList.remove('pile-highlight'));

    const state = getState();
    const card = drag.cards[0];
    let moved = false;

    // Check foundation drop
    if (drag.cards.length === 1) {
      for (let f = 0; f < 4; f++) {
        const fEl = document.getElementById(`foundation-${f}`);
        if (fEl && isOverElement(e, fEl)) {
          if (canMoveToFoundation(card, state.foundations[f])) {
            executeMove(drag.fromPile, drag.cards, `foundation_${f}`);
            moved = true;
            break;
          }
        }
      }
    }

    if (!moved) {
      for (let t = 0; t < 7; t++) {
        if (drag.fromPile === `tableau_${t}`) continue;
        const tEl = document.getElementById(`tableau-${t}`);
        if (tEl && isOverElement(e, tEl)) {
          if (canMoveToTableau(card, state.tableaus[t], getSettings().freeEmpty)) {
            executeMove(drag.fromPile, drag.cards, `tableau_${t}`);
            moved = true;
            break;
          }
        }
      }
    }

    if (!moved) playSFX(TRACKS.sfx.error);
    drag = null;
    selected = null;
    renderGame(false);
  });

  // Touch support
  document.getElementById('game-board').addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const fakeEvent = { target: touch.target, clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => e.preventDefault() };
    document.getElementById('game-board').dispatchEvent(Object.assign(new MouseEvent('mousedown', fakeEvent), fakeEvent));
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!drag) return;
    e.preventDefault();
    const touch = e.touches[0];
    ghost.style.left = `${touch.clientX - drag.offsetX}px`;
    ghost.style.top = `${touch.clientY - drag.offsetY}px`;
  }, { passive: false });

  document.addEventListener('touchend', e => {
    if (!drag) return;
    const touch = e.changedTouches[0];
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: touch.clientX, clientY: touch.clientY }));
  });
}

function isOverElement(e, el) {
  const r = el.getBoundingClientRect();
  return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderGame(isNew = false) {
  const state = getState();
  if (!state) return;
  const settings = getSettings();

  renderStock(state.stock, state.drawMode, settings);
  renderWaste(state.waste, state.drawMode, settings);
  for (let f = 0; f < 4; f++) renderFoundation(f, state.foundations[f], settings);
  for (let t = 0; t < 7; t++) renderTableau(t, state.tableaus[t], settings);

  updateScoreDisplay(state.score);
  updateTimerDisplay(state.time);
  updateMovesDisplay(state.moves);
  document.getElementById('moves-display').style.display = settings.showMoves ? 'flex' : 'none';

  const acBar = document.getElementById('auto-complete-bar');
  acBar.style.display = state.canAutoComplete ? 'flex' : 'none';
}

function renderStock(stock, drawMode, settings) {
  const el = document.getElementById('stock');
  el.innerHTML = '';
  const state = getState();
  const recycleCount = state?.recycleCount || 0;
  const hasWaste = (state?.waste?.length || 0) > 0;
  const canRecycle = getSettings().unlimitedDraw;

  if (stock.length === 0) {
    const empty = createPileEmptyEl(hasWaste ? 'stock-recycle' : 'stock-empty', 0);
    // 無法循環時給視覺暗示
    if (!hasWaste || !canRecycle) empty.style.opacity = '0.4';
    el.appendChild(empty);
    // 顯示已循環次數
    if (recycleCount > 0 && hasWaste) {
      const badge = document.createElement('span');
      badge.className = 'stock-badge stock-badge-cycle';
      badge.textContent = `${recycleCount}×`;
      badge.title = `已循環 ${recycleCount} 次`;
      el.appendChild(badge);
    }
  } else {
    const cardEl = createCardEl({ ...stock[stock.length - 1], faceUp: false }, { cardBack: settings.cardBack });
    cardEl.dataset.pile = 'stock';
    cardEl.dataset.cardIndex = stock.length - 1;
    el.appendChild(cardEl);
    // 剩餘牌數 badge
    const badge = document.createElement('span');
    badge.className = 'stock-badge';
    badge.textContent = stock.length;
    el.appendChild(badge);
    // 循環次數 badge
    if (recycleCount > 0) {
      const cycleBadge = document.createElement('span');
      cycleBadge.className = 'stock-badge stock-badge-cycle';
      cycleBadge.textContent = `${recycleCount}×`;
      cycleBadge.title = `已循環 ${recycleCount} 次`;
      el.appendChild(cycleBadge);
    }
  }
}

function renderWaste(waste, drawMode, settings) {
  const el = document.getElementById('waste');
  el.innerHTML = '';
  if (waste.length === 0) {
    el.appendChild(createPileEmptyEl('waste', 0));
    return;
  }
  if (drawMode === 3) {
    const show = waste.slice(-3);
    show.forEach((card, i) => {
      const isTop = i === show.length - 1;
      const cardEl = createCardEl(card, { cardBack: settings.cardBack });
      cardEl.dataset.pile = 'waste';
      cardEl.dataset.cardIndex = waste.length - show.length + i;
      cardEl.style.position = 'absolute';
      cardEl.style.left = `${i * 18}px`;
      cardEl.style.zIndex = i;
      if (!isTop) cardEl.style.pointerEvents = 'none';
      el.appendChild(cardEl);
    });
    el.style.position = 'relative';
  } else {
    const cardEl = createCardEl(waste[waste.length - 1], { cardBack: settings.cardBack });
    cardEl.dataset.pile = 'waste';
    cardEl.dataset.cardIndex = waste.length - 1;
    el.appendChild(cardEl);
  }
}

function renderFoundation(fi, pile, settings) {
  const el = document.getElementById(`foundation-${fi}`);
  el.innerHTML = '';
  if (pile.length === 0) {
    el.appendChild(createPileEmptyEl('foundation', fi));
  } else {
    const card = pile[pile.length - 1];
    const cardEl = createCardEl(card, { cardBack: settings.cardBack });
    cardEl.dataset.pile = `foundation_${fi}`;
    cardEl.dataset.cardIndex = pile.length - 1;
    el.appendChild(cardEl);
  }
}

function renderTableau(ti, pile, settings) {
  const el = document.getElementById(`tableau-${ti}`);
  el.innerHTML = '';

  if (pile.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'tableau-empty-target';
    el.appendChild(empty);
    return;
  }

  const OFFSET_DOWN = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tableau-offset-down')) || 15;
  const OFFSET_UP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tableau-offset-up')) || 28;

  let top = 0;
  pile.forEach((card, i) => {
    const cardEl = createCardEl(card, { cardBack: settings.cardBack });
    cardEl.dataset.pile = `tableau_${ti}`;
    cardEl.dataset.cardIndex = i;
    cardEl.style.position = 'absolute';
    cardEl.style.top = `${top}px`;
    cardEl.style.left = '0';
    cardEl.style.zIndex = i + 1;
    el.appendChild(cardEl);
    if (i < pile.length - 1) {
      top += pile[i].faceUp ? OFFSET_UP : OFFSET_DOWN;
    }
  });

  const CARD_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-height')) || 112;
  el.style.minHeight = `${top + CARD_HEIGHT}px`;
}

// ─── Event Bindings ───────────────────────────────────────────────────────────
function bindMenuEvents() {
  document.getElementById('btn-new-game').addEventListener('click', () => {
    playSFX(TRACKS.sfx.click);
    showModal('modal-new-game');
  });
  document.getElementById('btn-continue').addEventListener('click', () => {
    playSFX(TRACKS.sfx.click);
    resumeGame();
  });
  document.getElementById('btn-leaderboard').addEventListener('click', () => {
    playSFX(TRACKS.sfx.click);
    renderLeaderboard();
    showScreen('leaderboard');
  });
  document.getElementById('btn-settings-menu').addEventListener('click', () => {
    playSFX(TRACKS.sfx.click);
    showScreen('settings');
  });
}

function bindGameEvents() {
  const board = document.getElementById('game-board');
  board.addEventListener('click', handleCardClick);
  board.addEventListener('dblclick', handleDoubleClick);
  initDragDrop();

  document.getElementById('btn-pause').addEventListener('click', () => {
    pauseTimer();
    playSFX(TRACKS.sfx.modal_open);
    showModal('modal-pause');
  });
  document.getElementById('btn-undo').addEventListener('click', () => doUndo());
  document.getElementById('btn-hint').addEventListener('click', () => doHint());
  document.getElementById('btn-auto-complete').addEventListener('click', () => startAutoComplete());
}

function bindModalEvents() {
  // New Game Modal
  document.getElementById('btn-start-game').addEventListener('click', () => {
    const mode = document.querySelector('input[name="ng-drawMode"]:checked')?.value || '1';
    hideModal('modal-new-game');
    startNewGame(parseInt(mode));
  });
  document.getElementById('btn-cancel-new-game').addEventListener('click', () => hideModal('modal-new-game'));

  // Pause Modal
  document.getElementById('btn-resume').addEventListener('click', () => {
    hideModal('modal-pause');
    resumeTimer();
  });
  document.getElementById('btn-restart').addEventListener('click', () => {
    hideModal('modal-pause');
    const state = getState();
    startNewGame(state.drawMode);
  });
  document.getElementById('btn-save-game').addEventListener('click', () => {
    const state = getState();
    if (saveGame(state)) {
      document.getElementById('btn-continue').style.display = 'flex';
      showToast('遊戲已儲存', 'success');
    } else {
      showToast('儲存失敗', 'error');
    }
  });
  document.getElementById('btn-settings-pause').addEventListener('click', () => {
    hideModal('modal-pause');
    showScreen('settings');
  });
  document.getElementById('btn-home').addEventListener('click', () => {
    hideAllModals();
    stopTimer();
    clearSave();
    selected = null;
    autoCompleting = false;
    pendingWin = false;
    showScreen('menu');
    playBGM(TRACKS.bgm.menu.src, 'menu');
  });

  // Win Modal
  document.getElementById('btn-save-record').addEventListener('click', () => {
    hideModal('modal-win');
    document.getElementById('player-name-input').value = '';
    showModal('modal-save-record');
  });
  document.getElementById('btn-play-again').addEventListener('click', () => {
    hideModal('modal-win');
    const state = getState();
    startNewGame(state?.drawMode || 1);
  });

  // No Moves Modal
  document.getElementById('btn-undo-no-moves').addEventListener('click', () => {
    hideModal('modal-no-moves');
    doUndo();
  });
  document.getElementById('btn-restart-no-moves').addEventListener('click', () => {
    hideModal('modal-no-moves');
    const state = getState();
    startNewGame(state?.drawMode || 1);
  });

  // Save Record Modal
  document.getElementById('btn-confirm-save-record').addEventListener('click', () => {
    const name = document.getElementById('player-name-input').value.trim() || '匿名玩家';
    const state = getState();
    const today = new Date().toISOString().slice(0, 10);
    addRecord({ name, score: state.score, time: state.time, moves: state.moves, date: today, drawMode: state.drawMode });
    hideModal('modal-save-record');
    showToast('紀錄已儲存！', 'success');
    document.getElementById('btn-continue').style.display = 'none';
  });
  document.getElementById('btn-cancel-save-record').addEventListener('click', () => hideModal('modal-save-record'));
  document.getElementById('player-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-confirm-save-record').click();
  });
}

function bindSettingsEvents() {
  document.getElementById('btn-back-settings').addEventListener('click', () => {
    const prev = document.querySelector('.screen.leaving')?.id?.replace('screen-', '') || 'menu';
    showScreen('menu');
  });
  document.getElementById('btn-reset-settings').addEventListener('click', () => {
    resetSettings();
    loadSettingsUI();
    applyAllSettings();
    showToast('設定已重置', 'info');
  });

  document.querySelectorAll('input[name="drawMode"]').forEach(r => {
    r.addEventListener('change', e => updateSetting('drawMode', parseInt(e.target.value)));
  });
  document.getElementById('unlimited-draw').addEventListener('change', e => updateSetting('unlimitedDraw', e.target.checked));
  document.getElementById('foundation-movable').addEventListener('change', e => updateSetting('foundationMovable', e.target.checked));
  document.getElementById('free-empty').addEventListener('change', e => updateSetting('freeEmpty', e.target.checked));
  document.getElementById('auto-foundation').addEventListener('change', e => updateSetting('autoFoundation', e.target.checked));
  document.getElementById('show-moves').addEventListener('change', e => {
    updateSetting('showMoves', e.target.checked);
    const d = document.getElementById('moves-display');
    if (d) d.style.display = e.target.checked ? 'flex' : 'none';
  });

  document.querySelectorAll('input[name="theme"]').forEach(r => {
    r.addEventListener('change', e => {
      updateSetting('theme', e.target.value);
      applyTheme(e.target.value);
      // 如果目前在遊戲畫面，即時切換 BGM
      if (document.getElementById('screen-game').classList.contains('active')) {
        playGameBGM();
      }
    });
  });
  document.querySelectorAll('.card-back-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.card-back-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const back = opt.dataset.back;
      updateSetting('cardBack', back);
      applyCardBack(back);
      const state = getState();
      if (state) renderGame(false);
    });
  });

  document.getElementById('bgm-volume').addEventListener('input', e => {
    const v = parseInt(e.target.value) / 100;
    document.getElementById('bgm-volume-value').textContent = `${e.target.value}%`;
    updateSetting('bgmVolume', v);
    setBGMVolume(v);
  });
  document.getElementById('sfx-volume').addEventListener('input', e => {
    const v = parseInt(e.target.value) / 100;
    document.getElementById('sfx-volume-value').textContent = `${e.target.value}%`;
    updateSetting('sfxVolume', v);
    setSFXVolume(v);
  });

  document.querySelectorAll('input[name="animSpeed"]').forEach(r => {
    r.addEventListener('change', e => {
      updateSetting('animationSpeed', e.target.value);
      applyAnimSpeed(e.target.value);
    });
  });
}

function bindLeaderboardEvents() {
  document.getElementById('btn-back-leaderboard').addEventListener('click', () => showScreen('menu'));
  document.getElementById('leaderboard-mode-filter').addEventListener('change', () => renderLeaderboard());
  document.getElementById('leaderboard-sort').addEventListener('change', () => renderLeaderboard());
  document.getElementById('btn-clear-leaderboard').addEventListener('click', () => {
    const mode = parseInt(document.getElementById('leaderboard-mode-filter').value);
    clearLeaderboard(mode);
    renderLeaderboard();
    showToast('排行榜已清除', 'info');
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const screen = document.querySelector('.screen.active')?.id;
    switch (e.key) {
      case ' ':
        if (screen === 'screen-game') { e.preventDefault(); drawFromStock(); }
        break;
      case 'z': case 'Z':
        if ((e.ctrlKey || e.metaKey) && screen === 'screen-game') { e.preventDefault(); doUndo(); }
        break;
      case 'h': case 'H':
        if (screen === 'screen-game') doHint();
        break;
      case 'Escape':
        if (document.querySelector('.modal.active')) {
          const modal = document.querySelector('.modal.active');
          if (modal?.id !== 'modal-pause') {
            hideAllModals();
            if (screen === 'screen-game') resumeTimer();
          }
        } else if (screen === 'screen-game') {
          pauseTimer();
          showModal('modal-pause');
        }
        break;
      case 'm': case 'M':
        if (isMuted()) { unmute(); showToast('已開啟音效', 'info'); }
        else { mute(); showToast('已靜音', 'info'); }
        break;
    }
  });
}

// ─── Settings UI ──────────────────────────────────────────────────────────────
function loadSettingsUI() {
  const s = getSettings();
  const r = document.querySelector(`input[name="drawMode"][value="${s.drawMode}"]`);
  if (r) r.checked = true;
  document.getElementById('unlimited-draw').checked = s.unlimitedDraw;
  document.getElementById('foundation-movable').checked = s.foundationMovable;
  document.getElementById('free-empty').checked = s.freeEmpty;
  document.getElementById('auto-foundation').checked = s.autoFoundation;
  document.getElementById('show-moves').checked = s.showMoves;

  const tr = document.querySelector(`input[name="theme"][value="${s.theme}"]`);
  if (tr) tr.checked = true;

  document.querySelectorAll('.card-back-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.back === s.cardBack);
  });

  document.getElementById('bgm-volume').value = Math.round(s.bgmVolume * 100);
  document.getElementById('bgm-volume-value').textContent = `${Math.round(s.bgmVolume * 100)}%`;
  document.getElementById('sfx-volume').value = Math.round(s.sfxVolume * 100);
  document.getElementById('sfx-volume-value').textContent = `${Math.round(s.sfxVolume * 100)}%`;

  const ar = document.querySelector(`input[name="animSpeed"][value="${s.animationSpeed}"]`);
  if (ar) ar.checked = true;
}

function applyAllSettings() {
  const s = getSettings();
  applyTheme(s.theme);
  applyAnimSpeed(s.animationSpeed);
  applyCardBack(s.cardBack);
  setBGMVolume(s.bgmVolume);
  setSFXVolume(s.sfxVolume);
}

// ─── Leaderboard Render ───────────────────────────────────────────────────────
function renderLeaderboard() {
  const mode = parseInt(document.getElementById('leaderboard-mode-filter').value);
  const sortBy = document.getElementById('leaderboard-sort').value;
  const records = sortRecords(getLeaderboard(mode), sortBy);
  const tbody = document.getElementById('leaderboard-body');
  const empty = document.getElementById('leaderboard-empty');
  tbody.innerHTML = '';

  if (records.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const medals = ['🥇', '🥈', '🥉'];
  records.forEach((r, i) => {
    const tr = document.createElement('tr');
    const m = Math.floor(r.time / 60);
    const s = r.time % 60;
    tr.innerHTML = `
      <td>${medals[i] || i + 1}</td>
      <td>${r.name}</td>
      <td>${r.score.toLocaleString()}</td>
      <td>${m}:${String(s).padStart(2, '0')}</td>
      <td>${r.date}</td>`;
    tbody.appendChild(tr);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
boot();
initFloatingCards();
