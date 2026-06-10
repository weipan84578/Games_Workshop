(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AIController(difficulty) {
    this.setDifficulty(difficulty || "normal");
  }

  AIController.prototype.setDifficulty = function(difficulty) {
    this.difficulty = difficulty || "normal";
    if (this.difficulty === "easy") {
      this.strategy = new Mancala.AIEasy();
    } else if (this.difficulty === "hard") {
      this.strategy = new Mancala.AIHard({ depth: 7 });
    } else {
      this.strategy = new Mancala.AINormal();
    }
  };

  AIController.prototype.getMove = function(gameState) {
    return this.strategy.getMove(gameState);
  };

  AIController.prototype.getThinkingDelay = function() {
    if (this.difficulty === "easy") {
      return randomBetween(300, 650);
    }
    if (this.difficulty === "hard") {
      return randomBetween(420, 980);
    }
    return randomBetween(320, 780);
  };

  function randomBetween(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  Mancala.AIController = AIController;
})(window);
