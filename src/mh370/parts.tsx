import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BODY, DISPLAY, rnd} from '../lib';

export const RED = '#e63946';
export const BLUE = '#4da3ff';
export const INK = '#04070d';
export const SAND = '#c9b48a';

/** Boeing 777 silhouette, side view, nose right (twin engines, conventional tail). 700×220 box. */
export const Jet777: React.FC<{width: number; color?: string; lights?: boolean; windows?: number}> = ({width, color = '#03060b', lights = true, windows = 0.7}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 3 === 0 ? 1 : 0.15;
  const strobe = frame % 40 < 3 ? 1 : 0;
  return (
    <svg width={width} height={(width * 220) / 700} viewBox="0 0 700 220" style={{overflow: 'visible'}}>
      <g fill={color}>
        <path d="M 40 112 Q 60 92 160 88 L 590 88 Q 660 90 690 112 Q 676 130 630 134 L 160 136 Q 80 134 40 116 Z" />
        <path d="M 120 92 L 70 20 L 112 20 L 200 90 Z" />
        <path d="M 40 106 L 0 92 L 12 108 L 90 118 Z" />
        <path d="M 420 126 L 300 200 L 262 200 L 330 126 Z" />
        <rect x={318} y={140} width={96} height={34} rx={17} />
      </g>
      {Array.from({length: 34}, (_, i) => (
        <rect key={i} x={200 + i * 11.5} y={100} width={5} height={5} rx={1.5} fill="#f2c46b" opacity={windows} />
      ))}
      {lights ? (
        <>
          <circle cx={92} cy={22} r={6} fill={RED} opacity={blink} />
          <circle cx={300} cy={198} r={5} fill="#7dff9a" opacity={blink} />
          <circle cx={360} cy={86} r={7} fill="#fff" opacity={strobe} />
        </>
      ) : null}
    </svg>
  );
};

/** Top-down 777 for map/route shots. 200×200 box, nose up. */
export const JetTop: React.FC<{size: number; color?: string; rotate?: number}> = ({size, color = '#e8eef6', rotate = 0}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{transform: `rotate(${rotate}deg)`, overflow: 'visible', filter: 'drop-shadow(0 0 8px #000)'}}>
    <g fill={color}>
      <rect x={-8} y={-90} width={16} height={175} rx={8} />
      <path d="M -8 -10 L -95 30 L -95 42 L -8 22 Z M 8 -10 L 95 30 L 95 42 L 8 22 Z" />
      <path d="M -6 62 L -38 82 L -38 90 L -6 80 Z M 6 62 L 38 82 L 38 90 L 6 80 Z" />
      <rect x={-50} y={4} width={12} height={26} rx={5} />
      <rect x={38} y={4} width={12} height={26} rx={5} />
    </g>
  </svg>
);

