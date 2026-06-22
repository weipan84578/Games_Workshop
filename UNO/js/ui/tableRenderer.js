(function () {
  const TableRenderer = {
    render() {
      const topCard = GameState.topCard();
      const directionArrow = GameState.direction === 1 ? "→" : "←";
      const directionText = I18n.t(GameState.direction === 1 ? "game.clockwise" : "game.counterclockwise");
      return `
        <section class="table-surface" aria-label="UNO table">
          <div class="pile-group">
            <button class="draw-pile-button" type="button" data-action="draw" aria-label="${I18n.t("game.drawPile")}">
              ${CardRenderer.renderBack({ className: "card-table" })}
            </button>
            <div class="pile-label">${I18n.t("game.drawPile")} · ${I18n.t("game.deckLeft", { count: GameState.deck.length })}</div>
          </div>
          <div class="direction-indicator" aria-label="${directionText}">
            <span>${directionArrow}</span>
            <small class="pile-label">${directionText}</small>
          </div>
          <div class="pile-group">
            ${topCard ? CardRenderer.renderCard(topCard, { className: "card-table" }) : ""}
            <div class="pile-label">${I18n.t("game.discardPile")}</div>
            <div class="current-color-row">
              <span class="pile-label">${I18n.t("game.currentColor")}</span>
              <span class="color-chip ${GameState.currentColor}" aria-label="${I18n.t(`game.${GameState.currentColor}`)}"></span>
            </div>
          </div>
        </section>`;
    },
  };

  window.TableRenderer = TableRenderer;
})();
