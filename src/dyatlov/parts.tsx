import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BODY, C, DISPLAY, H, W, rnd} from '../lib';

export const ICE = '#8fd3ff';
export const SNOW = '#e6eef7';

/** Night sky over snow: stars, a faint aurora glow and falling snow (wind pushes it sideways). */
export const NightSnow: React.FC<{wind?: number; flakes?: number; dark?: number}> = ({wind = 1, flakes = 90, dark = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #02050b 0%, #0a1626 55%, #13253a 100%)'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 70}, (_, i) => (
          <circle key={`s${i}`} cx={rnd(i) * W} cy={rnd(i + 300) * 900} r={rnd(i + 50) * 2.2 + 0.6} fill="#fff" opacity={0.25 + 0.5 * Math.abs(Math.sin(frame / 25 + i))} />
        ))}
        {Array.from({length: flakes}, (_, i) => {
          const speed = 2 + rnd(i + 7) * 4;
          const x = (((rnd(i) * W + Math.sin(frame / 30 + i) * 18 + frame * wind * (1.5 + rnd(i + 3) * 2)) % (W + 40)) + W + 40) % (W + 40) - 20;
          const y = (rnd(i + 99) * H + frame * speed) % H;
          return <circle key={`f${i}`} cx={x} cy={y} r={1.5 + rnd(i + 11) * 3.5} fill={SNOW} opacity={0.35 + rnd(i + 21) * 0.5} />;
        })}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 40%, #000000cc 100%)'}} />
      {dark > 0 ? <AbsoluteFill style={{background: '#000', opacity: dark}} /> : null}
    </AbsoluteFill>
  );
};

/** Snowy mountain slope (Kholat Syakhl), high on the left, falling to the right. */
export const Slope: React.FC<{top?: number; height?: number}> = ({top = 760, height = 1160}) => (
  <svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{position: 'absolute', top, left: 0}}>
    <defs>
      <linearGradient id="slope" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9fb3c8" />
        <stop offset="45%" stopColor="#4b5e73" />
        <stop offset="100%" stopColor="#141f2c" />
      </linearGradient>
    </defs>
    <path d={`M 0 120 Q 180 20 360 60 Q 640 140 1080 330 L 1080 ${height} L 0 ${height} Z`} fill="url(#slope)" />
    <path d="M 0 120 Q 180 20 360 60 Q 640 140 1080 330" fill="none" stroke={SNOW} strokeOpacity={0.7} strokeWidth={4} />
  </svg>
);

/** Canvas ridge tent, side view. `slash` draws the cut from inside, `buried` covers it with snow, `glow` lights it. */
export const Tent: React.FC<{width: number; slash?: number; buried?: number; glow?: number; rotate?: number}> = ({width, slash = 0, buried = 0, glow = 0, rotate = 0}) => {
  const len = 210;
  return (
    <svg width={width} height={(width * 170) / 320} viewBox="0 0 320 170" style={{overflow: 'visible', transform: `rotate(${rotate}deg)`}}>
      <defs>
        <clipPath id="tentclip">
          <polygon points="10,160 70,40 270,40 310,160" />
        </clipPath>
      </defs>
      <polygon points="10,160 70,40 270,40 310,160" fill="#8a7046" stroke="#2a2014" strokeWidth={4} />
      <polygon points="10,160 70,40 110,160" fill="#6d5636" stroke="#2a2014" strokeWidth={3} />
      <line x1={70} y1={40} x2={270} y2={40} stroke="#2a2014" strokeWidth={6} />
      {glow > 0 ? <polygon points="10,160 70,40 270,40 310,160" fill="#ffcf70" opacity={0.35 * glow} /> : null}
      {slash > 0 ? (
        <g>
          <path d="M 140 60 L 175 95 L 205 118 L 245 148" fill="none" stroke="#050505" strokeWidth={14} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - slash)} />
          <path d="M 140 60 L 175 95 L 205 118 L 245 148" fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - slash)} opacity={0.8} />
        </g>
      ) : null}
      {buried > 0 ? (
        <g clipPath="url(#tentclip)">
          <path d={`M 0 ${170 - buried * 120} Q 90 ${150 - buried * 130} 170 ${165 - buried * 115} T 330 ${160 - buried * 110} L 330 175 L 0 175 Z`} fill={SNOW} />
        </g>
      ) : null}
      <path d={`M 0 162 Q 160 ${150 - buried * 20} 320 162 L 320 172 L 0 172 Z`} fill={SNOW} />
    </svg>
  );
};

