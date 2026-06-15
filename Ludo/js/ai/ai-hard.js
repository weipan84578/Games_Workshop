/* ai-hard.js — 困難:在普通評分基礎上加入威脅分析與機率權衡。 */
(function (L) {
  'use strict';
  var B = L.engine.board;

  L.ai.hard = function (owner, dice, moves) {
    var best = null, bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      var s = L.ai.scoreMove(owner, dice, m); // 沿用普通評分基底
      var tk = L.state.getToken(m.tokenId);

      // 終局優先:接近終點的棋子加權送回家
      var toRel = m.fromYard ? 0 : m.toRel;
      if (toRel >= 45) s += (toRel - 44) * 2.5;

      // 威脅規避:把目前正被威脅的棋子移走 → 加分
      if (!m.fromYard && tk.rel <= 50 && !tk.finished) {
        if (threatLevel(owner, tk.rel) > 0 && (m.entersHome || !willBeThreatened(owner, toRel))) {
          s += 22;
        }
      }

      // 機率:落點被吃的期望損失(依後方對手距離命中機率約 1/6)
      if (toRel <= 50 && !B.isSafeAbs(B.relToAbs(owner, toRel))) {
        var risk = captureProbability(owner, toRel);
        s -= risk * (20 + toRel * 0.5); // 越領先的棋越不想損失
      }

      // 連動價值:吃子或 6 會再擲,額外加分
      if ((m.capturesIds && m.capturesIds.length) || dice === 6) s += 8;

      if (s > bestScore) { bestScore = s; best = m; }
    }
    return best;
  };

  // 後方對手數量(粗略威脅等級)
  function threatLevel(owner, rel) {
    var abs = B.relToAbs(owner, rel);
    var count = 0;
    var tokens = L.state.game.tokens;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t.owner === owner || t.inYard || t.finished || t.rel > 50) continue;
      var diff = (abs - B.relToAbs(t.owner, t.rel) + 52) % 52;
      if (diff >= 1 && diff <= 6) count++;
    }
    return count;
  }

  function willBeThreatened(owner, toRel) {
    return L.ai.isThreatened(owner, toRel);
  }

  // 落點下回合被吃的近似機率(每個威脅者命中機率 1/6,取聯集)
  function captureProbability(owner, toRel) {
    var abs = B.relToAbs(owner, toRel);
    var miss = 1;
    var tokens = L.state.game.tokens;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t.owner === owner || t.inYard || t.finished || t.rel > 50) continue;
      var diff = (abs - B.relToAbs(t.owner, t.rel) + 52) % 52;
      if (diff >= 1 && diff <= 6) miss *= (5 / 6);
    }
    return 1 - miss;
  }
})(window.Ludo);
