import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {Stamp} from '../ui';
import {Paper, Typed} from '../dbcooper/parts';
import {Dust, Fog, Parallax, Searchlight, Silhouette, TiltCard, Water, has} from '../motion';

export const LAMP = '#f5c451';
type SceneProps = {cue: Cues};
const PH = 'alcatraz/photos/';
const CR = {
  fbi: 'FBI · public domain',
  island: 'Photo: Ralf Baechle · CC BY-SA 4.0',
  corridor: 'Photo: Grendelkhan · CC BY-SA 4.0',
  cell: 'Photo: Supercarwaar · CC BY-SA 4.0',
  cells: 'Photo: William Warby · CC BY 2.0',
  vent: 'Photo: Benlechlitner · public domain',
  nara: 'National Archives · public domain',
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
/** Small, quiet date/name tag (the only on-screen text in most scenes). */
const Tag: React.FC<{at: number; until?: number; children: React.ReactNode; top?: number}> = ({at, until = 1e9, children, top = 150}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const o = p(frame, at, 8) * (1 - p(frame, until - 8, 8));
  return (
    <Center top={top} style={{opacity: o}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, letterSpacing: 6, color: LAMP, background: '#000000aa', padding: '8px 22px', borderRadius: 6}}>{children}</div>
    </Center>
  );
};
const flicker = (frame: number, start: number) => (frame - start < 14 ? (rnd(frame) > 0.45 ? 1 : 0.35) : 1);

