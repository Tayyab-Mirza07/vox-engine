import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p} from '../lib';
import {has} from '../motion';
import {Bars, CREAM, Flash, GOLD, INK, Man, NAVY, Poster, Print, Rays, RED} from '../dillinger/parts';

export {RED};
export type SceneProps = {cue: Cues; beat: (f: number) => number};
const PH = 'mcnair/photos/';
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const lin = (n: number) => n;

const pop = (frame: number, at: number) => {
  const t = p(frame, at, 8);
  return {opacity: frame >= at ? 1 : 0, transform: `scale(${frame >= at ? 1 + 0.25 * Math.sin(Math.min(1, t) * Math.PI) * (1 - t) + (1 - t) * 0.3 : 0.7})`};
};
const Title: React.FC<{at: number; until?: number; top?: number; size?: number; color?: string; shadow?: string; children: React.ReactNode}> = ({at, until = 1e9, top = 170, size = 110, color = INK, shadow = RED, children}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, textShadow: `6px 6px 0 ${shadow}`, ...pop(frame, at), zIndex: 5}}>
      {children}
    </div>
  );
};
const Tag: React.FC<{at: number; until?: number; x: number; y: number; r?: number; size?: number; bg?: string; color?: string; children: React.ReactNode}> = ({at, until = 1e9, x, y, r = -6, size = 64, bg = RED, color = CREAM, children}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const s = pop(frame, at);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) ${s.transform}`, fontFamily: DISPLAY, fontSize: size, color, background: bg, padding: '6px 26px', border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, whiteSpace: 'nowrap', zIndex: 6}}>
      {children}
    </div>
  );
};
const Credit: React.FC<{t: string; light?: boolean}> = ({t, light}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: light ? '#ffffff99' : '#00000088', zIndex: 7}}>{t}</div>;
const Photo: React.FC<{src: string; w: number; h: number; x: number; y: number; r?: number; at?: number; pos?: string; color?: boolean}> = ({src, w, h, x, y, r = -3, at = 0, pos = '50% 30%', color}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, transform: `rotate(${r}deg) ${pop(frame, at).transform}`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: color ? 'contrast(1.1) saturate(0.8) sepia(0.2)' : 'grayscale(1) contrast(1.3) sepia(0.3)'}} />
    </div>
  );
};

// ───────────── props drawn in code ─────────────
/** Modern patrol car, side view, with a light bar. */
const Cruiser: React.FC<{w: number; lights?: boolean; color?: string}> = ({w, lights, color = INK}) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 5) % 2 === 0;
  return (
    <svg width={w} height={w * 0.42} viewBox="0 0 500 210" style={{overflow: 'visible'}}>
      <g fill={color}>
        <path d="M14 160 L14 124 Q16 110 40 106 L130 98 L176 54 Q184 46 198 46 L322 46 Q336 46 346 54 L392 98 L470 106 Q490 110 490 130 L490 160 Z" />
      </g>
      <path d="M190 60 L252 60 L252 96 L150 96 Z M264 60 L326 60 L372 96 L264 96 Z" fill={CREAM} opacity={0.22} />
      <rect x={120} y={116} width={360} height={14} fill={CREAM} opacity={0.85} />
      <rect x={220} y={30} width={44} height={16} fill={lights && on ? RED : '#6b1414'} />
      <rect x={264} y={30} width={44} height={16} fill={lights && !on ? '#2f6bff' : '#1b2d5c'} />
      <circle cx={112} cy={162} r={36} fill={color} />
      <circle cx={392} cy={162} r={36} fill={color} />
      <circle cx={112} cy={162} r={14} fill="#888" />
      <circle cx={392} cy={162} r={14} fill="#888" />
    </svg>
  );
};
/** Dash-cam overlay: REC dot, timestamp, frame corners. */
const DashCam: React.FC<{stamp?: string}> = ({stamp = '04/05/2006  15:42'}) => {
  const frame = useCurrentFrame();
  const c = (s: React.CSSProperties) => <div style={{position: 'absolute', width: 70, height: 70, borderColor: CREAM, borderStyle: 'solid', borderWidth: 0, ...s}} />;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 4}}>
      {c({left: 50, top: 330, borderLeftWidth: 8, borderTopWidth: 8})}
      {c({right: 50, top: 330, borderRightWidth: 8, borderTopWidth: 8})}
      {c({left: 50, top: 1320, borderLeftWidth: 8, borderBottomWidth: 8})}
      {c({right: 50, top: 1320, borderRightWidth: 8, borderBottomWidth: 8})}
      <div style={{position: 'absolute', left: 90, top: 360, fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: CREAM, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 30, height: 30, borderRadius: 15, background: RED, opacity: Math.floor(frame / 12) % 2 ? 0.25 : 1}} />
        REC
      </div>
      <div style={{position: 'absolute', right: 90, top: 1330, fontFamily: 'monospace', fontWeight: 700, fontSize: 36, color: CREAM}}>{stamp}</div>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, #ffffff08 0 2px, transparent 2px 6px)'}} />
    </AbsoluteFill>
  );
};
/** Railroad tracks in perspective, scrolling toward the viewer. */
const Tracks: React.FC<{top?: number; speed?: number}> = ({top = 900, speed = 6}) => {
  const frame = useCurrentFrame();
  const h = 1920 - top;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, height: h, overflow: 'hidden'}}>
      <svg width={1080} height={h} viewBox={`0 0 1080 ${h}`}>
        <path d={`M500 0 L580 0 L1080 ${h} L0 ${h} Z`} fill="#6b5a3c" opacity={0.5} />
        {Array.from({length: 14}, (_, i) => {
          const t = (((i / 14 + (frame * speed) / 2000) % 1) + 1) % 1;
          const y = t * t * h;
          const half = lerp(60, 640, t * t);
          return <rect key={i} x={540 - half} y={y} width={half * 2} height={lerp(4, 34, t * t)} fill={INK} />;
        })}
        <path d={`M520 0 L524 0 L250 ${h} L200 ${h} Z`} fill="#3a3a3a" />
        <path d={`M556 0 L560 0 L880 ${h} L830 ${h} Z`} fill="#3a3a3a" />
      </svg>
    </div>
  );
};
const Calendar: React.FC<{x: number; y: number; month: string; day: string; year: string; at?: number; w?: number}> = ({x, y, month, day, year, at = 0, w = 460}) => {
  const frame = useCurrentFrame();
  const flip = p(frame, at, 14);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, background: CREAM, border: `8px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, transform: `perspective(1200px) rotateX(${(1 - flip) * 80}deg)`, transformOrigin: '50% 0%', opacity: frame >= at ? 1 : 0}}>
      <div style={{height: w * 0.24, background: RED, fontFamily: DISPLAY, fontSize: w * 0.17, color: CREAM, textAlign: 'center', lineHeight: `${w * 0.24}px`}}>{month}</div>
      <div style={{fontFamily: DISPLAY, fontSize: w * 0.5, color: INK, textAlign: 'center', lineHeight: 1.15}}>{day}</div>
      <div style={{fontFamily: DISPLAY, fontSize: w * 0.13, color: RED, textAlign: 'center', paddingBottom: 10}}>{year}</div>
    </div>
  );
};
/** Grey U.S. mail sack. */
const Sack: React.FC<{w: number; r?: number; label?: boolean}> = ({w, r = 0, label}) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{overflow: 'visible', transform: `rotate(${r}deg)`}}>
    <path d="M14 40 Q10 10 40 14 L170 18 Q194 18 190 46 L184 120 Q182 134 164 134 L30 132 Q12 130 12 114 Z" fill="#8d8a7e" stroke={INK} strokeWidth={6} />
    <path d="M40 30 Q60 46 44 70 M150 34 Q132 54 152 80" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
    {label ? <text x={100} y={96} textAnchor="middle" fontFamily={DISPLAY} fontSize={30} fill={INK}>U.S. MAIL</text> : null}
  </svg>
);
const Pallet: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 0.12} viewBox="0 0 500 60">
    <rect x={0} y={0} width={500} height={18} fill="#a77b43" stroke={INK} strokeWidth={5} />
    {[10, 230, 450].map((x) => <rect key={x} x={x} y={18} width={40} height={30} fill="#8a6330" stroke={INK} strokeWidth={5} />)}
    <rect x={0} y={46} width={500} height={14} fill="#a77b43" stroke={INK} strokeWidth={5} />
  </svg>
);
/** Chain-link fence with razor wire. */
const Fence: React.FC<{top: number; color?: string}> = ({top, color = '#cfc6ad'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, height: 520, backgroundImage: `repeating-linear-gradient(45deg, ${color}99 0 4px, transparent 4px 46px), repeating-linear-gradient(-45deg, ${color}99 0 4px, transparent 4px 46px)`, borderTop: `14px solid ${color}`}}>
    {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 96 - 20, top: -72, width: 90, height: 60, border: `5px solid ${color}`, borderRadius: '50%'}} />)}
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 210 + 10, top: -20, width: 18, height: 540, background: color}} />)}
  </div>
);
const Dog: React.FC<{w: number; flip?: boolean}> = ({w, flip}) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{transform: flip ? 'scaleX(-1)' : undefined}}>
    <path d="M30 60 Q40 44 70 48 L140 48 Q156 30 158 14 L170 10 L176 26 Q196 30 196 44 L172 56 L162 80 L158 136 L146 136 L142 90 L80 92 L72 136 L60 136 L58 92 Q34 88 30 60 Z M30 60 L6 40 L10 34 L34 52 Z" fill={INK} />
  </svg>
);
const Cuffs: React.FC<{w: number; open?: number}> = ({w, open = 0}) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 300 150">
    <circle cx={70} cy={75} r={52} fill="none" stroke="#c9c9c9" strokeWidth={18} />
    <path d="M122 75 L178 75" stroke="#c9c9c9" strokeWidth={10} strokeDasharray="14 6" />
    <circle cx={230 + open * 30} cy={75} r={52} fill="none" stroke="#c9c9c9" strokeWidth={18} strokeDasharray={open > 0.3 ? '200 130' : undefined} />
  </svg>
);
const LipBalm: React.FC<{h: number}> = ({h}) => (
  <svg width={h * 0.32} height={h} viewBox="0 0 64 200">
    <rect x={6} y={60} width={52} height={136} rx={10} fill={CREAM} stroke={INK} strokeWidth={6} />
    <rect x={6} y={60} width={52} height={40} fill={RED} />
    <rect x={12} y={10} width={40} height={54} rx={14} fill="#e8a0a0" stroke={INK} strokeWidth={6} />
  </svg>
);
/** Tally marks for "third escape". */
const Tally: React.FC<{n: number; at: number[]; size?: number; color?: string}> = ({n, at, size = 200, color = RED}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: size * 0.25}}>
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{width: size * 0.16, height: size, background: color, border: `6px solid ${INK}`, transform: `rotate(${i * 3 - 3}deg) scaleY(${p(frame, at[i] ?? 0, 6)})`, transformOrigin: '50% 100%'}} />
      ))}
    </div>
  );
};
const Badge: React.FC<{n: number; x?: number; y?: number}> = ({n, x = 540, y = 470}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%) rotate(-4deg)', fontFamily: DISPLAY, fontSize: 54, color: GOLD, background: INK, padding: '4px 24px', border: `5px solid ${GOLD}`, letterSpacing: 4, zIndex: 6}}>ESCAPED #{n}</div>
);
/** Mountie silhouette: campaign hat + red coat. */
const Mountie: React.FC<{h: number; flip?: boolean}> = ({h, flip}) => (
  <div style={{position: 'relative', width: h / 2, height: h}}>
    <Man h={h} hat="none" color={INK} flip={flip} />
    <svg width={h / 2} height={h} viewBox="0 0 200 400" style={{position: 'absolute', left: 0, top: 0, transform: flip ? 'scaleX(-1)' : undefined}}>
      <path d="M60 94 Q100 82 140 94 L146 200 L54 200 Z" fill={RED} />
      <path d="M48 46 L152 46 L152 54 L48 54 Z M74 46 L86 14 L100 24 L114 14 L126 46 Z" fill="#6b4a22" />
    </svg>
  </div>
);
const Rewind: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 18) return null;
  return (
    <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, #ffffff22 0 3px, transparent 3px 40px)', backgroundPositionY: frame * -60, zIndex: 8}}>
      <div style={{position: 'absolute', right: 90, top: 380, fontFamily: DISPLAY, fontSize: 100, color: CREAM}}>◀◀</div>
    </AbsoluteFill>
  );
};

