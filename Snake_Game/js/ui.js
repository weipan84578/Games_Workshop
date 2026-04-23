// ui.js
const UI = {
    screens: ['main-menu', 'game-screen', 'game-over-screen', 'mode-selection', 'settings-screen', 'leaderboard-screen'],

    init(game) {
        this.game = game;

        // 全域按鈕音效
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                if (typeof AudioSystem !== 'undefined') AudioSystem.play('click');
            }
        });

        // 主選單按鈕
        document.getElementById('start-btn').onclick = () => this.game.start('classic');
        document.getElementById('mode-btn').onclick = () => this.showScreen('mode-selection');
        document.getElementById('settings-btn').onclick = () => this.showSettings();
        document.getElementById('leaderboard-btn').onclick = () => this.showLeaderboard('classic');

        // 模式選擇
        const modeCards = document.querySelectorAll('.mode-card');
        modeCards.forEach(card => {
            card.onclick = () => {
                modeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const mode = card.dataset.mode;
                const difficulty = document.getElementById('difficulty-select').value;
                this.game.start(mode, difficulty);
            };
        });
        document.getElementById('mode-back-btn').onclick = () => this.showScreen('main-menu');

        // 設定
        document.getElementById('settings-back-btn').onclick = () => {
            this.saveSettings();
            this.showScreen('main-menu');
        };
        document.getElementById('theme-select').onchange = (e) => this.applyTheme(e.target.value);

        // 排行榜
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.onclick = () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateLeaderboardTable(btn.dataset.tab);
            };
        });
        document.getElementById('leaderboard-back-btn').onclick = () => this.showScreen('main-menu');

        // 遊戲中按鈕
        document.getElementById('resume-btn').onclick = () => this.game.togglePause();
        document.getElementById('restart-btn').onclick = () => this.game.reset();
        document.getElementById('quit-btn').onclick = () => this.game.backToMenu();
        document.getElementById('footer-pause-btn').onclick = () => this.game.togglePause();
        document.getElementById('footer-restart-btn').onclick = () => this.game.reset();

        // 遊戲結束按鈕
        document.getElementById('play-again-btn').onclick = () => this.game.start(this.game.mode, this.game.difficulty);
        document.getElementById('end-leaderboard-btn').onclick = () => this.showLeaderboard(this.game.mode);
        document.getElementById('back-to-menu-btn').onclick = () => this.showScreen('main-menu');

        // 初始化
        this.applySettings(this.game.settings);
        document.getElementById('global-best-score').textContent = Storage.getBestScore('classic');
    },

    showScreen(screenId) {
        this.screens.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === screenId) el.classList.add('active');
            else el.classList.remove('active');
        });
        
        if (screenId === 'game-screen') {
            this.showPauseOverlay(false);
            const isTimeAttack = this.game.mode === 'timeattack';
            document.getElementById('time-bar-container').classList.toggle('hidden', !isTimeAttack);
            document.getElementById('timer-container').classList.toggle('hidden', !isTimeAttack);
        }
    },

    showPauseOverlay(show) {
        const overlay = document.getElementById('pause-screen');
        if (show) overlay.classList.remove('hidden');
        else overlay.classList.add('hidden');
    },

    showSettings() {
        const s = this.game.settings;
        document.getElementById('sound-toggle').checked = s.sound;
        document.getElementById('grid-toggle').checked = s.grid;
        document.getElementById('border-mode-select').value = s.borderMode;
        document.getElementById('theme-select').value = s.theme;
        this.showScreen('settings-screen');
    },

    saveSettings() {
        const s = {
            sound: document.getElementById('sound-toggle').checked,
            grid: document.getElementById('grid-toggle').checked,
            borderMode: document.getElementById('border-mode-select').value,
            theme: document.getElementById('theme-select').value,
            mobileControl: 'swipe'
        };
        this.game.settings = s;
        Storage.saveSettings(s);
        this.applySettings(s);
    },

    applySettings(s) {
        this.applyTheme(s.theme);
        this.game.renderer.theme = s.theme;
    },

    applyTheme(theme) {
        document.body.className = `theme-${theme}`;
        const link = document.getElementById('theme-link');
        link.href = `css/themes/${theme}.css`;
        this.game.renderer.theme = theme;
    },

    showLeaderboard(mode) {
        this.showScreen('leaderboard-screen');
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === mode);
        });
        this.updateLeaderboardTable(mode);
    },

    updateLeaderboardTable(mode) {
        const scores = Storage.getLeaderboard(mode);
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = scores.map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${s.score}</td>
                <td>${s.date}</td>
            </tr>
        `).join('') || '<tr><td colspan="3">尚無資料</td></tr>';
    },

    updateTimer(timeLeft, maxTime) {
        document.getElementById('timer').textContent = `${Math.ceil(timeLeft)}s`;
        const percent = (timeLeft / maxTime) * 100;
        document.getElementById('time-bar').style.width = `${percent}%`;
    },

    updateHeaderInfo(mode, difficulty) {
        const modeNames = { classic: '經典', timeattack: '限時', obstacle: '障礙物' };
        const diffNames = { easy: '簡單', normal: '普通', hard: '困難' };
        document.getElementById('game-mode-display').textContent = `模式: ${modeNames[mode]}`;
        document.getElementById('game-difficulty-display').textContent = `難度: ${diffNames[difficulty]}`;
    },

    updateScore(score, best) {
        document.getElementById('current-score').textContent = score;
        document.getElementById('best-score').textContent = best;
    },

    showGameOver(score, level, isNewRecord) {
        this.showScreen('game-over-screen');
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-level').textContent = level;
        
        const msg = document.getElementById('new-record-msg');
        if (isNewRecord) msg.classList.remove('hidden');
        else msg.classList.add('hidden');
        
        document.getElementById('global-best-score').textContent = Storage.getBestScore(this.game.mode);
    }
};
