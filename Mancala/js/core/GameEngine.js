(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function GameEngine(state) {
    this.state = state;
  }

  GameEngine.prototype.makeMove = function(pitIndex) {
    var state = this.state;
    var validator = Mancala.MoveValidator;
    if (!validator.isValidMove(state, pitIndex, state.currentTurn)) {
      return {
        valid: false,
        reason: "invalid_move"
      };
    }

    var result = GameEngine.applyMove(state.board.slice(), state.currentTurn, Number(pitIndex));
    state.board = result.board.slice();
    state.currentTurn = result.nextTurn || state.currentTurn;
    state.isGameOver = result.gameOver;
    state.winner = result.winner;
    state.lastMoveIndex = Number(pitIndex);
    state.lastMoveStones = result.stonesCount;
    state.lastMovePath = result.path.slice();
    state.lastCapture = result.capture;
    state.moveCount += 1;

    return result;
  };

  GameEngine.applyMove = function(board, player, pitIndex) {
    var validator = Mancala.MoveValidator;
    var store = validator.getStoreForPlayer(player);
    var opponentStore = validator.getOpponentStore(player);
    var opponent = validator.getOpponent(player);
    var stones = board[pitIndex];
    var stonesCount = stones;
    var index = pitIndex;
    var path = [];
    var capture = null;

    board[pitIndex] = 0;

    while (stones > 0) {
      index = (index + 1) % 14;
      if (index === opponentStore) {
        continue;
      }
      board[index] += 1;
      path.push(index);
      stones -= 1;
    }

    var extraTurn = index === store;

    if (!extraTurn && validator.isOwnPit(player, index) && board[index] === 1) {
      var opposite = validator.getOppositePit(index);
      if (board[opposite] > 0) {
        var capturedCount = board[opposite] + board[index];
        board[store] += capturedCount;
        board[opposite] = 0;
        board[index] = 0;
        capture = {
          player: player,
          pit: index,
          oppositePit: opposite,
          capturedCount: capturedCount
        };
      }
    }

    var gameOver = validator.sideIsEmpty(board, "player") || validator.sideIsEmpty(board, "ai");
    var winner = null;

    if (gameOver) {
      collectRemaining(board, "player");
      collectRemaining(board, "ai");
      extraTurn = false;
      winner = board[6] > board[13] ? "player" : board[13] > board[6] ? "ai" : "draw";
    }

    return {
      valid: true,
      player: player,
      pitIndex: pitIndex,
      stonesCount: stonesCount,
      board: board,
      lastIndex: index,
      path: path,
      capture: capture,
      extraTurn: extraTurn,
      nextTurn: gameOver ? null : (extraTurn ? player : opponent),
      gameOver: gameOver,
      winner: winner
    };
  };

  GameEngine.previewMove = function(stateOrBoard, player, pitIndex) {
    var board = Array.isArray(stateOrBoard) ? stateOrBoard.slice() : stateOrBoard.board.slice();
    return GameEngine.applyMove(board, player, pitIndex);
  };

  function collectRemaining(board, player) {
    var validator = Mancala.MoveValidator;
    var store = validator.getStoreForPlayer(player);
    validator.getPitsForPlayer(player).forEach(function(index) {
      board[store] += board[index];
      board[index] = 0;
    });
  }

  Mancala.GameEngine = GameEngine;
})(window);
