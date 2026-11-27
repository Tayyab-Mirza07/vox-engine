import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd} from '../lib';
import {has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'flight19/ai/';
const PH = 'flight19/photos/';
const CR: Record<string, string> = {
  'ftl.jpg': 'Avengers over Fort Lauderdale · Horace Bristol / NARA · public domain',
  'taylor.jpg': 'Lt. Charles C. Taylor · NAS Fort Lauderdale · public domain',
  'mariner.jpg': 'PBM Mariner · US Navy · public domain',
  'navdoc.jpg': 'Flight 19 "Navigation Problem No. 1" · US Navy / NARA · public domain',
  'map.png': 'Flight 19 route map · Wikimedia Commons',
  'tbf.png': 'Wikimedia Commons',
};
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const Silh: React.FC<{h: number}> = ({h}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'linear-gradient(180deg, #4a5260, #14181e)'}}>
    <Person h={h} color="#0a0c10" />
  </div>
);
/** Radio waveform across the frame. */
const Radio: React.FC<{on?: number; y?: number; color?: string}> = ({on = 1, y = 960, color = '#5dff9a'}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={400} style={{position: 'absolute', left: 0, top: y - 200}}>
      <path
        d={Array.from({length: 120}, (_, i) => {
          const x = i * 9;
          const a = on * (40 + rnd(i + Math.floor(frame / 2)) * 120) * Math.abs(Math.sin(i / 6 + frame / 5));
          return `${i ? 'L' : 'M'} ${x} ${200 + (i % 2 ? a : -a)}`;
        }).join(' ')}
        stroke={color}
        strokeWidth={4}
        fill="none"
        style={{filter: `drop-shadow(0 0 8px ${color})`}}
      />
    </svg>
  );
};
const PhotoStill: React.FC<{n: string; t: number; from?: {s?: number; x?: number; y?: number}; to?: {s?: number; x?: number; y?: number}; pos?: string; fb: string; fpos?: string}> = ({n, t, from, to, pos, fb, fpos}) => {
  const r = real(n);
  return r ? (
    <>
      <Still src={r} t={t} from={from} to={to} pos={pos} flicker={false} />
      <Credit t={CR[n]} />
    </>
  ) : (
    <>
      <Still src={`${AI}${fb}`} t={t} from={from} to={to} pos={fpos} />
      <AIC />
    </>
  );
};
/** Simple Florida / Bahamas map with the "thought" vs "actual" positions. */
const MiniMap: React.FC<{t: number; show2: number; drift: number}> = ({t, show2, drift}) => (
  <svg width={860} height={760} viewBox="0 0 860 760" style={{background: '#d9cfb4', boxShadow: '0 20px 40px #000c'}}>
    {Array.from({length: 9}, (_, i) => <line key={i} x1={0} y1={i * 95} x2={860} y2={i * 95} stroke="#b9ae90" strokeWidth={1} />)}
    {Array.from({length: 10}, (_, i) => <line key={`v${i}`} x1={i * 95} y1={0} x2={i * 95} y2={760} stroke="#b9ae90" strokeWidth={1} />)}
    {/* Florida peninsula */}
    <path d="M 120 0 L 330 0 L 360 120 L 380 300 L 370 470 L 330 560 L 280 590 L 240 520 L 210 380 L 150 200 Z" fill="#8a9a6a" stroke="#4a5a3a" strokeWidth={4} />
    {/* Keys */}
    {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={270 - k * 40} cy={620 + k * 12} rx={22} ry={8} fill="#8a9a6a" stroke="#4a5a3a" strokeWidth={3} />)}
    {/* Bahamas */}
    {[[560, 230, 60, 22], [620, 330, 40, 60], [690, 420, 70, 26], [540, 450, 30, 40], [760, 520, 40, 20]].map(([x, y, rx, ry], k) => <ellipse key={`b${k}`} cx={x} cy={y} rx={rx} ry={ry} fill="#8a9a6a" stroke="#4a5a3a" strokeWidth={3} />)}
    <text x={250} y={220} fontFamily={DISPLAY} fontSize={34} fill={INK}>FLORIDA</text>
    <text x={600} y={190} fontFamily={DISPLAY} fontSize={32} fill={INK}>BAHAMAS</text>
    <circle cx={385} cy={330} r={12} fill={INK} />
    <text x={400} y={338} fontFamily={MARKER} fontSize={24} fill={INK}>Ft. Lauderdale</text>
    {/* thought position */}
    <g opacity={t}>
      <circle cx={200} cy={650} r={26} fill="none" stroke="#2a5aa0" strokeWidth={6} />
      <text x={60} y={720} fontFamily={MARKER} fontSize={30} fill="#2a5aa0">"Over the Keys"</text>
    </g>
    {/* believed actual position + drifting path */}
    <g opacity={show2}>
      <circle cx={640} cy={300} r={26} fill="none" stroke={RED} strokeWidth={6} />
      <text x={560} y={270} fontFamily={MARKER} fontSize={30} fill={RED}>Near the Bahamas?</text>
      <path d={`M 640 300 L ${lerp(640, 820, drift)} ${lerp(300, 120, drift)}`} stroke={RED} strokeWidth={6} strokeDasharray="16 10" markerEnd="url(#ar)" />
    </g>
    <defs>
      <marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 Z" fill={RED} />
      </marker>
    </defs>
  </svg>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rescue, men, bodies] = [cue.s(1), cue.s(2), cue.s(3)];
  const fire = frame >= rescue;
  return (
    <AbsoluteFill>
      {fire ? (
        <Still src={`${AI}fire.png`} t={p(frame, rescue, cue.dur - rescue, (n) => n)} from={{s: 1.4}} to={{s: 1.15}} pos="60% 40%" />
      ) : (
        <Still src={`${AI}formation.png`} t={p(frame, 0, rescue, (n) => n)} from={{s: 1.35, x: 160}} to={{s: 1.1, x: -60}} pos="30% 40%" />
      )}
      <Head at={0} until={rescue} top={170} size={116}>
        5 BOMBERS <span style={{color: RED}}>VANISHED</span>
      </Head>
      <Head at={rescue} until={men} top={170} size={96}>
        THEN THE <span style={{color: RED}}>RESCUE PLANE</span>
      </Head>
      <Head at={men} until={bodies} top={170} size={150}>
        <span style={{color: RED}}>27</span> MEN
      </Head>
      <Head at={bodies} top={170} size={100}>
        NO BODIES. <span style={{color: RED}}>NO WRECKS.</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Takeoff ─────────────────────────
export const Takeoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [base, name] = [cue.s(1), cue.s(3)];
  return (
    <AbsoluteFill>
      <PhotoStill n="ftl.jpg" t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, x: 60}} to={{s: 1.35, x: -60}} pos="50% 50%" fb="formation.png" fpos="30% 40%" />
      <Head at={2} until={base} top={170} size={110}>DEC 5, 1945</Head>
      <Head at={base} until={name} top={170} size={80}>
        NAS FORT LAUDERDALE <span style={{color: '#9fc0ff'}}>FLORIDA</span>
      </Head>
      {frame >= name ? <Stamp2 at={name} x={540} y={980} size={130} color="#ff3b4f" solid>FLIGHT 19</Stamp2> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Crew ─────────────────────────
export const Crew: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [taylor, route] = [cue.s(1), cue.s(2)];
  const tp = real('taylor.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={90} y={180} w={380} r={-3} show={p(frame, 2, 10)} size={70}>
          14 MEN
        </Card>
        <Polaroid src={tp ?? undefined} w={400} h={480} x={560} y={170} r={4} show={p(frame, taylor, 12)} caption="LT. CHARLES TAYLOR" gray={0.6} pos="50% 25%">
          {!tp ? <Silh h={430} /> : null}
        </Polaroid>
        {frame >= route ? (
          <div style={{position: 'absolute', left: 120, top: 760, opacity: p(frame, route, 10), transform: 'rotate(-2deg)'}}>
            <svg width={560} height={360} viewBox="0 0 560 360" style={{background: PAPER, boxShadow: '0 16px 30px #000c'}}>
              <path d={`M 60 300 L 480 300 L 300 60 Z`} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="1400" strokeDashoffset={1400 * (1 - p(frame, route, 40))} />
              <circle cx={60} cy={300} r={14} fill={INK} />
              <text x={30} y={345} fontFamily={MARKER} fontSize={30} fill={INK}>Ft. Lauderdale</text>
              <text x={330} y={50} fontFamily={MARKER} fontSize={30} fill={INK}>over the sea</text>
            </svg>
          </div>
        ) : null}
        <Strings lines={[[280, 260, 760, 190]]} t={p(frame, taylor + 10, 20)} />
      </Stage>
      {tp ? <Credit t={CR['taylor.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Compasses out ─────────────────────────
export const Compass: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const out = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}cockpit.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.2}} to={{s: frame >= out ? 1.7 : 1.4}} pos="60% 45%" />
      <Radio on={frame >= out ? 0.6 : 0.15} y={1180} />
      <Head at={4} until={out} top={170} size={90}>
        90 MINUTES IN…
      </Head>
      <Head at={out} top={170} size={96}>
        "BOTH MY COMPASSES <span style={{color: RED}}>ARE OUT"</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Lost ─────────────────────────
export const Lost: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [actual, turn] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.35]} />
      <Stage>
        <div style={{position: 'absolute', left: 110, top: 250, transform: 'rotate(-1.5deg)'}}>
          <MiniMap t={p(frame, 4, 12)} show2={p(frame, actual, 12)} drift={p(frame, turn, 50)} />
        </div>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Rehook: heard, not found ─────────────────────────
