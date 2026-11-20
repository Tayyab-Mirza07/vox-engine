import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {CallToAction, Dark, Debris, Hook, LastWords, Military, NoFind, Pings, RED, Report, Search, South, StillWaiting, Takeoff, TheMath, Theories, Turn, Why} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Takeoff, LastWords, Dark, Military, Turn, Pings, TheMath, South, Search, Debris, Why, Theories, Report, NoFind, StillWaiting, CallToAction];
// Page tilts between the photo 'files', parallax pushes into the set pieces.
const KINDS: TransitionKind[] = ['zoom', 'tilt', 'whip', 'zoom', 'wipe', 'zoom', 'whip', 'zoom', 'slide', 'wipe', 'zoom', 'tilt', 'tilt', 'zoom', 'slide', 'wipe'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Lonely night flight, tension through the turn and the pings, heavy at the search, quiet at 'why', open at the end.
const INTENSITY = [1.0, 0.85, 0.9, 1.0, 1.05, 1.05, 1.0, 1.05, 1.05, 1.1, 0.95, 0.9, 1.0, 1.0, 0.95, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.s(2)),
  at(3, (c) => c.w('disappears')),
  at(4, (c) => c.s(2)),
  at(9, (c) => c.s(2)),
  at(11, (c) => c.s(2)),
  at(13, (c) => c.s(2)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: (c) => c.s(1) - 4, file: 'jet', vol: 0.35, until: (c) => c.dur},
  {scene: 0, at: (c) => c.w('nobody'), file: 'glitch', vol: 0.5},
  {scene: 0, at: (c) => c.w('nobody') + 4, file: 'hit', vol: 0.8},
  // 1 · takeoff
  {scene: 1, at: () => 0, file: 'jet', vol: 0.4, until: (c) => c.s(2)},
  {scene: 1, at: () => 4, file: 'pop', vol: 0.4},
  {scene: 1, at: (c) => c.s(2), file: 'whoosh', vol: 0.45},
  // 2 · last words
  {scene: 2, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 2, at: (c) => c.s(1) - 2, file: 'glitch', vol: 0.35},
  // 3 · transponder dark
  {scene: 3, at: () => 0, file: 'ticks-fast', vol: 0.2, until: (c) => c.w('dark')},
  {scene: 3, at: (c) => c.w('dark'), file: 'hit', vol: 0.7},
  {scene: 3, at: (c) => c.w('disappears'), file: 'glitch', vol: 0.55},
  // 4 · military radar
  {scene: 4, at: () => 0, file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  // 5 · the turn
  {scene: 5, at: () => 6, file: 'whoosh2', vol: 0.55},
  {scene: 5, at: () => 8, file: 'hit', vol: 0.6},
  {scene: 5, at: (c) => c.w('Penang'), file: 'pop', vol: 0.45},
  {scene: 5, at: (c) => c.w('Andaman'), file: 'pop', vol: 0.45},
  {scene: 5, at: (c) => c.s(2), file: 'impact', vol: 0.8},
  // 6 · pings
  ...[0, 1, 2, 3, 4, 5].map((k): Sfx => ({scene: 6, at: (c) => c.s(1) + Math.floor(Math.max(20, (c.dur - c.s(1)) / 6)) * k, file: 'chime', vol: 0.35})),
  {scene: 6, at: (c) => c.s(1), file: 'heartbeat', vol: 0.25, until: (c) => c.dur},
  // 7 · the math
  {scene: 7, at: () => 0, file: 'type', vol: 0.25, until: () => 40},
  {scene: 7, at: (c) => c.dur - 24, file: 'riser', vol: 0.35},
  // 8 · south
  {scene: 8, at: () => 2, file: 'whoosh2', vol: 0.5},
  {scene: 8, at: (c) => c.w('fuel'), file: 'hit', vol: 0.6},
  // 9 · search
  {scene: 9, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 9, at: () => 0, file: 'rain', vol: 0.15, until: (c) => c.dur},
  {scene: 9, at: (c) => c.s(1), file: 'jet', vol: 0.25, until: (c) => c.s(2)},
  {scene: 9, at: (c) => c.s(2), file: 'impact', vol: 0.8},
  // 10 · debris
  {scene: 10, at: () => 0, file: 'wind', vol: 0.2, until: (c) => c.dur},
  {scene: 10, at: () => 4, file: 'chime', vol: 0.35},
  // 11 · why
  {scene: 11, at: (c) => c.s(2) - 10, file: 'riser', vol: 0.35},
  {scene: 11, at: (c) => c.s(2), file: 'impact', vol: 0.9},
  // 12 · theories
  ...['fire', 'hijacking', 'oxygen'].map((w): Sfx => ({scene: 12, at: (c) => c.w(w) - 6, file: 'swipe', vol: 0.5})),
  // 13 · simulator + report
  {scene: 13, at: () => 6, file: 'ticks-fast', vol: 0.2, until: () => 56},
  {scene: 13, at: (c) => c.s(2) + 6, file: 'type', vol: 0.35, until: (c) => c.s(2) + 50},
  {scene: 13, at: (c) => c.s(2) + 50, file: 'impact', vol: 0.85},
  // 14 · ocean infinity
  {scene: 14, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.dur},
  {scene: 14, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 14, at: (c) => c.s(2), file: 'hit', vol: 0.7},
  // 15 · still waiting
  {scene: 15, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.dur},
  {scene: 15, at: () => 0, file: 'ticks-fast', vol: 0.15, until: (c) => c.s(1)},
  {scene: 15, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  // 16 · CTA
  {scene: 16, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 16, at: (c) => c.s(1) + 12, file: 'hit', vol: 0.55},
  {scene: 16, at: (c) => c.s(2), file: 'pop', vol: 0.5},
  {scene: 16, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  {scene: 16, at: (c) => c.s(3) + 4, file: 'chime', vol: 0.4},
];

export const MH370: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      <Grain />
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
      {play('music') ? <Audio src={staticFile('mh370/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
