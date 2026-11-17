import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Globe, LonLat} from '../geo';
import {BODY, C, Cues, DISPLAY, W, inOut, lerp, p, rnd, slam} from '../lib';
import {Background, Figure, Headline, Photo, Stamp, Tag} from '../ui';
import {Paper, Typed} from '../dbcooper/parts';
import {Barrel, Boat, FOG, Sea, Ship, TEAL} from './parts';

type SceneProps = {cue: Cues};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PHOTO = (name: string) => `celeste/photos/${name}`;
const PD = 'public domain';

const PLACE = {
  newYork: [-74.0, 40.7] as LonLat,
  genoa: [8.93, 44.41] as LonLat,
  azores: [-25.1, 36.97] as LonLat,
  found: [-17.0, 38.3] as LonLat,
  portugal: [-9.14, 38.72] as LonLat,
  haiti: [-73.1, 18.9] as LonLat,
};

const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 120, color = C.white, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, letterSpacing: 3, color, textAlign: 'center', textShadow: '0 8px 40px #000', ...style}}>{children}</div>
);
const T: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: TEAL}}>{children}</span>;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red}}>{children}</span>;

const Check: React.FC<{label: string; ok: boolean; show: number}> = ({label, ok, show}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: show, transform: `translateX(${(1 - show) * 60}px)`}}>
    <div style={{fontFamily: DISPLAY, fontSize: 86, color: ok ? TEAL : C.red, width: 80, textAlign: 'center'}}>{ok ? '✓' : '✕'}</div>
    <Big size={86} style={{textAlign: 'left'}}>
      {label}
    </Big>
  </div>
);

