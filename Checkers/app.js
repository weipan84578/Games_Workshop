(function () {
  const $ = selector => document.querySelector(selector);
  const boardEl = $('#board');
  const modal = $('#modal');
  const modalTitle = $('#modal-title');
  const modalBody = $('#modal-body');
  const modalActions = $('#modal-actions');
  const difficultyNotes = {
    easy: '簡單：深度 2，少量隨機失誤。',
    medium: '普通：深度 4，Alpha-Beta 剪枝。',
    hard: '困難：深度 6，評估較完整，思考時間較長。'
  };

  const state = {
    screen: 'menu',
    settings: CheckersStorage.getSettings(),
    game: new GameEngine(),
    ai: null,
    audio: null,
    selected: null,
    validMoves: [],
    thinking: false,
    recordedGame: false
  };

  window.GameState = state;
  state.ai = new AIEngine(state.game);
  state.audio = new AudioEngine(state.settings);

  function init() {
    buildMiniBoard();
    bindEvents();
    applySettingsToUI();
    updateMenuStats();
    showScreen('menu');
    createParticles();
  }

  function buildMiniBoard() {
    const mini = $('.mini-board');
    for (let i = 0; i < 16; i += 1) mini.appendChild(document.createElement('span'));
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const screenTarget = event.target.closest('[data-screen]');
      if (screenTarget) {
        state.audio.play('button');
        showScreen(screenTarget.dataset.screen);
      }

      const setting = event.target.closest('[data-setting]');
      if (setting) {
        state.settings[setting.dataset.setting] = setting.dataset.value;
        saveAndApplySettings();
      }

      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action === 'pause') showPauseModal();
      if (action === 'rules') showRulesModal();
      if (action === 'leave-game') showScreen('menu');
    });

    $('#start-game').addEventListener('click', startGame);
    $('#confirm-start').addEventListener('click', startGame);
    $('#play-again').addEventListener('click', startGame);
    $('#show-rules').addEventListener('click', showRulesModal);
    $('#show-stats').addEventListener('click', showStatsModal);
    $('#menu-audio').addEventListener('click', toggleAudio);
    $('#game-audio').addEventListener('click', toggleAudio);
    $('#music-enabled').addEventListener('change', event => {
      state.settings.musicEnabled = event.target.checked;
      saveAndApplySettings();
    });
    $('#sfx-enabled').addEventListener('change', event => {
      state.settings.sfxEnabled = event.target.checked;
      saveAndApplySettings();
    });
    $('#music-volume').addEventListener('input', event => {
      state.settings.musicVolume = Number(event.target.value);
      saveAndApplySettings();
    });
    $('#sfx-volume').addEventListener('input', event => {
      state.settings.sfxVolume = Number(event.target.value);
      saveAndApplySettings();
      state.audio.play('select');
    });
    boardEl.addEventListener('click', onBoardClick);
    boardEl.addEventListener('keydown', onBoardKeydown);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state.screen === 'game') {
        if (state.selected) clearSelection();
        else showPauseModal();
      }
    });
  }

  function showScreen(name) {
    state.screen = name;
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.toggle('active', screen.id === `screen-${name}`);
    });
    closeModal();
    if (name === 'menu') updateMenuStats();
  }

  function applySettingsToUI() {
    document.body.dataset.theme = state.settings.theme;
    document.body.dataset.playerColor = state.settings.playerColor;
    document.querySelectorAll('[data-setting]').forEach(button => {
      button.classList.toggle('active', state.settings[button.dataset.setting] === button.dataset.value);
    });
    $('#difficulty-note').textContent = difficultyNotes[state.settings.difficulty];
    $('#music-enabled').checked = state.settings.musicEnabled;
    $('#sfx-enabled').checked = state.settings.sfxEnabled;
    $('#music-volume').value = state.settings.musicVolume;
    $('#sfx-volume').value = state.settings.sfxVolume;
    const audioIcon = state.settings.musicEnabled || state.settings.sfxEnabled ? '🔊' : '🔇';
    $('#menu-audio').textContent = audioIcon;
    $('#game-audio').textContent = audioIcon;
    const playerIcon = state.settings.playerColor === 'red' ? '🔴' : '⚫';
    const aiIcon = state.settings.playerColor === 'red' ? '⚫' : '🔴';
    $('#player-piece-label').textContent = `${playerIcon} 棋子`;
    $('#ai-piece-label').textContent = `${aiIcon} 棋子`;
    state.audio?.applySettings(state.settings);
  }

  function saveAndApplySettings() {
    CheckersStorage.saveSettings(state.settings);
    applySettingsToUI();
  }

  function toggleAudio() {
    const enabled = !(state.settings.musicEnabled || state.settings.sfxEnabled);
    state.settings.musicEnabled = enabled;
    state.settings.sfxEnabled = enabled;
    saveAndApplySettings();
    state.audio.play('button');
  }

  function startGame() {
    state.audio.play('button');
    state.game.reset();
    state.selected = null;
    state.validMoves = [];
    state.thinking = false;
    state.recordedGame = false;
    showScreen('game');
    render();
  }

  function render() {
    boardEl.innerHTML = '';
    const selectedKey = state.selected ? `${state.selected.row}-${state.selected.col}` : '';
    const validKeys = new Map(state.validMoves.map(move => [`${move.toRow}-${move.toCol}`, move]));
    const last = state.game.lastMove;
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const cell = document.createElement('button');
        const piece = state.game.board[row][col];
        const key = `${row}-${col}`;
        cell.type = 'button';
        cell.className = `cell ${(row + col) % 2 ? 'dark' : 'light'}`;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', (row + col) % 2 ? '0' : '-1');
        cell.setAttribute('aria-label', ariaForCell(row, col, piece));
        if (selectedKey === key) cell.classList.add('selected');
        if (validKeys.has(key)) {
          cell.classList.add('valid-move');
          if (validKeys.get(key).captured.length) cell.classList.add('capture-move');
        }
        if (last && ((last.fromRow === row && last.fromCol === col) || (last.toRow === row && last.toCol === col))) {
          cell.classList.add('last-move');
        }
        if (piece) cell.appendChild(renderPiece(piece, selectedKey === key));
        boardEl.appendChild(cell);
      }
    }
    updateHud();
  }

  function renderPiece(piece, selected) {
    const { ownerOf, isKing } = CheckersRules;
    const div = document.createElement('div');
    div.className = `piece ${ownerOf(piece) === 'player' ? 'player-piece' : 'ai-piece'}`;
    if (isKing(piece)) div.classList.add('king');
    if (selected) div.classList.add('selected');
    return div;
  }

  function ariaForCell(row, col, piece) {
    const names = {
      0: '空格',
      1: '玩家棋',
      2: '電腦棋',
      3: '玩家王棋',
      4: '電腦王棋'
    };
    return `第${row + 1}行第${col + 1}列，${names[piece]}`;
  }

  function updateHud() {
    $('#player-captures').textContent = state.game.capturedByPlayer;
    $('#ai-captures').textContent = state.game.capturedByAI;
    $('#player-status').classList.toggle('active', state.game.currentTurn === 'player' && !state.thinking);
    $('#ai-status').classList.toggle('active', state.game.currentTurn === 'ai' || state.thinking);
    $('#ai-status').classList.toggle('thinking', state.thinking);
    $('#ai-status').textContent = state.thinking ? '思考中' : state.game.currentTurn === 'ai' ? '電腦回合' : '等待中';
    $('#player-status').textContent = state.game.currentTurn === 'player' && !state.thinking ? '你的回合' : '等待中';
  }

  function setStatus(message) {
    $('#status-message').textContent = message;
  }

  function onBoardClick(event) {
    if (state.game.gameOver || state.thinking || state.game.currentTurn !== 'player') return;
    const cell = event.target.closest('.cell');
    if (!cell) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const targetMove = state.validMoves.find(move => move.toRow === row && move.toCol === col);
    if (targetMove) {
      makePlayerMove(targetMove);
      return;
    }
    if (CheckersRules.ownerOf(state.game.board[row][col]) === 'player') {
      selectPiece(row, col);
      return;
    }
    state.audio.play('invalid');
    setStatus('這裡不能移動，請選擇自己的棋子或有效落點。');
  }

  function onBoardKeydown(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      cell.click();
    }
    const deltas = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (deltas[event.key]) {
      event.preventDefault();
      const [dr, dc] = deltas[event.key];
      const next = boardEl.querySelector(`[data-row="${Math.max(0, Math.min(7, row + dr))}"][data-col="${Math.max(0, Math.min(7, col + dc))}"]`);
      next?.focus();
    }
  }

  function selectPiece(row, col) {
    const allMoves = state.game.getAllMoves('player');
    state.validMoves = allMoves.filter(move => move.fromRow === row && move.fromCol === col);
    if (!state.validMoves.length) {
      state.audio.play('invalid');
      setStatus('這枚棋子目前沒有合法移動。');
      return;
    }
    state.selected = { row, col };
    state.audio.play('select');
    const forced = allMoves.some(move => move.captured.length);
    setStatus(forced ? '必須吃子，請選擇紅框落點。' : '請選擇綠色落點。');
    render();
  }

  function clearSelection() {
    state.selected = null;
    state.validMoves = [];
    render();
    setStatus('已取消選擇。');
  }

  function makePlayerMove(move) {
    const result = state.game.applyMove(move);
    state.audio.play(move.captured.length ? 'capture' : 'move');
    if (result.promoted) state.audio.play('king');
    vibrate(move.captured.length ? 45 : 25);
    state.selected = null;
    state.validMoves = [];
    render();
    if (finishIfGameOver()) return;
    setStatus('電腦思考中...');
    queueAIMove();
  }

  function queueAIMove() {
    const ranges = {
      easy: [500, 800],
      medium: [800, 1200],
      hard: [1200, 2000]
    };
    const [min, max] = ranges[state.settings.difficulty];
    const delay = min + Math.random() * (max - min);
    state.thinking = true;
    render();
    setTimeout(() => {
      const move = state.ai.getMove(state.game.board, state.settings.difficulty);
      if (!move) {
        state.game.checkGameOver();
        finishIfGameOver();
        return;
      }
      const result = state.game.applyMove(move);
      state.audio.play(move.captured.length ? 'capture' : 'move');
      if (result.promoted) state.audio.play('king');
      state.thinking = false;
      render();
      if (!finishIfGameOver()) setStatus('你的回合，請選擇棋子。');
    }, delay);
  }

  function finishIfGameOver() {
    if (!state.game.gameOver) return false;
    if (!state.recordedGame) {
      CheckersStorage.recordGame(state.game.winner);
      state.recordedGame = true;
    }
    const winner = state.game.winner;
    const title = winner === 'player' ? '🎉 你獲勝了！' : winner === 'ai' ? '🤖 電腦獲勝' : '🤝 平局';
    $('#gameover-title').textContent = title;
    $('#screen-gameover').classList.toggle('player-win', winner === 'player');
    $('#final-turns').textContent = state.game.turns;
    $('#final-captures').textContent = state.game.capturedByPlayer;
    $('#final-time').textContent = formatTime(Date.now() - state.game.startedAt);
    $('#final-remaining').textContent = state.game.countPieces().player;
    state.audio.play(winner === 'player' ? 'win' : winner === 'ai' ? 'lose' : 'draw');
    showScreen('gameover');
    return true;
  }

  function updateMenuStats() {
    const stats = CheckersStorage.getStats();
    $('#menu-stats').textContent = `玩家勝場：${stats.playerWins} ｜ AI勝場：${stats.aiWins} ｜ 平局：${stats.draws}`;
  }

  function showStatsModal() {
    const stats = CheckersStorage.getStats();
    openModal('歷史戰績', `
      <p>總局數：${stats.totalGames}</p>
      <p>玩家勝場：${stats.playerWins}</p>
      <p>AI 勝場：${stats.aiWins}</p>
      <p>平局：${stats.draws}</p>
      <p>最長連勝：${stats.longestWinStreak}</p>
    `, [{ label: '關閉', action: closeModal, primary: true }]);
  }

  function showRulesModal() {
    state.audio.play('button');
    openModal('遊戲說明', `
      <div class="rules-help">
        <h3>棋盤與方向</h3>
        <ul>
          <li>棋盤為 8x8，深色格才可走棋。</li>
          <li>玩家普通棋只能向上移動，也就是 row 減小。</li>
          <li>AI 普通棋只能向下移動，也就是 row 增大。</li>
        </ul>
        <h3>移動與吃子</h3>
        <ul>
          <li>普通移動：斜向移動 1 格到空格。</li>
          <li>跳躍吃子：跳過對方棋子，落在其後方空格。</li>
          <li>若場上有可吃子的移動，玩家必須選擇吃子移動，不可進行普通移動。</li>
          <li>吃子後若仍可跳躍，必須繼續連跳。</li>
        </ul>
        <h3>王棋</h3>
        <ul>
          <li>玩家棋到達第 0 行升王，AI 棋到達第 7 行升王。</li>
          <li>王棋可向四個斜角方向移動與跳躍吃子。</li>
          <li>升王當回合結束，不再繼續連跳。</li>
        </ul>
        <h3>勝負判定</h3>
        <ul>
          <li>吃光對手棋子即可獲勝。</li>
          <li>讓對手無法進行任何合法移動即可獲勝。</li>
          <li>40 回合無吃子動作則判定平局。</li>
        </ul>
      </div>
    `, [{ label: '知道了', action: closeModal, primary: true }]);
  }

  function showPauseModal() {
    state.audio.play('button');
    openModal('遊戲暫停', '', [
      { label: '▶ 繼續遊戲', action: closeModal, primary: true },
      { label: '↺ 重新開始', action: startGame },
      { label: '⚙ 設定', action: () => showScreen('settings') },
      { label: '✕ 離開遊戲', action: () => showScreen('menu') }
    ]);
  }

  function openModal(title, body, actions) {
    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    modalActions.innerHTML = '';
    for (const item of actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `button ${item.primary ? 'primary' : 'secondary'}`;
      button.textContent = item.label;
      button.addEventListener('click', () => {
        state.audio.play('button');
        item.action();
      });
      modalActions.appendChild(button);
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  function createParticles() {
    const particles = $('#particles');
    for (let i = 0; i < 30; i += 1) {
      const span = document.createElement('span');
      span.style.left = `${Math.random() * 100}%`;
      span.style.animationDelay = `${Math.random() * 2.5}s`;
      span.style.animationDuration = `${2 + Math.random() * 2}s`;
      particles.appendChild(span);
    }
  }

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const minutes = String(Math.floor(total / 60)).padStart(2, '0');
    const seconds = String(total % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  init();
})();
