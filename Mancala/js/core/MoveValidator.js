(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};
  var PLAYER_PITS = [0, 1, 2, 3, 4, 5];
  var AI_PITS = [7, 8, 9, 10, 11, 12];

  function includes(list, value) {
    return list.indexOf(value) !== -1;
  }

  var MoveValidator = {
    PLAYER_PITS: PLAYER_PITS,
    AI_PITS: AI_PITS,

    getPitsForPlayer: function(player) {
      return player === "ai" ? AI_PITS.slice() : PLAYER_PITS.slice();
    },

    getStoreForPlayer: function(player) {
      return player === "ai" ? 13 : 6;
    },

    getOpponentStore: function(player) {
      return player === "ai" ? 6 : 13;
    },

    getOpponent: function(player) {
      return player === "ai" ? "player" : "ai";
    },

    isPlayerPit: function(index) {
      return includes(PLAYER_PITS, Number(index));
    },

    isAiPit: function(index) {
      return includes(AI_PITS, Number(index));
    },

    isOwnPit: function(player, index) {
      return player === "ai" ? this.isAiPit(index) : this.isPlayerPit(index);
    },

    getOppositePit: function(index) {
      return 12 - Number(index);
    },

    isValidMove: function(state, pitIndex, player) {
      if (!state || state.isGameOver || state.isPaused) {
        return false;
      }
      var activePlayer = player || state.currentTurn;
      var index = Number(pitIndex);
      return state.currentTurn === activePlayer &&
        this.isOwnPit(activePlayer, index) &&
        state.board[index] > 0;
    },

    getValidMoves: function(state, player) {
      if (!state || state.isGameOver) {
        return [];
      }
      var activePlayer = player || state.currentTurn;
      var board = Array.isArray(state.board) ? state.board : state;
      return this.getPitsForPlayer(activePlayer).filter(function(index) {
        return board[index] > 0;
      });
    },

    sideIsEmpty: function(board, player) {
      return this.getPitsForPlayer(player).reduce(function(total, index) {
        return total + board[index];
      }, 0) === 0;
    },

    sumSide: function(board, player) {
      return this.getPitsForPlayer(player).reduce(function(total, index) {
        return total + board[index];
      }, 0);
    }
  };

  Mancala.MoveValidator = MoveValidator;
})(window);
