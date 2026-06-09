(function () {
  const GameScreen = {
    render(data) {
      const difficulty = data && data.difficulty ? data.difficulty : Pong.GameState.game.difficulty;
      const app = Pong.DOM.setApp(`
        <main class="screen game-screen">
          <div class="game-shell">
            <div class="game-hud" aria-live="polite">
              <div class="hud-side">
                <span class="hud-label">玩家</span>
                <span class="score-value" id="playerScore">0</span>
              </div>
              <div class="hud-divider">║</div>
              <div class="hud-side">
                <span class="hud-label">AI</span>
                <span class="score-value" id="aiScore">0</span>
              </div>
            </div>

            <div class="canvas-wrap" id="canvasWrap"></div>

            <div class="game-footer">
              <button class="icon-button" type="button" data-action="pause" title="暫停" aria-label="暫停">⏸</button>
              <span class="difficulty-badge" id="difficultyBadge">${Pong.DOM.difficultyName(difficulty)}</span>
              <button class="icon-button" type="button" data-action="mute" id="muteButton" title="靜音" aria-label="靜音">🔊</button>
            </div>

            <div class="touch-controls" aria-label="觸控方向鍵">
              <button class="touch-button" type="button" data-touch-dir="up" aria-label="上移">▲</button>
              <button class="touch-button" type="button" data-touch-dir="down" aria-label="下移">▼</button>
            </div>

            <div class="countdown-overlay" id="countdownOverlay">
              <span class="countdown-value" id="countdownValue">3</span>
            </div>

            <div class="fps-counter" id="fpsCounter" hidden>FPS 0</div>
          </div>
        </main>
      `);

      Pong.Canvas.init(Pong.DOM.qs("#canvasWrap", app));
      Pong.DOM.bindClicks(app, {
        pause: () => Pong.Game.pause(),
        mute: () => {
          Pong.Audio.toggleMute();
          GameScreen.updateMuteButton();
        }
      });

      Pong.DOM.qsa("[data-touch-dir]", app).forEach((button) => {
        const direction = button.getAttribute("data-touch-dir");
        const setActive = (active) => Pong.Input.setVirtual(direction, active);
        button.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          Pong.Audio.unlock();
          setActive(true);
        });
        button.addEventListener("pointerup", () => setActive(false));
        button.addEventListener("pointercancel", () => setActive(false));
        button.addEventListener("pointerleave", () => setActive(false));
      });

      GameScreen.updateScore();
      GameScreen.updateMuteButton();
      GameScreen.updateFPS(Pong.GameState.effects.fps);
    },

    updateScore(flashSide) {
      const game = Pong.GameState.game;
      const player = Pong.DOM.qs("#playerScore");
      const ai = Pong.DOM.qs("#aiScore");
      if (!player || !ai) {
        return;
      }

      player.textContent = String(game.playerScore);
      ai.textContent = String(game.aiScore);

      if (flashSide === "player") {
        GameScreen.flashElement(player);
      } else if (flashSide === "ai") {
        GameScreen.flashElement(ai);
      }
    },

    flashElement(element) {
      element.classList.remove("score-flash");
      void element.offsetWidth;
      element.classList.add("score-flash");
    },

    showCountdown(value) {
      const overlay = Pong.DOM.qs("#countdownOverlay");
      const text = Pong.DOM.qs("#countdownValue");
      if (!overlay || !text) {
        return;
      }
      overlay.classList.add("is-visible");
      text.textContent = value;
    },

    hideCountdown() {
      const overlay = Pong.DOM.qs("#countdownOverlay");
      if (overlay) {
        overlay.classList.remove("is-visible");
      }
    },

    updateFPS(fps) {
      const counter = Pong.DOM.qs("#fpsCounter");
      if (!counter) {
        return;
      }
      counter.hidden = !(Pong.GameState.settings && Pong.GameState.settings.showFPS);
      counter.textContent = `FPS ${fps || 0}`;
    },

    updateMuteButton() {
      const button = Pong.DOM.qs("#muteButton");
      if (!button) {
        return;
      }
      button.textContent = Pong.GameState.muted ? "🔇" : "🔊";
      button.setAttribute("aria-label", Pong.GameState.muted ? "取消靜音" : "靜音");
      button.setAttribute("title", Pong.GameState.muted ? "取消靜音" : "靜音");
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.GameScreen = GameScreen;
})();
