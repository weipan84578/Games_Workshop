export function createHand(bet = 0) {
  return {
    cards: [],
    bet,
    stood: false,
    surrendered: false,
    doubled: false
  };
}

export function getCardPoints(card) {
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return Number(card.rank);
}

export function scoreHand(hand) {
  let value = hand.cards.reduce((total, card) => total + getCardPoints(card), 0);
  let aces = hand.cards.filter((card) => card.rank === "A").length;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  const isSoft = hand.cards.some((card) => card.rank === "A") && value <= 21 && aces > 0;
  return {
    value,
    isSoft,
    isBust: value > 21,
    isBlackjack: hand.cards.length === 2 && value === 21
  };
}
