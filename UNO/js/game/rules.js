(function () {
  function hasNonWildPlayable(hand, card, topCard, currentColor) {
    return hand.some((other) => {
      if (other.id === card.id || other.type === "wild") return false;
      return other.color === currentColor || other.value === topCard.value;
    });
  }

  const Rules = {
    isCardPlayable(card, topCard, currentColor, hand) {
      if (!card || !topCard) return false;
      if (card.value === "wild_draw_four" && Array.isArray(hand) && hasNonWildPlayable(hand, card, topCard, currentColor)) {
        return false;
      }
      if (card.type === "wild") return true;
      if (card.color === currentColor) return true;
      if (card.value === topCard.value) return true;
      return false;
    },

    getPlayableCards(hand, topCard, currentColor) {
      return hand.filter((card) => this.isCardPlayable(card, topCard, currentColor, hand));
    },

    getCardScore(card) {
      if (!card) return 0;
      if (card.type === "number") return Number(card.value) || 0;
      if (card.type === "action") return 20;
      return 50;
    },

    calculateScore(hand) {
      return hand.reduce((sum, card) => sum + this.getCardScore(card), 0);
    },
  };

  window.Rules = Rules;
})();
