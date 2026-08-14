(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var AI = (cg.EnemyAI = {});

  AI.create = function (battle) {
    return {
      chooseAim: function () {
        var modifier = cg.Difficulty.get(root.GameState.settings.difficulty);
        var target = battle.getPlayerOrigin();
        var gate = battle.gates.length ? cg.Utils.choose(battle.gates) : null;
        var error = modifier.aiError;

        if (gate) {
          if (battle.orientation === "portrait") target.x = gate.x;
          else target.y = gate.y;
        }

        return {
          x: cg.Utils.clamp(
            target.x + cg.Utils.rand(-error, error),
            0.08,
            0.92,
          ),
          y: cg.Utils.clamp(
            target.y + cg.Utils.rand(-error, error),
            0.08,
            0.92,
          ),
        };
      },
    };
  };
})(window);
