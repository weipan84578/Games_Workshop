(function () {
  window.EAE = window.EAE || {};

  function emptyLasts() {
    return {
      player: { roll: null, event: null },
      ai: { roll: null, event: null }
    };
  }

  class GameEngine {
    constructor(options) {
      this.boardData = options.boardData;
      this.saveManager = options.saveManager;
      this.reset();
    }

    reset() {
      this.state = {
        playerPos: 1,
        aiPos: 1,
        currentTurn: "player",
        round: 1,
        difficulty: "normal",
        log: [],
        lasts: emptyLasts(),
        winner: null
      };
    }

    startNew(difficulty) {
      this.reset();
      this.state.difficulty = difficulty || "normal";
      this.saveManager.saveGame(this.getSnapshot());
      return this.state;
    }

    load(save) {
      this.state = Object.assign({
        playerPos: 1,
        aiPos: 1,
        currentTurn: "player",
        round: 1,
        difficulty: "normal",
        log: [],
        lasts: emptyLasts(),
        winner: null
      }, save || {});
      this.state.lasts = Object.assign(emptyLasts(), this.state.lasts || {});
      return this.state;
    }

    getSnapshot() {
      return {
        playerPos: this.state.playerPos,
        aiPos: this.state.aiPos,
        currentTurn: this.state.currentTurn,
        round: this.state.round,
        difficulty: this.state.difficulty,
        log: this.state.log.slice(0, 20),
        lasts: this.state.lasts,
        winner: this.state.winner
      };
    }

    getPosition(actor) {
      return actor === "player" ? this.state.playerPos : this.state.aiPos;
    }

    async applyTurn(actor, roll, hooks) {
      const start = this.getPosition(actor);
      const rawTarget = start + roll;
      const result = {
        actor: actor,
        round: this.state.round,
        roll: roll,
        start: start,
        target: start,
        event: { type: "normal", target: start },
        winner: null
      };

      if (rawTarget > 100) {
        result.event = { type: "bounce", target: start };
      } else {
        if (hooks && hooks.move) await hooks.move(actor, start, rawTarget);
        result.target = rawTarget;
        result.event = { type: "normal", target: rawTarget };
        this._setPosition(actor, rawTarget);

        const transfer = this.boardData.getTransfer(rawTarget);
        if (transfer) {
          if (hooks && hooks.transfer) await hooks.transfer(actor, rawTarget, transfer.end, transfer.type);
          this._setPosition(actor, transfer.end);
          result.target = transfer.end;
          result.event = { type: transfer.type, target: transfer.end, id: transfer.id };
        }

        if (this.getPosition(actor) === 100) {
          result.target = 100;
          result.event = { type: "exact100", target: 100 };
          result.winner = actor;
          this.state.winner = actor;
        }
      }

      this.state.lasts[actor] = { roll: roll, event: result.event };
      this._pushLog(result);

      if (!this.state.winner) {
        this.state.currentTurn = actor === "player" ? "ai" : "player";
        if (actor === "ai") this.state.round += 1;
        this.saveManager.saveGame(this.getSnapshot());
      } else {
        this.saveManager.recordResult(actor, this.state.difficulty, this.state.round);
        this.saveManager.clearSave();
      }

      return result;
    }

    _setPosition(actor, position) {
      if (actor === "player") this.state.playerPos = position;
      else this.state.aiPos = position;
    }

    _pushLog(result) {
      this.state.log.unshift({
        actor: result.actor,
        round: result.round,
        roll: result.roll,
        target: result.target,
        event: result.event
      });
      this.state.log = this.state.log.slice(0, 20);
    }
  }

  window.EAE.GameEngine = GameEngine;
})();
