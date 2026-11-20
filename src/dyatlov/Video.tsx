import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, transitionFor} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Answer, CallToAction, Camp, Footsteps, GetBack, Hook, ICE, Radiation, Ravine, RehookMay, RehookRun, Search, TheCedar, Theories, Verdict, WhoWhere, Yudin} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, WhoWhere, Yudin, Camp, RehookRun, Search, Footsteps, TheCedar, GetBack, RehookMay, Ravine, Radiation, Verdict, Theories, Answer, CallToAction];

// Cold and quiet on the journey, rising through the search, heaviest at the ravine, soft at the answer.
const INTENSITY = [1.0, 0.85, 0.85, 0.95, 1.05, 1.0, 1.0, 0.95, 0.95, 1.05, 1.15, 1.1, 1.05, 1.0, 0.9, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.s(1)),
  at(3, (c) => c.s(1)),
  at(5, (c) => c.s(3)),
  at(10, (c) => c.s(1)),
  at(12, (c) => c.s(1)),
  at(14, (c) => c.w('broke')),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 0, at: (c) => c.w('cut') - 2, file: 'swipe', vol: 0.7},
  {scene: 0, at: (c) => c.w('thirty') - 4, file: 'hit', vol: 0.6},
  {scene: 0, at: (c) => c.s(1) - 14, file: 'riser', vol: 0.35},
  {scene: 0, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  {scene: 0, at: (c) => c.s(2), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  // 1 · who / where
  {scene: 1, at: () => 4, file: 'whoosh2', vol: 0.45},
  {scene: 1, at: (c) => c.w('Ural'), file: 'pop', vol: 0.6},
  {scene: 1, at: (c) => c.s(1), file: 'chime', vol: 0.4},
  {scene: 1, at: (c) => c.w('Igor') - 4, file: 'whoosh', vol: 0.5},
  {scene: 1, at: (c) => c.w('Otorten'), file: 'pop', vol: 0.5},
  // 2 · Yudin
  {scene: 2, at: () => 0, file: 'wind', vol: 0.22, until: (c) => c.dur},
  {scene: 2, at: (c) => c.w('turns') - 4, file: 'pop', vol: 0.5},
  {scene: 2, at: (c) => c.s(1), file: 'impact', vol: 0.75},
  // 3 · camp
  {scene: 3, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 3, at: (c) => c.w('Kholat'), file: 'pop', vol: 0.5},
  {scene: 3, at: (c) => c.s(1) - 12, file: 'riser', vol: 0.35},
  {scene: 3, at: (c) => c.s(1), file: 'impact', vol: 0.9},
  // 4 · re-hook
  {scene: 4, at: () => 2, file: 'impact', vol: 0.75},
  {scene: 4, at: (c) => c.w('dark'), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  {scene: 4, at: (c) => c.w('boots') + 4, file: 'hit', vol: 0.6},
  // 5 · search
  {scene: 5, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.s(3)},
  {scene: 5, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 5, at: (c) => c.s(3) - 12, file: 'riser', vol: 0.35},
  {scene: 5, at: (c) => c.s(3) + 4, file: 'swipe', vol: 0.75},
  {scene: 5, at: (c) => c.s(3) + 10, file: 'impact', vol: 0.9},
  // 6 · left behind / footprints
  ...[0, 1, 2].map((i): Sfx => ({scene: 6, at: (c) => c.w(['Boots', 'coats', 'food'][i]) - 3, file: 'pop', vol: 0.5})),
  {scene: 6, at: (c) => c.s(1), file: 'whoosh2', vol: 0.45},
  {scene: 6, at: (c) => c.s(1) + 4, file: 'clock', vol: 0.2, until: (c) => c.dur - 20},
  {scene: 6, at: (c) => c.s(3), file: 'hit', vol: 0.55},
  {scene: 6, at: (c) => c.w('mile'), file: 'impact', vol: 0.7},
  // 7 · cedar
  {scene: 7, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 7, at: (c) => c.w('two'), file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  // 8 · get back
  ...[0, 8, 16].map((d): Sfx => ({scene: 8, at: (c) => c.w('Three') + d, file: 'hit', vol: 0.45})),
  {scene: 8, at: (c) => c.s(1), file: 'heartbeat', vol: 0.28, until: (c) => c.dur},
  // 9 · re-hook May
  {scene: 9, at: () => 2, file: 'impact', vol: 0.75},
  {scene: 9, at: () => 6, file: 'ticks-fast', vol: 0.2, until: (c) => c.w('May')},
  {scene: 9, at: (c) => c.w('May'), file: 'hit', vol: 0.7},
  {scene: 9, at: (c) => c.s(1), file: 'riser', vol: 0.35},
  // 10 · ravine
  {scene: 10, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  {scene: 10, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  {scene: 10, at: (c) => c.s(3), file: 'impact', vol: 0.85},
  {scene: 10, at: (c) => c.w('wounds'), file: 'chime', vol: 0.35},
  // 11 · radiation
  {scene: 11, at: (c) => Math.max(0, c.w('radiation') - 10), file: 'ticks-fast', vol: 0.35, until: (c) => c.dur},
  {scene: 11, at: (c) => c.w('radiation'), file: 'glitch', vol: 0.5},
  // 12 · verdict
  {scene: 12, at: (c) => c.s(1), file: 'type', vol: 0.4, until: (c) => c.s(1) + 45},
  {scene: 12, at: (c) => c.s(2) + 4, file: 'impact', vol: 0.9},
  // 13 · theories
  {scene: 13, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 13, at: (c) => c.s(2), file: 'glitch', vol: 0.4},
  {scene: 13, at: (c) => c.s(3), file: 'impact', vol: 0.75},
  // 14 · answer
  {scene: 14, at: () => 4, file: 'swipe', vol: 0.5},
  {scene: 14, at: (c) => c.s(1), file: 'wind', vol: 0.4, until: (c) => c.w('broke') + 10},
  {scene: 14, at: (c) => c.w('broke') - 12, file: 'riser', vol: 0.35},
  {scene: 14, at: (c) => c.w('broke'), file: 'thunder', vol: 0.55},
  {scene: 14, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  {scene: 14, at: (c) => c.s(5), file: 'wind', vol: 0.3, until: (c) => c.dur},
  // 15 · CTA
  {scene: 15, at: (c) => c.s(2), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  {scene: 15, at: (c) => c.w('freighter'), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.w('both'), file: 'chime', vol: 0.4},
];

export const Dyatlov: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      <Captions lines={T.lines} accent={ICE} />
      <ProgressBar total={T.totalFrames} color={ICE} />
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
      {play('music') ? <Audio src={staticFile('dyatlov/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
