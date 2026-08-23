// Advanced Procedural Web Audio Synthesis for Realistic Paper Crinkling & Crumpling
// Emulates cellulose fiber fracture, micro-crinkles, friction noise, and toss aerodynamics

class RealisticSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Plays a rich, hyper-realistic paper crumple sound:
   * 1. Multi-band friction noise (cellulose fiber friction)
   * 2. Rapid micro-snaps (crease buckling)
   * 3. Resonant body thuds
   * 4. Physical toss swoosh
   */
  public playPaperCrumple(volume = 0.7, speedMultiplier = 1.0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 1.0 / speedMultiplier;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.85, now);
      masterGain.connect(ctx.destination);

      // --- Layer 1: Crunchy High-Frequency Crease Noise ---
      const sampleRate = ctx.sampleRate;
      const bufferLen = Math.floor(sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferLen, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Generate brownian + velvet noise (emulates crisp paper sheets snapping)
      let lastVal = 0;
      for (let i = 0; i < bufferLen; i++) {
        const white = Math.random() * 2 - 1;
        // Non-linear grain spikes
        const spike = Math.random() > 0.94 ? (Math.random() * 2 - 1) * 1.8 : 0;
        lastVal = (lastVal + 0.04 * white) / 1.04;
        data[i] = (lastVal * 0.4 + white * 0.25 + spike) * 0.6;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass 1: Sharp paper crinkle resonance
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(3200, now);
      filter1.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.5);
      filter1.frequency.exponentialRampToValueAtTime(900, now + duration);
      filter1.Q.setValueAtTime(2.8, now);

      // Highpass to remove muddiness
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(400, now);

      // Volume envelope with rapid crackle pulses
      const envGain = ctx.createGain();
      envGain.gain.setValueAtTime(0.001, now);
      envGain.gain.exponentialRampToValueAtTime(0.85, now + 0.06);

      // 18 Micro-snaps during crumple
      const snapCount = 18;
      for (let k = 1; k <= snapCount; k++) {
        const t = now + (k / snapCount) * (duration * 0.7);
        const intensity = 0.4 + Math.random() * 0.6;
        envGain.gain.setValueAtTime(intensity, t);
        envGain.gain.exponentialRampToValueAtTime(intensity * 0.2, t + 0.018);
      }
      envGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter1);
      filter1.connect(hp);
      hp.connect(envGain);
      envGain.connect(masterGain);

      noiseSource.start(now);
      noiseSource.stop(now + duration);

      // --- Layer 2: Mid-range Paper Crunch / Friction ---
      const midOscNoise = ctx.createBufferSource();
      midOscNoise.buffer = noiseBuffer;
      const midFilter = ctx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.setValueAtTime(1200, now);
      midFilter.gain.setValueAtTime(12, now);
      midFilter.Q.setValueAtTime(3.5, now);

      const midGain = ctx.createGain();
      midGain.gain.setValueAtTime(0.001, now);
      midGain.gain.linearRampToValueAtTime(0.4, now + 0.12);
      midGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.75);

      midOscNoise.connect(midFilter);
      midFilter.connect(midGain);
      midGain.connect(masterGain);

      midOscNoise.start(now);
      midOscNoise.stop(now + duration * 0.75);

      // --- Layer 3: Physical Squash Impulse ---
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(160, now);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      thudGain.gain.setValueAtTime(volume * 0.4, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      thudOsc.connect(thudGain);
      thudGain.connect(masterGain);

      thudOsc.start(now);
      thudOsc.stop(now + 0.25);

      // --- Layer 4: Toss Air Whoosh ---
      const whooshTime = now + duration * 0.52;
      const whooshOsc = ctx.createOscillator();
      const whooshGain = ctx.createGain();
      whooshOsc.type = 'triangle';
      whooshOsc.frequency.setValueAtTime(420, whooshTime);
      whooshOsc.frequency.exponentialRampToValueAtTime(110, whooshTime + 0.38);

      whooshGain.gain.setValueAtTime(0.001, whooshTime);
      whooshGain.gain.linearRampToValueAtTime(volume * 0.3, whooshTime + 0.09);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, whooshTime + 0.38);

      whooshOsc.connect(whooshGain);
      whooshGain.connect(masterGain);

      whooshOsc.start(whooshTime);
      whooshOsc.stop(whooshTime + 0.38);
    } catch (err) {
      console.warn('Audio synthesis warning:', err);
    }
  }

  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new RealisticSoundEngine();
