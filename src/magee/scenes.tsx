import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p, rnd} from '../lib';
import {CREAM, Flash, GOLD, INK, Man, NAVY, Poster, Rays, RED} from '../dillinger/parts';

export {RED};
export type SceneProps = {cue: Cues; beat: (f: number) => number};
const PH = 'magee/photos/';
const SKY = '#7fa7c9';
const lin = (n: number) => n;

const pop = (frame: number, at: number) => {
  const t = Math.min(1, p(frame, at, 8));
  return {opacity: frame >= at ? 1 : 0, transform: `scale(${frame >= at ? 1 + 0.2 * (1 - t) : 0.7})`};
};
const Title: React.FC<{at: number; until?: number; top?: number; size?: number; color?: string; shadow?: string; children: React.ReactNode}> = ({at, until = 1e9, top = 170, size = 110, color = CREAM, shadow = INK, children}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  return <div style={{position: 'absolute', left: 40, right: 40, top, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, textShadow: `6px 6px 0 ${shadow}`, ...pop(frame, at), zIndex: 5}}>{children}</div>;
};
const Tag: React.FC<{at: number; x: number; y: number; r?: number; size?: number; bg?: string; color?: string; children: React.ReactNode}> = ({at, x, y, r = -6, size = 64, bg = RED, color = CREAM, children}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) ${pop(frame, at).transform}`, fontFamily: DISPLAY, fontSize: size, color, background: bg, padding: '6px 26px', border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, whiteSpace: 'nowrap', zIndex: 6}}>{children}</div>;
};
const Credit: React.FC<{t: string}> = ({t}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffffaa', zIndex: 7}}>{t}</div>;
const Photo: React.FC<{src: string; t: number}> = ({src, t}) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.15, 1.3, t)})`, filter: 'grayscale(1) contrast(1.25) sepia(0.3) brightness(0.8)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #000000aa, transparent 30%, transparent 60%, #000000cc)'}} />
  </AbsoluteFill>
);

/** B-17 silhouette, top-down-ish 3/4 side view. */
const B17: React.FC<{w: number; color?: string; smoke?: number; tilt?: number}> = ({w, color = INK, smoke = 0, tilt = 0}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={w * 0.67} viewBox="0 0 600 400" style={{overflow: 'visible', transform: `rotate(${tilt}deg)`}}>
      {smoke > 0
        ? Array.from({length: 14}, (_, i) => <circle key={i} cx={360 + i * 22 + Math.sin(frame / 5 + i) * 6} cy={120 - i * 6} r={12 + i * 3} fill="#333" opacity={smoke * (1 - i / 14) * 0.7} />)
        : null}
      <g fill={color}>
        {/* plan view: fuselage, straight wings with 4 engines, tailplane */}
        <path d="M40 182 L470 176 Q560 178 585 200 Q560 222 470 224 L40 218 Q24 200 40 182 Z" />
        <path d="M250 182 L292 10 L332 10 L326 182 Z M250 218 L292 390 L332 390 L326 218 Z" />
        {[60, 120, 280, 340].map((y) => <rect key={y} x={300} y={y - 13} width={70} height={26} rx={12} />)}
        <path d="M40 186 L80 110 L118 110 L104 188 Z M40 214 L80 290 L118 290 L104 212 Z" />
      </g>
    </svg>
  );
};
/** Flak bursts (black puffs with orange cores). */
const Flak: React.FC<{n?: number; seed?: number}> = ({n = 7, seed = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const t = ((frame + i * 11) % 40) / 40;
        const x = rnd(i * 3 + seed) * 1000 + 40;
        const y = rnd(i * 7 + seed) * 900 + 300;
        const s = 60 + t * 120;
        return (
          <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', background: t < 0.15 ? GOLD : '#111', opacity: 1 - t, boxShadow: t < 0.15 ? `0 0 40px ${GOLD}` : 'none'}} />
        );
      })}
    </AbsoluteFill>
  );
};
/** Speed lines for falling. */
const Speed: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 26}, (_, i) => {
        const x = rnd(i) * 1080;
        const y = 1920 - ((frame * (50 + rnd(i + 2) * 40) + rnd(i + 5) * 2200) % 2300);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 6, height: 160 + rnd(i + 9) * 200, background: '#ffffff55'}} />;
      })}
    </AbsoluteFill>
  );
};
/** Station roof: iron arches + glass panes; `shatter` 0..1 blows the center out. */
const Roof: React.FC<{shatter?: number}> = ({shatter = 0}) => (
  <div style={{position: 'absolute', left: 40, right: 40, top: 640, height: 420}}>
    {Array.from({length: 6}, (_, c) =>
      Array.from({length: 3}, (_, r) => {
        const center = c === 2 || c === 3;
        const k = c * 3 + r;
        const dx = center ? (rnd(k) - 0.5) * 500 * shatter : 0;
        const dy = center ? rnd(k + 9) * 700 * shatter : 0;
        return (
          <div key={k} style={{position: 'absolute', left: c * 167, top: r * 120, width: 160, height: 112, background: '#bcd8e8aa', border: `5px solid ${INK}`, transform: `translate(${dx}px, ${dy}px) rotate(${center ? shatter * (rnd(k) - 0.5) * 120 : 0}deg)`, opacity: center ? 1 - shatter * 0.8 : 1}} />
        );
      }),
    )}
    <div style={{position: 'absolute', left: -40, right: -40, top: 360, height: 60, background: INK}} />
  </div>
);
const Falling: React.FC<{h: number; spin?: number}> = ({h, spin = 0}) => (
  <div style={{transform: `rotate(${spin}deg)`}}>
    <Man h={h} pose="up" hat="none" />
  </div>
);

