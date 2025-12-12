// ============================================
// SOUND.JS - Audio System using Web Audio API
// ============================================

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.3; // Default volume (0.0 to 1.0)
      this.masterGain.connect(this.audioCtx.destination);
      this.initialized = true;
      console.log("SoundManager initialized");
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  // Ensure context is running (needed because browsers block auto-play)
  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type, duration, startTime = 0, vol = 1.0) {
    if (!this.initialized) this.init();
    if (!this.audioCtx) return;
    this.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);
    
    // Envelope to avoid clicking
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(vol, this.audioCtx.currentTime + startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.audioCtx.currentTime + startTime);
    osc.stop(this.audioCtx.currentTime + startTime + duration);
  }

  // UI Sounds
  playClick() {
    // High pitched short beep
    this.playTone(800, 'sine', 0.1, 0, 0.5);
  }

  playStart() {
    // Rising arpeggio
    this.playTone(440, 'triangle', 0.1, 0);       // A4
    this.playTone(554.37, 'triangle', 0.1, 0.1);  // C#5
    this.playTone(659.25, 'triangle', 0.2, 0.2);  // E5
  }

  // Game Sounds
  playMove() {
    // Very short, low percussion-like sound
    if (!this.initialized) this.init();
    if (!this.audioCtx) return;
    this.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  playShoot() {
    // Noise burst / laser-ish sweep
    if (!this.initialized) this.init();
    if (!this.audioCtx) return;
    this.resume();
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  playGoal() {
    // Victory fanfare (Major chord)
    const now = this.audioCtx.currentTime;
    // C Major: C, E, G, C
    this.playTone(523.25, 'square', 0.15, 0, 0.4);   // C5
    this.playTone(659.25, 'square', 0.15, 0.1, 0.4); // E5
    this.playTone(783.99, 'square', 0.15, 0.2, 0.4); // G5
    this.playTone(1046.50, 'square', 0.4, 0.3, 0.4); // C6
  }

  playWin() {
    // Longer victory melody
    this.playTone(523.25, 'sine', 0.2, 0);   // C5
    this.playTone(659.25, 'sine', 0.2, 0.2); // E5
    this.playTone(783.99, 'sine', 0.2, 0.4); // G5
    this.playTone(1046.50, 'square', 0.6, 0.6); // C6
    this.playTone(783.99, 'sine', 0.2, 0.7); // G5
    this.playTone(1046.50, 'square', 0.8, 0.9); // C6
  }

  playLose() {
    // Sad descending tritone/chromatic
    this.playTone(300, 'sawtooth', 0.3, 0);
    this.playTone(280, 'sawtooth', 0.3, 0.3);
    this.playTone(260, 'sawtooth', 0.3, 0.6);
    this.playTone(200, 'sawtooth', 0.8, 0.9);
  }

  playBounce() {
     // Short thud
    if (!this.initialized) this.init();
    if (!this.audioCtx) return;
    this.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }
}

// Global instance
window.soundManager = new SoundManager();
