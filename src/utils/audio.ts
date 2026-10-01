// Web Audio Synthesizer for Ambient Soundscape and Botanical Harmonic Chimes
class BotanicalSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient: boolean = false;
  private ambientGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle harmonic bell chime tuned to a specific flower frequency
  public playFlowerChime(frequency: number = 528) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with slight shimmer
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 1.5, now); // subtle harmonic 5th

      // Attack & Exponential Decay (Bell envelope)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 1.5);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 2.0);
      osc2.stop(now + 2.0);
    } catch {
      // Audio autoplay policy fail-safe
    }
  }

  // Toggle ambient peaceful Saigon rain & botanical meditation soundscape
  public toggleAmbient(onStateChange?: (playing: boolean) => void): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.isPlayingAmbient) {
      // Stop ambient
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 600);
      }
      this.isPlayingAmbient = false;
      onStateChange?.(false);
      return false;
    } else {
      // Start ambient: Pink noise filtered for gentle Saigon rain + low drone chord
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 1.5);
      this.ambientGain.connect(this.masterGain);

      // Pink/Brown noise generator for rain
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(800, now);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(this.ambientGain);
      whiteNoise.start(now);
      this.rainNode = whiteNoise;

      // Gentle sub-bass harmonic meditation drone
      const droneOsc = this.ctx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(108, now); // 108Hz peaceful resonance

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.04, now);

      droneOsc.connect(droneGain);
      droneGain.connect(this.ambientGain);
      droneOsc.start(now);

      this.isPlayingAmbient = true;
      onStateChange?.(true);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbient;
  }
}

export const soundEngine = new BotanicalSoundEngine();
