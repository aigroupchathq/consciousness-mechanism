/**
 * Ambient Neural Wave Synthesizer (Web Audio API)
 * Generates 40Hz Gamma-band neural oscillations & ignition chimes.
 */
export class NeuralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscLeft = null;
    this.oscRight = null;
    this.filter = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Lowpass filter for warm analog tone
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.connect(this.masterGain);
  }

  toggle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    if (!this.ctx) this.init();
    this.isPlaying = true;

    // Carrier frequency: 216 Hz (Root) with 40 Hz Gamma beat separation
    // Left ear: 216 Hz, Right ear: 256 Hz -> Binaural difference = 40 Hz Gamma
    const merger = this.ctx.createChannelMerger(2);

    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = 'sine';
    this.oscLeft.frequency.setValueAtTime(216, this.ctx.currentTime);

    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = 'sine';
    this.oscRight.frequency.setValueAtTime(256, this.ctx.currentTime);

    this.oscLeft.connect(merger, 0, 0);
    this.oscRight.connect(merger, 0, 1);
    merger.connect(this.filter);

    this.oscLeft.start();
    this.oscRight.start();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.oscLeft) {
      try { this.oscLeft.stop(); } catch (e) {}
      this.oscLeft = null;
    }
    if (this.oscRight) {
      try { this.oscRight.stop(); } catch (e) {}
      this.oscRight = null;
    }
  }

  playIgnitionChime() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(528, now); // Solfeggio / crisp cognitive tone
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }
}
