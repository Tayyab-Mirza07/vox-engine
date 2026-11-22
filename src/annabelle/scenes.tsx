import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd} from '../lib';
import {has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Cam, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'annabelle/ai/';
const PH = 'annabelle/photos/';
const COVER = has(`${PH}cover.png`) ? `${PH}cover.png` : has(`${PH}title.png`) ? `${PH}title.png` : '';
const AICREDIT: React.FC = () => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff88', zIndex: 6}}>AI illustration · dramatization</div>;
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff88', zIndex: 6}}>{t}</div>;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.08, backgroundImage: `radial-gradient(#fff 1px, transparent 1.2px)`, backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const Silh: React.FC<{h: number; flip?: boolean}> = ({h, flip}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'linear-gradient(180deg, #3a3028, #14100c)'}}>
    <Person h={h} color="#0a0806" flip={flip} />
  </div>
);

// ───────────────────────── 0 · Hook: the case ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const dead = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}case.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.25, x: 120}} to={{s: 1.05, x: 60}} pos="16% 50%" />
      <Head at={0} until={dead} top={170} size={104}>
        POSITIVELY
        <br />
        <span style={{color: RED}}>DO NOT OPEN</span>
      </Head>
      <Head at={dead} top={170} size={88}>
        HER HANDLER WAS
        <br />
        <span style={{color: RED}}>FOUND DEAD · 2025</span>
      </Head>
      <AICREDIT />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · The real Annabelle ─────────────────────────
export const RealDoll: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [notMovie, raggedy] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
<Stage>
      <Cam s={lerp(1.08, 1, p(frame, 0, cue.dur, (n) => n))}>
        <Card x={300} y={160} w={480} r={-2} show={p(frame, 2, 10)} size={64}>
          ANNABELLE
        </Card>
        {/* the movie version: crossed out (generic porcelain doll silhouette, not the film prop) */}
        <Polaroid w={400} h={440} x={110} y={420} r={-6} show={p(frame, notMovie, 10)} caption="THE MOVIES">
          <svg width="100%" height="100%" viewBox="0 0 200 220" style={{background: '#2a2420'}}>
            <circle cx={100} cy={70} r={42} fill="#e8e0d8" />
            <path d="M 58 70 Q 60 20 100 18 Q 140 20 142 70 L 150 110 Q 100 90 50 110 Z" fill="#3a2a1a" />
            <path d="M 60 120 L 140 120 L 160 220 L 40 220 Z" fill="#efe8e0" />
            <circle cx={86} cy={68} r={6} fill="#111" />
            <circle cx={114} cy={68} r={6} fill="#111" />
          </svg>
        </Polaroid>
        {frame >= notMovie + 14 ? <Stamp2 at={notMovie + 14} x={310} y={680} size={70}>NOT HER</Stamp2> : null}
        <Polaroid src={COVER} w={430} h={530} x={540} y={460} r={5} show={p(frame, raggedy, 12)} caption="A RAGGEDY ANN" fit="cover" pos="50% 30%" gray={0}>
          {!COVER ? <Img src={staticFile(`${AI}room.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} /> : null}
        </Polaroid>
        <Strings lines={[[540, 330, 790, 470]]} t={p(frame, raggedy + 6, 16)} />
      </Cam>
      {COVER ? <Credit t="Raggedy Ann Stories (1918), Johnny Gruelle · public domain" /> : null}
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Connecticut, 1970 ─────────────────────────
export const Donna: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [donna, angie] = [cue.s(1), cue.s(2)];
  const pan = p(frame, 0, cue.dur, (n) => n);
  return (
    <AbsoluteFill>
      <Board light={[0.3, 0.3]} />
<Stage>
      <Cam x={lerp(60, -40, pan)} s={1.02}>
        <Card x={220} y={150} w={640} r={-1} show={p(frame, 0, 10)} size={60}>
          CONNECTICUT · 1970
        </Card>
        <Polaroid w={420} h={480} x={80} y={420} r={-4} show={p(frame, donna, 12)} caption="DONNA · NURSE">
          <Silh h={430} />
        </Polaroid>
        <Polaroid w={420} h={480} x={580} y={470} r={4} show={p(frame, angie, 12)} caption="ANGIE">
          <Silh h={430} flip />
        </Polaroid>
        <Card x={360} y={1060} w={360} r={3} show={p(frame, donna + 30, 10)} size={38}>
          🎁 BIRTHDAY GIFT
        </Card>
        <Strings lines={[[290, 420, 540, 290], [790, 470, 540, 290]]} t={p(frame, donna + 10, 40)} />
      </Cam>
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The doll moves ─────────────────────────
export const Moves: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [arms, legs, room] = [cue.s(1), cue.s(2), cue.s(3)];
  const jump = frame >= room;
  return (
    <AbsoluteFill>
      <Still src={`${AI}room.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: jump ? 1.5 : 1.25, x: jump ? -60 : 0}} to={{s: jump ? 1.35 : 1.4, x: jump ? 40 : 0}} pos="52% 40%" />
      <Head at={arms} until={legs} top={200} size={90}>ARMS CROSSED</Head>
      <Head at={legs} until={room} top={200} size={90}>LEGS FOLDED</Head>
      <Head at={room} top={200} size={84}>
        <span style={{color: RED}}>A DIFFERENT ROOM</span>
      </Head>
      <AICREDIT />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The notes ─────────────────────────
export const Notes: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [scraps, help, lou] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame < scraps) {
    return (
      <AbsoluteFill>
        <Still src={`${AI}room.png`} t={p(frame, 0, scraps, (n) => n)} from={{s: 1.5, y: -760}} to={{s: 1.8, y: -1050}} pos="50% 80%" />
        <AICREDIT />
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.45]} />
<Stage>
      <Card x={110} y={360} w={460} r={-7} show={p(frame, help, 10)} bg="#e9dcb8" size={96}>
        help us
      </Card>
      <Card x={520} y={700} w={460} r={6} show={p(frame, lou, 10)} bg="#e9dcb8" size={96}>
        help Lou
      </Card>
      <Card x={300} y={170} w={480} r={1} show={p(frame, scraps, 10)} size={46}>
        PARCHMENT NOTES
      </Card>
      <Strings lines={[[340, 370, 750, 710]]} t={p(frame, lou + 6, 14)} />
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Lou ─────────────────────────
export const Lou: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [claimed, marks] = [cue.s(1), cue.s(2)];
  const scratch = p(frame, marks + 4, 20);
  return (
    <AbsoluteFill>
      <Board dim={0.15} />
<Stage>
      <Polaroid w={600} h={700} x={240} y={230} r={-3} show={p(frame, 0, 12)} caption="LOU">
        <Silh h={640} />
        {scratch > 0 ? (
          <svg width="100%" height="100%" viewBox="0 0 600 700" style={{position: 'absolute', inset: 0}}>
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M ${200 + k * 50} 360 L ${300 + k * 50} 560`} stroke={RED} strokeWidth={10} strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260 * (1 - Math.max(0, Math.min(1, scratch * 3 - k)))} style={{filter: `drop-shadow(0 0 8px ${RED})`}} />
            ))}
          </svg>
        ) : null}
      </Polaroid>
      <Card x={120} y={1010} w={420} r={-4} show={p(frame, claimed, 10)} size={40}>
        "COULDN'T MOVE"
      </Card>
      <Card x={560} y={1030} w={400} r={5} show={p(frame, marks, 10)} size={40} color={RED}>
        SCRATCH MARKS
      </Card>
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The medium ─────────────────────────
export const Medium: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [stay, mistake] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.4]} dim={0.1} />
<Stage>
      <Polaroid w={440} h={520} x={320} y={220} r={-2} show={p(frame, 2, 12)} caption="ANNABELLE HIGGINS, 7?">
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #fff4d0, #3a3028 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 300, color: '#2a2018', opacity: 0.85}}>?</div>
      </Polaroid>
      {/* candle */}
      <svg width={160} height={260} style={{position: 'absolute', left: 90, top: 860}}>
        <rect x={60} y={110} width={40} height={140} fill="#efe6cf" />
        <ellipse cx={80} cy={90 + Math.sin(frame / 3) * 3} rx={14 + Math.sin(frame / 2) * 2} ry={30} fill="#ffcf73" style={{filter: 'drop-shadow(0 0 20px #ffcf73)'}} />
      </svg>
      <Card x={540} y={900} w={400} r={4} show={p(frame, stay, 10)} size={44}>
        "LET HER STAY"
      </Card>
      {frame >= mistake ? <Stamp2 at={mistake + 6} x={540} y={680} size={80}>BIGGEST MISTAKE</Stamp2> : null}
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · The Warrens ─────────────────────────
export const Warrens: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const inhuman = cue.s(1);
  return (
    <AbsoluteFill>
      <Board />
<Stage>
      <Cam s={lerp(1, 1.08, p(frame, 0, cue.dur, (n) => n))}>
        <Polaroid w={460} h={520} x={70} y={220} r={-4} show={p(frame, 2, 12)} caption="ED WARREN">
          <Silh h={470} />
        </Polaroid>
        <Polaroid w={460} h={520} x={560} y={260} r={4} show={p(frame, 10, 12)} caption="LORRAINE">
          <Silh h={450} flip />
        </Polaroid>
        <Card x={260} y={930} w={560} r={-1} show={p(frame, 18, 10)} size={44}>
          PARANORMAL INVESTIGATORS
          <div style={{fontSize: 30, color: '#7a2a20'}}>(THE CONJURING)</div>
        </Card>
        {frame >= inhuman ? <Stamp2 at={inhuman + 4} x={540} y={560} size={110}>INHUMAN</Stamp2> : null}
      </Cam>
      <LightSweep at={inhuman} color="#ffcf9a" strength={0.25} />
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The brakes ─────────────────────────
export const Brakes: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const fail = cue.s(1);
  const flash = frame >= fail ? (Math.floor((frame - fail) / 6) % 2 ? 1 : 0.4) : 0;
  return (
    <AbsoluteFill>
      <Still src={`${AI}car.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, x: -80}} to={{s: 1.35, x: -140, y: -40}} pos="62% 60%" />
      {flash ? <AbsoluteFill style={{background: RED, mixBlendMode: 'screen', opacity: 0.18 * flash}} /> : null}
      <Head at={fail} top={200} size={100}>
        BRAKES <span style={{color: RED}}>FAILED</span>
      </Head>
      <AICREDIT />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The museum, the legend ─────────────────────────
export const Museum: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const legend = cue.s(1);
  if (frame >= legend) {
    return (
      <AbsoluteFill>
        <Board dim={0.2} />
<Stage>
        <Card x={250} y={200} w={580} r={-2} show={p(frame, legend, 10)} size={56}>
          LEGEND SAYS…
        </Card>
        <svg width={700} height={420} viewBox="0 0 700 420" style={{position: 'absolute', left: 190, top: 520, opacity: p(frame, legend + 6, 12)}}>
          <circle cx={170} cy={320} r={80} fill="none" stroke="#111" strokeWidth={22} />
          <circle cx={540} cy={320} r={80} fill="none" stroke="#111" strokeWidth={22} />
          <path d="M 170 320 L 300 200 L 420 200 L 540 320 M 300 200 L 260 130 L 330 120 M 420 200 L 470 150" stroke="#111" strokeWidth={20} fill="none" />
        </svg>
        <Stamp2 at={legend + 20} x={540} y={1060} size={80}>UNVERIFIED</Stamp2>
        </Stage>
<Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Still src={`${AI}case.png`} t={p(frame, 0, legend, (n) => n)} from={{s: 1.15, y: -120}} to={{s: 1.3, y: -260}} pos="44% 85%" />
      <Head at={6} top={200} size={78}>
        WARREN OCCULT MUSEUM
        <br />
        <span style={{color: RED, fontSize: 60}}>MONROE, CONNECTICUT</span>
      </Head>
      <AICREDIT />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The story cracks ─────────────────────────
export const Crack: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const c = p(frame, 6, 24);
  const pts = [[540, 0], [500, 260], [600, 470], [520, 720], [610, 980], [540, 1200], [580, 1920]];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y * c}`).join(' ');
  return (
    <AbsoluteFill>
      <Board />
<Stage>
      <AbsoluteFill style={{transform: `translateX(${-c * 30}px)`, clipPath: 'polygon(0 0, 52% 0, 48% 100%, 0 100%)'}}>
        <Card x={140} y={420} w={800} r={-2} size={70}>
          THE WARRENS' STORY
        </Card>
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${c * 30}px) rotate(${c * 1.5}deg)`, clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 48% 100%)'}}>
        <Card x={140} y={420} w={800} r={-2} size={70}>
          THE WARRENS' STORY
        </Card>
      </AbsoluteFill>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={d} stroke="#000" strokeWidth={14} fill="none" />
        <path d={d} stroke={RED} strokeWidth={4} fill="none" />
      </svg>
      <Head at={cue.w('crack')} top={760} size={110}>
        STARTS TO <span style={{color: RED}}>CRACK</span>
      </Head>
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · No evidence ─────────────────────────
export const NoEvidence: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [never, police, doctor, book] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const rows = [
    {at: never, t: 'PUBLIC INTERVIEW'},
    {at: police, t: 'POLICE REPORT'},
    {at: doctor, t: "DOCTOR'S RECORD"},
  ];
  return (
    <AbsoluteFill>
      <Board />
<Stage>
      <div style={{position: 'absolute', left: 120, top: 200, width: 840, background: PAPER, padding: '40px 50px', boxShadow: '0 20px 40px #000c', transform: 'rotate(-1.5deg)', boxSizing: 'border-box'}}>
        <div style={{fontFamily: DISPLAY, fontSize: 60, color: INK, borderBottom: '5px solid #15110c', marginBottom: 20}}>EVIDENCE CHECKLIST</div>
        {rows.map((r) => (
          <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 24, fontFamily: MARKER, fontSize: 56, color: INK, margin: '18px 0', opacity: frame >= r.at ? 1 : 0.25}}>
            <span style={{color: RED, fontSize: 72, width: 60, transform: `scale(${frame >= r.at ? lerp(2, 1, p(frame, r.at, 6)) : 1})`}}>{frame >= r.at ? '✗' : '☐'}</span>
            {r.t}
          </div>
        ))}
      </div>
      {frame >= book ? (
        <div style={{position: 'absolute', left: 290, top: 820, width: 500, height: 420, background: 'linear-gradient(135deg, #1a1a1a, #3a1010)', border: '6px solid #c9a24a', boxShadow: '0 20px 40px #000', transform: `rotate(3deg) scale(${lerp(1.3, 1, p(frame, book, 10))})`, opacity: p(frame, book, 8), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 60, color: '#c9a24a', letterSpacing: 2}}>THE DEMONOLOGIST</div>
          <div style={{fontFamily: MARKER, fontSize: 40, color: PAPER, marginTop: 14}}>1980 · the Warrens' side</div>
        </div>
      ) : null}
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Science: pareidolia ─────────────────────────
export const Science: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [pare, sugg, creak] = [cue.s(1), cue.s(2), cue.s(3)];
  const face = p(frame, pare + 10, 30);
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.4]} />
<Stage>
      <Head at={0} until={pare} top={200} size={100}>
        WHAT DOES <span style={{color: RED}}>SCIENCE</span> SAY?
      </Head>
      {frame >= pare ? (
        <>
          <Card x={240} y={180} w={600} r={-1} show={p(frame, pare, 10)} size={66}>
            PAREIDOLIA
            <div style={{fontSize: 30}}>seeing faces where there are none</div>
          </Card>
          {/* an electrical outlet that "becomes" a face */}
          <div style={{position: 'absolute', left: 340, top: 520, width: 400, height: 520, background: '#efe9dc', borderRadius: 30, boxShadow: '0 20px 40px #000c'}}>
            <svg width={400} height={520}>
              <rect x={150} y={150} width={24} height={70} rx={6} fill="#222" />
              <rect x={226} y={150} width={24} height={70} rx={6} fill="#222" />
              <path d="M 160 330 Q 200 360 240 330 L 240 360 Q 200 390 160 360 Z" fill="#222" />
              <path d={`M 140 ${150 - face * 30} L 190 ${140 - face * 14}`} stroke={RED} strokeWidth={8} opacity={face} />
              <path d={`M 260 ${150 - face * 30} L 210 ${140 - face * 14}`} stroke={RED} strokeWidth={8} opacity={face} />
            </svg>
          </div>
        </>
      ) : null}
      {frame >= sugg ? <Stamp2 at={sugg} x={540} y={1150} size={80} r={-4}>+ SUGGESTION</Stamp2> : null}
      {frame >= creak ? (
        <div style={{position: 'absolute', left: 80, top: 1060, fontFamily: MARKER, fontSize: 44, color: PAPER, transform: 'rotate(-6deg)', opacity: p(frame, creak, 10)}}>creak = "proof"</div>
      ) : null}
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The 2025 tour ─────────────────────────
export const Tour: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const july = cue.s(1);
  return (
    <AbsoluteFill>
      <Board dim={frame >= july ? 0.2 : 0} />
<Stage>
      <Card x={160} y={180} w={760} r={-2} show={p(frame, 2, 10)} size={70} bg="#1a1a1a" color={RED}>
        DEVILS ON THE RUN
        <div style={{fontSize: 40, color: PAPER}}>TOUR · 2025</div>
      </Card>
      {/* simple US route with stops */}
      <svg width={W} height={700} style={{position: 'absolute', top: 470}}>
        <path d={`M 120 520 Q 300 300 520 380 T 900 200`} stroke={RED} strokeWidth={6} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - p(frame, 8, 50))} />
        {[[120, 520], [520, 380], [900, 200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={16} fill={RED} opacity={p(frame, 8 + i * 16, 8)} />)}
      </svg>
      {frame >= july ? (
        <>
          <Card x={560} y={430} w={420} r={4} show={p(frame, july, 10)} size={42}>
            GETTYSBURG, PA
            <div style={{fontSize: 32}}>JULY 13, 2025</div>
          </Card>
          <Polaroid w={340} h={380} x={110} y={600} r={-5} show={p(frame, july + 10, 12)} caption="DAN RIVERA, 54">
            <Silh h={380} />
          </Polaroid>
        </>
      ) : null}
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The coroner ─────────────────────────
export const Coroner: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [natural, heart, room] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Board />
<Stage>
      <Head at={0} until={natural} top={200} size={90}>
        THE INTERNET BLAMED <span style={{color: RED}}>ANNABELLE</span>
      </Head>
      {frame >= natural ? (
        <div style={{position: 'absolute', left: 120, top: 200, width: 840, background: PAPER, padding: '40px 50px', boxShadow: '0 20px 40px #000c', transform: `rotate(1deg) translateY(${lerp(200, 0, p(frame, natural, 12))}px)`, boxSizing: 'border-box'}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 36, color: '#5a3a1a'}}>ADAMS COUNTY CORONER · 2025</div>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 44, color: INK, marginTop: 30, lineHeight: 1.5}}>
            MANNER: <span style={{color: RED}}>NATURAL</span>
            <br />
            CAUSE: {frame >= heart ? 'CARDIAC-RELATED' : '…'}
            <br />
            {frame >= heart ? 'KNOWN HEART HISTORY' : ''}
          </div>
        </div>
      ) : null}
      {frame >= room ? <Stamp2 at={room + 4} x={540} y={900} size={70}>DOLL NOT IN THE ROOM</Stamp2> : null}
      <LightSweep at={natural} color="#ffffff" strength={0.25} />
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Payoff ─────────────────────────
export const Payoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [story, billions, locked] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}case.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.05, x: 60}} to={{s: 1.35, x: 140}} pos="16% 50%" />
      <Head at={0} until={story} top={170} size={90}>
        MOST <span style={{color: RED}}>HAUNTED</span> DOLL?
      </Head>
      <Head at={story} until={billions} top={170} size={84}>
        OR THE MOST SUCCESSFUL <span style={{color: RED}}>GHOST STORY?</span>
      </Head>
      <Head at={billions} until={locked} top={170} size={96}>
        A <span style={{color: RED}}>BILLION-DOLLAR</span> HORROR UNIVERSE
      </Head>
      <Head at={locked} top={170} size={110}>
        STILL <span style={{color: RED}}>LOCKED</span>
      </Head>
      <AICREDIT />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · CTA ─────────────────────────
export const CTA: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [comment, cta] = [cue.s(1), cue.s(2)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Still src={`${AI}room.png`} t={p(frame, 0, cta, (n) => n)} from={{s: 1.3}} to={{s: 1.45}} pos="52% 40%" />
        <Head at={0} top={180} size={100}>
          WOULD YOU KEEP HER
          <br />
          <span style={{color: RED}}>IN YOUR HOUSE?</span>
        </Head>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </div>
        ) : null}
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
<Stage>
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="annabelle/cta/room1046.jpg" w={620} h={720} x={230} y={300} r={-2} show={p(frame, cta + 4, 12)} caption="ROOM 1046" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      </Stage>
<Grain />
    </AbsoluteFill>
  );
};

export const _r = rnd;
