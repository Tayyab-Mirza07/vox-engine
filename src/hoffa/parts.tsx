import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DISPLAY, W, lerp, rnd} from '../lib';

export const RED = '#e63946';
export const GOLD = '#f2b632';
export const INK = '#06080c';

/** 1970s full-size sedan, side view, nose right. 600×200 box. */
export const Sedan: React.FC<{width: number; color?: string; lights?: number; door?: number; glow?: string}> = ({width, color = '#2f5a3a', lights = 0, door = 0, glow}) => (
  <svg width={width} height={(width * 200) / 600} viewBox="0 0 600 200" style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 30px ${glow})` : 'drop-shadow(0 20px 20px #000)'}}>
    <defs>
      <linearGradient id={`body${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
        <stop offset="40%" stopColor={color} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <ellipse cx={300} cy={178} rx={290} ry={14} fill="#000" opacity={0.5} />
    <path d="M 10 130 L 20 96 Q 30 86 70 84 L 170 80 L 220 34 Q 232 24 260 24 L 390 24 Q 410 24 424 36 L 470 80 L 560 86 Q 592 92 594 120 L 594 150 L 10 150 Z" fill={`url(#body${color})`} stroke="#000" strokeWidth={3} />
    <path d="M 232 40 L 300 40 L 300 80 L 196 80 Z" fill="#9fb4c8" opacity={0.55} />
    <path d="M 312 40 L 400 40 Q 410 40 418 48 L 448 80 L 312 80 Z" fill="#9fb4c8" opacity={0.55} />
    <line x1={10} y1={112} x2={594} y2={112} stroke="#d9dde2" strokeWidth={3} opacity={0.7} />
    {/* door ajar */}
    <g transform={`translate(${300 + door * 40} 0) skewY(${door * -8})`} opacity={door > 0 ? 1 : 0}>
      <rect x={0} y={40} width={120} height={108} fill={color} stroke="#000" strokeWidth={3} />
    </g>
    <circle cx={140} cy={150} r={34} fill="#111" stroke="#333" strokeWidth={6} />
    <circle cx={140} cy={150} r={14} fill="#9aa3ad" />
    <circle cx={480} cy={150} r={34} fill="#111" stroke="#333" strokeWidth={6} />
    <circle cx={480} cy={150} r={14} fill="#9aa3ad" />
    <rect x={580} y={104} width={14} height={16} rx={4} fill="#fff6c8" opacity={0.4 + lights * 0.6} />
    {lights > 0 ? <path d="M 594 112 L 900 60 L 900 170 Z" fill="#fff6c8" opacity={0.18 * lights} /> : null}
    <rect x={8} y={104} width={10} height={16} rx={3} fill={RED} opacity={0.5 + lights * 0.5} />
  </svg>
);

/** Semi truck, side view, nose right. 700×260 box. */
export const Truck: React.FC<{width: number; color?: string}> = ({width, color = '#c33b2f'}) => (
  <svg width={width} height={(width * 260) / 700} viewBox="0 0 700 260" style={{overflow: 'visible', filter: 'drop-shadow(0 18px 18px #000)'}}>
    <rect x={10} y={30} width={470} height={170} rx={6} fill="#d8dcdf" stroke="#6d7680" strokeWidth={4} />
    {Array.from({length: 9}, (_, i) => <line key={i} x1={60 + i * 50} y1={34} x2={60 + i * 50} y2={196} stroke="#9aa3ad" strokeWidth={2} />)}
    <path d="M 490 200 L 490 80 Q 490 60 512 60 L 600 60 Q 640 60 660 110 L 690 140 L 690 200 Z" fill={color} stroke="#000" strokeWidth={4} />
    <path d="M 520 74 L 596 74 Q 622 74 636 110 L 520 110 Z" fill="#9fb4c8" opacity={0.7} />
    <rect x={500} y={20} width={12} height={60} fill="#888" />
    {[90, 160, 400, 450, 600].map((x) => (
      <g key={x}>
        <circle cx={x} cy={210} r={30} fill="#111" stroke="#2a2a2a" strokeWidth={6} />
        <circle cx={x} cy={210} r={11} fill="#9aa3ad" />
      </g>
    ))}
  </svg>
);

