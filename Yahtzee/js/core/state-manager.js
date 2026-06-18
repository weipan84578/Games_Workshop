window.YZ = window.YZ || {};

YZ.State = (function () {
  var C = YZ.Constants;
  var state = null;

  function freshDice() {
    return Array(C.DICE_COUNT).fill(0);
  }

  function freshHeld() {
    return Array(C.DICE_COUNT).fill(false);
  }

  function create(difficulty) {
    state = {
      version: C.VERSION,
      difficulty: difficulty || C.DEFAULT_PREFS.difficulty,
      round: 1,
      turn: "player",
      rollsLeft: C.MAX_ROLLS,
      dice: freshDice(),
      held: freshHeld(),
      score: {
        player: YZ.Scoring.emptyScoreSheet(),
        ai: YZ.Scoring.emptyScoreSheet()
      },
      aiLog: [],
      result: null,
      savedAt: Date.now()
    };
    return state;
  }

  function ensure() {
    if (!state) create(C.DEFAULT_PREFS.difficulty);
    return state;
  }

  function get() {
    return ensure();
  }

  function resetTurn(side) {
    var s = ensure();
    s.turn = side;
    s.rollsLeft = C.MAX_ROLLS;
    s.dice = freshDice();
    s.held = freshHeld();
    s.aiLog = side === "ai" ? [] : s.aiLog;
    s.savedAt = Date.now();
  }

  function touch() {
    ensure().savedAt = Date.now();
  }

  function serialize() {
    return JSON.parse(JSON.stringify(ensure()));
  }

  function hydrate(input) {
    if (!input || input.version !== C.VERSION) return null;
    state = {
      version: C.VERSION,
      difficulty: C.DIFFICULTIES.indexOf(input.difficulty) === -1 ? C.DEFAULT_PREFS.difficulty : input.difficulty,
      round: Math.max(1, Math.min(C.TOTAL_ROUNDS, Number(input.round || 1))),
      turn: C.PLAYERS.indexOf(input.turn) === -1 && input.turn !== "result" ? "player" : input.turn,
      rollsLeft: Math.max(0, Math.min(C.MAX_ROLLS, Number(input.rollsLeft === undefined ? C.MAX_ROLLS : input.rollsLeft))),
      dice: Array.isArray(input.dice) && input.dice.length === C.DICE_COUNT ? input.dice.map(Number) : freshDice(),
      held: Array.isArray(input.held) && input.held.length === C.DICE_COUNT ? input.held.map(Boolean) : freshHeld(),
      score: {
        player: YZ.Scoring.normalizeScoreSheet(input.score && input.score.player),
        ai: YZ.Scoring.normalizeScoreSheet(input.score && input.score.ai)
      },
      aiLog: Array.isArray(input.aiLog) ? input.aiLog.slice(-5) : [],
      result: input.result || null,
      savedAt: Number(input.savedAt || Date.now())
    };
    return state;
  }

  return {
    create: create,
    get: get,
    resetTurn: resetTurn,
    touch: touch,
    serialize: serialize,
    hydrate: hydrate,
    freshDice: freshDice,
    freshHeld: freshHeld
  };
})();
