import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DISPLAY, rnd} from '../lib';

export const RED = '#e5383b';
export const BLUE = '#3d8bfd';
export const INK = '#07080d';
export const PAPER = '#f1ece2';

/**
 * Our own original "forecast cover" illustration (NOT The Economist's cover): a globe, missiles, a tank,
 * a crowd, CCTV cameras, a crashing chart, an AI chip and a rocket, in red/blue duotone. 900×1200 box.
 * `crack` (0..1) spreads glowing cracks over it.
 */
export const CoverArt: React.FC<{width: number; crack?: number; glow?: number}> = ({width, crack = 0, glow = 1}) => {
  const frame = useCurrentFrame();
  const flick = 0.85 + 0.15 * Math.sin(frame / 3);
  return (
    <svg width={width} height={(width * 1200) / 900} viewBox="0 0 900 1200" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="cvbg" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#3a0d12" />
          <stop offset="100%" stopColor="#0b0507" />
        </radialGradient>
        <radialGradient id="globe" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#123a7a" />
          <stop offset="100%" stopColor="#060c1c" />
        </radialGradient>
      </defs>
      <rect width={900} height={1200} fill="url(#cvbg)" />
      <rect x={14} y={14} width={872} height={1172} fill="none" stroke={PAPER} strokeOpacity={0.6} strokeWidth={4} />
      {/* year */}
      <text x={450} y={150} textAnchor="middle" fontFamily={DISPLAY} fontSize={150} fill={PAPER} letterSpacing={10}>
        2027
      </text>
      {/* rocket */}
      <g transform="translate(450 250)">
        <path d="M 0 -60 Q 18 -30 16 20 L -16 20 Q -18 -30 0 -60 Z" fill={BLUE} />
        <path d="M -16 10 L -30 34 L -14 26 Z M 16 10 L 30 34 L 14 26 Z" fill={BLUE} />
        <path d={`M -10 22 Q 0 ${60 + 10 * flick} 10 22 Z`} fill={RED} />
      </g>
      {/* missiles */}
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${150 + k * 90} ${300 + k * 70}) rotate(-35)`}>
          <rect x={-10} y={-70} width={20} height={110} rx={10} fill={PAPER} />
          <path d="M -10 -70 Q 0 -100 10 -70 Z" fill={RED} />
          <path d="M -10 30 L -24 50 L -10 44 Z M 10 30 L 24 50 L 10 44 Z" fill={PAPER} />
          <path d={`M -7 42 Q 0 ${110 * flick} 7 42 Z`} fill="#ff9a3c" opacity={0.85} />
        </g>
      ))}
      {/* CCTV cameras */}
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${690 + k * 110} ${290 + k * 40}) rotate(${15 - k * 25})`}>
          <rect x={-60} y={-22} width={110} height={44} rx={8} fill={PAPER} />
          <rect x={50} y={-14} width={18} height={28} fill={PAPER} />
          <circle cx={-34} cy={0} r={9} fill={RED} opacity={flick} />
          <rect x={-8} y={20} width={10} height={60} fill={PAPER} />
        </g>
      ))}
      {/* globe */}
      <circle cx={450} cy={600} r={230} fill="url(#globe)" stroke={BLUE} strokeWidth={5} />
      {[-150, -75, 0, 75, 150].map((y) => (
        <ellipse key={y} cx={450} cy={600 + y} rx={Math.sqrt(230 * 230 - y * y)} ry={18} fill="none" stroke={BLUE} strokeOpacity={0.35} strokeWidth={2} />
      ))}
      {[-150, -75, 0, 75, 150].map((x) => (
        <ellipse key={`m${x}`} cx={450} cy={600} rx={Math.abs(x)} ry={230} fill="none" stroke={BLUE} strokeOpacity={0.35} strokeWidth={2} />
      ))}
      <path d="M 320 520 Q 380 470 440 510 Q 480 540 520 500 Q 560 470 600 520 L 580 600 Q 520 640 470 600 Q 420 580 380 630 Z" fill={BLUE} opacity={0.6} />
      {/* AI chip */}
      <g transform="translate(720 730)">
        <rect x={-70} y={-70} width={140} height={140} rx={14} fill="#0b1a33" stroke={BLUE} strokeWidth={6} />
        <rect x={-36} y={-36} width={72} height={72} rx={6} fill={BLUE} opacity={0.75} />
        <text x={0} y={14} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={INK}>
          AI
        </text>
        {Array.from({length: 5}, (_, i) => (
          <g key={i}>
            <rect x={-56 + i * 26} y={-92} width={10} height={22} fill={BLUE} />
            <rect x={-56 + i * 26} y={70} width={10} height={22} fill={BLUE} />
            <rect x={-92} y={-56 + i * 26} width={22} height={10} fill={BLUE} />
            <rect x={70} y={-56 + i * 26} width={22} height={10} fill={BLUE} />
          </g>
        ))}
      </g>
      {/* crashing chart across the globe */}
      <polyline points="120,470 230,440 310,520 400,480 470,610 560,580 640,760 760,900" fill="none" stroke={RED} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 730 900 L 790 930 L 770 860 Z" fill={RED} />
      {/* tank */}
      <g transform="translate(210 960)" fill={PAPER}>
        <rect x={-130} y={-10} width={260} height={60} rx={26} />
        <rect x={-80} y={-60} width={140} height={56} rx={14} />
        <rect x={50} y={-46} width={140} height={14} rx={6} />
        {Array.from({length: 6}, (_, i) => <circle key={i} cx={-100 + i * 40} cy={22} r={14} fill={INK} />)}
      </g>
      {/* crowd */}
      <g fill={PAPER}>
        {Array.from({length: 9}, (_, i) => {
          const x = 430 + i * 52;
          const h = 1060 + (i % 3) * 14;
          return (
            <g key={i}>
              <circle cx={x} cy={h - 70} r={20} />
              <path d={`M ${x - 32} 1200 Q ${x - 30} ${h - 40} ${x} ${h - 46} Q ${x + 30} ${h - 40} ${x + 32} 1200 Z`} />
              {i % 2 === 0 ? <rect x={x + 18} y={h - 140} width={12} height={70} rx={6} /> : null}
            </g>
          );
        })}
      </g>
      {/* cracks */}
      {crack > 0 ? (
        <g stroke={RED} strokeWidth={6} fill="none" opacity={glow} style={{filter: `drop-shadow(0 0 12px ${RED})`}} strokeDasharray={1600} strokeDashoffset={1600 * (1 - crack)}>
          <path d="M 450 20 L 420 180 L 470 300 L 410 470 L 480 640 L 430 820 L 500 1000 L 460 1190" />
          <path d="M 20 600 L 180 560 L 300 640 L 420 600" />
          <path d="M 880 420 L 740 470 L 640 430 L 520 520" />
        </g>
      ) : null}
    </svg>
  );
};

