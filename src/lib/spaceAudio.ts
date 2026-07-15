class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private humGain: GainNode | null = null;
  private windGain: GainNode | null = null;

  // Oscillators for Hum
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  // Nodes for Wind
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;

  private isRunning = false;
  private currentVolume = 0.5;

  private init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Hum Setup (LFO/Low beat)
    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.humGain.connect(this.masterGain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.connect(this.humGain);

    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = "sawtooth";
    this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
    this.osc1.connect(filter);

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = "sine";
    this.osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // slightly detuned for beating
    this.osc2.connect(filter);

    // Solar Wind Setup (Filtered noise modulated by LFO)
    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.windGain.connect(this.masterGain);

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    this.windFilter.connect(this.windGain);

    // Generate White Noise Buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(this.windFilter);
    whiteNoise.start(0);

    // LFO to sweep wind filter frequency
    this.windLfo = this.ctx.createOscillator();
    this.windLfo.type = "sine";
    this.windLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow sweep (12 seconds)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Sweep range (250Hz)
    
    this.windLfo.connect(lfoGain);
    
    // Center of sweep is 450Hz
    this.windFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    lfoGain.connect(this.windFilter.frequency);
    
    this.windLfo.start(0);

    // Start Hum oscillators
    this.osc1.start(0);
    this.osc2.start(0);
  }

  public start() {
    if (this.isRunning) return;
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isRunning = true;
  }

  public stop() {
    if (!this.isRunning) return;
    if (this.ctx && this.ctx.state === "running") {
      this.ctx.suspend();
    }
    this.isRunning = false;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume() {
    return this.currentVolume;
  }
}

export const spaceAudio = new SpaceAudioEngine();
