import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {LINES, TOTAL_FRAMES, cues, f, sceneEnd, sceneStart} from './lib';
import {Hook, MapOne, MapTwo, Payoff, Setup, Stakes, Turn, Twist} from './scenes';
import {Captions, CutFlash, ProgressBar} from './ui';

const SCENES = [Hook, Setup, MapOne, Twist, Turn, MapTwo, Stakes, Payoff];

// Extra whooshes on the map jumps (scene index, cue).
const WHOOSH: [number, (c: ReturnType<typeof cues>) => number][] = [
  [2, (c) => c.s(1) - 4],
  [2, (c) => c.w('parents')],
  [2, (c) => c.s(3)],
  [5, (c) => 4],
  [5, (c) => c.s(1)],
];
// Bass hits on the stamps and reveals.
const HITS: [number, (c: ReturnType<typeof cues>) => number][] = [
  [0, (c) => c.w('reform')],
  [0, (c) => c.s(1)],
  [3, (c) => c.w('reform')],
  [6, (c) => c.w('flops')],
  [6, (c) => c.w('saves')],
  [7, (c) => c.e(2) + 6],
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
          <Audio src={staticFile('sfx/hit.wav')} volume={0.55} />
        </Sequence>
      ))}
      <Captions />
      <ProgressBar total={TOTAL_FRAMES} />

      {LINES.map((line) => (
        <Sequence key={line.index} from={f(line.start)}>
          <Audio src={staticFile(line.file)} />
        </Sequence>
      ))}
      {WHOOSH.map(([i, at], k) => (
        <Sequence key={`w${k}`} from={sceneStart(i) + Math.max(0, at(cues(i)))}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.5} />
        </Sequence>
      ))}
      {HITS.map(([i, at], k) => (
        <Sequence key={`h${k}`} from={sceneStart(i) + Math.max(0, at(cues(i)))}>
          <Audio src={staticFile('sfx/hit.wav')} volume={0.7} />
        </Sequence>
      ))}
      <Audio src={staticFile('sfx/bed.wav')} volume={0.16} />
    </AbsoluteFill>
  );
};
