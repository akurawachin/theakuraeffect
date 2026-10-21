// Web Audio API Euphoric & Calming Ambient Sound Generator
// Generates a soothing, euphoric analog pad chord progression,
// slow binaural beating, organic breath undertone, and shimmering celestial chimes.

class EuphoricSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private chordTimerId: number | null = null;
  private activeVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  // Soothing chord frequencies (F major / D minor euphoric ambient progressions in 432 Hz reference tuning)
  // Fmaj9 -> Dm9 -> Bbmaj7 -> Csus4
  private readonly chords: number[][] = [
    // Fmaj9: F2 (86.4Hz), C3 (129.6Hz), E3 (162Hz), A3 (216Hz), C4 (259.2Hz), G4 (384Hz)
    [86.4, 129.6, 162.0, 216.0, 259.2, 384.0],
    // Dm9: D2 (72.6Hz), A2 (108.9Hz), D3 (145.2Hz), F3 (172.8Hz), C4 (259.2Hz), E4 (324Hz)
    [72.6, 108.9, 145.2, 172.8, 259.2, 324.0],
    // Bbmaj7#11: Bb1 (57.6Hz), F2 (86.4Hz), D3 (145.2Hz), A3 (216Hz), E4 (324Hz)
    [57.6, 86.4, 145.2, 216.0, 324.0, 432.0],
    // Csus4: C2 (64.8Hz), G2 (97.2Hz), C3 (129.6Hz), F3 (172.8Hz), G3 (194.4Hz), D4 (288Hz)
    [64.8, 97.2, 129.6, 172.8, 194.4, 288.0],
  ];

  private currentChordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.isRunning) return;
    this.isRunning = true;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master Output & Limiter Stage
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    // Smooth, soothing gentle fade-in over 2.5 seconds
    this.masterGain.gain.linearRampToValueAtTime(0.28, now + 2.5);

    // Warm Low-pass Resonant Filter
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(620, now);
    this.filterNode.Q.setValueAtTime(1.1, now);

    // Filter LFO: slow, soothing breath modulation at ~0.08 Hz (approx 12-second breath cycle)
    this.lfoNode = ctx.createOscillator();
    this.lfoGain = ctx.createGain();
    this.lfoNode.frequency.setValueAtTime(0.08, now);
    this.lfoGain.gain.setValueAtTime(180, now); // Sweeps 440Hz - 800Hz
    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);
    this.lfoNode.start(now);

    // Stereo Spatial Ambient Delay
    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.48, now);
    this.delayGain = ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.32, now);

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(1200, now);

    // Connect delay feedback loop
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(delayFilter);
    delayFilter.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    this.delayGain.connect(this.masterGain);

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    // Soft warm oceanic tape undertone (filtered pink/brown noise)
    this.startWarmAir(ctx);

    // Start chord progression
    this.currentChordIndex = 0;
    this.transitionToChord(this.chords[this.currentChordIndex], 3.0);

    // Cycle chords every 7 seconds
    this.chordTimerId = window.setInterval(() => {
      if (!this.isRunning || !this.ctx) return;
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
      this.transitionToChord(this.chords[this.currentChordIndex], 3.5);
    }, 7000);

    // Trigger celestial shimmering chimes at serene intervals
    this.scheduleShimmerChimes();
  }

  // Plays a lush set of detuned oscillators for the ambient pad
  private transitionToChord(frequencies: number[], fadeTime: number) {
    if (!this.ctx || !this.filterNode) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Fade out previous voices
    const oldVoices = [...this.activeVoices];
    this.activeVoices = [];

    oldVoices.forEach(({ osc, gain }) => {
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore already stopped
        }
      }, fadeTime * 1000 + 100);
    });

    // Create new chord voices with slight detuning for rich warm chorusing
    frequencies.forEach((freq) => {
      // Create 2 voices per note with micro-detuning (binaural calming effect)
      [-4, 4].forEach((cents) => {
        const osc = ctx.createOscillator();
        const voiceGain = ctx.createGain();

        // Use combination of pure sine and mellow triangle
        osc.type = cents > 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(cents, now);

        voiceGain.gain.setValueAtTime(0.0001, now);
        // Staggered smooth attack
        const voiceTargetGain = 0.045 / Math.sqrt(frequencies.length);
        voiceGain.gain.linearRampToValueAtTime(voiceTargetGain, now + fadeTime);

        osc.connect(voiceGain);
        voiceGain.connect(this.filterNode!);

        osc.start(now);
        this.activeVoices.push({ osc, gain: voiceGain });
      });
    });
  }

  // Shimmering celestial chimes: high harmonic bells that resolve soothingly
  private scheduleShimmerChimes() {
    const playNextChime = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;

      const delayMs = 3000 + Math.random() * 4000;
      this.intervalId = window.setTimeout(() => {
        if (!this.isRunning || !this.ctx || !this.masterGain) return;

        // Euphoric pentatonic pitches in upper octaves
        const chimePitches = [576, 648, 768, 864, 1036.8, 1152, 1296];
        const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];

        this.triggerChime(pitch);
        playNextChime();
      }, delayMs);
    };

    playNextChime();
  }

  private triggerChime(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Fast gentle strike, long shimmering decay (euphoric bell tail)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.8);

    if (panNode) {
      panNode.pan.setValueAtTime((Math.random() - 0.5) * 0.75, now);
      osc.connect(gain);
      gain.connect(panNode);
      panNode.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(now);
    osc.stop(now + 4.0);
  }

  // Warm filtered noise for organic acoustic calm
  private startWarmAir(ctx: AudioContext) {
    if (!this.masterGain) return;
    try {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.setValueAtTime(260, ctx.currentTime);
      airFilter.Q.setValueAtTime(0.8, ctx.currentTime);

      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.018, ctx.currentTime);

      whiteNoise.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(this.masterGain);

      whiteNoise.start(ctx.currentTime);
      this.activeVoices.push({ osc: whiteNoise as unknown as OscillatorNode, gain: airGain });
    } catch {
      // Noise buffer fallback
    }
  }

  public stop(fadeSeconds = 1.6) {
    if (!this.isRunning || !this.ctx || !this.masterGain) {
      this.isRunning = false;
      return;
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    if (this.chordTimerId) {
      clearInterval(this.chordTimerId);
      this.chordTimerId = null;
    }

    // Smooth calming fade-out
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSeconds);
    } catch {
      // Ignore ramp error
    }

    setTimeout(() => {
      this.cleanup();
    }, fadeSeconds * 1000 + 100);

    this.isRunning = false;
  }

  private cleanup() {
    this.activeVoices.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.activeVoices = [];

    try {
      this.lfoNode?.stop();
      this.lfoNode?.disconnect();
      this.lfoGain?.disconnect();
      this.filterNode?.disconnect();
      this.delayNode?.disconnect();
      this.delayGain?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      // Cleanup catch
    }

    this.lfoNode = null;
    this.lfoGain = null;
    this.filterNode = null;
    this.delayNode = null;
    this.delayGain = null;
    this.masterGain = null;
  }

  public isSoundPlaying(): boolean {
    return this.isRunning;
  }
}

export const euphoricSound = new EuphoricSoundEngine();
