import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {Stamp} from '../ui';
import {NightSky, Paper, Typed} from '../dbcooper/parts';
import {Dust, Fog, Parallax, Silhouette, TiltCard, has} from '../motion';
import {Bridge, Calendar, Clock, Crusher, Dig, Fedora, Furnace, GOLD, Helix, INK, Lot, Paws, Payphone, RED, Restaurant, Sedan, Stadium, TV, Truck} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const PH = 'hoffa/photos/';
const CR: Record<string, string> = {
  'hoffa.jpg': 'John Bottega · NYWTS / Library of Congress · public domain',
  'mugshot.jpg': 'Detroit Police, 1939 · public domain',
  'hoffa2.jpg': 'Wikimedia Commons · public domain',
  'hoffa1957.jpg': 'NYWTS / Library of Congress · public domain',
  'oconnell.jpg': 'Wikimedia Commons · CC BY-SA 4.0',
  'sonfather.jpg': 'NYWTS / Library of Congress · public domain',
  'rfk.jpg': 'NYWTS / Library of Congress · public domain',
  'nixon.jpg': 'White House photo · public domain',
};
/** First photo in the list that downloaded, with its credit. */
const pick = (...names: string[]): [string, string] => {
  const n = names.find((x) => has(`${PH}${x}`)) ?? 'hoffa.jpg';
  return [`${PH}${n}`, CR[n]];
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Tag: React.FC<{at: number; until?: number; children: React.ReactNode; top?: number; color?: string}> = ({at, until = 1e9, children, top = 150, color = GOLD}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <Center top={top} style={{opacity: p(frame, at, 8) * (1 - p(frame, until - 8, 8))}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 42, letterSpacing: 6, color, background: '#000000b8', padding: '8px 22px', borderRadius: 6}}>{children}</div>
    </Center>
  );
};
const Flash: React.FC<{at: number; color?: string}> = ({at, color = '#fff'}) => {
  const frame = useCurrentFrame();
  const o = frame >= at ? 1 - p(frame, at, 10) : 0;
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o * 0.55, mixBlendMode: 'screen'}} /> : null;
};
const Red: React.FC<{o?: number}> = ({o = 0.3}) => <AbsoluteFill style={{background: RED, mixBlendMode: 'color', opacity: o}} />;
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, transparent 35%, #000000dd 100%)'}} />;
/** Bills fluttering from (x0,y0) toward (x1,y1). */
const Money: React.FC<{show: number; x0: number; y0: number; x1: number; y1: number}> = ({show, x0, y0, x1, y1}) => {
  const frame = useCurrentFrame();
  if (show <= 0) return null;
  return (
    <>
      {Array.from({length: 14}, (_, i) => {
        const t = ((frame / 40 + i / 14) % 1) * show;
        return (
          <div key={i} style={{position: 'absolute', left: lerp(x0, x1, t) + Math.sin(frame / 8 + i) * 30, top: lerp(y0, y1, t) - Math.sin(t * Math.PI) * 140, width: 90, height: 40, background: '#8fb07a', border: '3px solid #3f5a32', borderRadius: 4, transform: `rotate(${frame * 4 + i * 40}deg)`, opacity: Math.sin(t * Math.PI)}} />
        );
      })}
    </>
  );
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [vanished, nobody, digging] = [cue.w('vanished'), cue.s(1), cue.s(3)];
  const [photo, credit] = pick('hoffa.jpg');
  if (frame >= digging) {
    const t = p(frame, digging, cue.dur - digging, (n) => n);
    return (
      <AbsoluteFill>
        <NightSky moon />
        <Fog amount={0.7} />
        <Center top={620}>
          <Dig width={900} dig={(frame - digging) / 26} />
        </Center>
        <Center top={240} style={{transform: `scale(${slam(frame, digging + 4, 1.8).scale})`, opacity: slam(frame, digging + 4).opacity}}>
          <div style={{fontFamily: DISPLAY, fontSize: 200, color: GOLD, textShadow: '0 10px 0 #000', lineHeight: 1}}>50 YEARS</div>
        </Center>
        <Tag at={digging + 10} top={1220} color={C.white}>
          FBI · STILL SEARCHING
        </Tag>
        <AbsoluteFill style={{background: '#000', opacity: 0.15 + 0.1 * t}} />
      </AbsoluteFill>
    );
  }
  if (frame >= nobody) {
    // The empty lot: his car alone under the lamps.
    return (
      <AbsoluteFill>
        <Lot lamp={0.9 + 0.1 * Math.sin(frame / 3)} />
        <div style={{position: 'absolute', left: 170, top: 960, transform: `scale(${lerp(1, 1.12, p(frame, nobody, 60, (n) => n))})`}}>
          <Sedan width={740} color="#2f5a3a" />
        </div>
        <Fog amount={0.6} />
        <Vignette />
      </AbsoluteFill>
    );
  }
  // Cold open: his face slams in, then fades out of the frame on "vanished".
  const gone = p(frame, vanished, 22);
  return (
    <AbsoluteFill>
      <Lot />
      <Center top={220} style={{opacity: (1 - gone) * p(frame, 0, 3), filter: `blur(${gone * 14}px)`}}>
        <TiltCard src={photo} width={720} height={880} rx={lerp(14, 4, p(frame, 0, 60))} ry={lerp(-16, 8, p(frame, 0, vanished))} scale={lerp(1.18, 1, p(frame, 0, 14))} gray={1} credit={credit} fallback={<Silhouette />} />
      </Center>
      <Stamp at={vanished} y={720} size={150} color={RED}>
        VANISHED
      </Stamp>
      <Flash at={vanished} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Jimmy Hoffa, the Teamsters ─────────────────────────
export const Name: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [teamsters, stop] = [cue.s(1), cue.s(2)];
  const [photo, credit] = pick('hoffa2.jpg', 'hoffa.jpg');
  if (frame >= teamsters) {
    // Convoy rolling, then everything brakes on "stopped".
    const halt = cue.w('stopped', 0);
    const speed = frame < halt ? 1 : Math.max(0, 1 - (frame - halt) / 12);
    const dist = frame < halt ? (frame - teamsters) * 22 : (halt - teamsters) * 22 + (1 - (1 - Math.min(1, (frame - halt) / 12)) ** 2) * 130;
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #b77a4a 0%, #e0a96d 38%, #3a3f46 39%, #23262a 100%)'}}>
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 14}, (_, i) => <rect key={i} x={((i * 160 - dist * 1.4) % 2240 + 2240) % 2240 - 200} y={1210} width={90} height={12} fill="#e8e2c8" opacity={0.6} />)}
        </svg>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{position: 'absolute', top: 560 + k * 230, left: ((k * 520 + dist * (0.6 + k * 0.2)) % 1900) - 760, transform: `translateY(${speed > 0.1 ? Math.sin(frame / 2 + k) * 2 : 0}px)`}}>
            <Truck width={680 - k * 60} color={['#c33b2f', '#2f6db3', '#d39a2c'][k]} />
          </div>
        ))}
        <Stamp at={halt} y={330} size={140} color={RED}>
          STOP
        </Stamp>
        <Tag at={teamsters + 6} until={halt - 2} top={260} color={C.white}>
          THE TEAMSTERS
        </Tag>
        <Dust amount={0.6} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Parallax src={photo} t={p(frame, 0, teamsters, (n) => n)} from={{s: 1.35, y: 60}} to={{s: 1.15, y: 0}} gray={1} dark={0.3} credit={credit} />
      <Tag at={6} top={1180} color={C.white}>
        JAMES R. "JIMMY" HOFFA
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Dark friends, the pension fund ─────────────────────────
export const DarkFriends: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const mob = cue.s(1);
  const [photo, credit] = pick('hoffa1957.jpg', 'sonfather.jpg', 'hoffa.jpg');
  const flow = p(frame, mob, 20);
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <Parallax src={photo} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.2, x: -40}} to={{s: 1.35, x: 40}} gray={1} dark={lerp(0.3, 0.75, flow)} credit={credit} />
      <Red o={0.25 + 0.2 * flow} />
      {flow > 0 ? (
        <>
          <div style={{position: 'absolute', left: 60, top: 760, opacity: flow}}>
            <svg width={300} height={300} viewBox="0 0 300 300" style={{filter: 'drop-shadow(0 20px 30px #000)'}}>
              <rect x={10} y={10} width={280} height={280} rx={20} fill="#4a525c" stroke="#9aa3ad" strokeWidth={8} />
              <circle cx={150} cy={150} r={80} fill="#2e3a4a" stroke="#9aa3ad" strokeWidth={8} />
              {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={150} y1={150} x2={150 + Math.cos((a * Math.PI) / 180 + frame / 20) * 70} y2={150 + Math.sin((a * Math.PI) / 180 + frame / 20) * 70} stroke="#9aa3ad" strokeWidth={8} />)}
            </svg>
            <div style={{fontFamily: DISPLAY, fontSize: 44, color: GOLD, textAlign: 'center', marginTop: 10}}>PENSION FUND</div>
          </div>
          <Money show={flow} x0={300} y0={880} x1={760} y1={760} />
          {[0, 1, 2].map((k) => (
            <div key={k} style={{position: 'absolute', left: 650 + k * 110, top: 640 + (k % 2) * 60, opacity: p(frame, mob + k * 6, 12), transform: `translateY(${lerp(80, 0, p(frame, mob + k * 6, 12))}px)`}}>
              <Fedora size={200 - k * 20} />
            </div>
          ))}
        </>
      ) : null}
      <Fog amount={0.5} color="#e6b0b0" />
      <Vignette />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Robert Kennedy ─────────────────────────