// ───────────── 0 · Hook ─────────────
export const Hook: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [cam, talk, then, go] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3)), beat(cue.s(4))];
  const away = p(frame, go, 60, lin);
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      <Tracks top={1150} speed={0} />
      <div style={{position: 'absolute', left: -60, top: 1010}}><Cruiser w={560} lights /></div>
      <div style={{position: 'absolute', left: 420, top: 690}}><Man h={640} hat="cap" flip /></div>
      <div style={{position: 'absolute', left: lerp(680, 1180, away), top: lerp(690, 640, away), transform: `scale(${lerp(1, 0.7, away)})`, transformOrigin: '50% 100%'}}><Man h={640} hat="none" pose={frame >= go ? 'walk' : 'stand'} step={frame / 3} /></div>
      {frame >= cam ? <DashCam /> : null}
      <Title at={0} until={cam} top={170} size={108} color={CREAM} shadow={INK}>A COP STOPPED AN<br /><span style={{color: GOLD}}>ESCAPED KILLER</span></Title>
      <Title at={cam} until={talk} top={170} size={130} color={CREAM} shadow={INK}>ON <span style={{color: GOLD}}>CAMERA</span></Title>
      <Title at={talk} until={then} top={170} size={120} color={CREAM} shadow={INK}><span style={{color: GOLD}}>10</span> MINUTES</Title>
      <Title at={then} top={170} size={116} color={CREAM} shadow={INK}>...AND LET<br />HIM <span style={{color: GOLD}}>GO</span></Title>
      <Badge n={2} y={500} />
    </AbsoluteFill>
  );
};

