// Vintage collage kit (Vox/Fing-style): paper, cut-out archive photos, typewriter, marker, redaction, stamps,
// 12 fps stop-motion jitter and parallax. Reusable for any episode.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {rnd} from '../lib';

export const PAPER = '#ece2cc';
export const PAPER2 = '#d9ccb0';
export const INK = '#1b1712';
export const RED = '#c8102e';
export const YELLOW = '#f6d743';
export const TYPE = '"Special Elite", "Courier New", monospace';
export const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
export const HAND = '"Permanent Marker", cursive';

/** Frame snapped to 12 fps for a stop-motion feel. */
export const useStep = () => Math.floor(useCurrentFrame() / 2.5) * 2.5;
/** Small stop-motion wobble (px / deg) that changes 12x a second. */
export const jitter = (frame: number, seed: number, amt = 2) => {
  const k = Math.floor(frame / 2.5);
  return {x: (rnd(k * 7 + seed) - 0.5) * amt, y: (rnd(k * 13 + seed) - 0.5) * amt, r: (rnd(k * 17 + seed) - 0.5) * amt * 0.3};
};
export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const prog = (frame: number, at: number, dur = 10) => ease((frame - at) / dur);

/** Aged paper background with fibres, stains and vignette. */
export const Paper: React.FC<{tone?: string; dark?: number}> = ({tone = PAPER, dark = 0}) => (
  <AbsoluteFill style={{background: tone}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="paperNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperNoise)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 78% 18%, #8a6a3a22 0 90px, transparent 160px), radial-gradient(circle at 15% 82%, #8a6a3a1c 0 120px, transparent 200px)'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, transparent 45%, rgba(20,12,4,${0.45 + dark}) 100%)`}} />
    {dark > 0 ? <AbsoluteFill style={{background: '#000', opacity: dark}} /> : null}
  </AbsoluteFill>
);

/** Translucent tape strip. */
export const Tape: React.FC<{x: number; y: number; w?: number; r?: number}> = ({x, y, w = 150, r = -8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 42, background: 'rgba(240,232,200,0.72)', boxShadow: '0 2px 4px #0003', transform: `rotate(${r}deg)`, zIndex: 3}} />
);

/** Torn-edge clip polygon (deterministic). */
const torn = (seed: number, n = 26, amt = 1.6) => {
  const pts: string[] = [];
  const side = (fn: (t: number) => [number, number]) => {
    for (let i = 0; i <= n; i++) {
      const [x, y] = fn(i / n);
      pts.push(`${x}% ${y}%`);
    }
  };
  side((t) => [t * 100, rnd(seed + t * 31) * amt]);
  side((t) => [100 - rnd(seed + 7 + t * 29) * amt, t * 100]);
  side((t) => [100 - t * 100, 100 - rnd(seed + 13 + t * 37) * amt]);
  side((t) => [rnd(seed + 19 + t * 41) * amt, 100 - t * 100]);
  return `polygon(${pts.join(',')})`;
};

/** Archive photo printed on paper: white border, torn edge, halftone, tape; slides in stop-motion style. */
export const Cutout: React.FC<{
  src: string; x: number; y: number; w: number; h: number; r?: number; at?: number; seed?: number;
  pos?: string; tone?: 'bw' | 'sepia' | 'color'; tape?: boolean; caption?: string; from?: 'left' | 'right' | 'top' | 'bottom' | 'drop';
}> = ({src, x, y, w, h, r = -2, at = 0, seed = 1, pos = '50% 50%', tone = 'sepia', tape = true, caption, from = 'drop'}) => {
  const frame = useStep();
  if (frame < at) return null;
  const t = prog(frame, at, 8);
  const off = from === 'left' ? [-1200 * (1 - t), 0] : from === 'right' ? [1200 * (1 - t), 0] : from === 'top' ? [0, -1400 * (1 - t)] : from === 'bottom' ? [0, 1400 * (1 - t)] : [0, 0];
  const sc = from === 'drop' ? 1 + 0.25 * (1 - t) : 1;
  const j = jitter(frame, seed, 3);
  const filter = tone === 'bw' ? 'grayscale(1) contrast(1.3)' : tone === 'sepia' ? 'grayscale(1) sepia(0.55) contrast(1.2) brightness(0.95)' : 'saturate(0.8) contrast(1.1)';
  return (
    <div style={{position: 'absolute', left: x + off[0] + j.x, top: y + off[1] + j.y, width: w, height: h + (caption ? 56 : 0), transform: `rotate(${r + j.r}deg) scale(${sc})`, opacity: from === 'drop' ? t : 1, filter: 'drop-shadow(10px 14px 10px rgba(0,0,0,0.45))', zIndex: 2}}>
      <div style={{position: 'absolute', inset: 0, background: '#f7f2e6', clipPath: torn(seed), padding: 16, boxSizing: 'border-box'}}>
        <div style={{position: 'relative', width: '100%', height: h - 32, overflow: 'hidden'}}>
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter}} />
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.22) 1px, transparent 1.4px)', backgroundSize: '5px 5px', mixBlendMode: 'multiply'}} />
        </div>
        {caption ? <div style={{fontFamily: TYPE, fontWeight: 700, fontSize: 30, color: INK, marginTop: 10, textAlign: 'center'}}>{caption}</div> : null}
      </div>
      {tape ? (
        <>
          <Tape x={-30} y={-14} r={-28} w={130} />
          <Tape x={w - 100} y={-10} r={24} w={130} />
        </>
      ) : null}
    </div>
  );
};

