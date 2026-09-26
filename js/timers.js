// ============================================================================
// BarCraft Interactive Mixing Timers, Web Audio Chimes & Screen Wake Lock
// Keeps screen awake during mixing; plays synthesized acoustic alerts
// ============================================================================

class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary crystal chime tone (D5 ~587Hz & A5 ~880Hz harmonic)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // Ramp up

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2); // D6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Ignore click error
    }
  }

  playCorrect(streak = 1) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = Math.min(880, 523.25 * Math.pow(1.06, Math.min(streak, 6))); // Pitches up slightly with combo streak!

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.25, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.0, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.06);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  playIncorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  playFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.22, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + (idx === 3 ? 0.7 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + (idx === 3 ? 0.7 : 0.2));
      });
    } catch (e) {}
  }

  playShaker() {
    try {
      this.init();
      if (!this.ctx) return;
      // Synthesize rhythmic textured ice shaker bursts
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }
}

export const soundEffects = new SoundEffects();

// Screen Wake Lock Manager (iOS Safari 16.4+ & modern mobile browsers)
class WakeLockManager {
  constructor() {
    this.wakeLock = null;
  }

  async requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('Screen Wake Lock active - screen will not sleep while mixing');
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
        console.log('Screen Wake Lock released');
      }).catch(() => {});
    }
  }
}

export const wakeLockManager = new WakeLockManager();

export class CocktailTimer {
  constructor({ totalSeconds, onTick, onComplete, phaseName = 'Shake' }) {
    this.totalSeconds = totalSeconds;
    this.remainingSeconds = totalSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.phaseName = phaseName;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    soundEffects.init();
    wakeLockManager.requestWakeLock();
    this.isRunning = true;
    const startTime = Date.now();
    const initialRemaining = this.remainingSeconds;

    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      this.remainingSeconds = Math.max(0, initialRemaining - elapsed);

      if (this.onTick) {
        this.onTick(this.remainingSeconds, this.totalSeconds, this.phaseName);
      }

      if (this.remainingSeconds <= 0) {
        this.stop();
        soundEffects.playChime();
        if (this.onComplete) {
          this.onComplete(this.phaseName);
        }
      }
    }, 100);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  stop() {
    this.pause();
    wakeLockManager.releaseWakeLock();
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    if (this.onTick) {
      this.onTick(this.remainingSeconds, this.totalSeconds, this.phaseName);
    }
  }
}
