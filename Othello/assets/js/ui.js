// DOM rendering, screens, controls, settings binding, overlays, and responsive board sizing.
const UIManager = {
      selectedDifficulty: 'normal',
      selectedColor: 'black',
      previousCounts: { black: 2, white: 2 },
      toastTimer: null,
      init() {
        this.cache();
        this.buildBoard();
        this.bindEvents();
        this.bindSettings();
        this.updateSettingsUI();
        this.updateRecords();
        this.updateContinueButton();
        this.updateBoardSize();
        window.addEventListener('resize', () => this.updateBoardSize());
        window.addEventListener('orientationchange', () => this.updateBoardSize());
      },
      cache() {
        this.screens = [...document.querySelectorAll('.screen')];
        this.board = document.getElementById('board');
        this.statusText = document.getElementById('statusText');
        this.statusStone = document.getElementById('statusStone');
        this.turnStone = document.getElementById('turnStone');
        this.thinking = document.getElementById('thinking');
        this.blackCount = document.getElementById('blackCount');
        this.whiteCount = document.getElementById('whiteCount');
        this.blackPanel = document.getElementById('blackPanel');
        this.whitePanel = document.getElementById('whitePanel');
        this.blackLabel = document.getElementById('blackLabel');
        this.whiteLabel = document.getElementById('whiteLabel');
        this.mobileBlack = document.getElementById('mobileBlack');
        this.mobileWhite = document.getElementById('mobileWhite');
        this.pauseOverlay = document.getElementById('pause-overlay');
        this.resultOverlay = document.getElementById('result-overlay');
        this.rulesOverlay = document.getElementById('rules-overlay');
        this.toastEl = document.getElementById('toast');
        this.hintBtn = document.getElementById('hintBtn');
        this.continueBtn = document.getElementById('continueBtn');
      },
      buildBoard() {
        this.board.innerHTML = '';
        for (let row = 0; row < 8; row += 1) {
          for (let col = 0; col < 8; col += 1) {
            const cell = document.createElement('button');
            cell.className = 'board__cell';
            cell.type = 'button';
            cell.role = 'gridcell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.setAttribute('aria-label', `${row + 1}列${col + 1}行`);
            cell.addEventListener('click', () => GameEngine.humanMove(row, col));
            this.board.appendChild(cell);
          }
        }
      },
      bindEvents() {
        document.addEventListener('click', event => {
          const button = event.target.closest('button');
          if (!button) return;
          AudioEngine.sfx('button');
          const screen = button.dataset.screen;
          const action = button.dataset.action;
          if (screen) this.showScreen(screen);
          if (action) this.handleAction(action);
        });
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
          btn.addEventListener('click', () => {
            this.selectedDifficulty = btn.dataset.difficulty;
            document.querySelectorAll('[data-difficulty]').forEach(el => el.classList.toggle('is-selected', el === btn));
          });
        });
        document.querySelectorAll('[data-color]').forEach(btn => {
          btn.addEventListener('click', () => {
            this.selectedColor = btn.dataset.color;
            document.querySelectorAll('[data-color]').forEach(el => el.classList.toggle('is-selected', el === btn));
          });
        });
        document.addEventListener('click', () => AudioEngine.resume(), { once: true });
      },
      bindSettings() {
        const ids = ['musicEnabled', 'sfxEnabled', 'masterVolume', 'musicVolume', 'sfxVolume', 'aiSpeed', 'showHints'];
        ids.forEach(id => {
          const input = document.getElementById(id);
          input.addEventListener('input', () => {
            const isCheck = input.type === 'checkbox';
            StorageManager.settings[id] = isCheck ? input.checked : input.value;
            StorageManager.saveSettings();
            AudioEngine.applySettings();
            if (id === 'showHints') this.render();
          });
        });
      },
      updateSettingsUI() {
        const s = StorageManager.settings;
        ['musicEnabled', 'sfxEnabled', 'showHints'].forEach(id => document.getElementById(id).checked = Boolean(s[id]));
        ['masterVolume', 'musicVolume', 'sfxVolume', 'aiSpeed'].forEach(id => document.getElementById(id).value = s[id]);
        this.selectedDifficulty = s.difficulty || 'normal';
        this.selectedColor = s.playerColor || 'black';
      },
      handleAction(action) {
        const handlers = {
          'new-game': () => this.showScreen('difficulty'),
          'start-selected': () => GameEngine.startNew({ difficulty: this.selectedDifficulty, playerColor: this.selectedColor }),
          'continue-game': () => GameEngine.continueSaved(),
          'show-rules': () => this.rulesOverlay.classList.remove('hidden'),
          'close-rules': () => this.rulesOverlay.classList.add('hidden'),
          'pause': () => this.pauseOverlay.classList.remove('hidden'),
          'resume': () => this.pauseOverlay.classList.add('hidden'),
          'restart': () => {
            this.pauseOverlay.classList.add('hidden');
            GameEngine.startNew({ difficulty: GameEngine.difficulty, playerColor: GameEngine.playerColor === BLACK ? 'black' : 'white' });
          },
          'quit-home': () => {
            this.pauseOverlay.classList.add('hidden');
            this.resultOverlay.classList.add('hidden');
            this.showScreen('home');
          },
          'toggle-hints': () => {
            StorageManager.settings.showHints = !StorageManager.settings.showHints;
            StorageManager.saveSettings();
            this.updateSettingsUI();
            this.render();
          },
          'play-again': () => {
            this.resultOverlay.classList.add('hidden');
            GameEngine.startNew({ difficulty: GameEngine.difficulty, playerColor: GameEngine.playerColor === BLACK ? 'black' : 'white' });
          },
          'reset-records': () => {
            StorageManager.resetRecords();
            this.updateRecords();
            this.toast('戰績已重置');
          }
        };
        handlers[action]?.();
      },
      showScreen(name) {
        this.screens.forEach(screen => screen.classList.toggle('screen--active', screen.id === `screen-${name}`));
        if (name === 'records') this.updateRecords();
      },
      render(previousBoard = null) {
        const legal = StorageManager.settings.showHints && GameEngine.currentPlayer === GameEngine.playerColor
          ? GameEngine.getLegalMoves(GameEngine.board, GameEngine.currentPlayer)
          : [];
        const legalKeys = new Set(legal.map(move => `${move.row},${move.col}`));
        [...this.board.children].forEach(cell => {
          const row = Number(cell.dataset.row);
          const col = Number(cell.dataset.col);
          const value = GameEngine.board[row][col];
          const previous = previousBoard?.[row]?.[col] ?? value;
          cell.className = 'board__cell';
          if (legalKeys.has(`${row},${col}`)) cell.classList.add('board__cell--valid');
          if (GameEngine.lastMove?.row === row && GameEngine.lastMove?.col === col) cell.classList.add('board__cell--last');
          cell.innerHTML = '';
          if (value !== EMPTY) {
            const piece = document.createElement('span');
            piece.className = `piece piece--${value === BLACK ? 'black' : 'white'}`;
            if (previous === EMPTY && GameEngine.lastMove?.row === row && GameEngine.lastMove?.col === col) piece.classList.add('piece--placing');
            if (previous !== EMPTY && previous !== value) piece.classList.add(value === BLACK ? 'piece--flip-black' : 'piece--flip-white');
            cell.appendChild(piece);
          }
        });
        const counts = GameEngine.countPieces();
        this.updateScore(counts);
        this.updateStatus();
        this.hintBtn.textContent = `提示：${StorageManager.settings.showHints ? '開' : '關'}`;
      },
      updateScore(counts) {
        this.blackCount.textContent = counts.black;
        this.whiteCount.textContent = counts.white;
        this.mobileBlack.querySelector('strong').textContent = counts.black;
        this.mobileWhite.querySelector('strong').textContent = counts.white;
        if (counts.black !== this.previousCounts.black) this.pulse(this.blackCount);
        if (counts.white !== this.previousCounts.white) this.pulse(this.whiteCount);
        this.previousCounts = counts;
      },
      pulse(el) {
        el.classList.remove('score-pulse');
        void el.offsetWidth;
        el.classList.add('score-pulse');
      },
      updateStatus() {
        const isAi = GameEngine.currentPlayer === GameEngine.aiPlayer;
        const legal = GameEngine.getLegalMoves(GameEngine.board, GameEngine.currentPlayer).length;
        this.statusText.textContent = isAi ? `AI 思考中，${GameEngine.colorName(GameEngine.currentPlayer)}回合` : `${GameEngine.colorName(GameEngine.currentPlayer)}回合，可下 ${legal} 步`;
        const colorClass = GameEngine.currentPlayer === BLACK ? 'black' : 'white';
        this.statusStone.className = `turn-stone ${colorClass}`;
        this.turnStone.className = `turn-stone ${colorClass}`;
        this.blackPanel.classList.toggle('is-turn', GameEngine.currentPlayer === BLACK);
        this.whitePanel.classList.toggle('is-turn', GameEngine.currentPlayer === WHITE);
        this.blackLabel.textContent = GameEngine.playerColor === BLACK ? '玩家' : 'AI';
        this.whiteLabel.textContent = GameEngine.playerColor === WHITE ? '玩家' : 'AI';
      },
      setThinking(active) {
        this.thinking.classList.toggle('is-active', active);
        this.updateStatus();
      },
      showResult(result, playerCount, aiCount) {
        const title = result === 'win' ? '勝利！' : result === 'lose' ? '惜敗' : '平手';
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultPlayer').textContent = playerCount;
        document.getElementById('resultAi').textContent = aiCount;
        const total = playerCount + aiCount || 1;
        document.getElementById('resultDetail').textContent = `占有率 ${Math.round(playerCount / total * 100)}%，本局翻棋 ${GameEngine.moveHistory.reduce((sum, move) => sum + move.flips, 0)} 顆。`;
        this.resultOverlay.classList.remove('hidden');
      },
      toast(message) {
        clearTimeout(this.toastTimer);
        this.toastEl.textContent = message;
        this.toastEl.classList.remove('hidden');
        this.toastTimer = setTimeout(() => this.toastEl.classList.add('hidden'), 2000);
      },
      updateRecords() {
        const r = StorageManager.records;
        document.getElementById('winsRecord').textContent = r.wins;
        document.getElementById('lossesRecord').textContent = r.losses;
        document.getElementById('drawsRecord').textContent = r.draws;
        document.getElementById('bestRecord').textContent = r.bestStreak;
      },
      updateContinueButton() {
        this.continueBtn.disabled = !StorageManager.loadState();
      },
      updateBoardSize() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let size;
        if (vw <= 480) size = Math.min(vw - 32, 340);
        else if (vw <= 667) size = Math.min(vh - 140, 380);
        else if (vw <= 1024) size = Math.min(480, vw - 200);
        else size = 520;
        document.documentElement.style.setProperty('--board-size', `${Math.max(280, size)}px`);
      }
    };
