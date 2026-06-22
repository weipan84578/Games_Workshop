(function () {
  const actionLabels = {
    skip: "Skip",
    reverse: "Reverse",
    draw_two: "+2",
    wild: "Wild",
    wild_draw_four: "+4",
  };

  window.Card = {
    getLabel(card) {
      if (!card) return "";
      if (card.type === "number") return `${I18n.t(`game.${card.color}`)} ${card.value}`;
      return `${card.color ? `${I18n.t(`game.${card.color}`)} ` : ""}${actionLabels[card.value] || card.value}`;
    },

    getShortLabel(card) {
      if (!card) return "";
      if (card.type === "number") return String(card.value);
      return actionLabels[card.value] || card.value;
    },

    isWild(card) {
      return card && card.type === "wild";
    },

    isDrawCard(card) {
      return card && (card.value === "draw_two" || card.value === "wild_draw_four");
    },

    clone(card) {
      return Object.assign({}, card);
    },
  };
})();