export const Heard: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const but = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}formation.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.6, x: 200}} to={{s: 1.9, x: 260}} pos="35% 40%" />
      <AbsoluteFill style={{background: '#000', opacity: 0.35}} />
      <Radio on={1} y={1000} />
      <Head at={2} until={but} top={170} size={96}>
        THEY COULD <span style={{color: '#5dff9a'}}>HEAR THEM</span>
      </Head>
      <Head at={but} top={170} size={96}>
        BUT COULDN'T <span style={{color: RED}}>FIND THEM</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Dusk, sea, fuel ─────────────────────────
export const Fuel: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sea, fuel] = [cue.s(1), cue.s(2)];
  const pos = frame >= fuel ? '93% 55%' : '50% 15%';
  return (
    <AbsoluteFill>
      <Still src={`${AI}cockpit.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: frame >= fuel ? 2.0 : 1.3}} to={{s: frame >= fuel ? 2.4 : 1.5}} pos={pos} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(0.1, 0.45, p(frame, 0, cue.dur, (n) => n))}} />
      <Head at={2} until={sea} top={170} size={100}>THE SUN WENT DOWN</Head>
      <Head at={sea} until={fuel} top={170} size={100}>THE SEA GOT <span style={{color: '#9fc0ff'}}>ROUGH</span></Head>
      <Head at={fuel} top={170} size={100}>FUEL <span style={{color: RED}}>DROPPING</span></Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Last message ─────────────────────────
export const LastMessage: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [close, ten] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: '#05070a'}}>
      <Radio on={1} y={1150} />
      <div style={{position: 'absolute', left: 90, top: 300, width: 900, background: PAPER, padding: '40px 50px', boxShadow: '0 20px 40px #000c', boxSizing: 'border-box', transform: 'rotate(-1deg)'}}>
        <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: '#5a3a1a'}}>RADIO LOG · ~7:00 PM · DEC 5, 1945</div>
        <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 46, color: INK, marginTop: 24, lineHeight: 1.35}}>
          {frame >= close ? '"ALL PLANES CLOSE UP TIGHT…' : ''}
          <br />
          {frame >= ten ? <span style={{color: RED}}>…WHEN THE FIRST PLANE DROPS BELOW 10 GALLONS, WE ALL GO DOWN TOGETHER."</span> : ''}
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Silence ─────────────────────────
export const Silence: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={0} y1={960} x2={W} y2={960} stroke="#5dff9a" strokeWidth={4} opacity={0.6} style={{filter: 'drop-shadow(0 0 8px #5dff9a)'}} />
      </svg>
      <Head at={6} top={700} size={130}>
        <span style={{color: '#9aa'}}>SILENCE.</span>
      </Head>
      <AbsoluteFill style={{background: '#000', opacity: Math.max(0, 1 - p(frame, 0, 10))}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Rehook: a rescue plane ─────────────────────────
export const Rescue: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const sent = cue.s(1);
  return (
    <AbsoluteFill>
      {real('mariner.jpg') ? (
        <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
          <Img src={staticFile(`${PH}mariner.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(22px) brightness(0.45)', transform: 'scale(1.15)'}} />
          <Img src={staticFile(`${PH}mariner.jpg`)} style={{position: 'absolute', left: -60, top: 560, width: 1200, filter: 'contrast(1.1) sepia(0.2)', transform: `scale(${lerp(1.0, 1.12, p(frame, 0, cue.dur, (n) => n))})`, boxShadow: '0 30px 60px #000'}} />
          <Credit t={CR['mariner.jpg']} />
        </AbsoluteFill>
      ) : (
        <Still src={`${AI}fire.png`} t={p(frame, 0, cue.dur, (n) => n)} pos="40% 40%" />
      )}
      <AbsoluteFill style={{background: '#0a1426', mixBlendMode: 'multiply', opacity: 0.35}} />
      <Head at={2} until={sent} top={170} size={96}>
        THE STORY <span style={{color: RED}}>WASN'T OVER</span>
      </Head>
      <Head at={sent} top={170} size={90}>
        THE NAVY SENT A <span style={{color: '#9fc0ff'}}>RESCUE PLANE</span>
      </Head>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The Mariner ─────────────────────────
