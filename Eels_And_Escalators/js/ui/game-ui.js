(function () {
  window.EAE = window.EAE || {};

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  class GameUI {
    constructor(options) {
      this.screenManager = options.screenManager;
      this.i18n = options.i18n;
      this.saveManager = options.saveManager;
      this.engine = options.engine;
      this.aiEngine = options.aiEngine;
      this.renderer = options.renderer;
      this.pieceAnimator = options.pieceAnimator;
      this.diceAnimator = options.diceAnimator;
      this.sfx = options.sfx;
      this.bgm = options.bgm;
      this.getSettings = options.getSettings;
      this.saveSettings = options.saveSettings;
      this.openSettings = options.openSettings;
      this.showToast = options.showToast;
      this.onReturnHome = options.onReturnHome;
      this.busy = false;
      this.pendingStatus = null;
      this.lastDifficulty = "normal";
      this.sessionId = 0;
    }

    init() {
      document.querySelectorAll(".roll-button").forEach((button) => {
        button.addEventListener("click", () => this.takePlayerTurn());
      });
      document.getElementById("btn-game-home").addEventListener("click", () => this.requestHome());
      document.getElementById("btn-confirm-exit").addEventListener("click", () => this.leaveToHome());
      document.getElementById("btn-game-settings").addEventListener("click", () => {
        this.sfx.playClick();
        this.openSettings();
      });
      document.getElementById("btn-mute").addEventListener("click", () => this.toggleMute());
      document.querySelectorAll(".btn-play-again").forEach((button) => {
        button.addEventListener("click", () => {
          this.sfx.playClick();
          this.screenManager.hideAllModals();
          this.startNewGame(this.lastDifficulty);
        });
      });
      document.querySelectorAll(".btn-result-home").forEach((button) => {
        button.addEventListener("click", () => {
          this.sfx.playClick();
          this.screenManager.hideAllModals();
          this.leaveToHome(false);
        });
      });
      this.renderer.render();
      this.updateUI();
    }

    startNewGame(difficulty) {
      this._unlockAudio();
      this.sessionId += 1;
      this.lastDifficulty = difficulty || "normal";
      this.engine.startNew(this.lastDifficulty);
      this.renderer.render();
      this.renderer.updatePieces(1, 1);
      this.busy = false;
      this.pendingStatus = null;
      this.screenManager.show("game");
      this._syncBgm();
      this.updateUI();
      this.showToast(this.i18n.t("game.toast.playerFirst"));
    }

    continueGame() {
      const save = this.saveManager.loadGame();
      if (!save) return;
      this._unlockAudio();
      this.sessionId += 1;
      this.engine.load(save);
      this.lastDifficulty = this.engine.state.difficulty;
      this.renderer.render();
      this.renderer.updatePieces(this.engine.state.playerPos, this.engine.state.aiPos);
      this.busy = false;
      this.pendingStatus = null;
      this.screenManager.show("game");
      this._syncBgm();
      this.updateUI();
      if (this.engine.state.currentTurn === "ai") this.scheduleAI();
    }

    async takePlayerTurn() {
      if (this.busy || this.engine.state.currentTurn !== "player" || this.engine.state.winner) return;
      const roll = window.EAE.Dice.roll();
      await this._playTurn("player", roll);
    }

    async scheduleAI() {
      if (this.engine.state.currentTurn !== "ai" || this.engine.state.winner) return;
      this.busy = true;
      const sessionId = this.sessionId;
      this.pendingStatus = this.i18n.t("game.event.aiThinking");
      this.updateUI();
      await wait(this.aiEngine.getDelay(this.engine.state.difficulty));
      if (sessionId !== this.sessionId || this.engine.state.currentTurn !== "ai" || this.engine.state.winner) return;
      const roll = this.aiEngine.chooseRoll(this.engine.state.aiPos, this.engine.state.difficulty);
      await this._playTurn("ai", roll);
    }

    async _playTurn(actor, roll) {
      this.busy = true;
      this.pendingStatus = null;
      this.updateUI();
      this.sfx.playDiceRoll();
      await this.diceAnimator.roll(roll);
      const result = await this.engine.applyTurn(actor, roll, {
        move: (movingActor, from, to) => this.pieceAnimator.animateMove(movingActor, from, to),
        transfer: (movingActor, from, to, type) => this.pieceAnimator.animateTransfer(movingActor, from, to, type)
      });
      this.renderer.updatePieces(this.engine.state.playerPos, this.engine.state.aiPos);
      this.updateUI(result);

      if (result.winner) {
        this.finishGame(result.winner);
        return;
      }

      this.sfx.playTurnChange();
      if (this.engine.state.currentTurn === "ai") {
        this.scheduleAI();
      } else {
        this.busy = false;
        this.updateUI();
      }
    }

    finishGame(winner) {
      this.busy = false;
      this.pendingStatus = null;
      this.updateUI();
      this.bgm.stop();
      if (winner === "player") this.sfx.playVictory();
      else this.sfx.playDefeat();

      const modalId = winner === "player" ? "modal-victory" : "modal-defeat";
      const summaryId = winner === "player" ? "victory-summary" : "defeat-summary";
      const difficulty = this.i18n.t("difficulty." + this.engine.state.difficulty);
      document.getElementById(summaryId).textContent = this.i18n.t("modal.result.summary", {
        difficulty: difficulty,
        round: this.engine.state.round
      });
      window.setTimeout(() => this.screenManager.showModal(modalId), 450);
      if (this.onReturnHome) this.onReturnHome();
    }

    requestHome() {
      this.sfx.playClick();
      if (this.busy) {
        this.showToast(this.i18n.t("game.toast.waitTurn"));
        return;
      }
      if (this.engine.state.winner) this.leaveToHome(false);
      else this.screenManager.showModal("modal-confirm-exit");
    }

    leaveToHome(saveProgress) {
      if (saveProgress !== false && !this.engine.state.winner) {
        this.saveManager.saveGame(this.engine.getSnapshot());
      }
      this.screenManager.hideAllModals();
      this.sessionId += 1;
      this.bgm.stop();
      this.busy = false;
      this.screenManager.show("home");
      if (this.onReturnHome) this.onReturnHome();
    }

    toggleMute() {
      this.sfx.playClick();
      const settings = this.getSettings();
      const nextEnabled = !(settings.bgmEnabled || settings.sfxEnabled);
      const next = Object.assign({}, settings, {
        bgmEnabled: nextEnabled,
        sfxEnabled: nextEnabled
      });
      this.saveSettings(next);
      this.updateMuteButton();
    }

    updateUI(lastResult) {
      const state = this.engine.state;
      document.getElementById("round-label").textContent = this.i18n.t("game.round", { n: state.round });
      document.getElementById("mobile-scoreline").textContent = "👤 " + state.playerPos + "  vs  🤖 " + state.aiPos;
      document.getElementById("player-position").textContent = this.i18n.t("game.position", { n: state.playerPos });
      document.getElementById("ai-position").textContent = this.i18n.t("game.position", { n: state.aiPos });
      document.getElementById("ai-name").textContent = this.i18n.t("game.ai") + "（" + this.i18n.t("difficulty." + state.difficulty) + "）";
      this._updateLast("player", "player-last", "player-event");
      this._updateLast("ai", "ai-last", "ai-event");

      document.getElementById("player-card").classList.toggle("is-active", state.currentTurn === "player" && !state.winner);
      document.getElementById("ai-card").classList.toggle("is-active", state.currentTurn === "ai" && !state.winner);
      this._renderLog();
      this._setStatus(this._statusText(lastResult));
      this._syncRollButtons();
      this.updateMuteButton();
    }

    updateMuteButton() {
      const settings = this.getSettings();
      const button = document.getElementById("btn-mute");
      button.textContent = settings.bgmEnabled || settings.sfxEnabled ? "🔊" : "🔇";
    }

    _updateLast(actor, rollId, eventId) {
      const last = this.engine.state.lasts[actor];
      document.getElementById(rollId).textContent = last && last.roll
        ? this.i18n.t("game.last", { n: last.roll })
        : this.i18n.t("game.last.empty");
      const text = last && last.event
        ? this._formatEvent(last.event)
        : this.i18n.t("game.status.waiting");
      document.getElementById(eventId).textContent = this.i18n.t("game.status", { text: text });
    }

    _renderLog() {
      const log = document.getElementById("turn-log");
      log.innerHTML = "";
      this.engine.state.log.slice(0, 6).forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = this.i18n.t("game.log.entry", {
          round: entry.round,
          actor: this._actorName(entry.actor),
          roll: entry.roll,
          target: entry.target,
          event: this._formatEvent(entry.event)
        });
        log.appendChild(li);
      });
    }

    _statusText(lastResult) {
      if (this.pendingStatus) return this.pendingStatus;
      if (lastResult) return this._actorName(lastResult.actor) + "：" + this._formatEvent(lastResult.event);
      if (this.engine.state.winner) return this._formatEvent({ type: "exact100", target: 100 });
      return this.engine.state.currentTurn === "player"
        ? this.i18n.t("game.turn.player")
        : this.i18n.t("game.turn.ai");
    }

    _setStatus(text) {
      document.getElementById("status-message").textContent = text;
      document.getElementById("mobile-status-message").textContent = text;
    }

    _syncRollButtons() {
      const disabled = this.busy || this.engine.state.currentTurn !== "player" || Boolean(this.engine.state.winner);
      document.querySelectorAll(".roll-button").forEach((button) => {
        button.disabled = disabled;
      });
    }

    _formatEvent(event) {
      if (!event) return "";
      if (event.type === "escalator") return this.i18n.t("game.event.escalator", { target: event.target });
      if (event.type === "eel") return this.i18n.t("game.event.eel", { target: event.target });
      if (event.type === "exact100") return this.i18n.t("game.event.exact100");
      if (event.type === "bounce") return this.i18n.t("game.event.bounce");
      return this.i18n.t("game.event.normal", { target: event.target });
    }

    _actorName(actor) {
      return actor === "player" ? this.i18n.t("game.player") : this.i18n.t("game.ai");
    }

    _unlockAudio() {
      this.sfx.resume();
      this.bgm.resume();
    }

    _syncBgm() {
      const settings = this.getSettings();
      this.bgm.setVolume(settings.bgmVolume);
      this.bgm.setEnabled(settings.bgmEnabled, true);
    }
  }

  window.EAE.GameUI = GameUI;
})();
