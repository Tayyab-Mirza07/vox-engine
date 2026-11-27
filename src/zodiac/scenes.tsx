import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p, rnd} from '../lib';
import {has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'zodiac/ai/';
const PH = 'zodiac/photos/';
const BLUE = '#1c2f7a';
const CR: Record<string, string> = {
  'poster.png': 'SFPD wanted poster, Oct 1969 · public domain',
  'letter408.jpg': 'Zodiac letter to the SF Chronicle, 1969 · public domain',
  'cipher.jpg': '408 cipher, SF Examiner, 31 Jul 1969 · public domain',
  'allen.jpg': 'Arthur Leigh Allen · California DMV · public domain',
  'berryessa.jpg': 'Lake Berryessa · Alex Wild · CC0',
  'presidio.jpg': 'Presidio Heights, SF · Tony Webster · CC BY-SA 2.0',
  'vallejo.jpg': 'Vallejo, California · Quintin Soloviev · CC BY 4.0',
};
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const lin = (n: number) => n;
const Dark: React.FC<{o?: number}> = ({o = 0.4}) => <AbsoluteFill style={{background: '#000', opacity: o}} />;

/** The Zodiac's crossed-circle symbol, drawn on over `t` (0..1). */
export const Cross: React.FC<{size: number; t?: number; color?: string; stroke?: number}> = ({size, t = 1, color = '#fff', stroke = 10}) => {
  const c = 2 * Math.PI * 80;
  const circ = Math.min(1, t / 0.6);
  const line = Math.max(0, (t - 0.6) / 0.4);
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
      <circle r={80} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c * (1 - circ)} strokeLinecap="round" />
      <line x1={0} y1={-100} x2={0} y2={-100 + 200 * line} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={-100} y1={0} x2={-100 + 200 * line} y2={0} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
};

// Cipher-like glyphs (drawn from the shapes the Zodiac used: Greek letters, backwards letters, shapes).
const GLYPHS = 'ΔΘΦΨΩΣΠΓ⊕◐▲▼◆◇○●□■+KRLPJ/ZBFEWVTqpdbΛЯƎꟻ⊿⌐>'.split('');
const glyph = (k: number) => GLYPHS[Math.floor(rnd(k * 3 + 1) * GLYPHS.length)];
/** A grid of cipher symbols that appear one by one from `at`; from `decode` they flip to plain letters. */
const CipherGrid: React.FC<{cols: number; rows: number; at: number; speed?: number; size: number; decode?: number; text?: string; color?: string}> = ({cols, rows, at, speed = 6, size, decode, text = '', color = INK}) => {
  const frame = useCurrentFrame();
  const n = cols * rows;
  const shown = Math.floor((frame - at) * speed);
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 2, fontFamily: '"Courier New"', fontWeight: 700, fontSize: size * 0.8, color, lineHeight: `${size}px`, textAlign: 'center'}}>
      {Array.from({length: n}, (_, k) => {
        const flipped = decode !== undefined && frame >= decode + k * 0.6;
        const ch = flipped ? (text[k % Math.max(1, text.length)] ?? ' ') : glyph(k);
        return (
          <div key={k} style={{height: size, opacity: k < shown ? 1 : 0, color: flipped ? RED : color}}>
            {ch}
          </div>
        );
      })}
    </div>
  );
};