// ───────────── 1 · Ball, Louisiana ─────────────
export const Ball: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [ball, officer] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      {frame < ball ? (
        <Calendar x={290} y={430} month="APRIL" day="5" year="2006" at={2} w={500} />
      ) : (
        <>
          <Tracks top={760} speed={8} />
          <div style={{position: 'absolute', left: 470, top: 640, transform: 'scale(0.55)', transformOrigin: '50% 100%'}}><Man h={400} hat="none" pose="run" step={frame / 2} /></div>
        </>
      )}
      <Title at={ball} until={officer} top={170} size={110}>BALL, <span style={{color: RED}}>LOUISIANA</span></Title>
      <Title at={officer} top={150} size={96}>OFFICER<br /><span style={{color: RED}}>CARL BORDELON</span></Title>
      <Tag at={officer} x={540} y={1100} size={56} bg={INK} color={GOLD}>A MAN ON THE TRACKS</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 2 · Calm, friendly ─────────────
const Bubble: React.FC<{at: number; x: number; y: number; children: React.ReactNode; flip?: boolean}> = ({at, x, y, children, flip}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) ${pop(frame, at).transform}`, background: CREAM, border: `6px solid ${INK}`, borderRadius: 40, padding: '18px 36px', fontFamily: DISPLAY, fontSize: 58, color: INK, whiteSpace: 'nowrap', boxShadow: `8px 8px 0 ${INK}`, zIndex: 6}}>
      {children}
      <div style={{position: 'absolute', [flip ? 'right' : 'left']: 60, bottom: -40, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `40px solid ${INK}`}} />
    </div>
  );
};
export const Friendly: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [friendly, fake] = [beat(cue.s(1)), beat(cue.s(2))];
  const jog = beat(cue.w('jogging'));
  const joke = beat(cue.w('jokes'));
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <div style={{position: 'absolute', left: 130, top: 700}}><Man h={660} hat="cap" /></div>
      <div style={{position: 'absolute', left: 620, top: 700}}><Man h={660} hat="none" flip /></div>
      <Title at={2} until={friendly} size={120}>CALM.</Title>
      <Title at={friendly} until={fake} size={120}>CALM. <span style={{color: RED}}>FRIENDLY.</span></Title>
      <Title at={fake} size={100}>A <span style={{color: RED}}>FAKE</span> NAME</Title>
      <Bubble at={fake} x={720} y={560} flip>MY NAME'S... UH</Bubble>
      <Bubble at={jog} x={720} y={460} flip>JUST JOGGING!</Bubble>
      <Tag at={joke} x={540} y={640} size={64} bg={GOLD} color={INK} r={4}>HA HA HA</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 3 · Let him walk away ─────────────
export const WalkAway: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [nophoto, away] = [beat(cue.s(1)), beat(cue.s(2))];
  const t = p(frame, away, 70, lin);
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      {frame < nophoto ? (
        <>
          <Tag at={4} x={540} y={760} size={90} r={-4}>PRISON BREAK NEARBY</Tag>
          <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center'}}><Man h={500} hat="cap" color="#05070c" /></div>
        </>
      ) : frame < away ? (
        <>
          <div style={{position: 'absolute', left: 290, top: 500, width: 500, height: 620, background: CREAM, border: `8px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 300, color: '#00000030'}}>?</div>
          <div style={{position: 'absolute', left: 250, top: 790, width: 580, height: 40, background: RED, transform: 'rotate(-30deg)'}} />
          <Title at={nophoto} color={CREAM} shadow={RED} size={104}>NO PHOTO.<br /><span style={{color: GOLD}}>NO REASON.</span></Title>
        </>
      ) : (
        <>
          <Tracks top={1000} speed={0} />
          <div style={{position: 'absolute', left: 140, top: 720}}><Man h={620} hat="cap" /></div>
          <div style={{position: 'absolute', left: lerp(560, 860, t), top: lerp(720, 600, t), transform: `scale(${lerp(1, 0.45, t)})`, transformOrigin: '50% 100%'}}><Man h={620} hat="none" pose="walk" step={frame / 3} flip /></div>
          <Title at={away} color={CREAM} shadow={RED} size={104}>HE LET HIM<br /><span style={{color: GOLD}}>WALK AWAY</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 4 · Reveal: Richard Lee McNair ─────────────
export const Reveal: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [murderer, first, third] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  const mug = real('mcnair.jpg');
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" spin={0.4} />
      <Flash at={0} />
      {frame < first ? (
        <>
          {mug ? <Photo src={mug} w={760} h={560} x={160} y={420} r={-2} at={2} pos="50% 30%" /> : null}
          <Title at={2} top={150} size={104} color={CREAM} shadow={INK}>RICHARD LEE<br /><span style={{color: GOLD}}>McNAIR</span></Title>
          <Tag at={murderer} x={540} y={1080} size={72} bg={INK} color={GOLD}>CONVICTED MURDERER</Tag>
          {mug ? <Credit t="U.S. Marshals Service photo · public domain" light /> : null}
        </>
      ) : (
        <>
          <Title at={first} until={third} top={180} size={110} color={CREAM} shadow={INK}>NOT HIS <span style={{color: GOLD}}>FIRST</span><br />ESCAPE</Title>
          <Title at={third} top={200} size={130} color={CREAM} shadow={INK}>HIS <span style={{color: GOLD}}>THIRD</span></Title>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
            <Tally n={3} at={[first + 4, first + 12, third]} size={420} color={CREAM} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 5 · 1987, Minot ─────────────
const Elevator: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 1.3} viewBox="0 0 400 520">
    <g fill={INK}>
      <rect x={40} y={120} width={70} height={400} rx={30} />
      <rect x={115} y={120} width={70} height={400} rx={30} />
      <rect x={190} y={120} width={70} height={400} rx={30} />
      <rect x={270} y={20} width={110} height={500} />
      <path d="M270 20 L325 0 L380 20 Z" />
    </g>
    <rect x={300} y={90} width={40} height={40} fill={GOLD} />
  </svg>
);
export const Minot: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [minot, sgt, killed] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', right: 140, top: 340, width: 150, height: 150, borderRadius: 75, background: CREAM, opacity: 0.85}} />
      <div style={{position: 'absolute', left: 340, top: 560}}><Elevator w={560} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1280, height: 400, background: INK}} />
      {frame >= sgt ? <div style={{position: 'absolute', left: 120, top: 830}}><Man h={480} hat="none" pose="walk" step={frame / 4} color="#05070c" /></div> : null}
      <Rewind />
      <Title at={0} until={minot} color={CREAM} shadow={RED} size={120}>REWIND<br /><span style={{color: GOLD}}>1987</span></Title>
      <Title at={minot} color={CREAM} shadow={RED} size={110}>MINOT,<br /><span style={{color: GOLD}}>NORTH DAKOTA</span></Title>
      <Tag at={sgt} until={killed} x={540} y={480} size={54} bg={CREAM} color={INK}>AIR FORCE SERGEANT · BURGLARY</Tag>
      <Tag at={killed} x={540} y={480} size={64}>1 KILLED · 1 WOUNDED</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 6 · Lip balm ─────────────
