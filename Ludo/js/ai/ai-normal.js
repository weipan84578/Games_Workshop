/* ai-normal.js — 普通:啟發式評分,選最高分的合法步。 */
(function (L) {
  'use strict';
  var B = L.engine.board;

  L.ai.scoreMove = function (owner, dice, move) {
    var score = 0;
    var tk = L.state.getToken(move.tokenId);

    // 吃子:高度加分
    if (move.capturesIds && move.capturesIds.length) score += 60 + move.capturesIds.length * 10;

    // 進終點:極高
    if (move.finishes) score += 80;
    // 進入終點通道(安全)
    else if (move.entersHome) score += 35;

    // 擲到 6 時優先放出新棋
    if (move.fromYard) score += 28;

    // 推進(離終點越近越好)
    var toRel = move.fromYard ? 0 : move.toRel;
    score += toRel * 0.6;

    // 走入安全格加分
    if (toRel <= 50 && B.isSafeAbs(B.relToAbs(owner, toRel))) score += 18;

    // 走到會立即被吃的格:減分
    if (toRel <= 50 && !B.isSafeAbs(B.relToAbs(owner, toRel))) {
      if (isThreatened(owner, toRel)) score -= 30;
    }

    // 些微隨機,避免機械化
    score += Math.random() * 3;
    return score;
  };

  // 估算落在 owner 的相對位置 toRel(絕對格)是否會被任何對手下回合吃到
  function isThreatened(owner, toRel) {
    var abs = B.relToAbs(owner, toRel);
    var tokens = L.state.game.tokens;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t.owner === owner || t.inYard || t.finished || t.rel > 50) continue;
      var tAbs = B.relToAbs(t.owner, t.rel);
      // 對手在後方 1..6 格即可吃到
      var diff = (abs - tAbs + 52) % 52;
      if (diff >= 1 && diff <= 6) return true;
    }
    return false;
  }
  L.ai.isThreatened = isThreatened;

  L.ai.normal = function (owner, dice, moves) {
    var best = null, bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      var s = L.ai.scoreMove(owner, dice, moves[i]);
      if (s > bestScore) { bestScore = s; best = moves[i]; }
    }
    return best;
  };
})(window.Ludo);
