import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cues, DISPLAY, W, lerp, p, rnd, slam} from '../lib';
import {Dust, Fog, Parallax, has} from '../motion';
import {LightSweep, Person} from '../bakerst/parts';
import {AMBER, BG, Bed, CREAM, Cord, DIM, Door, Flowers, Hotel, Lamp, Letter, Note, Phone, Print, RED, Shade, Typewriter, WOOD} from './parts';

export {RED};
type SceneProps = {cue: Cues};
const PH = 'room1046/photos/';
const CR: Record<string, string> = {
  'hotel.jpg': 'Hotel President today · Photo: Paul Sableman · CC BY 2.0',
  'sign.jpg': 'Hotel President today · Photo: BriYYZ · CC BY-SA 2.0',
  'hotel2.jpg': 'Hotel President today · Photo: Nightryder84 · CC BY-SA 3.0',
};
const pick = (...n: string[]): [string, string] => {
  const f = n.find((x) => has(`${PH}${x}`)) ?? n[n.length - 1];
  return [`${PH}${f}`, CR[f]];
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Tag: React.FC<{at: number; until?: number; top: number; children: React.ReactNode; color?: string}> = ({at, until = 1e9, top, children, color = AMBER}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <Center top={top} style={{opacity: p(frame, at, 8) * (1 - p(frame, until - 6, 6))}}>
      <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 42, letterSpacing: 5, color, background: '#000000c0', padding: '8px 22px', borderLeft: `6px solid ${RED}`}}>{children}</div>
    </Center>
  );
};
const Big: React.FC<{at: number; until?: number; top: number; children: React.ReactNode; color?: string; size?: number}> = ({at, until = 1e9, top, children, color = CREAM, size = 110}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const s = slam(frame, at, 1.6);
  return (
    <Center top={top} style={{opacity: s.opacity * (1 - p(frame, until - 6, 6)), transform: `scale(${s.scale})`}}>
      <div style={{fontFamily: DISPLAY, fontSize: size, color, textAlign: 'center', lineHeight: 1.02, letterSpacing: 2, textShadow: '0 8px 0 #000'}}>{children}</div>
    </Center>
  );
};
const Flash: React.FC<{at: number; color?: string}> = ({at, color = RED}) => {
  const frame = useCurrentFrame();
  const o = frame >= at ? 1 - p(frame, at, 12) : 0;
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o * 0.5}} /> : null;
};
const Vig: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, transparent 35%, #000000e6 100%)', pointerEvents: 'none'}} />;
/** The room set: wall, shaded window, bed, desk + lamp. */
const Room: React.FC<{dark?: number; shade?: number; lamp?: number}> = ({dark = 0.4, shade = 1, lamp = 1}) => (
  <>
    <AbsoluteFill style={{background: `linear-gradient(180deg, #2a2016 0%, #1a130c 60%, ${WOOD} 61%, #120c07 100%)`}} />
    <svg width={W} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.25}}>
      {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 95} y1={0} x2={i * 95} y2={1170} stroke="#4a3a26" strokeWidth={3} />)}
    </svg>
    <div style={{position: 'absolute', left: 640, top: 260}}>
      <Shade w={340} h={440} pulled={shade} />
    </div>
    <div style={{position: 'absolute', left: 60, top: 900}}>
      <Bed width={620} />
    </div>
    <div style={{position: 'absolute', left: 740, top: 950, width: 280, height: 220, background: WOOD, border: '6px solid #1a0f08'}} />
    <svg width={160} height={240} style={{position: 'absolute', left: 800, top: 730}}>
      <path d="M 30 20 L 130 20 L 110 100 L 50 100 Z" fill={AMBER} opacity={0.4 + 0.6 * lamp} />
      <rect x={74} y={100} width={12} height={120} fill="#3a2a1a" />
    </svg>
    <Lamp x={880} y={790} on={lamp} r={700} />
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [breath, tub] = [cue.s(1), cue.s(2)];
  if (frame >= breath) {
    // the "bathtub" lie
    return (
      <AbsoluteFill style={{background: BG}}>
        <Lamp x={540} y={700} r={900} />
        <Center top={480} style={{transform: `scale(${lerp(1.1, 1, p(frame, breath, 20))})`}}>
          <svg width={860} height={460} viewBox="0 0 860 460">
            <path d="M 60 120 L 800 120 Q 800 360 600 400 L 260 400 Q 60 360 60 120 Z" fill="#e8e4dc" stroke="#7a7268" strokeWidth={8} />
            <rect x={40} y={100} width={780} height={30} rx={14} fill="#f4f0e8" />
            <rect x={200} y={400} width={30} height={50} fill="#7a7268" />
            <rect x={630} y={400} width={30} height={50} fill="#7a7268" />
            <path d="M 700 60 L 700 110 M 680 60 L 740 60" stroke="#9a9288" strokeWidth={12} />
          </svg>
        </Center>
        <Big at={tub} top={200} size={96} color={CREAM}>
          "I FELL AGAINST
          <br />
          THE BATHTUB."
        </Big>
        <Flash at={tub} color={AMBER} />
        <Vig />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG}}>
      <Cord show={p(frame, 0, 40, (n) => n)} />
      <Center top={lerp(340, 300, p(frame, 0, breath, (n) => n))} style={{transform: `scale(${slam(frame, 2, 1.8).scale})`}}>
        <Door height={760} />
      </Center>
      <Big at={cue.w('Room')} top={1180} size={70} color={RED}>
        ROOM 1046
      </Big>
      <Flash at={cue.w('stabbed')} />
      <Flash at={cue.w('skull')} />
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Kansas City, the hotel ─────────────────────────
export const CheckIn: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [date, hotel, signs] = [cue.s(1), cue.s(2), cue.s(3)];
  const [photo, credit] = pick('hotel2.jpg', 'hotel.jpg');
  if (frame >= signs) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Lamp x={540} y={700} r={900} />
        <Center top={340} style={{transform: `perspective(1400px) rotateX(${lerp(40, 22, p(frame, signs, 20))}deg)`}}>
          <div style={{position: 'relative', width: 900, height: 640, background: `linear-gradient(90deg, ${CREAM}, #e0d2b0 50%, ${CREAM})`, boxShadow: '0 40px 80px #000', padding: 40, boxSizing: 'border-box'}}>
            <div style={{fontFamily: DISPLAY, fontSize: 48, color: '#5a3a1a', borderBottom: '4px solid #5a3a1a'}}>HOTEL PRESIDENT · REGISTER · JAN 2, 1935</div>
            {Array.from({length: 3}, (_, i) => <div key={i} style={{height: 2, background: '#8a7a5a', margin: '64px 0 0'}} />)}
            <div style={{position: 'absolute', top: 260, left: 80}}>
              <Typewriter text="Roland T. Owen — Los Angeles" at={signs + 6} cps={18} size={48} />
            </div>
          </div>
        </Center>
        <Vig />
      </AbsoluteFill>
    );
  }
  if (frame >= hotel) {
    return (
      <AbsoluteFill>
        <Parallax src={photo} t={p(frame, hotel, signs - hotel, (n) => n)} from={{s: 1.35, y: 80}} to={{s: 1.15, y: -40}} gray={0.6} dark={0.35} tint="#120c06" fog={0.4} credit={credit} fallback={<Center top={200}><Hotel width={600} lit={50} /></Center>} />
        <Tag at={hotel + 6} top={180}>
          HOTEL PRESIDENT · KANSAS CITY
        </Tag>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #05060c, #14100c)`}}>
      <Fog amount={0.7} color="#d8c8a8" />
      <Center top={lerp(420, 260, p(frame, 0, hotel, (n) => n))}>
        <Hotel width={560} lit={44} />
      </Center>
      <Big at={date} top={170} size={120} color={AMBER}>
        JAN 2, 1935
      </Big>
      <Dust />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · No luggage, inside room ─────────────────────────
export const NoLuggage: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [items, inside] = [cue.s(1), cue.s(2)];
  if (frame >= inside) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Parallax src={pick('hotel.jpg')[0]} t={p(frame, inside, cue.dur - inside, (n) => n)} from={{s: 1.5, x: -60, y: 60}} to={{s: 1.25, x: 0}} gray={0.5} dark={0.45} tint="#120c06" fog={0.4} credit={pick('hotel.jpg')[1]} fallback={<Center top={200}><Hotel width={520} lit={57} /></Center>} />
        <Tag at={inside + 10} top={1240}>
          INSIDE ROOM · 10TH FLOOR
        </Tag>
        <Vig />
      </AbsoluteFill>
    );
  }
  const icons = [
    {d: 'M 10 40 L 190 40 L 190 70 L 10 70 Z M 20 70 L 20 110 M 40 70 L 40 110 M 60 70 L 60 110 M 80 70 L 80 110 M 100 70 L 100 110 M 120 70 L 120 110 M 140 70 L 140 110 M 160 70 L 160 110 M 180 70 L 180 110', label: 'COMB'},
    {d: 'M 10 60 L 150 60 L 150 76 L 10 76 Z M 150 50 L 190 50 L 190 86 L 150 86 Z', label: 'TOOTHBRUSH'},
    {d: 'M 20 50 L 160 40 L 180 60 L 160 80 L 20 70 Z', label: 'TOOTHPASTE'},
  ];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={700} r={800} />
      {/* empty spot where the luggage should be */}
      <Center top={260} style={{opacity: 1 - p(frame, items, 10) * 0.7}}>
        <div style={{width: 520, height: 360, border: `8px dashed ${RED}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 90, color: RED}}>NO LUGGAGE</div>
      </Center>
      {icons.map((ic, k) => {
        const s = p(frame, items + k * 10, 12);
        return (
          <div key={k} style={{position: 'absolute', left: 120 + k * 290, top: 760, opacity: s, transform: `translateY(${lerp(80, 0, s)}px)`, textAlign: 'center'}}>
            <svg width={220} height={140} viewBox="0 0 200 120">
              <path d={ic.d} fill={CREAM} stroke={CREAM} strokeWidth={6} />
            </svg>
            <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 30, color: AMBER}}>{ic.label}</div>
          </div>
        );
      })}
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The maid, the shades, the friend ─────────────────────────
export const Maid: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [lamp, nervous, unlocked] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Room shade={p(frame, 0, 24)} lamp={frame >= lamp ? 1 : 0.2} dark={0.35} />
      <div style={{position: 'absolute', left: 300, top: 700, opacity: p(frame, nervous - 10, 12)}}>
        <Person h={460} pose="sit" color="#050403" rim={AMBER} />
      </div>
      <div style={{position: 'absolute', left: 640, top: 640}}>
        <Person h={580} color="#050403" rim="#9a8a7a" flip />
      </div>
      {frame >= unlocked ? (
        <Center top={200} style={{transform: `scale(${slam(frame, unlocked, 1.5).scale})`}}>
          <svg width={200} height={240} viewBox="0 0 180 220" style={{filter: `drop-shadow(0 0 20px ${AMBER})`}}>
            <path d="M 40 100 L 40 60 Q 40 10 90 10 Q 140 10 140 60 L 140 70" stroke={AMBER} strokeWidth={18} fill="none" transform="translate(30 -20)" />
            <rect x={20} y={100} width={140} height={110} rx={16} fill={AMBER} />
          </svg>
        </Center>
      ) : null}
      <Tag at={6} until={nervous} top={180}>
        JAN 3 · MORNING
      </Tag>
      <LightSweep at={lamp} color={AMBER} strength={0.25} />
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The note ─────────────────────────
export const TheNote: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const note = cue.s(1);
  if (frame >= note) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Lamp x={540} y={760} r={900} />
        <Center top={lerp(560, 420, p(frame, note, 18))} style={{transform: `scale(${lerp(0.8, 1.05, p(frame, note, cue.dur - note, (n) => n))})`}}>
          <Note width={820} hand>
            Don:
            <br />
            I will be back in
            <br />
            fifteen minutes.
            <br />
            Wait.
          </Note>
        </Center>
        <LightSweep at={note + 4} color={AMBER} />
        <Vig />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Room shade={1} lamp={0.15} dark={0.6} />
      <div style={{position: 'absolute', left: 150, top: 830, transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}}>
        <Person h={300} color="#050403" rim={AMBER} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Who was Don? ─────────────────────────
export const WhoDon: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const nobody = cue.s(1);
  return (
    <AbsoluteFill style={{background: BG}}>
      <Fog amount={0.9} color="#a89878" />
      <Center top={360} style={{transform: `scale(${lerp(1.15, 1, p(frame, 0, 20))})`}}>
        <div style={{position: 'relative'}}>
          <Person h={760} color="#000" rim={RED} />
          <div style={{position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 200, color: RED, opacity: 0.85}}>?</div>
        </div>
      </Center>
      <Big at={2} top={170} size={130} color={CREAM}>
        WHO WAS DON?
      </Big>
      <Tag at={nobody} top={1230} color={RED}>
        NEVER IDENTIFIED
      </Tag>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · The phone call ─────────────────────────
export const PhoneCall: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const say = cue.s(1);
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={760} r={800} />
      <Center top={lerp(560, 480, p(frame, 0, cue.dur, (n) => n))}>
        <Phone size={420} />
      </Center>
      {frame >= say
        ? ['"NO, DON."', '"I DON\'T WANT TO EAT."', '"I\'M NOT HUNGRY."'].map((t, k) => {
            const at = k === 0 ? say : k === 1 ? cue.s(2) : cue.s(3);
            return frame >= at ? (
              <div key={t} style={{position: 'absolute', left: 60 + (k % 2) * 140, top: 180 + k * 110, opacity: p(frame, at, 8), fontFamily: '"Courier New"', fontWeight: 700, fontSize: 54, color: k === 0 ? RED : CREAM, background: '#000000b0', padding: '6px 18px'}}>
                {t}
              </div>
            ) : null;
          })
        : null}
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Voices through the wall ─────────────────────────
export const Arguing: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      {/* corridor: doors in perspective */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M 0 0 L 420 640 L 660 640 L 1080 0 Z" fill="#1a130c" />
        <path d="M 0 1300 L 420 900 L 660 900 L 1080 1300 Z" fill="#2a0a0c" />
        <path d="M 0 0 L 420 640 L 420 900 L 0 1300 Z" fill="#241a10" />
        <path d="M 1080 0 L 660 640 L 660 900 L 1080 1300 Z" fill="#241a10" />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={60 + k * 110} y={420 + k * 60} width={70 - k * 15} height={520 - k * 120} fill={WOOD} stroke="#0a0604" strokeWidth={4} transform={`skewY(${30 - k * 4})`} />
            <rect x={950 - k * 110} y={420 + k * 60} width={70 - k * 15} height={520 - k * 120} fill={WOOD} stroke="#0a0604" strokeWidth={4} transform={`skewY(${-30 + k * 4})`} />
          </g>
        ))}
      </svg>
      {/* shouting waveforms from one door */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {[0, 1].map((v) =>
          Array.from({length: 30}, (_, i) => {
            const h = Math.abs(Math.sin(frame / (3 + v) + i * 0.7)) * (60 + rnd(i + v * 50 + Math.floor(frame / 4)) * 90);
            return <rect key={`${v}${i}`} x={240 + i * 20} y={(v ? 1080 : 300) - h / 2} width={10} height={h} fill={v ? RED : AMBER} opacity={0.85} />;
          }),
        )}
      </svg>
      <Tag at={4} top={180}>
        A MAN
      </Tag>
      <Tag at={20} top={1220} color={RED}>
        A WOMAN
      </Tag>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Off the hook, the locked door ─────────────────────────
export const OffHook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [hook, knock, voice, locked] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  if (frame < knock) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Lamp x={540} y={760} r={800} />
        <Center top={520}>
          <Phone size={420} off={p(frame, hook, 14)} />
        </Center>
        <Big at={0} until={hook} top={200} size={120} color={AMBER}>
          JAN 4
        </Big>
        <Tag at={hook + 6} top={200} color={RED}>
          LINE OPEN · OFF THE HOOK
        </Tag>
        <Vig />
      </AbsoluteFill>
    );
  }
  const k = frame - knock;
  const knocking = k < 40 ? Math.max(0, 1 - (k % 13) / 6) : 0;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #1a130c, ${BG})`}}>
      <Center top={260} style={{transform: `scale(${lerp(1, 1.08, p(frame, knock, cue.dur - knock, (n) => n))})`}}>
        <Door height={900} knock={knocking} />
      </Center>
      <div style={{position: 'absolute', left: 60, top: 520}}>
        <Person h={600} hat="cap" color="#000" rim={AMBER} />
      </div>
      {frame >= voice ? (
        <Center top={180} style={{opacity: p(frame, voice, 8)}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 52, color: CREAM, background: '#000000c0', padding: '8px 22px', fontStyle: 'italic'}}>"Come in… turn on the lights."</div>
        </Center>
      ) : null}
      {frame >= locked ? (
        <Big at={locked} top={1180} size={100} color={RED}>
          LOCKED
        </Big>
      ) : null}
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The door opens ─────────────────────────
export const Nightmare: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const open = p(frame, 10, 40);
  return (
    <AbsoluteFill style={{background: BG}}>
      <Center top={200} style={{transform: `scale(${lerp(1, 1.5, p(frame, 30, cue.dur - 30, (n) => n))})`}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle, ${RED}, #2a0008 70%)`, opacity: open}} />
          <Door height={1000} open={open} light={open} />
        </div>
      </Center>
      <Flash at={cue.w('nightmare')} />
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · What they found (described, not shown) ─────────────────────────
export const Injuries: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [tied, stab, skull] = [cue.s(1), cue.s(2), cue.s(3)];
  const items = [
    {at: tied, t: 'TIED WITH CORD'},
    {at: stab, t: 'STABBED IN THE CHEST'},
    {at: skull, t: 'SKULL FRACTURED'},
  ];
  return (
    <AbsoluteFill style={{background: '#0a0204'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${RED}55, transparent 60%)`}} />
      {frame >= tied ? <Cord show={p(frame, tied, 30)} /> : null}
      <Center top={480} style={{opacity: 0.95}}>
        <Person h={560} pose="crouch" color="#000" rim={RED} />
      </Center>
      {items.map((it, k) =>
        frame >= it.at ? (
          <div key={k} style={{position: 'absolute', left: 0, right: 0, top: 170 + k * 120, display: 'flex', justifyContent: 'center', opacity: p(frame, it.at, 8), transform: `translateX(${lerp(k % 2 ? 300 : -300, 0, p(frame, it.at, 10))}px)`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: CREAM, background: RED, padding: '2px 26px'}}>{it.t}</div>
          </div>
        ) : null,
      )}
      <Flash at={stab} />
      <Flash at={skull} />
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · "I fell against the bathtub" ─────────────────────────
export const Interview: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nobody, tub, dead] = [cue.s(1), cue.s(2), cue.s(3)];
  if (frame >= dead) {
    const t = p(frame, dead, 30);
    return (
      <AbsoluteFill style={{background: BG}}>
        <svg width={W} height={600} style={{position: 'absolute', top: 520}}>
          <path d={`M 0 300 L 300 300 L 340 ${300 - 160 * (1 - t)} L 380 ${300 + 120 * (1 - t)} L 420 300 L 1080 300`} stroke={t < 1 ? '#4dff8a' : RED} strokeWidth={8} fill="none" style={{filter: 'drop-shadow(0 0 12px #4dff8a)'}} />
        </svg>
        <Big at={dead + 12} top={260} size={110} color={RED}>
          DEAD.
        </Big>
        <Vig />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #14100c, ${BG})`}}>
      <Lamp x={300} y={500} r={700} />
      <div style={{position: 'absolute', left: 80, top: 500}}>
        <Person h={680} hat="cap" color="#000" rim={AMBER} />
      </div>
      <div style={{position: 'absolute', left: 560, top: 820}}>
        <Person h={420} pose="crouch" color="#000" rim={RED} flip />
      </div>
      <Tag at={6} until={nobody} top={180}>
        "WHO DID THIS?"
      </Tag>
      <Big at={nobody} until={tub} top={200} size={130} color={CREAM}>
        "NOBODY."
      </Big>
      <Big at={tub} top={200} size={90} color={CREAM}>
        "I FELL AGAINST
        <br />
        THE BATHTUB."
      </Big>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The room is wrong ─────────────────────────
export const Wrong: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [clothes, prints] = [cue.s(1), cue.s(3)];
  if (frame >= prints) {
    return (
      <AbsoluteFill style={{background: BG}}>
        <Lamp x={540} y={700} r={800} />
        <Center top={420} style={{transform: `scale(${lerp(0.9, 1.05, p(frame, prints, cue.dur - prints, (n) => n))})`}}>
          <div style={{display: 'flex', gap: 30}}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{opacity: p(frame, prints + k * 6, 8), transform: `rotate(${(k - 1.5) * 8}deg)`}}>
                <Print size={180} />
              </div>
            ))}
          </div>
        </Center>
        <Tag at={prints + 20} top={1160} color={RED}>
          BELIEVED TO BE A WOMAN'S
        </Tag>
        <LightSweep at={prints} color={AMBER} strength={0.3} />
        <Vig />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={600} r={800} />
      {/* empty wardrobe: hangers swinging */}
      <Center top={280}>
        <div style={{width: 640, height: 820, background: WOOD, border: '14px solid #1a0f08', position: 'relative'}}>
          <div style={{position: 'absolute', top: 60, left: 20, right: 20, height: 10, background: '#8a7a5a'}} />
          {[0, 1, 2, 3].map((k) => (
            <svg key={k} width={120} height={100} style={{position: 'absolute', top: 60, left: 50 + k * 140, transform: `rotate(${Math.sin(frame / 10 + k) * 8}deg)`, transformOrigin: '60px 0'}}>
              <path d="M 60 0 L 60 20 L 10 60 L 110 60 Z" stroke={CREAM} strokeWidth={5} fill="none" />
            </svg>
          ))}
        </div>
      </Center>
      <Big at={clothes} top={160} size={100} color={RED}>
        NO CLOTHES
      </Big>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The name was fake ─────────────────────────