/** Plain paper card (index card / note) with optional ruled lines. */
export const Card: React.FC<{x: number; y: number; w: number; h?: number; r?: number; at?: number; seed?: number; ruled?: boolean; bg?: string; children?: React.ReactNode}> = ({x, y, w, h, r = 1, at = 0, seed = 3, ruled, bg = '#f8f3e3', children}) => {
  const frame = useStep();
  if (frame < at) return null;
  const t = prog(frame, at, 7);
  const j = jitter(frame, seed, 2.5);
  return (
    <div style={{position: 'absolute', left: x + j.x, top: y + j.y, width: w, height: h, padding: '22px 28px', boxSizing: 'border-box', background: bg, backgroundImage: ruled ? 'repeating-linear-gradient(transparent 0 46px, #9bb6d655 46px 48px)' : undefined, transform: `rotate(${r + j.r}deg) scale(${1 + 0.2 * (1 - t)})`, opacity: t, boxShadow: '8px 12px 14px rgba(0,0,0,0.35)', zIndex: 2}}>
      {children}
    </div>
  );
};

/** Typewriter text that types itself out, with a blinking caret. */
export const Typed: React.FC<{text: string; at: number; cps?: number; size?: number; color?: string; bold?: boolean; style?: React.CSSProperties}> = ({text, at, cps = 22, size = 40, color = INK, bold = true, style}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at) / 30) * cps)));
  const caret = n < text.length || Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{fontFamily: TYPE, fontWeight: bold ? 700 : 400, fontSize: size, color, whiteSpace: 'pre-wrap', lineHeight: 1.25, ...style}}>
      {text.slice(0, n)}
      <span style={{opacity: caret && frame >= at ? 1 : 0}}>▌</span>
    </div>
  );
};

