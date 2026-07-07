(function initBgmPlaylist(global) {
  const CF = global.CF || (global.CF = {});

  CF.bgmPlaylist = [
    { name: "morning", bpm: 108, notes: [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 988] },
    { name: "sunny", bpm: 116, notes: [392, 494, 587, 659, 587, 494, 440, 554, 659, 740, 659, 554] },
    { name: "playful", bpm: 124, notes: [330, 392, 523, 392, 440, 523, 659, 523, 494, 587, 740, 587] },
    { name: "breeze", bpm: 96, notes: [349, 440, 523, 659, 587, 523, 440, 392, 523, 659, 784, 659] }
  ];
})(window);
