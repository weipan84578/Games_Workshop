(function () {
  window.EAE = window.EAE || {};

  class AIEngine {
    constructor(boardData) {
      this.boardData = boardData;
    }

    getDelay(difficulty) {
      if (difficulty === "hard") return this._randomBetween(600, 1000);
      if (difficulty === "normal") return this._randomBetween(900, 1400);
      return this._randomBetween(1200, 1800);
    }

    chooseRoll(position, difficulty) {
      if (difficulty === "hard") return this._rollHard(position);
      if (difficulty === "normal") return this._rollNormal(position);
      return window.EAE.Dice.roll();
    }

    _rollNormal(position) {
      const roll = window.EAE.Dice.roll();
      const landing = position + roll;
      const transfer = this.boardData.getTransfer(landing);
      if (transfer && transfer.type === "eel" && Math.random() < 0.5) {
        const alternatives = window.EAE.Dice.validRollsFrom(position).filter((value) => {
          const item = this.boardData.getTransfer(position + value);
          return !item || item.type !== "eel";
        });
        if (alternatives.length) return alternatives[Math.floor(Math.random() * alternatives.length)];
      }
      return roll;
    }

    _rollHard(position) {
      const rolls = [1, 2, 3, 4, 5, 6].map((roll) => ({
        roll: roll,
        score: this._scoreLanding(position, roll)
      }));
      rolls.sort((a, b) => b.score - a.score || Math.random() - 0.5);
      const bestScore = rolls[0].score;
      const strong = rolls.filter((item) => item.score >= bestScore - 8);
      return strong[Math.floor(Math.random() * strong.length)].roll;
    }

    _scoreLanding(position, roll) {
      const landing = position + roll;
      if (landing > 100) return -999;
      if (landing === 100) return 300;
      const transfer = this.boardData.getTransfer(landing);
      if (transfer && transfer.type === "escalator") return 100 + transfer.end - landing;
      if (transfer && transfer.type === "eel") return -80 - (landing - transfer.end);

      let score = landing - position;
      const nearestEscalator = this.boardData.escalators.reduce((best, item) => {
        const distance = Math.abs(item.start - landing);
        return Math.min(best, distance);
      }, 100);
      if (nearestEscalator <= 3) score += 10 - nearestEscalator * 2;
      return score;
    }

    _randomBetween(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }
  }

  window.EAE.AIEngine = AIEngine;
})();
