import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

/** How many frames two scenes overlap during a transition. */
export const TRANSITION_FRAMES = 14;

export type TransitionKind = 'zoom' | 'slide' | 'wipe' | 'whip' | 'fade';

const ease = Easing.inOut(Easing.cubic);

/**
 * Wraps an incoming scene so it animates in over the outgoing one.
 * The outgoing scene keeps playing underneath for TRANSITION_FRAMES (its Sequence is extended),
 * so the cut is seamless instead of a hard switch.
 */
export const EnterTransition: React.FC<{kind: TransitionKind; children: React.ReactNode; disabled?: boolean}> = ({kind, children, disabled}) => {
  const frame = useCurrentFrame();
  if (disabled || frame >= TRANSITION_FRAMES) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  let style: React.CSSProperties = {};
  switch (kind) {
    case 'zoom':
      style = {opacity: t, transform: `scale(${1.18 - 0.18 * t})`, filter: `blur(${(1 - t) * 14}px)`};
      break;
    case 'slide':
      style = {transform: `translateY(${(1 - t) * 100}%)`, boxShadow: '0 -40px 80px #000'};
      break;
    case 'wipe':
      style = {clipPath: `circle(${t * 120}% at 50% 50%)`};
      break;
    case 'whip':
      style = {transform: `translateX(${(1 - t) * 100}%) skewX(${(1 - t) * -8}deg)`, filter: `blur(${(1 - t) * 18}px)`};
      break;
    case 'fade':
    default:
      style = {opacity: t};
  }
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Darkens/pushes the outgoing scene slightly while the next one comes in. */
export const ExitShade: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + TRANSITION_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <AbsoluteFill style={{transform: `scale(${1 - 0.06 * t})`, filter: t > 0 ? `brightness(${1 - 0.5 * t})` : undefined}}>{children}</AbsoluteFill>
  );
};

/** A rotating set of transitions so consecutive cuts feel varied. */
export const transitionFor = (i: number): TransitionKind => (['zoom', 'whip', 'wipe', 'slide'] as const)[i % 4];