export const FakeName: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nosuch, fake] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={760} r={800} />
      <Center top={460} style={{transform: `rotate(-3deg)`}}>
        <div style={{width: 820, height: 480, background: CREAM, boxShadow: '0 30px 60px #000', padding: 40, boxSizing: 'border-box', position: 'relative'}}>
          <div style={{fontFamily: '"Courier New"', fontWeight: 700, fontSize: 36, color: '#5a3a1a'}}>LOS ANGELES · CITY DIRECTORY</div>
          <div style={{fontFamily: DISPLAY, fontSize: 90, color: '#1a1208', marginTop: 50}}>OWEN, ROLAND T.</div>
          {frame >= nosuch ? (
            <div style={{position: 'absolute', top: 250, left: 120, border: `10px solid ${RED}`, color: RED, fontFamily: DISPLAY, fontSize: 90, padding: '0 24px', transform: `rotate(-10deg) scale(${slam(frame, nosuch + 6, 2).scale})`, opacity: slam(frame, nosuch + 6).opacity}}>NO RECORD</div>
          ) : null}
        </div>
      </Center>
      <Big at={fake} top={200} size={130} color={RED}>
        FAKE NAME
      </Big>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The funeral, Louise ─────────────────────────
export const Louise: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [stranger, flowers, love] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0a0a0e, ${BG})`}}>
      <Fog amount={0.8} color="#b8b0a0" />
      {/* casket */}
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M 160 1060 L 920 1060 L 880 1180 L 200 1180 Z" fill="#2a1a10" stroke="#5a3a1a" strokeWidth={6} />
        <rect x={150} y={1030} width={780} height={40} fill="#3a2414" />
      </svg>
      {frame >= stranger && frame < flowers ? (
        <Center top={300} style={{opacity: p(frame, stranger, 10)}}>
          <Person h={620} color="#000" rim="#9a9288" />
        </Center>
      ) : null}
      {frame >= flowers ? (
        <Center top={lerp(700, 520, p(frame, flowers, 16))} style={{opacity: p(frame, flowers, 10)}}>
          <Flowers size={560} />
        </Center>
      ) : null}
      {frame >= love ? (
        <Center top={200} style={{opacity: p(frame, love, 12), transform: `rotate(-4deg) scale(${lerp(0.8, 1, p(frame, love, 14))})`}}>
          <Note width={640} hand rotate={-4}>
            Love forever,
            <br />
            Louise
          </Note>
        </Center>
      ) : null}
      <Tag at={6} until={stranger} top={180}>
        PAID BY AN UNKNOWN PERSON
      </Tag>
      <LightSweep at={love} color={AMBER} strength={0.3} />
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · Artemus Ogletree, 17 ─────────────────────────
export const RealName: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [name, age] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={700} r={900} />
      {/* magazine page with a portrait silhouette */}
      <Center top={lerp(400, 330, p(frame, 0, cue.dur, (n) => n))} style={{transform: `perspective(1500px) rotateY(${lerp(-30, -8, p(frame, 0, 30))}deg)`}}>
        <div style={{width: 720, height: 900, background: '#e8ddc4', boxShadow: '0 40px 80px #000', padding: 36, boxSizing: 'border-box'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 64, color: '#1a1208', borderBottom: '6px solid #1a1208'}}>MAGAZINE · 1936</div>
          <div style={{marginTop: 30, height: 460, background: '#3a3028', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
            <Person h={430} color="#0a0806" />
          </div>
          {Array.from({length: 5}, (_, i) => <div key={i} style={{height: 10, background: '#8a7a5a', margin: '22px 0', width: `${70 + rnd(i) * 30}%`}} />)}
        </div>
      </Center>
      {frame >= name ? (
        <Center top={1000} style={{transform: `scale(${slam(frame, name, 1.6).scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 104, color: CREAM, background: RED, padding: '4px 30px', boxShadow: '0 20px 40px #000'}}>ARTEMUS OGLETREE</div>
        </Center>
      ) : null}
      <Big at={age} top={160} size={150} color={AMBER}>
        AGE 17
      </Big>
      <Tag at={6} until={name} top={180}>
        BIRMINGHAM, ALABAMA · 1936
      </Tag>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 16 · Letters and Cairo ─────────────────────────
