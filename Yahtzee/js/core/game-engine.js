window.YZ = window.YZ || {};

YZ.Game = (function () {
  var C = YZ.Constants;
  var subscribers = [];
  var aiRunning = false;

  function notify(event) {
    subscribers.forEach(function (fn) {
      fn(event || { type: "update" });
    });
  }

  function subscribe(fn) {
    subscribers.push(fn);
  }

  function saveIfPlayable() {
    var state = YZ.State.get();
    if (state.turn !== "result") YZ.Save.saveGame(YZ.State.serialize());
  }

  function newGame(difficulty) {
    var state = YZ.State.create(difficulty || (YZ.Settings && YZ.Settings.get("difficulty")) || C.DEFAULT_PREFS.difficulty);
    YZ.Save.saveGame(YZ.State.serialize());
    notify({ type: "new-game", state: state });
    return state;
  }

  function loadGame() {
    var saved = YZ.Save.loadGame();
    if (!saved) return null;
    var state = YZ.State.hydrate(saved);
    notify({ type: "load-game", state: state });
    return state;
  }

  function rollPlayer() {
    var state = YZ.State.get();
    if (state.turn !== "player" || state.rollsLeft <= 0) return false;

    state.dice = YZ.Scoring.hasRolled(state.dice) ? YZ.Dice.reroll(state.dice, state.held) : YZ.Dice.rollSet(C.DICE_COUNT);
    state.rollsLeft -= 1;
    state.savedAt = Date.now();
    if (YZ.Audio) YZ.Audio.playSfx("diceRoll");
    saveIfPlayable();
    notify({ type: "player-roll", dice: state.dice.slice() });
    return true;
  }

  function toggleHold(index) {
    var state = YZ.State.get();
    if (state.turn !== "player" || !YZ.Scoring.hasRolled(state.dice) || state.rollsLeft === C.MAX_ROLLS) return false;
    state.held[index] = !state.held[index];
    if (YZ.Audio) YZ.Audio.playSfx("diceHold");
    saveIfPlayable();
    notify({ type: "hold", index: index });
    return true;
  }

  function clearHolds() {
    var state = YZ.State.get();
    if (state.turn !== "player") return false;
    state.held = YZ.State.freshHeld();
    saveIfPlayable();
    notify({ type: "clear-holds" });
    return true;
  }

  function scorePlayer(key) {
    var state = YZ.State.get();
    if (state.turn !== "player") return false;
    if (!YZ.Scoring.hasRolled(state.dice)) return false;
    if (state.score.player[key] !== null) return false;

    var preview = YZ.Scoring.applyScore(state.score.player, key, state.dice);
    state.held = YZ.State.freshHeld();
    state.savedAt = Date.now();
    if (YZ.Audio) {
      YZ.Audio.playSfx(preview.bonus || key === "yahtzee" && preview.base === C.YAHTZEE_POINTS ? "yahtzee" : "score");
    }

    if (YZ.Scoring.isComplete(state.score.player) && YZ.Scoring.isComplete(state.score.ai)) {
      finalizeGame();
      return true;
    }

    state.turn = "ai";
    state.aiLog = [];
    saveIfPlayable();
    notify({ type: "player-score", key: key, preview: preview });
    runAiTurn();
    return true;
  }

  function aiDelay() {
    var speed = YZ.Settings ? Number(YZ.Settings.get("aiSpeed")) : C.DEFAULT_PREFS.aiSpeed;
    speed = Math.max(0, Math.min(1, speed));
    return Math.round(980 - speed * 720);
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function getAiStrategy() {
    var state = YZ.State.get();
    var ai = YZ.AI || {};
    return ai[state.difficulty] || ai.normal || ai.easy;
  }

  async function runAiTurn() {
    if (aiRunning) return false;
    var state = YZ.State.get();
    if (state.turn !== "ai") return false;
    var strategy = getAiStrategy();
    if (!strategy) return false;

    aiRunning = true;
    YZ.State.resetTurn("ai");
    state = YZ.State.get();
    state.aiLog = [YZ.I18n.t("game.aiThinking")];
    notify({ type: "ai-start" });
    await wait(aiDelay());

    while (state.turn === "ai" && state.rollsLeft > 0) {
      state.dice = YZ.Scoring.hasRolled(state.dice) ? YZ.Dice.reroll(state.dice, state.held) : YZ.Dice.rollSet(C.DICE_COUNT);
      state.rollsLeft -= 1;
      state.aiLog.unshift(YZ.I18n.t("game.aiRolled", { dice: YZ.Dice.faceString(state.dice) }));
      if (YZ.Audio) YZ.Audio.playSfx("diceRoll");
      notify({ type: "ai-roll", dice: state.dice.slice() });
      await wait(aiDelay());

      if (state.rollsLeft <= 0) break;
      var decision = strategy.selectHolds(state.dice.slice(), state.score.ai, state.rollsLeft, state);
      state.held = decision.held || YZ.State.freshHeld();
      if (state.held.some(Boolean)) {
        state.aiLog.unshift(YZ.I18n.t("game.aiHeld", {
          dice: state.dice.filter(function (_, index) { return state.held[index]; }).map(function (value) {
            return C.DIE_FACES[value];
          }).join(" ")
        }));
      }
      notify({ type: "ai-hold", held: state.held.slice() });
      if (decision.stop || strategy.shouldStop && strategy.shouldStop(state.dice.slice(), state.score.ai, state.rollsLeft, state)) break;
      await wait(Math.max(120, Math.round(aiDelay() * 0.55)));
    }

    var category = strategy.chooseCategory(state.dice.slice(), state.score.ai, state) || YZ.Scoring.bestAvailable(state.dice, state.score.ai).key;
    var preview = YZ.Scoring.applyScore(state.score.ai, category, state.dice);
    state.aiLog.unshift(YZ.I18n.t("game.aiChose", {
      category: YZ.I18n.t("score." + category),
      points: preview.total
    }));
    if (YZ.Audio) YZ.Audio.playSfx(preview.bonus || category === "yahtzee" && preview.base === C.YAHTZEE_POINTS ? "yahtzee" : "score");

    if (YZ.Scoring.isComplete(state.score.player) && YZ.Scoring.isComplete(state.score.ai)) {
      finalizeGame();
    } else {
      state.round = Math.min(C.TOTAL_ROUNDS, YZ.Scoring.filledCount(state.score.player) + 1);
      YZ.State.resetTurn("player");
      state = YZ.State.get();
      saveIfPlayable();
    }

    aiRunning = false;
    notify({ type: "ai-score", key: category, preview: preview });
    return true;
  }

  function finalizeGame() {
    var state = YZ.State.get();
    var player = YZ.Scoring.totals(state.score.player).grandTotal;
    var ai = YZ.Scoring.totals(state.score.ai).grandTotal;
    var outcome = player > ai ? "win" : ai > player ? "lose" : "draw";
    state.turn = "result";
    state.result = {
      outcome: outcome,
      player: player,
      ai: ai,
      finishedAt: Date.now()
    };
    state.rollsLeft = 0;
    state.held = YZ.State.freshHeld();
    YZ.Save.clearGame();
    if (YZ.Audio) YZ.Audio.playBgm(outcome === "win" ? "win" : "lose", { boost: 1, fade: 250 });
    if (YZ.Audio) YZ.Audio.playSfx(outcome === "win" ? "win" : "lose");
    notify({ type: "result", result: state.result });
  }

  function bestHint() {
    var state = YZ.State.get();
    if (!YZ.Scoring.hasRolled(state.dice)) return null;
    return YZ.Scoring.bestAvailable(state.dice, state.score.player);
  }

  function scoreBest() {
    var best = bestHint();
    if (!best) return false;
    return scorePlayer(best.key);
  }

  function resumeIfNeeded() {
    var state = YZ.State.get();
    if (state.turn === "ai") runAiTurn();
  }

  return {
    subscribe: subscribe,
    notify: notify,
    newGame: newGame,
    loadGame: loadGame,
    rollPlayer: rollPlayer,
    toggleHold: toggleHold,
    clearHolds: clearHolds,
    scorePlayer: scorePlayer,
    scoreBest: scoreBest,
    bestHint: bestHint,
    runAiTurn: runAiTurn,
    resumeIfNeeded: resumeIfNeeded,
    saveIfPlayable: saveIfPlayable
  };
})();
