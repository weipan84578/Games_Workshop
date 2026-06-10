(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function buildBoard(initialStones) {
    var stones = Number(initialStones) || 4;
    return [stones, stones, stones, stones, stones, stones, 0, stones, stones, stones, stones, stones, stones, 0];
  }

  function GameState(options) {
    options = options || {};
    this.version = "1.0.0";
    this.initialStones = Number(options.initialStones) || 4;
    this.difficulty = options.difficulty || "normal";
    this.reset();
  }

  GameState.prototype.reset = function() {
    this.board = buildBoard(this.initialStones);
    this.currentTurn = "player";
    this.isGameOver = false;
    this.winner = null;
    this.gameTime = 0;
    this.moveCount = 0;
    this.isTimerRunning = false;
    this.isPaused = false;
    this.aiThinking = false;
    this.lastMoveIndex = null;
    this.lastMoveStones = null;
    this.lastMovePath = [];
    this.lastCapture = null;
  };

  GameState.prototype.toJSON = function() {
    return {
      version: this.version,
      timestamp: new Date().toISOString(),
      difficulty: this.difficulty,
      initialStones: this.initialStones,
      board: this.board.slice(),
      currentTurn: this.currentTurn,
      playerScore: this.board[6],
      aiScore: this.board[13],
      gameTime: this.gameTime,
      moveCount: this.moveCount,
      isGameOver: this.isGameOver,
      winner: this.winner
    };
  };

  GameState.prototype.clone = function() {
    var clone = new GameState({
      initialStones: this.initialStones,
      difficulty: this.difficulty
    });
    clone.board = this.board.slice();
    clone.currentTurn = this.currentTurn;
    clone.isGameOver = this.isGameOver;
    clone.winner = this.winner;
    clone.gameTime = this.gameTime;
    clone.moveCount = this.moveCount;
    clone.isTimerRunning = this.isTimerRunning;
    clone.isPaused = this.isPaused;
    clone.aiThinking = this.aiThinking;
    clone.lastMoveIndex = this.lastMoveIndex;
    clone.lastMoveStones = this.lastMoveStones;
    clone.lastMovePath = this.lastMovePath.slice();
    clone.lastCapture = this.lastCapture;
    return clone;
  };

  GameState.fromSave = function(saveData) {
    var state = new GameState({
      initialStones: saveData.initialStones || 4,
      difficulty: saveData.difficulty || "normal"
    });
    state.board = Array.isArray(saveData.board) && saveData.board.length === 14
      ? saveData.board.map(function(value) { return Number(value) || 0; })
      : buildBoard(state.initialStones);
    state.currentTurn = saveData.currentTurn === "ai" ? "ai" : "player";
    state.gameTime = Number(saveData.gameTime) || 0;
    state.moveCount = Number(saveData.moveCount) || 0;
    state.isGameOver = Boolean(saveData.isGameOver);
    state.winner = saveData.winner || null;
    state.isPaused = false;
    state.aiThinking = false;
    return state;
  };

  Mancala.GameState = GameState;
})(window);
