import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/800.css';
import '@fontsource/permanent-marker/400.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/special-elite/400.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {Captions, ProgressBar} from '../ui';
import {Autopsy, Checkout, Dna, Ending, Found, Funeral, Hook, Inside, Labels, Names, NoName, RED, Route, SceneProps, Spy, Staff, Station, Suicide, Teeth, Valley, Zinc} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES: React.FC<SceneProps>[] = [Hook, Valley, Found, Labels, Autopsy, Station, Inside, Route, Names, Staff, Checkout, Suicide, Spy, Funeral, Zinc, Teeth, Dna, NoName, Ending];
const SLIDE = 8;
/** Collage transition: the new page slides in like a sheet of paper, in 12 fps steps. */
const PageIn: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => {
  const frame = Math.floor(useCurrentFrame() / 2.5) * 2.5;
  if (i === 0 || frame >= SLIDE) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = frame / SLIDE;
  const dir = i % 3;
  const [x, y, r] = dir === 0 ? [1100 * (1 - t), 0, 6 * (1 - t)] : dir === 1 ? [-1100 * (1 - t), 0, -6 * (1 - t)] : [0, 1900 * (1 - t), 3 * (1 - t)];
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg)`, boxShadow: '0 0 60px #000a'}}>{children}</AbsoluteFill>;
};

const INTENSITY = [1.05, 0.9, 1.0, 0.95, 1.0, 1.0, 1.0, 0.95, 1.0, 0.9, 0.95, 1.05, 1.05, 0.85, 0.95, 1.0, 0.95, 0.9, 0.95];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
const DIPS = [at(0, (c) => c.s(2)), at(5, () => 0), at(11, (c) => c.s(1)), at(17, () => 0)];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  {scene: 0, at: () => 0, file: 'impact', vol: 0.8},
  {scene: 0, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 0, at: (c) => c.s(2) + 10, file: 'hit', vol: 0.7},
  {scene: 1, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: (c) => c.s(1), file: 'type', vol: 0.3, until: (c) => c.s(1) + 30},
  {scene: 2, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 2, at: (c) => c.s(2), file: 'pop', vol: 0.4},
  {scene: 3, at: (c) => c.s(3), file: 'impact', vol: 0.75},
  {scene: 4, at: () => 18, file: 'type', vol: 0.25, until: () => 60},
  {scene: 4, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 5, at: () => 14, file: 'type', vol: 0.3, until: () => 44},
  {scene: 6, at: () => 4, file: 'pop', vol: 0.45},
  {scene: 6, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 6, at: (c) => c.s(2), file: 'pop', vol: 0.45},
  {scene: 6, at: (c) => c.s(3), file: 'hit', vol: 0.6},
  {scene: 7, at: () => 6, file: 'ticks-fast', vol: 0.25, until: () => 70},
  {scene: 8, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.3, until: (c) => c.s(1) + 36},
  {scene: 8, at: (c) => c.s(1) + 36, file: 'impact', vol: 0.8},
  {scene: 9, at: () => 20, file: 'pop', vol: 0.35},
  {scene: 10, at: () => 0, file: 'clock', vol: 0.3, until: (c) => c.dur},
  {scene: 11, at: () => 20, file: 'impact', vol: 0.8},
  {scene: 11, at: (c) => c.s(1), file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 12, at: () => 0, file: 'glitch', vol: 0.2, until: () => 20},
  {scene: 12, at: (c) => c.s(2), file: 'whoosh', vol: 0.45},
  {scene: 13, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 14, at: (c) => c.s(1), file: 'impact', vol: 0.8},
  {scene: 15, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  {scene: 16, at: () => 20, file: 'hit', vol: 0.6},
  {scene: 17, at: () => 0, file: 'riser', vol: 0.25, until: (c) => c.dur},
  {scene: 18, at: (c) => c.s(2), file: 'pop', vol: 0.5},
  {scene: 18, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  {scene: 18, at: (c) => c.s(4), file: 'pop', vol: 0.5},
];

export const Isdal: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
  const play = (part: 'voice' | 'fx' | 'music') => stem === 'all' || stem === part;
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('900 80px "Playfair Display"'), document.fonts.load('400 40px "Special Elite"'), document.fonts.load('400 40px "Permanent Marker"'), document.fonts.load('800 40px Inter')])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{background: '#1b1712'}}>
      {SCENES.map((Scene, i) => {
        const start = T.sceneStart(i);
        const dur = T.sceneEnd(i) - start;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <PageIn i={i}>
              <Scene cue={T.cues(i)} />
            </PageIn>
            {play('fx') && i > 0 ? <Audio src={staticFile('sfx/swipe.wav')} volume={(fr) => MIXER.fx(0.35, start + fr)} /> : null}
          </Sequence>
        );
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 66%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.6) 84%, transparent 90%)', pointerEvents: 'none'}} />
      <Captions lines={T.lines} accent={RED} />
      <ProgressBar total={T.totalFrames} color={RED} />
      {play('voice') ? T.lines.map((line) => <Sequence key={line.index} from={f(line.start)}><Audio src={staticFile(line.file)} /></Sequence>) : null}
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
      {play('music') ? <Audio src={staticFile('isdal/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