/** Street pay phone on a post, with the receiver hanging when `hang` > 0. */
export const Payphone: React.FC<{size: number; hang?: number}> = ({size, hang = 0}) => {
  const frame = useCurrentFrame();
  const swing = hang * Math.sin(frame / 6) * 18;
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 200 360" style={{overflow: 'visible', filter: 'drop-shadow(0 20px 30px #000)'}}>
      <rect x={92} y={210} width={16} height={150} fill="#4a525c" />
      <rect x={20} y={10} width={160} height={210} rx={14} fill="#3a5b8a" stroke="#1b2a40" strokeWidth={6} />
      <rect x={40} y={30} width={120} height={26} rx={4} fill="#f2f2f2" />
      <text x={100} y={50} textAnchor="middle" fontFamily={DISPLAY} fontSize={20} fill="#1b2a40">
        TELEPHONE
      </text>
      <rect x={56} y={74} width={88} height={70} rx={6} fill="#c9ced4" />
      {Array.from({length: 12}, (_, i) => <circle key={i} cx={72 + (i % 3) * 28} cy={86 + Math.floor(i / 3) * 16} r={5} fill="#333" />)}
      <rect x={70} y={156} width={60} height={14} rx={4} fill="#222" />
      <g transform={`rotate(${hang ? swing : 0} 30 100)`}>
        <path d={hang ? 'M 30 100 Q 20 180 34 250' : 'M 30 100 Q 10 120 26 150'} stroke="#111" strokeWidth={5} fill="none" />
        <rect x={hang ? 16 : 6} y={hang ? 240 : 70} width={30} height={hang ? 70 : 110} rx={12} fill="#111" />
      </g>
    </svg>
  );
};

