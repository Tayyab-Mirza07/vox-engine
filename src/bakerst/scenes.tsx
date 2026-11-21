import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {has} from '../motion';
import {BG, BLUE, Boxes, Bus, Counter, DBLUE, DRED, Duo, Holmes, LightSweep, Label, PAPER, Person, RED, Recorder, Shop, VaultDoor, Walkie, Waves} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const PH = 'bakerst/photos/';

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
/** Minimal on-screen line: fades in at `at`, out at `until`. */
const Txt: React.FC<{at: number; until?: number; top: number; children: React.ReactNode; color?: string; size?: number}> = ({at, until = 1e9, top, children, color = PAPER, size = 96}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const s = slam(frame, at, 1.4);
  return (
    <Center top={top} style={{opacity: s.opacity * (1 - p(frame, until - 6, 6)), transform: `scale(${s.scale})`}}>
      <div style={{fontFamily: DISPLAY, fontSize: size, color, letterSpacing: 3, textAlign: 'center', lineHeight: 1.05, textShadow: '0 6px 0 #000'}}>{children}</div>
    </Center>
  );
};
const Tag: React.FC<{at: number; until?: number; top: number; children: React.ReactNode; left?: number}> = ({at, until = 1e9, top, children, left}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const o = p(frame, at, 8) * (1 - p(frame, until - 6, 6));
  const st: React.CSSProperties = {position: 'absolute', top, opacity: o, transform: `translateX(${lerp(-40, 0, p(frame, at, 10))}px)`};
  return left === undefined ? <Center top={top} style={{opacity: o}}><Label>{children}</Label></Center> : <div style={{...st, left}}><Label>{children}</Label></div>;
};
/** Real photo in the house duotone (black → blue shadows, red highlights). */
const DuoPhoto: React.FC<{src: string; t: number; credit: string; fallback?: React.ReactNode}> = ({src, t, credit, fallback}) =>
  has(src) ? (
    <AbsoluteFill style={{overflow: 'hidden', background: BG}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.15, 1.3, t)}) translateY(${lerp(20, -20, t)}px)`, filter: 'grayscale(1) contrast(1.35) brightness(0.9)'}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${BLUE}, ${RED})`, mixBlendMode: 'multiply', opacity: 0.85}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle, transparent 40%, #000 100%)'}} />
      <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99'}}>{credit}</div>
    </AbsoluteFill>
  ) : (
    <>{fallback ?? null}</>
  );
const Shake: React.FC<{at: number; len?: number; amt?: number; children: React.ReactNode}> = ({at, len = 14, amt = 26, children}) => {
  const frame = useCurrentFrame();
  const k = frame >= at && frame < at + len ? (1 - (frame - at) / len) * amt : 0;
  return <AbsoluteFill style={{transform: `translate(${(rnd(frame) - 0.5) * k}px, ${(rnd(frame + 7) - 0.5) * k}px)`}}>{children}</AbsoluteFill>;
};
const Floor: React.FC<{y: number; color?: string}> = ({y, color = BLUE}) => <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 6, background: color, boxShadow: `0 0 30px ${color}`}} />;

