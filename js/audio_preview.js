/**
 * ネオ・ブルース・コンポーザー - Web Audio API リアルタイム試聴エンジン
 * 12小節ブルース進行（シャッフルリズム）× チューブアンプ歪み × ウォーキングベース
 */

class NeoBluesAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.currentBar = 0;
    this.currentBeat = 0;
    this.masterGain = null;
    this.driveNode = null;
    this.onTickCallback = null;
    this.onStateChangeCallback = null;
    this.volume = 0.75;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // マスターゲイン
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // 真空管チューブアンプ風のサチュレーション（WaveShaper）
      this.driveNode = this.ctx.createWaveShaper();
      this.driveNode.curve = this.makeDistortionCurve(18);
      this.driveNode.oversample = '2x';

      // フィルター（アナログアンプのキャビネット再現）
      this.cabFilter = this.ctx.createBiquadFilter();
      this.cabFilter.type = 'lowpass';
      this.cabFilter.frequency.setValueAtTime(3800, this.ctx.currentTime);
      this.cabFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.driveNode.connect(this.cabFilter);
      this.cabFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // チューブアンプサチュレーションカーブ生成
  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 15;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  toggle(getState, onTick, onStateChange) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
    } else {
      this.start(getState, onTick, onStateChange);
      if (onStateChange) onStateChange(true);
    }
  }

  start(getState, onTick, onStateChange) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.onTickCallback = onTick;
    this.onStateChangeCallback = onStateChange;

    this.currentBar = 0;
    this.currentBeat = 0;

    const scheduleLoop = () => {
      if (!this.isPlaying) return;

      const state = getState ? getState() : { tempo: 92 };
      const bpm = Number(state.tempo) || 92;
      // 1拍の長さ（秒）
      const beatDuration = 60 / bpm;
      // シャッフル（ハネた8分音符: 2:1のスイング比率）
      const swingRatio = 0.64;

      this.playShuffleBeat(this.ctx.currentTime, beatDuration, swingRatio, this.currentBar, this.currentBeat, state);

      if (this.onTickCallback) {
        this.onTickCallback(this.currentBar, this.currentBeat);
      }

      this.currentBeat++;
      if (this.currentBeat >= 4) {
        this.currentBeat = 0;
        this.currentBar = (this.currentBar + 1) % 12; // 12小節循環
      }

      this.timerId = setTimeout(scheduleLoop, beatDuration * 1000);
    };

    scheduleLoop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false);
    }
  }

  // 12小節ブルース進行のルート音とコード定義 (Key of E)
  getChordForBar(bar, progKey) {
    if (progKey === 'minor_blues_am') {
      // Aマイナー 12小節ブルース: Am(4) - Dm(2) - Am(2) - Dm(1) - E7(1) - Am(1) - E7(1)
      const minor12 = [
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 1
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 2
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 3
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 4
        { root: 293.66, notes: [293.66, 349.23, 440.00, 523.25], name: 'Dm7' }, // 5
        { root: 293.66, notes: [293.66, 349.23, 440.00, 523.25], name: 'Dm7' }, // 6
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 7
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 8
        { root: 293.66, notes: [293.66, 349.23, 440.00, 523.25], name: 'Dm7' }, // 9
        { root: 329.63, notes: [329.63, 415.30, 493.88, 587.33], name: 'E7' },  // 10
        { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], name: 'Am7' }, // 11
        { root: 329.63, notes: [329.63, 415.30, 493.88, 587.33], name: 'E7' }   // 12
      ];
      return minor12[bar % 12];
    }

    // デフォルト: Eメジャー 12小節ブルース: E7(4) - A7(2) - E7(2) - B7(1) - A7(1) - E7(1) - B7(1)
    const major12 = [
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 1
      { root: 220.00, notes: [220.00, 277.18, 329.63, 392.00], name: 'A7' }, // 2 (Quick Change)
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 3
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 4
      { root: 220.00, notes: [220.00, 277.18, 329.63, 392.00], name: 'A7' }, // 5
      { root: 220.00, notes: [220.00, 277.18, 329.63, 392.00], name: 'A7' }, // 6
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 7
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 8
      { root: 246.94, notes: [246.94, 311.13, 369.99, 440.00], name: 'B7' }, // 9
      { root: 220.00, notes: [220.00, 277.18, 329.63, 392.00], name: 'A7' }, // 10
      { root: 164.81, notes: [164.81, 207.65, 246.94, 293.66], name: 'E7' }, // 11
      { root: 246.94, notes: [246.94, 311.13, 369.99, 440.00], name: 'B7' }  // 12 (Turnaround)
    ];
    return major12[bar % 12];
  }

  // 1拍（Beat）ごとのシャッフル演奏
  playShuffleBeat(time, beatDuration, swing, bar, beat, state) {
    const chord = this.getChordForBar(bar, state.progression);
    const sub808 = state.insts && state.insts.has('sub_808_bass');
    const hasHarmonica = state.insts && state.insts.has('crying_harmonica');

    // 1. ドラム・リズム (キック・スネア・ハット)
    // 拍1と拍3: キック (または重低音808)
    if (beat === 0 || beat === 2) {
      this.playKick(time, sub808 ? 1.4 : 1.0);
    }
    // 拍2と拍4: スネア / ハンドクラップ
    if (beat === 1 || beat === 3) {
      this.playSnare(time);
    }
    // ハネたハイハット（表拍と裏拍）
    this.playHiHat(time, 0.7);
    this.playHiHat(time + beatDuration * swing, 0.5);

    // 2. シャッフル・ベースライン（伝統のブギ・リフ: 1拍ごとに進行）
    // Root -> 5th -> 6th -> b7th のようなブルースベース
    const bassFreq = chord.root * 0.5; // 1オクターブ下
    let notePitch = bassFreq;
    if (beat === 0) notePitch = bassFreq;
    if (beat === 1) notePitch = bassFreq * 1.25; // 3度
    if (beat === 2) notePitch = bassFreq * 1.5;  // 5度
    if (beat === 3) notePitch = bassFreq * 1.68; // 6度/短7度
    this.playBass(time, notePitch, beatDuration * 0.85);

    // 3. 歪みギター / オルガン・コード（拍2・4の裏拍や拍1のアクセント）
    if (beat === 0 || beat === 2) {
      this.playGuitarChord(time, chord.notes, beatDuration * 0.7);
    } else {
      // 軽快なチャカッというカッティング
      this.playGuitarChord(time + beatDuration * swing, chord.notes, beatDuration * 0.4);
    }

    // 4. 時折入るスライドギター／ブルースハープのブルースペンタ・フレーズ
    if (beat === 2 && (bar % 2 === 1 || hasHarmonica)) {
      this.playBluesLick(time + beatDuration * 0.5, chord.root * 2);
    }
  }

  // キックドラム（アコースティック/808ハイブリッド）
  playKick(time, weight = 1.0) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12 * weight);

    gain.gain.setValueAtTime(0.85 * weight, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25 * weight);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.26 * weight);
  }

  // スネアドラム（スナップ＆ファット）
  playSnare(time) {
    // ノイズ（スナッピー）
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(900, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.17);

    // トーン成分
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.11);
  }

  // ハイハット
  playHiHat(time, gainVal = 0.5) {
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // ウォーキング・ベース
  playBass(time, freq, dur) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.driveNode);

    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  // ギター / オルガン・和音コード
  playGuitarChord(time, freqs, dur) {
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // わずかなピッキングズレ（リアルなストラミング感）
      const strumOffset = idx * 0.012;
      const t = time + strumOffset;

      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.driveNode);

      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  }

  // スライドギター風のチョーキング・ベンドリック
  playBluesLick(time, baseFreq) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // ブルーノート（短3度から長3度へチョーキング・スライド）
    const b3 = baseFreq * 1.2;
    const M3 = baseFreq * 1.26;
    osc.frequency.setValueAtTime(b3, time);
    osc.frequency.exponentialRampToValueAtTime(M3, time + 0.14);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.driveNode);

    osc.start(time);
    osc.stop(time + 0.36);
  }
}

export const neoBluesAudio = new NeoBluesAudioEngine();