// ───────── 0 · Hook ─────────
export const Hook: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [nochute, lived] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={SKY} dots="#ffffff22" />
      <Speed />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><Falling h={760} spin={frame * 2} /></div>
      <Title at={0} until={nochute} size={140}>22,000 FT</Title>
      <Title at={nochute} until={lived} size={130}>NO <span style={{color: RED}}>PARACHUTE</span></Title>
      <Title at={lived} size={130}>HE <span style={{color: GOLD}}>LIVED</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 1 · Who ─────────
export const Who: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const gunner = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Photo src={`${PH}formation.jpg`} t={p(frame, 0, cue.dur, lin)} />
      <Title at={2} until={gunner} size={100}>JAN 3, <span style={{color: GOLD}}>1943</span></Title>
      <Title at={gunner} size={100}>ALAN <span style={{color: GOLD}}>MAGEE</span></Title>
      <Tag at={gunner} x={540} y={1050} size={56} bg={INK}>B-17 BALL TURRET GUNNER</Tag>
      <Tag at={beat(gunner + 40)} x={540} y={1150} size={50} r={4}>SAINT-NAZAIRE, FRANCE</Tag>
      <Credit t="B-17 Flying Fortresses, USAAF · public domain" />
    </AbsoluteFill>
  );
};
// ───────── 2 · Flak ─────────
export const Hit: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Poster bg="#3a4a5a" dots="#ffffff10" />
      <Flak n={9} />
      <div style={{position: 'absolute', left: 120, top: 620}}><B17 w={860} smoke={1} tilt={Math.sin(frame / 6) * 6 + frame * 0.4} /></div>
      <Flash at={6} color={GOLD} />
      <Title at={2} size={120}>FLAK <span style={{color: RED}}>HIT</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 3 · Shredded parachute ─────────
