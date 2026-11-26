import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, rnd} from '../lib';
import {has} from '../motion';
import {Arrow, Card, Circle, Cutout, Grain, HAND, Headline, Hi, INK, Paper, PAPER2, Push, RED, Redact, SERIF, Stamp, Tape, TYPE, Typed, Woman, YELLOW, jitter, prog, useStep} from '../collage/parts';

export {RED};
export type SceneProps = {cue: Cues};
const PH = 'isdal/photos/';
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const CR: Record<string, string> = {
  'valley.jpg': 'Isdalen, Bergen · Reinhardheydt · public domain',
  'postcard.jpg': 'Isdalen postcard · National Library of Norway · public domain',
  'station.jpg': 'Bergen station · Ingolf (Flickr) · CC BY-SA 2.0',
  'cemetery.jpg': 'Møllendal cemetery, Bergen · Reinhardheydt · public domain',
};
const Credit: React.FC<{n?: string; t?: string}> = ({n, t}) => (n && !real(n) ? null : <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#00000099', zIndex: 8}}>{t ?? (n ? CR[n] : '')}</div>);
const Photo: React.FC<{n: string; x: number; y: number; w: number; h: number; r?: number; at?: number; seed?: number; caption?: string; from?: 'left' | 'right' | 'top' | 'bottom' | 'drop'; tone?: 'bw' | 'sepia' | 'color'}> = (p) => {
  const src = real(p.n);
  return src ? <Cutout src={src} {...p} /> : null;
};

// ── drawn props (paper-cut style) ──
const Umbrella: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 200 200"><path d="M10 100 Q100 0 190 100 Q160 85 145 100 Q125 82 100 100 Q75 82 55 100 Q40 85 10 100 Z" fill="#2a2a2a" /><path d="M100 100 L100 175 Q100 192 84 190" stroke="#2a2a2a" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>
);
const FurHat: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s * 0.7} viewBox="0 0 200 140"><path d="M20 110 Q20 20 100 18 Q180 20 180 110 Z" fill="#5a4636" /><rect x={10} y={100} width={180} height={34} rx={17} fill="#7a6250" />{Array.from({length: 30}, (_, i) => <line key={i} x1={20 + i * 5.5} y1={106} x2={18 + i * 5.5} y2={132} stroke="#3a2a1e" strokeWidth={2} />)}</svg>
);
const Bottle: React.FC<{s: number; label?: boolean}> = ({s, label = true}) => (
  <svg width={s * 0.4} height={s} viewBox="0 0 80 200"><path d="M30 0 L50 0 L50 50 Q72 64 72 96 L72 190 Q72 200 62 200 L18 200 Q8 200 8 190 L8 96 Q8 64 30 50 Z" fill="#3e5a3a" opacity={0.85} />{label ? <rect x={12} y={110} width={56} height={50} fill="#efe3c3" /> : <rect x={12} y={110} width={56} height={50} fill="none" stroke="#efe3c3" strokeDasharray="5 5" strokeWidth={3} />}</svg>
);
const Wig: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 200 200"><path d="M40 150 Q20 40 100 30 Q180 40 160 150 Q150 190 130 170 Q130 90 100 80 Q70 90 70 170 Q50 190 40 150 Z" fill="#6b4a2a" />{Array.from({length: 14}, (_, i) => <path key={i} d={`M${50 + i * 7} 60 Q${45 + i * 7} 120 ${55 + i * 7} 165`} stroke="#4a3018" strokeWidth={2} fill="none" />)}</svg>
);
const Glasses: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s * 0.4} viewBox="0 0 200 80"><circle cx={50} cy={40} r={34} fill="#cfe6f2" fillOpacity={0.35} stroke={INK} strokeWidth={8} /><circle cx={150} cy={40} r={34} fill="#cfe6f2" fillOpacity={0.35} stroke={INK} strokeWidth={8} /><path d="M84 38 Q100 26 116 38" stroke={INK} strokeWidth={8} fill="none" /></svg>
);
const Banknote: React.FC<{w: number}> = ({w}) => (
  <div style={{width: w, height: w * 0.48, background: 'linear-gradient(135deg,#c9b98a,#a8b48a)', border: '4px solid #5a5a3a', position: 'relative', boxShadow: '6px 8px 10px #0005'}}>
    <div style={{position: 'absolute', left: 16, top: 10, fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.12, color: '#3a3a20'}}>500</div>
    <div style={{position: 'absolute', right: 16, bottom: 8, fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.07, color: '#3a3a20'}}>DEUTSCHE MARK</div>
    <div style={{position: 'absolute', left: '38%', top: '18%', width: w * 0.22, height: w * 0.28, borderRadius: '50%', border: '3px solid #5a5a3a'}} />
  </div>
);
const Passport: React.FC<{w: number; n: number; at: number}> = ({w, n, at}) => (
  <div style={{width: w, height: w * 1.38, background: '#2c3a5a', border: '4px solid #1a2238', borderRadius: 8, padding: 14, boxSizing: 'border-box', boxShadow: '6px 8px 10px #0006'}}>
    <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.12, color: '#d8c27a', textAlign: 'center'}}>PASSPORT</div>
    <div style={{margin: '10px auto', width: w * 0.42, height: w * 0.42, borderRadius: '50%', border: '3px solid #d8c27a'}} />
    <div style={{background: '#efe7d2', padding: 6, fontFamily: TYPE, fontSize: w * 0.09, color: INK}}>
      NAME: <Redact at={at} w={w * 0.5} h={w * 0.08} />
      <br />No. {String(1000 + n * 137).slice(0, 4)}
    </div>
  </div>
);
const Notebook: React.FC<{w: number; at: number}> = ({w, at}) => {
  const lines = ['O 22 O 28 P', 'O 25 L 26 S', 'B 24 O 28', 'P 21 T 23 B', 'M 28 O 29 P'];
  return (
    <div style={{width: w, background: '#f4eed8', padding: '20px 26px', boxSizing: 'border-box', backgroundImage: 'repeating-linear-gradient(transparent 0 54px, #9bb6d688 54px 56px)', boxShadow: '8px 10px 12px #0005'}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: HAND, fontSize: w * 0.075, color: '#1d2a6a', height: 56, opacity: prog(useCurrentFrame(), at + i * 6, 6)}}>{l}</div>
      ))}
    </div>
  );
};

