(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function makeOpeningRoll() {
    let player = 0;
    let ai = 0;
    do {
      player = BG.Dice.rollOne();
      ai = BG.Dice.rollOne();
    } while (player === ai);
    return { player, ai };
  }

  BG.GameState = {
    settings: null,
    game: null,

    createNewGame(difficulty) {
      const opening = makeOpeningRoll();
      const currentPlayer = opening.player > opening.ai ? BG.PLAYER.HUMAN : BG.PLAYER.AI;
      this.game = {
        board: BG.Board.createInitialBoard(),
        currentPlayer,
        dice: [opening.player, opening.ai].sort((a, b) => b - a),
        phase: "move",
        difficulty: difficulty || this.settings.difficulty,
        moveHistory: [],
        turn: 1,
        selectedPoint: null,
        legalTargets: [],
        message: BG.I18n.t("game.opening_result", opening),
        lastRoll: opening,
        isOver: false,
        winner: null,
        winType: null,
        pendingAi: false,
      };
      return this.game;
    },

    snapshot() {
      return JSON.parse(JSON.stringify(this.game));
    },

    restore(snapshot) {
      this.game = JSON.parse(JSON.stringify(snapshot));
      return this.game;
    },

    clearSelection() {
      if (!this.game) return;
      this.game.selectedPoint = null;
      this.game.legalTargets = [];
    },
  };
})(window);
