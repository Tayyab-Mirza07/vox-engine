import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {Captions, CutFlash, ProgressBar} from '../ui';
import {AMBER, Grain} from './parts';
import {Bomb, Demands, Hook, Hunt, Jump, Money, Note, Orders, Portland, Question, Reno, Search, Seattle} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Hunt, Portland, Note, Bomb, Demands, Seattle, Orders, Jump, Reno, Search, Money, Question];

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};

// Sound design: every visual event gets a matching sound. Frames are relative to the scene start.
const SFX: Sfx[] = [
  // 0 · hook: jet, jump, storm, cash, vanished
  {scene: 0, at: () => 0, file: 'jet', vol: 0.5, until: (c) => c.s(4)},
  {scene: 0, at: (c) => c.w('man') - 6, file: 'riser', vol: 0.3},
  {scene: 0, at: (c) => c.w('jumped') - 20, file: 'wind', vol: 0.5},
  {scene: 0, at: (c) => c.w('jumped'), file: 'impact', vol: 0.7},
  {scene: 0, at: (c) => c.w('jumped'), file: 'thunder', vol: 0.6},
  {scene: 0, at: (c) => c.w('jumped') + 2, file: 'wind', vol: 0.8},
  {scene: 0, at: (c) => c.s(1) - 16, file: 'whoosh2', vol: 0.5},
  {scene: 0, at: (c) => c.s(1), file: 'hit', vol: 0.7},
  {scene: 0, at: (c) => c.s(2), file: 'thunder', vol: 0.9},
  {scene: 0, at: (c) => c.s(2), file: 'rain', vol: 0.45, until: (c) => c.dur},
  {scene: 0, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  {scene: 0, at: (c) => c.s(3), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(3) + 22},
  {scene: 0, at: (c) => c.s(4) - 8, file: 'riser', vol: 0.3},
  {scene: 0, at: (c) => c.s(4) + 8, file: 'impact', vol: 0.9},
  // 1 · the hunt
  {scene: 1, at: () => 6, file: 'ticks-fast', vol: 0.22, until: (c) => c.e(0) - 6},
  {scene: 1, at: (c) => c.s(1), file: 'swipe', vol: 0.5},
  {scene: 1, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 1, at: (c) => c.s(2), file: 'whoosh2', vol: 0.5},
  {scene: 1, at: (c) => c.w('$20'), file: 'chime', vol: 0.4},
  // 2 · portland
  {scene: 2, at: () => 4, file: 'pop', vol: 0.6},
  {scene: 2, at: (c) => c.s(1) - 6, file: 'whoosh', vol: 0.5},
  {scene: 2, at: (c) => c.s(1) + 14, file: 'pop', vol: 0.7},
  {scene: 2, at: (c) => c.w('ticket'), file: 'whoosh2', vol: 0.5},
  {scene: 2, at: (c) => c.w('Seattle') - 4, file: 'pop', vol: 0.7},
  {scene: 2, at: (c) => c.w('Dan') - 4, file: 'type', vol: 0.5, until: (c) => c.w('Dan') + 24},
  {scene: 2, at: (c) => c.e(3), file: 'hit', vol: 0.6},
  // 3 · the note
  {scene: 3, at: (c) => c.w('bourbon'), file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.w('cigarette'), file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.s(1), file: 'swipe', vol: 0.6},
  {scene: 3, at: (c) => c.s(2), file: 'pop', vol: 0.5},
  {scene: 3, at: (c) => c.w('drops'), file: 'swipe', vol: 0.6},
  {scene: 3, at: (c) => c.w('drops') + 14, file: 'hit', vol: 0.5},
  // 4 · the bomb
  {scene: 4, at: () => 0, file: 'heartbeat', vol: 0.9, until: (c) => c.s(2)},
  {scene: 4, at: (c) => c.s(1), file: 'type', vol: 0.4, until: (c) => c.e(1)},
  {scene: 4, at: (c) => c.s(2) - 20, file: 'riser', vol: 0.35},
  {scene: 4, at: (c) => c.s(2), file: 'impact', vol: 1},
  {scene: 4, at: (c) => c.s(2), file: 'thunder', vol: 0.6},
  // 5 · demands
  {scene: 5, at: () => 0, file: 'heartbeat', vol: 0.6, until: (c) => c.s(1)},
  {scene: 5, at: (c) => c.w('cylinders') - 4, file: 'ticks-fast', vol: 0.25, until: (c) => c.w('cylinders') + 14},
  {scene: 5, at: (c) => c.w('wires') - 3, file: 'swipe', vol: 0.5},
  {scene: 5, at: (c) => c.w('battery') - 3, file: 'pop', vol: 0.7},
  {scene: 5, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 5, at: (c) => c.s(2), file: 'impact', vol: 0.7},
  {scene: 5, at: (c) => c.s(2), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(2) + 24},
  {scene: 5, at: (c) => c.s(3), file: 'hit', vol: 0.6},
  ...[0, 1, 2, 3].map((i): Sfx => ({scene: 5, at: (c) => c.s(3) + 3 + i * 4, file: 'pop', vol: 0.55})),
  {scene: 5, at: (c) => c.s(4), file: 'hit', vol: 0.6},
  // 6 · seattle
  {scene: 6, at: () => 0, file: 'jet', vol: 0.35, until: (c) => c.s(1)},
  {scene: 6, at: () => 4, file: 'clock', vol: 0.3, until: (c) => c.s(1) - 6},
  {scene: 6, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 6, at: (c) => c.s(2), file: 'chime', vol: 0.5},
  {scene: 6, at: (c) => c.s(2) + 4, file: 'ticks-fast', vol: 0.18, until: (c) => c.s(2) + 40},
  // 7 · back into the sky
  {scene: 7, at: () => 2, file: 'impact', vol: 0.9},
  {scene: 7, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 7, at: (c) => c.w('sky'), file: 'jet', vol: 0.4, until: (c) => c.dur},
  {scene: 7, at: (c) => c.w('sky') + 44, file: 'pop', vol: 0.7},
  {scene: 7, at: (c) => c.w('Mexico'), file: 'swipe', vol: 0.5},
  {scene: 7, at: (c) => c.s(2), file: 'hit', vol: 0.7},
  {scene: 7, at: (c) => c.s(3), file: 'hit', vol: 0.7},
  {scene: 7, at: (c) => c.s(4), file: 'hit', vol: 0.7},
  {scene: 7, at: (c) => c.s(4) + 4, file: 'swipe', vol: 0.5},
  // 8 · the jump
  {scene: 8, at: () => 0, file: 'rain', vol: 0.5, until: (c) => c.dur},
  {scene: 8, at: () => 0, file: 'jet', vol: 0.45, until: (c) => c.dur},
  {scene: 8, at: (c) => c.w('warning') - 4, file: 'clock', vol: 0.45, until: (c) => c.s(1) + 20},
  {scene: 8, at: (c) => c.s(1) - 6, file: 'wind', vol: 0.8},
  {scene: 8, at: (c) => c.s(2), file: 'heartbeat', vol: 0.8, until: (c) => c.w('jumps')},
  {scene: 8, at: (c) => c.w('jumps') - 2, file: 'impact', vol: 0.9},
  {scene: 8, at: (c) => c.w('jumps') - 2, file: 'thunder', vol: 0.9},
  {scene: 8, at: (c) => c.w('jumps'), file: 'wind', vol: 0.9},
  {scene: 8, at: (c) => c.w('gone'), file: 'impact', vol: 1},
  {scene: 8, at: (c) => c.w('gone') + 6, file: 'thunder', vol: 0.7},
  // 9 · reno
  {scene: 9, at: () => 0, file: 'siren', vol: 0.5, until: (c) => c.s(1)},
  {scene: 9, at: () => 4, file: 'pop', vol: 0.6},
  {scene: 9, at: (c) => c.s(1), file: 'impact', vol: 1},
  {scene: 9, at: (c) => c.s(2), file: 'whoosh2', vol: 0.5},
  {scene: 9, at: (c) => c.w('black') - 4, file: 'hit', vol: 0.6},
  {scene: 9, at: (c) => c.w('eight') - 4, file: 'hit', vol: 0.6},
  {scene: 9, at: (c) => c.w('two') - 4, file: 'hit', vol: 0.6},
  // 10 · the search
  {scene: 10, at: () => 4, file: 'clock', vol: 0.3, until: (c) => c.s(1)},
  {scene: 10, at: (c) => c.s(1), file: 'impact', vol: 0.7},
  {scene: 10, at: (c) => c.s(2), file: 'impact', vol: 0.7},
  {scene: 10, at: (c) => c.s(3), file: 'impact', vol: 0.7},
  {scene: 10, at: (c) => c.s(4), file: 'whoosh2', vol: 0.5},
  {scene: 10, at: (c) => c.s(4), file: 'ticks-fast', vol: 0.22, until: (c) => c.s(4) + 30},
  {scene: 10, at: (c) => c.s(5), file: 'impact', vol: 1},
  // 11 · the money
  {scene: 11, at: (c) => c.w('riverbank') - 10, file: 'pop', vol: 0.7},
  {scene: 11, at: (c) => c.w('found') - 22, file: 'riser', vol: 0.35},
  {scene: 11, at: (c) => c.w('found'), file: 'impact', vol: 0.9},
  {scene: 11, at: (c) => c.s(1), file: 'type', vol: 0.4, until: (c) => c.s(1) + 20},
  {scene: 11, at: (c) => c.e(1) - 6, file: 'chime', vol: 0.5},
  {scene: 11, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 11, at: (c) => c.s(2) + 28, file: 'hit', vol: 0.6},
  // 12 · the question
  {scene: 12, at: (c) => c.w('stopped'), file: 'impact', vol: 1},
  {scene: 12, at: (c) => c.s(1), file: 'whoosh2', vol: 0.5},
  {scene: 12, at: (c) => c.s(1), file: 'wind', vol: 0.5},
  {scene: 12, at: (c) => c.s(2), file: 'hit', vol: 0.7},
  {scene: 12, at: (c) => c.s(2), file: 'heartbeat', vol: 0.6, until: (c) => c.s(3)},
  {scene: 12, at: (c) => c.s(3), file: 'whoosh', vol: 0.5},
  {scene: 12, at: (c) => c.w('reporter') - 2, file: 'swipe', vol: 0.7},
  {scene: 12, at: (c) => c.w('mistake') - 4, file: 'hit', vol: 0.6},
  {scene: 12, at: (c) => c.e(3) + 6, file: 'impact', vol: 0.9},
  {scene: 12, at: (c) => c.e(3) + 6, file: 'chime', vol: 0.45},
];

export const DBCooper: React.FC = () => {
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
          <CutFlash accent={AMBER} />
          <Audio src={staticFile('sfx/hit.wav')} volume={0.45} />
          <Audio src={staticFile('sfx/whoosh2.wav')} volume={0.35} />
        </Sequence>
      ))}
      <Grain />
      <Captions lines={T.lines} accent={AMBER} />
      <ProgressBar total={T.totalFrames} color={AMBER} />

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
