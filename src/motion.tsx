import React from 'react';
import {AbsoluteFill, Img, getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {BODY, C, H, W, rnd} from './lib';

/** True when a file exists under public/ (so scenes can fall back to graphics if a photo is missing). */
export const has = (src: string) => getStaticFiles().some((f) => f.name === src);

/**
 * Full-screen photo with 2.5D parallax: the photo drifts/zooms slowly (far layer),
 * fog banks drift faster (mid layer) and dust specks fly fastest (near layer).
 */
export const Parallax: React.FC<{
  src: string;
  t: number; // 0..1 progress through the move
  from?: {x?: number; y?: number; s?: number};
  to?: {x?: number; y?: number; s?: number};
  gray?: number;
  dark?: number;
  tint?: string;
  fog?: number;
  dust?: number;
  credit?: string;
  fallback?: React.ReactNode;
}> = ({src, t, from = {}, to = {}, gray = 0.3, dark = 0.35, tint = '#0a1420', fog = 0.5, dust = 1, credit, fallback}) => {
  const frame = useCurrentFrame();
  const x = (from.x ?? 0) + ((to.x ?? 0) - (from.x ?? 0)) * t;
  const y = (from.y ?? 0) + ((to.y ?? 0) - (from.y ?? 0)) * t;
  const s = (from.s ?? 1.1) + ((to.s ?? 1.25) - (from.s ?? 1.1)) * t;
  return (
    <AbsoluteFill style={{background: tint, overflow: 'hidden'}}>
      {has(src) ? (
        <Img
          src={staticFile(src)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${x}px, ${y}px) scale(${s})`, filter: `grayscale(${gray}) contrast(1.1) brightness(${1 - dark * 0.5})`}}
        />
      ) : (
        fallback ?? null
      )}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tint}cc 0%, transparent 30%, transparent 62%, ${tint}ee 100%)`}} />
      <AbsoluteFill style={{background: '#000', opacity: dark * 0.5}} />
      <Fog amount={fog} speed={1.6} />
      <Dust amount={dust} />
      {credit && has(src) ? <Credit text={credit} /> : null}
    </AbsoluteFill>
  );
};

export const Credit: React.FC<{text: string; bottom?: number}> = ({text, bottom = 150}) => (
  <div style={{position: 'absolute', left: 30, bottom, fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 1, color: '#ffffff99', textShadow: '0 2px 6px #000'}}>{text}</div>
);

/** Drifting fog banks (mid parallax layer). */
export const Fog: React.FC<{amount?: number; speed?: number; color?: string}> = ({amount = 0.5, speed = 1, color = '#c9d6e4'}) => {
  const frame = useCurrentFrame();
  if (amount <= 0) return null;
  return (
    <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0, filter: 'blur(40px)'}}>
      {Array.from({length: 6}, (_, i) => {
        const x = ((rnd(i) * W + frame * speed * (0.6 + rnd(i + 5))) % (W + 900)) - 450;
        return <ellipse key={i} cx={x} cy={300 + rnd(i + 9) * 1300} rx={380 + rnd(i + 2) * 200} ry={90 + rnd(i + 4) * 60} fill={color} opacity={0.12 * amount} />;
      })}
    </svg>
  );
};

/** Floating dust specks (near parallax layer). */
export const Dust: React.FC<{amount?: number}> = ({amount = 1}) => {
  const frame = useCurrentFrame();
  if (amount <= 0) return null;
  return (
    <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0}}>
      {Array.from({length: Math.round(40 * amount)}, (_, i) => {
        const x = (rnd(i) * W + frame * (0.8 + rnd(i + 1) * 2.4)) % W;
        const y = (rnd(i + 40) * H - frame * (0.3 + rnd(i + 2))) % H;
        return <circle key={i} cx={x} cy={(y + H) % H} r={1 + rnd(i + 3) * 2.6} fill="#fff" opacity={0.1 + rnd(i + 4) * 0.25} />;
      })}
    </svg>
  );
};

/**
 * Photo printed on a card, tilted in 3D like a page being lifted off a desk.
 * rx/ry/rz in degrees; animate them from the scene for page-tilt motion.
 */
