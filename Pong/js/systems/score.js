(function () {
  const Score = {
    reset(targetScore) {
      const game = Pong.GameState.game;
      game.playerScore = 0;
      game.aiScore = 0;
      game.targetScore = targetScore || Pong.GameState.settings.targetScore;
      game.winner = null;
      game.lastScoreBy = null;
    },

    award(side) {
      const game = Pong.GameState.game;
      if (side === "player") {
        game.playerScore += 1;
      } else {
        game.aiScore += 1;
      }
      game.lastScoreBy = side;
      Pong.GameScreen.updateScore(side);

      return Score.winner();
    },

    winner() {
      const game = Pong.GameState.game;
      if (game.playerScore >= game.targetScore) {
        return "player";
      }
      if (game.aiScore >= game.targetScore) {
        return "ai";
      }
      return null;
    },

    isMatchPoint() {
      const game = Pong.GameState.game;
      return game.playerScore === game.targetScore - 1 || game.aiScore === game.targetScore - 1;
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Score = Score;
})();
