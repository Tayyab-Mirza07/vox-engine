import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, lerp, p, rnd, slam} from '../lib';
import {Faller, Forest, Jet, Paper, Typed} from '../dbcooper/parts';
import {TiltCard, has} from '../motion';

export const W2 = 1920;
export const H2 = 1080;
export const RED = '#e63946';
export const AMBER = '#f2b632';
export const BLUE = '#5aa9ff';
const PH = 'cooperlong/photos/';
const CR = {fbi: 'FBI · public domain', nw: 'Northwest Orient 727 · public domain', stair: 'Photo: Robert Rynerson · CC BY 2.5', nwb: 'Photo: Michael Bernhard · CC BY-SA 4.0'};
type SceneProps = {cue: Cues};

// ───────────────────────── landscape helpers ─────────────────────────
const Pos: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
const Mid: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => (
  <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
/** Small typewriter tag (dates, places). */
const Tag: React.FC<{at: number; until?: number; children: React.ReactNode; y?: number; color?: string}> = ({at, until = 1e9, children, y = 70, color = AMBER}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <Mid y={y} style={{opacity: p(frame, at, 8) * (1 - p(frame, until - 8, 8))}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 38, letterSpacing: 6, color, background: '#000000b8', padding: '8px 22px', borderRadius: 6}}>{children}</div>
    </Mid>
  );
};
const Big: React.FC<{at: number; children: React.ReactNode; y?: number; size?: number; color?: string; x?: number}> = ({at, children, y = 380, size = 180, color = RED, x}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = slam(frame, at, 1.8);
  const inner = <div style={{fontFamily: DISPLAY, fontSize: size, color, letterSpacing: 4, textShadow: `0 0 50px ${color}88, 0 10px 30px #000`, transform: `scale(${s.scale})`, opacity: s.opacity, whiteSpace: 'nowrap'}}>{children}</div>;
  return x === undefined ? <Mid y={y}>{inner}</Mid> : <Pos x={x} y={y}>{inner}</Pos>;
};
const LStamp: React.FC<{at: number; children: React.ReactNode; x?: number; y?: number; size?: number; color?: string; rotate?: number}> = ({at, children, x = 960, y = 440, size = 110, color = RED, rotate = -8}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = slam(frame, at, 3);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${s.scale})`, opacity: s.opacity, fontFamily: DISPLAY, fontSize: size, color, border: `10px solid ${color}`, borderRadius: 16, padding: '4px 30px', background: '#07090ccc', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 4}}>
      {children}
    </div>
  );
};
/** Night storm sky (landscape): stars or rain, drifting clouds, lightning. */
const Storm: React.FC<{rain?: number; flashes?: number[]; tint?: string}> = ({rain = 0.6, flashes = [], tint = '#0a1220'}) => {
  const frame = useCurrentFrame();
  const flash = flashes.reduce((m, at) => {
    const d = frame - at;
    return d >= 0 && d < 10 ? Math.max(m, (1 - d / 10) * (d % 3 === 1 ? 0.3 : 1)) : m;
  }, 0) + (rain > 0.5 && frame % 170 < 4 ? 0.5 : 0);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #03060c 0%, ${tint} 60%, #121c2c 100%)`}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {Array.from({length: 9}, (_, i) => {
          const x = ((rnd(i + 40) * (W2 + 900) + frame * (0.8 + rnd(i) * 1.6)) % (W2 + 900)) - 450;
          return <ellipse key={i} cx={x} cy={80 + rnd(i + 20) * 900} rx={300 + rnd(i + 5) * 260} ry={50 + rnd(i + 9) * 50} fill="#1b2638" opacity={0.4 + rain * 0.3} />;
        })}
        {rain > 0
          ? Array.from({length: 220}, (_, i) => {
              const y = ((rnd(i + 200) * (H2 + 300) + frame * (40 + rnd(i) * 30)) % (H2 + 300)) - 150;
              const x = (((rnd(i + 300) * (W2 + 400) - frame * 10) % (W2 + 400)) + W2 + 400) % (W2 + 400) - 100;
              return <line key={`r${i}`} x1={x} y1={y} x2={x - 18} y2={y + 70} stroke="#9fb4cf" strokeWidth={2} opacity={rain * (0.15 + rnd(i) * 0.3)} />;
            })
          : Array.from({length: 90}, (_, i) => <circle key={`s${i}`} cx={rnd(i) * W2} cy={rnd(i + 99) * H2 * 0.7} r={1 + rnd(i + 7) * 1.6} fill="#fff" opacity={0.2 + rnd(i + 3) * 0.4} />)}
      </svg>
      <AbsoluteFill style={{background: '#dbe8ff', opacity: Math.min(0.8, flash * 0.7)}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, #000000d0 100%)'}} />
    </AbsoluteFill>
  );
};
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, #000000e0 100%)'}} />;
/** Dark backdrop with a slowly drifting duotone glow and dust (always some motion). */
const Backdrop: React.FC<{tint?: string}> = ({tint = RED}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#06080c'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 600px at ${50 + Math.sin(frame / 90) * 12}% ${45 + Math.cos(frame / 110) * 8}%, ${tint}2e, transparent 70%)`}} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {Array.from({length: 50}, (_, i) => {
          const x = (rnd(i) * W2 + frame * (0.5 + rnd(i + 1) * 1.5)) % W2;
          const y = (rnd(i + 40) * H2 - frame * (0.2 + rnd(i + 2) * 0.6) + H2 * 10) % H2;
          return <circle key={i} cx={x} cy={y} r={1 + rnd(i + 3) * 2.2} fill="#fff" opacity={0.08 + rnd(i + 4) * 0.2} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
/** A real photo shown big with a slow 2.5D push (Ken Burns), darkened for drama. */
const PhotoBG: React.FC<{src: string; t: number; from?: number; to?: number; x0?: number; x1?: number; gray?: number; credit?: string; fit?: 'cover' | 'contain'}> = ({src, t, from = 1.05, to = 1.2, x0 = 0, x1 = 0, gray = 0.6, credit, fit = 'cover'}) => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    {has(src) ? (
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, transform: `translateX(${lerp(x0, x1, t)}px) scale(${lerp(from, to, t)})`, filter: `grayscale(${gray}) contrast(1.1) brightness(0.65)`}} />
    ) : null}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000aa 0%, transparent 25%, transparent 60%, #000000ee 100%)'}} />
    {credit && has(src) ? <div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: BODY, fontWeight: 800, fontSize: 18, color: '#ffffff88'}}>{credit}</div> : null}
  </AbsoluteFill>
);
const pick = (a: string, b: string) => (has(`${PH}${a}`) ? `${PH}${a}` : `${PH}${b}`);
/** Silhouette suspect card (no faces). */
const Suspect: React.FC<{name: string; note: string; show: number; rz?: number; color?: string}> = ({name, note, show, rz = 0, color = AMBER}) => (
  <div style={{width: 380, opacity: show, transform: `perspective(1400px) rotateY(${lerp(80, 0, show)}deg) rotateZ(${rz}deg)`}}>
    <div style={{background: '#efe6cf', padding: 14, paddingBottom: 70, borderRadius: 6, boxShadow: '0 30px 70px #000', position: 'relative'}}>
      <svg width={352} height={400} viewBox="0 0 300 340">
        <rect width={300} height={340} fill="#1b222c" />
        <circle cx={150} cy={130} r={66} fill="#0b0f14" />
        <path d="M 40 340 Q 50 220 150 210 Q 250 220 260 340 Z" fill="#0b0f14" />
        <text x={150} y={150} textAnchor="middle" fontFamily={DISPLAY} fontSize={70} fill={color} opacity={0.7}>
          ?
        </text>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontSize: 34, color: '#1a1712'}}>{name}</div>
        <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 18, color: '#5a4a30'}}>{note}</div>
      </div>
    </div>
  </div>
);
const Bills: React.FC<{n?: number; spread?: number}> = ({n = 14, spread = 1}) => (
  <svg width={900} height={420} viewBox="0 0 900 420">
    {Array.from({length: n}, (_, i) => (
      <g key={i} transform={`translate(${120 + (i % 7) * 100 * spread} ${80 + Math.floor(i / 7) * 150}) rotate(${(rnd(i) - 0.5) * 10})`}>
        {[0, 1, 2, 3].map((k) => <rect key={k} x={-k * 2} y={-k * 4} width={160} height={70} rx={6} fill="#7d9c6a" stroke="#2c3b24" strokeWidth={3} />)}
        <circle cx={80} cy={22} r={18} fill="#2c3b24" opacity={0.6} />
        <text x={18} y={58} fontFamily={DISPLAY} fontSize={22} fill="#2c3b24">
          20
        </text>
      </g>
    ))}
  </svg>
);
const Gauge: React.FC<{label: string; value: string; show: number; danger?: boolean}> = ({label, value, show, danger}) => (
  <div style={{width: 300, height: 220, borderRadius: 18, background: '#0b0f14', border: `5px solid ${danger ? RED : '#3a4656'}`, opacity: show, transform: `scale(${lerp(0.7, 1, show)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: danger ? `0 0 40px ${RED}66` : 'none'}}>
    <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: '#8a96a6'}}>{label}</div>
    <div style={{fontFamily: DISPLAY, fontSize: 60, color: danger ? RED : '#5dff9a', marginTop: 10}}>{value}</div>
  </div>
);
const Runway: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W2} height={H2} style={{position: 'absolute'}}>
      <polygon points="760,560 1160,560 1900,1080 20,1080" fill="#0d1218" />
      {Array.from({length: 14}, (_, i) => {
        const t = i / 14;
        const y = 570 + t * t * 520;
        const half = 200 + t * t * 760;
        const on = Math.floor(frame / 6 + i) % 14 < 2 ? 1 : 0.55;
        return (
          <g key={i}>
            <circle cx={960 - half} cy={y} r={3 + t * 8} fill={AMBER} opacity={on} />
            <circle cx={960 + half} cy={y} r={3 + t * 8} fill={AMBER} opacity={on} />
          </g>
        );
      })}
    </svg>
  );
};
const Walker: React.FC<{x: number; y: number; h: number; color?: string}> = ({x, y, h, color = '#05080c'}) => (
  <svg width={h * 0.5} height={h} viewBox="0 0 50 100" style={{position: 'absolute', left: x, top: y}}>
    <circle cx={25} cy={12} r={9} fill={color} />
    <rect x={14} y={22} width={22} height={40} rx={8} fill={color} />
    <rect x={15} y={60} width={8} height={38} fill={color} />
    <rect x={27} y={60} width={8} height={38} fill={color} />
  </svg>
);
const Cabin: React.FC<{dim?: number}> = ({dim = 0}) => (
  <svg width={W2} height={H2} style={{position: 'absolute'}}>
    <rect width={W2} height={H2} fill="#0b0e14" />
    <path d="M 0 0 L 1920 0 L 1500 300 L 420 300 Z" fill="#141a24" />
    <path d="M 0 1080 L 1920 1080 L 1500 760 L 420 760 Z" fill="#10141c" />
    {Array.from({length: 6}, (_, r) => {
      const t = r / 6;
      const s = 1 - t * 0.6;
      const y = 900 - t * 380;
      return [-1, 1].map((side) => (
        <g key={`${r}${side}`} transform={`translate(${960 + side * (520 - t * 300)} ${y}) scale(${s})`}>
          <rect x={-150} y={-180} width={300} height={200} rx={30} fill="#1c2430" />
          <rect x={-150} y={-230} width={300} height={70} rx={24} fill="#232d3b" />
          <circle cx={-60} cy={-250} r={34} fill="#07090c" opacity={r % 2 ? 0.9 : 0} />
          <circle cx={60} cy={-250} r={34} fill="#07090c" opacity={r % 3 ? 0.9 : 0} />
        </g>
      ));
    })}
    {Array.from({length: 6}, (_, i) => <rect key={i} x={440 + i * 180} y={310} width={60} height={30} rx={6} fill={AMBER} opacity={0.25} />)}
    <rect width={W2} height={H2} fill="#000" opacity={dim} />
  </svg>
);

// ───────────────────────── 0–3 · Cold open ─────────────────────────
export const S0: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const jump = cue.w('stepped');
  const fall = p(frame, jump, 80, (n) => n);
  return (
    <AbsoluteFill>
      <Storm rain={0.8} flashes={[jump - 2]} />
      <Pos x={lerp(1900, 380, p(frame, 0, cue.dur, (n) => n))} y={240} style={{transform: 'scaleX(-1)'}}>
        <Jet width={1100} stairs={1} lights />
      </Pos>
      {frame >= jump ? (
        <Pos x={lerp(1900, 380, p(frame, 0, cue.dur, (n) => n)) + 960 - fall * 160} y={330 + fall * 650} style={{transform: `rotate(${fall * 200}deg)`}}>
          <Faller size={110} color="#000" />
        </Pos>
      ) : null}
      <Pos x={0} y={820}>
        <Forest width={W2} height={260} color="#03060a" seed={3} />
      </Pos>
      <Tag at={cue.s(1)}>NOV 24, 1971 · 10,000 FT · WASHINGTON STATE</Tag>
    </AbsoluteFill>
  );
};
export const S1: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [loaf, cash] = [cue.w('loafers'), cue.w('strapped')];
  return (
    <AbsoluteFill>
      <Storm rain={1} flashes={[cue.s(1)]} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {/* the open aft stair, seen from behind the man */}
        <polygon points="600,300 1320,300 1500,1080 420,1080" fill="#0a0f16" />
        <polygon points="700,380 1220,380 1360,1080 560,1080" fill="#111820" />
        {Array.from({length: 9}, (_, i) => <rect key={i} x={590 + i * 2} y={440 + i * 70} width={740 - i * 4} height={14} fill="#1d2633" />)}
        {/* man: suit, tie flapping */}
        <g transform={`translate(960 ${lerp(620, 600, Math.sin(frame / 8) * 0.5 + 0.5)})`} fill="#000">
          <circle cx={0} cy={-230} r={46} />
          <path d="M -90 120 Q -96 -150 0 -170 Q 96 -150 90 120 Z" />
          <rect x={-70} y={110} width={50} height={190} />
          <rect x={20} y={110} width={50} height={190} />
          <path d={`M 0 -150 Q ${30 + Math.sin(frame / 3) * 30} -100 ${60 + Math.sin(frame / 2) * 40} -60`} stroke={RED} strokeWidth={10} fill="none" />
        </g>
      </svg>
      {frame >= loaf - 4 && frame < cash ? <Tag at={loaf - 4} y={840}>LOAFERS · NO JUMPSUIT · NO HELMET</Tag> : null}
      {frame >= cash ? (
        <>
          <Pos x={1180} y={600} style={{opacity: p(frame, cash, 8)}}>
            <svg width={260} height={220} viewBox="0 0 260 220">
              <path d="M 40 60 Q 130 10 220 60 L 240 200 L 20 200 Z" fill="#8a7046" stroke="#2a2014" strokeWidth={6} style={{filter: `drop-shadow(0 0 40px ${RED})`}} />
              <text x={130} y={150} textAnchor="middle" fontFamily={DISPLAY} fontSize={64} fill="#2a2014">
                $
              </text>
            </svg>
          </Pos>
          <Big at={cash + 6} y={160} size={190}>
            $200,000
          </Big>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
export const S2: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const items = [cue.s(2), cue.s(3), cue.s(4)];
  const t = p(frame, 0, 24);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Pos x={240} y={110}>
        <TiltCard src={`${PH}poster.jpg`} width={460} height={800} ry={lerp(60, 10, t)} rz={-3} scale={lerp(0.9, 1.05, p(frame, 0, cue.dur))} credit={CR.fbi} fit="contain" />
      </Pos>
      <div style={{position: 'absolute', left: 900, top: 220, display: 'flex', flexDirection: 'column', gap: 40}}>
        {['NO BODY', 'NO PARACHUTE', 'NO REAL NAME'].map((txt, i) => (
          <div key={txt} style={{opacity: p(frame, items[i] - 2, 6), transform: `translateX(${lerp(60, 0, p(frame, items[i] - 2, 8))}px)`, fontFamily: DISPLAY, fontSize: 110, color: '#f2f2f2', display: 'flex', alignItems: 'center', gap: 30}}>
            <span style={{color: RED}}>✘</span>
            {txt}
          </div>
        ))}
      </div>
      <Tag at={4} until={items[0] - 2}>THE ONLY UNSOLVED AIRLINE HIJACKING IN U.S. HISTORY</Tag>
    </AbsoluteFill>
  );
};
export const S3: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoBG src={`${PH}sketch.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={1.0} to={1.35} fit="contain" credit={`FBI composite sketch · ${CR.fbi}`} gray={1} />
      <Big at={cue.w('Who')} x={1240} y={300} size={360} color={RED}>
        ?
      </Big>
      <Tag at={4} until={cue.w('Who') - 2}>50+ YEARS · ONE QUESTION</Tag>
      {frame >= cue.w('survive') ? <Tag at={cue.w('survive')} y={840} color={RED}>DID HE SURVIVE THE JUMP?</Tag> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4–11 · The quiet passenger ─────────────────────────
export const S4: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const dan = cue.w('Dan');
  return (
    <AbsoluteFill style={{background: '#0d1016'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <rect x={0} y={0} width={W2} height={H2} fill="#121722" />
        <rect x={300} y={160} width={1320} height={120} fill="#7a1010" />
        <text x={960} y={245} textAnchor="middle" fontFamily={DISPLAY} fontSize={78} fill="#f2f2f2" letterSpacing={8}>
          NORTHWEST ORIENT
        </text>
        <rect x={200} y={560} width={1520} height={260} fill="#2a2f38" />
        <rect x={200} y={540} width={1520} height={30} fill="#3a4250" />
        {/* agent behind counter */}
        <g fill="#0a0d12">
          <circle cx={1300} cy={420} r={50} />
          <path d="M 1200 560 Q 1210 470 1300 460 Q 1390 470 1400 560 Z" />
        </g>
        {/* the man, from behind, raincoat + briefcase */}
        <g transform={`translate(${lerp(500, 760, p(frame, 0, 60))} 0)`} fill="#000">
          <circle cx={0} cy={430} r={52} />
          <path d="M -110 1000 Q -120 560 0 520 Q 120 560 110 1000 Z" />
          <rect x={90} y={760} width={130} height={100} rx={10} />
          <rect x={130} y={740} width={50} height={24} rx={6} />
        </g>
      </svg>
      <Tag at={4}>PORTLAND INTERNATIONAL AIRPORT · NOV 24, 1971</Tag>
      {frame >= dan - 6 ? (
        <Pos x={1150} y={620} style={{opacity: p(frame, dan - 6, 8), transform: `perspective(1200px) rotateY(${lerp(70, -8, p(frame, dan - 6, 14))}deg) rotate(4deg)`}}>
          <Paper width={560} style={{padding: '24px 30px'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 18, letterSpacing: 4, opacity: 0.6}}>PASSENGER TICKET · FLIGHT 305</div>
            <div style={{fontFamily: DISPLAY, fontSize: 70, marginTop: 6}}>DAN COOPER</div>
            <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 28}}>PDX → SEA · ONE WAY · CASH $20</div>
          </Paper>
        </Pos>
      ) : null}
    </AbsoluteFill>
  );
};
export const S5: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const items = ['MID-40s', 'DARK SUIT', 'WHITE SHIRT', 'THIN BLACK TIE', 'RAINCOAT · BRIEFCASE'];
  return (
    <AbsoluteFill>
      <Backdrop tint={BLUE} />
      <Pos x={220} y={100}>
        <TiltCard src={`${PH}sketch-b.jpg`} width={520} height={820} ry={lerp(-40, 8, p(frame, 0, 20))} rx={4} scale={lerp(0.95, 1.04, p(frame, 0, cue.dur))} gray={1} credit={`FBI sketch B · ${CR.fbi}`} fit="cover" />
      </Pos>
      <Paper width={760} style={{position: 'absolute', left: 960, top: 180, padding: '36px 44px', transform: 'rotate(1.5deg)'}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 5, opacity: 0.6}}>WITNESS DESCRIPTION</div>
        {items.map((it, i) => (
          <div key={it} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 16, opacity: p(frame, cue.s(i + 1) - 3, 6)}}>
            <div style={{width: 40, height: 40, border: '4px solid #1a1712', fontFamily: DISPLAY, fontSize: 34, color: RED, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
            <div style={{fontFamily: DISPLAY, fontSize: 58}}>{it}</div>
          </div>
        ))}
      </Paper>
    </AbsoluteFill>
  );
};
export const S6: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [pax, seat] = [cue.s(1), cue.s(3)];
  if (frame < seat) {
    return (
      <AbsoluteFill>
        <PhotoBG src={pick('nw727.jpg', 'nw727b.jpg')} t={p(frame, 0, seat, (n) => n)} from={1.05} to={1.2} x0={40} x1={-40} gray={0.3} credit={has(`${PH}nw727.jpg`) ? CR.nw : CR.nwb} />
        {!has(`${PH}nw727.jpg`) && !has(`${PH}nw727b.jpg`) ? (
          <>
            <Storm rain={0} />
            <Pos x={lerp(-200, 500, p(frame, 0, seat))} y={330}>
              <Jet width={1000} gear={1} />
            </Pos>
          </>
        ) : null}
        <Tag at={4}>FLIGHT 305 · BOEING 727 · PORTLAND → SEATTLE</Tag>
        {frame >= pax ? <Tag at={pax} y={840} color="#f2f2f2">36 PASSENGERS · 6 CREW · 30 MINUTES</Tag> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Cabin />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {Array.from({length: 8}, (_, i) => {
          const life = (frame + i * 12) % 90;
          return <circle key={i} cx={1240 + Math.sin(life / 10 + i) * 30} cy={560 - life * 4} r={14 + life * 0.4} fill="#c9d0d8" opacity={(1 - life / 90) * 0.35} />;
        })}
        <g fill="#000">
          <circle cx={1240} cy={600} r={40} />
          <path d="M 1160 820 Q 1170 660 1240 650 Q 1310 660 1320 820 Z" />
        </g>
        <rect x={1300} y={700} width={40} height={60} rx={6} fill={AMBER} opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};
export const S7: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [note, slip] = [cue.w('note'), cue.s(2)];
  const fold = p(frame, slip, 20);
  return (
    <AbsoluteFill>
      <Cabin dim={0.2} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <g fill="#000">
          <circle cx={760} cy={300} r={60} />
          <path d="M 620 1080 Q 630 420 760 400 Q 890 420 900 1080 Z" />
          <path d="M 700 260 Q 760 200 820 260 L 830 300 L 690 300 Z" fill="#1a1d24" />
        </g>
      </svg>
      {frame >= note - 4 ? (
        <Pos x={lerp(1300, 900, p(frame, note - 4, 16))} y={lerp(560, 560 + fold * 200, 1)} style={{transform: `rotate(${lerp(-10, 20, fold)}deg) scale(${lerp(1, 0.4, fold)})`, opacity: 1 - p(frame, slip + 30, 10)}}>
          <Paper width={340} style={{padding: '22px 26px', minHeight: 200}}>
            <div style={{fontFamily: '"Brush Script MT", cursive', fontSize: 44, color: '#3a3020', filter: 'blur(3px)'}}>Miss —</div>
            <div style={{height: 10}} />
            {[0, 1, 2].map((k) => <div key={k} style={{height: 8, width: 240 - k * 40, background: '#3a3020', opacity: 0.4, marginTop: 14, filter: 'blur(2px)'}} />)}
          </Paper>
        </Pos>
      ) : null}
      <Tag at={4} until={slip - 2}>FLORENCE SCHAFFNER · FLIGHT ATTENDANT</Tag>
    </AbsoluteFill>
  );
};
export const S8: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const bomb = cue.s(2);
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <Backdrop />
      <Mid y={220} style={{transform: `perspective(1400px) rotateX(${lerp(20, 4, p(frame, 0, cue.dur))}deg) scale(${lerp(0.9, 1.1, p(frame, 0, cue.dur))})`}}>
        <Paper width={1100} style={{padding: '60px 70px', minHeight: 420}}>
          <Typed text="Miss — you'd better look at that note." at={4} cps={24} style={{fontSize: 64, lineHeight: 1.3}} />
          {frame >= bomb ? (
            <div style={{fontFamily: DISPLAY, fontSize: 150, color: RED, marginTop: 30, transform: `scale(${slam(frame, bomb, 1.8).scale})`}}>I HAVE A BOMB.</div>
          ) : null}
        </Paper>
      </Mid>
    </AbsoluteFill>
  );
};
export const S9: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const parts = [cue.s(1), cue.s(2), cue.s(3)];
  const open = p(frame, 4, 30);
  const beat = 1 + 0.03 * Math.max(0, Math.sin(frame / 4));
  return (
    <AbsoluteFill style={{background: '#080506'}}>
      <AbsoluteFill style={{background: `radial-gradient(700px 400px at 50% 60%, ${RED}${frame > parts[0] ? '44' : '22'}, transparent 70%)`}} />
      <Mid y={180} style={{transform: `scale(${beat})`}}>
        <svg width={1300} height={820} viewBox="0 0 1300 820">
          <g transform="translate(650 520)">
            <rect x={-500} y={-40} width={1000} height={300} rx={20} fill="#2a1f14" stroke="#5a4428" strokeWidth={8} />
            <g transform={`rotate(${-open * 70} -500 -40)`}>
              <rect x={-500} y={-340} width={1000} height={300} rx={20} fill="#3a2a1a" stroke="#5a4428" strokeWidth={8} />
            </g>
            {frame >= parts[0] - 4
              ? [0, 1, 2, 3, 4, 5, 6, 7].map((k) => <rect key={k} x={-420 + k * 70} y={20} width={50} height={190} rx={22} fill={RED} opacity={p(frame, parts[0] - 4 + k, 6)} />)
              : null}
            {frame >= parts[1] - 4
              ? [0, 1, 2, 3].map((k) => <path key={k} d={`M ${-400 + k * 120} 30 Q ${-300 + k * 140} ${-60 - k * 20} ${200 + k * 40} 60`} stroke={['#f2c94c', '#5aa9ff', '#e63946', '#5dff9a'][k]} strokeWidth={8} fill="none" opacity={p(frame, parts[1] - 4 + k * 3, 6)} />)
              : null}
            {frame >= parts[2] - 4 ? (
              <g opacity={p(frame, parts[2] - 4, 6)}>
                <rect x={180} y={40} width={220} height={150} rx={10} fill="#1a1d24" stroke="#888" strokeWidth={6} />
                <text x={290} y={135} textAnchor="middle" fontFamily={DISPLAY} fontSize={56} fill="#f2c94c">
                  +  –
                </text>
              </g>
            ) : null}
          </g>
        </svg>
      </Mid>
    </AbsoluteFill>
  );
};
export const S10: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const rows = [
    {at: cue.s(1), t: '$200,000 — IN $20 BILLS'},
    {at: cue.s(2), t: '4 PARACHUTES'},
    {at: cue.s(3), t: 'FUEL TRUCK IN SEATTLE'},
    {at: cue.s(4), t: '"NO FUNNY STUFF"'},
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Mid y={110} style={{transform: `perspective(1600px) rotateY(${lerp(-12, 10, p(frame, 0, cue.dur))}deg) rotateX(6deg)`}}>
        <Paper width={1200} style={{padding: '50px 64px', minHeight: 760}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 6, opacity: 0.6}}>THE DEMANDS</div>
          {rows.map((r, i) =>
            frame >= r.at - 2 ? (
              <div key={i} style={{marginTop: 26}}>
                <Typed text={r.t} at={r.at - 2} cps={30} style={{fontSize: 72, color: i === 3 ? '#7a1010' : '#1a1712'}} />
              </div>
            ) : null,
          )}
        </Paper>
      </Mid>
    </AbsoluteFill>
  );
};
export const S11: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const calm = cue.s(1);
  return (
    <AbsoluteFill>
      <PhotoBG src={`${PH}sketch-b.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={1.1} to={1.6} fit="contain" gray={1} credit={`FBI sketch B · ${CR.fbi}`} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(0, 0.35, p(frame, calm, 30))}} />
      <LStamp at={calm + 8} x={1460} y={520} size={120} color={AMBER}>
        Too calm
      </LStamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12–18 · Ransom on the runway ─────────────────────────
const SEATTLE: LonLat = [-122.31, 47.45];
const MCCHORD: LonLat = [-122.48, 47.14];
export const S12: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const a = (frame / 90) * Math.PI * 2;
  return (
    <AbsoluteFill style={{background: '#05080c'}}>
      <Mid y={-200}>
        <Globe width={1800} height={1500} center={SEATTLE} scale={lerp(9000, 12000, p(frame, 0, cue.dur))} routes={[]} pins={[{at: SEATTLE, label: 'SEATTLE', show: 1, align: 'right'}]} frame={frame} />
      </Mid>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <ellipse cx={960} cy={560} rx={420} ry={260} fill="none" stroke={AMBER} strokeWidth={6} strokeDasharray="20 20" strokeDashoffset={-frame * 3} />
        <g transform={`translate(${960 + Math.cos(a) * 420} ${560 + Math.sin(a) * 260}) rotate(${(a * 180) / Math.PI + 180})`}>
          <path d="M 0 -40 L 10 -10 L 46 6 L 46 14 L 10 6 L 6 30 L 18 38 L 18 44 L 0 40 L -18 44 L -18 38 L -6 30 L -10 6 L -46 14 L -46 6 L -10 -10 Z" fill="#f2f2f2" />
        </g>
      </svg>
      <Tag at={4}>CIRCLING SEATTLE · NEARLY 2 HOURS</Tag>
      {frame >= cue.s(1) ? <Tag at={cue.s(1)} y={840} color="#f2f2f2">PASSENGERS TOLD: "MECHANICAL DELAY"</Tag> : null}
    </AbsoluteFill>
  );
};
export const S13: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const base = cue.w('McChord');
  return (
    <AbsoluteFill style={{background: '#0b0e14'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <defs>
          <clipPath id="win">
            <rect x={560} y={140} width={800} height={720} rx={300} />
          </clipPath>
        </defs>
        <rect width={W2} height={H2} fill="#1a202a" />
        <g clipPath="url(#win)">
          <rect x={560} y={140} width={800} height={720} fill="#06090f" />
          {Array.from({length: 160}, (_, i) => {
            const x = 560 + ((rnd(i) * 900 + frame * 1.2) % 900);
            const y = 300 + rnd(i + 7) * 560;
            return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 2) * 2.5} fill={i % 7 ? AMBER : '#fff'} opacity={0.4 + rnd(i + 3) * 0.6} />;
          })}
          {frame >= base ? (
            <g opacity={p(frame, base, 10)}>
              <rect x={900} y={560} width={360} height={14} fill="#5aa9ff" />
              <rect x={940} y={620} width={300} height={10} fill="#5aa9ff" opacity={0.7} />
              <circle cx={1080} cy={567} r={30 + ((frame - base) % 30)} fill="none" stroke={RED} strokeWidth={5} opacity={1 - ((frame - base) % 30) / 30} />
            </g>
          ) : null}
        </g>
        <rect x={560} y={140} width={800} height={720} rx={300} fill="none" stroke="#2a3342" strokeWidth={40} />
      </svg>
      {frame >= base ? <Tag at={base} y={840}>McCHORD AIR FORCE BASE — "HE KNEW THIS AREA"</Tag> : null}
    </AbsoluteFill>
  );
};
export const S14: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const photo = cue.w('photograph');
  const flash = frame >= photo && (frame - photo) % 14 < 2 ? 0.7 : 0;
  return (
    <AbsoluteFill style={{background: '#0a0c08'}}>
      <AbsoluteFill style={{background: 'radial-gradient(600px 400px at 50% 30%, #f2c94c33, transparent 70%)'}} />
      <Mid y={260} style={{transform: `scale(${lerp(0.9, 1.05, p(frame, 0, cue.dur))})`}}>
        <Bills n={14} />
      </Mid>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, height: 60, overflow: 'hidden', fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, color: '#5dff9a', whiteSpace: 'nowrap'}}>
        <div style={{transform: `translateX(${-frame * 6}px)`}}>{Array.from({length: 40}, (_, i) => `L${String(Math.floor(rnd(i) * 99999999)).padStart(8, '0')}A  `).join('')}</div>
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <Tag at={4}>10,000 BILLS · EVERY SERIAL NUMBER RECORDED</Tag>
    </AbsoluteFill>
  );
};
export const S15: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [walk, keep] = [cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Storm rain={0.5} />
      <Runway />
      <Pos x={560} y={360}>
        <Jet width={800} stairs={1} gear={1} />
      </Pos>
      {frame >= walk
        ? Array.from({length: 10}, (_, i) => {
            const t = p(frame, walk + i * 6, 90, (n) => n);
            return t > 0 && t < 1 ? <Walker key={i} x={lerp(640, 120, t)} y={lerp(560, 760, t)} h={lerp(80, 180, t)} /> : null;
          })
        : null}
      <Tag at={4}>5:39 PM · SEATTLE-TACOMA AIRPORT</Tag>
      {frame >= keep ? <Tag at={keep} y={840} color="#f2f2f2">KEPT ON BOARD: 2 PILOTS · 1 FLIGHT ENGINEER · TINA MUCKLOW</Tag> : null}
    </AbsoluteFill>
  );
};
export const S16: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoBG src={`${PH}sketch.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={1.4} to={1.1} fit="contain" gray={1} credit={CR.fbi} />
      <LStamp at={cue.s(1) + 10} x={1400} y={540} size={120}>
        No amateur
      </LStamp>
    </AbsoluteFill>
  );
};
export const S17: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const g = [
    {l: 'DESTINATION', v: 'MEXICO CITY'},
    {l: 'ALTITUDE', v: '< 10,000 FT'},
    {l: 'LANDING GEAR', v: 'DOWN'},
    {l: 'WING FLAPS', v: '15°'},
    {l: 'CABIN', v: 'UNPRESSURIZED', d: true},
  ];
  return (
    <AbsoluteFill style={{background: '#06090e'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b1220, #05070a)'}} />
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '0 120px'}}>
        {g.map((x, i) => (
          <Gauge key={x.l} label={x.l} value={x.v} show={p(frame, cue.s(i) - 3, 8)} danger={x.d} />
        ))}
      </div>
      <Tag at={4}>COOPER'S ORDERS</Tag>
    </AbsoluteFill>
  );
};
export const S18: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const q = cue.s(2);
  const lower = p(frame, q, 40);
  return (
    <AbsoluteFill>
      <Backdrop tint={BLUE} />
      <Pos x={110} y={170}>
        <TiltCard src={pick('airstair.jpg', 'nw727.jpg')} width={820} height={560} ry={lerp(30, 6, p(frame, 0, 24))} rz={-2} credit={has(`${PH}airstair.jpg`) ? CR.stair : CR.nw} fallback={<Jet width={800} stairs={1} />} />
      </Pos>
      <Pos x={1010} y={340}>
        <Jet width={820} stairs={lower} gear={1} />
      </Pos>
      {frame >= q ? <Big at={q + 20} x={1580} y={180} size={240} color={RED}>?</Big> : null}
      <Tag at={4}>SLOW · LOW · SAFE TO JUMP FROM</Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 19–25 · The jump ─────────────────────────
export const S19: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sent, waist] = [cue.s(1), cue.s(3)];
  if (frame < sent) {
    return (
      <AbsoluteFill>
        <Storm rain={1} flashes={[10, 60]} />
        <Pos x={lerp(-300, 900, p(frame, 0, sent))} y={lerp(700, 260, p(frame, 0, sent))} style={{transform: 'rotate(-12deg)'}}>
          <Jet width={900} gear={1} stairs={0} />
        </Pos>
        <Tag at={4}>7:40 PM · TAKEOFF FROM SEATTLE · DESTINATION MEXICO CITY</Tag>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Cabin dim={0.45} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <g fill="#000">
          <circle cx={1640} cy={380} r={56} />
          <path d="M 1520 1080 Q 1530 480 1640 460 Q 1750 480 1760 1080 Z" />
        </g>
        <g transform="translate(960 560) scale(0.55)" fill="#000" opacity={0.9}>
          <circle cx={0} cy={-230} r={46} />
          <path d="M -90 120 Q -96 -150 0 -170 Q 96 -150 90 120 Z" />
          {frame >= waist ? <rect x={-100} y={0} width={200} height={40} fill={RED} opacity={p(frame, waist, 8)} /> : null}
        </g>
      </svg>
      <Tag at={sent} until={waist - 2} color="#f2f2f2">TINA MUCKLOW · THE LAST PERSON TO SEE HIM</Tag>
    </AbsoluteFill>
  );
};
export const S20: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#05070b'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <rect x={160} y={300} width={1600} height={520} rx={30} fill="#0d121a" stroke="#2a3342" strokeWidth={10} />
        {Array.from({length: 10}, (_, i) => <circle key={i} cx={300 + i * 150} cy={420} r={40} fill="#0b0f14" stroke="#3a4656" strokeWidth={6} />)}
      </svg>
      <Mid y={560}>
        <div style={{fontFamily: DISPLAY, fontSize: 130, color: on ? '#fff' : '#661a1a', background: on ? RED : '#2a0a0a', padding: '10px 50px', borderRadius: 14, boxShadow: on ? `0 0 90px ${RED}` : 'none', letterSpacing: 8}}>AFT STAIR</div>
      </Mid>
    </AbsoluteFill>
  );
};
export const S21: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const bump = cue.s(1);
  const jolt = frame >= bump - 6 && frame < bump + 12 ? Math.sin((frame - bump + 6) / 2) * 6 * (1 - p(frame, bump, 12)) : 0;
  return (
    <AbsoluteFill>
      <Storm rain={1} flashes={[bump - 6]} />
      <Pos x={380} y={300} style={{transform: `rotate(${jolt}deg) translateY(${-Math.abs(jolt) * 6}px)`, transformOrigin: '20% 50%'}}>
        <Jet width={1200} stairs={1} gear={1} />
      </Pos>
      <Tag at={4}>8:13 PM · SOUTHWEST WASHINGTON</Tag>
      <Big at={bump - 6} y={760} size={110} color={AMBER}>PRESSURE BUMP</Big>
    </AbsoluteFill>
  );
};
export const S22: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const t = p(frame, 0, cue.dur, (n) => n);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #05080d, #0d1520)'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {Array.from({length: 14}, (_, i) => {
          const y = ((rnd(i) * 1600 - frame * (6 + rnd(i + 1) * 10)) % 1600 + 1600) % 1600 - 300;
          return <ellipse key={i} cx={rnd(i + 4) * W2} cy={y} rx={300 + rnd(i + 2) * 300} ry={60 + rnd(i + 3) * 40} fill="#1c2738" opacity={0.6} />;
        })}
        {Array.from({length: 200}, (_, i) => {
          const y = ((rnd(i + 9) * 1300 - frame * 30) % 1300 + 1300) % 1300 - 100;
          return <line key={`r${i}`} x1={rnd(i) * W2} y1={y} x2={rnd(i) * W2 - 6} y2={y + 60} stroke="#9fb4cf" strokeWidth={2} opacity={0.3} />;
        })}
      </svg>
      <Pos x={900 + Math.sin(frame / 10) * 40} y={lerp(140, 420, t)} style={{transform: `rotate(${frame * 2}deg)`}}>
        <Faller size={150} color="#000" />
      </Pos>
      <Pos x={0} y={lerp(1080, 700, t)}>
        <Forest width={W2} height={400} color="#020406" seed={8} />
      </Pos>
      <Tag at={cue.s(1)} y={70} color="#9fb4cf">
        FREEZING WINDS · DRIVING RAIN · A BUSINESS SUIT · LOAFERS
      </Tag>
    </AbsoluteFill>
  );
};
export const S23: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [agents, rush] = [cue.s(1), cue.s(2)];
  const siren = Math.floor(frame / 6) % 2;
  if (frame >= rush + 20) {
    return (
      <AbsoluteFill>
        <Cabin dim={0.1} />
        <svg width={W2} height={H2} style={{position: 'absolute'}}>
          {[0, 1, 2].map((k) => (
            <polygon key={k} points={`${300 + k * 600},1080 ${700 + k * 300},${300 + k * 40} ${800 + k * 300},${300 + k * 40}`} fill="#fff6d8" opacity={0.12} />
          ))}
        </svg>
        <Big at={rush + 30} y={420} size={140} color="#f2f2f2">EMPTY</Big>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Storm rain={0.2} />
      <Runway />
      <Pos x={620} y={380}>
        <Jet width={700} stairs={1} gear={1} />
      </Pos>
      <AbsoluteFill style={{background: siren ? '#e6394622' : '#5aa9ff22'}} />
      {frame >= agents
        ? Array.from({length: 8}, (_, i) => {
            const t = p(frame, agents + i * 3, 50);
            return <Walker key={i} x={lerp(i % 2 ? 1900 : -100, 760 + i * 30, t)} y={lerp(780, 600, t)} h={lerp(200, 110, t)} />;
          })
        : null}
      <Tag at={4}>10:15 PM · RENO, NEVADA</Tag>
    </AbsoluteFill>
  );
};
export const S24: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const tie = cue.w('tie');
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <AbsoluteFill style={{background: `radial-gradient(500px 360px at 50% 60%, ${RED}33, transparent 70%)`}} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <path d="M 660 1000 L 660 520 Q 660 460 720 460 L 1200 460 Q 1260 460 1260 520 L 1260 1000 Z" fill="#141a24" />
        <rect x={720} y={380} width={480} height={120} rx={30} fill="#141a24" />
        <polygon points="960,0 700,1080 1220,1080" fill="#fff6d8" opacity={0.08} />
        {[0, 1].map((k) => (
          <g key={k} opacity={p(frame, 10 + k * 8, 10)} transform={`translate(${380 + k * 1000} 760)`}>
            <rect x={-90} y={-60} width={180} height={140} rx={30} fill="#3a4a2a" stroke="#1d2614" strokeWidth={5} />
            <line x1={-60} y1={-40} x2={60} y2={60} stroke="#1d2614" strokeWidth={4} />
          </g>
        ))}
        {frame >= tie - 6 ? (
          <g transform={`translate(960 700) rotate(-20) scale(${lerp(0.6, 1.2, p(frame, tie - 6, 20))})`} opacity={p(frame, tie - 6, 8)}>
            <path d="M -14 -150 L 14 -150 L 20 -120 L 34 120 L 0 160 L -34 120 L -20 -120 Z" fill="#050505" stroke="#444" strokeWidth={3} />
            <rect x={-26} y={-170} width={52} height={24} rx={6} fill="#888" />
          </g>
        ) : null}
      </svg>
      {frame >= tie ? <Tag at={tie} y={840} color="#f2f2f2">LEFT BEHIND: 2 PARACHUTES · 8 CIGARETTE BUTTS · A BLACK CLIP-ON TIE</Tag> : null}
    </AbsoluteFill>
  );
};
export const S25: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const boy = cue.s(1);
  const year = Math.min(1980, 1971 + Math.floor(p(frame, 6, boy - 10, (n) => n) * 9));
  return (
    <AbsoluteFill>
      <Backdrop tint={AMBER} />
      <Mid y={240} style={{perspective: 1400}}>
        <div key={year} style={{width: 560, borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 80px #000', transform: `rotateX(${(frame % 8) * 4}deg)`}}>
          <div style={{background: RED, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 6}}>NO MONEY FOUND</div>
          <div style={{background: '#efe6cf', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 200, color: '#1a1712'}}>{year}</div>
        </div>
      </Mid>
      {frame >= boy ? <Tag at={boy} y={840} color={AMBER}>UNTIL A LITTLE BOY WENT DIGGING…</Tag> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 26–33 · The money in the river ─────────────────────────
export const S26: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const heli = cue.w('Helicopters');
  return (
    <AbsoluteFill>
      <Storm rain={0.3} />
      <Pos x={0} y={460}>
        <Forest width={W2} height={420} color="#050a07" seed={5} />
      </Pos>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, height: 200, background: '#050a07'}} />
      {Array.from({length: 14}, (_, i) => <Walker key={i} x={((i * 140 + frame * 1.2) % 2100) - 100} y={800} h={130} />)}
      {frame >= heli - 10 ? (
        <Pos x={lerp(-300, 1300, p(frame, heli - 10, 140, (n) => n))} y={160}>
          <svg width={360} height={360} viewBox="0 0 360 360" style={{overflow: 'visible'}}>
            <polygon points="170,110 40,700 320,700" fill="#fff6d8" opacity={0.12} />
            <ellipse cx={170} cy={90} rx={90} ry={44} fill="#05080c" />
            <rect x={240} y={80} width={110} height={14} fill="#05080c" />
            <rect x={60 + (frame % 4) * 10} y={34} width={220} height={8} fill="#05080c" />
          </svg>
        </Pos>
      ) : null}
      <Tag at={4}>ONE OF THE LARGEST MANHUNTS IN U.S. HISTORY</Tag>
    </AbsoluteFill>
  );
};
export const S27: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const it = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', top: 240, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 80}}>
        {['PARACHUTE', 'BODY', 'MONEY'].map((t, i) => (
          <div key={t} style={{opacity: p(frame, it[i] - 2, 6), textAlign: 'center'}}>
            <div style={{fontFamily: DISPLAY, fontSize: 200, color: RED, lineHeight: 1}}>0</div>
            <div style={{fontFamily: DISPLAY, fontSize: 64, color: '#f2f2f2', letterSpacing: 4}}>{t}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
export const S28: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const waited = cue.s(1);
  const years = Math.floor(p(frame, waited, cue.dur - waited - 20, (n) => n) * 9);
  return (
    <AbsoluteFill>
      <PhotoBG src={`${PH}poster.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={1.0} to={1.25} fit="contain" gray={1} credit={`FBI bulletin · ${CR.fbi}`} />
      {frame >= waited ? (
        <Pos x={1260} y={260}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: DISPLAY, fontSize: 280, color: AMBER, lineHeight: 1}}>{years}</div>
            <div style={{fontFamily: DISPLAY, fontSize: 70, color: '#f2f2f2'}}>{years === 1 ? 'YEAR' : 'YEARS'} · 0 BILLS</div>
          </div>
        </Pos>
      ) : null}
    </AbsoluteFill>
  );
};
export const S29: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rake, cash] = [cue.w('raking'), cue.w('bundles')];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a3a55 0%, #b0704a 40%, #3a4a5a 60%)'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <circle cx={1500} cy={420} r={80} fill="#f2c94c" opacity={0.7} />
        <path d={`M 0 600 Q 480 ${580 + Math.sin(frame / 20) * 10} 960 600 T 1920 600 L 1920 760 L 0 760 Z`} fill="#3a5470" />
        <path d="M 0 740 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#c9b48a" />
        <g transform={`translate(760 ${780 + Math.sin(frame / 6) * 4})`} fill="#1a1410">
          <circle cx={0} cy={-150} r={30} />
          <rect x={-26} y={-120} width={52} height={100} rx={14} />
          <rect x={-22} y={-24} width={16} height={80} />
          <rect x={6} y={-24} width={16} height={80} />
          <line x1={20} y1={-90} x2={120 + Math.sin(frame / 5) * 20} y2={60} stroke="#1a1410" strokeWidth={8} />
        </g>
        {frame >= cash - 4
          ? [0, 1, 2].map((k) => (
              <g key={k} transform={`translate(${960 + k * 90} ${880 - k * 6}) rotate(${k * 8 - 8})`} opacity={p(frame, cash - 4 + k * 4, 8)}>
                <rect x={0} y={0} width={120} height={56} rx={6} fill="#6a7a50" stroke="#2c3b24" strokeWidth={4} style={{filter: `drop-shadow(0 0 20px ${AMBER})`}} />
                <rect x={50} y={0} width={10} height={56} fill="#c06030" />
              </g>
            ))
          : null}
      </svg>
      <Tag at={4}>FEBRUARY 1980 · TENA BAR, COLUMBIA RIVER</Tag>
      {frame >= rake ? <Tag at={rake} y={150} color="#f2f2f2">BRIAN INGRAM, AGE 8</Tag> : null}
    </AbsoluteFill>
  );
};
export const S30: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const match = cue.s(2);
  return (
    <AbsoluteFill>
      <Backdrop tint={AMBER} />
      <Pos x={160} y={160}>
        <TiltCard src={`${PH}money.jpg`} width={940} height={640} ry={lerp(-40, 6, p(frame, 0, 20))} scale={lerp(0.95, 1.06, p(frame, 0, cue.dur))} credit={`Ransom bills found in 1980 · ${CR.fbi}`} />
      </Pos>
      <Big at={4} x={1200} y={230} size={190} color={AMBER}>$5,800</Big>
      <LStamp at={match + 4} x={1500} y={640} size={100} color="#3ad66b" rotate={-6}>
        Match ✓
      </LStamp>
    </AbsoluteFill>
  );
};
const TENA: LonLat = [-122.78, 45.72];
const ARIEL: LonLat = [-122.55, 45.95];
export const S31: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const miles = cue.s(2);
  return (
    <AbsoluteFill style={{background: '#05080c'}}>
      <Mid y={-300}>
        <Globe width={1900} height={1700} center={[-122.66, 45.84]} scale={lerp(26000, 30000, p(frame, 0, cue.dur))} routes={frame >= miles ? [{from: ARIEL, to: TENA, progress: p(frame, miles, 30)}] : []} pins={[{at: TENA, label: 'MONEY FOUND', show: p(frame, 6, 10), align: 'left'}, {at: ARIEL, label: 'LIKELY LANDING ZONE', show: p(frame, miles - 4, 10), align: 'right'}]} frame={frame} />
      </Mid>
      <Tag at={cue.s(1)} until={miles - 2} color="#f2f2f2">STILL BUNDLED · STILL IN RUBBER BANDS</Tag>
    </AbsoluteFill>
  );
};
export const S32: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const missing = cue.s(4);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #05080c 0%, #0b1622 60%)'}}>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M 0 ${560 + k * 110} Q 480 ${540 + k * 110 + Math.sin(frame / 20 + k) * 14} 960 ${560 + k * 110} T 1920 ${560 + k * 110} L 1920 1080 L 0 1080 Z`} fill={['#0d1a28', '#0a1420', '#07101a'][k]} />
        ))}
        {Array.from({length: 9}, (_, i) => (
          <text key={i} x={((rnd(i) * 1920 + frame * (1 + rnd(i + 1))) % 2100) - 100} y={640 + (i % 3) * 110 + Math.sin(frame / 15 + i) * 10} fontFamily={DISPLAY} fontSize={70 + (i % 3) * 30} fill={RED} opacity={0.5}>
            ?
          </text>
        ))}
      </svg>
      {frame >= missing ? <Big at={missing} y={200} size={150} color={AMBER}>$194,000 MISSING</Big> : null}
    </AbsoluteFill>
  );
};
export const S33: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoBG src={`${PH}sketch.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={1.0} to={1.5} fit="contain" gray={1} credit={CR.fbi} />
      <Big at={cue.w('who')} y={80} size={170} color={RED}>WHO WAS HE?</Big>
    </AbsoluteFill>
  );
};

// ───────────────────────── 34–40 · The suspects ─────────────────────────
export const S34: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const strike = p(frame, cue.w('stuck') - 20, 14);
  return (
    <AbsoluteFill>
      <Backdrop tint={AMBER} />
      <Mid y={120} style={{transform: `perspective(1600px) rotateX(${lerp(30, 6, p(frame, 0, 30))}deg) rotate(-1.5deg)`}}>
        <div style={{width: 1300, background: '#e8e0cc', padding: '40px 60px', boxShadow: '0 40px 100px #000'}}>
          <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 30, borderBottom: '4px double #1a1712', paddingBottom: 10, letterSpacing: 4}}>THE EVENING EDITION · NOVEMBER 1971</div>
          <div style={{position: 'relative', display: 'inline-block', marginTop: 24}}>
            <div style={{fontFamily: DISPLAY, fontSize: 180, color: '#1a1712', lineHeight: 1}}>D.B. COOPER</div>
            <div style={{position: 'absolute', left: 0, top: 80, height: 18, width: `${strike * 100}%`, background: RED}} />
          </div>
          <div style={{fontFamily: '"Brush Script MT", cursive', fontSize: 110, color: RED, marginTop: 10, opacity: p(frame, cue.w('stuck') - 4, 10)}}>his name was Dan</div>
        </div>
      </Mid>
    </AbsoluteFill>
  );
};
export const S35: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#3a2a1a'}}>
      <AbsoluteFill style={{background: 'repeating-radial-gradient(circle at 30% 40%, #4a3622 0 3px, #3a2a1a 3px 9px)', opacity: 0.6}} />
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        {Array.from({length: 18}, (_, i) => {
          const x = 120 + (i % 6) * 300;
          const y = 120 + Math.floor(i / 6) * 300;
          return (
            <g key={i} opacity={p(frame, i * 2, 6)} transform={`rotate(${(rnd(i) - 0.5) * 8} ${x + 90} ${y + 110})`}>
              <rect x={x} y={y} width={180} height={220} fill="#efe6cf" />
              <circle cx={x + 90} cy={y + 80} r={40} fill="#1b222c" />
              <path d={`M ${x + 30} ${y + 200} Q ${x + 90} ${y + 120} ${x + 150} ${y + 200} Z`} fill="#1b222c" />
              <circle cx={x + 90} cy={y + 10} r={10} fill={RED} />
            </g>
          );
        })}
        {Array.from({length: 10}, (_, i) => {
          const a = Math.floor(rnd(i) * 18);
          const b = Math.floor(rnd(i + 50) * 18);
          return <line key={`s${i}`} x1={210 + (a % 6) * 300} y1={130 + Math.floor(a / 6) * 300} x2={210 + (b % 6) * 300} y2={130 + Math.floor(b / 6) * 300} stroke={RED} strokeWidth={4} strokeDasharray={1200} strokeDashoffset={1200 * (1 - p(frame, 20 + i * 4, 20))} />;
        })}
      </svg>
      <Tag at={cue.s(1)} y={840} color={AMBER}>HUNDREDS OF SUSPECTS</Tag>
    </AbsoluteFill>
  );
};
export const S36: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [copy, chute] = [cue.s(1), cue.w('parachute')];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Pos x={160} y={160}>
        <Suspect name="RICHARD McCOY" note="HIJACKED A 727 · APRIL 1972" show={p(frame, 2, 16)} rz={-3} />
      </Pos>
      {frame >= copy && frame < chute ? (
        <Pos x={lerp(1900, 700, p(frame, copy, 120))} y={300}>
          <Jet width={900} stairs={1} />
        </Pos>
      ) : null}
      {frame >= cue.w('1974') && frame < chute ? <Tag at={cue.w('1974')} y={840} color="#f2f2f2">CAUGHT · ESCAPED · KILLED IN A SHOOTOUT, 1974</Tag> : null}
      {frame >= chute - 6 ? (
        <Pos x={820} y={180} style={{opacity: p(frame, chute - 6, 10)}}>
          <svg width={900} height={700} viewBox="0 0 900 700">
            <rect width={900} height={700} fill="#1a140c" />
            <polygon points="450,0 250,700 650,700" fill="#fff6d8" opacity={0.15} />
            <circle cx={450} cy={30} r={16} fill="#fff6d8" />
            <rect x={300} y={430} width={300} height={200} rx={30} fill="#4a5a3a" stroke="#1d2614" strokeWidth={6} />
            <line x1={330} y1={460} x2={570} y2={600} stroke="#1d2614" strokeWidth={5} />
          </svg>
        </Pos>
      ) : null}
    </AbsoluteFill>
  );
};
export const S37: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop tint={BLUE} />
      <Pos x={760} y={160}>
        <Suspect name="KENNETH CHRISTIANSEN" note="FORMER PARATROOPER · NORTHWEST EMPLOYEE" show={p(frame, 2, 16)} rz={2} color={BLUE} />
      </Pos>
      <Pos x={lerp(-300, 120, p(frame, 0, cue.dur))} y={300} style={{opacity: 0.6}}>
        <Faller size={200} color="#000" />
      </Pos>
      {frame >= cue.s(2) ? <Tag at={cue.s(2)} y={840} color="#f2f2f2">HIS BROTHER BELIEVED HE WAS COOPER</Tag> : null}
    </AbsoluteFill>
  );
};
export const S38: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop tint={AMBER} />
      <Pos x={1260} y={160}>
        <Suspect name="ROBERT RACKSTRAW" note="VIETNAM VETERAN · PILOT" show={p(frame, 2, 16)} rz={-2} />
      </Pos>
      <Pos x={lerp(-700, 160, p(frame, 0, cue.dur))} y={320}>
        <Jet width={900} />
      </Pos>
      {frame >= cue.s(2) ? <Tag at={cue.s(2)} y={840} color="#f2f2f2">"TOO YOUNG" · ALWAYS DENIED IT</Tag> : null}
    </AbsoluteFill>
  );
};
export const S39: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 60}}>
        {['McCOY', 'CHRISTIANSEN', 'RACKSTRAW'].map((n, i) => (
          <div key={n} style={{transform: 'scale(0.75)'}}>
            <Suspect name={n} note="SUSPECT" show={1} rz={(i - 1) * 3} />
          </div>
        ))}
      </div>
      <LStamp at={6} x={960} y={520} size={150}>
        Never proven
      </LStamp>
    </AbsoluteFill>
  );
};
export const S40: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [dummy, died] = [cue.w('dummy'), cue.s(4)];
  return (
    <AbsoluteFill>
      <Storm rain={1} flashes={[died]} tint="#07120c" />
      <Pos x={0} y={380}>
        <Forest width={W2} height={700} color="#020604" seed={12} />
      </Pos>
      <svg width={W2} height={H2} style={{position: 'absolute'}}>
        <g transform={`translate(1100 ${lerp(300, 520, p(frame, 0, 120))}) rotate(${Math.sin(frame / 20) * 4})`} opacity={0.9}>
          <path d="M -220 0 Q 0 -160 220 0 Q 120 -30 0 -20 Q -120 -30 -220 0 Z" fill="#c9c0a8" opacity={0.8} />
          {[-200, -100, 0, 100, 200].map((x) => <line key={x} x1={x} y1={-10} x2={0} y2={240} stroke="#c9c0a8" strokeWidth={2} opacity={0.6} />)}
        </g>
      </svg>
      {frame >= dummy ? <Tag at={dummy} y={70} color={AMBER}>ONE RESERVE CHUTE: A SEWN-SHUT TRAINING DUMMY</Tag> : null}
      <AbsoluteFill style={{background: '#000', opacity: p(frame, died, cue.dur - died) * 0.6}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 41–46 · Payoff and ending ─────────────────────────
export const S41: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const ev = cue.s(3);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Mid y={120} style={{transform: `perspective(1600px) rotateX(${lerp(28, 6, p(frame, 0, 30))}deg) rotateZ(-2deg)`}}>
        <Paper width={1200} style={{padding: '50px 64px', minHeight: 640}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 6, opacity: 0.6}}>FEDERAL BUREAU OF INVESTIGATION</div>
          <div style={{fontFamily: DISPLAY, fontSize: 110, marginTop: 10}}>CASE: NORJAK</div>
          <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, marginTop: 20}}>OPENED: NOV 24, 1971</div>
          {frame >= ev ? <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, marginTop: 14, color: '#7a1010', opacity: p(frame, ev, 8)}}>REOPEN ONLY FOR: THE MONEY · THE PARACHUTE</div> : null}
        </Paper>
      </Mid>
      <LStamp at={cue.w('2016') + 10} x={1300} y={640} size={110}>
        Inactive · 2016
      </LStamp>
    </AbsoluteFill>
  );
};
export const S42: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [metal, pages] = [cue.w('metal'), cue.w('pages')];
  if (frame < pages - 6) {
    return (
      <AbsoluteFill style={{background: '#04060a'}}>
        <Mid y={120}>
          <svg width={840} height={840} viewBox="-420 -420 840 840">
            <circle r={400} fill="#0a1220" stroke="#3a4656" strokeWidth={20} />
            <g transform={`rotate(-20) scale(${lerp(1, 1.4, p(frame, 0, pages))})`}>
              <path d="M -30 -300 L 30 -300 L 46 -240 L 70 240 L 0 320 L -70 240 L -46 -240 Z" fill="#050505" stroke="#333" strokeWidth={4} />
            </g>
            {frame >= metal
              ? Array.from({length: 40}, (_, i) => <circle key={i} cx={(rnd(i) - 0.5) * 500} cy={(rnd(i + 9) - 0.5) * 600} r={3 + rnd(i + 2) * 6} fill={[RED, AMBER, BLUE][i % 3]} opacity={p(frame, metal + i, 8) * (0.6 + Math.sin(frame / 5 + i) * 0.3)} />)
              : null}
          </svg>
        </Mid>
        <Tag at={metal} until={pages - 8} color={AMBER}>PARTICLES FOUND ON COOPER'S TIE</Tag>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Backdrop />
      {Array.from({length: 16}, (_, i) => {
        const t = p(frame, pages - 6 + i * 3, 40);
        return (
          <Pos key={i} x={lerp(860, 100 + (i % 8) * 220, t)} y={lerp(1100, 120 + Math.floor(i / 8) * 380, t)} style={{transform: `rotate(${(rnd(i) - 0.5) * 30}deg)`, opacity: t}}>
            <div style={{width: 200, height: 260, background: '#efe6cf', boxShadow: '0 10px 30px #000', padding: 16, boxSizing: 'border-box'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 12, letterSpacing: 2}}>FBI · NORJAK</div>
              {Array.from({length: 8}, (_, k) => <div key={k} style={{height: 6, width: `${50 + rnd(i * 9 + k) * 50}%`, background: '#888', marginTop: 12}} />)}
            </div>
          </Pos>
        );
      })}
      <Tag at={pages} y={840} color="#f2f2f2">HUNDREDS OF NEW PAGES · NO ANSWER</Tag>
    </AbsoluteFill>
  );
};
export const S43: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const beats = [0, cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  let k = 0;
  while (k + 1 < beats.length && frame >= beats[k + 1]) k++;
  const srcs = ['sketch.jpg', 'sketch-b.jpg', 'money.jpg', pick('airstair.jpg', 'nw727.jpg').replace(PH, ''), 'poster.jpg'];
  const t = p(frame, beats[k], 14);
  return (
    <AbsoluteFill>
      <Backdrop tint={k % 2 ? BLUE : RED} />
      <Mid y={110}>
        <TiltCard key={k} src={`${PH}${srcs[k]}`} width={1000} height={720} ry={lerp(70, (k % 2 ? 1 : -1) * 6, t)} rz={(k % 2 ? 1 : -1) * 2} scale={lerp(0.9, 1, t)} gray={0.6} fit="contain" credit={CR.fbi} fallback={<Jet width={900} stairs={1} />} />
      </Mid>
    </AbsoluteFill>
  );
};
export const S44: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Storm rain={0.9} flashes={[20]} />
      <Pos x={lerp(1900, 500, p(frame, 0, cue.dur, (n) => n))} y={260} style={{transform: 'scaleX(-1)', opacity: 1 - p(frame, cue.dur - 40, 40)}}>
        <Jet width={900} stairs={1} />
      </Pos>
      <Pos x={0} y={700}>
        <Forest width={W2} height={380} color="#020406" seed={21} />
      </Pos>
      <Vignette />
    </AbsoluteFill>
  );
};
export const S45: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [lived, died, tell] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Big at={2} y={110} size={150} color="#f2f2f2">DID HE SURVIVE?</Big>
      <div style={{position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 80}}>
        {[
          {t: 'HIDING IN PLAIN SIGHT', at: lived, c: BLUE},
          {t: 'DIED IN THE TREES', at: died, c: RED},
        ].map((o) => (
          <div key={o.t} style={{opacity: p(frame, o.at, 8), transform: `scale(${slam(frame, o.at, 1.5).scale})`, fontFamily: DISPLAY, fontSize: 70, color: o.c, border: `6px solid ${o.c}`, borderRadius: 16, padding: '10px 30px', background: '#000000aa'}}>
            {o.t}
          </div>
        ))}
      </div>
      {frame >= tell ? (
        <Mid y={700} style={{transform: `scale(${1 + 0.04 * Math.sin(frame / 4)})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 80, color: '#05080c', background: '#f2f2f2', padding: '8px 40px', borderRadius: 40}}>👇 TELL ME IN THE COMMENTS</div>
        </Mid>
      ) : null}
    </AbsoluteFill>
  );
};
export const S46: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const ship = cue.s(1);
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #12202f 0%, #03060a 80%)'}}>
      <Big at={2} y={70} size={110} color={RED}>WATCH NEXT</Big>
      <Mid y={250} style={{opacity: p(frame, 6, 10), transform: `scale(${(frame >= ship ? pulse : 1) * lerp(0.9, 1, p(frame, 6, 14))})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
          <div style={{position: 'relative', width: 480, borderRadius: 24, overflow: 'hidden', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}88`}}>
            <Img src={staticFile('cooperlong/cta/celeste.jpg')} style={{width: '100%', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: C.white, paddingLeft: 10}}>▶</div>
            </div>
          </div>
          <div style={{width: 700}}>
            <div style={{fontFamily: DISPLAY, fontSize: 90, color: '#f2f2f2', lineHeight: 1}}>THE GHOST SHIP WITH NO ONE ON BOARD</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.dim, marginTop: 20, letterSpacing: 4}}>CHRONOS GALAXY · SUBSCRIBE</div>
          </div>
        </div>
      </Mid>
    </AbsoluteFill>
  );
};
