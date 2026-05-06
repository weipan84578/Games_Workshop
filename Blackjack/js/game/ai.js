import { scoreHand } from "./hand.js";

const AI_NAMES = [
  { name: "Victor", style: "穩健派" },
  { name: "Luna", style: "注重 Double" },
  { name: "Blaze", style: "高風險叫牌" }
];

export function aiProfile(index) {
  return AI_NAMES[index] || { name: `AI ${index + 1}`, style: "標準策略" };
}

export function decideAiAction({ hand, dealerUpCard, difficulty, runningCount, deckRemaining }) {
  const score = scoreHand(hand);
  const dealerValue = dealerRankValue(dealerUpCard);
  if (score.isBust || score.value >= 21) return "stand";
  if (difficulty === "easy") return score.value < 15 ? "hit" : "stand";
  const trueCount = deckRemaining > 0 ? runningCount / Math.max(1, deckRemaining / 52) : 0;
  if (difficulty === "hard" && trueCount >= 2 && score.value === 16 && dealerValue <= 3) return "stand";
  if (score.isSoft) return softStrategy(score.value, dealerValue);
  return hardStrategy(score.value, dealerValue);
}

function dealerRankValue(card) {
  if (!card) return 10;
  if (card.rank === "A") return 11;
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  return Number(card.rank);
}

function hardStrategy(value, dealer) {
  if (value <= 8) return "hit";
  if (value === 9) return dealer >= 3 && dealer <= 6 ? "double" : "hit";
  if (value === 10) return dealer <= 9 ? "double" : "hit";
  if (value === 11) return dealer === 11 ? "hit" : "double";
  if (value === 12) return dealer >= 4 && dealer <= 6 ? "stand" : "hit";
  if (value >= 13 && value <= 16) return dealer >= 2 && dealer <= 6 ? "stand" : "hit";
  return "stand";
}

function softStrategy(value, dealer) {
  if (value <= 17) return dealer >= 4 && dealer <= 6 ? "double" : "hit";
  if (value === 18) return dealer >= 9 || dealer === 11 ? "hit" : "stand";
  return "stand";
}
