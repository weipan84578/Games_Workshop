import { scoreHand } from "../game/hand.js";

const CHIP_VALUES = [10, 25, 50, 100, 500];
const PIP_POSITIONS = {
  2: [2, 11],
  3: [2, 7, 11],
  4: [1, 3, 10, 12],
  5: [1, 3, 7, 10, 12],
  6: [1, 3, 4, 9, 10, 12],
  7: [1, 3, 4, 7, 9, 10, 12],
  8: [1, 3, 4, 6, 8, 9, 10, 12],
  9: [1, 3, 4, 6, 7, 8, 9, 10, 12],
  10: [1, 3, 4, 5, 6, 8, 9, 10, 11, 12]
};

export class Renderer {
  constructor(engine) {
    this.engine = engine;
    this.nodes = {
      chips: document.querySelector("#player-chips"),
      round: document.querySelector("#round-count"),
      phase: document.querySelector("#phase-label"),
      message: document.querySelector("#message-bar"),
      dealerHand: document.querySelector("#dealer-hand"),
      dealerScore: document.querySelector("#dealer-score"),
      playerHand: document.querySelector("#player-hand"),
      playerScore: document.querySelector("#player-score"),
      currentBet: document.querySelector("#current-bet"),
      betAmount: document.querySelector("#bet-amount"),
      aiArea: document.querySelector("#ai-area"),
      chipButtons: document.querySelector("#chip-buttons"),
      hit: document.querySelector("#hit-btn"),
      stand: document.querySelector("#stand-btn"),
      double: document.querySelector("#double-btn"),
      surrender: document.querySelector("#surrender-btn"),
      deal: document.querySelector("#deal-btn"),
      clearBet: document.querySelector("#clear-bet-btn"),
      modal: document.querySelector("#settlement-modal"),
      settlementTitle: document.querySelector("#settlement-title"),
      settlementBody: document.querySelector("#settlement-body")
    };
    this.renderChips();
  }

  renderChips() {
    this.nodes.chipButtons.innerHTML = CHIP_VALUES.map((value) => (
      `<button class="chip" data-chip="${value}" data-value="${value}">$${value}</button>`
    )).join("");
  }

  render() {
    const state = this.engine.state;
    const human = this.engine.human;
    const hand = human.hands[0];
    const humanScore = scoreHand(hand);
    this.nodes.chips.textContent = money(human.chips);
    this.nodes.round.textContent = String(state.round);
    this.nodes.phase.textContent = phaseLabel(state.phase);
    this.nodes.message.textContent = state.message;
    this.nodes.currentBet.textContent = money(hand.bet);
    this.nodes.betAmount.textContent = money(state.pendingBet);
    this.nodes.playerHand.innerHTML = renderHand(hand.cards);
    this.nodes.playerScore.textContent = scoreText(humanScore);
    this.nodes.dealerHand.innerHTML = renderHand(state.dealer.cards, state.phase === "PLAYER_TURN" || state.phase === "AI_TURN");
    this.nodes.dealerScore.textContent = state.phase === "PLAYER_TURN" || state.phase === "AI_TURN"
      ? "?"
      : scoreText(scoreHand(state.dealer));
    this.renderAi();
    this.updateButtons();
  }

  renderAi() {
    this.nodes.aiArea.innerHTML = this.engine.aiPlayers.map((ai) => {
      const hand = ai.hands[0];
      const score = scoreHand(hand);
      return `<article class="seat ai-seat">
        <div class="seat-heading">
          <h3>${ai.name}</h3>
          <span class="score-pill">${scoreText(score)}</span>
        </div>
        <div class="hand-row">${renderHand(hand.cards)}</div>
        <div class="bet-line">下注：<strong>${money(hand.bet)}</strong> · ${ai.status}</div>
      </article>`;
    }).join("");
  }

  updateButtons() {
    const state = this.engine.state;
    const human = this.engine.human;
    const hand = human.hands[0];
    const isBetting = state.phase === "BETTING" || state.phase === "IDLE";
    const isTurn = state.phase === "PLAYER_TURN";
    const firstTwo = hand.cards.length === 2;
    this.nodes.chipButtons.querySelectorAll("button").forEach((button) => {
      button.disabled = !isBetting || human.chips < Number(button.dataset.chip);
    });
    this.nodes.clearBet.disabled = !isBetting || state.pendingBet <= 0;
    this.nodes.deal.disabled = !isBetting || state.pendingBet < 10;
    this.nodes.hit.disabled = !isTurn;
    this.nodes.stand.disabled = !isTurn;
    this.nodes.double.disabled = !isTurn || !firstTwo || human.chips < hand.bet;
    this.nodes.surrender.disabled = !isTurn || !firstTwo;
  }

  showSettlement(summary) {
    this.nodes.settlementTitle.textContent = summary.title;
    this.nodes.settlementBody.innerHTML = summary.lines.map((line) => `<p>${line}</p>`).join("");
    if (!this.nodes.modal.open) this.nodes.modal.showModal();
  }

  closeSettlement() {
    if (this.nodes.modal.open) this.nodes.modal.close();
  }
}

function renderHand(cards, hideSecond = false) {
  return cards.map((card, index) => renderCard(card, hideSecond && index === 1)).join("");
}

function renderCard(card, hidden) {
  if (hidden) return `<div class="playing-card is-hidden" aria-label="hidden card"></div>`;
  const red = card.color === "red" ? " is-red" : "";
  const center = renderCenter(card);
  return `<div class="playing-card${red}" aria-label="${card.rank} ${card.symbol}">
    <div class="card-corner"><span>${card.rank}</span><span>${card.symbol}</span></div>
    <div class="card-center">${center}</div>
    <div class="card-corner bottom"><span>${card.rank}</span><span>${card.symbol}</span></div>
  </div>`;
}

function renderCenter(card) {
  if (["J", "Q", "K"].includes(card.rank)) return `<span class="face-mark">${card.rank}</span>`;
  if (card.rank === "A") return card.symbol;
  const positions = PIP_POSITIONS[card.rank] || [];
  const cells = Array.from({ length: 12 }, (_, index) => (
    positions.includes(index + 1) ? `<span>${card.symbol}</span>` : "<span></span>"
  ));
  return `<div class="pip-grid">${cells.join("")}</div>`;
}

function scoreText(score) {
  if (score.isBlackjack) return "BJ";
  if (score.isBust) return `${score.value} 爆`;
  return String(score.value);
}

function phaseLabel(phase) {
  return {
    IDLE: "待下注",
    BETTING: "下注中",
    DEALING: "發牌",
    PLAYER_TURN: "玩家回合",
    AI_TURN: "AI 回合",
    DEALER_TURN: "莊家回合",
    SETTLEMENT: "結算"
  }[phase] || phase;
}

export function money(value) {
  return `$${Number(value).toLocaleString("en-US")}`;
}
