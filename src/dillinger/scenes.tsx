import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, lerp, p} from '../lib';
import {has} from '../motion';
import {Bank, Bars, Car, CREAM, Flames, Flash, GOLD, INK, Man, Marquee, NAVY, Pistol, Poster, Print, Rain, Rays, RED, Star, Tommy} from './parts';

export {RED};
export type SceneProps = {cue: Cues; beat: (f: number) => number};
const PH = 'dillinger/photos/';
const real = (n: string) => (has(`${PH}${n}`) ? `${PH}${n}` : null);
const lin = (n: number) => n;

/** Pop-in on a beat: scale overshoot. */
const pop = (frame: number, at: number) => {
  const t = p(frame, at, 8);
  return {opacity: frame >= at ? 1 : 0, transform: `scale(${frame >= at ? 1 + 0.25 * Math.sin(Math.min(1, t) * Math.PI) * (1 - t) + (1 - t) * 0.3 : 0.7})`};
};
/** Poster title: chunky ink letters with a red offset shadow. */
const Title: React.FC<{at: number; until?: number; top?: number; size?: number; color?: string; shadow?: string; children: React.ReactNode}> = ({at, until = 1e9, top = 170, size = 110, color = INK, shadow = RED, children}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, textShadow: `6px 6px 0 ${shadow}`, ...pop(frame, at), zIndex: 5}}>
      {children}
    </div>
  );
};
const Tag: React.FC<{at: number; x: number; y: number; r?: number; size?: number; bg?: string; color?: string; children: React.ReactNode}> = ({at, x, y, r = -6, size = 64, bg = RED, color = CREAM, children}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = pop(frame, at);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) ${s.transform}`, fontFamily: DISPLAY, fontSize: size, color, background: bg, padding: '6px 26px', border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, whiteSpace: 'nowrap', zIndex: 6}}>
      {children}
    </div>
  );
};
const Credit: React.FC<{t: string; light?: boolean}> = ({t, light}) => <div style={{position: 'absolute', left: 30, bottom: 150, fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: light ? '#ffffff99' : '#00000088', zIndex: 7}}>{t}</div>;
/** Real archive photo turned into a halftone poster print. */
const Print1934: React.FC<{src: string; w: number; h: number; x: number; y: number; r?: number; at?: number; pos?: string}> = ({src, w, h, x, y, r = -3, at = 0, pos = '50% 30%'}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, transform: `rotate(${r}deg) ${pop(frame, at).transform}`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.35) sepia(0.35)'}} />
    </div>
  );
};

// ───────────── 0 · Hook ─────────────
export const Hook: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [weapon, wood, polish] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
        {frame < weapon ? <Man h={900} pose="gun" /> : <div style={{transform: `rotate(-12deg) scale(${lerp(1.15, 1, p(frame, weapon, 10))})`}}><Pistol w={900} wood={frame >= wood ? p(frame, wood, 12) : 0} /></div>}
      </div>
      {frame < weapon ? <Bars color="#0b0a09cc" open={0} /> : null}
      <Title at={0} until={weapon} top={170} size={120} color={CREAM} shadow={INK}>"ESCAPE-PROOF"</Title>
      <Title at={weapon} until={wood} top={170} size={120} color={CREAM} shadow={INK}>HIS WEAPON?</Title>
      <Title at={wood} top={170} size={110} color={CREAM} shadow={INK}>A <span style={{color: GOLD}}>WOODEN</span> GUN</Title>
      <Tag at={polish} x={540} y={1150} size={70} bg={INK} color={GOLD}>+ SHOE POLISH</Tag>
      <Tag at={0} x={540} y={420} size={60} bg={CREAM} color={INK} r={4}>1934</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 1 · Who ─────────────
export const Who: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const farm = beat(cue.s(1));
  const mug = real('mug.jpg');
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      {mug ? <Print1934 src={mug} w={600} h={760} x={240} y={300} at={2} /> : null}
      <Title at={2} top={150} size={120}>JOHN <span style={{color: RED}}>DILLINGER</span></Title>
      {frame >= farm ? (
        <>
          <Tag at={farm} x={300} y={1100} size={56} r={-5}>INDIANA FARM BOY</Tag>
          <Tag at={beat(farm + 20)} x={760} y={1180} size={56} r={5} bg={INK}>10 YEARS</Tag>
        </>
      ) : null}
      {mug ? <Credit t="FBI mugshot · public domain" /> : null}
    </AbsoluteFill>
  );
};

// ───────────── 2 · Prison trained him ─────────────
export const Trained: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [trained, gang] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', gap: 10}}>
        {[0, 1, 2, 3, 4].map((k) => (
          <div key={k} style={{opacity: frame >= gang + k * 4 ? 1 : k === 2 ? 1 : 0.0}}>
            <Man h={k === 2 ? 620 : 520} color={k === 2 ? INK : '#05070c'} flip={k > 2} hat={k === 2 ? 'fedora' : 'fedora'} />
          </div>
        ))}
      </div>
      <Bars color="#c9b98f" n={8} w={22} />
      <Title at={2} until={trained} color={CREAM} shadow={RED}>PRISON DIDN'T FIX HIM</Title>
      <Title at={trained} color={CREAM} shadow={RED}>IT <span style={{color: GOLD}}>TRAINED</span> HIM</Title>
      <Tag at={gang} x={540} y={1150} size={70}>THE GANG</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 3 · Bank spree ─────────────
export const Banks: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [fast, polite, theatrical, vault] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3)), beat(cue.s(4))];
  const jump = p(frame, vault, 24, lin);
  return (
    <AbsoluteFill>
      <Poster />
      <Rays color="#d6282818" />
      {frame < vault ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center'}}>
          <Bank w={900} />
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 140, background: INK}} />
          <div style={{position: 'absolute', left: lerp(120, 640, jump), top: 560 - Math.sin(jump * Math.PI) * 300, transform: `rotate(${lerp(-10, 20, jump)}deg)`}}>
            <Man h={560} pose="run" step={frame / 2} />
          </div>
        </>
      )}
      <Title at={2} until={fast} size={96}>1933 · <span style={{color: RED}}>BANK</span> SPREE</Title>
      <Tag at={fast} x={260} y={360} size={64} r={-8}>FAST</Tag>
      <Tag at={polite} x={560} y={420} size={64} r={5} bg={INK}>POLITE</Tag>
      <Tag at={theatrical} x={820} y={360} size={56} r={-4} bg={GOLD} color={INK}>THEATRICAL</Tag>
      <Title at={vault} top={330} size={90}>OVER THE <span style={{color: RED}}>COUNTER</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 4 · Smuggled guns, 10 escape ─────────────
export const Smuggle: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const out = beat(cue.s(1));
  const n = Math.min(10, Math.max(0, Math.floor((frame - out) / 5)));
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, height: 520, background: INK}} />
      {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 92, top: 400, width: 60, height: 40, background: INK}} />)}
      <div style={{position: 'absolute', left: 380, top: 560, width: 320, height: 380, background: frame >= out ? GOLD : '#3a0d0d'}} />
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 520 + (i % 2 ? 1 : -1) * (40 + i * 34) - 90, top: 760 + (i % 3) * 20}}>
          <Man h={360} pose="run" step={frame / 2 + i} flip={i % 2 === 0} />
        </div>
      ))}
      {frame < out ? (
        <div style={{position: 'absolute', left: 340, top: 1000, transform: 'rotate(-8deg)'}}>
          <Tommy w={420} />
        </div>
      ) : null}
      <Title at={2} until={out} color={CREAM} shadow={INK} size={100}>GUNS <span style={{color: GOLD}}>SMUGGLED IN</span></Title>
      <Title at={out} color={CREAM} shadow={INK} size={130}>{n} ESCAPED</Title>
    </AbsoluteFill>
  );
};

// ───────────── 5 · Ohio jailbreak ─────────────
export const Ohio: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const killed = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <Rain />
      {frame < killed ? (
        <div style={{position: 'absolute', left: lerp(-600, 300, p(frame, 0, killed, lin)), top: 960}}>
          <Car w={720} lights />
        </div>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', ...pop(frame, killed)}}>
          <Star size={520} ribbon />
        </div>
      )}
      <Title at={2} until={killed} color={CREAM} shadow={RED} size={100}>THE GANG <span style={{color: GOLD}}>RETURNS</span></Title>
      <Title at={killed} color={CREAM} shadow={RED} size={96}>A SHERIFF WAS <span style={{color: RED}}>KILLED</span></Title>
      <Tag at={4} x={540} y={420} size={54} bg={CREAM} color={INK} r={3}>LIMA, OHIO · 1933</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 6 · Tucson fire ─────────────
export const Tucson: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [fire, mag, cuffs] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={frame >= fire && frame < mag ? '#2a0c08' : CREAM} />
      {frame < mag ? (
        <>
          <div style={{position: 'absolute', left: 140, top: 560, width: 800, height: 700, background: INK}}>
            {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: 60 + (i % 4) * 180, top: 60 + Math.floor(i / 4) * 200, width: 100, height: 120, background: frame >= fire ? GOLD : '#2a2a2a'}} />)}
          </div>
          {frame >= fire ? <div style={{position: 'absolute', left: 100, top: 300}}><Flames w={880} h={520} /></div> : null}
          <Title at={2} until={fire} size={110}>JAN <span style={{color: RED}}>1934</span></Title>
          <Title at={fire} color={CREAM} shadow={RED} size={100}>TUCSON · HOTEL <span style={{color: GOLD}}>FIRE</span></Title>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 230, top: 380, width: 620, height: 820, background: GOLD, border: `8px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, opacity: pop(frame, mag).opacity, transform: `rotate(-3deg) ${pop(frame, mag).transform}`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: RED, textAlign: 'center', marginTop: 30, lineHeight: 1}}>TRUE<br />DETECTIVE</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', gap: 6}}>
              {[0, 1, 2].map((k) => <Man key={k} h={360} />)}
            </div>
          </div>
          <Title at={mag} size={84}>FIREMEN <span style={{color: RED}}>RECOGNIZED</span> THEM</Title>
          <Tag at={cuffs} x={540} y={1150} size={70} bg={INK}>ARRESTED · NO SHOTS</Tag>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 7 · Crown Point ─────────────
