// Othello game rules, turn flow, move execution, scoring, and persistence hooks.
const GameEngine = {
      board: [],
      currentPlayer: BLACK,
      playerColor: BLACK,
      aiPlayer: WHITE,
      difficulty: 'normal',
      moveHistory: [],
      lastMove: null,
      isBusy: false,
      gameEnded: false,
      init() {
        this.resetBoard();
      },
      resetBoard() {
        this.board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
        this.board[3][3] = WHITE;
        this.board[3][4] = BLACK;
        this.board[4][3] = BLACK;
        this.board[4][4] = WHITE;
        this.currentPlayer = BLACK;
        this.moveHistory = [];
        this.lastMove = null;
        this.isBusy = false;
        this.gameEnded = false;
      },
      startNew({ difficulty, playerColor }) {
        this.resetBoard();
        this.difficulty = difficulty;
        this.playerColor = playerColor === 'white' ? WHITE : BLACK;
        this.aiPlayer = this.playerColor === BLACK ? WHITE : BLACK;
        StorageManager.settings.difficulty = difficulty;
        StorageManager.settings.playerColor = playerColor;
        StorageManager.saveSettings();
        UIManager.showScreen('game');
        UIManager.render();
        this.save();
        if (this.currentPlayer === this.aiPlayer) this.queueAiMove();
      },
      continueSaved() {
        const state = StorageManager.loadState();
        if (!state || !state.board) {
          UIManager.toast('沒有可繼續的對局');
          return;
        }
        this.board = state.board;
        this.currentPlayer = state.currentPlayer;
        this.playerColor = state.playerColor === 'white' ? WHITE : BLACK;
        this.aiPlayer = this.playerColor === BLACK ? WHITE : BLACK;
        this.difficulty = state.difficulty || 'normal';
        this.moveHistory = state.moveHistory || [];
        this.lastMove = state.lastMove || null;
        this.gameEnded = false;
        this.isBusy = false;
        UIManager.showScreen('game');
        UIManager.render();
        if (this.currentPlayer === this.aiPlayer) this.queueAiMove();
      },
      save() {
        const counts = this.countPieces();
        StorageManager.saveState({
          board: this.board,
          currentPlayer: this.currentPlayer,
          playerColor: this.playerColor === BLACK ? 'black' : 'white',
          difficulty: this.difficulty,
          blackCount: counts.black,
          whiteCount: counts.white,
          moveHistory: this.moveHistory,
          lastMove: this.lastMove
        });
        UIManager.updateContinueButton();
      },
      opponent(player) { return player === BLACK ? WHITE : BLACK; },
      inBounds(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 8; },
      getFlips(board, row, col, player) {
        if (!this.inBounds(row, col) || board[row][col] !== EMPTY) return [];
        const enemy = this.opponent(player);
        const flips = [];
        for (const [dr, dc] of DIRECTIONS) {
          const line = [];
          let r = row + dr;
          let c = col + dc;
          while (this.inBounds(r, c) && board[r][c] === enemy) {
            line.push([r, c]);
            r += dr;
            c += dc;
          }
          if (line.length && this.inBounds(r, c) && board[r][c] === player) flips.push(...line);
        }
        return flips;
      },
      isValidMove(board, row, col, player) {
        return this.getFlips(board, row, col, player).length > 0;
      },
      getLegalMoves(board, player) {
        const moves = [];
        for (let row = 0; row < 8; row += 1) {
          for (let col = 0; col < 8; col += 1) {
            const flips = this.getFlips(board, row, col, player);
            if (flips.length) moves.push({ row, col, flips });
          }
        }
        return moves;
      },
      applyMove(board, move, player) {
        const next = board.map(row => [...row]);
        const flips = move.flips || this.getFlips(next, move.row, move.col, player);
        next[move.row][move.col] = player;
        for (const [r, c] of flips) next[r][c] = player;
        return next;
      },
      humanMove(row, col) {
        if (this.isBusy || this.gameEnded || this.currentPlayer !== this.playerColor) return;
        const flips = this.getFlips(this.board, row, col, this.currentPlayer);
        if (!flips.length) {
          AudioEngine.sfx('invalid');
          UIManager.toast('這裡不能落子');
          return;
        }
        this.commitMove({ row, col, flips }, this.currentPlayer, 'place');
      },
      commitMove(move, player, sound = 'place') {
        const before = this.board.map(row => [...row]);
        this.board = this.applyMove(this.board, move, player);
        this.moveHistory.push({ row: move.row, col: move.col, player, flips: move.flips.length });
        this.lastMove = { row: move.row, col: move.col, flips: move.flips, player };
        AudioEngine.sfx(sound);
        if (move.flips.length >= 4) AudioEngine.sfx('combo'); else AudioEngine.sfx('flip');
        UIManager.render(before);
        this.advanceTurn();
      },
      advanceTurn() {
        let next = this.opponent(this.currentPlayer);
        const nextMoves = this.getLegalMoves(this.board, next);
        const currentMoves = this.getLegalMoves(this.board, this.currentPlayer);
        if (!nextMoves.length && !currentMoves.length) {
          this.endGame();
          return;
        }
        if (!nextMoves.length) {
          UIManager.toast(`${this.colorName(next)}沒有合法步，跳過回合`);
          AudioEngine.sfx('skip');
          next = this.currentPlayer;
        }
        this.currentPlayer = next;
        this.save();
        UIManager.render();
        if (this.currentPlayer === this.aiPlayer) this.queueAiMove();
      },
      queueAiMove() {
        if (this.gameEnded) return;
        this.isBusy = true;
        UIManager.setThinking(true);
        const delays = { fast: 500, normal: 800, slow: 1000 };
        const delay = delays[StorageManager.settings.aiSpeed] || 800;
        setTimeout(() => {
          const move = AIEngine.chooseMove(this.board, this.aiPlayer, this.difficulty);
          this.isBusy = false;
          UIManager.setThinking(false);
          if (!move) {
            this.advanceTurn();
            return;
          }
          this.commitMove(move, this.aiPlayer, 'ai');
        }, delay);
      },
      countPieces(board = this.board) {
        let black = 0;
        let white = 0;
        for (const row of board) {
          for (const cell of row) {
            if (cell === BLACK) black += 1;
            if (cell === WHITE) white += 1;
          }
        }
        return { black, white };
      },
      colorName(player) { return player === BLACK ? '黑棋' : '白棋'; },
      endGame() {
        this.gameEnded = true;
        this.isBusy = false;
        StorageManager.clearState();
        const counts = this.countPieces();
        const playerCount = this.playerColor === BLACK ? counts.black : counts.white;
        const aiCount = this.aiPlayer === BLACK ? counts.black : counts.white;
        const result = playerCount > aiCount ? 'win' : playerCount < aiCount ? 'lose' : 'draw';
        const records = StorageManager.records;
        records.totalGames += 1;
        if (result === 'win') {
          records.wins += 1;
          records.winStreak += 1;
          records.bestStreak = Math.max(records.bestStreak, records.winStreak);
          AudioEngine.sfx('win');
        } else if (result === 'lose') {
          records.losses += 1;
          records.winStreak = 0;
          AudioEngine.sfx('lose');
        } else {
          records.draws += 1;
          records.winStreak = 0;
          AudioEngine.sfx('draw');
        }
        StorageManager.saveRecords();
        UIManager.showResult(result, playerCount, aiCount);
        UIManager.updateRecords();
        UIManager.updateContinueButton();
      }
    };
