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
