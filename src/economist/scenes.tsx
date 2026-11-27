import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {Stamp} from '../ui';
import {Dust, Fog, Water} from '../motion';
import {Ballot, BLUE, Clock, CoverArt, CoverZoom, INK, Lens, PAPER, Panel, RED, SPOT, Tanker, Thermometer} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const TAIWAN: LonLat = [121.0, 23.7];

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
/** Small typewriter-style label: the only text in most scenes. */
const Label: React.FC<{at: number; until?: number; children: React.ReactNode; top?: number; color?: string}> = ({at, until = 1e9, children, top = 150, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <Center top={top} style={{opacity: p(frame, at, 8) * (1 - p(frame, until - 8, 8))}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 42, letterSpacing: 6, color, background: '#000000b0', padding: '8px 22px', borderRadius: 6}}>{children}</div>
    </Center>
  );
};
const Duotone: React.FC<{tint?: string}> = ({tint = RED}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${tint}33 0%, ${INK} 70%)`}}>
    <Dust amount={0.8} />
  </AbsoluteFill>
);
const shakeXY = (frame: number, start: number, amt = 18, len = 10) => {
  const k = frame >= start && frame < start + len ? (1 - (frame - start) / len) * amt : 0;
  return `translate(${(rnd(frame) - 0.5) * k}px, ${(rnd(frame + 3) - 0.5) * k}px)`;
};
const Flash: React.FC<{at: number; color?: string}> = ({at, color = RED}) => {
  const frame = useCurrentFrame();
  const o = frame >= at ? 1 - p(frame, at, 10) : 0;
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o * 0.6, mixBlendMode: 'screen'}} /> : null;
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const warn = cue.w('warning');
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <Center top={lerp(260, 200, p(frame, 0, cue.dur))} style={{opacity: p(frame, 0, 8), transform: `${shakeXY(frame, warn, 26, 14)} scale(${lerp(1.2, 1, p(frame, 0, 40))})`}}>
        <CoverArt width={760} crack={p(frame, warn - 4, 16)} />
      </Center>
      <Fog amount={0.6} color="#ff8080" />
      <Flash at={warn} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Who / when ─────────────────────────
export const WhoWhen: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [artist, palette] = [cue.w('Peterson'), cue.w('red')];
  const tilt = p(frame, 0, 24);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone tint={BLUE} />
      <Label at={6} until={artist - 2}>
        NOV 16, 2026 · THE WORLD AHEAD 2027
      </Label>
      <Label at={artist} until={palette - 2}>
        ART: CLEON PETERSON (USA)
      </Label>
      <Center top={300} style={{perspective: 1600}}>
        <div style={{transform: `rotateX(${lerp(55, 12, tilt)}deg) rotateZ(${lerp(-14, -3, tilt)}deg) translateY(${lerp(200, 0, tilt)}px)`, boxShadow: '0 40px 90px #000'}}>
          <CoverArt width={640} />
        </div>
      </Center>
      {frame >= palette ? (
        <div style={{position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24}}>
          {[RED, '#000', PAPER].map((c, i) => (
            <div key={c} style={{width: 120, height: 120, borderRadius: '50%', background: c, border: `5px solid ${PAPER}`, opacity: p(frame, palette + i * 6, 6), transform: `scale(${slam(frame, palette + i * 6, 1.6).scale})`}} />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · What is on it (rapid zooms) ─────────────────────────
export const OnTheCover: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const beats = [0, 1, 2, 3, 4].map((i) => cue.s(i));
  const spots = [SPOT.tank, SPOT.missiles, SPOT.crowd, SPOT.cameras, SPOT.chart];
  let k = 0;
  while (k + 1 < beats.length && frame >= beats[k + 1]) k++;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <CoverZoom width={760} spot={spots[k]} zoom={lerp(2.6, 2.2, p(frame, beats[k], 20))} shake={frame - beats[k] < 8 ? 1 - (frame - beats[k]) / 8 : 0} crack={k === 4 ? p(frame, beats[4] + 6, 20) : 0} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 43%, transparent 35%, ${INK} 85%)`}} />
      <Flash at={beats[k]} color={k % 2 ? BLUE : RED} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Hidden meanings? (magnifier) ─────────────────────────
