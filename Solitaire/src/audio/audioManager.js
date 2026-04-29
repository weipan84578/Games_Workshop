/**
 * Web Audio API 合成音效與背景音樂
 * 所有聲音均以程式生成，無需任何外部音效檔案
 */

let ctx = null;
let masterGain = null;
let bgmGain = null;
let sfxGainNode = null;

let bgmVol = 0.3;
let sfxVol = 0.7;
let mutedState = false;

// BGM 調度器狀態
let bgmSchedulerTimer = null;
let bgmCurrentPattern = null;
let bgmNoteIdx = { _melody: { idx: 0, next: 0 }, _bass: { idx: 0, next: 0 } };

// ─── AudioContext 初始化 ──────────────────────────────────────────────────────

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = mutedState ? 0 : 1;
    masterGain.connect(ctx.destination);
    bgmGain = ctx.createGain();
    bgmGain.gain.value = bgmVol;
    bgmGain.connect(masterGain);
    sfxGainNode = ctx.createGain();
    sfxGainNode.gain.value = sfxVol;
    sfxGainNode.connect(masterGain);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// ─── 工具函數 ─────────────────────────────────────────────────────────────────

function freq(name) {
  if (!name || name === 'R') return 0;
  const S = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 };
  const m = name.match(/^([A-G][b#]?)(\d)$/);
  if (!m) return 440;
  return 440 * Math.pow(2, (S[m[1]] + (parseInt(m[2]) - 4) * 12 - 9) / 12);
}

function noiseBuffer(ac, dur) {
  const len = Math.ceil(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  return src;
}

function tone(hz, { type = 'sine', t, dur, peak = 0.35, atk = 0.01, rel, dest }) {
  const ac = getCtx();
  const st = t ?? (ac.currentTime + 0.01);
  const release = rel ?? Math.min(dur * 0.6, 0.4);
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = hz;
  g.gain.setValueAtTime(0, st);
  g.gain.linearRampToValueAtTime(peak, st + atk);
  g.gain.setValueAtTime(peak * 0.65, st + dur - release);
  g.gain.linearRampToValueAtTime(0.0001, st + dur);
  osc.connect(g);
  g.connect(dest ?? sfxGainNode);
  osc.start(st);
  osc.stop(st + dur + 0.05);
}

// ─── 音效合成 (SFX) ───────────────────────────────────────────────────────────

function sfxClick() {
  tone(820, { dur: 0.05, atk: 0.003, peak: 0.22, rel: 0.04 });
}

function sfxDraw() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  const ns = noiseBuffer(ac, 0.18);
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.5;
  f.frequency.setValueAtTime(1100, t);
  f.frequency.exponentialRampToValueAtTime(3200, t + 0.1);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.2, t + 0.008);
  g.gain.linearRampToValueAtTime(0, t + 0.13);
  ns.connect(f); f.connect(g); g.connect(sfxGainNode);
  ns.start(t); ns.stop(t + 0.2);
  tone(260, { t, dur: 0.08, atk: 0.003, peak: 0.1, rel: 0.06 });
}

function sfxPlace() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  tone(180, { t, dur: 0.14, atk: 0.003, peak: 0.28, rel: 0.1 });
  const ns = noiseBuffer(ac, 0.09);
  const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 450; f.Q.value = 1;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.16, t); g.gain.linearRampToValueAtTime(0, t + 0.07);
  ns.connect(f); f.connect(g); g.connect(sfxGainNode);
  ns.start(t); ns.stop(t + 0.1);
}

function sfxFlip() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  const ns = noiseBuffer(ac, 0.2);
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2.5;
  f.frequency.setValueAtTime(500, t);
  f.frequency.exponentialRampToValueAtTime(3000, t + 0.12);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.24, t + 0.012);
  g.gain.linearRampToValueAtTime(0, t + 0.16);
  ns.connect(f); f.connect(g); g.connect(sfxGainNode);
  ns.start(t); ns.stop(t + 0.22);
}

function sfxFoundation() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  tone(880,  { t, dur: 0.55, atk: 0.006, peak: 0.30, rel: 0.42 });
  tone(1320, { t, dur: 0.40, atk: 0.006, peak: 0.13, rel: 0.32 });
  tone(1760, { t, dur: 0.28, atk: 0.006, peak: 0.06, rel: 0.22 });
}

function sfxError() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  const osc = ac.createOscillator(); const g = ac.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.linearRampToValueAtTime(110, t + 0.13);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.2, t + 0.01);
  g.gain.linearRampToValueAtTime(0, t + 0.15);
  osc.connect(g); g.connect(sfxGainNode);
  osc.start(t); osc.stop(t + 0.18);
}

