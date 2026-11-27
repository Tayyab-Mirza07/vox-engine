import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p} from '../lib';
import {has} from '../motion';
import {Bars, CREAM, GOLD, INK, Man, NAVY, Poster, Rays, RED} from '../dillinger/parts';
import {Badge, Calendar, Credit, DashCam, Dog, Photo, pop, Tag, Tally, Title} from '../mcnair/scenes';

export {RED};
export type SceneProps = {cue: Cues; beat: (f: number) => number};
const PH = 'choi/photos/';
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const lin = (n: number) => n;
const STEEL = '#6d7480';

/** Steel cell door with a food slot. `slotH` in px; 6 in ≈ 90 px at this scale. */
const Door: React.FC<{w?: number; slotW?: number; slotH?: number; children?: React.ReactNode; glow?: boolean}> = ({w = 720, slotW = 270, slotH = 90, children, glow}) => (
  <div style={{position: 'relative', width: w, height: w * 1.45, background: STEEL, border: `12px solid ${INK}`, boxShadow: `16px 16px 0 ${INK}`}}>
    {[0.12, 0.88].map((y) => <div key={y} style={{position: 'absolute', left: 30, right: 30, top: `${y * 100}%`, height: 18, background: '#565c66'}} />)}
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 30 + i * 20, top: 40, width: 8, height: 8, borderRadius: 4, background: INK}} />)}
    <div style={{position: 'absolute', left: (w - 24 - slotW) / 2, top: w * 0.75, width: slotW, height: slotH, background: glow ? '#1a1a1a' : INK, border: `8px solid #3b4048`, boxShadow: glow ? `0 0 0 8px ${GOLD}` : undefined, overflow: 'visible'}}>{children}</div>
  </div>
);
/** Dimension arrow with a label. */
const Dim: React.FC<{x: number; y: number; len: number; vertical?: boolean; label: string; at: number; color?: string}> = ({x, y, len, vertical, label, at, color = RED}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = p(frame, at, 10);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: vertical ? 10 : len * t, height: vertical ? len * t : 10, background: color, zIndex: 6}}>
      <div style={{position: 'absolute', [vertical ? 'left' : 'top']: vertical ? 30 : -100, [vertical ? 'top' : 'left']: vertical ? len / 2 - 50 : len / 2 - 120, width: 240, fontFamily: DISPLAY, fontSize: 84, color: CREAM, textShadow: `5px 5px 0 ${INK}`, whiteSpace: 'nowrap', opacity: t}}>{label}</div>
    </div>
  );
};
/** A flexible body pouring out of the slot toward the right: `t` 0..1. Lives inside the slot box. */
const Squeeze: React.FC<{t: number; color?: string}> = ({t, color = INK}) => {
  const len = lerp(0, 620, t);
  const thick = 64 - 18 * Math.sin(Math.min(1, t * 1.4) * Math.PI);
  return (
    <div style={{position: 'absolute', left: '100%', top: '50%', width: 0, height: 0, overflow: 'visible', zIndex: 5}}>
      <div style={{position: 'absolute', left: -40, top: -thick / 2, width: len + 40, height: thick, background: color, borderRadius: thick / 2, border: `6px solid ${INK}`}} />
      <div style={{position: 'absolute', left: len - 10, top: -58, width: 104, height: 116, borderRadius: '50%', background: color, border: `6px solid ${INK}`}} />
      {t > 0.3 ? <div style={{position: 'absolute', left: len - 140, top: -thick / 2 - 40, width: 90, height: 22, background: color, border: `5px solid ${INK}`, borderRadius: 11, transform: 'rotate(-25deg)'}} /> : null}
      {t > 0.3 ? <div style={{position: 'absolute', left: len - 140, top: thick / 2 + 16, width: 90, height: 22, background: color, border: `5px solid ${INK}`, borderRadius: 11, transform: 'rotate(25deg)'}} /> : null}
    </div>
  );
};
const Tube: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 0.36} viewBox="0 0 300 108">
    <path d="M20 20 L220 10 Q236 10 236 26 L236 82 Q236 98 220 98 L20 88 Z" fill={CREAM} stroke={INK} strokeWidth={8} />
    <rect x={236} y={34} width={40} height={40} fill={RED} stroke={INK} strokeWidth={8} />
    <text x={120} y={66} textAnchor="middle" fontFamily={DISPLAY} fontSize={30} fill={INK}>OINTMENT</text>
  </svg>
);
const Desk: React.FC<{sleep?: boolean; screen?: boolean; x: number}> = ({sleep, screen, x}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: 820, width: 300, height: 520}}>
      <div style={{position: 'absolute', left: 60, top: sleep ? 120 : 0, transform: sleep ? 'rotate(14deg)' : undefined}}><Man h={380} hat="cap" /></div>
      <div style={{position: 'absolute', left: 0, top: 300, width: 300, height: 40, background: INK}} />
      <div style={{position: 'absolute', left: 20, top: 340, width: 20, height: 180, background: INK}} />
      <div style={{position: 'absolute', left: 260, top: 340, width: 20, height: 180, background: INK}} />
      {screen ? <div style={{position: 'absolute', left: 170, top: 170, width: 120, height: 100, background: '#7fd1ff', border: `8px solid ${INK}`, boxShadow: `0 0 60px #7fd1ff`, opacity: 0.85 + 0.15 * Math.sin(frame / 3)}} /> : null}
      {sleep ? <div style={{position: 'absolute', left: 170, top: 20 - ((frame / 2) % 40), fontFamily: DISPLAY, fontSize: 70, color: CREAM, opacity: 1 - ((frame / 2) % 40) / 40}}>Z z</div> : null}
    </div>
  );
};
const Heli: React.FC<{w: number}> = ({w}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 400 200" style={{overflow: 'visible'}}>
      <path d="M140 150 L60 420 L340 420 L230 150 Z" fill="#ff6a3d" opacity={0.28} />
      <g fill={INK}>
        <ellipse cx={190} cy={110} rx={90} ry={44} />
        <rect x={250} y={96} width={140} height={20} />
        <rect x={378} y={70} width={14} height={50} />
        <rect x={185} y={50} width={12} height={22} />
        <rect x={130} y={160} width={130} height={8} />
      </g>
      <rect x={190 - 170 * Math.abs(Math.cos(frame / 1.5))} y={44} width={340 * Math.abs(Math.cos(frame / 1.5))} height={10} fill={INK} />
      <ellipse cx={150} cy={104} rx={30} ry={20} fill="#9fd8ff" opacity={0.5} />
    </svg>
  );
};
const Octopus: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <g fill={RED} stroke={INK} strokeWidth={6}>
        {Array.from({length: 6}, (_, i) => {
          const x = 40 + i * 24;
          const w = Math.sin(frame / 5 + i) * 14;
          return <path key={i} d={`M${x} 110 Q${x + w} 150 ${x - w} 190`} fill="none" strokeWidth={14} stroke={RED} />;
        })}
        <ellipse cx={100} cy={80} rx={62} ry={58} />
      </g>
      <circle cx={80} cy={84} r={9} fill={INK} />
      <circle cx={120} cy={84} r={9} fill={INK} />
    </svg>
  );
};

