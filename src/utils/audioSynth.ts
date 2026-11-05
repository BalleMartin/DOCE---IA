/**
 * Web Audio API synthesizer for ambient study sounds & Pomodoro chimes.
 * Works 100% offline without external audio files.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeSound: 'lofi' | 'rain' | 'coffee' | 'none' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSound(type: 'lofi' | 'rain' | 'coffee') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'rain') {
      this.startRainSynth();
    } else if (type === 'lofi') {
      this.startLofiSynth();
    } else if (type === 'coffee') {
      this.startCoffeeSynth();
    }

    this.isPlaying = true;
    this.activeSound = type;
  }

  private startRainSynth() {
    if (!this.ctx || !this.gainNode) return;
    // Pink/Brown noise generator for gentle rainfall
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

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.currentSource = whiteNoise;
  }

  private startLofiSynth() {
    if (!this.ctx || !this.gainNode) return;
    // Ambient warm oscillating harmonic pad
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3
    osc2.frequency.setValueAtTime(196.00, this.ctx.currentTime); // G3

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // Very slow 0.2Hz wave
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    lfo.connect(lfoGain.gain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.gainNode);

    osc1.start();
    osc2.start();
    lfo.start();
    this.currentSource = osc1;
  }

  private startCoffeeSynth() {
    if (!this.ctx || !this.gainNode) return;
    // Cozy warm low rumble murmur
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(85, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(this.gainNode);
    osc.start();
    this.currentSource = osc;
  }

  public playChime() {
    this.initContext();
    if (!this.ctx) return;
    const chimeGain = this.ctx.createGain();
    chimeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);
    chimeGain.connect(this.ctx.destination);

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
      osc.connect(chimeGain);
      osc.start(this.ctx!.currentTime + idx * 0.12);
      osc.stop(this.ctx!.currentTime + 1.8);
    });
  }

  public stop() {
    if (this.currentSource) {
      try {
        (this.currentSource as AudioScheduledSourceNode).stop();
      } catch {
        // Source might not have stop
      }
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.activeSound = 'none';
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      activeSound: this.activeSound
    };
  }
}

export const soundEngine = new AmbientAudioEngine();
