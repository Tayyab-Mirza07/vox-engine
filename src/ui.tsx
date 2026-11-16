import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BODY, C, DISPLAY, FPS, H, LINES, W, f, p, rnd, slam, lerp} from './lib';

export const Background: React.FC<{tint?: string; warmth?: number}> = ({tint = C.green, warmth = 0}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.6) % 90;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at 50% 38%, ${tint}22, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 1000px at 50% 45%, ${C.warm}, transparent 72%)`,
          opacity: warmth * 0.22,
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.5}}>
        {Array.from({length: 24}, (_, i) => (
          <line key={`h${i}`} x1={0} x2={W} y1={i * 90 + drift} y2={i * 90 + drift} stroke={C.line} strokeWidth={1} />
        ))}
        {Array.from({length: 13}, (_, i) => (
          <line key={`v${i}`} y1={0} y2={H} x1={i * 90} x2={i * 90} stroke={C.line} strokeWidth={1} />
        ))}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 45%, #000000cc 100%)'}} />
    </AbsoluteFill>
  );
};

/** Big on-screen headline at the top of the frame. */
export const Headline: React.FC<{
  at: number;
  until?: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  y?: number;
}> = ({at, until = 1e9, children, color = C.white, size = 92, y = 230}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const s = slam(frame, at, 1.5);
  const fade = 1 - p(frame, until - 6, 6);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: 2,
        color,
        textTransform: 'uppercase',
        opacity: s.opacity * fade,
        transform: `scale(${s.scale})`,
        textShadow: '0 6px 30px #000',
      }}
    >
      {children}
    </div>
  );
};

/** Small monospace-ish tag label. */
export const Tag: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({
  children,
  color = C.green,
  style,
}) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: BODY,
      fontWeight: 800,
      fontSize: 34,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: C.bg,
      background: color,
      padding: '10px 22px',
      borderRadius: 8,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Red rubber-stamp text that slams onto the screen. */
export const Stamp: React.FC<{
  at: number;
  children: React.ReactNode;
  x?: number;
  y: number;
  rotate?: number;
  size?: number;
  color?: string;
}> = ({at, children, x = W / 2, y, rotate = -9, size = 120, color = C.red}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = slam(frame, at, 3.2);
  const shake = frame - at < 8 ? (rnd(frame) - 0.5) * 14 * (1 - (frame - at) / 8) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${shake}px, ${-shake}px) rotate(${rotate}deg) scale(${s.scale})`,
        opacity: s.opacity,
        fontFamily: DISPLAY,
        fontSize: size,
        letterSpacing: 4,
        color,
        border: `10px solid ${color}`,
        borderRadius: 18,
        padding: '6px 34px',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        background: '#07090cdd',
        boxShadow: `0 0 60px ${color}66`,
      }}
    >
      {children}
    </div>
  );
};

