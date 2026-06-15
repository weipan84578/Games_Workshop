/* instructions.js — 說明畫面:手風琴展開/收合。 */
(function (L) {
  'use strict';

  L.ui.instructions = {
    toggle: function (header) {
      var item = header.parentNode;
      var open = item.classList.toggle('open');
      L.audio.playSfx('sfx_button_click');
    }
  };
})(window.Ludo);
