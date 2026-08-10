(function (global) {
  "use strict";
  var CCC = global.CCC;
  CCC.audioData = CCC.audioData || {};
  CCC.audioData.sfx = {
    click: { notes: [720], duration: .055, type: "sine", gain: .13 },
    order: { notes: [880, 1174], duration: .11, type: "sine", gain: .18 },
    pickup: { notes: [430, 620], duration: .07, type: "triangle", gain: .13 },
    marinate: { notes: [540, 690, 830], duration: .08, type: "sine", gain: .13 },
    coat: { notes: [170, 205, 240], duration: .045, type: "triangle", gain: .08 },
    sizzle: { notes: [105, 120, 98, 132], duration: .1, type: "sawtooth", gain: .045 },
    flip: { notes: [330, 610], duration: .09, type: "square", gain: .09 },
    ideal: { notes: [660, 880], duration: .1, type: "sine", gain: .12 },
    season: { notes: [260, 390, 520], duration: .05, type: "triangle", gain: .08 },
    bag: { notes: [360, 480], duration: .08, type: "triangle", gain: .1 },
    deliver: { notes: [523, 659, 784], duration: .12, type: "sine", gain: .17 },
    perfect: { notes: [659, 784, 1046, 1318], duration: .13, type: "sine", gain: .18 },
    error: { notes: [180, 145], duration: .12, type: "square", gain: .1 },
    impatient: { notes: [260, 210, 160], duration: .14, type: "triangle", gain: .14 },
    coin: { notes: [988, 1318, 1568], duration: .075, type: "sine", gain: .16 },
    upgrade: { notes: [392, 523, 659, 784], duration: .12, type: "triangle", gain: .16 },
    countdown: { notes: [740], duration: .06, type: "square", gain: .08 }
  };
}(typeof window !== "undefined" ? window : globalThis));
