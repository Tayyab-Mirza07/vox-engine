import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd} from '../lib';
import {has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {Board, Card, Head, INK, MARKER, PAPER, Polaroid, RED, Stage, Stamp2, Still, Strings} from '../annabelle/parts';

export {RED};
type SceneProps = {cue: Cues};
const AI = 'flannan/ai/';
const PH = 'flannan/photos/';
const CR: Record<string, string> = {
  'lighthouse.jpg': 'Flannan Isles lighthouse · geograph.org.uk · CC BY-SA 2.0',
  'approach.jpg': 'Approaching Eilean Mòr · geograph.org.uk · CC BY-SA 2.0',
  'cliffs.jpg': 'Lighthouse and cliffs · geograph.org.uk · CC BY-SA 2.0',
  'plaque.jpg': 'Lighthouse plaque · geograph.org.uk · CC BY-SA 2.0',
  'chart.jpg': 'Admiralty Chart No. 3331 (1903) · public domain',
};
const real = (...n: string[]) => n.find((x) => has(`${PH}${x}`));
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff99', zIndex: 6}}>{t}</div>;
const AIC: React.FC = () => <Credit t="AI illustration · dramatization" />;
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: '5px 5px', backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`, pointerEvents: 'none'}} />;
};
const Rain: React.FC<{amount?: number}> = ({amount = 1}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none'}}>
      {Array.from({length: Math.round(90 * amount)}, (_, i) => {
        const x = (rnd(i) * 1300 + frame * 6) % 1300 - 100;
        const y = (rnd(i + 50) * 1920 + frame * 48) % 1920;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 60} stroke="#cfe0ff" strokeWidth={2} />;
      })}
    </svg>
  );
};
const Lightning: React.FC<{at: number[]}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = Math.max(0, ...at.map((a) => (frame >= a && frame < a + 8 ? (1 - (frame - a) / 8) * (frame - a < 2 ? 1 : 0.6) : 0)));
  return o > 0 ? <AbsoluteFill style={{background: '#dfe8ff', opacity: o * 0.45, mixBlendMode: 'screen'}} /> : null;
};
/** Rotating lighthouse beam from (x,y). `on` 0..1. */
const Beam: React.FC<{x: number; y: number; on: number}> = ({x, y, on}) => {
  const frame = useCurrentFrame();
  if (on <= 0) return null;
  const a = (frame * 3) % 360;
  return (
    <svg width={W} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none'}}>
      <defs>
        <radialGradient id="bm" cx="0" cy="0.5" r="1">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity={0.8 * on} />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) rotate(${a})`}>
        <path d="M 0 0 L 1400 -120 L 1400 120 Z" fill="url(#bm)" />
      </g>
      <circle cx={x} cy={y} r={30} fill="#fff3c4" opacity={on} style={{filter: 'blur(8px)'}} />
    </svg>
  );
};
const Silh: React.FC<{h: number; flip?: boolean}> = ({h, flip}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'linear-gradient(180deg, #4a5260, #14181e)'}}>
    <Person h={h} color="#0a0c10" flip={flip} />
  </div>
);
const Pic: React.FC<{name: string; t: number; from?: {s?: number; x?: number; y?: number}; to?: {s?: number; x?: number; y?: number}; pos?: string; fallback: string; fpos?: string}> = ({name, t, from, to, pos, fallback, fpos}) => {
  const r = real(name);
  return r ? (
    <>
      <Still src={`${PH}${r}`} t={t} from={from} to={to} pos={pos} flicker={false} tint="#1a2a44" />
      <Credit t={CR[r]} />
    </>
  ) : (
    <>
      <Still src={`${AI}${fallback}`} t={t} from={from} to={to} pos={fpos ?? '61% 40%'} />
      <AIC />
    </>
  );
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [door, clock, coat] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame >= door) {
    const pos = frame >= coat ? '76% 30%' : frame >= clock ? '34% 5%' : '95% 50%';
    const k = frame >= coat ? p(frame, coat, cue.dur - coat, (n) => n) : frame >= clock ? p(frame, clock, coat - clock, (n) => n) : p(frame, door, clock - door, (n) => n);
    return (
      <AbsoluteFill>
        <Still src={`${AI}kitchen.png`} t={k} from={{s: frame >= clock ? 1.5 : 1.1}} to={{s: frame >= clock ? 1.8 : 1.25}} pos={pos} />
        <Head at={door} until={clock} top={180} size={100}>
          THE DOOR <span style={{color: RED}}>WAS SHUT</span>
        </Head>
        <Head at={clock} until={coat} top={180} size={100}>
          THE CLOCK <span style={{color: RED}}>HAD STOPPED</span>
        </Head>
        <Head at={coat} top={180} size={92}>
          ONE COAT <span style={{color: RED}}>STILL HANGING</span>
        </Head>
        <AIC />
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Still src={`${AI}storm.png`} t={p(frame, 0, door, (n) => n)} from={{s: 1.35, x: -60}} to={{s: 1.05}} pos="70% 30%" />
      <Rain />
      <Lightning at={[4, 52]} />
      <Head at={0} top={170} size={120}>
        3 MEN <span style={{color: RED}}>VANISHED</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Eilean Mor ─────────────────────────
export const Island: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rock, alone] = [cue.s(1), cue.s(4)];
  const chart = real('chart.jpg');
  if (frame >= rock && frame < alone && chart) {
    return (
      <AbsoluteFill>
        <Board light={[0.5, 0.4]} />
        <Stage>
          <Polaroid src={`${PH}${chart}`} w={860} h={760} x={110} y={180} r={-2} show={p(frame, rock, 12)} caption="FLANNAN ISLES · 1903 CHART" gray={0.4} fit="cover" />
          <Card x={600} y={980} w={420} r={4} show={p(frame, rock + 20, 10)} size={44}>
            20 MILES OFF SCOTLAND
          </Card>
        </Stage>
        <Credit t={CR['chart.jpg']} />
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Pic name="approach.jpg" t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.1}} to={{s: 1.3}} pos="50% 50%" fallback="ship.png" fpos="70% 30%" />
      <Head at={2} until={rock} top={170} size={96}>
        EILEAN MÒR
        <br />
        <span style={{color: RED, fontSize: 64}}>FLANNAN ISLES</span>
      </Head>
      <Head at={alone} top={170} size={86}>
        NO TREES. NO PEOPLE.
        <br />
        <span style={{color: RED}}>JUST A LIGHT.</span>
      </Head>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · The three keepers ─────────────────────────
export const Keepers: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ducat, marshall, mac] = [cue.s(2), cue.s(3), cue.s(4)];
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <Card x={280} y={150} w={520} r={-1} show={p(frame, 2, 10)} size={60}>
          DECEMBER 1900
        </Card>
        {[
          {at: ducat, x: 100, r: -4, c: 'JAMES DUCAT', sub: 'PRINCIPAL KEEPER'},
          {at: marshall, x: 395, r: 2, c: 'THOMAS MARSHALL', sub: ''},
          {at: mac, x: 690, r: 5, c: 'D. MACARTHUR', sub: 'FILLING IN'},
        ].map((k) => (
          <React.Fragment key={k.c}>
            <Polaroid w={290} h={380} x={k.x} y={400} r={k.r} show={p(frame, k.at, 12)} caption={k.c.split(' ').slice(-1)[0]}>
              <Silh h={360} />
            </Polaroid>
            {k.sub && frame >= k.at ? (
              <Card x={k.x} y={900} w={290} r={-k.r} show={p(frame, k.at + 10, 10)} size={30}>
                {k.sub}
              </Card>
            ) : null}
          </React.Fragment>
        ))}
        <Strings lines={[[245, 400, 540, 300], [540, 400, 540, 300], [835, 400, 540, 300]]} t={p(frame, mac + 10, 30)} />
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Keep the light burning ─────────────────────────
export const Job: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [burn, die] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}storm.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.6, y: 380}} to={{s: 1.4, y: 300}} pos="61% 15%" flicker={false} />
      <Beam x={540} y={frame >= die ? 520 : 520} on={frame < die ? 1 : 1 - p(frame, cue.w('dark'), 8)} />
      <Rain amount={0.6} />
      <Head at={burn} until={die} top={1080} size={84}>
        KEEP THE LIGHT <span style={{color: '#ffd76a'}}>BURNING</span>
      </Head>
      <Head at={die} top={1080} size={96}>
        OR <span style={{color: RED}}>SHIPS DIE</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The Archtor: the light is dark ─────────────────────────