export const Mariner: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [time, never] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={real('mariner.jpg') ?? `${AI}fire.png`} w={760} h={520} x={160} y={180} r={-2} show={p(frame, 2, 12)} caption="PBM MARINER · 13 MEN" gray={0.4} />
        <Card x={140} y={860} w={380} r={-4} show={p(frame, time, 10)} size={66}>
          7:27 PM
        </Card>
        {frame >= never ? <Stamp2 at={never} x={540} y={1060} size={64} r={-6} solid>NEVER HEARD AGAIN</Stamp2> : null}
      </Stage>
      {real('mariner.jpg') ? <Credit t={CR['mariner.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Flames ─────────────────────────
export const Flames: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nick, gas] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}fire.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, x: -80}} to={{s: 1.5, x: -120}} pos="62% 45%" />
      <Head at={2} until={nick} top={170} size={92}>
        FLAMES ON THE <span style={{color: '#ffb14a'}}>HORIZON</span>
      </Head>
      <Head at={gas} top={170} size={100}>
        "FLYING <span style={{color: RED}}>GAS TANKS"</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The count ─────────────────────────
export const Count: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [six, night, search, nothing] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  return (
    <AbsoluteFill>
      <Board dim={0.1} />
      <Stage>
        <Card x={240} y={170} w={600} r={-1} show={p(frame, 2, 10)} size={90}>
          27 MEN
        </Card>
        <svg width={W} height={400} style={{position: 'absolute', top: 400, left: 0}}>
          {Array.from({length: 6}, (_, k) => {
            const x = 140 + (k % 3) * 290;
            const y = 40 + Math.floor(k / 3) * 180;
            const s = p(frame, six + k * 4, 8);
            return (
              <g key={k} transform={`translate(${x} ${y}) scale(${s})`} opacity={s}>
                <path d="M 0 60 L 220 60 L 240 70 L 220 80 L 0 80 Z M 90 20 L 130 20 L 150 120 L 110 120 Z M 10 50 L 30 50 L 30 90 L 10 90 Z" fill={k === 5 ? '#2a3a5a' : INK} />
                {frame >= night ? <path d="M -10 0 L 250 140 M 250 0 L -10 140" stroke={RED} strokeWidth={8} opacity={p(frame, night + k * 3, 6)} /> : null}
              </g>
            );
          })}
        </svg>
        <Card x={140} y={870} w={420} r={-3} show={p(frame, search, 10)} size={44}>
          5-DAY SEARCH
        </Card>
        {frame >= nothing ? <Stamp2 at={nothing} x={720} y={960} size={90}>NOTHING</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The legend ─────────────────────────
export const Legend: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [books, strange] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.3]} />
      <Stage>
        <div style={{position: 'absolute', left: 160, top: 160, opacity: p(frame, 2, 10)}}>
          <svg width={760} height={560} viewBox="0 0 760 560" style={{background: '#1a2a44', boxShadow: '0 20px 40px #000c'}}>
            {Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i) * 760} cy={rnd(i + 9) * 560} r={2} fill="#9fc0ff" opacity={0.4} />)}
            <path d="M 120 470 L 640 430 L 420 80 Z" fill={`${RED}44`} stroke={RED} strokeWidth={8} strokeDasharray="1600" strokeDashoffset={1600 * (1 - p(frame, 4, 30))} style={{filter: `drop-shadow(0 0 16px ${RED})`}} />
            <text x={110} y={510} fontFamily={DISPLAY} fontSize={30} fill="#fff">MIAMI</text>
            <text x={600} y={470} fontFamily={DISPLAY} fontSize={30} fill="#fff">PUERTO RICO</text>
            <text x={380} y={60} fontFamily={DISPLAY} fontSize={30} fill="#fff">BERMUDA</text>
            <text x={250} y={330} fontFamily={DISPLAY} fontSize={50} fill={RED}>THE TRIANGLE</text>
          </svg>
        </div>
        <Card x={120} y={800} w={560} r={-3} show={p(frame, books, 10)} size={38}>
          BOOKS: "the ocean doesn't look right"
        </Card>
        <Card x={560} y={930} w={420} r={4} show={p(frame, strange, 10)} size={38}>
          "everything looks strange"
        </Card>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The real record ─────────────────────────
