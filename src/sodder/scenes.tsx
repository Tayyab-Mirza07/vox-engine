import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd} from '../lib';
import {has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'sodder/ai/';
const PH = 'sodder/photos/';
const CR: Record<string, string> = {
  'courtst.jpg': 'Court Street, Fayetteville WV · A.E. Crane · Wikimedia Commons',
  'fayetteville.jpg': 'Fayetteville Historic District · Antony-22 · CC BY-SA 4.0',
  'mussolini.jpg': 'Benito Mussolini · public domain',
  'smithsonian.jpg': 'Smithsonian Castle · ThatOtherGuy1985 · CC0',
};
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
/** Glowing embers drifting up. */
const Embers: React.FC<{n?: number; color?: string}> = ({n = 40, color = '#ffb050'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const sp = 2 + rnd(i) * 5;
        const y = 1920 - ((frame * sp + rnd(i + 3) * 1920) % 2100);
        const x = rnd(i + 7) * W + Math.sin(frame / 15 + i) * 30;
        const s = 3 + rnd(i + 11) * 6;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, boxShadow: `0 0 ${s * 3}px ${color}`, opacity: 0.4 + rnd(i + 5) * 0.6}} />;
      })}
    </AbsoluteFill>
  );
};
const FireFlicker: React.FC<{strength?: number}> = ({strength = 0.25}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: '#ff6a00', mixBlendMode: 'overlay', opacity: strength * (0.6 + 0.4 * Math.sin(frame / 2.3) * Math.sin(frame / 3.7)), pointerEvents: 'none'}} />;
};
/** Child silhouette card (no real photos of the children). */
const Kid: React.FC<{h: number}> = ({h}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'linear-gradient(180deg, #8a7a66, #2a221a)'}}>
    <Person h={h} color="#120d08" />
  </div>
);
const PhotoBg: React.FC<{n: string; t: number; fb: string; pos?: string; fpos?: string; from?: {s?: number; x?: number; y?: number}; to?: {s?: number; x?: number; y?: number}}> = ({n, t, fb, pos, fpos, from, to}) => {
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
const lin = (n: number) => n;

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [house, ashes, bone] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}fire.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.5, x: -40}} to={{s: 1.15, x: 0}} pos="45% 40%" />
      <FireFlicker strength={frame < ashes ? 0.3 : 0.1} />
      <Embers />
      {frame >= ashes ? <AbsoluteFill style={{background: '#000', opacity: 0.45 * p(frame, ashes, 12)}} /> : null}
      <Head at={0} until={house} top={170} size={104}>
        CHRISTMAS EVE <span style={{color: '#ffb050'}}>1945</span>
      </Head>
      <Head at={house} until={ashes} top={170} size={110}>
        <span style={{color: RED}}>5 CHILDREN</span> INSIDE
      </Head>
      <Head at={ashes} top={170} size={120}>
        NO <span style={{color: RED}}>BODIES</span>
      </Head>
      {frame >= bone ? <Stamp2 at={bone} x={540} y={960} size={100} color="#ff3b4f" solid>NOT A SINGLE BONE</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Home ─────────────────────────
export const Home: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [fam, night] = [cue.s(1), cue.s(2)];
  if (frame < fam) {
    return (
      <AbsoluteFill>
        <PhotoBg n="courtst.jpg" t={p(frame, 0, fam, lin)} from={{s: 1.1}} to={{s: 1.25}} fb="fire.png" />
        <Head at={4} top={170} size={86}>
          FAYETTEVILLE, <span style={{color: '#ffd76a'}}>WEST VIRGINIA</span>
        </Head>
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.3]} />
      <Stage>
        <Card x={90} y={170} w={900} r={-1} show={p(frame, fam, 10)} size={56}>
          GEORGE & JENNIE SODDER
        </Card>
        <Card x={360} y={350} w={360} r={3} show={p(frame, fam + 14, 10)} size={46}>
          10 CHILDREN
        </Card>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
          <div key={k} style={{position: 'absolute', left: 130 + (k % 5) * 170 + (k >= 5 ? 85 : 0), top: 540 + Math.floor(k / 5) * 230, width: 150, height: 210, opacity: p(frame, fam + 20 + k * 3, 6), transform: `rotate(${(rnd(k) - 0.5) * 8}deg)`, background: PAPER, padding: 8, boxSizing: 'border-box', boxShadow: '0 10px 18px #000a'}}>
            <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
              <Kid h={120 + rnd(k + 2) * 60} />
            </div>
          </div>
        ))}
        {frame >= night ? (
          <Card x={240} y={980} w={600} r={-2} show={p(frame, night, 10)} size={44} bg="#2a4a2a" color="#fff">
            🎄 CHRISTMAS EVE · STAYING UP LATE
          </Card>
        ) : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · The call ─────────────────────────
export const Call: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [jen, woman, bg, dead] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const ring = frame < jen && Math.floor(frame / 4) % 2 === 0;
  return (
    <AbsoluteFill>
      <Still src={`${AI}phone.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.25, x: -40}} to={{s: 1.6, x: -60}} pos={frame >= woman ? '84% 50%' : '70% 50%'} />
      <AbsoluteFill style={{transform: ring ? 'translateX(3px)' : 'none'}} />
      <Head at={2} until={woman} top={170} size={130}>
        <span style={{color: '#ffd76a'}}>12:30</span> AM
      </Head>
      <Head at={woman} until={bg} top={170} size={80}>
        A NAME SHE <span style={{color: RED}}>DIDN'T KNOW</span>
      </Head>
      <Head at={bg} top={170} size={76}>
        LAUGHTER… <span style={{color: '#ffd76a'}}>CLINKING GLASSES</span>
      </Head>
      {frame >= dead ? <Stamp2 at={dead} x={540} y={1000} size={86} solid>CLICK.</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Fire ─────────────────────────
export const Fire: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const fire = cue.s(1);
  return (
    <AbsoluteFill>
      {frame < fire ? (
        <Still src={`${AI}phone.png`} t={p(frame, 0, fire, lin)} from={{s: 1.4}} to={{s: 1.5}} pos="30% 50%" />
      ) : (
        <Still src={`${AI}fire.png`} t={p(frame, fire, cue.dur - fire, lin)} from={{s: 1.8, x: -120}} to={{s: 1.5, x: -120}} pos="55% 35%" />
      )}
      {frame < fire ? <AbsoluteFill style={{background: 'linear-gradient(0deg, #ff6a0055, transparent 60%)', opacity: p(frame, 0, fire, lin)}} /> : <FireFlicker strength={0.35} />}
      {frame >= fire ? <Embers n={60} /> : null}
      <Head at={2} until={fire} top={170} size={120}>
        1:00 AM
      </Head>
      <Head at={fire} top={170} size={130}>
        <span style={{color: '#ff7a1a'}}>FIRE</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Five still upstairs ─────────────────────────
const FIVE = [
  {n: 'MAURICE', a: 14},
  {n: 'MARTHA', a: 12},
  {n: 'LOUIS', a: 9},
  {n: 'JENNIE', a: 8},
  {n: 'BETTY', a: 5},
];
export const Upstairs: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [five, names] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board dim={0.1} />
      <FireFlicker strength={0.15} />
      <Stage>
        <Card x={140} y={160} w={380} r={-3} show={p(frame, 2, 10)} size={46}>
          ESCAPED: 6
        </Card>
        <Card x={560} y={160} w={380} r={3} show={p(frame, five, 10)} size={46} bg={RED} color="#fff">
          UPSTAIRS: 5
        </Card>
        {FIVE.map((c, k) => {
          const x = [120, 400, 680, 260, 540][k];
          const y = [360, 360, 360, 690, 690][k];
          const at = names + k * 14;
          return (
            <Polaroid key={c.n} w={240} h={230} x={x} y={y} r={(k % 2 ? 1 : -1) * (2 + k)} show={p(frame, frame >= names ? at : five + k * 4, 10)} caption={frame >= at ? `${c.n}, ${c.a}` : '?'}>
              <Kid h={110 + c.a * 6} />
            </Polaroid>
          );
        })}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Ladder & trucks ─────────────────────────
export const Ladder: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [gone, trucks, start, worked] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}trucks.png`} t={p(frame, 0, cue.dur, lin)} from={{s: frame < trucks ? 1.5 : 1.2, x: frame < trucks ? -200 : 0}} to={{s: frame < trucks ? 1.6 : 1.4, x: frame < trucks ? -220 : 40}} pos={frame < trucks ? '85% 50%' : '38% 50%'} />
      <FireFlicker strength={0.2} />
      <Head at={2} until={trucks} top={170} size={110}>
        THE <span style={{color: '#ffd76a'}}>LADDER</span>
      </Head>
      {frame >= gone && frame < trucks ? <Stamp2 at={gone} x={540} y={900} size={120} solid>GONE</Stamp2> : null}
      <Head at={trucks} until={worked} top={170} size={100}>
        2 TRUCKS
      </Head>
      {frame >= start && frame < worked ? <Stamp2 at={start} x={540} y={980} size={84} solid>WOULDN'T START</Stamp2> : null}
      <Head at={worked} top={170} size={80}>
        BOTH WORKED <span style={{color: RED}}>THE DAY BEFORE</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Nobody came ─────────────────────────
const Clock: React.FC<{h: number; size?: number}> = ({h, size = 380}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200">
    <circle r={94} fill={PAPER} stroke={INK} strokeWidth={6} />
    {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-80} x2={0} y2={-70} stroke={INK} strokeWidth={4} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-45} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${h * 30})`} />
    <line x1={0} y1={0} x2={0} y2={-70} stroke={RED} strokeWidth={4} strokeLinecap="round" transform={`rotate(${(h % 1) * 360})`} />
    <circle r={6} fill={INK} />
  </svg>
);
export const NobodyCame: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [drove, nobody] = [cue.s(1), cue.s(2)];
  const h = lerp(1, 8, p(frame, nobody, cue.dur - nobody - 6));
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={140} y={170} w={380} r={-3} show={p(frame, 2, 10)} size={48}>
          📞 PHONE: DEAD
        </Card>
        <Card x={560} y={190} w={400} r={3} show={p(frame, drove, 10)} size={40}>
          A NEIGHBOR DRIVES FOR HELP
        </Card>
        <div style={{position: 'absolute', left: 350, top: 420, opacity: p(frame, 4, 10), filter: 'drop-shadow(0 16px 20px #000a)'}}>
          <Clock h={h} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', fontFamily: DISPLAY, fontSize: 90, color: '#fff', textShadow: '0 6px 0 #000'}}>
          {Math.floor(h)}:00 AM
        </div>
        {frame >= nobody + 30 ? <Stamp2 at={nobody + 30} x={540} y={1050} size={64} solid>FIRE TRUCKS ARRIVE: 8 AM</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Ash (rehook) ─────────────────────────
export const Ash: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const sense = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}fire.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.3}} to={{s: 1.5}} pos="52% 40%" />
      <AbsoluteFill style={{background: '#777', mixBlendMode: 'color'}} />
      <AbsoluteFill style={{background: '#000', opacity: 0.55}} />
      <Embers n={50} color="#bbbbbb" />
      <Head at={2} until={sense} top={170} size={110}>
        ONLY <span style={{color: '#aaa'}}>ASH</span>
      </Head>
      <Head at={sense} top={170} size={92}>
        NOTHING MADE <span style={{color: RED}}>SENSE</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · No remains ─────────────────────────
export const NoRemains: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [bones, teeth, nothing, official] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const rows = [
    {at: bones, t: 'BONES'},
    {at: teeth, t: 'TEETH'},
    {at: nothing, t: 'REMAINS'},
  ];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <div style={{position: 'absolute', left: 140, top: 250, width: 800, background: PAPER, padding: '30px 40px', boxSizing: 'border-box', boxShadow: '0 20px 40px #000c', transform: 'rotate(-1deg)', opacity: p(frame, 2, 10)}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: '#5a3a1a'}}>SEARCH OF THE RUINS · DEC 25, 1945</div>
          {rows.map((r) => (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: DISPLAY, fontSize: 80, color: INK, marginTop: 14, opacity: frame >= r.at ? 1 : 0.15}}>
              <span>{r.t}</span>
              <span style={{color: RED, transform: `scale(${frame >= r.at ? lerp(2, 1, p(frame, r.at, 6)) : 1})`}}>✗</span>
            </div>
          ))}
        </div>
        <Card x={200} y={860} w={680} r={2} show={p(frame, official, 10)} size={46}>
          OFFICIAL: "THE FIRE BURNED THEM AWAY"
        </Card>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Crematorium comparison ─────────────────────────
export const Compare: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const crem = cue.s(1);
  const bar = (at: number, w: number, color: string, label: string, sub: string, y: number) => (
    <div style={{position: 'absolute', left: 120, top: y, width: 840, opacity: p(frame, at, 8)}}>
      <div style={{fontFamily: MARKER, fontSize: 46, color: '#fff', textShadow: '0 3px 0 #000'}}>{label}</div>
      <div style={{marginTop: 12, height: 90, width: w * p(frame, at + 4, 30), background: color, boxShadow: `0 0 30px ${color}`, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box', fontFamily: DISPLAY, fontSize: 52, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden'}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <Stage>
        {bar(2, 260, '#ff7a1a', 'HOUSE FIRE', '~1 HOUR', 300)}
        {bar(crem, 840, RED, 'CREMATORIUM', '2–3 HOURS · FAR HOTTER', 580)}
        {frame >= crem + 40 ? <Stamp2 at={crem + 40} x={540} y={1000} size={84} solid>BONES STILL REMAIN</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Clues ─────────────────────────
export const Clues: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ladder, line, cut] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={260} y={190} w={560} r={-1} show={p(frame, 2, 10)} size={56}>
          THE CLUES
        </Card>
        <Polaroid src={`${AI}trucks.png`} w={420} h={340} x={100} y={400} r={-4} show={p(frame, ladder, 12)} caption="THE LADDER" pos="88% 50%" gray={0.5} />
        <Card x={150} y={860} w={360} r={2} show={p(frame, ladder + 18, 10)} size={34}>
          FOUND FAR DOWN AN EMBANKMENT
        </Card>
        <Polaroid src={`${AI}phone.png`} w={400} h={340} x={570} y={430} r={4} show={p(frame, line, 12)} caption="PHONE LINE" pos="84% 50%" gray={0.5} />
        {frame >= cut ? <Stamp2 at={cut} x={770} y={930} size={110} solid>CUT</Stamp2> : null}
        <Strings lines={[[310, 410, 770, 440]]} t={p(frame, line + 10, 20)} />
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The threat ─────────────────────────
export const Threat: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const muss = cue.s(1);
  const quote = 'YOUR HOUSE WILL GO UP IN SMOKE… AND YOUR CHILDREN WILL BE DESTROYED.';
  const shown = Math.floor(quote.length * p(frame, 30, Math.max(10, muss - 40), lin));
  const m = real('mussolini.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={140} y={150} w={500} r={-3} show={p(frame, 2, 10)} size={40}>
          MONTHS EARLIER · A SALESMAN
        </Card>
        <div style={{position: 'absolute', left: 120, top: 300, width: 840, background: PAPER, padding: '36px 44px', boxSizing: 'border-box', boxShadow: '0 20px 40px #000c', transform: 'rotate(1deg)', opacity: p(frame, 20, 10)}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 50, color: RED, lineHeight: 1.3, minHeight: 200}}>"{quote.slice(0, shown)}</div>
        </div>
        {frame >= muss ? (
          <Polaroid src={m ?? undefined} w={360} h={420} x={560} y={620} r={4} show={p(frame, muss, 12)} caption="MUSSOLINI" gray={1} pos="50% 25%">
            {!m ? <Kid h={300} /> : null}
          </Polaroid>
        ) : null}
        <Card x={120} y={760} w={400} r={-2} show={p(frame, muss + 10, 10)} size={38}>
          GEORGE HAD CRITICIZED HIM
        </Card>
      </Stage>
      {frame >= muss && m ? <Credit t={CR['mussolini.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Taken (rehook) ─────────────────────────
export const Taken: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [didnt, taken] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: '#06070a'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2a2f3a, #000 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 40}}>
        {FIVE.map((c, k) => (
          <div key={c.n} style={{position: 'relative', width: 150, height: 520, opacity: frame >= taken ? Math.max(0, 1 - p(frame, taken + k * 5, 18)) : p(frame, 4 + k * 4, 10)}}>
            <AbsoluteFill style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
              <Person h={260 + c.a * 14} color="#000" rim="#6a7a9a" />
            </AbsoluteFill>
          </div>
        ))}
      </div>
      <Head at={2} until={didnt} top={190} size={84}>
        THE SODDERS <span style={{color: '#9fc0ff'}}>BELIEVED…</span>
      </Head>
      <Head at={didnt} until={taken} top={190} size={84}>
        THEY DIDN'T DIE <span style={{color: '#ffb050'}}>IN THE FIRE</span>
      </Head>
      <Head at={taken} top={190} size={130}>
        THEY WERE <span style={{color: RED}}>TAKEN</span>
      </Head>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Smithsonian ─────────────────────────
export const Smithsonian: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [tested, older] = [cue.s(1), cue.s(2)];
  const sm = real('smithsonian.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={130} y={160} w={400} r={-3} show={p(frame, 2, 10)} size={56}>
          1949 DIG
        </Card>
        <Card x={570} y={170} w={380} r={3} show={p(frame, 14, 10)} size={38}>
          A FEW BONE FRAGMENTS
        </Card>
        <Polaroid src={sm ?? undefined} w={760} h={420} x={160} y={340} r={-1} show={p(frame, tested, 12)} caption="SMITHSONIAN TEST" gray={0.2}>
          {!sm ? <Kid h={300} /> : null}
        </Polaroid>
        <Card x={130} y={900} w={420} r={-2} show={p(frame, older, 10)} size={36}>
          OLDER THAN ANY OF THE CHILDREN
        </Card>
        {frame >= older + 40 ? <Stamp2 at={older + 40} x={760} y={970} size={70} solid>NEVER BURNED</Stamp2> : null}
      </Stage>
      {sm && frame >= tested ? <Credit t={CR['smithsonian.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Billboard ─────────────────────────
export const Billboard: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const decades = cue.s(1);
  const fy = real('fayetteville.jpg');
  return (
    <AbsoluteFill>
      {fy ? <Still src={fy} t={p(frame, 0, cue.dur, lin)} from={{s: 1.2}} to={{s: 1.3}} flicker={false} /> : <AbsoluteFill style={{background: 'linear-gradient(180deg, #3a4a6a, #c08a5a)'}} />}
      <AbsoluteFill style={{background: '#000', opacity: 0.45}} />
      <div style={{position: 'absolute', left: 60, top: 420, width: 960, transform: `scale(${lerp(0.9, 1, p(frame, 2, 14))})`, opacity: p(frame, 2, 10)}}>
        <div style={{background: '#f4f0e4', border: '14px solid #3a2a1a', padding: '24px 30px', boxSizing: 'border-box', boxShadow: '0 30px 60px #000'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 62, color: INK, textAlign: 'center', lineHeight: 1.05}}>WHAT HAPPENED TO THE SODDER CHILDREN?</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20}}>
            {FIVE.map((c) => (
              <div key={c.n} style={{width: 160, textAlign: 'center'}}>
                <div style={{position: 'relative', width: 160, height: 190, overflow: 'hidden', border: '4px solid #3a2a1a'}}>
                  <Kid h={100 + c.a * 6} />
                </div>
                <div style={{fontFamily: MARKER, fontSize: 28, color: INK, marginTop: 6}}>{c.n}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: RED, textAlign: 'center', marginTop: 14}}>REWARD</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{width: 30, height: 420, background: '#2a1d10'}} />
          <div style={{width: 30, height: 420, background: '#2a1d10'}} />
        </div>
      </div>
      <Head at={4} until={decades} top={190} size={84}>
        ROUTE 16 · <span style={{color: '#ffd76a'}}>FAYETTEVILLE</span>
      </Head>
      <Head at={decades} top={190} size={100}>
        IT STOOD <span style={{color: '#ffd76a'}}>UNTIL 1989</span>
      </Head>
      <Credit t={fy ? `Billboard: reconstruction · photo: ${CR['fayetteville.jpg']}` : 'Billboard: reconstruction'} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · The 1968 letter ─────────────────────────
export const Letter: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [photo, back, louis, frankie] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  if (frame < back) {
    return (
      <AbsoluteFill>
        <Still src={`${AI}letter.png`} t={p(frame, 0, back, lin)} from={{s: 1.3, x: 0}} to={{s: 1.6, x: frame >= photo ? -40 : 60}} pos={frame >= photo ? '47% 60%' : '33% 50%'} />
        <Head at={2} until={photo} top={170} size={130}>
          <span style={{color: '#ffd76a'}}>1968</span>
        </Head>
        <Head at={photo} top={170} size={84}>
          NO RETURN ADDRESS
        </Head>
        <AIC />
        <Grain />
      </AbsoluteFill>
    );
  }
  const ln = (at: number, t: string, size = 64) => (
    <div style={{fontFamily: MARKER, fontSize: size, color: '#1a2a6a', opacity: p(frame, at, 10), transform: `translateX(${(1 - p(frame, at, 10)) * -20}px)`}}>{t}</div>
  );
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.4]} />
      <Stage>
        <div style={{position: 'absolute', left: 150, top: 320, width: 780, height: 600, background: '#e9e0c8', boxShadow: '0 24px 40px #000c', transform: 'rotate(-2deg)', padding: '50px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 22}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 26, color: '#7a5a3a'}}>BACK OF PHOTO · POSTMARKED KENTUCKY</div>
          {ln(louis, 'Louis Sodder')}
          {ln(frankie, 'I love brother Frankie')}
          {ln(frankie + 20, 'Ilil Boys', 52)}
          {ln(frankie + 34, 'A90132 or 35', 52)}
        </div>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · The detective ─────────────────────────
export const Detective: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sent, never] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid w={360} h={440} x={120} y={170} r={-4} show={p(frame, 2, 12)} caption="LOUIS? · 1968" gray={1}>
          <Kid h={360} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 200, color: '#ffffffcc'}}>?</div>
        </Polaroid>
        <Polaroid w={340} h={400} x={600} y={300} r={4} show={p(frame, sent, 12)} caption="DETECTIVE">
          <Kid h={340} />
        </Polaroid>
        <Strings lines={[[300, 190, 770, 320]]} t={p(frame, sent + 10, 20)} />
        <Card x={560} y={790} w={400} r={2} show={p(frame, sent + 20, 10)} size={40}>
          → KENTUCKY
        </Card>
        {frame >= never ? <Stamp2 at={never} x={540} y={1020} size={72} solid>NEVER HEARD FROM AGAIN</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Ending + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [jennie, official, family, what, comment, cta] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5), cue.s(6)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        {frame < what ? (
          <>
            <Board dim={0.15} />
            <Stage>
              <Card x={140} y={170} w={380} r={-3} show={p(frame, 2, 10)} size={48}>
                GEORGE † 1969
              </Card>
              <Card x={560} y={190} w={380} r={3} show={p(frame, jennie, 10)} size={48} bg="#111" color="#fff">
                JENNIE † 1989
              </Card>
              <Card x={140} y={420} w={800} r={-1} show={p(frame, official, 10)} size={46}>
                OFFICIAL VERDICT: DIED IN THE FIRE
              </Card>
              {frame >= family ? <Stamp2 at={family} x={540} y={760} size={74} solid>FAMILY: NEVER BELIEVED IT</Stamp2> : null}
            </Stage>
          </>
        ) : (
          <>
            <Still src={`${AI}fire.png`} t={p(frame, what, cta - what, lin)} from={{s: 1.3, x: 60}} to={{s: 1.45, x: 80}} pos="27% 50%" />
            <AbsoluteFill style={{background: '#000', opacity: 0.35}} />
            <Head at={what} top={170} size={100}>
              WHAT <span style={{color: RED}}>HAPPENED?</span>
            </Head>
            {frame >= comment ? (
              <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
                <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
              </div>
            ) : null}
            <AIC />
          </>
        )}
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="sodder/cta/flight19.jpg" w={620} h={720} x={230} y={300} r={-2} show={p(frame, cta + 4, 12)} caption="FLIGHT 19" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      <LightSweep at={cta + 6} color="#ffe0b0" strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail (Shorts cover) ─────────────────────────
export const SodderThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${AI}fire.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 50%', filter: 'blur(18px) brightness(0.5)', transform: 'scale(1.1)'}} />
    <Img src={staticFile(`${AI}fire.png`)} style={{position: 'absolute', left: -330, top: 400, width: 2027, height: 1140, filter: 'contrast(1.15) saturate(1.2)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000f0 0%, #00000090 18%, transparent 30%, transparent 64%, #000000f0 86%)'}} />
    <div style={{position: 'absolute', top: 70, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 160, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #000'}}>
      5 KIDS
      <br />
      <span style={{color: RED}}>VANISHED</span>
    </div>
    <div style={{position: 'absolute', left: 560, top: 640, border: `10px solid #ff3b4f`, padding: '4px 24px', transform: 'rotate(-8deg)', fontFamily: DISPLAY, fontSize: 84, color: '#ff3b4f', background: '#000000b0'}}>NO BONES</div>
    <div style={{position: 'absolute', bottom: 330, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 92, lineHeight: 1, color: '#ffd76a', textShadow: '0 8px 0 #000'}}>NO BODIES. NOT ONE BONE.</div>
    <div style={{position: 'absolute', bottom: 230, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 60, color: '#fff', textShadow: '0 4px 0 #000'}}>The Sodder Children · 1945</div>
  </AbsoluteFill>
);
