/* turn.js — 回合管理與遊戲流程控制器(狀態機核心)。
   串接擲骰、合法步、移動動畫、吃子、勝負、額外回合。 */
(function (L) {
  'use strict';

  var TURN = L.engine.turn;
  var PHASE = L.state.PHASE;

  function g() { return L.state.game; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function aiDelay() {
    var c = L.config;
    return c.AI_DELAY_MIN + Math.random() * (c.AI_DELAY_MAX - c.AI_DELAY_MIN);
  }

  var busy = false;          // 動畫/AI 進行中,擋住輸入
  var pendingMoves = [];     // 目前可選的合法步(供人類點棋)

  TURN.isBusy = function () { return busy; };
  TURN.getPendingMoves = function () { return pendingMoves; };

  // ---- 開始整場對局 ----
  TURN.start = function () {
    busy = false;
    pendingMoves = [];
    L.ui.renderBoard.draw();
    L.ui.renderTokens.draw();
    L.ui.hud.update();
    beginTurn();
  };

  // ---- 從 localStorage 還原穩定狀態 ----
  TURN.resume = function () {
    var game = g();
    if (!game) return;
    busy = false;
    pendingMoves = [];
    L.ui.renderBoard.draw();
    L.ui.renderTokens.draw();
    L.ui.hud.update();

    if (game.phase === PHASE.GAME_OVER) {
      return endGame();
    }

    if (game.phase === PHASE.AWAIT_MOVE && game.dice.rolled && game.dice.value) {
      return resumeAwaitMove(game.dice.value);
    }

    if ((game.phase === PHASE.ROLL || game.phase === PHASE.TURN_START) && !game.dice.rolled) {
      return resumeRollPhase();
    }

    if (game.dice.rolled && game.dice.value) {
      return resolveAfterRoll(game.dice.value);
    }

    beginTurn();
  };

  // ---- 開始一個玩家的回合 ----
  function beginTurn() {
    var game = g();
    game.phase = PHASE.TURN_START;
    game.dice.value = 0;
    game.dice.rolled = false;
    pendingMoves = [];
    L.ui.renderTokens.clearHighlights();
    L.ui.hud.update();
    L.audio.playSfx('sfx_turn_start');

    if (L.state.isHumanTurn()) {
      game.phase = PHASE.ROLL;
      L.ui.hud.setRollEnabled(true);
      L.ui.hud.prompt('輪到你了 — 擲骰子');
      L.storage.saveGame();
    } else {
      L.ui.hud.setRollEnabled(false);
      L.ui.hud.prompt(colorName(game.currentPlayer) + ' (AI) 思考中…');
      L.storage.saveGame();
      busy = true;
      wait(aiDelay()).then(function () { busy = false; doRoll(); });
    }
  }

  function resumeRollPhase() {
    var game = g();
    pendingMoves = [];
    L.ui.renderTokens.clearHighlights();
    L.ui.hud.update();

    if (L.state.isHumanTurn()) {
      game.phase = PHASE.ROLL;
      L.ui.hud.setRollEnabled(true);
      L.ui.hud.prompt('輪到你了 — 擲骰子');
      busy = false;
    } else {
      game.phase = PHASE.ROLL;
      L.ui.hud.setRollEnabled(false);
      L.ui.hud.prompt(colorName(game.currentPlayer) + ' (AI) 思考中…');
      busy = true;
      wait(aiDelay()).then(function () { busy = false; doRoll(); });
    }
    L.storage.saveGame();
  }

  function resumeAwaitMove(value) {
    var game = g();
    game.phase = PHASE.AWAIT_MOVE;
    game.dice.value = value;
    game.dice.rolled = true;
    pendingMoves = L.engine.rules.getLegalMoves(game.currentPlayer, value);

    if (!pendingMoves.length) {
      return resolveAfterRoll(value);
    }

    L.ui.hud.setRollEnabled(false);
    L.ui.hud.update();

    if (L.state.isHumanTurn()) {
      L.ui.renderTokens.highlightMovable(pendingMoves);
      L.ui.hud.prompt('選擇要移動的棋子');
      busy = false;
    } else {
      L.ui.renderTokens.clearHighlights();
      L.ui.hud.prompt(colorName(game.currentPlayer) + ' (AI) 思考中…');
      busy = true;
      wait(aiDelay()).then(function () {
        var choice = L.ai.chooseMove(game.currentPlayer, value, pendingMoves);
        busy = false;
        if (choice) TURN.selectToken(choice.tokenId, true);
      });
    }
    L.storage.saveGame();
  }

  function colorName(owner) {
    return L.config.COLOR_NAMES[L.config.COLORS[owner]];
  }

  // ---- 擲骰(人類按鈕或 AI 自動觸發) ----
  TURN.requestRoll = function () {
    var game = g();
    if (busy) return;
    if (game.phase !== PHASE.ROLL && game.phase !== PHASE.TURN_START) return;
    if (game.dice.rolled) return;
    if (!L.state.isHumanTurn()) return;
    doRoll();
  };

  function doRoll() {
    var game = g();
    busy = true;
    game.phase = PHASE.ROLL;
    L.ui.hud.setRollEnabled(false);
    var value = L.engine.dice.roll();
    L.audio.playSfx('sfx_dice_roll');

    L.ui.animations.rollDice(value).then(function () {
      L.audio.playSfx('sfx_dice_land');
      game.dice.value = value;
      game.dice.rolled = true;

      // 連三 6 作廢
      if (value === 6) {
        game.dice.sixStreak = (game.dice.sixStreak || 0) + 1;
        if (L.config.rules.threeSixForfeit && game.dice.sixStreak >= 3) {
          L.ui.hud.prompt('連續三次 6 — 本回合作廢!');
          L.audio.playSfx('sfx_illegal');
          return wait(900).then(function () { busy = false; nextPlayer(); });
        }
      } else {
        game.dice.sixStreak = 0;
      }

      L.ui.hud.update();
      return resolveAfterRoll(value);
    });
  }

  function resolveAfterRoll(value) {
    var game = g();
    game.phase = PHASE.RESOLVE;
    var moves = L.engine.rules.getLegalMoves(game.currentPlayer, value);

    if (moves.length === 0) {
      L.ui.hud.prompt('沒有可走的棋 — 跳過');
      L.audio.playSfx('sfx_illegal');
      return wait(800).then(function () {
        busy = false;
        // 擲到 6 但無步可走亦不給額外回合
        nextPlayer();
      });
    }

    pendingMoves = moves;

    if (L.state.isHumanTurn()) {
      game.phase = PHASE.AWAIT_MOVE;
      L.ui.renderTokens.highlightMovable(moves);
      L.ui.hud.prompt('選擇要移動的棋子');
      busy = false;
      L.storage.saveGame();
      // 僅一步可走時自動執行,降低操作負擔
      if (moves.length === 1) {
        busy = true;
        wait(450).then(function () { busy = false; TURN.selectToken(moves[0].tokenId); });
      }
      return Promise.resolve();
    }

    // AI 選步
    game.phase = PHASE.AWAIT_MOVE;
    L.storage.saveGame();
    return wait(aiDelay()).then(function () {
      var choice = L.ai.chooseMove(game.currentPlayer, value, moves);
      busy = false;
      TURN.selectToken(choice.tokenId, true);
    });
  }

  // ---- 人類點棋 / AI 選定 ----
  TURN.selectToken = function (tokenId, fromAI) {
    var game = g();
    if (busy && !fromAI) return;
    if (game.phase !== PHASE.AWAIT_MOVE) return;
    var move = findMove(tokenId);
    if (!move) { L.audio.playSfx('sfx_illegal'); return; }
    doMove(move);
  };

  function findMove(tokenId) {
    for (var i = 0; i < pendingMoves.length; i++)
      if (pendingMoves[i].tokenId === tokenId) return pendingMoves[i];
    return null;
  }

  function doMove(move) {
    var game = g();
    busy = true;
    pendingMoves = [];
    game.phase = PHASE.MOVE_ANIMATE;
    L.ui.renderTokens.clearHighlights();
    var tk = L.state.getToken(move.tokenId);

    L.audio.playSfx('sfx_select_token');
    if (move.fromYard) L.audio.playSfx('sfx_unlock_token');

    var coords = L.engine.board.pathCoords(tk.owner, move.fromRel, move.toRel, move.fromYard);

    L.ui.animations.moveToken(tk.id, coords, move.fromYard).then(function () {
      // 套用資料
      L.engine.token.apply(tk, move);

      if (move.finishes) L.audio.playSfx('sfx_token_home');
      else if (move.entersHome) L.audio.playSfx('sfx_token_move');
      else if (L.engine.board.isSafeAbs(L.engine.board.relToAbs(tk.owner, tk.rel)))
        L.audio.playSfx('sfx_safe_cell');

      // 處理吃子
      var captured = move.capturesIds || [];
      var capPromises = [];
      if (captured.length) {
        L.audio.playSfx('sfx_capture');
        L.ui.hud.prompt('吃掉了對手棋子!');
        for (var i = 0; i < captured.length; i++) {
          var victim = L.state.getToken(captured[i]);
          L.engine.token.sendHome(victim);
          capPromises.push(L.ui.animations.sendHome(victim.id));
        }
      }

      return Promise.all(capPromises).then(function () {
        L.ui.renderTokens.draw(); // 重新整理疊放偏移
        L.ui.hud.update();
        afterMove(move, captured.length > 0);
      });
    });
  }

  function afterMove(move, didCapture) {
    var game = g();

    // 勝負判定
    if (L.state.finishedCount(game.currentPlayer) === 4) {
      if (game.ranking.indexOf(game.currentPlayer) < 0) game.ranking.push(game.currentPlayer);
      game.winner = game.currentPlayer;
      game.phase = PHASE.GAME_OVER;
      L.storage.clearSave();
      busy = false;
      return endGame();
    }

    // 額外回合:擲到 6 / 吃子(規則開啟) / 棋子進終點
    var extra = (game.dice.value === 6) ||
                (didCapture && L.config.rules.captureBonusRoll) ||
                move.finishes;

    L.storage.saveGame();

    if (extra) {
      if (didCapture) L.audio.playSfx('sfx_six_bonus');
      else if (game.dice.value === 6) L.audio.playSfx('sfx_six_bonus');
      rollAgain();
    } else {
      nextPlayer();
    }
  }

  // 同一玩家再擲一次(保留 sixStreak)
  function rollAgain() {
    var game = g();
    game.dice.rolled = false;
    game.dice.value = 0;
    pendingMoves = [];
    L.ui.hud.update();

    if (L.state.isHumanTurn()) {
      game.phase = PHASE.ROLL;
      L.ui.hud.setRollEnabled(true);
      L.ui.hud.prompt('額外回合 — 再擲一次!');
      busy = false;
    } else {
      game.phase = PHASE.ROLL;
      L.ui.hud.prompt(colorName(game.currentPlayer) + ' (AI) 再擲一次…');
      busy = true;
      wait(aiDelay()).then(function () { busy = false; doRoll(); });
    }
    L.storage.saveGame();
  }

  function nextPlayer() {
    var game = g();
    game.dice.sixStreak = 0;
    do {
      game.turnPtr = (game.turnPtr + 1) % game.order.length;
      game.currentPlayer = game.order[game.turnPtr];
    } while (L.state.finishedCount(game.currentPlayer) === 4 && !allButOneDone(game));
    L.storage.saveGame();
    busy = false;
    beginTurn();
  }

  function allButOneDone(game) {
    var active = 0;
    for (var i = 0; i < game.order.length; i++)
      if (L.state.finishedCount(game.order[i]) < 4) active++;
    return active <= 1;
  }

  function endGame() {
    var humanWon = g().winner === g().humanColor;
    L.audio.playSfx(humanWon ? 'sfx_win' : 'sfx_lose');
    L.ui.hud.update();
    L.ui.showResult(g().winner);
  }

  TURN.beginTurn = beginTurn;
})(window.Ludo);
