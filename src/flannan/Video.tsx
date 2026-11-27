import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Archtor, Coats, Debunk, ElevenDays, Ending, Gone, Hesperus, Hook, Inside, Island, Job, Keepers, Landing, Legends, Moore, Muirhead, NoCoat, RED, Theory} from './scenes';
import {LightSweep} from '../bakerst/parts';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Island, Keepers, Job, Archtor, ElevenDays, Hesperus, Moore, Inside, Coats, NoCoat, Gone, Legends, Debunk, Landing, Muirhead, Theory, Ending];
// Evidence board: page tilts between board beats, zooms into the cinematic stills.
const KINDS: TransitionKind[] = ['zoom', 'tilt', 'zoom', 'whip', 'tilt', 'zoom', 'tilt', 'zoom', 'tilt', 'zoom', 'tilt', 'tilt', 'tilt', 'zoom', 'tilt', 'zoom', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Cold open, lonely island, dread from the dark light to the empty house, cooler for the legends, the wave at the end.
const INTENSITY = [1.05, 0.9, 0.9, 0.95, 1.05, 1.0, 1.0, 1.0, 1.0, 1.05, 1.1, 1.0, 0.9, 0.9, 1.1, 1.05, 1.05, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  0: (c) => [c.s(1), c.s(2), c.s(3)],
  1: (c) => [c.s(1), c.s(4)],
  8: (c) => [c.s(1), c.s(2)],
  14: (c) => [c.s(1), c.s(2)],
  17: (c) => [c.s(4)],
};
const PageTilt: React.FC<{cuts: number[]; children: React.ReactNode}> = ({cuts, children}) => {
  const frame = useCurrentFrame();
  const k = cuts.findIndex((c) => frame >= c && frame < c + 16);
  if (k < 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = p(frame, cuts[k], 16);
  const right = k % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `perspective(1600px) rotateY(${(1 - t) * (right ? -65 : 65)}deg) scale(${1 - 0.1 * (1 - t)})`, transformOrigin: right ? '100% 50%' : '0% 50%', boxShadow: '0 0 80px #000'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const at = (scene: number, c: (q: Cues) => number) => T.sceneStart(scene) + c(T.cues(scene));
// Music drops out just before the big reveals and swells back after.
const DIPS = [
  at(0, (c) => c.s(3)),
  at(4, (c) => c.s(2)),
  at(9, (c) => c.s(1)),
  at(11, (c) => c.s(2)),
  at(15, (c) => c.w('wave')),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.s(1)},
  {scene: 0, at: () => 4, file: 'thunder', vol: 0.5},
  {scene: 0, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 0, at: (c) => c.s(2), file: 'clock', vol: 0.35, until: (c) => c.s(3)},
  {scene: 0, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  // 1 · island
  {scene: 1, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  // 2 · keepers
  ...[2, 3, 4].map((n): Sfx => ({scene: 2, at: (c) => c.s(n), file: 'pop', vol: 0.45})),
  // 3 · job
  {scene: 3, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 3, at: (c) => c.s(2), file: 'hit', vol: 0.65},
  // 4 · Archtor
  {scene: 4, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(1) + 4, file: 'thunder', vol: 0.45},
  {scene: 4, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  // 5 · eleven days
  {scene: 5, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.25, until: (c) => c.w('eleven')},
  {scene: 5, at: (c) => c.w('eleven'), file: 'hit', vol: 0.75},
  // 6 · Hesperus
  {scene: 6, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 6, at: (c) => c.s(2), file: 'siren', vol: 0.15, until: (c) => c.s(3)},
  {scene: 6, at: (c) => c.s(3), file: 'whoosh', vol: 0.5},
  {scene: 6, at: (c) => c.s(4), file: 'hit', vol: 0.7},
  // 7 · Moore
  {scene: 7, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 7, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(2), file: 'hit', vol: 0.65},
  // 8 · inside
  {scene: 8, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.s(2)},
  {scene: 8, at: (c) => c.s(2), file: 'clock', vol: 0.35, until: (c) => c.s(2) + 20},
  {scene: 8, at: (c) => c.s(2) + 20, file: 'impact', vol: 0.8},
  // 9 · coats
  {scene: 9, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 9, at: (c) => c.s(1) + 4, file: 'hit', vol: 0.65},
  // 10 · no coat
  {scene: 10, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 10, at: (c) => c.w('storm'), file: 'thunder', vol: 0.5},
  // 11 · gone
  ...[0, 8, 16].map((d): Sfx => ({scene: 11, at: (c) => c.s(1) + d, file: 'hit', vol: 0.55})),
  {scene: 11, at: (c) => c.s(2) + 6, file: 'impact', vol: 0.8},
  // 12 · legends
  {scene: 12, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  {scene: 12, at: (c) => c.s(2), file: 'type', vol: 0.3, until: (c) => c.dur},
  // 13 · debunk
  {scene: 13, at: (c) => c.s(1), file: 'hit', vol: 0.7},
  {scene: 13, at: (c) => c.s(2), file: 'hit', vol: 0.75},
  // 14 · landing
  {scene: 14, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 14, at: () => 2, file: 'thunder', vol: 0.4},
  ...[1, 2, 3].map((n): Sfx => ({scene: 14, at: (c) => c.s(n), file: 'pop', vol: 0.45})),
  // 15 · Muirhead
  {scene: 15, at: () => 2, file: 'type', vol: 0.3, until: () => 40},
  {scene: 15, at: (c) => c.w('wave'), file: 'impact', vol: 0.9},
  // 16 · theory
  {scene: 16, at: () => 0, file: 'rain', vol: 0.3, until: (c) => c.dur},
  {scene: 16, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.s(1)},
  {scene: 16, at: (c) => c.s(1) - 6, file: 'thunder', vol: 0.5},
  // 17 · ending + CTA
  {scene: 17, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.s(3)},
  {scene: 17, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 17, at: (c) => c.s(3), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(4), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(4) + 4, file: 'chime', vol: 0.4},
];

export const Flannan: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
        const dur = T.sceneEnd(i) - start + (last ? 0 : TRANSITION_FRAMES);
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <ExitShade start={T.sceneEnd(i) - start}>
              <EnterTransition kind={transitionFor(i)} disabled={i === 0}>
                <PageTilt cuts={CUTS[i] ? CUTS[i](T.cues(i)) : []}>
                  <Scene cue={T.cues(i)} />
                </PageTilt>
                {i > 0 ? <LightSweep at={2} dur={26} strength={0.2} color="#f0b24a" /> : null}
              </EnterTransition>
            </ExitShade>
            {play('fx') && i > 0 ? <Audio src={staticFile('sfx/whoosh2.wav')} volume={(fr) => MIXER.fx(0.4, start + fr)} /> : null}
          </Sequence>
        );
      })}
      <Grain />
      <Captions lines={T.lines} accent={RED} />
      <ProgressBar total={T.totalFrames} color={RED} />
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
      {play('music') ? <Audio src={staticFile('flannan/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