// ── drawn props ─────────────────────────────────────────────
const Bars: React.FC<{close: number; color?: string}> = ({close, color = '#1c2430'}) => (
  <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
    {Array.from({length: 9}, (_, i) => {
      const x = lerp(-140, 60 + i * 120, close);
      return <rect key={i} x={x} y={0} width={34} height={1920} fill={color} stroke="#3a4656" strokeWidth={3} />;
    })}
    <rect x={lerp(-1100, 0, close)} y={380} width={W} height={30} fill={color} />
    <rect x={lerp(-1100, 0, close)} y={1180} width={W} height={30} fill={color} />
  </svg>
);
const Spoon: React.FC<{size: number; angle: number}> = ({size, angle}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{transform: `rotate(${angle}deg)`, overflow: 'visible', filter: 'drop-shadow(0 10px 20px #000)'}}>
    <ellipse cx={0} cy={-62} rx={22} ry={32} fill="#c9d0d8" stroke="#6b7684" strokeWidth={4} />
    <rect x={-6} y={-34} width={12} height={130} rx={6} fill="#b6bec8" stroke="#6b7684" strokeWidth={3} />
  </svg>
);
const Raft: React.FC<{width: number; built?: number; people?: number}> = ({width, built = 1, people = 0}) => (
  <svg width={width} height={width * 0.45} viewBox="0 0 400 180" style={{overflow: 'visible'}}>
    {Array.from({length: 12}, (_, i) => {
      const t = Math.min(1, Math.max(0, built * 12 - i));
      const x = 20 + (i % 6) * 60;
      const y = 60 + Math.floor(i / 6) * 40;
      return <rect key={i} x={lerp(x + (i % 2 ? 300 : -300), x, t)} y={lerp(y - 200, y, t)} width={62} height={42} rx={8} fill="#2b2f24" stroke="#8a8f6a" strokeWidth={3} opacity={t} />;
    })}
    {people > 0 ? [0, 1, 2].map((k) => <circle key={k} cx={110 + k * 90} cy={50} r={16} fill="#05080c" opacity={people} />) : null}
  </svg>
);
const Paddle: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 300 90">
    <rect x={0} y={38} width={190} height={14} rx={6} fill="#6b5232" />
    <path d="M 185 20 Q 300 10 296 45 Q 300 80 185 70 Z" fill="#7d6038" stroke="#3a2a14" strokeWidth={3} />
  </svg>
);
const Packet: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 200 150">
    <rect x={10} y={10} width={180} height={130} rx={10} fill="#d9e4ea" fillOpacity={0.55} stroke="#ffffff" strokeWidth={4} />
    <rect x={30} y={30} width={70} height={90} fill="#efe6cf" transform="rotate(-6 65 75)" />
    <rect x={95} y={34} width={70} height={90} fill="#e6dcc0" transform="rotate(5 130 79)" />
    <circle cx={65} cy={62} r={14} fill="#8a8170" transform="rotate(-6 65 75)" />
    <circle cx={130} cy={66} r={14} fill="#8a8170" transform="rotate(5 130 79)" />
  </svg>
);
const Bob: React.FC<{show: number; x: number; y: number; k: number; children: React.ReactNode}> = ({show, x, y, k, children}) => {
  const frame = useCurrentFrame();
  if (show <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + lerp(80, 0, show) + Math.sin(frame / 14 + k) * 12, opacity: show, transform: `rotate(${Math.sin(frame / 20 + k) * 6}deg)`}}>{children}</div>
  );
};
const Eye: React.FC<{open: number}> = ({open}) => (
  <svg width={360} height={200} viewBox="-180 -100 360 200">
    <path d={`M -160 0 Q 0 ${-110 * open} 160 0 Q 0 ${110 * open} -160 0 Z`} fill="#e9eef3" stroke={LAMP} strokeWidth={6} />
    <circle r={48 * open} fill="#1a2430" />
    <circle r={20 * open} fill="#000" />
  </svg>
);
const Icon: React.FC<{show: number; children: React.ReactNode}> = ({show, children}) => (
  <div style={{opacity: show, transform: `scale(${lerp(0.4, 1, show)}) translateY(${lerp(40, 0, show)}px)`, width: 150, height: 150, borderRadius: 24, background: '#0b121bcc', border: `4px solid ${LAMP}66`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={110} height={110} viewBox="0 0 100 100">
      {children}
    </svg>
  </div>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [head, roll, fake, gone] = [cue.w('head'), cue.w('rolled'), cue.s(1), cue.s(2)];
  if (frame >= gone) {
    return (
      <AbsoluteFill style={{filter: `brightness(${flicker(frame, gone)})`}}>
        <Parallax src={`${PH}cell.jpg`} t={p(frame, gone, cue.dur - gone, (n) => n)} from={{s: 1.25, y: 40}} to={{s: 1.1, y: 0}} gray={0.6} dark={0.5} credit={CR.cell} fallback={<Bars close={1} />} />
        <Searchlight x={980} y={-60} speed={2} intensity={0.7} />
      </AbsoluteFill>
    );
  }
  const fall = p(frame, roll, 22);
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}cells.jpg`} t={p(frame, 0, gone, (n) => n)} from={{s: 1.15, x: -30}} to={{s: 1.35, x: 30}} gray={0.5} dark={0.55} credit={CR.cells} fallback={<Bars close={1} />} />
      <Searchlight x={1000} y={-80} speed={1.2} intensity={0.8} />
      <Tag at={6} until={head - 4}>
        JUNE 12, 1962 · 7:00 AM
      </Tag>
      {frame >= head - 4 ? (
        <Center top={lerp(440, 760, fall)} style={{opacity: p(frame, head - 4, 6)}}>
          <TiltCard
            src={`${PH}dummy.jpg`}
            width={620}
            height={660}
            rx={lerp(18, 0, p(frame, head - 4, 14))}
            rz={lerp(0, -82, fall)}
            scale={frame >= fake ? lerp(1, 1.15, p(frame, fake, 30)) : 1}
            credit={CR.fbi}
            fallback={<Silhouette />}
          />
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · The Rock ─────────────────────────
export const TheRock: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const proof = cue.s(1);
  return (
    <AbsoluteFill>
      <Parallax
        src={`${PH}island.jpg`}
        t={p(frame, 0, cue.dur, (n) => n)}
        from={{s: 1.6, x: 0, y: -40}}
        to={{s: 1.25, x: 0, y: 0}}
        gray={0.2}
        dark={0.25}
        fog={0.9}
        credit={CR.island}
        fallback={
          <svg width={W} height={1920}>
            <path d="M 200 900 Q 320 700 540 680 Q 780 690 880 900 Z" fill="#2b3644" />
            <rect x={460} y={620} width={200} height={80} fill="#3a4656" />
          </svg>
        }
      />
      <Water top={1180} glow={0.6} />
      <Searchlight x={760} y={640} speed={0.8} spread={14} intensity={0.6} />
      <Stamp at={proof + 4} y={560} size={120} rotate={-6} color={LAMP}>
        Escape-proof
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · The men ─────────────────────────
export const TheMen: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [none, came, morris, john, clarence] = [cue.s(1), cue.s(2), cue.w('Morris'), cue.w('John'), cue.w('Clarence')];
  if (frame < came) {
    return (
      <AbsoluteFill style={{background: '#070b10'}}>
        <Searchlight x={540} y={-100} speed={1.5} intensity={0.5} />
        <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
          {Array.from({length: 36}, (_, i) => {
            const x = 110 + (i % 6) * 172;
            const y = 330 + Math.floor(i / 6) * 150;
            const struck = p(frame, 6 + i * ((none - 6) / 36), 6);
            return (
              <g key={i} transform={`translate(${x}, ${y})`} opacity={p(frame, i * 1.2, 6)}>
                <circle cx={0} cy={-30} r={16} fill="#3a4656" />
                <path d="M -26 40 Q -24 -4 0 -6 Q 24 -4 26 40 Z" fill="#3a4656" />
                <line x1={-36} y1={-48} x2={36 * (2 * struck - 1)} y2={-48 + 96 * struck} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={struck} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  }
  const card = (src: string, label: string, at: number, x: number, rz: number) => {
    const t = p(frame, at - 4, 16);
    return (
      <div style={{position: 'absolute', left: x, top: lerp(1300, 470, t), opacity: t}}>
        <TiltCard src={`${PH}${src}`} width={330} height={440} ry={lerp(70, rz * 2, t)} rz={rz} label={label} credit={CR.fbi} gray={1} fallback={<Silhouette />} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}corridor.jpg`} t={p(frame, came, cue.dur - came, (n) => n)} gray={0.8} dark={0.8} fog={0.4} fallback={<Bars close={1} />} />
      {card('john.jpg', 'J. ANGLIN', john, 40, -6)}
      {card('clarence.jpg', 'C. ANGLIN', clarence, 710, 6)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0}}>{card('morris.jpg', 'F. MORRIS', morris, 375, 0)}</div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Digging ─────────────────────────