/** Round radar scope. `blip` is [x,y] in -1..1, `fade` hides the blip, `red` switches to military look. */
export const Scope: React.FC<{size: number; blip?: [number, number]; fade?: number; red?: boolean; label?: string; trail?: [number, number][]}> = ({size, blip, fade = 0, red = false, label, trail = []}) => {
  const frame = useCurrentFrame();
  const col = red ? RED : '#5dff9a';
  const a = (frame * 4) % 360;
  const r = 180;
  const rad = (d: number) => (d * Math.PI) / 180;
  return (
    <svg width={size} height={size} viewBox="-200 -200 400 400">
      <circle r={r + 14} fill="#0d1117" stroke="#2a3644" strokeWidth={8} />
      <circle r={r} fill={red ? '#1a0507' : '#03140a'} />
      {[0.33, 0.66, 1].map((k) => <circle key={k} r={r * k} fill="none" stroke={col} strokeOpacity={0.25} strokeWidth={2} />)}
      <line x1={-r} x2={r} y1={0} y2={0} stroke={col} strokeOpacity={0.2} />
      <line y1={-r} y2={r} x1={0} x2={0} stroke={col} strokeOpacity={0.2} />
      <path d={`M 0 0 L ${r * Math.cos(rad(a - 40))} ${r * Math.sin(rad(a - 40))} A ${r} ${r} 0 0 1 ${r * Math.cos(rad(a))} ${r * Math.sin(rad(a))} Z`} fill={col} opacity={0.22} />
      {trail.map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={4} fill={col} opacity={0.15 + (i / trail.length) * 0.4} />)}
      {blip ? (
        <g opacity={1 - fade}>
          <circle cx={blip[0] * r} cy={blip[1] * r} r={10} fill={col} style={{filter: `drop-shadow(0 0 10px ${col})`}} />
          {label ? (
            <text x={blip[0] * r + 16} y={blip[1] * r - 12} fontFamily={BODY} fontWeight={800} fontSize={22} fill={col}>
              {label}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

/** Communications satellite silhouette with solar panels. */
export const Satellite: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 300 150">
    <rect x={0} y={50} width={100} height={50} fill="#1b3a6b" stroke={BLUE} strokeWidth={3} />
    <rect x={200} y={50} width={100} height={50} fill="#1b3a6b" stroke={BLUE} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={25 * i + 12} y1={50} x2={25 * i + 12} y2={100} stroke={BLUE} strokeOpacity={0.5} />)}
    {[0, 1, 2, 3].map((i) => <line key={`r${i}`} x1={212 + 25 * i} y1={50} x2={212 + 25 * i} y2={100} stroke={BLUE} strokeOpacity={0.5} />)}
    <rect x={110} y={40} width={80} height={70} rx={8} fill="#d6dde6" />
    <path d="M 150 110 L 130 140 L 170 140 Z" fill="#d6dde6" />
    <rect x={100} y={70} width={10} height={10} fill="#d6dde6" />
    <rect x={190} y={70} width={10} height={10} fill="#d6dde6" />
  </svg>
);

/** Ship silhouette on the horizon. */
export const Ship: React.FC<{width: number; color?: string}> = ({width, color = '#060a10'}) => (
  <svg width={width} height={width * 0.35} viewBox="0 0 400 140">
    <path d="M 10 90 L 390 90 L 360 130 L 40 130 Z" fill={color} />
    <rect x={240} y={40} width={90} height={50} fill={color} />
    <rect x={270} y={10} width={20} height={30} fill={color} />
    <rect x={60} y={70} width={150} height={20} fill={color} />
    <circle cx={280} cy={8} r={5} fill={RED} />
  </svg>
);

/** Deep-sea survey robot (AUV) with a searchlight cone. */
export const Drone: React.FC<{width: number; beam?: number}> = ({width, beam = 1}) => (
  <svg width={width} height={width * 0.9} viewBox="0 0 400 360" style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe9a8" stopOpacity={0.55 * beam} />
        <stop offset="100%" stopColor="#ffe9a8" stopOpacity={0} />
      </linearGradient>
    </defs>
    <polygon points="250,95 60,360 440,360" fill="url(#beam)" />
    <rect x={40} y={50} width={300} height={60} rx={30} fill="#f2c94c" stroke="#5a4510" strokeWidth={4} />
    <path d="M 40 80 L 0 50 L 0 110 Z" fill="#5a4510" />
    <rect x={150} y={35} width={60} height={20} rx={6} fill="#5a4510" />
    <circle cx={250} cy={100} r={12} fill="#fff6d8" />
    <text x={190} y={92} textAnchor="middle" fontFamily={DISPLAY} fontSize={22} fill="#5a4510">
      AUV
    </text>
  </svg>
);

/** Floating particles in deep water. */
export const Marine: React.FC<{amount?: number}> = ({amount = 1}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
      {Array.from({length: Math.round(60 * amount)}, (_, i) => {
        const y = (rnd(i) * 1920 - frame * (0.3 + rnd(i + 1) * 0.6) + 1920 * 4) % 1920;
        const x = rnd(i + 9) * 1080 + Math.sin(frame / 40 + i) * 14;
        return <circle key={i} cx={x} cy={y} r={1 + rnd(i + 3) * 2.5} fill="#9fc6e6" opacity={0.15 + rnd(i + 4) * 0.25} />;
      })}
    </svg>
  );
};