// ───────── 0 · Hook ─────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [labels, found] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper dark={0.15} />
      <Push dur={cue.dur} to={1.08}>
        <Photo n="valley.jpg" x={70} y={420} w={940} h={680} r={-2} seed={2} tone="bw" from="drop" />
        <div style={{position: 'absolute', left: 340, top: 640, zIndex: 3, ...jitterStyle(frame, 5)}}><Woman h={600} q /></div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
          <div key={k} style={{position: 'absolute', left: 60 + k * 100, top: 1080 + (k % 2) * 30, transform: `rotate(${(k - 4) * 6}deg)`, zIndex: 4, opacity: frame >= 4 + k * 3 ? 1 : 0}}>
            <Passport w={120} n={k} at={8 + k * 3} />
          </div>
        ))}
      </Push>
      <Headline at={0} until={labels}>9 Fake Names</Headline>
      {frame >= labels && frame < found ? <Headline at={labels}>Labels Scraped Off</Headline> : null}
      {frame >= found ? <Headline at={found}>Who Was She?</Headline> : null}
      {frame >= found ? <Stamp at={found + 10} x={540} y={900} size={96}>UNIDENTIFIED</Stamp> : null}
      <Credit n="valley.jpg" />
      <Grain />
    </AbsoluteFill>
  );
};
function jitterStyle(frame: number, seed: number) {
  const j = jitter(frame, seed, 3);
  return {transform: `translate(${j.x}px, ${j.y}px) rotate(${j.r}deg)`};
}

