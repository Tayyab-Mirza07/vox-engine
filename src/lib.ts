import {Easing, interpolate} from 'remotion';
import timings from './timings.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg: '#07090c',
  panel: '#11161c',
  line: '#232b35',
  green: '#76B900',
  red: '#ff3b30',
  white: '#f5f7fa',
  dim: '#8a94a3',
  warm: '#ffb347',
};

export const DISPLAY = 'Anton, Impact, sans-serif';
export const BODY = 'Inter, sans-serif';

export type Word = {w: string; start: number; end: number};
export type Sentence = {text: string; start: number; end: number; words: Word[]};
export type Line = {index: number; file: string; start: number; dur: number; sentences: Sentence[]};

export const LINES = timings.lines as Line[];
export const TOTAL_FRAMES = Math.ceil(timings.total * FPS);
export const f = (seconds: number) => Math.round(seconds * FPS);

// Each scene starts a beat before its voiceover line and runs to the next scene.
const SCENE_LEAD = 0.2;
export const sceneStart = (i: number) => (i === 0 ? 0 : f(LINES[i].start - SCENE_LEAD));
export const sceneEnd = (i: number) => (i === LINES.length - 1 ? TOTAL_FRAMES : sceneStart(i + 1));

/** Timing cues for one scene, in frames relative to the scene's start. */
export const cues = (i: number) => {
  const line = LINES[i];
  const t0 = sceneStart(i);
  const words = line.sentences.flatMap((s) => s.words);
  return {
    dur: sceneEnd(i) - t0,
    /** start frame of sentence n */
    s: (n: number) => f(line.sentences[n].start) - t0,
    /** end frame of sentence n */
    e: (n: number) => f(line.sentences[n].end) - t0,
    /** start frame of the nth word containing `match` */
    w: (match: string, nth = 0) => {
      const hits = words.filter((x) => x.w.toLowerCase().includes(match.toLowerCase()));
      if (!hits[nth]) throw new Error(`cue "${match}" not found in line ${i}`);
      return f(hits[nth].start) - t0;
    },
  };
};
export type Cues = ReturnType<typeof cues>;

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const out = Easing.out(Easing.cubic);
export const inOut = Easing.inOut(Easing.cubic);

/** 0→1 progress starting at `start` over `dur` frames. */
export const p = (frame: number, start: number, dur = 10, easing: (n: number) => number = out) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clampOpts, easing});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Slam-in scale: overshoots from big to 1. */
export const slam = (frame: number, start: number, from = 2.6) => {
  const t = p(frame, start, 7, Easing.out(Easing.back(1.6)));
  return {opacity: p(frame, start, 3), scale: lerp(from, 1, t)};
};

/** Deterministic pseudo-random in [0,1). */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