/** Where each element sits on CoverArt (in its 900×1200 box), for lens zooms. */
export const SPOT = {
  year: [450, 110],
  rocket: [450, 240],
  missiles: [200, 320],
  cameras: [740, 300],
  globe: [450, 600],
  chip: [720, 730],
  chart: [560, 640],
  tank: [220, 950],
  crowd: [640, 1080],
} as const;

/** CoverArt zoomed into one spot: scale and translate so `spot` lands at the frame centre. */
export const CoverZoom: React.FC<{width: number; spot: readonly [number, number]; zoom: number; crack?: number; shake?: number}> = ({width, spot, zoom, crack, shake = 0}) => {
  const frame = useCurrentFrame();
  const k = width / 900;
  const sx = (rnd(frame) - 0.5) * 30 * shake;
  const sy = (rnd(frame + 7) - 0.5) * 30 * shake;
  return (
    <div style={{position: 'absolute', left: 540, top: 820, transform: `translate(${sx}px, ${sy}px) scale(${zoom}) translate(${-spot[0] * k}px, ${-spot[1] * k}px)`, transformOrigin: '0 0'}}>
      <CoverArt width={width} crack={crack} />
    </div>
  );
};

/** Magnifying glass showing a 2.2× view of the cover under it. */
export const Lens: React.FC<{coverWidth: number; coverLeft: number; coverTop: number; x: number; y: number; r?: number}> = ({coverWidth, coverLeft, coverTop, x, y, r = 170}) => {
  const zoom = 2.2;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `10px solid ${PAPER}`, boxShadow: '0 20px 60px #000, inset 0 0 40px #0008'}}>
        <div style={{position: 'absolute', left: r - (x - coverLeft) * zoom, top: r - (y - coverTop) * zoom, transform: `scale(${zoom})`, transformOrigin: '0 0'}}>
          <CoverArt width={coverWidth} />
        </div>
      </div>
      <div style={{position: 'absolute', left: r * 1.6, top: r * 1.6, width: 34, height: 170, background: '#3a2a1c', borderRadius: 14, transform: 'rotate(-45deg)', transformOrigin: 'top center'}} />
    </div>
  );
};

