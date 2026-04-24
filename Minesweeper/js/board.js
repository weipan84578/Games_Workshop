class Board {
    constructor() {
        this.game = new window.Game();
        this.container = document.getElementById('game-board');
        this.mineCounter = document.getElementById('mine-count');
        this.timerDisplay = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultySelect = document.getElementById('difficulty-select');
        
        this.timer = new window.Timer(this.timerDisplay);
        this.longPressTimeout = null;
        this.isChordReady = false;
        this.chordTriggered = false;
        this.focusedCell = { r: 0, c: 0 };

        this.init();
    }

    init() {
        this.resetBtn.addEventListener('click', () => this.startNewGame());
        
        // Navigation
        document.getElementById('start-game-btn').addEventListener('click', () => this.showScreen('game-screen'));
        document.getElementById('open-settings-btn').addEventListener('click', () => this.showScreen('settings-screen'));
        document.getElementById('open-history-btn').addEventListener('click', () => {
            this.updateHistoryUI();
            this.showScreen('history-screen');
        });
        document.getElementById('back-to-menu-btn').addEventListener('click', () => this.showScreen('menu-screen'));
        document.getElementById('settings-back-btn').addEventListener('click', () => this.showScreen('menu-screen'));
        document.getElementById('history-back-btn').addEventListener('click', () => this.showScreen('menu-screen'));
        document.getElementById('result-close-btn').addEventListener('click', () => this.startNewGame());

        // Settings Toggles
        const soundToggle = document.getElementById('sound-toggle');
        const darkToggle = document.getElementById('dark-mode-toggle');
        const settings = window.Storage.getSettings();
        
        soundToggle.checked = settings.soundEnabled;
        darkToggle.checked = settings.darkMode;
        this.applyTheme(settings.darkMode);
        window.Audio.setEnabled(settings.soundEnabled);

        soundToggle.addEventListener('change', (e) => {
            window.Storage.saveSettings({ soundEnabled: e.target.checked });
            window.Audio.setEnabled(e.target.checked);
        });

        darkToggle.addEventListener('change', (e) => {
            window.Storage.saveSettings({ darkMode: e.target.checked });
            this.applyTheme(e.target.checked);
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('確定要清除所有對局紀錄、最佳成績與設定嗎？')) {
                window.Storage.clearAllData();
                window.location.reload();
            }
        });

        this.difficultySelect.addEventListener('change', () => {
            if (this.difficultySelect.value === 'custom') this.promptCustomSettings();
            else this.startNewGame();
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());

        if (this.difficultySelect.querySelector(`option[value="${settings.difficulty}"]`)) {
            this.difficultySelect.value = settings.difficulty;
        }

        this.startNewGame();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        if (screenId === 'game-screen') this.startNewGame();
    }

    updateHistoryUI() {
        const history = window.Storage.getHistory();
        const list = document.getElementById('history-list');
        list.innerHTML = history.length === 0 ? '<div class="no-data">尚無對局紀錄</div>' : '';
        
        history.forEach(rec => {
            const item = document.createElement('div');
            item.className = `history-item ${rec.isWin ? 'win' : 'loss'}`;
            item.innerHTML = `
                <div class="hist-status">${rec.isWin ? 'WIN' : 'LOSS'}</div>
                <div class="hist-info">
                    <span class="hist-diff">${this.getDiffLabel(rec.difficulty)}</span>
                    <span class="hist-time">${rec.time}s</span>
                </div>
                <div class="hist-date">${rec.date}</div>
            `;
            list.appendChild(item);
        });
    }

    getDiffLabel(diff) {
        const labels = { easy: '初級', medium: '中級', expert: '高級', custom: '自訂' };
        return labels[diff] || diff;
    }

    applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
    }

    promptCustomSettings() {
        const settings = window.Storage.getSettings();
        const rows = prompt('輸入列數 (5-30):', settings.customRows) || settings.customRows;
        const cols = prompt('輸入欄數 (5-50):', settings.customCols) || settings.customCols;
        const mines = prompt('輸入地雷數:', settings.customMines) || settings.customMines;

        const customRows = Math.max(5, Math.min(30, parseInt(rows)));
        const customCols = Math.max(5, Math.min(50, parseInt(cols)));
        const customMines = Math.max(1, Math.min((customRows * customCols) - 1, parseInt(mines)));

        window.Storage.saveSettings({ difficulty: 'custom', customRows, customCols, customMines });
        this.startNewGame();
    }

    handleKeyDown(e) {
        if (!document.getElementById('game-screen').classList.contains('active')) return;
        if (this.game.gameState === 'won' || this.game.gameState === 'lost') return;
        const { r, c } = this.focusedCell;
        let nr = r, nc = c;
        switch(e.key) {
            case 'ArrowUp': nr = Math.max(0, r - 1); break;
            case 'ArrowDown': nr = Math.min(this.game.rows - 1, r + 1); break;
            case 'ArrowLeft': nc = Math.max(0, c - 1); break;
            case 'ArrowRight': nc = Math.min(this.game.cols - 1, c + 1); break;
            case ' ': case 'Enter': e.preventDefault(); this.handleReveal(r, c); break;
            case 'f': case 'F': this.handleFlag(r, c); break;
            default: return;
        }
        if (nr !== r || nc !== c) this.focusCell(nr, nc);
    }

    focusCell(r, c) {
        const prevCell = this.getCellElement(this.focusedCell.r, this.focusedCell.c);
        if (prevCell) prevCell.classList.remove('focused');
        this.focusedCell = { r, c };
        const currCell = this.getCellElement(r, c);
        if (currCell) currCell.classList.add('focused');
    }

    startNewGame() {
        const diff = this.difficultySelect.value;
        const settings = window.Storage.getSettings();
        if (diff !== 'custom') window.Storage.saveSettings({ difficulty: diff });

        this.game.init(diff, { rows: settings.customRows, cols: settings.customCols, mines: settings.customMines });
        this.timer.reset();
        this.updateMineCounter();
        this.setResetBtnIcon('😊');
        this.renderBoard();
        document.getElementById('result-modal').classList.remove('active');
    }

    renderBoard() {
        this.container.innerHTML = '';
        this.container.style.gridTemplateRows = `repeat(${this.game.rows}, 1fr)`;
        this.container.style.gridTemplateColumns = `repeat(${this.game.cols}, 1fr)`;
        const diff = this.difficultySelect.value;
        let cellSize = (diff === 'easy') ? 45 : (diff === 'medium') ? 35 : 28;
        if (diff === 'custom') cellSize = Math.min(35, Math.floor((window.innerWidth * 0.9) / this.game.cols));
        
        this.container.style.width = `${this.game.cols * cellSize}px`;
        this.container.style.height = `${this.game.rows * cellSize}px`;
        for (let r = 0; r < this.game.rows; r++) {
            for (let c = 0; c < this.game.cols; c++) {
                const cellEl = document.createElement('div');
                cellEl.classList.add('cell', 'covered');
                cellEl.dataset.row = r; cellEl.dataset.col = c;
                this.addCellListeners(cellEl, r, c);
                this.container.appendChild(cellEl);
            }
        }
    }

    addCellListeners(cellEl, r, c) {
        cellEl.addEventListener('mousedown', (e) => {
            if (this.game.gameState !== 'playing' && this.game.gameState !== 'ready') return;
            if (e.buttons === 1) this.setResetBtnIcon('😮');
            if (e.buttons === 3) { this.isChordReady = true; this.chordTriggered = false; this.setResetBtnIcon('😮'); }
        });
        cellEl.addEventListener('mouseup', (e) => {
            if (this.game.gameState !== 'playing' && this.game.gameState !== 'ready') return;
            this.setResetBtnIcon('😊');
            if (this.isChordReady) {
                if (!this.chordTriggered) { this.handleChord(r, c); this.chordTriggered = true; }
                if (e.buttons === 0) this.isChordReady = false;
                return;
            }
            if (e.button === 0 && e.buttons === 0) this.handleReveal(r, c);
            else if (e.button === 2 && e.buttons === 0) this.handleFlag(r, c);
        });
    }

    handleReveal(r, c) {
        if (this.game.gameState === 'ready') this.timer.start();
        const revealed = this.game.revealCell(r, c);
        if (revealed.length > 0) { window.Audio.playClick(); this.updateBoardUI(revealed); }

        if (this.game.gameState === 'lost') {
            this.timer.stop(); window.Audio.playExplode(); this.setResetBtnIcon('😵');
            this.revealAllMines();
            window.Storage.saveGameRecord(this.difficultySelect.value, this.timer.getTime(), false);
            this.showResult(false);
        } else if (this.game.gameState === 'won') {
            this.timer.stop(); window.Audio.playWin(); this.setResetBtnIcon('😎');
            this.handleWin();
            window.Storage.saveGameRecord(this.difficultySelect.value, this.timer.getTime(), true);
            this.showResult(true);
        }
    }

    handleFlag(r, c) {
        const settings = window.Storage.getSettings();
        const state = this.game.toggleFlag(r, c, settings.questionMarkEnabled);
        window.Audio.playFlag();
        this.getCellElement(r, c).className = 'cell ' + state;
        this.updateMineCounter();
    }

    handleChord(r, c) {
        const revealed = this.game.chord(r, c);
        if (revealed.length > 0) {
            window.Audio.playClick();
            this.updateBoardUI(revealed);
            if (this.game.gameState === 'lost') {
                this.timer.stop(); window.Audio.playExplode(); this.setResetBtnIcon('😵'); this.revealAllMines();
                window.Storage.saveGameRecord(this.difficultySelect.value, this.timer.getTime(), false);
                this.showResult(false);
            } else if (this.game.gameState === 'won') {
                this.timer.stop(); window.Audio.playWin(); this.setResetBtnIcon('😎'); this.handleWin();
                window.Storage.saveGameRecord(this.difficultySelect.value, this.timer.getTime(), true);
                this.showResult(true);
            }
        }
    }

    updateBoardUI(cells) {
        cells.forEach(cell => {
            const el = this.getCellElement(cell.row, cell.col);
            el.className = 'cell ' + cell.state;
            if (cell.isMine) el.classList.add('is-mine');
            if (cell.state === window.CELL_STATES.REVEALED && !cell.isMine) {
                el.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
                if (cell.adjacentMines > 0) el.dataset.mines = cell.adjacentMines;
            }
            if (cell.wrongFlag) el.classList.add('wrong-flag');
        });
    }

    revealAllMines() { this.updateBoardUI(this.game.revealAllMines()); }

    handleWin() {
        const diff = this.difficultySelect.value;
        const time = this.timer.getTime();
        window.Storage.saveBestTime(diff, time);
        
        this.game.board.forEach(row => row.forEach(cell => {
            if (cell.isMine && cell.state !== window.CELL_STATES.FLAGGED) {
                this.getCellElement(cell.row, cell.col).className = 'cell flagged';
            }
        }));
        this.updateMineCounter();
    }

    showResult(isWin) {
        const modal = document.getElementById('result-modal');
        document.getElementById('result-title').textContent = isWin ? '🎉 恭喜勝利！' : '💥 踩到地雷了...';
        document.getElementById('result-title').style.color = isWin ? 'var(--primary)' : 'var(--digital-text)';
        document.getElementById('result-time').textContent = this.timer.getTime() + ' 秒';
        
        const bestData = window.Storage.getBestTimes();
        const best = bestData[this.difficultySelect.value];
        
        // 修正：嚴格檢查是否為數字，確保 0 秒能顯示，且不出現 undefined
        if (typeof best === 'number') {
            document.getElementById('result-best').textContent = best + ' 秒';
        } else {
            document.getElementById('result-best').textContent = '-- 秒';
        }
        
        setTimeout(() => modal.classList.add('active'), 1000);
    }

    updateMineCounter() { this.mineCounter.textContent = this.game.getRemainingMines().toString().padStart(3, '0'); }
    getCellElement(r, c) { return this.container.querySelector(`[data-row="${r}"][data-col="${c}"]`); }
    setResetBtnIcon(icon) { this.resetBtn.textContent = icon; }
}

window.Board = Board;