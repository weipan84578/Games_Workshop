(function (ns) {
  "use strict";

  function immediateScoreForMove(model, move) {
    return ns.BoardModel.getAdjacentBoxes(model, move).filter(function (box) {
      return !model.boxes[box.row][box.col].owner && ns.BoardModel.countBoxSides(model, box.row, box.col) === 3;
    });
  }

  function simulate(model, move, owner) {
    var copy = ns.BoardModel.clone(model);
    ns.BoardModel.setLine(copy, move, owner || "player");
    return copy;
  }

  var RulesValidator = {
    isMoveInside: function (model, move) {
      var normalized = ns.BoardModel.normalizeMove(move);
      if (!normalized) {
        return false;
      }
      if (normalized.type === "h") {
        return normalized.row >= 0 && normalized.row <= model.rows && normalized.col >= 0 && normalized.col < model.cols;
      }
      if (normalized.type === "v") {
        return normalized.row >= 0 && normalized.row < model.rows && normalized.col >= 0 && normalized.col <= model.cols;
      }
      return false;
    },

    isLegalMove: function (model, move, actor) {
      if (!model || model.status !== "playing" || actor !== model.currentTurn || !this.isMoveInside(model, move)) {
        return false;
      }
      var line = ns.BoardModel.getLine(model, move);
      return Boolean(line && !line.owner);
    },

    getBoxesCompletedByMove: immediateScoreForMove,

    classifyMove: function (model, move) {
      var scoringBoxes = immediateScoreForMove(model, move);
      var copy = simulate(model, move, "probe");
      var adjacentThreats = ns.BoardModel.getAdjacentBoxes(copy, move).filter(function (box) {
        return !copy.boxes[box.row][box.col].owner && ns.BoardModel.countBoxSides(copy, box.row, box.col) === 3;
      }).length;
      return {
        move: move,
        completedCount: scoringBoxes.length,
        threatCount: adjacentThreats,
        isScoring: scoringBoxes.length > 0,
        isSafe: scoringBoxes.length > 0 || adjacentThreats === 0
      };
    },

    getScoringMoves: function (model) {
      return ns.BoardModel.getLegalMoves(model).filter(function (move) {
        return immediateScoreForMove(model, move).length > 0;
      });
    },

    getSafeMoves: function (model) {
      return ns.BoardModel.getLegalMoves(model).filter(function (move) {
        return RulesValidator.classifyMove(model, move).isSafe && immediateScoreForMove(model, move).length === 0;
      });
    },

    getDangerCost: function (model, move) {
      var copy = simulate(model, move, "probe");
      return ns.BoardModel.getLegalMoves(copy).reduce(function (maxScore, nextMove) {
        return Math.max(maxScore, immediateScoreForMove(copy, nextMove).length);
      }, 0);
    }
  };

  ns.RulesValidator = RulesValidator;
})(window.DAB = window.DAB || {});
