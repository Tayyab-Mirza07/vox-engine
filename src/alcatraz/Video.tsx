import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {CallToAction, Clues, Digging, Found, Heads, Hook, LAMP, Letter, MusicHour, RehookBay, RehookPlan, Route, TheMen, TheNight, TheRaft, TheRock, Verdict} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, TheRock, TheMen, Digging, MusicHour, RehookPlan, Heads, TheRaft, TheNight, Route, RehookBay, Found, Verdict, Clues, Letter, CallToAction];
// Page tilts between the photo 'files', parallax pushes into the set pieces.
const KINDS: TransitionKind[] = ['tilt', 'zoom', 'tilt', 'whip', 'tilt', 'zoom', 'tilt', 'wipe', 'slide', 'zoom', 'tilt', 'wipe', 'tilt', 'whip', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Quiet dread at the hook, steady secret work, racing at the escape, cold at the bay, open at the end.
const INTENSITY = [1.0, 0.9, 0.9, 0.95, 0.95, 1.05, 1.0, 1.0, 1.05, 1.15, 1.0, 0.9, 1.0, 0.95, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.w('head')),
  at(1, (c) => c.s(1)),
  at(5, (c) => c.s(1)),
  at(9, (c) => c.w('vanished')),
  at(12, (c) => c.w('drowned')),
  at(14, (c) => c.s(1)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 0, at: (c) => c.w('guard'), file: 'clock', vol: 0.25, until: (c) => c.w('head')},
  {scene: 0, at: (c) => c.w('head') - 4, file: 'whoosh', vol: 0.5},
  {scene: 0, at: (c) => c.w('rolled') + 8, file: 'hit', vol: 0.8},
  {scene: 0, at: (c) => c.s(1), file: 'heartbeat', vol: 0.3, until: (c) => c.s(2)},
  {scene: 0, at: (c) => c.s(2), file: 'siren', vol: 0.3, until: (c) => c.dur},
  {scene: 0, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  // 1 · the rock
  {scene: 1, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: (c) => c.w('freezing'), file: 'rain', vol: 0.15, until: (c) => c.dur},
  {scene: 1, at: (c) => c.s(1) + 4, file: 'impact', vol: 0.85},
  // 2 · the men
  {scene: 2, at: () => 6, file: 'ticks-fast', vol: 0.2, until: (c) => c.s(1)},
  {scene: 2, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 2, at: (c) => c.w('Morris') - 4, file: 'swipe', vol: 0.55},
  {scene: 2, at: (c) => c.w('John') - 4, file: 'swipe', vol: 0.5},
  {scene: 2, at: (c) => c.w('Clarence') - 4, file: 'swipe', vol: 0.5},
  // 3 · digging
  {scene: 3, at: (c) => c.w('spoons') - 4, file: 'type', vol: 0.3, until: (c) => c.w('drill')},
  {scene: 3, at: (c) => c.w('drill'), file: 'glitch', vol: 0.3},
  {scene: 3, at: (c) => c.w('drill'), file: 'ticks-fast', vol: 0.25, until: (c) => c.dur},
  // 4 · music hour
  {scene: 4, at: (c) => c.w('music'), file: 'chime', vol: 0.4},
  {scene: 4, at: (c) => c.w('fake') - 4, file: 'swipe', vol: 0.55},
  // 5 · re-hook
  {scene: 5, at: () => 2, file: 'impact', vol: 0.75},
  {scene: 5, at: (c) => c.w('guards') - 6, file: 'riser', vol: 0.3},
  {scene: 5, at: (c) => c.w('bay') - 6, file: 'whoosh2', vol: 0.5},
  {scene: 5, at: (c) => c.w('bay'), file: 'rain', vol: 0.2, until: (c) => c.dur},
  // 6 · heads
  ...['soap', 'paper', 'dust', 'painted', 'hair'].map((w): Sfx => ({scene: 6, at: (c) => c.w(w) - 3, file: 'pop', vol: 0.45})),
  {scene: 6, at: (c) => c.w('barbershop') - 4, file: 'swipe', vol: 0.55},
  // 7 · raft
  {scene: 7, at: (c) => c.w('raincoats') - 6, file: 'ticks-fast', vol: 0.2, until: (c) => c.dur - 10},
  {scene: 7, at: (c) => c.w('above'), file: 'hit', vol: 0.55},
  // 8 · night
  {scene: 8, at: () => 0, file: 'clock', vol: 0.25, until: (c) => c.s(1)},
  {scene: 8, at: (c) => c.w('crawled'), file: 'whoosh', vol: 0.45},
  {scene: 8, at: (c) => c.s(1) + 10, file: 'impact', vol: 0.85},
  // 9 · route
  {scene: 9, at: () => 0, file: 'heartbeat', vol: 0.3, until: (c) => c.w('black')},
  {scene: 9, at: (c) => c.w('roof'), file: 'pop', vol: 0.45},
  {scene: 9, at: (c) => c.w('pipe'), file: 'whoosh', vol: 0.45},
  {scene: 9, at: (c) => c.w('fences'), file: 'hit', vol: 0.5},
  {scene: 9, at: (c) => c.w('black') - 4, file: 'rain', vol: 0.25, until: (c) => c.dur},
  {scene: 9, at: (c) => c.w('vanished'), file: 'riser', vol: 0.3},
  // 10 · re-hook
  {scene: 10, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 10, at: (c) => c.s(1), file: 'thunder', vol: 0.45},
  // 11 · found
  {scene: 11, at: () => 0, file: 'rain', vol: 0.18, until: (c) => c.dur},
  {scene: 11, at: (c) => c.w('paddle') - 2, file: 'pop', vol: 0.45},
  {scene: 11, at: (c) => c.w('raincoat') - 2, file: 'pop', vol: 0.45},
  {scene: 11, at: (c) => c.w('photos') - 2, file: 'chime', vol: 0.4},
  // 12 · verdict
  {scene: 12, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 12, at: (c) => c.w('drowned') + 4, file: 'impact', vol: 0.9},
  {scene: 12, at: (c) => c.s(1), file: 'type', vol: 0.3, until: (c) => c.s(1) + 30},
  {scene: 12, at: (c) => c.w('closed') - 6, file: 'hit', vol: 0.7},
  // 13 · clues
  {scene: 13, at: (c) => c.s(1), file: 'chime', vol: 0.45},
  {scene: 13, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 13, at: (c) => c.w('Brazil'), file: 'pop', vol: 0.55},
  // 14 · letter
  {scene: 14, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 14, at: (c) => c.s(1), file: 'type', vol: 0.35, until: (c) => c.s(4)},
  {scene: 14, at: (c) => c.s(4), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(5) + 8},
  {scene: 14, at: (c) => c.s(5) + 8, file: 'impact', vol: 0.85},
  // 15 · CTA
  {scene: 15, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 15, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  {scene: 15, at: (c) => c.w('Dead'), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.w('both'), file: 'chime', vol: 0.4},
];

export const Alcatraz: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      <Captions lines={T.lines} accent={LAMP} />
      <ProgressBar total={T.totalFrames} color={LAMP} />
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
      {play('music') ? <Audio src={staticFile('alcatraz/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
