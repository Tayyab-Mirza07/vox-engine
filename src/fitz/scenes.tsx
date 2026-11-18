import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LonLat, USMap} from '../geo';
import {BODY, C, Cues, DISPLAY, W, inOut, lerp, p, rnd, slam} from '../lib';
import {Background, Headline, Photo, Stamp, Tag} from '../ui';
import {Paper, Typed} from '../dbcooper/parts';
import {Sea} from '../celeste/parts';
import {Bell, Freighter, ICE, Radar} from './parts';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PLACE = {
  superior: [-92.1, 46.72] as LonLat,
  detroit: [-83.05, 42.33] as LonLat,
  wreck: [-85.11, 46.99] as LonLat,
  whitefish: [-84.95, 46.77] as LonLat,
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const I: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: ICE}}>{children}</span>;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red}}>{children}</span>;
const MapBox: React.FC<{top?: number; children: React.ReactNode}> = ({top = 300, children}) => (
  <div style={{position: 'absolute', top, left: 40, width: 1000, height: 640, overflow: 'hidden', borderRadius: 24, border: `3px solid ${C.line}`, background: '#0e2233'}}>{children}</div>
);
const Row: React.FC<{label: string; show: number; bad?: boolean}> = ({label, show, bad = true}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: show, transform: `translateX(${(1 - show) * 60}px)`}}>
    <div style={{fontFamily: DISPLAY, fontSize: 84, color: bad ? C.red : ICE, width: 80, textAlign: 'center'}}>{bad ? '✕' : '✓'}</div>
    <Big size={84} style={{textAlign: 'left'}}>
      {label}
    </Big>
  </div>
);
const Clock: React.FC<{text: string; color?: string}> = ({text, color = ICE}) => (
  <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 120, color, letterSpacing: 6, textShadow: `0 0 40px ${color}`}}>{text}</div>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [captain, gone, crew] = [cue.s(2), cue.s(3), cue.s(4)];
  const fade = p(frame, gone + 4, 30);
  const bob = Math.sin(frame / 12) * 14;
  const tilt = Math.sin(frame / 18) * 3;
  return (
    <AbsoluteFill>
      <Sea fog={0.6} storm={1} dark={0.4} />
      <Center top={700} style={{transform: `translateY(${bob}px)`, opacity: 1 - fade}}>
        <Freighter width={940} list={tilt} color="#2c3e59" />
      </Center>
      <Headline at={0} until={captain - 1} size={130} y={180} color={ICE}>
        November 10, 1975
      </Headline>
      {frame >= captain && frame < gone ? (
        <>
          <Center top={170}>
            <Clock text="7:10 PM" />
          </Center>
          <Center top={360}>
            <Paper width={900} rotate={-1.5} style={{padding: '22px 30px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>RADIO · EDMUND FITZGERALD</div>
              <Typed text="“We are holding our own.”" at={cue.w('holding') - 6} cps={22} style={{fontSize: 64, lineHeight: 1.25}} />
            </Paper>
          </Center>
        </>
      ) : null}
      {frame >= gone ? (
        <>
          <Stamp at={gone + 2} y={420} size={170}>
            Gone
          </Stamp>
          {frame >= crew ? (
            <Center top={1020} style={{opacity: p(frame, crew, 8)}}>
              <div style={{textAlign: 'center'}}>
                <Big size={250} color={C.red}>
                  29
                </Big>
                <Big size={70}>men on board</Big>
              </div>
            </Center>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · No mayday ─────────────────────────
export const NoMayday: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [n2, silence] = [cue.s(1), cue.s(2)];
  const blip = 1 - p(frame, cue.w('empty') - 4, 10);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <div style={{position: 'absolute', top: 200, left: 110, display: 'flex', flexDirection: 'column', gap: 10}}>
        <Row label="NO MAYDAY" show={p(frame, 2, 6)} />
        <Row label="NO DISTRESS CALL" show={p(frame, n2, 6)} />
      </div>
      <Center top={560} style={{opacity: p(frame, silence - 6, 8)}}>
        <Radar size={620} blips={[[300, 0.55, blip]]} label="THE RADAR BEHIND HER" />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Re-hook: how? ─────────────────────────
export const RehookHow: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const back = cue.s(1);
  const q = slam(frame, 2, 2.4);
  const ruler = p(frame, cue.w('big') - 4, 20, inOut);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < back ? (
        <>
          <Center top={180} style={{opacity: q.opacity, transform: `scale(${q.scale})`}}>
            <Big size={300} color={C.red}>
              ?
            </Big>
          </Center>
          <Center top={470} style={{opacity: ruler}}>
            <Photo src="fitz/photos/ship.jpg" width={980} height={340} zoom={lerp(1.08, 1, ruler)} focus="50% 55%" credit="U.S. Army Corps of Engineers · public domain" accent={ICE} />
          </Center>
          <div style={{position: 'absolute', top: 820, left: 50, right: 50, height: 8, background: ICE, transform: `scaleX(${ruler})`, transformOrigin: 'left'}} />
          <Center top={860} style={{opacity: ruler}}>
            <Big size={90} color={ICE}>
              729 FEET LONG
            </Big>
          </Center>
          <Center top={980} style={{opacity: p(frame, cue.w('minutes') - 4, 8)}}>
            <Big size={84}>
              Gone in <R>minutes</R>
            </Big>
          </Center>
        </>
      ) : (
        <>
          <Headline at={back} size={110} y={200}>
            One day <I>earlier</I>
          </Headline>
          <Center top={560}>
            <Paper width={720} rotate={-2} style={{textAlign: 'center', padding: '30px 30px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: '#a3271c'}}>NOVEMBER 1975</div>
              <div style={{fontFamily: DISPLAY, fontSize: 230, lineHeight: 1}}>{p(frame, back, 20) < 0.5 ? '10' : '9'}</div>
            </Paper>
          </Center>
          <Center top={1080} style={{opacity: 0.5 + 0.5 * Math.sin(frame / 2)}}>
            <Tag color={ICE}>◀◀ Rewind</Tag>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Departure ─────────────────────────
export const Departure: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [leaves, captain] = [cue.s(2), cue.s(3)];
  const route = p(frame, cue.w('Detroit') - 10, 40, inOut);
  const tons = Math.round(interpolate(frame, [cue.w('26,000') - 4, cue.w('26,000') + 30], [0, 26000], clamp));
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Headline at={2} size={96} y={120}>
        <I>Nov 9, 1975</I> · Superior, Wisconsin
      </Headline>
      <MapBox top={330}>
        <USMap
          width={1000}
          height={640}
          frame={frame}
          highlight="Michigan"
          highlightAmount={0.1}
          zoom={2.6}
          focus={[-87.6, 45.0]}
          routes={[{from: PLACE.superior, to: PLACE.detroit, progress: route}]}
          pins={[
            {at: PLACE.superior, label: 'SUPERIOR, WI', show: p(frame, 6, 8), align: 'right'},
            {at: PLACE.detroit, label: 'DETROIT', show: p(frame, cue.w('Detroit') + 26, 8), align: 'left'},
          ]}
        />
      </MapBox>
      {frame >= leaves && frame < captain ? (
        <Center top={980} style={{opacity: p(frame, leaves, 8)}}>
          <div style={{textAlign: 'center'}}>
            <Photo src="fitz/photos/ship2.jpg" width={900} height={200} zoom={1.05} focus="50% 50%" credit="U.S. Coast Guard · public domain" accent={ICE} />
            <Big size={120} color={ICE} style={{marginTop: 14}}>
              {tons.toLocaleString('en-US')}
            </Big>
            <Big size={52}>tons of iron ore</Big>
          </div>
        </Center>
      ) : null}
      {frame >= captain ? (
        <Center top={1010} style={{opacity: p(frame, captain, 8)}}>
          <Paper width={820} rotate={-1.5} style={{padding: '22px 30px', textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, opacity: 0.6}}>CAPTAIN</div>
            <div style={{fontFamily: DISPLAY, fontSize: 90, lineHeight: 1.1}}>ERNEST McSORLEY</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 3, opacity: 0.7}}>DECADES ON THE GREAT LAKES</div>
          </Paper>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The gale ─────────────────────────
export const Gale: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const anderson = cue.s(1);
  const storm = p(frame, 4, 70, inOut);
  const ships = p(frame, anderson, 60, inOut);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} until={anderson - 1} size={96} y={120}>
        A <R>November gale</R> is coming
      </Headline>
      <Headline at={anderson} size={96} y={120}>
        The <I>Arthur M. Anderson</I> follows
      </Headline>
      <MapBox top={330}>
        <USMap width={1000} height={640} frame={frame} zoom={4.2} focus={[-87.3, 47.2]} pins={[{at: PLACE.superior, label: 'SUPERIOR', show: 1, align: 'right'}]} />
        <svg width={1000} height={640} style={{position: 'absolute', left: 0, top: 0}}>
          <g transform={`translate(${lerp(-160, 420, storm)}, ${lerp(560, 260, storm)}) rotate(${-frame * 3})`} opacity={0.75}>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M 0 0 Q ${60 + i * 30} ${-40 - i * 20} ${120 + i * 40} ${20 + i * 10}`} fill="none" stroke={C.red} strokeWidth={10 - i * 2} strokeLinecap="round" transform={`rotate(${i * 90})`} />
            ))}
            <circle r={18} fill={C.red} />
          </g>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${lerp(120, 560, ships) - i * 70}, ${lerp(300, 250, ships) + i * 20})`} opacity={p(frame, i ? anderson : 2, 8)}>
              <rect x={-26} y={-6} width={52} height={12} rx={4} fill={i ? ICE : C.white} />
              <text y={-14} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={18} fill={i ? ICE : C.white}>
                {i ? 'ANDERSON' : 'FITZGERALD'}
              </text>
            </g>
          ))}
        </svg>
      </MapBox>
      {frame >= anderson ? (
        <Center top={1000} style={{opacity: p(frame, anderson, 8)}}>
          <Photo src="fitz/photos/anderson.jpg" width={760} height={300} zoom={lerp(1.1, 1, p(frame, anderson, 50))} focus="50% 50%" credit="The Arthur M. Anderson, 1988 · Steve Moses, CC BY 2.0" accent={ICE} />
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The storm hits ─────────────────────────
export const Storm: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [wind, waves] = [cue.s(1), cue.s(2)];
  const bob = Math.sin(frame / 8) * 24;
  const tilt = Math.sin(frame / 11) * 6;
  const gust = interpolate(frame, [wind, wind + 30], [20, 72], clamp) + Math.sin(frame / 3) * 4;
  return (
    <AbsoluteFill>
      <Sea fog={0.5} storm={2.5} dark={0.5} y={1000} />
      <Headline at={2} until={wind - 1} size={120} y={170} color={C.red}>
        The storm hits
      </Headline>
      {frame >= wind && frame < waves ? (
        <Center top={170} style={{opacity: p(frame, wind, 6)}}>
          <div style={{textAlign: 'center'}}>
            <Big size={180} color={C.red}>
              {Math.round(gust)} MPH
            </Big>
            <Big size={60}>winds near hurricane force</Big>
          </div>
        </Center>
      ) : null}
      {frame >= waves ? (
        <Center top={170} style={{opacity: p(frame, waves, 6)}}>
          <div style={{textAlign: 'center'}}>
            <Big size={180} color={ICE}>
              20+ FEET
            </Big>
            <Big size={60}>waves crash over the deck</Big>
          </div>
        </Center>
      ) : null}
      <Center top={700} style={{transform: `translateY(${bob}px)`}}>
        <Freighter width={900} list={tilt} color="#2c3e59" />
      </Center>
      {frame >= waves ? (
        <svg width={W} height={500} style={{position: 'absolute', top: 640}}>
          {Array.from({length: 6}, (_, i) => {
            const t = ((frame - waves) * 3 + i * 40) % 240;
            return <path key={i} d={`M ${120 + i * 150} ${300 - t} q 40 -60 90 0`} fill="none" stroke="#dff3ff" strokeWidth={6} opacity={Math.max(0, 0.7 - t / 240)} />;
          })}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Damage ─────────────────────────
export const Damage: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [rail, vents, lean, radars] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const list = interpolate(frame, [lean, lean + 30], [0, 6], {...clamp, easing: inOut});
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Headline at={2} size={96} y={140}>
        The Fitzgerald reports <R>trouble</R>
      </Headline>
      <div style={{position: 'absolute', top: 400, left: 100, display: 'flex', flexDirection: 'column', gap: 10}}>
        <Row label="RAILING DOWN" show={p(frame, rail, 6)} />
        <Row label="2 VENTS TORN AWAY" show={p(frame, vents, 6)} />
        <Row label="STARTING TO LIST" show={p(frame, lean, 6)} />
        <Row label="BOTH RADARS DEAD" show={p(frame, radars, 6)} />
      </div>
      <Center top={1020} style={{opacity: p(frame, lean, 8)}}>
        <Freighter width={760} list={list} color="#2c3e59" />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Sailing blind ─────────────────────────
export const Blind: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const eyes = cue.s(1);
  return (
    <AbsoluteFill>
      <Background tint={frame >= eyes ? ICE : C.red} />
      <Headline at={2} until={eyes - 1} size={130} y={170}>
        Sailing <R>blind</R>
      </Headline>
      <Headline at={eyes} size={96} y={170}>
        Her only eyes: <I>the ship behind</I>
      </Headline>
      <Center top={460}>
        {frame < eyes ? (
          <Radar size={680} dead={p(frame, 4, 12)} label="FITZGERALD RADAR" />
        ) : (
          <Radar size={680} blips={[[270, 0.15, 1], [270, 0.55, 1]]} label="ANDERSON RADAR" />
        )}
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The last words ─────────────────────────
export const LastWords: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [ask, answer] = [cue.s(1), cue.s(2)];
  const bubble = (from: string, text: string, at: number, right: boolean) => {
    const s = p(frame, at, 8);
    return (
      <div style={{alignSelf: right ? 'flex-end' : 'flex-start', maxWidth: 820, opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: right ? ICE : C.dim, marginBottom: 8, textAlign: right ? 'right' : 'left'}}>{from}</div>
        <div style={{background: right ? '#11324a' : '#1c2633', border: `3px solid ${right ? ICE : '#3a4a5c'}`, borderRadius: 28, padding: '22px 30px', fontFamily: DISPLAY, fontSize: 64, color: C.white, lineHeight: 1.1}}>{text}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Center top={140}>
        <Clock text="7:10 PM" />
      </Center>
      <div style={{position: 'absolute', top: 400, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 40}}>
        {bubble('ARTHUR M. ANDERSON', 'How are you doing?', ask, false)}
        {frame >= cue.w('holding') - 8 ? bubble('EDMUND FITZGERALD', '“We are holding our own.”', cue.w('holding') - 8, true) : null}
      </div>
      <Center top={1100} style={{opacity: p(frame, answer + 30, 10)}}>
        <Tag color={C.red}>Her last known words</Tag>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Gone from the radar ─────────────────────────
export const Vanished: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [looks, lights, blip] = [cue.s(1), cue.s(2), cue.s(3)];
  const snow = 1 - p(frame, 4, 40);
  return (
    <AbsoluteFill>
      <Sea fog={0.3} storm={1.5} dark={0.6} />
      <svg width={W} height={1920} style={{position: 'absolute', opacity: snow}}>
        {Array.from({length: 160}, (_, i) => {
          const y = (rnd(i) * 1920 + frame * (6 + rnd(i + 3) * 6)) % 1920;
          const x = (rnd(i + 40) * W + frame * 4) % W;
          return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 9) * 3} fill="#fff" opacity={0.6} />;
        })}
      </svg>
      <Headline at={2} until={lights - 1} size={110} y={170}>
        The snow <I>clears</I>
      </Headline>
      {frame >= looks && frame < lights ? (
        <Center top={760} style={{opacity: p(frame, looks, 10) * (1 - p(frame, lights - 10, 10))}}>
          <Freighter width={500} color="#2c3e59" />
        </Center>
      ) : null}
      {frame >= lights ? (
        <>
          <Headline at={lights} size={110} y={170}>
            Her lights: <R>gone</R>
          </Headline>
          <Center top={500}>
            <Radar size={620} blips={[[270, 0.15, 1], [270, 0.55, 1 - p(frame, blip, 12)]]} label="ANDERSON RADAR" />
          </Center>
          <Stamp at={cue.w('radar') - 2} y={1200} size={110}>
            Off the radar
          </Stamp>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The wreck ─────────────────────────
export const Wreck: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const none = cue.s(1);
  const depth = Math.round(interpolate(frame, [4, cue.w('530') + 10], [0, 530], {...clamp, easing: inOut}));
  const broken = p(frame, cue.w('broken') - 4, 20, inOut);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b2233 0%, #04101a 60%, #010407 100%)'}}>
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: 30}, (_, i) => (
          <circle key={i} cx={rnd(i) * W} cy={(1920 - ((frame * (1 + rnd(i) * 2) + rnd(i + 5) * 1920) % 1920))} r={3 + rnd(i + 2) * 5} fill="none" stroke="#7ec8ff" strokeOpacity={0.3} />
        ))}
      </svg>
      <Headline at={2} until={none - 1} size={110} y={170}>
        The wreck: <I>{depth} ft</I> down
      </Headline>
      <Center top={820} style={{opacity: p(frame, 6, 12)}}>
        <Freighter width={900} lights={false} color="#1c2a38" broken={broken} />
      </Center>
      <Center top={1200} style={{opacity: broken}}>
        <Tag color={ICE}>Broken in two</Tag>
      </Center>
      {frame >= none ? (
        <>
          <Headline at={none} size={100} y={170}>
            <R>29 men.</R> Never recovered.
          </Headline>
          <svg width={W} height={240} style={{position: 'absolute', top: 360}}>
            {Array.from({length: 29}, (_, i) => (
              <circle key={i} cx={110 + (i % 15) * 61} cy={60 + Math.floor(i / 15) * 90} r={18} fill={C.white} opacity={p(frame, none + i, 4) * 0.8} />
            ))}
          </svg>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · Re-hook: what sank her? ─────────────────────────
export const RehookWhat: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const q = slam(frame, 2, 2.4);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      <Center top={300} style={{opacity: q.opacity, transform: `scale(${q.scale})`}}>
        <Big size={380} color={C.red}>
          ?
        </Big>
      </Center>
      <Center top={820}>
        <Big size={120}>
          What sank her
          <br />
          <R>so fast?</R>
        </Big>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · Three theories ─────────────────────────
export const Theories: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [shoal, waves] = [cue.s(1), cue.s(2)];
  const card = (n: number, title: string, at: number, icon: React.ReactNode) => {
    const s = slam(frame, at, 1.5);
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 30, background: '#11161c', border: `4px solid ${frame >= at ? ICE : C.line}`, borderRadius: 22, padding: '22px 30px', opacity: frame >= at ? s.opacity : 0.15, transform: `scale(${frame >= at ? s.scale : 1})`}}>
        <div style={{fontFamily: DISPLAY, fontSize: 100, color: '#07090c', background: ICE, width: 120, height: 140, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
        <div style={{flex: 1}}>
          <Big size={72} style={{textAlign: 'left'}}>
            {title}
          </Big>
        </div>
        <svg width={200} height={130} viewBox="0 0 200 130">
          {icon}
        </svg>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      <Headline at={2} size={110} y={140}>
        Three <I>theories</I>
      </Headline>
      <div style={{position: 'absolute', top: 380, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 30}}>
        {card(1, 'LEAKY HATCHES', 2, (
          <g>
            <rect x={20} y={20} width={160} height={90} fill="#0b1119" stroke="#3a4a5c" strokeWidth={5} />
            <rect x={24} y={110 - 80 * p(frame, 8, 80)} width={152} height={80 * p(frame, 8, 80)} fill={ICE} opacity={0.6} />
          </g>
        ))}
        {card(2, 'A HIDDEN SHOAL', shoal, (
          <g>
            <path d="M 0 40 L 200 40" stroke={ICE} strokeWidth={4} />
            <path d="M 0 130 L 60 70 L 90 90 L 130 60 L 200 130 Z" fill="#6b5a3a" />
            <rect x={40} y={26} width={120} height={22} rx={6} fill={C.white} />
          </g>
        ))}
        {card(3, 'THREE GIANT WAVES', waves, (
          <g fill="none" stroke={ICE} strokeWidth={7} strokeLinecap="round">
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${10 + i * 60} 110 Q ${30 + i * 60} ${30} ${60 + i * 60} 70`} opacity={p(frame, waves + 4 + i * 6, 6)} />
            ))}
          </g>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · No one knows ─────────────────────────
export const Unknown: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const fast = cue.s(1);
  return (
    <AbsoluteFill>
      <Sea fog={0.8} storm={0.3} dark={0.3} />
      <Headline at={2} until={fast - 1} size={130} y={260}>
        No one <I>knows</I>
      </Headline>
      {frame >= fast ? (
        <Center top={560} style={{opacity: p(frame, fast, 8)}}>
          <div style={{textAlign: 'center'}}>
            <Big size={90}>Calls for help sent:</Big>
            <Big size={320} color={C.red}>
              0
            </Big>
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The bell ─────────────────────────
export const Memorial: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const bell = cue.s(1);
  const rings = Math.min(29, Math.max(0, Math.floor((frame - bell) / 9) + 1));
  const swing = frame >= bell ? Math.sin((frame - bell) / 1.5) * 10 : 0;
  return (
    <AbsoluteFill>
      <Background tint={ICE} />
      {frame < bell ? (
        <>
          <Headline at={2} size={100} y={170}>
            <I>1976</I> · a hit song
          </Headline>
          <Center top={520} style={{opacity: p(frame, 4, 8)}}>
            <div style={{width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, #1c2633 0 18%, #07090c 19% 22%, #11161c 23% 100%)', border: `6px solid ${ICE}`, transform: `rotate(${frame * 3}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 200, height: 200, borderRadius: '50%', background: ICE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 34, color: '#07090c', textAlign: 'center', lineHeight: 1}}>
                GORDON
                <br />
                LIGHTFOOT
              </div>
            </div>
          </Center>
        </>
      ) : (
        <>
          <Headline at={bell} size={96} y={150}>
            Every <I>November 10th</I>
          </Headline>
          <Center top={380}>
            <Bell size={500} swing={swing} />
          </Center>
          <Center top={1000}>
            <div style={{textAlign: 'center'}}>
              <Big size={200} color={ICE}>
                {rings}
              </Big>
              <Big size={60}>rings · one for every man</Big>
            </div>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [cooper, both, tap] = [cue.s(1), cue.s(2), cue.s(3)];
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
      <Headline at={2} size={120} y={130} color={ICE}>
        Watch next
      </Headline>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('fitz/cta/celeste.jpg', 'THE GHOST SHIP WITH NO ONE ON BOARD', 6, frame < cooper)}
        {card('fitz/cta/dbcooper.jpg', 'THE MAN WHO VANISHED FROM A PLANE', cooper, frame >= cooper && frame < both)}
      </div>
      {frame >= both ? (
        <Center top={1010} style={{opacity: p(frame, both, 8)}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 5}}>BOTH ON THIS CHANNEL</div>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3, marginTop: 6}}>CHRONOS GALAXY</div>
          </div>
        </Center>
      ) : null}
      {frame >= tap ? (
        <Center top={1215} style={{transform: `scale(${pulse})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 62, color: '#07090c', background: ICE, padding: '14px 40px', borderRadius: 18, letterSpacing: 2}}>TAP · FOLLOW · WATCH NEXT</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