// ───────── 1 · The valley ─────────
export const Valley: React.FC<SceneProps> = ({cue}) => {
  const [bergen, hikers] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper />
      <Push dur={cue.dur}>
        <Photo n="postcard.jpg" x={90} y={360} w={900} h={640} r={2} seed={4} tone="sepia" from="right" />
        <Card x={140} y={1040} w={800} r={-2} at={bergen}>
          <Typed at={bergen} text={'29 NOV 1970 · BERGEN, NORWAY'} size={44} />
        </Card>
        <Card x={260} y={1170} w={560} r={3} at={hikers} bg={YELLOW}>
          <div style={{fontFamily: HAND, fontSize: 52, color: INK, textAlign: 'center'}}>"Death Valley"</div>
        </Card>
      </Push>
      <Headline at={2}>Isdalen</Headline>
      <Credit n="postcard.jpg" />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 2 · The body and the objects ─────────
export const Found: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [burned, items] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper tone={PAPER2} dark={0.1} />
      <Push dur={cue.dur} to={1.06}>
        <Photo n="valley.jpg" x={160} y={330} w={760} h={520} r={-3} seed={6} tone="bw" />
        <div style={{position: 'absolute', left: 330, top: 900, transform: 'rotate(-80deg)', zIndex: 3, opacity: frame >= 6 ? 1 : 0}}><Woman h={420} color="#2a1a10" /></div>
        {frame >= burned ? <div style={{position: 'absolute', left: 380, top: 860, width: 320, height: 200, borderRadius: '50%', background: 'radial-gradient(#000c, #5a1a0a88 55%, transparent 70%)', zIndex: 3, opacity: prog(frame, burned, 10)}} /> : null}
        {frame >= items ? <div style={{position: 'absolute', left: 80, top: 1060, zIndex: 4, opacity: prog(frame, items, 6)}}><Umbrella s={240} /></div> : null}
        {frame >= items + 8 ? <div style={{position: 'absolute', left: 390, top: 1110, zIndex: 4}}><FurHat s={260} /></div> : null}
        {frame >= items + 16 ? <div style={{position: 'absolute', left: 760, top: 1020, zIndex: 4, transform: 'rotate(18deg)'}}><Bottle s={240} /></div> : null}
      </Push>
      <Headline at={2} size={76}>A Woman Among the Rocks</Headline>
      {frame >= burned ? <Stamp at={burned} x={780} y={480} size={64} r={8}>BURNED</Stamp> : null}
      <Credit n="valley.jpg" />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 3 · Labels removed ─────────
export const Labels: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [clothes, bottles, all] = [cue.s(1), cue.s(2), cue.s(3)];
  const tag = (x: number, y: number, at: number, r: number, word: string) => (
    <Card x={x} y={y} w={300} r={r} at={at}>
      <div style={{fontFamily: TYPE, fontSize: 30, color: INK}}>{word}</div>
      <div style={{marginTop: 10, height: 70, background: '#e8dcc0', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 10, background: `repeating-linear-gradient(45deg, ${INK} 0 6px, transparent 6px 14px)`, opacity: 0.85 * prog(frame, at + 6, 8)}} />
      </div>
      <div style={{fontFamily: HAND, fontSize: 34, color: RED, marginTop: 6}}>label removed</div>
    </Card>
  );
  return (
    <AbsoluteFill>
      <Paper />
      {tag(90, 420, 4, -4, 'COAT · SIZE —')}
      {tag(620, 520, clothes, 5, 'SKIRT · BRAND —')}
      {frame >= bottles ? <div style={{position: 'absolute', left: 200, top: 820, zIndex: 3}}><Bottle s={300} label={false} /></div> : null}
      {frame >= bottles ? <div style={{position: 'absolute', left: 520, top: 860, zIndex: 3, transform: 'rotate(-12deg)'}}><Bottle s={260} label={false} /></div> : null}
      <Headline at={2} size={80}>Every Label <span style={{color: RED}}>Removed</span></Headline>
      {frame >= all ? <Stamp at={all} x={540} y={1180} size={86}>NO TRACE</Stamp> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 4 · Autopsy ─────────
export const Autopsy: React.FC<SceneProps> = ({cue}) => {
  const bruise = cue.s(1);
  return (
    <AbsoluteFill>
      <Paper />
      <Card x={90} y={360} w={900} h={820} r={-1} at={2} ruled>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: INK}}>AUTOPSY REPORT</div>
        <div style={{fontFamily: TYPE, fontSize: 30, color: '#5a4a3a', marginBottom: 20}}>Case: unidentified female · Bergen 1970</div>
        <div style={{fontFamily: TYPE, fontSize: 46, color: INK, lineHeight: 1.9}}>
          <div>Sleeping pills: <Hi at={20}>50+ tablets</Hi></div>
          <div>Carbon monoxide: <Hi at={40}>in the lungs</Hi></div>
          <div>Neck: <Hi at={bruise} color="#ff9a9a">bruise</Hi></div>
        </div>
      </Card>
      <Circle x={150} y={890} w={780} h={90} at={bruise + 6} />
      <Headline at={2} size={80}>Cause of Death?</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 5 · Suitcases at the station ─────────
export const Station: React.FC<SceneProps> = ({cue}) => (
  <AbsoluteFill>
    <Paper />
    <Push dur={cue.dur}>
      <Photo n="station.jpg" x={70} y={380} w={940} h={640} r={-2} seed={8} tone="sepia" from="left" />
      <Card x={180} y={1060} w={720} r={2} at={14}>
        <Typed at={14} text={'LEFT LUGGAGE · 2 SUITCASES'} size={44} />
      </Card>
    </Push>
    <Headline at={2} size={80}>Bergen Train Station</Headline>
    <Credit n="station.jpg" />
    <Grain />
  </AbsoluteFill>
);

// ───────── 6 · What was inside ─────────
export const Inside: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [glasses, marks, book] = [cue.s(1), cue.s(2), cue.s(3)];
  const drop = (at: number) => ({opacity: frame >= at ? 1 : 0, transform: `scale(${1 + 0.3 * (1 - prog(frame, at, 6))})`});
  return (
    <AbsoluteFill>
      <Paper tone={PAPER2} />
      <div style={{position: 'absolute', left: 80, top: 330, width: 920, height: 900, background: '#5a3e28', borderRadius: 30, border: '14px solid #3a2616', boxShadow: 'inset 0 0 60px #0008'}} />
      <div style={{position: 'absolute', left: 120, top: 380, ...drop(4)}}><Wig s={330} /></div>
      <div style={{position: 'absolute', left: 520, top: 420, ...drop(glasses)}}><Glasses s={380} /></div>
      <div style={{position: 'absolute', left: 140, top: 780, transform: `rotate(-6deg) ${drop(marks).transform}`, opacity: drop(marks).opacity}}><Banknote w={420} /></div>
      {frame >= book ? <div style={{position: 'absolute', left: 560, top: 680, transform: 'rotate(5deg)'}}><Notebook w={380} at={book} /></div> : null}
      <Headline at={2} size={76}>Inside the Suitcases</Headline>
      {frame >= glasses ? <Card x={540} y={600} w={400} r={-3} at={glasses + 6}><div style={{fontFamily: HAND, fontSize: 34, color: RED}}>plain glass — not real lenses</div></Card> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 7 · Code cracked: a route ─────────
const CITIES: [string, number, number][] = [['PARIS', 300, 1080], ['BASEL', 520, 1000], ['OSLO', 640, 560], ['TRONDHEIM', 520, 420], ['STAVANGER', 360, 680], ['BERGEN', 260, 560]];
export const Route: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const europe = cue.s(2);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 80, top: 360, width: 920, height: 860, background: '#d7cfb4', border: '6px solid #b0a483', boxShadow: '8px 10px 14px #0005'}}>
        {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 72, height: 2, background: '#b0a48366'}} />)}
      </div>
      {CITIES.map(([n, x, y], i) => {
        const at = 6 + i * 10 + (i < 2 ? europe - 20 : 0);
        return frame >= at ? (
          <div key={n} style={{position: 'absolute', left: x, top: y, zIndex: 4}}>
            <div style={{width: 30, height: 30, borderRadius: '50%', background: RED, border: `4px solid ${INK}`}} />
            <div style={{fontFamily: TYPE, fontSize: 34, color: INK, background: '#f8f3e3', padding: '2px 8px', marginTop: 6}}>{n}</div>
          </div>
        ) : null;
      })}
      <svg style={{position: 'absolute', left: 0, top: 0, zIndex: 3}} width={1080} height={1920}>
        <path d={`M${CITIES.map(([, x, y]) => `${x + 15} ${y + 15}`).join(' L')}`} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="14 10" opacity={Math.min(1, frame / 60)} />
      </svg>
      <Headline at={2} size={76}>The Code = Her Route</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 8 · Nine names ─────────