export const Letters: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [letters, cairo] = [cue.s(1), cue.s(2)];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Lamp x={540} y={700} r={900} />
      {[0, 1, 2].map((k) => (
        <Letter key={k} show={p(frame, k === 0 ? 4 : letters + k * 10, 14)} x={140 + k * 160} y={360 + k * 130} r={-8 + k * 7} />
      ))}
      {frame >= cairo ? (
        <>
          <div style={{position: 'absolute', left: 560, top: 860, opacity: p(frame, cairo, 8)}}>
            <Phone size={300} ring />
          </div>
          <div style={{position: 'absolute', left: 120, top: 980, width: 380, height: 380, borderRadius: '50%', border: `10px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(-12deg) scale(${slam(frame, cue.w('Cairo'), 2).scale})`, opacity: slam(frame, cue.w('Cairo')).opacity}}>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: RED, textAlign: 'center', lineHeight: 1}}>
              CAIRO
              <div style={{fontSize: 44}}>ALIVE?</div>
            </div>
          </div>
        </>
      ) : null}
      <Tag at={4} until={letters} top={180}>
        AFTER HIS DEATH…
      </Tag>
      <Vig />
    </AbsoluteFill>
  );
};

// ───────────────────────── 17 · Questions + CTA ─────────────────────────
export const Ending: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [louise, years, what, comment, cta] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  if (frame < cta) {
    const [photo, credit] = pick('sign.jpg', 'hotel.jpg');
    return (
      <AbsoluteFill>
        <Parallax src={photo} t={p(frame, 0, cta, (n) => n)} from={{s: 1.2}} to={{s: 1.4, y: 40}} gray={0.7} dark={0.6} tint="#120c06" fog={0.6} credit={credit} fallback={<Center top={200}><Hotel width={560} lit={57} /></Center>} />
        <Big at={0} until={years} top={240} size={130} color={CREAM}>
          {frame >= louise ? 'WHO WAS LOUISE?' : 'WHO WAS DON?'}
        </Big>
        <Big at={years} until={what} top={240} size={110} color={AMBER}>
          90 YEARS.
          <br />
          NO ANSWERS.
        </Big>
        <Big at={what} top={240} size={110} color={RED}>
          WHAT HAPPENED
          <br />
          IN ROOM 1046?
        </Big>
        {frame >= comment ? (
          <Center top={1000} style={{opacity: p(frame, comment, 8), transform: `scale(${pulse})`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 80, color: BG, background: CREAM, padding: '8px 40px', borderRadius: 40}}>👇 COMMENT</div>
          </Center>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #2a1a10, ${BG} 75%)`}}>
      <Fog amount={0.7} color="#a89878" />
      <Center top={130} style={{opacity: p(frame, cta, 8)}}>
        <div style={{fontFamily: DISPLAY, fontSize: 110, color: RED, letterSpacing: 3}}>WATCH NEXT</div>
      </Center>
      <Center top={300} style={{opacity: p(frame, cta + 4, 10), transform: `scale(${slam(frame, cta + 4, 1.3).scale * pulse})`}}>
        <div style={{width: 600}}>
          <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}88`, height: 700}}>
            <Img src={staticFile('room1046/cta/hoffa.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: '#000000aa', border: `5px solid ${CREAM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: CREAM, paddingLeft: 10}}>▶</div>
            </div>
          </div>
          <div style={{fontFamily: DISPLAY, fontSize: 56, color: CREAM, textAlign: 'center', marginTop: 16, lineHeight: 1.05}}>JIMMY HOFFA: HE WALKED IN AND NEVER CAME OUT</div>
        </div>
      </Center>
      <LightSweep at={cta + 6} color={AMBER} />
    </AbsoluteFill>
  );
};

export const _unused = DIM;