export const Kennedy: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rfkAt, tv] = [cue.s(1), cue.s(2)];
  const [hp, hc] = pick('hoffa.jpg');
  const [rp, rc] = pick('rfk.jpg', 'hoffa2.jpg');
  const rfkOk = has(`${PH}rfk.jpg`);
  if (frame >= tv) {
    const t = p(frame, tv, 16);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #2a2018, #07090c 75%)'}}>
        <Center top={lerp(420, 300, t)} style={{transform: `scale(${lerp(0.7, 1, t)})`, opacity: t}}>
          <TV width={860}>
            <div style={{position: 'absolute', inset: 0, display: 'flex'}}>
              <Img src={staticFile(hp)} style={{width: '50%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)'}} />
              {rfkOk ? <Img src={staticFile(rp)} style={{width: '50%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)'}} /> : <div style={{width: '50%', background: '#222'}}><Silhouette /></div>}
            </div>
          </TV>
        </Center>
        <Tag at={tv + 10} top={1170} color={C.white}>
          SENATE RACKETS HEARINGS · 1957
        </Tag>
      </AbsoluteFill>
    );
  }
  const split = p(frame, rfkAt, 14);
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, transform: `translateX(${lerp(0, -270, split)}px)`}}>
        <Parallax src={hp} t={p(frame, 0, cue.dur, (n) => n)} from={{s: 1.2}} to={{s: 1.3}} gray={1} dark={0.4} credit={split < 0.5 ? hc : undefined} />
      </div>
      {split > 0 ? (
        <div style={{position: 'absolute', top: 0, right: 0, width: W / 2, height: 1920, transform: `translateX(${lerp(W / 2, 0, split)}px)`, overflow: 'hidden', borderLeft: `8px solid ${RED}`}}>
          {rfkOk ? <Img src={staticFile(rp)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', filter: 'grayscale(1) contrast(1.15) brightness(0.8)'}} /> : <Silhouette />}
          {rfkOk ? <div style={{position: 'absolute', left: 14, bottom: 150, fontSize: 18, fontWeight: 800, color: '#ffffff99', fontFamily: 'Inter'}}>{rc}</div> : null}
        </div>
      ) : null}
      {split > 0 ? (
        <Center top={760} style={{transform: `scale(${slam(frame, rfkAt + 6, 2).scale})`, opacity: slam(frame, rfkAt + 6).opacity}}>
          <div style={{fontFamily: DISPLAY, fontSize: 160, color: '#fff', background: RED, borderRadius: '50%', width: 230, height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px #000'}}>VS</div>
        </Center>
      ) : null}
      <Tag at={rfkAt + 8} top={160} color={C.white}>
        ROBERT F. KENNEDY
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Prison 1967 ─────────────────────────
const Bars: React.FC<{close: number}> = ({close}) => (
  <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 8}, (_, i) => <rect key={i} x={lerp(-160, 70 + i * 130, close)} y={0} width={36} height={1920} fill="#1c2430" stroke="#4a5666" strokeWidth={3} />)}
    <rect x={lerp(-1100, 0, close)} y={300} width={W} height={30} fill="#1c2430" />
    <rect x={lerp(-1100, 0, close)} y={1240} width={W} height={30} fill="#1c2430" />
  </svg>
);
export const Prison: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [year, sentence] = [cue.w('1967'), cue.s(2)];
  const [photo, credit] = pick('mugshot.jpg', 'hoffa.jpg');
  const close = p(frame, year, 12);
  const years = Math.min(13, Math.floor(p(frame, sentence, 24, (n) => n) * 13));
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <Center top={240}>
        <TiltCard src={photo} width={760} height={900} rx={6} ry={lerp(-10, 10, p(frame, 0, cue.dur, (n) => n))} gray={1} credit={credit} label="FEDERAL PRISON · 1967" fallback={<Silhouette />} />
      </Center>
      <Bars close={close} />
      <Flash at={year} color="#9fb4cf" />
      {frame >= sentence ? (
        <Center top={540} style={{transform: `scale(${slam(frame, sentence, 1.8).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 230, color: RED, textShadow: '0 0 40px #000, 0 10px 0 #000', lineHeight: 1}}>{years} YRS</div>
        </Center>
      ) : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Nixon sets him free ─────────────────────────
export const Nixon: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [condition, rule] = [cue.s(1), cue.s(2)];
  const [photo, credit] = pick('nixon.jpg', 'hoffa2.jpg');
  if (frame >= condition) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #2a2a2a, #07090c 75%)'}}>
        <Dust amount={0.6} />
        <Center top={300} style={{transform: `rotate(${lerp(-8, -2, p(frame, condition, 20))}deg) translateY(${lerp(400, 0, p(frame, condition, 16))}px)`}}>
          <Paper width={820}>
            <div style={{fontFamily: DISPLAY, fontSize: 56, letterSpacing: 4, borderBottom: '4px solid #1a1712', paddingBottom: 12}}>EXECUTIVE CLEMENCY · 1971</div>
            <div style={{marginTop: 30, fontSize: 46, lineHeight: 1.35, minHeight: 200}}>
              <Typed text={'CONDITION:\nNO UNION ACTIVITY\nUNTIL 1980.'} at={condition + 6} cps={26} style={{fontSize: 50}} />
            </div>
          </Paper>
        </Center>
        {frame >= rule ? (
          <Stamp at={cue.w('1980')} y={1000} size={120} color={RED} rotate={-12}>
            1980
          </Stamp>
        ) : null}
      </AbsoluteFill>
    );
  }
  const open = p(frame, cue.w('free'), 16);
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <Parallax src={photo} t={p(frame, 0, condition, (n) => n)} from={{s: 1.15}} to={{s: 1.3, y: 30}} gray={0.4} dark={0.3} credit={credit} />
      <Bars close={1 - open} />
      <Flash at={cue.w('free')} />
      <Tag at={8} top={1180} color={C.white}>
        PRESIDENT RICHARD NIXON · 1971
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · He wanted his throne back ─────────────────────────
export const Throne: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [want, men] = [cue.s(1), cue.s(2)];
  const [photo, credit] = pick('oconnell.jpg', 'hoffa2.jpg', 'hoffa.jpg');
  if (frame >= men) {
    // The chair, surrounded by shadows.
    const t = p(frame, men, 30);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #3a0c10, #050608 70%)'}}>
        <Center top={460}>
          <svg width={420} height={620} viewBox="0 0 420 620" style={{filter: `drop-shadow(0 0 40px ${RED})`}}>
            <path d="M 60 20 L 360 20 L 340 320 L 80 320 Z" fill="#5a1418" stroke={GOLD} strokeWidth={10} />
            <rect x={40} y={320} width={340} height={70} rx={10} fill="#7a1a1e" stroke={GOLD} strokeWidth={10} />
            <rect x={60} y={390} width={30} height={220} fill={GOLD} />
            <rect x={330} y={390} width={30} height={220} fill={GOLD} />
          </svg>
        </Center>
        {[-1, 1, -1, 1].map((side, k) => (
          <div key={k} style={{position: 'absolute', top: 520 + (k > 1 ? 220 : 0), left: side < 0 ? lerp(-300, 40 + (k > 1 ? 80 : 0), p(frame, men + k * 8, 16)) : undefined, right: side > 0 ? lerp(-300, 40 + (k > 1 ? 80 : 0), p(frame, men + k * 8, 16)) : undefined}}>
            <Fedora size={260 - (k > 1 ? 40 : 0)} />
          </div>
        ))}
        <AbsoluteFill style={{background: '#000', opacity: 0.1 + 0.2 * t}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Parallax src={photo} t={p(frame, 0, men, (n) => n)} from={{s: 1.4, x: 40}} to={{s: 1.15, x: -20}} gray={1} dark={0.35} credit={credit} />
      {frame >= want ? (
        <Center top={240} style={{opacity: slam(frame, want).opacity, transform: `scale(${slam(frame, want, 1.6).scale})`}}>
          <svg width={300} height={200} viewBox="0 0 300 200" style={{filter: `drop-shadow(0 0 30px ${GOLD})`}}>
            <path d="M 20 180 L 20 60 L 90 120 L 150 30 L 210 120 L 280 60 L 280 180 Z" fill={GOLD} stroke="#7a5a10" strokeWidth={8} />
          </svg>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · July 30, 1975 ─────────────────────────
export const TheDay: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [told, two] = [cue.s(1), cue.s(2)];
  if (frame >= told) {
    return (
      <AbsoluteFill>
        <Lot day={1} />
        <Center top={lerp(560, 480, p(frame, told, cue.dur - told, (n) => n))} style={{transform: `scale(${lerp(1, 1.1, p(frame, told, cue.dur - told, (n) => n))})`}}>
          <Restaurant width={1000} />
        </Center>
        <Tag at={told + 10} top={190} color={C.white}>
          MACHUS RED FOX · DETROIT
        </Tag>
        {frame >= two
          ? ['A DETROIT MOBSTER', 'A NJ UNION BOSS'].map((t, k) => {
              const at = k ? cue.w('Jersey') - 4 : two;
              const s = p(frame, at, 12);
              return (
                <div key={t} style={{position: 'absolute', top: 760, left: k ? 560 : 60, width: 460, opacity: s, transform: `translateY(${lerp(80, 0, s)}px) rotate(${k ? 3 : -3}deg)`, background: '#0b0d12ee', border: `5px solid ${RED}`, borderRadius: 16, padding: 20, textAlign: 'center'}}>
                  <Fedora size={170} color="#1c1f26" />
                  <div style={{fontFamily: DISPLAY, fontSize: 46, color: C.white}}>{t}</div>
                </div>
              );
            })
          : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #2a2018, #07090c 75%)'}}>
      <Dust />
      <Center top={360}>
        <Calendar month="JULY" day="30" year="1975" flip={p(frame, 2, 14)} />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Stood up ─────────────────────────
export const StoodUp: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nobody, called, stood] = [cue.s(1), cue.s(2), cue.s(3)];
  const minutes = 120 + Math.min(1, p(frame, 0, called, (n) => n)) * 15 + (frame >= called ? p(frame, called, cue.dur - called, (n) => n) * 10 : 0);
  if (frame >= called) {
    return (
      <AbsoluteFill>
        <Lot day={1} />
        <Center top={360} style={{transform: `translateX(${Math.sin(frame / 3) * (frame >= stood && frame < stood + 10 ? 10 : 0)}px)`}}>
          <Payphone size={420} hang={frame >= stood ? 1 : 0} />
        </Center>
        <div style={{position: 'absolute', right: 60, top: 160}}>
          <Clock size={240} minutes={minutes} />
        </div>
        <Tag at={called + 6} top={1170} color={C.white}>
          2:15 PM · CALLS HIS WIFE
        </Tag>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Lot day={1} />
      <Center top={300}>
        <Clock size={560} minutes={minutes} />
      </Center>
      {frame >= nobody ? (
        <Center top={980} style={{opacity: p(frame, nobody, 10)}}>
          <div style={{display: 'flex', gap: 50}}>
            {[0, 1].map((k) => (
              <div key={k} style={{opacity: 0.35, filter: 'blur(1px)', border: '6px dashed #ffffff66', borderRadius: 20, padding: 10}}>
                <Fedora size={150} color="#ffffff22" />
              </div>
            ))}
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Last seen ─────────────────────────
export const LastSeen: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const gone = cue.s(1);
  const [photo] = pick('hoffa.jpg');
  const fade = p(frame, gone, 26);
  const walk = p(frame, 0, gone, (n) => n);
  return (
    <AbsoluteFill>
      <Lot day={1} />
      <AbsoluteFill style={{background: '#1a1006', opacity: 0.35}} />
      <div style={{position: 'absolute', left: 90, top: 900}}>
        <Sedan width={620} color="#2f5a3a" />
      </div>
      {/* the man walking off: his photo as a cut-out silhouette that dissolves */}
      <div style={{position: 'absolute', left: lerp(640, 760, walk), top: 520, width: 260, height: 600, opacity: 1 - fade, filter: `blur(${fade * 20}px)`}}>
        <svg width={260} height={600} viewBox="0 0 260 600">
          <circle cx={130} cy={70} r={56} fill="#0b0d12" />
          <path d={`M 50 140 L 210 140 L 220 360 L 180 360 L ${170 + Math.sin(frame / 5) * 20} 600 L 140 600 L 130 400 L 120 600 L ${90 - Math.sin(frame / 5) * 20} 600 L 80 360 L 40 360 Z`} fill="#0b0d12" />
        </svg>
      </div>
      <div style={{position: 'absolute', right: 50, top: 140}}>
        <Clock size={220} minutes={165} />
      </div>
      <Tag at={6} until={gone} top={1170} color={C.white}>
        ~2:45 PM · LAST SEEN
      </Tag>
      {frame >= gone ? (
        <AbsoluteFill style={{opacity: p(frame, gone + 14, 20) * 0.9}}>
          <Img src={staticFile(photo)} style={{position: 'absolute', left: 240, top: 300, width: 600, height: 720, objectFit: 'cover', filter: 'grayscale(1) contrast(1.3)', opacity: 0.18, mixBlendMode: 'screen'}} />
        </AbsoluteFill>
      ) : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The green Pontiac ─────────────────────────
export const Pontiac: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [unlocked, nostruggle, nohoffa] = [cue.s(1), cue.s(2), cue.s(3)];
  const push = p(frame, 0, cue.dur, (n) => n);
  return (
    <AbsoluteFill>
      <Lot />
      <div style={{position: 'absolute', left: lerp(90, 40, push), top: 760, transform: `scale(${lerp(1.1, 1.35, push)})`, transformOrigin: '40% 50%'}}>
        <Sedan width={900} color="#2f5a3a" lights={0} />
      </div>
      {frame >= unlocked ? (
        <Center top={300} style={{opacity: slam(frame, unlocked).opacity, transform: `scale(${slam(frame, unlocked, 1.6).scale})`}}>
          <svg width={180} height={220} viewBox="0 0 180 220" style={{filter: `drop-shadow(0 0 20px ${GOLD})`}}>
            <path d={`M 40 100 L 40 60 Q 40 10 90 10 Q 140 10 140 60 L 140 ${lerp(100, 70, p(frame, unlocked, 10))}`} stroke={GOLD} strokeWidth={18} fill="none" transform={`translate(${p(frame, unlocked, 10) * 50} ${-p(frame, unlocked, 10) * 30})`} />
            <rect x={20} y={100} width={140} height={110} rx={16} fill={GOLD} />
          </svg>
        </Center>
      ) : null}
      {frame >= nostruggle ? (
        <Tag at={nostruggle} until={nohoffa} top={1170} color={C.white}>
          NO SIGNS OF A STRUGGLE
        </Tag>
      ) : null}
      <Stamp at={nohoffa} y={620} size={140} color={RED}>
        NO HOFFA
      </Stamp>
      <Fog amount={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Rehook: a different car ─────────────────────────
export const OtherCar: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const car = cue.w('different');
  const sweep = (frame % 80) / 80;
  return (
    <AbsoluteFill style={{background: '#030406'}}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="torch">
            <stop offset="0%" stopColor="#fff6c8" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#fff6c8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={200 + Math.sin(sweep * Math.PI * 2) * 300 + 340} cy={900 + Math.cos(sweep * Math.PI * 2) * 120} r={360} fill="url(#torch)" />
      </svg>
      <div style={{position: 'absolute', left: 100, top: 820, opacity: p(frame, car - 6, 14), transform: `scale(${lerp(0.9, 1.05, p(frame, car, cue.dur - car, (n) => n))})`}}>
        <Sedan width={880} color="#5a1a24" lights={frame >= car ? 1 : 0} glow={frame >= car ? '#5a1a2488' : undefined} />
      </div>
      <Flash at={car} color={RED} />
      <Center top={260} style={{opacity: p(frame, 4, 10)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 130, color: C.white, letterSpacing: 6, textShadow: '0 0 40px #000'}}>FBI</div>
      </Center>
      <Dust amount={0.8} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The maroon Mercury, the dogs, the DNA ─────────────────────────
export const Mercury: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [dogs, dna] = [cue.s(1), cue.s(2)];
  if (frame >= dna) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #0d1a2c, #03050a 75%)'}}>
        <div style={{position: 'absolute', left: 90, top: 280}}>
          <Helix height={900} />
        </div>
        <div style={{position: 'absolute', right: 80, top: 380, width: 480, height: 480, borderRadius: '50%', border: `12px solid ${C.white}`, overflow: 'hidden', background: '#e8e2d2', boxShadow: '0 0 60px #000'}}>
          <svg width={480} height={480} viewBox="0 0 480 480">
            <path d={`M 40 300 Q 160 ${200 + Math.sin(frame / 10) * 20} 260 260 T 460 180`} stroke="#3a2a1a" strokeWidth={9} fill="none" />
          </svg>
        </div>
        <div style={{position: 'absolute', right: 60, top: 850, width: 200, height: 40, background: '#c9ced4', transform: 'rotate(45deg)', borderRadius: 20}} />
        <Stamp at={cue.w('matched')} y={1060} x={640} size={110} color={RED}>
          DNA MATCH
        </Stamp>
        <Tag at={dna + 4} top={170} color={C.white}>
          FBI LAB · 2001
        </Tag>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Lot />
      <div style={{position: 'absolute', left: 60, top: 820, transform: `scale(${lerp(1.05, 1.2, p(frame, 0, dna, (n) => n))})`}}>
        <Sedan width={940} color="#5a1a24" />
      </div>
      <Tag at={6} until={dogs} top={200} color={C.white}>
        1975 MERCURY MARQUIS · BORROWED
      </Tag>
      {frame < dogs ? (
        <Center top={340} style={{opacity: p(frame, cue.w('Chuckie'), 10)}}>
          <div style={{background: '#0b0d12ee', border: `5px solid ${GOLD}`, borderRadius: 16, padding: '16px 30px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 20}}>
            <Fedora size={110} color="#2a2f38" />
            <div style={{fontFamily: DISPLAY, fontSize: 56, color: C.white, lineHeight: 1.05}}>
              CHUCKIE O'BRIEN
              <div style={{fontSize: 34, color: GOLD}}>HOFFA'S FOSTER SON</div>
            </div>
          </div>
        </Center>
      ) : null}
      <Paws show={p(frame, dogs, 50, (n) => n)} from={[1000, 1300]} to={[470, 930]} />
      {frame >= dogs ? (
        <div style={{position: 'absolute', left: 330, top: 820, width: 260, height: 160, borderRadius: 30, border: `8px solid ${GOLD}`, opacity: p(frame, dogs + 40, 10) * (0.6 + 0.4 * Math.sin(frame / 4)), boxShadow: `0 0 40px ${GOLD}`}} />
      ) : null}
      <Tag at={dogs + 44} top={200} color={GOLD}>
        SCENT · BACK SEAT
      </Tag>
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Never charged ─────────────────────────
export const NeverCharged: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const never = cue.s(1);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1b2230, #04060a 75%)'}}>
      <Fog amount={0.6} />
      <Center top={300}>
        <div style={{position: 'relative', width: 620, height: 760, background: '#0b0d12', border: '10px solid #efe6cf', borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 80px #000', transform: `rotate(${lerp(-5, 2, p(frame, 0, cue.dur, (n) => n))}deg)`}}>
          <Silhouette color="#3a4556" />
          <div style={{position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 52, color: C.white}}>CHUCKIE O'BRIEN</div>
          <div style={{position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', fontFamily: '"Courier New"', fontWeight: 700, fontSize: 34, color: GOLD}}>DENIED IT · DIED 2020</div>
        </div>
      </Center>
      <Stamp at={never} y={720} size={120} color="#4da3ff" rotate={-10}>
        NEVER CHARGED
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · Where is the body? ─────────────────────────
export const Rumors: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [stadium, crusher, furnace, sheeran, blood] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  if (frame < stadium) {
    return (
      <AbsoluteFill>
        <NightSky moon />
        <Center top={360} style={{transform: `scale(${slam(frame, 2, 2).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 700, color: RED, textShadow: `0 0 80px ${RED}`, lineHeight: 1}}>?</div>
        </Center>
      </AbsoluteFill>
    );
  }
  if (frame < sheeran) {
    const items = [
      {at: stadium, el: <Stadium width={760} />, label: 'GIANTS STADIUM?'},
      {at: crusher, el: <Crusher width={600} press={p(frame, crusher + 4, 14)} />, label: 'A CAR CRUSHER?'},
      {at: furnace, el: <Furnace width={560} />, label: 'A FURNACE?'},
    ];
    const cur = [...items].reverse().find((x) => frame >= x.at)!;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2a1416, #05060a 75%)'}}>
        <Center top={lerp(560, 420, p(frame, cur.at, 10))} style={{opacity: p(frame, cur.at, 6), transform: `scale(${lerp(0.8, 1, p(frame, cur.at, 10))})`}}>
          {cur.el}
        </Center>
        <Center top={230} style={{transform: `scale(${slam(frame, cur.at, 1.5).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, background: RED, padding: '4px 30px', borderRadius: 12}}>{cur.label}</div>
        </Center>
        <Dust />
      </AbsoluteFill>
    );
  }
  // Sheeran's confession, then the blood test.
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <Center top={260} style={{transform: `rotate(-3deg) translateY(${lerp(300, 0, p(frame, sheeran, 14))}px)`}}>
        <Paper width={840}>
          <div style={{fontFamily: DISPLAY, fontSize: 56, borderBottom: '4px solid #1a1712', paddingBottom: 10}}>THE CONFESSION · FRANK SHEERAN</div>
          <div style={{marginTop: 24, minHeight: 200}}>
            <Typed text={'"I SHOT HIM IN A HOUSE\nIN DETROIT."'} at={sheeran + 8} cps={24} style={{fontSize: 52}} />
          </div>
        </Paper>
      </Center>
      {frame >= blood ? (
        <>
          <Center top={760} style={{opacity: p(frame, blood, 10)}}>
            <svg width={300} height={260} viewBox="0 0 300 260">
              <path d="M 150 10 Q 230 120 230 170 A 80 80 0 0 1 70 170 Q 70 120 150 10 Z" fill="#8a1a20" />
            </svg>
          </Center>
          <Stamp at={cue.w("wasn't")} y={930} size={110} color="#4da3ff">
            NOT HOFFA'S
          </Stamp>
        </>
      ) : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · The digs ─────────────────────────
export const Digs: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const nothing = cue.s(1);
  const stops = [
    {at: 0, place: 'HORSE FARM · MILFORD, MI', year: '2006'},
    {at: cue.w('driveway'), place: 'DRIVEWAY · ROSEVILLE, MI', year: '2012'},
    {at: cue.w('field'), place: 'FIELD · OAKLAND TWP, MI', year: '2013'},
    {at: cue.w('2022'), place: 'UNDER A BRIDGE · JERSEY CITY, NJ', year: '2022'},
  ];
  const cur = [...stops].reverse().find((x) => frame >= x.at)!;
  const nj = cur.year === '2022';
  return (
    <AbsoluteFill>
      <NightSky moon={!nj} />
      {nj ? (
        <div style={{position: 'absolute', left: 0, top: 380, opacity: p(frame, cur.at, 10)}}>
          <Bridge width={W} />
        </div>
      ) : null}
      <Center top={640}>
        <Dig width={920} dig={frame >= nothing ? 0 : (frame - cur.at) / 22} />
      </Center>
      <Center top={220} style={{transform: `scale(${slam(frame, cur.at, 1.4).scale})`}}>
        <div style={{fontFamily: DISPLAY, fontSize: 170, color: GOLD, textShadow: '0 10px 0 #000', lineHeight: 1}}>{cur.year}</div>
      </Center>
      <Tag key={cur.place} at={cur.at + 4} top={1220} color={C.white}>
        {cur.place}
      </Tag>
      <Stamp at={nothing + 6} y={720} size={150} color={RED}>
        NOTHING
      </Stamp>
      <Fog amount={0.6} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · Declared dead, case open ─────────────────────────
export const Payoff: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [mob, open] = [cue.s(1), cue.s(2)];
  const [photo, credit] = pick('hoffa.jpg');
  if (frame >= open) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1e2a3a, #04060a 75%)'}}>
        <Center top={320} style={{transform: `rotate(${lerp(-6, -2, p(frame, open, 20))}deg) scale(${lerp(0.8, 1, p(frame, open, 14))})`}}>
          <div style={{width: 760, height: 560, background: '#c9a86a', borderRadius: 12, boxShadow: '0 40px 80px #000', position: 'relative', padding: 40, boxSizing: 'border-box'}}>
            <div style={{position: 'absolute', top: -50, left: 40, width: 260, height: 60, background: '#c9a86a', borderRadius: '12px 12px 0 0'}} />
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 44, color: '#3a2a10'}}>FBI · DETROIT FIELD OFFICE</div>
            <div style={{fontFamily: DISPLAY, fontSize: 110, color: '#3a2a10', marginTop: 30}}>HOFFEX</div>
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 38, color: '#3a2a10', marginTop: 20}}>JAMES R. HOFFA · MISSING 7/30/1975</div>
          </div>
        </Center>
        <Stamp at={open + 4} y={900} size={150} color="#2fbf71" rotate={-8}>
          CASE OPEN
        </Stamp>
      </AbsoluteFill>
    );
  }
  const grey = p(frame, 0, mob, (n) => n);
  return (
    <AbsoluteFill style={{background: '#07090c'}}>
      <Parallax src={photo} t={p(frame, 0, open, (n) => n)} from={{s: 1.1}} to={{s: 1.35, y: 40}} gray={1} dark={lerp(0.2, 0.7, grey)} credit={credit} />
      <Stamp at={cue.w('dead')} y={420} size={110} color={RED}>
        DECLARED DEAD · 1982
      </Stamp>
      {frame >= mob
        ? [0, 1, 2].map((k) => (
            <div key={k} style={{position: 'absolute', bottom: 520, left: 120 + k * 300, opacity: p(frame, mob + k * 8, 14) * 0.95}}>
              <Fedora size={220} />
            </div>
          ))
        : null}
      <Fog amount={0.6} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Question + CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [comment, cta] = [cue.s(1), cue.s(2)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Lot />
        <div style={{position: 'absolute', left: 170, top: 980}}>
          <Sedan width={740} color="#2f5a3a" />
        </div>
        <Center top={260} style={{transform: `scale(${slam(frame, 2, 1.6).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 130, color: C.white, textAlign: 'center', lineHeight: 1, textShadow: '0 10px 0 #000'}}>
            WHERE IS
            <br />
            <span style={{color: RED}}>HOFFA?</span>
          </div>
        </Center>
        {frame >= comment ? (
          <Center top={720} style={{opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: '#f2f2f2', padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #12202f 0%, #03060a 80%)'}}>
      <Fog amount={0.8} />
      <Center top={130} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 110, color: RED, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <Center top={300} style={{opacity: p(frame, cta + 4, 10), transform: `scale(${slam(frame, cta + 4, 1.3).scale * pulse})`}}>
        <div style={{width: 600}}>
          <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}88`, height: 700}}>
            <Img src={staticFile('hoffa/cta/dbcooper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: C.white, paddingLeft: 10}}>▶</div>
            </div>
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: C.white, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>D.B. COOPER: HE JUMPED AND VANISHED</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
