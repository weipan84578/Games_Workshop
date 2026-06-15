/* rules.js — 規則:可走步、吃子、安全格、進終點判定。 */
(function (L) {
  'use strict';

  var R = L.engine.rules;
  var B = L.engine.board;

  /* 列出某玩家以骰值 dice 的所有合法步。
     回傳陣列,每項:
       { tokenId, fromYard, fromRel, toRel, finishes, entersHome, capturesIds:[] } */
  R.getLegalMoves = function (owner, dice) {
    var moves = [];
    var tokens = L.state.tokensOf(owner);
    var cfg = L.config;

    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i];
      if (tk.finished) continue;

      if (tk.inYard) {
        if (dice === 6) {
          if (isBlockedByFortress(owner, tk.id, -1, 0)) continue;
          var capYard = capturesAt(owner, 0);
          moves.push({
            tokenId: tk.id, fromYard: true, fromRel: -1, toRel: 0,
            finishes: false, entersHome: false, capturesIds: capYard
          });
        }
        continue;
      }

      var target = tk.rel + dice;
      if (target > cfg.FINISH_REL) {
        if (cfg.rules.exactFinish) continue; // 超過終點不可走
        target = cfg.FINISH_REL;
      }
      if (isBlockedByFortress(owner, tk.id, tk.rel, target)) continue;
      var caps = (target <= 50) ? capturesAt(owner, target) : [];
      moves.push({
        tokenId: tk.id, fromYard: false, fromRel: tk.rel, toRel: target,
        finishes: target === cfg.FINISH_REL,
        entersHome: target >= 51,
        capturesIds: caps
      });
    }
    return moves;
  };

  R.hasLegalMove = function (owner, dice) {
    return R.getLegalMoves(owner, dice).length > 0;
  };

  function isBlockedByFortress(owner, movingTokenId, fromRel, targetRel) {
    if (!L.config.rules.blockFortress) return false;
    var start = Math.max(fromRel + 1, 0);
    var end = Math.min(targetRel, 50);
    for (var rel = start; rel <= end; rel++) {
      if (isFortressAtAbs(B.relToAbs(owner, rel), movingTokenId)) return true;
    }
    return false;
  }

  function isFortressAtAbs(abs, movingTokenId) {
    var counts = {};
    var tokens = L.state.game.tokens;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t.id === movingTokenId || t.inYard || t.finished || t.rel > 50) continue;
      if (B.relToAbs(t.owner, t.rel) !== abs) continue;
      counts[t.owner] = (counts[t.owner] || 0) + 1;
      if (counts[t.owner] >= 2) return true;
    }
    return false;
  }

  /* 計算 owner 的棋子若落在主走道相對位置 targetRel,會吃掉哪些對手棋子。
     只在非安全格、且該格只有對手棋子(不含同色)時成立。 */
  function capturesAt(owner, targetRel) {
    var abs = B.relToAbs(owner, targetRel);
    if (B.isSafeAbs(abs)) return [];
    var caught = [];
    var enemyOnCell = [];
    var tokens = L.state.game.tokens;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t.inYard || t.finished) continue;
      if (t.rel > 50) continue; // 在終點通道,不可被吃
      var tAbs = B.relToAbs(t.owner, t.rel);
      if (tAbs !== abs) continue;
      if (t.owner === owner) return []; // 同色已佔(堡壘),不吃自己也阻擋(此處簡化:不吃)
      enemyOnCell.push(t);
    }
    // 同格對手 2 顆以上 = 堡壘,不可吃
    var byOwner = {};
    for (var j = 0; j < enemyOnCell.length; j++) {
      var o = enemyOnCell[j].owner;
      (byOwner[o] = byOwner[o] || []).push(enemyOnCell[j]);
    }
    for (var k in byOwner) {
      if (byOwner[k].length >= 2) return []; // 對手堡壘,撞不動
      caught.push(byOwner[k][0].id);
    }
    return caught;
  }
  R.capturesAt = capturesAt;
  R.isBlockedByFortress = isBlockedByFortress;

  R.isSafeAbs = B.isSafeAbs;
})(window.Ludo);
