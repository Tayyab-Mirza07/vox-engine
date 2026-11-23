import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/800.css';
import {Cues, createTimeline, f, p} from '../lib';
import {createMix} from '../mix';
import {EnterTransition, ExitShade, TRANSITION_FRAMES, TransitionKind} from '../transitions';
import {Captions, ProgressBar} from '../ui';
import {Grain} from '../dbcooper/parts';
import {Ash, Billboard, Call, Clues, Compare, Detective, Ending, Fire, Home, Hook, Ladder, Letter, NoRemains, NobodyCame, RED, Smithsonian, Taken, Threat, Upstairs} from './scenes';
import {LightSweep} from '../bakerst/parts';
import timings from './timings.json';

export const T = createTimeline(timings);
const SCENES = [Hook, Home, Call, Fire, Upstairs, Ladder, NobodyCame, Ash, NoRemains, Compare, Clues, Threat, Taken, Smithsonian, Billboard, Letter, Detective, Ending];
// Evidence board: page tilts between board beats, zooms into the cinematic stills.
const KINDS: TransitionKind[] = ['zoom', 'tilt', 'zoom', 'tilt', 'zoom', 'zoom', 'tilt', 'zoom', 'zoom', 'tilt', 'zoom', 'tilt', 'tilt', 'tilt', 'tilt', 'zoom', 'tilt'];
const transitionFor = (i: number) => KINDS[(i - 1 + KINDS.length) % KINDS.length];

// Cold open on the fire, warm family, eerie call, panic, cold ash, investigation, dread, quiet billboard, letter twist.
const INTENSITY = [1.05, 0.85, 0.95, 1.1, 1.05, 1.1, 1.0, 0.8, 0.95, 0.95, 1.0, 1.05, 1.05, 0.95, 0.85, 1.0, 1.05, 0.95];
const intensity = (frame: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && frame >= T.sceneStart(i + 1)) i++;
  return INTENSITY[i];
};
// Cuts inside a scene (one visual to the next) also turn like a page.
const CUTS: Record<number, (c: Cues) => number[]> = {
  1: (c) => [c.s(1)],
  3: (c) => [c.s(1)],
  5: (c) => [c.s(2)],
  15: (c) => [c.s(2)],
  17: (c) => [c.s(4), c.s(6)],
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
  at(5, (c) => c.s(3)),
  at(10, (c) => c.s(3)),
  at(12, (c) => c.s(2)),
  at(15, (c) => c.s(3)),
];
const MIXER = createMix(T.lines, T.totalFrames, {dips: DIPS, intensity, musicGain: 0.85, musicUnderVoice: 0.65});

