(function () {
  const GameScreen = {
    selectedCardId: null,
    aiProcessing: false,
    shownResultId: null,

    render(container) {
      const root = container || Helpers.qs("#screen-game");
      root.className = "screen game-screen";
      if (GameState.gamePhase === "idle") {
        App.showScreen("main-menu");
        return;
      }

      const canAct = GameState.canPlayerAct();
      const drawLabel = GameState.hasDrawnThisTurn ? I18n.t("game.endTurn") : I18n.t("game.drawCard");
      const unoEnabled = (canAct && (GameState.playerHand.length === 2 || GameState.playerHand.length === 1)) || (GameState.aiHand.length === 1 && !GameState.aiUnoDeclared);
      const aiStatus = this.aiProcessing
        ? `${I18n.t("game.thinking")} <span class="thinking-dots"><span></span><span></span><span></span></span>`
        : GameState.aiHand.length <= 2
          ? I18n.t("game.aiWarningUno")
          : I18n.t("game.aiHand");

      root.innerHTML = `
        <header class="game-header">
          <button class="btn btn-icon" type="button" data-action="menu" aria-label="${I18n.t("game.back")}">←</button>
          <div class="game-stats">
            <span class="stat-pill">${I18n.t("game.round")}: ${GameState.round}</span>
            <span class="stat-pill">${I18n.t("game.score")}: ${GameState.playerScore}</span>
            <span class="stat-pill">${I18n.t("game.direction")}: ${I18n.t(GameState.direction === 1 ? "game.clockwise" : "game.counterclockwise")}</span>
            <span class="stat-pill">${I18n.t("game.aiDifficulty")}: ${I18n.t(`difficulty.${GameState.difficulty}`)}</span>
          </div>
          <button class="btn btn-icon" type="button" data-action="settings" aria-label="${I18n.t("settings.title")}">⚙</button>
        </header>
        <section class="ai-zone">
          <div class="ai-panel">
            ${HandRenderer.renderAIHand(GameState.aiHand.length)}
            <div class="ai-summary">
              <div class="ai-avatar">AI</div>
              <div class="ai-meta">
                <div class="ai-name">AI <span class="card-count-badge">${GameState.aiHand.length}</span></div>
                <div class="ai-status">${aiStatus}</div>
              </div>
            </div>
          </div>
        </section>
        <section class="table-zone">
          ${TableRenderer.render()}
        </section>
        <section class="player-zone">
          <div class="player-hand-header">
            <strong>${I18n.t("game.playerHand")} (${GameState.playerHand.length})</strong>
            <span class="turn-banner">${GameState.currentPlayer === "player" ? I18n.t("game.yourTurn") : I18n.t("game.aiTurn")}</span>
          </div>
          ${HandRenderer.renderPlayerHand(GameState.playerHand, this.selectedCardId)}
        </section>
        <div class="game-log" aria-live="polite">${GameState.lastLog || ""}</div>
        <footer class="action-bar">
          <button class="btn btn-primary" type="button" data-action="draw" ${canAct ? "" : "disabled"}>${drawLabel}</button>
          <button class="btn" type="button" data-action="uno" ${unoEnabled ? "" : "disabled"}>${I18n.t("game.unoButton")}</button>
          <button class="btn" type="button" data-action="quick-help">${I18n.t("game.help")}</button>
        </footer>
      `;

      root.onclick = (event) => this.handleClick(event);
      root.onkeydown = (event) => {
        if ((event.key === "Enter" || event.key === " ") && event.target.closest("[data-card-id]")) {
          event.preventDefault();
          this.handleCard(event.target.closest("[data-card-id]").dataset.cardId);
        }
      };

      this.maybeShowResult();
      this.maybeRunAI();
    },

    async handleClick(event) {
      const cardId = event.target.closest("[data-card-id]")?.dataset.cardId;
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (cardId) {
        await this.handleCard(cardId);
        return;
      }
      if (!action) return;

      if (action === "menu") {
        GameState.saveState();
        Toast.show(I18n.t("game.saved"), "success");
        App.showScreen("main-menu");
      }
      if (action === "settings") App.showScreen("settings");
      if (action === "draw") {
        if (GameState.hasDrawnThisTurn) {
          GameState.passPlayerTurn();
        } else {
          const result = GameState.playerDrawOne();
          if (result.drawn && Rules.isCardPlayable(result.drawn, GameState.topCard(), GameState.currentColor, GameState.playerHand)) {
            Toast.show(I18n.t("game.mustDrawFirst"), "info");
          }
        }
      }
      if (action === "uno") {
        const result = GameState.callUno();
        Toast.show(result.ok ? I18n.t("game.unoCalled") : I18n.t("game.invalidPlay"), result.ok ? "success" : "error");
      }
      if (action === "quick-help") this.showQuickHelp();
    },

    async handleCard(cardId) {
      if (!GameState.canPlayerAct()) return;
      const card = GameState.playerHand.find((item) => item.id === cardId);
      if (!card) return;
      if (!Rules.isCardPlayable(card, GameState.topCard(), GameState.currentColor, GameState.playerHand)) {
        Toast.show(I18n.t("game.invalidPlay"), "error");
        AnimationController.shake(".player-hand");
        return;
      }
      if (this.selectedCardId !== cardId) {
        this.selectedCardId = cardId;
        this.render();
        Toast.show(I18n.t("game.selectAgain"), "info");
        return;
      }

      let chosenColor = null;
      if (card.type === "wild") {
        chosenColor = await Modal.chooseColor();
        if (!chosenColor) return;
      }
      const result = GameState.playPlayerCard(cardId, chosenColor);
      if (!result.ok) {
        Toast.show(I18n.t(result.message || "game.invalidPlay"), "error");
        return;
      }
      this.selectedCardId = null;
    },

    maybeRunAI() {
      if (this.aiProcessing || GameState.currentPlayer !== "ai" || GameState.gamePhase !== "playing") return;
      this.aiProcessing = true;
      this.render();
      this.executeAITurn();
    },

    async executeAITurn() {
      SFX.play("ai_think");
      await Helpers.delay(AI.getThinkDelay(GameState.difficulty));
      if (GameState.currentPlayer !== "ai" || GameState.gamePhase !== "playing") {
        this.aiProcessing = false;
        this.render();
        return;
      }

      GameState.checkPlayerUnoPenalty();
      await Helpers.delay(360);

      let card = AI.chooseCard(GameState.aiHand, GameState.topCard(), GameState.currentColor, GameState.difficulty, {
        playerCards: GameState.playerHand.length,
      });

      if (!card) {
        const drawResult = GameState.aiDrawOne();
        await Helpers.delay(420);
        if (drawResult.drawn && Rules.isCardPlayable(drawResult.drawn, GameState.topCard(), GameState.currentColor, GameState.aiHand)) {
          card = drawResult.drawn;
        } else {
          GameState.aiPassTurn();
          this.aiProcessing = false;
          this.render();
          return;
        }
      }

      const color = card.type === "wild" ? AI.chooseColor(GameState.aiHand.filter((item) => item.id !== card.id)) : null;
      GameState.playAiCard(card.id, color);
      if (GameState.aiUnoDeclared && GameState.aiHand.length === 1) {
        Toast.show(I18n.t("game.aiUnoCalled"), "warning");
      }
      this.aiProcessing = false;
      this.render();
    },

    maybeShowResult() {
      if (GameState.gamePhase !== "ended" || this.shownResultId === GameState.gameId) return;
      this.shownResultId = GameState.gameId;
      const won = GameState.winner === "player";
      if (won) AnimationController.confetti();
      if (!won) AnimationController.shake("body");
      Modal.open(`
        <h2 class="modal-title">${won ? I18n.t("game.winTitle") : I18n.t("game.loseTitle")}</h2>
        <div class="settings-section">
          <p><strong>${I18n.t("game.scoreEarned")}:</strong> +${GameState.finalScore}</p>
          <p><strong>${I18n.t("game.time")}:</strong> ${Helpers.formatTime(GameState.elapsedMs)}</p>
          <p><strong>${I18n.t("game.moves")}:</strong> ${GameState.moveCount}</p>
        </div>
        <div class="modal-actions modal-actions-row">
          <button class="btn btn-primary" type="button" data-result="again">${I18n.t("game.playAgain")}</button>
          <button class="btn" type="button" data-result="menu">${I18n.t("game.mainMenu")}</button>
        </div>
      `);
      Helpers.qs("#modal-content").onclick = (event) => {
        const result = event.target.closest("[data-result]")?.dataset.result;
        if (!result) return;
        Modal.close();
        if (result === "again") App.startNewGame(GameState.difficulty);
        if (result === "menu") App.showScreen("main-menu");
      };
    },

    showQuickHelp() {
      Modal.open(`
        <h2 class="modal-title">${I18n.t("help.title")}</h2>
        <div class="help-section">
          <p>${I18n.t("help.basicsText")}</p>
          <p>${I18n.t("help.specialText")}</p>
          <p>${I18n.t("help.unoText")}</p>
        </div>
        <button class="btn btn-primary btn-full" type="button" data-close-help>${I18n.t("common.close")}</button>
      `);
      Helpers.qs("#modal-content").onclick = (event) => {
        if (event.target.closest("[data-close-help]")) Modal.close();
      };
    },
  };

  window.GameScreen = GameScreen;
})();
