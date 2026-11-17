import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BODY, C, DISPLAY, H, W, rnd} from '../lib';

export const AMBER = '#f2b632';
export const NIGHT = '#0a1220';

/** Boeing 727 silhouette, side view, nose to the right. Drawn in a 640×220 box. */
export const Jet: React.FC<{
  width: number;
  color?: string;
  stairs?: number; // 0 closed → 1 fully lowered
  gear?: number; // 0 up → 1 down
  lights?: boolean;
}> = ({width, color = '#05080d', stairs = 0, gear = 0, lights = true}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 3 === 0 ? 1 : 0.15;
  return (
    <svg width={width} height={(width * 220) / 640} viewBox="0 0 640 220" style={{overflow: 'visible'}}>
      <g fill={color} stroke={color} strokeLinejoin="round">
        {/* landing gear */}
        <g opacity={gear} transform={`translate(0, ${(1 - gear) * -16})`}>
          <rect x={336} y={132} width={7} height={30} />
          <circle cx={332} cy={166} r={9} />
          <circle cx={348} cy={166} r={9} />
          <rect x={548} y={128} width={5} height={32} />
          <circle cx={550.5} cy={164} r={7} />
        </g>
        {/* aft airstair, hinged under the tail */}
        <g transform={`rotate(${stairs * -50}, 150, 128)`} opacity={stairs > 0 ? 1 : 0}>
          <path d="M 150 124 L 62 128 L 62 136 L 150 134 Z" />
        </g>
        {/* fuselage */}
        <path d="M 38 104 Q 70 88 150 86 L 520 86 Q 585 88 612 108 Q 600 126 560 132 L 150 134 Q 80 132 38 110 Z" />
        {/* T-tail fin and stabiliser */}
        <path d="M 78 92 L 26 22 L 74 22 L 168 88 Z" />
        <path d="M 4 14 L 96 16 L 110 28 L 14 26 Z" />
        {/* centre engine intake + side engine pod */}
        <path d="M 150 86 Q 150 66 122 60 L 96 56 L 132 90 Z" />
        <rect x={84} y={92} width={104} height={24} rx={12} />
        {/* wing */}
        <path d="M 380 118 L 250 178 L 214 178 L 292 118 Z" />
      </g>
      {/* cabin windows */}
      {Array.from({length: 26}, (_, i) => (
        <rect key={i} x={206 + i * 12.6} y={98} width={6} height={5} rx={1.5} fill={AMBER} opacity={0.75} />
      ))}
      <path d="M 566 98 L 590 102 L 584 108 L 564 106 Z" fill={AMBER} opacity={0.7} />
      {lights ? (
        <>
          <circle cx={50} cy={20} r={6} fill={C.red} opacity={blink} />
          <circle cx={330} cy={136} r={5} fill={C.white} opacity={blink} />
        </>
      ) : null}
    </svg>
  );
};

/** Night sky with drifting clouds, optional rain and lightning. */
export const NightSky: React.FC<{rain?: number; flashAt?: number[]; moon?: boolean}> = ({rain = 0, flashAt = [], moon = true}) => {
  const frame = useCurrentFrame();
  const flash = flashAt.reduce((m, at) => {
    const d = frame - at;
    return d >= 0 && d < 10 ? Math.max(m, (1 - d / 10) * (d % 3 === 1 ? 0.3 : 1)) : m;
  }, 0);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #05080f 0%, ${NIGHT} 55%, #101a2b 100%)`}}>
      {moon ? (
        <div style={{position: 'absolute', top: 240, right: 130, width: 120, height: 120, borderRadius: '50%', background: '#dfe7f2', opacity: 0.18, filter: 'blur(3px)'}} />
      ) : null}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 60}, (_, i) => (
          <circle key={i} cx={rnd(i) * W} cy={rnd(i + 99) * 1100} r={1 + rnd(i + 7) * 1.6} fill="#fff" opacity={(0.15 + rnd(i + 3) * 0.4) * (1 - rain * 0.8)} />
        ))}
        {Array.from({length: 7}, (_, i) => {
          const x = ((rnd(i + 40) * (W + 800) + frame * (0.6 + rnd(i) * 1.2)) % (W + 800)) - 400;
          return <ellipse key={`c${i}`} cx={x} cy={300 + rnd(i + 20) * 900} rx={260 + rnd(i + 5) * 200} ry={50 + rnd(i + 9) * 40} fill="#1b2638" opacity={0.35 + rain * 0.35} />;
        })}
        {rain > 0
          ? Array.from({length: 150}, (_, i) => {
              const speed = 46 + rnd(i + 1) * 30;
              const y = ((rnd(i + 200) * (H + 300) + frame * speed) % (H + 300)) - 150;
              const x = ((rnd(i + 300) * (W + 400) - frame * 9) % (W + 400) + (W + 400)) % (W + 400) - 100;
              return <line key={`r${i}`} x1={x} y1={y} x2={x - 16} y2={y + 78} stroke="#9fb4cf" strokeWidth={2.2} opacity={rain * (0.18 + rnd(i) * 0.3)} />;
            })
          : null}
      </svg>
      <AbsoluteFill style={{background: '#dbe8ff', opacity: flash * 0.75}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 40%, #000000d0 100%)'}} />
    </AbsoluteFill>
  );
};

