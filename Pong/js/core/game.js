(function () {
  const Game = {
    init() {
      Pong.Storage.loadSettings();
      Pong.Input.init();
      Pong.ScreenManager.show("mainMenu");

      document.addEventListener("visibilitychange", () => {
        const game = Pong.GameState.game;
        if (document.hidden && game.active && !game.winner) {
          Pong.Storage.saveGame();
          if (game.running) {
            Game.pause();
          }
        }
      });
    },

    startNew(difficulty) {
      Game.prepareGame(difficulty || "normal", null);
      Pong.Storage.clearSave();
      Pong.Audio.playMusic(Game.musicForDifficulty(Pong.GameState.game.difficulty));
      Game.startLoop();
      Game.startCountdown();
    },

    continueSaved() {
      const save = Pong.Storage.loadSave();
      if (!save) {
        Pong.ScreenManager.show("mainMenu");
        return;
      }

      Game.prepareGame(save.difficulty, save);
      Pong.Audio.playMusic(Game.musicForDifficulty(save.difficulty));
      Game.startLoop();
      Game.startCountdown();
    },

    prepareGame(difficulty, save) {
      Game.stopLoop();
      Game.clearTimers();
      Pong.PauseMenu.hide();
      Pong.ResultScreen.hide();
      Pong.Input.clearMovement();

      const game = Pong.GameState.game;
      game.active = true;
      game.running = false;
      game.paused = false;
      game.difficulty = difficulty;
      game.targetScore = save ? save.targetScore : Pong.GameState.settings.targetScore;
      game.winner = null;
      game.lastScoreBy = null;
      game.continuedFromSave = Boolean(save);

      Pong.ScreenManager.show("gameScreen", { difficulty });
      Pong.Score.reset(game.targetScore);
      game.player = new Pong.Player();
      game.ai = new Pong.AI(difficulty);
      game.ball = new Pong.Ball();

      if (save) {
        game.playerScore = Number(save.playerScore) || 0;
        game.aiScore = Number(save.aiScore) || 0;
        if (save.paddlePlayer) {
          game.player.y = Number(save.paddlePlayer.y) || game.player.y;
          game.player.clamp();
        }
        if (save.paddleAI) {
          game.ai.y = Number(save.paddleAI.y) || game.ai.y;
          game.ai.clamp();
        }
        if (save.ballState) {
          game.ball.restore(save.ballState);
        }
      }

      Pong.GameScreen.updateScore();
      Pong.GameScreen.updateFPS(Pong.GameState.effects.fps);
      Game.render();
    },

    startLoop() {
      const game = Pong.GameState.game;
      Game.stopLoop();
      game.lastTimestamp = performance.now();
      game.animationFrame = requestAnimationFrame(Game.loop);
    },

    stopLoop() {
      const game = Pong.GameState.game;
      if (game.animationFrame) {
        cancelAnimationFrame(game.animationFrame);
        game.animationFrame = 0;
      }
    },

    clearTimers() {
      const game = Pong.GameState.game;
      if (game.countdownTimer) {
        clearTimeout(game.countdownTimer);
        game.countdownTimer = 0;
      }
      if (game.countdownInterval) {
        clearInterval(game.countdownInterval);
        game.countdownInterval = 0;
      }
      Pong.GameScreen.hideCountdown();
    },

    startCountdown() {
      const game = Pong.GameState.game;
      Game.clearTimers();
      game.running = false;
      game.paused = false;

      let value = 3;
      Pong.GameScreen.showCountdown(String(value));
      Pong.Audio.playSfx("countdown");

      game.countdownInterval = setInterval(() => {
        value -= 1;
        if (value > 0) {
          Pong.GameScreen.showCountdown(String(value));
          Pong.Audio.playSfx("countdown");
        }
      }, 1000);

      game.countdownTimer = setTimeout(() => {
        Game.clearTimers();
        if (!game.active || game.paused || game.winner) {
          return;
        }
        Pong.GameScreen.showCountdown("GO");
        Pong.Audio.playSfx("game_start");
        setTimeout(() => Pong.GameScreen.hideCountdown(), 280);
        game.running = true;
      }, CONSTANTS.COUNTDOWN_DURATION);
    },

    loop(timestamp) {
      const game = Pong.GameState.game;
      if (!game.active) {
        return;
      }

      const deltaMs = Math.min(34, Math.max(0, timestamp - game.lastTimestamp));
      game.lastTimestamp = timestamp;

      if (game.running && !game.paused && !game.winner) {
        Game.update(deltaMs);
      } else {
        Pong.Effects.update(deltaMs);
      }

      Game.render();
      Pong.Effects.recordFrame(deltaMs);
      game.animationFrame = requestAnimationFrame(Game.loop);
    },

    update(deltaMs) {
      const game = Pong.GameState.game;
      const deltaFactor = deltaMs / 16.6667;
      game.player.update(deltaFactor);
      game.ai.update(game.ball, deltaFactor, performance.now());
      const scorer = game.ball.update(deltaFactor);

      if (scorer) {
        Game.handleScore(scorer);
      }

      Pong.Effects.update(deltaMs);
    },

    render() {
      const game = Pong.GameState.game;
      const ctx = Pong.GameState.canvas.context;
      if (!ctx || !game.player || !game.ai || !game.ball) {
        return;
      }

      Pong.Canvas.clear();
      Pong.Canvas.drawField();
      game.player.draw(ctx);
      game.ai.draw(ctx);
      game.ball.draw(ctx);
      Pong.Effects.render(ctx);
    },

    handleScore(side) {
      const game = Pong.GameState.game;
      game.running = false;

      const winner = Pong.Score.award(side);
      const colors = Pong.Canvas.colors();
      const emitX = side === "player" ? Pong.GameState.dimensions.width - 24 : 24;
      const emitY = Pong.GameState.dimensions.height / 2;

      Pong.Audio.playSfx(side === "player" ? "player_score" : "ai_score");
      Pong.Effects.emit(emitX, emitY, side === "player" ? colors.player : colors.ai, 42);
      Pong.Effects.scoreFlash();
      Pong.Effects.vibrate([30, 35, 30]);

      if (winner) {
        Game.endMatch(winner);
        return;
      }

      if (Pong.Score.isMatchPoint()) {
        Pong.Audio.playSfx("match_point");
      }

      const serveDirection = side === "player" ? -1 : 1;
      game.ball.reset(serveDirection);
      Pong.Storage.saveGame();
      Game.startCountdown();
    },

    endMatch(winner) {
      const game = Pong.GameState.game;
      game.winner = winner;
      game.running = false;
      Pong.Storage.clearSave();
      Pong.Audio.playSfx(winner === "player" ? "game_win" : "game_lose");
      Pong.Audio.playMusic(winner === "player" ? "result_win" : "result_lose");

      setTimeout(() => {
        if (Pong.GameState.game.winner === winner) {
          Pong.Audio.playMusic("menu_theme");
        }
      }, 1900);

      Pong.ResultScreen.show({
        winner,
        difficulty: game.difficulty,
        playerScore: game.playerScore,
        aiScore: game.aiScore
      });
    },

    pause() {
      const game = Pong.GameState.game;
      if (!game.active || game.paused || game.winner) {
        return;
      }

      Game.clearTimers();
      game.paused = true;
      game.running = false;
      Pong.GameState.screen = "pauseMenu";
      Pong.Storage.saveGame();
      Pong.Audio.setMusicDimmed(true);
      Pong.PauseMenu.show();
    },

    resume() {
      const game = Pong.GameState.game;
      if (!game.active || !game.paused) {
        return;
      }

      game.paused = false;
      game.running = true;
      Pong.GameState.screen = "gameScreen";
      Pong.Audio.setMusicDimmed(false);
      Pong.PauseMenu.hide();
    },

    togglePause() {
      const game = Pong.GameState.game;
      if (!game.active || game.winner) {
        return;
      }
      if (game.paused) {
        Game.resume();
      } else {
        Game.pause();
      }
    },

    restart() {
      const difficulty = Pong.GameState.game.difficulty || "normal";
      Game.startNew(difficulty);
    },

    returnToMenu(shouldSave) {
      const game = Pong.GameState.game;
      if (shouldSave && game.active && !game.winner) {
        Pong.Storage.saveGame();
      }

      Game.stopLoop();
      Game.clearTimers();
      Pong.PauseMenu.hide();
      Pong.ResultScreen.hide();
      Pong.Input.clearMovement();

      game.active = false;
      game.running = false;
      game.paused = false;
      game.winner = null;
      Pong.Audio.setMusicDimmed(false);
      Pong.Audio.playMusic("menu_theme");
      Pong.ScreenManager.show("mainMenu");
    },

    musicForDifficulty(difficulty) {
      if (difficulty === "easy") {
        return "game_easy";
      }
      if (difficulty === "hard") {
        return "game_hard";
      }
      return "game_normal";
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Game = Game;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Game.init);
  } else {
    Game.init();
  }
})();