export const Names: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const nine = cue.s(1);
  const n = Math.min(9, Math.max(0, Math.floor((frame - nine) / 4) + 1));
  return (
    <AbsoluteFill>
      <Paper />
      {Array.from({length: 9}, (_, k) => (
        <div key={k} style={{position: 'absolute', left: 90 + (k % 3) * 310, top: 360 + Math.floor(k / 3) * 300, transform: `rotate(${(rnd(k) - 0.5) * 14}deg)`, opacity: k < n || frame < nine ? (k < 3 || frame >= nine ? 1 : 0) : 0, zIndex: 2}}>
          <Passport w={200} n={k} at={nine + k * 4} />
        </div>
      ))}
      <Headline at={2} size={80}>Hotel Registers</Headline>
      {frame >= nine ? <Stamp at={nine + 36} x={540} y={1300} size={90}>{`${n} NAMES`}</Stamp> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 9 · Hotel staff ─────────
export const Staff: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const rooms = cue.s(1);
  const langs = ['DEUTSCH', 'FRANÇAIS', 'VLAAMS', 'ENGLISH'];
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 120, top: 420, ...jitterStyle(frame, 9)}}><Woman h={760} /></div>
      {langs.map((l, i) => (
        <Card key={l} x={560} y={400 + i * 150} w={420} r={(i % 2 ? 1 : -1) * 3} at={20 + i * 10}>
          <div style={{fontFamily: TYPE, fontSize: 46, color: INK}}>{l}</div>
        </Card>
      ))}
      {frame >= rooms ? (
        <Card x={540} y={1030} w={460} r={-2} at={rooms} bg={YELLOW}>
          <div style={{fontFamily: HAND, fontSize: 40, color: INK}}>"Can I change rooms?"</div>
        </Card>
      ) : null}
      <Headline at={2} size={76}>Elegant · Quiet · ~30</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 10 · Checked out, 6 days ─────────