// ───────────────────────── 0 · Hook ─────────────────────────
export const Hook: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [sails, cargo, food, nobody] = [cue.s(2), cue.s(3), cue.s(4), cue.s(5)];
  const bob = Math.sin(frame / 18) * 10;
  const zoom = interpolate(frame, [0, nobody], [1, 1.25], {...clamp, easing: inOut});
  const crew = slam(frame, cue.w('single') - 2, 3);
  return (
    <AbsoluteFill>
      <Sea fog={0.9} />
      <Center top={560} style={{transform: `translateY(${bob}px) scale(${zoom}) rotate(${Math.sin(frame / 25) * 2}deg)`}}>
        <Ship width={720} color="#0a1018" />
      </Center>
      <Headline at={0} until={sails - 1} size={150} y={190} color={TEAL}>
        December 1872
      </Headline>
      {frame >= sails && frame < nobody ? (
        <div style={{position: 'absolute', top: 170, left: 110, display: 'flex', flexDirection: 'column', gap: 6}}>
          <Check label="SAILS UP" ok show={p(frame, sails, 6)} />
          <Check label="CARGO UNTOUCHED" ok show={p(frame, cargo, 6)} />
          <Check label="6 MONTHS OF FOOD" ok show={p(frame, food, 6)} />
        </div>
      ) : null}
      {frame >= nobody ? (
        <>
          <Headline at={nobody} size={100} y={190}>
            People on board:
          </Headline>
          <Center top={1080} style={{opacity: crew.opacity, transform: `scale(${crew.scale})`}}>
            <Big size={330} color={C.red}>
              0
            </Big>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · Ten people ─────────────────────────
export const TenPeople: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const never = cue.s(1);
  const gone = p(frame, never, 30);
  const card = (src: string, label: string, at: number) => (
    <div style={{opacity: p(frame, at, 8), transform: `translateY(${(1 - p(frame, at, 8)) * 40}px)`, textAlign: 'center'}}>
      <div style={{filter: `grayscale(${0.6 + gone * 0.4}) brightness(${1 - gone * 0.35})`}}>
        <Photo src={PHOTO(src)} width={290} height={380} gray={0.6} focus="50% 25%" credit={PD} accent={TEAL} />
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: 44, color: C.white, marginTop: 12, letterSpacing: 2}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Background tint={TEAL} />
      <Headline at={2} size={110} y={150}>
        The <T>Mary Celeste</T>
      </Headline>
      <div style={{position: 'absolute', top: 360, left: 40, right: 40, display: 'flex', justifyContent: 'space-between'}}>
        {card('briggs.jpg', 'THE CAPTAIN', 4)}
        {card('sarah.jpg', 'HIS WIFE', cue.w('wife') - 4)}
        {card('sophia.jpg', 'DAUGHTER, 2', cue.w('daughter') - 4)}
      </div>
      <svg width={W} height={300} style={{position: 'absolute', top: 920}}>
        {Array.from({length: 7}, (_, i) => (
          <g key={i} opacity={p(frame, 10 + i * 3, 6) * (1 - gone * 0.7)}>
            <Figure x={140 + i * 135} y={250} h={190} color={gone > 0.5 ? '#3a4a5c' : FOG} />
          </g>
        ))}
        <text x={540} y={292} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={32} fill={C.dim} letterSpacing={4}>
          + 7 CREW
        </text>
      </svg>
      <Stamp at={never + 6} y={760} size={110}>
        Never seen again
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Re-hook: why? ─────────────────────────
export const RehookWhy: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const back = cue.s(1);
  const q = slam(frame, 2, 2.4);
  const rewind = p(frame, back, 28, inOut);
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < back ? (
        <>
          <Center top={260} style={{opacity: q.opacity, transform: `scale(${q.scale})`}}>
            <Big size={380} color={C.red}>
              ?
            </Big>
          </Center>
          <Center top={760}>
            <Big size={104}>
              Why abandon a <T>perfect ship</T>
              <br />
              with his <R>own family?</R>
            </Big>
          </Center>
        </>
      ) : (
        <>
          <Headline at={back} size={110} y={200}>
            One month <T>earlier</T>
          </Headline>
          <Center top={560}>
            <Paper width={720} rotate={-2} style={{textAlign: 'center', padding: '30px 30px'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: '#a3271c'}}>1872</div>
              <div style={{fontFamily: DISPLAY, fontSize: 210, lineHeight: 1}}>{rewind < 0.5 ? 'DEC' : 'NOV'}</div>
            </Paper>
          </Center>
          <Center top={1060} style={{opacity: 0.5 + 0.5 * Math.sin(frame / 2)}}>
            <Tag color={TEAL}>◀◀ Rewind</Tag>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · New York → Genoa ─────────────────────────
export const Departure: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [captain, cargo] = [cue.s(2), cue.s(3)];
  const route = p(frame, cue.w('Genoa') - 10, 40, inOut);
  const lon = interpolate(frame, [0, captain, cue.w('Genoa') + 30], [-60, -60, -32], {...clamp, easing: inOut});
  const count = Math.round(interpolate(frame, [cargo + 6, cargo + 50], [0, 1701], clamp));
  return (
    <AbsoluteFill>
      <Background tint={TEAL} />
      <Headline at={2} until={cargo - 1} size={96} y={130}>
        <T>Nov 7, 1872</T> · New York
      </Headline>
      <Headline at={cargo} size={96} y={130}>
        In the hold
      </Headline>
      {frame < cargo ? (
        <div style={{position: 'absolute', top: 290, left: 40}}>
          <Globe
            width={1000}
            height={780}
            center={[lon, 38]}
            scale={720}
            frame={frame}
            routes={[{from: PLACE.newYork, to: PLACE.genoa, progress: route}]}
            pins={[
              {at: PLACE.newYork, label: 'NEW YORK', show: p(frame, 6, 8), align: 'left'},
              {at: PLACE.genoa, label: 'GENOA, ITALY', show: p(frame, cue.w('Genoa') + 24, 8), align: 'left'},
            ]}
          />
        </div>
      ) : null}
      {frame >= captain && frame < cargo ? (
        <div style={{position: 'absolute', top: 1000, left: 90, display: 'flex', alignItems: 'center', gap: 30, opacity: p(frame, captain, 8)}}>
          <Photo src={PHOTO('briggs.jpg')} width={220} height={280} gray={0.6} focus="50% 25%" credit={PD} accent={TEAL} />
          <div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.dim, letterSpacing: 4}}>CAPTAIN</div>
            <Big size={84} style={{textAlign: 'left'}}>
              Benjamin
              <br />
              Briggs
            </Big>
          </div>
        </div>
      ) : null}
      {frame >= cargo ? (
        <>
          <div style={{position: 'absolute', top: 330, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center'}}>
            {Array.from({length: 60}, (_, i) => (
              <div key={i} style={{opacity: p(frame, cargo + 4 + (i % 12) + Math.floor(i / 12) * 3, 4)}}>
                <Barrel size={72} />
              </div>
            ))}
          </div>
          <Center top={980}>
            <div style={{textAlign: 'center'}}>
              <Big size={200} color={TEAL}>
                {count.toLocaleString('en-US')}
              </Big>
              <Big size={66}>barrels of industrial alcohol</Big>
            </div>
          </Center>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 4 · The last log entry ─────────────────────────
export const LastLog: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [log, nothing, silent] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Sea y={1400} fog={0.4} />
      <Headline at={2} until={log - 1} size={110} y={190}>
        A <T>calm</T> voyage
      </Headline>
      <Headline at={log} size={96} y={170}>
        The ship's <T>log</T>
      </Headline>
      {frame >= log ? (
        <Center top={400}>
          <Paper width={900} rotate={-1.5} style={{padding: '36px 44px', minHeight: 640}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>LOG · MARY CELESTE</div>
            <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 46, marginTop: 24, lineHeight: 1.6}}>
              <div>Nov 24 — fair weather</div>
              <div style={{opacity: p(frame, cue.w('25th') - 4, 8)}}>
                <b>Nov 25</b> — island of the Azores in sight
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{opacity: p(frame, silent + 6 + i * 6, 6), color: '#a3271c'}}>
                  Nov {26 + i} — &nbsp;
                </div>
              ))}
            </div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, opacity: 0.5, marginTop: 18}}>Summary of the final entries, not a transcript</div>
          </Paper>
        </Center>
      ) : null}
      {frame >= nothing && frame < silent ? (
        <Center top={1120} style={{opacity: p(frame, nothing, 6)}}>
          <Tag color={TEAL}>Nothing unusual</Tag>
        </Center>
      ) : null}
      <Stamp at={silent + 2} y={1140} size={130}>
        Silence
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Found ─────────────────────────
export const Found: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const aboard = cue.s(1);
  const approach = p(frame, 6, aboard - 6, inOut);
  return (
    <AbsoluteFill>
      <Background tint={TEAL} />
      <Headline at={2} until={aboard - 1} size={96} y={130}>
        <T>Dec 4, 1872</T> · 9 days later
      </Headline>
      <Headline at={aboard} size={96} y={130}>
        They climb <T>aboard</T>
      </Headline>
      <div style={{position: 'absolute', top: 280, left: 40}}>
        <Globe
          width={1000}
          height={700}
          center={[-18, 38]}
          scale={1500}
          frame={frame}
          highlight={["Portugal"]}
          routes={[]}
          pins={[
            {at: PLACE.azores, label: 'AZORES', show: p(frame, 4, 8), align: 'left'},
            {at: PLACE.found, label: 'FOUND HERE', show: p(frame, cue.w('drifting') - 4, 8), align: 'right'},
            {at: PLACE.portugal, label: 'PORTUGAL', show: p(frame, cue.w('Portugal') - 4, 8), align: 'left'},
          ]}
        />
      </div>
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, height: 360, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 560, top: 30, transform: `rotate(${Math.sin(frame / 20) * 2}deg)`}}>
          <Ship width={330} color="#0a1018" glow={TEAL} />
        </div>
        <div style={{position: 'absolute', left: lerp(-360, 160, approach), top: 40}}>
          <Ship width={310} color="#26384a" />
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, color: FOG, textAlign: 'center', letterSpacing: 3}}>DEI GRATIA</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6 · Below deck ─────────────────────────
export const BelowDeck: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [items, belongings, lifeboat] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Background tint={lifeboat <= frame ? C.red : TEAL} />
      <Headline at={2} until={lifeboat - 1} size={96} y={150}>
        Damp, but <T>in order</T>
      </Headline>
      {frame < lifeboat ? (
        <>
          <div style={{position: 'absolute', top: 360, left: 60, right: 60, display: 'flex', justifyContent: 'space-around'}}>
            {[
              {label: 'BOOTS', at: cue.w('boots') - 4, icon: <path d="M 30 10 L 60 10 L 60 70 L 100 82 Q 108 98 96 104 L 24 104 Z" fill={FOG} />},
              {label: 'PIPES', at: cue.w('pipes') - 4, icon: <path d="M 10 40 L 70 40 Q 76 40 76 48 L 76 52 L 90 52 L 90 28 Q 90 20 98 20 L 106 20 L 106 70 Q 106 88 88 88 L 76 88 Q 64 88 64 74 L 64 56 L 10 56 Z" fill={FOG} />},
            ].map((x) => (
              <div key={x.label} style={{opacity: p(frame, x.at, 8), textAlign: 'center', background: '#11161c', border: `4px solid ${TEAL}`, borderRadius: 20, padding: '20px 40px'}}>
                <svg width={220} height={200} viewBox="0 0 120 110">
                  {x.icon}
                </svg>
                <div style={{fontFamily: DISPLAY, fontSize: 56, color: C.white}}>{x.label}</div>
              </div>
            ))}
          </div>
          {frame >= belongings ? (
            <Center top={800} style={{opacity: p(frame, belongings, 8)}}>
              <div style={{textAlign: 'center'}}>
                <Photo src={PHOTO('desk.jpg')} width={560} height={420} zoom={lerp(1.1, 1, p(frame, belongings, 40))} focus="50% 50%" credit="Captain Briggs's lap desk · photo CC0" accent={TEAL} />
              </div>
            </Center>
          ) : null}
        </>
      ) : (
        <>
          <Headline at={lifeboat} size={110} y={170}>
            The <R>lifeboat?</R>
          </Headline>
          <Center top={520}>
            <svg width={900} height={500} viewBox="0 0 900 500">
              <rect x={60} y={360} width={780} height={30} fill="#3a2a1c" />
              <path d="M 220 360 L 220 200 Q 220 160 260 160 L 300 160" fill="none" stroke={FOG} strokeWidth={14} />
              <path d="M 680 360 L 680 200 Q 680 160 640 160 L 600 160" fill="none" stroke={FOG} strokeWidth={14} />
              <line x1={300} y1={160} x2={300} y2={240} stroke={FOG} strokeWidth={4} strokeDasharray="10 8" />
              <line x1={600} y1={160} x2={600} y2={240} stroke={FOG} strokeWidth={4} strokeDasharray="10 8" />
              <path d="M 280 250 L 620 250 Q 600 330 540 330 L 360 330 Q 300 330 280 250 Z" fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="18 14" opacity={0.5 + 0.5 * Math.sin(frame / 4)} />
            </svg>
          </Center>
          <Stamp at={cue.w('gone') - 2} y={1080} size={140}>
            Missing
          </Stamp>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Re-hook: why leave? ─────────────────────────
export const RehookLeave: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [n1, n2, why] = [cue.s(1), cue.s(2), cue.s(3)];
  return (
    <AbsoluteFill>
      <Background tint={C.red} />
      {frame < why ? (
        <div style={{position: 'absolute', top: 420, left: 110, display: 'flex', flexDirection: 'column', gap: 26}}>
          <Check label="NO STORM" ok={false} show={p(frame, 2, 6)} />
          <Check label="NO FIGHT" ok={false} show={p(frame, n1, 6)} />
          <Check label="NOTHING STOLEN" ok={false} show={p(frame, n2, 6)} />
        </div>
      ) : (
        <>
          <Headline at={why} size={110} y={170}>
            So <R>why</R> leave?
          </Headline>
          <Center top={480} style={{opacity: p(frame, why, 8)}}>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 70}}>
              <div style={{textAlign: 'center'}}>
                <Ship width={480} color={FOG} />
                <div style={{fontFamily: DISPLAY, fontSize: 52, color: TEAL}}>A SAFE SHIP</div>
              </div>
              <div style={{textAlign: 'center', opacity: p(frame, cue.w('tiny') - 4, 8)}}>
                <Boat width={150} color={FOG} />
                <div style={{fontFamily: DISPLAY, fontSize: 52, color: C.red}}>A TINY BOAT</div>
              </div>
            </div>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · The myth ─────────────────────────
export const Myth: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [myth, doyle, holmes] = [cue.s(1), cue.s(2), cue.w('Sherlock')];
  return (
    <AbsoluteFill>
      <Background tint={TEAL} />
      <Headline at={2} until={doyle - 1} size={100} y={170}>
        “The tea was <T>still warm</T>”
      </Headline>
      {frame < doyle ? (
        <>
          <Center top={500}>
            <svg width={520} height={460} viewBox="0 0 260 230">
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${90 + i * 30} 70 Q ${80 + i * 30} ${50 - ((frame + i * 10) % 30)} ${95 + i * 30} ${20 - ((frame + i * 10) % 30)}`} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
              ))}
              <path d="M 50 90 L 210 90 Q 200 190 130 190 Q 60 190 50 90 Z" fill={C.white} />
              <path d="M 205 110 Q 250 110 240 140 Q 232 162 196 158" fill="none" stroke={C.white} strokeWidth={12} />
              <ellipse cx={130} cy={210} rx={110} ry={14} fill={C.white} opacity={0.8} />
            </svg>
          </Center>
          <Stamp at={myth} y={760} size={170}>
            Myth
          </Stamp>
        </>
      ) : (
        <>
          <Headline at={doyle} size={92} y={170}>
            It came from <T>a short story</T>
          </Headline>
          <Center top={440}>
            <Paper width={860} rotate={-2} style={{padding: '44px 46px', textAlign: 'center'}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, opacity: 0.6}}>FICTION · 1884</div>
              <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 64, lineHeight: 1.15, marginTop: 16}}>“J. Habakuk Jephson's Statement”</div>
              <div style={{fontFamily: DISPLAY, fontSize: 70, marginTop: 20}}>ARTHUR CONAN DOYLE</div>
            </Paper>
          </Center>
          <Center top={1060} style={{opacity: p(frame, holmes - 4, 8)}}>
            <Tag color={TEAL} style={{fontSize: 44}}>Before Sherlock Holmes</Tag>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · The clues ─────────────────────────
export const Clues: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [hatch, barrels, key] = [cue.s(1), cue.s(2), cue.s(3)];
  const empty = new Set([3, 11, 17, 24, 30, 38, 41, 52, 57]);
  return (
    <AbsoluteFill>
      <Background tint={frame >= barrels ? C.red : TEAL} />
      <Headline at={2} until={barrels - 1} size={100} y={170}>
        The <T>real</T> clues
      </Headline>
      {frame < barrels ? (
        <Center top={480} style={{opacity: p(frame, hatch - 4, 8)}}>
          <svg width={760} height={560} viewBox="0 0 380 280">
            <rect x={40} y={150} width={300} height={110} fill="#05080d" stroke="#3a2a1c" strokeWidth={10} />
            <g transform={`rotate(${-70 * p(frame, hatch, 14, inOut)}, 40, 150)`}>
              <rect x={40} y={136} width={300} height={22} fill="#7a5230" stroke="#3d2814" strokeWidth={4} />
            </g>
            <text x={190} y={215} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={22} fill={TEAL} letterSpacing={4}>
              HATCH: OPEN
            </text>
          </svg>
        </Center>
      ) : (
        <>
          <Headline at={barrels} until={key - 1} size={96} y={170}>
            <R>9 barrels</R> were empty
          </Headline>
          <div style={{position: 'absolute', top: 360, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center'}}>
            {Array.from({length: 60}, (_, i) => (
              <div key={i} style={{opacity: p(frame, barrels + 2 + (i % 10), 4), transform: empty.has(i) && frame >= cue.w('empty') ? `scale(${1 + 0.08 * Math.sin(frame / 3)})` : undefined}}>
                <Barrel size={78} empty={empty.has(i) && frame >= cue.w('empty') - 2} />
              </div>
            ))}
          </div>
          {frame >= key ? (
            <Center top={1110} style={{opacity: p(frame, key, 8)}}>
              <Big size={110} color={TEAL}>
                The key?
              </Big>
            </Center>
          ) : null}
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · The theory ─────────────────────────
export const Theory: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [fear] = [cue.s(1)];
  const fumes = p(frame, cue.w('fumes') - 4, 60);
  const shake = frame >= cue.w('explode') - 2 ? (rnd(frame) - 0.5) * 10 : 0;
  return (
    <AbsoluteFill>
      <Background tint={frame >= fear ? C.red : TEAL} />
      <Headline at={2} until={fear - 1} size={100} y={150}>
        One <T>theory</T>: the fumes
      </Headline>
      <Headline at={fear} size={100} y={150}>
        “It's going to <R>explode</R>”
      </Headline>
      <Center top={400} style={{transform: `translate(${shake}px, ${-shake}px)`}}>
        <svg width={1000} height={760} viewBox="0 0 1000 760">
          <path d="M 40 300 L 960 300 Q 930 560 780 620 L 220 620 Q 70 560 40 300 Z" fill="#0b1119" stroke={FOG} strokeWidth={6} />
          <line x1={40} y1={300} x2={960} y2={300} stroke={FOG} strokeWidth={10} />
          {Array.from({length: 12}, (_, i) => (
            <g key={i} transform={`translate(${200 + (i % 6) * 100}, ${420 + Math.floor(i / 6) * 90})`}>
              <Barrel size={60} />
            </g>
          ))}
          {Array.from({length: 14}, (_, i) => {
            const t = ((frame * 0.8 + i * 23) % 120) / 120;
            const x = 220 + rnd(i) * 560 + Math.sin(frame / 10 + i) * 20;
            const y = 560 - t * 300 * fumes;
            return <circle key={`g${i}`} cx={x} cy={y} r={20 + t * 40} fill="#8be36a" opacity={fumes * 0.25 * (1 - t)} />;
          })}
          <g opacity={p(frame, cue.w('Briggs') - 4, 8)}>
            <Figure x={700} y={300} h={170} color={FOG} />
            <text x={760} y={150} fontFamily={DISPLAY} fontSize={90} fill={C.red} opacity={frame >= cue.w('smelled') ? 1 : 0}>
              !
            </text>
          </g>
        </svg>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 11 · The rope ─────────────────────────
export const Rope: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const out = p(frame, cue.w('lifeboat') - 4, 40, inOut);
  const bob = Math.sin(frame / 14) * 8;
  return (
    <AbsoluteFill>
      <Sea y={1060} fog={0.6} />
      <Headline at={2} size={96} y={170}>
        Into the <T>lifeboat</T>, tied by a <T>rope</T>
      </Headline>
      <div style={{position: 'absolute', left: 430, top: 620, transform: `translateY(${bob}px)`}}>
        <Ship width={560} color="#0a1018" />
      </div>
      <svg width={W} height={600} style={{position: 'absolute', top: 820}}>
        <path d={`M 470 ${200 + bob} Q ${lerp(440, 260, out)} ${330 + bob} ${lerp(420, 150, out)} ${290 - bob}`} fill="none" stroke={FOG} strokeWidth={5} opacity={p(frame, cue.w('rope') - 4, 6)} />
      </svg>
      <div style={{position: 'absolute', left: lerp(380, 40, out), top: 1050 - bob}}>
        <Boat width={200} color="#0a1018" people={5} />
      </div>
      <Center top={1300} style={{opacity: p(frame, cue.w('waited') - 4, 8)}}>
        <Tag color={TEAL}>…and they waited</Tag>
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12 · The experiment ─────────────────────────
export const Experiment: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [boom, scorch, like] = [cue.s(1), cue.w('scorch'), cue.s(2)];
  const flash = frame >= boom + 4 && frame < boom + 16 ? 1 - (frame - boom - 4) / 12 : 0;
  return (
    <AbsoluteFill>
      <Background tint={TEAL} />
      <Headline at={2} until={boom - 1} size={100} y={170}>
        <T>2006</T>: a lab test
      </Headline>
      <Headline at={boom} until={like - 1} size={96} y={170}>
        A flash of <R>flame</R>
      </Headline>
      <Headline at={like} size={96} y={170}>
        Just like the <T>empty ship</T>
      </Headline>
      <Center top={460}>
        <svg width={700} height={620} viewBox="0 0 350 310">
          <rect x={30} y={60} width={290} height={230} rx={12} fill="#0b1119" stroke={FOG} strokeWidth={6} />
          <path d="M 150 120 L 150 170 L 110 250 Q 104 268 124 268 L 226 268 Q 246 268 240 250 L 200 170 L 200 120 Z" fill="none" stroke={C.white} strokeWidth={6} />
          <path d="M 120 240 L 230 240 L 238 256 Q 240 264 228 264 L 122 264 Q 110 264 112 256 Z" fill="#8be36a" opacity={0.6} />
          {frame >= boom + 4 ? (
            <g opacity={Math.max(0, 1 - (frame - boom - 4) / 30)}>
              <ellipse cx={175} cy={180} rx={140 * Math.min(1, (frame - boom - 4) / 6)} ry={110 * Math.min(1, (frame - boom - 4) / 6)} fill="#ffb347" opacity={0.75} />
              <ellipse cx={175} cy={180} rx={70 * Math.min(1, (frame - boom - 4) / 6)} ry={60 * Math.min(1, (frame - boom - 4) / 6)} fill="#fff3c4" />
            </g>
          ) : null}
        </svg>
      </Center>
      <AbsoluteFill style={{background: '#ffb347', opacity: flash * 0.55}} />
      <Stamp at={scorch} y={1150} size={110} color={TEAL} rotate={-5}>
        No scorch marks
      </Stamp>
    </AbsoluteFill>
  );
};

// ───────────────────────── 13 · The rope snaps ─────────────────────────
export const Adrift: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const snap = cue.w('snapped');
  const [alone] = [cue.s(1)];
  const away = p(frame, snap + 4, 120, inOut);
  const zoomOut = interpolate(frame, [alone, cue.dur], [1, 0.55], {...clamp, easing: inOut});
  const bob = Math.sin(frame / 14) * 8;
  return (
    <AbsoluteFill>
      <Sea y={1060} fog={0.7} dark={p(frame, alone, 40)} storm={0.3} />
      <Headline at={2} until={alone - 1} size={100} y={170}>
        If the rope <R>snapped</R>…
      </Headline>
      <Headline at={alone} size={110} y={170}>
        <R>10 people.</R> Alone.
      </Headline>
      <AbsoluteFill style={{transform: `scale(${zoomOut})`, transformOrigin: '30% 70%'}}>
        <div style={{position: 'absolute', left: lerp(430, 1100, away), top: 620 + bob}}>
          <Ship width={560} color="#0a1018" />
        </div>
        <svg width={W * 2} height={600} style={{position: 'absolute', top: 820}}>
          {frame < snap ? (
            <path d={`M 470 ${200 + bob} Q 260 ${330 + bob} 150 ${290 - bob}`} fill="none" stroke={FOG} strokeWidth={5} />
          ) : (
            <>
              <path d={`M ${470 + away * 670} ${200 + bob} q -40 ${60 + away * 40} -90 ${80 + away * 30}`} fill="none" stroke={FOG} strokeWidth={5} opacity={1 - away} />
              <path d={`M 150 ${290 - bob} q 40 30 90 20`} fill="none" stroke={FOG} strokeWidth={5} />
            </>
          )}
        </svg>
        <div style={{position: 'absolute', left: 40, top: 1050 - bob}}>
          <Boat width={200} color="#0a1018" people={5} />
        </div>
      </AbsoluteFill>
      {frame >= snap && frame < snap + 4 ? <AbsoluteFill style={{background: '#fff', opacity: 0.4}} /> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── 14 · The ship's fate ─────────────────────────
export const Fate: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [reef] = [cue.s(1)];
  const crash = cue.w('reef');
  const shake = frame >= crash && frame < crash + 12 ? (rnd(frame) - 0.5) * 20 : 0;
  return (
    <AbsoluteFill>
      <Background tint={frame >= reef ? C.red : TEAL} />
      <Headline at={2} until={reef - 1} size={110} y={170}>
        And the <T>ship?</T>
      </Headline>
      {frame < reef ? (
        <Center top={440} style={{opacity: p(frame, 4, 8)}}>
          <Photo src={PHOTO('ship.jpg')} width={960} height={680} zoom={lerp(1.05, 1.15, p(frame, 0, cue.dur))} focus="50% 50%" credit="Painting of the ship as “Amazon”, 1861 · public domain" accent={TEAL} />
        </Center>
      ) : (
        <>
          <Headline at={reef} size={96} y={170}>
            <T>1885</T> · Haiti
          </Headline>
          <div style={{position: 'absolute', top: 290, left: 40, transform: `translate(${shake}px, ${-shake}px)`}}>
            <Globe width={1000} height={680} center={[-72.5, 19.5]} scale={2600} frame={frame} highlight={["Haiti"]} routes={[]} pins={[{at: PLACE.haiti, label: 'THE REEF', show: p(frame, crash - 6, 8), align: 'left'}]} />
          </div>
          <Stamp at={cue.w('insurance') - 4} y={1120} size={120}>
            Insurance fraud
          </Stamp>
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── 15 · CTA ─────────────────────────
export const CallToAction: React.FC<SceneProps> = ({cue}) => {
  const frame = useCurrentFrame();
  const [kemper, both, tap] = [cue.s(1), cue.s(2), cue.s(3)];
  const pulse = 1 + 0.04 * Math.sin(frame / 4);
  const card = (src: string, title: string, at: number, active: boolean) => {
    const s = slam(frame, at, 1.4);
    return (
      <div style={{width: 470, opacity: frame >= at ? s.opacity : 0, transform: `scale(${(frame >= at ? s.scale : 1) * (active ? pulse : 1)})`}}>
        <div style={{position: 'relative', borderRadius: 24, overflow: 'hidden', border: `6px solid ${active ? TEAL : C.line}`, boxShadow: active ? `0 0 60px ${TEAL}88` : 'none'}}>
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
      <Background tint={TEAL} />
      <Headline at={2} size={120} y={130} color={TEAL}>
        Watch next
      </Headline>
      <div style={{position: 'absolute', top: 330, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
        {card('celeste/cta/dbcooper.jpg', 'THE MAN WHO VANISHED FROM A PLANE', 6, frame < kemper)}
        {card('celeste/cta/kemper.jpg', 'THE KILLER WHO CALLED THE COPS', kemper, frame >= kemper && frame < both)}
      </div>
      {frame >= both ? (
        <Center top={1090} style={{opacity: p(frame, both, 8)}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.dim, letterSpacing: 5}}>BOTH ON THIS CHANNEL</div>
            <div style={{fontFamily: DISPLAY, fontSize: 96, color: C.white, letterSpacing: 3, marginTop: 6}}>CHRONOS GALAXY</div>
          </div>
        </Center>
      ) : null}
      {frame >= tap ? (
        <Center top={1250} style={{transform: `scale(${pulse})`}}>
          <div style={{fontFamily: DISPLAY, fontSize: 70, color: '#07090c', background: TEAL, padding: '14px 40px', borderRadius: 18, letterSpacing: 2}}>TAP · FOLLOW · WATCH NEXT</div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};
