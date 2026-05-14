function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function ensureMusic() {
  if (settings.musicMuted || bgmTimer) return;
  const ac = ensureAudioCtx();
  bgmGain = bgmGain || ac.createGain();
  bgmGain.gain.value = settings.musicVolume * .16;
  bgmGain.connect(ac.destination);
  const notes = [261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66];
  let i = 0;
  bgmTimer = setInterval(() => {
    if (settings.musicMuted || !audioCtx) return;
    tone(notes[i++ % notes.length], .18, "sine", bgmGain, .16);
  }, 540);
}
function tone(freq, dur, type = "sine", destination = null, vol = 1) {
  if (settings.sfxMuted && !destination) return;
  const ac = ensureAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime((destination ? 1 : settings.sfxVolume) * vol, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + dur);
  osc.connect(gain).connect(destination || ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}
function noise(dur, vol) {
  if (settings.sfxMuted) return;
  const ac = ensureAudioCtx();
  const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = (last + .035 * (Math.random() * 2 - 1)) / 1.035;
    data[i] = last * 3.2;
  }
  const source = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const gain = ac.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.value = 430;
  gain.gain.setValueAtTime(settings.sfxVolume * vol, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + dur);
  source.connect(filter).connect(gain).connect(ac.destination);
  source.start();
}
function sfx(name) {
  if (name === "tap") tone(660, .06, "triangle", null, .12);
  if (name === "move") noise(.12, .55);
  if (name === "jump") { tone(580, .08, "triangle", null, .25); setTimeout(() => tone(820, .09, "triangle", null, .2), 60); }
  if (name === "capture") { tone(210, .22, "sawtooth", null, .22); noise(.18, .45); }
  if (name === "win") [523, 659, 784, 1046].forEach((n, i) => setTimeout(() => tone(n, .22, "sine", null, .28), i * 120));
  if (name === "lose") [440, 330, 247].forEach((n, i) => setTimeout(() => tone(n, .28, "triangle", null, .25), i * 160));
}