export const LipBalmScene: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const balm = beat(cue.s(1));
  const grease = beat(cue.w('greased'));
  const slip = beat(cue.w('slipped'));
  const out = p(frame, slip, 14);
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      {/* chair */}
      <div style={{position: 'absolute', left: 120, top: 760, width: 30, height: 560, background: INK}} />
      <div style={{position: 'absolute', left: 120, top: 1060, width: 400, height: 30, background: INK}} />
      {/* wrist + cuffs */}
      <div style={{position: 'absolute', left: 80, top: 700, transform: 'rotate(-4deg)'}}><Cuffs w={560} open={out} /></div>
      <div style={{position: 'absolute', left: lerp(290, 760, out), top: lerp(700, 560, out), width: 320, height: 150, borderRadius: 60, background: INK, transform: `rotate(${lerp(-6, -24, out)}deg)`}} />
      {frame >= balm ? <div style={{position: 'absolute', left: 800, top: 860, transform: `rotate(18deg) ${pop(frame, balm).transform}`}}><LipBalm h={340} /></div> : null}
      {frame >= grease && frame < slip ? <div style={{position: 'absolute', left: 340, top: 720, width: 260, height: 110, borderRadius: 60, background: '#ffffff', opacity: 0.25 + 0.15 * Math.sin(frame / 2)}} /> : null}
      <Title at={2} until={balm} size={104}>CUFFED TO<br />A <span style={{color: RED}}>CHAIR</span></Title>
      <Title at={balm} until={slip} size={110}>LIP <span style={{color: RED}}>BALM</span></Title>
      <Title at={slip} size={110}>SLIPPED<br /><span style={{color: RED}}>RIGHT OUT</span></Title>
      <Tag at={4} x={540} y={470} size={52} bg={INK} color={GOLD} r={-3}>POLICE STATION · 1988</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 7 · A warning ─────────────
