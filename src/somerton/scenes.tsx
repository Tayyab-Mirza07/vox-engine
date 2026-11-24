import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p} from '../lib';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'somerton/ai/';
const PH = 'somerton/photos/';
const PD = 'South Australia Police, 1948–49 · public domain';
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const lin = (n: number) => n;
const Dark: React.FC<{o?: number}> = ({o = 0.4}) => <AbsoluteFill style={{background: '#000', opacity: o}} />;
/** A photo shown whole on a blurred copy of itself. */
const Framed: React.FC<{src: string; t: number; top?: number; h?: number; s0?: number; s1?: number}> = ({src, t, top = 380, h = 900, s0 = 1, s1 = 1.08}) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.35)', transform: 'scale(1.2)'}} />
    <div style={{position: 'absolute', left: 40, right: 40, top, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${lerp(s0, s1, t)})`, filter: 'drop-shadow(0 30px 40px #000)'}} />
    </div>
  </AbsoluteFill>
);
const Slip: React.FC<{show: number; w?: number}> = ({show, w = 860}) => (
  <div style={{display: 'flex', justifyContent: 'center', opacity: show, transform: `scale(${lerp(1.3, 1, show)}) rotate(-2deg)`}}>
    <Img src={staticFile(`${PH}tamamshud.jpg`)} style={{width: w, boxShadow: '0 30px 60px #000', filter: 'contrast(1.1)'}} />
  </div>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [labels, pocket, words, finished] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}beach.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.9, x: 300}} to={{s: 1.6, x: 260}} pos="32% 70%" />
      <Dark o={frame >= words ? 0.6 : 0.25} />
      <Head at={0} until={labels} top={170} size={100}>
        A DEAD MAN <span style={{color: '#ffd76a'}}>ON A BEACH</span>
      </Head>
      <Head at={labels} until={pocket} top={170} size={96}>
        EVERY LABEL <span style={{color: RED}}>CUT OUT</span>
      </Head>
      <Head at={pocket} until={finished} top={170} size={96}>
        A <span style={{color: '#ffd76a'}}>SECRET POCKET</span>…
      </Head>
      <Head at={finished} top={170} size={96}>
        "IT IS <span style={{color: RED}}>FINISHED</span>"
      </Head>
      {frame >= words ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
          <Slip show={p(frame, words, 10)} />
        </div>
      ) : null}
      <Credit t={frame >= words ? `"Tamám Shud" slip · ${PD}` : 'AI illustration · dramatization'} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · The beach ─────────────────────────
export const Beach: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [where, man, a, b, c] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  return (
    <AbsoluteFill>
      <Framed src={`${PH}site.jpg`} t={p(frame, 0, cue.dur, lin)} top={360} h={620} />
      <Head at={2} until={where} top={170} size={100}>
        DEC 1, <span style={{color: '#ffd76a'}}>1948</span>
      </Head>
      <Head at={where} top={170} size={86}>
        SOMERTON BEACH · <span style={{color: '#ffd76a'}}>ADELAIDE</span>
      </Head>
      {frame >= man ? <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: MARKER, fontSize: 40, color: '#fff', textShadow: '0 3px 0 #000', opacity: p(frame, man, 8)}}>X = where he was found</div> : null}
      {[a, b, c].map((at, k) =>
        frame >= at ? (
          <Stamp2 key={k} at={at} x={[300, 760, 540][k]} y={[1040, 1040, 1160][k]} size={74} r={[-8, 6, -4][k]} solid>
            {['NO WALLET', 'NO ID', 'NO NAME'][k]}
          </Stamp2>
        ) : null,
      )}
      <Credit t={`Death site · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Poison? ─────────────────────────
export const Poison: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [susp, none] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={`${PH}man.jpg`} w={520} h={640} x={280} y={170} r={-2} show={p(frame, 2, 12)} caption="THE SOMERTON MAN" gray={1} pos="50% 30%" />
        <Card x={110} y={900} w={460} r={-3} show={p(frame, susp, 10)} size={46}>
          SUSPECTED: POISON ☠
        </Card>
        {frame >= none ? <Stamp2 at={none} x={760} y={960} size={80} solid>NONE FOUND</Stamp2> : null}
      </Stage>
      <Credit t={`Police photograph · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The shoes ─────────────────────────
export const Shoes: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const sand = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}beach.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 2.0, x: 0}} to={{s: 2.3, x: 0}} pos="24% 64%" />
      <Dark o={0.3} />
      <Head at={2} until={sand} top={170} size={92}>
        HIS SHOES: <span style={{color: '#ffd76a'}}>POLISHED</span>
      </Head>
      <Head at={sand} top={170} size={92}>
        …ON A <span style={{color: RED}}>SANDY BEACH?</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Sent around the world ─────────────────────────
export const World: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const nobody = cue.s(1);
  const places = ['AUSTRALIA', 'BRITAIN', 'USA', 'NEW ZEALAND'];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={`${PH}man.jpg`} w={380} h={460} x={350} y={170} r={2} show={p(frame, 2, 10)} caption="UNKNOWN MAN" gray={1} pos="50% 30%" />
        {places.map((n, k) => (
          <Card key={n} x={[90, 660, 90, 660][k]} y={[700, 700, 860, 860][k]} w={330} r={(k % 2 ? 1 : -1) * 3} show={p(frame, 8 + k * 8, 10)} size={38}>
            🔍 {n}
          </Card>
        ))}
        <Strings lines={[[540, 640, 255, 700], [540, 640, 825, 700], [540, 640, 255, 860], [540, 640, 825, 860]]} t={p(frame, 10, 30)} />
        {frame >= nobody ? <Stamp2 at={nobody} x={540} y={1080} size={90} solid>NO MATCH</Stamp2> : null}
      </Stage>
      <Credit t={`Police photograph · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Rehook ─────────────────────────
export const Strange: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #2a0a0e, #000 65%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: DISPLAY, fontSize: 520, color: RED, opacity: p(frame, 4, 10), transform: `scale(${lerp(0.85, 1.05, p(frame, 0, cue.dur, lin))})`, textShadow: '0 0 60px #000'}}>?</div>
      <Head at={2} top={220} size={96}>
        THEN IT GOT <span style={{color: RED}}>STRANGE</span>
      </Head>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The suitcase ─────────────────────────
export const Suitcase: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cut, again] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Framed src={`${PH}suitcase.jpg`} t={p(frame, 0, cue.dur, lin)} top={360} h={820} />
      <Head at={2} until={cut} top={170} size={86}>
        JAN 1949 · <span style={{color: '#ffd76a'}}>HIS SUITCASE</span>
      </Head>
      <Head at={cut} top={170} size={92}>
        EVERY LABEL <span style={{color: RED}}>CUT OFF</span>
      </Head>
      {frame >= again ? <Stamp2 at={again} x={540} y={1080} size={120} solid>AGAIN.</Stamp2> : null}
      <Credit t={`The suitcase · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · The slip ─────────────────────────
export const SlipScene: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [two, words] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board dim={0.15} />
      <Stage>
        <Card x={160} y={170} w={760} r={-1} show={p(frame, 2, 10)} size={44}>
          HIDDEN IN A SECRET TROUSER POCKET
        </Card>
        <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${frame >= words ? 1 : lerp(0.4, 0.55, p(frame, two, 10))})`, opacity: p(frame, 8, 10)}}>
          <Slip show={1} w={900} />
        </div>
        {frame >= words ? (
          <Card x={220} y={900} w={640} r={2} show={p(frame, words + 8, 10)} size={46} bg="#111" color="#fff">
            PERSIAN: "IT IS FINISHED"
          </Card>
        ) : null}
      </Stage>
      <Credit t={`"Tamám Shud" slip · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The book ─────────────────────────
export const Book: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [man, car] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}book.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.5, x: 40}} to={{s: 1.8, x: 60}} pos="45% 55%" />
      <Dark o={0.25} />
      <Head at={2} until={man} top={170} size={80}>
        THE RUBAIYAT · <span style={{color: '#ffd76a'}}>PERSIAN POEMS</span>
      </Head>
      <Head at={man} until={car} top={170} size={86}>
        A MAN BRINGS IN <span style={{color: '#ffd76a'}}>THE COPY</span>
      </Head>
      <Head at={car} top={170} size={90}>
        FOUND IN <span style={{color: RED}}>HIS CAR</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The code ─────────────────────────
export const Code: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cover, code] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      {frame < cover ? (
        <>
          <Still src={`${AI}book.png`} t={p(frame, 0, cover, lin)} from={{s: 2.2, x: -40}} to={{s: 2.5, x: -60}} pos="62% 50%" />
          <Dark o={0.3} />
          <Head at={2} top={170} size={92}>
            LAST PAGE: <span style={{color: RED}}>TORN OUT</span>
          </Head>
          <AIC />
        </>
      ) : (
        <>
          <Framed src={`${PH}code.jpg`} t={p(frame, cover, cue.dur - cover, lin)} top={360} h={780} />
          <Head at={cover} top={170} size={86}>
            PRESSED INTO <span style={{color: '#ffd76a'}}>THE BACK COVER</span>
          </Head>
          {frame >= code ? <Stamp2 at={code} x={540} y={1180} size={110} solid>A CODE</Stamp2> : null}
          <Credit t={`The code (under UV light) · ${PD}`} />
        </>
      )}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Never cracked ─────────────────────────
export const Uncracked: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const rows = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={`${PH}code.jpg`} w={820} h={480} x={130} y={160} r={-1} show={p(frame, 2, 10)} caption="WRGOABABD …" gray={0.3} fit="contain" />
        <div style={{position: 'absolute', left: 180, top: 720, width: 720, background: PAPER, padding: '22px 34px', boxSizing: 'border-box', transform: 'rotate(1deg)', boxShadow: '0 20px 40px #000c'}}>
          {['POLICE', 'NAVY CODEBREAKERS', 'COMPUTERS'].map((t, k) => (
            <div key={t} style={{display: 'flex', justifyContent: 'space-between', fontFamily: DISPLAY, fontSize: 56, color: INK, opacity: frame >= rows[k] ? 1 : 0.15}}>
              <span>{t}</span>
              <span style={{color: RED, transform: `scale(${frame >= rows[k] ? lerp(2, 1, p(frame, rows[k], 6)) : 1})`}}>✗</span>
            </div>
          ))}
        </div>
      </Stage>
      <Credit t={`The code · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The phone number ─────────────────────────
export const Phone: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [num, nurse] = [cue.s(1), cue.s(2)];
  const d = p(frame, nurse + 10, 30);
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={140} y={160} w={800} r={-1} show={p(frame, 2, 10)} size={44}>
          ONE MORE THING ON THE COVER…
        </Card>
        {frame >= num ? (
          <div style={{position: 'absolute', left: 190, top: 330, width: 700, background: PAPER, padding: '20px 30px', boxSizing: 'border-box', transform: 'rotate(-2deg)', boxShadow: '0 20px 40px #000c', opacity: p(frame, num, 8)}}>
            <div style={{fontFamily: MARKER, fontSize: 80, color: INK, textAlign: 'center'}}>📞 A PHONE NUMBER</div>
          </div>
        ) : null}
        {frame >= nurse ? (
          <>
            <div style={{position: 'absolute', left: 160, top: 640, width: 760, height: 340, background: '#c9b58a', border: '6px solid #f2ead8', boxShadow: '0 20px 40px #000c', opacity: p(frame, nurse, 8)}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: '#5b8bb0'}} />
              <div style={{position: 'absolute', left: 90, top: 160, fontFamily: DISPLAY, fontSize: 60, color: RED}}>✕</div>
              <div style={{position: 'absolute', left: 60, top: 110, fontFamily: MARKER, fontSize: 30, color: INK}}>BODY</div>
              <div style={{position: 'absolute', left: 140, top: 190, width: 480 * d, height: 6, background: RED}} />
              <div style={{position: 'absolute', left: 610, top: 160, fontSize: 60, opacity: d}}>🏠</div>
              <div style={{position: 'absolute', left: 560, top: 100, fontFamily: MARKER, fontSize: 30, color: INK, opacity: d}}>A NURSE</div>
            </div>
            {frame >= nurse + 40 ? <Stamp2 at={nurse + 40} x={540} y={1060} size={90} solid>400 METERS</Stamp2> : null}
          </>
        ) : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The nurse ─────────────────────────
export const Nurse: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [faint, swore] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}nurse.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.3, x: 0}} to={{s: 1.5, x: -30}} pos="55% 50%" />
      <Dark o={0.05} />
      <Head at={2} until={faint} top={170} size={88}>
        SHE SAW <span style={{color: '#ffd76a'}}>HIS FACE CAST</span>
      </Head>
      <Head at={faint} until={swore} top={170} size={92}>
        SHE NEARLY <span style={{color: RED}}>FAINTED</span>
      </Head>
      <Head at={swore} top={170} size={92}>
        "I'VE NEVER <span style={{color: RED}}>SEEN HIM</span>"
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Her son ─────────────────────────
export const Son: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [boy, teeth, odds] = [cue.s(1), cue.s(2), cue.s(3)];
  const row = (at: number, t: string, y: number) => (
    <div style={{position: 'absolute', left: 120, top: y, width: 840, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: PAPER, padding: '12px 30px', boxSizing: 'border-box', boxShadow: '0 12px 24px #000a', opacity: p(frame, at, 8)}}>
      <span style={{fontFamily: DISPLAY, fontSize: 50, color: INK}}>{t}</span>
      <span style={{fontFamily: DISPLAY, fontSize: 56, color: RED}}>✓ &nbsp; ✓</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Board dim={0.1} />
      <Stage>
        <Polaroid src={`${PH}man.jpg`} w={380} h={420} x={110} y={160} r={-4} show={p(frame, 4, 10)} caption="THE DEAD MAN" gray={1} pos="50% 30%" />
        <Polaroid w={380} h={420} x={590} y={180} r={4} show={p(frame, boy, 10)} caption="HER SON" gray={1}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #8a8a8a, #222)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
            <Person h={300} color="#111" />
          </AbsoluteFill>
        </Polaroid>
        {frame >= boy + 20 ? row(boy + 20, 'RARE EAR SHAPE', 700) : null}
        {frame >= teeth ? row(teeth, 'RARE MISSING TEETH', 820) : null}
        {frame >= odds ? <Stamp2 at={odds} x={540} y={1010} size={88} solid>~2 IN 100 PEOPLE</Stamp2> : null}
      </Stage>
      <Credit t={`Left: ${PD} · Right: silhouette, no photo shown`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Exhumed ─────────────────────────
export const Exhumed: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const dug = cue.s(1);
  const y = Math.floor(lerp(1948, 2021, p(frame, 0, Math.max(10, dug), lin)));
  return (
    <AbsoluteFill style={{background: '#06070a'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #22262e, #000 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: DISPLAY, fontSize: 240, color: '#fff', textShadow: '0 10px 0 #000'}}>{y}</div>
      <Head at={2} until={dug} top={190} size={96}>
        74 YEARS · <span style={{color: '#9fc0ff'}}>NO NAME</span>
      </Head>
      {frame >= dug ? <Stamp2 at={dug + 10} x={540} y={980} size={110} solid>EXHUMED</Stamp2> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · DNA gives a name ─────────────────────────
const Helix: React.FC<{t: number}> = ({t}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={260} height={760} viewBox="0 0 260 760">
      {Array.from({length: 20}, (_, k) => {
        const yy = 20 + k * 36;
        const ph = frame / 10 + k * 0.5;
        const x1 = 130 + Math.sin(ph) * 100;
        const x2 = 130 - Math.sin(ph) * 100;
        return (
          <g key={k} opacity={k / 20 < t ? 1 : 0.08}>
            <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={k % 3 ? '#9fc0ff' : RED} strokeWidth={6} />
            <circle cx={x1} cy={yy} r={9} fill="#e8ecff" />
            <circle cx={x2} cy={yy} r={9} fill="#e8ecff" />
          </g>
        );
      })}
    </svg>
  );
};
export const Name: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [y2022, webb, job] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill style={{background: '#04070d'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #10203a, #000 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: frame >= webb ? 0.25 : 1}}>
        <Helix t={p(frame, 4, Math.max(20, y2022 - 4), lin)} />
      </div>
      <Head at={2} until={y2022} top={170} size={86}>
        HAIR DNA → <span style={{color: '#9fc0ff'}}>FAMILY TREE</span>
      </Head>
      <Head at={y2022} top={170} size={110}>
        <span style={{color: '#9fc0ff'}}>2022</span>
      </Head>
      {frame >= webb ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontFamily: DISPLAY, fontSize: 170, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #9fc0ff', transform: `scale(${lerp(1.3, 1, p(frame, webb, 8))})`}}>CARL WEBB</div>
      ) : null}
      {frame >= job ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: p(frame, job, 8)}}>
          <div style={{fontFamily: MARKER, fontSize: 46, color: INK, background: PAPER, padding: '10px 30px', transform: 'rotate(-2deg)'}}>Electrical engineer · Melbourne</div>
        </div>
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · Still unanswered ─────────────────────────
export const Why: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const why = cue.s(1);
  const qs = ['WHY THAT BEACH?', 'WHAT KILLED HIM?', 'WHAT DOES THE CODE SAY?'];
  const span = Math.max(30, cue.dur - why - 20);
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Polaroid src={`${PH}man.jpg`} w={420} h={500} x={330} y={150} r={-2} show={p(frame, 2, 10)} caption="CARL WEBB?" gray={1} pos="50% 30%" />
        <Card x={150} y={720} w={780} r={1} show={p(frame, 6, 10)} size={36}>
          HE HAD LEFT HIS MARRIAGE THE YEAR BEFORE
        </Card>
        {qs.map((q, k) => (
          <Card key={q} x={[110, 560, 230][k]} y={[860, 880, 1010][k]} w={[420, 400, 620][k]} r={[-3, 3, -1][k]} show={p(frame, why + (k * span) / 3, 10)} size={34} bg="#111" color="#fff">
            {q}
          </Card>
        ))}
      </Stage>
      <Credit t={`Police photograph · ${PD}`} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Ending + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [crack, comment, cta, follow] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Framed src={`${PH}code.jpg`} t={p(frame, 0, cta, lin)} top={360} h={700} />
        <Dark o={0.35} />
        <Stamp2 at={4} x={540} y={560} size={110} solid>CASE OPEN</Stamp2>
        <Head at={crack} top={170} size={100}>
          CAN <span style={{color: RED}}>YOU</span> CRACK IT?
        </Head>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </div>
        ) : null}
        <Credit t={`The code · ${PD}`} />
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="somerton/cta/zodiac.jpg" w={560} h={660} x={260} y={290} r={-2} show={p(frame, cta + 4, 12)} caption="THE ZODIAC'S CODE" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      {frame >= follow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: p(frame, follow, 8), transform: `scale(${pulse})`}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 64, color: '#fff', background: '#e62117', padding: '14px 50px', borderRadius: 60, boxShadow: '0 10px 30px #000a'}}>FOLLOW</div>
          <div style={{fontFamily: MARKER, fontSize: 46, color: '#ffd76a', textShadow: '0 3px 0 #000'}}>A new mystery every day</div>
        </div>
      ) : null}
      <LightSweep at={cta + 6} color="#ffe0b0" strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail ─────────────────────────
export const SomertonThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${PH}code.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(6px) brightness(0.35)', transform: 'scale(1.1)'}} />
    <div style={{position: 'absolute', top: 70, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 140, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000'}}>
      WHO WAS
      <br />
      <span style={{color: RED}}>THIS MAN?</span>
    </div>
    <div style={{position: 'absolute', left: 250, top: 420, width: 580, height: 700, background: PAPER, padding: 18, boxSizing: 'border-box', transform: 'rotate(-3deg)', boxShadow: '0 30px 60px #000'}}>
      <Img src={staticFile(`${PH}man.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', filter: 'grayscale(1) contrast(1.15)'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', transform: 'rotate(3deg)'}}>
      <Img src={staticFile(`${PH}tamamshud.jpg`)} style={{width: 760, boxShadow: '0 20px 40px #000'}} />
    </div>
    <div style={{position: 'absolute', bottom: 270, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 80, lineHeight: 1, color: '#ffd76a', textShadow: '0 8px 0 #000'}}>A CODE NO ONE CAN CRACK</div>
    <div style={{position: 'absolute', bottom: 200, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 52, color: '#fff', textShadow: '0 4px 0 #000'}}>The Somerton Man · 1948</div>
  </AbsoluteFill>
);
