import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LonLat, USMap} from '../geo';
import {BODY, C, Cues, DISPLAY, W, inOut, lerp, p, rnd, slam} from '../lib';
import {Background, Figure, Headline, Photo, Stamp, Tag} from '../ui';
import {Gauge, NightSky, Paper, Typed} from '../dbcooper/parts';

export const RED = '#ff4d4d';
export const STEEL = '#8fb3d9';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PHOTO = (name: string) => `kemper/photos/${name}`;
const MUG_CREDIT = 'Booking photo, 1973 · public domain';

const PLACE = {
  burbank: [-118.31, 34.18] as LonLat,
  northFork: [-119.51, 37.23] as LonLat,
  atascadero: [-120.67, 35.49] as LonLat,
  santaCruz: [-122.03, 36.97] as LonLat,
  pueblo: [-104.61, 38.25] as LonLat,
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const MapBox: React.FC<{top?: number; children: React.ReactNode; opacity?: number}> = ({top = 300, children, opacity = 1}) => (
  <div style={{position: 'absolute', top, left: 40, width: 1000, height: 640, overflow: 'hidden', borderRadius: 24, border: `3px solid ${C.line}`, background: '#0b1119', opacity}}>
    {children}
  </div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: RED}}>{children}</span>;
const S: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: STEEL}}>{children}</span>;

/** Phone booth, 300×620 box. `glow` lights the cabin; `inside` draws a giant figure. */
export const PhoneBooth: React.FC<{scale?: number; glow?: number; inside?: boolean; police?: number}> = ({scale = 1, glow = 1, inside = true, police = 0}) => {
  const frame = useCurrentFrame();
  const flash = police > 0 ? (Math.floor(frame / 5) % 2 ? RED : '#2f6bff') : 'transparent';
  return (
    <svg width={300 * scale} height={620 * scale} viewBox="0 0 300 620" style={{overflow: 'visible'}}>
      <ellipse cx={150} cy={612} rx={220} ry={26} fill={flash} opacity={police * 0.5} />
      <rect x={10} y={20} width={280} height={590} rx={10} fill="#141c26" stroke="#2c3e59" strokeWidth={10} />
      <rect x={30} y={70} width={240} height={520} fill="#f3d27a" opacity={0.18 * glow} />
      <rect x={10} y={20} width={280} height={44} fill="#2c3e59" />
      <text x={150} y={52} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={26} fill="#f3d27a" letterSpacing={6} opacity={0.6 + 0.4 * glow}>
        TELEPHONE
      </text>
      {/* receiver box */}
      <rect x={196} y={210} width={52} height={90} rx={6} fill="#0b1119" stroke="#3a4a5c" strokeWidth={4} />
      {inside ? (
        <g fill="#05080d">
          <circle cx={128} cy={118} r={30} />
          <path d="M 70 160 Q 128 140 186 160 L 196 360 L 176 590 L 140 590 L 128 400 L 116 590 L 80 590 L 60 360 Z" />
          <path d="M 180 168 L 214 240 L 206 252 L 170 200 Z" />
        </g>
      ) : null}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={30} x2={270} y1={200 + i * 150} y2={200 + i * 150} stroke="#2c3e59" strokeWidth={6} />
      ))}
    </svg>
  );
};