export const Checkout: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const six = cue.s(1);
  const day = Math.min(29, 23 + Math.max(0, Math.floor((frame - six) / 8)));
  return (
    <AbsoluteFill>
      <Paper />
      <Card x={100} y={380} w={880} r={-1} at={2} ruled>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: INK}}>HOTEL REGISTER</div>
        <div style={{fontFamily: TYPE, fontSize: 40, color: INK, lineHeight: 2}}>
          <div>Room 407 · Guest: <Redact at={10} w={260} /></div>
          <div>Check-out: <Hi at={24}>23 NOV 1970</Hi></div>
          <div>Payment: <Hi at={40}>CASH</Hi></div>
        </div>
      </Card>
      {frame >= six ? (
        <div style={{position: 'absolute', left: 300, top: 900, width: 480, height: 420, background: '#f8f3e3', border: `6px solid ${INK}`, boxShadow: '8px 10px 12px #0005', textAlign: 'center', zIndex: 3}}>
          <div style={{background: RED, color: '#fff', fontFamily: SERIF, fontWeight: 900, fontSize: 56}}>NOVEMBER</div>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 260, color: INK, lineHeight: 1.2}}>{day}</div>
        </div>
      ) : null}
      <Headline at={2} size={76}>She Walked Away</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 11 · Suicide? ─────────