/** Night parking lot seen at an angle: asphalt, painted bays, two sodium lamps. Fills the frame. */
export const Lot: React.FC<{lamp?: number; day?: number}> = ({lamp = 1, day = 0}) => {
  const frame = useCurrentFrame();
  const sky = day ? 'linear-gradient(180deg, #7d9ab8 0%, #c8b48f 46%, #3b3f44 47%, #23262a 100%)' : 'linear-gradient(180deg, #05070c 0%, #0e1622 45%, #1a1d22 46%, #0c0e11 100%)';
  return (
    <div style={{position: 'absolute', inset: 0, background: sky, overflow: 'hidden'}}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 9}, (_, i) => {
          const x = -400 + i * 230;
          return <line key={i} x1={540 + (x - 540) * 0.25} y1={900} x2={x} y2={1920} stroke="#e8e2c8" strokeWidth={6} opacity={0.35} />;
        })}
        <line x1={0} y1={1100} x2={W} y2={1100} stroke="#e8e2c8" strokeWidth={5} opacity={0.2} />
        {[170, 910].map((x, k) => (
          <g key={x}>
            <rect x={x - 6} y={420} width={12} height={500} fill="#2a2e34" />
            <rect x={x - 50} y={410} width={100} height={18} rx={6} fill="#3a3f46" />
            {lamp > 0 && !day ? (
              <>
                <path d={`M ${x - 40} 428 L ${x - 260} 1300 L ${x + 260} 1300 L ${x + 40} 428 Z`} fill="#ffcf73" opacity={0.08 * lamp * (0.9 + 0.1 * Math.sin(frame / (5 + k)))} />
                <ellipse cx={x} cy={1250} rx={300} ry={70} fill="#ffcf73" opacity={0.1 * lamp} />
                <circle cx={x} cy={430} r={20} fill="#fff1c4" opacity={lamp} style={{filter: 'blur(4px)'}} />
              </>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
};

/** Restaurant facade with a neon sign (generic, drawn). */
export const Restaurant: React.FC<{width: number; neon?: number}> = ({width, neon = 1}) => {
  const frame = useCurrentFrame();
  const on = neon * (frame % 50 < 3 ? 0.4 : 1);
  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 800 440" style={{overflow: 'visible'}}>
      <rect x={40} y={140} width={720} height={300} fill="#3a2a22" stroke="#1a120e" strokeWidth={6} />
      <path d="M 20 150 L 400 60 L 780 150 Z" fill="#241913" />
      {Array.from({length: 5}, (_, i) => <rect key={i} x={80 + i * 140} y={220} width={100} height={110} fill="#ffcf73" opacity={0.45} stroke="#1a120e" strokeWidth={6} />)}
      <rect x={360} y={350} width={80} height={90} fill="#120c09" />
      <rect x={210} y={20} width={380} height={90} rx={14} fill="#1a0608" stroke={RED} strokeWidth={6} opacity={0.9} />
      <text x={400} y={84} textAnchor="middle" fontFamily={DISPLAY} fontSize={56} letterSpacing={6} fill={RED} opacity={on} style={{filter: `drop-shadow(0 0 ${12 * on}px ${RED})`}}>
        RED FOX
      </text>
    </svg>
  );
};

/** Vintage console TV with the given content inside the screen. */
export const TV: React.FC<{width: number; children: React.ReactNode}> = ({width, children}) => {
  const frame = useCurrentFrame();
  const h = width * 0.82;
  return (
    <div style={{position: 'relative', width, height: h, background: 'linear-gradient(180deg, #5a3a22, #3a2414)', borderRadius: 30, padding: width * 0.06, boxSizing: 'border-box', boxShadow: '0 40px 80px #000'}}>
      <div style={{position: 'relative', width: '78%', height: '100%', borderRadius: 40, overflow: 'hidden', background: '#111', boxShadow: 'inset 0 0 60px #000'}}>
        {children}
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, #00000044 0 3px, transparent 3px 6px)', opacity: 0.8}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, #000000aa 100%)'}} />
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.04 + rnd(frame) * 0.05}} />
      </div>
      {[0.25, 0.5].map((y) => <div key={y} style={{position: 'absolute', right: width * 0.06, top: h * y, width: width * 0.1, height: width * 0.1, borderRadius: '50%', background: '#c9b48a', border: '6px solid #2a1a0e'}} />)}
    </div>
  );
};

/** Shadowy man in a fedora (for unnamed mob figures). */
export const Fedora: React.FC<{size: number; color?: string}> = ({size, color = '#05070b'}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{overflow: 'visible'}}>
    <path d="M 20 280 Q 20 170 100 160 Q 180 170 180 280 Z" fill={color} />
    <ellipse cx={100} cy={112} rx={42} ry={50} fill={color} />
    <ellipse cx={100} cy={74} rx={86} ry={14} fill={color} />
    <path d="M 56 74 Q 58 22 100 20 Q 142 22 144 74 Z" fill={color} />
    <rect x={58} y={58} width={84} height={10} fill="#2a2f38" />
  </svg>
);