export const Warning: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const warn = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={frame < warn ? CREAM : GOLD} />
      <Rays />
      {frame < warn ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', gap: 20}}>
            <Man h={560} hat="cap" />
            <Man h={560} hat="none" pose="up" />
            <Man h={560} hat="cap" flip />
          </div>
          <Title at={2} size={110}>CAUGHT.<br /><span style={{color: RED}}>THIS TIME.</span></Title>
        </>
      ) : (
        <>
          <svg width={620} height={560} viewBox="0 0 620 560" style={{position: 'absolute', left: 230, top: 560}}>
            <path d="M310 20 L600 540 L20 540 Z" fill={RED} stroke={INK} strokeWidth={20} strokeLinejoin="round" />
            <text x={310} y={470} textAnchor="middle" fontFamily={DISPLAY} fontSize={330} fill={CREAM}>!</text>
          </svg>
          <Title at={warn} size={120}>A <span style={{color: RED}}>WARNING</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 8 · Life → air vent, 1992 ─────────────
export const Vent: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const vent = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      {frame < vent ? (
        <>
          <Bars color="#c9b98f" />
          <Tag at={4} x={540} y={900} size={200} r={-8}>LIFE</Tag>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 420, background: '#5d6470', borderTop: `14px solid ${INK}`, borderBottom: `14px solid ${INK}`}} />
          {[0, 1, 2].map((k) => {
            const x = ((frame - vent) * 9 + k * 300) % 1500 - 300;
            return (
              <div key={k} style={{position: 'absolute', left: x, top: 760, transform: 'rotate(90deg)', transformOrigin: '50% 50%'}}>
                <Man h={360} hat="none" pose="up" color={INK} />
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 420, backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 18px, transparent 18px 70px)`, opacity: 0.85, clipPath: 'inset(0 0 0 70%)'}} />
          <Title at={vent} color={CREAM} shadow={RED} size={110}>1992<br /><span style={{color: GOLD}}>AIR VENT</span></Title>
          <Tag at={beat(vent + 20)} x={540} y={1130} size={60} bg={CREAM} color={INK}>+ 2 OTHER INMATES</Tag>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 9 · Nine months ─────────────
export const NineMonths: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const caught = beat(cue.w('caught'));
  const n = Math.min(9, 1 + Math.floor((frame / Math.max(1, caught)) * 9));
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: DISPLAY, fontSize: 560, lineHeight: 1, color: INK, textShadow: `14px 14px 0 ${RED}`}}>{n}</div>
      <Title at={2} size={110}>MONTHS <span style={{color: RED}}>FREE</span></Title>
      <Tag at={caught} x={540} y={1110} size={76}>CAUGHT · NEBRASKA</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 10 · USP Pollock ─────────────
export const Pollock: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const fed = beat(cue.s(1));
  const pic = real('pollock.jpg');
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <Title at={2} until={fed} size={110} color={CREAM} shadow={INK}>SOMEWHERE<br /><span style={{color: GOLD}}>TOUGHER</span></Title>
      <Title at={fed} size={104}>POLLOCK,<br /><span style={{color: RED}}>LOUISIANA</span></Title>
      {frame < fed ? <Bars color={INK} /> : null}
      {pic && frame >= fed ? <Photo src={pic} w={980} h={560} x={50} y={520} r={-2} at={fed} color /> : null}
      <Tag at={beat(fed + 16)} x={540} y={1110} size={54} bg={INK} color={GOLD}>HIGH-SECURITY FEDERAL PRISON</Tag>
      {pic && frame >= fed ? <Credit t="USP Pollock · Federal Bureau of Prisons · public domain" /> : null}
    </AbsoluteFill>
  );
};

// ───────────── 11 · The mailbag job ─────────────
export const Mailbags: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [bags, plan] = [beat(cue.s(1)), beat(cue.s(2))];
  const days = Math.max(0, Math.floor((frame - plan) / 3));
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      <div style={{position: 'absolute', left: 120, top: 640}}><Man h={600} hat="none" /></div>
      {frame >= bags
        ? [[520, 900, -8], [700, 960, 6], [600, 820, -2], [800, 860, 10], [480, 1010, 4]].map(([x, y, r], k) => (
            <div key={k} style={{position: 'absolute', left: x, top: y, opacity: frame >= bags + k * 3 ? 1 : 0}}><Sack w={280} r={r} label={k === 2} /></div>
          ))
        : null}
      <Title at={2} until={plan} color={CREAM} shadow={INK} size={110}>HIS JOB:<br /><span style={{color: GOLD}}>MAILBAGS</span></Title>
      <Title at={plan} color={CREAM} shadow={INK} size={104}>DAY AFTER DAY<br /><span style={{color: GOLD}}>HE PLANNED</span></Title>
      {frame >= plan ? (
        <div style={{position: 'absolute', left: 80, right: 80, top: 440, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center'}}>
          {Array.from({length: Math.min(36, days)}, (_, i) => <div key={i} style={{width: 14, height: 60, background: CREAM, transform: i % 5 === 4 ? 'rotate(60deg)' : undefined}} />)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── 12 · The pod ─────────────
export const Pod: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [move, cut] = [beat(cue.s(1)), beat(cue.s(2))];
  const tube = beat(cue.w('breathe'));
  const mx = lerp(0, 1200, p(frame, move, Math.max(30, cut - move - 4), lin));
  return (
    <AbsoluteFill>
      <Poster bg={frame < move ? CREAM : NAVY} dots={frame < move ? '#00000018' : '#ffffff10'} />
      {frame >= move && frame < cut ? <Fence top={1040} /> : null}
      {frame < cut ? (
        <div style={{position: 'absolute', left: frame < move ? 140 : 140 + mx, top: 560}}>
          <div style={{position: 'relative', width: 800, height: 760}}>
            {/* man curled inside, revealed as a cut-away */}
            <div style={{position: 'absolute', left: 230, top: 250, width: 340, height: 280, borderRadius: 140, background: '#000000aa', border: `6px dashed ${GOLD}`}} />
            <div style={{position: 'absolute', left: 300, top: 280, transform: 'rotate(-70deg) scale(0.55)', transformOrigin: '50% 50%'}}><Man h={400} hat="none" pose="up" color={GOLD} /></div>
            {frame >= tube ? <div style={{position: 'absolute', left: 470, top: -40, width: 26, height: 330, background: GOLD, border: `5px solid ${INK}`, borderRadius: 12}} /> : null}
            {[[0, 80, -6], [260, 40, 4], [520, 90, 8], [-20, 330, 3], [560, 340, -5], [120, 520, 2], [400, 530, -3]].map(([x, y, r], k) => (
              <div key={k} style={{position: 'absolute', left: x, top: y, opacity: 0.93}}><Sack w={300} r={r} label={k === 1} /></div>
            ))}
            <div style={{position: 'absolute', left: 0, top: 730}}><Pallet w={820} /></div>
          </div>
        </div>
      ) : null}
      {frame >= cut ? (
        <>
          <Fence top={1060} />
          <div style={{position: 'absolute', left: lerp(380, 820, p(frame, cut + 10, 80, lin)), top: 560, transform: `scale(${lerp(1, 0.6, p(frame, cut + 10, 80, lin))})`, transformOrigin: '50% 100%'}}><Man h={560} hat="none" pose="walk" step={frame / 3} color={CREAM} /></div>
        </>
      ) : null}
      <Title at={2} until={tube} size={104}>A HIDING <span style={{color: RED}}>POD</span></Title>
      <Title at={tube} until={move} size={104}>+ A BREATHING<br /><span style={{color: RED}}>TUBE</span></Title>
      <Title at={move} until={cut} color={CREAM} shadow={RED} size={104}>OUTSIDE<br /><span style={{color: GOLD}}>THE FENCE</span></Title>
      <Title at={cut} color={CREAM} shadow={RED} size={110}>HE WALKED<br /><span style={{color: GOLD}}>AWAY</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 13 · Talked his way free ─────────────
export const Talked: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const begin = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={frame < begin ? GOLD : RED} dots="#00000022" />
      <Rays color="#00000022" />
      {frame < begin ? (
        <>
          <Tracks top={1150} speed={0} />
          <div style={{position: 'absolute', left: -40, top: 1010}}><Cruiser w={560} lights /></div>
          <div style={{position: 'absolute', left: 420, top: 690}}><Man h={640} hat="cap" flip /></div>
          <div style={{position: 'absolute', left: 680, top: 690}}><Man h={640} hat="none" /></div>
          <DashCam />
          <Title at={2} size={100}>HOURS <span style={{color: RED}}>LATER</span></Title>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><Man h={760} hat="none" pose="run" step={frame / 2} /></div>
          <Title at={begin} color={CREAM} shadow={INK} size={110}>ONLY THE<br /><span style={{color: GOLD}}>BEGINNING</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 14 · Most Wanted → Canada ─────────────
export const Border: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const canada = beat(cue.s(1));
  const mug = real('mcnair.jpg');
  const x = lerp(-200, 1100, p(frame, canada + 4, 90, lin));
  return (
    <AbsoluteFill>
      {frame < canada ? (
        <>
          <Poster />
          <Rays />
          <div style={{position: 'absolute', left: 190, top: 330, width: 700, height: 980, background: CREAM, border: `10px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(-2deg) ${pop(frame, 2).transform}`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 150, color: RED, textAlign: 'center', lineHeight: 1.1}}>WANTED</div>
            <div style={{fontFamily: DISPLAY, fontSize: 46, color: INK, textAlign: 'center'}}>U.S. MARSHALS · 15 MOST WANTED</div>
            {mug ? <Img src={staticFile(mug)} style={{display: 'block', margin: '20px auto', width: 600, height: 470, objectFit: 'cover', objectPosition: '50% 25%', filter: 'grayscale(1) contrast(1.3) sepia(0.3)', border: `6px solid ${INK}`}} /> : null}
            <div style={{fontFamily: DISPLAY, fontSize: 64, color: INK, textAlign: 'center'}}>RICHARD LEE McNAIR</div>
            <div style={{fontFamily: DISPLAY, fontSize: 56, color: RED, textAlign: 'center'}}>$25,000 REWARD</div>
          </div>
          {mug ? <Credit t="U.S. Marshals Service photo · public domain" /> : null}
        </>
      ) : (
        <>
          <Poster bg={NAVY} dots="#ffffff10" />
          <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 500, background: '#1f2a1c'}} />
          <div style={{position: 'absolute', left: 520, top: 640, width: 24, height: 520, background: CREAM}} />
          <div style={{position: 'absolute', left: 230, top: 560, width: 620, height: 140, background: CREAM, border: `6px solid ${INK}`, display: 'flex', fontFamily: DISPLAY, fontSize: 64, color: INK}}>
            <div style={{flex: 1, textAlign: 'center', lineHeight: '128px', borderRight: `6px solid ${INK}`}}>USA</div>
            <div style={{flex: 1, textAlign: 'center', lineHeight: '128px', color: RED}}>CANADA</div>
          </div>
          <div style={{position: 'absolute', left: x, top: 820}}><Man h={480} hat="none" pose="walk" step={frame / 3} color="#05070c" /></div>
          <Title at={canada} color={CREAM} shadow={RED} size={104}>INTO <span style={{color: GOLD}}>CANADA</span></Title>
          <Tag at={beat(canada + 14)} x={540} y={470} size={52} bg={CREAM} color={INK}>~2 WEEKS AFTER THE ESCAPE</Tag>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 15 · Stolen car, the dog ─────────────
export const Dogs: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [ran, dog] = [beat(cue.s(1)), beat(cue.s(2))];
  const run = p(frame, ran, 40, lin);
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1160, height: 500, background: '#141414'}} />
      {/* trees */}
      {[60, 260, 820, 960].map((x, k) => <div key={k} style={{position: 'absolute', left: x, top: 560 + (k % 2) * 60, width: 0, height: 0, borderLeft: '90px solid transparent', borderRight: '90px solid transparent', borderBottom: `600px solid #0d1a12`}} />)}
      <div style={{position: 'absolute', left: 60, top: 980}}><Cruiser w={500} color="#2a2a2a" /></div>
      {frame < dog ? (
        <div style={{position: 'absolute', left: lerp(500, 1150, run), top: 760}}><Man h={420} hat="none" pose={frame >= ran ? 'run' : 'stand'} step={frame / 2} color={CREAM} /></div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 560, top: 1020}}><Dog w={300} /></div>
          <div style={{position: 'absolute', left: 620, top: 860, fontFamily: DISPLAY, fontSize: 140, color: GOLD}}>?</div>
        </>
      )}
      <Title at={2} until={ran} color={CREAM} shadow={RED} size={110}>A STOLEN<br /><span style={{color: GOLD}}>CAR</span></Title>
      <Title at={ran} until={dog} color={CREAM} shadow={RED} size={120}>HE <span style={{color: GOLD}}>RAN</span></Title>
      <Title at={dog} color={CREAM} shadow={RED} size={104}>EVEN THE <span style={{color: GOLD}}>DOG</span><br />LOST HIM</Title>
      <Tag at={4} x={540} y={500} size={52} bg={CREAM} color={INK}>BRITISH COLUMBIA</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 16 · TV → fingerprints ─────────────
export const TV: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [prints, was] = [beat(cue.s(1)), beat(cue.s(2))];
  const mug = real('mcnair.jpg');
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      {frame < prints ? (
        <div style={{position: 'absolute', left: 140, top: 480, width: 800, height: 640, background: INK, borderRadius: 40, padding: 40, boxSizing: 'border-box', boxShadow: `14px 14px 0 ${RED}`}}>
          <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', background: '#222'}}>
            {mug ? <Img src={staticFile(mug)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%', filter: 'grayscale(0.6) contrast(1.2)'}} /> : null}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: RED, fontFamily: DISPLAY, fontSize: 64, color: CREAM, textAlign: 'center', padding: 8}}>MOST WANTED</div>
            <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, #ffffff10 0 2px, transparent 2px 5px)'}} />
          </div>
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 120, top: 520}}><Print size={360} /></div>
          <div style={{position: 'absolute', left: 600, top: 520}}><Print size={360} /></div>
          <div style={{position: 'absolute', left: 470, top: 700, fontFamily: DISPLAY, fontSize: 150, color: RED}}>=</div>
        </>
      )}
      <Title at={2} until={prints} size={104}>HE KNEW<br /><span style={{color: RED}}>THE FACE</span></Title>
      <Title at={prints} size={104}>FINGERPRINTS<br /><span style={{color: RED}}>MATCH</span></Title>
      <Tag at={was} x={540} y={1060} size={90} r={-8}>IT WAS McNAIR</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 17 · Caught by the Mounties ─────────────
export const Caught: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [place, stop, over] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={frame < stop ? CREAM : NAVY} dots={frame < stop ? '#00000018' : '#ffffff10'} />
      {frame < stop ? (
        <>
          <Calendar x={290} y={430} month="OCTOBER" day="25" year="2007" at={2} w={500} />
          <Tag at={place} x={540} y={1110} size={50} bg={INK} color={GOLD}>CAMPBELLTON, NEW BRUNSWICK</Tag>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1200, height: 500, background: '#1d1d1d'}} />
          <div style={{position: 'absolute', left: -40, top: 1010}}><Cruiser w={600} lights /></div>
          <div style={{position: 'absolute', left: 560, top: 700}}><Mountie h={560} flip /></div>
          <div style={{position: 'absolute', left: 820, top: 720}}><Man h={540} hat="none" pose="up" /></div>
          <Title at={stop} until={over} color={CREAM} shadow={RED} size={104}>A ROUTINE<br /><span style={{color: GOLD}}>TRAFFIC STOP</span></Title>
          {frame >= over ? <Bars color={INK} open={1 - p(frame, over, 14)} /> : null}
          <Title at={over} color={CREAM} shadow={RED} size={110}>18 MONTHS<br /><span style={{color: GOLD}}>OVER</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 18 · The question ─────────────
export const Question: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [q, helped, alone] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={frame < q ? INK : RED} dots="#ffffff10" />
      {frame < q ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center'}}><Man h={700} hat="none" color="#2a2a2a" /></div>
          <Bars color="#c9b98f" />
          <Tag at={4} x={540} y={1080} size={90} r={-6}>LIFE</Tag>
        </>
      ) : (
        <>
          <Rays color="#00000022" />
          <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: DISPLAY, fontSize: 520, color: CREAM, textShadow: `14px 14px 0 ${INK}`}}>?</div>
          {frame >= helped && frame < alone ? <div style={{position: 'absolute', left: 120, top: 760}}><Man h={520} hat="none" color="#05070c" /></div> : null}
          {frame >= alone ? <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center', fontFamily: DISPLAY, fontSize: 84, color: GOLD, textShadow: `6px 6px 0 ${INK}`}}>"I DID IT ALONE."</div> : null}
        </>
      )}
      <Title at={2} until={q} color={CREAM} shadow={RED} size={110}>BACK BEHIND<br /><span style={{color: GOLD}}>BARS</span></Title>
      <Title at={q} until={helped} color={CREAM} shadow={INK} size={110}>ONE QUESTION<br /><span style={{color: GOLD}}>REMAINS</span></Title>
      <Title at={helped} color={CREAM} shadow={INK} size={110}>DID SOMEONE<br /><span style={{color: GOLD}}>HELP HIM?</span></Title>
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
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}><Man h={500} hat="none" /></div>
        <Tag at={4} x={340} y={560} size={84} bg={GOLD} color={INK} r={-6}>GENIUS?</Tag>
        <Tag at={beat(16)} x={720} y={700} size={70} bg={INK} color={GOLD} r={5}>INSIDE HELP?</Tag>
        <Title at={2} color={CREAM} shadow={INK} size={110}>WHAT DO<br /><span style={{color: GOLD}}>YOU</span> THINK?</Title>
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
      <Title at={cta} top={150} size={104}>WATCH<br /><span style={{color: RED}}>ESCAPED #1</span></Title>
      <div style={{position: 'absolute', left: 330, top: 400, width: 420, height: 620, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(-2deg) ${pop(frame, cta + 2).transform}`}}>
        <Img src={staticFile('mcnair/cta/dillinger.png')} style={{width: '100%', height: '88%', objectFit: 'cover'}} />
        <div style={{fontFamily: DISPLAY, fontSize: 42, color: INK, textAlign: 'center'}}>THE WOODEN GUN</div>
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
export const McnairThumb: React.FC = () => (
  <AbsoluteFill>
    <Poster bg={RED} dots="#00000022" />
    <Rays color="#00000026" />
    <div style={{position: 'absolute', top: 90, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 140, lineHeight: 0.95, color: CREAM, textShadow: `10px 10px 0 ${INK}`}}>
      THE COP
      <br />
      <span style={{color: GOLD}}>LET HIM GO</span>
    </div>
    <div style={{position: 'absolute', left: 200, top: 430, width: 680, height: 470, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, transform: 'rotate(-3deg)'}}>
      <Img src={staticFile('mcnair/photos/mcnair.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%', filter: 'grayscale(1) contrast(1.3) sepia(0.3)'}} />
    </div>
    <div style={{position: 'absolute', left: 620, top: 830, transform: 'rotate(8deg)', fontFamily: DISPLAY, fontSize: 70, color: CREAM, background: INK, padding: '4px 22px', border: `5px solid ${CREAM}`}}>KILLER</div>
    <Tracks top={1250} speed={0} />
    <div style={{position: 'absolute', left: -40, top: 1180}}><Cruiser w={520} lights /></div>
    <div style={{position: 'absolute', left: 430, top: 980}}><Man h={520} hat="cap" flip /></div>
    <div style={{position: 'absolute', left: 700, top: 980}}><Man h={520} hat="none" pose="walk" step={1} /></div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center'}}>
      <span style={{fontFamily: DISPLAY, fontSize: 70, color: GOLD, background: INK, padding: '6px 30px', border: `6px solid ${GOLD}`}}>ESCAPED #2 · 2006</span>
    </div>
  </AbsoluteFill>
);