export const Suicide: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [how, why] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper />
      <Card x={120} y={380} w={840} h={600} r={1} at={2} ruled>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: INK}}>POLICE CONCLUSION</div>
        <div style={{fontFamily: TYPE, fontSize: 42, color: INK, marginTop: 30}}>Cause: <Hi at={14}>SUICIDE</Hi></div>
      </Card>
      <Stamp at={20} x={560} y={800} size={90}>CASE CLOSED</Stamp>
      {frame >= how ? <div style={{position: 'absolute', left: 120, top: 1040, fontFamily: HAND, fontSize: 64, color: RED, transform: 'rotate(-4deg)', zIndex: 6}}>pills + fire??</div> : null}
      {frame >= why ? <div style={{position: 'absolute', left: 560, top: 1130, fontFamily: HAND, fontSize: 64, color: RED, transform: 'rotate(5deg)', zIndex: 6}}>why erase herself?</div> : null}
      <Headline at={2} size={76}>Suicide?</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 12 · Spy theory ─────────
export const Spy: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [cold, tests] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper tone="#c9c2ad" dark={0.12} />
      <Card x={120} y={380} w={840} r={-2} at={2} bg="#e9e2c8">
        <div style={{fontFamily: TYPE, fontSize: 36, color: INK}}>FILE: <Redact at={6} w={300} /></div>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: INK, marginTop: 10}}>COLD WAR · 1970</div>
      </Card>
      {frame >= tests ? (
        <div style={{position: 'absolute', left: 120, top: 760, zIndex: 3, transform: `translateX(${(1 - prog(frame, tests, 14)) * -600}px) rotate(-10deg)`}}>
          <svg width={840} height={200} viewBox="0 0 840 200"><path d="M20 100 L640 80 Q760 82 820 100 Q760 118 640 120 L20 100 Z" fill="#3a3f45" /><path d="M120 92 L60 20 L110 20 L200 90 Z M120 108 L60 180 L110 180 L200 110 Z M600 88 L560 50 L600 50 L650 86 Z M600 112 L560 150 L600 150 L650 114 Z" fill="#3a3f45" /><text x={330} y={112} fontFamily="Special Elite" fontSize={34} fill="#ece2cc">PENGUIN</text></svg>
        </div>
      ) : null}
      {frame >= cold ? <Stamp at={cold} x={760} y={660} size={64} r={10}>TOP SECRET</Stamp> : null}
      <Headline at={2} size={80}>Was She a Spy?</Headline>
      {frame >= tests ? <Credit t="Illustration of a Penguin anti-ship missile" /> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 13 · Funeral ─────────
export const Funeral: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [buried, police] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Paper dark={0.08} />
      <Push dur={cue.dur}>
        <Photo n="cemetery.jpg" x={80} y={380} w={920} h={660} r={2} seed={11} tone="bw" from="drop" />
        {frame >= buried ? <Card x={180} y={1060} w={720} r={-2} at={buried}><Typed at={buried} text={'5 FEB 1971 · CATHOLIC RITES'} size={40} /></Card> : null}
        {frame >= police ? (
          <div style={{position: 'absolute', left: 140, top: 820, display: 'flex', gap: 10, zIndex: 4}}>
            {Array.from({length: 6}, (_, i) => <div key={i} style={{width: 90, height: 220, background: INK, borderRadius: '40px 40px 6px 6px', opacity: prog(frame, police + i * 3, 5)}} />)}
          </div>
        ) : null}
      </Push>
      <Headline at={2} size={76}>No Name on the Grave</Headline>
      <Credit n="cemetery.jpg" />
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 14 · Zinc coffin → reopened ─────────
export const Zinc: React.FC<SceneProps> = ({cue}) => {
  const reopened = cue.s(1);
  return (
    <AbsoluteFill>
      <Paper tone={PAPER2} />
      <div style={{position: 'absolute', left: 200, top: 520, width: 680, height: 520, background: 'linear-gradient(135deg,#b8bec4,#7d858c 60%,#a9b0b6)', clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 80% 100%, 20% 100%, 0 30%)', boxShadow: '0 0 0 #000', zIndex: 2}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 740, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: '#2a2f34', zIndex: 3}}>Zn</div>
      <Headline at={2} size={76}>A Zinc Coffin</Headline>
      <Stamp at={reopened} x={540} y={1180} size={86}>REOPENED 2016</Stamp>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 15 · Teeth → birthplace ─────────
export const Teeth: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const chem = cue.s(1);
  return (
    <AbsoluteFill>
      <Paper />
      <Card x={90} y={360} w={420} h={420} r={-3} at={2}>
        <svg width={360} height={360} viewBox="0 0 200 200"><path d="M50 30 Q100 0 150 30 Q175 70 160 110 Q150 190 130 190 Q115 190 110 130 Q100 110 90 130 Q85 190 70 190 Q50 190 40 110 Q25 70 50 30 Z" fill="#fffaf0" stroke={INK} strokeWidth={6} /></svg>
      </Card>
      <Card x={560} y={380} w={430} r={2} at={14} ruled>
        <div style={{fontFamily: TYPE, fontSize: 32, color: INK}}>ISOTOPE ANALYSIS</div>
        {['O-18', 'Sr-87', 'C-13'].map((k, i) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}>
            <div style={{fontFamily: TYPE, fontSize: 28, width: 90}}>{k}</div>
            <div style={{height: 26, width: 220 * prog(frame, 20 + i * 8, 14) * (0.5 + rnd(i) * 0.5), background: RED}} />
          </div>
        ))}
      </Card>
      {frame >= chem ? (
        <>
          <Card x={140} y={880} w={420} r={-2} at={chem} bg={YELLOW}><div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: INK}}>NUREMBERG<br />~1930</div></Card>
          <Arrow x1={540} y1={980} x2={760} y2={1150} at={chem + 20} />
          <Card x={640} y={1150} w={360} r={3} at={chem + 30}><div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 42, color: INK}}>→ FRENCH BORDER</div></Card>
        </>
      ) : null}
      <Headline at={2} size={76}>Her Teeth Talked</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 16 · DNA to the world ─────────