/** Shovel digging into a dirt mound. `dig` 0..1 drives one stroke. */
export const Dig: React.FC<{width: number; dig: number; color?: string}> = ({width, dig, color = '#4a3424'}) => {
  const a = Math.sin(dig * Math.PI * 2);
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 500 350" style={{overflow: 'visible'}}>
      <path d="M 0 350 Q 120 220 250 230 Q 380 220 500 350 Z" fill={color} />
      {Array.from({length: 14}, (_, i) => <circle key={i} cx={60 + rnd(i) * 380} cy={280 + rnd(i + 5) * 60} r={4 + rnd(i + 2) * 8} fill="#2c1f15" />)}
      {Array.from({length: 8}, (_, i) => {
        const t = (dig * 2 + i * 0.12) % 1;
        return <circle key={`c${i}`} cx={300 + t * 160 + i * 6} cy={240 - Math.sin(t * Math.PI) * 120} r={6 + (i % 3) * 3} fill={color} opacity={dig > 0 ? 1 - t : 0} />;
      })}
      <g transform={`translate(270 ${200 - a * 30}) rotate(${-30 + a * 25})`}>
        <rect x={-6} y={-220} width={12} height={220} rx={5} fill="#8a6238" />
        <rect x={-22} y={-236} width={44} height={16} rx={6} fill="#5a3e22" />
        <path d="M -30 0 L 30 0 L 26 60 Q 0 80 -26 60 Z" fill="#9aa3ad" stroke="#4a525c" strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Rotating DNA double helix. */
export const Helix: React.FC<{height: number; color?: string; color2?: string}> = ({height, color = '#4da3ff', color2 = RED}) => {
  const frame = useCurrentFrame();
  const n = 18;
  return (
    <svg width={260} height={height} viewBox={`0 0 260 ${height}`}>
      {Array.from({length: n}, (_, i) => {
        const y = 20 + (i * (height - 40)) / (n - 1);
        const ph = frame / 10 + i * 0.6;
        const x1 = 130 + Math.sin(ph) * 100;
        const x2 = 130 - Math.sin(ph) * 100;
        const z = Math.cos(ph);
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#9fb4cf" strokeWidth={4} opacity={0.4} />
            <circle cx={x1} cy={y} r={10 + z * 3} fill={color} opacity={0.6 + z * 0.4} />
            <circle cx={x2} cy={y} r={10 - z * 3} fill={color2} opacity={0.6 - z * 0.4} />
          </g>
        );
      })}
    </svg>
  );
};

/** Paw prints walking along a path (progress 0..1). */
export const Paws: React.FC<{show: number; from: [number, number]; to: [number, number]}> = ({show, from, to}) => (
  <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 10}, (_, i) => {
      const t = i / 9;
      if (t > show) return null;
      const x = lerp(from[0], to[0], t) + (i % 2 ? 22 : -22);
      const y = lerp(from[1], to[1], t);
      return (
        <g key={i} transform={`translate(${x} ${y})`} opacity={0.9}>
          <ellipse cx={0} cy={8} rx={14} ry={11} fill={GOLD} />
          {[-14, -5, 5, 14].map((dx) => <circle key={dx} cx={dx} cy={-10 - Math.abs(dx) * -0.2} r={5} fill={GOLD} />)}
        </g>
      );
    })}
  </svg>
);

/** Steel truss bridge silhouette. */
export const Bridge: React.FC<{width: number}> = ({width}) => (
  <svg width={width} height={width * 0.35} viewBox="0 0 1000 350">
    <rect x={0} y={200} width={1000} height={24} fill="#1c2430" />
    {Array.from({length: 10}, (_, i) => (
      <g key={i} stroke="#2e3a4a" strokeWidth={10}>
        <line x1={i * 100} y1={200} x2={i * 100 + 50} y2={90} />
        <line x1={i * 100 + 50} y1={90} x2={i * 100 + 100} y2={200} />
      </g>
    ))}
    <rect x={0} y={84} width={1000} height={14} fill="#2e3a4a" />
    {[150, 500, 850].map((x) => <rect key={x} x={x - 22} y={224} width={44} height={126} fill="#1c2430" />)}
  </svg>
);

/** Stadium bowl silhouette with light towers. */
export const Stadium: React.FC<{width: number}> = ({width}) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 600 300">
    <path d="M 20 260 Q 300 120 580 260 L 580 290 L 20 290 Z" fill="#1c2430" />
    <path d="M 60 250 Q 300 150 540 250" stroke="#4a5a70" strokeWidth={6} fill="none" />
    {[90, 510].map((x) => (
      <g key={x}>
        <rect x={x - 4} y={60} width={8} height={200} fill="#2e3a4a" />
        <rect x={x - 30} y={40} width={60} height={26} fill="#fff6c8" style={{filter: 'drop-shadow(0 0 20px #fff6c8)'}} />
      </g>
    ))}
  </svg>
);

