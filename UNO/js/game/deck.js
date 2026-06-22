(function () {
  function createDeck() {
    const deck = [];
    const colors = UNO_CONSTANTS.COLORS;
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    colors.forEach((color) => {
      deck.push({ type: "number", color, value: 0, id: `${color}_0` });
      numbers.slice(1).forEach((num) => {
        deck.push({ type: "number", color, value: num, id: `${color}_${num}_a` });
        deck.push({ type: "number", color, value: num, id: `${color}_${num}_b` });
      });
      UNO_CONSTANTS.ACTIONS.forEach((action) => {
        deck.push({ type: "action", color, value: action, id: `${color}_${action}_a` });
        deck.push({ type: "action", color, value: action, id: `${color}_${action}_b` });
      });
    });

    UNO_CONSTANTS.WILDS.forEach((wild) => {
      for (let i = 0; i < 4; i += 1) {
        deck.push({ type: "wild", color: null, value: wild, id: `${wild}_${i}` });
      }
    });

    return Helpers.shuffle(deck);
  }

  window.Deck = {
    createDeck,

    draw(deck) {
      return deck.shift() || null;
    },
  };
})();
