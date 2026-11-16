import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Globe, PLACES, USMap, LonLat} from './geo';
import {BODY, C, Cues, DISPLAY, H, W, inOut, lerp, p, rnd, slam} from './lib';
import {Background, Chip, Figure, Headline, Stamp, Tag} from './ui';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const zoom = lerp(1.25, 1, p(frame, 0, 14));
  const stampAt = cue.w('reform');
  const mistakeAt = cue.s(1);
  const m = slam(frame, mistakeAt, 2.4);
  return (
    <AbsoluteFill>
      <Background tint={frame >= stampAt ? C.red : C.green} />
      <Headline at={0} size={104} y={210}>
        The <span style={{color: C.green}}>trillion-dollar</span> CEO
      </Headline>
      <Center top={470} style={{transform: `scale(${zoom})`}}>
        <svg width={700} height={780} viewBox="0 0 700 780">
          <defs>
            <linearGradient id="rim" x1="0" x2="1">
              <stop offset="0%" stopColor={C.green} />
              <stop offset="45%" stopColor="#1a2129" />
              <stop offset="100%" stopColor="#0c1014" />
            </linearGradient>
          </defs>
          {/* anonymous bust silhouette in a jacket */}
          <circle cx={350} cy={230} r={150} fill="url(#rim)" />
          <path d="M 60 780 Q 70 470 250 420 L 350 520 L 450 420 Q 630 470 640 780 Z" fill="url(#rim)" />
          <path d="M 250 420 L 350 520 L 300 640 L 215 470 Z" fill="#05070a" opacity={0.75} />
          <path d="M 450 420 L 350 520 L 400 640 L 485 470 Z" fill="#05070a" opacity={0.75} />
          <text x={350} y={285} textAnchor="middle" fontFamily={DISPLAY} fontSize={170} fill={C.bg} opacity={0.9}>
            ?
          </text>
        </svg>
      </Center>
      <Stamp at={stampAt} y={860} size={128}>
        Reform school
      </Stamp>
      {frame >= mistakeAt ? (
        <Center top={1050} style={{opacity: m.opacity, transform: `scale(${m.scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 150, color: C.white, letterSpacing: 4, textShadow: '0 8px 40px #000'}}>BY MISTAKE.</div>
        </Center>
      ) : null}
      <Center top={1250} style={{opacity: p(frame, mistakeAt + 8, 6)}}>
        <Tag color={C.white}>Sent away at age 9</Tag>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Setup ─────────────────────────
export const Setup: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const rewindAt = cue.s(1) - 4;
  const rewinding = frame >= rewindAt;
  const chipIn = slam(frame, 2, 1.8);
  const nodes = Array.from({length: 14}, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.3;
    const r = 330 + rnd(i) * 130;
    return {x: 540 + Math.cos(a) * r, y: 720 + Math.sin(a) * r * 0.85, d: 14 + i * 4};
  });
  const chart = Array.from({length: 40}, (_, i) => {
    const t = i / 39;
    return [70 + t * 940, 1260 - Math.pow(t, 3.2) * 300 - rnd(i + 5) * 26 * t] as const;
  });
  const chartP = p(frame, cue.w('powering'), 60, inOut);
  const shown = chart.slice(0, Math.max(2, Math.round(chart.length * chartP)));
  const year = Math.round(interpolate(frame, [rewindAt + 4, cue.e(1) - 6], [2026, 1973], {...clamp, easing: inOut}));
  const gray = rewinding ? p(frame, rewindAt, 8) : 0;
  const jitter = rewinding ? (rnd(frame) - 0.5) * 10 : 0;
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{filter: `grayscale(${gray}) brightness(${1 - gray * 0.55})`, transform: `translateX(${jitter}px)`}}>
        <Headline at={4} until={rewindAt + 200} size={84} y={200}>
          Powering nearly <span style={{color: C.green}}>every AI</span> on Earth
        </Headline>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {nodes.map((n, i) => {
            const t = p(frame, n.d, 14);
            return (
              <g key={i} opacity={t}>
                <line x1={540} y1={720} x2={lerp(540, n.x, t)} y2={lerp(720, n.y, t)} stroke={C.green} strokeOpacity={0.45} strokeWidth={3} />
                <circle cx={lerp(540, n.x, t)} cy={lerp(720, n.y, t)} r={12 + 5 * Math.sin((frame + i * 9) / 6)} fill={C.green} />
              </g>
            );
          })}
          <polyline points={shown.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.green} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={shown[shown.length - 1][0]} cy={shown[shown.length - 1][1]} r={16} fill={C.white} />
        </svg>
        <Center top={520} style={{opacity: chipIn.opacity, transform: `scale(${chipIn.scale})`}}>
          <Chip size={400} label="AI" glow={1 + Math.sin(frame / 5) * 0.4} />
        </Center>
        <Center top={1010} style={{opacity: p(frame, 10, 8)}}>
          <Tag>Jensen Huang · CEO, Nvidia</Tag>
        </Center>
      </AbsoluteFill>
      {rewinding ? (
        <>
          <Center top={560}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 380,
                color: C.white,
                letterSpacing: 6,
                textShadow: `8px 0 0 ${C.red}, -8px 0 0 ${C.green}`,
                transform: `translateX(${jitter * 2}px)`,
              }}
            >
              {year}
            </div>
          </Center>
          <Center top={470} style={{opacity: 0.6 + 0.4 * Math.sin(frame / 2)}}>
            <Tag color={C.red}>◀◀ Rewind</Tag>
          </Center>
          <Center top={1040} style={{opacity: p(frame, cue.w('mistake'), 6)}}>
            <div style={{fontFamily: DISPLAY, fontSize: 84, color: C.red, letterSpacing: 3, textAlign: 'center'}}>IT STARTS WITH A MISTAKE</div>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Map sequence 1 ─────────────────────────
export const MapOne: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const toThai = cue.s(1) - 4;
  const toUsa = cue.w('parents');
  const toKy = cue.s(3);
  const usaDur = cue.w('alone') - toUsa;
  const p1 = p(frame, toThai, 22, inOut);
  const p2 = p(frame, toUsa, usaDur, inOut);
  const p3 = p(frame, toKy, 40, inOut);
  // Camera follows the route head; longitudes are unwrapped so it crosses the Pacific.
  const lon = interpolate(frame, [0, toThai, toThai + 22, toUsa, toUsa + usaDur, toKy, toKy + 40], [121, 121, 106, 106, 232, 236, 272], {...clamp, easing: inOut});
  const lat = interpolate(frame, [0, toThai + 22, toUsa + usaDur, toKy + 40], [22, 16, 40, 37], clamp);
  const scale = interpolate(frame, [0, 16, toUsa, toUsa + usaDur / 2, toUsa + usaDur, toKy, toKy + 40], [1300, 760, 760, 470, 620, 620, 1050], {...clamp, easing: inOut});
  const center: LonLat = [lon > 180 ? lon - 360 : lon, lat];
  const aloneAt = cue.w('alone');
  return (
    <AbsoluteFill>
      <Background />
      <div style={{position: 'absolute', top: 290, left: 0}}>
        <Globe
          width={W}
          height={1040}
          center={center}
          scale={scale}
          frame={frame}
          highlight={[frame < toUsa ? 'Taiwan' : '', frame >= toThai && frame < toUsa + usaDur ? 'Thailand' : '', frame >= toUsa + usaDur - 10 ? 'United States of America' : '']}
          routes={[
            {from: PLACES.taiwan, to: PLACES.thailand, progress: p1},
            {from: PLACES.thailand, to: PLACES.tacoma, progress: p2},
            {from: PLACES.tacoma, to: PLACES.oneida, progress: p3},
          ]}
          pins={[
            {at: PLACES.taiwan, label: 'TAIWAN · 1963', show: p(frame, cue.s(0), 8), align: 'right'},
            {at: PLACES.thailand, label: 'THAILAND', show: p(frame, toThai + 18, 8), align: 'left'},
            {at: PLACES.tacoma, label: 'USA · AGE 9', show: p(frame, toUsa + usaDur - 4, 8) * (1 - p(frame, toKy + 20, 10)), align: 'right'},
            {at: PLACES.oneida, label: 'KENTUCKY', show: p(frame, toKy + 36, 8), align: 'left'},
          ]}
        />
      </div>
      <Headline at={2} until={aloneAt - 2} size={84} y={170}>
        The journey
      </Headline>
      <Headline at={aloneAt} until={toKy + 4} size={100} y={150} color={C.white}>
        9 years old.
        <br />
        <span style={{color: C.red}}>No parents.</span>
      </Headline>
      <Headline at={toKy + 6} size={84} y={170}>
        “An <span style={{color: C.green}}>elite</span> boarding school”
      </Headline>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Twist ─────────────────────────
export const Twist: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const strikeAt = cue.s(0);
  const reformAt = cue.w('reform');
  const roomAt = cue.s(2);
  const jobAt = cue.s(3);
  const zoom = interpolate(frame, [0, cue.s(1), cue.w('Kentucky') + 10], [1, 1, 2.6], {...clamp, easing: inOut});
  const strike = p(frame, strikeAt + 2, 8);
  const panel = frame < roomAt ? 'school' : frame < jobAt ? 'room' : 'job';
  const day = Math.round(interpolate(frame, [cue.s(4), cue.dur - 10], [1, 365], clamp));
  const mopSwing = Math.sin(frame / 3) * 14;
  const every = ['EVERY.', 'SINGLE.', 'DAY.'];
  const everyAt = [cue.w('Every'), cue.w('single'), cue.w('day')];
  return (
    <AbsoluteFill>
      <Background tint={frame >= reformAt ? C.red : C.green} />
      <div style={{position: 'absolute', top: 250, left: 40, height: 640, width: 1000, overflow: 'hidden', borderRadius: 24}}>
        <USMap
          width={1000}
          height={640}
          frame={frame}
          highlight="Kentucky"
          highlightAmount={0.5 + 0.5 * Math.sin(frame / 5)}
          zoom={zoom}
          focus={PLACES.oneida}
          pins={[{at: PLACES.oneida, label: 'ONEIDA, KY', show: p(frame, cue.s(1), 8), align: 'left'}]}
        />
      </div>

      {panel === 'school' ? (
        <>
          <Center top={960}>
            <div style={{position: 'relative', fontFamily: DISPLAY, fontSize: 88, color: C.dim, letterSpacing: 3}}>
              ELITE BOARDING SCHOOL
              <div style={{position: 'absolute', left: -14, top: '48%', height: 12, width: `${strike * 104}%`, background: C.red, transform: 'rotate(-2deg)'}} />
            </div>
          </Center>
          <Stamp at={reformAt} y={1170} size={132}>
            Reform school
          </Stamp>
        </>
      ) : null}

      {panel === 'room' ? (
        <svg width={W} height={470} style={{position: 'absolute', top: 900}}>
          <line x1={140} x2={940} y1={420} y2={420} stroke={C.line} strokeWidth={4} />
          <g opacity={p(frame, roomAt, 6)}>
            <Figure x={360} y={420} h={190} color={C.green} />
            <text x={360} y={464} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={34} fill={C.green} letterSpacing={3}>
              JENSEN · 9
            </text>
          </g>
          <g opacity={p(frame, cue.w('seventeen') - 4, 6)} transform={`translate(0, ${lerp(40, 0, p(frame, cue.w('seventeen') - 4, 8))})`}>
            <Figure x={700} y={420} h={390} color="#2b3541" stroke={C.red} />
            {/* scars */}
            {[0, 1, 2].map((i) => (
              <line key={i} x1={672 + i * 22} y1={190 + i * 34} x2={700 + i * 22} y2={170 + i * 34} stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={p(frame, cue.w('knife') + i * 3, 4)} />
            ))}
            <text x={700} y={464} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={34} fill={C.red} letterSpacing={3}>
              ROOMMATE · 17
            </text>
          </g>
        </svg>
      ) : null}

      {panel === 'job' ? (
        <>
          <Center top={930}>
            <Tag color={C.white}>Jensen's job</Tag>
          </Center>
          <svg width={W} height={330} style={{position: 'absolute', top: 1000, opacity: p(frame, cue.s(4) - 4, 6)}}>
            <g transform={`translate(300, 30) rotate(${mopSwing}, 0, 260)`}>
              <line x1={0} y1={0} x2={0} y2={230} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
              <path d="M -60 230 L 60 230 L 78 300 L -78 300 Z" fill={C.green} />
              {[-50, -25, 0, 25, 50].map((x) => (
                <line key={x} x1={x} y1={300} x2={x * 1.2} y2={322} stroke={C.green} strokeWidth={8} strokeLinecap="round" />
              ))}
            </g>
            <text x={470} y={130} fontFamily={BODY} fontWeight={800} fontSize={40} fill={C.dim} letterSpacing={4}>
              TOILET DUTY
            </text>
            <text x={470} y={270} fontFamily={DISPLAY} fontSize={140} fill={C.white} letterSpacing={4}>
              DAY {String(day).padStart(3, '0')}
            </text>
          </svg>
        </>
      ) : null}

      <Headline at={0} until={reformAt - 1} size={84} y={130}>
        It wasn't.
      </Headline>
      <Headline at={reformAt} until={jobAt - 1} size={78} y={130}>
        Oneida Baptist Institute
      </Headline>
      {frame >= everyAt[0] ? (
        <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, fontFamily: DISPLAY, fontSize: 96, letterSpacing: 2}}>
          {every.map((w, i) => {
            const s = slam(frame, everyAt[i], 2.2);
            return (
              <span key={w} style={{opacity: frame >= everyAt[i] ? s.opacity : 0, transform: `scale(${s.scale})`, color: i === 2 ? C.red : C.white, display: 'inline-block'}}>
                {w}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Turn ─────────────────────────
export const Turn: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const readAt = cue.s(1);
  const liftAt = cue.s(2);
  const toughAt = cue.s(3);
  const warmth = p(frame, 0, 50);
  const book = slam(frame, readAt, 1.8);
  const bar = slam(frame, liftAt, 1.8);
  const lift = Math.sin(Math.max(0, frame - liftAt) / 5) * 22;
  const link = p(frame, liftAt + 6, 14, inOut);
  const card: React.CSSProperties = {
    width: 440,
    height: 480,
    borderRadius: 28,
    background: C.panel,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  };
  const label: React.CSSProperties = {fontFamily: DISPLAY, fontSize: 60, letterSpacing: 2, textAlign: 'center', lineHeight: 1.05};
  return (
    <AbsoluteFill>
      <Background tint={C.warm} warmth={warmth} />
      <Headline at={2} until={readAt - 1} size={150} y={620}>
        But he
        <br />
        <span style={{color: C.warm}}>didn't break.</span>
      </Headline>
      {frame >= readAt ? (
        <>
          <Headline at={readAt} until={toughAt - 1} size={80} y={190}>
            He taught his roommate <span style={{color: C.green}}>to read</span>
          </Headline>
          <div style={{position: 'absolute', top: 560, left: 70, opacity: book.opacity, transform: `scale(${book.scale})`}}>
            <div style={{...card, border: `5px solid ${C.green}`}}>
              <svg width={240} height={190} viewBox="0 0 240 190">
                <path d="M 120 30 Q 60 0 10 20 L 10 170 Q 60 150 120 180 Z" fill="none" stroke={C.green} strokeWidth={10} strokeLinejoin="round" />
                <path d="M 120 30 Q 180 0 230 20 L 230 170 Q 180 150 120 180 Z" fill="none" stroke={C.green} strokeWidth={10} strokeLinejoin="round" />
                {[60, 90, 120].map((y) => (
                  <g key={y} stroke={C.green} strokeWidth={6} strokeLinecap="round" opacity={0.7}>
                    <line x1={35} y1={y} x2={95} y2={y + 8} />
                    <line x1={145} y1={y + 8} x2={205} y2={y} />
                  </g>
                ))}
              </svg>
              <div style={{...label, color: C.green}}>
                JENSEN TAUGHT
                <br />
                READING
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', top: 560, right: 70, opacity: frame >= liftAt ? bar.opacity : 0, transform: `scale(${bar.scale})`}}>
            <div style={{...card, border: `5px solid ${C.warm}`}}>
              <svg width={300} height={190} viewBox="0 0 300 190" style={{transform: `translateY(${-lift}px)`}}>
                <line x1={20} y1={95} x2={280} y2={95} stroke={C.warm} strokeWidth={12} strokeLinecap="round" />
                {[50, 78, 222, 250].map((x, i) => (
                  <rect key={x} x={x - 11} y={i === 0 || i === 3 ? 50 : 30} width={22} height={i === 0 || i === 3 ? 90 : 130} rx={6} fill={C.warm} />
                ))}
              </svg>
              <div style={{...label, color: C.warm}}>
                ROOMMATE TAUGHT
                <br />
                LIFTING
              </div>
            </div>
          </div>
          <svg width={W} height={120} style={{position: 'absolute', top: 1050}}>
            <path d="M 290 20 Q 540 150 790 20" pathLength={1} strokeDasharray={`${link} 1`} fill="none" stroke={C.white} strokeWidth={8} strokeLinecap="round" />
          </svg>
          <Center top={1170} style={{opacity: p(frame, liftAt + 14, 8)}}>
            <Tag color={C.white}>A fair trade</Tag>
          </Center>
        </>
      ) : null}
      <Headline at={toughAt} size={92} y={170}>
        Those years made him <span style={{color: C.warm}}>tough</span>
      </Headline>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Map sequence 2 ─────────────────────────
export const MapTwo: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const toSj = cue.s(1);
  const boothAt = cue.w('booth');
  const startAt = cue.w('start');
  const r1 = p(frame, 4, cue.w('Oregon') - 8, inOut);
  const r2 = p(frame, toSj, 26, inOut);
  const zoom = interpolate(frame, [toSj, toSj + 30], [1, 1.9], {...clamp, easing: inOut});
  const booth = p(frame, boothAt, 10);
  const born = slam(frame, startAt, 2.2);
  return (
    <AbsoluteFill>
      <Background />
      <div style={{position: 'absolute', top: 270, left: 40, height: 640, width: 1000, overflow: 'hidden', borderRadius: 24}}>
        <USMap
          width={1000}
          height={640}
          frame={frame}
          highlight={frame < toSj ? 'Oregon' : 'California'}
          zoom={zoom}
          focus={[-116, 41]}
          routes={[
            {from: PLACES.oneida, to: PLACES.portland, progress: r1},
            {from: PLACES.portland, to: PLACES.sanJose, progress: r2},
          ]}
          pins={[
            {at: PLACES.portland, label: 'OREGON · AGE 15', show: p(frame, cue.w('Oregon') - 6, 8), align: 'right'},
            {at: PLACES.sanJose, label: 'SAN JOSE · 1993', show: p(frame, toSj + 24, 8), align: 'right'},
          ]}
        />
      </div>
      <Headline at={2} until={toSj - 1} size={84} y={130}>
        Age 15: <span style={{color: C.green}}>dishwasher</span>
      </Headline>
      <Headline at={toSj} size={84} y={130}>
        1993 — a <span style={{color: C.green}}>diner booth</span>
      </Headline>
      {/* booth: three founders around a table */}
      <svg width={W} height={400} style={{position: 'absolute', top: 930, opacity: booth}}>
        <rect x={330} y={170} width={420} height={36} rx={12} fill={C.white} />
        <rect x={522} y={206} width={36} height={130} fill={C.dim} />
        {[
          {x: 300, d: 0},
          {x: 780, d: 5},
          {x: 540, d: 10},
        ].map((s, i) => {
          const t = p(frame, cue.w('two') + s.d - 6, 8);
          return (
            <g key={i} opacity={t} transform={`translate(0, ${lerp(30, 0, t)})`}>
              <circle cx={s.x} cy={i === 2 ? 60 : 110} r={42} fill={i === 0 ? C.green : '#3a4a5c'} />
              <path d={`M ${s.x - 62} ${i === 2 ? 170 : 240} Q ${s.x} ${i === 2 ? 90 : 140} ${s.x + 62} ${i === 2 ? 170 : 240} Z`} fill={i === 0 ? C.green : '#3a4a5c'} />
            </g>
          );
        })}
      </svg>
      {frame >= startAt ? (
        <Center top={1215} style={{opacity: born.opacity, transform: `scale(${born.scale})`}}>
          <Tag style={{fontSize: 52, padding: '14px 34px'}}>Nvidia is born</Tag>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Stakes ─────────────────────────
export const Stakes: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const flopAt = cue.w('flops');
  const staffAt = cue.s(1);
  const daysAt = cue.s(2);
  const saveAt = cue.s(3);
  const savedAt = cue.w('saves');
  const phase = frame < staffAt ? 0 : frame < daysAt ? 1 : frame < saveAt ? 2 : 3;
  const days = Math.round(interpolate(frame, [daysAt, saveAt - 4], [90, 30], {...clamp, easing: inOut}));
  const cash = frame < savedAt ? interpolate(frame, [0, saveAt], [0.85, 0.06], clamp) : lerp(0.06, 1, p(frame, savedAt, 18));
  const cashColor = frame >= savedAt ? C.green : C.red;
  const drop = p(frame, saveAt, 12);
  const shake = phase === 2 ? (rnd(frame) - 0.5) * 8 : 0;
  return (
    <AbsoluteFill>
      <Background tint={frame >= savedAt ? C.green : C.red} />
      <AbsoluteFill style={{transform: `translate(${shake}px, ${-shake}px)`}}>
        {phase === 0 ? (
          <>
            <Headline at={2} size={96} y={190}>
              1996: the first chip
            </Headline>
            <Center top={520}>
              <div style={{position: 'relative', filter: frame >= flopAt ? 'grayscale(1)' : undefined, transform: `rotate(${frame >= flopAt ? lerp(0, 9, p(frame, flopAt, 8)) : 0}deg)`}}>
                <Chip size={440} label="NV1" color={frame >= flopAt ? C.dim : C.green} />
              </div>
            </Center>
            <Stamp at={flopAt} y={740} size={170}>
              Flop
            </Stamp>
          </>
        ) : null}
        {phase === 1 ? (
          <>
            <Headline at={staffAt} size={96} y={190}>
              Half the staff: <span style={{color: C.red}}>gone</span>
            </Headline>
            <svg width={W} height={640} style={{position: 'absolute', top: 480}}>
              {Array.from({length: 24}, (_, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                const cut = (col + row) % 2 === 1;
                const t = cut ? p(frame, staffAt + 8 + (i % 7) * 2, 8) : 0;
                const x = 165 + col * 150;
                const y = 150 + row * 150;
                return (
                  <g key={i} opacity={1 - t * 0.85} transform={`translate(0, ${t * 30})`}>
                    <circle cx={x} cy={y - 62} r={24} fill={cut && t > 0 ? C.red : C.white} />
                    <path d={`M ${x - 36} ${y} Q ${x} ${y - 70} ${x + 36} ${y} Z`} fill={cut && t > 0 ? C.red : C.white} />
                  </g>
                );
              })}
            </svg>
          </>
        ) : null}
        {phase === 2 ? (
          <>
            <Headline at={daysAt} size={84} y={190}>
              Time left to live
            </Headline>
            <Center top={470}>
              <div style={{fontFamily: DISPLAY, fontSize: 460, lineHeight: 1, color: C.red, textShadow: `0 0 80px ${C.red}88`, transform: `scale(${1 + 0.04 * Math.sin(frame / 2)})`}}>{days}</div>
            </Center>
            <Center top={920}>
              <div style={{fontFamily: DISPLAY, fontSize: 130, color: C.white, letterSpacing: 10}}>DAYS</div>
            </Center>
          </>
        ) : null}
        {phase === 3 ? (
          <>
            <Headline at={saveAt} size={96} y={190}>
              One <span style={{color: C.green}}>last</span> chip
            </Headline>
            <Center top={lerp(-500, 500, drop)}>
              <Chip size={440} label="RIVA 128" sub="1997" glow={1 + Math.sin(frame / 4) * 0.5} />
            </Center>
          </>
        ) : null}
        {/* cash runway bar */}
        <div style={{position: 'absolute', top: 1160, left: 90, right: 90}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: C.dim, marginBottom: 12}}>
            CASH RUNWAY
          </div>
          <div style={{height: 56, borderRadius: 14, background: C.panel, border: `3px solid ${C.line}`, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${cash * 100}%`, background: cashColor, boxShadow: `0 0 40px ${cashColor}`}} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Payoff ─────────────────────────
export const Payoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const secretAt = cue.s(1);
  const toiletsAt = cue.s(2);
  const endAt = cue.e(2) + 6;
  const chartP = p(frame, 2, secretAt - 8, inOut);
  const pts = Array.from({length: 50}, (_, i) => {
    const t = i / 49;
    return [90 + t * 900, 1200 - Math.pow(t, 4) * 640 - rnd(i + 11) * 22 * t] as const;
  });
  const shown = pts.slice(0, Math.max(2, Math.round(pts.length * chartP)));
  const last = shown[shown.length - 1];
  const stops = ['TAIWAN', 'THAILAND', 'KENTUCKY', 'OREGON', 'SILICON VALLEY'];
  const strike = p(frame, cue.w("isn't"), 8);
  const cta = slam(frame, endAt, 2);
  return (
    <AbsoluteFill>
      <Background />
      {frame < secretAt ? (
        <>
          <Headline at={2} size={120} y={190}>
            Worth <span style={{color: C.green}}>trillions</span>
          </Headline>
          <svg width={W} height={H} style={{position: 'absolute'}}>
            <polygon points={`${shown.map((q) => q.join(',')).join(' ')} ${last[0]},1200 90,1200`} fill={C.green} opacity={0.16} />
            <polyline points={shown.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.green} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={last[0]} cy={last[1]} r={20} fill={C.white} />
            <line x1={90} x2={990} y1={1200} y2={1200} stroke={C.line} strokeWidth={4} />
          </svg>
        </>
      ) : null}
      {frame >= secretAt && frame < toiletsAt ? (
        <>
          <Headline at={secretAt} size={96} y={190}>
            His biggest secret
          </Headline>
          <Center top={520}>
            <div style={{position: 'relative'}}>
              <Chip size={440} label="CHIP" color={strike > 0 ? C.dim : C.green} />
              <div style={{position: 'absolute', left: -40, top: '48%', height: 22, width: `${strike * 118}%`, background: C.red, transform: 'rotate(-18deg)', transformOrigin: 'left'}} />
            </div>
          </Center>
        </>
      ) : null}
      {frame >= toiletsAt ? (
        <>
          <Headline at={toiletsAt} until={endAt - 1} size={92} y={170}>
            He scrubbed toilets <span style={{color: C.green}}>first</span>
          </Headline>
          {/* the whole route, replayed as a fast timeline */}
          <svg width={W} height={760} style={{position: 'absolute', top: 480}}>
            <line x1={200} x2={200} y1={40} y2={40 + 640 * p(frame, toiletsAt + 2, 34, inOut)} stroke={C.green} strokeWidth={10} strokeLinecap="round" />
            {stops.map((s, i) => {
              const t = p(frame, toiletsAt + 2 + i * 8, 6);
              const y = 40 + i * 160;
              const lastStop = i === stops.length - 1;
              return (
                <g key={s} opacity={t}>
                  <circle cx={200} cy={y} r={lastStop ? 30 : 22} fill={lastStop ? C.white : C.green} stroke={C.green} strokeWidth={8} />
                  <text x={270} y={y + 24} fontFamily={DISPLAY} fontSize={lastStop ? 92 : 70} fill={lastStop || i === 2 ? C.white : C.dim} letterSpacing={3}>
                    {s}
                  </text>
                  {i === 2 ? (
                    <text x={270} y={y + 70} fontFamily={BODY} fontWeight={800} fontSize={30} fill={C.red} letterSpacing={3}>
                      REFORM SCHOOL · TOILET DUTY
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </>
      ) : null}
      {frame >= endAt ? (
        <Center top={150} style={{opacity: cta.opacity, transform: `scale(${cta.scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 104, color: C.bg, background: C.green, padding: '18px 44px', borderRadius: 18, letterSpacing: 3}}>
            FOLLOW FOR PART 2
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