// ───────────── 0 · Hook ─────────────
export const Hook: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const slot = beat(cue.s(1));
  const t = p(frame, 6, Math.max(30, slot - 6), lin);
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      <div style={{position: 'absolute', left: 60, top: 420}}>
        <Door w={560} glow={frame >= slot}>{frame < slot ? <Squeeze t={t} color={CREAM} /> : <div style={{position: 'absolute', left: lerp(-200, 40, p(frame, slot, 12)), top: 10, width: 170, height: 50, background: CREAM, border: `5px solid ${INK}`}} />}</Door>
      </div>
      <Dim x={20} y={835} len={90} vertical label="" at={4} color={GOLD} />
      <Tag at={6} x={170} y={1300} size={56} bg={INK} color={GOLD}>6 IN</Tag>
      <Title at={0} until={slot} top={170} size={116} color={CREAM} shadow={INK}>ESCAPED THROUGH<br /><span style={{color: GOLD}}>6 INCHES</span></Title>
      <Title at={slot} top={170} size={116} color={CREAM} shadow={INK}>THE <span style={{color: GOLD}}>FOOD SLOT</span></Title>
      <Badge n={3} y={1180} />
    </AbsoluteFill>
  );
};

// ───────────── 1 · Daegu ─────────────
export const Daegu: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [korea, five] = [beat(cue.s(1)), beat(cue.s(2))];
  const station = real('station.jpg');
  return (
    <AbsoluteFill>
      <Poster bg={frame < five ? GOLD : NAVY} dots={frame < five ? '#00000018' : '#ffffff10'} />
      <Rays color="#ffffff30" />
      {frame < korea ? <Calendar x={290} y={430} month="SEPT" day="17" year="2012" at={2} w={500} /> : null}
      {frame >= korea && frame < five ? (
        <>
          <svg width={600} height={700} viewBox="0 0 300 350" style={{position: 'absolute', left: 240, top: 420}}>
            <path d="M120 10 L180 20 L200 70 L230 90 L240 160 L270 210 L250 280 L200 320 L150 340 L100 320 L80 270 L60 220 L90 170 L70 120 L100 70 Z" fill={INK} />
            <circle cx={215} cy={230} r={14} fill={RED} stroke={CREAM} strokeWidth={5} />
          </svg>
          <Tag at={korea} x={720} y={1100} size={60} bg={RED}>DAEGU</Tag>
        </>
      ) : null}
      {frame >= five ? (
        <>
          {station ? <Photo src={station} w={920} h={640} x={80} y={440} r={-2} at={five} color /> : <div style={{position: 'absolute', left: 140, top: 520, width: 800, height: 520}}>
            <div style={{position: 'absolute', left: 0, top: 120, width: 800, height: 400, background: '#2a3350', border: `10px solid ${INK}`}} />
            {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: 50 + (i % 6) * 120, top: 180 + Math.floor(i / 6) * 120, width: 70, height: 70, background: i === 7 ? GOLD : '#11162a', border: `5px solid ${INK}`}} />)}
            <div style={{position: 'absolute', left: 250, top: 40, width: 300, height: 90, background: CREAM, border: `8px solid ${INK}`, fontFamily: DISPLAY, fontSize: 64, textAlign: 'center', lineHeight: '74px', color: '#1d3fa8'}}>POLICE</div>
            <div style={{position: 'absolute', left: 340, top: 400, width: 120, height: 120, background: '#11162a', border: `6px solid ${INK}`}} />
          </div>}
          <Tag at={beat(five + 10)} x={540} y={1110} size={64} bg={INK} color={GOLD}>5:00 AM</Tag>
          {station ? <Credit t="Daegu Dongbu Police Station · photo hyolee2 · CC BY-SA 3.0" light /> : null}
        </>
      ) : null}
      <Title at={2} until={korea} size={110}>SEPT 17, <span style={{color: RED}}>2012</span></Title>
      <Title at={korea} until={five} size={110}>DAEGU,<br /><span style={{color: RED}}>SOUTH KOREA</span></Title>
      <Title at={five} color={CREAM} shadow={RED} size={100}>DONGBU<br /><span style={{color: GOLD}}>POLICE STATION</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 2 · Choi Gap-bok ─────────────
