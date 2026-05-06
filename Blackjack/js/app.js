(function () {
  "use strict";

  const SETTINGS_KEY = "blackjack_settings";
  const RECORDS_KEY = "blackjack_records";
  const DEFAULT_SETTINGS = {
    aiCount: 1,
    difficulty: "normal",
    deckCount: 6,
    startingChips: 1000,
    musicVolume: 0.8,
    sfxVolume: 0.6
  };
  const DEFAULT_RECORDS = {
    highScore: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    leaderboard: []
  };
  const SUITS = [
    { id: "spades", symbol: "♠", color: "black" },
    { id: "hearts", symbol: "♥", color: "red" },
    { id: "diamonds", symbol: "♦", color: "red" },
    { id: "clubs", symbol: "♣", color: "black" }
  ];
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
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

  function readJson(key, fallback) {
    try {
      return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") };
    } catch {
      return { ...fallback };
    }
  }

  function loadSettings() {
    return readJson(SETTINGS_KEY, DEFAULT_SETTINGS);
  }

  function saveSettings(settings) {
    const next = {
      aiCount: Number(settings.aiCount),
      difficulty: settings.difficulty,
      deckCount: Number(settings.deckCount),
      startingChips: Number(settings.startingChips),
      musicVolume: Number(settings.musicVolume),
      sfxVolume: Number(settings.sfxVolume),
      lastUpdated: Date.now()
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return next;
  }

  function loadRecords() {
    const records = readJson(RECORDS_KEY, DEFAULT_RECORDS);
    records.leaderboard = Array.isArray(records.leaderboard) ? records.leaderboard : [];
    return records;
  }

  function saveRoundRecord(score, won) {
    const records = loadRecords();
    records.gamesPlayed += 1;
    records.gamesWon += won ? 1 : 0;
    records.highScore = Math.max(records.highScore, score);
    records.leaderboard = [
      { score, date: new Date().toISOString().slice(0, 10) },
      ...records.leaderboard
    ].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return records;
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function createDeck(deckCount) {
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

  function updateCount(state, card) {
    if (["2", "3", "4", "5", "6"].includes(card.rank)) state.runningCount += 1;
    if (["10", "J", "Q", "K", "A"].includes(card.rank)) state.runningCount -= 1;
  }

  function drawCard(state) {
    if (state.deck.length < 18) {
      state.deck = createDeck(state.settings.deckCount);
      state.runningCount = 0;
    }
    const card = state.deck.pop();
    updateCount(state, card);
    return card;
  }

  function createHand(bet = 0) {
    return {
      cards: [],
      bet,
      stood: false,
      surrendered: false,
      doubled: false
    };
  }

  function getCardPoints(card) {
    if (["J", "Q", "K"].includes(card.rank)) return 10;
    if (card.rank === "A") return 11;
    return Number(card.rank);
  }

  function scoreHand(hand) {
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

  function createPlayer({ id, name, isHuman = false, chips = 1000 }) {
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

  function resetForRound(player) {
    player.bet = 0;
    player.hands = [createHand()];
    player.activeHandIndex = 0;
    player.status = "waiting";
  }

  const AI_NAMES = [
    { name: "Victor", style: "穩健派" },
    { name: "Luna", style: "注重 Double" },
    { name: "Blaze", style: "高風險叫牌" }
  ];

  function aiProfile(index) {
    return AI_NAMES[index] || { name: `AI ${index + 1}`, style: "標準策略" };
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

  function decideAiAction({ hand, dealerUpCard, difficulty, runningCount, deckRemaining }) {
    const score = scoreHand(hand);
    const dealerValue = dealerRankValue(dealerUpCard);
    if (score.isBust || score.value >= 21) return "stand";
    if (difficulty === "easy") return score.value < 15 ? "hit" : "stand";
    const trueCount = deckRemaining > 0 ? runningCount / Math.max(1, deckRemaining / 52) : 0;
    if (difficulty === "hard" && trueCount >= 2 && score.value === 16 && dealerValue <= 3) return "stand";
    if (score.isSoft) return softStrategy(score.value, dealerValue);
    return hardStrategy(score.value, dealerValue);
  }

  class Synth {
    constructor() {
      this.context = null;
      this.master = null;
      this.sfx = null;
      this.music = null;
    }

    async init(settings) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (!this.context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContextClass();
        this.master = this.context.createGain();
        this.sfx = this.context.createGain();
        this.music = this.context.createGain();
        this.sfx.connect(this.master);
        this.music.connect(this.master);
        this.master.connect(this.context.destination);
      }
      await this.context.resume();
      this.setVolumes(settings);
    }

    setVolumes(settings) {
      if (!this.context) return;
      this.master.gain.value = 1;
      this.sfx.gain.value = Number(settings.sfxVolume ?? 0.6);
      this.music.gain.value = Number(settings.musicVolume ?? 0.8) * 0.28;
    }

    play(type) {
      if (!this.context) return;
      const map = {
        deal: [420, 0.08, "triangle"],
        chip: [260, 0.16, "square"],
        win: [660, 0.5, "sine"],
        lose: [160, 0.35, "sawtooth"],
        blackjack: [880, 0.8, "triangle"],
        button: [520, 0.06, "sine"]
      };
      const [freq, duration, wave] = map[type] || map.button;
      this.tone(freq, duration, wave, this.sfx);
      if (type === "blackjack") {
        window.setTimeout(() => this.tone(1320, 0.35, "triangle", this.sfx), 120);
      }
    }

    tone(freq, duration, wave, output) {
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(output);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    }
  }

  class Music {
    constructor(synth) {
      this.synth = synth;
      this.timer = null;
      this.step = 0;
      this.notes = [65.41, 82.41, 98, 123.47, 110, 98, 82.41, 73.42];
    }

    start() {
      if (this.timer || !this.synth.context) return;
      this.timer = window.setInterval(() => {
        const note = this.notes[this.step % this.notes.length];
        this.synth.tone(note, 0.18, "sine", this.synth.music);
        if (this.step % 4 === 0) this.synth.tone(note * 3, 0.12, "triangle", this.synth.music);
        this.step += 1;
      }, 667);
    }
  }

  class GameEngine {
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
      if (!["IDLE", "BETTING"].includes(this.state.phase) || this.human.chips < amount) return;
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
        const wager = Math.min(ai.chips, [50, 100, 150][index] || 50);
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
        if (score.value >= 17 || score.isBust) break;
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

  class ScreenManager {
    constructor() {
      this.screens = [...document.querySelectorAll(".screen")];
    }

    show(name) {
      this.screens.forEach((screen) => {
        screen.classList.toggle("is-active", screen.id === `${name}-screen`);
      });
    }
  }

  class Renderer {
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
      if (typeof this.nodes.modal.showModal === "function") {
        if (!this.nodes.modal.open) this.nodes.modal.showModal();
      } else {
        this.nodes.modal.setAttribute("open", "");
      }
    }

    closeSettlement() {
      if (this.nodes.modal.open && typeof this.nodes.modal.close === "function") {
        this.nodes.modal.close();
      } else {
        this.nodes.modal.removeAttribute("open");
      }
    }
  }

  function renderHand(cards, hideSecond = false) {
    return cards.map((card, index) => renderCard(card, hideSecond && index === 1)).join("");
  }

  function renderCard(card, hidden) {
    if (hidden) return `<div class="playing-card is-hidden" aria-label="hidden card"></div>`;
    const red = card.color === "red" ? " is-red" : "";
    return `<div class="playing-card${red}" aria-label="${card.rank} ${card.symbol}">
      <div class="card-corner"><span>${card.rank}</span><span>${card.symbol}</span></div>
      <div class="card-center">${renderCenter(card)}</div>
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

  function money(value) {
    return `$${Number(value).toLocaleString("en-US")}`;
  }

  const synth = new Synth();
  const music = new Music(synth);
  const screens = new ScreenManager();
  let settings = loadSettings();
  let engine = new GameEngine(settings, synth);
  let renderer = new Renderer(engine);

  bindNavigation();
  bindGameControls();
  bindSettings();
  renderRecords();
  renderer.render();

  function bindNavigation() {
    document.addEventListener("click", async (event) => {
      const nav = event.target.closest("[data-nav]");
      if (!nav) return;
      await unlockAudio();
      const target = nav.dataset.nav;
      renderer.closeSettlement();
      if (target === "game") {
        engine.prepareBetting();
        renderer.render();
      }
      if (target === "leaderboard") renderRecords();
      screens.show(target);
      synth.play("button");
    });
  }

  function bindGameControls() {
    document.querySelector("#chip-buttons").addEventListener("click", (event) => {
      const chip = event.target.closest("[data-chip]");
      if (!chip) return;
      engine.addBet(Number(chip.dataset.chip));
      renderer.render();
    });
    document.querySelector("#clear-bet-btn").addEventListener("click", () => {
      engine.clearBet();
      renderer.render();
    });
    document.querySelector("#deal-btn").addEventListener("click", async () => {
      await unlockAudio();
      await engine.deal();
      renderer.render();
      await maybeAutoAdvance();
    });
    document.querySelector("#hit-btn").addEventListener("click", async () => {
      const done = engine.hitHuman();
      renderer.render();
      if (done) await advanceAfterHuman();
    });
    document.querySelector("#stand-btn").addEventListener("click", async () => {
      engine.standHuman();
      renderer.render();
      await advanceAfterHuman();
    });
    document.querySelector("#double-btn").addEventListener("click", async () => {
      const done = engine.doubleHuman();
      renderer.render();
      if (done) await advanceAfterHuman();
    });
    document.querySelector("#surrender-btn").addEventListener("click", async () => {
      engine.surrenderHuman();
      renderer.render();
      await advanceAfterHuman();
    });
    document.querySelector("#next-round-btn").addEventListener("click", () => {
      renderer.closeSettlement();
      engine.prepareBetting();
      renderer.render();
    });
  }

  async function maybeAutoAdvance() {
    const score = scoreHand(engine.human.hands[0]);
    if (score.isBlackjack || score.value === 21) {
      engine.standHuman();
      renderer.render();
      await advanceAfterHuman();
    }
  }

  async function advanceAfterHuman() {
    await engine.playAiTurns(() => renderer.render());
    await engine.playDealer(() => renderer.render());
    const summary = engine.settle();
    renderer.render();
    renderRecords();
    renderer.showSettlement(summary);
  }

  function bindSettings() {
    const form = document.querySelector("#settings-form");
    fillSettingsForm(form, settings);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      settings = saveSettings(Object.fromEntries(new FormData(form)));
      synth.setVolumes(settings);
      engine = new GameEngine(settings, synth);
      renderer = new Renderer(engine);
      renderer.render();
      screens.show("home");
    });
  }

  function fillSettingsForm(form, nextSettings) {
    for (const [key, value] of Object.entries(nextSettings)) {
      if (form.elements[key]) form.elements[key].value = String(value);
    }
  }

  function renderRecords() {
    const records = loadRecords();
    document.querySelector("#home-high-score").textContent = money(records.highScore);
    document.querySelector("#games-played").textContent = String(records.gamesPlayed);
    document.querySelector("#games-won").textContent = String(records.gamesWon);
    const list = document.querySelector("#leaderboard-list");
    list.innerHTML = records.leaderboard.length
      ? records.leaderboard.map((row) => `<li>${money(row.score)} · ${row.date}</li>`).join("")
      : "<li>尚無紀錄</li>";
  }

  async function unlockAudio() {
    await synth.init(settings);
    music.start();
  }
}());