// ── shared set: the vault door above, the hidden men below ──
const VaultSet: React.FC<{cutaway: number; leave: number; shh?: boolean}> = ({cutaway, leave, shh}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Center top={150}>
        <VaultDoor size={640} />
      </Center>
      <Floor y={820} color={RED} />
      {[0, 1].map((k) => (
        <div key={k} style={{position: 'absolute', top: 470, left: (k ? 700 : 160) + leave * (k ? 600 : -600), opacity: 1 - leave * 0.6}}>
          <Person h={360} hat="helmet" color="#000" rim={BLUE} flip={k === 1} pose={leave > 0 ? 'walk' : 'stand'} step={leave > 0 ? frame / 3 : 0} />
        </div>
      ))}
      {/* cutaway: the cavity under the floor */}
      <div style={{position: 'absolute', left: 120, right: 120, top: 860, height: 380, opacity: cutaway, background: `linear-gradient(180deg, ${DBLUE}, #050a18)`, border: `4px solid ${BLUE}`, borderRadius: 20, boxShadow: `inset 0 0 80px ${BLUE}55`}}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{position: 'absolute', bottom: 10, left: 90 + k * 230}}>
            <Person h={300} pose={k === 1 && shh ? 'shh' : 'crouch'} color="#000" rim={BLUE} />
          </div>
        ))}
      </div>
    </>
  );
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [behind, away] = [cue.s(1), cue.s(2)];
  const cut = p(frame, behind, 6);
  const leave = p(frame, cue.w('walked'), 40);
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.06, p(frame, 0, behind, (n) => n)) * (frame >= behind ? lerp(1.1, 1, p(frame, behind, 10)) : 1)})`}}>
      <Duo red={[0.5, 0.25]} blue={[0.5, 0.75]} />
      <VaultSet cutaway={cut} leave={leave} shh />
      <Txt at={behind + 8} until={away} top={90} size={84} color={PAPER}>
        THEY WERE RIGHT THERE.
      </Txt>
      <LightSweep at={2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · London, Baker Street ─────────────────────────
export const London: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sept, bank, holmes] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame >= bank && frame < holmes && has(`${PH}plaque.jpg`)) {
    return (
      <AbsoluteFill>
        <DuoPhoto src={`${PH}plaque.jpg`} t={p(frame, bank, holmes - bank, (n) => n)} credit="185 Baker Street today · Photo: Spudgun67 · CC BY-SA 4.0" />
        <Tag at={bank + 4} top={200}>
          LLOYDS BANK · 185 BAKER ST
        </Tag>
        <LightSweep at={bank} />
      </AbsoluteFill>
    );
  }
  const drive = (frame * 7) % 2000;
  return (
    <AbsoluteFill>
      <Duo red={[0.7, 0.2]} blue={[0.2, 0.8]} />
      {/* ghosted Holmes in the sky */}
      <Center top={180} style={{opacity: frame >= holmes ? p(frame, holmes, 16) * 0.9 : 0.12}}>
        <Holmes size={480} />
      </Center>
      {/* skyline + corner bank */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 7}, (_, i) => <rect key={i} x={i * 160 - 20} y={620 + rnd(i) * 160} width={150} height={600} fill="#07090f" stroke={DBLUE} strokeWidth={3} />)}
        <rect x={300} y={560} width={480} height={660} fill="#0a0e18" stroke={BLUE} strokeWidth={5} />
        {Array.from({length: 12}, (_, i) => <rect key={`w${i}`} x={340 + (i % 4) * 110} y={620 + Math.floor(i / 4) * 140} width={60} height={80} fill={frame >= bank ? RED : '#1c2740'} opacity={0.8} />)}
        <rect x={0} y={1220} width={W} height={8} fill={BLUE} />
        {[120, 960].map((x) => (
          <g key={x}>
            <rect x={x - 5} y={900} width={10} height={320} fill="#000" />
            <circle cx={x} cy={900} r={14} fill="#ffe8b0" />
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', top: 1010, left: drive - 500}}>
        <Bus width={380} />
      </div>
      <Tag at={sept} top={200}>
        BAKER STREET, LONDON · SEPT 1971
      </Tag>
      <LightSweep at={holmes} color={RED} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · The mastermind and the blueprint ─────────────────────────
export const Mastermind: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [blue, story, tunnel] = [cue.s(1), cue.s(2), cue.s(3)];
  const zoom = p(frame, blue, 14);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, ${RED}33, transparent 45%)`}} />
      <AbsoluteFill style={{transform: `scale(${lerp(1, 1.6, zoom)})`, transformOrigin: '50% 62%'}}>
        {/* lamp */}
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M 540 220 L 300 900 L 780 900 Z" fill="#ffe8b0" opacity={0.08} />
          <path d="M 470 200 L 610 200 L 580 240 L 500 240 Z" fill={RED} />
        </svg>
        <div style={{position: 'absolute', left: 340, top: 520}}>
          <Person h={560} pose="sit" color="#000" rim={RED} />
        </div>
        {/* open book */}
        <div style={{position: 'absolute', left: 300, top: 880, width: 480, height: 200, perspective: 800}}>
          <div style={{width: '100%', height: '100%', background: PAPER, transform: 'rotateX(45deg)', boxShadow: `0 0 50px ${RED}66`, display: 'flex'}}>
            <div style={{flex: 1, borderRight: '4px solid #bbb', padding: 18}}>{Array.from({length: 6}, (_, i) => <div key={i} style={{height: 8, background: '#999', margin: '10px 0', width: `${70 + rnd(i) * 30}%`}} />)}</div>
            <div style={{flex: 1, padding: 18}}>{Array.from({length: 6}, (_, i) => <div key={i} style={{height: 8, background: '#999', margin: '10px 0', width: `${70 + rnd(i + 9) * 30}%`}} />)}</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* glowing tunnel diagram above the pages */}
      {frame >= story ? (
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0, opacity: p(frame, story, 12)}}>
          <rect x={150} y={330} width={220} height={160} fill="none" stroke={BLUE} strokeWidth={6} />
          <rect x={710} y={330} width={220} height={160} fill="none" stroke={BLUE} strokeWidth={6} />
          <text x={260} y={320} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={BLUE}>SHOP</text>
          <text x={820} y={320} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={BLUE}>BANK</text>
          <path d={`M 260 490 L 260 560 L ${lerp(260, 820, p(frame, tunnel, 30))} 560`} stroke={RED} strokeWidth={14} fill="none" strokeDasharray="22 12" style={{filter: `drop-shadow(0 0 12px ${RED})`}} />
          {frame >= tunnel + 30 ? <path d="M 820 560 L 820 490" stroke={RED} strokeWidth={14} /> : null}
        </svg>
      ) : null}
      <Tag at={8} until={blue} top={190} left={60}>
        ANTHONY GAVIN
      </Tag>
      <Txt at={blue} until={story} top={180} size={110} color={RED}>
        THE BLUEPRINT?
      </Txt>
      <LightSweep at={story} color={BLUE} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Wolfe and Tucker ─────────────────────────