export const Who: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const years = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}><Man h={700} hat="none" color="#05070c" /></div>
      <Bars color="#c9b98f" />
      <Title at={2} until={years} color={CREAM} shadow={RED} size={110}>CHOI<br /><span style={{color: GOLD}}>GAP-BOK</span></Title>
      <Tag at={beat(14)} until={years} x={540} y={1100} size={60}>CAREER CRIMINAL · ROBBERY</Tag>
      <Title at={years} color={CREAM} shadow={RED} size={110}><span style={{color: GOLD}}>20+ YEARS</span><br />BEHIND BARS</Title>
      {frame >= years ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 460, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', zIndex: 4}}>
          {Array.from({length: Math.min(24, Math.floor((frame - years) / 2))}, (_, i) => <div key={i} style={{width: 14, height: 54, background: GOLD, transform: i % 5 === 4 ? 'rotate(60deg)' : undefined}} />)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── 3 · Yoga ─────────────
export const Yoga: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const master = beat(cue.s(1));
  const bend = Math.sin(frame / 14) * 40;
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `rotate(${frame < master ? bend : 180}deg)`, transformOrigin: '50% 80%'}}><Man h={640} hat="none" pose="up" /></div>
      </div>
      <Title at={2} until={master} size={120}>BODY <span style={{color: RED}}>FLEXIBLE</span></Title>
      <Title at={master} size={110}>THE <span style={{color: RED}}>YOGA</span><br />MASTER</Title>
    </AbsoluteFill>
  );
};