export const Chute: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 140, top: 600}}><Man h={700} hat="none" /></div>
      <svg style={{position: 'absolute', left: 520, top: 640}} width={420} height={520} viewBox="0 0 420 520">
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${60 + i * 45} 40 L${40 + i * 50 + Math.sin(frame / 4 + i) * 10} ${380 + (i % 2) * 80}`} stroke={CREAM} strokeWidth={22} strokeLinecap="round" opacity={0.9} />)}
        <rect x={40} y={0} width={340} height={70} rx={14} fill={GOLD} stroke={INK} strokeWidth={8} />
      </svg>
      <Title at={2} size={96}>PARACHUTE<br /><span style={{color: RED}}>SHREDDED</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 4 · He jumped ─────────
export const Jump: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [air, black] = [beat(cue.s(1)), beat(cue.s(2))];
  const y = lerp(380, 820, p(frame, 0, cue.dur, lin));
  return (
    <AbsoluteFill>
      <Poster bg={SKY} dots="#ffffff22" />
      <div style={{position: 'absolute', left: 80, top: 260, opacity: 1 - p(frame, 10, 40)}}><B17 w={700} smoke={0.6} /></div>
      <div style={{position: 'absolute', left: 400, top: y}}><Falling h={460} spin={frame * 4} /></div>
      {frame >= black ? <AbsoluteFill style={{background: '#000', opacity: 0.85 * p(frame, black, 20)}} /> : null}
      <Title at={2} until={air} size={110} color={INK} shadow={CREAM}>HE <span style={{color: RED}}>JUMPED</span></Title>
      <Title at={air} until={black} size={96} color={INK} shadow={CREAM}>ALMOST <span style={{color: RED}}>NO AIR</span></Title>
      <Title at={black} size={110}>BLACKED <span style={{color: GOLD}}>OUT</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 5 · Four miles ─────────
export const Miles: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const alt = Math.round(lerp(22000, 0, p(frame, 0, 60, lin)) / 100) * 100;
  return (
    <AbsoluteFill>
      <Poster bg={SKY} dots="#ffffff22" />
      <Speed />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}><Falling h={520} spin={frame * 5} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: DISPLAY, fontSize: 200, color: CREAM, textShadow: `8px 8px 0 ${INK}`}}>{alt.toLocaleString('en-US')} FT</div>
      <Tag at={4} x={540} y={1150} size={70}>4+ MILES</Tag>
    </AbsoluteFill>
  );
};
// ───────── 6 · Rehook ─────────
export const Impossible: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Poster bg={INK} dots="#ffffff10" />
      <Rays color="#ffffff0c" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontFamily: DISPLAY, fontSize: 420, color: GOLD, transform: `scale(${lerp(0.9, 1.05, p(frame, 0, 80, lin))})`}}>!</div>
      <Title at={2} size={100}>THEN… THE<br /><span style={{color: GOLD}}>IMPOSSIBLE</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 7 · Glass roof ─────────
export const Glass: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const hit = beat(Math.round(cue.s(0) + 30));
  const slowed = beat(cue.s(1));
  const fall = p(frame, 0, hit, lin);
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <Roof shatter={frame >= hit ? p(frame, hit, 24) : 0} />
      <div style={{position: 'absolute', left: 420, top: lerp(-300, frame >= hit ? lerp(560, 900, p(frame, hit, 30)) : 560, fall)}}><Falling h={380} spin={frame * 4} /></div>
      <Flash at={hit} color="#e8f6ff" />
      <Title at={2} until={slowed} size={90}>RAILWAY STATION<br /><span style={{color: GOLD}}>GLASS ROOF</span></Title>
      <Title at={slowed} size={90}>THE GLASS<br /><span style={{color: GOLD}}>SLOWED HIM</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 8 · Injuries ─────────
export const Wounds: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [leg, arm, alive] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={frame >= alive ? GOLD : CREAM} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><Man h={700} hat="none" color={INK} /></div>
      <Tag at={4} x={260} y={620} size={64} r={-8}>28 WOUNDS</Tag>
      <Tag at={leg} x={800} y={760} size={60} r={6} bg={INK}>BROKEN LEG</Tag>
      <Tag at={arm} x={300} y={900} size={54} r={-4}>ARM NEARLY TORN OFF</Tag>
      <Title at={alive} top={220} size={130} color={INK} shadow={RED}>ALIVE</Title>
    </AbsoluteFill>
  );
};
// ───────── 9 · The enemy saved him ─────────
export const Saved: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Poster bg={CREAM} />
      <Rays />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1100, height: 120, background: INK}} />
      <div style={{position: 'absolute', left: 360, top: 1040, width: 360, height: 60, background: '#555', borderRadius: 30}} />
      <div style={{position: 'absolute', left: 120, top: 560}}><Man h={560} hat="cap" /></div>
      <div style={{position: 'absolute', left: 720, top: 560}}><Man h={560} hat="cap" flip /></div>
      <div style={{position: 'absolute', left: 440, top: 640, width: 200, height: 200, background: CREAM, border: `10px solid ${INK}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(frame, 20)}}>
        <div style={{position: 'relative', width: 120, height: 120}}>
          <div style={{position: 'absolute', left: 40, top: 0, width: 40, height: 120, background: RED}} />
          <div style={{position: 'absolute', left: 0, top: 40, width: 120, height: 40, background: RED}} />
        </div>
      </div>
      <Title at={2} size={96} color={INK} shadow={GOLD}>THE ENEMY<br /><span style={{color: RED}}>SAVED HIM</span></Title>
    </AbsoluteFill>
  );
};
// ───────── 10 · POW ─────────
export const Pow: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const y = Math.floor(lerp(1943, 1945, p(frame, 10, 80, lin)));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      {[700, 860, 1020].map((t) => <div key={t} style={{position: 'absolute', left: 0, right: 0, top: t, height: 6, background: '#aaa', boxShadow: '0 0 0 #000'}} />)}
      {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 90 + 20, top: 690 + (i % 3) * 160, fontSize: 40, color: '#aaa'}}>✕</div>)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 460, textAlign: 'center', fontFamily: DISPLAY, fontSize: 200, color: GOLD, textShadow: `8px 8px 0 ${INK}`}}>{y}</div>
      <Title at={2} size={110}>PRISONER <span style={{color: GOLD}}>OF WAR</span></Title>
      {y >= 1945 ? <Title at={80} top={1100} size={100}>HOME</Title> : null}
    </AbsoluteFill>
  );
};
// ───────── 11 · Memorial ─────────
export const Memorial: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff38" />
      <div style={{position: 'absolute', left: 390, top: 520, width: 300, height: 620, background: '#c9c2b4', border: `10px solid ${INK}`, clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)', ...pop(frame, 8)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: DISPLAY, fontSize: 54, color: INK}}>1943 · 1993</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1140, height: 80, background: INK}} />
      <Title at={2} size={100} color={INK} shadow={CREAM}>50 YEARS <span style={{color: RED}}>LATER</span></Title>
      <Tag at={30} x={540} y={420} size={56} bg={INK}>SAINT-NAZAIRE REMEMBERS</Tag>
    </AbsoluteFill>
  );
};
// ───────── 12 · Ending (loops to hook) ─────────
export const Ending: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <Poster bg={SKY} dots="#ffffff22" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: DISPLAY, fontSize: 420, color: CREAM, textShadow: `12px 12px 0 ${INK}`, ...pop(frame, 2)}}>84</div>
      <Title at={2} size={100}>HE LIVED TO</Title>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
        <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 52, color: '#fff', background: '#e62117', padding: '12px 44px', borderRadius: 50, border: `5px solid ${INK}`}}>FOLLOW FOR DAILY MYSTERIES</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────── Portrait thumbnail ─────────
export const MageeThumb: React.FC = () => (
  <AbsoluteFill>
    <Poster bg={SKY} dots="#ffffff22" />
    <Rays color="#ffffff22" />
    <div style={{position: 'absolute', top: 90, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 170, lineHeight: 0.95, color: CREAM, textShadow: `10px 10px 0 ${INK}`}}>
      22,000 FT
      <br />
      <span style={{color: RED}}>NO PARACHUTE</span>
    </div>
    <div style={{position: 'absolute', left: 80, top: 520}}><B17 w={500} smoke={1} /></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', transform: 'rotate(25deg)'}}><Man h={720} pose="up" hat="none" /></div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 240, textAlign: 'center'}}>
      <span style={{fontFamily: DISPLAY, fontSize: 110, color: INK, background: GOLD, padding: '6px 40px', border: `8px solid ${INK}`}}>HE LIVED</span>
    </div>
  </AbsoluteFill>
);