/** A line of footprints from (x0,y0) going down a wavy path, revealed by `progress`. */
export const Footprints: React.FC<{progress: number; x0?: number; y0?: number; length?: number; count?: number; color?: string}> = ({
  progress,
  x0 = 540,
  y0 = 380,
  length = 760,
  count = 34,
  color = '#2a3a4c',
}) => (
  <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0}}>
    {Array.from({length: count}, (_, i) => {
      const t = i / (count - 1);
      if (t > progress) return null;
      const x = x0 + Math.sin(t * 5) * 90 + (i % 2 ? 22 : -22);
      const y = y0 + t * length;
      const bare = i % 6 === 3;
      return (
        <g key={i} transform={`translate(${x}, ${y}) rotate(${Math.cos(t * 5) * 25})`} opacity={0.85}>
          <ellipse cx={0} cy={0} rx={10} ry={18} fill={color} />
          {bare ? [0, 1, 2, 3].map((k) => <circle key={k} cx={-7 + k * 4.6} cy={-23} r={3} fill={color} />) : <ellipse cx={0} cy={22} rx={8} ry={8} fill={color} />}
        </g>
      );
    })}
  </svg>
);

/** Tall Siberian cedar. */
export const Cedar: React.FC<{height: number; color?: string}> = ({height, color = '#07110d'}) => (
  <svg width={height * 0.6} height={height} viewBox="0 0 300 500" style={{overflow: 'visible'}}>
    <rect x={140} y={360} width={20} height={140} fill="#1a1208" />
    {Array.from({length: 7}, (_, i) => {
      const y = 30 + i * 52;
      const w = 50 + i * 20;
      return <polygon key={i} points={`150,${y} ${150 - w},${y + 90} ${150 + w},${y + 90}`} fill={color} stroke="#c9d8e8" strokeOpacity={0.35} strokeWidth={3} />;
    })}
    {Array.from({length: 7}, (_, i) => (
      <path key={`n${i}`} d={`M ${150 - 40 - i * 20} ${120 + i * 52} Q 150 ${108 + i * 52} ${150 + 40 + i * 20} ${120 + i * 52}`} fill="none" stroke={SNOW} strokeOpacity={0.55} strokeWidth={5} />
    ))}
  </svg>
);

/** Small campfire / embers. */
export const Embers: React.FC<{size: number; heat?: number}> = ({size, heat = 1}) => {
  const frame = useCurrentFrame();
  const flick = 0.75 + 0.25 * Math.sin(frame / 2.3) * Math.sin(frame / 3.7);
  return (
    <svg width={size} height={size} viewBox="-60 -80 120 120" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${30 * heat}px #ff8a3d)`}}>
      <path d={`M -30 30 Q -28 ${-20 * flick * heat} 0 ${-55 * flick * heat} Q 28 ${-20 * flick * heat} 30 30 Z`} fill="#ff8a3d" opacity={0.85 * heat} />
      <path d={`M -14 30 Q -12 ${-6 * flick * heat} 0 ${-30 * flick * heat} Q 12 ${-6 * flick * heat} 14 30 Z`} fill="#ffd27a" opacity={heat} />
      <rect x={-46} y={26} width={92} height={10} rx={5} fill="#2a1a0c" transform="rotate(-8)" />
      <rect x={-46} y={26} width={92} height={10} rx={5} fill="#3a2410" transform="rotate(10)" />
    </svg>
  );
};