export const Setup: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [wolfe, tucker] = [cue.s(1), cue.s(2)];
  const a = p(frame, wolfe - 6, 14);
  const b = p(frame, tucker - 6, 14);
  return (
    <AbsoluteFill style={{background: BG}}>
      {/* top half: the leather shop lease */}
      <div style={{position: 'absolute', top: 80, left: 0, right: 0, height: 600, transform: `translateX(${lerp(-W, 0, Math.max(a, frame < wolfe ? p(frame, 0, 14) : 1))}px)`, background: `linear-gradient(180deg, ${DRED}, ${BG})`, borderBottom: `6px solid ${RED}`}}>
        <div style={{position: 'absolute', left: 80, top: 80}}>
          <Shop w={420} h={460} sign="LE SAC" color={RED} glow />
        </div>
        <div style={{position: 'absolute', left: 600, top: 140}}>
          <Person h={420} color="#000" rim={RED} />
        </div>
        <div style={{position: 'absolute', left: 560, top: 470, width: 300, height: 90, background: PAPER, transform: 'rotate(-4deg)'}}>
          <svg width={300} height={90}>
            <path d={`M 30 60 Q 60 20 90 55 T 150 50 T ${lerp(150, 260, p(frame, wolfe + 20, 30))} 45`} stroke="#1a1712" strokeWidth={4} fill="none" />
          </svg>
        </div>
        <Tag at={wolfe + 4} top={20} left={40}>
          BENJAMIN WOLFE
        </Tag>
      </div>
      {/* bottom half: the deposit box */}
      <div style={{position: 'absolute', top: 700, left: 0, right: 0, height: 600, transform: `translateX(${lerp(W, 0, b)}px)`, background: `linear-gradient(180deg, ${DBLUE}, ${BG})`}}>
        <div style={{position: 'absolute', left: 60, top: 80, opacity: 0.6}}>
          <Boxes w={420} cols={5} rows={6} />
        </div>
        <div style={{position: 'absolute', left: 560, top: 120}}>
          <Person h={420} color="#000" rim={BLUE} />
        </div>
        <div style={{position: 'absolute', left: lerp(860, 600, p(frame, tucker + 14, 16)), top: 330, width: 200, height: 70, background: '#3a4454', border: `4px solid ${BLUE}`}} />
        <Tag at={tucker + 4} top={20} left={40}>
          REG TUCKER
        </Tag>
      </div>
      <LightSweep at={wolfe} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The umbrella ─────────────────────────
export const Umbrella: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [arms, umb] = [cue.s(1), cue.s(2)];
  const freeze = frame >= umb;
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', top: 120, left: 40, opacity: 0.45}}>
        <Boxes w={1000} cols={10} rows={6} />
      </div>
      {/* checkered floor */}
      <svg width={W} height={600} style={{position: 'absolute', top: 820}}>
        {Array.from({length: 60}, (_, i) => <rect key={i} x={(i % 10) * 108} y={Math.floor(i / 10) * 70} width={108} height={70} fill={(i + Math.floor(i / 10)) % 2 ? '#0c1120' : '#05070c'} />)}
      </svg>
      <div style={{position: 'absolute', left: 390, top: 450}}>
        <Person h={460} pose={frame >= arms ? 'arms' : 'stand'} color="#000" rim={freeze ? RED : BLUE} />
      </div>
      {/* the umbrella held out along the floor */}
      {frame >= umb - 4 ? (
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0, filter: freeze ? `drop-shadow(0 0 16px ${RED})` : undefined}}>
          <line x1={lerp(510, 560, p(frame, umb - 4, 10))} y1={640} x2={lerp(560, 990, p(frame, umb - 4, 10))} y2={900} stroke={freeze ? RED : PAPER} strokeWidth={14} strokeLinecap="round" />
          <path d="M 560 640 q -26 -30 -6 -44" stroke={freeze ? RED : PAPER} strokeWidth={10} fill="none" />
        </svg>
      ) : null}
      {/* measuring ticks */}
      {frame >= arms ? (
        <svg width={W} height={60} style={{position: 'absolute', top: 400}}>
          <line x1={240} y1={30} x2={lerp(240, 840, p(frame, arms, 16))} y2={30} stroke={BLUE} strokeWidth={4} />
          {Array.from({length: 13}, (_, i) => <line key={i} x1={240 + i * 50} y1={18} x2={240 + i * 50} y2={42} stroke={BLUE} strokeWidth={3} opacity={240 + i * 50 <= lerp(240, 840, p(frame, arms, 16)) ? 1 : 0} />)}
        </svg>
      ) : null}
      {freeze ? <AbsoluteFill style={{border: `10px solid ${RED}`, opacity: 0.5 + 0.5 * Math.sin(frame / 3)}} /> : null}
      <Txt at={umb + 4} top={180} size={80} color={RED}>
        MEASURED WITH
        <br />
        AN UMBRELLA
      </Txt>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The tunnel ─────────────────────────
