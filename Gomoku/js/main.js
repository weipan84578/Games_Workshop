const BOARD_SIZE = 15;
    const EMPTY = 0;
    const HUMAN = 1;
    const AI = 2;
    const DEFAULT_SETTINGS = {
      difficulty: 'normal',
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      theme: 'light',
    };
    const DEFAULT_STATS = { wins: 0, losses: 0, draws: 0 };

    const $ = (id) => document.getElementById(id);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const SettingsManager = {
      key: 'gomoku_settings',
      load() {
        try {
          const raw = localStorage.getItem(this.key);
          return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
        } catch {
          return { ...DEFAULT_SETTINGS };
        }
      },
      save(settings) {
        try {
          localStorage.setItem(this.key, JSON.stringify(settings));
        } catch (error) {
          console.warn('Settings save failed.', error);
        }
      },
      apply(settings) {
        document.documentElement.setAttribute('data-theme', settings.theme);
        AudioManager.setBGMVolume(settings.bgmVolume);
        AudioManager.setSFXVolume(settings.sfxVolume);
      },
    };

    const StatsManager = {
      key: 'gomoku_stats',
      load() {
        try {
          const raw = localStorage.getItem(this.key);
          return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
        } catch {
          return { ...DEFAULT_STATS };
        }
      },
      save(stats) {
        try {
          localStorage.setItem(this.key, JSON.stringify(stats));
        } catch (error) {
          console.warn('Stats save failed.', error);
        }
      },
      record(winner) {
        const stats = this.load();
        if (winner === HUMAN) stats.wins++;
        else if (winner === AI) stats.losses++;
        else stats.draws++;
        this.save(stats);
        return stats;
      },
    };

    const AudioManager = {
      ctx: null,
      bgmGain: null,
      sfxGain: null,
      bgmTimer: null,
      bgmPlaying: false,
      currentBGM: null,
      init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
        this.setBGMVolume(settings.bgmVolume);
        this.setSFXVolume(settings.sfxVolume);
      },
      resume() {
        if (this.ctx?.state === 'suspended') this.ctx.resume();
      },
      setBGMVolume(value) {
        if (this.bgmGain) this.bgmGain.gain.value = value;
      },
      setSFXVolume(value) {
        if (this.sfxGain) this.sfxGain.gain.value = value;
      },
      startBGM(track = 'game') {
        if (!this.ctx) return;
        if (this.bgmPlaying && this.currentBGM === track) return;
        this.stopBGM();
        this.bgmPlaying = true;
        this.currentBGM = track;
        const patterns = {
          main: {
            notes: [392, 493.9, 587.3, 659.3, 587.3, 493.9, 440, 523.3],
            duration: 0.55,
            type: 'triangle',
            peak: 0.11,
            sustain: 0.06,
          },
          game: {
            notes: [220, 261.6, 329.6, 349.2, 261.6, 392, 440, 329.6],
            duration: 0.8,
            type: 'sine',
            peak: 0.16,
            sustain: 0.09,
          },
        };
        const pattern = patterns[track] ?? patterns.game;
        const notes = pattern.notes;
        let noteIndex = 0;
        const duration = pattern.duration;
        const scheduleNote = (time) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.bgmGain);
          osc.type = pattern.type;
          osc.frequency.value = notes[noteIndex % notes.length];
          noteIndex++;
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(pattern.peak, time + 0.05);
          gain.gain.linearRampToValueAtTime(pattern.sustain, time + 0.2);
          gain.gain.setValueAtTime(pattern.sustain, time + duration - 0.12);
          gain.gain.linearRampToValueAtTime(0.001, time + duration);
          osc.start(time);
          osc.stop(time + duration + 0.02);
        };
        const loop = () => {
          if (!this.bgmPlaying || !this.ctx || this.currentBGM !== track) return;
          const start = this.ctx.currentTime + 0.02;
          for (let i = 0; i < 8; i++) scheduleNote(start + i * duration);
          this.bgmTimer = setTimeout(loop, duration * 8 * 1000 - 120);
        };
        loop();
      },
      stopBGM() {
        this.bgmPlaying = false;
        this.currentBGM = null;
        clearTimeout(this.bgmTimer);
      },
      play(id) {
        if (!this.ctx || !this.sfxGain) return;
        this.resume();
        const now = this.ctx.currentTime;
        const tone = (freq, duration, type = 'sine', volume = 0.34, delay = 0) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.type = type;
          osc.frequency.value = freq;
          const t = now + delay;
          gain.gain.setValueAtTime(volume, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
          osc.start(t);
          osc.stop(t + duration + 0.02);
        };
        if (id === 'place_black') tone(600, 0.08);
        else if (id === 'place_white') tone(500, 0.08);
        else if (id === 'click') tone(760, 0.05, 'triangle', 0.2);
        else if (id === 'invalid') tone(200, 0.1, 'sawtooth', 0.24);
        else if (id === 'undo') { tone(420, 0.07); tone(300, 0.1, 'sine', 0.25, 0.07); }
        else if (id === 'win') [261.6, 329.6, 392, 523.2].forEach((f, i) => tone(f, 0.15, 'triangle', 0.3, i * 0.12));
        else if (id === 'lose') [261.6, 196, 174.6, 164.8].forEach((f, i) => tone(f, 0.18, 'sine', 0.28, i * 0.13));
        else if (id === 'draw') [220, 261.6, 329.6].forEach((f, i) => tone(f, 0.35, 'sine', 0.22, i * 0.05));
      },
    };

    const GameLogic = {
      state: null,
      init() {
        this.state = {
          board: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY)),
          status: 'PLAYING',
          currentPlayer: HUMAN,
          moveHistory: [],
          undoCount: 3,
          startTime: Date.now(),
          elapsedBeforePause: 0,
          winner: null,
          winCells: [],
          lastMove: null,
        };
      },
      placeStone(row, col, player) {
        const state = this.state;
        if (!state || state.status !== 'PLAYING' || state.board[row]?.[col] !== EMPTY) {
          return { success: false };
        }
        state.board[row][col] = player;
        state.lastMove = { row, col, player };
        state.moveHistory.push({ row, col, player, time: performance.now() });
        const winCells = checkWin(state.board, row, col, player);
        if (winCells) {
          state.status = 'RESULT';
          state.winner = player;
          state.winCells = winCells;
        } else if (state.moveHistory.length === BOARD_SIZE * BOARD_SIZE) {
          state.status = 'RESULT';
          state.winner = 'draw';
        }
        return { success: true, winner: state.winner };
      },
      undoLastMove() {
        const state = this.state;
        if (!state || state.status !== 'PLAYING' || state.undoCount <= 0 || state.moveHistory.length === 0) {
          return false;
        }
        const count = state.moveHistory.at(-1)?.player === AI ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const move = state.moveHistory.pop();
          if (move) state.board[move.row][move.col] = EMPTY;
        }
        state.lastMove = state.moveHistory.at(-1) ?? null;
        state.undoCount--;
        state.currentPlayer = HUMAN;
        return true;
      },
      elapsedSeconds() {
        if (!this.state) return 0;
        if (this.state.status === 'PAUSED') return Math.floor(this.state.elapsedBeforePause / 1000);
        return Math.floor((Date.now() - this.state.startTime + this.state.elapsedBeforePause) / 1000);
      },
    };

    const BoardView = {
      canvas: null,
      ctx: null,
      theme: null,
      init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => {
          this.resize();
          this.render(GameLogic.state?.board ?? emptyBoard(), GameLogic.state?.lastMove, GameLogic.state?.winCells ?? []);
        });
      },
      resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const size = Math.max(320, Math.round(rect.width * dpr));
        this.canvas.width = size;
        this.canvas.height = size;
      },
      metrics() {
        const size = this.canvas.width;
        const padding = size / 14;
        const cell = (size - padding * 2) / 14;
        return { size, padding, cell };
      },
      point(row, col) {
        const { padding, cell } = this.metrics();
        return { x: padding + col * cell, y: padding + row * cell };
      },
      render(board, lastMove = null, winCells = []) {
        const ctx = this.ctx;
        const { size, padding, cell } = this.metrics();
        const css = getComputedStyle(document.documentElement);
        const boardColor = css.getPropertyValue('--board-color').trim();
        const lineColor = css.getPropertyValue('--board-line').trim();
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = boardColor;
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = Math.max(1, size / 520);
        for (let i = 0; i < BOARD_SIZE; i++) {
          const p = padding + i * cell;
          drawLine(ctx, padding, p, padding + 14 * cell, p);
          drawLine(ctx, p, padding, p, padding + 14 * cell);
        }

        const dots = [[3,3],[3,7],[3,11],[7,3],[7,7],[7,11],[11,3],[11,7],[11,11]];
        dots.forEach(([r, c]) => {
          const { x, y } = this.point(r, c);
          ctx.beginPath();
          ctx.fillStyle = lineColor;
          ctx.arc(x, y, Math.max(3, cell * 0.08), 0, Math.PI * 2);
          ctx.fill();
        });

        this.drawCoordinates(ctx, padding, cell, size);
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== EMPTY) this.drawStone(r, c, board[r][c], 1);
          }
        }
        if (lastMove) this.drawLastMove(lastMove.row, lastMove.col);
        if (winCells.length) this.highlightWin(winCells);
      },
      drawCoordinates(ctx, padding, cell, size) {
        ctx.save();
        ctx.fillStyle = colorWithAlpha(getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(), 0.62);
        ctx.font = `${Math.max(10, cell * 0.32)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const letters = 'ABCDEFGHIJKLMNO';
        for (let i = 0; i < BOARD_SIZE; i++) {
          const p = padding + i * cell;
          ctx.fillText(letters[i], p, padding * 0.36);
          ctx.fillText(String(i + 1), padding * 0.36, p);
        }
        ctx.restore();
      },
      drawStone(row, col, player, scale = 1) {
        const ctx = this.ctx;
        const { cell } = this.metrics();
        const { x, y } = this.point(row, col);
        const radius = cell * 0.44 * scale;
        const grad = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.45, radius * 0.15, x, y, radius);
        if (player === HUMAN) {
          grad.addColorStop(0, '#696969');
          grad.addColorStop(0.45, '#171717');
          grad.addColorStop(1, '#000000');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#efefef');
          grad.addColorStop(1, '#b7b7b7');
        }
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.24)';
        ctx.shadowBlur = cell * 0.08;
        ctx.shadowOffsetY = cell * 0.06;
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (player === AI) {
          ctx.strokeStyle = 'rgba(0,0,0,0.22)';
          ctx.lineWidth = Math.max(1, cell * 0.025);
          ctx.stroke();
        }
        ctx.restore();
      },
      drawLastMove(row, col) {
        const ctx = this.ctx;
        const { cell } = this.metrics();
        const { x, y } = this.point(row, col);
        ctx.save();
        ctx.strokeStyle = '#D93636';
        ctx.lineWidth = Math.max(2, cell * 0.045);
        const r = cell * 0.17;
        ctx.beginPath();
        ctx.moveTo(x - r, y);
        ctx.lineTo(x + r, y);
        ctx.moveTo(x, y - r);
        ctx.lineTo(x, y + r);
        ctx.stroke();
        ctx.restore();
      },
      highlightWin(cells) {
        if (!cells.length) return;
        const ctx = this.ctx;
        const { cell } = this.metrics();
        ctx.save();
        ctx.strokeStyle = '#1F7A77';
        ctx.lineWidth = Math.max(4, cell * 0.1);
        ctx.lineCap = 'round';
        const first = this.point(cells[0].row, cells[0].col);
        const last = this.point(cells.at(-1).row, cells.at(-1).col);
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
        ctx.restore();
      },
      getGridPos(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        const { padding, cell } = this.metrics();
        const col = Math.round((x - padding) / cell);
        const row = Math.round((y - padding) / cell);
        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) return { row, col };
        return null;
      },
    };

    const AIEngine = {
      async getMove(board, difficulty) {
        await sleep(difficulty === 'hard' ? 450 : difficulty === 'normal' ? 280 : 180);
        const immediate = findTacticalMove(board, AI) ?? findTacticalMove(board, HUMAN);
        if (immediate) return immediate;
        if (difficulty === 'easy') return randomMove(board);
        const depth = difficulty === 'normal' ? 2 : 4;
        const maxCandidates = difficulty === 'normal' ? 18 : 16;
        const candidates = this.getCandidates(board)
          .map((move) => ({ ...move, score: scoreMove(board, move.r, move.c, AI) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, maxCandidates);
        let bestMove = candidates[0] ?? fallbackCenter(board);
        let bestScore = -Infinity;
        for (const { r, c } of candidates) {
          board[r][c] = AI;
          const score = this.minimax(board, depth - 1, -Infinity, Infinity, false, AI, maxCandidates);
          board[r][c] = EMPTY;
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: r, col: c };
          }
        }
        return bestMove;
      },
      getCandidates(board) {
        const set = new Set();
        let hasStone = false;
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== EMPTY) {
              hasStone = true;
              for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                  const nr = r + dr;
                  const nc = c + dc;
                  if (inside(nr, nc) && board[nr][nc] === EMPTY) set.add(`${nr},${nc}`);
                }
              }
            }
          }
        }
        if (!hasStone) return [{ r: 7, c: 7 }];
        return [...set].map((key) => {
          const [r, c] = key.split(',').map(Number);
          return { r, c };
        });
      },
      minimax(board, depth, alpha, beta, isMaximizing, aiPlayer, maxCandidates) {
        const terminal = terminalWinner(board);
        if (terminal === aiPlayer) return 1000000 + depth;
        if (terminal === HUMAN) return -1000000 - depth;
        if (depth === 0 || isBoardFull(board)) return this.evaluate(board, aiPlayer);
        const player = isMaximizing ? aiPlayer : HUMAN;
        const candidates = this.getCandidates(board)
          .map((move) => ({ ...move, score: scoreMove(board, move.r, move.c, player) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, maxCandidates);
        if (isMaximizing) {
          let best = -Infinity;
          for (const { r, c } of candidates) {
            board[r][c] = aiPlayer;
            best = Math.max(best, this.minimax(board, depth - 1, alpha, beta, false, aiPlayer, maxCandidates));
            board[r][c] = EMPTY;
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
          }
          return best;
        }
        let best = Infinity;
        for (const { r, c } of candidates) {
          board[r][c] = HUMAN;
          best = Math.min(best, this.minimax(board, depth - 1, alpha, beta, true, aiPlayer, maxCandidates));
          board[r][c] = EMPTY;
          beta = Math.min(beta, best);
          if (beta <= alpha) break;
        }
        return best;
      },
      evaluate(board, aiPlayer) {
        let score = 0;
        const lines = getAllLines(board);
        for (const line of lines) {
          score += evaluateLine(line, aiPlayer);
          score -= evaluateLine(line, HUMAN) * 0.92;
        }
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === aiPlayer) score += Math.max(0, 8 - Math.abs(7 - r) - Math.abs(7 - c));
            if (board[r][c] === HUMAN) score -= Math.max(0, 8 - Math.abs(7 - r) - Math.abs(7 - c)) * 0.7;
          }
        }
        return score;
      },
    };

    const UI = {
      showScreen(name) {
        document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
        $(name).classList.add('active');
        if (name === 'screen-game') {
          BoardView.resize();
          BoardView.render(GameLogic.state.board, GameLogic.state.lastMove, GameLogic.state.winCells);
        }
      },
      updateInfo() {
        const state = GameLogic.state;
        const thinking = state.status === 'AI_THINKING';
        $('turn-badge').textContent = thinking ? 'AI 思考中' : state.status === 'PLAYING' ? '輪到你' : '對局結束';
        $('thinking-layer').classList.toggle('active', thinking);
        $('game-stats').textContent = `步數 ${state.moveHistory.length} | ${formatTime(GameLogic.elapsedSeconds())} | 悔棋 ${state.undoCount}`;
        $('btn-undo').disabled = thinking || state.undoCount <= 0 || state.moveHistory.length === 0;
      },
      showToast(message) {
        const toast = $('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
      },
      showResult() {
        const state = GameLogic.state;
        const stats = StatsManager.record(state.winner);
        const isDraw = state.winner === 'draw';
        $('result-title').textContent = isDraw ? '平手' : state.winner === HUMAN ? '你贏了' : 'AI 獲勝';
        $('result-message').textContent = isDraw ? '棋盤已滿，這局沒有勝負。' : state.winner === HUMAN ? '你率先連成五子。' : 'AI 率先連成五子。';
        $('result-time').textContent = formatTime(GameLogic.elapsedSeconds());
        $('result-moves').textContent = String(state.moveHistory.length);
        $('result-record').textContent = `${stats.wins} 勝 / ${stats.losses} 敗 / ${stats.draws} 和`;
        if (state.winner === HUMAN) AudioManager.play('win');
        else if (state.winner === AI) AudioManager.play('lose');
        else AudioManager.play('draw');
        BoardView.render(state.board, state.lastMove, state.winCells);
        setTimeout(() => this.showScreen('screen-result'), 650);
      },
    };

    let settings = SettingsManager.load();
    let tickTimer = null;

    function drawLine(ctx, x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function colorWithAlpha(color, alpha) {
      if (color.startsWith('#') && color.length === 7) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return color;
    }

    function emptyBoard() {
      return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
    }

    function inside(row, col) {
      return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function checkWin(board, row, col, player) {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (const [dr, dc] of directions) {
        const cells = [{ row, col }];
        for (let i = 1; i < 5; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          if (!inside(r, c) || board[r][c] !== player) break;
          cells.push({ row: r, col: c });
        }
        for (let i = 1; i < 5; i++) {
          const r = row - dr * i;
          const c = col - dc * i;
          if (!inside(r, c) || board[r][c] !== player) break;
          cells.unshift({ row: r, col: c });
        }
        if (cells.length >= 5) return cells.slice(0, 5);
      }
      return null;
    }

    function terminalWinner(board) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const player = board[r][c];
          if (player && checkWin(board, r, c, player)) return player;
        }
      }
      return null;
    }

    function isBoardFull(board) {
      return board.every((row) => row.every(Boolean));
    }

    function getAllLines(board) {
      const lines = [];
      for (let r = 0; r < BOARD_SIZE; r++) lines.push(board[r]);
      for (let c = 0; c < BOARD_SIZE; c++) lines.push(board.map((row) => row[c]));
      for (let start = -BOARD_SIZE + 5; start <= BOARD_SIZE - 5; start++) {
        const diag = [];
        const anti = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
          const c = r + start;
          const ac = BOARD_SIZE - 1 - r - start;
          if (inside(r, c)) diag.push(board[r][c]);
          if (inside(r, ac)) anti.push(board[r][ac]);
        }
        if (diag.length >= 5) lines.push(diag);
        if (anti.length >= 5) lines.push(anti);
      }
      return lines;
    }

    function evaluateLine(line, player) {
      const enemy = player === AI ? HUMAN : AI;
      let score = 0;
      for (let i = 0; i <= line.length - 5; i++) {
        const window = line.slice(i, i + 5);
        const own = window.filter((v) => v === player).length;
        const block = window.filter((v) => v === enemy).length;
        if (own > 0 && block > 0) continue;
        if (own === 5) score += 100000;
        else if (own === 4) score += openEnds(line, i, player) === 2 ? 10000 : 1200;
        else if (own === 3) score += openEnds(line, i, player) === 2 ? 1000 : 160;
        else if (own === 2) score += openEnds(line, i, player) === 2 ? 120 : 18;
        else if (own === 1) score += 4;
      }
      return score;
    }

    function openEnds(line, start) {
      let ends = 0;
      if (line[start - 1] === EMPTY) ends++;
      if (line[start + 5] === EMPTY) ends++;
      return ends;
    }

    function scoreMove(board, row, col, player) {
      const opponent = player === AI ? HUMAN : AI;
      board[row][col] = player;
      const ownWin = checkWin(board, row, col, player) ? 1000000 : 0;
      const attack = evaluateLocal(board, row, col, player);
      board[row][col] = opponent;
      const defend = checkWin(board, row, col, opponent) ? 900000 : evaluateLocal(board, row, col, opponent) * 0.88;
      board[row][col] = EMPTY;
      const center = 20 - Math.abs(7 - row) - Math.abs(7 - col);
      return ownWin + attack + defend + center;
    }

    function evaluateLocal(board, row, col, player) {
      let score = 0;
      const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (const [dr, dc] of dirs) {
        let count = 1;
        let open = 0;
        for (const dir of [1, -1]) {
          for (let i = 1; i < 5; i++) {
            const r = row + dr * i * dir;
            const c = col + dc * i * dir;
            if (!inside(r, c)) break;
            if (board[r][c] === player) count++;
            else {
              if (board[r][c] === EMPTY) open++;
              break;
            }
          }
        }
        if (count >= 5) score += 100000;
        else if (count === 4) score += open === 2 ? 10000 : 1000;
        else if (count === 3) score += open === 2 ? 1000 : 100;
        else if (count === 2) score += open === 2 ? 100 : 10;
      }
      return score;
    }

    function findTacticalMove(board, player) {
      for (const { r, c } of AIEngine.getCandidates(board)) {
        board[r][c] = player;
        const wins = checkWin(board, r, c, player);
        board[r][c] = EMPTY;
        if (wins) return { row: r, col: c };
      }
      return null;
    }

    function randomMove(board) {
      const candidates = AIEngine.getCandidates(board);
      const weighted = candidates
        .map((move) => ({ ...move, score: scoreMove(board, move.r, move.c, AI) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(8, candidates.length));
      const pick = weighted[Math.floor(Math.random() * weighted.length)] ?? fallbackCenter(board);
      return { row: pick.r, col: pick.c };
    }

    function fallbackCenter(board) {
      if (board[7][7] === EMPTY) return { row: 7, col: 7 };
      for (let radius = 1; radius < BOARD_SIZE; radius++) {
        for (let r = 7 - radius; r <= 7 + radius; r++) {
          for (let c = 7 - radius; c <= 7 + radius; c++) {
            if (inside(r, c) && board[r][c] === EMPTY) return { row: r, col: c };
          }
        }
      }
      return { row: 0, col: 0 };
    }

    function formatTime(totalSeconds) {
      const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const secs = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    function startGame() {
      AudioManager.init();
      AudioManager.resume();
      AudioManager.startBGM('game');
      GameLogic.init();
      UI.showScreen('screen-game');
      BoardView.render(GameLogic.state.board, GameLogic.state.lastMove);
      UI.updateInfo();
      clearInterval(tickTimer);
      tickTimer = setInterval(() => {
        if (GameLogic.state?.status !== 'RESULT') UI.updateInfo();
      }, 1000);
    }

    async function handleHumanMove(row, col) {
      const state = GameLogic.state;
      if (!state || state.status !== 'PLAYING') return;
      const result = GameLogic.placeStone(row, col, HUMAN);
      if (!result.success) {
        AudioManager.play('invalid');
        UI.showToast('這裡不能落子');
        return;
      }
      AudioManager.play('place_black');
      BoardView.render(state.board, state.lastMove, state.winCells);
      if (state.status === 'RESULT') {
        UI.updateInfo();
        UI.showResult();
        return;
      }
      state.status = 'AI_THINKING';
      UI.updateInfo();
      try {
        const move = await Promise.race([
          AIEngine.getMove(state.board, settings.difficulty),
          sleep(5000).then(() => {
            console.warn('AI timed out. Falling back to center candidate.');
            return fallbackCenter(state.board);
          }),
        ]);
        if (!GameLogic.state || GameLogic.state.status !== 'AI_THINKING') return;
        state.status = 'PLAYING';
        GameLogic.placeStone(move.row, move.col, AI);
        AudioManager.play('place_white');
        BoardView.render(state.board, state.lastMove, state.winCells);
        if (state.status === 'RESULT') UI.showResult();
      } finally {
        if (GameLogic.state?.status !== 'RESULT') {
          GameLogic.state.status = 'PLAYING';
          UI.updateInfo();
        }
      }
    }

    function bindEvents() {
      $('btn-start').addEventListener('click', () => { AudioManager.play('click'); startGame(); });
      $('btn-settings').addEventListener('click', () => { AudioManager.play('click'); syncSettingsUI(); UI.showScreen('screen-settings'); });
      $('btn-back-main').addEventListener('click', () => { AudioManager.play('click'); UI.showScreen('screen-main'); AudioManager.startBGM('main'); });
      $('btn-save-settings').addEventListener('click', saveSettingsFromUI);
      $('btn-play-again').addEventListener('click', () => { AudioManager.play('click'); startGame(); });
      $('btn-result-main').addEventListener('click', () => { AudioManager.play('click'); UI.showScreen('screen-main'); AudioManager.startBGM('main'); });
      $('btn-undo').addEventListener('click', () => {
        if (GameLogic.undoLastMove()) {
          AudioManager.play('undo');
          BoardView.render(GameLogic.state.board, GameLogic.state.lastMove);
          UI.updateInfo();
        } else {
          AudioManager.play('invalid');
          UI.showToast('目前不能悔棋');
        }
      });
      $('btn-pause').addEventListener('click', pauseGame);
      $('btn-resume').addEventListener('click', resumeGame);
      $('btn-restart').addEventListener('click', () => { closePause(); startGame(); });
      $('btn-pause-main').addEventListener('click', () => {
        closePause();
        UI.showScreen('screen-main');
        AudioManager.startBGM('main');
      });
      $('game-canvas').addEventListener('click', (event) => {
        const pos = BoardView.getGridPos(event.clientX, event.clientY);
        if (pos) handleHumanMove(pos.row, pos.col);
      });
      $('game-canvas').addEventListener('touchend', (event) => {
        event.preventDefault();
        const touch = event.changedTouches[0];
        const pos = BoardView.getGridPos(touch.clientX, touch.clientY);
        if (pos) handleHumanMove(pos.row, pos.col);
      }, { passive: false });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') AudioManager.resume();
      });
      document.querySelectorAll('.segmented button').forEach((button) => {
        button.addEventListener('click', () => {
          AudioManager.play('click');
          const group = button.closest('.segmented');
          group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
        });
      });
      for (const id of ['bgm-volume', 'sfx-volume']) {
        $(id).addEventListener('input', () => {
          $('bgm-value').textContent = `${$('bgm-volume').value}%`;
          $('sfx-value').textContent = `${$('sfx-volume').value}%`;
          AudioManager.setBGMVolume(Number($('bgm-volume').value) / 100);
          AudioManager.setSFXVolume(Number($('sfx-volume').value) / 100);
        });
      }
      document.addEventListener('pointerdown', activateMainMusic, { once: true });
    }

    function activateMainMusic() {
      AudioManager.init();
      AudioManager.resume();
      if ($('screen-main').classList.contains('active')) AudioManager.startBGM('main');
    }

    function pauseGame() {
      const state = GameLogic.state;
      if (!state || state.status === 'RESULT') return;
      if (state.status === 'AI_THINKING') {
        AudioManager.play('invalid');
        UI.showToast('請等 AI 落子後再暫停');
        return;
      }
      state.elapsedBeforePause += Date.now() - state.startTime;
      state.status = 'PAUSED';
      AudioManager.play('click');
      $('pause-modal').classList.add('active');
      UI.updateInfo();
    }

    function resumeGame() {
      const state = GameLogic.state;
      if (!state) return;
      state.startTime = Date.now();
      state.status = 'PLAYING';
      closePause();
      AudioManager.play('click');
      UI.updateInfo();
    }

    function closePause() {
      $('pause-modal').classList.remove('active');
    }

    function syncSettingsUI() {
      document.querySelectorAll('.segmented').forEach((group) => {
        const key = group.dataset.setting;
        group.querySelectorAll('button').forEach((button) => {
          button.classList.toggle('active', button.dataset.value === settings[key]);
        });
      });
      $('bgm-volume').value = String(Math.round(settings.bgmVolume * 100));
      $('sfx-volume').value = String(Math.round(settings.sfxVolume * 100));
      $('bgm-value').textContent = `${$('bgm-volume').value}%`;
      $('sfx-value').textContent = `${$('sfx-volume').value}%`;
    }

    function saveSettingsFromUI() {
      const difficulty = document.querySelector('[data-setting="difficulty"] button.active')?.dataset.value ?? 'normal';
      const theme = document.querySelector('[data-setting="theme"] button.active')?.dataset.value ?? 'light';
      settings = {
        difficulty,
        theme,
        bgmVolume: Number($('bgm-volume').value) / 100,
        sfxVolume: Number($('sfx-volume').value) / 100,
      };
      SettingsManager.save(settings);
      SettingsManager.apply(settings);
      AudioManager.play('click');
      UI.showToast('設定已儲存');
      BoardView.render(GameLogic.state?.board ?? emptyBoard(), GameLogic.state?.lastMove ?? null, GameLogic.state?.winCells ?? []);
    }

    SettingsManager.apply(settings);
    BoardView.init($('game-canvas'));
    syncSettingsUI();
    bindEvents();