/** Hooded figure as a flat silhouette (no AI image: kept graphic on purpose). */
const Hooded: React.FC<{h: number; t?: number}> = ({h, t = 1}) => (
  <svg width={h * 0.55} height={h} viewBox="0 0 220 400" style={{overflow: 'visible', filter: 'drop-shadow(0 0 18px #000)'}}>
    <g fill="#050505">
      <path d="M70 0 H150 Q160 0 160 12 V110 L190 130 Q205 140 205 160 V400 H15 V160 Q15 140 30 130 L60 110 V12 Q60 0 70 0 Z" />
    </g>
    <rect x={88} y={42} width={16} height={8} fill="#2a2a2a" />
    <rect x={116} y={42} width={16} height={8} fill="#2a2a2a" />
    <g transform="translate(110 210) scale(0.42)" opacity={t}>
      <circle r={80} fill="none" stroke="#f4f4f4" strokeWidth={14} />
      <line x1={0} y1={-100} x2={0} y2={100} stroke="#f4f4f4" strokeWidth={14} />
      <line x1={-100} y1={0} x2={100} y2={0} stroke="#f4f4f4" strokeWidth={14} />
    </g>
  </svg>
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

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [signed, speaking, nobody] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}letters.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.9, x: -80}} to={{s: 1.5, x: -40}} pos="72% 70%" />
      <Dark o={frame >= speaking ? 0.55 : 0.3} />
      <Head at={0} until={signed} top={170} size={92}>
        A PIECE OF HIS <span style={{color: RED}}>VICTIM'S SHIRT</span>
      </Head>
      <Head at={signed} until={nobody} top={170} size={110}>
        THEN HE <span style={{color: '#ffd76a'}}>SIGNED IT</span>
      </Head>
      {frame >= speaking ? (
        <div style={{position: 'absolute', left: 90, right: 90, top: 560, padding: '40px 46px', background: PAPER, transform: `rotate(-2deg) scale(${lerp(1.15, 1, p(frame, speaking, 8))})`, boxShadow: '0 30px 60px #000', opacity: p(frame, speaking, 6)}}>
          <div style={{fontFamily: MARKER, fontSize: 82, color: BLUE, lineHeight: 1.1}}>This is the Zodiac speaking</div>
          <div style={{position: 'absolute', right: 30, bottom: -60}}>
            <Cross size={150} t={p(frame, speaking + 10, 24, lin)} color={BLUE} stroke={12} />
          </div>
        </div>
      ) : null}
      <Head at={nobody} top={170} size={100}>
        <span style={{color: '#ffd76a'}}>50+ YEARS</span> LATER…
      </Head>
      {frame >= nobody + 20 ? <Stamp2 at={nobody + 20} x={540} y={1200} size={100} solid>NEVER IDENTIFIED</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Lake Herman Road ─────────────────────────
export const Road: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [couple, shot, none] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}road.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.35, x: 120}} to={{s: 1.6, x: 160}} pos="25% 60%" />
      <Dark o={0.2} />
      <Head at={2} until={couple} top={170} size={100}>
        DECEMBER <span style={{color: '#9fc0ff'}}>1968</span>
      </Head>
      <Head at={couple} until={shot} top={170} size={86}>
        A TEENAGE COUPLE · <span style={{color: '#ffd76a'}}>FIRST DATE</span>
      </Head>
      <Head at={shot} top={170} size={100}>
        BOTH <span style={{color: RED}}>KILLED</span>
      </Head>
      {frame >= none ? <Stamp2 at={none} x={540} y={1050} size={100} solid>NO WITNESSES</Stamp2> : null}
      <div style={{position: 'absolute', left: 40, top: 330, fontFamily: '"Courier New"', fontWeight: 700, fontSize: 32, color: '#ffffffcc', opacity: p(frame, 10, 10)}}>LAKE HERMAN ROAD · BENICIA, CA</div>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Vallejo ─────────────────────────
