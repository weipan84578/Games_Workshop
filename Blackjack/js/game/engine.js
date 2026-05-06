import { createDeck, drawCard } from "./deck.js";
import { createHand, scoreHand } from "./hand.js";
import { createPlayer, resetForRound } from "./player.js";
import { aiProfile, decideAiAction } from "./ai.js";
import { delay } from "../utils/random.js";
import { saveRoundRecord } from "../utils/storage.js";

export class GameEngine {
  constructor(settings, synth) {
    this.synth = synth;
    this.state = {
      phase: "IDLE",
      deck: [],
      dealer: createHand(),
      round: 0,
      pendingBet: 0,
      runningCount: 0,
      settings,
      message: "選擇籌碼後開始下注。"
    };
    this.human = createPlayer({ id: "player", name: "玩家", isHuman: true, chips: settings.startingChips });
    this.aiPlayers = [];
    this.configure(settings);
  }

  configure(settings) {
    const oldChips = this.human?.chips;
    this.state.settings = settings;
    this.state.deck = createDeck(settings.deckCount);
    this.state.runningCount = 0;
    this.human.chips = oldChips ?? settings.startingChips;
    this.aiPlayers = Array.from({ length: settings.aiCount }, (_, index) => {
      const profile = aiProfile(index);
      return createPlayer({ id: `ai_${index + 1}`, name: profile.name, chips: settings.startingChips });
    });
    this.prepareBetting();
  }

  prepareBetting() {
    this.state.phase = this.human.chips > 0 ? "BETTING" : "IDLE";
    this.state.dealer = createHand();
    this.state.pendingBet = 0;
    resetForRound(this.human);
    this.aiPlayers.forEach(resetForRound);
    this.state.message = this.human.chips > 0 ? "選擇籌碼後開始下注。" : "籌碼用完，請到設定調整起始籌碼。";
  }

  addBet(amount) {
    if (!["IDLE", "BETTING"].includes(this.state.phase)) return;
    if (this.human.chips < amount) return;
    this.state.phase = "BETTING";
    this.human.chips -= amount;
    this.state.pendingBet += amount;
    this.synth.play("chip");
    this.state.message = `已加入下注 $${amount}。`;
  }

  clearBet() {
    if (this.state.phase !== "BETTING") return;
    this.human.chips += this.state.pendingBet;
    this.state.pendingBet = 0;
    this.state.message = "下注已清除。";
  }

  async deal() {
    if (this.state.pendingBet < 10 || this.state.phase !== "BETTING") return;
    this.state.phase = "DEALING";
    this.state.round += 1;
    this.human.hands = [createHand(this.state.pendingBet)];
    this.human.bet = this.state.pendingBet;
    this.human.status = "playing";
    this.state.pendingBet = 0;
    this.aiPlayers.forEach((ai, index) => {
      const base = [50, 100, 150][index] || 50;
      const wager = Math.min(ai.chips, base);
      ai.chips -= wager;
      ai.bet = wager;
      ai.hands = [createHand(wager)];
      ai.status = "playing";
    });
    const seats = [this.human, ...this.aiPlayers];
    for (let round = 0; round < 2; round += 1) {
      for (const player of seats) {
        player.hands[0].cards.push(drawCard(this.state));
        this.synth.play("deal");
        await delay(120);
      }
      this.state.dealer.cards.push(drawCard(this.state));
      this.synth.play("deal");
      await delay(120);
    }
    this.state.phase = "PLAYER_TURN";
    this.state.message = "你的回合：叫牌、停牌、Double 或投降。";
  }

  hitHuman() {
    if (this.state.phase !== "PLAYER_TURN") return false;
    const hand = this.human.hands[0];
    hand.cards.push(drawCard(this.state));
    this.synth.play("deal");
    const score = scoreHand(hand);
    if (score.isBust) {
      this.human.status = "bust";
      this.state.message = "爆牌，等待其他玩家與莊家結算。";
      return true;
    }
    if (score.value === 21) return true;
    this.state.message = "你可以繼續叫牌或停牌。";
    return false;
  }

  standHuman() {
    if (this.state.phase !== "PLAYER_TURN") return;
    this.human.status = "stand";
    this.human.hands[0].stood = true;
    this.state.message = "玩家停牌，AI 開始行動。";
  }

  doubleHuman() {
    if (this.state.phase !== "PLAYER_TURN") return false;
    const hand = this.human.hands[0];
    if (hand.cards.length !== 2 || this.human.chips < hand.bet) return false;
    this.human.chips -= hand.bet;
    hand.bet *= 2;
    hand.doubled = true;
    hand.cards.push(drawCard(this.state));
    this.synth.play("deal");
    this.human.status = scoreHand(hand).isBust ? "bust" : "stand";
    this.state.message = "Double 完成，玩家停牌。";
    return true;
  }

