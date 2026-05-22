(function () {
  "use strict";

  var SENTE = "SENTE";
  var GOTE = "GOTE";
  var PLAYERS = [SENTE, GOTE];
  var TYPES = ["FU", "KY", "KE", "GI", "KI", "KA", "HI"];
  var PROMOTE = { FU: "TO", KY: "NY", KE: "NK", GI: "NG", KA: "UM", HI: "RY" };
  var DEMOTE = { TO: "FU", NY: "KY", NK: "KE", NG: "GI", UM: "KA", RY: "HI" };
  var VALUES = { FU: 100, KY: 300, KE: 350, GI: 600, KI: 700, KA: 1000, HI: 1200, OU: 99999, TO: 600, NY: 600, NK: 600, NG: 650, UM: 1500, RY: 1800 };
  var LABELS = {
    FU: ["歩", "步"], KY: ["香", "香"], KE: ["桂", "桂"], GI: ["銀", "銀"], KI: ["金", "金"], KA: ["角", "角"], HI: ["飛", "飛"], OU: ["王", "玉"],
    TO: ["と", "成歩"], NY: ["杏", "成香"], NK: ["今", "成桂"], NG: ["全", "成銀"], UM: ["馬", "龍馬"], RY: ["龍", "龍王"]
  };
  var DIFFICULTIES = {
    BEGINNER: { name: "入門", icon: "一", desc: "深度 1，AI 思考約 2 秒。", depth: 1, q: 0, thinkMin: 2, thinkMax: 2 },
    EASY: { name: "初級", icon: "二", desc: "深度 2，AI 思考約 4 秒。", depth: 2, q: 1, thinkMin: 4, thinkMax: 4 },
    MEDIUM: { name: "中級", icon: "三", desc: "深度 3，AI 思考約 4～7 秒。", depth: 3, q: 2, thinkMin: 4, thinkMax: 7 },
    HARD: { name: "高級", icon: "四", desc: "深度 4，AI 思考約 5～10 秒。", depth: 4, q: 2, thinkMin: 5, thinkMax: 10 }
  };
  var DEFAULT_SETTINGS = {
    aiDifficulty: "MEDIUM",
    musicVolume: 70,
    sfxVolume: 80,
    boardTheme: "DARK_WOOD",
    showLegalMoves: true,
    showCoordinates: true,
    animationSpeed: "NORMAL",
    playerSide: SENTE,
    timerEnabled: false,
    timerSeconds: 600
  };

  var state = null;
  var settings = normalizeSettings(loadJson("shogi_settings", DEFAULT_SETTINGS));
  var selectedDifficulty = settings.aiDifficulty;
  var undoStack = [];
  var timerId = null;
  var playerSide = SENTE;
  var aiSide = GOTE;
  var audio = createAudioManager();

  var els = {};
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    bindElements();
    applySettingsTheme();
    renderDifficultyCards();
    bindUi();
    loadSettingsForm();
    updateContinueButton();
    showScreen("menuScreen");
  }

  function bindElements() {
    [
      "menuScreen", "difficultyScreen", "settingsScreen", "rulesScreen", "gameScreen", "difficultyGrid",
      "confirmDifficultyBtn", "continueBtn", "startBtn", "settingsBtn", "rulesBtn", "settingsForm",
      "musicOut", "sfxOut", "board", "senteHand", "goteHand", "kifuList", "turnLabel", "thinking",
      "undoBtn", "resignBtn", "modalRoot", "musicBtn", "openSettingsInGameBtn", "menuInGameBtn",
      "timerPanel", "senteTimer", "goteTimer", "toggleKifuBtn"
    ].forEach(function (id) { els[id] = document.getElementById(id); });
  }

  function bindUi() {
    document.body.addEventListener("click", function () { audio.ensure(); audio.startMenuMusic(); }, { once: true });
    els.startBtn.addEventListener("click", function () { audio.play("menu"); showScreen("difficultyScreen"); });
    els.continueBtn.addEventListener("click", continueGame);
    els.settingsBtn.addEventListener("click", function () { audio.play("menu"); showScreen("settingsScreen"); });
    els.rulesBtn.addEventListener("click", function () { audio.play("menu"); showScreen("rulesScreen"); });
    els.confirmDifficultyBtn.addEventListener("click", function () {
      settings.aiDifficulty = selectedDifficulty;
      saveSettings();
      startNewGame();
    });
    document.querySelectorAll("[data-screen]").forEach(function (btn) {
      btn.addEventListener("click", function () { audio.play("menu"); showScreen(btn.dataset.screen); });
    });
    els.settingsForm.addEventListener("input", onSettingsInput);
    els.settingsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      readSettingsForm();
      saveSettings();
      applySettingsTheme();
      audio.setVolumes(settings);
      audio.play("menu");
      showScreen("menuScreen");
    });
    els.board.addEventListener("click", onBoardClick);
    els.senteHand.addEventListener("click", onHandClick);
    els.goteHand.addEventListener("click", onHandClick);
    els.undoBtn.addEventListener("click", undoMove);
    els.resignBtn.addEventListener("click", function () { confirmDialog("確定要投了嗎？", function () { finishGame(aiSide, "你已投了。"); }); });
    els.musicBtn.addEventListener("click", function () {
      audio.toggleMusic();
      els.musicBtn.textContent = audio.muted ? "×" : "♪";
    });
    els.openSettingsInGameBtn.addEventListener("click", function () { showScreen("settingsScreen"); });
    els.menuInGameBtn.addEventListener("click", function () {
      confirmDialog("回主選單？目前棋局會自動儲存。", function () { saveGame(); stopTimer(); showScreen("menuScreen"); updateContinueButton(); });
    });
    els.toggleKifuBtn.addEventListener("click", function () {
      els.toggleKifuBtn.closest(".kifu-panel").classList.toggle("open");
    });
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(function (screen) { screen.classList.remove("active"); });
    els[id].classList.add("active");
    if (id === "gameScreen") audio.startGameMusic();
    else audio.startMenuMusic();
  }

  function startNewGame() {
    playerSide = settings.playerSide || SENTE;
    aiSide = GOTE;
    if (playerSide === GOTE) aiSide = SENTE;
    state = createInitialState();
    undoStack = [];
    showScreen("gameScreen");
    renderAll();
    saveGame();
    audio.startGameMusic();
    startTimer();
    if (state.currentPlayer === aiSide) triggerAi();
  }

  function continueGame() {
    var saved = loadJson("shogi_save", null);
    if (!saved || !saved.state) return;
    state = saved.state;
    if (state.phase === "AI") state.phase = "PLAYING";
    undoStack = saved.undoStack || [];
    playerSide = saved.playerSide || settings.playerSide || SENTE;
    aiSide = GOTE;
    if (playerSide === GOTE) aiSide = SENTE;
    showScreen("gameScreen");
    renderAll();
    audio.startGameMusic();
    startTimer();
    if (state.currentPlayer === aiSide && state.phase === "PLAYING") triggerAi();
  }

  function createInitialState() {
    var board = emptyBoard();
    var back = ["KY", "KE", "GI", "KI", "OU", "KI", "GI", "KE", "KY"];
    for (var c = 0; c < 9; c++) {
      board[0][c] = piece(back[c], GOTE);
      board[2][c] = piece("FU", GOTE);
      board[6][c] = piece("FU", SENTE);
      board[8][c] = piece(back[c], SENTE);
    }
    board[1][1] = piece("HI", GOTE);
    board[1][7] = piece("KA", GOTE);
    board[7][1] = piece("KA", SENTE);
    board[7][7] = piece("HI", SENTE);
    return {
      board: board,
      hands: { SENTE: emptyHand(), GOTE: emptyHand() },
      currentPlayer: SENTE,
      moveCount: 1,
      phase: "PLAYING",
      selectedSquare: null,
      selectedHand: null,
      legalMoves: [],
      lastMove: null,
      winner: null,
      history: [],
      timers: { SENTE: settings.timerSeconds, GOTE: settings.timerSeconds }
    };
  }

  function emptyBoard() {
    return Array.from({ length: 9 }, function () { return Array(9).fill(null); });
  }

  function emptyHand() {
    return { FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0 };
  }

  function piece(type, owner) {
    return { type: type, owner: owner };
  }

  function onBoardClick(event) {
    if (!state || state.phase !== "PLAYING" || state.currentPlayer !== playerSide) return;
    var square = event.target.closest(".square");
    if (!square) return;
    var row = Number(square.dataset.row);
    var col = Number(square.dataset.col);
    audio.ensure();
    handleSquare(row, col);
  }

  function handleSquare(row, col) {
    var target = state.board[row][col];
    if (state.selectedHand) {
      var drop = state.legalMoves.find(function (m) { return m.drop && m.to.row === row && m.to.col === col; });
      if (drop) return executePlayerMove(drop);
      clearSelection();
      audio.play("invalid");
      return renderAll();
    }
    if (state.selectedSquare) {
      var move = state.legalMoves.find(function (m) { return !m.drop && m.to.row === row && m.to.col === col; });
      if (move) return maybePromoteThenExecute(move);
      if (target && target.owner === playerSide) return selectSquare(row, col);
      clearSelection();
      audio.play("invalid");
      return renderAll();
    }
    if (target && target.owner === playerSide) selectSquare(row, col);
  }

  function onHandClick(event) {
    if (!state || state.phase !== "PLAYING" || state.currentPlayer !== playerSide) return;
    var btn = event.target.closest(".hand-piece");
    if (!btn || btn.dataset.owner !== playerSide) return;
    var type = btn.dataset.type;
    if (!state.hands[playerSide][type]) return;
    state.selectedSquare = null;
    state.selectedHand = type;
    state.legalMoves = generateLegalMoves(state, playerSide).filter(function (m) { return m.drop && m.piece === type; });
    audio.play("select");
    renderAll();
  }

  function selectSquare(row, col) {
    state.selectedSquare = { row: row, col: col };
    state.selectedHand = null;
    state.legalMoves = generateLegalMoves(state, playerSide).filter(function (m) {
      return !m.drop && m.from.row === row && m.from.col === col;
    });
    audio.play("select");
    renderAll();
  }

  function clearSelection() {
    state.selectedSquare = null;
    state.selectedHand = null;
    state.legalMoves = [];
  }

  function maybePromoteThenExecute(move) {
    var p = state.board[move.from.row][move.from.col];
    if (!canPromoteType(p.type)) return executePlayerMove(move);
    if (mustPromote(p.owner, p.type, move.to.row)) {
      move.promote = true;
      return executePlayerMove(move);
    }
    if (canPromoteMove(p.owner, move.from.row, move.to.row)) {
      promotionDialog(function (promote) {
        move.promote = promote;
        executePlayerMove(move);
      });
      return;
    }
    executePlayerMove(move);
  }

  function executePlayerMove(move) {
    clearSelection();
    makeMoveWithSnapshot(move);
    afterMove();
  }

  function makeMoveWithSnapshot(move) {
    undoStack.push(cloneState(state));
    if (undoStack.length > 20) undoStack.shift();
    applyMove(state, move);
  }

  function afterMove() {
    updateGameStatus();
    renderAll();
    saveGame();
    if (state.phase === "GAME_OVER") return;
    if (state.currentPlayer === aiSide) triggerAi();
  }

  function triggerAi() {
    if (!state || state.currentPlayer !== aiSide || state.phase === "GAME_OVER") return;
    els.thinking.classList.remove("hidden");
    state.phase = "AI";
    renderAll();
    var startedAt = Date.now();
    var thinkMs = getAiThinkMs();
    var deadline = startedAt + thinkMs;
    window.setTimeout(function () {
      try {
        var best = findBestMove(state, aiSide, DIFFICULTIES[settings.aiDifficulty] || DIFFICULTIES.MEDIUM, deadline);
        if (Date.now() > deadline) best = randomLegalMove(state, aiSide);
        if (!best) {
          state.phase = "PLAYING";
          els.thinking.classList.add("hidden");
          finishGame(playerSide, "AI 無合法手。");
          return;
        }
        finishAiMove(best, startedAt, thinkMs);
      } catch (error) {
        var fallback = randomLegalMove(state, aiSide);
        if (fallback) {
          finishAiMove(fallback, startedAt, thinkMs);
        } else {
          state.phase = "PLAYING";
          els.thinking.classList.add("hidden");
          finishGame(playerSide, "AI 無合法手。");
        }
      }
    }, 120);
  }

  function finishAiMove(move, startedAt, thinkMs) {
    var remaining = Math.max(0, thinkMs - (Date.now() - startedAt));
    window.setTimeout(function () {
      if (!state || state.phase === "GAME_OVER") return;
      state.phase = "PLAYING";
      makeMoveWithSnapshot(move);
      els.thinking.classList.add("hidden");
      afterMove();
    }, remaining);
  }

  function applyMove(s, move) {
    var player = s.currentPlayer;
    var moving;
    var captured = null;
    if (move.drop) {
      moving = piece(move.piece, player);
      s.hands[player][move.piece] -= 1;
      s.board[move.to.row][move.to.col] = moving;
    } else {
      moving = s.board[move.from.row][move.from.col];
      captured = s.board[move.to.row][move.to.col];
      s.board[move.from.row][move.from.col] = null;
      if (captured) {
        var base = baseType(captured.type);
        s.hands[player][base] += 1;
      }
      var newType = move.promote ? PROMOTE[moving.type] : moving.type;
      s.board[move.to.row][move.to.col] = piece(newType, player);
    }
    move.captured = captured ? captured.type : null;
    move.kifu = toKifu(s.moveCount, move, player, moving.type);
    s.history.push(move);
    s.lastMove = { to: move.to, from: move.from || null };
    s.currentPlayer = opponent(player);
    s.moveCount += 1;
    if (captured) audio.play("capture");
    else audio.play(move.promote ? "promote" : "drop");
  }

  function updateGameStatus() {
    var player = state.currentPlayer;
    var inCheck = isInCheck(state, player);
    var legal = generateLegalMoves(state, player, { fast: true, skipPawnDropMate: true });
    if (inCheck) audio.play("check");
    if (legal.length === 0) {
      finishGame(opponent(player), inCheck ? "詰將。" : "無合法手。");
    }
  }

  function finishGame(winner, reason) {
    state.phase = "GAME_OVER";
    state.winner = winner;
    stopTimer();
    renderAll();
    saveGame();
    audio.play(winner === playerSide ? "win" : "lose");
    var text = (winner === playerSide ? "你獲勝" : "AI 獲勝") + "。" + reason;
    modal("<h3>對局結束</h3><p>" + escapeHtml(text) + "</p><div class=\"modal-actions\"><button class=\"primary\" id=\"againBtn\">再玩一次</button><button id=\"backMenuBtn\">回主選單</button></div>");
    document.getElementById("againBtn").onclick = function () { closeModal(); startNewGame(); };
    document.getElementById("backMenuBtn").onclick = function () { closeModal(); showScreen("menuScreen"); updateContinueButton(); };
  }

  function undoMove() {
    if (!state || state.phase === "AI" || undoStack.length === 0) return;
    confirmDialog("要悔棋嗎？最多保留最近 10 步。", function () {
      var targetPlayer = state.currentPlayer;
      state = undoStack.pop();
      if (state.currentPlayer !== playerSide && undoStack.length) state = undoStack.pop();
      clearSelection();
      audio.play("undo");
      renderAll();
      saveGame();
      if (targetPlayer === aiSide && state.currentPlayer === aiSide) triggerAi();
    });
  }

  function generateLegalMoves(s, player, options) {
    options = options || {};
    var moves = generatePseudoMoves(s, player, options);
    var legal = [];
    for (var i = 0; i < moves.length; i++) {
      var copy = cloneState(s);
      copy.currentPlayer = player;
      applyMoveSilent(copy, moves[i]);
      if (!isInCheck(copy, player)) legal.push(moves[i]);
    }
    return legal;
  }

  function generatePseudoMoves(s, player, options) {
    var moves = [];
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var p = s.board[r][c];
        if (p && p.owner === player) addPieceMoves(s, moves, r, c, p);
      }
    }
    TYPES.forEach(function (type) {
      if (s.hands[player][type] > 0) addDropMoves(s, moves, player, type, options);
    });
    return moves;
  }

  function addPieceMoves(s, moves, r, c, p) {
    var dirs = directionsFor(p.type, p.owner);
    dirs.steps.forEach(function (d) { addStep(s, moves, r, c, d[0], d[1], p); });
    dirs.rays.forEach(function (d) { addRay(s, moves, r, c, d[0], d[1], p); });
  }

  function addStep(s, moves, r, c, dr, dc, p) {
    var nr = r + dr, nc = c + dc;
    if (!inside(nr, nc)) return;
    var target = s.board[nr][nc];
    if (!target || target.owner !== p.owner) pushMoveVariants(moves, { from: { row: r, col: c }, to: { row: nr, col: nc } }, p, r, nr);
  }

  function addRay(s, moves, r, c, dr, dc, p) {
    var nr = r + dr, nc = c + dc;
    while (inside(nr, nc)) {
      var target = s.board[nr][nc];
      if (target && target.owner === p.owner) break;
      pushMoveVariants(moves, { from: { row: r, col: c }, to: { row: nr, col: nc } }, p, r, nr);
      if (target) break;
      nr += dr; nc += dc;
    }
  }

  function pushMoveVariants(moves, base, p, fromRow, toRow) {
    if (!canPromoteType(p.type) || !canPromoteMove(p.owner, fromRow, toRow)) {
      moves.push(base);
      return;
    }
    if (mustPromote(p.owner, p.type, toRow)) {
      moves.push(Object.assign({}, base, { promote: true }));
      return;
    }
    moves.push(base);
    moves.push(Object.assign({}, base, { promote: true }));
  }

  function addDropMoves(s, moves, player, type, options) {
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        if (s.board[r][c]) continue;
        if (!canDropOn(player, type, r)) continue;
        if (type === "FU" && hasUnpromotedPawnOnFile(s, player, c)) continue;
        var move = { drop: true, piece: type, to: { row: r, col: c } };
        if (type === "FU" && !options.fast && !options.skipPawnDropMate && isPawnDropMate(s, player, move)) continue;
        moves.push(move);
      }
    }
  }

  function isPawnDropMate(s, player, move) {
    var copy = cloneState(s);
    copy.currentPlayer = player;
    applyMoveSilent(copy, move);
    var enemy = opponent(player);
    return isInCheck(copy, enemy) && generateLegalMoves(copy, enemy, { skipPawnDropMate: true }).length === 0;
  }

  function directionsFor(type, owner) {
    var f = owner === SENTE ? -1 : 1;
    var gold = [[f, 0], [f, -1], [f, 1], [0, -1], [0, 1], [-f, 0]];
    if (type === "FU") return { steps: [[f, 0]], rays: [] };
    if (type === "KY") return { steps: [], rays: [[f, 0]] };
    if (type === "KE") return { steps: [[2 * f, -1], [2 * f, 1]], rays: [] };
    if (type === "GI") return { steps: [[f, 0], [f, -1], [f, 1], [-f, -1], [-f, 1]], rays: [] };
    if (type === "KI" || type === "TO" || type === "NY" || type === "NK" || type === "NG") return { steps: gold, rays: [] };
    if (type === "KA") return { steps: [], rays: [[1, 1], [1, -1], [-1, 1], [-1, -1]] };
    if (type === "HI") return { steps: [], rays: [[1, 0], [-1, 0], [0, 1], [0, -1]] };
    if (type === "UM") return { steps: [[1, 0], [-1, 0], [0, 1], [0, -1]], rays: [[1, 1], [1, -1], [-1, 1], [-1, -1]] };
    if (type === "RY") return { steps: [[1, 1], [1, -1], [-1, 1], [-1, -1]], rays: [[1, 0], [-1, 0], [0, 1], [0, -1]] };
    return { steps: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], rays: [] };
  }

  function isInCheck(s, player) {
    var king = findKing(s, player);
    if (!king) return true;
    return isSquareAttacked(s, king.row, king.col, opponent(player));
  }

  function isSquareAttacked(s, row, col, byPlayer) {
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var p = s.board[r][c];
        if (!p || p.owner !== byPlayer) continue;
        var dirs = directionsFor(p.type, p.owner);
        for (var i = 0; i < dirs.steps.length; i++) {
          if (r + dirs.steps[i][0] === row && c + dirs.steps[i][1] === col) return true;
        }
        for (var j = 0; j < dirs.rays.length; j++) {
          var dr = dirs.rays[j][0], dc = dirs.rays[j][1], nr = r + dr, nc = c + dc;
          while (inside(nr, nc)) {
            if (nr === row && nc === col) return true;
            if (s.board[nr][nc]) break;
            nr += dr; nc += dc;
          }
        }
      }
    }
    return false;
  }

  function findKing(s, player) {
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      var p = s.board[r][c];
      if (p && p.owner === player && p.type === "OU") return { row: r, col: c };
    }
    return null;
  }

  function findBestMove(s, player, difficulty, deadline) {
    var searchDepth = Math.min(difficulty.depth, 2);
    var moves = limitMoves(sortMoves(generateLegalMoves(s, player, { fast: true, skipPawnDropMate: true }), s, player), searchDepth);
    if (!moves.length) return null;
    if (searchDepth === 1) return moves[Math.floor(Math.random() * Math.min(moves.length, 5))];
    var best = moves[0], bestScore = -Infinity;
    var alpha = -Infinity, beta = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (Date.now() > deadline) return randomLegalMove(s, player) || best;
      var copy = cloneState(s);
      copy.currentPlayer = player;
      applyMoveSilent(copy, moves[i]);
      var score = minimax(copy, searchDepth - 1, alpha, beta, false, player, 0, deadline);
      if (score > bestScore) {
        bestScore = score;
        best = moves[i];
      }
      alpha = Math.max(alpha, score);
    }
    return best;
  }

  function minimax(s, depth, alpha, beta, maximizing, aiPlayer, qDepth, deadline) {
    if (Date.now() > deadline) return evaluate(s, aiPlayer);
    var player = s.currentPlayer;
    var legal = limitMoves(sortMoves(generateLegalMoves(s, player, { fast: true, skipPawnDropMate: true }), s, player), depth);
    if (legal.length === 0) return isInCheck(s, player) ? (player === aiPlayer ? -999999 : 999999) : 0;
    if (depth <= 0) return quiescence(s, alpha, beta, aiPlayer, qDepth);
    if (maximizing) {
      var maxEval = -Infinity;
      for (var i = 0; i < legal.length; i++) {
        var copy = cloneState(s);
        applyMoveSilent(copy, legal[i]);
        var val = minimax(copy, depth - 1, alpha, beta, false, aiPlayer, qDepth, deadline);
        maxEval = Math.max(maxEval, val);
        alpha = Math.max(alpha, val);
        if (beta <= alpha) break;
      }
      return maxEval;
    }
    var minEval = Infinity;
    for (var j = 0; j < legal.length; j++) {
      var c = cloneState(s);
      applyMoveSilent(c, legal[j]);
      var score = minimax(c, depth - 1, alpha, beta, true, aiPlayer, qDepth, deadline);
      minEval = Math.min(minEval, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minEval;
  }

  function quiescence(s, alpha, beta, aiPlayer, depth) {
    var stand = evaluate(s, aiPlayer);
    if (depth <= 0) return stand;
    if (stand >= beta) return beta;
    if (alpha < stand) alpha = stand;
    var captures = sortMoves(generateLegalMoves(s, s.currentPlayer, { fast: true, skipPawnDropMate: true }), s, s.currentPlayer).filter(function (m) {
      return !m.drop && s.board[m.to.row][m.to.col];
    }).slice(0, 14);
    for (var i = 0; i < captures.length; i++) {
      var copy = cloneState(s);
      applyMoveSilent(copy, captures[i]);
      var score = evaluate(copy, aiPlayer);
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  function limitMoves(moves, depth) {
    if (depth >= 3) return moves.slice(0, 30);
    if (depth === 2) return moves.slice(0, 42);
    return moves;
  }

  function randomLegalMove(s, player) {
    var moves = generateLegalMoves(s, player, { fast: true, skipPawnDropMate: true });
    if (!moves.length) return null;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function evaluate(s, player) {
    var score = 0;
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      var p = s.board[r][c];
      if (!p) continue;
      var val = VALUES[p.type] + positionBonus(p, r, c);
      score += p.owner === player ? val : -val;
    }
    PLAYERS.forEach(function (owner) {
      TYPES.forEach(function (t) {
        var handVal = s.hands[owner][t] * Math.round(VALUES[t] * 0.85);
        score += owner === player ? handVal : -handVal;
      });
    });
    score += kingSafety(s, player) - kingSafety(s, opponent(player));
    return score;
  }

  function positionBonus(p, row, col) {
    var forward = p.owner === SENTE ? (8 - row) : row;
    var center = 4 - Math.abs(4 - col);
    if (p.type === "OU") return -forward * 8;
    return forward * 8 + center * 6 + (PROMOTE[p.type] ? 0 : 20);
  }

  function kingSafety(s, player) {
    var k = findKing(s, player);
    if (!k) return -9999;
    var score = 0;
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      var r = k.row + dr, c = k.col + dc;
      if (!inside(r, c)) continue;
      var p = s.board[r][c];
      if (p && p.owner === player) score += 28;
    }
    return score;
  }

  function sortMoves(moves, s, player) {
    return moves.slice().sort(function (a, b) { return moveScore(b, s, player) - moveScore(a, s, player); });
  }

  function moveScore(m, s) {
    var score = 0;
    if (!m.drop) {
      var captured = s.board[m.to.row][m.to.col];
      var moving = s.board[m.from.row][m.from.col];
      if (captured) score += VALUES[captured.type] * 10 - VALUES[moving.type];
      if (m.promote) score += 700;
    } else {
      score += VALUES[m.piece] * 0.4;
    }
    return score;
  }

  function renderAll() {
    renderBoard();
    renderHands();
    renderKifu();
    renderStatus();
    renderTimer();
  }

  function renderBoard() {
    els.board.innerHTML = "";
    var legalMap = {};
    if (settings.showLegalMoves) state.legalMoves.forEach(function (m) { legalMap[m.to.row + "," + m.to.col] = true; });
    var checkKing = isInCheck(state, state.currentPlayer) ? findKing(state, state.currentPlayer) : null;
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var sq = document.createElement("button");
        sq.type = "button";
        sq.className = "square";
        sq.dataset.row = r;
        sq.dataset.col = c;
        sq.setAttribute("aria-label", squareName(r, c));
        if (state.selectedSquare && state.selectedSquare.row === r && state.selectedSquare.col === c) sq.classList.add("selected");
        if (legalMap[r + "," + c]) sq.classList.add("legal");
        if (state.lastMove && state.lastMove.to.row === r && state.lastMove.to.col === c) sq.classList.add("last");
        if (checkKing && checkKing.row === r && checkKing.col === c) sq.classList.add("check");
        var p = state.board[r][c];
        if (p) sq.appendChild(pieceEl(p));
        if (settings.showCoordinates) {
          var coord = document.createElement("span");
          coord.className = "coord";
          coord.textContent = toFullWidth(9 - c) + toKanjiRank(r + 1);
          sq.appendChild(coord);
        }
        els.board.appendChild(sq);
      }
    }
    [[2, 2], [2, 6], [6, 2], [6, 6]].forEach(function (pos) {
      var star = document.createElement("span");
      star.className = "star";
      star.style.left = "calc(" + ((pos[1] + 1) / 9 * 100) + "% - 4px)";
      star.style.top = "calc(" + ((pos[0] + 1) / 9 * 100) + "% - 4px)";
      els.board.appendChild(star);
    });
  }

  function pieceEl(p) {
    var el = document.createElement("span");
    el.className = "piece " + (p.owner === GOTE ? "gote " : "") + (isPromoted(p.type) ? "promoted" : "");
    el.innerHTML = pieceLabel(p.type);
    return el;
  }

  function renderHands() {
    renderHand(SENTE, els.senteHand);
    renderHand(GOTE, els.goteHand);
  }

  function renderHand(owner, container) {
    container.innerHTML = "";
    TYPES.forEach(function (type) {
      var count = state.hands[owner][type];
      if (count <= 0) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hand-piece" + (owner === playerSide ? " selectable" : "") + (state.selectedHand === type && owner === playerSide ? " selected" : "");
      btn.dataset.owner = owner;
      btn.dataset.type = type;
      btn.innerHTML = pieceLabel(type) + (count > 1 ? "<span class=\"count-badge\">" + count + "</span>" : "");
      container.appendChild(btn);
    });
  }

  function renderKifu() {
    els.kifuList.innerHTML = "";
    state.history.slice(-50).forEach(function (m) {
      var li = document.createElement("li");
      li.textContent = m.kifu;
      els.kifuList.appendChild(li);
    });
    els.kifuList.scrollTop = els.kifuList.scrollHeight;
  }

  function renderStatus() {
    var side = state.currentPlayer === SENTE ? "先手" : "後手";
    var check = isInCheck(state, state.currentPlayer) ? " 王手" : "";
    els.turnLabel.textContent = state.phase === "GAME_OVER" ? "對局結束" : side + "回合" + check;
    els.undoBtn.disabled = !state || undoStack.length === 0 || state.phase === "AI";
  }

  function renderTimer() {
    els.timerPanel.classList.toggle("active", !!settings.timerEnabled);
    if (!state || !state.timers) return;
    els.senteTimer.textContent = formatTime(state.timers.SENTE);
    els.goteTimer.textContent = formatTime(state.timers.GOTE);
  }

  function startTimer() {
    stopTimer();
    if (!settings.timerEnabled || !state) return;
    timerId = window.setInterval(function () {
      if (!state || state.phase !== "PLAYING") return;
      state.timers[state.currentPlayer] -= 1;
      if (state.timers[state.currentPlayer] <= 0) {
        finishGame(opponent(state.currentPlayer), "時間切れ。");
      }
      renderTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function renderDifficultyCards() {
    els.difficultyGrid.innerHTML = "";
    Object.keys(DIFFICULTIES).forEach(function (key) {
      var d = DIFFICULTIES[key];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "difficulty-card" + (key === selectedDifficulty ? " selected" : "");
      btn.innerHTML = "<span>" + d.icon + "</span><strong>" + d.name + "</strong><p>" + d.desc + "</p>";
      btn.addEventListener("click", function () {
        selectedDifficulty = key;
        renderDifficultyCards();
        audio.play("select");
      });
      els.difficultyGrid.appendChild(btn);
    });
  }

  function loadSettingsForm() {
    var form = els.settingsForm;
    Object.keys(DEFAULT_SETTINGS).forEach(function (key) {
      if (!form.elements[key]) return;
      if (form.elements[key].type === "checkbox") form.elements[key].checked = !!settings[key];
      else form.elements[key].value = settings[key];
    });
    onSettingsInput();
  }

  function onSettingsInput() {
    els.musicOut.textContent = els.settingsForm.elements.musicVolume.value;
    els.sfxOut.textContent = els.settingsForm.elements.sfxVolume.value;
  }

  function readSettingsForm() {
    var form = els.settingsForm;
    settings = {
      aiDifficulty: settings.aiDifficulty || "MEDIUM",
      musicVolume: Number(form.elements.musicVolume.value),
      sfxVolume: Number(form.elements.sfxVolume.value),
      boardTheme: form.elements.boardTheme.value,
      showLegalMoves: form.elements.showLegalMoves.checked,
      showCoordinates: form.elements.showCoordinates.checked,
      animationSpeed: form.elements.animationSpeed.value,
      playerSide: form.elements.playerSide.value,
      timerEnabled: false,
      timerSeconds: 600
    };
    selectedDifficulty = settings.aiDifficulty;
  }

  function saveSettings() {
    localStorage.setItem("shogi_settings", JSON.stringify(settings));
  }

  function applySettingsTheme() {
    document.body.classList.toggle("light-theme", settings.boardTheme === "LIGHT_WOOD");
  }

  function saveGame() {
    if (!state) return;
    localStorage.setItem("shogi_save", JSON.stringify({ state: state, undoStack: undoStack.slice(-20), playerSide: playerSide }));
    updateContinueButton();
  }

  function updateContinueButton() {
    els.continueBtn.disabled = !localStorage.getItem("shogi_save");
  }

  function createAudioManager() {
    return {
      ctx: null, master: null, sfx: null, music: null, timer: null, musicMode: null, muted: false,
      ensure: function () {
        if (this.ctx) {
          if (this.ctx.state === "suspended") this.ctx.resume();
          return;
        }
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.sfx = this.ctx.createGain();
        this.music = this.ctx.createGain();
        this.sfx.connect(this.master);
        this.music.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.setVolumes(settings);
        if (this.ctx.state === "suspended") this.ctx.resume();
      },
      setVolumes: function (cfg) {
        if (!this.ctx) return;
        this.music.gain.value = this.muted ? 0 : cfg.musicVolume / 100 * .18;
        this.sfx.gain.value = cfg.sfxVolume / 100 * .55;
      },
      tone: function (freq, dur, type, dest, delay) {
        if (!this.ctx) return;
        var t = this.ctx.currentTime + (delay || 0);
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(.001, t);
        gain.gain.exponentialRampToValueAtTime(.8, t + .01);
        gain.gain.exponentialRampToValueAtTime(.001, t + dur);
        osc.connect(gain);
        gain.connect(dest || this.sfx);
        osc.start(t);
        osc.stop(t + dur + .02);
      },
      play: function (id) {
        this.ensure();
        if (!this.ctx) return;
        if (id === "drop") this.tone(420, .08, "sawtooth");
        else if (id === "capture") { this.tone(260, .10, "sawtooth"); this.tone(180, .13, "triangle", this.sfx, .04); }
        else if (id === "promote") { this.tone(440, .09); this.tone(660, .11, "sine", this.sfx, .08); this.tone(880, .13, "sine", this.sfx, .16); }
        else if (id === "check") { this.tone(180, .08, "square"); this.tone(360, .12, "square", this.sfx, .08); }
        else if (id === "win") [392, 523, 659, 784].forEach(function (f, i) { audio.tone(f, .18, "triangle", audio.sfx, i * .12); });
        else if (id === "lose") [392, 330, 262, 196].forEach(function (f, i) { audio.tone(f, .22, "triangle", audio.sfx, i * .16); });
        else if (id === "invalid") this.tone(110, .12, "square");
        else if (id === "undo") { this.tone(520, .08); this.tone(260, .10, "sine", this.sfx, .08); }
        else this.tone(id === "select" ? 640 : 740, .05, "sine");
      },
      startMenuMusic: function () {
        this.startMusicMode("menu");
      },
      startGameMusic: function () {
        this.startMusicMode("game");
      },
      startMusicMode: function (mode) {
        this.ensure();
        if (!this.ctx) return;
        if (this.musicMode === mode && this.timer) return;
        this.stopMusic();
        this.musicMode = mode;
        var scale = mode === "menu" ? [196, 246.94, 293.66, 329.63, 392] : [261.63, 293.66, 329.63, 392, 440];
        var interval = mode === "menu" ? 1850 : 1400;
        var self = this;
        this.timer = window.setInterval(function () {
          if (self.muted) return;
          var f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() > .72 ? 2 : 1);
          self.tone(f, mode === "menu" ? 1.6 : 1.2, mode === "menu" ? "sine" : "triangle", self.music);
          if (mode === "game" && Math.random() > .65) self.tone(98, .25, "sine", self.music, .18);
        }, interval);
      },
      stopMusic: function () {
        if (this.timer) window.clearInterval(this.timer);
        this.timer = null;
        this.musicMode = null;
      },
      toggleMusic: function () {
        this.ensure();
        this.muted = !this.muted;
        this.setVolumes(settings);
      }
    };
  }

  function applyMoveSilent(s, move) {
    var player = s.currentPlayer;
    if (move.drop) {
      s.hands[player][move.piece] -= 1;
      s.board[move.to.row][move.to.col] = piece(move.piece, player);
    } else {
      var moving = s.board[move.from.row][move.from.col];
      var captured = s.board[move.to.row][move.to.col];
      s.board[move.from.row][move.from.col] = null;
      if (captured) s.hands[player][baseType(captured.type)] += 1;
      s.board[move.to.row][move.to.col] = piece(move.promote ? PROMOTE[moving.type] : moving.type, player);
    }
    s.currentPlayer = opponent(player);
    s.moveCount += 1;
  }

  function canPromoteType(type) { return !!PROMOTE[type]; }
  function isPromoted(type) { return !!DEMOTE[type]; }
  function baseType(type) { return DEMOTE[type] || type; }
  function promotionZone(owner, row) { return owner === SENTE ? row <= 2 : row >= 6; }
  function canPromoteMove(owner, fromRow, toRow) { return promotionZone(owner, fromRow) || promotionZone(owner, toRow); }
  function mustPromote(owner, type, toRow) {
    if (type === "FU" || type === "KY") return owner === SENTE ? toRow === 0 : toRow === 8;
    if (type === "KE") return owner === SENTE ? toRow <= 1 : toRow >= 7;
    return false;
  }
  function canDropOn(owner, type, row) {
    if (type === "FU" || type === "KY") return owner === SENTE ? row > 0 : row < 8;
    if (type === "KE") return owner === SENTE ? row > 1 : row < 7;
    return true;
  }
  function hasUnpromotedPawnOnFile(s, owner, col) {
    for (var r = 0; r < 9; r++) {
      var p = s.board[r][col];
      if (p && p.owner === owner && p.type === "FU") return true;
    }
    return false;
  }
  function inside(r, c) { return r >= 0 && r < 9 && c >= 0 && c < 9; }
  function opponent(player) { return player === SENTE ? GOTE : SENTE; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function getAiThinkMs() {
    var difficulty = DIFFICULTIES[settings.aiDifficulty] || DIFFICULTIES.MEDIUM;
    var min = difficulty.thinkMin;
    var max = difficulty.thinkMax;
    return Math.round((min + Math.random() * (max - min)) * 1000);
  }
  function cloneState(obj) { return JSON.parse(JSON.stringify(obj)); }
  function loadJson(key, fallback) {
    try {
      var parsed = JSON.parse(localStorage.getItem(key) || "null");
      if (fallback === null) return parsed;
      return Object.assign({}, fallback, parsed || {});
    }
    catch (e) { return fallback; }
  }

  function normalizeSettings(raw) {
    var normalized = Object.assign({}, DEFAULT_SETTINGS, raw || {});
    normalized.playerSide = normalized.playerSide === GOTE ? GOTE : SENTE;
    normalized.timerEnabled = false;
    normalized.timerSeconds = 600;
    delete normalized.aiThinkSeconds;
    return normalized;
  }

  function pieceLabel(type) {
    var parts = LABELS[type] || [type, type];
    return escapeHtml(parts[0]) + (parts[1] !== parts[0] ? "<span class=\"sub\">" + escapeHtml(parts[1]) + "</span>" : "");
  }
  function squareName(row, col) { return toFullWidth(9 - col) + toKanjiRank(row + 1); }
  function toKifu(num, move, player, type) {
    var prefix = "第" + num + "手  ";
    if (move.drop) return prefix + squareName(move.to.row, move.to.col) + LABELS[move.piece][0] + "打";
    return prefix + squareName(move.to.row, move.to.col) + LABELS[move.promote ? PROMOTE[type] : type][0] + (move.promote ? "成" : "");
  }
  function toFullWidth(n) { return "０１２３４５６７８９".charAt(n); }
  function toKanjiRank(n) { return " 一二三四五六七八九".charAt(n); }
  function formatTime(sec) {
    sec = Math.max(0, sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }
  function modal(html) {
    els.modalRoot.innerHTML = "<div class=\"modal\">" + html + "</div>";
    els.modalRoot.classList.remove("hidden");
  }
  function closeModal() {
    els.modalRoot.classList.add("hidden");
    els.modalRoot.innerHTML = "";
  }
  function confirmDialog(text, onYes) {
    modal("<h3>確認</h3><p>" + escapeHtml(text) + "</p><div class=\"modal-actions\"><button class=\"primary\" id=\"yesBtn\">確定</button><button id=\"noBtn\">取消</button></div>");
    document.getElementById("yesBtn").onclick = function () { closeModal(); onYes(); };
    document.getElementById("noBtn").onclick = closeModal;
  }
  function promotionDialog(done) {
    state.phase = "PROMOTION_DIALOG";
    modal("<h3>升變？</h3><div class=\"modal-actions\"><button class=\"primary\" id=\"promoteYes\">升變</button><button id=\"promoteNo\">不升變</button></div>");
    document.getElementById("promoteYes").onclick = function () { closeModal(); state.phase = "PLAYING"; done(true); };
    document.getElementById("promoteNo").onclick = function () { closeModal(); state.phase = "PLAYING"; done(false); };
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[ch];
    });
  }
})();