/** Respectful marker for a hiker who was found: a soft ring of light, not a body. */
export const Marker: React.FC<{x: number; y: number; show: number; color?: string}> = ({x, y, show, color = ICE}) => {
  const frame = useCurrentFrame();
  if (show <= 0) return null;
  const pulse = (frame % 40) / 40;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={show}>
      <circle r={16 + pulse * 34} fill="none" stroke={color} strokeWidth={4} opacity={1 - pulse} />
      <circle r={14 * show} fill={color} />
    </g>
  );
};

/** Thermometer with a big temperature readout. */
export const Thermo: React.FC<{show: number; label?: string}> = ({show, label = '-30°C'}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: show, transform: `scale(${0.8 + 0.2 * show})`}}>
    <svg width={70} height={260} viewBox="0 0 70 260">
      <rect x={22} y={10} width={26} height={200} rx={13} fill="#0b1520" stroke={SNOW} strokeWidth={5} />
      <rect x={29} y={150 - 60 * (1 - show)} width={12} height={80 + 60 * (1 - show)} rx={6} fill={ICE} />
      <circle cx={35} cy={222} r={30} fill={ICE} stroke={SNOW} strokeWidth={5} />
    </svg>
    <div style={{fontFamily: DISPLAY, fontSize: 150, color: ICE, textShadow: `0 0 40px ${ICE}88`}}>{label}</div>
  </div>
);

/** Pair of boots (struck out when `crossed`). */
export const Boots: React.FC<{size: number; crossed?: number}> = ({size, crossed = 0}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 300 210" style={{overflow: 'visible'}}>
    {[0, 1].map((k) => (
      <path key={k} transform={`translate(${k * 140}, 0)`} d="M 30 20 L 90 20 L 92 130 Q 140 135 140 170 L 140 190 L 20 190 L 22 130 Z" fill="#3a2c1c" stroke="#a8875a" strokeWidth={5} />
    ))}
    {crossed > 0 ? (
      <g stroke={C.red} strokeWidth={16} strokeLinecap="round" opacity={crossed}>
        <line x1={0} y1={0} x2={300 * crossed} y2={210 * crossed} />
        <line x1={300} y1={0} x2={300 - 300 * crossed} y2={210 * crossed} />
      </g>
    ) : null}
  </svg>
);

/** Radiation trefoil inside a Geiger-counter dial. */
export const Geiger: React.FC<{size: number; level: number}> = ({size, level}) => {
  const frame = useCurrentFrame();
  const jitter = (rnd(frame) - 0.5) * 14 * level;
  const ang = -60 + 120 * level + jitter;
  return (
    <svg width={size} height={size} viewBox="-150 -150 300 300">
      <circle r={140} fill="#11161c" stroke="#3a4a5c" strokeWidth={8} />
      <g fill="#f2d03a" opacity={0.95}>
        {[0, 120, 240].map((a) => (
          <path key={a} transform={`rotate(${a})`} d="M 0 0 L -38 -66 A 76 76 0 0 1 38 -66 Z" />
        ))}
        <circle r={16} fill="#11161c" />
        <circle r={10} fill="#f2d03a" />
      </g>
      <path d="M -110 60 A 125 125 0 0 1 110 60" fill="none" stroke="#3a4a5c" strokeWidth={6} />
      <line x1={0} y1={90} x2={0} y2={-20} stroke={C.red} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang}, 0, 90)`} />
      <text y={128} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={22} fill={C.dim} letterSpacing={3}>
        RADIATION
      </text>
    </svg>
  );
};

/** Simple standing hiker silhouette (with backpack). */
export const Hiker: React.FC<{x: number; y: number; h: number; color?: string; opacity?: number}> = ({x, y, h, color = '#0b1622', opacity = 1}) => {
  const s = h / 100;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`} fill={color} opacity={opacity}>
      <circle cx={0} cy={-88} r={10} />
      <rect x={-12} y={-76} width={24} height={40} rx={8} />
      <rect x={-24} y={-74} width={14} height={30} rx={5} />
      <rect x={-10} y={-38} width={8} height={38} />
      <rect x={2} y={-38} width={8} height={38} />
      <line x1={16} y1={-70} x2={26} y2={0} stroke={color} strokeWidth={3} />
    </g>
  );
};