/** Hand-drawn marker circle around a box (draws on). */
export const Circle: React.FC<{x: number; y: number; w: number; h: number; at: number; color?: string; dur?: number}> = ({x, y, w, h, at, color = RED, dur = 12}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = Math.min(1, (frame - at) / dur);
  const L = Math.PI * (w + h) * 1.1;
  return (
    <svg style={{position: 'absolute', left: x - 20, top: y - 20, overflow: 'visible', zIndex: 4}} width={w + 40} height={h + 40}>
      <path d={`M ${w * 0.55} 12 C ${w + 30} 0, ${w + 40} ${h + 30}, ${w * 0.5} ${h + 32} C 0 ${h + 40}, -6 6, ${w * 0.62} 22`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} opacity={0.9} />
    </svg>
  );
};
/** Marker arrow from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string}> = ({x1, y1, x2, y2, at, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = Math.min(1, (frame - at) / 10);
  const ex = x1 + (x2 - x1) * t;
  const ey = y1 + (y2 - y1) * t;
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 4}} width={1080} height={1920}>
      <path d={`M${x1} ${y1} Q ${(x1 + ex) / 2 + 30} ${(y1 + ey) / 2 - 30} ${ex} ${ey}`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" />
      {t >= 1 ? <path d={`M${x2} ${y2} L${x2 - 40 * Math.cos(a - 0.5)} ${y2 - 40 * Math.sin(a - 0.5)} M${x2} ${y2} L${x2 - 40 * Math.cos(a + 0.5)} ${y2 - 40 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={9} strokeLinecap="round" /> : null}
    </svg>
  );
};
/** Highlighter swipe behind inline text. */
export const Hi: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({at, color = YELLOW, children}) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (frame - at) / 8));
  return (
    <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundSize: `${t * 100}% 70%`, backgroundPosition: '0 80%', padding: '0 4px'}}>{children}</span>
  );
};
/** Black redaction bar that slides across. */
export const Redact: React.FC<{at: number; w: number; h?: number}> = ({at, w, h = 36}) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (frame - at) / 6));
  return <span style={{display: 'inline-block', width: w * t, height: h, background: INK, verticalAlign: 'middle'}} />;
};
/** Rubber stamp. */
export const Stamp: React.FC<{at: number; x: number; y: number; size?: number; r?: number; color?: string; children: React.ReactNode}> = ({at, x, y, size = 80, r = -10, color = RED, children}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = Math.min(1, (frame - at) / 5);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${1.6 - 0.6 * t})`, opacity: 0.88 * t, fontFamily: TYPE, fontWeight: 900, fontSize: size, letterSpacing: 4, color, border: `8px solid ${color}`, padding: '4px 22px', whiteSpace: 'nowrap', mixBlendMode: 'multiply', zIndex: 5, maskImage: 'radial-gradient(circle at 30% 40%, #000 60%, #0008 75%, #000 90%)'}}>
      {children}
    </div>
  );
};
/** Newspaper-style headline label. */
export const Headline: React.FC<{at: number; until?: number; top?: number; size?: number; children: React.ReactNode; color?: string; bg?: string}> = ({at, until = 1e9, top = 160, size = 86, children, color = INK, bg = '#f8f3e3'}) => {
  const frame = useStep();
  if (frame < at || frame >= until) return null;
  const t = prog(frame, at, 6);
  const j = jitter(frame, 99, 2);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: top + j.y, display: 'flex', justifyContent: 'center', zIndex: 6, opacity: t, transform: `translateY(${(1 - t) * -30}px) rotate(${-1 + j.r}deg)`}}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, background: bg, padding: '10px 26px 14px', textAlign: 'center', boxShadow: '8px 10px 0 rgba(0,0,0,0.35)', textTransform: 'uppercase'}}>{children}</div>
    </div>
  );
};
/** Film grain + flicker overlay. */
export const Grain: React.FC = () => {
  const frame = useStep();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.09 + 0.03 * Math.sin(frame), backgroundImage: 'radial-gradient(#000 1px, transparent 1.3px)', backgroundSize: '4px 4px', backgroundPosition: `${(frame * 7) % 4}px ${(frame * 3) % 4}px`}} />
  );
};
/** Slow camera push (applied to a whole layer), quantized to 12 fps. */
export const Push: React.FC<{from?: number; to?: number; dur: number; x?: number; y?: number; children: React.ReactNode}> = ({from = 1, to = 1.08, dur, x = 0, y = 0, children}) => {
  const frame = useStep();
  const t = Math.min(1, frame / Math.max(1, dur));
  return <AbsoluteFill style={{transform: `translate(${x * t}px, ${y * t}px) scale(${from + (to - from) * t})`}}>{children}</AbsoluteFill>;
};

/** Paper-cut silhouette of a 1970s woman (coat, scarf, handbag). */
export const Woman: React.FC<{h: number; color?: string; q?: boolean}> = ({h, color = INK, q}) => (
  <svg width={h * 0.5} height={h} viewBox="0 0 200 400" style={{overflow: 'visible', filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.25))'}}>
    <g fill={color}>
      <path d="M100 8 C130 8 140 30 138 52 C150 60 150 82 136 90 C132 108 118 118 100 118 C82 118 68 108 64 90 C50 82 50 60 62 52 C60 30 70 8 100 8 Z" />
      <path d="M78 116 L122 116 L128 134 L72 134 Z" />
      <path d="M60 132 Q100 120 140 132 L158 300 Q100 312 42 300 Z" />
      <path d="M58 140 L34 250 L48 254 L72 152 Z M142 140 L170 236 L156 242 L128 152 Z" />
      <rect x={150} y={232} width={34} height={30} rx={4} />
      <rect x={80} y={298} width={14} height={92} />
      <rect x={106} y={298} width={14} height={92} />
    </g>
    {q ? <text x={100} y={90} textAnchor="middle" fontFamily={HAND} fontSize={80} fill={RED}>?</text> : null}
  </svg>
);