export const Digging: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [spoons, drill] = [cue.w('spoons'), cue.w('drill')];
  const scrape = Math.sin(frame / (frame >= drill ? 1.5 : 4)) * (frame >= drill ? 6 : 22);
  return (
    <AbsoluteFill>
      <Parallax
        src={`${PH}vent.jpg`}
        t={p(frame, 0, cue.dur, (n) => n)}
        from={{s: 1.1}}
        to={{s: 1.45, y: 60}}
        gray={0.4}
        dark={0.35}
        fog={0.2}
        credit={CR.vent}
        fallback={
          <svg width={W} height={1920}>
            <rect width={W} height={1920} fill="#5a5e60" />
            <rect x={340} y={600} width={400} height={300} fill="#2a2e30" />
            {Array.from({length: 9}, (_, i) => <rect key={i} x={350 + i * 44} y={610} width={18} height={280} fill="#7a7e80" />)}
          </svg>
        }
      />
      {frame >= spoons - 6 ? (
        <div style={{position: 'absolute', left: 520, top: 760, opacity: p(frame, spoons - 6, 8)}}>
          <Spoon size={360} angle={-35 + scrape} />
        </div>
      ) : null}
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {frame >= spoons
          ? Array.from({length: 26}, (_, i) => {
              const life = (frame - spoons + i * 3) % 30;
              return <rect key={i} x={560 + rnd(i) * 160 + life * (rnd(i + 3) - 0.5) * 6} y={820 + life * life * 0.5} width={6 + rnd(i + 1) * 8} height={6 + rnd(i + 2) * 8} fill="#b9b2a4" opacity={1 - life / 30} />;
            })
          : null}
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Music hour + fake grilles ─────────────────────────
export const MusicHour: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [music, fake] = [cue.w('music'), cue.w('fake')];
  const tilt = p(frame, fake - 4, 18);
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}corridor.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, x: 30}} to={{s: 1.3, x: -30}} gray={0.4} dark={0.4} credit={CR.corridor} fallback={<Bars close={1} />} />
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {frame >= music
          ? Array.from({length: 12}, (_, i) => {
              const life = (frame - music + i * 9) % 90;
              return (
                <text key={i} x={120 + rnd(i) * 840 + Math.sin(life / 10 + i) * 30} y={1250 - life * 9} fontSize={60 + rnd(i + 1) * 40} fill={LAMP} opacity={(1 - life / 90) * 0.85 * (frame < fake ? 1 : 0.3)} fontFamily={BODY}>
                  {i % 2 ? '♪' : '♫'}
                </text>
              );
            })
          : null}
      </svg>
      {frame >= fake - 4 ? (
        <Center top={420} style={{opacity: tilt}}>
          <TiltCard src={`${PH}grid.jpg`} width={860} height={620} ry={lerp(-80, -8, tilt)} rx={lerp(20, 6, tilt)} credit={CR.fbi} fit="cover" fallback={<Bars close={1} />} />
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Re-hook: fool the guards, cross the bay ─────────────────────────
export const RehookPlan: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [guards, bay] = [cue.w('guards'), cue.w('bay')];
  return (
    <AbsoluteFill style={{background: '#04070b'}}>
      <Searchlight x={540} y={-60} speed={2.2} intensity={0.9} />
      <Fog amount={0.8} speed={2} />
      {frame >= guards - 6 && frame < bay ? (
        <Center top={560} style={{opacity: p(frame, guards - 6, 8)}}>
          <Eye open={p(frame, guards - 6, 12)} />
        </Center>
      ) : null}
      <Water top={lerp(1920, 900, p(frame, bay - 6, 24))} glow={0.8} />
      <Dust amount={0.6} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The heads ─────────────────────────
export const Heads: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const words = ['soap', 'paper', 'dust', 'painted', 'hair'].map((w) => cue.w(w));
  const barber = cue.w('barbershop');
  const icons = [
    <rect key="s" x={18} y={34} width={64} height={34} rx={12} fill="#f0ead8" />,
    <g key="p"><circle cx={50} cy={50} r={30} fill="#f4f4f0" /><circle cx={50} cy={50} r={9} fill="#b8b2a0" /></g>,
    <path key="d" d="M 10 80 Q 50 20 90 80 Z" fill="#9a958a" />,
    <g key="b"><rect x={44} y={10} width={12} height={50} fill="#8a6a3a" /><path d="M 38 60 L 62 60 L 58 90 L 42 90 Z" fill="#d9a07a" /></g>,
    <path key="h" d="M 20 80 Q 30 20 50 30 Q 70 20 80 80" fill="none" stroke="#5a3a1c" strokeWidth={10} strokeLinecap="round" />,
  ];
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}dummy.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.05, y: 0}} to={{s: 1.3, y: -40}} gray={0.3} dark={0.3} fog={0.2} credit={CR.fbi} fallback={<Silhouette />} />
      {frame >= barber - 4 ? (
        <Center top={300} style={{opacity: p(frame, barber - 4, 10)}}>
          <TiltCard src={`${PH}dummies.jpg`} width={900} height={560} ry={lerp(60, 6, p(frame, barber - 4, 18))} rz={-2} credit={CR.fbi} fallback={<Silhouette />} />
        </Center>
      ) : null}
      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>
        {icons.map((ic, i) => (
          <Icon key={i} show={p(frame, words[i] - 3, 8) * (1 - p(frame, barber - 4, 8))}>
            {ic}
          </Icon>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · The raft ─────────────────────────
export const TheRaft: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [coats, above] = [cue.w('raincoats'), cue.w('above')];
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}utility.jpg`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.1, y: 40}} to={{s: 1.3, y: -40}} gray={0.5} dark={0.6} fog={0.3} credit={CR.corridor} fallback={<Bars close={1} />} />
      <Center top={lerp(700, 560, p(frame, above, 20))} style={{transform: `scale(${lerp(1, 0.8, p(frame, above, 20))})`}}>
        <Raft width={900} built={p(frame, coats - 6, cue.dur * 0.55, (n) => n)} />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The night ─────────────────────────
export const TheNight: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [beds, crawl, west] = [cue.w('beds'), cue.w('crawled'), cue.s(1)];
  if (frame >= west) {
    return (
      <AbsoluteFill style={{background: '#05080c'}}>
        <Center top={420}>
          <TiltCard src={`${PH}west.jpg`} width={520} height={680} ry={lerp(-30, 0, p(frame, west, 16))} label="A. WEST" gray={1} fallback={<Silhouette />} />
        </Center>
        <Bars close={p(frame, west + 10, 24)} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}cells.jpg`} t={p(frame, 0, west, (n) => n)} from={{s: 1.3, x: 40}} to={{s: 1.15, x: -40}} gray={1} dark={0.75} tint="#06101c" fog={0.3} credit={CR.cells} fallback={<Bars close={1} />} />
      <AbsoluteFill style={{background: '#0a2a5a', mixBlendMode: 'multiply', opacity: 0.7}} />
      <Tag at={4} until={beds}>
        JUNE 11, 1962 · NIGHT
      </Tag>
      {frame >= beds - 4 ? (
        <Center top={640} style={{opacity: p(frame, beds - 4, 8) * (1 - p(frame, crawl + 10, 10))}}>
          <svg width={900} height={420} viewBox="0 0 900 420">
            <rect x={40} y={180} width={820} height={160} rx={20} fill="#3a4656" />
            <rect x={60} y={120} width={240} height={110} rx={40} fill="#e9e4d6" />
            <path d="M 260 170 Q 560 120 840 170 L 840 330 L 260 330 Z" fill="#5c6a52" />
            <circle cx={180} cy={150} r={56} fill="#c9a37c" />
            <path d="M 126 140 Q 180 70 236 140" fill="#3a2a1c" />
          </svg>
        </Center>
      ) : null}
      {frame >= crawl ? (
        <Center top={760} style={{opacity: p(frame, crawl, 10)}}>
          <div style={{width: 260, height: 180, background: '#000', borderRadius: 12, boxShadow: `0 0 ${60 + 30 * Math.sin(frame / 5)}px ${LAMP}66`, border: '6px solid #4a5360'}} />
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The route ─────────────────────────
export const Route: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [roof, pipe, fences, black, vanished] = [cue.w('roof'), cue.w('pipe'), cue.w('fences'), cue.w('black'), cue.w('vanished')];
  const pts: [number, number][] = [
    [460, 760],
    [520, 640],
    [600, 820],
    [700, 900],
    [820, 1040],
  ];
  const marks = [roof, pipe, fences, fences + 20, black - 4];
  const prog = p(frame, roof - 6, black - roof, (n) => n);
  const water = p(frame, black - 4, 16);
  return (
    <AbsoluteFill>
      <Parallax src={`${PH}island.jpg`} t={p(frame, 0, black, (n) => n)} from={{s: 1.5, x: 60}} to={{s: 2.0, x: -80, y: -60}} gray={0.6} dark={0.75} tint="#06101c" fog={0.4} credit={CR.island} />
      <AbsoluteFill style={{background: '#0a2a5a', mixBlendMode: 'multiply', opacity: 0.6}} />
      <svg width={W} height={1920} style={{position: 'absolute', top: 0, left: 0, opacity: 1 - water}}>
        <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={LAMP} strokeWidth={10} strokeDasharray="2000" strokeDashoffset={2000 * (1 - prog)} strokeLinecap="round" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 12px ${LAMP})`}} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={18 * p(frame, marks[i] - 2, 6)} fill={LAMP} stroke="#000" strokeWidth={4} />
        ))}
      </svg>
      {water > 0 ? (
        <AbsoluteFill style={{background: '#03060a', opacity: water}}>
          <Water top={900} />
          <div style={{position: 'absolute', top: 860, left: lerp(240, 620, p(frame, black, cue.dur - black, (n) => n)), opacity: 1 - p(frame, vanished, 24)}}>
            <Raft width={300} people={1} />
          </div>
          <Fog amount={1.2} speed={2} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Re-hook: did they make it? ─────────────────────────
export const RehookBay: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const take = cue.s(1);
  return (
    <AbsoluteFill style={{background: '#03060a'}}>
      <Searchlight x={160} y={-40} speed={1.4} intensity={0.8} />
      <Water top={lerp(1000, 760, p(frame, take, 30))} glow={0.5} />
      <Center top={lerp(700, 820, p(frame, take, 30))} style={{opacity: 0.7 - 0.5 * p(frame, take, 30)}}>
        <Raft width={300} />
      </Center>
      <Fog amount={1.4} speed={2.4} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · What was found ─────────────────────────
export const Found: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [paddle, coat, photos] = [cue.w('paddle'), cue.w('raincoat'), cue.w('photos')];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #4a5866 0%, #22303e 55%, #0e1822 100%)'}}>
      <Fog amount={1.2} speed={1} color="#e6eef5" />
      <Water top={900} color="#1a2a38" />
      <Bob show={p(frame, paddle - 4, 14)} x={110} y={980} k={0}>
        <Paddle size={420} />
      </Bob>
      <Bob show={p(frame, coat - 4, 14)} x={600} y={1060} k={2}>
        <svg width={260} height={140} viewBox="0 0 260 140">
          <path d="M 10 40 Q 90 0 160 30 Q 250 20 250 80 Q 200 140 90 120 Q 0 110 10 40 Z" fill="#2b2f24" stroke="#8a8f6a" strokeWidth={4} />
        </svg>
      </Bob>
      <Bob show={p(frame, photos - 4, 14)} x={360} y={760} k={4}>
        <div style={{transform: `scale(${lerp(1, 1.5, p(frame, photos + 10, 30))})`}}>
          <Packet size={340} />
        </div>
      </Bob>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · FBI verdict, Alcatraz closes ─────────────────────────
export const Verdict: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [drowned, bodies, closed] = [cue.w('drowned'), cue.s(1), cue.s(2)];
  if (frame >= closed) {
    return (
      <AbsoluteFill>
        <Parallax src={`${PH}island1934.jpg`} t={p(frame, closed, cue.dur - closed, (n) => n)} from={{s: 1.1}} to={{s: 1.3}} gray={1} dark={0.4} fog={0.6} credit={CR.nara} fallback={<Water top={1000} />} />
        <Tag at={closed + 10} top={180}>
          MARCH 21, 1963
        </Tag>
        <Bars close={p(frame, cue.w('closed') - 6, 20)} color="#0b0f14" />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#0b0f14'}}>
      <Fog amount={0.5} />
      <Center top={300}>
        <TiltCard src={`${PH}wanted.jpg`} width={820} height={900} rx={lerp(30, 4, p(frame, 0, 20))} ry={lerp(-20, 4, p(frame, 0, cue.dur))} credit={CR.fbi} gray={0.6} fit="contain" fallback={<Silhouette />} />
      </Center>
      <Stamp at={drowned + 4} y={760} size={110} rotate={-8}>
        Presumed drowned
      </Stamp>
      {frame >= bodies ? (
        <Center top={1120} style={{opacity: p(frame, bodies, 8)}}>
          <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 46, letterSpacing: 6, color: C.white, background: '#000000cc', padding: '8px 20px'}}>BODIES FOUND: 0</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The clues ─────────────────────────
const BRAZIL: LonLat = [-47.9, -15.8];
export const Clues: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cards, photo] = [cue.s(1), cue.s(2)];
  if (frame < photo) {
    const open = p(frame, cards + 6, 20);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2a1414 0%, #07090c 75%)'}}>
        <Dust amount={1.5} />
        {frame >= cards - 6 ? (
          <Center top={420} style={{opacity: p(frame, cards - 6, 10), perspective: 1600}}>
            <div style={{position: 'relative', width: 640, height: 820}}>
              <div style={{position: 'absolute', inset: 0, background: '#efe6cf', borderRadius: 8, boxShadow: '0 30px 80px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Brush Script MT", cursive', fontSize: 70, color: '#7a1010'}}>
                Merry Christmas
              </div>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #7a1010, #3a0808)', borderRadius: 8, transformOrigin: '0% 50%', transform: `rotateY(${-160 * open}deg)`, backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={300} height={360} viewBox="0 0 100 120">
                  <polygon points="50,5 85,60 70,60 95,100 5,100 30,60 15,60" fill="#1f5a2a" />
                  <rect x={44} y={100} width={12} height={16} fill="#5a3a1c" />
                  <circle cx={50} cy={6} r={5} fill={LAMP} />
                </svg>
              </div>
            </div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  const z = p(frame, photo, 40);
  const brazil = cue.w('Brazil');
  return (
    <AbsoluteFill style={{background: '#070b10'}}>
      <Center top={260} style={{opacity: 1 - p(frame, brazil + 20, 12) * 0.5}}>
        <Globe width={1000} height={1000} center={[lerp(-100, BRAZIL[0], z), lerp(30, BRAZIL[1], z)]} scale={lerp(420, 700, z)} routes={[{from: [-122.42, 37.83], to: BRAZIL, progress: p(frame, photo + 6, 40)}]} pins={[{at: BRAZIL, label: 'BRAZIL · 1975?', show: p(frame, brazil, 10), align: 'left'}]} highlight={['Brazil']} frame={frame} />
      </Center>
      {frame >= brazil + 6 ? (
        <>
          <div style={{position: 'absolute', left: 60, top: 1000, opacity: p(frame, brazil + 6, 10)}}>
            <TiltCard src={`${PH}john.jpg`} width={260} height={320} rz={-8} ry={lerp(60, 10, p(frame, brazil + 6, 16))} gray={1} fallback={<Silhouette />} />
          </div>
          <div style={{position: 'absolute', right: 60, top: 1000, opacity: p(frame, brazil + 12, 10)}}>
            <TiltCard src={`${PH}clarence.jpg`} width={260} height={320} rz={8} ry={lerp(-60, -10, p(frame, brazil + 12, 16))} gray={1} fallback={<Silhouette />} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The 2013 letter ─────────────────────────
export const Letter: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [name, escaped, made, tested, result] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  const t = p(frame, 0, cue.dur, (n) => n);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1c2430 0%, #05070a 80%)'}}>
      <Dust amount={1} />
      <Tag at={4} until={name - 2}>
        SAN FRANCISCO POLICE · 2013
      </Tag>
      <Center top={300} style={{perspective: 1600}}>
        <div style={{transform: `rotateX(${lerp(24, 8, t)}deg) rotateY(${lerp(-14, 10, t)}deg) rotateZ(${lerp(-3, 1, t)}deg) translateY(${lerp(80, 0, p(frame, 0, 20))}px)`, transformStyle: 'preserve-3d'}}>
          <Paper width={860} style={{padding: '50px 56px', minHeight: 760}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 5, opacity: 0.55}}>RECEIVED 2013 · UNSIGNED · HANDWRITTEN</div>
            <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 22}}>
              {frame >= name ? <Typed text="My name is John Anglin." at={name} cps={22} style={{fontSize: 52, lineHeight: 1.3}} /> : null}
              {frame >= escaped ? <Typed text="I escaped from Alcatraz in June 1962." at={escaped} cps={24} style={{fontSize: 52, lineHeight: 1.3}} /> : null}
              {frame >= made ? <Typed text="Yes, we all made it that night, but barely!" at={made} cps={24} style={{fontSize: 52, lineHeight: 1.3, color: '#7a1010'}} /> : null}
            </div>
          </Paper>
        </div>
      </Center>
      {frame >= tested ? (
        <div style={{position: 'absolute', left: lerp(1100, 640, p(frame, tested, 16)), top: 760}}>
          <svg width={300} height={300} viewBox="0 0 100 100">
            <circle cx={40} cy={40} r={28} fill="#9fd3ff33" stroke="#c9d6e4" strokeWidth={6} />
            <line x1={60} y1={60} x2={92} y2={92} stroke="#6b5232" strokeWidth={10} strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
      <Stamp at={result + 8} y={1040} size={110} rotate={-7} color={LAMP}>
        Inconclusive
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Ending + CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ask, cta, plane, dead, both] = [cue.s(1), cue.s(3), cue.w('plane'), cue.w('Dead'), cue.w('both')];
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Parallax src={`${PH}island.jpg`} t={p(frame, 0, cta, (n) => n)} from={{s: 1.3}} to={{s: 1.1}} gray={0.5} dark={0.6} fog={0.8} credit={CR.island} />
        <Tag at={4} until={ask - 2}>
          CASE STATUS · OPEN
        </Tag>
        <div style={{position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24}}>
          {['john.jpg', 'morris.jpg', 'clarence.jpg'].map((src, i) => (
            <div key={src} style={{opacity: p(frame, 4 + i * 6, 10)}}>
              <TiltCard src={`${PH}${src}`} width={300} height={390} ry={(i - 1) * 18 * (1 - p(frame, ask, 20))} rz={(i - 1) * 4} gray={1} fallback={<Silhouette />} />
            </div>
          ))}
        </div>
        {frame >= ask ? (
          <Center top={900} style={{opacity: slam(frame, ask, 1.5).opacity, transform: `scale(${slam(frame, ask, 1.5).scale})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 260, color: LAMP, textShadow: `0 0 50px ${LAMP}88`}}>?</div>
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
        <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${active ? LAMP : C.line}`, boxShadow: active ? `0 0 60px ${LAMP}88` : 'none'}}>
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
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1c2430 0%, #05070a 80%)'}}>
      <Dust amount={0.8} />
      <Center top={120} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 120, color: LAMP, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('alcatraz/cta/dbcooper.jpg', 'THE MAN WHO JUMPED FROM A PLANE', Math.min(plane, cta + 6), frame < dead)}
        {card('alcatraz/cta/dyatlov.jpg', 'THE HIKERS ON DEAD MOUNTAIN', dead, frame >= dead && frame < both)}
      </div>
      {frame >= both ? (
        <Center top={1010} style={{opacity: p(frame, both, 8)}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 5}}>BOTH ON THIS CHANNEL</div>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3, marginTop: 6}}>CHRONOS GALAXY</div>
          </div>
        </Center>
      ) : null}
      {frame >= both + 20 ? (
        <Center top={1215} style={{transform: `scale(${pulse})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 62, color: '#07090c', background: LAMP, padding: '14px 40px', borderRadius: 18, letterSpacing: 2}}>TAP · FOLLOW · WATCH NEXT</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