// ───────────── 4 · The slot ─────────────
export const Slot: React.FC<SceneProps> = ({cue, beat}) => {
  const [wide, tall] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <div style={{position: 'absolute', left: 60, top: 540, width: 960, height: 400, background: STEEL, border: `12px solid ${INK}`}}>
        <div style={{position: 'absolute', left: 150, top: 120, width: 640, height: 150, background: INK, border: `10px solid #3b4048`}} />
      </div>
      <Dim x={210} y={500} len={640} label="18 INCHES" at={wide} color={CREAM} />
      <Dim x={880} y={660} len={170} vertical label="" at={tall} color={RED} />
      <Tag at={tall} x={540} y={1060} size={110} r={-5}>6 INCHES</Tag>
      <Title at={2} size={110}>THE <span style={{color: RED}}>FOOD SLOT</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 5 · Practice on CCTV ─────────────
export const Practice: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const three = beat(cue.s(1));
  const k = frame < three ? 0 : Math.min(3, 1 + Math.floor((frame - three) / 40));
  const push = frame >= three ? Math.abs(Math.sin(((frame - three) / 40) * Math.PI)) : 0;
  return (
    <AbsoluteFill style={{filter: 'grayscale(0.7)'}}>
      <Poster bg="#2b2f2a" dots="#ffffff10" />
      <div style={{position: 'absolute', left: 180, top: 420}}>
        <Door>
          <div style={{position: 'absolute', left: 60, top: lerp(60, -30, push), width: 110, height: 110, borderRadius: 55, background: CREAM}} />
        </Door>
      </div>
      <DashCam stamp="CCTV · CELL 3" />
      <Title at={2} until={three} color={CREAM} shadow={RED} size={104}>CAUGHT ON<br /><span style={{color: GOLD}}>CAMERA</span></Title>
      <Title at={three} color={CREAM} shadow={RED} size={110}>PRACTICE <span style={{color: GOLD}}>×{Math.max(1, k)}</span></Title>
      {frame >= three ? <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', zIndex: 5}}><Tally n={3} at={[three, three + 40, three + 80]} size={140} color={GOLD} /></div> : null}
    </AbsoluteFill>
  );
};

// ───────────── 6 · Ointment ─────────────
export const Ointment: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const rub = beat(cue.s(1));
  const [head, body, bars] = [beat(cue.w('head')), beat(cue.w('body')), beat(cue.w('bars'))];
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      {frame < rub ? (
        <div style={{position: 'absolute', left: 140, top: 700, transform: `rotate(-10deg) ${pop(frame, 4).transform}`}}><Tube w={800} /></div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><Man h={700} hat="none" /></div>
          {frame >= bars ? <Bars color="#c9c9c9" /> : null}
          {[head, body, bars].map((a, k) => (frame >= a ? <div key={k} style={{position: 'absolute', left: 0, right: 0, top: [580, 760, 560][k], height: [160, 420, 900][k], background: `linear-gradient(110deg, transparent 30%, #ffffff66 ${40 + ((frame * 4) % 30)}%, transparent 70%)`, zIndex: 3}} /> : null))}
        </>
      )}
      <Title at={2} until={rub} color={CREAM} shadow={INK} size={110}>A TUBE OF<br /><span style={{color: GOLD}}>OINTMENT</span></Title>
      <Title at={rub} until={body} color={CREAM} shadow={INK} size={120}>HEAD.</Title>
      <Title at={body} until={bars} color={CREAM} shadow={INK} size={120}>HEAD. BODY.</Title>
      <Title at={bars} color={CREAM} shadow={INK} size={110}>HEAD. BODY.<br /><span style={{color: GOLD}}>BARS.</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 7 · The officers ─────────────
export const Guards: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [asleep, online] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <Desk x={20} sleep={frame >= asleep} />
      <Desk x={390} sleep={frame >= asleep} />
      <Desk x={760} screen={frame >= online} />
      <Title at={2} until={asleep} color={CREAM} shadow={RED} size={110}>3 OFFICERS<br /><span style={{color: GOLD}}>ON DUTY</span></Title>
      <Title at={asleep} until={online} color={CREAM} shadow={RED} size={120}>2 <span style={{color: GOLD}}>ASLEEP</span></Title>
      <Title at={online} color={CREAM} shadow={RED} size={110}>1 ON THE<br /><span style={{color: GOLD}}>INTERNET</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 8 · The squeeze ─────────────
export const Out: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [sh, ch, hp, min] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3)), beat(cue.s(4))];
  const stage = frame < sh ? p(frame, 0, sh, lin) * 0.25 : frame < ch ? 0.25 + p(frame, sh, 10) * 0.2 : frame < hp ? 0.45 + p(frame, ch, 10) * 0.2 : frame < min ? 0.65 + p(frame, hp, 10) * 0.2 : 1;
  const label = frame < sh ? 'HEAD FIRST' : frame < ch ? 'SHOULDERS' : frame < hp ? 'CHEST' : frame < min ? 'HIPS' : '';
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      <div style={{position: 'absolute', left: 60, top: 420}}>
        <Door w={560} glow><Squeeze t={stage} color={CREAM} /></Door>
      </div>
      {frame < min ? <Title at={0} size={120}><span style={{color: RED}}>{label}</span></Title> : <Title at={min} size={110}>UNDER<br /><span style={{color: RED}}>1 MINUTE</span></Title>}
    </AbsoluteFill>
  );
};

