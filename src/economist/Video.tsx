import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {AIBacklash, CallToAction, Deadline, Debt, Forecasts, FranceHeat, Hit, Hook, Lighter, Machines, Magnifier, MiddleEast, Misses, NotFate, NotOnlyMoney, OnTheCover, Prophecy, RED, Taiwan, WhoWhen} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, WhoWhen, OnTheCover, Magnifier, Taiwan, Deadline, MiddleEast, Machines, AIBacklash, Debt, NotOnlyMoney, FranceHeat, Lighter, Prophecy, Forecasts, Hit, Misses, NotFate, CallToAction];
// Page tilts between the photo 'files', parallax pushes into the set pieces.
const KINDS: TransitionKind[] = ['tilt', 'zoom', 'tilt', 'whip', 'zoom', 'wipe', 'zoom', 'tilt', 'whip', 'zoom', 'wipe', 'tilt', 'zoom', 'tilt', 'tilt', 'whip', 'wipe', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Ominous decoding, darkest at debt and the re-hooks, lighter at the 'not every theme is dark' beat, reflective at the end.
const INTENSITY = [1.0, 0.9, 1.05, 0.95, 1.0, 1.05, 1.0, 1.05, 1.05, 1.1, 1.1, 1.0, 0.85, 0.9, 0.9, 0.95, 0.95, 0.9, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.w('warning')),
  at(7, (c) => c.s(1)),
  at(9, (c) => c.w('accident')),
  at(13, (c) => c.s(1)),
  at(16, (c) => c.s(2)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.85},
  {scene: 0, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 0, at: (c) => c.w('warning') - 12, file: 'riser', vol: 0.35},
  {scene: 0, at: (c) => c.w('warning'), file: 'impact', vol: 0.9},
  // 1 · who / when
  {scene: 1, at: () => 4, file: 'swipe', vol: 0.5},
  {scene: 1, at: (c) => c.w('Peterson'), file: 'pop', vol: 0.45},
  ...[0, 6, 12].map((d): Sfx => ({scene: 1, at: (c) => c.w('red') + d, file: 'pop', vol: 0.4})),
  // 2 · rapid elements
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({scene: 2, at: (c) => c.s(i), file: i === 4 ? 'impact' : 'hit', vol: i === 4 ? 0.85 : 0.6})),
  // 3 · magnifier
  {scene: 3, at: () => 4, file: 'whoosh', vol: 0.45},
  {scene: 3, at: () => 0, file: 'clock', vol: 0.2, until: (c) => c.dur},
  // 4 · Taiwan
  {scene: 4, at: () => 0, file: 'whoosh2', vol: 0.45},
  {scene: 4, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 4, at: (c) => c.w('2027'), file: 'impact', vol: 0.85},
  // 5 · deadline
  {scene: 5, at: () => 0, file: 'clock', vol: 0.3, until: (c) => c.w('arrived')},
  {scene: 5, at: (c) => c.w('arrived'), file: 'impact', vol: 0.9},
  // 6 · Middle East
  {scene: 6, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 6, at: (c) => c.w('rerouted') - 6, file: 'whoosh2', vol: 0.45},
  {scene: 6, at: (c) => c.w('food'), file: 'hit', vol: 0.5},
  // 7 · machines
  {scene: 7, at: (c) => c.s(1) - 4, file: 'glitch', vol: 0.5},
  {scene: 7, at: (c) => c.s(1), file: 'impact', vol: 0.8},
  // 8 · AI
  {scene: 8, at: (c) => c.s(1), file: 'type', vol: 0.25, until: (c) => c.w('cyberattacks')},
  {scene: 8, at: (c) => c.w('cyberattacks'), file: 'glitch', vol: 0.55},
  {scene: 8, at: (c) => c.w('jobs'), file: 'hit', vol: 0.5},
  // 9 · debt
  {scene: 9, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.2, until: (c) => c.w('accident')},
  {scene: 9, at: (c) => c.w('accident') - 12, file: 'riser', vol: 0.35},
  {scene: 9, at: (c) => c.w('accident'), file: 'impact', vol: 0.9},
  {scene: 9, at: (c) => c.w('accident'), file: 'siren', vol: 0.2, until: (c) => c.dur},
  // 10 · re-hook
  {scene: 10, at: () => 0, file: 'whoosh2', vol: 0.55},
  {scene: 10, at: () => 6, file: 'riser', vol: 0.3},
  // 11 · France + heat
  {scene: 11, at: () => 10, file: 'pop', vol: 0.45},
  {scene: 11, at: (c) => c.s(1), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  // 12 · lighter
  ...['weight-loss', 'rockets', 'Hollywood'].map((w): Sfx => ({scene: 12, at: (c) => c.w(w) - 6, file: 'swipe', vol: 0.45})),
  {scene: 12, at: (c) => c.w('Hollywood'), file: 'chime', vol: 0.35},
  // 13 · prophecy?
  {scene: 13, at: () => 6, file: 'impact', vol: 0.8},
  {scene: 13, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  // 14 · forecasts
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({scene: 14, at: () => 6 + i * 6, file: 'swipe', vol: 0.3})),
  {scene: 14, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  // 15 · hit
  {scene: 15, at: (c) => c.s(1) + 2, file: 'impact', vol: 0.8},
  // 16 · misses
  {scene: 16, at: (c) => c.w('admitted'), file: 'impact', vol: 0.8},
  {scene: 16, at: (c) => c.s(1), file: 'swipe', vol: 0.45},
  {scene: 16, at: (c) => c.s(2) + 4, file: 'impact', vol: 0.8},
  // 17 · not fate
  {scene: 17, at: (c) => c.s(2), file: 'riser', vol: 0.3},
  ...[0, 6, 12, 18].map((d): Sfx => ({scene: 17, at: (c) => c.s(2) + d, file: 'hit', vol: 0.35})),
  // 18 · CTA
  ...[8, 13, 18, 23, 28].map((d): Sfx => ({scene: 18, at: () => d, file: 'pop', vol: 0.4})),
  {scene: 18, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 18, at: (c) => c.w('Dead'), file: 'pop', vol: 0.55},
];

export const Economist: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      {play('music') ? <Audio src={staticFile('economist/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
