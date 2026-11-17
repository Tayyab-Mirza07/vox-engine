import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {Captions, CutFlash, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {TEAL} from './parts';
import {Adrift, BelowDeck, CallToAction, Clues, Departure, Experiment, Fate, Found, Hook, LastLog, Myth, RehookLeave, RehookWhy, Rope, TenPeople, Theory} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, TenPeople, RehookWhy, Departure, LastLog, Found, BelowDeck, RehookLeave, Myth, Clues, Theory, Rope, Experiment, Adrift, Fate, CallToAction];

// Music: piano score, a little louder than earlier episodes, but still ducked under the narrator.
const INTENSITY = [1.0, 0.9, 1.0, 0.85, 0.85, 0.9, 1.0, 1.05, 0.85, 1.0, 1.05, 0.95, 1.1, 1.2, 0.95, 1.1];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
const DIPS = [
  at(0, (c) => c.w('single') - 2),
  at(1, (c) => c.s(1)),
  at(6, (c) => c.s(3)),
  at(8, (c) => c.s(1)),
  at(9, (c) => c.s(2)),
  at(12, (c) => c.s(1) + 4),
  at(13, (c) => c.w('snapped')),
  at(14, (c) => c.w('reef')),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.8, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'wind', vol: 0.5},
  {scene: 0, at: (c) => c.s(2), file: 'pop', vol: 0.6},
  {scene: 0, at: (c) => c.s(3), file: 'pop', vol: 0.6},
  {scene: 0, at: (c) => c.s(4), file: 'pop', vol: 0.6},
  {scene: 0, at: (c) => c.s(5) - 14, file: 'riser', vol: 0.35},
  {scene: 0, at: (c) => c.w('single') - 2, file: 'impact', vol: 0.9},
  // 1 · ten people
  {scene: 1, at: () => 4, file: 'whoosh2', vol: 0.5},
  {scene: 1, at: (c) => c.w('wife') - 4, file: 'pop', vol: 0.5},
  {scene: 1, at: (c) => c.w('daughter') - 4, file: 'pop', vol: 0.5},
  {scene: 1, at: (c) => c.s(1) + 6, file: 'impact', vol: 0.8},
  // 2 · re-hook
  {scene: 2, at: () => 2, file: 'impact', vol: 0.8},
  {scene: 2, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.25, until: (c) => c.s(1) + 28},
  {scene: 2, at: (c) => c.s(1), file: 'glitch', vol: 0.4},
  // 3 · departure
  {scene: 3, at: () => 6, file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.w('Genoa') - 10, file: 'whoosh', vol: 0.5},
  {scene: 3, at: (c) => c.w('Genoa') + 24, file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.s(2), file: 'swipe', vol: 0.5},
  {scene: 3, at: (c) => c.s(3), file: 'whoosh2', vol: 0.5},
  {scene: 3, at: (c) => c.s(3) + 6, file: 'ticks-fast', vol: 0.22, until: (c) => c.s(3) + 50},
  // 4 · last log
  {scene: 4, at: (c) => c.s(1), file: 'type', vol: 0.35, until: (c) => c.s(1) + 30},
  {scene: 4, at: (c) => c.s(3), file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(3) + 2, file: 'impact', vol: 0.8},
  // 5 · found
  {scene: 5, at: () => 4, file: 'whoosh', vol: 0.5},
  {scene: 5, at: (c) => c.w('drifting') - 4, file: 'pop', vol: 0.6},
  {scene: 5, at: (c) => c.w('Portugal') - 4, file: 'pop', vol: 0.5},
  {scene: 5, at: (c) => c.s(1), file: 'swipe', vol: 0.5},
  // 6 · below deck
  {scene: 6, at: (c) => c.w('boots') - 4, file: 'pop', vol: 0.6},
  {scene: 6, at: (c) => c.w('pipes') - 4, file: 'pop', vol: 0.6},
  {scene: 6, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 6, at: (c) => c.s(3) - 16, file: 'riser', vol: 0.35},
  {scene: 6, at: (c) => c.w('gone') - 2, file: 'impact', vol: 0.9},
  // 7 · re-hook 2
  {scene: 7, at: () => 2, file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(3), file: 'whoosh2', vol: 0.5},
  {scene: 7, at: (c) => c.w('tiny') - 4, file: 'pop', vol: 0.6},
  // 8 · myth
  {scene: 8, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  {scene: 8, at: (c) => c.s(2), file: 'swipe', vol: 0.5},
  {scene: 8, at: (c) => c.w('Sherlock') - 4, file: 'chime', vol: 0.4},
  // 9 · clues
  {scene: 9, at: (c) => c.s(1), file: 'swipe', vol: 0.5},
  {scene: 9, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 9, at: (c) => c.w('empty') - 2, file: 'impact', vol: 0.85},
  {scene: 9, at: (c) => c.s(3), file: 'riser', vol: 0.35},
  // 10 · theory
  {scene: 10, at: (c) => c.w('fumes') - 4, file: 'wind', vol: 0.45},
  {scene: 10, at: (c) => c.s(1), file: 'heartbeat', vol: 0.4, until: (c) => c.dur},
  {scene: 10, at: (c) => c.w('explode') - 2, file: 'thunder', vol: 0.6},
  // 11 · rope
  {scene: 11, at: () => 0, file: 'wind', vol: 0.45},
  {scene: 11, at: (c) => c.w('rope') - 4, file: 'swipe', vol: 0.45},
  // 12 · experiment
  {scene: 12, at: () => 2, file: 'pop', vol: 0.5},
  {scene: 12, at: (c) => c.s(1) - 14, file: 'riser', vol: 0.4},
  {scene: 12, at: (c) => c.s(1) + 4, file: 'impact', vol: 0.9},
  {scene: 12, at: (c) => c.s(1) + 4, file: 'thunder', vol: 0.55},
  {scene: 12, at: (c) => c.w('scorch'), file: 'hit', vol: 0.6},
  {scene: 12, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  // 13 · adrift
  {scene: 13, at: () => 0, file: 'wind', vol: 0.55},
  {scene: 13, at: (c) => c.w('snapped'), file: 'impact', vol: 0.9},
  {scene: 13, at: (c) => c.s(1), file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  // 14 · fate
  {scene: 14, at: () => 2, file: 'whoosh2', vol: 0.45},
  {scene: 14, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 14, at: (c) => c.w('reef'), file: 'impact', vol: 0.9},
  {scene: 14, at: (c) => c.w('insurance') - 4, file: 'impact', vol: 0.8},
  // 15 · CTA
  {scene: 15, at: () => 6, file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(1), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(2), file: 'chime', vol: 0.45},
  {scene: 15, at: (c) => c.s(3), file: 'hit', vol: 0.6},
];

export const Celeste: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
  const play = (part: 'voice' | 'fx' | 'music') => stem === 'all' || stem === part;
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 80px Anton'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      {SCENES.map((Scene, i) => (
        <Sequence key={i} from={T.sceneStart(i)} durationInFrames={T.sceneEnd(i) - T.sceneStart(i)}>
          <Scene cue={T.cues(i)} />
          <CutFlash accent={TEAL} />
          {play('fx') ? <Audio src={staticFile('sfx/whoosh2.wav')} volume={(fr) => MIXER.fx(0.35, T.sceneStart(i) + fr)} /> : null}
        </Sequence>
      ))}
      <Grain />
      <Captions lines={T.lines} accent={TEAL} />
      <ProgressBar total={T.totalFrames} color={TEAL} />
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
      {play('music') ? <Audio src={staticFile('celeste/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