// ───────────── 9 · Octopus → vanished ─────────────
export const Vanish: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const win = beat(cue.s(1));
  const gone = beat(cue.w('vanished'));
  return (
    <AbsoluteFill>
      <Poster bg={frame < win ? CREAM : NAVY} dots={frame < win ? '#00000018' : '#ffffff10'} />
      {frame < win ? (
        <>
          <Rays />
          <div style={{position: 'absolute', left: 240, top: 520}}><Octopus size={600} /></div>
          <Title at={2} size={110}>"LIKE AN<br /><span style={{color: RED}}>OCTOPUS"</span></Title>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 240, top: 480, width: 600, height: 640, background: '#1b2440', border: `14px solid ${INK}`}}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 60 + i * 150, top: 0, bottom: 0, width: 26, background: '#c9c9c9'}} />)}
            {frame < gone ? <div style={{position: 'absolute', left: 100, top: 160, transform: `scaleX(0.45)`}}><Man h={420} hat="none" color={CREAM} /></div> : null}
          </div>
          <Dim x={326} y={1140} len={124} label="5 IN" at={win + 6} color={GOLD} />
          <Title at={win} until={gone} color={CREAM} shadow={RED} size={104}>WINDOW BARS<br /><span style={{color: GOLD}}>5 INCHES APART</span></Title>
          <Title at={gone} color={CREAM} shadow={RED} size={130}><span style={{color: GOLD}}>VANISHED</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 10 · The note ─────────────
