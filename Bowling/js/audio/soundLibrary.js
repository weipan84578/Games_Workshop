export const SOUND_LIBRARY = Object.freeze({
  bgm: [
    { id: "piano-01", src: "assets/audio/bgm/bgm-piano-01.mp3" },
    { id: "piano-02", src: "assets/audio/bgm/bgm-piano-02.mp3" },
    { id: "piano-03", src: "assets/audio/bgm/bgm-piano-03.mp3" },
    { id: "piano-04", src: "assets/audio/bgm/bgm-piano-04.mp3" },
  ],
  sfx: {
    button: { frequency: 880, duration: 0.08, type: "sine" },
    pin: { frequency: 620, duration: 0.12, type: "triangle" },
    strike: { frequency: 1046, duration: 0.32, type: "sine", sweep: 440 },
    spare: { frequency: 784, duration: 0.24, type: "triangle", sweep: 220 },
    roll: { frequency: 170, duration: 0.5, type: "sine", sweep: 90 },
  },
});