function sfxUndo() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  const osc = ac.createOscillator(); const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(720, t);
  osc.frequency.linearRampToValueAtTime(340, t + 0.12);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.26, t + 0.01);
  g.gain.linearRampToValueAtTime(0, t + 0.14);
  osc.connect(g); g.connect(sfxGainNode);
  osc.start(t); osc.stop(t + 0.18);
}

function sfxHint() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  tone(1200, { type: 'triangle', t, dur: 0.65, atk: 0.01, peak: 0.18, rel: 0.5 });
  tone(1800, { t: t + 0.04, dur: 0.45, atk: 0.01, peak: 0.07, rel: 0.38 });
}

function sfxWin() {
  const ac = getCtx();
  [523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
    const t = ac.currentTime + 0.06 + i * 0.16;
    tone(hz,     { t, dur: 0.6, atk: 0.02, peak: 0.26, rel: 0.45 });
    tone(hz * 2, { type: 'triangle', t, dur: 0.3, atk: 0.02, peak: 0.09, rel: 0.24 });
  });
}

function sfxAuto() {
  tone(1100, { dur: 0.17, atk: 0.006, peak: 0.20, rel: 0.13 });
}

function sfxModalOpen() {
  const ac = getCtx(); const t = ac.currentTime + 0.01;
  const osc = ac.createOscillator(); const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.linearRampToValueAtTime(860, t + 0.1);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.19, t + 0.01);
  g.gain.linearRampToValueAtTime(0, t + 0.13);
  osc.connect(g); g.connect(sfxGainNode);
  osc.start(t); osc.stop(t + 0.18);
}

export function playSFX(name) {
  if (mutedState || sfxVol <= 0) return;
  try {
    getCtx();
    switch (name) {
      case 'click':      sfxClick();      break;
      case 'draw':       sfxDraw();       break;
      case 'place':      sfxPlace();      break;
      case 'flip':       sfxFlip();       break;
      case 'foundation': sfxFoundation(); break;
      case 'error':      sfxError();      break;
      case 'undo':       sfxUndo();       break;
      case 'hint':       sfxHint();       break;
      case 'win':        sfxWin();        break;
      case 'auto':       sfxAuto();       break;
      case 'modal_open': sfxModalOpen();  break;
    }
  } catch (e) { /* 音效失敗時靜默略過 */ }
}

// ─── 背景音樂 (BGM) — 以 Web Audio API 調度器合成 ─────────────────────────────
//
// 每首樂曲定義：melody[] 主旋律，bass[] 低音伴奏
// 格式：[音符名稱 | null(休止), 拍數]  null = 休止符

const BGM_PATTERNS = {
  menu: {
    bpm: 72, type: 'triangle', noteVol: 0.11, bassVol: 0.07,
    melody: [
      ['C4',0.5],['E4',0.5],['G4',0.5],['B4',1],  [null,0.5],
      ['F4',0.5],['A4',0.5],['C5',0.5],['E5',1],  [null,0.5],
      ['G4',0.5],['B4',0.5],['D5',0.5],['F5',1],  [null,0.5],
      ['A4',0.5],['C5',0.5],['E5',0.5],['G5',0.75],[null,0.25],
    ],
    bass: [
      ['C3',2],[null,2],['F3',2],[null,2],
      ['G3',2],[null,2],['A3',2],[null,2],
    ],
  },
  game: {
    bpm: 90, type: 'triangle', noteVol: 0.09, bassVol: 0.06,
    melody: [
      ['C4',0.25],['Eb4',0.25],['G4',0.5],[null,0.5],['Bb4',0.5],[null,0.5],
      ['F4',0.25],['Ab4',0.25],['C5',0.5],[null,0.5],['Eb5',0.5],[null,0.5],
      ['G4',0.25],['Bb4',0.25],['D5',0.5],[null,0.5],['F5',0.5], [null,0.5],
      ['C5',0.25],['G4',0.25], ['Eb4',0.5],[null,0.5],['C4',0.5],[null,0.5],
    ],
    bass: [
      ['C3',1],[null,1],['C3',0.5],[null,0.5],
      ['F3',1],[null,1],['F3',0.5],[null,0.5],
      ['G3',1],[null,1],['G3',0.5],[null,0.5],
      ['C3',1],[null,1],['C3',0.5],[null,0.5],
    ],
  },
  retro: {
    bpm: 120, type: 'square', noteVol: 0.07, bassVol: 0.05,
    melody: [
      ['C5',0.25],['E5',0.25],['G5',0.25],['C6',0.25],[null,0.25],['G5',0.25],['E5',0.25],[null,0.25],
      ['F5',0.25],['A5',0.25],['C6',0.25],['F6',0.25],[null,0.25],['C6',0.25],['A5',0.25],[null,0.25],
      ['G5',0.25],['B5',0.25],['D6',0.25],['G6',0.25],[null,0.25],['D6',0.25],['B5',0.25],[null,0.25],
      ['E5',0.25],['G5',0.25],['B5',0.25],['E6',0.5], [null,0.25],['B5',0.25],            [null,0.5],
    ],
    bass: [
      ['C4',0.5],[null,0.5],['G4',0.5],[null,0.5],
      ['F4',0.5],[null,0.5],['C4',0.5],[null,0.5],
      ['G4',0.5],[null,0.5],['D4',0.5],[null,0.5],
      ['E4',0.5],[null,0.5],            [null,1],
    ],
  },
  win: {
    bpm: 132, type: 'sine', noteVol: 0.18, bassVol: 0.09,
    melody: [
      ['C5',0.25],['E5',0.25],['G5',0.25],['C6',0.5],
      ['E6',0.25],['G6',0.25],['C6',0.5],[null,0.5],
      ['G5',0.25],['E5',0.25],['C5',0.25],['G4',0.25],['C5',0.5],[null,0.5],
    ],
    bass: [
      ['C4',1],['G4',0.5],[null,0.5],
      ['C5',1],[null,1],
      ['G3',1],['C4',1],
    ],
  },
};