export const Record: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [human, leader, compass, fuel] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const doc = real('navdoc.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={doc ?? undefined} w={460} h={600} x={120} y={170} r={-3} show={p(frame, 2, 12)} caption="NAVY RECORDS" gray={0.3} fit="cover" pos="50% 20%">
          {!doc ? <div style={{position: 'absolute', inset: 0, background: PAPER}} /> : null}
        </Polaroid>
        {frame >= 10 ? <Stamp2 at={10} x={350} y={500} size={56} r={-12} solid>NOT IN THE LOGS</Stamp2> : null}
        {[
          {at: leader, t: 'A LOST LEADER'},
          {at: compass, t: 'COMPASSES HE DIDN’T TRUST'},
          {at: fuel, t: 'FUEL RUNNING OUT'},
        ].map((r, k) => (
          <Card key={r.t} x={600} y={230 + k * 200} w={360} r={k % 2 ? 3 : -2} show={p(frame, r.at, 10)} size={38}>
            {r.t}
          </Card>
        ))}
        <Card x={180} y={900} w={720} r={1} show={p(frame, human, 10)} size={48}>
          FAR MORE HUMAN
        </Card>
      </Stage>
      {doc ? <Credit t={CR['navdoc.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Verdict ─────────────────────────
export const Verdict: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [mother, changed] = [cue.s(1), cue.s(2)];
  const tp = real('taylor.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={tp ?? undefined} w={360} h={440} x={120} y={170} r={-4} show={p(frame, 2, 12)} caption="TAYLOR" gray={0.6} pos="50% 25%">
          {!tp ? <Silh h={400} /> : null}
        </Polaroid>
        {frame < changed ? <Stamp2 at={6} x={300} y={420} size={70} solid>BLAMED</Stamp2> : null}
        <Card x={520} y={260} w={460} r={4} show={p(frame, mother, 10)} size={42}>
          HIS MOTHER FOUGHT BACK
        </Card>
        {frame >= changed ? (
          <div style={{position: 'absolute', left: 120, top: 700, width: 840, background: PAPER, padding: '36px 44px', boxShadow: '0 20px 40px #000c', boxSizing: 'border-box', transform: `rotate(-1deg) scale(${lerp(1.2, 1, p(frame, changed, 10))})`, opacity: p(frame, changed, 8)}}>
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: '#5a3a1a'}}>US NAVY · OFFICIAL FINDING</div>
            <div style={{fontFamily: DISPLAY, fontSize: 72, color: RED, marginTop: 10}}>CAUSES OR REASONS UNKNOWN</div>
          </div>
        ) : null}
      </Stage>
      {tp ? <Credit t={CR['taylor.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · 1991 ─────────────────────────
export const Wreck: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [solved, wasnt] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}wreck.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.2, x: -80}} to={{s: 1.45, x: -140}} pos="58% 50%" tint="#0a3a4a" />
      <Head at={2} until={solved} top={170} size={96}>
        1991: <span style={{color: '#5dd5ff'}}>5 AVENGERS FOUND</span>
      </Head>
      <Head at={solved} until={wasnt} top={170} size={100}>
        SOLVED?
      </Head>
      {frame >= wasnt ? <Stamp2 at={wasnt} x={540} y={900} size={110} color="#ff3b4f" solid>WRONG PLANES</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Ending + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [what, comment, cta] = [cue.s(1), cue.s(2), cue.s(3)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Still src={`${AI}formation.png`} t={p(frame, 0, cta, (n) => n)} from={{s: 1.2, x: -200}} to={{s: 1.4, x: -320}} pos="70% 40%" />
        <Head at={0} until={what} top={170} size={92}>STILL <span style={{color: RED}}>WAITING TO BE FOUND</span></Head>
        <Head at={what} top={170} size={100}>WHAT <span style={{color: RED}}>HAPPENED?</span></Head>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </div>
        ) : null}
        <AIC />
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="flight19/cta/mh370.jpg" w={620} h={720} x={230} y={300} r={-2} show={p(frame, cta + 4, 12)} caption="MH370" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      <LightSweep at={cta + 6} color="#cfe0ff" strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail (Shorts cover) ─────────────────────────
export const Flight19Thumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${AI}formation.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '40% 50%', filter: 'blur(18px) brightness(0.55)', transform: 'scale(1.1)'}} />
    <Img src={staticFile(`${AI}formation.png`)} style={{position: 'absolute', left: -98, top: 360, width: 1956, height: 1100, filter: 'contrast(1.15) saturate(1.15)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000f0 0%, #00000090 18%, transparent 30%, transparent 62%, #000000f0 84%)'}} />
    <div style={{position: 'absolute', left: 20, top: 560, width: 960, height: 300, border: `10px solid ${RED}`, borderRadius: '50%', boxShadow: `0 0 40px ${RED}`}} />
    <div style={{position: 'absolute', top: 70, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 170, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #000'}}>
      5 BOMBERS
      <br />
      <span style={{color: RED}}>VANISHED</span>
    </div>
    <div style={{position: 'absolute', bottom: 330, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 96, lineHeight: 1, color: '#ffd76a', textShadow: '0 8px 0 #000'}}>THEN THE RESCUE PLANE TOO</div>
    <div style={{position: 'absolute', bottom: 230, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 64, color: '#fff', textShadow: '0 4px 0 #000'}}>Flight 19 · 1945</div>
  </AbsoluteFill>
);