export const Dna: React.FC<SceneProps> = () => {
  const frame = useStep();
  return (
    <AbsoluteFill>
      <Paper />
      <svg style={{position: 'absolute', left: 390, top: 380}} width={300} height={760} viewBox="0 0 300 760">
        {Array.from({length: 20}, (_, k) => {
          const y = 20 + k * 36;
          const ph = frame / 10 + k * 0.5;
          const x1 = 150 + Math.sin(ph) * 110;
          const x2 = 150 - Math.sin(ph) * 110;
          return (
            <g key={k}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={k % 3 ? INK : RED} strokeWidth={6} />
              <circle cx={x1} cy={y} r={9} fill={INK} />
              <circle cx={x2} cy={y} r={9} fill={INK} />
            </g>
          );
        })}
      </svg>
      <Stamp at={20} x={540} y={760} size={70} r={-6}>SHARED WORLDWIDE</Stamp>
      <Headline at={2} size={76}>Any Match?</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 17 · Still no name ─────────
export const NoName: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  return (
    <AbsoluteFill>
      <Paper dark={0.2} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', ...jitterStyle(frame, 17)}}><Woman h={720} q /></div>
      <Card x={240} y={1140} w={600} r={-2} at={6}>
        <div style={{fontFamily: TYPE, fontSize: 44, color: INK}}>NAME: <span style={{borderBottom: `4px solid ${INK}`, display: 'inline-block', width: 300}} /></div>
      </Card>
      <Headline at={2} size={80}>Still No Name</Headline>
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── 18 · Ending + CTA ─────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useStep();
  const [three, comment, cta, follow] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Paper />
        {['SPY', 'SMUGGLER', 'RUNNING'].map((w, i) => (
          <Card key={w} x={120 + i * 290} y={560 + (i % 2) * 120} w={260} r={(i - 1) * 6} at={three + i * 8}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: INK, textAlign: 'center'}}>{w}?</div>
          </Card>
        ))}
        {frame >= comment ? <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`, zIndex: 6}}><div style={{fontFamily: HAND, fontSize: 70, color: '#fff', background: RED, padding: '6px 36px', borderRadius: 12}}>👇 COMMENT</div></div> : null}
        <Headline at={2} size={80}>Who Was She?</Headline>
        <Grain />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Paper />
      <Cutout src="isdal/cta/somerton.jpg" x={230} y={320} w={620} h={760} r={-3} at={cta} seed={21} tone="color" caption="THE SOMERTON MAN" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center', zIndex: 6}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: '5px solid #f8f3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#f8f3e3', paddingLeft: 10}}>▶</div>
      </div>
      <Headline at={cta} size={80}>Watch Next</Headline>
      {frame >= follow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${pulse})`, zIndex: 6}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 60, color: '#fff', background: '#e62117', padding: '12px 48px', borderRadius: 60}}>FOLLOW</div>
          <div style={{fontFamily: HAND, fontSize: 44, color: INK}}>a new mystery every day</div>
        </div>
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ───────── Portrait thumbnail ─────────
export const IsdalThumb: React.FC = () => (
  <AbsoluteFill>
    <Paper dark={0.1} />
    {real('valley.jpg') ? <Cutout src={real('valley.jpg') as string} x={60} y={520} w={960} h={700} r={-3} seed={2} tone="bw" /> : null}
    <div style={{position: 'absolute', left: 300, top: 720, zIndex: 3}}><Woman h={640} q /></div>
    {[0, 1, 2, 3, 4].map((k) => (
      <div key={k} style={{position: 'absolute', left: 80 + k * 190, top: 1260 + (k % 2) * 30, transform: `rotate(${(k - 2) * 8}deg)`, zIndex: 4}}><Passport w={150} n={k} at={0} /></div>
    ))}
    <div style={{position: 'absolute', top: 90, left: 40, right: 40, textAlign: 'center', zIndex: 6}}>
      <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 120, lineHeight: 1.05, color: INK, background: '#f8f3e3', padding: '6px 24px', boxShadow: '10px 12px 0 #0006', textTransform: 'uppercase'}}>9 Fake Names</span>
    </div>
    <div style={{position: 'absolute', top: 330, left: 40, right: 40, textAlign: 'center', zIndex: 6}}>
      <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: '#fff', background: RED, padding: '4px 20px', textTransform: 'uppercase'}}>Still No Name</span>
    </div>
    <Tape x={120} y={500} r={-20} />
    <Tape x={820} y={500} r={18} />
    <div style={{position: 'absolute', bottom: 170, left: 0, right: 0, textAlign: 'center', fontFamily: TYPE, fontSize: 52, color: INK, zIndex: 6}}>THE ISDAL WOMAN · 1970</div>
  </AbsoluteFill>
);
