import { chooseAiMove, aiDelay } from "./ai.js";
import { AudioManager } from "./audio.js";
import { BoardView } from "./board.js";
import { GameState } from "./game.js";
import { SIDES, opponent, pieceText, sideText } from "./pieces.js";
import { loadSettings, resetSettings, saveSettings } from "./settings.js";

const game = new GameState();
let settings = loadSettings();
let selected = null;
let legalMoves = [];
let aiThinking = false;
let timerId = null;
let lastTick = Date.now();
let settingsReturnScreen = "main-screen";

const audio = new AudioManager(settings);
const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const boardView = new BoardView($("#board-canvas"), handleBoardPoint);

bindNavigation();
bindSettings();
bindGameControls();
applySettingsToUi();
showScreen("main-screen");
render();

function bindNavigation() {
  $("#start-btn").addEventListener("click", startGame);
  $("#difficulty-btn").addEventListener("click", () => showScreen("difficulty-screen"));
  $("#settings-btn").addEventListener("click", () => openSettings("main-screen"));
  $("#rules-btn").addEventListener("click", () => showScreen("rules-screen"));
  document.querySelectorAll(".back-main").forEach((button) => button.addEventListener("click", () => {
    showScreen(document.querySelector(".screen.active")?.id === "settings-screen" ? settingsReturnScreen : "main-screen");
  }));
  $(".difficulty-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-difficulty]");
    if (!card) return;
    settings.aiDifficulty = card.dataset.difficulty;
    saveAndRenderSettings();
    showScreen("main-screen");
  });
}

function bindSettings() {
  $("#bgm-enabled").addEventListener("change", (e) => {
    settings.bgmEnabled = e.target.checked;
    saveAndRenderSettings();
  });
  $("#sfx-enabled").addEventListener("change", (e) => {
    settings.sfxEnabled = e.target.checked;
    saveAndRenderSettings();
  });
  $("#volume-slider").addEventListener("input", (e) => {
    const value = Number(e.target.value) / 100;
    settings.bgmVolume = value;
    settings.sfxVolume = value;
    saveAndRenderSettings();
  });
  $("#legal-enabled").addEventListener("change", (e) => {
    settings.showLegalMoves = e.target.checked;
    saveAndRenderSettings();
  });
  $("#timer-enabled").addEventListener("change", (e) => {
    settings.showTimer = e.target.checked;
    saveAndRenderSettings();
  });
  $("#theme-select").addEventListener("change", (e) => {
    settings.boardTheme = e.target.value;
    saveAndRenderSettings();
  });
  $("#piece-style-select").addEventListener("change", (e) => {
    settings.pieceStyle = e.target.value;
    saveAndRenderSettings();
  });
  $("#reset-settings-btn").addEventListener("click", () => {
    settings = resetSettings();
    saveAndRenderSettings();
  });
}

function bindGameControls() {
  $("#home-btn").addEventListener("click", () => {
    stopTimer();
    showScreen("main-screen");
  });
  $("#sound-btn").addEventListener("click", () => {
    settings.sfxEnabled = !settings.sfxEnabled;
    saveAndRenderSettings();
  });
  $("#undo-btn").addEventListener("click", () => {
    if (aiThinking) return;
    if (game.undoPair()) {
      selected = null;
      legalMoves = [];
      audio.play("move");
      render();
    }
  });
  $("#restart-btn").addEventListener("click", startGame);
  $("#game-settings-btn").addEventListener("click", () => openSettings("game-screen"));
  $("#result-home-btn").addEventListener("click", () => {
    $("#result-modal").close();
    stopTimer();
    showScreen("main-screen");
  });
  $("#result-restart-btn").addEventListener("click", () => {
    $("#result-modal").close();
    startGame();
  });
}

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  if (id === "game-screen") requestAnimationFrame(() => boardView.draw());
}

function openSettings(returnTo) {
  settingsReturnScreen = returnTo;
  showScreen("settings-screen");
}

function startGame() {
  game.reset();
  selected = null;
  legalMoves = [];
  aiThinking = false;
  showScreen("game-screen");
  startTimer();
  render();
}

