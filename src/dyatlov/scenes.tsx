import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, lerp, p, slam} from '../lib';
import {Background, Headline, Photo, Stamp, Tag} from '../ui';
import {Forest, Paper, Typed} from '../dbcooper/parts';
import {Boots, Cedar, Embers, Footprints, Geiger, Hiker, ICE, Marker, NightSnow, SNOW, Slope, Tent, Thermo} from './parts';

export {ICE};

type SceneProps = {cue: Cues};
const URALS: LonLat = [59.45, 61.75];
const MEMORIAL = 'dyatlov/photos/group.jpg';
const MEMORIAL_CREDIT = 'Memorial, Yekaterinburg · Photo: Dmitry Nikishin, public domain';

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const I: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: ICE}}>{children}</span>;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red}}>{children}</span>;

/** Pop-in label card. */
const Card: React.FC<{at: number; children: React.ReactNode; color?: string; rotate?: number; size?: number}> = ({at, children, color = C.red, rotate = 0, size = 78}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = slam(frame, at, 1.8);
  return (
    <div style={{opacity: s.opacity, transform: `scale(${s.scale}) rotate(${rotate}deg)`, background: '#07090cee', border: `6px solid ${color}`, borderRadius: 16, padding: '10px 26px'}}>
      <Big size={size} color={color}>
        {children}
      </Big>
    </div>
  );
};

