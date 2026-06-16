let getContext = null;
let getSettings = null;

const PROFILES = {
  select: [520, 0.06],
  deselect: [360, 0.05],
  invalid: [130, 0.12],
  pour_start: [420, 0.05],
  pour_end: [700, 0.08],
  complete_tube: [880, 0.12],
  level_clear: [1040, 0.18],
  level_fail: [160, 0.22],
  undo: [300, 0.09],
  hint: [760, 0.1],
  btn_click: [460, 0.05],
  btn_hover: [620, 0.035],
  screen_in: [580, 0.07],
  screen_out: [320, 0.06],
  confetti: [980, 0.16],
};

export const SFXController = {
  init(contextFactory, settingsFactory) {
    getContext = contextFactory;
    getSettings = settingsFactory;
  },
  play(id) {
    const settings = getSettings?.();
    if (!settings?.sfxEnabled) return;
    const ctx = getContext?.();
    if (!ctx) return;

    const [frequency, duration] = PROFILES[id] ?? PROFILES.btn_click;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = Math.max(0, Math.min(1, settings.sfxVolume)) * 0.08;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  },
};
