/**
 * サウンドシステム
 * Web Audio API でシンセサウンド生成 + カスタム音声ファイル対応
 */
const SoundEngine = (() => {
  let ctx = null;
  let masterGain = null;
  const audioCache = {};

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = STORE_CONFIG.sounds?.volume ?? 0.7;
      const compressor = ctx.createDynamicsCompressor();
      masterGain.connect(compressor);
      compressor.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function getMasterGain() {
    getCtx();
    return masterGain;
  }

  // カスタム音声ファイルを再生
  async function playCustom(url, options = {}) {
    if (!url) return false;
    const c = getCtx();
    try {
      let buffer = audioCache[url];
      if (!buffer) {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        buffer = await c.decodeAudioData(arr);
        audioCache[url] = buffer;
      }
      const source = c.createBufferSource();
      source.buffer = buffer;
      const gain = c.createGain();
      gain.gain.value = options.volume ?? 1;
      source.connect(gain);
      gain.connect(getMasterGain());
      source.loop = options.loop ?? false;
      source.start(0);
      return source;
    } catch (e) {
      console.warn('カスタム音声の再生に失敗:', url, e);
      return false;
    }
  }

  // カスタム音声があればそれを使い、なければシンセ
  async function playSound(name, synthFn, options = {}) {
    if (!STORE_CONFIG.sounds?.enabled) return null;
    const customUrl = STORE_CONFIG.sounds?.custom?.[name];
    if (customUrl) {
      const result = await playCustom(customUrl, options);
      if (result) return result;
    }
    return synthFn(options);
  }

  // === シンセサウンド ===

  function synthCorrect() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, c.currentTime);
    osc.frequency.setValueAtTime(659, c.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, c.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.4);
  }

  function synthWrong() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, c.currentTime);
    osc.frequency.setValueAtTime(150, c.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.3);
  }

  function synthSpin() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, c.currentTime);
    osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(300, c.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.25);
  }

  function synthResult() {
    const c = getCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, c.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.25, c.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(getMasterGain());
      osc.start(c.currentTime + i * 0.15);
      osc.stop(c.currentTime + i * 0.15 + 0.3);
    });
  }

  function synthCountdown() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.15);
  }

  function synthTimeup() {
    const c = getCtx();
    [440, 440, 440].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, c.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.2 + 0.15);
      osc.connect(gain);
      gain.connect(getMasterGain());
      osc.start(c.currentTime + i * 0.2);
      osc.stop(c.currentTime + i * 0.2 + 0.15);
    });
  }

  function synthFlip() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.1);
  }

  function synthMatch() {
    const c = getCtx();
    [523, 659, 784].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, c.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(getMasterGain());
      osc.start(c.currentTime + i * 0.12);
      osc.stop(c.currentTime + i * 0.12 + 0.2);
    });
  }

  function synthTap() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.1, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.05);
  }

  function synthFanfare() {
    const c = getCtx();
    const melody = [523, 659, 784, 1047, 784, 1047];
    melody.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, c.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(getMasterGain());
      osc.start(c.currentTime + i * 0.12);
      osc.stop(c.currentTime + i * 0.12 + 0.25);
    });
  }

  let bgmSource = null;
  function synthBgm() {
    if (bgmSource) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 220;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.loop = true;
    osc.start();
    bgmSource = { osc, gain };
  }

  function stopBgm() {
    if (bgmSource) {
      bgmSource.osc.stop();
      bgmSource = null;
    }
  }

  // === Public API ===
  return {
    init() { getCtx(); },
    correct()   { return playSound('correct', synthCorrect); },
    wrong()     { return playSound('wrong', synthWrong); },
    spin()      { return playSound('spin', synthSpin); },
    result()    { return playSound('result', synthResult); },
    countdown() { return playSound('countdown', synthCountdown); },
    timeup()    { return playSound('timeup', synthTimeup); },
    flip()      { return playSound('flip', synthFlip); },
    match()     { return playSound('match', synthMatch); },
    tap()       { return playSound('tap', synthTap); },
    fanfare()   { return playSound('fanfare', synthFanfare); },
    bgm()       { return playSound('bgm', synthBgm); },
    stopBgm,

    // カスタムボイス再生
    async voice(name) {
      const url = STORE_CONFIG.sounds?.custom?.[name];
      if (url) await playCustom(url);
    },

    // iOS対応: ユーザータッチでAudioContext初期化
    unlock() {
      const c = getCtx();
      const buf = c.createBuffer(1, 1, 22050);
      const src = c.createBufferSource();
      src.buffer = buf;
      src.connect(c.destination);
      src.start(0);
    }
  };
})();
