(function (ns) {
  "use strict";

  ns.SoundMap = {
    bgm: {
      menu: "generated-menu-piano",
      gameplay: "generated-gameplay-piano"
    },
    sfx: {
      lineDraw: [880],
      boxComplete: [988, 1319],
      buttonTap: [660],
      turnSwitch: [784, 988],
      victory: [784, 988, 1175, 1568],
      defeat: [784, 659, 523],
      draw: [659, 784, 659]
    }
  };
})(window.DAB = window.DAB || {});
