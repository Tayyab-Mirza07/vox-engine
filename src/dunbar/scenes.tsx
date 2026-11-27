import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p} from '../lib';
import {Board, Card, Head, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'dunbar/ai/';
const PH = 'dunbar/photos/';
const CR = {
  twoboys: 'The Day Book, 18 Feb 1914 · public domain',
  bobby: 'The boy returned as Bobby Dunbar, 1913 · public domain',
  julia: 'Julia Anderson with her son Bruce · public domain',
};
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const lin = (n: number) => n;
const Dark: React.FC<{o?: number}> = ({o = 0.4}) => <AbsoluteFill style={{background: '#000', opacity: o}} />;
/** A photo shown whole on a blurred copy of itself (keeps old, oddly-shaped photos uncropped). */
const Framed: React.FC<{src: string; t: number; top?: number; h?: number; s0?: number; s1?: number}> = ({src, t, top = 380, h = 900, s0 = 1, s1 = 1.08}) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.35) sepia(0.4)', transform: 'scale(1.2)'}} />
    <div style={{position: 'absolute', left: 40, right: 40, top, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Img src={staticFile(src)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${lerp(s0, s1, t)})`, boxShadow: '0 30px 60px #000', filter: 'sepia(0.25) contrast(1.05)'}} />
    </div>
  </AbsoluteFill>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const dna = cue.s(1);
  return (
    <AbsoluteFill>
      <Framed src={`${PH}twoboys.jpg`} t={p(frame, 0, cue.dur, lin)} top={420} h={720} s0={1.05} s1={1.15} />
      <Head at={0} until={dna} top={170} size={96}>
        THEY GOT THEIR <span style={{color: '#ffd76a'}}>BOY BACK</span>
      </Head>
      <Head at={dna} top={170} size={100}>
        90 YEARS LATER: <span style={{color: RED}}>DNA</span>
      </Head>
      {frame >= dna + 30 ? <Stamp2 at={dna + 30} x={540} y={1180} size={96} solid>NOT THEIR SON</Stamp2> : null}
      <Credit t={CR.twoboys} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · The lake ─────────────────────────
export const Lake: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [boy, search] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}lake.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.5, x: 60}} to={{s: 1.75, x: 40}} pos="42% 60%" />
      <Dark o={0.25} />
      <Head at={2} until={boy} top={170} size={92}>
        AUGUST 1912 · <span style={{color: '#ffd76a'}}>LOUISIANA</span>
      </Head>
      <Head at={boy} until={search} top={170} size={96}>
        BOBBY DUNBAR, <span style={{color: '#ffd76a'}}>AGE 4</span>
      </Head>
      <Head at={search} top={170} size={86}>
        <span style={{color: RED}}>8 MONTHS</span> OF SEARCHING
      </Head>
      {frame >= boy ? <Stamp2 at={boy + 20} x={540} y={1050} size={100} solid>VANISHED</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Found ─────────────────────────
export const Found: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const ours = cue.s(1);
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={140} y={160} w={800} r={-1} show={p(frame, 2, 10)} size={46}>
          1913 · MISSISSIPPI
        </Card>
        <Polaroid src={`${PH}bobby1913.jpg`} w={860} h={500} x={110} y={320} r={-2} show={p(frame, 8, 12)} caption="FOUND WITH A WANDERING HANDYMAN" pos="40% 50%" gray={0.6} />
        {frame >= ours ? (
          <Card x={160} y={940} w={760} r={2} show={p(frame, ours, 10)} size={52} bg="#111" color="#fff">
            THE DUNBARS: "THAT'S OUR BOBBY"
          </Card>
        ) : null}
      </Stage>
      <Credit t={CR.bobby} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Julia ─────────────────────────
export const Julia: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [name, son] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Framed src={`${PH}julia.jpg`} t={p(frame, 0, cue.dur, lin)} top={360} h={880} />
      <Head at={2} until={name} top={170} size={86}>
        A POOR MOTHER · <span style={{color: '#ffd76a'}}>N. CAROLINA</span>
      </Head>
      <Head at={name} until={son} top={170} size={110}>
        <span style={{color: '#ffd76a'}}>JULIA ANDERSON</span>
      </Head>
      <Head at={son} top={170} size={96}>
        "THAT'S MY SON, <span style={{color: RED}}>BRUCE</span>"
      </Head>
      <Credit t={CR.julia} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Two mothers ─────────────────────────
export const Mothers: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [one, court] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}court.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.3}} to={{s: 1.5}} pos="55% 50%" />
      <Dark o={0.25} />
      <Head at={0} until={one} top={170} size={130}>
        <span style={{color: '#ffd76a'}}>2</span> MOTHERS
      </Head>
      <Head at={one} until={court} top={170} size={130}>
        <span style={{color: '#ffd76a'}}>1</span> BOY
      </Head>
      <Head at={court} top={170} size={100}>
        A COURT <span style={{color: RED}}>DECIDES</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The verdict ─────────────────────────
export const Verdict: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [handy, home] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Stamp2 at={4} x={540} y={300} size={96} solid>CUSTODY: DUNBARS</Stamp2>
        <Card x={140} y={500} w={800} r={-2} show={p(frame, handy, 10)} size={50}>
          HANDYMAN: CONVICTED OF KIDNAPPING
        </Card>
        <Polaroid src={`${PH}julia.jpg`} w={320} h={340} x={380} y={660} r={3} show={p(frame, home, 12)} caption="JULIA WENT HOME ALONE" pos="35% 30%" gray={1} />
      </Stage>
      {frame >= home ? <Credit t={CR.julia} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · He grew up ─────────────────────────
export const Grew: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const life = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${PH}bobby1913.jpg`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.9, x: 0}} to={{s: 2.2, x: 20}} pos="42% 55%" flicker={false} />
      <AbsoluteFill style={{background: '#3a2a10', mixBlendMode: 'color', opacity: 0.5}} />
      <Dark o={0.35} />
      <Head at={2} until={life} top={170} size={96}>
        HE GREW UP AS <span style={{color: '#ffd76a'}}>BOBBY</span>
      </Head>
      <Head at={life} top={170} size={90}>
        MARRIED · KIDS · <span style={{color: '#ffd76a'}}>† 1966</span>
      </Head>
      <Credit t={CR.bobby} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · DNA ─────────────────────────
