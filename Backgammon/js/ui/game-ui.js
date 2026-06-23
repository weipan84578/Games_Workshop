(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function currentGame() {
    return BG.GameState.game;
  }

  function colorForTurn(game) {
    return BG.colorForOwner(game.currentPlayer);
  }

  function barCount(game, color) {
    return game.board.bar[BG.ownerForColor(color)];
  }

  function countRemaining(board, color) {
    const owner = BG.ownerForColor(color);
    return board.totalPieces - board.home[owner];
  }

  function formatDice(dice) {
    return dice && dice.length ? dice.join(" ") : "--";
  }

  function isPlayerTurn(game) {
    return game && game.currentPlayer === BG.PLAYER.HUMAN && !game.isOver;
  }

  function moveWouldHit(game, move) {
    const target = game.board.points[move.to];
    return move.to >= 1 && move.to <= 24 && target.color === BG.COLOR.PLAYER && target.count === 1;
  }

  function moveIsBearOff(move) {
    return move.to === 0 || move.to === 25;
  }

  function setButtonState(id, enabled) {
    const element = document.getElementById(id);
    if (element) element.disabled = !enabled;
  }

  function endTurnInternal(auto) {
    const game = currentGame();
    if (!game || game.isOver) return;
    const color = colorForTurn(game);
    if (!auto && game.phase === "move" && game.dice.length && BG.Rules.hasAnyLegalMove(game.board, color, game.dice)) {
      game.message = BG.I18n.t("game.choose_piece");
      BG.GameUI.render();
      return;
    }

    BG.GameState.clearSelection();
    game.dice = [];
    game.moveHistory = [];
    game.currentPlayer = BG.opponentOwner(game.currentPlayer);
    if (game.currentPlayer === BG.PLAYER.HUMAN) game.turn += 1;
    game.phase = "roll";
    game.message = game.currentPlayer === BG.PLAYER.HUMAN ? BG.I18n.t("game.your_turn") : BG.I18n.t("game.ai_turn");
    BG.Storage.saveGame(game, BG.GameState.settings);
    BG.GameUI.render();
    if (game.currentPlayer === BG.PLAYER.AI) BG.GameUI.beginAiTurn();
    else BG.AudioEngine.playSfx("turn_start");
  }

  function applyMove(game, move, recordHistory) {
    const color = colorForTurn(game);
    const hit = move.to >= 1 && move.to <= 24 && game.board.points[move.to].color === BG.opponentColor(color) && game.board.points[move.to].count === 1;
    if (recordHistory) {
      BG.Pieces.move(game, move);
    } else {
      game.board = BG.Rules.applyMove(game.board, move.from, move.to, color, move.die);
      game.dice = BG.Dice.consume(game.dice, move.die);
      const result = BG.Rules.checkGameOver(game.board);
      if (result.isOver) {
        game.isOver = true;
        game.phase = "over";
        game.winner = result.winner;
        game.winType = result.type;
      }
    }
    if (moveIsBearOff(move)) BG.AudioEngine.playSfx("bear_off");
    else if (hit) BG.AudioEngine.playSfx("piece_hit");
    else BG.AudioEngine.playSfx("piece_move");
  }

  function allowedMovesForSelection(game, point) {
    const moves = BG.Rules.getAllowedMoves(game.board, BG.COLOR.PLAYER, game.dice);
    return moves.filter((move) => move.from === point);
  }

  function refreshSelection(game, point) {
    game.selectedPoint = point;
    game.legalTargets = allowedMovesForSelection(game, point).map((move) => move.to);
  }

  BG.GameUI = {
    init() {
      this.canvas = document.getElementById("gameCanvas");
      this.diceCanvas = document.getElementById("diceCanvas");

      this.canvas.addEventListener("click", (event) => this.handleBoardClick(event));
      this.canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        this.handleBoardClick(touch);
      }, { passive: false });

      document.getElementById("rollDiceBtn").addEventListener("click", () => this.rollDice());
      document.getElementById("endTurnBtn").addEventListener("click", () => endTurnInternal(false));
      document.getElementById("undoBtn").addEventListener("click", () => this.undo());
      document.getElementById("bearOffBtn").addEventListener("click", () => this.bearOffSelected());
      document.getElementById("backToMenuBtn").addEventListener("click", () => {
        if (currentGame()) BG.Storage.saveGame(currentGame(), BG.GameState.settings);
        BG.MenuUI.refreshContinue();
        BG.App.showScreen("menu");
      });
      document.getElementById("quickSettingsBtn").addEventListener("click", () => BG.SettingsUI.open());
      document.getElementById("soundToggleBtn").addEventListener("click", () => {
        const settings = BG.GameState.settings;
        settings.soundEnabled = !settings.soundEnabled;
        BG.AudioEngine.setEnabled(settings.soundEnabled);
        BG.Storage.saveSettings(settings);
        this.render();
      });

      global.addEventListener("resize", () => this.render());
    },

    startNewGame(difficulty) {
      BG.GameState.settings.difficulty = difficulty;
      BG.Storage.saveSettings(BG.GameState.settings);
      BG.GameState.createNewGame(difficulty);
      BG.App.showScreen("game");
      BG.Storage.saveGame(currentGame(), BG.GameState.settings);
      this.render();
      if (currentGame().currentPlayer === BG.PLAYER.AI) this.beginAiTurn();
    },

    continueGame() {
      const save = BG.Storage.loadGame();
      if (!save) {
        BG.MenuUI.refreshContinue();
        return;
      }
      BG.GameState.settings = { ...BG.Storage.DEFAULT_SETTINGS, ...save.settings, ...BG.GameState.settings };
      BG.GameState.game = save.gameState;
      BG.GameState.game.pendingAi = false;
      BG.App.showScreen("game");
      BG.Theme.apply(BG.GameState.settings.theme);
      BG.I18n.load(BG.GameState.settings.language).then(() => {
        this.render();
        if (currentGame().currentPlayer === BG.PLAYER.AI) this.beginAiTurn();
      });
    },

    setMessage(message) {
      const game = currentGame();
      if (game) {
        game.message = message;
        this.render();
      }
    },

    render() {
      const game = currentGame();
      if (!this.canvas || !game) return;
      BG.CanvasBoard.render(this.canvas, game);
      BG.CanvasDice.render(this.diceCanvas, game.dice);

      document.getElementById("turnLabel").textContent = game.currentPlayer === BG.PLAYER.HUMAN ? BG.I18n.t("game.your_turn") : BG.I18n.t("game.ai_turn");
      document.getElementById("phaseLabel").textContent = BG.I18n.t(`game.${game.phase}`) || game.phase;
      document.getElementById("messageLabel").textContent = game.message || "";
      document.getElementById("diceText").textContent = `${BG.I18n.t("game.use_dice")}: ${formatDice(game.dice)}`;
      document.getElementById("moveNote").textContent = game.selectedPoint ? BG.I18n.t("game.choose_target") : BG.I18n.t("game.choose_piece");

      document.getElementById("playerPiecesLabel").textContent = countRemaining(game.board, BG.COLOR.PLAYER);
      document.getElementById("aiPiecesLabel").textContent = countRemaining(game.board, BG.COLOR.AI);
      document.getElementById("playerBarLabel").textContent = `BAR: ${game.board.bar.player}`;
      document.getElementById("aiBarLabel").textContent = `BAR: ${game.board.bar.ai}`;
      document.getElementById("playerHomeLabel").textContent = `HOME: ${game.board.home.player}`;
      document.getElementById("aiHomeLabel").textContent = `HOME: ${game.board.home.ai}`;

      const playerCanAct = isPlayerTurn(game);
      const canRoll = playerCanAct && game.phase === "roll";
      const canMove = playerCanAct && game.phase === "move";
      setButtonState("rollDiceBtn", canRoll);
      setButtonState("undoBtn", canMove && game.moveHistory.length > 0);
      setButtonState("endTurnBtn", playerCanAct);
      setButtonState("bearOffBtn", canMove && game.legalTargets.includes(0));
      document.getElementById("soundToggleBtn").textContent = BG.GameState.settings.soundEnabled === false ? "∅" : "♪";
    },

    rollDice() {
      const game = currentGame();
      if (!isPlayerTurn(game) || game.phase !== "roll") return;
      BG.AudioEngine.unlock(BG.GameState.settings);
      BG.AudioEngine.playSfx("dice_roll");
      game.dice = BG.Dice.rollTurn();
      game.phase = "move";
      game.message = game.dice.length === 4 ? BG.I18n.t("game.double") : BG.I18n.t("game.choose_piece");
      BG.GameState.clearSelection();
      BG.AudioEngine.playSfx(game.dice.length === 4 ? "double" : "dice_land");
      this.afterMoveOrRoll();
    },

    afterMoveOrRoll() {
      const game = currentGame();
      if (!game || game.isOver) {
        this.finishGame();
        return;
      }
      const color = colorForTurn(game);
      if (!game.dice.length) {
        BG.Storage.saveGame(game, BG.GameState.settings);
        this.render();
        global.setTimeout(() => endTurnInternal(true), 520);
        return;
      }
      if (!BG.Rules.hasAnyLegalMove(game.board, color, game.dice)) {
        game.message = BG.I18n.t("game.no_moves");
        BG.AudioEngine.playSfx("no_moves");
        BG.Storage.saveGame(game, BG.GameState.settings);
        this.render();
        global.setTimeout(() => endTurnInternal(true), 900);
        return;
      }
      BG.Storage.saveGame(game, BG.GameState.settings);
      this.render();
    },

    handleBoardClick(event) {
      const game = currentGame();
      if (!isPlayerTurn(game) || game.phase !== "move") return;
      const hit = BG.CanvasBoard.hitTest(this.canvas, event.clientX, event.clientY);
      if (hit === null) return;

      const playerBar = barCount(game, BG.COLOR.PLAYER);
      if (playerBar > 0) {
        if (!game.selectedPoint) refreshSelection(game, BG.BAR_POINT[BG.COLOR.PLAYER]);
        const move = allowedMovesForSelection(game, BG.BAR_POINT[BG.COLOR.PLAYER]).find((item) => item.to === hit);
        if (move) {
          this.commitPlayerMove(move);
          return;
        }
        game.message = BG.I18n.t("game.bar_first");
        this.render();
        return;
      }

      if (game.selectedPoint && game.legalTargets.includes(hit)) {
        const move = allowedMovesForSelection(game, game.selectedPoint).find((item) => item.to === hit);
        if (move) {
          this.commitPlayerMove(move);
          return;
        }
      }

      if (hit >= 1 && hit <= 24 && game.board.points[hit].color === BG.COLOR.PLAYER) {
        const moves = allowedMovesForSelection(game, hit);
        if (moves.length) {
          refreshSelection(game, hit);
          game.message = BG.I18n.t("game.choose_target");
        } else {
          BG.GameState.clearSelection();
          game.message = BG.I18n.t("game.invalid");
        }
      } else {
        BG.GameState.clearSelection();
      }
      this.render();
    },

    commitPlayerMove(move) {
      const game = currentGame();
      try {
        applyMove(game, move, true);
      } catch (error) {
        game.message = BG.I18n.t("game.invalid");
        this.render();
        return;
      }
      BG.Animations.flashCanvas(this.canvas);
      if (game.isOver) {
        this.finishGame();
        return;
      }
      game.message = game.dice.length ? BG.I18n.t("game.choose_piece") : "";
      this.afterMoveOrRoll();
    },

    bearOffSelected() {
      const game = currentGame();
      if (!isPlayerTurn(game) || game.phase !== "move") return;
      let selected = game.selectedPoint;
      if (!selected) {
        const candidate = BG.Rules.getAllowedMoves(game.board, BG.COLOR.PLAYER, game.dice).find((move) => move.to === 0);
        if (candidate) selected = candidate.from;
      }
      const move = allowedMovesForSelection(game, selected).find((item) => item.to === 0);
      if (move) this.commitPlayerMove(move);
    },

    undo() {
      const game = currentGame();
      if (!isPlayerTurn(game) || !game.moveHistory.length) return;
      BG.Pieces.undo(game);
      BG.Storage.saveGame(game, BG.GameState.settings);
      this.render();
    },

    async beginAiTurn() {
      const game = currentGame();
      if (!game || game.pendingAi || game.currentPlayer !== BG.PLAYER.AI || game.isOver) return;
      game.pendingAi = true;
      game.message = BG.I18n.t("game.waiting_ai");
      this.render();
      await BG.Animations.delay(BG.Animations.speedDelay(BG.GameState.settings));

      if (game.phase === "roll") {
        BG.AudioEngine.playSfx("dice_roll");
        game.dice = BG.Dice.rollTurn();
        game.phase = "move";
        game.message = game.dice.length === 4 ? BG.I18n.t("game.double") : BG.I18n.t("game.waiting_ai");
        BG.AudioEngine.playSfx(game.dice.length === 4 ? "double" : "dice_land");
        this.render();
        await BG.Animations.delay(340);
      }

      if (!BG.Rules.hasAnyLegalMove(game.board, BG.COLOR.AI, game.dice)) {
        game.message = BG.I18n.t("game.no_moves");
        BG.AudioEngine.playSfx("no_moves");
        game.pendingAi = false;
        this.render();
        await BG.Animations.delay(760);
        endTurnInternal(true);
        return;
      }

      const moves = BG.AiManager.computeMoves(game.board, game.dice, game.difficulty);
      for (const move of moves) {
        if (game.isOver) break;
        try {
          applyMove(game, move, false);
        } catch (error) {
          break;
        }
        game.message = `${move.from === 0 ? "BAR" : move.from} → ${move.to === 25 ? "HOME" : move.to}`;
        BG.Animations.flashCanvas(this.canvas);
        this.render();
        await BG.Animations.delay(BG.Animations.speedDelay(BG.GameState.settings));
      }

      game.pendingAi = false;
      if (game.isOver) {
        this.finishGame();
      } else {
        endTurnInternal(true);
      }
    },

    finishGame() {
      const game = currentGame();
      if (!game) return;
      BG.Storage.clearGame();
      BG.MenuUI.refreshContinue();
      this.render();
      BG.AudioEngine.playSfx(game.winner === BG.PLAYER.HUMAN ? "win" : "lose");
      BG.Modal.showResult(game, () => this.startNewGame(BG.GameState.settings.difficulty), () => BG.App.showScreen("menu"));
    },
  };
})(window);
