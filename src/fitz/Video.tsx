import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f} from '../lib';
import {createMix} from '../mix';
import {Captions, CutFlash, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {ICE} from './parts';
import {Blind, CallToAction, Damage, Departure, Gale, Hook, LastWords, Memorial, NoMayday, RehookHow, RehookWhat, Storm, Theories, Unknown, Vanished, Wreck} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, NoMayday, RehookHow, Departure, Gale, Storm, Damage, Blind, LastWords, Vanished, Wreck, RehookWhat, Theories, Unknown, Memorial, CallToAction];

// Suspense piano score: builds through the storm, peaks at the last words, mournful at the bell.
const INTENSITY = [1.0, 0.9, 1.0, 0.85, 0.95, 1.15, 1.1, 1.05, 1.0, 1.2, 0.9, 1.0, 1.0, 0.85, 1.05, 1.1];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
const DIPS = [
  at(0, (c) => c.s(3) + 2),
  at(2, (c) => c.w('minutes') - 4),
  at(6, (c) => c.s(4)),
  at(8, (c) => c.w('holding') - 8),
  at(9, (c) => c.s(2)),
  at(10, (c) => c.s(1)),
  at(13, (c) => c.s(1)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook: storm, radio, gone
  {scene: 0, at: () => 0, file: 'rain', vol: 0.4, until: (c) => c.dur},
  {scene: 0, at: () => 0, file: 'wind', vol: 0.5},
  {scene: 0, at: (c) => c.s(2), file: 'clock', vol: 0.3, until: (c) => c.w('holding') - 6},
  {scene: 0, at: (c) => c.w('holding') - 6, file: 'type', vol: 0.35, until: (c) => c.w('holding') + 30},
  {scene: 0, at: (c) => c.s(3) - 14, file: 'riser', vol: 0.35},
  {scene: 0, at: (c) => c.s(3) + 2, file: 'impact', vol: 0.9},
  {scene: 0, at: (c) => c.s(3) + 4, file: 'thunder', vol: 0.6},
  {scene: 0, at: (c) => c.s(4), file: 'hit', vol: 0.6},
  // 1 · no mayday
  {scene: 1, at: () => 2, file: 'hit', vol: 0.6},
  {scene: 1, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 1, at: (c) => c.s(2) - 6, file: 'ticks-fast', vol: 0.2, until: (c) => c.dur},
  {scene: 1, at: (c) => c.w('empty') - 4, file: 'glitch', vol: 0.45},
  // 2 · re-hook
  {scene: 2, at: () => 2, file: 'impact', vol: 0.8},
  {scene: 2, at: (c) => c.w('big') - 4, file: 'whoosh', vol: 0.5},
  {scene: 2, at: (c) => c.w('minutes') - 4, file: 'hit', vol: 0.6},
  {scene: 2, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.25, until: (c) => c.s(1) + 24},
  {scene: 2, at: (c) => c.s(1), file: 'glitch', vol: 0.4},
  // 3 · departure
  {scene: 3, at: () => 6, file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 3, at: (c) => c.w('26,000') - 4, file: 'ticks-fast', vol: 0.2, until: (c) => c.w('26,000') + 30},
  {scene: 3, at: (c) => c.w('Detroit') - 10, file: 'whoosh', vol: 0.5},
  {scene: 3, at: (c) => c.w('Detroit') + 26, file: 'pop', vol: 0.6},
  {scene: 3, at: (c) => c.s(3), file: 'swipe', vol: 0.45},
  // 4 · gale
  {scene: 4, at: () => 0, file: 'wind', vol: 0.55},
  {scene: 4, at: () => 4, file: 'riser', vol: 0.3},
  {scene: 4, at: (c) => c.s(1), file: 'whoosh2', vol: 0.45},
  // 5 · storm
  {scene: 5, at: () => 0, file: 'rain', vol: 0.55, until: (c) => c.dur},
  {scene: 5, at: () => 2, file: 'thunder', vol: 0.8},
  {scene: 5, at: (c) => c.s(1), file: 'wind', vol: 0.7},
  {scene: 5, at: (c) => c.s(2), file: 'impact', vol: 0.7},
  {scene: 5, at: (c) => c.s(2) + 20, file: 'thunder', vol: 0.6},
  // 6 · damage
  {scene: 6, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 6, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 6, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 6, at: (c) => c.s(3), file: 'hit', vol: 0.6},
  {scene: 6, at: (c) => c.s(4), file: 'impact', vol: 0.85},
  {scene: 6, at: (c) => c.s(4), file: 'glitch', vol: 0.4},
  // 7 · sailing blind
  {scene: 7, at: () => 2, file: 'glitch', vol: 0.45},
  {scene: 7, at: () => 4, file: 'wind', vol: 0.5},
  {scene: 7, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.2, until: (c) => c.dur},
  // 8 · last words
  {scene: 8, at: () => 0, file: 'clock', vol: 0.3, until: (c) => c.w('holding') - 8},
  {scene: 8, at: (c) => c.s(1), file: 'pop', vol: 0.55},
  {scene: 8, at: (c) => c.w('holding') - 8, file: 'pop', vol: 0.55},
  {scene: 8, at: (c) => c.s(2) + 30, file: 'hit', vol: 0.6},
  // 9 · vanished
  {scene: 9, at: () => 0, file: 'wind', vol: 0.6},
  {scene: 9, at: (c) => c.s(2) - 16, file: 'riser', vol: 0.4},
  {scene: 9, at: (c) => c.s(2), file: 'impact', vol: 0.9},
  {scene: 9, at: (c) => c.s(3), file: 'glitch', vol: 0.45},
  {scene: 9, at: (c) => c.w('radar') - 2, file: 'impact', vol: 0.8},
  // 10 · wreck
  {scene: 10, at: () => 2, file: 'whoosh', vol: 0.5},
  {scene: 10, at: () => 4, file: 'ticks-fast', vol: 0.18, until: (c) => c.w('530') + 10},
  {scene: 10, at: (c) => c.w('broken') - 4, file: 'impact', vol: 0.8},
  {scene: 10, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  // 11 · re-hook
  {scene: 11, at: () => 2, file: 'impact', vol: 0.8},
  // 12 · theories
  {scene: 12, at: () => 2, file: 'pop', vol: 0.6},
  {scene: 12, at: (c) => c.s(1), file: 'pop', vol: 0.6},
  {scene: 12, at: (c) => c.s(2), file: 'pop', vol: 0.6},
  {scene: 12, at: (c) => c.s(2) + 4, file: 'whoosh2', vol: 0.4},
  {scene: 12, at: (c) => c.s(2) + 10, file: 'whoosh2', vol: 0.4},
  {scene: 12, at: (c) => c.s(2) + 16, file: 'whoosh2', vol: 0.4},
  // 13 · unknown
  {scene: 13, at: () => 0, file: 'wind', vol: 0.4},
  {scene: 13, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  // 14 · memorial: the bell rings over the voice, kept soft
  {scene: 14, at: () => 4, file: 'whoosh2', vol: 0.4},
  ...Array.from({length: 8}, (_, i): Sfx => ({scene: 14, at: (c) => c.s(1) + i * 9, file: 'chime', vol: 0.3})),
  // 15 · CTA
  {scene: 15, at: () => 6, file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(1), file: 'pop', vol: 0.6},
  {scene: 15, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  {scene: 15, at: (c) => c.s(3), file: 'hit', vol: 0.6},
];

export const Fitz: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
          <CutFlash accent={ICE} />
          {play('fx') ? <Audio src={staticFile('sfx/whoosh2.wav')} volume={(fr) => MIXER.fx(0.35, T.sceneStart(i) + fr)} /> : null}
        </Sequence>
      ))}
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
      {play('music') ? <Audio src={staticFile('fitz/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
