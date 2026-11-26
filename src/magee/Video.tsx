import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {Captions, ProgressBar} from '../ui';
import {Chute, Ending, Glass, Hit, Hook, Impossible, Jump, Memorial, Miles, Pow, RED, Saved, SceneProps, Who, Wounds} from './scenes';
import timings from './timings.json';
import beatData from './beats.json';

export const T = createTimeline(timings);
const SCENES: React.FC<SceneProps>[] = [Hook, Who, Hit, Chute, Jump, Miles, Impossible, Glass, Wounds, Saved, Pow, Memorial, Ending];

// ── Beat grid (from scripts/beats.py on the time-fitted score) ──
const BEATS = (beatData.beats as number[]).map((t) => Math.round(t * 30));
const nearestBeat = (fr: number) => BEATS.reduce((a, b) => (Math.abs(b - fr) < Math.abs(a - fr) ? b : a), BEATS[0]);
const nextBeat = (fr: number) => BEATS.find((b) => b >= fr) ?? fr;
/** Visual cut points: every scene starts on the beat nearest its narration. */
const VSTART = SCENES.map((_, i) => (i === 0 ? 0 : (() => {
  const b = nearestBeat(T.sceneStart(i));
  return Math.abs(b - T.sceneStart(i)) <= 12 ? b : T.sceneStart(i);
})()));
const VEND = (i: number) => (i === SCENES.length - 1 ? T.totalFrames : VSTART[i + 1]);

// Camera framings cycled every 4 beats inside a scene (hard cut on the beat).
const SHOTS = [
  {s: 1, x: 0, y: 0, r: 0},
  {s: 1.2, x: -40, y: 50, r: -1.2},
  {s: 1.14, x: 40, y: -30, r: 1},
  {s: 1.26, x: 0, y: 80, r: 0},
];
const Camera: React.FC<{start: number; seed: number; children: React.ReactNode}> = ({start, seed, children}) => {
  const frame = useCurrentFrame();
  const g = start + frame;
  const sceneBeats = BEATS.filter((b) => b >= start && b <= g);
  const k = Math.floor(Math.max(0, sceneBeats.length - 1) / 8);
  const shot = SHOTS[(k + seed) % SHOTS.length];
  const shotStart = sceneBeats.length ? sceneBeats[Math.floor((sceneBeats.length - 1) / 8) * 8] : start;
  const drift = Math.min(1, (g - shotStart) / 70);
  const last = sceneBeats.length ? sceneBeats[sceneBeats.length - 1] : -100;
  const punch = 0.008 * Math.exp(-(g - last) / 4);
  const enter = Math.exp(-frame / 4) * 0.03;
  const s = shot.s * (1 + 0.025 * drift) * (1 + punch + enter);
  return (
    <AbsoluteFill style={{transform: `translate(${shot.x}px, ${shot.y}px) rotate(${shot.r}deg) scale(${s})`}}>{children}</AbsoluteFill>
  );
};
/** Cut flash + film grain on top. */
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 3) return null;
  return <AbsoluteFill style={{background: '#fff8e6', opacity: 0.55 * (1 - frame / 3)}} />;
};
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.06, backgroundImage: 'radial-gradient(#000 1px, transparent 1.2px)', backgroundSize: '4px 4px', backgroundPosition: `${(frame * 7) % 4}px ${(frame * 3) % 4}px`, pointerEvents: 'none'}} />;
};

const INTENSITY = [1.1, 0.95, 1.1, 1.0, 1.05, 1.1, 0.9, 1.1, 1.0, 0.9, 0.9, 0.95, 0.9];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= VSTART[i + 1]) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out right before the big reveals and swells back after.
const DIPS = [at(6, () => 0), at(8, (c) => c.s(3))];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  {scene: 0, at: () => 0, file: 'wind', vol: 0.4, until: (c) => c.dur},
  {scene: 0, at: () => 0, file: 'impact', vol: 0.8},
  {scene: 0, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 1, at: () => 0, file: 'jet', vol: 0.25, until: (c) => c.dur},
  {scene: 2, at: () => 4, file: 'impact', vol: 0.85},
  {scene: 2, at: () => 0, file: 'thunder', vol: 0.35, until: (c) => c.dur},
  {scene: 3, at: () => 4, file: 'hit', vol: 0.6},
  {scene: 4, at: () => 0, file: 'wind', vol: 0.4, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(2), file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 5, at: () => 0, file: 'wind', vol: 0.45, until: (c) => c.dur},
  {scene: 6, at: () => 0, file: 'riser', vol: 0.35, until: (c) => c.dur},
  {scene: 7, at: (c) => c.s(0) + 30, file: 'impact', vol: 0.95},
  {scene: 7, at: (c) => c.s(0) + 32, file: 'glitch', vol: 0.25, until: (c) => c.s(0) + 50},
  {scene: 8, at: () => 4, file: 'hit', vol: 0.55},
  {scene: 8, at: (c) => c.s(1), file: 'hit', vol: 0.5},
  {scene: 8, at: (c) => c.s(2), file: 'hit', vol: 0.5},
  {scene: 8, at: (c) => c.s(3), file: 'chime', vol: 0.4},
  {scene: 9, at: () => 20, file: 'pop', vol: 0.45},
  {scene: 10, at: () => 10, file: 'ticks-fast', vol: 0.25, until: () => 80},
  {scene: 11, at: () => 8, file: 'chime', vol: 0.4},
  {scene: 12, at: () => 2, file: 'pop', vol: 0.45},
];

export const Magee: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
  const play = (part: 'voice' | 'fx' | 'music') => stem === 'all' || stem === part;
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 80px Anton'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#0b0a09'}}>
      {SCENES.map((Scene, i) => {
        const start = VSTART[i];
        const off = T.sceneStart(i) - start;
        const c = T.cues(i);
        const cue: Cues = {...c, dur: VEND(i) - start, s: (n: number) => c.s(n) + off, e: (n: number) => c.e(n) + off, w: (m: string, nth?: number) => c.w(m, nth) + off};
        const beat = (fr: number) => nextBeat(start + fr) - start;
        return (
          <Sequence key={i} from={start} durationInFrames={VEND(i) - start}>
            <Camera start={start} seed={i}>
              <Scene cue={cue} beat={beat} />
            </Camera>
            {play('fx') && i > 0 ? <Audio src={staticFile('sfx/whoosh2.wav')} volume={(fr) => MIXER.fx(0.35, start + fr)} /> : null}
          </Sequence>
        );
      })}
      <Grain />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 66%, rgba(0,0,0,0.62) 72%, rgba(0,0,0,0.62) 84%, transparent 90%)', pointerEvents: 'none'}} />
      <Captions lines={T.lines} accent={RED} />
      <ProgressBar total={T.totalFrames} color={RED} />
      {play('voice')
        ? T.lines.map((line) => (
            <Sequence key={line.index} from={f(line.start)}>
              <Audio src={staticFile(line.file)} />
            </Sequence>
          ))
        : null}
      {play('fx')
        ? SFX.map((x, k) => {
            const c = T.cues(x.scene);
            const from = T.sceneStart(x.scene) + Math.max(0, x.at(c));
            return (
              <Sequence key={`sfx${k}`} from={from} durationInFrames={x.until ? Math.max(1, T.sceneStart(x.scene) + x.until(c) - from) : undefined}>
                <Audio src={staticFile(`sfx/${x.file}.wav`)} volume={(fr) => MIXER.fx(x.vol, from + fr)} />
              </Sequence>
            );
          })
        : null}
      {play('music') ? <Audio src={staticFile('magee/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
