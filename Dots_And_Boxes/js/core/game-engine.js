(function (ns) {
  "use strict";

  function GameEngine() {
    this.model = null;
    this.events = new ns.EventEmitter();
  }

  GameEngine.prototype.startNew = function (options) {
    var size = Number(options.size || 4);
    this.model = ns.BoardModel.create(size, size, {
      difficulty: options.difficulty || "normal",
      firstPlayer: options.firstPlayer || "player"
    });
    this.events.emit("statechange", this.model);
    return this.model;
  };

  GameEngine.prototype.restore = function (saved) {
    this.model = ns.BoardModel.hydrate(saved);
    this.events.emit("statechange", this.model);
    return this.model;
  };

  GameEngine.prototype.getState = function () {
    return this.model;
  };

  GameEngine.prototype.playMove = function (move, actor) {
    if (!this.model) {
      return { ok: false, reason: "missing-model" };
    }
    var normalized = ns.BoardModel.normalizeMove(move);
    if (!ns.RulesValidator.isLegalMove(this.model, normalized, actor)) {
      return { ok: false, reason: "illegal-move" };
    }

    var completedBoxes = ns.RulesValidator.getBoxesCompletedByMove(this.model, normalized);
    ns.BoardModel.setLine(this.model, normalized, actor);
    completedBoxes.forEach(function (box) {
      this.model.boxes[box.row][box.col].owner = actor;
      this.model.scores[actor] += 1;
    }, this);

    this.model.moveHistory.push({
      move: normalized,
      actor: actor,
      completedBoxes: completedBoxes,
      scores: ns.BoardModel.clone(this.model.scores),
      at: Date.now()
    });

    if (ns.BoardModel.isComplete(this.model)) {
      this.model.status = "finished";
    } else if (completedBoxes.length === 0) {
      this.model.currentTurn = actor === "player" ? "ai" : "player";
    }

    var result = {
      ok: true,
      move: normalized,
      actor: actor,
      completedBoxes: completedBoxes,
      extraTurn: completedBoxes.length > 0,
      status: this.model.status
    };
    this.events.emit("move", result);
    this.events.emit("statechange", this.model);
    return result;
  };

  ns.GameEngine = GameEngine;
})(window.DAB = window.DAB || {});