export const Note: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [sorry, name] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <div style={{position: 'absolute', left: 170, top: 440, width: 740, height: 640, background: '#fbf6e8', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(-3deg) ${pop(frame, 2).transform}`, padding: 60, boxSizing: 'border-box', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 78px, #9fb8d6 78px 81px)'}}>
        {frame >= sorry ? <div style={{fontFamily: 'Permanent Marker, Inter', fontWeight: 800, fontSize: 80, color: INK, lineHeight: '80px'}}>"I'm sorry..."</div> : null}
        {frame >= name ? <div style={{fontFamily: 'Permanent Marker, Inter', fontWeight: 800, fontSize: 66, color: RED, lineHeight: '80px', marginTop: 80}}>"...I have to clear my name."</div> : null}
      </div>
      <Title at={2} size={110}>HE LEFT <span style={{color: RED}}>A NOTE</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 11 · Manhunt ─────────────
export const Manhunt: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [police, dogs, heli] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, height: 600, background: '#0d1a12'}} />
      {frame >= police ? (
        <div style={{position: 'absolute', left: -40, right: -40, top: 860, display: 'flex', justifyContent: 'center', gap: 6}}>
          {Array.from({length: 9}, (_, k) => <div key={k} style={{opacity: frame >= police + k * 2 ? 1 : 0}}><Man h={300} hat="cap" pose="walk" step={frame / 3 + k} /></div>)}
        </div>
      ) : null}
      {frame >= dogs ? (
        <>
          <div style={{position: 'absolute', left: 120, top: 1060}}><Dog w={220} /></div>
          <div style={{position: 'absolute', left: 740, top: 1060}}><Dog w={220} flip /></div>
        </>
      ) : null}
      {frame >= heli ? <div style={{position: 'absolute', left: lerp(1100, 300, p(frame, heli, 40)), top: 430}}><Heli w={520} /></div> : null}
      <Title at={2} until={police} color={CREAM} shadow={RED} size={110}>A MASSIVE<br /><span style={{color: GOLD}}>MANHUNT</span></Title>
      <Title at={police} until={dogs} color={CREAM} shadow={RED} size={104}>THOUSANDS<br /><span style={{color: GOLD}}>OF POLICE</span></Title>
      <Title at={dogs} until={heli} color={CREAM} shadow={RED} size={110}>SEARCH <span style={{color: GOLD}}>DOGS</span></Title>
      <Title at={heli} color={CREAM} shadow={RED} size={100}>THERMAL<br /><span style={{color: GOLD}}>HELICOPTERS</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 12 · Spotted near Cheongdo ─────────────
export const Spotted: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const gone = beat(cue.s(1));
  const dot = (x: number, y: number, label: string, at: number, color = RED) =>
    frame >= at ? (
      <div style={{position: 'absolute', left: x, top: y, transform: pop(frame, at).transform}}>
        <div style={{width: 46, height: 46, borderRadius: 23, background: color, border: `6px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 60, top: -10, fontFamily: DISPLAY, fontSize: 60, color: INK, whiteSpace: 'nowrap'}}>{label}</div>
      </div>
    ) : null;
  return (
    <AbsoluteFill>
      <Poster bg={CREAM} />
      <Rays />
      <svg width={1080} height={900} style={{position: 'absolute', left: 0, top: 440}}>
        <path d="M300 120 Q420 300 470 480" stroke={INK} strokeWidth={10} strokeDasharray="24 18" fill="none" />
      </svg>
      {dot(270, 520, 'DAEGU', 2, INK)}
      {dot(440, 880, 'CHEONGDO', 8)}
      {frame >= gone ? <div style={{position: 'absolute', left: 560, top: 1000, fontFamily: DISPLAY, fontSize: 200, color: RED, textShadow: `8px 8px 0 ${INK}`}}>?</div> : null}
      <Title at={2} until={gone} size={110}>SPOTTED<br /><span style={{color: RED}}>NEAR CHEONGDO</span></Title>
      <Title at={gone} size={120}>GONE <span style={{color: RED}}>AGAIN</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 13 · The Korean Houdini ─────────────
export const Houdini: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const name = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" spin={0.5} />
      <div style={{position: 'absolute', left: 110, top: 440, width: 860, height: 700, background: '#f3ecd8', border: `8px solid ${INK}`, boxShadow: `16px 16px 0 ${INK}`, transform: `rotate(${lerp(-200, -4, p(frame, 2, 16))}deg) scale(${lerp(0.2, 1, p(frame, 2, 16))})`, padding: 40, boxSizing: 'border-box'}}>
        <div style={{fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 64, textAlign: 'center', borderBottom: `6px double ${INK}`, paddingBottom: 10}}>THE DAILY NEWS</div>
        {frame >= name ? <div style={{fontFamily: DISPLAY, fontSize: 132, lineHeight: 1, textAlign: 'center', marginTop: 40, color: INK}}>"THE KOREAN<br /><span style={{color: RED}}>HOUDINI"</span></div> : <div style={{marginTop: 50}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{height: 26, background: '#00000025', margin: '22px 0'}} />)}</div>}
        <div style={{display: 'flex', gap: 20, marginTop: 40}}>{[0, 1].map((i) => <div key={i} style={{flex: 1, height: 150, background: 'repeating-linear-gradient(180deg, #00000025 0 14px, transparent 14px 28px)'}} />)}</div>
      </div>
      <Title at={2} until={name} color={CREAM} shadow={INK} size={110}>A NEW <span style={{color: GOLD}}>NAME</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 14 · Doubt ─────────────
