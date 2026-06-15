/* ai-easy.js — 簡單:從所有合法步隨機挑一個。 */
(function (L) {
  'use strict';
  L.ai.easy = function (owner, dice, moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  };
})(window.Ludo);
