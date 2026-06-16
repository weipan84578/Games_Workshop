let getContext = null;
let getSettings = null;
let timer = null;
let currentTrack = null;
let enabledAfterGesture = false;

const TRACKS = {
  bgm_menu: [[220, 330], [277], [330, 440], [277]],
  bgm_easy: [[262, 392], [330], [392, 523], [330], [294, 440], [349]],
  bgm_normal: [[196, 294], [247], [294, 370], [247], [220, 330], [277]],
  bgm_hard: [[147, 220], [185], [220, 277], [165], [196, 247], [185]],
};

function playTone(freq, delay, duration, type, volume) {
  const ctx = getContext?.();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playStep(step) {
  const settings = getSettings?.();
  if (!settings?.bgmEnabled || !enabledAfterGesture) return;
  const notes = Array.isArray(step) ? step : [step];
  const baseVolume = Math.max(0, Math.min(1, settings.bgmVolume)) * 0.12;
  notes.forEach((freq, idx) => {
    playTone(freq, idx * 0.018, idx === 0 ? 0.34 : 0.24, idx === 0 ? 'triangle' : 'sine', baseVolume * (idx === 0 ? 1 : 0.58));
  });
}

export const BGMController = {
  init(contextFactory, settingsFactory) {
    getContext = contextFactory;
    getSettings = settingsFactory;
    document.addEventListener('pointerdown', () => {
      enabledAfterGesture = true;
      this.switchTo(currentTrack ?? 'bgm_menu');
    }, { once: true });
  },
  switchTo(trackId) {
    if (currentTrack === trackId && timer) return;
    currentTrack = trackId;
    if (timer) window.clearInterval(timer);

    const notes = TRACKS[trackId] ?? TRACKS.bgm_menu;
    let idx = 0;
    timer = window.setInterval(() => {
      playStep(notes[idx % notes.length]);
      idx += 1;
    }, trackId === 'bgm_hard' ? 480 : 620);
    playStep(notes[0]);
  },
  stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  },
};