export const Magnifier: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const t = p(frame, 0, cue.dur, (n) => n);
  const [cw, cl, ct] = [700, 190, 240];
  const x = cl + 350 + Math.sin(t * Math.PI * 2) * 230;
  const y = ct + 470 + Math.cos(t * Math.PI * 1.4) * 330;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone tint={BLUE} />
      <div style={{position: 'absolute', left: cl, top: ct, filter: 'brightness(0.55)'}}>
        <CoverArt width={cw} />
      </div>
      <Lens coverWidth={cw} coverLeft={cl} coverTop={ct} x={x} y={y} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Taiwan ─────────────────────────
export const Taiwan: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [theme, xi] = [cue.s(1), cue.s(2)];
  const z = p(frame, 0, theme + 20);
  const date = cue.w('2027');
  if (frame < theme) {
    return (
      <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
        <CoverZoom width={760} spot={SPOT.missiles} zoom={lerp(1.4, 3, p(frame, 0, theme))} />
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 43%, transparent 30%, ${INK} 85%)`}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <Center top={260}>
        <Globe width={1000} height={1000} center={[lerp(100, TAIWAN[0], z), lerp(30, TAIWAN[1], z)]} scale={lerp(450, 1500, p(frame, theme, 50))} routes={[]} pins={[{at: TAIWAN, label: 'TAIWAN', show: p(frame, theme + 10, 10), align: 'right'}]} highlight={['China', 'Taiwan']} frame={frame} />
      </Center>
      <AbsoluteFill style={{background: RED, mixBlendMode: 'color', opacity: 0.35}} />
      {frame >= xi ? <Label at={xi} top={160}>READY BY 2027?</Label> : null}
      <Flash at={date} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Ready ≠ happening ─────────────────────────
export const Deadline: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const arrived = cue.s(1);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <Center top={360} style={{transform: shakeXY(frame, cue.w('arrived'), 30, 14)}}>
        <Clock size={640} t={frame >= arrived ? 1 : p(frame, 0, arrived, (n) => n) * 0.95} label={frame >= cue.w('arrived') ? '2027' : undefined} />
      </Center>
      <Flash at={cue.w('arrived')} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Iran war fallout ─────────────────────────
export const MiddleEast: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [oil, food] = [cue.w('rerouted'), cue.w('food')];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a0a0c 0%, #0b0507 60%)'}}>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {Array.from({length: 18}, (_, i) => {
          const y = 760 - ((frame * (2 + rnd(i) * 2) + i * 50) % 420);
          return <circle key={i} cx={160 + rnd(i + 2) * 760} cy={y} r={4 + rnd(i) * 6} fill="#ff9a3c" opacity={0.6} />;
        })}
        <path d={`M 380 800 Q 420 ${560 + Math.sin(frame / 3) * 30} 470 700 Q 520 ${520 + Math.sin(frame / 4) * 40} 560 680 Q 610 ${600 + Math.sin(frame / 2.5) * 30} 660 800 Z`} fill={RED} opacity={0.9} style={{filter: `drop-shadow(0 0 40px ${RED})`}} />
        <rect x={120} y={800} width={840} height={26} fill="#1c1c1c" />
      </svg>
      <Water top={900} color="#0b1220" />
      {frame >= oil - 6 ? (
        <>
          <div style={{position: 'absolute', top: 930, left: lerp(-560, 260, p(frame, oil - 6, cue.dur - oil, (n) => n))}}>
            <Tanker width={520} />
          </div>
          <div style={{position: 'absolute', top: 1050, left: lerp(1100, 380, p(frame, oil, cue.dur - oil, (n) => n))}}>
            <Tanker width={380} />
          </div>
        </>
      ) : null}
      {frame >= food - 4 ? (
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30, opacity: p(frame, food - 4, 8)}}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width={150} height={170} viewBox="0 0 100 120" style={{transform: `scale(${lerp(1, 0.75, p(frame, food + 10 + i * 6, 20))})`}}>
              <path d="M 20 20 Q 50 5 80 20 L 90 110 L 10 110 Z" fill={PAPER} opacity={0.9} />
              <rect x={30} y={50} width={40} height={30} fill={RED} opacity={0.7} />
            </svg>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Re-hook: the machines ─────────────────────────
export const Machines: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const on = cue.s(1);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Center top={260} style={{opacity: 0.35 * (1 - p(frame, on, 8)), filter: 'grayscale(1)'}}>
        <CoverArt width={700} />
      </Center>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {Array.from({length: 24}, (_, i) => {
          const x = 70 + (i % 4) * 240;
          const y = 220 + Math.floor(i / 4) * 170;
          const lit = p(frame, on + i * 1.2, 4);
          const glitch = rnd(frame + i) > 0.92 ? 0.3 : 1;
          return (
            <g key={i} opacity={lit * glitch}>
              <rect x={x} y={y} width={210} height={140} rx={8} fill="#08172e" stroke={BLUE} strokeWidth={4} />
              <circle cx={x + 105} cy={y + 70} r={28} fill="none" stroke={i % 5 === 0 ? RED : BLUE} strokeWidth={6} />
              <circle cx={x + 105} cy={y + 70} r={10} fill={i % 5 === 0 ? RED : BLUE} />
            </g>
          );
        })}
      </svg>
      <Flash at={on} color={BLUE} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · AI backlash ─────────────────────────
export const AIBacklash: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [backlash, cyber, jobs] = [cue.s(1), cue.w('cyberattacks'), cue.w('jobs')];
  const pulse = 1 + 0.03 * Math.sin(frame / 5);
  const glitch = frame >= cyber && frame < cyber + 40 && rnd(frame) > 0.6;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {frame < backlash ? (
        <>
          <CoverZoom width={760} spot={SPOT.chip} zoom={lerp(1.6, 3.2, p(frame, 0, backlash))} />
          <AbsoluteFill style={{background: `radial-gradient(circle at 50% 43%, transparent 30%, ${INK} 85%)`}} />
        </>
      ) : (
        <>
          <Duotone tint={BLUE} />
          <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0, filter: glitch ? `hue-rotate(140deg)` : undefined, transform: glitch ? `translateX(${(rnd(frame) - 0.5) * 40}px)` : undefined}}>
            {/* coins under the data centres */}
            {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={180 + (i % 8) * 100} cy={1120 - Math.floor(i / 8) * 26} rx={46} ry={14} fill="#c9a227" stroke="#7a5c12" strokeWidth={3} />)}
            {Array.from({length: 7}, (_, i) => {
              const h = 160 + rnd(i) * 220;
              return (
                <g key={i} opacity={p(frame, backlash + i * 3, 8)}>
                  <rect x={150 + i * 115} y={1060 - h} width={95} height={h} fill="#0b1630" stroke={BLUE} strokeWidth={3} />
                  {Array.from({length: Math.floor(h / 40)}, (_, k) => <rect key={k} x={162 + i * 115} y={1075 - h + k * 40} width={70} height={8} fill={BLUE} opacity={rnd(frame / 6 + i + k) > 0.4 ? 0.9 : 0.2} />)}
                </g>
              );
            })}
            <g transform={`translate(540 420) scale(${pulse})`}>
              <rect x={-150} y={-150} width={300} height={300} rx={26} fill="#0b1a33" stroke={frame >= cyber ? RED : BLUE} strokeWidth={10} />
              <text x={0} y={34} textAnchor="middle" fontFamily={DISPLAY} fontSize={110} fill={frame >= cyber ? RED : BLUE}>
                AI
              </text>
            </g>
            {frame >= jobs
              ? Array.from({length: 5}, (_, i) => (
                  <g key={i} transform={`translate(${200 + i * 170} 1240)`} opacity={1 - p(frame, jobs + i * 5, 14) * 0.85}>
                    <circle cx={0} cy={-90} r={22} fill={PAPER} />
                    <path d="M -34 0 Q -30 -60 0 -62 Q 30 -60 34 0 Z" fill={PAPER} />
                  </g>
                ))
              : null}
          </svg>
          <Flash at={cyber} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Debt ─────────────────────────
export const Debt: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [owe, accident] = [cue.s(1), cue.w('accident')];
  const rise = p(frame, owe, 60);
  const crash = p(frame, accident - 4, 18);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0, transform: shakeXY(frame, accident, 30, 16)}}>
        {/* government building */}
        <g transform="translate(540 1180)">
          <polygon points="-300,-300 0,-420 300,-300" fill={PAPER} />
          <rect x={-300} y={-300} width={600} height={30} fill={PAPER} />
          {Array.from({length: 6}, (_, i) => <rect key={i} x={-270 + i * 100} y={-262} width={40} height={230} fill={PAPER} opacity={0.9} />)}
          <rect x={-330} y={-30} width={660} height={34} fill={PAPER} />
        </g>
        {/* debt bars rising behind */}
        {Array.from({length: 8}, (_, i) => {
          const h = (120 + i * 70) * rise;
          return <rect key={i} x={100 + i * 112} y={720 - h} width={70} height={h} fill={RED} opacity={0.55} />;
        })}
        {/* market line: up, then crash */}
        <polyline
          points={Array.from({length: 12}, (_, i) => {
            const x = 80 + i * 84;
            const base = 640 - i * 30;
            const drop = i > 7 ? (i - 7) * 160 * crash : 0;
            return `${x},${base + drop}`;
          }).join(' ')}
          fill="none"
          stroke={BLUE}
          strokeWidth={14}
          strokeLinejoin="round"
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - p(frame, 4, owe))}
          style={{filter: `drop-shadow(0 0 14px ${BLUE})`}}
        />
      </svg>
      <Flash at={accident} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Re-hook ─────────────────────────
export const NotOnlyMoney: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {Array.from({length: 60}, (_, i) => {
          const a = rnd(i) * Math.PI * 2;
          const d = ((frame * 22 + i * 37) % 900) + 40;
          return <line key={i} x1={540 + Math.cos(a) * d * 0.6} y1={760 + Math.sin(a) * d * 0.6} x2={540 + Math.cos(a) * d} y2={760 + Math.sin(a) * d} stroke={i % 3 ? RED : BLUE} strokeWidth={4} opacity={0.7} />;
        })}
      </svg>
      <Center top={560} style={{transform: `scale(${lerp(0.6, 1.1, p(frame, 0, cue.dur))})`}}>
        <CoverArt width={300} crack={1} />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · France + heat ─────────────────────────
export const FranceHeat: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const planet = cue.s(1);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone tint={frame < planet ? BLUE : RED} />
      <div style={{position: 'absolute', top: frame < planet ? 300 : 160, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: frame < planet ? 1 : 0.3, transform: `scale(${frame < planet ? 1 : 0.6})`}}>
        <Ballot size={720} drop={p(frame, 10, 40)} />
      </div>
      <Label at={8} until={planet - 2} top={150} color={BLUE}>
        FRANCE · 2027 ELECTION
      </Label>
      <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 70, opacity: p(frame, planet - 6, 10)}}>
        <svg width={360} height={360} viewBox="-120 -120 240 240">
          <circle r={100} fill={RED} opacity={0.85} style={{filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(frame / 5)}px ${RED})`}} />
          <path d="M -60 -30 Q -20 -60 20 -30 Q 50 -10 70 -40 L 60 20 Q 20 40 -10 10 Q -40 0 -70 30 Z" fill="#5a0d10" />
          {Array.from({length: 8}, (_, i) => <path key={i} d={`M 0 -112 q 10 -14 0 -28`} stroke="#ff9a3c" strokeWidth={6} fill="none" transform={`rotate(${i * 45 + Math.sin(frame / 6) * 6})`} />)}
        </svg>
        <Thermometer size={380} level={p(frame, planet, 50)} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Lighter themes ─────────────────────────
