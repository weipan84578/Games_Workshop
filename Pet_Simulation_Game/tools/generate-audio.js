'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const RATE = 22050;

function wav(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(RATE, 24);
  buffer.writeUInt32LE(RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((value, index) =>
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(value * 32767))), 44 + index * 2)
  );
  return buffer;
}

function noteFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
function pianoTrack(notes, tempo, bars) {
  const beat = 60 / tempo;
  const duration = beat * bars * 4;
  const samples = new Float64Array(Math.floor(duration * RATE));
  for (let step = 0; step < bars * 8; step += 1) {
    const chord = notes[step % notes.length];
    const start = Math.floor(step * beat * 0.5 * RATE);
    const noteDuration = beat * (step % 2 ? 0.85 : 1.4);
    chord.forEach((midi, voice) => {
      const frequency = noteFrequency(midi);
      const count = Math.floor(noteDuration * RATE);
      for (let i = 0; i < count && start + i < samples.length; i += 1) {
        const time = i / RATE;
        const env = Math.exp((-3.2 * time) / noteDuration) * Math.min(1, time / 0.008);
        const tone =
          Math.sin(2 * Math.PI * frequency * time) +
          0.31 * Math.sin(4 * Math.PI * frequency * time) +
          0.12 * Math.sin(6 * Math.PI * frequency * time);
        samples[start + i] += tone * env * (0.105 - voice * 0.008);
      }
    });
  }
  const fade = Math.floor(0.45 * RATE);
  for (let i = 0; i < fade; i += 1) {
    const factor = i / fade;
    samples[i] *= factor;
    samples[samples.length - 1 - i] *= factor;
  }
  return Array.from(samples);
}

function sfx(type) {
  const seconds = type === 'victory' || type === 'level' ? 0.7 : 0.24;
  const length = Math.floor(seconds * RATE);
  const tones = {
    click: 880,
    confirm: 1047,
    cancel: 440,
    error: 196,
    coin: 1319,
    equip: 740,
    countdown: 660,
    hit: 180,
    miss: 520,
    gold: 1568,
    bond: 988,
    attack: 240,
    special: 360,
    dodge: 720,
    critical: 1320,
    shield: 560,
    victory: 784,
    defeat: 220,
    xp: 880,
    level: 1047,
    rank: 1175,
    champion: 1568
  };
  const base = tones[type] || 600;
  const out = [];
  for (let i = 0; i < length; i += 1) {
    const t = i / RATE;
    const env = Math.pow(1 - i / length, 2);
    let f = base;
    if (type === 'attack') f *= 1 - t * 1.2;
    if (type === 'dodge') f *= 1 + t * 1.5;
    if (type === 'victory' || type === 'level' || type === 'champion')
      f *= Math.pow(2, (Math.floor(t / 0.16) / 12) * 4);
    const sample = (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t)) * env * 0.22;
    out.push(sample);
  }
  return out;
}

const tracks = {
  bgm_menu: {
    tempo: 92,
    notes: [
      [60, 64, 67],
      [64, 67, 72],
      [67, 71, 74],
      [65, 69, 72]
    ],
    bars: 4
  },
  bgm_home: {
    tempo: 84,
    notes: [
      [60, 64, 67],
      [62, 65, 69],
      [59, 62, 67],
      [60, 65, 69]
    ],
    bars: 4
  },
  bgm_training: {
    tempo: 116,
    notes: [
      [60, 64, 67],
      [62, 66, 69],
      [64, 67, 71],
      [67, 71, 74]
    ],
    bars: 5
  },
  bgm_outing: {
    tempo: 104,
    notes: [
      [65, 69, 72],
      [67, 71, 74],
      [64, 69, 72],
      [62, 67, 71]
    ],
    bars: 5
  },
  bgm_battle: {
    tempo: 142,
    notes: [
      [57, 60, 64],
      [59, 62, 65],
      [60, 64, 67],
      [55, 59, 62]
    ],
    bars: 6
  },
  bgm_champion: {
    tempo: 96,
    notes: [
      [60, 64, 67, 72],
      [65, 69, 72, 77],
      [67, 71, 74, 79],
      [60, 67, 72, 76]
    ],
    bars: 6
  }
};
const sfxNames = [
  'click',
  'confirm',
  'cancel',
  'error',
  'coin',
  'equip',
  'countdown',
  'hit',
  'miss',
  'gold',
  'bond',
  'attack',
  'special',
  'dodge',
  'critical',
  'shield',
  'victory',
  'defeat',
  'xp',
  'level',
  'rank',
  'champion'
];
fs.mkdirSync(path.join(ROOT, 'assets/audio/bgm'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'assets/audio/sfx'), { recursive: true });
Object.entries(tracks).forEach(([name, data]) =>
  fs.writeFileSync(
    path.join(ROOT, 'assets/audio/bgm', name + '.wav'),
    wav(pianoTrack(data.notes, data.tempo, data.bars))
  )
);
sfxNames.forEach((name) => fs.writeFileSync(path.join(ROOT, 'assets/audio/sfx', name + '.wav'), wav(sfx(name))));
console.log(`Generated ${Object.keys(tracks).length} BGM loops and ${sfxNames.length} sound effects.`);
