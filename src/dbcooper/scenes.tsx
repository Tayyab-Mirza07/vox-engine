import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LonLat, USMap} from '../geo';
import {BODY, C, Cues, DISPLAY, W, inOut, lerp, p, rnd, slam} from '../lib';
import {Background, Figure, Headline, Photo, Stamp, Tag} from '../ui';
import {AMBER, Evidence, Faller, Forest, Gauge, Jet, NightSky, Paper, Typed} from './parts';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PHOTO = (name: string) => `dbcooper/photos/${name}`;
const FBI = 'FBI · public domain';

const PLACE = {
  portland: [-122.6, 45.59] as LonLat,
  seattle: [-122.31, 47.45] as LonLat,
  reno: [-119.77, 39.5] as LonLat,
  ariel: [-122.4, 45.95] as LonLat,
  tenaBar: [-122.76, 45.72] as LonLat,
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const MapBox: React.FC<{top?: number; children: React.ReactNode; opacity?: number}> = ({top = 300, children, opacity = 1}) => (
  <div style={{position: 'absolute', top, left: 40, width: 1000, height: 640, overflow: 'hidden', borderRadius: 24, border: `3px solid ${C.line}`, background: '#0b1119', opacity}}>
    {children}
  </div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const A: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: AMBER}}>{children}</span>;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red}}>{children}</span>;

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const jumpAt = cue.w('jumped');
  const [night, storm, cash, gone] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const jetX = lerp(-140, 250, frame / cue.dur);
  const jetY = 470 + Math.sin(frame / 14) * 10;
  const fall = p(frame, jumpAt, 80, (t) => t * t);
  const cashIn = slam(frame, cash, 2.2);
  const count = Math.round(interpolate(frame, [cash, cash + 22], [0, 200000], clamp) / 1000) * 1000;
  return (
    <AbsoluteFill>
      <NightSky rain={p(frame, storm, 12)} flashAt={[storm, storm + 26, gone + 4]} />
      <div style={{position: 'absolute', left: jetX, top: jetY, transform: 'rotate(-2deg)'}}>
        <Jet width={900} color="#2c3e59" stairs={p(frame, jumpAt - 14, 12)} />
      </div>
      {frame >= jumpAt && fall < 1 ? (
        <div style={{position: 'absolute', left: jetX + 90 - fall * 90, top: jetY + 190 + fall * 900, opacity: 1 - p(frame, jumpAt + 60, 20)}}>
          <Faller size={110} spin={fall * 300} />
        </div>
      ) : null}
      <div style={{position: 'absolute', bottom: 0, left: 0}}>
        <Forest width={W} height={380} />
      </div>
      <Headline at={0} until={night - 1} size={190} y={170} color={AMBER}>
        1971
      </Headline>
      <Headline at={night} until={storm - 1} size={150} y={190}>
        At night.
      </Headline>
      <Headline at={storm} until={cash - 1} size={150} y={190}>
        In a storm.
      </Headline>
      {frame >= cash && frame < gone ? (
        <Center top={840} style={{opacity: cashIn.opacity, transform: `scale(${cashIn.scale})`}}>
          <div>
            <Big size={210} color={AMBER}>
              ${count.toLocaleString('en-US')}
            </Big>
            <Big size={80}>in cash</Big>
          </div>
        </Center>
      ) : null}
      {frame >= gone ? (
        <>
          <Center top={560} style={{opacity: p(frame, gone, 10)}}>
            <Photo src={PHOTO('sketch.jpg')} width={560} height={700} gray={1} zoom={lerp(1, 1.1, p(frame, gone, 60))} focus="50% 30%" credit={`FBI sketch · ${FBI}`} accent={C.red} />
          </Center>
          <Stamp at={gone + 8} y={1010} size={104}>
            Never seen again
          </Stamp>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · The hunt ─────────────────────────
export const Hunt: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [nameAt, ticketAt] = [cue.s(1), cue.s(2)];
  const yearsP = p(frame, 6, cue.e(0) - 12, inOut);
  const year = Math.round(lerp(1971, 2016, yearsP));
  const ticket = p(frame, ticketAt, 12);
  return (
    <AbsoluteFill>
      <Background tint={AMBER} />
      {frame < nameAt ? (
        <>
          <Headline at={2} size={104} y={190}>
            Hunted for <A>45 years</A>
          </Headline>
          <Center top={560}>
            <Big size={330} color={AMBER}>
              {year}
            </Big>
          </Center>
          <div style={{position: 'absolute', top: 1010, left: 110, right: 110}}>
            <div style={{height: 14, background: C.line, borderRadius: 7}}>
              <div style={{height: '100%', width: `${yearsP * 100}%`, background: AMBER, borderRadius: 7, boxShadow: `0 0 30px ${AMBER}`}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 2}}>
              <span>1971</span>
              <span>FBI CASE “NORJAK”</span>
              <span>2016</span>
            </div>
          </div>
        </>
      ) : null}
      {frame >= nameAt && frame < ticketAt ? (
        <>
          <Headline at={nameAt} size={96} y={170}>
            Real name: <R>unknown</R>
          </Headline>
          <Center top={400}>
            <Photo src={PHOTO('poster.jpg')} width={520} height={900} zoom={lerp(1.08, 1, p(frame, nameAt, 40))} focus="50% 0%" credit={`FBI bulletin, 1971 · ${FBI}`} accent={AMBER} />
          </Center>
        </>
      ) : null}
      {frame >= ticketAt ? (
        <>
          <Headline at={ticketAt} size={96} y={190}>
            It began with a <A>$20 ticket</A>
          </Headline>
          <Center top={560} style={{opacity: ticket, transform: `translateY(${(1 - ticket) * 120}px)`}}>
            <Paper width={860} rotate={-3}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 5, borderBottom: '4px solid #1a1712', paddingBottom: 12}}>NORTHWEST ORIENT AIRLINES</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 26}}>
                <div>
                  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 3, opacity: 0.6}}>FLIGHT</div>
                  <div style={{fontFamily: DISPLAY, fontSize: 120, lineHeight: 1}}>305</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 3, opacity: 0.6}}>ONE WAY · CASH</div>
                  <div style={{fontFamily: DISPLAY, fontSize: 120, lineHeight: 1, color: '#a3271c'}}>$20</div>
                </div>
              </div>
              <div style={{fontFamily: DISPLAY, fontSize: 64, marginTop: 22, letterSpacing: 2}}>PORTLAND → SEATTLE</div>
            </Paper>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Portland ─────────────────────────
