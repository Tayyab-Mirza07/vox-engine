import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {rnd} from '../lib';

// Flat poster palette: cream paper, ink black, crime red, gold.
export const CREAM = '#efe2c4';
export const INK = '#0b0a09';
export const RED = '#d62828';
export const GOLD = '#f2b632';
export const NAVY = '#12192b';

/** Flat poster background with a soft vignette and halftone dots. */
export const Poster: React.FC<{bg?: string; dots?: string; vignette?: number}> = ({bg = CREAM, dots = '#00000018', vignette = 0.35}) => (
  <AbsoluteFill style={{background: bg}}>
    <AbsoluteFill style={{backgroundImage: `radial-gradient(${dots} 2px, transparent 2.4px)`, backgroundSize: '14px 14px'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`}} />
  </AbsoluteFill>
);

/** Sun-ray burst behind a subject (classic pulp-poster look). */
export const Rays: React.FC<{color?: string; n?: number; spin?: number; opacity?: number}> = ({color = '#00000014', n = 18, spin = 0.15, opacity = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width="100%" height="100%" viewBox="-540 -960 1080 1920" style={{transform: `rotate(${frame * spin}deg)`}}>
        {Array.from({length: n}, (_, i) => (
          <path key={i} d="M0 0 L-140 -2200 L140 -2200 Z" fill={color} transform={`rotate(${(i * 360) / n})`} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

type Pose = 'stand' | 'walk' | 'gun' | 'up' | 'run' | 'tommy';
/** 1930s man silhouette: fedora (or police cap), long coat. */
export const Man: React.FC<{h: number; pose?: Pose; hat?: 'fedora' | 'cap' | 'none'; color?: string; flip?: boolean; step?: number; dress?: string}> = ({h, pose = 'stand', hat = 'fedora', color = INK, flip, step = 0, dress}) => {
  const sw = Math.sin(step) * 26;
  const run = pose === 'run';
  return (
    <svg width={h / 2} height={h} viewBox="0 0 200 400" style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <g fill={color}>
        <ellipse cx={100} cy={58} rx={27} ry={31} />
        {hat === 'fedora' ? <path d="M58 44 L142 44 Q150 44 150 50 Q100 56 50 50 Q50 44 58 44 Z M72 44 Q74 12 100 12 Q126 12 128 44 Z" /> : null}
        {hat === 'cap' ? <path d="M70 40 Q100 8 130 40 L150 44 L150 50 L68 50 Z" /> : null}
        {/* neck + coat */}
        <path d={dress ? 'M64 94 Q100 82 136 94 L130 170 L168 330 L32 330 L70 170 Z' : 'M60 94 Q100 82 140 94 L152 284 L48 284 Z'} fill={dress ?? color} />
        {/* legs */}
        {dress ? (
          <>
            <rect x={78} y={326} width={14} height={70} />
            <rect x={108} y={326} width={14} height={70} />
          </>
        ) : (
          <>
            <path d={`M70 270 L98 270 L${92 + (run ? sw * 1.6 : sw)} 400 L${66 + (run ? sw * 1.6 : sw)} 400 Z`} />
            <path d={`M102 270 L130 270 L${134 - (run ? sw * 1.6 : sw)} 400 L${108 - (run ? sw * 1.6 : sw)} 400 Z`} />
          </>
        )}
        {/* arms */}
        {pose === 'gun' ? (
          <>
            <path d="M136 100 L250 118 L250 134 L130 128 Z" />
            <path d="M240 104 L292 104 L292 116 L262 116 L258 134 L246 134 L246 116 L240 116 Z" />
            <path d="M64 100 L50 210 L64 212 L80 112 Z" />
          </>
        ) : null}
        {pose === 'tommy' ? (
          <>
            <path d="M70 120 L190 150 L186 166 L66 140 Z" />
            <path d="M120 140 L260 160 L258 176 L200 170 L196 196 L180 194 L182 168 L118 158 Z" />
            <circle cx={170} cy={186} r={16} />
          </>
        ) : null}
        {pose === 'up' ? (
          <>
            <path d="M62 100 L36 -10 L52 -14 L80 96 Z" />
            <path d="M138 100 L164 -10 L148 -14 L120 96 Z" />
          </>
        ) : null}
        {pose === 'stand' || pose === 'walk' || pose === 'run' ? (
          <>
            <path d={`M62 100 L${44 - sw * 0.5} 220 L${58 - sw * 0.5} 222 L78 112 Z`} />
            <path d={`M138 100 L${156 + sw * 0.5} 220 L${142 + sw * 0.5} 222 L122 112 Z`} />
          </>
        ) : null}
      </g>
    </svg>
  );
};

/** 1930s sedan side view. */
export const Car: React.FC<{w: number; color?: string; lights?: boolean}> = ({w, color = INK, lights}) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 500 210" style={{overflow: 'visible'}}>
    {lights ? <path d="M488 120 L800 60 L800 200 Z" fill="#fff6c8" opacity={0.35} /> : null}
    <g fill={color}>
      <path d="M20 150 Q20 112 60 108 L140 104 L170 46 Q176 36 190 36 L320 36 Q336 36 344 48 L380 104 L452 110 Q488 114 490 150 L490 168 L20 168 Z" />
      <path d="M40 112 Q60 96 100 98 L120 112 Z" />
      <path d="M380 104 Q440 92 480 120 L480 130 L380 120 Z" />
    </g>
    <path d="M186 56 L250 56 L250 100 L160 100 Z M262 56 L326 56 L356 100 L262 100 Z" fill="#f4e7c4" opacity={0.25} />
    <circle cx={120} cy={168} r={38} fill={color} />
    <circle cx={390} cy={168} r={38} fill={color} />
    <circle cx={120} cy={168} r={14} fill="#888" />
    <circle cx={390} cy={168} r={14} fill="#888" />
    <circle cx={482} cy={128} r={10} fill={lights ? '#fff6c8' : '#777'} />
  </svg>
);

/** Prison bars across the frame. */
export const Bars: React.FC<{n?: number; color?: string; open?: number; w?: number}> = ({n = 9, color = INK, open = 0, w = 26}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {Array.from({length: n}, (_, i) => {
      const x = ((i + 0.5) * 1080) / n - w / 2;
      const dx = open * (i < n / 2 ? -1 : 1) * 700;
      return <div key={i} style={{position: 'absolute', left: x + dx, top: 0, bottom: 0, width: w, background: color, boxShadow: '6px 0 0 #00000033'}} />;
    })}
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, height: 30, background: color}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 260, height: 30, background: color}} />
  </AbsoluteFill>
);

/** Pistol silhouette. `wood` paints it as carved wood. */
export const Pistol: React.FC<{w: number; wood?: number; color?: string}> = ({w, wood = 0, color = INK}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 400 250">
    <defs>
      <linearGradient id="woodg" x1="0" x2="1">
        <stop offset="0" stopColor="#8a5a2b" />
        <stop offset="0.5" stopColor="#b07a3f" />
        <stop offset="1" stopColor="#7a4a22" />
      </linearGradient>
    </defs>
    <path d="M20 40 L360 40 Q380 40 380 60 L380 92 L160 92 L150 120 L176 236 L104 240 L80 130 L60 92 L20 92 Z M150 120 Q190 124 200 92 L180 92 Z" fill={color} />
    <path d="M20 40 L360 40 Q380 40 380 60 L380 92 L160 92 L150 120 L176 236 L104 240 L80 130 L60 92 L20 92 Z" fill="url(#woodg)" opacity={wood} />
    {wood > 0 ? [60, 110, 170, 230, 290].map((x) => <path key={x} d={`M${x} 48 Q${x + 20} 66 ${x} 86`} stroke="#5a3515" strokeWidth={4} fill="none" opacity={wood * 0.8} />) : null}
  </svg>
);

/** Thompson submachine gun silhouette. */
export const Tommy: React.FC<{w: number; color?: string}> = ({w, color = INK}) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 500 200">
    <g fill={color}>
      <path d="M0 70 L60 60 L150 64 L150 96 L60 100 L0 110 Z" />
      <rect x={150} y={56} width={240} height={40} rx={8} />
      <rect x={380} y={66} width={120} height={16} />
      <path d="M190 96 L230 96 L220 170 L190 170 Z" />
      <circle cx={290} cy={134} r={44} />
      <path d="M330 96 L360 96 L370 150 L346 152 Z" />
    </g>
  </svg>
);

/** Small-town bank facade with columns. */
export const Bank: React.FC<{w: number; color?: string; sign?: string}> = ({w, color = INK, sign = 'BANK'}) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 600 480">
    <g fill={color}>
      <path d="M20 120 L300 20 L580 120 Z" />
      <rect x={40} y={130} width={520} height={40} />
      {[70, 190, 310, 430].map((x) => <rect key={x} x={x} y={180} width={60} height={240} />)}
      <rect x={20} y={420} width={560} height={50} />
    </g>
    <text x={300} y={160} textAnchor="middle" fontFamily="Anton, Impact" fontSize={34} fill={CREAM}>{sign}</text>
  </svg>
);

/** Movie theater marquee with chasing bulbs. */
export const Marquee: React.FC<{w: number; text: string; sub?: string}> = ({w, text, sub}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: w, background: INK, border: `10px solid ${GOLD}`, padding: '24px 20px', boxSizing: 'border-box', position: 'relative', boxShadow: '0 30px 60px #0008'}}>
      <div style={{position: 'absolute', inset: -4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', pointerEvents: 'none'}}>
        {Array.from({length: 22}, (_, i) => (
          <div key={i} style={{width: 16, height: 16, borderRadius: 8, margin: 2, background: (i + Math.floor(frame / 3)) % 3 === 0 ? '#fff6c8' : '#6a5020', boxShadow: (i + Math.floor(frame / 3)) % 3 === 0 ? '0 0 14px #fff6c8' : 'none'}} />
        ))}
      </div>
      <div style={{fontFamily: 'Anton, Impact', fontSize: w * 0.16, color: GOLD, textAlign: 'center', letterSpacing: 6, lineHeight: 1}}>{text}</div>
      {sub ? <div style={{fontFamily: 'Anton, Impact', fontSize: w * 0.06, color: CREAM, textAlign: 'center', marginTop: 10}}>{sub}</div> : null}
    </div>
  );
};

/** Flat flames (cartoon). */
export const Flames: React.FC<{w: number; h: number}> = ({w, h}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none">
      {Array.from({length: 9}, (_, i) => {
        const x = i * 12 - 4;
        const t = Math.sin(frame / 3 + i * 1.7) * 6;
        return (
          <g key={i}>
            <path d={`M${x} 100 Q${x + 2} ${55 + t} ${x + 7} ${30 + t} Q${x + 12} ${55 - t} ${x + 14} 100 Z`} fill={RED} />
            <path d={`M${x + 3} 100 Q${x + 5} ${70 + t} ${x + 7} ${55 + t} Q${x + 9} ${70 - t} ${x + 11} 100 Z`} fill={GOLD} />
          </g>
        );
      })}
    </svg>
  );
};

/** Sheriff star. */
export const Star: React.FC<{size: number; color?: string; ribbon?: boolean}> = ({size, color = GOLD, ribbon}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200">
    <path d={Array.from({length: 10}, (_, i) => {
      const r = i % 2 ? 40 : 90;
      const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      return `${i ? 'L' : 'M'}${Math.cos(a) * r} ${Math.sin(a) * r}`;
    }).join(' ') + 'Z'} fill={color} stroke={INK} strokeWidth={6} />
    <circle r={26} fill={INK} />
    {ribbon ? <path d="M-60 -60 L-30 -90 L90 40 L60 70 Z" fill={INK} opacity={0.9} /> : null}
  </svg>
);

/** Fingerprint drawn as concentric loops. */
export const Print: React.FC<{size: number; burn?: number}> = ({size, burn = 0}) => (
  <svg width={size} height={size * 1.25} viewBox="-50 -62 100 124">
    {Array.from({length: 9}, (_, i) => (
      <ellipse key={i} rx={8 + i * 5} ry={12 + i * 6} fill="none" stroke={INK} strokeWidth={2.4} strokeDasharray={i % 2 ? '14 4' : '30 6'} opacity={1 - burn * (i / 9)} />
    ))}
    {burn > 0 ? <ellipse rx={50 * burn} ry={62 * burn} fill={RED} opacity={0.35} /> : null}
  </svg>
);

/** Flash-bulb pop (white burst). */
export const Flash: React.FC<{at: number; dur?: number; color?: string}> = ({at, dur = 8, color = '#fff'}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > dur) return null;
  return <AbsoluteFill style={{background: color, opacity: 0.9 * (1 - t / dur), pointerEvents: 'none'}} />;
};

/** Rain streaks. */
export const Rain: React.FC<{n?: number; color?: string}> = ({n = 70, color = '#ffffff40'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const x = rnd(i) * 1180 - 50;
        const y = ((frame * (40 + rnd(i + 3) * 30) + rnd(i + 7) * 2000) % 2100) - 100;
        return <div key={i} style={{position: 'absolute', left: x - y * 0.12, top: y, width: 3, height: 60, background: color, transform: 'rotate(7deg)'}} />;
      })}
    </AbsoluteFill>
  );
};