export const Doubt: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const fit = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      {frame < fit ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 30}}>
            {[0, 1, 2, 3, 4].map((k) => <Man key={k} h={420} hat="none" color="#05070c" />)}
          </div>
          <Tag at={beat(10)} x={540} y={1060} size={80} r={-6}>NOT BUYING IT</Tag>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 300, top: 520, width: 480, height: 480}}>
            <div style={{position: 'absolute', left: 120, top: 40, width: 240, height: 290, borderRadius: '50%', background: CREAM}} />
            <div style={{position: 'absolute', left: 0, top: 330, width: 480, height: 200, borderRadius: '140px 140px 0 0', background: CREAM}} />
          </div>
          <div style={{position: 'absolute', left: 100, top: 760, width: 880, height: 90, border: `10px solid ${RED}`, boxShadow: `0 0 0 4000px #00000055`}} />
          <Dim x={1000} y={760} len={90} vertical label="" at={fit} color={GOLD} />
          <Tag at={beat(fit + 12)} x={540} y={1080} size={90} bg={GOLD} color={INK}>6 INCHES?</Tag>
        </>
      )}
      <Title at={2} until={fit} color={CREAM} shadow={RED} size={110}>DID IT <span style={{color: GOLD}}>REALLY</span><br />HAPPEN?</Title>
      <Title at={fit} color={CREAM} shadow={RED} size={104}>HEAD AND<br /><span style={{color: GOLD}}>SHOULDERS?</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 15 · Unlocked? ─────────────
export const Unlocked: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const open = beat(cue.s(1));
  const t = p(frame, open, 20);
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      <div style={{position: 'absolute', left: 180, top: 420, width: 720, height: 1044, background: INK}} />
      <div style={{position: 'absolute', left: 180, top: 420, transform: `perspective(1600px) rotateY(${-t * 38}deg)`, transformOrigin: '0% 50%'}}><Door /></div>
      <Title at={2} until={open} size={110}>SOMETHING<br /><span style={{color: RED}}>SIMPLER?</span></Title>
      <Title at={open} size={110}>LEFT <span style={{color: RED}}>UNLOCKED?</span></Title>
      <Tag at={beat(cue.w('covering'))} x={540} y={1060} size={110} r={-10}>COVER-UP?</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 16 · Caught in Miryang ─────────────
export const Caught: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [five, roof] = [beat(cue.s(1)), beat(cue.s(2))];
  const town = real('miryang.jpg');
  return (
    <AbsoluteFill>
      <Poster bg={frame < roof ? CREAM : NAVY} dots={frame < roof ? '#00000018' : '#ffffff10'} />
      {frame < roof ? (
        <>
          <Calendar x={290} y={420} month="SEPT" day="22" year="2012" at={2} w={500} />
          <Tag at={five} x={540} y={1110} size={64} bg={INK} color={GOLD}>5 DAYS ON THE RUN</Tag>
        </>
      ) : (
        <>
          {town ? <Photo src={town} w={940} h={560} x={70} y={440} r={-2} at={roof} color /> : null}
          <div style={{position: 'absolute', left: 120, top: 860, width: 840, height: 30, background: INK}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 20, zIndex: 4}}>
            <Man h={240} hat="cap" />
            <Man h={240} hat="cap" />
            <Man h={240} hat="none" pose="up" color={RED} />
            <Man h={240} hat="cap" flip />
          </div>
          {town ? <Credit t="Miryang, South Korea · photo Visviva · public domain" light /> : null}
        </>
      )}
      <Title at={2} until={roof} size={110}>SEPT <span style={{color: RED}}>22</span></Title>
      <Title at={roof} color={CREAM} shadow={RED} size={100}>A ROOFTOP<br /><span style={{color: GOLD}}>IN MIRYANG</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 17 · The 4-inch slot ─────────────
export const NewCell: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const four = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      <div style={{position: 'absolute', left: 180, top: 420}}><Door slotW={430} slotH={frame >= four ? 60 : 90} glow={frame >= four} /></div>
      <Dim x={880} y={955} len={60} vertical label="" at={four} color={GOLD} />
      <Title at={2} until={four} color={CREAM} shadow={INK} size={104}>A DIFFERENT<br /><span style={{color: GOLD}}>CELL</span></Title>
      <Title at={four} color={CREAM} shadow={INK} size={120}><span style={{color: GOLD}}>4 INCHES</span></Title>
      <Tag at={beat(four + 14)} x={540} y={1160} size={64} bg={INK} color={GOLD}>NICE TRY</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 18 · The verdict / question ─────────────
