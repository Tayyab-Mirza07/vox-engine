import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Compass, Count, Crew, Ending, Flames, Fuel, Heard, Hook, LastMessage, Legend, Lost, Mariner, RED, Record, Rescue, Silence, Takeoff, Verdict, Wreck} from './scenes';
import {LightSweep} from '../bakerst/parts';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Takeoff, Crew, Compass, Lost, Heard, Fuel, LastMessage, Silence, Rescue, Mariner, Flames, Count, Legend, Record, Verdict, Wreck, Ending];
// Evidence board: page tilts between board beats, zooms into the cinematic stills.
const KINDS: TransitionKind[] = ['zoom', 'tilt', 'zoom', 'tilt', 'zoom', 'zoom', 'tilt', 'zoom', 'zoom', 'tilt', 'zoom', 'tilt', 'tilt', 'tilt', 'tilt', 'zoom', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Cold open, calm takeoff, rising panic on the radio, silence, second disaster, cooler legend, final twist.
const INTENSITY = [1.05, 0.9, 0.9, 1.0, 1.0, 1.05, 1.05, 1.1, 0.6, 1.0, 1.05, 1.1, 1.0, 0.9, 0.9, 0.95, 1.05, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  0: (c) => [c.s(1)],
  17: (c) => [c.s(3)],
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
  at(3, (c) => c.s(1)),
  at(8, () => 0),
  at(10, (c) => c.s(2)),
  at(16, (c) => c.s(3)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: () => 0, file: 'jet', vol: 0.35, until: (c) => c.s(1)},
  {scene: 0, at: (c) => c.s(1), file: 'impact', vol: 0.75},
  {scene: 0, at: (c) => c.s(2), file: 'hit', vol: 0.7},
  {scene: 0, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  // 1 · takeoff
  {scene: 1, at: () => 0, file: 'jet', vol: 0.3, until: (c) => c.dur},
  {scene: 1, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 1, at: (c) => c.s(3), file: 'hit', vol: 0.7},
  // 2 · crew
  {scene: 2, at: () => 2, file: 'pop', vol: 0.45},
  {scene: 2, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 2, at: (c) => c.s(2), file: 'type', vol: 0.25, until: (c) => c.s(2) + 40},
  // 3 · compasses
  {scene: 3, at: () => 0, file: 'glitch', vol: 0.25, until: (c) => c.dur},
  {scene: 3, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  // 4 · lost
  {scene: 4, at: () => 4, file: 'pop', vol: 0.45},
  {scene: 4, at: (c) => c.s(1), file: 'hit', vol: 0.65},
  {scene: 4, at: (c) => c.s(2), file: 'riser', vol: 0.3, until: (c) => c.dur},
  // 5 · heard
  {scene: 5, at: () => 0, file: 'glitch', vol: 0.3, until: (c) => c.dur},
  {scene: 5, at: (c) => c.s(1), file: 'hit', vol: 0.75},
  // 6 · fuel
  {scene: 6, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 6, at: (c) => c.s(2), file: 'heartbeat', vol: 0.4, until: (c) => c.dur},
  // 7 · last message
  {scene: 7, at: () => 0, file: 'glitch', vol: 0.25, until: (c) => c.dur},
  {scene: 7, at: (c) => c.s(1), file: 'type', vol: 0.3, until: (c) => c.s(1) + 40},
  {scene: 7, at: (c) => c.s(2), file: 'type', vol: 0.3, until: (c) => c.s(2) + 60},
  // 8 · silence
  {scene: 8, at: () => 0, file: 'impact', vol: 0.6},
  // 9 · rescue
  {scene: 9, at: () => 0, file: 'riser', vol: 0.3, until: (c) => c.s(1)},
  {scene: 9, at: (c) => c.s(1), file: 'jet', vol: 0.3, until: (c) => c.dur},
  // 10 · mariner
  {scene: 10, at: () => 2, file: 'pop', vol: 0.45},
  {scene: 10, at: (c) => c.s(1), file: 'clock', vol: 0.35, until: (c) => c.s(2)},
  {scene: 10, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  // 11 · flames
  {scene: 11, at: () => 0, file: 'thunder', vol: 0.45},
  {scene: 11, at: (c) => c.s(2), file: 'hit', vol: 0.7},
  // 12 · count
  {scene: 12, at: () => 2, file: 'hit', vol: 0.6},
  ...[0, 4, 8, 12, 16, 20].map((d): Sfx => ({scene: 12, at: (c) => c.s(1) + d, file: 'pop', vol: 0.35})),
  {scene: 12, at: (c) => c.s(4), file: 'impact', vol: 0.85},
  // 13 · legend
  {scene: 13, at: () => 0, file: 'chime', vol: 0.35},
  {scene: 13, at: (c) => c.s(1), file: 'pop', vol: 0.4},
  {scene: 13, at: (c) => c.s(2), file: 'pop', vol: 0.4},
  // 14 · record
  {scene: 14, at: () => 10, file: 'hit', vol: 0.7},
  ...[2, 3, 4].map((n): Sfx => ({scene: 14, at: (c) => c.s(n), file: 'pop', vol: 0.45})),
  // 15 · verdict
  {scene: 15, at: () => 6, file: 'hit', vol: 0.65},
  {scene: 15, at: (c) => c.s(2), file: 'impact', vol: 0.8},
  // 16 · 1991
  {scene: 16, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.s(2)},
  {scene: 16, at: (c) => c.s(1), file: 'riser', vol: 0.3, until: (c) => c.s(2)},
  {scene: 16, at: (c) => c.s(2), file: 'impact', vol: 0.9},
  // 17 · ending + CTA
  {scene: 17, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.s(3)},
  {scene: 17, at: (c) => c.s(2), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(3), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(3) + 4, file: 'chime', vol: 0.4},
];

export const Flight19: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      {play('music') ? <Audio src={staticFile('flight19/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