export const Lighter: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const at = [cue.w('weight-loss'), cue.w('rockets'), cue.w('Hollywood')];
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone tint={BLUE} />
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        {(['pen', 'rocket', 'film'] as const).map((k, i) => {
          const t = p(frame, at[i] - 6, 14);
          return (
            <div key={k} style={{perspective: 1400, opacity: t}}>
              <div style={{transform: `rotateY(${lerp(80, (i - 1) * 8, t)}deg)`}}>
                <Panel kind={k} size={300} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Prophecy? ─────────────────────────
export const Prophecy: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const twist = cue.s(1);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <Center top={260} style={{filter: `brightness(${lerp(1, 0.35, p(frame, 4, 20))})`}}>
        <CoverArt width={680} crack={1} />
      </Center>
      <Center top={420} style={{opacity: p(frame, 6, 10), transform: `scale(${slam(frame, 6, 1.6).scale})`}}>
        <div style={{fontFamily: DISPLAY, fontSize: 520, color: RED, textShadow: `0 0 80px ${RED}`}}>?</div>
      </Center>
      <Flash at={twist} color={PAPER} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Expert forecasts ─────────────────────────
export const Forecasts: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const mixed = cue.s(1);
  return (
    <AbsoluteFill style={{background: '#0a0f1a'}}>
      <Duotone tint={BLUE} />
      <Label at={6} top={150} color={BLUE}>
        EXPERT FORECASTS · PUBLISHED EVERY YEAR
      </Label>
      {Array.from({length: 5}, (_, i) => {
        const t = p(frame, 6 + i * 6, 14);
        return (
          <div key={i} style={{position: 'absolute', left: 200 + i * 30, top: lerp(1400, 380 + i * 50, t), transform: `rotate(${(i - 2) * 4}deg)`, opacity: t}}>
            <div style={{width: 620, height: 420, background: PAPER, borderRadius: 6, boxShadow: '0 20px 50px #000', padding: 30, boxSizing: 'border-box'}}>
              <div style={{fontFamily: DISPLAY, fontSize: 52, color: INK}}>{2022 + i}</div>
              <svg width={560} height={260} viewBox="0 0 560 260">
                <polyline points={Array.from({length: 8}, (_, k) => `${k * 78},${140 + Math.sin(k + i) * 60}`).join(' ')} fill="none" stroke={i % 2 ? RED : BLUE} strokeWidth={8} />
                {Array.from({length: 4}, (_, k) => <rect key={k} x={0} y={200 + k * 14} width={300 + rnd(k + i) * 200} height={6} fill="#bbb" />)}
              </svg>
            </div>
          </div>
        );
      })}
      {frame >= mixed ? (
        <Center top={1080} style={{opacity: p(frame, mixed, 8)}}>
          <div style={{display: 'flex', gap: 30}}>
            <div style={{fontFamily: DISPLAY, fontSize: 110, color: '#3ad66b'}}>✔</div>
            <div style={{fontFamily: DISPLAY, fontSize: 110, color: RED}}>✘</div>
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · A hit ─────────────────────────
export const Hit: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const did = cue.s(1);
  return (
    <AbsoluteFill style={{background: '#0a0f1a'}}>
      <Duotone tint={BLUE} />
      <Label at={4} top={150} color={BLUE}>
        THE WORLD AHEAD 2022
      </Label>
      <Center top={340}>
        <svg width={760} height={700} viewBox="0 0 760 700">
          <rect x={80} y={40} width={200} height={400} fill={BLUE} />
          <rect x={280} y={40} width={200} height={400} fill={PAPER} />
          <rect x={480} y={40} width={200} height={400} fill={RED} />
          <rect x={60} y={20} width={14} height={680} fill="#999" />
          <g transform="translate(380 520)">
            <circle cx={0} cy={-150} r={50} fill={INK} />
            <path d="M -90 180 Q -85 -80 0 -90 Q 85 -80 90 180 Z" fill={INK} />
            <rect x={-150} y={60} width={300} height={140} fill="#1a1d24" stroke={PAPER} strokeWidth={4} />
          </g>
        </svg>
      </Center>
      <Stamp at={did + 2} y={760} size={140} rotate={-8} color="#3ad66b">
        Hit ✔
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · Two misses ─────────────────────────
export const Misses: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [r2023, avoided] = [cue.s(1), cue.s(2)];
  const card = (title: string, at: number, children: React.ReactNode, missAt: number) => {
    const t = p(frame, at, 14);
    return (
      <div style={{position: 'relative', width: 460, opacity: t, transform: `perspective(1400px) rotateY(${lerp(70, 0, t)}deg)`}}>
        <div style={{background: '#11161f', border: `4px solid ${PAPER}55`, borderRadius: 14, padding: 20, height: 560, boxSizing: 'border-box'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: PAPER, textAlign: 'center'}}>{title}</div>
          {children}
        </div>
        {frame >= missAt ? (
          <div style={{position: 'absolute', left: '50%', top: 300, transform: `translate(-50%, -50%) rotate(-10deg) scale(${slam(frame, missAt, 2.6).scale})`, fontFamily: DISPLAY, fontSize: 110, color: RED, border: `8px solid ${RED}`, padding: '0 24px', borderRadius: 14, background: '#07080dcc'}}>MISS ✘</div>
        ) : null}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card(
          '2020',
          4,
          <svg width={420} height={420} viewBox="-100 -100 200 200">
            <circle r={52} fill={RED} opacity={0.85} />
            {Array.from({length: 12}, (_, i) => (
              <g key={i} transform={`rotate(${i * 30 + frame})`}>
                <rect x={-4} y={-80} width={8} height={30} fill={RED} />
                <circle cy={-84} r={9} fill={RED} />
              </g>
            ))}
          </svg>,
          cue.w('admitted'),
        )}
        {card(
          '2023',
          r2023,
          <svg width={420} height={420} viewBox="0 0 420 420">
            <polyline points={`20,120 120,200 200,${lerp(300, 260, p(frame, avoided, 20))} 280,${lerp(360, 180, p(frame, avoided, 20))} 400,${lerp(380, 90, p(frame, avoided, 20))}`} fill="none" stroke={BLUE} strokeWidth={12} strokeLinejoin="round" />
            <text x={210} y={400} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={30} fill={PAPER} opacity={0.7}>
              "RECESSION INEVITABLE"
            </text>
          </svg>,
          avoided + 4,
        )}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Risks, not fate ─────────────────────────
export const NotFate: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const stop = cue.s(2);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0a0f1a 0%, ${INK} 55%)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 62%, #f5c45166 0%, transparent 45%)', opacity: p(frame, stop, 40)}} />
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <polygon points="440,700 640,700 1000,1400 80,1400" fill="#141a24" />
        <line x1={540} y1={720} x2={540} y2={1400} stroke={PAPER} strokeWidth={8} strokeDasharray="40 40" opacity={0.6} />
        {[0, 1, 2, 3].map((i) => {
          const x = i % 2 ? 760 + i * 30 : 320 - i * 30;
          const y = 760 + i * 150;
          const fall = p(frame, stop + i * 6, 16);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${fall * (i % 2 ? 80 : -80)})`} opacity={1 - fall * 0.8}>
              <rect x={-6} y={0} width={12} height={150} fill="#888" />
              <polygon points="0,-90 80,40 -80,40" fill={i % 2 ? RED : '#f5c451'} stroke={INK} strokeWidth={6} />
              <text x={0} y={20} textAnchor="middle" fontFamily={DISPLAY} fontSize={70} fill={INK}>
                !
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── 18 · Question + CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [comments, cta, dead] = [cue.s(1), cue.s(2), cue.w('Dead')];
  if (frame < cta) {
    const icons = [
      {c: RED, d: <path d="M 30 70 L 50 20 L 70 70 Z" fill={RED} />},
      {c: BLUE, d: <text x={50} y={64} textAnchor="middle" fontFamily={DISPLAY} fontSize={44} fill={BLUE}>AI</text>},
      {c: RED, d: <polyline points="15,30 40,45 60,40 85,80" fill="none" stroke={RED} strokeWidth={8} />},
      {c: BLUE, d: <g><rect x={20} y={30} width={20} height={40} fill={BLUE} /><rect x={40} y={30} width={20} height={40} fill={PAPER} /><rect x={60} y={30} width={20} height={40} fill={RED} /></g>},
      {c: RED, d: <circle cx={50} cy={50} r={28} fill={RED} />},
    ];
    return (
      <AbsoluteFill style={{background: INK}}>
        <Duotone />
        <Center top={260} style={{opacity: p(frame, 2, 10)}}>
          <div style={{fontFamily: DISPLAY, fontSize: 130, color: PAPER, textAlign: 'center', lineHeight: 1}}>
            WHICH ONE
            <br />
            <span style={{color: RED}}>HAPPENS?</span>
          </div>
        </Center>
        <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20}}>
          {icons.map((ic, i) => (
            <div key={i} style={{width: 170, height: 170, borderRadius: 24, border: `5px solid ${ic.c}`, background: '#0b0f1a', opacity: p(frame, 8 + i * 5, 8), transform: `scale(${slam(frame, 8 + i * 5, 1.6).scale})`}}>
              <svg width={160} height={160} viewBox="0 0 100 100">
                {ic.d}
              </svg>
            </div>
          ))}
        </div>
        {frame >= comments ? (
          <Center top={900} style={{opacity: p(frame, comments, 8)}}>
            <div style={{fontFamily: DISPLAY, fontSize: 70, color: INK, background: PAPER, padding: '10px 36px', borderRadius: 40}}>COMMENT 👇</div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  const card = (src: string, title: string, at: number, active: boolean) => {
    const s = slam(frame, at, 1.4);
    return (
      <div style={{width: 470, opacity: frame >= at ? s.opacity : 0, transform: `scale(${(frame >= at ? s.scale : 1) * (active ? pulse : 1)})`}}>
        <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${active ? RED : C.line}`, boxShadow: active ? `0 0 60px ${RED}88` : 'none'}}>
          <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 120, height: 120, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: C.white, paddingLeft: 10}}>▶</div>
          </div>
        </div>
        <div style={{fontFamily: DISPLAY, fontSize: 50, color: C.white, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>{title}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: INK}}>
      <Duotone />
      <Center top={120} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 120, color: RED, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('economist/cta/alcatraz.jpg', 'THE MEN WHO ESCAPED ALCATRAZ', cta + 6, frame < dead)}
        {card('economist/cta/dyatlov.jpg', 'THE HIKERS ON DEAD MOUNTAIN', dead, frame >= dead)}
      </div>
      <Center top={1060} style={{opacity: p(frame, dead + 20, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3}}>CHRONOS GALAXY</div>
      </Center>
    </AbsoluteFill>
  );
};