function scheduleBGMNotes() {
  if (!bgmCurrentPattern) return;
  const ac = getCtx();
  const pat = BGM_PATTERNS[bgmCurrentPattern];
  if (!pat) return;
  const beatSec = 60 / pat.bpm;
  const AHEAD = 0.35; // 提前排程秒數

  // 主旋律
  const mel = bgmNoteIdx._melody;
  while (mel.next < ac.currentTime + AHEAD) {
    const [note, beats] = pat.melody[mel.idx % pat.melody.length];
    const t = mel.next;
    const dur = beats * beatSec;
    if (note) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = pat.type;
      osc.frequency.value = freq(note);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(pat.noteVol, t + 0.015);
      g.gain.setValueAtTime(pat.noteVol * 0.65, t + dur * 0.55);
      g.gain.linearRampToValueAtTime(0.0001, t + dur * 0.9);
      osc.connect(g); g.connect(bgmGain);
      osc.start(t); osc.stop(t + dur);
    }
    mel.next += dur;
    mel.idx++;
  }

  // 低音伴奏
  const bass = bgmNoteIdx._bass;
  while (bass.next < ac.currentTime + AHEAD) {
    const [note, beats] = pat.bass[bass.idx % pat.bass.length];
    const t = bass.next;
    const dur = beats * beatSec;
    if (note) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq(note);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(pat.bassVol, t + 0.02);
      g.gain.setValueAtTime(pat.bassVol * 0.5, t + dur * 0.6);
      g.gain.linearRampToValueAtTime(0.0001, t + dur * 0.88);
      osc.connect(g); g.connect(bgmGain);
      osc.start(t); osc.stop(t + dur);
    }
    bass.next += dur;
    bass.idx++;
  }
}

export function playBGM(patternKey, _name) {
  if (bgmCurrentPattern === patternKey) return;
  stopBGM();
  if (!BGM_PATTERNS[patternKey]) return;
  bgmCurrentPattern = patternKey;
  const ac = getCtx();
  if (bgmGain) bgmGain.gain.value = mutedState ? 0 : bgmVol;
  const startTime = ac.currentTime + 0.12;
  bgmNoteIdx = {
    _melody: { idx: 0, next: startTime },
    _bass:   { idx: 0, next: startTime },
  };
  scheduleBGMNotes();
  bgmSchedulerTimer = setInterval(scheduleBGMNotes, 80);
}

export function stopBGM() {
  bgmCurrentPattern = null;
  if (bgmSchedulerTimer) { clearInterval(bgmSchedulerTimer); bgmSchedulerTimer = null; }
  if (bgmGain) {
    try {
      const ac = getCtx();
      bgmGain.gain.setValueAtTime(bgmGain.gain.value, ac.currentTime);
      bgmGain.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.3);
      setTimeout(() => { if (bgmGain) bgmGain.gain.value = bgmVol; }, 380);
    } catch {}
  }
}

// ─── 音量與靜音控制 ───────────────────────────────────────────────────────────

export function init(settings) {
  bgmVol = settings.bgmVolume ?? 0.3;
  sfxVol = settings.sfxVolume ?? 0.7;
}

export function setBGMVolume(v) {
  bgmVol = v;
  if (bgmGain && !mutedState) bgmGain.gain.value = v;
}

export function setSFXVolume(v) {
  sfxVol = v;
  if (sfxGainNode && !mutedState) sfxGainNode.gain.value = v;
}

export function mute() {
  mutedState = true;
  if (masterGain) masterGain.gain.value = 0;
}

export function unmute() {
  mutedState = false;
  if (masterGain) masterGain.gain.value = 1;
}

export function isMuted() { return mutedState; }
