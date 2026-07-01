(function (ns) {
  "use strict";

  ns.AIController = {
    chooseMove: function (model, difficulty) {
      if (difficulty === "hard") {
        return ns.AIHard.chooseMove(model);
      }
      if (difficulty === "easy") {
        return ns.AIEasy.chooseMove(model);
      }
      return ns.AINormal.chooseMove(model);
    },

    getDelay: function (difficulty) {
      var config = ns.Constants.DIFFICULTIES[difficulty] || ns.Constants.DIFFICULTIES.normal;
      return ns.MathUtils.randomInt(config.delayMin, config.delayMax);
    }
  };
})(window.DAB = window.DAB || {});