  surrenderHuman() {
    if (this.state.phase !== "PLAYER_TURN") return;
    const hand = this.human.hands[0];
    if (hand.cards.length !== 2) return;
    hand.surrendered = true;
    this.human.status = "surrender";
    this.human.chips += Math.floor(hand.bet / 2);
    this.state.message = "玩家投降，返還一半下注。";
  }

  async playAiTurns(onProgress) {
    this.state.phase = "AI_TURN";
    for (const ai of this.aiPlayers) {
      const hand = ai.hands[0];
      while (!scoreHand(hand).isBust) {
        const action = decideAiAction({
          hand,
          dealerUpCard: this.state.dealer.cards[0],
          difficulty: this.state.settings.difficulty,
          runningCount: this.state.runningCount,
          deckRemaining: this.state.deck.length
        });
        if (action === "stand") {
          ai.status = "stand";
          break;
        }
        if (action === "double" && hand.cards.length === 2 && ai.chips >= hand.bet) {
          ai.chips -= hand.bet;
          hand.bet *= 2;
          hand.doubled = true;
          hand.cards.push(drawCard(this.state));
          ai.status = scoreHand(hand).isBust ? "bust" : "stand";
          this.synth.play("deal");
          onProgress?.();
          break;
        }
        hand.cards.push(drawCard(this.state));
        this.synth.play("deal");
        onProgress?.();
        await delay(this.state.settings.difficulty === "hard" ? 420 : 620);
      }
      if (scoreHand(hand).isBust) ai.status = "bust";
      onProgress?.();
      await delay(260);
    }
  }

  async playDealer(onProgress) {
    this.state.phase = "DEALER_TURN";
    this.state.message = "莊家翻牌並依規則補牌。";
    onProgress?.();
    await delay(400);
    while (true) {
      const score = scoreHand(this.state.dealer);
      if (score.value > 17 || score.isBust) break;
      if (score.value === 17) break;
      this.state.dealer.cards.push(drawCard(this.state));
      this.synth.play("deal");
      onProgress?.();
      await delay(520);
    }
  }

  settle() {
    this.state.phase = "SETTLEMENT";
    const dealerScore = scoreHand(this.state.dealer);
    const humanResult = settleHand(this.human.hands[0], dealerScore);
    this.human.chips += humanResult.payout;
    const aiLines = this.aiPlayers.map((ai) => {
      const result = settleHand(ai.hands[0], dealerScore);
      ai.chips += result.payout;
      return `${ai.name}：${result.label}（${scoreHand(ai.hands[0]).value} 點）`;
    });
    const won = humanResult.net > 0;
    const records = saveRoundRecord(this.human.chips, won);
    this.synth.play(scoreHand(this.human.hands[0]).isBlackjack ? "blackjack" : won ? "win" : "lose");
    this.state.message = humanResult.label;
    return {
      title: won ? "本局獲勝" : humanResult.net === 0 ? "本局平手" : "本局落敗",
      lines: [
        `玩家：${humanResult.label}，目前籌碼 $${this.human.chips.toLocaleString("en-US")}`,
        `莊家：${dealerScore.isBust ? "爆牌" : `${dealerScore.value} 點`}`,
        `本局損益：${humanResult.net >= 0 ? "+" : ""}$${humanResult.net.toLocaleString("en-US")}`,
        `最高分：$${records.highScore.toLocaleString("en-US")}`,
        ...aiLines
      ]
    };
  }
}

function settleHand(hand, dealerScore) {
  const playerScore = scoreHand(hand);
  const bet = hand.bet;
  if (hand.surrendered) return { label: "投降", payout: 0, net: -Math.ceil(bet / 2) };
  if (playerScore.isBust) return { label: "爆牌", payout: 0, net: -bet };
  if (playerScore.isBlackjack && !dealerScore.isBlackjack) {
    return { label: "Blackjack 3:2", payout: bet + Math.floor(bet * 1.5), net: Math.floor(bet * 1.5) };
  }
  if (dealerScore.isBust) return { label: "莊家爆牌", payout: bet * 2, net: bet };
  if (dealerScore.isBlackjack && !playerScore.isBlackjack) return { label: "莊家 Blackjack", payout: 0, net: -bet };
  if (playerScore.value > dealerScore.value) return { label: "點數較高", payout: bet * 2, net: bet };
  if (playerScore.value < dealerScore.value) return { label: "點數較低", payout: 0, net: -bet };
  return { label: "Push 平手", payout: bet, net: 0 };
}
