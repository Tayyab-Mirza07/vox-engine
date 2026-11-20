import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat, Route} from '../geo';
import {BODY, C, Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {Stamp} from '../ui';
import {NightSky, Paper, Typed} from '../dbcooper/parts';
import {Dust, Fog, TiltCard, Water} from '../motion';
import {BLUE, Drone, INK, Jet777, JetTop, Marine, RED, SAND, Satellite, Scope, Ship} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const KUL: LonLat = [101.71, 2.75];
const IGARI: LonLat = [103.58, 6.94];
const PENANG: LonLat = [100.3, 5.4];
const ANDAMAN: LonLat = [96.0, 6.9];
const BEIJING: LonLat = [116.4, 39.9];
const SOUTH: LonLat = [93.0, -35.0];
const REUNION: LonLat = [55.5, -21.1];
const PHOTO = 'mh370/photos/plane.jpg';
const PHOTO_CREDIT = '9M-MRO (the aircraft) · Photo: Laurent Errera · CC BY-SA 2.0';

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Tag: React.FC<{at: number; until?: number; children: React.ReactNode; top?: number; color?: string}> = ({at, until = 1e9, children, top = 150, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <Center top={top} style={{opacity: p(frame, at, 8) * (1 - p(frame, until - 8, 8))}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 42, letterSpacing: 6, color, background: '#000000b8', padding: '8px 22px', borderRadius: 6}}>{children}</div>
    </Center>
  );
};
const Glitch: React.FC<{at: number; len?: number}> = ({at, len = 12}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + len) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 8}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: rnd(frame * 3 + i) * 1800, height: 10 + rnd(i + frame) * 40, background: i % 2 ? RED : BLUE, opacity: 0.35, transform: `translateX(${(rnd(frame + i * 7) - 0.5) * 200}px)`}} />
      ))}
    </AbsoluteFill>
  );
};
const Flash: React.FC<{at: number; color?: string}> = ({at, color = RED}) => {
  const frame = useCurrentFrame();
  const o = frame >= at ? 1 - p(frame, at, 10) : 0;
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o * 0.5, mixBlendMode: 'screen'}} /> : null;
};
const Duo: React.FC<{tint?: string}> = ({tint = RED}) => <AbsoluteFill style={{background: tint, mixBlendMode: 'color', opacity: 0.35}} />;
/** Animated route through several waypoints: progress 0..1 is spread over the legs. */
const legs = (pts: LonLat[], prog: number): Route[] =>
  pts.slice(1).map((to, i) => ({from: pts[i], to, progress: Math.max(0, Math.min(1, prog * (pts.length - 1) - i))}));

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [jet, gone] = [cue.s(1), cue.s(2)];
  const fade = p(frame, cue.w('nobody'), 30);
  return (
    <AbsoluteFill>
      <NightSky moon={false} />
      <Duo />
      <Center top={560} style={{transform: `scale(${lerp(1.3, 1, p(frame, 0, 30))})`}}>
        <div style={{fontFamily: DISPLAY, fontSize: 360, color: RED, textShadow: `0 0 60px ${RED}`, opacity: (1 - p(frame, jet - 4, 8)) * p(frame, 0, 6)}}>239</div>
      </Center>
      {frame >= jet - 4 ? (
        <div style={{position: 'absolute', top: 640, left: lerp(-200, 260, p(frame, jet - 4, cue.dur - jet, (n) => n)), opacity: 1 - fade, transform: `scale(${lerp(1, 0.6, fade)})`}}>
          <Jet777 width={760} />
        </div>
      ) : null}
      {frame >= gone ? (
        <div style={{position: 'absolute', right: 70, top: 1060, opacity: p(frame, gone, 8)}}>
          <Scope size={300} blip={[0.2, -0.1]} fade={fade} />
        </div>
      ) : null}
      <Glitch at={cue.w('nobody')} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Takeoff ─────────────────────────
export const Takeoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [flight, routine] = [cue.s(1), cue.s(2)];
  if (frame < routine) {
    return (
      <AbsoluteFill>
        <NightSky moon={false} />
        <Center top={lerp(560, 470, p(frame, 0, routine))} style={{opacity: p(frame, 0, 10)}}>
          <TiltCard src={PHOTO} width={980} height={660} ry={lerp(-24, 6, p(frame, 0, routine))} rx={lerp(14, 2, p(frame, 0, 30))} scale={lerp(0.95, 1.06, p(frame, 0, routine))} gray={0.35} focus="40% 55%" credit={PHOTO_CREDIT} />
        </Center>
        <AbsoluteFill style={{background: '#0a2a6a', mixBlendMode: 'multiply', opacity: 0.35}} />
        <Tag at={4}>MARCH 8, 2014 · 00:41</Tag>
        <Tag at={flight + 6} top={240} color={BLUE}>
          MH370 · KUALA LUMPUR → BEIJING
        </Tag>
      </AbsoluteFill>
    );
  }
  const z = p(frame, routine, 30);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Center top={300}>
        <Globe width={1000} height={1000} center={[lerp(105, 108, z), lerp(15, 20, z)]} scale={lerp(900, 800, z)} routes={[{from: KUL, to: BEIJING, progress: p(frame, routine, 40)}]} pins={[{at: KUL, label: 'KUALA LUMPUR', show: 1, align: 'left'}, {at: BEIJING, label: 'BEIJING', show: p(frame, routine + 20, 10), align: 'left'}]} frame={frame} />
      </Center>
      <Duo tint={BLUE} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Last words ─────────────────────────
export const LastWords: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const words = cue.s(1);
  const talking = frame >= words && frame < cue.dur - 6;
  return (
    <AbsoluteFill style={{background: '#02050a'}}>
      <Tag at={4}>01:19 · LAST RADIO CALL</Tag>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {/* windshield */}
        <path d="M 60 300 L 1020 300 L 900 700 L 180 700 Z" fill="#06101f" stroke="#1b2a3c" strokeWidth={10} />
        {Array.from({length: 30}, (_, i) => <circle key={i} cx={100 + rnd(i) * 880} cy={330 + rnd(i + 5) * 340} r={1 + rnd(i + 2) * 2} fill="#fff" opacity={0.4} />)}
        {/* instrument panel glow */}
        <rect x={0} y={760} width={W} height={420} fill="#0a1220" />
        {Array.from({length: 6}, (_, i) => <rect key={i} x={70 + i * 160} y={800} width={130} height={100} rx={8} fill="#0d2a1a" stroke="#5dff9a" strokeOpacity={0.5} strokeWidth={3} />)}
        {/* two pilot silhouettes from behind, no faces */}
        {[300, 780].map((x, i) => (
          <g key={i} fill="#000">
            <circle cx={x} cy={760} r={70} />
            <path d={`M ${x - 150} 1240 Q ${x - 140} 860 ${x} 850 Q ${x + 140} 860 ${x + 150} 1240 Z`} />
            <path d={`M ${x - 75} 740 Q ${x} 660 ${x + 75} 740`} stroke="#1b2a3c" strokeWidth={14} fill="none" />
          </g>
        ))}
        {/* radio waveform */}
        <g transform="translate(0 1120)">
          {Array.from({length: 60}, (_, i) => {
            const h = talking ? 8 + Math.abs(Math.sin(frame / 2 + i * 0.7)) * 60 * rnd(i + frame) : 4;
            return <rect key={i} x={60 + i * 16} y={-h / 2} width={8} height={h} fill="#5dff9a" opacity={0.85} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Transponder dark ─────────────────────────
export const Dark: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [off, gone] = [cue.w('dark'), cue.w('disappears')];
  return (
    <AbsoluteFill style={{background: INK}}>
      <Tag at={4}>01:21 · TRANSPONDER OFF</Tag>
      <Center top={340} style={{filter: frame >= off && frame < off + 10 ? 'brightness(2)' : undefined}}>
        <Scope size={880} blip={[lerp(-0.1, 0.05, p(frame, 0, cue.dur)), lerp(0.2, 0.05, p(frame, 0, cue.dur))]} label="MH370" fade={p(frame, gone - 2, 6)} trail={Array.from({length: 10}, (_, i) => [-0.4 + i * 0.03, 0.5 - i * 0.03] as [number, number])} />
      </Center>
      <Glitch at={gone} len={16} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Re-hook: military radar ─────────────────────────
export const Military: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const mil = cue.s(2);
  return (
    <AbsoluteFill style={{background: '#0a0204'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${RED}33 0%, transparent 60%)`, opacity: p(frame, mil, 10)}} />
      <Center top={340} style={{transform: `scale(${lerp(0.9, 1.1, p(frame, mil, 40))})`}}>
        <Scope size={880} red={frame >= mil} blip={frame >= mil ? [lerp(0.05, -0.25, p(frame, mil, cue.dur - mil)), lerp(0.05, -0.05, p(frame, mil, cue.dur - mil))] : undefined} label="UNKNOWN" />
      </Center>
      <Tag at={mil + 4} top={160}>
        MILITARY RADAR
      </Tag>
      <Flash at={mil} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The turn ─────────────────────────
export const Turn: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [back, gone] = [cue.s(1), cue.s(2)];
  const prog = p(frame, 0, gone, (n) => n);
  const lostAt = p(frame, gone, 10);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Center top={260} style={{transform: frame < back && frame > 10 ? `translate(${(rnd(frame) - 0.5) * 10}px, 0)` : undefined}}>
        <Globe width={1000} height={1100} center={[101, 5]} scale={4200} routes={legs([KUL, IGARI, PENANG, ANDAMAN], prog)} pins={[{at: PENANG, label: 'PENANG', show: p(frame, cue.w('Penang'), 8), align: 'left'}, {at: ANDAMAN, label: 'ANDAMAN SEA', show: p(frame, cue.w('Andaman'), 8) * (1 - lostAt * 0.5), align: 'right'}, {at: IGARI, label: 'TURN', show: p(frame, 8, 8), align: 'right'}]} frame={frame} />
      </Center>
      <Duo />
      <Flash at={gone} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Satellite pings ─────────────────────────
export const Pings: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [hour, still] = [cue.s(1), cue.s(4)];
  const pingEvery = Math.max(20, Math.floor((cue.dur - hour) / 6));
  const lastPing = frame >= hour ? hour + Math.floor((frame - hour) / pingEvery) * pingEvery : -999;
  const ring = frame - lastPing;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #0b1a33 0%, #02040a 70%)'}}>
      <Dust amount={1.2} />
      <Center top={lerp(220, 260, Math.sin(frame / 40) * 0.5 + 0.5)}>
        <Satellite size={420} />
      </Center>
      <div style={{position: 'absolute', left: lerp(160, 700, p(frame, 0, cue.dur, (n) => n)), top: 1080}}>
        <JetTop size={120} rotate={lerp(-80, 160, p(frame, 0, cue.dur))} />
      </div>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {frame >= hour && ring < 40
          ? [0, 1, 2].map((k) => (
              <circle key={k} cx={lerp(220, 760, p(frame, 0, cue.dur, (n) => n))} cy={1140} r={(ring + k * 8) * 9} fill="none" stroke={BLUE} strokeWidth={5} opacity={Math.max(0, 1 - (ring + k * 8) / 40)} />
            ))
          : null}
        {frame >= hour && ring < 30 ? <line x1={lerp(220, 760, p(frame, 0, cue.dur, (n) => n))} y1={1140} x2={540} y2={360} stroke={BLUE} strokeWidth={3} strokeDasharray="10 10" opacity={1 - ring / 30} /> : null}
      </svg>
      {frame >= still ? (
        <Center top={1250} style={{opacity: p(frame, still, 8)}}>
          <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, color: BLUE, letterSpacing: 4}}>SIGNAL ✓ · POSITION ?</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Re-hook: the math ─────────────────────────
export const TheMath: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#06080c'}}>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {/* table of maps */}
        <rect x={80} y={520} width={920} height={600} fill="#1a1712" />
        <rect x={140} y={560} width={800} height={520} fill="#d9cfb4" opacity={0.85} />
        {Array.from({length: 7}, (_, i) => (
          <path key={i} d={`M 160 ${1060 - i * 10} Q 540 ${640 - i * 40} 920 ${1060 - i * 10}`} fill="none" stroke={RED} strokeWidth={4} strokeDasharray={1400} strokeDashoffset={1400 * (1 - p(frame, 6 + i * 6, 14))} opacity={0.9} />
        ))}
        {/* investigators' silhouettes */}
        {[160, 920].map((x, i) => (
          <g key={i} fill="#000">
            <circle cx={x} cy={430} r={60} />
            <path d={`M ${x - 140} 1300 Q ${x - 120} 520 ${x} 500 Q ${x + 120} 520 ${x + 140} 1300 Z`} />
          </g>
        ))}
        <circle cx={540} cy={360} r={44} fill="#000" />
        <path d="M 420 560 Q 430 420 540 410 Q 650 420 660 560 Z" fill="#000" />
      </svg>
      <AbsoluteFill style={{background: '#000', opacity: 0.3 + 0.3 * p(frame, cue.dur - 30, 30)}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · South ─────────────────────────
export const South: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [south, fuel] = [cue.s(1), cue.w('fuel')];
  const z = p(frame, south, 50);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Center top={240}>
        <Globe width={1000} height={1100} center={[lerp(105, 95, z), lerp(25, -15, z)]} scale={lerp(700, 650, z)} routes={[{from: KUL, to: BEIJING, progress: 1 - p(frame, 4, 20)}, ...legs([ANDAMAN, [93.5, -5], SOUTH], p(frame, south - 4, fuel - south + 10))]} pins={[{at: BEIJING, label: 'BEIJING ✘', show: 1 - p(frame, 4, 20), align: 'left'}, {at: SOUTH, label: 'SOUTHERN INDIAN OCEAN', show: p(frame, fuel - 6, 10), align: 'left'}]} frame={frame} />
      </Center>
      <Duo />
      {frame >= fuel - 10 ? (
        <div style={{position: 'absolute', right: 60, top: 1050, opacity: p(frame, fuel - 10, 8)}}>
          <svg width={240} height={140} viewBox="0 0 240 140">
            <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="#333" strokeWidth={20} />
            <path d="M 20 120 A 100 100 0 0 1 60 40" fill="none" stroke={RED} strokeWidth={20} />
            <line x1={120} y1={120} x2={lerp(170, 40, p(frame, fuel - 6, 30))} y2={lerp(40, 100, p(frame, fuel - 6, 30))} stroke="#fff" strokeWidth={8} />
            <text x={120} y={136} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={20} fill="#fff">
              FUEL
            </text>
          </svg>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The search ─────────────────────────
export const Search: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ships, nothing] = [cue.s(1), cue.s(2)];
  const dark = p(frame, nothing, 20);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #1a2533 0%, #0b121c 55%)'}}>
      <Fog amount={1.2} speed={2} color="#9fb0c4" />
      <Water top={980} color="#0b1a28" />
      {frame >= ships - 6
        ? [0, 1, 2].map((k) => (
            <div key={k} style={{position: 'absolute', top: 900 + k * 40, left: lerp(-400 + k * 300, 120 + k * 300, p(frame, ships - 6 + k * 6, cue.dur - ships, (n) => n)), opacity: p(frame, ships - 6 + k * 6, 8)}}>
              <Ship width={300 - k * 50} />
            </div>
          ))
        : null}
      {frame >= ships
        ? [0, 1].map((k) => (
            <div key={`p${k}`} style={{position: 'absolute', top: 420 + k * 120, left: lerp(1100, -300, p(frame, ships + k * 10, 70, (n) => n))}}>
              <div style={{transform: 'scaleX(-1)'}}>
                <Jet777 width={260} lights={false} windows={0} color="#0d1622" />
              </div>
            </div>
          ))
        : null}
      <AbsoluteFill style={{background: '#000', opacity: dark * 0.7}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Réunion debris ─────────────────────────
export const Debris: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 18);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #1d3554 0%, #4b6a86 45%, #8aa0b0 60%)'}}>
      <Tag at={4} color={BLUE}>
        RÉUNION ISLAND · JULY 2015
      </Tag>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <path d="M 0 620 Q 300 590 600 610 T 1080 600 L 1080 900 L 0 900 Z" fill="#2c4a66" />
        <path d={`M 0 ${880 + wave * 20} Q 300 ${860 - wave * 20} 600 ${880 + wave * 10} T 1080 ${870} L 1080 1000 L 0 1000 Z`} fill="#e6eef5" opacity={0.6} />
        <path d="M 0 960 Q 540 920 1080 960 L 1080 1920 L 0 1920 Z" fill={SAND} />
        {/* flaperon fragment */}
        <g transform={`translate(${lerp(560, 520, p(frame, 0, cue.dur))} 1060) rotate(-12) scale(${lerp(1.2, 1.4, p(frame, 0, cue.dur))})`}>
          <path d="M -200 0 L 180 -30 L 210 20 L -190 60 Z" fill="#d8d2c4" stroke="#6b6458" strokeWidth={4} />
          <path d="M -150 20 L 170 -8" stroke="#6b6458" strokeWidth={3} opacity={0.6} />
          <path d="M 180 -30 L 230 -20 L 240 30 L 210 20 Z" fill="#a39b8c" />
        </g>
      </svg>
      <AbsoluteFill style={{background: '#0a2a6a', mixBlendMode: 'multiply', opacity: 0.35}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Re-hook: why ─────────────────────────
export const Why: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const why = cue.s(2);
  return (
    <AbsoluteFill style={{background: '#020305'}}>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0, opacity: 0.8}}>
        <path d="M 60 260 L 1020 260 L 900 640 L 180 640 Z" fill="#050b14" stroke="#141c28" strokeWidth={10} />
        <rect x={0} y={720} width={W} height={380} fill="#070c14" />
        {/* empty seat */}
        <path d="M 380 1300 L 380 820 Q 380 760 440 760 L 640 760 Q 700 760 700 820 L 700 1300 Z" fill="#11161f" stroke="#1d2533" strokeWidth={6} />
        <rect x={440} y={700} width={200} height={80} rx={20} fill="#11161f" stroke="#1d2533" strokeWidth={6} />
      </svg>
      {frame >= why ? (
        <Center top={760} style={{opacity: slam(frame, why, 2).opacity, transform: `scale(${slam(frame, why, 2).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 300, color: RED, textShadow: `0 0 70px ${RED}`}}>WHY?</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Theories ─────────────────────────
export const Theories: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const at = [cue.w('fire'), cue.w('hijacking'), cue.w('oxygen')];
  const panel = (i: number, children: React.ReactNode) => {
    const t = p(frame, at[i] - 6, 10);
    return (
      <div key={i} style={{width: 900, height: 300, borderRadius: 18, overflow: 'hidden', border: `5px solid ${i === 1 ? RED : BLUE}`, background: '#0b0f17', opacity: t, transform: `translateX(${lerp(i % 2 ? 400 : -400, 0, t)}px)`}}>
        <svg width={900} height={300} viewBox="0 0 900 300">
          {children}
        </svg>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', top: 220, left: 90, display: 'flex', flexDirection: 'column', gap: 30}}>
        {panel(
          0,
          <g>
            {Array.from({length: 8}, (_, i) => <rect key={i} x={60 + i * 100} y={130} width={70} height={90} rx={10} fill="#1d2533" />)}
            {[200, 450, 650].map((x, k) => (
              <path key={k} d={`M ${x - 40} 230 Q ${x - 30} ${120 - Math.sin(frame / 3 + k) * 20} ${x} ${80 + Math.sin(frame / 4 + k) * 20} Q ${x + 30} ${120 + Math.sin(frame / 3) * 20} ${x + 40} 230 Z`} fill="#ff7b3a" opacity={0.9} />
            ))}
          </g>,
        )}
        {panel(
          1,
          <g>
            <circle cx={450} cy={110} r={56} fill="#000" />
            <rect x={400} y={96} width={100} height={22} fill={RED} opacity={0.7} />
            <path d="M 330 300 Q 340 180 450 170 Q 560 180 570 300 Z" fill="#000" />
            <text x={450} y={60} textAnchor="middle" fontFamily={DISPLAY} fontSize={44} fill={RED}>
              ?
            </text>
          </g>,
        )}
        {panel(
          2,
          <g>
            {[180, 360, 540, 720].map((x, k) => (
              <g key={k} transform={`translate(${x} ${lerp(-60, 0, p(frame, at[2] + k * 4, 14))})`}>
                <line x1={0} y1={0} x2={0} y2={130} stroke="#f2f2f2" strokeWidth={3} />
                <path d="M -30 130 Q 0 190 30 130 Z" fill="#f2c94c" />
              </g>
            ))}
          </g>,
        )}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Simulator + final report ─────────────────────────
export const Report: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nothing, report] = [cue.s(1), cue.s(2)];
  if (frame < report) {
    return (
      <AbsoluteFill style={{background: '#05070b'}}>
        <Center top={320}>
          <div style={{width: 900, height: 620, background: '#0b0f17', border: '14px solid #1d2533', borderRadius: 18, position: 'relative', overflow: 'hidden', filter: frame >= nothing ? `grayscale(${p(frame, nothing, 14)})` : undefined}}>
            <svg width={872} height={592} viewBox="0 0 872 592">
              <rect width={872} height={592} fill="#0a2238" />
              <path d="M 380 80 Q 420 60 460 100 L 470 180 Q 430 200 400 170 Z" fill="#244a3a" />
              <path d="M 430 140 Q 400 300 380 520" fill="none" stroke={RED} strokeWidth={8} strokeDasharray={700} strokeDashoffset={700 * (1 - p(frame, 6, 50))} />
              <circle cx={380} cy={520} r={12} fill={RED} opacity={p(frame, 50, 6)} />
              {Array.from({length: 6}, (_, i) => <line key={i} x1={0} y1={i * 100} x2={872} y2={i * 100} stroke="#ffffff" strokeOpacity={0.05} />)}
            </svg>
            <div style={{position: 'absolute', left: 16, top: 12, fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 26, color: '#9fc6e6'}}>HOME FLIGHT SIMULATOR</div>
          </div>
        </Center>
        {frame >= nothing ? (
          <Center top={1000} style={{opacity: p(frame, nothing, 8)}}>
            <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, color: '#ddd', background: '#000000c0', padding: '8px 20px'}}>NOT PROOF OF ANYTHING</div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#05070b'}}>
      <Center top={300} style={{perspective: 1600}}>
        <div style={{transform: `rotateX(${lerp(30, 8, p(frame, report, 20))}deg) rotateZ(-2deg)`}}>
          <Paper width={860} style={{padding: '44px 50px', minHeight: 640}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>SAFETY INVESTIGATION REPORT · JULY 2018</div>
            <div style={{fontFamily: DISPLAY, fontSize: 64, marginTop: 14}}>MH370 · 9M-MRO</div>
            <div style={{marginTop: 30}}>
              <Typed text="The team is unable to determine the real cause for the disappearance." at={report + 6} cps={30} style={{fontSize: 46, lineHeight: 1.35}} />
            </div>
          </Paper>
        </div>
      </Center>
      <Stamp at={report + 50} y={980} size={120} rotate={-8}>
        Undetermined
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Ocean Infinity ─────────────────────────
export const NoFind: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [deal, money] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #021226 0%, #000207 80%)'}}>
      <Marine amount={1.2} />
      <div style={{position: 'absolute', top: lerp(260, 360, p(frame, 0, cue.dur)), left: lerp(900, 200, p(frame, 0, cue.dur, (n) => n))}}>
        <Drone width={560} beam={0.6 + 0.4 * Math.sin(frame / 10)} />
      </div>
      <Tag at={deal} until={money - 2} color="#f2c94c" top={180}>
        OCEAN INFINITY · NO FIND, NO FEE
      </Tag>
      {frame >= money ? (
        <Center top={1000} style={{opacity: slam(frame, money, 1.6).opacity, transform: `scale(${slam(frame, money, 1.6).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 210, color: '#f2c94c', textShadow: '0 0 50px #f2c94c88'}}>$70 MILLION</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Still waiting ─────────────────────────
export const StillWaiting: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [extended, waiting] = [cue.s(1), cue.s(2)];
  const scan = p(frame, 0, extended, (n) => n);
  return (
    <AbsoluteFill style={{background: '#000207'}}>
      <Marine amount={0.8} />
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <path d="M 0 900 Q 300 860 540 900 T 1080 880 L 1080 1920 L 0 1920 Z" fill="#071321" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 90} y1={880} x2={i * 90 - 200} y2={1300} stroke={BLUE} strokeOpacity={0.12} />)}
        <rect x={0} y={860} width={W * scan} height={440} fill={BLUE} opacity={0.08} />
        <line x1={W * scan} y1={860} x2={W * scan} y2={1300} stroke={BLUE} strokeWidth={4} opacity={frame < extended ? 0.8 : 0} />
        {/* faint outline in the dark */}
        <g transform="translate(240 1000) rotate(-8)" opacity={0.18 * p(frame, waiting, 40)}>
          <path d="M 0 60 Q 30 30 120 28 L 520 28 Q 580 30 600 60 Q 590 80 540 84 L 120 86 Q 40 84 0 66 Z" fill="none" stroke="#9fc6e6" strokeWidth={4} />
        </g>
      </svg>
      <Tag at={extended} until={waiting - 2} color={BLUE}>
        CONTRACT EXTENDED · JUNE 2026
      </Tag>
      <AbsoluteFill style={{background: '#000', opacity: p(frame, cue.dur - 30, 26)}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · Question + CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [either, comment, cta] = [cue.s(1), cue.s(2), cue.s(3)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <NightSky moon={false} />
        <div style={{position: 'absolute', top: 640, left: lerp(120, 360, p(frame, 0, cta, (n) => n)), opacity: 1 - p(frame, cta - 20, 20)}}>
          <Jet777 width={520} />
        </div>
        {frame >= either ? (
          <div style={{position: 'absolute', top: 320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30}}>
            {['ACCIDENT', 'DELIBERATE'].map((t, i) => (
              <div key={t} style={{fontFamily: DISPLAY, fontSize: 80, color: i ? RED : BLUE, border: `6px solid ${i ? RED : BLUE}`, padding: '4px 24px', borderRadius: 14, background: '#000000aa', opacity: p(frame, either + i * 12, 8), transform: `scale(${slam(frame, either + i * 12, 1.6).scale})`}}>
                {t}?
              </div>
            ))}
          </div>
        ) : null}
        {frame >= comment ? (
          <Center top={1000} style={{opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: '#f2f2f2', padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #12202f 0%, #03060a 80%)'}}>
      <Fog amount={0.8} />
      <Center top={130} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 110, color: RED, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <Center top={330} style={{opacity: p(frame, cta + 4, 10), transform: `scale(${slam(frame, cta + 4, 1.3).scale * pulse})`}}>
        <div style={{width: 560}}>
          <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}88`}}>
            <Img src={staticFile('mh370/cta/celeste.jpg')} style={{width: '100%', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: C.white, paddingLeft: 10}}>▶</div>
            </div>
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: C.white, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>THE GHOST SHIP WITH NO ONE ON BOARD</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
