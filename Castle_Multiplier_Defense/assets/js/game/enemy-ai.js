(function (root) {
    "use strict";
    var cg = root.CastleGame = root.CastleGame || {};
    var AI = cg.EnemyAI = {};
    AI.create = function (battle) {
        return {
            timer: 1.4,
            update: function (dt) {
                this.timer -= dt;
                if (this.timer > 0 || !battle.active) return;
                var modifier = cg.Difficulty.get(root.GameState.settings.difficulty);
                this.timer = Math.max(.65, battle.levelData.enemyPace * cg.Constants.ENEMY_FIRE_RATE * modifier.enemyFireRate);
                battle.fireEnemy(this.chooseAim(modifier.aiError));
            },
            chooseAim: function (error) {
                var target = battle.getPlayerOrigin();
                var gateBias = battle.gates.length ? cg.Utils.choose(battle.gates) : null;
                if (gateBias && root.GameState.settings.difficulty === "hard") {
                    var rect = cg.Gate.rect(gateBias);
                    if (battle.orientation === "portrait") target.x = rect.x + rect.w / 2;
                    else target.y = rect.y + rect.h / 2;
                }
                target.x = cg.Utils.clamp(target.x + cg.Utils.rand(-error, error), .08, .92);
                target.y = cg.Utils.clamp(target.y + cg.Utils.rand(-error, error), .08, .92);
                return target;
            }
        };
    };
}(window));