/** Simple duotone icon set used in several scenes. */
export const Clock: React.FC<{size: number; t: number; label?: string}> = ({size, t, label}) => (
  <svg width={size} height={size} viewBox="-120 -120 240 240">
    <circle r={110} fill="#0b0f1a" stroke={PAPER} strokeWidth={8} />
    {Array.from({length: 12}, (_, i) => (
      <rect key={i} x={-3} y={-102} width={6} height={18} fill={PAPER} transform={`rotate(${i * 30})`} />
    ))}
    <rect x={-4} y={-70} width={8} height={70} rx={4} fill={PAPER} transform={`rotate(${t * 360 * 3})`} />
    <rect x={-3} y={-95} width={6} height={95} rx={3} fill={RED} transform={`rotate(${t * 360 * 12})`} />
    <circle r={9} fill={RED} />
    {label ? (
      <text y={55} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={RED}>
        {label}
      </text>
    ) : null}
  </svg>
);

export const Tanker: React.FC<{width: number; color?: string}> = ({width, color = '#0b1220'}) => (
  <svg width={width} height={width * 0.28} viewBox="0 0 500 140">
    <path d="M 10 70 L 490 70 L 460 130 L 40 130 Z" fill={color} stroke={BLUE} strokeWidth={4} />
    <rect x={380} y={20} width={70} height={50} fill={color} stroke={BLUE} strokeWidth={4} />
    <rect x={400} y={0} width={18} height={20} fill={RED} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={60 + i * 75} y={52} width={55} height={18} rx={6} fill={BLUE} opacity={0.5} />)}
  </svg>
);

export const Thermometer: React.FC<{size: number; level: number}> = ({size, level}) => (
  <svg width={size * 0.35} height={size} viewBox="0 0 70 200">
    <rect x={22} y={6} width={26} height={150} rx={13} fill="#0b0f1a" stroke={PAPER} strokeWidth={5} />
    <rect x={29} y={150 - 130 * level} width={12} height={130 * level + 10} rx={6} fill={RED} />
    <circle cx={35} cy={170} r={26} fill={RED} stroke={PAPER} strokeWidth={5} />
  </svg>
);

export const Ballot: React.FC<{size: number; drop: number}> = ({size, drop}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform={`translate(0 ${-60 + 70 * drop})`} opacity={1 - Math.max(0, drop - 0.85) * 6}>
      <rect x={70} y={10} width={60} height={70} fill={PAPER} />
      <path d="M 85 45 L 97 57 L 117 32" fill="none" stroke={INK} strokeWidth={6} />
    </g>
    <rect x={30} y={90} width={140} height={100} rx={8} fill="#0b0f1a" stroke={PAPER} strokeWidth={6} />
    <rect x={60} y={86} width={80} height={10} fill={PAPER} />
    <rect x={30} y={130} width={47} height={14} fill={BLUE} />
    <rect x={77} y={130} width={46} height={14} fill={PAPER} />
    <rect x={123} y={130} width={47} height={14} fill={RED} />
  </svg>
);

export const Panel: React.FC<{kind: 'pen' | 'rocket' | 'film'; size: number}> = ({kind, size}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width={200} height={200} rx={20} fill="#0b1630" stroke={BLUE} strokeWidth={5} />
      {kind === 'pen' ? (
        <g transform="rotate(-35 100 100)">
          <rect x={88} y={30} width={24} height={110} rx={10} fill={PAPER} />
          <rect x={88} y={70} width={24} height={30} fill={BLUE} />
          <rect x={97} y={140} width={6} height={30} fill={PAPER} />
        </g>
      ) : null}
      {kind === 'rocket' ? (
        <g transform={`translate(0 ${-((frame % 60) / 60) * 20})`}>
          <path d="M 100 30 Q 125 70 120 130 L 80 130 Q 75 70 100 30 Z" fill={PAPER} />
          <circle cx={100} cy={80} r={10} fill={BLUE} />
          <path d={`M 88 130 Q 100 ${175 + Math.sin(frame / 2) * 8} 112 130 Z`} fill={RED} />
          <rect x={120} y={50} width={50} height={14} rx={4} fill={BLUE} opacity={0.7} />
          <rect x={140} y={40} width={10} height={34} fill={BLUE} opacity={0.7} />
        </g>
      ) : null}
      {kind === 'film' ? (
        <g>
          <rect x={40} y={80} width={120} height={80} rx={6} fill={PAPER} />
          <g transform={`rotate(${-18 + Math.sin(frame / 6) * 8} 40 80)`}>
            <rect x={40} y={56} width={120} height={22} fill={PAPER} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={50 + i * 28} y={56} width={14} height={22} fill={INK} transform={`skewX(-20)`} />)}
          </g>
          {[0, 1, 2].map((i) => <polygon key={i} points="0,-12 3.5,-4 12,-4 5,2 8,11 0,5 -8,11 -5,2 -12,-4 -3.5,-4" transform={`translate(${70 + i * 30} 120)`} fill={RED} />)}
        </g>
      ) : null}
    </svg>
  );
};
