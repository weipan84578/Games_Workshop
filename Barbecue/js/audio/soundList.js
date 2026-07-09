(function exposeSoundList(root) {
  "use strict";
  root.BBQ = root.BBQ || {};
  root.BBQ.SoundList = Object.freeze({
    bgm: [
      "bgm_piano_morning",
      "bgm_piano_picnic",
      "bgm_piano_festival",
      "bgm_piano_lullaby_upbeat"
    ],
    sfx: {
      click: { frequency: 680, duration: 0.05, type: "triangle" },
      flip: { frequency: 420, duration: 0.09, type: "sine" },
      serve: { frequency: 840, duration: 0.12, type: "triangle" },
      perfect: { frequency: 1040, duration: 0.18, type: "sine" },
      warning: { frequency: 160, duration: 0.18, type: "sawtooth" }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
