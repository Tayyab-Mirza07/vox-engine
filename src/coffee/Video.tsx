import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, transitionFor} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {CallToAction, Denial, Hook, HOT, Investigation, Lawsuits, Locked, Modder, NewRules, Rating, RehookEnd, RehookHow, RehookProof, Settlement, TheGame, TheName, Warning} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, TheGame, RehookHow, Modder, Locked, TheName, Denial, RehookProof, Rating, Investigation, Lawsuits, RehookEnd, Settlement, Warning, NewRules, CallToAction];

// Suspense piano: tense and curious while the secret is uncovered, heavy at the scandal, light at the payoff.
const INTENSITY = [1.0, 0.9, 1.0, 0.85, 0.95, 0.9, 0.9, 1.05, 1.15, 1.1, 1.05, 1.0, 0.9, 0.95, 0.9, 1.05];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
const DIPS = [
  at(0, (c) => c.s(1)),
  at(1, (c) => c.w('Hot') - 2),
  at(7, (c) => c.s(1) + 6),
  at(8, (c) => c.w('Adults') - 4),
  at(9, (c) => c.w('Federal')),
  at(14, (c) => c.s(2)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'ticks-fast', vol: 0.18, until: (c) => c.w('pulled')},
  {scene: 0, at: (c) => c.w('hidden') - 4, file: 'glitch', vol: 0.45},
  {scene: 0, at: (c) => c.w('pulled'), file: 'impact', vol: 0.8},
  {scene: 0, at: (c) => c.w('government'), file: 'impact', vol: 0.8},
  {scene: 0, at: (c) => c.w('millions'), file: 'impact', vol: 0.8},
  {scene: 0, at: (c) => c.s(1) - 14, file: 'riser', vol: 0.35},
  {scene: 0, at: (c) => c.s(1), file: 'type', vol: 0.4, until: (c) => c.s(1) + 60},
  // 1 · the game
  {scene: 1, at: () => 4, file: 'whoosh2', vol: 0.45},
  {scene: 1, at: (c) => c.w('best-selling') - 4, file: 'pop', vol: 0.6},
  {scene: 1, at: (c) => c.w('Hot') - 14, file: 'riser', vol: 0.35},
  {scene: 1, at: (c) => c.w('Hot') - 2, file: 'impact', vol: 0.85},
  // 2 · re-hook
  {scene: 2, at: () => 2, file: 'impact', vol: 0.8},
  {scene: 2, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 2, at: (c) => c.s(1) + 30, file: 'pop', vol: 0.6},
  // 3 · modder
  {scene: 3, at: (c) => c.s(1), file: 'type', vol: 0.4, until: (c) => c.s(1) + 30},
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({scene: 3, at: (c) => c.s(1) + i * 6, file: 'pop', vol: 0.4})),
  {scene: 3, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  {scene: 3, at: (c) => c.w('never') - 2, file: 'impact', vol: 0.8},
  // 4 · locked
  {scene: 4, at: () => 2, file: 'whoosh2', vol: 0.45},
  {scene: 4, at: (c) => c.w('switched') - 4, file: 'hit', vol: 0.7},
  {scene: 4, at: (c) => c.w('every') - 4, file: 'ticks-fast', vol: 0.2, until: (c) => c.w('every') + 26},
  // 5 · the name
  {scene: 5, at: (c) => c.s(1), file: 'chime', vol: 0.45},
  {scene: 5, at: (c) => c.s(2), file: 'whoosh', vol: 0.5},
  ...[0, 1, 2, 3].map((i): Sfx => ({scene: 5, at: (c) => c.s(2) + 6 + i * 8, file: 'pop', vol: 0.45})),
  // 6 · denial
  {scene: 6, at: () => 4, file: 'swipe', vol: 0.5},
  // 7 · re-hook 2
  {scene: 7, at: () => 2, file: 'whoosh2', vol: 0.45},
  {scene: 7, at: (c) => c.w('cheat') - 4, file: 'glitch', vol: 0.45},
  {scene: 7, at: (c) => c.s(1) + 6, file: 'impact', vol: 0.9},
  // 8 · rating
  {scene: 8, at: (c) => c.w('Adults') - 4, file: 'swipe', vol: 0.6},
  {scene: 8, at: (c) => c.w('Adults') + 6, file: 'impact', vol: 0.85},
  {scene: 8, at: (c) => c.s(1) + 4, file: 'ticks-fast', vol: 0.2, until: (c) => c.s(1) + 64},
  // 9 · investigation
  {scene: 9, at: () => 2, file: 'whoosh2', vol: 0.45},
  {scene: 9, at: (c) => c.w('Federal'), file: 'impact', vol: 0.9},
  {scene: 9, at: (c) => c.w('Federal'), file: 'thunder', vol: 0.45},
  // 10 · lawsuits
  {scene: 10, at: (c) => c.s(1), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({scene: 10, at: (c) => c.s(1) + i * 6, file: 'hit', vol: 0.35})),
  {scene: 10, at: (c) => c.w('85-year-old') - 4, file: 'pop', vol: 0.6},
  // 11 · re-hook 3
  {scene: 11, at: () => 2, file: 'impact', vol: 0.8},
  // 12 · settlement
  {scene: 12, at: () => 4, file: 'swipe', vol: 0.5},
  {scene: 12, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  // 13 · FTC
  {scene: 13, at: (c) => c.w('fine') - 2, file: 'hit', vol: 0.7},
  {scene: 13, at: (c) => c.w('warning'), file: 'impact', vol: 0.85},
  // 14 · new rules
  {scene: 14, at: (c) => c.s(1), file: 'type', vol: 0.35, until: (c) => c.s(1) + 70},
  {scene: 14, at: (c) => c.s(2), file: 'riser', vol: 0.35},
  {scene: 14, at: (c) => c.s(2) + 4, file: 'ticks-fast', vol: 0.2, until: (c) => c.s(2) + 50},
  {scene: 14, at: (c) => c.s(2) + 50, file: 'chime', vol: 0.4},
  // 15 · CTA
  {scene: 15, at: () => 6, file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(1), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  {scene: 15, at: (c) => c.s(3), file: 'hit', vol: 0.6},
];

export const Coffee: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      <Captions lines={T.lines} accent={HOT} />
      <ProgressBar total={T.totalFrames} color={HOT} />
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
      {play('music') ? <Audio src={staticFile('coffee/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
