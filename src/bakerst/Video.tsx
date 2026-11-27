import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Blast, Collapse, Hook, InTheVault, Listening, London, Lookout, Mastermind, Mistake, Monday, Payoff, RED, Record, Rowlands, Setup, Tunnel, Umbrella, WalkedAway, WhichBank} from './scenes';
import {LightSweep} from './parts';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, London, Mastermind, Setup, Umbrella, Tunnel, Collapse, Blast, InTheVault, Listening, Rowlands, Record, Lookout, WhichBank, WalkedAway, Monday, Mistake, Payoff];
// Minimal edit: page tilts on most cuts, a whip or zoom for the action beats.
const KINDS: TransitionKind[] = ['whip', 'tilt', 'tilt', 'zoom', 'tilt', 'whip', 'zoom', 'tilt', 'wipe', 'tilt', 'tilt', 'tilt', 'zoom', 'tilt', 'tilt', 'tilt', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Cool heist groove, tension in the tunnel, hush at 'listening', peak at the vault door, release at Monday.
const INTENSITY = [1.0, 0.9, 0.95, 0.95, 0.95, 1.0, 1.05, 1.1, 1.0, 0.9, 1.0, 1.0, 0.9, 1.05, 1.1, 1.0, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  1: (c) => [c.s(2), c.s(3)],
  5: (c) => [c.s(2), c.s(3)],
  7: (c) => [c.s(1), c.s(2)],
  11: (c) => [c.s(2)],
  15: (c) => [c.s(3)],
  16: (c) => [c.s(2)],
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
  at(0, (c) => c.s(2)),
  at(6, (c) => c.s(1)),
  at(9, (c) => c.s(0)),
  at(14, (c) => c.s(3)),
  at(16, (c) => c.s(2)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'bed', vol: 0.35, until: (c) => c.dur},
  {scene: 0, at: () => 0, file: 'impact', vol: 0.85},
  {scene: 0, at: (c) => c.s(1), file: 'heartbeat', vol: 0.4, until: (c) => c.s(2)},
  {scene: 0, at: (c) => c.s(1), file: 'hit', vol: 0.7},
  {scene: 0, at: (c) => c.w('walked'), file: 'swipe', vol: 0.4},
  // 1 · london
  {scene: 1, at: () => 0, file: 'rain', vol: 0.15, until: (c) => c.s(2)},
  {scene: 1, at: (c) => c.s(1), file: 'type', vol: 0.35, until: (c) => c.s(1) + 40},
  {scene: 1, at: (c) => c.s(2), file: 'pop', vol: 0.45},
  {scene: 1, at: (c) => c.s(3), file: 'chime', vol: 0.35},
  // 2 · mastermind
  {scene: 2, at: () => 6, file: 'pop', vol: 0.4},
  {scene: 2, at: (c) => c.s(1), file: 'whoosh', vol: 0.4},
  {scene: 2, at: (c) => c.s(2), file: 'chime', vol: 0.35},
  {scene: 2, at: (c) => c.s(3), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(3) + 30},
  // 3 · setup
  {scene: 3, at: (c) => c.s(1) - 6, file: 'swipe', vol: 0.45},
  {scene: 3, at: (c) => c.s(1) + 20, file: 'type', vol: 0.25, until: (c) => c.s(1) + 46},
  {scene: 3, at: (c) => c.s(2) - 6, file: 'swipe', vol: 0.45},
  {scene: 3, at: (c) => c.s(2) + 14, file: 'pop', vol: 0.45},
  // 4 · umbrella
  {scene: 4, at: () => 0, file: 'clock', vol: 0.3, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(2), file: 'hit', vol: 0.75},
  {scene: 4, at: (c) => c.s(2) + 2, file: 'glitch', vol: 0.35},
  // 5 · tunnel
  {scene: 5, at: () => 0, file: 'wind', vol: 0.2, until: (c) => c.dur},
  {scene: 5, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 5, at: (c) => c.s(3), file: 'pop', vol: 0.45},
  {scene: 5, at: (c) => c.s(3) + 20, file: 'thunder', vol: 0.25},
  // 6 · collapse
  {scene: 6, at: (c) => c.w('collapsed') - 10, file: 'riser', vol: 0.35},
  {scene: 6, at: (c) => c.w('collapsed'), file: 'impact', vol: 0.95},
  {scene: 6, at: (c) => c.w('collapsed') + 4, file: 'thunder', vol: 0.4},
  // 7 · jack, lance, blast
  {scene: 7, at: () => 6, file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(1), file: 'glitch', vol: 0.3, until: (c) => c.s(1) + 30},
  {scene: 7, at: (c) => c.s(2), file: 'ticks-fast', vol: 0.25, until: (c) => c.w('blast')},
  {scene: 7, at: (c) => c.w('traffic') - 30, file: 'jet', vol: 0.25, until: (c) => c.dur},
  {scene: 7, at: (c) => c.w('blast'), file: 'impact', vol: 0.9},
  // 8 · in
  {scene: 8, at: (c) => c.s(1), file: 'whoosh2', vol: 0.4},
  {scene: 8, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  {scene: 8, at: (c) => c.s(2) + 30, file: 'hit', vol: 0.6},
  // 9 · listening
  {scene: 9, at: () => 0, file: 'glitch', vol: 0.35, until: (c) => c.dur},
  {scene: 9, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  // 10 · rowlands
  {scene: 10, at: (c) => c.s(1), file: 'glitch', vol: 0.3, until: (c) => c.dur},
  {scene: 10, at: (c) => c.s(2), file: 'pop', vol: 0.45},
  // 11 · record
  {scene: 11, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 11, at: (c) => c.s(2), file: 'pop', vol: 0.6},
  {scene: 11, at: (c) => c.s(2) + 4, file: 'ticks-fast', vol: 0.2, until: (c) => c.dur},
  {scene: 11, at: (c) => c.s(3) + 6, file: 'hit', vol: 0.6},
  // 12 · lookout
  {scene: 12, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 12, at: (c) => c.s(1) + 20, file: 'swipe', vol: 0.4},
  // 13 · which bank
  {scene: 13, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.s(2)},
  {scene: 13, at: (c) => c.s(2), file: 'clock', vol: 0.35, until: (c) => c.dur},
  {scene: 13, at: (c) => c.s(3), file: 'hit', vol: 0.65},
  // 14 · walked away
  {scene: 14, at: () => 0, file: 'heartbeat', vol: 0.4, until: (c) => c.s(4)},
  {scene: 14, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 14, at: (c) => c.s(4) + 6, file: 'swipe', vol: 0.35},
  // 15 · monday
  {scene: 15, at: (c) => c.s(1), file: 'impact', vol: 0.8},
  {scene: 15, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 15, at: (c) => c.s(4), file: 'ticks-fast', vol: 0.3, until: (c) => c.s(5)},
  {scene: 15, at: (c) => c.s(5) + 2, file: 'pop', vol: 0.6},
  // 16 · mistake
  {scene: 16, at: (c) => c.s(1) + 20, file: 'type', vol: 0.3, until: (c) => c.s(1) + 44},
  {scene: 16, at: (c) => c.s(1) + 44, file: 'hit', vol: 0.6},
  {scene: 16, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  {scene: 16, at: (c) => c.s(4), file: 'hit', vol: 0.65},
  // 17 · payoff + CTA
  {scene: 17, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.s(4)},
  {scene: 17, at: (c) => c.s(1) + 6, file: 'impact', vol: 0.85},
  {scene: 17, at: (c) => c.s(3), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(4), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(4) + 4, file: 'chime', vol: 0.4},
];

export const BakerSt: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
                {i > 0 ? <LightSweep at={2} dur={26} strength={0.25} /> : null}
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
      {play('music') ? <Audio src={staticFile('bakerst/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
