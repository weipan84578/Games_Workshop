(function (Game) {
  "use strict";

  Game.TestData = Object.freeze({
    validLeaderboardEntry: function (id, score) {
      return {
        id: id,
        name: "Tester",
        score: score,
        height: 100,
        bestCombo: 4,
        collected: 3,
        theme: "pastel-sky",
        createdAt: new Date(2026, 0, 1).toISOString(),
      };
    },
  });
})(window.DJGame);
