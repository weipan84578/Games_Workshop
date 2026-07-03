(function () {
  window.SicBo = window.SicBo || {};

  const DEFAULT_BALANCE = 10000;
  const ROLL_DURATION_MS = 2100;

  function createGameEngine(deps) {
    const engine = {
      betting: window.SicBo.BettingLogic.create({ balance: DEFAULT_BALANCE }),
      history: [],
      phase: "menu",
      result: null,
      round: 1
    };

    function render() {
      if (deps.renderer) deps.renderer.render(engine);
    }

    function toast(message, type) {
      if (deps.modals) deps.modals.toast(message, type);
    }

    function settings() {
      return deps.settings ? deps.settings.get() : {};
    }

    function save() {
      if (!deps.storage) return;
      deps.storage.saveGame({
        balance: engine.betting.state.balance,
        lastBets: engine.betting.state.lastBets,
        roundHistory: engine.history,
        language: settings().language,
        theme: settings().theme,
        bgmVolume: settings().bgmVolume,
        sfxVolume: settings().sfxVolume,
        vibration: settings().vibration,
        lastSavedAt: new Date().toISOString()
      });
    }

    function vibrate(pattern) {
      const opts = settings();
      if (opts.vibration && window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(pattern);
      }
    }

    function startNewGame() {
      engine.betting = window.SicBo.BettingLogic.create({ balance: DEFAULT_BALANCE });
      engine.history = [];
      engine.phase = "betting";
      engine.result = null;
      engine.round = 1;
      save();
      render();
    }

    function loadGame(saved) {
      engine.betting = window.SicBo.BettingLogic.create({
        balance: Number(saved.balance) || DEFAULT_BALANCE,
        lastBets: saved.lastBets || []
      });
      engine.history = Array.isArray(saved.roundHistory) ? saved.roundHistory.slice(0, 10) : [];
      engine.phase = "betting";
      engine.result = null;
      engine.round = engine.history.length + 1;
      render();
    }

    function selectChip(value) {
      engine.betting.setSelectedChip(value);
      render();
    }

    function placeBet(id) {
      const placed = engine.betting.placeBet(id);
      if (!placed.ok) {
        toast(window.SicBo.I18n.t(placed.reason === "insufficient" ? "game.insufficientBalance" : "game.noBets"), "warning");
        return;
      }
      if (deps.audio) deps.audio.playSFX("chip");
      vibrate(16);
      toast(window.SicBo.I18n.t("game.betPlaced", {
        amount: window.SicBo.Format.money(placed.amount),
        name: window.SicBo.I18n.betName(placed.bet)
      }), "success");
      render();
    }

    function undoBet() {
      if (engine.betting.undoLastBet()) {
        if (deps.audio) deps.audio.playSFX("button");
        toast(window.SicBo.I18n.t("game.betUndone"), "success");
        render();
      }
    }

    function clearBets() {
      if (engine.betting.clearCurrentBets() > 0) {
        if (deps.audio) deps.audio.playSFX("button");
        toast(window.SicBo.I18n.t("game.betsCleared"), "success");
        render();
      }
    }

    function repeatBets() {
      const repeated = engine.betting.repeatBets();
      if (!repeated.ok) {
        toast(window.SicBo.I18n.t(repeated.reason === "insufficient" ? "game.insufficientBalance" : "game.noLastBets"), "warning");
        return;
      }
      if (deps.audio) deps.audio.playSFX("chip");
      toast(window.SicBo.I18n.t("game.betPlaced", {
        amount: window.SicBo.Format.money(repeated.amount),
        name: window.SicBo.I18n.t("game.repeatBet")
      }), "success");
      render();
    }

    function confirmBets() {
      if (engine.betting.getBetTotal() <= 0) {
        toast(window.SicBo.I18n.t("game.noBets"), "warning");
        return false;
      }
      engine.betting.lock();
      engine.phase = "locked";
      if (deps.audio) deps.audio.playSFX("button");
      toast(window.SicBo.I18n.t("game.betsLocked"), "success");
      render();
      return true;
    }

    function finishRound(dice, placedBets) {
      const settlement = window.SicBo.PayoutCalculator.settleBets(placedBets, dice);
      engine.betting.state.balance += settlement.returnAmount;
      engine.betting.state.lastBets = window.SicBo.BettingLogic.betsToArray(placedBets);
      engine.betting.state.currentBets = {};
      engine.betting.state.betStack = [];
      engine.betting.unlock();
      engine.phase = "betting";
      engine.result = settlement;
      engine.history.unshift({
        dice: dice.slice(),
        total: settlement.stats.total,
        won: settlement.returnAmount > 0,
        payout: settlement.returnAmount,
        at: new Date().toISOString()
      });
      engine.history = engine.history.slice(0, 10);
      engine.round += 1;
      save();
      render();
      if (deps.audio) deps.audio.playSFX(settlement.returnAmount > settlement.stake * 8 ? "winBig" : settlement.returnAmount > 0 ? "winSmall" : "lose");
      vibrate(settlement.returnAmount > 0 ? [30, 40, 30] : 20);
      if (deps.modals) deps.modals.showResult(engine, settlement);
      toast(window.SicBo.I18n.t("game.autoSaved"), "success");
    }

    function rollRound() {
      if (engine.phase === "rolling") return;
      if (engine.betting.getBetTotal() <= 0) {
        toast(window.SicBo.I18n.t("game.noBets"), "warning");
        return;
      }
      if (!engine.betting.state.locked && !confirmBets()) return;

      const placedBets = engine.betting.getCurrentBetsObject();
      engine.phase = "rolling";
      engine.result = null;
      if (deps.audio) deps.audio.playSFX("diceShake");
      toast(window.SicBo.I18n.t("game.rolling"), "warning");
      render();

      window.setTimeout(function () {
        const dice = window.SicBo.DiceRoller.rollDice();
        if (deps.audio) deps.audio.playSFX("diceLand");
        finishRound(dice, placedBets);
      }, ROLL_DURATION_MS);
    }

    return {
      clearBets: clearBets,
      confirmBets: confirmBets,
      engine: engine,
      getSavePayload: save,
      loadGame: loadGame,
      placeBet: placeBet,
      render: render,
      repeatBets: repeatBets,
      rollRound: rollRound,
      selectChip: selectChip,
      startNewGame: startNewGame,
      undoBet: undoBet
    };
  }

  window.SicBo.GameEngine = {
    create: createGameEngine
  };
})();