const CrossSection: React.FC<{tunnel: number; mound: number; diggerX?: number}> = ({tunnel, mound, diggerX}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', top: 300, left: 40}}>
        <Shop w={300} h={300} sign="LE SAC" color={RED} />
      </div>
      <div style={{position: 'absolute', top: 300, left: 390}}>
        <Shop w={300} h={300} sign="CHICKEN INN" color={BLUE} />
      </div>
      <div style={{position: 'absolute', top: 300, left: 740}}>
        <Shop w={300} h={300} sign="LLOYDS" color={PAPER} />
      </div>
      <div style={{position: 'absolute', top: 600, left: 0, right: 0, height: 700, background: 'repeating-linear-gradient(0deg, #0d0a08 0 30px, #120e0b 30px 60px)'}} />
      <Floor y={600} color={BLUE} />
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* shop basement + mound */}
        <rect x={60} y={640} width={260} height={220} fill="#050403" stroke={RED} strokeWidth={4} />
        <path d={`M 70 860 Q 190 ${860 - 160 * mound} 310 860 Z`} fill="#3a2a1a" />
        {/* tunnel */}
        <rect x={300} y={790} width={lerp(0, 520, tunnel)} height={60} fill="#050403" stroke={RED} strokeWidth={4} style={{filter: `drop-shadow(0 0 14px ${RED})`}} />
        {/* vault */}
        <rect x={760} y={640} width={260} height={150} fill="#0a0e18" stroke={PAPER} strokeWidth={4} />
        <text x={890} y={725} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={PAPER}>VAULT</text>
      </svg>
      {diggerX !== undefined ? (
        <div style={{position: 'absolute', top: 720, left: diggerX, transform: `rotate(${Math.sin(frame / 4) * 6}deg)`}}>
          <Person h={140} pose="dig" color="#000" rim={RED} />
        </div>
      ) : null}
    </>
  );
};
export const Tunnel: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [feet, under, tons] = [cue.s(1), cue.s(2), cue.s(3)];
  const prog = p(frame, 0, cue.dur - 10, (n) => n);
  if (frame >= under && frame < tons && has(`${PH}tunnel.png`)) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Center top={lerp(380, 340, p(frame, under, tons - under, (n) => n))} style={{transform: `scale(${lerp(1, 1.12, p(frame, under, tons - under, (n) => n))})`}}>
          <div style={{width: 1000, height: 770, position: 'relative', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}66`}}>
            <Img src={staticFile(`${PH}tunnel.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)'}} />
            <AbsoluteFill style={{background: `linear-gradient(90deg, ${RED}, ${BLUE})`, mixBlendMode: 'multiply', opacity: 0.7}} />
          </div>
        </Center>
        <div style={{position: 'absolute', left: 40, top: 1180, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99'}}>Diagram: Goran tek-en · CC BY-SA 4.0</div>
        <Tag at={under + 4} top={200}>
          THE REAL TUNNEL · 40 FT
        </Tag>
        <LightSweep at={under} color={RED} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG, transform: `translateY(${lerp(0, -120, prog)}px)`}}>
      <CrossSection tunnel={prog} mound={p(frame, tons, 30)} diggerX={300 + prog * 460} />
      <div style={{position: 'absolute', top: 960, left: 100}}>{frame >= feet ? <Counter at={feet} to={40} suffix=" FT" size={150} /> : null}</div>
      <div style={{position: 'absolute', top: 960, left: 600}}>{frame >= tons ? <Counter at={tons} to={8} suffix=" TONS" size={150} color={BLUE} /> : null}</div>
      <Tag at={4} until={under} top={160}>
        WEEKENDS ONLY
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Collapse ─────────────────────────
export const Collapse: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const col = cue.w('collapsed');
  const lit = cue.s(1);
  const tilt = p(frame, col, 18);
  if (frame >= lit && frame < lit + 14) return <AbsoluteFill style={{background: '#000'}} />;
  return (
    <Shake at={col} len={18} amt={40}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, #0d0a08, ${BG})`}}>
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={0} y={300} width={W} height={60} fill="#1a1410" />
          <ellipse cx={540} cy={1000} rx={lerp(60, 300, tilt)} ry={lerp(20, 90, tilt)} fill="#000" stroke={RED} strokeWidth={6} style={{filter: `drop-shadow(0 0 20px ${RED})`}} />
          {/* the jack */}
          <g transform={`translate(540 ${lerp(820, 960, tilt)}) rotate(${lerp(0, 28, tilt)})`}>
            <rect x={-70} y={-480} width={140} height={60} fill="#3a4454" />
            <rect x={-30} y={-420} width={60} height={340} fill="#5a6678" />
            <rect x={-90} y={-80} width={180} height={110} rx={10} fill={RED} />
          </g>
          {Array.from({length: 18}, (_, i) => (
            <rect key={i} x={540 + (rnd(i) - 0.5) * 600} y={1000 + lerp(0, 300, tilt) * rnd(i + 3)} width={20} height={20} fill="#2a2018" opacity={tilt} transform={`rotate(${i * 30})`} />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 120, top: 600, opacity: p(frame, col + 4, 8)}}>
          <Person h={360} pose="arms" color="#000" rim={BLUE} />
        </div>
      </AbsoluteFill>
    </Shake>
  );
};

// ───────────────────────── 7 · Jack, lance, blast ─────────────────────────
export const Blast: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [lance, boom] = [cue.s(1), cue.s(2)];
  const blast = cue.w('blast');
  const traffic = cue.w('traffic');
  if (frame < lance) {
    // the jack sinking into the old well
    const s = p(frame, 0, lance, (n) => n);
    return (
      <AbsoluteFill style={{background: BG}}>
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={380} y={900} width={320} height={500} fill="#000" stroke={BLUE} strokeWidth={6} />
          <rect x={460} y={lerp(560, 860, s)} width={160} height={300} fill={RED} />
          <rect x={420} y={lerp(520, 820, s)} width={240} height={50} fill="#3a4454" />
        </svg>
        <Txt at={6} top={260} size={130} color={RED}>
          100 TONS
        </Txt>
        <Tag at={20} top={1240}>
          A HIDDEN OLD WELL
        </Tag>
      </AbsoluteFill>
    );
  }
  if (frame < boom) {
    // the thermal lance sputtering
    return (
      <AbsoluteFill style={{background: BG}}>
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={0} y={420} width={W} height={120} fill="#2a2e36" />
          <line x1={240} y1={1100} x2={520} y2={560} stroke="#5a6678" strokeWidth={18} />
          {Array.from({length: 26}, (_, i) => {
            const a = rnd(i + frame) * Math.PI * 2;
            const r = rnd(i * 3 + frame) * 160;
            return <circle key={i} cx={520 + Math.cos(a) * r} cy={560 + Math.sin(a) * r * 0.6} r={4} fill={i % 3 ? '#ffcf73' : RED} opacity={frame - lance < 30 ? 1 : 0.2} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 120, top: 780}}>
          <Person h={360} pose="dig" color="#000" rim={RED} />
        </div>
        <Txt at={lance + 24} top={220} size={110} color={BLUE}>
          FAILED.
        </Txt>
      </AbsoluteFill>
    );
  }
  // two panels: the bus above, the plunger below; flash on "blast"
  const flash = frame >= blast ? 1 - p(frame, blast, 16) : 0;
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, height: 560, background: `linear-gradient(180deg, ${DBLUE}, ${BG})`, overflow: 'hidden', borderBottom: `6px solid ${BLUE}`}}>
        <div style={{position: 'absolute', top: 260, left: lerp(-420, 1100, p(frame, traffic - 30, 70, (n) => n))}}>
          <Bus width={420} />
        </div>
        <div style={{position: 'absolute', top: 120, left: 760}}>
          <Shop w={260} h={320} sign="LLOYDS" color={PAPER} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 700, left: 0, right: 0, height: 580, background: `linear-gradient(180deg, #1a0508, ${BG})`}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: RED, opacity: 0.3 + 0.7 * flash}} />
        <div style={{position: 'absolute', left: 260, top: 160}}>
          <Person h={380} pose="crouch" color="#000" rim={RED} />
        </div>
        <svg width={300} height={300} style={{position: 'absolute', left: 560, top: 260}}>
          <rect x={60} y={120} width={180} height={120} fill="#3a4454" />
          <rect x={140} y={lerp(30, 90, p(frame, blast - 6, 6))} width={20} height={100} fill="#5a6678" />
          <rect x={100} y={lerp(20, 80, p(frame, blast - 6, 6))} width={100} height={20} fill={RED} />
        </svg>
      </div>
      {flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash * 0.85}} /> : null}
      <Shake at={blast} len={12} amt={30}>
        <></>
      </Shake>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · They were in ─────────────────────────
