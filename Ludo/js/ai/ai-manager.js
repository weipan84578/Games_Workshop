/* ai-manager.js — AI 入口,依難度分派。 */
(function (L) {
  'use strict';

  L.ai.chooseMove = function (owner, dice, moves) {
    if (!moves || !moves.length) return null;
    var player = L.state.playerById(owner);
    var diff = player ? player.difficulty : 'normal';
    var fn;
    if (diff === 'easy') fn = L.ai.easy;
    else if (diff === 'hard') fn = L.ai.hard;
    else fn = L.ai.normal;
    return fn(owner, dice, moves) || moves[0];
  };
})(window.Ludo);
