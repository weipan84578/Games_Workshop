(function () {
  function defaultState() {
    return {
      gameId: Helpers.uid("game"),
      deck: [],
      discardPile: [],
      playerHand: [],
      aiHand: [],
      currentColor: null,
      currentPlayer: "player",
      direction: 1,
      round: 1,
      playerScore: 0,
      aiScore: 0,
      difficulty: "normal",
      gamePhase: "idle",
      startTime: Date.now(),
      elapsedMs: 0,
      moveCount: 0,
      hasDrawnThisTurn: false,
      playerUnoDeclared: false,
      aiUnoDeclared: false,
      winner: null,
      finalScore: 0,
      lastLog: "",
      savedAt: null,
    };
  }

  const listeners = [];

  const GameState = Object.assign(defaultState(), {
    subscribe(fn) {
      listeners.push(fn);
      return () => {
        const index = listeners.indexOf(fn);
        if (index >= 0) listeners.splice(index, 1);
      };
    },

    notify() {
      listeners.forEach((fn) => fn(this));
    },

    resetFields() {
      Object.assign(this, defaultState());
    },

    init(difficulty) {
      const settings = UnoStorage.getSettings();
      this.resetFields();
      this.difficulty = difficulty || settings.difficulty || "normal";
      UnoStorage.saveSettings({ difficulty: this.difficulty });
      this.gamePhase = "dealing";
      this.deck = Deck.createDeck();
      this.playerHand = [];
      this.aiHand = [];

      for (let i = 0; i < 7; i += 1) {
        this.playerHand.push(Deck.draw(this.deck));
        this.aiHand.push(Deck.draw(this.deck));
      }

      const firstIndex = this.deck.findIndex((card) => card && card.type === "number");
      const firstCard = this.deck.splice(firstIndex >= 0 ? firstIndex : 0, 1)[0];
      this.discardPile = [firstCard];
      this.currentColor = firstCard.color;
      this.currentPlayer = "player";
      this.gamePhase = "playing";
      this.startTime = Date.now();
      this.lastLog = I18n.t("game.yourTurn");
      this.saveState();
      this.notify();
      SFX.play("card_deal");
    },

    loadSaved() {
      const saved = UnoStorage.loadGame();
      if (!saved) return false;
      this.resetFields();
      Object.assign(this, saved);
      this.gamePhase = this.gamePhase === "ended" ? "playing" : this.gamePhase || "playing";
      this.winner = null;
      this.finalScore = 0;
      this.lastLog = I18n.t(this.currentPlayer === "player" ? "game.yourTurn" : "game.aiTurn");
      this.notify();
      return true;
    },

    snapshot() {
      return {
        gameId: this.gameId,
        deck: this.deck,
        discardPile: this.discardPile,
        playerHand: this.playerHand,
        aiHand: this.aiHand,
        currentColor: this.currentColor,
        currentPlayer: this.currentPlayer,
        direction: this.direction,
        round: this.round,
        playerScore: this.playerScore,
        aiScore: this.aiScore,
        difficulty: this.difficulty,
        gamePhase: this.gamePhase,
        startTime: this.startTime,
        elapsedMs: this.getElapsedMs(),
        moveCount: this.moveCount,
        hasDrawnThisTurn: this.hasDrawnThisTurn,
        playerUnoDeclared: this.playerUnoDeclared,
        aiUnoDeclared: this.aiUnoDeclared,
        lastLog: this.lastLog,
      };
    },

    saveState() {
      if (this.gamePhase === "playing" || this.gamePhase === "dealing") {
        UnoStorage.saveGame(this.snapshot());
      }
    },

    topCard() {
      return this.discardPile[this.discardPile.length - 1] || null;
    },

    getElapsedMs() {
      if (this.gamePhase === "ended") return this.elapsedMs;
      return Date.now() - this.startTime;
    },

    getHand(playerKey) {
      return playerKey === "player" ? this.playerHand : this.aiHand;
    },

    getOpponent(playerKey) {
      return playerKey === "player" ? "ai" : "player";
    },

    setLog(key, params) {
      this.lastLog = I18n.t(key, params);
    },

    reshuffleDeck() {
      if (this.discardPile.length <= 1) return false;
      const top = this.discardPile.pop();
      this.deck = Helpers.shuffle(this.discardPile);
      this.discardPile = [top];
      SFX.play("card_deal");
      return true;
    },

    drawCards(playerKey, count) {
      const hand = this.getHand(playerKey);
      const drawn = [];
      for (let i = 0; i < count; i += 1) {
        if (!this.deck.length) this.reshuffleDeck();
        const card = Deck.draw(this.deck);
        if (!card) break;
        hand.push(card);
        drawn.push(card);
      }
      if (playerKey === "player" && hand.length !== 1) this.playerUnoDeclared = false;
      if (playerKey === "ai" && hand.length !== 1) this.aiUnoDeclared = false;
      return drawn;
    },

    canPlayerAct() {
      return this.gamePhase === "playing" && this.currentPlayer === "player";
    },

    playerDrawOne() {
      if (!this.canPlayerAct()) return { ok: false };
      if (this.hasDrawnThisTurn) return this.passPlayerTurn();
      const drawn = this.drawCards("player", 1);
      this.hasDrawnThisTurn = true;
      if (!drawn.length) {
        this.setLog("game.noCardsInDeck");
        SFX.play("error");
      } else {
        this.setLog("game.playerDrew");
        SFX.play("card_draw");
      }
      this.saveState();
      this.notify();
      return { ok: true, drawn: drawn[0] || null };
    },

    passPlayerTurn() {
      if (!this.canPlayerAct() || !this.hasDrawnThisTurn) return { ok: false };
      this.currentPlayer = "ai";
      this.hasDrawnThisTurn = false;
      this.setLog("game.playerPass");
      this.saveState();
      this.notify();
      return { ok: true };
    },

    callUno() {
      if (this.aiHand.length === 1 && !this.aiUnoDeclared && this.gamePhase === "playing") {
        this.drawCards("ai", 2);
        this.aiUnoDeclared = false;
        this.setLog("game.aiUnoPenalty");
        SFX.play("uno_call");
        this.saveState();
        this.notify();
        return { ok: true, penalty: "ai" };
      }

      if (this.currentPlayer === "player" && (this.playerHand.length === 2 || this.playerHand.length === 1)) {
        this.playerUnoDeclared = true;
        this.setLog("game.unoCalled");
        SFX.play("uno_call");
        this.saveState();
        this.notify();
        return { ok: true };
      }

      SFX.play("error");
      return { ok: false };
    },

    checkPlayerUnoPenalty() {
      if (this.playerHand.length === 1 && !this.playerUnoDeclared && this.gamePhase === "playing") {
        this.drawCards("player", 2);
        this.playerUnoDeclared = false;
        this.setLog("game.playerUnoPenalty");
        SFX.play("draw_two");
        this.saveState();
        this.notify();
        return true;
      }
      return false;
    },

    playPlayerCard(cardId, chosenColor) {
      if (!this.canPlayerAct()) return { ok: false, message: "game.invalidPlay" };
      return this.playCardFor("player", cardId, chosenColor);
    },

    playAiCard(cardId, chosenColor) {
      if (this.gamePhase !== "playing" || this.currentPlayer !== "ai") return { ok: false };
      return this.playCardFor("ai", cardId, chosenColor);
    },

    playCardFor(playerKey, cardId, chosenColor) {
      const hand = this.getHand(playerKey);
      const index = hand.findIndex((card) => card.id === cardId);
      if (index < 0) return { ok: false, message: "game.invalidPlay" };

      const card = hand[index];
      const topCard = this.topCard();
      if (!Rules.isCardPlayable(card, topCard, this.currentColor, hand)) {
        SFX.play("error");
        return { ok: false, message: "game.invalidPlay" };
      }

      if (card.type === "wild" && !chosenColor) {
        return { ok: false, needColor: true };
      }

      hand.splice(index, 1);
      this.discardPile.push(card);
      this.currentColor = card.type === "wild" ? chosenColor : card.color;
      this.moveCount += 1;
      this.hasDrawnThisTurn = false;

      if (playerKey === "player") {
        if (this.playerHand.length !== 1) this.playerUnoDeclared = false;
      } else if (this.aiHand.length === 1) {
        this.aiUnoDeclared = AI.shouldCallUno(this.difficulty);
      } else {
        this.aiUnoDeclared = false;
      }

      this.setLog(playerKey === "player" ? "game.playerPlayed" : "game.aiPlayed", { card: Card.getLabel(card) });
      SFX.play(card.value === "wild_draw_four" ? "draw_four" : card.value === "draw_two" ? "draw_two" : card.value === "reverse" ? "reverse" : card.value === "skip" ? "skip_turn" : card.type === "wild" ? "wild_select" : "card_play");

      if (this.checkWin(playerKey)) {
        this.notify();
        return { ok: true, card };
      }

      this.applyCardEffect(playerKey, card);
      this.saveState();
      this.notify();
      return { ok: true, card };
    },

    applyCardEffect(playerKey, card) {
      const opponent = this.getOpponent(playerKey);
      let skipOpponent = false;

      if (card.value === "skip") {
        skipOpponent = true;
        this.setLog("game.skipEffect", { player: opponent === "player" ? I18n.t("game.playerHand") : "AI" });
      }

      if (card.value === "reverse") {
        this.direction *= -1;
        skipOpponent = true;
        this.setLog("game.reverseEffect");
      }

      if (card.value === "draw_two") {
        this.drawCards(opponent, 2);
        skipOpponent = true;
        this.setLog("game.drawPenalty", { player: opponent === "player" ? I18n.t("game.playerHand") : "AI", count: 2 });
      }

      if (card.value === "wild_draw_four") {
        this.drawCards(opponent, 4);
        skipOpponent = true;
        this.setLog("game.drawPenalty", { player: opponent === "player" ? I18n.t("game.playerHand") : "AI", count: 4 });
      }

      this.currentPlayer = skipOpponent ? playerKey : opponent;
      this.hasDrawnThisTurn = false;
    },

    aiDrawOne() {
      if (this.gamePhase !== "playing" || this.currentPlayer !== "ai") return { ok: false };
      const drawn = this.drawCards("ai", 1);
      if (!drawn.length) {
        this.currentPlayer = "player";
        this.setLog("game.noCardsInDeck");
        this.saveState();
        this.notify();
        return { ok: true, drawn: null };
      }
      this.setLog("game.aiDrew");
      SFX.play("card_draw");
      this.saveState();
      this.notify();
      return { ok: true, drawn: drawn[0] };
    },

    aiPassTurn() {
      if (this.gamePhase !== "playing" || this.currentPlayer !== "ai") return;
      this.currentPlayer = "player";
      this.hasDrawnThisTurn = false;
      this.setLog("game.aiPass");
      this.saveState();
      this.notify();
    },

    checkWin(playerKey) {
      const hand = this.getHand(playerKey);
      if (hand.length > 0) return false;
      const opponentHand = this.getHand(this.getOpponent(playerKey));
      this.winner = playerKey;
      this.finalScore = Rules.calculateScore(opponentHand);
      if (playerKey === "player") this.playerScore += this.finalScore;
      if (playerKey === "ai") this.aiScore += this.finalScore;
      this.elapsedMs = Date.now() - this.startTime;
      this.gamePhase = "ended";
      UnoStorage.clearSave();
      SFX.play(playerKey === "player" ? "win" : "lose");
      return true;
    },
  });

  window.GameState = GameState;
})();
