import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {Captions, CutFlash, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {BigEd, Calls, Childhood, Drive, Easter, Ending, Hook, Hospital, Psychiatrists, Ranch, RED, Released, SantaCruz, Victims} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, BigEd, Childhood, Ranch, Hospital, Released, SantaCruz, Victims, Psychiatrists, Easter, Drive, Calls, Ending];

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};

const SFX: Sfx[] = [
  // 0 · hook: night rain, phone booth, confession, prank
  {scene: 0, at: () => 0, file: 'rain', vol: 0.35, until: (c) => c.dur},
  {scene: 0, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 0, at: (c) => c.s(2), file: 'clock', vol: 0.3, until: (c) => c.w('eight')},
  {scene: 0, at: (c) => c.w('eight'), file: 'impact', vol: 1},
  {scene: 0, at: (c) => c.w('eight') + 2, file: 'thunder', vol: 0.7},
  {scene: 0, at: (c) => c.s(3), file: 'hit', vol: 0.7},
  {scene: 0, at: (c) => c.s(4), file: 'swipe', vol: 0.5},
  // 1 · big ed
  {scene: 1, at: () => 2, file: 'pop', vol: 0.5},
  ...[0, 1, 2, 3].map((i): Sfx => ({scene: 1, at: (c) => c.s(1) + i * 3, file: 'pop', vol: 0.5})),
  {scene: 1, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 1, at: (c) => c.s(3) - 16, file: 'riser', vol: 0.35},
  {scene: 1, at: (c) => c.s(3), file: 'impact', vol: 0.9},
  // 2 · childhood
  {scene: 2, at: () => 8, file: 'pop', vol: 0.6},
  {scene: 2, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 2, at: (c) => c.s(1) + 6, file: 'riser', vol: 0.25},
  {scene: 2, at: (c) => c.s(2), file: 'heartbeat', vol: 0.6, until: (c) => c.dur},
  {scene: 2, at: (c) => c.w('locked'), file: 'hit', vol: 0.8},
  {scene: 2, at: (c) => c.s(3), file: 'impact', vol: 0.7},
  // 3 · ranch
  {scene: 3, at: () => 4, file: 'wind', vol: 0.4},
  {scene: 3, at: () => 10, file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.s(1), file: 'swipe', vol: 0.5},
  {scene: 3, at: (c) => c.w('shot'), file: 'impact', vol: 1},
  {scene: 3, at: (c) => c.w('shot') + 8, file: 'impact', vol: 0.8},
  {scene: 3, at: (c) => c.s(2), file: 'whoosh2', vol: 0.5},
  {scene: 3, at: (c) => c.s(3), file: 'type', vol: 0.45, until: (c) => c.s(3) + 60},
  // 4 · hospital
  {scene: 4, at: () => 2, file: 'whoosh', vol: 0.5},
  {scene: 4, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.22, until: (c) => c.s(2) + 10},
  {scene: 4, at: (c) => c.s(2), file: 'chime', vol: 0.45},
  {scene: 4, at: (c) => c.s(3), file: 'whoosh2', vol: 0.5},
  ...[0, 1, 2, 3].map((i): Sfx => ({scene: 4, at: (c) => c.s(3) + 12 + i * 10, file: 'pop', vol: 0.55})),
  // 5 · released
  {scene: 5, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 5, at: (c) => c.w('advice'), file: 'impact', vol: 0.8},
  {scene: 5, at: (c) => c.w('free'), file: 'impact', vol: 0.9},
  {scene: 5, at: (c) => c.s(1), file: 'heartbeat', vol: 0.6, until: (c) => c.s(2)},
  {scene: 5, at: (c) => c.s(2), file: 'impact', vol: 1},
  {scene: 5, at: (c) => c.s(2), file: 'thunder', vol: 0.5},
  // 6 · santa cruz
  {scene: 6, at: () => 6, file: 'riser', vol: 0.3},
  {scene: 6, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 6, at: (c) => c.w('cop'), file: 'impact', vol: 0.8},
  {scene: 6, at: (c) => c.s(2), file: 'whoosh', vol: 0.5},
  {scene: 6, at: (c) => c.s(2), file: 'jet', vol: 0.3, until: (c) => c.dur},
  {scene: 6, at: (c) => c.s(2) + 8, file: 'pop', vol: 0.6},
  // 7 · victims
  {scene: 7, at: () => 2, file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(1), file: 'heartbeat', vol: 0.6, until: (c) => c.s(2)},
  {scene: 7, at: (c) => c.s(2), file: 'whoosh2', vol: 0.5},
  {scene: 7, at: (c) => c.w('murder') - 4, file: 'type', vol: 0.45, until: (c) => c.w('murder') + 40},
  {scene: 7, at: (c) => c.e(2) - 6, file: 'impact', vol: 0.7},
  // 8 · psychiatrists
  {scene: 8, at: () => 2, file: 'impact', vol: 0.9},
  {scene: 8, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 8, at: (c) => c.s(2), file: 'hit', vol: 0.8},
  {scene: 8, at: (c) => c.s(3) - 16, file: 'riser', vol: 0.4},
  {scene: 8, at: (c) => c.s(3), file: 'impact', vol: 1},
  {scene: 8, at: (c) => c.s(3), file: 'heartbeat', vol: 0.6, until: (c) => c.dur},
  // 9 · easter
  {scene: 9, at: () => 0, file: 'wind', vol: 0.5},
  {scene: 9, at: () => 0, file: 'heartbeat', vol: 0.7, until: (c) => c.dur},
  {scene: 9, at: (c) => c.w('killed') - 2, file: 'impact', vol: 0.9},
  {scene: 9, at: (c) => c.w('killed') - 2, file: 'thunder', vol: 0.7},
  {scene: 9, at: (c) => c.w('too') - 6, file: 'impact', vol: 0.9},
  {scene: 9, at: (c) => c.w('too') - 6, file: 'thunder', vol: 0.6},
  // 10 · the drive
  {scene: 10, at: () => 2, file: 'whoosh', vol: 0.5},
  {scene: 10, at: () => 6, file: 'jet', vol: 0.35, until: (c) => c.s(2)},
  {scene: 10, at: (c) => c.s(1) - 10, file: 'ticks-fast', vol: 0.2, until: (c) => c.s(2)},
  {scene: 10, at: (c) => c.s(2) - 6, file: 'pop', vol: 0.7},
  {scene: 10, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  // 11 · the calls
  {scene: 11, at: () => 2, file: 'clock', vol: 0.4, until: () => 20},
  {scene: 11, at: (c) => c.s(1), file: 'clock', vol: 0.4, until: (c) => c.s(1) + 18},
  {scene: 11, at: (c) => c.w('again', 1) - 2, file: 'clock', vol: 0.4, until: (c) => c.w('again', 1) + 16},
  {scene: 11, at: (c) => c.s(2), file: 'impact', vol: 0.8},
  {scene: 11, at: (c) => c.s(3), file: 'whoosh2', vol: 0.5},
  {scene: 11, at: (c) => c.s(3) + 30, file: 'siren', vol: 0.5},
  {scene: 11, at: (c) => c.w('get') - 4, file: 'impact', vol: 1},
  // 12 · ending
  {scene: 12, at: (c) => c.w('executed') - 4, file: 'hit', vol: 0.6},
  {scene: 12, at: (c) => c.s(1), file: 'impact', vol: 0.9},
  {scene: 12, at: (c) => c.s(2), file: 'whoosh2', vol: 0.5},
  {scene: 12, at: (c) => c.s(2) + 16, file: 'type', vol: 0.4, until: (c) => c.s(2) + 76},
  {scene: 12, at: (c) => c.w('profiling') - 4, file: 'chime', vol: 0.45},
  {scene: 12, at: (c) => c.s(3), file: 'riser', vol: 0.35},
  {scene: 12, at: (c) => c.w('taught') - 4, file: 'hit', vol: 0.6},
  {scene: 12, at: (c) => c.w('killers') - 4, file: 'impact', vol: 0.8},
  {scene: 12, at: (c) => c.e(3) + 6, file: 'chime', vol: 0.45},
];

export const Kemper: React.FC = () => {
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
          <CutFlash accent={RED} />
          <Audio src={staticFile('sfx/hit.wav')} volume={0.4} />
          <Audio src={staticFile('sfx/whoosh2.wav')} volume={0.35} />
        </Sequence>
      ))}
      <Grain />
      <Captions lines={T.lines} accent={RED} />
      <ProgressBar total={T.totalFrames} color={RED} />
      {T.lines.map((line) => (
        <Sequence key={line.index} from={f(line.start)}>
          <Audio src={staticFile(line.file)} />
        </Sequence>
      ))}
      {SFX.map((x, k) => {
        const c = T.cues(x.scene);
        const from = Math.max(0, x.at(c));
        return (
          <Sequence key={`sfx${k}`} from={T.sceneStart(x.scene) + from} durationInFrames={x.until ? Math.max(1, x.until(c) - from) : undefined}>
            <Audio src={staticFile(`sfx/${x.file}.wav`)} volume={x.vol} />
          </Sequence>
        );
      })}
      <Audio src={staticFile('sfx/bed.wav')} volume={0.2} loop />
    </AbsoluteFill>
  );
};