export const Crown: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const proof = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      <div style={{position: 'absolute', left: 120, top: 520, width: 840, height: 680, background: INK}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: -120, height: 120, background: INK, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}} />
        {Array.from({length: 8}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 60 + (i % 4) * 190, top: 70 + Math.floor(i / 4) * 280, width: 110, height: 170, background: CREAM}}>
            {[0, 1, 2].map((b) => <div key={b} style={{position: 'absolute', left: 18 + b * 32, top: 0, bottom: 0, width: 10, background: INK}} />)}
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: DISPLAY, fontSize: 50, color: CREAM}}>LAKE COUNTY JAIL</div>
      </div>
      <Title at={2} size={100}>CROWN POINT, <span style={{color: RED}}>INDIANA</span></Title>
      <Tag at={proof} x={540} y={860} size={96} r={-8}>"ESCAPE-PROOF"</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 8 · The photo ─────────────
export const Photo: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const smile = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" />
      <div style={{position: 'absolute', left: 140, top: 480, width: 800, height: 760, background: CREAM, border: `8px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 120, top: 120}}><Man h={640} hat="none" /></div>
        <div style={{position: 'absolute', left: 360, top: 100}}><Man h={660} pose="stand" /></div>
        <div style={{position: 'absolute', left: 330, top: 290, width: 140, height: 30, background: INK, transform: 'rotate(-14deg)'}} />
        <div style={{position: 'absolute', left: 30, bottom: 20, fontFamily: DISPLAY, fontSize: 36, color: INK}}>THE PROSECUTOR &nbsp;·&nbsp; DILLINGER</div>
      </div>
      <Flash at={8} />
      <Flash at={smile} />
      <Title at={2} until={smile} size={100}>SAY <span style={{color: RED}}>CHEESE</span></Title>
      <Title at={smile} size={110}>HE WAS <span style={{color: RED}}>SMILING</span></Title>
      <Credit t="Illustration of a famous 1934 press photo" />
    </AbsoluteFill>
  );
};

// ───────────── 9 · March 3 ─────────────
export const March: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const flip = p(frame, 4, 14);
  return (
    <AbsoluteFill>
      <Poster bg={INK} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 240, top: 520, width: 600, height: 700, background: CREAM, border: `10px solid ${RED}`, transform: `perspective(1200px) rotateX(${(1 - flip) * 80}deg)`, transformOrigin: '50% 0%'}}>
        <div style={{height: 160, background: RED, fontFamily: DISPLAY, fontSize: 110, color: CREAM, textAlign: 'center', lineHeight: '160px'}}>MARCH</div>
        <div style={{fontFamily: DISPLAY, fontSize: 380, color: INK, textAlign: 'center', lineHeight: 1.2}}>3</div>
        <div style={{fontFamily: DISPLAY, fontSize: 70, color: RED, textAlign: 'center'}}>1934</div>
      </div>
      <Title at={2} color={CREAM} shadow={RED} size={110}>HE MADE HIS <span style={{color: GOLD}}>MOVE</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 10 · The wooden gun ─────────────
export const WoodGun: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const believed = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster bg={CREAM} />
      <Rays color="#d6282820" spin={0.4} />
      {frame < believed ? (
        <div style={{position: 'absolute', left: 60, top: 620, transform: `rotate(-10deg) scale(${lerp(0.9, 1.05, p(frame, 0, believed, lin))})`}}>
          <Pistol w={960} wood={1} />
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 40, top: 600}}><Man h={760} pose="gun" /></div>
          <div style={{position: 'absolute', left: 560, top: 640}}><Man h={700} pose="up" hat="cap" flip /></div>
          <div style={{position: 'absolute', left: 760, top: 680}}><Man h={660} pose="up" hat="cap" flip /></div>
        </>
      )}
      <Title at={2} until={believed} size={100}>CARVED FROM <span style={{color: RED}}>WOOD</span></Title>
      <Title at={believed} size={100}>THE GUARDS <span style={{color: RED}}>BELIEVED IT</span></Title>
      {frame < believed ? <Tag at={beat(20)} x={760} y={1150} size={56} bg={INK} color={GOLD}>BLACK SHOE POLISH</Tag> : null}
    </AbsoluteFill>
  );
};

// ───────────── 11 · Machine guns, walked out ─────────────
export const Walkout: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const out = beat(Math.round(cue.dur * 0.55));
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      {frame < out ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center', gap: 20}}>
            {[0, 1, 2].map((k) => <Man key={k} h={560} hat="cap" pose="up" />)}
          </div>
          <Bars color={INK} />
          <div style={{position: 'absolute', left: 100, top: 1080, transform: 'rotate(-6deg)'}}><Tommy w={420} /></div>
          <div style={{position: 'absolute', left: 560, top: 1080, transform: 'rotate(6deg) scaleX(-1)'}}><Tommy w={420} /></div>
          <Title at={2} color={CREAM} shadow={INK} size={96}>GUARDS · <span style={{color: GOLD}}>LOCKED UP</span></Title>
          <Tag at={beat(30)} x={540} y={470} size={60} bg={INK} color={GOLD}>+ 2 REAL MACHINE GUNS</Tag>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 280, top: 420, width: 520, height: 900, background: GOLD, border: `10px solid ${INK}`}} />
          <div style={{position: 'absolute', left: 380, top: 640}}><Man h={680} pose="tommy" /></div>
          <Title at={out} color={CREAM} shadow={INK} size={110}>WALKED <span style={{color: GOLD}}>OUT</span></Title>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 12 · Sheriff's car, state line ─────────────
export const StateLine: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const mistake = beat(cue.s(1));
  const x = lerp(-700, 1200, p(frame, 4, Math.max(20, mistake + 20), lin));
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1120, height: 300, background: '#1d1d1d'}}>
        {Array.from({length: 8}, (_, i) => <div key={i} style={{position: 'absolute', left: ((i * 180 - frame * 22) % 1440 + 1440) % 1440 - 180, top: 140, width: 100, height: 16, background: GOLD}} />)}
      </div>
      <div style={{position: 'absolute', left: 500, top: 640, width: 24, height: 480, background: CREAM}} />
      <div style={{position: 'absolute', left: 300, top: 560, width: 440, height: 130, background: CREAM, border: `6px solid ${INK}`, display: 'flex', fontFamily: DISPLAY, fontSize: 52, color: INK}}>
        <div style={{flex: 1, textAlign: 'center', lineHeight: '118px', borderRight: `6px solid ${INK}`}}>INDIANA</div>
        <div style={{flex: 1, textAlign: 'center', lineHeight: '118px'}}>ILLINOIS</div>
      </div>
      <div style={{position: 'absolute', left: x, top: 950}}><Car w={640} lights /></div>
      <Title at={2} until={mistake} color={CREAM} shadow={RED} size={96}>THE <span style={{color: GOLD}}>SHERIFF'S</span> OWN CAR</Title>
      <Title at={mistake} color={CREAM} shadow={RED} size={96}>HIS BIGGEST <span style={{color: RED}}>MISTAKE</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 13 · Federal ─────────────
export const Federal: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const agents = beat(cue.s(1));
  return (
    <AbsoluteFill>
      <Poster />
      <Rays />
      {frame < agents ? (
        <Tag at={4} x={540} y={820} size={120} r={-8}>FEDERAL CRIME</Tag>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 0}}>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{opacity: frame >= agents + k * 3 ? 1 : 0, transform: `translateY(${k === 2 ? -30 : 0}px)`}}>
              <Man h={k === 2 ? 640 : 560} pose="walk" step={frame / 3 + k} />
            </div>
          ))}
        </div>
      )}
      <Title at={2} until={agents} size={96}>STOLEN CAR + <span style={{color: RED}}>STATE LINE</span></Title>
      <Title at={agents} size={92}>HOOVER'S <span style={{color: RED}}>AGENTS</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 14 · Public Enemy No. 1 ─────────────
export const Enemy: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const burn = beat(cue.s(1));
  const poster = real('poster.jpg');
  const faces = real('faces.jpg');
  return (
    <AbsoluteFill>
      <Poster bg={RED} dots="#00000022" />
      <Rays color="#00000022" />
      {frame < burn ? (
        <>
          {poster ? <Print1934 src={poster} w={620} h={900} x={230} y={380} r={-3} at={2} pos="50% 20%" /> : null}
          <Title at={2} color={CREAM} shadow={INK} size={110}>PUBLIC ENEMY <span style={{color: GOLD}}>No.1</span></Title>
          {poster ? <Credit t="FBI wanted poster, 1934 · public domain" light /> : null}
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 120, top: 520}}><Print size={300} burn={p(frame, burn, 30)} /></div>
          {faces ? <Print1934 src={faces} w={460} h={360} x={520} y={600} r={4} at={beat(burn + 30)} pos="50% 50%" /> : null}
          <Title at={burn} color={CREAM} shadow={INK} size={84}>ACID ON FINGERS · <span style={{color: GOLD}}>NEW FACE</span></Title>
          {faces ? <Credit t="FBI comparison photos · public domain" light /> : null}
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 15 · Biograph Theater ─────────────
export const Biograph: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [chicago, woman, sold] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 90, top: 400}}><Marquee w={900} text="BIOGRAPH" sub="MANHATTAN MELODRAMA" /></div>
      {frame >= woman ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 30}}>
          <Man h={600} hat="none" dress="#ff7a1a" />
          <Man h={640} pose="walk" step={frame / 4} />
        </div>
      ) : null}
      <Title at={2} until={chicago} color={CREAM} shadow={RED} size={110}>JULY 22, <span style={{color: GOLD}}>1934</span></Title>
      <Title at={chicago} until={sold} color={CREAM} shadow={RED} size={110}>CHICAGO</Title>
      <Title at={sold} color={CREAM} shadow={RED} size={100}>SHE <span style={{color: '#ff7a1a'}}>SOLD HIM OUT</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 16 · The alley ─────────────
export const Alley: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [ran, shot, age] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3))];
  return (
    <AbsoluteFill>
      <Poster bg={frame >= shot ? RED : INK} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, background: '#1a1a1a'}} />
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 260, background: '#1a1a1a'}} />
      {frame >= ran && frame < shot ? <div style={{position: 'absolute', left: lerp(300, 520, p(frame, ran, shot - ran, lin)), top: 700}}><Man h={560} pose="run" step={frame / 2} /></div> : null}
      {frame >= shot ? <div style={{position: 'absolute', left: 340, top: 1020, width: 420, height: 60, background: INK, borderRadius: 30}} /> : null}
      <Flash at={shot} color="#fff" />
      <Flash at={shot + 4} color="#fff" />
      <Title at={2} until={shot} color={CREAM} shadow={RED} size={100}>AGENTS <span style={{color: RED}}>WAITING</span></Title>
      <Title at={shot} color={CREAM} shadow={INK} size={130}>SHOT DEAD</Title>
      <Tag at={age} x={540} y={1150} size={80} bg={INK}>AGE 31</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 17 · Twist ─────────────
export const Twist: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [carve, bribe] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={GOLD} dots="#00000018" />
      <Rays color="#ffffff30" spin={0.3} />
      <div style={{position: 'absolute', left: 90, top: 620, transform: 'rotate(-8deg)'}}><Pistol w={900} wood={1} /></div>
      {frame >= bribe ? (
        <div style={{position: 'absolute', left: 620, top: 980, width: 300, height: 300, borderRadius: '45% 45% 40% 40%', background: '#4a7a3a', border: `8px solid ${INK}`, fontFamily: DISPLAY, fontSize: 180, color: CREAM, textAlign: 'center', lineHeight: '300px', ...pop(frame, bribe)}}>$</div>
      ) : null}
      <Title at={2} until={carve} size={110}>THE <span style={{color: RED}}>TWIST</span></Title>
      <Title at={carve} until={bribe} size={96}>DID HE <span style={{color: RED}}>CARVE IT?</span></Title>
      <Title at={bribe} size={96}>OR WAS IT A <span style={{color: RED}}>BRIBE?</span></Title>
    </AbsoluteFill>
  );
};

// ───────────── 18 · Was it him? ─────────────
export const Grave: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [dig, no] = [beat(cue.s(1)), beat(cue.s(2))];
  return (
    <AbsoluteFill>
      <Poster bg={NAVY} dots="#ffffff10" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 400, background: '#0b0f18'}} />
      <div style={{position: 'absolute', left: 330, top: 640, width: 420, height: 540, background: '#9aa3b2', borderRadius: '210px 210px 0 0', border: `8px solid ${INK}`, fontFamily: DISPLAY, color: INK, textAlign: 'center'}}>
        <div style={{fontSize: 64, marginTop: 120}}>JOHN H.</div>
        <div style={{fontSize: 64}}>DILLINGER</div>
        <div style={{fontSize: 48, marginTop: 10}}>1903–1934</div>
      </div>
      {frame >= dig && frame < no ? <div style={{position: 'absolute', left: 780, top: 760}}><Man h={500} pose="walk" step={frame / 4} /></div> : null}
      <Title at={2} until={dig} color={CREAM} shadow={RED} size={96}>WAS IT <span style={{color: GOLD}}>REALLY HIM?</span></Title>
      <Title at={dig} until={no} color={CREAM} shadow={RED} size={100}>2019: <span style={{color: GOLD}}>DIG HIM UP?</span></Title>
      <Title at={no} color={CREAM} shadow={RED} size={100}>COURT: <span style={{color: RED}}>NO</span></Title>
      <Tag at={no} x={540} y={900} size={110} r={-8}>DENIED</Tag>
    </AbsoluteFill>
  );
};

// ───────────── 19 · Ending + CTA ─────────────
export const Ending: React.FC<SceneProps> = ({cue, beat}) => {
  const frame = useCurrentFrame();
  const [him, comment, cta, follow] = [beat(cue.s(1)), beat(cue.s(2)), beat(cue.s(3)), beat(cue.s(4))];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Poster bg={RED} dots="#00000022" />
        <Rays color="#00000022" />
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><Man h={760} /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: DISPLAY, fontSize: 420, color: CREAM, opacity: 0.9, textShadow: `10px 10px 0 ${INK}`}}>?</div>
        <Title at={2} until={him} color={CREAM} shadow={INK} size={110}>WHAT DO <span style={{color: GOLD}}>YOU</span> THINK?</Title>
        <Title at={him} color={CREAM} shadow={INK} size={120}>WAS IT <span style={{color: GOLD}}>HIM?</span></Title>
        {frame >= comment ? (
          <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
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
      <Title at={cta} size={110}>WATCH <span style={{color: RED}}>NEXT</span></Title>
      <div style={{position: 'absolute', left: 260, top: 330, width: 560, height: 700, background: CREAM, padding: 14, boxSizing: 'border-box', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(-2deg) ${pop(frame, cta + 2).transform}`}}>
        <Img src={staticFile('dillinger/cta/alcatraz.jpg')} style={{width: '100%', height: '88%', objectFit: 'cover'}} />
        <div style={{fontFamily: DISPLAY, fontSize: 44, color: INK, textAlign: 'center'}}>ESCAPE FROM ALCATRAZ</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <div style={{width: 140, height: 140, borderRadius: '50%', background: '#000000aa', border: `5px solid ${CREAM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: CREAM, paddingLeft: 10}}>▶</div>
      </div>
      {frame >= follow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${pulse})`}}>
          <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 64, color: '#fff', background: '#e62117', padding: '14px 50px', borderRadius: 60, border: `5px solid ${INK}`}}>FOLLOW</div>
          <div style={{fontFamily: DISPLAY, fontSize: 48, color: INK}}>A NEW MYSTERY EVERY DAY</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────── Portrait thumbnail ─────────────
export const DillingerThumb: React.FC = () => (
  <AbsoluteFill>
    <Poster bg={RED} dots="#00000022" />
    <Rays color="#00000026" />
    <div style={{position: 'absolute', top: 90, left: 30, right: 30, textAlign: 'center', fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.95, color: CREAM, textShadow: `10px 10px 0 ${INK}`}}>
      ESCAPED WITH
      <br />
      <span style={{color: GOLD}}>A WOODEN GUN</span>
    </div>
    <div style={{position: 'absolute', left: 60, top: 620, transform: 'rotate(-12deg)'}}><Pistol w={960} wood={1} /></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 980, display: 'flex', justifyContent: 'center'}}><Man h={640} pose="gun" /></div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 230, textAlign: 'center'}}>
      <span style={{fontFamily: DISPLAY, fontSize: 80, color: CREAM, background: INK, padding: '6px 30px', border: `6px solid ${CREAM}`}}>JOHN DILLINGER · 1934</span>
    </div>
  </AbsoluteFill>
);