export const InTheVault: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [inn, n] = [cue.s(1), cue.s(2)];
  const out = p(frame, inn, cue.dur - inn, (x) => x);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{transform: `scale(${lerp(1.6, 1, out)})`}}>
        <div style={{position: 'absolute', top: 120, left: 40}}>
          <Boxes w={1000} cols={10} rows={14} lit={BLUE} />
        </div>
        {/* ragged hole and reaching hand */}
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M 300 1180 L 360 1080 L 450 1110 L 540 1060 L 640 1100 L 760 1070 L 800 1180 Z" fill="#000" stroke={RED} strokeWidth={6} />
          <g transform={`translate(540 ${lerp(1260, 1060, p(frame, 4, 20))})`}>
            <rect x={-30} y={0} width={60} height={160} fill="#000" />
            <path d="M -40 0 L -40 -60 M -20 0 L -20 -90 M 0 0 L 0 -100 M 20 0 L 20 -90 M 40 0 L 46 -50" stroke="#000" strokeWidth={22} strokeLinecap="round" />
            <rect x={-46} y={-20} width={92} height={50} rx={16} fill="#000" />
          </g>
        </svg>
      </AbsoluteFill>
      <Center top={560}>{frame >= n ? <Counter at={n} to={268} dur={36} size={300} /> : null}</Center>
      {frame >= n ? (
        <Center top={880}>
          <Label>SAFETY DEPOSIT BOXES</Label>
        </Center>
      ) : null}
      <LightSweep at={inn} color={BLUE} strength={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Someone was listening ─────────────────────────
export const Listening: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const word = cue.s(1);
  if (has(`${PH}bank.jpg`)) {
    const z = p(frame, 0, cue.dur, (n) => n);
    return (
      <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${lerp(1.05, 1.18, z)})`, transformOrigin: '50% 40%'}}>
          <Img src={staticFile(`${PH}bank.jpg`)} style={{position: 'absolute', left: -620, top: 0, width: 2797, height: 1920, filter: 'grayscale(1) invert(1) contrast(1.6) brightness(0.95)'}} />
          <AbsoluteFill style={{background: BLUE, mixBlendMode: 'multiply', opacity: 0.55}} />
          <Waves x={250} y={437} dir={0.6} color={RED} n={6} />
          <div style={{position: 'absolute', left: 220, top: 407, width: 60, height: 60, borderRadius: 30, background: RED, boxShadow: `0 0 40px ${RED}`}} />
          <div style={{position: 'absolute', left: 693, top: 714, width: 60, height: 60, borderRadius: 30, background: frame >= word ? PAPER : BLUE, boxShadow: `0 0 40px ${BLUE}`}} />
          <div style={{position: 'absolute', left: 300, top: 360}}><Label size={30}>BANK</Label></div>
          <div style={{position: 'absolute', left: 560, top: 800}}><Label size={30}>WIMPOLE ST</Label></div>
        </AbsoluteFill>
        <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99'}}>Map: SchroCat / OpenStreetMap · CC BY-SA 4.0</div>
        <Tag at={6} top={200}>
          HALF A MILE AWAY
        </Tag>
        <Txt at={word} top={300} size={90} color={RED}>
          SOMEONE WAS
          <br />
          LISTENING
        </Txt>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 125 - 10} y={760 + rnd(i + 2) * 200} width={120} height={700} fill="#06080e" stroke={DBLUE} strokeWidth={3} />)}
        <rect x={60} y={720} width={240} height={700} fill="#0a0e18" stroke={RED} strokeWidth={4} />
        <text x={180} y={780} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={RED}>BANK</text>
        <rect x={820} y={520} width={200} height={900} fill="#0a0e18" stroke={BLUE} strokeWidth={4} />
        <rect x={870} y={600} width={100} height={130} fill={frame >= word ? '#ffe8b0' : '#1c2740'} />
      </svg>
      <Waves x={180} y={720} dir={-0.35} color={RED} n={6} />
      <Tag at={6} top={200}>
        HALF A MILE AWAY
      </Tag>
      <Txt at={word} top={300} size={90} color={RED}>
        SOMEONE WAS
        <br />
        LISTENING
      </Txt>
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Robert Rowlands ─────────────────────────
export const Rowlands: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [voices, lookout] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Duo red={[0.2, 0.3]} blue={[0.7, 0.6]} />
      {/* bed + man + radio */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={80} y={980} width={760} height={60} fill="#1c2740" />
        <rect x={80} y={900} width={140} height={160} fill="#1c2740" />
        <rect x={700} y={760} width={260} height={180} rx={14} fill="#141821" stroke={frame >= voices ? RED : BLUE} strokeWidth={6} style={{filter: frame >= voices ? `drop-shadow(0 0 30px ${RED})` : undefined}} />
        <circle cx={760} cy={850} r={40} fill="#2c3442" />
        <rect x={820} y={800} width={110} height={20} fill={frame >= voices ? RED : '#2c3442'} />
        <rect x={820} y={840} width={110} height={10} fill="#2c3442" />
        {frame >= voices ? Array.from({length: 18}, (_, i) => <rect key={i} x={830 + i * 6} y={890 - Math.abs(Math.sin(frame / 3 + i)) * 30} width={4} height={Math.abs(Math.sin(frame / 3 + i)) * 30} fill={RED} />) : null}
      </svg>
      <div style={{position: 'absolute', left: 220, top: 640}}>
        <Person h={400} pose="sit" color="#000" rim={BLUE} />
      </div>
      <Tag at={8} until={voices + 20} top={200} left={60}>
        ROBERT ROWLANDS
      </Tag>
      {/* inset: rooftop lookout */}
      {frame >= lookout ? (
        <div style={{position: 'absolute', right: 50, top: 170, width: 420, height: 460, border: `6px solid ${RED}`, background: `linear-gradient(180deg, ${DBLUE}, ${BG})`, overflow: 'hidden', opacity: p(frame, lookout, 8), transform: `scale(${slam(frame, lookout, 1.3).scale})`}}>
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: '#000'}} />
          <div style={{position: 'absolute', bottom: 70, left: 130}}>
            <Person h={280} pose="crouch" color="#000" rim={RED} />
          </div>
          <div style={{position: 'absolute', bottom: 180, left: 240}}>
            <Walkie size={90} />
          </div>
          <div style={{position: 'absolute', top: 10, left: 10}}>
            <Label size={26}>LOOKOUT</Label>
          </div>
        </div>
      ) : null}
      <Tag at={voices} top={1230}>
        ~11 PM
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Prank? Record. ─────────────────────────
export const Record: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [prank, rec, tape] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame < rec) {
    // phone call, receiver slammed
    return (
      <AbsoluteFill style={{background: BG}}>
        <Duo red={[0.5, 0.4]} blue={[0.5, 0.9]} />
        <Center top={420}>
          <svg width={520} height={420} viewBox="0 0 520 420">
            <rect x={60} y={200} width={400} height={200} rx={30} fill="#141821" stroke={BLUE} strokeWidth={6} />
            <circle cx={260} cy={300} r={70} fill="#2c3442" />
            <g transform={`translate(0 ${frame >= prank ? lerp(-60, 0, p(frame, prank, 6)) : -60}) rotate(${frame >= prank ? 0 : -8} 260 170)`}>
              <path d="M 60 170 Q 60 110 130 110 L 390 110 Q 460 110 460 170 L 420 190 L 380 160 L 140 160 L 100 190 Z" fill="#000" stroke={RED} strokeWidth={5} />
            </g>
          </svg>
        </Center>
        <Txt at={prank} top={240} size={110} color={RED}>
          A PRANK?
        </Txt>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG, transform: `scale(${lerp(1.25, 1, p(frame, rec, 8))})`}}>
      <Duo red={[0.85, 0.2]} blue={[0.2, 0.7]} />
      <Center top={480}>
        <Recorder width={900} rec={1} />
      </Center>
      <Txt at={rec + 2} until={tape} top={240} size={120} color={RED}>
        ● REC
      </Txt>
      <Txt at={tape + 6} top={240} size={80} color={PAPER}>
        "300 GRAND
        <br />
        TO CUT UP"
      </Txt>
      <LightSweep at={rec} color={RED} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The lookout wants to quit ─────────────────────────
export const Lookout: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const stay = cue.s(1);
  const up = frame < stay + 20;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${BG} 0%, ${DBLUE} 70%, ${BG} 100%)`}}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 10}, (_, i) => <rect key={i} x={i * 110} y={760 + rnd(i + 4) * 160} width={104} height={500} fill="#06080e" stroke={DBLUE} strokeWidth={3} />)}
        {Array.from({length: 40}, (_, i) => <circle key={`s${i}`} cx={rnd(i) * W} cy={rnd(i + 9) * 600 + 100} r={2} fill={PAPER} opacity={0.5} />)}
        <rect x={0} y={1100} width={W} height={200} fill="#000" />
      </svg>
      <div style={{position: 'absolute', left: 380, top: up ? 600 : 740, transition: 'none'}}>
        <Person h={up ? 500 : 360} pose={up ? 'stand' : 'crouch'} color="#000" rim={RED} />
      </div>
      <div style={{position: 'absolute', left: 600, top: up ? 640 : 860, transform: `rotate(${up ? -20 : 0}deg)`}}>
        <Walkie size={120} />
      </div>
      {up ? <Txt at={8} top={240} size={100} color={RED}>"I'M OFF."</Txt> : <Txt at={stay + 20} top={240} size={100} color={BLUE}>ALL NIGHT.</Txt>}
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Which bank? ─────────────────────────
export const WhichBank: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [believed, which, n] = [cue.s(1), cue.s(2), cue.s(3)];
  const pins = Math.floor(p(frame, which, cue.dur - which, (x) => x) * 120);
  return (
    <AbsoluteFill style={{background: BG}}>
      {/* abstract London street map */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 26}, (_, i) => (
          <line key={i} x1={rnd(i) * W} y1={150} x2={rnd(i + 40) * W} y2={1300} stroke={DBLUE} strokeWidth={3 + rnd(i + 3) * 8} />
        ))}
        {Array.from({length: 18}, (_, i) => (
          <line key={`h${i}`} x1={0} y1={150 + rnd(i + 70) * 1150} x2={W} y2={150 + rnd(i + 90) * 1150} stroke={DBLUE} strokeWidth={3 + rnd(i + 5) * 6} />
        ))}
        <path d="M 0 900 Q 300 820 540 960 T 1080 880" stroke={BLUE} strokeWidth={40} fill="none" opacity={0.4} />
        {Array.from({length: pins}, (_, i) => (
          <g key={`p${i}`} transform={`translate(${60 + rnd(i * 7) * 960} ${200 + rnd(i * 11) * 1050})`}>
            <circle r={12} fill={RED} />
            <path d="M -8 6 L 0 26 L 8 6 Z" fill={RED} />
          </g>
        ))}
      </svg>
      {frame < which ? (
        <Center top={520}>
          <div style={{display: 'flex', gap: 40}}>
            {[0, 1].map((k) => <Person key={k} h={420} pose={k ? 'point' : 'stand'} color="#000" rim={BLUE} flip={k === 0} />)}
          </div>
        </Center>
      ) : null}
      <Tag at={6} until={believed} top={200}>
        2 AM · SCOTLAND YARD
      </Tag>
      <Txt at={which} until={n} top={260} size={130} color={PAPER}>
        WHICH BANK?
      </Txt>
      <Center top={240}>{frame >= n ? <Counter at={n} to={750} dur={30} suffix=" BANKS" size={150} /> : null}</Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · They walked away ─────────────────────────
