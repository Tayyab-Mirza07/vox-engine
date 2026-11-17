import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W, rnd} from '../lib';

export const TEAL = '#5ad1c8';
export const FOG = '#9fb4c7';

/** Two-masted brigantine, side view, bow to the right. Drawn in a 600×520 box (waterline at y≈430). */
export const Ship: React.FC<{width: number; color?: string; sails?: number; lifeboat?: boolean; glow?: string}> = ({
  width,
  color = '#0a1018',
  sails = 1,
  lifeboat = false,
  glow,
}) => (
  <svg width={width} height={(width * 520) / 600} viewBox="0 0 600 520" style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 30px ${glow})` : undefined}}>
    <g fill={color} stroke={color} strokeLinejoin="round">
      {/* masts */}
      <rect x={196} y={40} width={8} height={360} />
      <rect x={386} y={20} width={9} height={380} />
      <line x1={395} y1={60} x2={590} y2={360} strokeWidth={4} />
      <line x1={480} y1={350} x2={580} y2={350} strokeWidth={10} />
      {/* square sails on the foremast */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} opacity={sails} d={`M ${330 + i * 6} ${70 + i * 70} Q 390 ${60 + i * 70 + 18} ${450 - i * 6} ${70 + i * 70} L ${446 - i * 6} ${128 + i * 70} Q 390 ${138 + i * 70} ${334 + i * 6} ${128 + i * 70} Z`} />
      ))}
      {/* fore-and-aft sail on the main mast */}
      <path opacity={sails} d="M 204 60 L 204 360 L 60 360 Q 120 210 204 60 Z" />
      {/* jib */}
      <path opacity={sails} d="M 400 80 L 560 330 L 430 330 Z" />
      {/* hull */}
      <path d="M 20 380 L 580 380 Q 560 450 500 470 L 90 470 Q 40 450 20 380 Z" />
      {lifeboat ? <path d="M 110 360 Q 150 380 200 360 L 196 372 Q 150 390 114 372 Z" /> : null}
    </g>
  </svg>
);

/** Rowing boat seen from the side, 200×80 box. */
export const Boat: React.FC<{width: number; color?: string; people?: number}> = ({width, color = '#0a1018', people = 0}) => (
  <svg width={width} height={(width * 90) / 200} viewBox="0 0 200 90" style={{overflow: 'visible'}}>
    <g fill={color}>
      {Array.from({length: people}, (_, i) => (
        <g key={i} transform={`translate(${30 + i * (140 / Math.max(1, people - 1))}, 0)`}>
          <circle cx={0} cy={22} r={7} />
          <rect x={-6} y={29} width={12} height={22} rx={4} />
        </g>
      ))}
      <path d="M 0 48 L 200 48 Q 180 88 150 88 L 50 88 Q 20 88 0 48 Z" />
    </g>
  </svg>
);

/** Animated sea with fog. `y` is the horizon line. */
export const Sea: React.FC<{y?: number; fog?: number; dark?: number; storm?: number}> = ({y = 1100, fog = 0.5, dark = 0, storm = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0b1520 0%, #142636 ${(y / H) * 100}%, #08121b 100%)`}}>
      <AbsoluteFill style={{background: '#000', opacity: dark * 0.6}} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 9}, (_, i) => {
          const yy = y + 30 + i * i * 9;
          const amp = 8 + i * 3 + storm * 14;
          const speed = 1.2 + i * 0.5;
          const pts = Array.from({length: 26}, (_, k) => {
            const x = k * 45;
            return `${x},${yy + Math.sin(k * 0.7 + (frame * speed) / 18 + i) * amp}`;
          });
          return <polyline key={i} points={pts.join(' ')} fill="none" stroke={TEAL} strokeOpacity={0.08 + i * 0.025} strokeWidth={2 + i * 0.4} />;
        })}
        {Array.from({length: 5}, (_, i) => {
          const x = ((rnd(i + 40) * (W + 900) + frame * (0.5 + rnd(i) * 0.8)) % (W + 900)) - 450;
          return <ellipse key={`f${i}`} cx={x} cy={y - 140 + rnd(i + 9) * 260} rx={420} ry={70} fill={FOG} opacity={fog * 0.13} />;
        })}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 40%, #000000c0 100%)'}} />
    </AbsoluteFill>
  );
};

/** One barrel, 60×80. */
export const Barrel: React.FC<{size?: number; color?: string; empty?: boolean}> = ({size = 60, color = '#7a5230', empty}) => (
  <svg width={size} height={(size * 80) / 60} viewBox="0 0 60 80">
    <path d="M 8 4 Q 0 40 8 76 L 52 76 Q 60 40 52 4 Z" fill={empty ? '#2a1214' : color} stroke={empty ? C.red : '#3d2814'} strokeWidth={3} />
    {[18, 40, 62].map((y) => (
      <line key={y} x1={4} y1={y} x2={56} y2={y} stroke={empty ? C.red : '#2b1c0e'} strokeWidth={4} />
    ))}
  </svg>
);