/** Hydraulic car crusher. `press` 0..1 lowers the plate. */
export const Crusher: React.FC<{width: number; press: number}> = ({width, press}) => (
  <svg width={width} height={width * 0.8} viewBox="0 0 500 400">
    <rect x={40} y={20} width={30} height={360} fill="#4a525c" />
    <rect x={430} y={20} width={30} height={360} fill="#4a525c" />
    <rect x={40} y={10} width={420} height={30} fill="#f2b632" />
    <rect x={100} y={40} width={20} height={lerp(40, 190, press)} fill="#9aa3ad" />
    <rect x={380} y={40} width={20} height={lerp(40, 190, press)} fill="#9aa3ad" />
    <rect x={70} y={lerp(80, 230, press)} width={360} height={30} fill="#f2b632" stroke="#000" strokeWidth={3} />
    <rect x={90} y={lerp(260, 300, press)} width={320} height={lerp(100, 60, press)} rx={8} fill="#7a2a2a" stroke="#000" strokeWidth={3} />
    <rect x={40} y={360} width={420} height={20} fill="#2e3a4a" />
  </svg>
);

/** Furnace door with fire glow. */
export const Furnace: React.FC<{width: number}> = ({width}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={width * 0.9} viewBox="0 0 400 360">
      <rect x={20} y={20} width={360} height={340} rx={20} fill="#2a2e34" stroke="#111" strokeWidth={6} />
      <rect x={90} y={120} width={220} height={160} rx={14} fill="#120806" />
      {Array.from({length: 7}, (_, i) => {
        const hgt = 60 + Math.abs(Math.sin(frame / 4 + i)) * 70;
        return <path key={i} d={`M ${100 + i * 30} 280 Q ${115 + i * 30} ${280 - hgt} ${130 + i * 30} 280 Z`} fill={i % 2 ? '#ff8a2a' : '#ffd24a'} opacity={0.9} />;
      })}
      <rect x={90} y={120} width={220} height={160} rx={14} fill="none" stroke="#5a5f66" strokeWidth={10} />
    </svg>
  );
};

/** Flip-calendar page. */
export const Calendar: React.FC<{month: string; day: string; year: string; flip?: number}> = ({month, day, year, flip = 1}) => (
  <div style={{perspective: 1200}}>
    <div style={{width: 520, background: '#f4efe4', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 80px #000', transform: `rotateX(${lerp(-90, 0, flip)}deg)`, transformOrigin: '50% 0%'}}>
      <div style={{background: RED, color: '#fff', fontFamily: DISPLAY, fontSize: 70, textAlign: 'center', padding: '10px 0', letterSpacing: 6}}>{month}</div>
      <div style={{fontFamily: DISPLAY, fontSize: 280, textAlign: 'center', color: INK, lineHeight: 1.1}}>{day}</div>
      <div style={{fontFamily: DISPLAY, fontSize: 70, textAlign: 'center', color: '#555', paddingBottom: 18, letterSpacing: 8}}>{year}</div>
    </div>
  </div>
);

/** Analog wall clock. */
export const Clock: React.FC<{size: number; minutes: number}> = ({size, minutes}) => {
  const h = ((minutes / 60) % 12) * 30;
  const m = (minutes % 60) * 6;
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220" style={{filter: 'drop-shadow(0 20px 30px #000)'}}>
      <circle r={104} fill="#f4efe4" stroke="#2a2e34" strokeWidth={10} />
      {Array.from({length: 12}, (_, i) => (
        <line key={i} x1={0} y1={-86} x2={0} y2={-74} stroke="#222" strokeWidth={i % 3 ? 3 : 7} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={8} x2={0} y2={-48} stroke="#111" strokeWidth={9} strokeLinecap="round" transform={`rotate(${h})`} />
      <line x1={0} y1={12} x2={0} y2={-76} stroke="#111" strokeWidth={5} strokeLinecap="round" transform={`rotate(${m})`} />
      <circle r={7} fill={RED} />
    </svg>
  );
};