export const Portland: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [pdx, fly, name] = [cue.s(1), cue.s(2), cue.s(3)];
  const zoom = interpolate(frame, [pdx - 6, pdx + 26], [1, 5.2], {...clamp, easing: inOut});
  const route = p(frame, cue.w('ticket'), 36, inOut);
  return (
    <AbsoluteFill>
      <Background tint={AMBER} />
      <MapBox>
        <USMap
          width={1000}
          height={640}
          frame={frame}
          highlight={frame < fly ? 'Oregon' : 'Washington'}
          highlightAmount={0.1}
          zoom={zoom}
          focus={[-121.2, 46.5]}
          routes={[{from: PLACE.portland, to: PLACE.seattle, progress: route}]}
          pins={[
            {at: PLACE.portland, label: 'PORTLAND', show: p(frame, pdx + 14, 8), align: 'right'},
            {at: PLACE.seattle, label: 'SEATTLE', show: p(frame, cue.w('Seattle') - 4, 8), align: 'right'},
          ]}
        />
      </MapBox>
      <Headline at={2} until={fly - 1} size={84} y={110}>
        The day before <A>Thanksgiving</A>
      </Headline>
      <Headline at={fly} until={name - 1} size={84} y={110}>
        A quiet man in a <A>black tie</A>
      </Headline>
      <Headline at={name} size={84} y={110}>
        The name he gives
      </Headline>
      {frame < name ? (
        <Center top={1000} style={{opacity: p(frame, 4, 8)}}>
          <Paper width={560} rotate={2} style={{padding: '20px 30px', textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: '#a3271c'}}>WEDNESDAY</div>
            <div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1}}>NOV 24</div>
            <div style={{fontFamily: DISPLAY, fontSize: 64, lineHeight: 1}}>1971</div>
          </Paper>
        </Center>
      ) : (
        <Center top={1020}>
          <Paper width={900} rotate={-2} style={{padding: '30px 40px'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>PASSENGER NAME</div>
            <Typed text="DAN COOPER" at={cue.w('Dan') - 4} cps={14} style={{fontSize: 120, lineHeight: 1.2}} />
          </Paper>
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · The note ─────────────────────────
export const Note: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [noteAt, thinks] = [cue.s(1), cue.s(2)];
  const drops = cue.w('drops');
  const drop = p(frame, drops, 16, (t) => t * t);
  const noteIn = p(frame, noteAt, 12);
  const rows = 7;
  return (
    <AbsoluteFill>
      <Background tint={AMBER} />
      <Headline at={2} until={noteAt - 1} size={96} y={150}>
        Last row. <A>Bourbon</A> and soda.
      </Headline>
      <Headline at={noteAt} until={thinks - 1} size={96} y={150}>
        He hands her a <A>note</A>
      </Headline>
      <Headline at={thinks} size={92} y={150}>
        “His phone number”
      </Headline>
      {/* cabin, seen from above: last row highlighted */}
      <svg width={W} height={560} style={{position: 'absolute', top: 350}}>
        <rect x={250} y={-60} width={580} height={600} rx={90} fill="#0b1119" stroke={C.line} strokeWidth={4} />
        {Array.from({length: rows * 6}, (_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const x = 300 + col * 74 + (col > 2 ? 40 : 0);
          const y = 20 + row * 70;
          const his = row === rows - 1 && col === 2;
          return <rect key={i} x={x} y={y} width={56} height={50} rx={10} fill={his ? AMBER : '#243140'} opacity={his ? 0.6 + 0.4 * Math.sin(frame / 4) : 1} />;
        })}
        <text x={880} y={20 + (rows - 1) * 70 + 36} fontFamily={BODY} fontWeight={800} fontSize={34} fill={AMBER} letterSpacing={2}>
          ◀ HIM
        </text>
        {/* drink + cigarette */}
        <g opacity={p(frame, cue.w('bourbon'), 8)} transform="translate(90, 300)">
          <path d="M 0 0 L 90 0 L 78 130 L 12 130 Z" fill="none" stroke={C.white} strokeWidth={7} />
          <path d="M 8 60 L 82 60 L 76 124 L 14 124 Z" fill="#b8741a" />
        </g>
        <g opacity={p(frame, cue.w('cigarette'), 8)} transform="translate(60, 500)">
          <rect x={0} y={0} width={150} height={18} rx={4} fill={C.white} />
          <rect x={0} y={0} width={44} height={18} rx={4} fill="#c98a3c" />
          <circle cx={152} cy={9} r={8} fill={C.red} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={160 + Math.sin((frame + i * 20) / 9) * 14} cy={-((frame * 2 + i * 34) % 100)} r={10 + i * 4} fill="#fff" opacity={0.12} />
          ))}
        </g>
      </svg>
      {frame >= noteAt ? (
        <Center top={970 + drop * 250} style={{opacity: noteIn * (1 - p(frame, drops + 10, 8)), transform: `translateX(${(1 - noteIn) * -300}px) rotate(${-6 + drop * 30}deg) scale(${1 - drop * 0.5})`}}>
          <Paper width={420} style={{padding: '26px 30px', textAlign: 'center'}}>
            <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 64}}>{frame >= thinks ? '☎ ?' : 'NOTE'}</div>
          </Paper>
        </Center>
      ) : null}
      {frame >= thinks ? (
        <svg width={W} height={240} style={{position: 'absolute', top: 1130, opacity: p(frame, thinks, 8)}}>
          <path d="M 440 80 Q 540 -30 640 80" fill="none" stroke={C.white} strokeWidth={10} />
          <rect x={390} y={76} width={300} height={150} rx={26} fill="#3a2a1c" stroke={AMBER} strokeWidth={5} />
          <text x={540} y={170} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={34} fill={AMBER} letterSpacing={4}>
            HER PURSE
          </text>
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The bomb ─────────────────────────
export const Bomb: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [miss, bomb] = [cue.s(1), cue.s(2)];
  const hit = slam(frame, bomb, 3);
  const shake = frame >= bomb && frame < bomb + 10 ? (rnd(frame) - 0.5) * 26 : 0;
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 900px at 50% 40%, ${C.red}${frame >= bomb ? '55' : '22'}, transparent 70%)`}} />
      <AbsoluteFill style={{transform: `translate(${shake}px, ${-shake}px)`}}>
        <Center top={260}>
          <Photo src={PHOTO('sketch.jpg')} width={760} height={960} gray={1} zoom={lerp(1, 1.45, p(frame, 0, cue.dur, inOut))} focus="50% 38%" credit={`FBI sketch · ${FBI}`} accent={frame >= bomb ? C.red : '#3a4a5c'} />
        </Center>
        {frame >= miss && frame < bomb ? (
          <Center top={980}>
            <Paper width={880} rotate={-2} style={{padding: '26px 34px'}}>
              <Typed text="“Miss, you'd better look at that note.”" at={miss} cps={26} style={{fontSize: 52, lineHeight: 1.25}} />
            </Paper>
          </Center>
        ) : null}
        {frame >= bomb ? (
          <Center top={900} style={{opacity: hit.opacity, transform: `scale(${hit.scale})`}}>
            <Big size={200} color={C.red} style={{background: '#050608ee', padding: '10px 40px', border: `10px solid ${C.red}`, borderRadius: 20, transform: 'rotate(-4deg)'}}>
              I have a bomb.
            </Big>
          </Center>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · The demands ─────────────────────────
const Chute: React.FC<{size: number; color?: string}> = ({size, color = AMBER}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 6 46 Q 50 -18 94 46 Q 78 36 64 46 Q 50 36 36 46 Q 22 36 6 46 Z" fill={color} />
    <g stroke={color} strokeWidth={3}>
      <line x1={6} y1={46} x2={50} y2={88} />
      <line x1={36} y1={46} x2={50} y2={88} />
      <line x1={64} y1={46} x2={50} y2={88} />
      <line x1={94} y1={46} x2={50} y2={88} />
    </g>
    <rect x={43} y={84} width={14} height={14} rx={3} fill={color} />
  </svg>
);

export const Demands: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [dem, cash, chutes, truck] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const count = Math.round(interpolate(frame, [cash, cash + 24], [0, 200000], clamp) / 1000) * 1000;
  const row: React.CSSProperties = {display: 'flex', alignItems: 'center', gap: 30, background: C.panel, border: `4px solid ${C.line}`, borderRadius: 22, padding: '22px 30px', width: 940, height: 220, boxSizing: 'border-box'};
  const num: React.CSSProperties = {fontFamily: DISPLAY, fontSize: 110, color: C.bg, background: AMBER, width: 130, height: 150, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0};
  const items = [
    {at: cash, body: <Big size={120} color={AMBER}>${count.toLocaleString('en-US')}</Big>},
    {
      at: chutes,
      body: (
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{opacity: p(frame, chutes + 3 + i * 4, 5)}}>
              <Chute size={130} />
            </div>
          ))}
        </div>
      ),
    },
    {at: truck, body: <Big size={88}>Fuel truck · Seattle</Big>},
  ];
  return (
    <AbsoluteFill>
      <Background tint={frame < dem ? C.red : AMBER} />
      {frame < dem ? (
        <>
          <Headline at={2} size={96} y={170}>
            Inside the <R>briefcase</R>
          </Headline>
          <svg width={W} height={760} style={{position: 'absolute', top: 440}}>
            <rect x={150} y={60} width={780} height={520} rx={26} fill="#1a1410" stroke="#6b4a2a" strokeWidth={12} />
            <rect x={470} y={20} width={140} height={50} rx={16} fill="none" stroke="#6b4a2a" strokeWidth={12} />
            {Array.from({length: 8}, (_, i) => {
              const t = p(frame, cue.w('cylinders') - 4 + i * 2, 6);
              return <rect key={i} x={215 + (i % 4) * 118} y={120 + Math.floor(i / 4) * 210} width={84} height={180} rx={20} fill={C.red} opacity={t} transform={`translate(0, ${(1 - t) * -30})`} />;
            })}
            <g opacity={p(frame, cue.w('wires') - 3, 6)} fill="none" strokeWidth={8} strokeLinecap="round">
              <path d="M 257 300 Q 420 380 640 320 T 790 300" stroke="#f5d142" />
              <path d="M 375 120 Q 560 60 790 180" stroke="#2f8cff" />
            </g>
            <g opacity={p(frame, cue.w('battery') - 3, 6)}>
              <rect x={720} y={170} width={150} height={240} rx={14} fill="#2b3541" stroke={C.white} strokeWidth={5} />
              <rect x={770} y={150} width={50} height={24} rx={5} fill={C.white} />
              <text x={795} y={310} textAnchor="middle" fontFamily={DISPLAY} fontSize={70} fill={AMBER}>
                +
              </text>
            </g>
          </svg>
        </>
      ) : (
        <>
          <Headline at={dem} size={110} y={170}>
            His <A>demands</A>
          </Headline>
          <div style={{position: 'absolute', top: 440, left: 70, display: 'flex', flexDirection: 'column', gap: 34}}>
            {items.map((it, i) => {
              const t = p(frame, it.at, 8);
              return (
                <div key={i} style={{...row, opacity: frame >= it.at ? t : 0.12, transform: `translateX(${frame >= it.at ? (1 - t) * 80 : 0}px)`, borderColor: frame >= it.at ? AMBER : C.line}}>
                  <div style={num}>{i + 1}</div>
                  {frame >= it.at ? it.body : null}
                </div>
              );
            })}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Seattle ─────────────────────────
export const Seattle: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [word, free] = [cue.s(1), cue.s(2)];
  const a = frame / 22;
  const hours = interpolate(frame, [4, word - 6], [0, 120], clamp);
  const money = p(frame, cue.w('scrambles'), word - cue.w('scrambles') - 6, inOut);
  return (
    <AbsoluteFill>
      <Background tint={frame >= free ? C.green : AMBER} />
      <MapBox>
        <USMap width={1000} height={640} frame={frame} highlight="Washington" highlightAmount={0.1} zoom={6.5} focus={[-122.0, 47.3]} pins={[{at: PLACE.seattle, label: 'SEATTLE', show: 1, align: 'right'}]} />
        {/* circling jet */}
        <div style={{position: 'absolute', left: 390 + Math.cos(a) * 250, top: 300 + Math.sin(a) * 190, transform: `rotate(${(a * 180) / Math.PI + 90}deg)`}}>
          <svg width={70} height={70} viewBox="-35 -35 70 70">
            <path d="M 30 0 L -18 -9 L -26 -24 L -30 -24 L -24 0 L -30 24 L -26 24 L -18 9 Z M 2 -6 L -12 -34 L -4 -34 L 12 -6 Z M 2 6 L -12 34 L -4 34 L 12 6 Z" fill={C.white} />
          </svg>
        </div>
        <svg width={1000} height={640} style={{position: 'absolute', left: 0, top: 0}}>
          <ellipse cx={425} cy={335} rx={250} ry={190} fill="none" stroke={AMBER} strokeWidth={4} strokeDasharray="14 14" opacity={0.6} />
        </svg>
      </MapBox>
      <Headline at={2} until={word - 1} size={84} y={110}>
        Circling for <A>{Math.floor(hours / 60)}:{String(Math.floor(hours % 60)).padStart(2, '0')}</A> hours
      </Headline>
      <Headline at={word} until={free - 1} size={84} y={110}>
        He keeps his word
      </Headline>
      <Headline at={free} size={84} y={110}>
        <span style={{color: C.green}}>36 passengers</span> walk free
      </Headline>
      {frame < free ? (
        <div style={{position: 'absolute', top: 1010, left: 90, right: 90}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.dim, marginBottom: 12}}>THE FBI GATHERS THE RANSOM</div>
          <div style={{height: 70, borderRadius: 14, background: C.panel, border: `3px solid ${C.line}`, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${money * 100}%`, background: AMBER, boxShadow: `0 0 40px ${AMBER}`}} />
          </div>
          <Big size={92} color={AMBER} style={{marginTop: 18, textAlign: 'left'}}>
            ${(Math.round((money * 200000) / 1000) * 1000).toLocaleString('en-US')}
          </Big>
        </div>
      ) : (
        <svg width={W} height={340} style={{position: 'absolute', top: 990}}>
          {Array.from({length: 36}, (_, i) => {
            const t = p(frame, free + 4 + i, 6);
            return <Figure key={i} x={130 + (i % 12) * 75} y={105 + Math.floor(i / 12) * 110} h={92} color={t > 0.5 ? C.green : '#3a4a5c'} />;
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Back into the sky ─────────────────────────
export const Orders: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [orders, low, slow, gear] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4)];
  const first = slam(frame, 2, 2.4);
  const route = p(frame, cue.w('sky'), 50, inOut);
  const south = p(frame, cue.w('Mexico'), 20);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < orders ? (
        <Center top={640} style={{opacity: first.opacity, transform: `scale(${first.scale})`}}>
          <Big size={170}>
            But he isn't
            <br />
            <R>finished.</R>
          </Big>
        </Center>
      ) : (
        <>
          <Headline at={orders} until={low - 1} size={84} y={110}>
            Next stop: <A>Mexico City</A>
          </Headline>
          <Headline at={low} size={84} y={110}>
            Strange <A>instructions</A>
          </Headline>
          <MapBox>
            <USMap
              width={1000}
              height={640}
              frame={frame}
              zoom={2.5}
              focus={[-119.2, 43.6]}
              routes={[{from: PLACE.seattle, to: PLACE.reno, progress: route}]}
              pins={[
                {at: PLACE.seattle, label: 'SEATTLE', show: 1, align: 'right'},
                {at: PLACE.reno, label: 'RENO · REFUEL', show: p(frame, cue.w('sky') + 44, 8), align: 'right'},
              ]}
            />
            <div style={{position: 'absolute', left: 250, bottom: 26, opacity: south, fontFamily: DISPLAY, fontSize: 54, color: AMBER, letterSpacing: 2}}>↓ TO MEXICO CITY</div>
          </MapBox>
          <div style={{position: 'absolute', top: 990, left: 40, right: 40, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start'}}>
            <Gauge size={250} label="FLY LOW" value="10,000" unit="FEET MAX" amount={lerp(0.9, 0.25, p(frame, low, 20, inOut))} show={p(frame, low, 8)} />
            <Gauge size={250} label="FLY SLOW" value="MIN" unit="AIRSPEED" amount={lerp(0.9, 0.2, p(frame, slow, 20, inOut))} show={p(frame, slow, 8)} />
            <div style={{opacity: p(frame, gear, 8), textAlign: 'center', width: 320}}>
              <div style={{height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1119', border: `5px solid ${AMBER}`, borderRadius: 125}}>
                <Jet width={270} color={C.white} gear={p(frame, gear + 4, 18)} lights={false} />
              </div>
              <div style={{fontFamily: DISPLAY, fontSize: 54, color: AMBER, letterSpacing: 3, marginTop: 6}}>GEAR DOWN</div>
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The jump ─────────────────────────
export const Jump: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [stairsAt, tail, forest] = [cue.s(1), cue.s(2), cue.s(3)];
  const bumpAt = cue.w('jumps') - 2;
  const goneAt = cue.w('gone');
  const bump = frame >= bumpAt ? Math.sin((frame - bumpAt) / 2.2) * 5 * Math.exp(-(frame - bumpAt) / 14) : 0;
  const fall = p(frame, bumpAt + 2, 110, (t) => t * t);
  const light = Math.floor(frame / 6) % 2;
  const late = frame >= tail;
  return (
    <AbsoluteFill>
      <NightSky rain={1} flashAt={[bumpAt, goneAt + 6]} moon={false} />
      <Center top={150}>
        <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 130, color: late ? C.red : AMBER, letterSpacing: 6, textShadow: `0 0 40px ${late ? C.red : AMBER}`}}>
          {late ? '8:13 PM' : '8:00 PM'}
        </div>
      </Center>
      <div style={{position: 'absolute', left: 100, top: 520, transform: `rotate(${-1 + bump}deg)`, transformOrigin: '70% 50%'}}>
        <Jet width={900} color="#2c3e59" stairs={p(frame, stairsAt - 6, 30, inOut)} gear={1} />
      </div>
      {frame < stairsAt + 20 ? (
        <Center top={900} style={{opacity: p(frame, cue.w('warning') - 4, 6)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, background: '#0b1119', border: `4px solid ${C.line}`, borderRadius: 18, padding: '20px 34px'}}>
            <div style={{width: 70, height: 70, borderRadius: '50%', background: C.red, opacity: light ? 1 : 0.2, boxShadow: `0 0 ${light ? 50 : 0}px ${C.red}`}} />
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 44, color: C.white, letterSpacing: 4}}>AFT STAIRS · OPEN</div>
          </div>
        </Center>
      ) : null}
      {frame >= bumpAt + 2 && fall < 1 ? (
        <div style={{position: 'absolute', left: 190 - fall * 60, top: 720 + fall * 880, opacity: 1 - p(frame, bumpAt + 80, 30)}}>
          <Faller size={100} spin={fall * 400} />
        </div>
      ) : null}
      <div style={{position: 'absolute', bottom: 0, left: 0}}>
        <Forest width={W} height={420} seed={5} />
      </div>
      {frame >= forest ? (
        <Center top={1020} style={{opacity: p(frame, forest, 10)}}>
          <Tag color={C.white}>Somewhere over southwest Washington</Tag>
        </Center>
      ) : null}
      <Stamp at={goneAt} y={1180} size={150}>
        Gone
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Reno ─────────────────────────
export const Reno: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [empty, left] = [cue.s(1), cue.s(2)];
  const e = slam(frame, empty, 3);
  const siren = Math.floor(frame / 5) % 2;
  return (
    <AbsoluteFill>
      <Background tint={frame < empty ? (siren ? C.red : '#2f6bff') : AMBER} />
      {frame < left ? (
        <>
          <Headline at={2} until={empty - 1} size={84} y={110}>
            Agents storm the <R>cabin</R>
          </Headline>
          <MapBox opacity={frame >= empty ? 0.25 : 1}>
            <USMap width={1000} height={640} frame={frame} highlight="Nevada" highlightAmount={0.15} zoom={3.4} focus={[-119.2, 40.6]} pins={[{at: PLACE.reno, label: 'RENO, NEVADA', show: p(frame, 4, 8), align: 'right'}]} />
          </MapBox>
          {frame >= empty ? (
            <Center top={480} style={{opacity: e.opacity, transform: `scale(${e.scale})`}}>
              <Big size={300}>Empty.</Big>
            </Center>
          ) : null}
        </>
      ) : (
        <>
          <Headline at={left} size={100} y={170}>
            All he <A>left behind</A>
          </Headline>
          <div style={{position: 'absolute', top: 560, left: 40, right: 40, display: 'flex', justifyContent: 'space-between'}}>
            <Evidence letter="A" label="BLACK CLIP-ON TIE" show={p(frame, cue.w('black') - 4, 8)}>
              <svg width={120} height={220} viewBox="0 0 120 220">
                <path d="M 44 0 L 76 0 L 84 26 L 60 40 L 36 26 Z" fill="#111" stroke={C.white} strokeWidth={3} />
                <path d="M 60 40 L 86 170 L 60 216 L 34 170 Z" fill="#111" stroke={C.white} strokeWidth={3} />
                <rect x={40} y={104} width={40} height={8} fill={AMBER} />
              </svg>
            </Evidence>
            <Evidence letter="B" label="8 CIGARETTE BUTTS" show={p(frame, cue.w('eight') - 4, 8)}>
              <svg width={240} height={200} viewBox="0 0 240 200">
                {Array.from({length: 8}, (_, i) => (
                  <g key={i} transform={`translate(${30 + (i % 4) * 52}, ${40 + Math.floor(i / 4) * 86}) rotate(${-30 + rnd(i) * 60}, 12, 30)`}>
                    <rect width={22} height={60} rx={5} fill="#c98a3c" />
                    <rect width={22} height={16} rx={4} fill="#444" />
                  </g>
                ))}
              </svg>
            </Evidence>
            <Evidence letter="C" label="2 PARACHUTES" show={p(frame, cue.w('two') - 4, 8)}>
              <div style={{display: 'flex'}}>
                <Chute size={125} />
                <Chute size={125} />
              </div>
            </Evidence>
          </div>
          <Center top={1040} style={{opacity: p(frame, cue.w('two') + 10, 8)}}>
            <Tag color={C.white}>He took the other two with him</Tag>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The search ─────────────────────────
export const Search: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [n1, n2, n3, susp, charged] = [cue.s(1), cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  const scan = (frame * 9) % 640;
  const count = Math.round(interpolate(frame, [susp, susp + 30], [0, 800], clamp));
  const nos = [
    {at: n1, text: 'NO BODY'},
    {at: n2, text: 'NO PARACHUTE'},
    {at: n3, text: 'NOT A SINGLE BILL'},
  ];
  return (
    <AbsoluteFill>
      <Background tint={frame >= susp ? C.red : AMBER} />
      <Headline at={2} until={susp - 1} size={84} y={110}>
        Weeks of <A>searching</A>
      </Headline>
      <Headline at={susp} size={88} y={110}>
        <R>{count}+</R> suspects
      </Headline>
      {frame < susp ? (
        <MapBox>
          <USMap width={1000} height={640} frame={frame} highlight="Washington" highlightAmount={0.1} zoom={7} focus={[-121.9, 46.2]} pins={[{at: PLACE.ariel, label: 'SEARCH ZONE', show: p(frame, 8, 8), align: 'right'}]} />
          <svg width={1000} height={640} style={{position: 'absolute', left: 0, top: 0}}>
            {Array.from({length: 9}, (_, i) => (
              <line key={`v${i}`} x1={i * 125} x2={i * 125} y1={0} y2={640} stroke={AMBER} strokeWidth={1.5} opacity={0.25} />
            ))}
            {Array.from({length: 6}, (_, i) => (
              <line key={`h${i}`} y1={i * 128} y2={i * 128} x1={0} x2={1000} stroke={AMBER} strokeWidth={1.5} opacity={0.25} />
            ))}
            <rect x={0} y={scan - 40} width={1000} height={40} fill={AMBER} opacity={0.18} />
            <line x1={0} x2={1000} y1={scan} y2={scan} stroke={AMBER} strokeWidth={4} />
          </svg>
        </MapBox>
      ) : (
        <svg width={W} height={640} style={{position: 'absolute', top: 300}}>
          {Array.from({length: 77}, (_, i) => {
            const t = p(frame, susp + (i % 11) + Math.floor(i / 11) * 2, 6);
            return (
              <g key={i} opacity={t * (frame >= charged ? 0.3 : 1)}>
                <Figure x={90 + (i % 11) * 90} y={88 + Math.floor(i / 11) * 88} h={76} color="#3a4a5c" />
              </g>
            );
          })}
        </svg>
      )}
      <div style={{position: 'absolute', top: 990, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 14}}>
        {nos.map((n) => {
          const s = slam(frame, n.at, 1.6);
          return (
            <div key={n.text} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: frame >= n.at ? s.opacity : 0, transform: `scale(${s.scale})`, transformOrigin: 'left'}}>
              <div style={{fontFamily: DISPLAY, fontSize: 90, color: C.red, lineHeight: 1}}>✕</div>
              <Big size={90} style={{textAlign: 'left'}}>{n.text}</Big>
            </div>
          );
        })}
      </div>
      <Stamp at={charged} y={640} size={120}>
        No one charged
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The money ─────────────────────────
export const Money: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const found = cue.w('found');
  const [serial, only] = [cue.s(1), cue.s(2)];
  const bar = p(frame, only + 6, 24, inOut);
  return (
    <AbsoluteFill>
      <Background tint={AMBER} />
      <Headline at={2} until={found - 1} size={88} y={110}>
        <A>1980</A> · nine years later
      </Headline>
      <Headline at={found} until={serial - 1} size={84} y={110}>
        Rotting <A>$20 bills</A>
      </Headline>
      <Headline at={serial} until={only - 1} size={84} y={110}>
        Serial numbers: <span style={{color: C.green}}>match</span>
      </Headline>
      <Headline at={only} size={84} y={110}>
        The only money <A>ever found</A>
      </Headline>
      {frame < found ? (
        <MapBox>
          <USMap width={1000} height={640} frame={frame} highlight="Washington" highlightAmount={0.1} zoom={7} focus={[-121.9, 46.2]} pins={[{at: PLACE.tenaBar, label: 'COLUMBIA RIVER', show: p(frame, cue.w('riverbank') - 10, 8), align: 'right'}]} />
        </MapBox>
      ) : (
        <Center top={320} style={{opacity: p(frame, found, 8)}}>
          <Photo src={PHOTO('money.jpg')} width={1000} height={660} zoom={lerp(1.15, 1, p(frame, found, 50))} focus="50% 50%" credit={`Ransom money found in 1980 · ${FBI}`} accent={frame >= serial ? C.green : AMBER} />
        </Center>
      )}
      {frame < found ? (
        <Center top={1020} style={{opacity: p(frame, cue.w('boy') - 6, 8)}}>
          <svg width={500} height={300} viewBox="0 0 500 300">
            <path d="M 0 250 Q 120 200 250 240 T 500 230 L 500 300 L 0 300 Z" fill="#6b5a3a" />
            <Figure x={210} y={244} h={150} color={AMBER} />
            <g transform={`rotate(${Math.sin(frame / 4) * 14}, 270, 180)`}>
              <line x1={250} y1={150} x2={330} y2={240} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
              <path d="M 318 232 L 346 232 L 340 262 L 322 262 Z" fill={C.white} />
            </g>
          </svg>
        </Center>
      ) : null}
      {frame >= found && frame < only ? (
        <Center top={1050} style={{opacity: p(frame, found + 10, 8)}}>
          <Tag color={frame >= serial ? C.green : AMBER} style={{fontSize: 46, padding: '14px 30px'}}>
            {frame >= serial ? '✓ Cooper’s ransom' : '3 bundles · $5,800'}
          </Tag>
        </Center>
      ) : null}
      {frame >= only ? (
        <div style={{position: 'absolute', top: 1030, left: 90, right: 90}}>
          <div style={{height: 70, borderRadius: 14, background: C.panel, border: `3px solid ${C.line}`, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${Math.max(1.2, bar * 2.9)}%`, background: C.green, boxShadow: `0 0 30px ${C.green}`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontFamily: DISPLAY, fontSize: 62, letterSpacing: 2}}>
            <span style={{color: C.green}}>$5,800 FOUND</span>
            <span style={{color: C.red}}>$194,200 MISSING</span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The question ─────────────────────────
export const Question: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [died, walked, name] = [cue.s(1), cue.s(2), cue.s(3)];
  const endAt = cue.e(3) + 6;
  const strike = p(frame, cue.w('reporter') - 2, 10);
  const cta = slam(frame, endAt, 2);
  const card: React.CSSProperties = {width: 480, height: 640, borderRadius: 24, overflow: 'hidden', position: 'relative', background: '#05080d'};
  const label: React.CSSProperties = {position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 10px', background: '#000000cc', fontFamily: DISPLAY, fontSize: 60, textAlign: 'center', letterSpacing: 2};
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < died ? (
        <>
          <Headline at={2} size={100} y={170}>
            <A>2016</A>: the FBI stops looking
          </Headline>
          <Center top={520}>
            <Paper width={820} rotate={-2} style={{padding: '40px 46px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, opacity: 0.6}}>FEDERAL BUREAU OF INVESTIGATION</div>
              <div style={{fontFamily: DISPLAY, fontSize: 110, lineHeight: 1.1, marginTop: 10}}>CASE: NORJAK</div>
              <div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 40, marginTop: 14, lineHeight: 1.4}}>
                OPENED: NOV 24, 1971
                <br />
                SUSPECT: “DAN COOPER”
                <br />
                STATUS:
              </div>
            </Paper>
          </Center>
          <Stamp at={cue.w('stopped')} y={980} size={150}>
            Unsolved
          </Stamp>
        </>
      ) : null}
      {frame >= died && frame < name ? (
        <>
          <Headline at={died} size={104} y={170}>
            What <A>really</A> happened?
          </Headline>
          <div style={{position: 'absolute', top: 520, left: 40, right: 40, display: 'flex', justifyContent: 'space-between'}}>
            <div style={{...card, border: `6px solid ${C.red}`, opacity: p(frame, died, 8)}}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a1220, #101a2b)'}} />
              <div style={{position: 'absolute', left: 190, top: 120 + ((frame - died) * 3) % 300, opacity: 0.9}}>
                <Faller size={90} color="#c7d3e3" spin={(frame - died) * 4} />
              </div>
              <div style={{position: 'absolute', bottom: 90, left: 0}}>
                <Forest width={480} height={240} seed={9} />
              </div>
              <div style={{...label, color: C.red}}>DIED THAT NIGHT?</div>
            </div>
            <div style={{...card, border: `6px solid ${C.green}`, opacity: frame >= walked ? p(frame, walked, 8) : 0.12}}>
              <Photo src={PHOTO('sketch-b.jpg')} width={468} height={628} gray={1} zoom={lerp(1, 1.12, p(frame, walked, 90))} focus="50% 25%" credit={`FBI sketch · ${FBI}`} accent="transparent" />
              <div style={{...label, color: C.green, bottom: 0}}>WALKED AWAY?</div>
            </div>
          </div>
        </>
      ) : null}
      {frame >= name ? (
        <>
          <Headline at={name} until={endAt - 1} size={96} y={170}>
            Even the name is <R>wrong</R>
          </Headline>
          <Center top={560}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.dim}}>THE NAME ON THE TICKET</div>
              <Big size={170} color={AMBER}>
                DAN COOPER
              </Big>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.dim, marginTop: 50}}>THE NAME IN THE NEWSPAPERS</div>
              <div style={{position: 'relative', display: 'inline-block'}}>
                <Big size={170}>D.B. COOPER</Big>
                <div style={{position: 'absolute', left: -10, top: '50%', height: 16, width: `${strike * 36}%`, background: C.red, transform: 'rotate(-3deg)'}} />
              </div>
              <div style={{opacity: p(frame, cue.w('mistake') - 4, 8), marginTop: 30}}>
                <Tag color={C.red} style={{color: C.white}}>A reporter's mistake</Tag>
              </div>
            </div>
          </Center>
        </>
      ) : null}
      {frame >= endAt ? (
        <Center top={150} style={{opacity: cta.opacity, transform: `scale(${cta.scale})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 78, color: C.bg, background: AMBER, padding: '16px 34px', borderRadius: 18, letterSpacing: 2, whiteSpace: 'nowrap'}}>FOLLOW FOR THE NEXT CASE</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
