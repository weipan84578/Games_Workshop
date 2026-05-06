import { createHand } from "./hand.js";

export function createPlayer({ id, name, isHuman = false, chips = 1000 }) {
  return {
    id,
    name,
    isHuman,
    chips,
    bet: 0,
    hands: [createHand()],
    activeHandIndex: 0,
    status: "waiting"
  };
}

export function resetForRound(player) {
  player.bet = 0;
  player.hands = [createHand()];
  player.activeHandIndex = 0;
  player.status = "waiting";
}

export function activeHand(player) {
  return player.hands[player.activeHandIndex];
}
