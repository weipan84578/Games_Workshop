let getContext = null;
let getSettings = null;
let timer = null;
let currentTrack = null;
let enabledAfterGesture = false;

const TRACKS = {
  bgm_menu: [220, 277, 330, 277],
  bgm_easy: [262, 330, 392, 330],
  bgm_normal: [196, 247, 294, 370],
  bgm_hard: [147, 185, 220, 277],
};

function playTone(freq, duration = 0.24) {
  const settings = getSettings?.();
  if (!settings?.bgmEnabled || !enabledAfterGesture) return;
  const ctx = getContext?.();
  if (!ctx) return;

  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.value = Math.max(0, Math.min(1, settings.bgmVolume)) * 0.025;
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
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
      playTone(notes[idx % notes.length]);
      idx += 1;
    }, 760);
  },
  stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  },
};