export const Vallejo: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [another, died, survived] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame < died) {
    return (
      <AbsoluteFill>
        <PhotoBg n="vallejo.jpg" t={p(frame, 0, died, lin)} from={{s: 1.15}} to={{s: 1.3}} fb="road.png" fpos="40% 50%" />
        <Dark o={0.35} />
        <Head at={2} until={another} top={170} size={96}>
          JULY 4, <span style={{color: '#9fc0ff'}}>1969</span>
        </Head>
        <Head at={another} top={170} size={86}>
          VALLEJO · <span style={{color: '#ffd76a'}}>ANOTHER PARKED CAR</span>
        </Head>
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={160} y={170} w={760} r={-1} show={p(frame, died - 2, 8)} size={50}>
          BLUE ROCK SPRINGS · VALLEJO
        </Card>
        <Polaroid w={360} h={420} x={140} y={380} r={-4} show={p(frame, died, 10)} caption="SHE DIED" gray={1}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #4a4a52, #111)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}><Person h={330} color="#000" /></AbsoluteFill>
        </Polaroid>
        <Polaroid w={360} h={420} x={580} y={400} r={4} show={p(frame, survived, 10)} caption="HE SURVIVED" gray={1}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #4a4a52, #111)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}><Person h={330} color="#000" /></AbsoluteFill>
        </Polaroid>
        {frame >= survived + 16 ? <Stamp2 at={survived + 16} x={540} y={1010} size={80} solid>VICTIM #3 · SURVIVOR #1</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The call ─────────────────────────
export const Call: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [calmly, first, hung] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}booth.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.5, x: 260}} to={{s: 1.75, x: 300}} pos="18% 45%" />
      <Head at={2} until={calmly} top={170} size={96}>
        <span style={{color: '#ffd76a'}}>12:40 AM</span> · A CALL
      </Head>
      <Head at={calmly} until={first} top={170} size={100}>
        "I DID IT."
      </Head>
      <Head at={first} top={170} size={86}>
        …AND THE <span style={{color: RED}}>1968 COUPLE</span>
      </Head>
      {frame >= hung ? <Stamp2 at={hung} x={540} y={1050} size={110} solid>CLICK.</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Rehook ─────────────────────────
export const Never: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2a0a0e, #000 65%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${lerp(0.9, 1.08, p(frame, 0, cue.dur, lin))})`}}>
        <Cross size={560} t={p(frame, 4, 40, lin)} color={RED} stroke={8} />
      </div>
      <Head at={4} top={220} size={90}>
        NO KILLER HAD <span style={{color: RED}}>EVER</span> DONE THIS
      </Head>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The 408 cipher ─────────────────────────
const PAPERS = ['VALLEJO TIMES-HERALD', 'SF CHRONICLE', 'SF EXAMINER'];
export const Cipher: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [count, warn] = [cue.s(1), cue.s(2)];
  const c = real('cipher.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        {PAPERS.map((n, k) => (
          <Card key={n} x={60 + k * 330} y={170 + (k % 2) * 30} w={300} r={(k - 1) * 3} show={p(frame, 4 + k * 10, 10)} size={30}>
            📰 {n}
            <div style={{fontFamily: DISPLAY, fontSize: 60, color: RED}}>⅓</div>
          </Card>
        ))}
        {frame < count ? (
          c ? <Polaroid src={c} w={820} h={520} x={130} y={450} r={-1} show={p(frame, 30, 12)} caption="JULY 31, 1969" fit="contain" gray={0} /> : null
        ) : (
          <div style={{position: 'absolute', left: 110, top: 440, width: 860, background: PAPER, padding: 24, boxSizing: 'border-box', transform: 'rotate(-1deg)', boxShadow: '0 20px 40px #000c'}}>
            <CipherGrid cols={17} rows={10} at={count} speed={8} size={42} />
          </div>
        )}
        {frame >= count && frame < warn ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', fontFamily: DISPLAY, fontSize: 96, color: '#fff', textShadow: '0 6px 0 #000'}}>
            {Math.min(408, Math.max(0, Math.floor((frame - count) * 8)))} SYMBOLS
          </div>
        ) : null}
        {frame >= warn ? <Stamp2 at={warn} x={540} y={990} size={70} solid>FRONT PAGE… OR ELSE</Stamp2> : null}
      </Stage>
      {c && frame < count ? <Credit t={CR['cipher.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The name ─────────────────────────
export const Name: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const speaking = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}letters.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.6, x: -120, y: -60}} to={{s: 2.1, x: -160, y: -120}} pos="72% 72%" />
      <Dark o={0.45} />
      <Head at={2} until={speaking} top={170} size={96}>
        HE GAVE HIMSELF <span style={{color: '#ffd76a'}}>A NAME</span>
      </Head>
      {frame >= speaking ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
          <div style={{fontFamily: MARKER, fontSize: 92, color: '#e8ecff', lineHeight: 1.1, textShadow: '0 0 30px #000', opacity: p(frame, speaking, 10)}}>This is the Zodiac speaking</div>
          <div style={{marginTop: 60, display: 'flex', justifyContent: 'center'}}>
            <Cross size={360} t={p(frame, speaking + 6, 30, lin)} color="#e8ecff" stroke={9} />
          </div>
        </div>
      ) : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Cracked ─────────────────────────