export const TiltCard: React.FC<{
  src: string;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  opacity?: number;
  focus?: string;
  fit?: 'cover' | 'contain';
  gray?: number;
  border?: string;
  credit?: string;
  label?: string;
  fallback?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({src, width, height, rx = 0, ry = 0, rz = 0, scale = 1, opacity = 1, focus = '50% 30%', fit = 'cover', gray = 0.2, border = '#efe6cf', credit, label, fallback, style}) => (
  <div style={{perspective: 1600, width, height, opacity, ...style}}>
    <div
      style={{
        width,
        height,
        transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        background: border,
        padding: 14,
        paddingBottom: label ? 64 : 14,
        borderRadius: 6,
        boxShadow: `${-ry * 1.2}px ${30 + rx}px 80px #000000cc`,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div style={{width: '100%', height: '100%', overflow: 'hidden', background: '#11161c', position: 'relative'}}>
        {has(src) ? (
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, objectPosition: focus, filter: `grayscale(${gray}) contrast(1.08)`}} />
        ) : (
          fallback ?? null
        )}
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${110 + ry}deg, #ffffff22, transparent 45%, #00000044)`}} />
        {credit && has(src) ? <div style={{position: 'absolute', left: 10, bottom: 6, fontFamily: BODY, fontWeight: 800, fontSize: 16, color: '#ffffffaa', textShadow: '0 1px 4px #000'}}>{credit}</div> : null}
      </div>
      {label ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 12, textAlign: 'center', fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 30, color: '#1a1712', letterSpacing: 2}}>{label}</div> : null}
    </div>
  </div>
);

/** Prison searchlight: a soft cone sweeping from (x, y). */
export const Searchlight: React.FC<{x?: number; y?: number; speed?: number; spread?: number; intensity?: number}> = ({x = 540, y = 200, speed = 1, spread = 22, intensity = 1}) => {
  const frame = useCurrentFrame();
  const a = 90 + Math.sin((frame / 60) * speed) * 55;
  const len = 2600;
  const r = (d: number) => (d * Math.PI) / 180;
  const p1 = [x + Math.cos(r(a - spread / 2)) * len, y + Math.sin(r(a - spread / 2)) * len];
  const p2 = [x + Math.cos(r(a + spread / 2)) * len, y + Math.sin(r(a + spread / 2)) * len];
  return (
    <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0, mixBlendMode: 'screen'}}>
      <defs>
        <radialGradient id="beam" cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff6d8" stopOpacity={0.55 * intensity} />
          <stop offset="60%" stopColor="#fff6d8" stopOpacity={0.12 * intensity} />
          <stop offset="100%" stopColor="#fff6d8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <polygon points={`${x},${y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill="url(#beam)" style={{filter: 'blur(14px)'}} />
      <circle cx={x} cy={y} r={18} fill="#fff6d8" opacity={0.9 * intensity} style={{filter: 'blur(4px)'}} />
    </svg>
  );
};

/** Layered night water: three wave bands moving at different speeds (parallax). */
export const Water: React.FC<{top?: number; color?: string; glow?: number}> = ({top = 1100, color = '#0b1a28', glow = 0}) => {
  const frame = useCurrentFrame();
  const band = (k: number, amp: number, speed: number, shade: string, y0: number) => {
    const pts: string[] = [];
    for (let x = -40; x <= W + 40; x += 40) {
      pts.push(`${x},${y0 + Math.sin(x / (120 + k * 30) + frame * speed * 0.05 + k) * amp}`);
    }
    return <polygon key={k} points={`-40,${H} ${pts.join(' ')} ${W + 40},${H}`} fill={shade} />;
  };
  return (
    <svg width={W} height={H - top} viewBox={`0 ${top} ${W} ${H - top}`} style={{position: 'absolute', top, left: 0}}>
      {band(0, 14, 0.6, '#12263a', top + 20)}
      {band(1, 18, 1.1, color, top + 90)}
      {band(2, 24, 1.8, '#07111b', top + 200)}
      {glow > 0
        ? Array.from({length: 18}, (_, i) => (
            <rect key={i} x={((i * 97 + frame * 3) % (W + 100)) - 50} y={top + 40 + (i % 5) * 50} width={60} height={3} fill="#fff6d8" opacity={0.25 * glow} />
          ))
        : null}
    </svg>
  );
};

/** Silhouette placeholder used when a mugshot photo could not be downloaded. */
export const Silhouette: React.FC<{color?: string}> = ({color = '#2a3544'}) => (
  <svg width="100%" height="100%" viewBox="0 0 300 360" preserveAspectRatio="xMidYMid slice">
    <rect width={300} height={360} fill="#151c25" />
    <circle cx={150} cy={140} r={70} fill={color} />
    <path d="M 40 360 Q 50 240 150 230 Q 250 240 260 360 Z" fill={color} />
    <text x={150} y={160} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={80} fill={C.dim} opacity={0.5}>
      ?
    </text>
  </svg>
);