type Sfx = {scene: number; at: (c: Cues) => number; file: string; vol: number; until?: (c: Cues) => number};
const SFX: Sfx[] = [
  // 0 · hook
  {scene: 0, at: () => 0, file: 'impact', vol: 0.9},
  {scene: 0, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 0, at: (c) => c.s(1), file: 'hit', vol: 0.65},
  {scene: 0, at: (c) => c.s(2), file: 'hit', vol: 0.6},
  {scene: 0, at: (c) => c.s(3), file: 'impact', vol: 0.85},
  // 1 · home
  {scene: 1, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 1, at: (c) => c.s(2), file: 'chime', vol: 0.35},
  // 2 · call
  {scene: 2, at: () => 0, file: 'clock', vol: 0.3, until: (c) => c.s(1)},
  {scene: 2, at: (c) => c.s(2), file: 'glitch', vol: 0.2, until: (c) => c.s(4)},
  {scene: 2, at: (c) => c.s(4), file: 'hit', vol: 0.7},
  // 3 · fire
  {scene: 3, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.s(1)},
  {scene: 3, at: (c) => c.s(1), file: 'impact', vol: 0.85},
  {scene: 3, at: (c) => c.s(1), file: 'wind', vol: 0.35, until: (c) => c.dur},
  // 4 · upstairs
  {scene: 4, at: (c) => c.s(1), file: 'hit', vol: 0.65},
  ...[0, 14, 28, 42, 56].map((d): Sfx => ({scene: 4, at: (c) => c.s(2) + d, file: 'pop', vol: 0.35})),
  // 5 · ladder & trucks
  {scene: 5, at: () => 0, file: 'heartbeat', vol: 0.35, until: (c) => c.dur},
  {scene: 5, at: (c) => c.s(1), file: 'hit', vol: 0.75},
  {scene: 5, at: (c) => c.s(3), file: 'impact', vol: 0.8},
  // 6 · nobody came
  {scene: 6, at: () => 4, file: 'pop', vol: 0.45},
  {scene: 6, at: (c) => c.s(2), file: 'ticks-fast', vol: 0.3, until: (c) => c.s(2) + 30},
  {scene: 6, at: (c) => c.s(2) + 30, file: 'hit', vol: 0.7},
  // 7 · ash
  {scene: 7, at: () => 0, file: 'wind', vol: 0.3, until: (c) => c.dur},
  {scene: 7, at: (c) => c.s(1), file: 'riser', vol: 0.3, until: (c) => c.dur},
  // 8 · no remains
  ...[1, 2, 3].map((n): Sfx => ({scene: 8, at: (c) => c.s(n), file: 'hit', vol: 0.55})),
  {scene: 8, at: (c) => c.s(4), file: 'pop', vol: 0.45},
  // 9 · compare
  {scene: 9, at: () => 2, file: 'whoosh', vol: 0.4},
  {scene: 9, at: (c) => c.s(1), file: 'whoosh', vol: 0.45},
  {scene: 9, at: (c) => c.s(1) + 40, file: 'impact', vol: 0.75},
  // 10 · clues
  {scene: 10, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 10, at: (c) => c.s(2), file: 'pop', vol: 0.45},
  {scene: 10, at: (c) => c.s(3), file: 'impact', vol: 0.85},
  // 11 · threat
  {scene: 11, at: () => 30, file: 'type', vol: 0.3, until: (c) => c.s(1) - 10},
  {scene: 11, at: (c) => c.s(1), file: 'hit', vol: 0.65},
  // 12 · taken
  {scene: 12, at: () => 0, file: 'heartbeat', vol: 0.4, until: (c) => c.s(2)},
  {scene: 12, at: (c) => c.s(2), file: 'impact', vol: 0.9},
  // 13 · smithsonian
  {scene: 13, at: () => 2, file: 'pop', vol: 0.45},
  {scene: 13, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 13, at: (c) => c.s(2) + 40, file: 'hit', vol: 0.75},
  // 14 · billboard
  {scene: 14, at: () => 0, file: 'wind', vol: 0.25, until: (c) => c.dur},
  {scene: 14, at: () => 2, file: 'whoosh', vol: 0.4},
  // 15 · letter
  {scene: 15, at: () => 0, file: 'clock', vol: 0.25, until: (c) => c.s(2)},
  {scene: 15, at: (c) => c.s(3), file: 'riser', vol: 0.3, until: (c) => c.s(4)},
  {scene: 15, at: (c) => c.s(4), file: 'hit', vol: 0.65},
  // 16 · detective
  {scene: 16, at: () => 2, file: 'pop', vol: 0.45},
  {scene: 16, at: (c) => c.s(1), file: 'pop', vol: 0.45},
  {scene: 16, at: (c) => c.s(2), file: 'impact', vol: 0.85},
  // 17 · ending + CTA
  {scene: 17, at: () => 2, file: 'pop', vol: 0.4},
  {scene: 17, at: (c) => c.s(3), file: 'hit', vol: 0.7},
  {scene: 17, at: (c) => c.s(5), file: 'pop', vol: 0.5},
  {scene: 17, at: (c) => c.s(6), file: 'whoosh2', vol: 0.45},
  {scene: 17, at: (c) => c.s(6) + 4, file: 'chime', vol: 0.4},
];

export const Sodder: React.FC<{stem?: 'all' | 'voice' | 'fx' | 'music'}> = ({stem = 'all'}) => {
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
      {play('music') ? <Audio src={staticFile('sodder/music.mp3')} volume={(fr) => MIXER.music(fr)} /> : null}
    </AbsoluteFill>
  );
};
