import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DISPLAY, W, lerp, p, rnd} from '../lib';

// 1930s noir: black, warm lamp amber, blood red, paper cream.
export const BG = '#060505';
export const AMBER = '#f0b24a';
export const RED = '#c8102e';
export const CREAM = '#efe4cc';
export const WOOD = '#2a1a10';
export const DIM = '#1a1410';

/** Warm lamp-light pool. */
export const Lamp: React.FC<{x: number; y: number; r?: number; on?: number}> = ({x, y, r = 520, on = 1}) => {
  const frame = useCurrentFrame();
  const fl = 0.92 + 0.08 * Math.sin(frame / 5) * (rnd(Math.floor(frame / 6)) > 0.9 ? 2 : 1);
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${x}px ${y}px, ${AMBER}${Math.round(0x55 * on * fl).toString(16).padStart(2, '0')} 0%, transparent ${r / 19.2}%)`, pointerEvents: 'none'}} />;
};

/** Art-deco hotel tower with a grid of windows; `lit` = index of the highlighted window. */
export const Hotel: React.FC<{width: number; lit?: number; glow?: number}> = ({width, lit = -1, glow = 1}) => {
  const frame = useCurrentFrame();
  const cols = 6;
  const rows = 14;
  return (
    <svg width={width} height={width * 2.1} viewBox="0 0 400 840">
      <path d="M 60 840 L 60 120 L 120 90 L 120 40 L 200 0 L 280 40 L 280 90 L 340 120 L 340 840 Z" fill="#14100c" stroke="#3a2a1a" strokeWidth={4} />
      <rect x={150} y={60} width={100} height={30} fill={AMBER} opacity={0.6} />
      <text x={200} y={82} textAnchor="middle" fontFamily={DISPLAY} fontSize={20} fill={BG}>PRESIDENT</text>
      {Array.from({length: cols * rows}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const on = i === lit;
        const warm = rnd(i + 3) > 0.7;
        return <rect key={i} x={80 + c * 42} y={150 + r * 48} width={26} height={32} fill={on ? AMBER : warm ? '#6a4a20' : '#0a0806'} opacity={on ? 0.6 + 0.4 * glow * (0.85 + 0.15 * Math.sin(frame / 4)) : 1} style={on ? {filter: `drop-shadow(0 0 12px ${AMBER})`} : undefined} />;
      })}
    </svg>
  );
};

/** Hotel room door with the 1046 plate. `open` swings it. */
export const Door: React.FC<{height: number; open?: number; knock?: number; light?: number}> = ({height, open = 0, knock = 0, light = 0}) => (
  <div style={{position: 'relative', width: height * 0.5, height, perspective: 1600}}>
    <div style={{position: 'absolute', inset: 0, background: light ? `radial-gradient(circle, ${RED}, #2a0008 80%)` : '#000', opacity: light ? light : 1}} />
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${WOOD}, #3a2414 50%, ${WOOD})`, border: '10px solid #1a0f08', boxSizing: 'border-box', transform: `rotateY(${-open * 80}deg) translateX(${Math.sin(knock * 40) * 4 * knock}px)`, transformOrigin: '0% 50%', boxShadow: '0 30px 60px #000'}}>
      {[0.12, 0.55].map((t) => <div key={t} style={{position: 'absolute', left: '14%', right: '14%', top: `${t * 100}%`, height: '33%', border: '6px solid #1a0f08'}} />)}
      <div style={{position: 'absolute', top: '6%', left: '30%', right: '30%', background: '#c9a24a', border: '3px solid #6a4a10', textAlign: 'center', fontFamily: DISPLAY, fontSize: height * 0.06, color: '#1a0f08'}}>1046</div>
      <div style={{position: 'absolute', right: '10%', top: '52%', width: height * 0.035, height: height * 0.035, borderRadius: '50%', background: '#c9a24a'}} />
    </div>
  </div>
);

/** 1930s candlestick telephone. `off` lifts the receiver off the hook. */
export const Phone: React.FC<{size: number; off?: number; ring?: boolean}> = ({size, off = 0, ring}) => {
  const frame = useCurrentFrame();
  const shake = ring ? Math.sin(frame * 2) * 3 : 0;
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{overflow: 'visible', transform: `rotate(${shake}deg)`}}>
      <ellipse cx={100} cy={262} rx={70} ry={16} fill="#0a0806" />
      <rect x={88} y={70} width={24} height={190} fill="#111" />
      <ellipse cx={100} cy={70} rx={30} ry={14} fill="#1a1a1a" />
      <path d="M 82 50 Q 100 30 118 50 L 112 70 L 88 70 Z" fill="#1a1a1a" />
      <g transform={`translate(${off * 80} ${off * 120}) rotate(${off * 70} 150 80)`}>
        <rect x={140} y={60} width={16} height={70} rx={6} fill="#111" />
        <ellipse cx={148} cy={58} rx={16} ry={10} fill="#1a1a1a" />
      </g>
      <path d={`M 112 200 Q ${150 + off * 40} ${230} ${148 + off * 80} ${130 + off * 120}`} stroke="#111" strokeWidth={4} fill="none" />
    </svg>
  );
};