function handleBoardPoint(row, col) {
  if (aiThinking || game.status !== "playing" || game.currentTurn !== SIDES.RED) return;
  const piece = game.board[row][col];

  if (selected && legalMoves.some((move) => move.row === row && move.col === col)) {
    const result = game.move(selected.row, selected.col, row, col);
    selected = null;
    legalMoves = [];
    if (result.ok) {
      audio.play(result.captured ? "capture" : "move");
      if (result.check) audio.play("check");
      render();
      if (result.gameOver) finishGame();
      else queueAiMove();
    }
    return;
  }

  if (piece?.side === SIDES.RED) {
    selected = { row, col };
    legalMoves = game.legalMovesFor(row, col);
    audio.play("select");
  } else {
    selected = null;
    legalMoves = [];
  }
  render();
}

function queueAiMove() {
  aiThinking = true;
  $("#thinking-badge").hidden = false;
  renderStatus("AI 思考中");
  window.setTimeout(() => {
    const move = chooseAiMove(game.board, SIDES.BLACK, settings.aiDifficulty);
    if (move && game.status === "playing") {
      const result = game.move(move.from.row, move.from.col, move.to.row, move.to.col);
      audio.play(result.captured ? "capture" : "move");
      if (result.check) audio.play("check");
      if (result.gameOver) finishGame();
    }
    aiThinking = false;
    $("#thinking-badge").hidden = true;
    render();
  }, aiDelay(settings.aiDifficulty));
}

function finishGame() {
  stopTimer();
  audio.play(game.winner === SIDES.RED ? "win" : "lose");
  render();
  const modal = $("#result-modal");
  $("#result-title").textContent = game.winner === SIDES.RED ? "你獲勝" : "AI 獲勝";
  $("#result-detail").textContent = `${game.reason}，共 ${game.moveCount} 手，紅方 ${formatTime(game.timer.red)}，黑方 ${formatTime(game.timer.black)}。`;
  if (!modal.open) modal.showModal();
}

function render() {
  document.body.classList.toggle("theme-dark", settings.boardTheme === "dark");
  boardView.setData(game, selected, legalMoves, settings);
  renderStatus();
  renderCaptured();
  renderMoveList();
  renderTimers();
  applySettingsToUi();
}

function renderStatus(forced = null) {
  if (forced) {
    $("#status-text").textContent = forced;
    return;
  }
  if (game.status !== "playing") {
    $("#status-text").textContent = `${sideText(game.winner)}勝利：${game.reason}`;
  } else {
    $("#status-text").textContent = `${sideText(game.currentTurn)}行棋${game.isCheck ? " · 將軍" : ""}`;
  }
}

function renderCaptured() {
  const redTaken = game.capturedPieces.filter((p) => p.side === SIDES.RED);
  const blackTaken = game.capturedPieces.filter((p) => p.side === SIDES.BLACK);
  $("#captured-red").innerHTML = redTaken.map(capturedPieceHtml).join("");
  $("#captured-black").innerHTML = blackTaken.map(capturedPieceHtml).join("");
}

function capturedPieceHtml(piece) {
  return `<span class="captured-piece ${piece.side}" title="${pieceText(piece)}">${pieceText(piece)}</span>`;
}

function renderMoveList() {
  $("#move-list").innerHTML = game.moveHistory.slice(-40).map((move) => `<li>${move.notation}</li>`).join("");
}

function startTimer() {
  stopTimer();
  lastTick = Date.now();
  timerId = window.setInterval(() => {
    const now = Date.now();
    const delta = Math.round((now - lastTick) / 1000);
    lastTick = now;
    if (game.status === "playing" && delta > 0) {
      game.timer[game.currentTurn] += delta;
      renderTimers();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function renderTimers() {
  const display = settings.showTimer ? "" : "none";
  $("#red-timer").style.display = display;
  $("#black-timer").style.display = display;
  $("#red-timer").textContent = formatTime(game.timer.red);
  $("#black-timer").textContent = formatTime(game.timer.black);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function saveAndRenderSettings() {
  saveSettings(settings);
  audio.update(settings);
  render();
}

function applySettingsToUi() {
  $("#bgm-enabled").checked = settings.bgmEnabled;
  $("#sfx-enabled").checked = settings.sfxEnabled;
  $("#volume-slider").value = Math.round(settings.sfxVolume * 100);
  $("#legal-enabled").checked = settings.showLegalMoves;
  $("#timer-enabled").checked = settings.showTimer;
  $("#theme-select").value = settings.boardTheme;
  $("#piece-style-select").value = settings.pieceStyle;
  $("#sound-btn").textContent = settings.sfxEnabled ? "♪" : "∅";
  document.querySelectorAll(".difficulty-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.difficulty === settings.aiDifficulty);
  });
}
