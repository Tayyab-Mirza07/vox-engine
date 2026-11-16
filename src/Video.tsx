import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {LINES, TOTAL_FRAMES, cues, f, sceneEnd, sceneStart} from './lib';
import {Hook, MapOne, MapTwo, Payoff, Setup, Stakes, Turn, Twist} from './scenes';
import {Captions, CutFlash, ProgressBar} from './ui';

const SCENES = [Hook, Setup, MapOne, Twist, Turn, MapTwo, Stakes, Payoff];

type Cue = ReturnType<typeof cues>;
type Sfx = {scene: number; at: (c: Cue) => number; file: string; vol: number; until?: (c: Cue) => number};

// Sound design: every visual event gets a matching sound. Frames are relative to the scene start.
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: (c) => c.w('reform'), file: 'impact', vol: 0.9},
  {scene: 0, at: (c) => c.s(1), file: 'impact', vol: 0.8},
  // 1 · setup
  {scene: 1, at: (c) => c.w('company') - 6, file: 'swipe', vol: 0.5},
  {scene: 1, at: (c) => c.w('company'), file: 'pop', vol: 0.7},
  {scene: 1, at: (c) => c.w('powering'), file: 'riser', vol: 0.3},
  {scene: 1, at: (c) => c.s(1) - 4, file: 'glitch', vol: 0.5},
  {scene: 1, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.28, until: (c) => c.e(1) - 6},
  // 2 · map one
  {scene: 2, at: (c) => c.s(0), file: 'pop', vol: 0.7},
  {scene: 2, at: (c) => c.s(1) - 4, file: 'whoosh', vol: 0.5},
  {scene: 2, at: (c) => c.s(1) + 14, file: 'pop', vol: 0.7},
  {scene: 2, at: (c) => c.w('parents'), file: 'whoosh2', vol: 0.6},
  {scene: 2, at: (c) => c.w('alone') - 4, file: 'pop', vol: 0.7},
  {scene: 2, at: (c) => c.w('alone'), file: 'hit', vol: 0.7},
  {scene: 2, at: (c) => c.s(3), file: 'whoosh', vol: 0.5},
  {scene: 2, at: (c) => c.s(3) + 36, file: 'pop', vol: 0.7},
  // 3 · twist
  {scene: 3, at: (c) => c.s(0) + 2, file: 'swipe', vol: 0.6},
  {scene: 3, at: (c) => c.s(1), file: 'whoosh2', vol: 0.45},
  {scene: 3, at: (c) => c.w('reform'), file: 'impact', vol: 0.9},
  {scene: 3, at: (c) => c.s(2), file: 'swipe', vol: 0.45},
  {scene: 3, at: (c) => c.w('seventeen') - 4, file: 'hit', vol: 0.6},
  {scene: 3, at: (c) => c.w('knife'), file: 'swipe', vol: 0.55},
  {scene: 3, at: (c) => c.s(3), file: 'swipe', vol: 0.45},
  {scene: 3, at: (c) => c.s(4), file: 'ticks-fast', vol: 0.2, until: (c) => c.dur - 10},
  {scene: 3, at: (c) => c.w('Every'), file: 'pop', vol: 0.7},
  {scene: 3, at: (c) => c.w('single'), file: 'pop', vol: 0.7},
  {scene: 3, at: (c) => c.w('day'), file: 'impact', vol: 0.7},
  // 4 · turn
  {scene: 4, at: (c) => c.s(1), file: 'chime', vol: 0.45},
  {scene: 4, at: (c) => c.s(2), file: 'pop', vol: 0.7},
  {scene: 4, at: (c) => c.s(2) + 6, file: 'swipe', vol: 0.4},
  {scene: 4, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  // 5 · map two
  {scene: 5, at: () => 4, file: 'whoosh2', vol: 0.55},
  {scene: 5, at: (c) => c.w('Oregon') - 6, file: 'pop', vol: 0.7},
  {scene: 5, at: (c) => c.s(1), file: 'whoosh', vol: 0.5},
  {scene: 5, at: (c) => c.s(1) + 24, file: 'pop', vol: 0.7},
  {scene: 5, at: (c) => c.w('booth'), file: 'swipe', vol: 0.45},
  {scene: 5, at: (c) => c.w('two') - 6, file: 'pop', vol: 0.5},
  {scene: 5, at: (c) => c.w('two') - 1, file: 'pop', vol: 0.5},
  {scene: 5, at: (c) => c.w('two') + 4, file: 'pop', vol: 0.5},
  {scene: 5, at: (c) => c.w('start'), file: 'chime', vol: 0.5},
  {scene: 5, at: (c) => c.w('start'), file: 'hit', vol: 0.6},
  // 6 · stakes
  {scene: 6, at: (c) => c.w('flops'), file: 'impact', vol: 0.9},
  {scene: 6, at: (c) => c.s(1), file: 'swipe', vol: 0.45},
  {scene: 6, at: (c) => c.s(1) + 8, file: 'ticks-fast', vol: 0.22, until: (c) => c.s(1) + 24},
  {scene: 6, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 6, at: (c) => c.s(2), file: 'clock', vol: 0.4, until: (c) => c.s(3)},
  {scene: 6, at: (c) => c.w('saves') - 36, file: 'riser', vol: 0.45},
  {scene: 6, at: (c) => c.w('saves'), file: 'impact', vol: 0.8},
  {scene: 6, at: (c) => c.w('saves'), file: 'chime', vol: 0.5},
  // 7 · payoff
  {scene: 7, at: () => 6, file: 'riser', vol: 0.35},
  {scene: 7, at: (c) => c.s(1), file: 'whoosh2', vol: 0.45},
  {scene: 7, at: (c) => c.w("isn't"), file: 'swipe', vol: 0.6},
  {scene: 7, at: (c) => c.s(2), file: 'whoosh', vol: 0.5},
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({scene: 7, at: (c) => c.s(2) + 2 + i * 8, file: 'pop', vol: 0.6})),
  {scene: 7, at: (c) => c.e(2) + 6, file: 'impact', vol: 0.8},
  {scene: 7, at: (c) => c.e(2) + 6, file: 'chime', vol: 0.45},
];

export const Short: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('400 80px Anton'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      {SCENES.map((Scene, i) => (
        <Sequence key={i} from={sceneStart(i)} durationInFrames={sceneEnd(i) - sceneStart(i)}>
          <Scene cue={cues(i)} />
          <CutFlash />
          <Audio src={staticFile('sfx/hit.wav')} volume={0.5} />
          <Audio src={staticFile('sfx/whoosh2.wav')} volume={0.4} />
        </Sequence>
      ))}
      <Captions />
      <ProgressBar total={TOTAL_FRAMES} />

      {LINES.map((line) => (
        <Sequence key={line.index} from={f(line.start)}>
          <Audio src={staticFile(line.file)} />
        </Sequence>
      ))}
      {SFX.map((x, k) => {
        const c = cues(x.scene);
        const from = Math.max(0, x.at(c));
        return (
          <Sequence key={`sfx${k}`} from={sceneStart(x.scene) + from} durationInFrames={x.until ? Math.max(1, x.until(c) - from) : undefined}>
            <Audio src={staticFile(`sfx/${x.file}.wav`)} volume={x.vol} />
          </Sequence>
        );
      })}
      <Audio src={staticFile('sfx/bed.wav')} volume={0.16} />
    </AbsoluteFill>
  );
};