const Helix: React.FC<{t: number}> = ({t}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={300} height={900} viewBox="0 0 300 900">
      {Array.from({length: 24}, (_, k) => {
        const y = 20 + k * 36;
        const ph = frame / 10 + k * 0.5;
        const x1 = 150 + Math.sin(ph) * 110;
        const x2 = 150 - Math.sin(ph) * 110;
        const vis = k / 24 < t ? 1 : 0.08;
        return (
          <g key={k} opacity={vis}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={k % 3 ? '#9fc0ff' : RED} strokeWidth={6} />
            <circle cx={x1} cy={y} r={10} fill="#e8ecff" />
            <circle cx={x2} cy={y} r={10} fill="#e8ecff" />
          </g>
        );
      })}
    </svg>
  );
};
export const Dna: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [result, not] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: '#04070d'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #10203a, #000 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
        <Helix t={p(frame, 4, Math.max(20, result - 4), lin)} />
      </div>
      <Head at={2} until={result} top={170} size={100}>
        2004 · <span style={{color: '#9fc0ff'}}>DNA TEST</span>
      </Head>
      <Head at={result} top={170} size={110}>
        THE <span style={{color: '#9fc0ff'}}>RESULT?</span>
      </Head>
      {frame >= not ? <Stamp2 at={not} x={540} y={800} size={110} solid>NOT A DUNBAR</Stamp2> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Ending (loops to the hook) ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const never = cue.s(1);
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <Framed src={`${PH}twoboys.jpg`} t={p(frame, 0, cue.dur, lin)} top={420} h={720} s0={1.1} s1={1.25} />
      <Head at={2} until={never} top={170} size={96}>
        HE WAS <span style={{color: '#ffd76a'}}>BRUCE ANDERSON</span>
      </Head>
      <Head at={never} top={170} size={86}>
        THE REAL BOBBY: <span style={{color: RED}}>NEVER FOUND</span>
      </Head>
      {frame >= never + 10 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center', opacity: p(frame, never + 10, 8), transform: `scale(${pulse})`}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 48, color: '#fff', background: '#e62117', padding: '10px 40px', borderRadius: 50, boxShadow: '0 10px 30px #000a'}}>FOLLOW FOR DAILY MYSTERIES</div>
        </div>
      ) : null}
      <Credit t={CR.twoboys} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail ─────────────────────────
export const DunbarThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${PH}twoboys.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.35) sepia(0.5)', transform: 'scale(1.2)'}} />
    <div style={{position: 'absolute', top: 70, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000'}}>
      SAME
      <br />
      <span style={{color: '#ffd76a'}}>BOY?</span>
    </div>
    <div style={{position: 'absolute', left: 30, right: 30, top: 480, display: 'flex', justifyContent: 'center'}}>
      <Img src={staticFile(`${PH}twoboys.jpg`)} style={{width: 1020, boxShadow: '0 30px 60px #000', filter: 'sepia(0.25) contrast(1.1)'}} />
    </div>
    <div style={{position: 'absolute', left: 520, top: 1080, border: '10px solid #ff3b4f', padding: '4px 24px', transform: 'rotate(-8deg)', fontFamily: DISPLAY, fontSize: 96, color: '#ff3b4f', background: '#000000c0'}}>DNA: NO</div>
    <div style={{position: 'absolute', bottom: 300, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 84, lineHeight: 1.05, color: '#fff', textShadow: '0 8px 0 #000'}}>
      THE WRONG CHILD <span style={{color: RED}}>CAME HOME</span>
    </div>
    <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 56, color: PAPER, textShadow: '0 4px 0 #000'}}>Bobby Dunbar · 1912</div>
    <div style={{position: 'absolute', bottom: 150, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: '#ffffff88'}}>Photo: The Day Book, 1914 · public domain</div>
  </AbsoluteFill>
);
