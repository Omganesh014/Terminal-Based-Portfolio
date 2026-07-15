let audioCtx: AudioContext | null = null;
let ready = false;
let virtualTime = 0;
let virtualBase = 0;

function init() {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch { return; }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => { ready = true; }).catch(() => {});
  } else {
    ready = true;
  }
}

function getTime(): number {
  if (ready && audioCtx) return audioCtx.currentTime;
  if (audioCtx) return virtualBase + (performance.now() - virtualTime) / 1000;
  return 0;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.4) {
  const c = audioCtx;
  if (!c) return;
  const t = getTime();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + duration);
}

function noise(duration: number, volume = 0.25) {
  const c = audioCtx;
  if (!c) return;
  const t = getTime();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.connect(g).connect(c.destination);
  src.start(t);
}

type SoundType = 'click' | 'hover' | 'scroll' | 'success' | 'copy' | 'open' | 'close' | 'keypress' | 'startup' | 'shutdown' | 'error';

export function playSound(type: SoundType) {
  try {
    switch (type) {
      case 'click':    tone(900, 0.045, 'square', 0.30); break;
      case 'hover':    tone(600, 0.03, 'sine', 0.20); break;
      case 'scroll':   noise(0.1, 0.15); break;
      case 'success':  tone(523, 0.12, 'sine', 0.35); setTimeout(() => tone(784, 0.18, 'sine', 0.35), 100); break;
      case 'copy':     tone(660, 0.08, 'sine', 0.30); setTimeout(() => tone(880, 0.1, 'sine', 0.30), 70); break;
      case 'open':     tone(350, 0.1, 'triangle', 0.30); setTimeout(() => tone(550, 0.12, 'triangle', 0.30), 80); break;
      case 'close':    tone(500, 0.1, 'triangle', 0.30); setTimeout(() => tone(300, 0.12, 'triangle', 0.30), 60); break;
      case 'keypress': tone(1100, 0.035, 'square', 0.30); break;
      case 'startup':  tone(220, 0.18, 'sawtooth', 0.30); setTimeout(() => tone(440, 0.25, 'sawtooth', 0.30), 150); break;
      case 'shutdown': tone(440, 0.18, 'sawtooth', 0.30); setTimeout(() => tone(220, 0.3, 'sawtooth', 0.30), 120); break;
      case 'error':    tone(200, 0.15, 'square', 0.35); setTimeout(() => tone(150, 0.18, 'square', 0.35), 120); break;
    }
  } catch { /* AudioContext not supported */ }
}

let lastScroll = 0;
let lastHover = 0;
let didFirstInit = false;
function ensureContext() {
  if (didFirstInit) return;
  didFirstInit = true;
  virtualTime = performance.now();
  virtualBase = 0;
  init();
}
export function initSounds() {
  if (typeof window === 'undefined') return;
  ensureContext();
  document.addEventListener('mousemove', ensureContext, { once: true });
  document.addEventListener('touchstart', ensureContext, { once: true });
  document.addEventListener('click', (e) => {
    init();
    const t = e.target as HTMLElement;
    if (t.closest('button') || t.closest('a') || t.closest('input') || t.closest('textarea') || t.closest('select')) {
      playSound('click');
    }
  }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    const now = Date.now();
    if (now - lastHover < 80) return;
    const t = e.target as HTMLElement;
    if (t.closest('button') || t.closest('a') || t.closest('[role="option"]') || t.closest('label') || t.closest('.workspace-list button') || t.closest('.command-options button') || t.closest('.project-filters button') || t.closest('.project-list button')) {
      lastHover = now;
      playSound('hover');
    }
  }, { passive: true });
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll > 250) { init(); lastScroll = now; playSound('scroll'); }
  }, { passive: true });
}
