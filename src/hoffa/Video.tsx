import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {CallToAction, DarkFriends, Digs, Hook, Kennedy, LastSeen, Mercury, Name, NeverCharged, Nixon, OtherCar, Payoff, Pontiac, Prison, RED, Rumors, StoodUp, TheDay, Throne} from './scenes';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Name, DarkFriends, Kennedy, Prison, Nixon, Throne, TheDay, StoodUp, LastSeen, Pontiac, OtherCar, Mercury, NeverCharged, Rumors, Digs, Payoff, CallToAction];
// Page tilts between the photo 'files', zooms and whips into the set pieces.
const KINDS: TransitionKind[] = ['tilt', 'zoom', 'tilt', 'whip', 'tilt', 'zoom', 'tilt', 'wipe', 'tilt', 'zoom', 'tilt', 'whip', 'tilt', 'zoom', 'tilt', 'slide', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Power and menace, a coiled build to the parking lot, hard at the car evidence, heavy at the digs, open at the end.
const INTENSITY = [1.0, 0.9, 1.0, 1.0, 1.0, 0.9, 1.05, 1.0, 1.0, 0.95, 1.0, 1.05, 1.1, 0.9, 1.05, 1.05, 1.0, 1.0];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  0: (c) => [c.s(1), c.s(3)],
  1: (c) => [c.s(1)],
  3: (c) => [c.s(2)],
  5: (c) => [c.s(1)],
  6: (c) => [c.s(2)],
  7: (c) => [c.s(1)],
  8: (c) => [c.s(2)],
  12: (c) => [c.s(2)],
  14: (c) => [c.s(1), c.s(2), c.s(3), c.s(4)],
  15: (c) => [c.w('driveway'), c.w('field'), c.w('2022')],
  16: (c) => [c.s(2)],
  17: (c) => [c.s(2)],
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
  at(0, (c) => c.s(1)),
  at(9, (c) => c.s(1)),
  at(11, (c) => c.w('different')),
  at(12, (c) => c.s(2)),
  at(14, (c) => c.s(5)),
  at(16, (c) => c.s(2)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: (c) => c.w('vanished'), file: 'hit', vol: 0.85},
  {scene: 0, at: (c) => c.w('vanished') + 2, file: 'glitch', vol: 0.4},
  {scene: 0, at: (c) => c.s(1), file: 'wind', vol: 0.25, until: (c) => c.s(3)},
  {scene: 0, at: (c) => c.s(3), file: 'impact', vol: 0.7},
  // 1 · teamsters
  {scene: 1, at: () => 2, file: 'pop', vol: 0.4},
  {scene: 1, at: (c) => c.s(1), file: 'jet', vol: 0.25, until: (c) => c.w('stopped')},
  {scene: 1, at: (c) => c.w('stopped'), file: 'hit', vol: 0.75},
  // 2 · dark friends
  {scene: 2, at: () => 0, file: 'bed', vol: 0.3, until: (c) => c.dur},
  {scene: 2, at: (c) => c.s(1), file: 'riser', vol: 0.3},
  {scene: 2, at: (c) => c.w('flowing') - 4, file: 'chime', vol: 0.3},
  // 3 · kennedy
  {scene: 3, at: (c) => c.s(1) + 4, file: 'impact', vol: 0.8},
  {scene: 3, at: (c) => c.s(2), file: 'glitch', vol: 0.35},
  // 4 · prison
  {scene: 4, at: (c) => c.w('1967'), file: 'impact', vol: 0.9},
  {scene: 4, at: (c) => c.s(2), file: 'ticks-fast', vol: 0.25, until: (c) => c.s(2) + 24},
  {scene: 4, at: (c) => c.s(2) + 24, file: 'hit', vol: 0.7},
  // 5 · nixon
  {scene: 5, at: (c) => c.w('free'), file: 'whoosh', vol: 0.5},
  {scene: 5, at: (c) => c.s(1) + 6, file: 'type', vol: 0.35, until: (c) => c.s(1) + 60},
  {scene: 5, at: (c) => c.w('1980'), file: 'hit', vol: 0.75},
  // 6 · throne
  {scene: 6, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 6, at: (c) => c.s(2), file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  {scene: 6, at: (c) => c.s(2), file: 'riser', vol: 0.35},
  // 7 · the day
  {scene: 7, at: () => 2, file: 'swipe', vol: 0.5},
  {scene: 7, at: () => 16, file: 'hit', vol: 0.6},
  {scene: 7, at: (c) => c.s(2), file: 'pop', vol: 0.45},
  {scene: 7, at: (c) => c.w('Jersey') - 4, file: 'pop', vol: 0.45},
  // 8 · stood up
  {scene: 8, at: () => 0, file: 'clock', vol: 0.35, until: (c) => c.s(2)},
  {scene: 8, at: (c) => c.s(2), file: 'chime', vol: 0.3},
  {scene: 8, at: (c) => c.s(3), file: 'hit', vol: 0.55},
  // 9 · last seen
  {scene: 9, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 9, at: (c) => c.s(1), file: 'impact', vol: 0.8},
  // 10 · pontiac
  {scene: 10, at: (c) => c.s(1), file: 'pop', vol: 0.5},
  {scene: 10, at: (c) => c.s(3), file: 'hit', vol: 0.85},
  // 11 · different car
  {scene: 11, at: () => 0, file: 'heartbeat', vol: 0.3, until: (c) => c.dur},
  {scene: 11, at: (c) => c.w('different') - 10, file: 'riser', vol: 0.35},
  {scene: 11, at: (c) => c.w('different'), file: 'impact', vol: 0.85},
  // 12 · mercury, dogs, dna
  {scene: 12, at: (c) => c.w('Chuckie'), file: 'pop', vol: 0.45},
  {scene: 12, at: (c) => c.s(1), file: 'ticks-fast', vol: 0.2, until: (c) => c.s(2)},
  {scene: 12, at: (c) => c.s(2), file: 'glitch', vol: 0.4},
  {scene: 12, at: (c) => c.w('matched'), file: 'impact', vol: 0.9},
  // 13 · never charged
  {scene: 13, at: () => 0, file: 'bed', vol: 0.25, until: (c) => c.dur},
  {scene: 13, at: (c) => c.s(1), file: 'hit', vol: 0.65},
  // 14 · rumors
  {scene: 14, at: () => 2, file: 'impact', vol: 0.7},
  ...[1, 2, 3].map((n): Sfx => ({scene: 14, at: (c) => c.s(n), file: 'swipe', vol: 0.5})),
  {scene: 14, at: (c) => c.s(4) + 8, file: 'type', vol: 0.35, until: (c) => c.s(4) + 60},
  {scene: 14, at: (c) => c.w("wasn't"), file: 'hit', vol: 0.8},
  // 15 · digs
  {scene: 15, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  ...['driveway', 'field', '2022'].map((w): Sfx => ({scene: 15, at: (c) => c.w(w), file: 'pop', vol: 0.45})),
  {scene: 15, at: (c) => c.s(1) + 6, file: 'impact', vol: 0.85},
  // 16 · payoff
  {scene: 16, at: (c) => c.w('dead'), file: 'hit', vol: 0.8},
  {scene: 16, at: (c) => c.s(1), file: 'bed', vol: 0.3, until: (c) => c.s(2)},
  {scene: 16, at: (c) => c.s(2) + 4, file: 'impact', vol: 0.85},
  // 17 · CTA
  {scene: 17, at: () => 2, file: 'hit', vol: 0.55},
  {scene: 17, at: (c) => c.s(1), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(2), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(2) + 4, file: 'chime', vol: 0.4},
];

export const Hoffa: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      {play('music') ? <Audio src={staticFile('hoffa/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