/** Counter card: "2 of 9 found". */
const Count: React.FC<{at: number; n: number; label?: string}> = ({at, n, label = 'of 9 found'}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = slam(frame, at, 1.6);
  return (
    <div style={{opacity: s.opacity, transform: `scale(${s.scale})`, display: 'flex', alignItems: 'baseline', gap: 18, background: '#07090cdd', border: `4px solid ${ICE}`, borderRadius: 18, padding: '6px 30px'}}>
      <span style={{fontFamily: DISPLAY, fontSize: 130, color: ICE}}>{n}</span>
      <span style={{fontFamily: DISPLAY, fontSize: 60, color: C.white, letterSpacing: 2}}>{label.toUpperCase()}</span>
    </div>
  );
};

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cut, cold, none, years] = [cue.w('cut'), cue.w('thirty'), cue.s(1), cue.s(2)];
  const push = lerp(1, 1.12, p(frame, 0, cue.dur));
  return (
    <AbsoluteFill>
      <NightSnow wind={1.6} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 60%'}}>
        <Slope top={820} />
        <div style={{position: 'absolute', top: 760, left: 300}}>
          <Tent width={480} glow={1 - p(frame, cut, 10)} slash={p(frame, cut, 14)} rotate={8} />
        </div>
      </AbsoluteFill>
      <Headline at={0} until={none - 1} size={150} y={150} color={ICE}>
        1959
      </Headline>
      {frame >= cold && frame < years ? (
        <Center top={360}>
          <Thermo show={p(frame, cold, 12)} />
        </Center>
      ) : null}
      {frame < years ? (
        <Stamp at={none} y={300} size={110} rotate={-6}>
          None came back
        </Stamp>
      ) : null}
      <Headline at={years} size={104} y={150}>
        60 years. <I>No answer.</I>
      </Headline>
      {frame >= years ? (
        <Center top={420} style={{opacity: p(frame, years + 6, 10)}}>
          <Big size={300} color={ICE} style={{opacity: 0.9}}>
            ?
          </Big>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Who and where ─────────────────────────
export const WhoWhere: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nine, igor, otorten] = [cue.s(1), cue.w('Igor'), cue.w('Otorten')];
  if (frame < nine) {
    const z = p(frame, 0, nine - 10);
    return (
      <AbsoluteFill>
        <Background tint={ICE} />
        <Headline at={2} size={96} y={150}>
          February 1959 · <I>Soviet Union</I>
        </Headline>
        <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Globe width={1000} height={900} center={[lerp(40, URALS[0], z), lerp(45, URALS[1] - 4, z)]} scale={lerp(380, 950, z)} routes={[]} pins={[{at: URALS, label: 'URAL MOUNTAINS', show: p(frame, cue.w('Ural'), 10), align: 'left'}]} highlight={['Russia']} frame={frame} />
        </div>
      </AbsoluteFill>
    );
  }
  const zoom = lerp(1, 2.5, p(frame, igor - 4, 30));
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Headline at={nine} until={igor - 2} size={100} y={140}>
        Nine <I>experienced</I> hikers
      </Headline>
      <Headline at={igor} size={100} y={140}>
        Led by <I>Igor Dyatlov</I>
      </Headline>
      <Center top={350} style={{opacity: p(frame, nine, 8)}}>
        <Photo src={MEMORIAL} width={920} height={720} zoom={zoom} focus="64% 37%" credit={MEMORIAL_CREDIT} accent={ICE} gray={1} />
      </Center>
      {frame >= igor ? (
        <Center top={1000} style={{opacity: p(frame, igor + 6, 8)}}>
          <Tag color={ICE} style={{fontSize: 44, padding: '12px 26px'}}>
            Group leader · age 23
          </Tag>
        </Center>
      ) : null}
      {frame >= otorten ? (
        <Center top={1090} style={{opacity: p(frame, otorten, 8)}}>
          <Tag color={C.white} style={{fontSize: 40, padding: '10px 24px'}}>
            Destination: Mount Otorten
          </Tag>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Yudin turns back ─────────────────────────
export const Yudin: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [back, fever] = [cue.w('turns'), cue.s(1)];
  const leave = p(frame, back - 6, 30);
  return (
    <AbsoluteFill>
      <NightSnow wind={0.6} flakes={60} />
      <Slope top={1000} height={920} />
      <Headline at={2} size={104} y={160}>
        A <I>tenth</I> man
      </Headline>
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        {Array.from({length: 9}, (_, i) => (
          <Hiker key={i} x={60 + i * 88} y={1290 + i * 18} h={200} color="#0b1622" />
        ))}
        <Hiker x={lerp(900, 1030, leave)} y={lerp(1452, 1480, leave)} h={200} color={frame >= back ? ICE : '#0b1622'} opacity={1 - 0.4 * leave} />
      </svg>
      {frame >= back - 4 ? (
        <div style={{position: 'absolute', top: 1000, right: 40, opacity: p(frame, back - 4, 8)}}>
          <Tag color={ICE} style={{fontSize: 40}}>Yuri Yudin</Tag>
        </div>
      ) : null}
      <Stamp at={fever} y={520} size={120} color={ICE}>
        Sole survivor
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The camp ─────────────────────────
export const Camp: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [name, dead] = [cue.w('Kholat'), cue.s(1)];
  return (
    <AbsoluteFill>
      <NightSnow wind={1.2} />
      <AbsoluteFill style={{transform: `scale(${lerp(1.05, 1.2, p(frame, 0, cue.dur))})`, transformOrigin: '45% 55%'}}>
        <Slope top={760} />
        <div style={{position: 'absolute', top: 750, left: 380}}>
          <Tent width={300} glow={1} rotate={8} />
        </div>
      </AbsoluteFill>
      <Headline at={2} until={dead - 1} size={100} y={150}>
        February 1, <I>1959</I>
      </Headline>
      {frame >= name && frame < dead ? (
        <Center top={460} style={{opacity: p(frame, name, 8)}}>
          <Tag color={C.white} style={{fontSize: 50, padding: '12px 28px'}}>
            Kholat Syakhl
          </Tag>
        </Center>
      ) : null}
      {frame >= dead ? (
        <Center top={250} style={{opacity: slam(frame, dead, 1.6).opacity, transform: `scale(${slam(frame, dead, 1.6).scale})`}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.dim}}>IN THE MANSI LANGUAGE</div>
            <Big size={190} color={C.red} style={{textShadow: `0 0 50px ${C.red}88`}}>
              DEAD MOUNTAIN
            </Big>
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · Re-hook: why run? ─────────────────────────
export const RehookRun: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [dark, boots] = [cue.w('dark'), cue.w('boots')];
  return (
    <AbsoluteFill>
      <NightSnow wind={2} dark={0.35 * p(frame, dark, 10)} />
      <Headline at={2} size={96} y={150}>
        Why run from their <I>only shelter</I>?
      </Headline>
      <Center top={430}>
        <Big size={420} color={ICE} style={{opacity: 0.9, transform: `scale(${1 + 0.03 * Math.sin(frame / 5)})`}}>
          ?
        </Big>
      </Center>
      {frame >= boots - 4 ? (
        <Center top={920} style={{opacity: p(frame, boots - 4, 6)}}>
          <Boots size={340} crossed={p(frame, boots + 4, 10)} />
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The search ─────────────────────────
export const Search: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [found, half, slashed] = [cue.s(1), cue.s(2), cue.s(3)];
  const walk = p(frame, 0, found, (n) => n);
  return (
    <AbsoluteFill>
      <NightSnow wind={0.8} flakes={60} />
      <AbsoluteFill style={{transform: `scale(${lerp(1, 1.35, p(frame, found, 60))})`, transformOrigin: '50% 58%'}}>
        <Slope top={760} />
        <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
          {Array.from({length: 5}, (_, i) => (
            <Hiker key={i} x={lerp(980, 760, walk) + i * 50} y={lerp(1060, 990, walk) + i * 18} h={110} color="#1b2a3a" opacity={1 - p(frame, found, 20)} />
          ))}
        </svg>
        <div style={{position: 'absolute', top: 750, left: 330}}>
          <Tent width={420} buried={0.25 + 0.4 * p(frame, half, 18)} slash={p(frame, slashed + 4, 16)} rotate={8} />
        </div>
      </AbsoluteFill>
      <Headline at={2} until={found - 1} size={100} y={150}>
        The <I>search</I>
      </Headline>
      <Headline at={found} size={100} y={150}>
        February 26, <I>1959</I>
      </Headline>
      {frame >= half && frame < slashed ? (
        <Center top={400} style={{opacity: p(frame, half, 8)}}>
          <Tag color={SNOW} style={{fontSize: 46}}>Half buried in snow</Tag>
        </Center>
      ) : null}
      <Stamp at={slashed + 10} y={460} size={96} rotate={-5}>
        Cut from the inside
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Left behind + footprints ─────────────────────────
export const Footsteps: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [outside, socks, bare, calm, mile] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.w('mile')];
  if (frame < outside) {
    const items = [
      {at: cue.w('Boots'), label: 'BOOTS'},
      {at: cue.w('coats'), label: 'COATS'},
      {at: cue.w('food'), label: 'FOOD'},
    ];
    return (
      <AbsoluteFill>
        <Background tint={ICE} />
        <Headline at={2} size={100} y={150}>
          Left <I>behind</I>
        </Headline>
        <Center top={400}>
          <Paper width={820} rotate={-1.5} style={{padding: '40px 50px'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>FOUND INSIDE THE TENT</div>
            {items.map((it) => (
              <div key={it.label} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 22, opacity: p(frame, it.at - 3, 6)}}>
                <div style={{width: 64, height: 64, border: '5px solid #1a1712', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 56, color: C.red}}>✓</div>
                <div style={{fontFamily: DISPLAY, fontSize: 90, letterSpacing: 3}}>{it.label}</div>
              </div>
            ))}
          </Paper>
        </Center>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #c9d6e4 0%, #9fb0c4 60%, #6f8299 100%)'}}>
      <div style={{position: 'absolute', top: 1120, left: 0, opacity: 0.95}}>
        <Forest width={1080} height={240} color="#0b1a14" seed={4} />
      </div>
      <div style={{position: 'absolute', top: 260, left: 470}}>
        <Tent width={160} buried={0.3} slash={1} />
      </div>
      <Footprints progress={p(frame, outside, cue.dur - outside - 30, (n) => n)} x0={540} y0={380} length={760} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 45%, #000000aa 100%)'}} />
      <Headline at={outside} size={100} y={110} color="#07090c">
        Footprints
      </Headline>
      {frame >= socks ? (
        <div style={{position: 'absolute', top: 560, left: 60, opacity: p(frame, socks, 6)}}>
          <Tag color="#07090c" style={{color: SNOW, fontSize: 44}}>In socks</Tag>
        </div>
      ) : null}
      {frame >= bare ? (
        <div style={{position: 'absolute', top: 760, right: 60, opacity: p(frame, bare, 6)}}>
          <Tag color={C.red} style={{color: C.white, fontSize: 44}}>Barefoot</Tag>
        </div>
      ) : null}
      {frame >= calm && frame < mile ? (
        <div style={{position: 'absolute', top: 960, left: 60, opacity: p(frame, calm, 6)}}>
          <Tag color="#07090c" style={{color: SNOW, fontSize: 40}}>Walking, not running</Tag>
        </div>
      ) : null}
      {frame >= mile ? (
        <Center top={960} style={{opacity: slam(frame, mile, 1.6).opacity, transform: `scale(${slam(frame, mile, 1.6).scale})`}}>
          <Big size={110} color="#07090c" style={{textShadow: 'none', background: SNOW, borderRadius: 16, padding: '0 30px'}}>
            ≈1.5 KM
          </Big>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · The cedar ─────────────────────────
export const TheCedar: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cedar, two, fire, barely] = [cue.w('cedar'), cue.w('two'), cue.w('fire'), cue.s(1)];
  return (
    <AbsoluteFill>
      <NightSnow wind={1} flakes={70} />
      <div style={{position: 'absolute', top: 1120, left: 0}}>
        <Forest width={1080} height={300} color="#050c09" seed={9} />
      </div>
      <div style={{position: 'absolute', top: 1340, left: 0, right: 0, height: 600, background: '#c9d6e4'}} />
      <Center top={lerp(520, 470, p(frame, cedar, 30))} style={{transform: `scale(${lerp(0.9, 1.05, p(frame, cedar, 40))})`, opacity: p(frame, 0, 10)}}>
        <Cedar height={820} />
      </Center>
      {frame >= fire - 4 ? (
        <div style={{position: 'absolute', top: 1170, left: 600}}>
          <Embers size={150} heat={lerp(1, 0.35, p(frame, fire + 20, 60))} />
        </div>
      ) : null}
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <Marker x={400} y={1300} show={p(frame, two, 8)} />
        <Marker x={480} y={1320} show={p(frame, two + 6, 8)} />
      </svg>
      <Headline at={2} size={100} y={150}>
        Under a tall <I>cedar</I>
      </Headline>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Count at={two} n={2} />
      </div>
      {frame >= barely ? (
        <div style={{position: 'absolute', top: 1000, left: 40, opacity: p(frame, barely, 6)}}>
          <Tag color={ICE} style={{fontSize: 44}}>Barely dressed · −30°C</Tag>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Trying to get back ─────────────────────────
export const GetBack: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [three, back] = [cue.w('Three'), cue.s(1)];
  const path = 'M 200 1180 Q 420 900 560 760 T 880 420';
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a1626 0%, #1c2e44 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <path d={path} fill="none" stroke={SNOW} strokeOpacity={0.4} strokeWidth={8} strokeDasharray="18 22" />
        <Marker x={340} y={1010} show={p(frame, three, 8)} />
        <Marker x={560} y={760} show={p(frame, three + 8, 8)} />
        <Marker x={720} y={590} show={p(frame, three + 16, 8)} />
        {frame >= back ? (
          <g opacity={p(frame, back, 8)}>
            <path d="M 760 520 L 860 430" stroke={ICE} strokeWidth={12} strokeLinecap="round" />
            <path d="M 820 420 L 870 425 L 862 476" fill="none" stroke={ICE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>
      <div style={{position: 'absolute', top: 1120, left: 110}}>
        <Cedar height={180} />
      </div>
      <div style={{position: 'absolute', top: 330, left: 800}}>
        <Tent width={190} buried={0.3} slash={1} />
      </div>
      <Tag color={C.white} style={{position: 'absolute', top: 1310, left: 70, fontSize: 30}}>Cedar</Tag>
      <Tag color={C.white} style={{position: 'absolute', top: 260, left: 830, fontSize: 30}}>Tent</Tag>
      <div style={{position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Count at={three} n={5} />
      </div>
      <Headline at={back} size={84} y={900}>
        They died trying <I>to get back</I>
      </Headline>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Re-hook: May ─────────────────────────
export const RehookMay: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [may, saw] = [cue.w('May'), cue.s(1)];
  const months = ['FEB', 'MAR', 'APR', 'MAY'];
  const idx = Math.min(3, Math.floor(p(frame, 6, Math.max(8, may - 6), (n) => n) * 3.999));
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Headline at={2} size={100} y={150}>
        The last <I>four</I>
      </Headline>
      <Center top={380}>
        <div style={{width: 520, borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 80px #000', transform: `scale(${frame >= may ? slam(frame, may, 1.3).scale : 1})`}}>
          <div style={{background: C.red, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.white}}>1959</div>
          <div style={{background: SNOW, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 220, color: idx === 3 ? C.red : '#1a1712'}}>{months[idx]}</div>
        </div>
      </Center>
      {frame >= may ? (
        <Center top={900} style={{opacity: p(frame, may + 4, 8)}}>
          <Tag color={ICE} style={{fontSize: 44}}>Three months later</Tag>
        </Center>
      ) : null}
      <Headline at={saw} size={92} y={1020}>
        What they found <I>made it famous</I>
      </Headline>
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The ravine ─────────────────────────
export const Ravine: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ribs, skull, force, wounds] = [cue.s(1), cue.s(2), cue.s(3), cue.w('wounds')];
  return (
    <AbsoluteFill>
      <NightSnow wind={0.5} flakes={50} />
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
        <path d="M 0 360 Q 300 380 470 900 Q 540 1010 610 900 Q 780 380 1080 360 L 1080 1920 L 0 1920 Z" fill="#c9d6e4" opacity={0.95} />
        <path d="M 0 360 Q 300 380 470 900 Q 540 1010 610 900 Q 780 380 1080 360" fill="none" stroke="#6f8299" strokeWidth={8} />
        <path d="M 380 700 Q 540 760 700 700" fill="none" stroke="#9fb0c4" strokeWidth={6} opacity={0.8} />
      </svg>
      <Headline at={2} size={96} y={140}>
        Deep in a <I>ravine</I>
      </Headline>
      <div style={{position: 'absolute', top: 470, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <Card at={ribs} rotate={-2}>
          Broken ribs
        </Card>
        <Card at={skull} rotate={1.5}>
          Fractured skull
        </Card>
        <Card at={force} rotate={-1}>
          Force of a car crash
        </Card>
        <Card at={wounds} color={ICE} rotate={1} size={70}>
          Almost no outer wounds
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Radiation ─────────────────────────
export const Radiation: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const rad = cue.w('radiation');
  return (
    <AbsoluteFill>
      <Background tint="#f2d03a" />
      <Headline at={2} size={92} y={150}>
        Their clothing <I>tested positive</I>
      </Headline>
      <Center top={420} style={{transform: `scale(${lerp(0.9, 1.05, p(frame, 0, cue.dur))})`}}>
        <Geiger size={640} level={p(frame, rad - 8, 12)} />
      </Center>
      {frame >= rad ? (
        <Center top={1110} style={{opacity: slam(frame, rad, 1.6).opacity, transform: `scale(${slam(frame, rad, 1.6).scale})`}}>
          <Big size={130} color="#f2d03a">
            RADIATION
          </Big>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The verdict ─────────────────────────
export const Verdict: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [quote, locked] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} size={96} y={150}>
        The official <I>verdict</I>
      </Headline>
      <Center top={420} style={{opacity: p(frame, 2, 8), transform: `scale(${lerp(1, 0.94, p(frame, locked, 14))})`}}>
        <Paper width={880} rotate={-1.5} style={{padding: '44px 48px'}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>USSR · CRIMINAL CASE · MAY 1959</div>
          <div style={{fontFamily: DISPLAY, fontSize: 64, marginTop: 16, letterSpacing: 2}}>CAUSE OF DEATH:</div>
          {frame >= quote ? <Typed text={'"A compelling natural force."'} at={quote} cps={26} style={{fontSize: 60, lineHeight: 1.3, color: '#7a1010'}} /> : null}
        </Paper>
      </Center>
      <Stamp at={locked + 4} y={900} size={130} rotate={-8}>
        Case closed
      </Stamp>
      {frame >= locked + 14 ? (
        <Center top={1060} style={{opacity: p(frame, locked + 14, 8)}}>
          <Tag color={C.white} style={{fontSize: 40}}>Files locked away</Tag>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · Theories ─────────────────────────
export const Theories: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [weapons, lights, yeti] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <NightSnow wind={1} flakes={50} />
      {frame >= lights ? (
        <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={300 + k * 240} cy={300 + Math.sin(frame / 10 + k) * 30} r={26} fill="#ffe9a8" opacity={0.6 * p(frame, lights + k * 4, 10)} style={{filter: 'drop-shadow(0 0 30px #ffe9a8)'}} />
          ))}
        </svg>
      ) : null}
      <Headline at={2} size={96} y={150}>
        Decades of <I>theories</I>
      </Headline>
      <div style={{position: 'absolute', top: 470, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <Card at={weapons} rotate={-2} color={C.red}>
          Secret weapon tests
        </Card>
        <Card at={lights} rotate={1.5} color="#ffe9a8">
          Strange lights in the sky
        </Card>
        <Card at={yeti} rotate={-1} color={ICE} size={96}>
          The Yeti?
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The answer (slab avalanche) ─────────────────────────
export const Answer: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [wind, broke, small, heavy, fled, cold] = [cue.s(1), cue.w('broke'), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  const pile = p(frame, wind, broke - wind, (n) => n);
  const slide = p(frame, broke, 20);
  const run = p(frame, fled, 60, (n) => n);
  const frost = p(frame, cold, 30);
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      {frame < wind ? (
        <>
          <Headline at={2} size={100} y={150}>
            <I>2021</I> · A likely answer
          </Headline>
          <Center top={430} style={{opacity: p(frame, 4, 8)}}>
            <Paper width={880} rotate={-1.5} style={{padding: '44px 48px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>SWISS STUDY · COMPUTER MODELS</div>
              <div style={{fontFamily: DISPLAY, fontSize: 72, marginTop: 14, lineHeight: 1.1}}>Gaume &amp; Puzrin</div>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, marginTop: 10, opacity: 0.75}}>Communications Earth &amp; Environment, 2021</div>
            </Paper>
          </Center>
        </>
      ) : (
        <>
          <svg width={1080} height={1920} style={{position: 'absolute', top: 0, left: 0}}>
            <g transform="translate(-300, -250) scale(1.5)">
            {/* slope cross-section with the tent dug into it */}
            <path d="M 0 420 L 1080 1180 L 1080 1400 L 0 1400 Z" fill="#9fb0c4" />
            <path d="M 0 420 L 1080 1180" stroke={SNOW} strokeWidth={6} />
            {/* wind-loaded snow above the tent */}
            <g transform={`translate(${slide * 170}, ${slide * 120})`}>
              <path d={`M 120 ${505 - pile * 60} L ${520} ${787 - pile * 70} L 520 787 L 120 505 Z`} fill={SNOW} stroke={ICE} strokeWidth={4} />
            </g>
            {/* tent */}
            <g transform="translate(560, 760) rotate(35)">
              <rect x={0} y={-60} width={170} height={60} fill="#8a7046" stroke="#2a2014" strokeWidth={4} transform={`scale(1, ${1 - 0.45 * slide})`} />
            </g>
            {frame >= wind && frame < broke + 20
              ? [0, 1, 2].map((k) => {
                  const x = ((frame * 14 + k * 300) % 900) - 100;
                  return <path key={k} d={`M ${x} ${300 + k * 60} q 60 -30 120 0 t 120 0`} fill="none" stroke={ICE} strokeWidth={8} strokeLinecap="round" opacity={0.8} />;
                })
              : null}
            {frame >= fled
              ? [0, 1, 2, 3].map((k) => <Hiker key={k} x={lerp(640, 850, run) + k * 24} y={lerp(860, 1010, run) + k * 16} h={60} color="#0b1622" />)
              : null}
            </g>
          </svg>
          <Headline at={wind} until={broke - 1} size={96} y={150}>
            Wind piled <I>heavy snow</I>
          </Headline>
          <Headline at={broke} until={fled - 1} size={110} y={150} color={ICE}>
            Slab avalanche
          </Headline>
          {frame >= small && frame < fled ? (
            <div style={{position: 'absolute', top: 1180, left: 50, display: 'flex', flexDirection: 'column', gap: 16}}>
              <Tag color={SNOW} style={{fontSize: 40, opacity: p(frame, small, 6)}}>Small → few traces</Tag>
              {frame >= heavy ? <Tag color={C.red} style={{fontSize: 40, color: C.white, opacity: p(frame, heavy, 6)}}>Heavy → crushing</Tag> : null}
            </div>
          ) : null}
          <Headline at={fled} until={cold - 1} size={96} y={150}>
            They fled, <I>expecting worse</I>
          </Headline>
          {frost > 0 ? <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${SNOW}55, #0a1626)`, opacity: 0.85 * frost}} /> : null}
          <Headline at={cold} size={120} y={600} color={SNOW}>
            The cold did the rest
          </Headline>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Ending + CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [doubt, ask, cta, ghost, freighter, both] = [cue.s(1), cue.s(2), cue.s(3), cue.w('ghost'), cue.w('freighter'), cue.w('both')];
  if (frame < cta) {
    return (
      <AbsoluteFill>
        <Background tint={ICE} />
        <Headline at={2} until={doubt - 1} size={110} y={140}>
          Today: <I>Dyatlov Pass</I>
        </Headline>
        <Headline at={doubt} size={96} y={140}>
          Snow… <I>or something else?</I>
        </Headline>
        <Center top={360} style={{opacity: p(frame, 2, 10)}}>
          <Photo src={MEMORIAL} width={900} height={640} zoom={lerp(1.15, 1, p(frame, 0, cta))} focus="50% 50%" credit={MEMORIAL_CREDIT} accent={ICE} gray={1} />
        </Center>
        {frame >= ask ? (
          <Center top={1040} style={{opacity: slam(frame, ask, 1.5).opacity, transform: `scale(${slam(frame, ask, 1.5).scale})`}}>
            <Tag color={ICE} style={{fontSize: 56, padding: '14px 34px'}}>What do you think? 💬</Tag>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  const card = (src: string, title: string, at: number, active: boolean) => {
    const s = slam(frame, at, 1.4);
    return (
      <div style={{width: 470, opacity: frame >= at ? s.opacity : 0, transform: `scale(${(frame >= at ? s.scale : 1) * (active ? pulse : 1)})`}}>
        <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${active ? ICE : C.line}`, boxShadow: active ? `0 0 60px ${ICE}88` : 'none'}}>
          <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 120, height: 120, borderRadius: '50%', background: '#000000aa', border: `5px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: C.white, paddingLeft: 10}}>▶</div>
          </div>
        </div>
        <div style={{fontFamily: DISPLAY, fontSize: 50, color: C.white, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>{title}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Headline at={cta + 2} size={120} y={130} color={ICE}>
        Watch next
      </Headline>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('dyatlov/cta/celeste.jpg', 'THE GHOST SHIP WITH NO ONE ON BOARD', Math.min(ghost, cta + 6), frame < freighter)}
        {card('dyatlov/cta/fitz.jpg', 'THE FREIGHTER THAT VANISHED', freighter, frame >= freighter && frame < both)}
      </div>
      {frame >= both ? (
        <Center top={1010} style={{opacity: p(frame, both, 8)}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 5}}>BOTH ON THIS CHANNEL</div>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3, marginTop: 6}}>CHRONOS GALAXY</div>
          </div>
        </Center>
      ) : null}
      {frame >= both + 20 ? (
        <Center top={1215} style={{transform: `scale(${pulse})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 62, color: '#07090c', background: ICE, padding: '14px 40px', borderRadius: 18, letterSpacing: 2}}>TAP · FOLLOW · WATCH NEXT</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
