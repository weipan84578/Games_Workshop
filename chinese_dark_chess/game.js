    const PIECE_DEFS = [
      { type: "king", red: "帥", black: "將", count: 1, rank: 6, value: 10000 },
      { type: "guard", red: "仕", black: "士", count: 2, rank: 5, value: 500 },
      { type: "elephant", red: "相", black: "象", count: 2, rank: 4, value: 300 },
      { type: "rook", red: "俥", black: "車", count: 2, rank: 3, value: 350 },
      { type: "horse", red: "傌", black: "馬", count: 2, rank: 2, value: 200 },
      { type: "cannon", red: "炮", black: "包", count: 2, rank: 1, value: 150 },
      { type: "soldier", red: "兵", black: "卒", count: 5, rank: 0, value: 100 }
    ];

    const DIFFICULTY = {
      easy: { depth: 1, delay: 800, mistake: .3 },
      normal: { depth: 2, delay: 600, mistake: .1 },
      hard: { depth: 3, delay: 400, mistake: 0 }
    };

    const STORAGE = {
      difficulty: "dchess_difficulty",
      bgmVolume: "dchess_bgm_vol",
      sfxVolume: "dchess_sfx_vol",
      showHints: "dchess_show_hints",
      animSpeed: "dchess_anim_speed",
      bestScore: "dchess_best_score"
    };

    const state = {
      board: [],
      phase: "menu",
      playerColor: null,
      aiColor: null,
      currentTurn: "player",
      turnCount: 0,
      selectedCell: null,
      capturedByPlayer: [],
      capturedByAI: [],
      noCaptureTurns: 0,
      history: [],
      logs: [],
      aiThinking: false,
      muted: false,
      settings: loadSettings()
    };

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const AudioEngine = {
      ctx: null,
      master: null,
      bgm: null,
      bgmGain: null,
      sfxGain: null,
      init() {
        if (this.ctx) return;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain.connect(this.master);
        this.sfxGain.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.setVolume();
      },
      ensure() {
        this.init();
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      },
      setVolume() {
        if (!this.master) return;
        this.master.gain.value = state.muted ? 0 : 1;
        this.bgmGain.gain.value = state.settings.bgmVolume;
        this.sfxGain.gain.value = state.settings.sfxVolume;
      },
      playBGM() {
        if (!this.ctx || this.bgm || state.settings.bgmVolume <= 0) return;
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 130.81;
        filter.type = "lowpass";
        filter.frequency.value = 640;
        gain.gain.value = .08;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);
        osc.start();
        this.bgm = { osc, gain };
      },
      stopBGM() {
        if (!this.bgm) return;
        this.bgm.gain.gain.setTargetAtTime(0, this.ctx.currentTime, .08);
        this.bgm.osc.stop(this.ctx.currentTime + .3);
        this.bgm = null;
      },
      tone(freq, duration, type = "sine", volume = .18) {
        if (!this.ctx || state.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + .01);
        gain.gain.exponentialRampToValueAtTime(.001, now + duration);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + duration + .02);
      },
      noise(duration = .12, volume = .12) {
        if (!this.ctx || state.muted) return;
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 900;
        gain.gain.value = volume;
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        source.start();
      },
      playSFX(type) {
        this.ensure();
        if (type === "flip") { this.noise(.09, .08); this.tone(330, .12, "triangle", .12); }
        if (type === "move") this.tone(260, .11, "sine", .12);
        if (type === "capture") { this.noise(.16, .14); this.tone(180, .18, "sawtooth", .14); }
        if (type === "win") [261.63, 329.63, 392, 523.25].forEach((f, i) => setTimeout(() => this.tone(f, .18, "triangle", .14), i * 90));
        if (type === "lose") [392, 329.63, 261.63].forEach((f, i) => setTimeout(() => this.tone(f, .22, "sine", .13), i * 110));
        if (type === "bad") this.tone(120, .16, "sawtooth", .1);
      }
    };

    const BoardLogic = {
      init() {
        const pieces = [];
        let id = 0;
        for (const color of ["red", "black"]) {
          for (const def of PIECE_DEFS) {
            for (let i = 0; i < def.count; i++) {
              pieces.push({ id: id++, type: def.type, color, text: def[color], rank: def.rank, value: def.value, revealed: false });
            }
          }
        }
        shuffle(pieces);
        state.board = pieces;
      },
      flip(idx) {
        const piece = state.board[idx];
        if (!piece || piece.revealed) return false;
        piece.revealed = true;
        if (!state.playerColor) {
          state.playerColor = piece.color;
          state.aiColor = opposite(piece.color);
          log(`你翻出 ${piece.text}，玩家為${colorName(state.playerColor)}。`);
        } else {
          log(`翻出 ${piece.text}。`);
        }
        AudioEngine.playSFX("flip");
        return true;
      },
      move(from, to) {
        if (!this.canMove(from, to)) return false;
        state.board[to] = state.board[from];
        state.board[from] = null;
        state.noCaptureTurns++;
        AudioEngine.playSFX("move");
        return true;
      },
      capture(from, to, actor) {
        if (!this.canCapture(from, to)) return false;
        const target = state.board[to];
        if (actor === "player") state.capturedByPlayer.push(target);
        else state.capturedByAI.push(target);
        state.board[to] = state.board[from];
        state.board[from] = null;
        state.noCaptureTurns = 0;
        AudioEngine.playSFX("capture");
        return true;
      },
      canMove(from, to, board = state.board) {
        const piece = board[from];
        return !!piece && piece.revealed && !board[to] && adjacent(from, to);
      },
      canCapture(from, to, board = state.board) {
        const attacker = board[from];
        const target = board[to];
        if (!attacker || !target || !attacker.revealed || !target.revealed || attacker.color === target.color) return false;
        if (attacker.type === "cannon") return cannonCanAttack(from, to, board);
        if (!adjacent(from, to)) return false;
        if (attacker.type === "soldier" && target.type === "king") return true;
        if (attacker.type === "king" && target.type === "soldier") return false;
        return attacker.rank >= target.rank;
      },
      getLegalMovesForPiece(idx, board = state.board) {
        const piece = board[idx];
        if (!piece || !piece.revealed) return [];
        const moves = [];
        for (const n of neighbors(idx)) {
          if (!board[n]) moves.push({ type: "move", from: idx, to: n });
          else if (this.canCapture(idx, n, board)) moves.push({ type: "capture", from: idx, to: n });
        }
        if (piece.type === "cannon") {
          for (const to of cannonTargets(idx, board)) moves.push({ type: "capture", from: idx, to });
        }
        return moves;
      },
      getAllActions(actor, board = state.board) {
        const color = actor === "player" ? state.playerColor : state.aiColor;
        const actions = [];
        board.forEach((piece, idx) => {
          if (!piece) return;
          if (!piece.revealed) actions.push({ type: "flip", idx });
          if (piece.revealed && piece.color === color) actions.push(...this.getLegalMovesForPiece(idx, board));
        });
        return actions;
      },
      isGameOver() {
        const redAlive = state.board.some(piece => piece && piece.color === "red");
        const blackAlive = state.board.some(piece => piece && piece.color === "black");
        if (!redAlive || !blackAlive) return !redAlive ? "black" : "red";
        if (state.noCaptureTurns >= 60) return "draw";
        if (state.playerColor && this.getAllActions("player").length === 0) return "ai";
        if (state.aiColor && this.getAllActions("ai").length === 0) return "player";
        return null;
      }
    };

    const AIEngine = {
      getBestMove() {
        const actions = BoardLogic.getAllActions("ai");
        if (!actions.length) return null;
        const config = DIFFICULTY[state.settings.difficulty];
        if (Math.random() < config.mistake) return actions[Math.floor(Math.random() * actions.length)];

        const tactical = actions.filter(a => a.type === "capture").sort((a, b) => state.board[b.to].value - state.board[a.to].value);
        if (tactical.length && state.settings.difficulty === "easy") return tactical[0];

        let best = actions[0];
        let bestScore = -Infinity;
        for (const action of actions) {
          const score = this.minimax(applyActionClone(state.board, action), config.depth - 1, -Infinity, Infinity, false);
          if (score > bestScore) {
            bestScore = score;
            best = action;
          }
        }
        return best;
      },
      minimax(board, depth, alpha, beta, maximizing) {
        if (depth <= 0) return this.evaluate(board);
        const actor = maximizing ? "ai" : "player";
        const actions = this.actionsForBoard(board, actor).slice(0, 18);
        if (!actions.length) return this.evaluate(board);
        if (maximizing) {
          let score = -Infinity;
          for (const action of actions) {
            score = Math.max(score, this.minimax(applyActionClone(board, action), depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
          return score;
        }
        let score = Infinity;
        for (const action of actions) {
          score = Math.min(score, this.minimax(applyActionClone(board, action), depth - 1, alpha, beta, true));
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
        return score;
      },
      actionsForBoard(board, actor) {
        const color = actor === "ai" ? state.aiColor : state.playerColor;
        const actions = [];
        board.forEach((piece, idx) => {
          if (!piece) return;
          if (!piece.revealed) actions.push({ type: "flip", idx, scoreHint: 10 });
          if (piece.revealed && piece.color === color) actions.push(...BoardLogic.getLegalMovesForPiece(idx, board));
        });
        return actions.sort((a, b) => actionPriority(b, board) - actionPriority(a, board));
      },
      evaluate(board) {
        let score = 0;
        board.forEach((piece, idx) => {
          if (!piece) return;
          const sign = piece.color === state.aiColor ? 1 : -1;
          const hiddenFactor = piece.revealed ? 1 : .35;
          score += sign * piece.value * hiddenFactor;
          if (piece.revealed) score += sign * (3 - Math.abs(1.5 - Math.floor(idx / 8))) * 4;
        });
        const aiMobility = this.actionsForBoard(board, "ai").filter(a => a.type !== "flip").length;
        const playerMobility = this.actionsForBoard(board, "player").filter(a => a.type !== "flip").length;
        score += (aiMobility - playerMobility) * 8;
        return score;
      },
      makeMove(action) {
        if (!action) return;
        if (action.type === "flip") {
          const piece = state.board[action.idx];
          BoardLogic.flip(action.idx);
          log(`AI 翻出 ${piece.text}。`);
        } else if (action.type === "move") {
          const p = state.board[action.from];
          BoardLogic.move(action.from, action.to);
          log(`AI 移動 ${p.text}。`);
        } else if (action.type === "capture") {
          const p = state.board[action.from];
          const t = state.board[action.to];
          BoardLogic.capture(action.from, action.to, "ai");
          log(`AI 以 ${p.text} 吃 ${t.text}。`);
        }
      }
    };

    const UIController = {
      showScreen(name) {
        $$(".screen").forEach(screen => screen.classList.remove("active"));
        $(`#screen-${name}`).classList.add("active");
        state.phase = name === "game" ? "playing" : name;
        if (name === "game") AudioEngine.playBGM();
        else AudioEngine.stopBGM();
      },
      renderBoard() {
        const board = $("#board");
        board.innerHTML = "";
        state.board.forEach((piece, idx) => {
          const cell = document.createElement("button");
          cell.className = "cell";
          cell.type = "button";
          cell.dataset.index = idx;
          cell.setAttribute("aria-label", cellLabel(piece, idx));
          cell.addEventListener("click", () => GameController.handleCellClick(idx));
          if (piece) {
            const pieceEl = document.createElement("div");
            pieceEl.className = `piece ${piece.revealed ? piece.color : "hidden"}${state.selectedCell === idx ? " selected" : ""}`;
            pieceEl.dataset.pieceId = piece.id;
            const text = document.createElement("span");
            text.className = "piece-text";
            text.textContent = piece.revealed ? piece.text : "";
            pieceEl.appendChild(text);
            cell.appendChild(pieceEl);
          }
          board.appendChild(cell);
        });
        this.showHints();
        this.updateStatusBar();
        $("#log").innerHTML = state.logs.slice(-5).map(item => `<div>${escapeHtml(item)}</div>`).join("");
      },
      showHints() {
        $$(".cell").forEach(cell => cell.classList.remove("hint-dot"));
        if (!state.settings.showHints || state.selectedCell == null || state.currentTurn !== "player") return;
        for (const move of BoardLogic.getLegalMovesForPiece(state.selectedCell)) {
          const cell = $(`.cell[data-index="${move.to}"]`);
          if (cell) cell.classList.add("hint-dot");
        }
      },
      updateStatusBar() {
        const remainingPlayer = state.playerColor ? state.board.filter(p => p && p.color === state.playerColor).length : 16;
        const remainingAI = state.aiColor ? state.board.filter(p => p && p.color === state.aiColor).length : 16;
        $("#turn-status").innerHTML = state.aiThinking
          ? `AI 思考中<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>`
          : state.currentTurn === "player" ? "玩家回合" : "AI 回合";
        $("#player-status").textContent = `${state.playerColor ? colorName(state.playerColor) : "未定"} / ${remainingPlayer} 枚`;
        $("#ai-status").textContent = `${state.aiColor ? colorName(state.aiColor) : "未定"} / ${remainingAI} 枚`;
        $("#btn-undo").disabled = state.history.length < 1 || state.aiThinking;
      },
      showGameOver(result) {
        let title = "和局";
        let detail = "雙方僵持不下。";
        if (result === "player" || result === state.playerColor) {
          title = "你贏了";
          detail = `共進行 ${state.turnCount} 回合。`;
          AudioEngine.playSFX("win");
          saveBestScore();
        } else if (result === "ai" || result === state.aiColor) {
          title = "AI 獲勝";
          detail = `共進行 ${state.turnCount} 回合。`;
          AudioEngine.playSFX("lose");
        }
        $("#gameover-title").textContent = title;
        $("#gameover-detail").textContent = detail;
        $("#overlay-gameover").classList.add("active");
      }
    };

    const GameController = {
      startGame() {
        Object.assign(state, {
          board: [],
          phase: "playing",
          playerColor: null,
          aiColor: null,
          currentTurn: "player",
          turnCount: 0,
          selectedCell: null,
          capturedByPlayer: [],
          capturedByAI: [],
          noCaptureTurns: 0,
          history: [],
          logs: [],
          aiThinking: false
        });
        BoardLogic.init();
        $("#overlay-gameover").classList.remove("active");
        log("新局開始。");
        UIController.showScreen("game");
        UIController.renderBoard();
      },
      handleCellClick(idx) {
        AudioEngine.ensure();
        if (state.phase !== "playing" || state.currentTurn !== "player" || state.aiThinking) return;
        const piece = state.board[idx];
        if (!piece) {
          if (state.selectedCell != null) this.tryMove(state.selectedCell, idx);
          return;
        }
        if (!piece.revealed) {
          this.saveHistory();
          BoardLogic.flip(idx);
          this.endPlayerTurn();
          return;
        }
        if (piece.color === state.playerColor) {
          state.selectedCell = state.selectedCell === idx ? null : idx;
          UIController.renderBoard();
          return;
        }
        if (state.selectedCell != null) this.tryMove(state.selectedCell, idx);
      },
      tryMove(from, to) {
        const actor = "player";
        this.saveHistory();
        const moving = state.board[from];
        const target = state.board[to];
        let ok = false;
        if (!target && BoardLogic.move(from, to)) {
          log(`你移動 ${moving.text}。`);
          ok = true;
        } else if (target && BoardLogic.capture(from, to, actor)) {
          log(`你以 ${moving.text} 吃 ${target.text}。`);
          ok = true;
        }
        if (!ok) {
          state.history.pop();
          AudioEngine.playSFX("bad");
          return;
        }
        state.selectedCell = null;
        this.endPlayerTurn();
      },
      endPlayerTurn() {
        state.turnCount++;
        state.selectedCell = null;
        UIController.renderBoard();
        if (this.checkGameOver()) return;
        state.currentTurn = "ai";
        this.triggerAI();
      },
      triggerAI() {
        state.aiThinking = true;
        UIController.updateStatusBar();
        const config = DIFFICULTY[state.settings.difficulty];
        setTimeout(() => {
          AIEngine.makeMove(AIEngine.getBestMove());
          state.turnCount++;
          state.aiThinking = false;
          state.currentTurn = "player";
          UIController.renderBoard();
          this.checkGameOver();
        }, config.delay);
      },
      saveHistory() {
        state.history.push({
          board: cloneBoard(state.board),
          playerColor: state.playerColor,
          aiColor: state.aiColor,
          currentTurn: state.currentTurn,
          turnCount: state.turnCount,
          capturedByPlayer: cloneBoard(state.capturedByPlayer),
          capturedByAI: cloneBoard(state.capturedByAI),
          noCaptureTurns: state.noCaptureTurns,
          logs: [...state.logs]
        });
        state.history = state.history.slice(-2);
      },
      undoMove() {
        const prev = state.history.pop();
        if (!prev || state.aiThinking) return;
        Object.assign(state, prev, { selectedCell: null, aiThinking: false });
        log("已悔棋。");
        UIController.renderBoard();
      },
      surrender() {
        if (state.phase !== "playing") return;
        UIController.showGameOver("ai");
      },
      proposeDraw() {
        if (state.phase !== "playing") return;
        UIController.showGameOver("draw");
      },
      checkGameOver() {
        const result = BoardLogic.isGameOver();
        if (!result) return false;
        state.phase = "gameover";
        UIController.showGameOver(result);
        return true;
      }
    };

    const SettingsController = {
      bindUI() {
        $("#setting-bgm").value = Math.round(state.settings.bgmVolume * 100);
        $("#setting-sfx").value = Math.round(state.settings.sfxVolume * 100);
        $("#setting-hints").checked = state.settings.showHints;
        this.refreshSegments();
        $("#setting-bgm").addEventListener("input", (e) => {
          state.settings.bgmVolume = Number(e.target.value) / 100;
          this.save();
        });
        $("#setting-sfx").addEventListener("input", (e) => {
          state.settings.sfxVolume = Number(e.target.value) / 100;
          AudioEngine.playSFX("move");
          this.save();
        });
        $("#setting-hints").addEventListener("change", (e) => {
          state.settings.showHints = e.target.checked;
          this.save();
          UIController.renderBoard();
        });
        $$(".segmented button").forEach(btn => {
          btn.addEventListener("click", () => {
            const setting = btn.closest(".segmented").dataset.setting;
            state.settings[setting] = btn.dataset.value;
            this.save();
            this.refreshSegments();
          });
        });
      },
      refreshSegments() {
        $$(".segmented").forEach(group => {
          const setting = group.dataset.setting;
          group.querySelectorAll("button").forEach(btn => btn.classList.toggle("active", btn.dataset.value === state.settings[setting]));
        });
      },
      save() {
        localStorage.setItem(STORAGE.difficulty, state.settings.difficulty);
        localStorage.setItem(STORAGE.bgmVolume, String(state.settings.bgmVolume));
        localStorage.setItem(STORAGE.sfxVolume, String(state.settings.sfxVolume));
        localStorage.setItem(STORAGE.showHints, String(state.settings.showHints));
        localStorage.setItem(STORAGE.animSpeed, state.settings.animSpeed);
        AudioEngine.setVolume();
      }
    };

    function loadSettings() {
      return {
        difficulty: localStorage.getItem(STORAGE.difficulty) || "normal",
        bgmVolume: parseFloat(localStorage.getItem(STORAGE.bgmVolume) || "0.5"),
        sfxVolume: parseFloat(localStorage.getItem(STORAGE.sfxVolume) || "0.8"),
        showHints: localStorage.getItem(STORAGE.showHints) !== "false",
        animSpeed: localStorage.getItem(STORAGE.animSpeed) || "normal"
      };
    }

    function shuffle(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
    }

    function opposite(color) {
      return color === "red" ? "black" : "red";
    }

    function colorName(color) {
      return color === "red" ? "紅方" : "黑方";
    }

    function adjacent(a, b) {
      return neighbors(a).includes(b);
    }

    function neighbors(idx) {
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const result = [];
      if (row > 0) result.push(idx - 8);
      if (row < 3) result.push(idx + 8);
      if (col > 0) result.push(idx - 1);
      if (col < 7) result.push(idx + 1);
      return result;
    }

    function sameLine(a, b) {
      return Math.floor(a / 8) === Math.floor(b / 8) || a % 8 === b % 8;
    }

    function pathBetween(a, b) {
      if (!sameLine(a, b)) return [];
      const step = Math.floor(a / 8) === Math.floor(b / 8) ? (a < b ? 1 : -1) : (a < b ? 8 : -8);
      const path = [];
      for (let i = a + step; i !== b; i += step) path.push(i);
      return path;
    }

    function cannonCanAttack(from, to, board) {
      const attacker = board[from];
      const target = board[to];
      if (!attacker || !target || attacker.type !== "cannon" || attacker.color === target.color || !sameLine(from, to)) return false;
      return pathBetween(from, to).filter(i => board[i]).length === 1;
    }

    function cannonTargets(from, board) {
      const piece = board[from];
      if (!piece || piece.type !== "cannon") return [];
      const targets = [];
      for (let to = 0; to < board.length; to++) {
        if (to !== from && board[to] && board[to].revealed && board[to].color !== piece.color && cannonCanAttack(from, to, board)) {
          targets.push(to);
        }
      }
      return targets;
    }

    function cloneBoard(board) {
      return board.map(piece => piece ? { ...piece } : null);
    }

    function applyActionClone(board, action) {
      const next = cloneBoard(board);
      if (action.type === "flip") {
        if (next[action.idx]) next[action.idx].revealed = true;
      } else {
        next[action.to] = next[action.from];
        next[action.from] = null;
      }
      return next;
    }

    function actionPriority(action, board) {
      if (action.type === "capture") return 1000 + board[action.to].value - board[action.from].value * .08;
      if (action.type === "move") return 100;
      return 30;
    }

    function log(message) {
      state.logs.push(message);
      state.logs = state.logs.slice(-24);
    }

    function cellLabel(piece, idx) {
      if (!piece) return `${idx + 1} 空格`;
      return piece.revealed ? `${idx + 1} ${colorName(piece.color)} ${piece.text}` : `${idx + 1} 暗棋`;
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    }

    function saveBestScore() {
      const key = state.settings.difficulty;
      const current = JSON.parse(localStorage.getItem(STORAGE.bestScore) || "{}");
      if (!current[key] || state.turnCount < current[key]) {
        current[key] = state.turnCount;
        localStorage.setItem(STORAGE.bestScore, JSON.stringify(current));
      }
    }

    function bindEvents() {
      $("#btn-start").addEventListener("click", () => {
        AudioEngine.ensure();
        GameController.startGame();
      });
      $("#btn-new").addEventListener("click", () => GameController.startGame());
      $("#btn-again").addEventListener("click", () => GameController.startGame());
      $("#btn-undo").addEventListener("click", () => GameController.undoMove());
      $("#btn-draw").addEventListener("click", () => GameController.proposeDraw());
      $("#btn-surrender").addEventListener("click", () => GameController.surrender());
      $("#btn-sound").addEventListener("click", () => {
        state.muted = !state.muted;
        $("#btn-sound").textContent = state.muted ? "開音" : "靜音";
        AudioEngine.setVolume();
      });
      $$("[data-screen]").forEach(btn => {
        btn.addEventListener("click", () => {
          $("#overlay-gameover").classList.remove("active");
          UIController.showScreen(btn.dataset.screen);
          if (btn.dataset.screen === "game") UIController.renderBoard();
        });
      });
      $$(".help-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          $$(".help-tab").forEach(t => t.setAttribute("aria-selected", String(t === tab)));
          $$(".help-pane").forEach(pane => pane.classList.toggle("active", pane.id === `help-${tab.dataset.tab}`));
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      bindEvents();
      SettingsController.bindUI();
      BoardLogic.init();
      UIController.renderBoard();
    });
