import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Arguing, CheckIn, Ending, FakeName, Hook, Injuries, Interview, Letters, Louise, Maid, Nightmare, NoLuggage, OffHook, PhoneCall, RED, RealName, TheNote, WhoDon, Wrong} from './scenes';
import {LightSweep} from '../bakerst/parts';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, CheckIn, NoLuggage, Maid, TheNote, WhoDon, PhoneCall, Arguing, OffHook, Nightmare, Injuries, Interview, Wrong, FakeName, Louise, RealName, Letters, Ending];
// Noir file: page tilts between the 'case file' beats, zooms into the shocks.
const KINDS: TransitionKind[] = ['tilt', 'tilt', 'zoom', 'tilt', 'zoom', 'tilt', 'whip', 'tilt', 'zoom', 'wipe', 'tilt', 'tilt', 'tilt', 'tilt', 'zoom', 'tilt', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Hush through the check-in, creeping dread to the locked door, peak at the discovery, quiet grief at the funeral.
const INTENSITY = [1.05, 0.9, 0.9, 0.95, 0.95, 1.0, 0.95, 1.0, 1.05, 1.1, 1.1, 1.0, 1.0, 1.0, 0.85, 0.95, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  0: (c) => [c.s(1)],
  1: (c) => [c.s(2), c.s(3)],
  2: (c) => [c.s(2)],
  4: (c) => [c.s(1)],
  8: (c) => [c.s(2)],
  11: (c) => [c.s(3)],
  12: (c) => [c.s(3)],
  17: (c) => [c.s(5)],
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
  at(4, (c) => c.s(1)),
  at(9, (c) => c.w('nightmare')),
  at(11, (c) => c.s(3)),
  at(13, (c) => c.s(2)),
  at(15, (c) => c.s(1)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: (c) => c.w('stabbed'), file: 'hit', vol: 0.7},
  {scene: 0, at: (c) => c.w('skull'), file: 'hit', vol: 0.75},
  {scene: 0, at: (c) => c.s(1), file: 'heartbeat', vol: 0.35, until: (c) => c.s(2)},
  {scene: 0, at: (c) => c.s(2), file: 'impact', vol: 0.8},
  // 1 · check-in
  {scene: 1, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.s(2)},
  {scene: 1, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 1, at: (c) => c.s(3) + 6, file: 'type', vol: 0.35, until: (c) => c.s(3) + 60},
  // 2 · no luggage
  {scene: 2, at: () => 4, file: 'hit', vol: 0.55},
  ...[0, 1, 2].map((k): Sfx => ({scene: 2, at: (c) => c.s(1) + k * 10, file: 'pop', vol: 0.4})),
  {scene: 2, at: (c) => c.s(2), file: 'whoosh', vol: 0.4},
  // 3 · maid
  {scene: 3, at: () => 2, file: 'swipe', vol: 0.35},
  {scene: 3, at: (c) => c.s(1), file: 'clock', vol: 0.3, until: (c) => c.dur},
  {scene: 3, at: (c) => c.s(3), file: 'pop', vol: 0.5},
  // 4 · the note
  {scene: 4, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.dur},
  {scene: 4, at: (c) => c.s(1), file: 'chime', vol: 0.35},
  {scene: 4, at: (c) => c.s(4), file: 'hit', vol: 0.6},
  // 5 · who was Don
  {scene: 5, at: () => 2, file: 'impact', vol: 0.75},
  {scene: 5, at: (c) => c.s(1), file: 'glitch', vol: 0.3},
  // 6 · phone
  {scene: 6, at: () => 0, file: 'ticks-fast', vol: 0.15, until: (c) => c.s(1)},
  {scene: 6, at: (c) => c.s(1), file: 'pop', vol: 0.4},
  {scene: 6, at: (c) => c.s(3), file: 'pop', vol: 0.4},
  // 7 · arguing
  {scene: 7, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 7, at: () => 0, file: 'glitch', vol: 0.25, until: (c) => c.dur},
  // 8 · off the hook, knocks
  {scene: 8, at: (c) => c.s(1), file: 'siren', vol: 0.12, until: (c) => c.s(2)},
  ...[0, 13, 26].map((d): Sfx => ({scene: 8, at: (c) => c.s(2) + d, file: 'hit', vol: 0.55})),
  {scene: 8, at: (c) => c.s(4), file: 'impact', vol: 0.75},
  // 9 · nightmare
  {scene: 9, at: () => 4, file: 'riser', vol: 0.4},
  {scene: 9, at: (c) => c.w('nightmare'), file: 'impact', vol: 0.95},
  // 10 · injuries
  {scene: 10, at: () => 0, file: 'heartbeat', vol: 0.4, until: (c) => c.dur},
  {scene: 10, at: (c) => c.s(1), file: 'swipe', vol: 0.45},
  {scene: 10, at: (c) => c.s(2), file: 'hit', vol: 0.75},
  {scene: 10, at: (c) => c.s(3), file: 'hit', vol: 0.8},
  // 11 · interview
  {scene: 11, at: (c) => c.s(1), file: 'hit', vol: 0.55},
  {scene: 11, at: (c) => c.s(3), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(3) + 30},
  {scene: 11, at: (c) => c.s(3) + 30, file: 'impact', vol: 0.8},
  // 12 · room is wrong
  {scene: 12, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.s(3)},
  {scene: 12, at: (c) => c.s(1), file: 'hit', vol: 0.6},
  {scene: 12, at: (c) => c.s(3), file: 'glitch', vol: 0.3},
  // 13 · fake name
  {scene: 13, at: () => 2, file: 'type', vol: 0.3, until: () => 30},
  {scene: 13, at: (c) => c.s(1) + 6, file: 'impact', vol: 0.8},
  // 14 · Louise
  {scene: 14, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.dur},
  {scene: 14, at: (c) => c.s(2), file: 'chime', vol: 0.4},
  {scene: 14, at: (c) => c.s(4), file: 'chime', vol: 0.35},
  // 15 · real name
  {scene: 15, at: () => 2, file: 'swipe', vol: 0.4},
  {scene: 15, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  {scene: 15, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  // 16 · letters, Cairo
  ...[0, 10, 20].map((d): Sfx => ({scene: 16, at: (c) => c.s(1) + d, file: 'swipe', vol: 0.4})),
  {scene: 16, at: (c) => c.s(2), file: 'siren', vol: 0.1, until: (c) => c.w('Cairo')},
  {scene: 16, at: (c) => c.w('Cairo'), file: 'impact', vol: 0.85},
  // 17 · ending + CTA
  {scene: 17, at: () => 0, file: 'heartbeat', vol: 0.3, until: (c) => c.s(3)},
  {scene: 17, at: (c) => c.s(3), file: 'hit', vol: 0.6},
  {scene: 17, at: (c) => c.s(4), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(5), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(5) + 4, file: 'chime', vol: 0.4},
];

export const Room1046: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      {play('music') ? <Audio src={staticFile('room1046/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