/** Jagged pine-forest skyline along the bottom of its box. */
export const Forest: React.FC<{width: number; height: number; color?: string; seed?: number}> = ({width, height, color = '#04070b', seed = 0}) => {
  const n = 38;
  const pts: string[] = [`0,${height}`];
  for (let i = 0; i < n; i++) {
    const x = (i / n) * width;
    const w = width / n;
    const h = height * (0.35 + rnd(i + seed) * 0.6);
    pts.push(`${x},${height * 0.92}`, `${x + w / 2},${height - h}`, `${x + w},${height * 0.92}`);
  }
  pts.push(`${width},${height}`);
  return (
    <svg width={width} height={height}>
      <polygon points={pts.join(' ')} fill={color} />
    </svg>
  );
};

/** Small falling figure in a suit (no parachute shown — nobody saw one open). */
export const Faller: React.FC<{size: number; color?: string; spin?: number}> = ({size, color = '#05080d', spin = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${spin}deg)`, overflow: 'visible'}}>
    <g fill={color} stroke={color} strokeWidth={7} strokeLinecap="round">
      <circle cx={0} cy={-30} r={9} />
      <line x1={0} y1={-20} x2={0} y2={10} strokeWidth={13} />
      <line x1={0} y1={-12} x2={-26} y2={-28} />
      <line x1={0} y1={-12} x2={26} y2={-26} />
      <line x1={0} y1={10} x2={-16} y2={38} />
      <line x1={0} y1={10} x2={18} y2={36} />
      <rect x={20} y={-8} width={20} height={16} rx={3} strokeWidth={2} />
    </g>
  </svg>
);

/** Typewriter text: reveals characters from `at`. */
export const Typed: React.FC<{text: string; at: number; cps?: number; style?: React.CSSProperties}> = ({text, at, cps = 22, style}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - at) / 30) * cps));
  const done = n >= text.length;
  return (
    <span style={{fontFamily: '"Courier New", Courier, monospace', fontWeight: 700, whiteSpace: 'pre-wrap', ...style}}>
      {text.slice(0, n)}
      <span style={{opacity: !done || Math.floor(frame / 8) % 2 ? 1 : 0}}>▌</span>
    </span>
  );
};

/** Paper card (note, ticket, case file). */
export const Paper: React.FC<{width: number; children: React.ReactNode; rotate?: number; style?: React.CSSProperties}> = ({width, children, rotate = 0, style}) => (
  <div
    style={{
      width,
      background: 'linear-gradient(180deg, #efe6cf, #ddd0b0)',
      color: '#1a1712',
      borderRadius: 10,
      padding: '34px 40px',
      boxShadow: '0 30px 80px #000, inset 0 0 60px #b9a87c55',
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Evidence card with an icon, a label and an exhibit letter. */
export const Evidence: React.FC<{letter: string; label: string; children: React.ReactNode; show: number}> = ({letter, label, children, show}) => (
  <div
    style={{
      width: 300,
      height: 400,
      background: C.panel,
      border: `4px solid ${AMBER}`,
      borderRadius: 18,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 10px 22px',
      opacity: show,
      transform: `translateY(${(1 - show) * 60}px) scale(${0.85 + 0.15 * show})`,
      boxShadow: '0 20px 60px #000',
    }}
  >
    <div style={{alignSelf: 'flex-start', marginLeft: 12, fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.bg, background: AMBER, padding: '4px 12px', borderRadius: 6}}>
      EXHIBIT {letter}
    </div>
    <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>{children}</div>
    <div style={{fontFamily: DISPLAY, fontSize: 40, lineHeight: 1.05, letterSpacing: 1.5, color: C.white, textAlign: 'center'}}>{label}</div>
  </div>
);

/** Round cockpit-style gauge with a needle. */
export const Gauge: React.FC<{size: number; label: string; value: string; unit: string; amount: number; show: number}> = ({size, label, value, unit, amount, show}) => {
  const a = -220 + amount * 260;
  return (
    <div style={{opacity: show, transform: `scale(${0.7 + 0.3 * show})`, textAlign: 'center'}}>
      <svg width={size} height={size} viewBox="-100 -100 200 200">
        <circle r={94} fill="#0b1119" stroke={AMBER} strokeWidth={5} />
        {Array.from({length: 14}, (_, i) => {
          const t = ((-220 + i * 20) * Math.PI) / 180;
          return <line key={i} x1={Math.cos(t) * 78} y1={Math.sin(t) * 78} x2={Math.cos(t) * 90} y2={Math.sin(t) * 90} stroke={C.white} strokeWidth={3} opacity={0.6} />;
        })}
        <line x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 70} y2={Math.sin((a * Math.PI) / 180) * 70} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        <circle r={8} fill={C.white} />
        <text y={44} textAnchor="middle" fontFamily={DISPLAY} fontSize={34} fill={C.white} letterSpacing={1}>
          {value}
        </text>
        <text y={66} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={13} fill={C.dim} letterSpacing={2}>
          {unit}
        </text>
      </svg>
      <div style={{fontFamily: DISPLAY, fontSize: 54, color: AMBER, letterSpacing: 3, marginTop: 6}}>{label}</div>
    </div>
  );
};

/** Subtle film grain + scratches for the 1971 case-file look. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.5}}>
      <svg width={W} height={H}>
        {Array.from({length: 70}, (_, i) => (
          <circle key={i} cx={rnd(i + frame * 13) * W} cy={rnd(i * 3 + frame * 7) * H} r={1 + rnd(i + frame) * 1.6} fill="#fff" opacity={0.12} />
        ))}
        {frame % 9 < 2 ? <line x1={rnd(frame) * W} y1={0} x2={rnd(frame) * W + 6} y2={H} stroke="#fff" strokeWidth={1.5} opacity={0.12} /> : null}
      </svg>
    </AbsoluteFill>
  );
};