export const Cracked: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [said, noname] = [cue.s(1), cue.s(2)];
  const quote = 'I LIKE KILLING PEOPLE…';
  const shown = Math.floor(quote.length * p(frame, said, 30, lin));
  const l = real('letter408.jpg');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={120} y={160} w={840} r={-1} show={p(frame, 2, 10)} size={44}>
          SALINAS · A TEACHER & HIS WIFE
        </Card>
        <Polaroid src={l ?? `${AI}letters.png`} w={420} h={520} x={100} y={340} r={-4} show={p(frame, 10, 12)} caption="AUG 8, 1969 · SOLVED" pos="50% 20%" gray={0.3} />
        <div style={{position: 'absolute', left: 560, top: 400, width: 420, background: PAPER, padding: '28px 30px', boxSizing: 'border-box', transform: 'rotate(2deg)', boxShadow: '0 20px 40px #000c', opacity: p(frame, said, 8), minHeight: 260}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 24, color: '#7a5a3a'}}>DECODED</div>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 52, color: RED, lineHeight: 1.2}}>{quote.slice(0, shown)}</div>
        </div>
        <Strings lines={[[310, 350, 770, 410]]} t={p(frame, said, 20)} />
        {frame >= noname ? <Stamp2 at={noname} x={760} y={900} size={90} solid>NO NAME</Stamp2> : null}
      </Stage>
      {l ? <Credit t={CR['letter408.jpg']} /> : <AIC />}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Lake Berryessa ─────────────────────────
