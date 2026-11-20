import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BODY, C} from '../lib';

export const ICE = '#7ec8ff';
export const RADAR = '#5dff9a';

/** Great Lakes freighter, side view, bow to the right. 900×220 box, waterline at y≈170. */
export const Freighter: React.FC<{width: number; color?: string; lights?: boolean; list?: number; broken?: number}> = ({
  width,
  color = '#0a1018',
  lights = true,
  list = 0,
  broken = 0,
}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 ? 1 : 0.3;
  return (
    <svg width={width} height={(width * 220) / 900} viewBox="0 0 900 220" style={{overflow: 'visible', transform: `rotate(${list}deg)`}}>
      <g fill={color}>
        {/* stern half */}
        <g transform={`translate(${-broken * 60}, ${broken * 40}) rotate(${-broken * 12}, 450, 170)`}>
          <path d="M 20 120 L 452 120 L 452 200 L 60 200 Q 30 190 20 160 Z" />
          <rect x={40} y={70} width={120} height={50} />
          <rect x={70} y={30} width={40} height={40} />
          <rect x={60} y={20} width={60} height={14} />
        </g>
        {/* bow half */}
        <g transform={`translate(${broken * 60}, ${broken * 60}) rotate(${broken * 18}, 450, 170)`}>
          <path d="M 448 120 L 860 120 Q 890 140 880 200 L 448 200 Z" />
          <rect x={770} y={70} width={80} height={50} />
          <rect x={790} y={44} width={50} height={26} />
          <line x1={815} y1={44} x2={815} y2={6} stroke={color} strokeWidth={5} />
          {/* hatch covers */}
          {Array.from({length: 10}, (_, i) => (
            <rect key={i} x={470 + i * 30} y={112} width={20} height={8} fill="#1d2a38" />
          ))}
        </g>
      </g>
      {lights && broken === 0 ? (
        <>
          {Array.from({length: 5}, (_, i) => (
            <rect key={i} x={780 + i * 13} y={84} width={7} height={8} fill="#ffd27a" opacity={0.85} />
          ))}
          {Array.from({length: 6}, (_, i) => (
            <rect key={`s${i}`} x={52 + i * 18} y={84} width={8} height={8} fill="#ffd27a" opacity={0.85} />
          ))}
          <circle cx={815} cy={6} r={6} fill={C.white} opacity={blink} />
          <circle cx={90} cy={20} r={5} fill={C.red} opacity={blink} />
        </>
      ) : null}
    </svg>
  );
};

/** Round radar screen with a sweeping beam. Blips are [angleDeg, radius 0..1, opacity]. */
export const Radar: React.FC<{size: number; blips?: [number, number, number][]; dead?: number; label?: string}> = ({size, blips = [], dead = 0, label}) => {
  const frame = useCurrentFrame();
  const a = (frame * 4) % 360;
  const r = 180;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} viewBox="-200 -200 400 400">
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06311a" />
            <stop offset="100%" stopColor="#020a06" />
          </radialGradient>
        </defs>
        <circle r={r + 12} fill="#11161c" stroke="#3a4a5c" strokeWidth={8} />
        <circle r={r} fill="url(#rg)" />
        <g opacity={1 - dead}>
          {[0.33, 0.66, 1].map((k) => (
            <circle key={k} r={r * k} fill="none" stroke={RADAR} strokeOpacity={0.25} strokeWidth={2} />
          ))}
          <line x1={-r} x2={r} y1={0} y2={0} stroke={RADAR} strokeOpacity={0.2} />
          <line y1={-r} y2={r} x1={0} x2={0} stroke={RADAR} strokeOpacity={0.2} />
          <path d={`M 0 0 L ${r * Math.cos(((a - 40) * Math.PI) / 180)} ${r * Math.sin(((a - 40) * Math.PI) / 180)} A ${r} ${r} 0 0 1 ${r * Math.cos((a * Math.PI) / 180)} ${r * Math.sin((a * Math.PI) / 180)} Z`} fill={RADAR} opacity={0.25} />
          <line x1={0} y1={0} x2={r * Math.cos((a * Math.PI) / 180)} y2={r * Math.sin((a * Math.PI) / 180)} stroke={RADAR} strokeWidth={3} />
          {blips.map(([ang, rr, op], i) => (
            <circle key={i} cx={rr * r * Math.cos((ang * Math.PI) / 180)} cy={rr * r * Math.sin((ang * Math.PI) / 180)} r={10} fill={RADAR} opacity={op} style={{filter: `drop-shadow(0 0 8px ${RADAR})`}} />
          ))}
        </g>
        {dead > 0 ? (
          <text y={14} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={40} fill={C.red} opacity={dead} letterSpacing={4}>
            NO SIGNAL
          </text>
        ) : null}
      </svg>
      {label ? (
        <div style={{position: 'absolute', bottom: -48, left: 0, right: 0, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.dim, letterSpacing: 4}}>{label}</div>
      ) : null}
    </div>
  );
};

/** Ship's bell, 200×220 box. */
export const Bell: React.FC<{size: number; swing?: number}> = ({size, swing = 0}) => (
  <svg width={size} height={(size * 220) / 200} viewBox="0 0 200 220" style={{transform: `rotate(${swing}deg)`, transformOrigin: '50% 8%'}}>
    <rect x={88} y={0} width={24} height={26} rx={6} fill="#b08d3a" />
    <path d="M 100 20 Q 40 22 40 110 Q 40 160 20 180 L 180 180 Q 160 160 160 110 Q 160 22 100 20 Z" fill="#c9a227" stroke="#7a5c12" strokeWidth={5} />
    <rect x={14} y={176} width={172} height={16} rx={6} fill="#b08d3a" />
    <circle cx={100} cy={204} r={14} fill="#7a5c12" />
    <text x={100} y={130} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={16} fill="#5c4410" letterSpacing={1}>
      EDMUND
    </text>
    <text x={100} y={150} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={16} fill="#5c4410" letterSpacing={1}>
      FITZGERALD
    </text>
  </svg>
);
