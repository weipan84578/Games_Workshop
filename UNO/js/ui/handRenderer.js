(function () {
  const HandRenderer = {
    renderPlayerHand(hand, selectedCardId) {
      const topCard = GameState.topCard();
      const playableCards = Rules.getPlayableCards(hand, topCard, GameState.currentColor).map((card) => card.id);
      const isPlayerTurn = GameState.currentPlayer === "player" && GameState.gamePhase === "playing";
      const compact = hand.length > 7 ? "compact" : "";
      const scrollMode = hand.length > 12 ? "scroll-mode" : "";
      const cards = hand
        .map((card) => {
          const playable = isPlayerTurn && playableCards.includes(card.id);
          return CardRenderer.renderCard(card, {
            className: "card-hand",
            interactive: isPlayerTurn,
            playable,
            selected: selectedCardId === card.id,
            disabled: !playable,
          });
        })
        .join("");
      return `<div class="player-hand ${compact} ${scrollMode}" aria-label="${I18n.t("game.playerHand")}">${cards}</div>`;
    },

    renderAIHand(count) {
      const visible = Math.min(count, 14);
      let cards = "";
      for (let i = 0; i < visible; i += 1) {
        cards += CardRenderer.renderBack({ className: "card-mini" });
      }
      return `<div class="ai-card-stack" aria-label="${I18n.t("game.aiHand")}">${cards}</div>`;
    },
  };

  window.HandRenderer = HandRenderer;
})();
