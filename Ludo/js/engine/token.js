/* token.js — 棋子資料模型操作:套用移動、送回基地。 */
(function (L) {
  'use strict';
  var T = L.engine.token;

  // 將棋子依 move 結果更新位置(不含動畫,純資料)
  T.apply = function (tk, move) {
    if (move.fromYard) {
      tk.inYard = false;
      tk.rel = 0;
    } else {
      tk.rel = move.toRel;
    }
    if (move.finishes) {
      tk.finished = true;
    }
  };

  // 送回基地
  T.sendHome = function (tk) {
    tk.inYard = true;
    tk.finished = false;
    tk.rel = -1;
  };
})(window.Ludo);
