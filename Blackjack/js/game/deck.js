import { shuffle } from "../utils/random.js";

const SUITS = [
  { id: "spades", symbol: "♠", color: "black" },
  { id: "hearts", symbol: "♥", color: "red" },
  { id: "diamonds", symbol: "♦", color: "red" },
  { id: "clubs", symbol: "♣", color: "black" }
];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createDeck(deckCount = 6) {
  const cards = [];
  for (let deck = 0; deck < deckCount; deck += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({ ...suit, rank, id: `${deck}-${suit.id}-${rank}` });
      }
    }
  }
  return shuffle(cards);
}

export function drawCard(state) {
  if (state.deck.length < 18) {
    state.deck = createDeck(state.settings.deckCount);
    state.runningCount = 0;
  }
  const card = state.deck.pop();
  updateCount(state, card);
  return card;
}

function updateCount(state, card) {
  if (["2", "3", "4", "5", "6"].includes(card.rank)) state.runningCount += 1;
  if (["10", "J", "Q", "K", "A"].includes(card.rank)) state.runningCount -= 1;
}