export const Lake: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [hood, couple, one] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <PhotoBg n="berryessa.jpg" t={p(frame, 0, cue.dur, lin)} from={{s: 1.15}} to={{s: 1.35}} fb="road.png" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #00000088, transparent 30%, transparent 55%, #000000cc)'}} />
      <Head at={2} until={hood} top={170} size={90}>
        SEPT 1969 · <span style={{color: '#ffd76a'}}>LAKE BERRYESSA</span>
      </Head>
      <Head at={hood} until={couple} top={170} size={96}>
        IN BROAD <span style={{color: '#ffd76a'}}>DAYLIGHT</span>
      </Head>
      <Head at={couple} top={170} size={86}>
        ANOTHER <span style={{color: RED}}>YOUNG COUPLE</span>
      </Head>
      {frame >= hood ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 260, display: 'flex', justifyContent: 'center', opacity: p(frame, hood, 14), transform: `translateY(${(1 - p(frame, hood, 20)) * 60}px) scale(${lerp(0.95, 1.05, p(frame, hood, cue.dur - hood, lin))})`}}>
          <Hooded h={900} t={p(frame, hood + 50, 14)} />
        </div>
      ) : null}
      {frame >= one ? <Stamp2 at={one} x={540} y={760} size={90} solid>ONLY HE SURVIVED</Stamp2> : null}
      <div style={{position: 'absolute', right: 30, bottom: 120, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99'}}>Hooded figure: graphic reconstruction</div>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Car door ─────────────────────────
export const Door: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [dates, symbol] = [cue.s(1), cue.s(2)];
  const ln = (at: number, t: string) => <div style={{fontFamily: MARKER, fontSize: 60, color: '#111', opacity: p(frame, at, 8), transform: `translateX(${(1 - p(frame, at, 8)) * -20}px)`}}>{t}</div>;
  return (
    <AbsoluteFill>
      <Board dim={0.15} />
      <Stage>
        <Card x={140} y={160} w={800} r={-1} show={p(frame, 2, 10)} size={44}>
          HE WROTE ON THEIR CAR DOOR
        </Card>
        <div style={{position: 'absolute', left: 90, top: 360, width: 900, height: 700, borderRadius: '40px 120px 30px 30px', background: 'linear-gradient(160deg, #e9e6dc, #b9b4a4)', boxShadow: 'inset 0 -20px 40px #0004, 0 30px 60px #000c', padding: '70px 70px', boxSizing: 'border-box', transform: 'rotate(-1deg)', opacity: p(frame, 6, 10)}}>
          <div style={{position: 'absolute', left: 60, right: 60, top: 40, height: 230, borderRadius: '20px 100px 10px 10px', background: 'linear-gradient(180deg, #3a4656, #1a2028)', opacity: 0.85}} />
          <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', flexDirection: 'column', gap: 2}}>
            {ln(20, 'Vallejo')}
            {ln(dates, '12-20-68')}
            {ln(dates + 12, '7-4-69')}
            {ln(dates + 24, 'Sept 27-69')}
          </div>
          <div style={{position: 'absolute', right: 80, top: 330, opacity: frame >= symbol ? 1 : 0}}>
            <Cross size={260} t={p(frame, symbol, 20, lin)} color="#111" stroke={12} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1090, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 24, color: '#ffffffaa'}}>Reconstruction of the writing</div>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · San Francisco ─────────────────────────
export const City: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cab, witnesses] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <PhotoBg n="presidio.jpg" t={p(frame, 0, cue.dur, lin)} from={{s: 1.2}} to={{s: 1.4}} fb="booth.png" fpos="70% 50%" />
      <Dark o={0.35} />
      <Head at={2} until={cab} top={170} size={90}>
        OCT 11, 1969 · <span style={{color: '#ffd76a'}}>SAN FRANCISCO</span>
      </Head>
      <Head at={cab} top={170} size={96}>
        🚕 A <span style={{color: '#ffd76a'}}>CAB DRIVER</span>
      </Head>
      {frame >= witnesses ? <Stamp2 at={witnesses} x={540} y={1000} size={110} solid>WITNESSES</Stamp2> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The near miss ─────────────────────────
export const Miss: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [passed, radio, go] = [cue.s(1), cue.s(2), cue.s(3)];
  const po = real('poster.png');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={130} y={160} w={420} r={-3} show={p(frame, 2, 10)} size={44}>
          🚓 POLICE RACE IN
        </Card>
        <Card x={580} y={180} w={380} r={3} show={p(frame, passed, 10)} size={38}>
          2 OFFICERS PASS A MAN WALKING AWAY
        </Card>
        <Polaroid src={po ?? undefined} w={480} h={540} x={300} y={370} r={-2} show={p(frame, passed + 6, 12)} caption="THE MAN THEY SAW?" gray={0.4} pos="50% 30%">
          {!po ? <AbsoluteFill style={{background: '#333'}} /> : null}
        </Polaroid>
        {frame >= radio ? (
          <div style={{position: 'absolute', left: 90, top: 1010, width: 900, background: '#111', border: `4px solid ${RED}`, padding: '18px 24px', boxSizing: 'border-box', opacity: p(frame, radio, 8)}}>
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 40, color: '#7dff9a'}}>📻 RADIO: WRONG DESCRIPTION</div>
          </div>
        ) : null}
        {frame >= go ? <Stamp2 at={go} x={540} y={700} size={100} solid>LET HIM GO</Stamp2> : null}
      </Stage>
      {po && frame >= passed ? <Credit t={CR['poster.png']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The envelope ─────────────────────────
export const Envelope: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [inside, bus] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}letters.png`} t={p(frame, 0, cue.dur, lin)} from={{s: 1.5, x: 120}} to={{s: 1.8, x: 180}} pos="30% 55%" />
      <Dark o={0.4} />
      <Head at={2} until={inside} top={170} size={90}>
        THE <span style={{color: '#ffd76a'}}>CHRONICLE</span> GETS MAIL
      </Head>
      <Head at={inside} until={bus} top={170} size={80}>
        A PIECE OF <span style={{color: RED}}>THE DRIVER'S SHIRT</span>
      </Head>
      <Head at={bus} top={170} size={86}>
        NEXT TARGET: <span style={{color: RED}}>A SCHOOL BUS</span>
      </Head>
      {frame >= bus + 20 ? <Stamp2 at={bus + 20} x={540} y={1050} size={100} solid>PROOF</Stamp2> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The 340 ─────────────────────────
export const Z340: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [count, years] = [cue.s(1), cue.s(2)];
  const y = Math.floor(lerp(1969, 2020, p(frame, years, cue.dur - years - 10, lin)));
  return (
    <AbsoluteFill>
      <Board dim={0.25} />
      <Stage>
        <Card x={220} y={160} w={640} r={-1} show={p(frame, 2, 10)} size={56}>
          CODE #2 · NOV 1969
        </Card>
        <div style={{position: 'absolute', left: 130, top: 330, width: 820, background: PAPER, padding: 20, boxSizing: 'border-box', transform: 'rotate(1deg)', boxShadow: '0 20px 40px #000c'}}>
          <CipherGrid cols={17} rows={14} at={8} speed={12} size={38} />
        </div>
        {frame >= count ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 950, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: '#fff', textShadow: '0 6px 0 #000'}}>
            {frame >= years ? <span style={{color: RED}}>{y}</span> : '340 SYMBOLS'}
          </div>
        ) : null}
        {frame >= years + 50 ? <Stamp2 at={years + 50} x={540} y={760} size={100} solid>UNCRACKED</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Solved in 2020 ─────────────────────────
const PLAIN = 'IHOPEYOUAREHAVINGLOTSOFFUNINTRYINGTOCATCHME';
export const Solved: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [fun, gas] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={120} y={160} w={460} r={-3} show={p(frame, 2, 10)} size={52}>
          DEC 2020 · SOLVED
        </Card>
        <Card x={600} y={180} w={360} r={3} show={p(frame, 16, 10)} size={30}>
          3 AMATEURS · USA · AUSTRALIA · BELGIUM
        </Card>
        <div style={{position: 'absolute', left: 130, top: 380, width: 820, background: PAPER, padding: 20, boxSizing: 'border-box', transform: 'rotate(-1deg)', boxShadow: '0 20px 40px #000c'}}>
          <CipherGrid cols={17} rows={8} at={-999} size={42} decode={20} text={PLAIN} />
        </div>
        {frame >= fun && frame < gas ? (
          <Card x={110} y={820} w={860} r={1} show={p(frame, fun, 10)} size={44} bg="#111" color="#fff">
            "I HOPE YOU ARE HAVING LOTS OF FUN IN TRYING TO CATCH ME"
          </Card>
        ) : null}
        {frame >= gas ? <Stamp2 at={gas} x={540} y={880} size={62} solid>"NOT AFRAID OF THE GAS CHAMBER"</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · The count ─────────────────────────
export const Count: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [confirm, stopped] = [cue.s(1), cue.s(2)];
  const n = Math.floor(lerp(0, 37, p(frame, 4, 40)));
  return (
    <AbsoluteFill>
      <Board dim={0.15} />
      <Stage>
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
          <div style={{fontFamily: MARKER, fontSize: 50, color: '#fff', textShadow: '0 3px 0 #000'}}>HE CLAIMED</div>
          <div style={{fontFamily: DISPLAY, fontSize: 260, color: RED, lineHeight: 1, textShadow: '0 10px 0 #000'}}>{n}</div>
        </div>
        <Card x={130} y={600} w={380} r={-3} show={p(frame, confirm, 10)} size={50}>
          CONFIRMED: 5 DEAD
        </Card>
        <Card x={570} y={620} w={380} r={3} show={p(frame, confirm + 14, 10)} size={50}>
          2 SURVIVED
        </Card>
        {frame >= stopped ? (
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: DISPLAY, fontSize: 130, color: '#ffd76a', textShadow: '0 8px 0 #000', opacity: p(frame, stopped, 8)}}>1974</div>
            <Stamp2 at={stopped + 24} x={540} y={1030} size={80} solid>THE LETTERS STOP</Stamp2>
          </>
        ) : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · The suspect ─────────────────────────
export const Suspect: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [tests, died] = [cue.s(1), cue.s(2)];
  const a = real('allen.jpg');
  const span = Math.max(30, died - tests);
  const rows = [
    {t: 'FINGERPRINTS', at: tests + 6},
    {t: 'HANDWRITING', at: tests + span * 0.35},
    {t: 'PARTIAL DNA', at: tests + span * 0.7},
  ];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={160} y={150} w={760} r={-1} show={p(frame, 2, 10)} size={48}>
          MAIN SUSPECT
        </Card>
        <Polaroid src={a ?? undefined} w={380} h={500} x={90} y={320} r={-4} show={p(frame, 6, 12)} caption="ARTHUR LEIGH ALLEN" gray={0.6} pos="50% 30%">
          {!a ? <AbsoluteFill style={{background: '#333'}} /> : null}
        </Polaroid>
        <div style={{position: 'absolute', left: 510, top: 360, width: 480, background: PAPER, padding: '24px 30px', boxSizing: 'border-box', transform: 'rotate(2deg)', boxShadow: '0 20px 40px #000c', opacity: p(frame, tests, 8)}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 24, color: '#5a3a1a'}}>DOES IT MATCH?</div>
          {rows.map((r) => (
            <div key={r.t} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: DISPLAY, fontSize: 50, color: INK, marginTop: 12, opacity: frame >= r.at ? 1 : 0.15}}>
              <span>{r.t}</span>
              <span style={{color: RED, transform: `scale(${frame >= r.at ? lerp(2, 1, p(frame, r.at, 6)) : 1})`}}>✗</span>
            </div>
          ))}
        </div>
        {frame >= died ? <Stamp2 at={died} x={540} y={1000} size={80} solid>† 1992 · NEVER CHARGED</Stamp2> : null}
      </Stage>
      {a ? <Credit t={CR['allen.jpg']} /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Ending + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [who, comment, cta, follow] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  const po = real('poster.png');
  if (frame < cta) {
    return (
      <AbsoluteFill>
        {po ? <Still src={po} t={p(frame, 0, cta, lin)} from={{s: 1.1}} to={{s: 1.25}} pos="50% 30%" flicker={false} /> : <Still src={`${AI}letters.png`} t={p(frame, 0, cta, lin)} />}
        <Dark o={0.45} />
        <Stamp2 at={4} x={540} y={560} size={110} solid>CASE OPEN</Stamp2>
        <Head at={who} top={170} size={110}>
          WHO WAS <span style={{color: RED}}>HE?</span>
        </Head>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: PAPER, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </div>
        ) : null}
        {po ? <Credit t={CR['poster.png']} /> : <AIC />}
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="zodiac/cta/kemper.jpg" w={560} h={660} x={260} y={290} r={-2} show={p(frame, cta + 4, 12)} caption="THE COPS' DRINKING BUDDY" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      {frame >= follow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: p(frame, follow, 8), transform: `scale(${pulse})`}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 64, color: '#fff', background: '#e62117', padding: '14px 50px', borderRadius: 60, boxShadow: '0 10px 30px #000a'}}>FOLLOW</div>
          <div style={{fontFamily: MARKER, fontSize: 46, color: '#ffd76a', textShadow: '0 3px 0 #000'}}>A new unsolved mystery every day</div>
        </div>
      ) : null}
      <LightSweep at={cta + 6} color="#ffe0b0" strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail (Shorts cover) ─────────────────────────
export const ZodiacThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${AI}letters.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '72% 70%', filter: 'blur(16px) brightness(0.45)', transform: 'scale(1.1)'}} />
    <Img src={staticFile(`${AI}letters.png`)} style={{position: 'absolute', left: -1300, top: 360, width: 2600, height: 1462, filter: 'contrast(1.15) brightness(0.8)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000f0 0%, #00000090 20%, transparent 34%, transparent 60%, #000000f0 84%)'}} />
    <div style={{position: 'absolute', top: 70, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #000'}}>
      HE SIGNED
      <br />
      <span style={{color: RED}}>EVERY LETTER</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 0 30px #000)'}}>
      <Cross size={420} color="#ffffff" stroke={12} />
    </div>
    <div style={{position: 'absolute', left: 560, top: 1120, border: '10px solid #ff3b4f', padding: '4px 24px', transform: 'rotate(-8deg)', fontFamily: DISPLAY, fontSize: 84, color: '#ff3b4f', background: '#000000b0'}}>NEVER CAUGHT</div>
    <div style={{position: 'absolute', bottom: 300, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 96, lineHeight: 1, color: '#ffd76a', textShadow: '0 8px 0 #000'}}>WHO WAS THE ZODIAC?</div>
    <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 56, color: '#fff', textShadow: '0 4px 0 #000'}}>California · 1968–1974</div>
  </AbsoluteFill>
);