export const WalkedAway: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [shut, inside, moved] = [cue.s(1), cue.s(3), cue.s(4)];
  const leave = p(frame, moved, 50, (n) => n);
  const beat = frame >= inside && frame < moved ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  return (
    <AbsoluteFill>
      <Duo red={[0.5, 0.25]} blue={[0.5, 0.75]} mix={1 - leave * 0.5} />
      <VaultSet cutaway={p(frame, inside, 10)} leave={leave} />
      {beat > 0 ? <AbsoluteFill style={{boxShadow: `inset 0 0 ${120 * beat}px ${RED}`}} /> : null}
      <Tag at={shut} until={inside} top={100}>
        TIME-LOCKED
      </Tag>
      <Txt at={moved + 6} top={90} size={90} color={RED}>
        THEY WALKED AWAY
      </Txt>
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Monday ─────────────────────────
export const Monday: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [boxes, hole, why, roads, off] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  if (frame >= why) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Center top={480} style={{opacity: frame < roads ? p(frame, why, 10) : 0.15}}>
          <VaultDoor size={560} />
        </Center>
        <Txt at={why} top={200} size={120} color={PAPER}>
          WHY THIS BANK?
        </Txt>
        {frame >= roads ? (
          <div style={{position: 'absolute', left: 120, top: 520, transform: `translateY(${Math.sin(frame * 2) * (frame < off ? 6 : 0)}px)`}}>
            <svg width={300} height={500} viewBox="0 0 300 500">
              <rect x={130} y={0} width={40} height={300} fill="#3a4454" />
              <rect x={60} y={40} width={180} height={40} fill="#5a6678" />
              <path d="M 140 300 L 160 300 L 150 380 Z" fill={PAPER} />
              {Array.from({length: 8}, (_, i) => <circle key={i} cx={150 + (rnd(i + frame) - 0.5) * 160} cy={400 + rnd(i * 2 + frame) * 60} r={8} fill={RED} />)}
            </svg>
          </div>
        ) : null}
        {frame >= roads ? (
          <div style={{position: 'absolute', right: 120, top: 560, width: 300, height: 400, background: '#141821', border: `6px solid ${frame >= off ? RED : BLUE}`, borderRadius: 20}}>
            <div style={{fontFamily: DISPLAY, fontSize: 56, color: PAPER, textAlign: 'center', marginTop: 20}}>ALARM</div>
            <div style={{position: 'absolute', left: 110, top: 120, width: 80, height: 200, background: '#05070c', borderRadius: 40}}>
              <div style={{position: 'absolute', left: 8, width: 64, height: 64, borderRadius: 32, background: frame >= off ? RED : BLUE, top: frame >= off ? lerp(8, 128, p(frame, off, 8)) : 8}} />
            </div>
            <div style={{position: 'absolute', bottom: -90, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: frame >= off ? RED : BLUE}}>{frame >= off ? 'OFF' : 'ON'}</div>
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }
  const reveal = p(frame, 0, why, (n) => n);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{transform: `translateX(${lerp(60, -60, reveal)}px)`}}>
        <div style={{position: 'absolute', top: 130, left: 40}}>
          <Boxes w={1000} cols={10} rows={10} opened={p(frame, boxes, 20)} lit={RED} />
        </div>
        {frame >= hole ? (
          <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
            <path d="M 330 1120 L 400 1010 L 500 1050 L 600 990 L 700 1040 L 790 1000 L 820 1120 Z" fill="#000" stroke={RED} strokeWidth={8} opacity={p(frame, hole, 8)} />
          </svg>
        ) : null}
        <div style={{position: 'absolute', left: 80, top: 800}}>
          <Person h={420} pose="arms" color="#000" rim={BLUE} />
        </div>
      </AbsoluteFill>
      <Tag at={6} until={boxes} top={200}>
        MONDAY MORNING
      </Tag>
      <LightSweep at={boxes} color={RED} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · The fatal mistake ─────────────────────────
export const Mistake: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [lease, arrested, twelve, eight] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  if (frame < arrested) {
    const circle = p(frame, lease + 20, 24);
    return (
      <AbsoluteFill style={{background: BG}}>
        <Txt at={0} until={lease} top={240} size={120} color={RED}>
          THE FATAL MISTAKE?
        </Txt>
        <Center top={420} style={{transform: `rotate(-3deg) translateY(${lerp(200, 0, p(frame, 0, 14))}px)`}}>
          <div style={{width: 760, height: 760, background: PAPER, padding: 50, boxSizing: 'border-box', boxShadow: `0 0 60px ${BLUE}44`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 64, color: '#1a1712', borderBottom: '4px solid #1a1712'}}>LEASE · LE SAC</div>
            {Array.from({length: 8}, (_, i) => <div key={i} style={{height: 10, background: '#b8b0a0', margin: '24px 0', width: `${60 + rnd(i) * 40}%`}} />)}
            <svg width={660} height={160}>
              <path d="M 60 110 Q 100 40 140 100 T 220 90 Q 260 50 300 100 T 400 80" stroke="#1a1712" strokeWidth={5} fill="none" />
              <ellipse cx={230} cy={85} rx={200} ry={60} fill="none" stroke={RED} strokeWidth={8} strokeDasharray={`${circle * 1300} 1300`} />
            </svg>
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 36, color: RED, opacity: p(frame, lease + 40, 10)}}>HIS OWN NAME</div>
          </div>
        </Center>
      </AbsoluteFill>
    );
  }
  const years = ['12', '12', '12', '8'];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Duo red={[0.5, 0.2]} blue={[0.5, 0.9]} />
      {/* the dock */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1000, height: 220, background: '#1a120c', border: `6px solid ${RED}`}} />
      <div style={{position: 'absolute', left: 90, top: 640, display: 'flex', gap: 30}}>
        {years.map((y, k) => (
          <div key={k} style={{textAlign: 'center', opacity: p(frame, arrested + k * 6, 10)}}>
            <Person h={k === 3 ? 380 : 420} color="#000" rim={BLUE} />
            {frame >= (k === 3 ? eight : twelve + k * 8) ? (
              <div style={{fontFamily: DISPLAY, fontSize: 110, color: k === 3 ? BLUE : RED, marginTop: -40, transform: `scale(${slam(frame, k === 3 ? eight : twelve + k * 8, 1.8).scale})`}}>{y}</div>
            ) : null}
          </div>
        ))}
      </div>
      <Tag at={arrested + 4} until={twelve} top={240}>
        OCTOBER 1971 · 4 ARRESTED
      </Tag>
      <Txt at={twelve} top={240} size={100} color={PAPER}>
        YEARS IN PRISON
      </Txt>
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Payoff + CTA ─────────────────────────
export const Payoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sealed, what, comment, cta] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${RED}30, transparent 45%)`}} />
        <div style={{position: 'absolute', top: 120, left: 40, opacity: 0.25}}>
          <Boxes w={1000} cols={10} rows={10} opened={1} lit={BLUE} />
        </div>
        <Center top={lerp(560, 480, p(frame, 0, cue.dur, (n) => n))}>
          <div style={{width: 640, height: 440, background: '#c9a86a', boxShadow: `0 0 80px ${RED}66`, position: 'relative'}}>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: '#a88a52'}} />
            {frame >= sealed ? (
              <div style={{position: 'absolute', top: 150, left: 40, right: 40, border: `8px solid ${RED}`, color: RED, fontFamily: DISPLAY, fontSize: 70, textAlign: 'center', transform: `rotate(-8deg) scale(${slam(frame, sealed + 6, 2).scale})`, opacity: slam(frame, sealed + 6).opacity}}>
                CLOSED UNTIL 2071
              </div>
            ) : null}
          </div>
        </Center>
        <Tag at={6} until={sealed} top={240}>
          MOST OF THE LOOT: NEVER FOUND
        </Tag>
        {frame >= comment ? (
          <Center top={1020} style={{opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: BG, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </Center>
        ) : null}
        <Txt at={what} until={comment + 30} top={240} size={90} color={PAPER}>
          WHAT WAS IN THE BOXES?
        </Txt>
        <LightSweep at={sealed + 6} color={RED} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG}}>
      <Duo />
      <Center top={130} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 110, color: RED, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <Center top={300} style={{opacity: p(frame, cta + 4, 10), transform: `scale(${slam(frame, cta + 4, 1.3).scale * pulse})`}}>
        <div style={{width: 600}}>
          <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}88`, height: 700}}>
            <Img src={staticFile('bakerst/cta/dbcooper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
            </div>
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: PAPER, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>D.B. COOPER: ANOTHER FORTUNE THAT VANISHED</div>
        </div>
      </Center>
      <LightSweep at={cta + 6} />
    </AbsoluteFill>
  );
};
