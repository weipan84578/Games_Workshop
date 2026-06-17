window.VP = window.VP || {};

VP.SFX_LIBRARY = {
  click: { type: "square", notes: [520, 660], duration: 0.08, gain: 0.035 },
  hover: { type: "sine", notes: [740], duration: 0.05, gain: 0.018 },
  feed: { type: "triangle", notes: [392, 523, 659], duration: 0.16, gain: 0.035 },
  play: { type: "square", notes: [523, 784, 659, 880], duration: 0.1, gain: 0.026 },
  clean: { type: "sine", notes: [880, 988, 1175], duration: 0.12, gain: 0.025 },
  sleep: { type: "sine", notes: [440, 392, 330], duration: 0.24, gain: 0.024 },
  "pet-stroke": { type: "triangle", notes: [494, 587], duration: 0.18, gain: 0.026 },
  levelup: { type: "triangle", notes: [523, 659, 784, 1047], duration: 0.15, gain: 0.034 },
  warning: { type: "sawtooth", notes: [220, 196], duration: 0.2, gain: 0.026 },
  hatch: { type: "triangle", notes: [392, 523, 784], duration: 0.18, gain: 0.034 },
  "lang-switch": { type: "sine", notes: [620, 740], duration: 0.08, gain: 0.024 },
  "theme-switch": { type: "triangle", notes: [330, 440, 660], duration: 0.11, gain: 0.026 },
  save: { type: "sine", notes: [523, 392], duration: 0.12, gain: 0.024 },
  confirm: { type: "triangle", notes: [392, 523, 659], duration: 0.11, gain: 0.028 },
  error: { type: "sawtooth", notes: [180, 160], duration: 0.14, gain: 0.03 },
  "menu-open": { type: "triangle", notes: [330, 392, 523], duration: 0.12, gain: 0.03 }
};
