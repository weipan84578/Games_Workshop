(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Castle = (cg.Castle = {});
  Castle.create = function (side, level, difficulty, inherited) {
    var C = cg.Constants;
    var modifier = cg.Difficulty.get(difficulty);
    var isPlayer = side === "player";
    var hp = isPlayer
      ? C.PLAYER_BASE_HP
      : Math.round(C.ENEMY_BASE_HP * level.hpScale * modifier.enemyHp);
    var castle = {
      side: side,
      hp: hp,
      maxHp: hp,
      defense: isPlayer
        ? C.PLAYER_BASE_DEFENSE
        : C.ENEMY_BASE_DEFENSE + Math.floor(level.number / 6),
      attack: isPlayer
        ? C.PLAYER_BASE_ATTACK
        : C.ENEMY_BASE_ATTACK + Math.floor(level.number / 7),
      fireRate: isPlayer
        ? C.PLAYER_FIRE_RATE
        : 1 / (C.ENEMY_FIRE_RATE * level.enemyPace * modifier.enemyFireRate),
      criticalRate: isPlayer ? C.PLAYER_CRITICAL_RATE : 0.03,
      radius: isPlayer ? 0.075 : 0.073,
      recoil: 0,
      hitFlash: 0,
      shieldFlash: 0,
      takeDamage: function (amount) {
        var damage = Math.max(1, Math.round(amount));
        this.hp = Math.max(0, this.hp - damage);
        this.hitFlash = 0.24;
        return damage;
      },
      heal: function (amount) {
        this.hp = Math.min(this.maxHp, this.hp + Math.max(0, amount));
      },
    };
    if (inherited) {
      castle.attack += Math.max(0, Number(inherited.attackBonus) || 0);
      castle.defense += Math.max(0, Number(inherited.defenseBonus) || 0);
      castle.criticalRate = Math.min(
        0.5,
        castle.criticalRate + (Number(inherited.criticalRateBonus) || 0),
      );
    }
    return castle;
  };
})(window);