/** Notebook-style ruler comparing heights. */
const HeightChart: React.FC<{show: number}> = ({show}) => {
  const feet = (f: number) => 560 - f * 74;
  return (
    <svg width={W} height={620}>
      {Array.from({length: 8}, (_, i) => (
        <g key={i}>
          <line x1={150} x2={930} y1={feet(i)} y2={feet(i)} stroke={C.line} strokeWidth={2} />
          <text x={120} y={feet(i) + 10} textAnchor="end" fontFamily={BODY} fontWeight={800} fontSize={28} fill={C.dim}>
            {i}'
          </text>
        </g>
      ))}
      <Figure x={370} y={560} h={74 * 5.75 * show} color="#3a4a5c" />
      <text x={370} y={604} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={30} fill={C.dim}>
        AVERAGE MAN · 5'9"
      </text>
      <Figure x={690} y={560} h={74 * 6.75 * show} color={RED} />
      <text x={690} y={604} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={30} fill={RED}>
        KEMPER · 6'9"
      </text>
    </svg>
  );
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [giant, calls, prank, later] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const confess = cue.w('confesses');
  const zoom = interpolate(frame, [giant, calls], [0.9, 1.25], {...clamp, easing: inOut});
  const eight = slam(frame, cue.w('eight'), 2.6);
  return (
    <AbsoluteFill>
      <NightSky rain={0.4} flashAt={[cue.w('eight') + 2]} />
      <Headline at={0} until={giant - 1} size={180} y={200} color={RED}>
        April 1973
      </Headline>
      <Center top={frame < confess ? 520 : 640} style={{transform: `scale(${frame < confess ? zoom : 0.85})`, transition: 'none'}}>
        <PhoneBooth glow={0.6 + 0.4 * Math.sin(frame / 3)} inside={frame >= giant} />
      </Center>
      {frame >= giant && frame < calls ? (
        <Center top={1260} style={{opacity: p(frame, giant + 6, 8)}}>
          <Tag color={STEEL}>Pueblo, Colorado</Tag>
        </Center>
      ) : null}
      {frame >= calls && frame < prank ? (
        <>
          <Headline at={calls} until={confess - 1} size={88} y={220}>
            He calls the <S>police</S>
          </Headline>
          {frame >= confess ? (
            <Center top={190} style={{opacity: eight.opacity, transform: `scale(${eight.scale})`}}>
              <div>
                <Big size={88}>He confesses to</Big>
                <Big size={260} color={RED}>
                  8 MURDERS
                </Big>
              </div>
            </Center>
          ) : null}
        </>
      ) : null}
      {frame >= prank ? (
        <>
          <Stamp at={prank} y={360} size={150} color={STEEL}>
            “A prank?”
          </Stamp>
          <Center top={1300} style={{opacity: p(frame, later, 8)}}>
            <Tag color={C.white}>☎ Call back later</Tag>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Big Ed ─────────────────────────
export const BigEd: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [drinks, name, idea] = [cue.s(1), cue.s(2), cue.s(3)];
  const neon = Math.floor(frame / 7) % 9 === 0 ? 0.4 : 1;
  return (
    <AbsoluteFill>
      <Background tint={frame >= idea ? RED : STEEL} />
      {frame < idea ? (
        <>
          <Headline at={2} until={drinks - 1} size={96} y={180}>
            The officers <S>know him</S>
          </Headline>
          <Center top={430}>
            <div style={{fontFamily: DISPLAY, fontSize: 130, letterSpacing: 6, color: '#ffd27a', textShadow: `0 0 30px #ff9d2a, 0 0 70px #ff6a00`, opacity: neon, border: '6px solid #ffb347', borderRadius: 24, padding: '10px 40px', boxShadow: '0 0 60px #ff9d2a88, inset 0 0 40px #ff9d2a55'}}>
              THE JURY ROOM
            </div>
          </Center>
          <Center top={700} style={{opacity: p(frame, drinks, 8), gap: 40}}>
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} width={150} height={180} viewBox="0 0 100 120" style={{opacity: p(frame, drinks + i * 3, 6)}}>
                <path d="M 50 4 L 92 22 Q 92 84 50 116 Q 8 84 8 22 Z" fill="#c9a227" stroke="#fff3c4" strokeWidth={4} />
                <circle cx={50} cy={56} r={20} fill="#8a6d10" />
                <text x={50} y={64} textAnchor="middle" fontFamily={DISPLAY} fontSize={22} fill="#fff3c4">
                  PD
                </text>
              </svg>
            ))}
          </Center>
          {frame >= name ? (
            <Center top={980} style={{opacity: p(frame, name, 8)}}>
              <div style={{background: C.white, borderRadius: 18, overflow: 'hidden', width: 560, textAlign: 'center', boxShadow: '0 20px 60px #000'}}>
                <div style={{background: RED, color: C.white, fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 6, padding: '10px 0'}}>HELLO, MY NAME IS</div>
                <div style={{fontFamily: DISPLAY, fontSize: 150, color: C.bg, padding: '10px 0 20px'}}>BIG ED</div>
              </div>
            </Center>
          ) : null}
        </>
      ) : (
        <>
          <Headline at={idea} size={92} y={170}>
            Who he <R>really</R> was
          </Headline>
          <Center top={420} style={{opacity: p(frame, idea, 8)}}>
            <Photo src={PHOTO('mug.jpg')} width={640} height={850} gray={1} zoom={lerp(1.15, 1, p(frame, idea, 60))} focus="50% 30%" credit={MUG_CREDIT} accent={RED} />
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Childhood ─────────────────────────
export const Childhood: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [tall, basement, cat] = [cue.s(1), cue.s(2), cue.s(3)];
  const lock = p(frame, cue.w('locked'), 10);
  return (
    <AbsoluteFill>
      <Background tint={frame >= basement ? RED : STEEL} />
      {frame < tall ? (
        <>
          <Headline at={2} size={100} y={130}>
            Born <S>1948</S>, California
          </Headline>
          <MapBox>
            <USMap width={1000} height={640} frame={frame} highlight="California" highlightAmount={0.2} pins={[{at: PLACE.burbank, label: 'BURBANK, CA', show: p(frame, 8, 8), align: 'right'}]} />
          </MapBox>
        </>
      ) : null}
      {frame >= tall && frame < basement ? (
        <>
          <Headline at={tall} size={96} y={170}>
            Age 10: towering over <S>everyone</S>
          </Headline>
          <svg width={W} height={700} style={{position: 'absolute', top: 480}}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Figure key={i} x={170 + i * 185} y={620} h={i === 2 ? 470 * p(frame, tall + 6, 16, inOut) + 200 : 230 + rnd(i) * 30} color={i === 2 ? STEEL : '#3a4a5c'} />
            ))}
          </svg>
        </>
      ) : null}
      {frame >= basement ? (
        <>
          <Headline at={basement} until={cat - 1} size={92} y={170}>
            A <R>locked</R> basement
          </Headline>
          <Headline at={cat} size={92} y={170}>
            The first <R>warning sign</R>
          </Headline>
          <svg width={W} height={760} style={{position: 'absolute', top: 430}}>
            {/* stairs going down into the dark */}
            {Array.from({length: 7}, (_, i) => (
              <rect key={i} x={260 + i * 40} y={60 + i * 70} width={560 - i * 80} height={22} fill="#1c2633" opacity={1 - i * 0.12} />
            ))}
            <rect x={300} y={120} width={480} height={600} rx={12} fill="#0b0f15" stroke="#3a4a5c" strokeWidth={8} />
            <rect x={330} y={150} width={420} height={260} fill="#141c26" />
            <rect x={330} y={430} width={420} height={260} fill="#141c26" />
            <g transform={`translate(${710}, ${400}) rotate(${(1 - lock) * -40})`}>
              <path d="M -30 0 L -30 -40 Q 0 -80 30 -40 L 30 0" fill="none" stroke="#c0c8d2" strokeWidth={12} />
              <rect x={-45} y={0} width={90} height={80} rx={10} fill="#c0c8d2" />
              <circle cx={0} cy={36} r={10} fill="#3a4a5c" />
            </g>
            {frame >= cat ? (
              <g opacity={p(frame, cat, 10)} transform="translate(540, 600)">
                <path d="M -70 40 Q -70 -20 -20 -30 L -30 -70 L 0 -40 L 30 -70 L 20 -30 Q 70 -20 70 40 Z" fill="#3a4a5c" />
                <path d="M 70 30 Q 130 10 110 -50" fill="none" stroke="#3a4a5c" strokeWidth={14} strokeLinecap="round" />
                <line x1={-34} y1={-6} x2={-14} y2={6} stroke={RED} strokeWidth={6} />
                <line x1={-34} y1={6} x2={-14} y2={-6} stroke={RED} strokeWidth={6} />
                <line x1={14} y1={-6} x2={34} y2={6} stroke={RED} strokeWidth={6} />
                <line x1={14} y1={6} x2={34} y2={-6} stroke={RED} strokeWidth={6} />
              </g>
            ) : null}
          </svg>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The ranch ─────────────────────────
export const Ranch: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [shot, reason, felt] = [cue.s(1), cue.s(2), cue.s(3)];
  const bang = cue.w('shot');
  return (
    <AbsoluteFill>
      <Background tint={frame >= bang ? RED : STEEL} />
      {frame < shot ? (
        <>
          <Headline at={2} size={96} y={130}>
            Age 15: <S>the ranch</S>
          </Headline>
          <MapBox>
            <USMap width={1000} height={640} frame={frame} highlight="California" highlightAmount={0.2} zoom={2.4} focus={[-119.6, 36.6]} pins={[{at: PLACE.northFork, label: 'NORTH FORK, CA', show: p(frame, 10, 8), align: 'right'}]} />
          </MapBox>
          <Center top={1010} style={{opacity: p(frame, 16, 8)}}>
            <svg width={600} height={260} viewBox="0 0 600 260">
              <path d="M 0 250 L 0 200 Q 150 150 300 190 T 600 180 L 600 250 Z" fill="#1c2633" />
              <path d="M 200 200 L 200 110 L 300 50 L 400 110 L 400 200 Z" fill="#0b0f15" stroke="#3a4a5c" strokeWidth={5} />
              <rect x={280} y={140} width={40} height={60} fill="#f3d27a" opacity={0.5} />
            </svg>
          </Center>
        </>
      ) : null}
      {frame >= shot && frame < reason ? (
        <>
          <Center top={260}>
            <Paper width={720} rotate={-2} style={{padding: '24px 34px', textAlign: 'center'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: '#a3271c'}}>THURSDAY</div>
              <div style={{fontFamily: DISPLAY, fontSize: 140, lineHeight: 1}}>AUG 27, 1964</div>
            </Paper>
          </Center>
          <svg width={W} height={500} style={{position: 'absolute', top: 640}}>
            {[0, 1].map((i) => {
              const t = p(frame, bang + i * 8, 6);
              return <Figure key={i} x={400 + i * 280} y={440} h={340} color={t > 0.5 ? '#2a1214' : '#3a4a5c'} stroke={t > 0.5 ? RED : undefined} />;
            })}
            <text x={540} y={490} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={36} fill={C.dim} letterSpacing={4}>
              HIS GRANDPARENTS
            </text>
          </svg>
          {frame >= bang ? <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 1 - (frame - bang) / 5) * 0.6}} /> : null}
        </>
      ) : null}
      {frame >= reason ? (
        <>
          <Headline at={reason} size={120} y={200}>
            His <R>reason?</R>
          </Headline>
          <Center top={620}>
            <Paper width={900} rotate={-1.5} style={{padding: '40px 44px'}}>
              <Typed text="“I just wanted to see what it felt like.”" at={felt} cps={20} style={{fontSize: 72, lineHeight: 1.25}} />
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 4, opacity: 0.6, marginTop: 24}}>— EDMUND KEMPER, AGE 15</div>
            </Paper>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The hospital ─────────────────────────
export const Hospital: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [iq, genius, studied] = [cue.s(1), cue.s(2), cue.s(3)];
  const needle = p(frame, iq, genius - iq + 10, inOut);
  return (
    <AbsoluteFill>
      <Background tint={STEEL} />
      <Headline at={2} until={studied - 1} size={88} y={150}>
        Atascadero <S>State Hospital</S>
      </Headline>
      <Headline at={studied} size={92} y={150}>
        He <R>learned the test</R>
      </Headline>
      {frame < iq - 4 ? (
        <Center top={420} style={{opacity: p(frame, 2, 8)}}>
          <Photo src={PHOTO('mug1964.jpg')} width={960} height={760} gray={1} zoom={lerp(1, 1.08, p(frame, 2, 60))} focus="50% 40%" credit="Atascadero State Hospital, 1964 · public domain" accent={STEEL} fit="contain" />
        </Center>
      ) : frame < studied ? (
        <Center top={460} style={{opacity: p(frame, iq - 4, 8)}}>
          <Gauge size={620} label={frame >= genius ? 'GENIUS LEVEL' : 'IQ TEST'} value={String(Math.round(lerp(80, 136, needle)))} unit="IQ SCORE" amount={lerp(0.1, 0.95, needle)} show={p(frame, iq - 4, 8)} />
        </Center>
      ) : (
        <div style={{position: 'absolute', top: 430, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 26}}>
          {['PERSONALITY TEST', 'PSYCHIATRIC REVIEW', 'RISK ASSESSMENT', 'PAROLE INTERVIEW'].map((t, i) => {
            const show = p(frame, studied + 6 + i * 10, 6);
            return (
              <div key={t} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#efe6cf', borderRadius: 14, padding: '22px 34px', opacity: show, transform: `translateX(${(1 - show) * 80}px)`}}>
                <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 46, color: '#1a1712'}}>{t}</div>
                <div style={{fontFamily: DISPLAY, fontSize: 80, color: '#2e8b3d', opacity: p(frame, studied + 12 + i * 10, 4)}}>✓</div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Released ─────────────────────────
export const Released: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [care, mother] = [cue.s(1), cue.s(2)];
  const m = slam(frame, mother, 2.6);
  return (
    <AbsoluteFill>
      <Background tint={frame >= mother ? RED : STEEL} />
      {frame < care ? (
        <>
          <Headline at={2} size={100} y={170}>
            <S>1969</S> · Age 21
          </Headline>
          <Center top={430}>
            <Paper width={860} rotate={-2} style={{padding: '40px 46px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, opacity: 0.6}}>STATE OF CALIFORNIA</div>
              <div style={{fontFamily: DISPLAY, fontSize: 100, lineHeight: 1.1, marginTop: 10}}>RELEASE ORDER</div>
              <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, marginTop: 18, lineHeight: 1.4}}>
                PATIENT: E. KEMPER
                <br />
                DOCTORS' ADVICE:
              </div>
            </Paper>
          </Center>
          <Stamp at={cue.w('advice')} y={960} size={110}>
            Do not release
          </Stamp>
          <Stamp at={cue.w('free')} y={1150} size={130} color="#2e8b3d" rotate={6}>
            Released
          </Stamp>
        </>
      ) : (
        <>
          <Headline at={care} until={mother - 1} size={92} y={170}>
            Into the care of the person he <R>hated most</R>
          </Headline>
          {frame >= mother ? (
            <Center top={560} style={{opacity: m.opacity, transform: `scale(${m.scale})`}}>
              <div>
                <Big size={110}>His</Big>
                <Big size={260} color={RED}>
                  MOTHER
                </Big>
              </div>
            </Center>
          ) : (
            <svg width={W} height={600} style={{position: 'absolute', top: 560, opacity: p(frame, care, 8)}}>
              <path d="M 220 300 L 860 300" stroke={C.line} strokeWidth={8} strokeDasharray="20 18" />
              <Figure x={220} y={420} h={300} color={STEEL} />
              <Figure x={860} y={420} h={270} color="#3a4a5c" />
            </svg>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Santa Cruz ─────────────────────────
export const SantaCruz: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [bar, night] = [cue.s(1), cue.s(2)];
  const drive = p(frame, night, cue.dur - night - 10, inOut);
  return (
    <AbsoluteFill>
      {frame < night ? <Background tint={STEEL} /> : <NightSky moon={false} />}
      {frame < bar ? (
        <>
          <Headline at={2} size={110} y={140}>
            Now: <R>6 foot 9</R>
          </Headline>
          <div style={{position: 'absolute', top: 420}}>
            <HeightChart show={p(frame, 6, 18, inOut)} />
          </div>
        </>
      ) : null}
      {frame >= bar && frame < night ? (
        <>
          <Headline at={bar} size={92} y={170}>
            He wanted to be a <S>cop</S>
          </Headline>
          <Center top={500} style={{opacity: p(frame, bar, 8)}}>
            <svg width={420} height={480} viewBox="0 0 100 120">
              <path d="M 50 4 L 92 22 Q 92 84 50 116 Q 8 84 8 22 Z" fill="#c9a227" stroke="#fff3c4" strokeWidth={3} />
              <circle cx={50} cy={56} r={22} fill="#8a6d10" />
              <text x={50} y={64} textAnchor="middle" fontFamily={DISPLAY} fontSize={20} fill="#fff3c4">
                POLICE
              </text>
            </svg>
          </Center>
          <Stamp at={cue.w('cop')} y={760} size={110}>
            Rejected: too tall
          </Stamp>
        </>
      ) : null}
      {frame >= night ? (
        <>
          <Headline at={night} size={92} y={130}>
            The highways of <R>Santa Cruz</R>
          </Headline>
          <MapBox>
            <USMap
              width={1000}
              height={640}
              frame={frame}
              highlight="California"
              highlightAmount={0.08}
              zoom={9}
              focus={[-122.0, 37.05]}
              routes={[{from: [-122.35, 37.25], to: [-121.65, 36.85], progress: drive}]}
              pins={[{at: PLACE.santaCruz, label: 'SANTA CRUZ', show: p(frame, night + 8, 8), align: 'left'}]}
            />
          </MapBox>
          <Center top={1000} style={{opacity: p(frame, cue.w('hitchhiking') - 8, 10)}}>
            <svg width={560} height={300} viewBox="0 0 560 300">
              <defs>
                <radialGradient id="beam" cx="0%" cy="50%" r="100%">
                  <stop offset="0%" stopColor="#fff3c4" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#fff3c4" stopOpacity={0} />
                </radialGradient>
              </defs>
              <path d="M 40 160 L 520 40 L 520 290 Z" fill="url(#beam)" />
              <Figure x={400} y={270} h={210} color="#05080d" />
              <path d="M 420 140 L 470 120 L 474 108 L 482 116 L 470 130" fill="#05080d" stroke="#05080d" strokeWidth={8} strokeLinecap="round" />
            </svg>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Six women ─────────────────────────
export const Victims: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [home, papers] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Background tint={RED} />
      <Headline at={2} until={papers - 1} size={100} y={170}>
        <R>1972–1973</R>
      </Headline>
      {frame < papers ? (
        <svg width={W} height={700} style={{position: 'absolute', top: 420}}>
          {Array.from({length: 6}, (_, i) => {
            const shown = p(frame, 8 + i * 6, 6);
            const fade = p(frame, home + i * 5, 12);
            const x = 170 + (i % 3) * 370;
            const y = 300 + Math.floor(i / 3) * 330;
            return (
              <g key={i} opacity={shown * (1 - fade * 0.75)}>
                <circle cx={x} cy={y - 190} r={42} fill={fade > 0.5 ? '#3a4a5c' : STEEL} />
                <path d={`M ${x - 70} ${y} Q ${x - 60} ${y - 150} ${x} ${y - 140} Q ${x + 60} ${y - 150} ${x + 70} ${y} Z`} fill={fade > 0.5 ? '#3a4a5c' : STEEL} />
              </g>
            );
          })}
        </svg>
      ) : (
        <Center top={360} style={{opacity: p(frame, papers, 8)}}>
          <Paper width={900} rotate={-2} style={{padding: '30px 40px'}}>
            <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 40, borderBottom: '4px double #1a1712', paddingBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
              <span>NEWSPAPER HEADLINES</span>
              <span>1973</span>
            </div>
            <div style={{fontFamily: DISPLAY, fontSize: 132, lineHeight: 0.98, marginTop: 20, letterSpacing: 1}}>
              <Typed text="MURDER CAPITAL OF THE WORLD" at={cue.w('murder') - 4} cps={30} style={{fontFamily: DISPLAY, fontWeight: 400}} />
            </div>
            <div style={{fontFamily: 'Georgia, serif', fontSize: 34, marginTop: 20, opacity: 0.7}}>Santa Cruz, California</div>
          </Paper>
        </Center>
      )}
      {frame < papers ? (
        <Center top={1260} style={{opacity: p(frame, home, 8)}}>
          <Tag color={C.white}>None of them came home</Tag>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The psychiatrists ─────────────────────────
export const Psychiatrists: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sat, safe, trunk] = [cue.s(1), cue.s(2), cue.s(3)];
  const chilling = slam(frame, 2, 2.2);
  const glow = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <Background tint={frame >= trunk ? RED : STEEL} />
      {frame < sat ? (
        <Center top={640} style={{opacity: chilling.opacity, transform: `scale(${chilling.scale})`}}>
          <Big size={150}>
            The most
            <br />
            <R>chilling part</R>
          </Big>
        </Center>
      ) : null}
      {frame >= sat && frame < trunk ? (
        <>
          <Headline at={sat} size={92} y={170}>
            Two psychiatrists. <S>One verdict.</S>
          </Headline>
          <Center top={440}>
            <Paper width={880} rotate={-2} style={{padding: '40px 46px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, opacity: 0.6}}>PSYCHIATRIC EVALUATION · 1972</div>
              <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 44, marginTop: 20, lineHeight: 1.45}}>
                PATIENT: EDMUND KEMPER
                <br />
                DANGER TO SOCIETY:
              </div>
            </Paper>
          </Center>
          <Stamp at={safe} y={900} size={150} color="#2e8b3d" rotate={-6}>
            None
          </Stamp>
        </>
      ) : null}
      {frame >= trunk ? (
        <>
          <Headline at={trunk} size={92} y={170}>
            The evidence was <R>in his trunk</R>
          </Headline>
          <Center top={520} style={{opacity: p(frame, trunk, 10)}}>
            <svg width={900} height={560} viewBox="0 0 900 560">
              <path d="M 60 360 Q 70 250 220 230 L 330 140 Q 360 120 420 120 L 600 120 Q 650 120 690 160 L 760 240 Q 860 260 860 360 L 860 420 L 60 420 Z" fill="#141c26" stroke="#3a4a5c" strokeWidth={8} />
              <circle cx={230} cy={430} r={66} fill="#05080d" stroke="#3a4a5c" strokeWidth={10} />
              <circle cx={700} cy={430} r={66} fill="#05080d" stroke="#3a4a5c" strokeWidth={10} />
              <path d="M 690 160 L 760 240 L 860 260 L 860 300 L 690 280 Z" fill={RED} opacity={0.25 + 0.35 * glow} />
              <rect x={700} y={250} width={150} height={12} fill={RED} opacity={glow} />
            </svg>
          </Center>
          <Center top={1110} style={{opacity: p(frame, cue.w('trunk') + 4, 8)}}>
            <Tag color={RED} style={{color: C.white}}>According to his own confession</Tag>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Easter weekend ─────────────────────────
export const Easter: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [bedroom, friend] = [cue.s(1), cue.s(2)];
  const out1 = p(frame, cue.w('killed') - 2, 4);
  const out2 = p(frame, cue.w('too') - 6, 4);
  return (
    <AbsoluteFill>
      <NightSky moon flashAt={[cue.w('killed') - 2, cue.w('too') - 6]} />
      <Headline at={2} until={bedroom - 1} size={110} y={190} color={RED}>
        Easter weekend, 1973
      </Headline>
      <Headline at={bedroom} until={friend - 1} size={92} y={190}>
        His <R>mother</R>
      </Headline>
      <Headline at={friend} size={92} y={190}>
        Then her <R>friend</R>
      </Headline>
      <Center top={560}>
        <svg width={900} height={640} viewBox="0 0 900 640">
          <path d="M 100 300 L 450 80 L 800 300 L 800 620 L 100 620 Z" fill="#0b0f15" stroke="#2c3e59" strokeWidth={8} />
          <rect x={410} y={460} width={90} height={160} fill="#141c26" />
          <rect x={190} y={360} width={170} height={130} fill="#f3d27a" opacity={0.65 * (1 - out1)} stroke="#2c3e59" strokeWidth={8} />
          <rect x={540} y={360} width={170} height={130} fill="#f3d27a" opacity={0.65 * (1 - out2) * (frame >= friend ? 1 : 0.4)} stroke="#2c3e59" strokeWidth={8} />
        </svg>
      </Center>
      <Center top={1260} style={{opacity: p(frame, 10, 8)}}>
        <Tag color={STEEL}>Santa Cruz · April 1973</Tag>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The drive ─────────────────────────
export const Drive: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [miles, booth] = [cue.s(1), cue.s(2)];
  const route = p(frame, 6, booth - 10, inOut);
  const odo = Math.round(route * 1200);
  return (
    <AbsoluteFill>
      <Background tint={STEEL} />
      <Headline at={2} until={booth - 1} size={92} y={130}>
        He just <S>kept driving</S>
      </Headline>
      <Headline at={booth} size={92} y={130}>
        A <R>phone booth</R>
      </Headline>
      <MapBox>
        <USMap
          width={1000}
          height={640}
          frame={frame}
          zoom={1.35}
          focus={[-113.5, 38.6]}
          routes={[{from: PLACE.santaCruz, to: PLACE.pueblo, progress: route}]}
          pins={[
            {at: PLACE.santaCruz, label: 'SANTA CRUZ', show: 1, align: 'right'},
            {at: PLACE.pueblo, label: 'PUEBLO, COLORADO', show: p(frame, booth - 6, 8), align: 'left'},
          ]}
        />
      </MapBox>
      {frame < booth ? (
        <Center top={1010} style={{opacity: p(frame, miles - 10, 8)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, background: '#0b1119', border: `4px solid ${C.line}`, borderRadius: 18, padding: '18px 34px'}}>
            <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 110, color: C.white, letterSpacing: 8}}>{String(odo).padStart(4, '0')}</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 4}}>MILES</div>
          </div>
        </Center>
      ) : (
        <Center top={960} style={{opacity: p(frame, booth, 8)}}>
          <PhoneBooth scale={0.55} glow={0.7 + 0.3 * Math.sin(frame / 3)} />
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The calls ─────────────────────────
export const Calls: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [again, until, waited] = [cue.s(1), cue.s(2), cue.s(3)];
  const calls = [
    {at: 2, label: 'CALL 1', result: 'LAUGHED OFF', color: C.dim},
    {at: again, label: 'CALL 2', result: 'IGNORED', color: C.dim},
    {at: cue.w('again', 1) - 2, label: 'CALL 3', result: '…', color: C.dim},
    {at: until, label: 'CALL 4', result: 'BELIEVED', color: RED},
  ];
  return (
    <AbsoluteFill>
      <Background tint={frame >= waited ? RED : STEEL} />
      {frame < waited ? (
        <>
          <Headline at={2} size={96} y={170}>
            He <R>kept calling</R>
          </Headline>
          <div style={{position: 'absolute', top: 430, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 30}}>
            {calls.map((c) => {
              const t = p(frame, c.at, 8);
              const ring = frame >= c.at && frame < c.at + 18 ? Math.sin(frame * 2) * 8 : 0;
              return (
                <div key={c.label} style={{display: 'flex', alignItems: 'center', gap: 30, background: C.panel, border: `4px solid ${frame >= c.at ? c.color : C.line}`, borderRadius: 20, padding: '20px 30px', opacity: frame >= c.at ? t : 0.15}}>
                  <div style={{fontSize: 80, transform: `rotate(${ring}deg)`}}>☎</div>
                  <div style={{fontFamily: DISPLAY, fontSize: 80, color: C.white, flex: 1}}>{c.label}</div>
                  <div style={{fontFamily: DISPLAY, fontSize: 64, color: c.color}}>{frame >= c.at + 10 ? c.result : ''}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Headline at={waited} size={92} y={170}>
            He <R>waited</R> for them
          </Headline>
          <Center top={430} style={{opacity: p(frame, waited, 8)}}>
            <PhoneBooth scale={0.75} police={p(frame, waited + 30, 10)} />
          </Center>
          <Stamp at={cue.w('get') - 4} y={1150} size={130}>
            Arrested
          </Stamp>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Life / FBI ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [life, fbi, last] = [cue.s(1), cue.s(2), cue.s(3)];
  const endAt = cue.e(3) + 6;
  const cta = slam(frame, endAt, 2);
  return (
    <AbsoluteFill>
      <Background tint={frame >= fbi ? STEEL : RED} />
      {frame < fbi ? (
        <>
          <Headline at={2} size={96} y={170}>
            November 1973 · <S>the verdict</S>
          </Headline>
          <Center top={430}>
            <Photo src={PHOTO('mug1973.jpg')} width={900} height={590} gray={1} zoom={lerp(1.1, 1, p(frame, 2, 60))} focus="50% 35%" credit={MUG_CREDIT} accent={RED} fit="contain" />
          </Center>
          <div style={{position: 'absolute', top: 1080, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', fontFamily: DISPLAY, fontSize: 64, letterSpacing: 2}}>
            <span style={{opacity: p(frame, cue.w('executed') - 4, 8), color: C.dim}}>HE ASKED: DEATH</span>
            <span style={{opacity: p(frame, life, 8), color: RED}}>HE GOT: LIFE</span>
          </div>
        </>
      ) : null}
      {frame >= fbi && frame < last ? (
        <>
          <Headline at={fbi} size={96} y={170}>
            The <S>FBI</S> came to listen
          </Headline>
          <Center top={430}>
            <Paper width={880} rotate={-2} style={{padding: '40px 46px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, opacity: 0.6}}>FEDERAL BUREAU OF INVESTIGATION</div>
              <div style={{fontFamily: DISPLAY, fontSize: 92, lineHeight: 1.1, marginTop: 10}}>BEHAVIORAL SCIENCE UNIT</div>
              <Typed text={'INTERVIEW SUBJECT: E. KEMPER\nPURPOSE: HOW DO KILLERS THINK?'} at={fbi + 16} cps={26} style={{fontSize: 40, lineHeight: 1.45, display: 'block', marginTop: 18}} />
            </Paper>
          </Center>
          <Center top={1060} style={{opacity: p(frame, cue.w('profiling') - 4, 8)}}>
            <Tag color={STEEL} style={{fontSize: 44, padding: '14px 30px'}}>Modern criminal profiling</Tag>
          </Center>
        </>
      ) : null}
      {frame >= last ? (
        <>
          <Center top={500}>
            <div style={{textAlign: 'center'}}>
              <Big size={110} style={{opacity: p(frame, last, 8)}}>
                He <R>fooled</R> the doctors
              </Big>
              <Big size={110} color={STEEL} style={{marginTop: 30, opacity: p(frame, cue.w('taught') - 4, 8)}}>
                then taught the FBI
              </Big>
              <Big size={110} style={{marginTop: 30, opacity: p(frame, cue.w('killers') - 4, 8)}}>
                how killers think
              </Big>
            </div>
          </Center>
          {frame >= endAt ? (
            <Center top={150} style={{opacity: cta.opacity, transform: `scale(${cta.scale})`}}>
              <div style={{fontFamily: DISPLAY, fontSize: 78, color: C.bg, background: RED, padding: '16px 34px', borderRadius: 18, letterSpacing: 2, whiteSpace: 'nowrap'}}>FOLLOW FOR THE NEXT CASE</div>
            </Center>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
