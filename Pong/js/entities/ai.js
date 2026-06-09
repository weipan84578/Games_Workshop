(function () {
  class AI extends Pong.Paddle {
    constructor(difficulty) {
      super("ai");
      this.difficulty = difficulty || "normal";
      this.config = CONSTANTS.AI[this.difficulty];
      this.targetY = this.centerY;
      this.nextDecisionAt = 0;
    }

    setDifficulty(difficulty) {
      this.difficulty = difficulty;
      this.config = CONSTANTS.AI[difficulty];
    }

    update(ball, deltaFactor, now) {
      const dimensions = Pong.GameState.dimensions;
      const config = this.config;

      if (now >= this.nextDecisionAt) {
        this.nextDecisionAt = now + config.reactionDelay;
        if (Math.random() <= config.trackRate) {
          if (ball.vx > 0) {
            const predicted = Pong.Math.predictBallY(ball, this.x, dimensions.height);
            const error = Pong.Math.randomRange(-config.errorRange, config.errorRange) * dimensions.scaleFactor;
            const hardMiss = this.difficulty === "hard" && Math.random() < 0.05
              ? Pong.Math.randomSign() * Pong.Math.randomRange(0.18, 0.32) * dimensions.height
              : 0;
            this.targetY = predicted + error + hardMiss;
          } else {
            this.targetY = dimensions.height / 2;
          }
        }
      }

      const targetTop = Pong.Math.clamp(this.targetY - this.height / 2, 0, dimensions.height - this.height);
      const delta = targetTop - this.y;
      const maxMove = config.speed * dimensions.scaleFactor * deltaFactor;
      this.move(Pong.Math.clamp(delta, -maxMove, maxMove));
    }
  }

  window.Pong = window.Pong || {};
  window.Pong.AI = AI;
})();
