import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/permanent-marker/400.css';
import {DISPLAY, W, lerp, p, rnd} from '../lib';
import {has} from '../motion';

export const RED = '#d7263d';
export const STRING = '#c1121f';
export const CORK = '#6b4a2b';
export const PAPER = '#f2ead8';
export const INK = '#15110c';
export const MARKER = '"Permanent Marker", cursive';

/** Cork evidence board filling the frame, with a soft desk-lamp pool and vignette. */
export const Board: React.FC<{light?: [number, number]; dim?: number}> = ({light = [0.5, 0.35], dim = 0}) => (
  <AbsoluteFill style={{background: CORK, overflow: 'hidden'}}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(#00000022 1.5px, transparent 1.6px), radial-gradient(#ffffff14 1px, transparent 1.2px), radial-gradient(#3a240f33 2px, transparent 2.2px)`,
        backgroundSize: '9px 9px, 13px 13px, 23px 23px',
        backgroundPosition: '0 0, 4px 6px, 11px 3px',
      }}
    />
    <AbsoluteFill style={{background: `radial-gradient(circle at ${light[0] * 100}% ${light[1] * 100}%, #ffd8a033 0%, transparent 45%), radial-gradient(circle at 50% 50%, transparent 30%, #000000e0 100%)`}} />
    {dim > 0 ? <AbsoluteFill style={{background: '#000', opacity: dim}} /> : null}
  </AbsoluteFill>
);

/** A push pin. */
export const Pin: React.FC<{color?: string}> = ({color = RED}) => (
  <div style={{position: 'absolute', top: -14, left: '50%', marginLeft: -14, width: 28, height: 28, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #fff8, ${color} 45%, #3a0008)`, boxShadow: '0 6px 8px #000a', zIndex: 3}} />
);

/** Polaroid pinned to the board. `show` 0..1 drops it in. */
export const Polaroid: React.FC<{src?: string; w: number; h: number; x: number; y: number; r?: number; show?: number; caption?: string; fit?: 'cover' | 'contain'; pos?: string; children?: React.ReactNode; gray?: number}> = ({src, w, h, x, y, r = 0, show = 1, caption, fit = 'cover', pos = '50% 50%', children, gray = 0.2}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, show * 2), transform: `rotate(${r + (1 - show) * 12}deg) scale(${lerp(1.25, 1, show)}) translateY(${(1 - show) * -60}px)`, background: PAPER, padding: 16, paddingBottom: caption ? 70 : 16, boxShadow: '0 18px 30px #000c', boxSizing: 'border-box'}}>
    <Pin />
    <div style={{width: '100%', height: h, background: '#1a1410', overflow: 'hidden', position: 'relative'}}>
      {src && has(src) ? <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, objectPosition: pos, filter: `grayscale(${gray}) contrast(1.1) sepia(0.2)`}} /> : null}
      {children}
    </div>
    {caption ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: MARKER, fontSize: 36, color: INK}}>{caption}</div> : null}
  </div>
);

/** Paper note / index card with marker text. */
export const Card: React.FC<{x: number; y: number; w: number; r?: number; show?: number; children: React.ReactNode; color?: string; bg?: string; size?: number}> = ({x, y, w, r = 0, show = 1, children, color = INK, bg = PAPER, size = 48}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, show * 2), transform: `rotate(${r}deg) scale(${lerp(1.3, 1, show)})`, background: bg, padding: '26px 24px 20px', boxSizing: 'border-box', boxShadow: '0 14px 24px #000b', fontFamily: MARKER, fontSize: size, color, lineHeight: 1.15, textAlign: 'center'}}>
    <Pin />
    {children}
  </div>
);

/** Red string between two points, drawn in by `t`. */
export const Strings: React.FC<{lines: [number, number, number, number][]; t: number}> = ({lines, t}) => (
  <svg width={W} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2}}>
    {lines.map(([x1, y1, x2, y2], i) => {
      const k = Math.max(0, Math.min(1, t * lines.length - i));
      const sag = 40 + Math.hypot(x2 - x1, y2 - y1) * 0.08;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 + sag;
      return <path key={i} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke={STRING} strokeWidth={5} fill="none" strokeDasharray="3000" strokeDashoffset={3000 * (1 - k)} style={{filter: 'drop-shadow(0 4px 3px #0009)'}} />;
    })}
  </svg>
);

/** Full-bleed cinematic still with Ken Burns, flicker, grain and vignette. */
export const Still: React.FC<{src: string; t: number; from?: {s?: number; x?: number; y?: number}; to?: {s?: number; x?: number; y?: number}; pos?: string; flicker?: boolean; tint?: string}> = ({src, t, from = {}, to = {}, pos = '50% 50%', flicker = true, tint}) => {
  const frame = useCurrentFrame();
  const s = lerp(from.s ?? 1.05, to.s ?? 1.18, t);
  const x = lerp(from.x ?? 0, to.x ?? 0, t);
  const y = lerp(from.y ?? 0, to.y ?? 0, t);
  const f = flicker ? (rnd(Math.floor(frame / 3)) > 0.93 ? 0.82 : 1) : 1;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `translate(${x}px, ${y}px) scale(${s})`, filter: `brightness(${f}) contrast(1.08)`}} />
      {tint ? <AbsoluteFill style={{background: tint, mixBlendMode: 'color', opacity: 0.35}} /> : null}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 35%, #000000d0 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000a0 0%, transparent 18%, transparent 62%, #000000e0 100%)'}} />
    </AbsoluteFill>
  );
};

/** Big red rubber stamp. */
export const Stamp2: React.FC<{at: number; x: number; y: number; children: React.ReactNode; size?: number; r?: number; color?: string}> = ({at, x, y, children, size = 90, r = -10, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = p(frame, at, 6);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${lerp(2.4, 1, k)})`, opacity: k, border: `8px solid ${color}`, color, fontFamily: DISPLAY, fontSize: size, padding: '2px 26px', letterSpacing: 3, whiteSpace: 'nowrap', mixBlendMode: 'multiply', background: '#ffffff10', zIndex: 4}}>
      {children}
    </div>
  );
};

/** Camera move across the board: wraps content and pans/zooms. */
export const Cam: React.FC<{x?: number; y?: number; s?: number; children: React.ReactNode}> = ({x = 0, y = 0, s = 1, children}) => (
  <AbsoluteFill style={{transform: `scale(${s}) translate(${x}px, ${y}px)`, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>
);

/** Big bold headline (white with red keyword), top of frame. */
export const Head: React.FC<{at: number; until?: number; top?: number; children: React.ReactNode; size?: number}> = ({at, until = 1e9, top = 150, children, size = 96}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const k = p(frame, at, 8);
  return (
    <div style={{position: 'absolute', top, left: 40, right: 40, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, color: '#fff', textShadow: '0 6px 0 #000, 0 0 30px #000', opacity: k * (1 - p(frame, until - 6, 6)), transform: `scale(${lerp(1.3, 1, k)})`, zIndex: 5}}>
      {children}
    </div>
  );
};

/** Enlarges board layouts so they fill the frame above the captions. */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{transform: 'scale(1.2)', transformOrigin: '50% 8%'}}>{children}</AbsoluteFill>
);
