import {FPS, Line} from './lib';

// Mix levels. Voice always plays at 1.0; everything else sits under it.
export const MIX = {
  fxGain: 0.55, // overall sound-effect level
  fxUnderVoice: 0.4, // extra multiplier on effects while the narrator is speaking
  musicGain: 0.55, // music level between lines
  musicUnderVoice: 0.6, // music multiplier while the narrator is speaking
};

/** Ducking helpers driven by when the narrator is actually speaking. */
export const createMix = (
  lines: Line[],
  totalFrames: number,
  opts: {dips?: number[]; intensity?: (frame: number) => number; musicGain?: number; musicUnderVoice?: number} = {},
) => {
  const musicGain = opts.musicGain ?? MIX.musicGain;
  const musicUnderVoice = opts.musicUnderVoice ?? MIX.musicUnderVoice;
  const n = totalFrames + 1;
  const raw = new Float32Array(n);
  for (const l of lines)
    for (const s of l.sentences) {
      const a = Math.max(0, Math.floor((s.start - 0.08) * FPS));
      const b = Math.min(n - 1, Math.ceil((s.end + 0.15) * FPS));
      for (let f = a; f <= b; f++) raw[f] = 1;
    }
  // Smooth the envelope: 4-frame attack before speech, 12-frame release after it.
  const env = new Float32Array(n);
  let v = 0;
  for (let f = 0; f < n; f++) {
    v = raw[f] > v ? raw[f] : Math.max(raw[f], v - 1 / 12);
    env[f] = v;
  }
  v = 0;
  for (let f = n - 1; f >= 0; f--) {
    v = env[f] > v ? env[f] : Math.max(env[f], v - 1 / 4);
    env[f] = Math.max(env[f], v);
  }
  const speech = (f: number) => env[Math.max(0, Math.min(n - 1, Math.round(f)))];
  // Tension-release: the music drops out just before each big reveal and swells back after it.
  const dip = (f: number) => {
    let m = 1;
    for (const d of opts.dips ?? []) {
      if (f >= d - 22 && f < d) m = Math.min(m, 0.15 + 0.85 * Math.max(0, (d - 14 - f) / 8));
      else if (f >= d && f < d + 20) m = Math.min(m, 0.15 + 0.85 * ((f - d) / 20));
    }
    return m;
  };
  const fade = (f: number) => Math.min(1, f / 30, (totalFrames - f) / 75);
  return {
    speech,
    fx: (base: number, f: number) => base * MIX.fxGain * (1 - speech(f) * (1 - MIX.fxUnderVoice)),
    music: (f: number) => Math.min(1, Math.max(0, musicGain * (opts.intensity?.(f) ?? 1) * dip(f) * fade(f) * (1 - speech(f) * (1 - musicUnderVoice)))),
  };
};