/** Paper note with typed / hand-written text. */
export const Note: React.FC<{width: number; children: React.ReactNode; rotate?: number; hand?: boolean}> = ({width, children, rotate = -3, hand}) => (
  <div style={{width, background: `linear-gradient(180deg, ${CREAM}, #d9cba8)`, padding: '40px 44px', boxSizing: 'border-box', boxShadow: '0 30px 60px #000', transform: `rotate(${rotate}deg)`, fontFamily: hand ? '"Brush Script MT", "Segoe Script", cursive' : '"Courier New", monospace', fontWeight: hand ? 400 : 700, color: '#1a1208', fontSize: hand ? 64 : 44, lineHeight: 1.3}}>{children}</div>
);

/** Window with roller shade (pulled = 0..1). */
export const Shade: React.FC<{w: number; h: number; pulled: number}> = ({w, h, pulled}) => (
  <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(180deg, #3a5a7a, #1a2a3a)', border: `12px solid ${WOOD}`, boxSizing: 'border-box', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${pulled * 100}%`, background: 'linear-gradient(180deg, #8a6a3a, #5a4420)'}} />
    <div style={{position: 'absolute', left: '45%', width: 20, height: 20, borderRadius: 10, top: `calc(${pulled * 100}% - 10px)`, background: '#c9a24a'}} />
  </div>
);

/** Simple bed seen from the side. */
export const Bed: React.FC<{width: number}> = ({width}) => (
  <svg width={width} height={width * 0.45} viewBox="0 0 500 225">
    <rect x={10} y={20} width={30} height={200} fill={WOOD} />
    <rect x={460} y={80} width={30} height={140} fill={WOOD} />
    <rect x={30} y={110} width={450} height={60} fill="#e8dcc0" />
    <rect x={30} y={150} width={450} height={30} fill="#b8a888" />
    <ellipse cx={90} cy={100} rx={50} ry={20} fill="#f4ecd8" />
  </svg>
);

/** Typed letter card flying in. */
export const Letter: React.FC<{show: number; x: number; y: number; r: number}> = ({show, x, y, r}) => (
  <div style={{position: 'absolute', left: lerp(x + 400, x, show), top: lerp(y - 300, y, show), opacity: show, transform: `rotate(${lerp(r + 30, r, show)}deg)`, width: 360, height: 260, background: CREAM, boxShadow: '0 20px 40px #000', padding: 24, boxSizing: 'border-box'}}>
    {Array.from({length: 6}, (_, i) => <div key={i} style={{height: 8, background: '#8a7a5a', margin: '14px 0', width: `${60 + rnd(i + x) * 40}%`}} />)}
    <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 26, color: '#1a1208', textAlign: 'right'}}>— ARTEMUS</div>
  </div>
);

/** Fingerprint glyph. */
export const Print: React.FC<{size: number; color?: string}> = ({size, color = AMBER}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    {Array.from({length: 8}, (_, i) => (
      <ellipse key={i} cx={50} cy={65} rx={8 + i * 5.5} ry={12 + i * 6.5} fill="none" stroke={color} strokeWidth={3} strokeDasharray={`${20 + i * 6} ${4 + (i % 3) * 3}`} />
    ))}
  </svg>
);

/** Bouquet with a small card. */
export const Flowers: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      {Array.from({length: 14}, (_, i) => {
        const a = (i / 14) * Math.PI - Math.PI;
        const x = 200 + Math.cos(a) * (80 + (i % 3) * 30);
        const y = 180 + Math.sin(a) * (90 + (i % 3) * 20) + Math.sin(frame / 20 + i) * 3;
        return (
          <g key={i}>
            <line x1={200} y1={360} x2={x} y2={y} stroke="#2a4a20" strokeWidth={5} />
            <circle cx={x} cy={y} r={26} fill={i % 3 ? '#e8e0d0' : RED} />
            <circle cx={x} cy={y} r={9} fill={i % 3 ? AMBER : '#5a0010'} />
          </g>
        );
      })}
      <path d="M 150 300 L 250 300 L 230 390 L 170 390 Z" fill="#3a2a1a" />
    </svg>
  );
};

export const Typewriter: React.FC<{text: string; at: number; cps?: number; size?: number; color?: string}> = ({text, at, cps = 20, size = 52, color = '#1a1208'}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - at) / 30) * cps));
  return (
    <span style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: size, color, whiteSpace: 'pre-wrap'}}>
      {text.slice(0, n)}
      <span style={{opacity: Math.floor(frame / 8) % 2 ? 1 : 0}}>▌</span>
    </span>
  );
};

/** Big red cord loops (abstract, non-graphic). */
export const Cord: React.FC<{show: number}> = ({show}) => (
  <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
    {[380, 620, 860].map((y, k) => (
      <path key={y} d={`M -40 ${y} C 300 ${y - 120} 780 ${y + 120} 1120 ${y}`} stroke={RED} strokeWidth={14} fill="none" strokeDasharray="2000" strokeDashoffset={2000 * (1 - Math.max(0, Math.min(1, show * 3 - k)))} style={{filter: `drop-shadow(0 0 12px ${RED})`}} />
    ))}
  </svg>
);

export const pIn = p;
