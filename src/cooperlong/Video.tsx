import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import * as S from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = Array.from({length: 47}, (_, i) => (S as unknown as Record<string, React.FC<{cue: Cues}>>)[`S${i}`]);
// Page tilts between the photo 'files', parallax pushes into the set pieces.
const KINDS: TransitionKind[] = ['tilt', 'zoom', 'whip', 'tilt', 'wipe', 'zoom', 'tilt', 'slide', 'zoom', 'whip', 'tilt', 'wipe'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Chapter energy: cold open tense, the hijack builds, the jump peaks, the money is quieter, suspects tense, ending reflective.
const INTENSITY = [1.05, 1.05, 1.0, 1.0, 0.85, 0.85, 0.85, 0.9, 1.0, 1.05, 1.0, 1.0, 0.9, 0.9, 0.9, 0.95, 1.0, 1.05, 1.05, 1.1, 1.1, 1.15, 1.15, 1.05, 1.0, 0.95, 1.0, 1.0, 0.9, 0.85, 0.9, 0.9, 0.95, 1.0, 0.9, 0.95, 1.0, 0.95, 0.95, 1.0, 1.05, 0.95, 0.95, 0.95, 0.9, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.w('stepped')),
  at(8, (c) => c.s(2)),
  at(16, (c) => c.s(1)),
  at(21, (c) => c.s(1)),
  at(23, (c) => c.s(2)),
  at(30, (c) => c.s(2)),
  at(33, () => 0),
  at(39, () => 0),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // cold open
  {scene: 0, at: () => 0, file: 'thunder', vol: 0.6},
  {scene: 0, at: () => 0, file: 'jet', vol: 0.35, until: (c) => c.dur},
  {scene: 0, at: () => 0, file: 'rain', vol: 0.25, until: (c) => c.dur},
  {scene: 0, at: (c) => c.w('stepped'), file: 'whoosh2', vol: 0.6},
  {scene: 1, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: (c) => c.w('strapped') + 6, file: 'impact', vol: 0.85},
  ...[2, 3, 4].map((k): Sfx => ({scene: 2, at: (c) => c.s(k) - 2, file: 'hit', vol: 0.6})),
  {scene: 3, at: () => 0, file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  {scene: 3, at: (c) => c.w('Who'), file: 'impact', vol: 0.85},
  // ch1
  {scene: 4, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 4, at: (c) => c.w('Dan') - 6, file: 'swipe', vol: 0.5},
  ...[1, 2, 3, 4, 5].map((k): Sfx => ({scene: 5, at: (c) => c.s(k) - 3, file: 'pop', vol: 0.4})),
  {scene: 6, at: () => 0, file: 'jet', vol: 0.35, until: (c) => c.s(3)},
  {scene: 6, at: (c) => c.s(3), file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 7, at: () => 0, file: 'clock', vol: 0.25, until: (c) => c.dur},
  {scene: 8, at: () => 4, file: 'type', vol: 0.35, until: () => 60},
  {scene: 8, at: (c) => c.s(2), file: 'impact', vol: 0.95},
  {scene: 9, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  ...[1, 2, 3].map((k): Sfx => ({scene: 9, at: (c) => c.s(k) - 3, file: 'hit', vol: 0.55})),
  ...[1, 2, 3, 4].map((k): Sfx => ({scene: 10, at: (c) => c.s(k) - 2, file: 'type', vol: 0.35, until: (c) => c.s(k) + 25})),
  {scene: 11, at: (c) => c.s(1) + 8, file: 'impact', vol: 0.8},
  // ch2
  {scene: 12, at: () => 0, file: 'jet', vol: 0.3, until: (c) => c.dur},
  {scene: 13, at: (c) => c.w('McChord'), file: 'chime', vol: 0.4},
  {scene: 14, at: (c) => c.w('photograph'), file: 'ticks-fast', vol: 0.3, until: (c) => c.dur},
  {scene: 15, at: () => 0, file: 'rain', vol: 0.2, until: (c) => c.dur},
  {scene: 15, at: () => 0, file: 'jet', vol: 0.2, until: () => 60},
  {scene: 16, at: (c) => c.s(1), file: 'riser', vol: 0.35},
  {scene: 16, at: (c) => c.s(1) + 10, file: 'impact', vol: 0.9},
  ...[0, 1, 2, 3, 4].map((k): Sfx => ({scene: 17, at: (c) => c.s(k) - 3, file: 'pop', vol: 0.45})),
  {scene: 18, at: (c) => c.s(2), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  // ch3
  {scene: 19, at: () => 0, file: 'thunder', vol: 0.55},
  {scene: 19, at: () => 0, file: 'jet', vol: 0.4, until: (c) => c.s(1)},
  {scene: 19, at: () => 0, file: 'rain', vol: 0.25, until: (c) => c.s(1)},
  {scene: 19, at: (c) => c.s(1), file: 'clock', vol: 0.25, until: (c) => c.dur},
  {scene: 20, at: () => 0, file: 'siren', vol: 0.25, until: (c) => c.dur},
  {scene: 21, at: () => 0, file: 'wind', vol: 0.35, until: (c) => c.dur},
  {scene: 21, at: (c) => c.s(1) - 6, file: 'impact', vol: 0.95},
  {scene: 22, at: () => 0, file: 'wind', vol: 0.45, until: (c) => c.dur},
  {scene: 22, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 23, at: () => 0, file: 'siren', vol: 0.3, until: (c) => c.s(2) + 20},
  {scene: 23, at: (c) => c.s(2) + 20, file: 'impact', vol: 0.85},
  {scene: 24, at: (c) => c.w('tie'), file: 'hit', vol: 0.6},
  {scene: 25, at: () => 6, file: 'ticks-fast', vol: 0.2, until: (c) => c.s(1)},
  {scene: 25, at: (c) => c.s(1), file: 'riser', vol: 0.3},
  // ch4
  {scene: 26, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 26, at: (c) => c.w('Helicopters') - 10, file: 'jet', vol: 0.25, until: (c) => c.dur},
  ...[1, 2, 3].map((k): Sfx => ({scene: 27, at: (c) => c.s(k) - 2, file: 'hit', vol: 0.55})),
  {scene: 28, at: (c) => c.s(1), file: 'clock', vol: 0.25, until: (c) => c.dur},
  {scene: 29, at: () => 0, file: 'rain', vol: 0.08, until: (c) => c.dur},
  {scene: 29, at: (c) => c.w('bundles') - 4, file: 'chime', vol: 0.45},
  {scene: 30, at: () => 4, file: 'impact', vol: 0.8},
  {scene: 30, at: (c) => c.s(2) + 4, file: 'hit', vol: 0.7},
  {scene: 31, at: (c) => c.s(2), file: 'whoosh', vol: 0.45},
  {scene: 32, at: () => 0, file: 'wind', vol: 0.2, until: (c) => c.dur},
  {scene: 32, at: (c) => c.s(4), file: 'impact', vol: 0.8},
  {scene: 33, at: (c) => c.w('who'), file: 'impact', vol: 0.85},
  // ch5
  {scene: 34, at: () => 4, file: 'type', vol: 0.25, until: () => 50},
  {scene: 34, at: (c) => c.w('stuck') - 20, file: 'swipe', vol: 0.5},
  ...[0, 4, 8, 12, 16, 20].map((d): Sfx => ({scene: 35, at: () => d, file: 'pop', vol: 0.3})),
  {scene: 36, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 36, at: (c) => c.s(1), file: 'jet', vol: 0.3, until: (c) => c.w('parachute')},
  {scene: 36, at: (c) => c.w('1974'), file: 'hit', vol: 0.6},
  {scene: 37, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 38, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 39, at: () => 6, file: 'impact', vol: 0.9},
  {scene: 40, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 40, at: (c) => c.s(4), file: 'thunder', vol: 0.5},
  // payoff
  {scene: 41, at: (c) => c.w('2016') + 10, file: 'impact', vol: 0.85},
  {scene: 42, at: (c) => c.w('metal'), file: 'glitch', vol: 0.35},
  {scene: 42, at: (c) => c.w('pages') - 6, file: 'swipe', vol: 0.5},
  ...[1, 2, 3, 4].map((k): Sfx => ({scene: 43, at: (c) => c.s(k), file: 'whoosh2', vol: 0.4})),
  {scene: 44, at: () => 0, file: 'rain', vol: 0.25, until: (c) => c.dur},
  {scene: 44, at: () => 0, file: 'jet', vol: 0.25, until: (c) => c.dur},
  {scene: 45, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 45, at: (c) => c.s(2), file: 'hit', vol: 0.55},
  {scene: 45, at: (c) => c.s(3), file: 'pop', vol: 0.5},
  {scene: 46, at: () => 6, file: 'whoosh2', vol: 0.45},
  {scene: 46, at: (c) => c.s(1), file: 'chime', vol: 0.4},
];

export const CooperLong: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
  const play = (part: 'voice' | 'fx' | 'music') => stem === 'all' || stem === part;
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 80px Anton'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      {SCENES.map((Scene, i) => {
        const start = T.sceneStart(i);
        const last = i === SCENES.length - 1;
        // Each scene runs TRANSITION_FRAMES past its cut so the next one can transition in over it.
        const dur = T.sceneEnd(i) - start + (last ? 0 : TRANSITION_FRAMES);
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <ExitShade start={T.sceneEnd(i) - start}>
              <EnterTransition kind={transitionFor(i)} disabled={i === 0}>
                <Scene cue={T.cues(i)} />
              </EnterTransition>
            </ExitShade>
            {play('fx') && i > 0 ? <Audio src={staticFile('sfx/whoosh2.wav')} volume={(fr) => MIXER.fx(0.4, start + fr)} /> : null}
          </Sequence>
        );
      })}
      <Captions lines={T.lines} accent={S.AMBER} top={962} size={56} side={300} />
      <ProgressBar total={T.totalFrames} color={S.AMBER} />
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
      {play('music') ? <Audio src={staticFile('cooperlong/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
