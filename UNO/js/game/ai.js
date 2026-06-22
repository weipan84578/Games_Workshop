(function () {
  const AI_CONFIG = {
    easy: {
      thinkDelay: [600, 1200],
      useWildOptimally: false,
      unoCallChance: 0.7,
      preferColors: false,
      avoidHelpPlayer: false,
    },
    normal: {
      thinkDelay: [800, 1500],
      useWildOptimally: true,
      unoCallChance: 0.9,
      preferColors: true,
      avoidHelpPlayer: false,
    },
    hard: {
      thinkDelay: [1000, 2000],
      useWildOptimally: true,
      unoCallChance: 1,
      preferColors: true,
      avoidHelpPlayer: true,
    },
  };

  function colorCounts(hand) {
    return UNO_CONSTANTS.COLORS.reduce((acc, color) => {
      acc[color] = hand.filter((card) => card.color === color).length;
      return acc;
    }, {});
  }

  function chooseColor(hand) {
    const counts = colorCounts(hand);
    return UNO_CONSTANTS.COLORS.slice().sort((a, b) => counts[b] - counts[a])[0] || "red";
  }

  function scoreCard(card, hand, difficulty, context) {
    let score = Rules.getCardScore(card);
    const remaining = hand.length - 1;
    const playerCards = context.playerCards || 7;

    if (card.value === "wild_draw_four") score += 45;
    if (card.value === "draw_two") score += 34;
    if (card.value === "skip") score += 28;
    if (card.value === "reverse") score += 22;
    if (card.value === "wild") score += 18;
    if (card.type === "number") score += Number(card.value) || 0;

    if (remaining <= 2 && card.type !== "wild") score += 12;
    if (difficulty !== "easy" && playerCards <= 2 && ["draw_two", "wild_draw_four", "skip", "reverse"].includes(card.value)) {
      score += 36;
    }
    if (difficulty === "normal" && card.type === "wild" && hand.some((other) => other.id !== card.id && other.type !== "wild")) {
      score -= 14;
    }
    if (difficulty === "hard" && card.type === "wild" && remaining > 2) {
      score -= 8;
    }

    return score;
  }

  const AI = {
    config: AI_CONFIG,

    getThinkDelay(difficulty) {
      const config = AI_CONFIG[difficulty] || AI_CONFIG.normal;
      return Helpers.randomInt(config.thinkDelay[0], config.thinkDelay[1]);
    },

    chooseColor,

    shouldCallUno(difficulty) {
      const config = AI_CONFIG[difficulty] || AI_CONFIG.normal;
      return Math.random() <= config.unoCallChance;
    },

    chooseCard(hand, topCard, currentColor, difficulty, context) {
      const playable = Rules.getPlayableCards(hand, topCard, currentColor);
      if (!playable.length) return null;
      if (difficulty === "easy") {
        return playable[Helpers.randomInt(0, playable.length - 1)];
      }
      return playable
        .slice()
        .sort((a, b) => scoreCard(b, hand, difficulty, context || {}) - scoreCard(a, hand, difficulty, context || {}))[0];
    },
  };

  window.AI = AI;
})();
