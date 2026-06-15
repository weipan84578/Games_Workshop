/* dice.js — 擲骰邏輯。 */
(function (L) {
  'use strict';
  var D = L.engine.dice;

  D.roll = function () {
    return 1 + Math.floor(Math.random() * 6);
  };
})(window.Ludo);