/** White flash + scanline glitch at the start of every scene. */
export const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 7) return null;
  const o = lerp(0.75, 0, frame / 7);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: C.white, opacity: o * 0.55}} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: rnd(frame * 7 + i) * H,
            height: 30 + rnd(frame + i * 3) * 120,
            background: i === 1 ? C.green : C.white,
            opacity: o * 0.5,
            transform: `translateX(${(rnd(frame + i) - 0.5) * 120}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

type Chunk = {start: number; end: number; words: {w: string; start: number; end: number}[]};

// Break the narration into 1–3 word caption chunks, splitting at punctuation.
const CHUNKS: Chunk[] = LINES.flatMap((line) =>
  line.sentences.flatMap((s) => {
    const chunks: Chunk[] = [];
    let cur: Chunk['words'] = [];
    const flush = () => {
      if (cur.length) chunks.push({start: cur[0].start, end: cur[cur.length - 1].end, words: cur});
      cur = [];
    };
    s.words.forEach((w) => {
      cur.push(w);
      const chars = cur.reduce((a, x) => a + x.w.length, 0);
      if (/[,.?!]$/.test(w.w) || cur.length === 3 || chars > 15) flush();
    });
    flush();
    return chunks;
  }),
);

/** Word-by-word captions with the active word highlighted. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = CHUNKS.findIndex((c, i) => t >= c.start - 0.04 && t < (CHUNKS[i + 1]?.start ?? c.end + 0.5) - 0.04);
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  if (t > chunk.end + 0.45) return null;
  const pop = lerp(0.86, 1, p(frame, f(chunk.start - 0.04), 4));
  return (
    <div
      style={{
        position: 'absolute',
        top: 1390,
        left: 50,
        right: 50,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0 22px',
        transform: `scale(${pop})`,
        fontFamily: DISPLAY,
        fontSize: 96,
        lineHeight: 1.12,
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start - 0.04 && t < w.end;
        const spoken = t >= w.end;
        return (
          <span
            key={i}
            style={{
              color: active ? C.green : C.white,
              opacity: active || spoken ? 1 : 0.55,
              transform: `scale(${active ? 1.08 : 1})`,
              display: 'inline-block',
              WebkitTextStroke: '10px #000',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 24px #000',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/** Progress bar along the top edge — a small retention device. */
export const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 0, left: 0, height: 10, width: `${(frame / total) * 100}%`, background: C.green}} />
  );
};

/** Simple chip graphic. */
export const Chip: React.FC<{size: number; label: string; color?: string; glow?: number; sub?: string}> = ({
  size,
  label,
  color = C.green,
  glow = 1,
  sub,
}) => {
  const pins = 7;
  const pinLen = size * 0.12;
  const body = size - pinLen * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow: 'visible'}}>
      {Array.from({length: pins}, (_, i) => {
        const o = pinLen + (body / (pins + 1)) * (i + 1);
        return (
          <g key={i} stroke={color} strokeWidth={size * 0.022} strokeLinecap="round">
            <line x1={o} y1={0} x2={o} y2={pinLen} />
            <line x1={o} y1={size} x2={o} y2={size - pinLen} />
            <line x1={0} y1={o} x2={pinLen} y2={o} />
            <line x1={size} y1={o} x2={size - pinLen} y2={o} />
          </g>
        );
      })}
      <rect
        x={pinLen}
        y={pinLen}
        width={body}
        height={body}
        rx={size * 0.07}
        fill={C.panel}
        stroke={color}
        strokeWidth={size * 0.025}
        style={{filter: `drop-shadow(0 0 ${30 * glow}px ${color})`}}
      />
      <rect
        x={pinLen + body * 0.14}
        y={pinLen + body * 0.14}
        width={body * 0.72}
        height={body * 0.72}
        rx={size * 0.04}
        fill="none"
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <text
        x={size / 2}
        y={size / 2 + (sub ? -size * 0.02 : size * 0.07)}
        textAnchor="middle"
        fontFamily={DISPLAY}
        fontSize={size * 0.2}
        fill={color}
        letterSpacing={2}
      >
        {label}
      </text>
      {sub ? (
        <text x={size / 2} y={size / 2 + size * 0.13} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={size * 0.075} fill={C.dim} letterSpacing={3}>
          {sub}
        </text>
      ) : null}
    </svg>
  );
};

/** Standing figure silhouette, feet at (x, y). */
export const Figure: React.FC<{x: number; y: number; h: number; color: string; stroke?: string}> = ({x, y, h, color, stroke}) => {
  const head = h * 0.11;
  const sw = h * 0.3;
  return (
    <g transform={`translate(${x}, ${y})`} fill={color} stroke={stroke} strokeWidth={stroke ? 4 : 0}>
      <circle cx={0} cy={-h + head} r={head} />
      <path
        d={`M ${-sw / 2} ${-h + head * 2.5} Q 0 ${-h + head * 1.9} ${sw / 2} ${-h + head * 2.5} L ${sw * 0.42} ${-h * 0.42} L ${sw * 0.3} 0 L ${sw * 0.04} 0 L 0 ${-h * 0.36} L ${-sw * 0.04} 0 L ${-sw * 0.3} 0 L ${-sw * 0.42} ${-h * 0.42} Z`}
      />
    </g>
  );
};