export const Verdict: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [q, split] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={frame < q ? INK : NAVY} dots="#ffffff10" />
      {frame < q ? (
        <>
          <Bars color="#c9b98f" />
          <Tag at={4} x={540} y={900} size={150} r={-6}>6 YEARS</Tag>
        </>
      ) : frame < split ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: DISPLAY, fontSize: 520, color: CREAM, textShadow: `14px 14px 0 ${RED}`}}>?</div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, top: 400, width: 540, height: 760, background: GOLD}} />
          <div style={{position: 'absolute', left: 540, top: 400, width: 540, height: 760, background: RED}} />
          <div style={{position: 'absolute', left: 100, top: 560, transform: 'rotate(150deg)', transformOrigin: '50% 60%'}}><Man h={480} hat="none" pose="up" /></div>
          <div style={{position: 'absolute', left: 640, top: 640, transform: 'scale(0.6)', transformOrigin: '0 0'}}><Door /></div>
          <Tag at={split} x={270} y={1160} size={60} bg={INK} color={GOLD}>YOGA MASTER?</Tag>
          <Tag at={beat(split + 10)} x={810} y={1160} size={60} bg={INK} color={CREAM} r={5}>COVER-UP?</Tag>
        </>
      )}
      <Title at={2} until={q} color={CREAM} shadow={RED} size={110}>SENTENCED</Title>
      <Title at={q} color={CREAM} shadow={RED} size={104}>THE QUESTION<br /><span style={{color: GOLD}}>NEVER WENT AWAY</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 19 · Ending + CTA ─────────────
export const Ending: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [comment, cta, follow] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Poster bg={RED} dots="#00000022" />
        <Rays color="#00000022" />
        <div style={{position: 'absolute', left: 180, top: 460, transform: 'scale(0.8)', transformOrigin: '50% 0'}}><Door glow /></div>
        <Title at={2} color={CREAM} shadow={INK} size={110}>WHAT DO<br /><span style={{color: GOLD}}>YOU</span> BELIEVE?</Title>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1130, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: INK, background: CREAM, padding: '8px 40px', borderRadius: 40, border: `6px solid ${INK}`}}>👇 COMMENT</div>
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <Title at={cta} top={150} size={104}>WATCH<br /><span style={{color: RED}}>ESCAPED #2</span></Title>
      <div style={{position: 'absolute', left: 330, top: 400, width: 420, height: 620, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(-2deg) ${pop(frame, cta + 2).transform}`}}>
        <Img src={staticFile('choi/cta/mcnair.png')} style={{width: '100%', height: '88%', objectFit: 'cover'}} />
        <div style={{fontFamily: DISPLAY, fontSize: 40, color: INK, textAlign: 'center'}}>THE COP LET HIM GO</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${CREAM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: CREAM, paddingLeft: 10}}>▶</div>
      </div>
      {frame >= follow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${pulse})`}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 64, color: '#fff', background: '#e62117', padding: '14px 50px', borderRadius: 60, border: `5px solid ${INK}`}}>FOLLOW</div>
          <div style={{fontFamily: DISPLAY, fontSize: 48, color: INK}}>FOR MORE ESCAPES</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── Portrait thumbnail ─────────────
export const ChoiThumb: React.FC = () => (
  <AbsoluteFill>
    <Poster bg={RED} dots="#00000022" />
    <Rays color="#00000026" />
    <div style={{position: 'absolute', top: 90, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 140, lineHeight: 0.95, color: CREAM, textShadow: `10px 10px 0 ${INK}`}}>
      ESCAPED THROUGH
      <br />
      <span style={{color: GOLD}}>6 INCHES</span>
    </div>
    <div style={{position: 'absolute', left: 30, top: 470}}>
      <Door w={620} glow>
        <Squeeze t={0.62} color={CREAM} />
      </Door>
    </div>
    <div style={{position: 'absolute', left: 140, top: 1340, fontFamily: DISPLAY, fontSize: 90, color: GOLD, background: INK, padding: '0 24px', transform: 'rotate(-5deg)'}}>6 INCHES</div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 140, textAlign: 'center'}}>
      <span style={{fontFamily: DISPLAY, fontSize: 70, color: GOLD, background: INK, padding: '6px 30px', border: `6px solid ${GOLD}`}}>ESCAPED #3 · 2012</span>
    </div>
  </AbsoluteFill>
);
