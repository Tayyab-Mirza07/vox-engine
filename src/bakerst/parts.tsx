import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DISPLAY, W, lerp, p, rnd} from '../lib';

// Minimal duotone palette: black, red, blue.
export const BG = '#050507';
export const RED = '#e63946';
export const BLUE = '#3a7bff';
export const DRED = '#3a0d12';
export const DBLUE = '#0e1a36';
export const INK = '#000';
export const PAPER = '#f1ece2';

/** Soft diagonal light band sweeping across the frame, starting at `at` (frames) for `dur` frames. */
export const LightSweep: React.FC<{at?: number; dur?: number; color?: string; strength?: number}> = ({at = 0, dur = 34, color = '#ffffff', strength = 0.35}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return null;
  const t = p(frame, at, dur, (n) => n);
  const x = lerp(-900, 1500, t);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: -400, left: x, width: 260, height: 2800, transform: 'rotate(18deg)', background: `linear-gradient(90deg, transparent, ${color}${Math.round(strength * 255).toString(16).padStart(2, '0')}, transparent)`, filter: 'blur(18px)'}} />
    </AbsoluteFill>
  );
};

/** Duotone glow backdrop: black with a red and a blue pool of light. */
export const Duo: React.FC<{red?: [number, number]; blue?: [number, number]; mix?: number}> = ({red = [0.8, 0.25], blue = [0.2, 0.75], mix = 1}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${red[0] * 100}% ${red[1] * 100}%, ${RED}${Math.round(0x40 * mix).toString(16).padStart(2, '0')} 0%, transparent 45%), radial-gradient(circle at ${blue[0] * 100}% ${blue[1] * 100}%, ${BLUE}${Math.round(0x38 * mix).toString(16).padStart(2, '0')} 0%, transparent 45%), ${BG}`,
    }}
  />
);

type Pose = 'stand' | 'crouch' | 'arms' | 'dig' | 'walk' | 'sit' | 'shh' | 'point';
/** Flat silhouette person. 200×400 viewBox, feet at the bottom. */
export const Person: React.FC<{h: number; pose?: Pose; hat?: 'helmet' | 'cap' | 'none'; color?: string; flip?: boolean; step?: number; rim?: string}> = ({h, pose = 'stand', hat = 'none', color = INK, flip, step = 0, rim}) => {
  const crouch = pose === 'crouch' || pose === 'sit';
  const y0 = crouch ? 120 : 0;
  const sw = Math.sin(step) * 24;
  return (
    <svg width={h / 2} height={h} viewBox="0 0 200 400" style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, filter: rim ? `drop-shadow(0 0 10px ${rim})` : undefined}}>
      <g fill={color}>
        {/* head + hat */}
        <circle cx={100} cy={y0 + 52} r={30} />
        {hat === 'helmet' ? <path d={`M 66 ${y0 + 50} Q 70 ${y0 - 30} 100 ${y0 - 34} Q 130 ${y0 - 30} 134 ${y0 + 50} Z M 60 ${y0 + 46} L 140 ${y0 + 46} L 140 ${y0 + 54} L 60 ${y0 + 54} Z`} /> : null}
        {hat === 'cap' ? <path d={`M 66 ${y0 + 40} Q 100 ${y0 + 6} 134 ${y0 + 40} L 150 ${y0 + 46} L 66 ${y0 + 46} Z`} /> : null}
        {/* torso */}
        <path d={`M 62 ${y0 + 90} Q 100 ${y0 + 78} 138 ${y0 + 90} L 146 ${y0 + 230} L 54 ${y0 + 230} Z`} />
        {/* legs */}
        {crouch ? (
          <path d={`M 56 ${y0 + 220} L 150 ${y0 + 220} L 160 ${y0 + 280} L 120 ${y0 + 280} L 112 ${y0 + 250} L 90 ${y0 + 280} L 50 ${y0 + 280} Z`} />
        ) : (
          <>
            <path d={`M 62 225 L 98 225 L ${92 + sw} 400 L ${66 + sw} 400 Z`} />
            <path d={`M 102 225 L 138 225 L ${134 - sw} 400 L ${108 - sw} 400 Z`} />
          </>
        )}
        {/* arms */}
        {pose === 'arms' ? <path d={`M 40 ${y0 + 100} L -60 ${y0 + 96} L -60 ${y0 + 112} L 40 ${y0 + 118} Z M 160 ${y0 + 100} L 260 ${y0 + 96} L 260 ${y0 + 112} L 160 ${y0 + 118} Z M 60 ${y0 + 92} L 140 ${y0 + 92} L 160 ${y0 + 100} L 160 ${y0 + 118} L 40 ${y0 + 118} L 40 ${y0 + 100} Z`} /> : null}
        {pose === 'dig' ? <path d={`M 130 ${y0 + 100} L 200 ${y0 + 170} L 190 ${y0 + 182} L 120 ${y0 + 120} Z M 70 ${y0 + 100} L 160 ${y0 + 190} L 150 ${y0 + 200} L 60 ${y0 + 120} Z`} /> : null}
        {pose === 'shh' ? <path d={`M 132 ${y0 + 100} L 120 ${y0 + 70} L 132 ${y0 + 66} L 146 ${y0 + 100} Z`} /> : null}
        {pose === 'point' ? <path d={`M 136 ${y0 + 100} L 230 ${y0 + 150} L 224 ${y0 + 162} L 130 ${y0 + 120} Z`} /> : null}
        {pose === 'stand' || pose === 'walk' || pose === 'sit' ? (
          <>
            <path d={`M 62 ${y0 + 96} L ${46 - sw * 0.5} ${y0 + 210} L ${60 - sw * 0.5} ${y0 + 212} L 76 ${y0 + 110} Z`} />
            <path d={`M 138 ${y0 + 96} L ${154 + sw * 0.5} ${y0 + 210} L ${140 + sw * 0.5} ${y0 + 212} L 124 ${y0 + 110} Z`} />
          </>
        ) : null}
      </g>
    </svg>
  );
};

/** Round vault door. `open` 0..1 swings it. */
export const VaultDoor: React.FC<{size: number; glow?: number; open?: number}> = ({size, glow = 1, open = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{perspective: 1400, width: size, height: size}}>
      <svg width={size} height={size} viewBox="-200 -200 400 400" style={{overflow: 'visible', transform: `rotateY(${open * -70}deg)`, transformOrigin: '0% 50%', filter: `drop-shadow(0 0 ${30 * glow}px ${RED})`}}>
        <circle r={196} fill={RED} opacity={0.25 * glow * (0.85 + 0.15 * Math.sin(frame / 8))} />
        <circle r={180} fill="#141821" stroke="#2c3442" strokeWidth={10} />
        <circle r={140} fill="#0d1016" stroke="#2c3442" strokeWidth={6} />
        {Array.from({length: 12}, (_, i) => {
          const a = (i * Math.PI) / 6;
          return <circle key={i} cx={Math.cos(a) * 160} cy={Math.sin(a) * 160} r={9} fill="#3a4454" />;
        })}
        <g transform={`rotate(${frame * 0.4})`}>
          {[0, 60, 120].map((a) => (
            <rect key={a} x={-6} y={-90} width={12} height={180} rx={6} fill="#4a5568" transform={`rotate(${a})`} />
          ))}
          <circle r={26} fill="#2c3442" stroke="#5a6678" strokeWidth={6} />
        </g>
      </svg>
    </div>
  );
};

/** Wall of safety deposit boxes. `opened` 0..1 swings box doors open. */
export const Boxes: React.FC<{cols?: number; rows?: number; w: number; opened?: number; lit?: string}> = ({cols = 8, rows = 10, w, opened = 0, lit = BLUE}) => {
  const cw = w / cols;
  return (
    <svg width={w} height={cw * rows * 0.7} viewBox={`0 0 ${w} ${cw * rows * 0.7}`}>
      {Array.from({length: cols * rows}, (_, i) => {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * cw * 0.7;
        const o = opened > rnd(i) ? 1 : 0;
        return (
          <g key={i}>
            <rect x={x + 3} y={y + 3} width={cw - 6} height={cw * 0.7 - 6} fill={o ? '#020203' : '#141c2c'} stroke={lit} strokeOpacity={0.5} strokeWidth={2} />
            {o ? <path d={`M ${x + 3} ${y + 3} L ${x - cw * 0.18} ${y - 4} L ${x - cw * 0.18} ${y + cw * 0.7 + 2} L ${x + 3} ${y + cw * 0.7 - 3} Z`} fill="#22304a" stroke={lit} strokeOpacity={0.6} strokeWidth={2} /> : <circle cx={x + cw / 2} cy={y + cw * 0.35} r={4} fill={lit} opacity={0.8} />}
          </g>
        );
      })}
    </svg>
  );
};

/** Flat London double-decker bus, nose right. */
export const Bus: React.FC<{width: number; color?: string}> = ({width, color = RED}) => (
  <svg width={width} height={width * 0.55} viewBox="0 0 400 220">
    <rect x={10} y={10} width={380} height={180} rx={18} fill={color} />
    {[0, 1].map((r) => Array.from({length: 6}, (_, i) => <rect key={`${r}${i}`} x={30 + i * 58} y={28 + r * 74} width={46} height={44} rx={6} fill={BG} opacity={0.75} />))}
    <circle cx={90} cy={194} r={24} fill={BG} />
    <circle cx={310} cy={194} r={24} fill={BG} />
  </svg>
);

/** Shopfront with a sign. */
export const Shop: React.FC<{w: number; h: number; sign: string; color?: string; glow?: boolean}> = ({w, h, sign, color = BLUE, glow}) => (
  <div style={{width: w, height: h, background: '#0b0f18', border: `4px solid ${color}`, position: 'relative', boxSizing: 'border-box', boxShadow: glow ? `0 0 40px ${color}` : undefined}}>
    <div style={{position: 'absolute', top: 10, left: 10, right: 10, background: color, color: BG, fontFamily: DISPLAY, fontSize: Math.min(46, w / 6), textAlign: 'center', letterSpacing: 2, padding: '4px 0'}}>{sign}</div>
    <div style={{position: 'absolute', bottom: 0, left: '35%', width: '30%', height: '45%', background: '#020204'}} />
  </div>
);

/** Radio wave arcs from (x,y), animating outward. */
export const Waves: React.FC<{x: number; y: number; color?: string; dir?: number; n?: number}> = ({x, y, color = RED, dir = 0, n = 5}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {Array.from({length: n}, (_, i) => {
        const t = ((frame / 40 + i / n) % 1);
        const r = 40 + t * 520;
        return <path key={i} d={`M ${x + r * Math.cos(dir - 0.5)} ${y + r * Math.sin(dir - 0.5)} A ${r} ${r} 0 0 1 ${x + r * Math.cos(dir + 0.5)} ${y + r * Math.sin(dir + 0.5)}`} stroke={color} strokeWidth={8} fill="none" opacity={1 - t} />;
      })}
    </svg>
  );
};

/** Walkie-talkie / radio set. */
export const Walkie: React.FC<{size: number; color?: string}> = ({size, color = INK}) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 100 200">
    <rect x={64} y={0} width={10} height={60} fill={color} />
    <rect x={10} y={50} width={80} height={150} rx={14} fill={color} />
    <rect x={22} y={70} width={56} height={30} rx={4} fill={BLUE} opacity={0.7} />
  </svg>
);

/** Cassette recorder with a pulsing red REC light. */
export const Recorder: React.FC<{width: number; rec: number}> = ({width, rec}) => {
  const frame = useCurrentFrame();
  const spin = rec ? frame * 6 : 0;
  return (
    <svg width={width} height={width * 0.6} viewBox="0 0 500 300">
      <rect x={10} y={10} width={480} height={280} rx={22} fill="#141821" stroke="#2c3442" strokeWidth={6} />
      <rect x={70} y={50} width={360} height={130} rx={12} fill="#0a0c10" stroke={BLUE} strokeWidth={4} />
      {[170, 330].map((cx) => (
        <g key={cx} transform={`rotate(${spin} ${cx} 115)`}>
          <circle cx={cx} cy={115} r={40} fill="#20283a" />
          {[0, 120, 240].map((a) => <rect key={a} x={cx - 4} y={80} width={8} height={30} fill={BLUE} transform={`rotate(${a} ${cx} 115)`} />)}
        </g>
      ))}
      {['◀◀', '▶', '■', '●'].map((s, i) => (
        <g key={s}>
          <rect x={70 + i * 92} y={205} width={80} height={60} rx={8} fill={i === 3 && rec ? RED : '#2c3442'} transform={i === 3 && rec ? 'translate(0 6)' : undefined} />
          <text x={110 + i * 92} y={246} textAnchor="middle" fontSize={28} fill={PAPER} transform={i === 3 && rec ? 'translate(0 6)' : undefined}>
            {s}
          </text>
        </g>
      ))}
      <circle cx={455} cy={40} r={12} fill={RED} opacity={rec ? 0.5 + 0.5 * Math.sin(frame / 4) : 0.15} />
    </svg>
  );
};

/** Big counting number. */
export const Counter: React.FC<{at: number; to: number; dur?: number; suffix?: string; size?: number; color?: string}> = ({at, to, dur = 30, suffix = '', size = 220, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const v = Math.round(to * p(frame, at, dur));
  return <div style={{fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1, textShadow: `0 0 40px ${color}88`}}>{v.toLocaleString('en-US')}{suffix}</div>;
};

/** Small minimal label. */
export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; bg?: string}> = ({children, color = PAPER, size = 44, bg = '#000000cc'}) => (
  <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: size, letterSpacing: 5, color, background: bg, padding: '8px 20px', borderLeft: `6px solid ${RED}`}}>{children}</div>
);

/** Deerstalker + pipe silhouette (Sherlock Holmes nod). */
export const Holmes: React.FC<{size: number; color?: string}> = ({size, color = RED}) => (
  <svg width={size} height={size} viewBox="0 0 300 300">
    <g fill={color}>
      <path d="M 70 150 Q 80 60 150 56 Q 220 60 230 150 Z" />
      <path d="M 40 150 L 260 150 L 250 166 L 50 166 Z" />
      <path d="M 150 56 L 160 30 L 140 30 Z" />
      <ellipse cx={150} cy={206} rx={60} ry={52} />
      <path d="M 196 226 Q 240 236 250 262 L 270 262 L 270 280 L 236 280 Q 226 252 192 244 Z" />
    </g>
  </svg>
);
