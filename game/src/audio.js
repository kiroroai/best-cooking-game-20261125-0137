// Tiny synthesized sound effects via WebAudio. No audio files, no network.
// Everything is an oscillator blip; created lazily on the first user gesture.
let ctx = null;
let muted = false;

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function blip(freq, dur, type, vol, when = 0) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  unlock() { ensureCtx(); },
  pick() { blip(660, 0.08, 'triangle', 0.12); },
  place() { blip(440, 0.1, 'sine', 0.14); blip(880, 0.08, 'sine', 0.08, 0.05); },
  trash() { blip(180, 0.16, 'sawtooth', 0.07); },
  wrong() { blip(140, 0.22, 'square', 0.09); blip(110, 0.22, 'square', 0.09, 0.1); },
  serve() {
    blip(523, 0.12, 'triangle', 0.14);
    blip(659, 0.12, 'triangle', 0.14, 0.09);
    blip(784, 0.2, 'triangle', 0.16, 0.18);
  },
  tick() { blip(980, 0.05, 'square', 0.05); },
  expired() { blip(220, 0.3, 'sawtooth', 0.1); blip(165, 0.4, 'sawtooth', 0.1, 0.15); },
  gameover() {
    blip(392, 0.25, 'triangle', 0.14);
    blip(330, 0.25, 'triangle', 0.14, 0.22);
    blip(262, 0.45, 'triangle', 0.16, 0.44);
  },
};

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