export const Archtor: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [look, dark] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Still src={`${AI}storm.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.2}} to={{s: 1.45, y: 80}} pos="61% 20%" />
      <AbsoluteFill style={{background: '#000', opacity: 0.25}} />
      <Rain />
      <Lightning at={[look + 4]} />
      <Head at={2} until={dark} top={170} size={90}>
        DEC 15 · <span style={{color: '#9fc0ff'}}>SS ARCHTOR</span>
      </Head>
      <Head at={dark} top={170} size={120}>
        THE LIGHT WAS <span style={{color: RED}}>DARK</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Eleven days ─────────────────────────
export const ElevenDays: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const storms = cue.s(1);
  const day = 15 + Math.min(11, Math.floor(p(frame, storms, cue.dur - storms - 10, (n) => n) * 11));
  return (
    <AbsoluteFill>
      <Board dim={0.15} />
      <Stage>
        <div style={{position: 'absolute', left: 290, top: 250, width: 500, background: PAPER, boxShadow: '0 20px 40px #000c', textAlign: 'center', transform: 'rotate(-2deg)'}}>
          <div style={{background: RED, color: '#fff', fontFamily: DISPLAY, fontSize: 64, padding: '8px 0', letterSpacing: 6}}>DECEMBER 1900</div>
          <div style={{fontFamily: DISPLAY, fontSize: 320, color: INK, lineHeight: 1.05}}>{day}</div>
        </div>
        {frame >= storms ? <Stamp2 at={cue.w('eleven')} x={540} y={1000} size={110}>11 DAYS</Stamp2> : null}
      </Stage>
      <Rain amount={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The Hesperus ─────────────────────────
export const Hesperus: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [horn, flare, nobody] = [cue.s(2), cue.s(3), cue.s(4)];
  const flash = frame >= flare ? Math.max(0, 1 - (frame - flare) / 20) : 0;
  return (
    <AbsoluteFill>
      <Still src={`${AI}ship.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, x: 260}} to={{s: 1.35, x: -40}} pos="30% 50%" flicker={false} />
      {flash > 0 ? <AbsoluteFill style={{background: '#ff4d3a', opacity: flash * 0.35, mixBlendMode: 'screen'}} /> : null}
      <Head at={2} until={horn} top={170} size={86}>
        DEC 26 · <span style={{color: '#9fc0ff'}}>THE HESPERUS</span>
      </Head>
      <Head at={nobody} top={170} size={100}>
        <span style={{color: RED}}>NOBODY</span> CAME
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Joseph Moore climbs ─────────────────────────
export const Moore: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [gate, door] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Pic name="cliffs.jpg" t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15, y: 60}} to={{s: 1.35, y: -40}} pos="50% 50%" fallback="storm.png" fpos="61% 30%" />
      <Head at={2} until={gate} top={170} size={86}>
        JOSEPH MOORE <span style={{color: '#9fc0ff'}}>CLIMBS ALONE</span>
      </Head>
      {frame >= gate ? <Stamp2 at={gate} x={540} y={760} size={100} color="#ff3b4f" solid>GATE CLOSED</Stamp2> : null}
      {frame >= door ? <Stamp2 at={door} x={540} y={980} size={100} r={6} color="#ff3b4f" solid>DOOR CLOSED</Stamp2> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Inside ─────────────────────────
export const Inside: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [fire, clock] = [cue.s(1), cue.s(2)];
  const pos = frame >= clock ? '34% 5%' : frame >= fire ? '34% 45%' : '61% 55%';
  const t0 = frame >= clock ? clock : frame >= fire ? fire : 0;
  const t1 = frame >= clock ? cue.dur : frame >= fire ? clock : fire;
  return (
    <AbsoluteFill>
      <Still src={`${AI}kitchen.png`} t={p(frame, t0, t1 - t0, (n) => n)} from={{s: frame >= clock ? 1.6 : 1.3}} to={{s: frame >= clock ? 2.0 : 1.45}} pos={pos} />
      <Head at={2} until={fire} top={170} size={96}>BEDS UNMADE</Head>
      <Head at={fire} until={clock} top={170} size={96}>FIRE <span style={{color: '#9fc0ff'}}>COLD</span></Head>
      <Head at={clock} top={170} size={96}>CLOCK <span style={{color: RED}}>STOPPED</span></Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The coats ─────────────────────────
export const Coats: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const third = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}kitchen.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.4}} to={{s: 1.9, y: 60}} pos="76% 30%" />
      <Head at={2} until={third} top={170} size={96}>
        2 COATS <span style={{color: RED}}>GONE</span>
      </Head>
      <Head at={third} top={170} size={92}>
        1 COAT <span style={{color: '#ffd76a'}}>LEFT BEHIND</span>
      </Head>
      {frame >= third ? <div style={{position: 'absolute', left: 300, top: 560, width: 480, height: 700, border: `8px solid ${RED}`, borderRadius: '50%', opacity: p(frame, third + 4, 10), boxShadow: `0 0 30px ${RED}`}} /> : null}
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Rehook: without his coat ─────────────────────────
export const NoCoat: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Still src={`${AI}storm.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.8, y: 280}} to={{s: 2.2, y: 360}} pos="87% 20%" />
      <Rain />
      <Lightning at={[cue.w('storm')]} />
      <Head at={4} top={170} size={92}>
        WHERE WOULD HE GO <span style={{color: RED}}>WITHOUT HIS COAT?</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Gone ─────────────────────────
export const Gone: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [gone, never] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board dim={0.2} />
      <Stage>
        {[100, 395, 690].map((x, k) => (
          <React.Fragment key={x}>
            <Polaroid w={290} h={380} x={x} y={460} r={[-4, 2, 5][k]} show={p(frame, k * 6, 12)} caption={['DUCAT', 'MARSHALL', 'MACARTHUR'][k]}>
              <Silh h={360} />
            </Polaroid>
            {frame >= gone ? <Stamp2 at={gone + k * 8} x={x + 145} y={670} size={60} r={-14}>MISSING</Stamp2> : null}
          </React.Fragment>
        ))}
        {frame >= never ? <Stamp2 at={never + 6} x={540} y={1060} size={84} r={-4}>NEVER FOUND</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The legends ─────────────────────────
export const Legends: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [poem, log] = [cue.s(1), cue.s(2)];
  const lines = [{at: cue.s(3), t: 'Storm.'}, {at: cue.s(4), t: 'MacArthur crying.'}, {at: cue.s(5), t: 'God is over all.'}];
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.3]} />
      <Stage>
        <Card x={250} y={200} w={580} r={-1} show={p(frame, 2, 10)} size={60}>
          THE LEGENDS
        </Card>
        <Card x={60} y={520} w={440} r={-5} show={p(frame, poem, 10)} size={38}>
          POEM (1912):
          <div style={{fontSize: 34, color: '#7a2a20'}}>meal untouched · chair overturned</div>
        </Card>
        <div style={{position: 'absolute', left: 540, top: 560, width: 470, minHeight: 420, background: '#e9dcb8', boxShadow: '0 20px 40px #000c', transform: `rotate(4deg) scale(${lerp(1.3, 1, p(frame, log, 10))})`, opacity: p(frame, log, 8), padding: 30, boxSizing: 'border-box'}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 28, color: '#5a3a1a', borderBottom: '3px solid #5a3a1a'}}>"LOG ENTRIES"</div>
          {lines.map((l) => (
            <div key={l.t} style={{fontFamily: MARKER, fontSize: 44, color: INK, marginTop: 18, opacity: frame >= l.at ? 1 : 0}}>
              {l.t}
            </div>
          ))}
        </div>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Debunked ─────────────────────────
export const Debunk: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [fiction, fake] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Board light={[0.5, 0.3]} />
      <Stage>
        <Card x={60} y={520} w={440} r={-5} size={38}>
          POEM (1912):
          <div style={{fontSize: 34, color: '#7a2a20'}}>meal untouched · chair overturned</div>
        </Card>
        <div style={{position: 'absolute', left: 540, top: 560, width: 470, minHeight: 420, background: '#e9dcb8', boxShadow: '0 20px 40px #000c', transform: 'rotate(4deg)', padding: 30, boxSizing: 'border-box'}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 28, color: '#5a3a1a', borderBottom: '3px solid #5a3a1a'}}>"LOG ENTRIES"</div>
          {['Storm.', 'MacArthur crying.', 'God is over all.'].map((t) => (
            <div key={t} style={{fontFamily: MARKER, fontSize: 44, color: INK, marginTop: 18}}>{t}</div>
          ))}
        </div>
        <Head at={2} until={fiction} top={190} size={84}>
          NOT IN THE <span style={{color: RED}}>REAL RECORDS</span>
        </Head>
        {frame >= fiction ? <Stamp2 at={fiction} x={280} y={640} size={80}>FICTION</Stamp2> : null}
        {frame >= fake ? <Stamp2 at={fake} x={775} y={780} size={110} r={8}>FAKE</Stamp2> : null}
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The west landing ─────────────────────────
export const Landing: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rails, box, turf] = [cue.s(1), cue.s(2), cue.s(3)];
  const pos = frame >= box ? '27% 75%' : frame >= rails ? '80% 60%' : '25% 40%';
  return (
    <AbsoluteFill>
      <Still src={`${AI}wave.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.15}} to={{s: 1.35}} pos={pos} />
      <Head at={2} until={rails} top={170} size={92}>
        THE <span style={{color: '#9fc0ff'}}>WEST LANDING</span>
      </Head>
      <Head at={rails} until={box} top={170} size={96}>RAILINGS <span style={{color: RED}}>BENT</span></Head>
      <Head at={box} until={turf} top={170} size={96}>ROPE BOX <span style={{color: RED}}>GONE</span></Head>
      <Head at={turf} top={170} size={84}>TURF TORN <span style={{color: RED}}>HIGH ABOVE THE SEA</span></Head>
      <Rain amount={0.6} />
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Muirhead ─────────────────────────
export const Muirhead: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const wave = cue.w('wave');
  return (
    <AbsoluteFill>
      <Board />
      <Stage>
        <div style={{position: 'absolute', left: 120, top: 330, width: 840, background: PAPER, padding: '40px 50px', boxShadow: '0 20px 40px #000c', transform: `rotate(-1deg) translateY(${lerp(200, 0, p(frame, 0, 12))}px)`, boxSizing: 'border-box'}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 32, color: '#5a3a1a'}}>NORTHERN LIGHTHOUSE BOARD · DEC 1900</div>
          <div style={{fontFamily: DISPLAY, fontSize: 60, color: INK, marginTop: 20}}>ROBERT MUIRHEAD</div>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: INK}}>SUPERINTENDENT</div>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 40, color: INK, marginTop: 30, lineHeight: 1.4}}>
            FINDING: {frame >= wave ? <span style={{color: RED}}>SWEPT AWAY BY A WAVE</span> : '…'}
          </div>
        </div>
      </Stage>
      {frame >= wave ? (
        <AbsoluteFill style={{opacity: p(frame, wave, 14) * 0.9, top: 1000, height: 400}}>
          <Img src={staticFile(`${AI}wave.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '35% 40%', filter: 'brightness(0.8)'}} />
        </AbsoluteFill>
      ) : null}
      <LightSweep at={wave} color="#cfe0ff" strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · One theory ─────────────────────────
export const Theory: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const never = cue.s(1);
  return (
    <AbsoluteFill>
      <Still src={`${AI}storm.png`} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.5, y: 200}} to={{s: 1.9, y: 300}} pos="87% 25%" />
      <Rain />
      <Lightning at={[never - 6]} />
      <Head at={2} until={never} top={170} size={90}>
        ONE THEORY: <span style={{color: '#ffd76a'}}>HE RAN TO WARN THEM</span>
      </Head>
      <Head at={never} top={170} size={100}>
        HE NEVER <span style={{color: RED}}>MADE IT BACK</span>
      </Head>
      <AIC />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Ending + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sea, what, comment, cta] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Pic name="lighthouse.jpg" t={p(frame, 0, cta, (n) => n)} from={{s: 1.1}} to={{s: 1.3, y: 30}} pos="50% 50%" fallback="storm.png" fpos="61% 20%" />
        <Head at={0} until={sea} top={170} size={96}>NOBODY <span style={{color: RED}}>SAW IT</span></Head>
        <Head at={sea} until={what} top={170} size={90}>THE SEA <span style={{color: RED}}>NEVER GAVE THEM BACK</span></Head>
        <Head at={what} top={170} size={90}>
          WHAT HAPPENED ON <span style={{color: RED}}>EILEAN MÒR?</span>
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
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 110, color: RED, opacity: p(frame, cta, 8)}}>WATCH NEXT</div>
      <Polaroid src="flannan/cta/alcatraz.jpg" w={620} h={720} x={230} y={300} r={-2} show={p(frame, cta + 4, 12)} caption="ALCATRAZ" gray={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: p(frame, cta + 10, 8), zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: PAPER, paddingLeft: 10}}>▶</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────────────────────── Portrait thumbnail (Shorts cover) ─────────────────────────
export const FlannanThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`${AI}storm.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '75% 50%', filter: 'blur(18px) brightness(0.55)', transform: 'scale(1.1)'}} />
    <Img src={staticFile(`${AI}storm.png`)} style={{position: 'absolute', left: -1521, top: 150, width: 2667, height: 1500, filter: 'contrast(1.15) saturate(1.1)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000f0 0%, #00000080 14%, transparent 26%, transparent 62%, #000000f0 82%)'}} />
    {/* circle the three figures */}
    <div style={{position: 'absolute', left: 812 - 170, top: 733 - 110, width: 340, height: 220, border: `10px solid ${RED}`, borderRadius: '50%', boxShadow: `0 0 40px ${RED}`}} />
    <div style={{position: 'absolute', top: 70, left: 40, right: 40, textAlign: 'center', fontFamily: DISPLAY, fontSize: 190, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 0 #000, 0 0 40px #000'}}>
      3 MEN
      <br />
      <span style={{color: RED}}>VANISHED</span>
    </div>
    <div style={{position: 'absolute', bottom: 330, left: 40, right: 40, textAlign: 'center', fontFamily: DISPLAY, fontSize: 104, color: '#ffd76a', textShadow: '0 8px 0 #000'}}>ONE LEFT HIS COAT</div>
    <div style={{position: 'absolute', bottom: 230, left: 0, right: 0, textAlign: 'center', fontFamily: MARKER, fontSize: 64, color: '#fff', textShadow: '0 4px 0 #000'}}>Flannan Isles · 1900</div>
  </AbsoluteFill>
);
